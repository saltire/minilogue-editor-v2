import { ReactNode } from 'react';
import ReactModal from 'react-modal';

import './Modal.css';
import CloseIcon from '../assets/close.svg';


type ModalProps = {
  onClose: () => void,
  children: ReactNode,
};

export default function Modal({ onClose, children }: ModalProps) {
  return (
    <ReactModal
      // className='modal-content'
      // portalClassName='modal-portal'
      // overlayClassName='modal-overlay'
      isOpen
      // shouldCloseOnOverlayClick={false}
      onRequestClose={onClose}
    >
      <button
        type='button'
        className='modal-close'
        title='Close'
        aria-label='Close'
        onClick={onClose}
      >
        <CloseIcon />
      </button>

      <div className='modal-body'>
        {children}
      </div>
    </ReactModal>
  );
}
