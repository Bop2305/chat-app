import React from "react";
import Button from "./Button";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  title,
  children,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-lg font-bold mb-4">{title}</h2>
        <div className="mb-4">{children}</div>
        <div className="flex justify-between">
          <Button label="Close" onClick={onClose} />
          <Button label="Submit" onClick={onSubmit} />
        </div>
      </div>
    </div>
  );
};

export default Modal;
