import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ 
  trigger, 
  children, 
  align = 'right',
  className 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <div className={cn("relative inline-block text-left", className)} ref={containerRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className={cn(
              "absolute z-50 mt-2 min-w-[200px] bg-white rounded-2xl shadow-premium border border-gray-100 py-2",
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            <div className="flex flex-col" onClick={() => setIsOpen(false)}>
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'default' | 'danger' | 'warning';
  icon?: React.ElementType;
}

export const DropdownItem: React.FC<DropdownItemProps> = ({ 
  children, 
  onClick, 
  variant = 'default',
  icon: Icon
}) => {
  const variants = {
    default: "text-gray-700 hover:bg-gray-50 hover:text-brand-600",
    danger: "text-red-600 hover:bg-red-50 hover:text-red-700",
    warning: "text-amber-600 hover:bg-amber-50 hover:text-amber-700",
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 px-4 py-2.5 text-sm font-medium transition-all text-left",
        variants[variant]
      )}
    >
      {Icon && <Icon size={16} />}
      {children}
    </button>
  );
};

export default Dropdown;
