import zip from 'jszip';

import { decodeProgram } from './program';
import { Library } from './types';


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
    throw new Error('Invalid library metadata');
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

/* eslint-disable import/prefer-default-export */
export const loadLibrarianFile = async (file: File): Promise<Library> => {
  const archive = await zip.loadAsync(file);

  const infoFile = archive.file('FileInformation.xml');
  if (!infoFile) {
    throw new Error('Invalid library!');
  }

  const info = await infoFile.async('string');
  const infoFileDOM = parseInfoFile(info);
  const programFileNames = parseProgramBinFilenames(infoFileDOM);
  const programPromises = Promise.all(programFileNames.map(filename => {
    const binFile = archive.file(filename);
    if (!binFile) {
      throw new Error('Invalid library archive!');
    }
    return binFile.async('uint8array');
  }));

  let libraryMetadataPromise;
  const libraryMetaFilename = parsePresetFilename(infoFileDOM);
  if (libraryMetaFilename) {
    const libraryMetaFile = archive.file(libraryMetaFilename);
    if (libraryMetaFile === null) {
      throw new Error('Invalid library archive!');
    }
    libraryMetadataPromise = libraryMetaFile.async('string');
  }

  const [metadataFile, programFiles] = await Promise.all([libraryMetadataPromise, programPromises]);

  return {
    ...metadataFile ? parsePresetFile(metadataFile) : {},
    programs: programFiles.map(decodeProgram),
  };
};
