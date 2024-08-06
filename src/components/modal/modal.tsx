import React from 'react';
import Modal from '@mui/material/Modal';
import Image from 'next/image';
import CloseIcon from '@mui/icons-material/Close';
import verifiedImage from '../../assets/images/verified.svg';

import './modal.css';

interface ModalProps {
  isVisible: boolean;
  modalTitle: string;
  modalMessage?: string;
  showButtons?: boolean;
  primaryButtonText?: string;
  secondaryButtonText?: string;
  primaryButtonColor?: string;
  secondaryButtonColor?: string;
  handlePrimaryButton?: () => void;
  handleSecondaryButton?: () => void;
  handleCancelButton?: () => void;
  success?: boolean;
  icon?: any;
  modalContent?: any;
  successMessage?:string;
}

const CustomModal: React.FC<ModalProps> = ({
  isVisible,
  modalTitle,
  modalMessage,
  showButtons = true,
  primaryButtonText,
  secondaryButtonText,
  primaryButtonColor,
  secondaryButtonColor,
  handlePrimaryButton,
  handleSecondaryButton,
  handleCancelButton,
  success,
  icon,
  modalContent,
  successMessage
}) => {

  return (
    <Modal
      open={isVisible}
      onClose={handleCancelButton}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className="custom-modal" >
        <CloseIcon className="close-button" onClick={handleCancelButton} />
        {success ?
        <>
          <div className='successContent'>
            <Image
              src={verifiedImage}
              alt="Verified Image"
              width={100}
              height={100}
              className="verifiedImage"
            />
          </div>
          {successMessage && <p className='successMessage'>{successMessage}</p>}
          </>
          :
          <>
            <div>
              <div className="flex justify-center flex-col heading p-2">
                {icon && icon()}
                <h2 className='title'>{modalTitle}</h2>
              </div>
              <div className='content'>
              {modalMessage && <p> {modalMessage} </p>}
              {modalContent && modalContent()}
              </div>
            </div>
            {showButtons &&
              <div className="button-container flex flex-row">
                <button
                  onClick={handlePrimaryButton}
                  style={{
                    backgroundColor: primaryButtonColor,
                    color: '#fff',
                    width: '100%',
                    borderBottomLeftRadius: 10,
                    padding: '8px 10px',
                  }}
                >
                  {primaryButtonText}
                </button>
                <button
                  onClick={handleSecondaryButton}
                  style={{
                    backgroundColor: secondaryButtonColor,
                    width: '100%',
                    borderBottomRightRadius: 10,
                    padding: '8px 10px',
                    color: '#0f4a8a',
                    borderTopWidth: '1px',
                    borderTopColor: '#0f4a8a',
                  }}
                >
                  {secondaryButtonText}
                </button>
              </div>
            }
          </>}
      </div>
    </Modal>
  );
};

export default CustomModal;
