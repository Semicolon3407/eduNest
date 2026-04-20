import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertCircle } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'danger',
  isLoading = false
}) => {
  const variantStyles = {
    danger: {
      icon: "bg-red-50 text-red-600",
      button: "bg-red-600 hover:bg-red-700 text-white shadow-red-200"
    },
    warning: {
      icon: "bg-amber-50 text-amber-600",
      button: "bg-amber-600 hover:bg-amber-700 text-white shadow-amber-200"
    },
    info: {
      icon: "bg-brand-50 text-brand-600",
      button: "bg-brand-600 hover:bg-brand-700 text-white shadow-brand-200"
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      maxWidth="lg"
      className="rounded-[24px] sm:rounded-[32px]"
    >
      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
        <div className={cn(
          "w-16 h-16 rounded-2xl flex-shrink-0 flex items-center justify-center",
          variantStyles[variant].icon
        )}>
          <AlertCircle size={32} />
        </div>
        
        <div className="flex-1 text-center sm:text-left">
          <p className="text-gray-600 font-medium mb-8 leading-relaxed">
            {message}
          </p>

          <div className="flex flex-col sm:flex-row justify-end gap-3 w-full">
            <Button
              variant="outline"
              className="px-6 rounded-xl h-12 order-2 sm:order-1"
              onClick={onClose}
              disabled={isLoading}
            >
              {cancelText}
            </Button>
            <Button
              className={cn(
                "px-8 rounded-xl h-12 shadow-lg order-1 sm:order-2",
                variantStyles[variant].button
              )}
              onClick={onConfirm}
              isLoading={isLoading}
            >
              {confirmText}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ConfirmModal;
