import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl';
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  onClose, 
  title, 
  description, 
  children, 
  maxWidth = 'lg' 
}) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '4xl': 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto outline-none focus:outline-none">
      <div 
        className="fixed inset-0 bg-brand-500/40 backdrop-blur-sm animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      <div className={cn(
        "bg-white w-full rounded-[32px] sm:rounded-[48px] shadow-2xl relative z-10 animate-in zoom-in-95 fade-in duration-300 border border-white",
        maxWidthClasses[maxWidth]
      )}>
        <div className="p-8 sm:p-10">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-display font-medium text-gray-900 leading-none">{title}</h2>
              {description && <p className="text-sm text-gray-500 mt-2 font-medium">{description}</p>}
            </div>
            <button 
              onClick={onClose}
              className="p-2 text-gray-400 hover:bg-slate-100 rounded-xl transition-all"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="custom-scrollbar max-h-[70vh] overflow-y-auto overflow-x-hidden pr-2">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
