import JSZip from 'jszip';

import { decodeProgram, encodeProgram } from './program';
import { Library, Program } from './types';
import { range } from '../utils';


const parseInfoFile = (infoFileContents: string) => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(infoFileContents, 'text/xml');

  const libraryData = dom.firstElementChild;
  if (libraryData?.tagName !== 'KorgMSLibrarian_Data') {
    throw new Error('Invalid root tag in library!');
  }
  const product = libraryData.getElementsByTagName('Product');
  if (product.length !== 1 || product[0].textContent !== 'minilogue') {
    throw new Error('Not a minilogue library!');
  }

  return libraryData;
};

const parseProgramBinFilenames = (libraryData: Element) => {
  const contentsTags = libraryData.getElementsByTagName('Contents');
  if (contentsTags.length !== 1) {
    throw new Error('Invalid library metadata!');
  }
  const contents = contentsTags[0];

  const numProgramsData = contents.getAttribute('NumProgramData');
  if (!numProgramsData) {
    throw new Error('Invalid library metadata!');
  }
  const numPrograms = parseInt(numProgramsData);

  const programs = contents.getElementsByTagName('ProgramData');
  if (programs.length !== numPrograms) {
    throw new Error('Invalid library metadata!');
  }

  const filenames = [];

  for (let i = 0; i < numPrograms; i += 1) {
    const program = programs[i];
    const binaryTags = program.getElementsByTagName('ProgramBinary');
    if (binaryTags.length !== 1) {
      throw new Error('Invalid library metadata!');
    }
    const binary = binaryTags[0];
    if (binary.textContent) {
      filenames.push(binary.textContent);
    }
  }

  return filenames;
};

const parsePresetFilename = (libraryData: Element) => {
  const contentsTags = libraryData.getElementsByTagName('Contents');
  if (contentsTags.length !== 1) {
    throw new Error('Invalid library metadata!');
  }
  const contents = contentsTags[0];

  const presetInfoTags = contents.getElementsByTagName('PresetInformation');
  if (presetInfoTags.length > 1) {
    throw new Error('Invalid library metadata!');
  }

  if (presetInfoTags.length) {
    const presetInfo = presetInfoTags[0];
    const fileInfo = presetInfo.getElementsByTagName('File');
    if (fileInfo.length > 1) {
      throw new Error('Invalid library metadata!');
    }
    if (fileInfo.length) {
      return fileInfo[0].textContent;
    }
  }

  return null;
};

const parsePresetFile = (presetFileContents: string): Omit<Library, 'programs'> => {
  const parser = new DOMParser();
  const dom = parser.parseFromString(presetFileContents, 'text/xml');
  const presetData = dom.firstElementChild;
  if (presetData?.tagName !== 'minilogue_Preset') {
    throw new Error('Invalid root tag in preset info!');
  }

  const getSingleTag = (tagName: string) => {
    const tag = presetData.getElementsByTagName(tagName);
    return tag.length ? tag[0].textContent : null;
  };

  return {
    name: getSingleTag('Name'),
    author: getSingleTag('Author'),
    version: getSingleTag('Version'),
    date: getSingleTag('Date'),
    prefix: getSingleTag('Prefix'),
    copyright: getSingleTag('Copyright'),
  };
};

export const loadLibraryFile = async (file: File): Promise<Library> => {
  const archive = await JSZip.loadAsync(file);

  const infoFile = archive.file('FileInformation.xml');
  if (!infoFile) {
    throw new Error('Invalid library archive: could not find FileInformation.xml.');
  }
  const info = await infoFile.async('string');
  const infoFileDOM = parseInfoFile(info);

  const programFileNames = parseProgramBinFilenames(infoFileDOM);
  const programPromises = Promise.all(programFileNames.map(filename => {
    const binFile = archive.file(filename);
    if (!binFile) {
      throw new Error(`Invalid library archive: could not find program file ${filename}.`);
    }
    return binFile.async('uint8array');
  }));

  let metadataPromise;
  const metadataFilename = parsePresetFilename(infoFileDOM);
  if (metadataFilename) {
    const metadataFile = archive.file(metadataFilename);
    if (metadataFile === null) {
      throw new Error(`Invalid library archive: could not find metadata file ${metadataFilename}.`);
    }
    metadataPromise = metadataFile.async('string');
  }

  const [metadataFile, programFiles] = await Promise.all([metadataPromise, programPromises]);

  return {
    ...metadataFile ? parsePresetFile(metadataFile) : {},
    programs: programFiles.map(decodeProgram),
  };
};

const serialize = (document: XMLDocument) => {
  const xmlDeclaration = '<?xml version="1.0" encoding="UTF-8"?>';
  const serialized = new XMLSerializer().serializeToString(document);
  return `${xmlDeclaration}\n\n${serialized}`;
};

const createFileInformation = (programs: Program[], presetData?: Library, favorites?: number[]) => {
  const doc = document.implementation.createDocument('', null);
  const root = doc.createElement('KorgMSLibrarian_Data');

  const productNode = doc.createElement('Product');
  const productText = doc.createTextNode('minilogue');
  productNode.appendChild(productText);
  root.appendChild(productNode);

  const contentsNode = doc.createElement('Contents');
  contentsNode.setAttribute('NumFavoriteData', `${favorites ? 1 : 0}`);
  contentsNode.setAttribute('NumProgramData', `${programs.length}`);
  contentsNode.setAttribute('NumPresetInformation', `${presetData ? 1 : 0}`);

  if (presetData) {
    const presetNode = doc.createElement('PresetInformation');
    const presetFileNode = doc.createElement('File');
    const presetFileNameNode = doc.createTextNode('PresetInformation.xml');
    presetFileNode.appendChild(presetFileNameNode);
    presetNode.appendChild(presetFileNode);
    contentsNode.appendChild(presetNode);
  }

  if (favorites) {
    const favoriteNode = doc.createElement('FavoriteData');
    const favoriteFileNode = doc.createElement('File');
    const favoriteFileNameNode = doc.createTextNode('FavoriteData.fav_data');
    favoriteFileNode.appendChild(favoriteFileNameNode);
    favoriteNode.appendChild(favoriteFileNode);
    contentsNode.appendChild(favoriteNode);
  }

  programs.forEach((program, i) => {
    const number = (`000${i}`).slice(-3);
    const programDataNode = doc.createElement('ProgramData');
    const infoNode = doc.createElement('Information');
    const infoText = doc.createTextNode(`Prog_${number}.prog_info`);
    infoNode.appendChild(infoText);
    programDataNode.appendChild(infoNode);
    const binaryNode = doc.createElement('ProgramBinary');
    const binaryText = doc.createTextNode(`Prog_${number}.prog_bin`);
    binaryNode.appendChild(binaryText);
    programDataNode.appendChild(binaryNode);
    contentsNode.appendChild(programDataNode);
  });

  root.appendChild(contentsNode);
  doc.appendChild(root);
  return serialize(doc);
};

const createPresetInformation = (library: Library) => {
  const doc = document.implementation.createDocument('', null);
  const root = doc.createElement('minilogue_Preset');

  const createAndAppend = (nodeType: string, text?: string | null) => {
    const child = doc.createElement(nodeType);
    const textElement = doc.createTextNode(text ?? '');
    child.appendChild(textElement);
    root.appendChild(child);
  };

  createAndAppend('DataId', library.name);
  createAndAppend('Name', library.name);
  createAndAppend('Author', library.author);
  createAndAppend('Version', library.version);
  createAndAppend('NumOfProg', `${library.programs.length}`);
  createAndAppend('Date', library.date);
  createAndAppend('Prefix');
  createAndAppend('Copyright', library.author);

  doc.appendChild(root);
  return serialize(doc);
};

const createProgramInformation = () => {
  const doc = document.implementation.createDocument('', null);
  const root = doc.createElement('minilogue_ProgramInformation');

  const createAndAppend = (nodeType: string, text?: string) => {
    const child = doc.createElement(nodeType);
    const textElement = doc.createTextNode(text ?? '');
    child.appendChild(textElement);
    root.appendChild(child);
  };

  createAndAppend('Programmer');
  createAndAppend('Comment');

  doc.appendChild(root);
  return serialize(doc);
};

const createFavoriteData = (favorites: number[]) => {
  const doc = document.implementation.createDocument('', null);
  const favoriteNode = doc.createElement('minilogue_Favorite');
  const bankNode = doc.createElement('Bank');

  favorites.forEach(value => {
    const child = doc.createElement('Data');
    const textElement = doc.createTextNode(`${value}`);
    child.appendChild(textElement);
    bankNode.appendChild(child);
  });

  favoriteNode.appendChild(bankNode);
  doc.appendChild(favoriteNode);
  return serialize(doc);
};

// Create a library zip archive from a library object.
export const createLibraryFile = (library: Library) => {
  const zip = new JSZip();

  // Generate favorites if not given.
  const favorites = library.favorites ?? range(8);
  zip.file('FileInformation.xml', createFileInformation(library.programs, undefined, favorites));
  zip.file('FavoriteData.fav_data', createFavoriteData(favorites));
  library.programs.forEach((program, index) => {
    const number = (`000${index}`).slice(-3);
    zip.file(`Prog_${number}.prog_bin`, encodeProgram(program));
    zip.file(`Prog_${number}.prog_info`, createProgramInformation());
  });

  return zip.generateAsync({ type: 'blob' });
};

// Create a preset zip archive from a library object.
export const createPresetFile = (library: Library) => {
  const zip = new JSZip();

  zip.file('FileInformation.xml', createFileInformation(library.programs, library));
  zip.file('PresetInformation.xml', createPresetInformation(library));
  library.programs.forEach((program, index) => {
    const number = (`000${index}`).slice(-3);
    zip.file(`Prog_${number}.prog_bin`, encodeProgram(program));
    zip.file(`Prog_${number}.prog_info`, createProgramInformation());
  });

  return zip.generateAsync({ type: 'blob' });
};

// Create a program zip archive from a program object.
export const createProgramFile = (program: Program) => {
  const zip = new JSZip();

  zip.file('FileInformation.xml', createFileInformation([program]));
  zip.file('Prog_000.prog_bin', encodeProgram(program));
  zip.file('Prog_000.prog_info', createProgramInformation());

  return zip.generateAsync({ type: 'blob' });
};
