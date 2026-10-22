import { useEffect } from "react";
import type { ReactNode } from "react";
import { X } from "lucide-react";

import { cn } from "../../utils/utils";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "default" | "md" | "lg" | "xl" | "2xl";
  className?: string;
}

const sizeClasses: Record<string, string> = {
  sm: "max-w-md",
  default: "max-w-lg",
  md: "max-w-3xl",
  lg: "max-w-4xl",
  xl: "max-w-5xl",
  "2xl": "max-w-6xl",
};

export function Modal({ isOpen, onClose, title, children, size = "default", className }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-ink/30 backdrop-blur-sm" 
        onClick={onClose}
      />
      <div className={cn("relative bg-white rounded-2xl w-full shadow-[0_20px_60px_rgba(8,18,22,0.15)] flex flex-col max-h-[90vh]", sizeClasses[size] || sizeClasses.default, className)}>
        <div className="flex items-center justify-between p-5 border-b border-line">
          <h2 className="text-[18px] font-black text-ink">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-[#fcfdfa] text-[#8a949d] hover:text-ink transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
}
