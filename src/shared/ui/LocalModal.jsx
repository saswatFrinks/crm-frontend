import PropTypes from 'prop-types';
import { useRef } from 'react';
import clsx from 'clsx';
import useClickOutSide from '../hooks/useClickOutside';

const LocalModal = (props) => {
  const { isOpen, onClose, children, className } = props;

  const modalRef = useRef(null);

  useClickOutSide(modalRef, onClose);

  if (!isOpen) return null;

  return (
    <div
      className="fixed left-0 top-0 z-10 h-screen w-screen bg-gray-500 bg-opacity-75 transition-opacity rounded-lg"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={`relative top-[50%] mx-auto translate-y-[-50%] transform rounded-lg bg-white text-left shadow-xl transition-all ${clsx(
          className
        )} ${props.isHalf ? 'w-1/2' : 'w-full'}`}
      >
        <div className="bg-white p-[24px] rounded-lg" ref={modalRef}>
          {children}
        </div>
      </div>
    </div>
  );
};

LocalModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func,
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default LocalModal;
