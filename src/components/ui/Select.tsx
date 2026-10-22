import { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, Check, X } from "lucide-react";
import { cn } from "../../utils/utils";

export interface SelectOption {
  value: string;
  label: string;
  sublabel?: string;
  disabled?: boolean;
}

export interface SelectProps {
  options: Array<SelectOption | string>;
  value?: string;
  onChange: (value: string) => void;
  placeholder?: string;
  searchable?: boolean;
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  buttonClassName?: string;
  menuClassName?: string;
  id?: string;
  name?: string;
}

export function Select({
  options,
  value,
  onChange,
  placeholder = "Select an option...",
  searchable = true,
  label,
  disabled = false,
  required = false,
  error,
  className,
  buttonClassName,
  menuClassName,
  id,
  name,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const normalizedOptions: SelectOption[] = useMemo(() => {
    return options.map((opt) => {
      if (typeof opt === "string") {
        return { value: opt, label: opt };
      }
      return opt;
    });
  }, [options]);

  const selectedOption = useMemo(() => {
    if (value === undefined || value === null) return undefined;
    return normalizedOptions.find((opt) => String(opt.value) === String(value));
  }, [normalizedOptions, value]);

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) return normalizedOptions;
    const query = searchQuery.toLowerCase().trim();
    return normalizedOptions.filter(
      (opt) =>
        opt.label.toLowerCase().includes(query) ||
        (opt.sublabel && opt.sublabel.toLowerCase().includes(query)) ||
        opt.value.toLowerCase().includes(query)
    );
  }, [normalizedOptions, searchQuery]);

  // Handle outside clicks
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen && searchable && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    }
  }, [isOpen, searchable]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleSelect = (val: string, isDisabled?: boolean) => {
    if (isDisabled || disabled) return;
    onChange(val);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className={cn("relative w-full text-left", className)} ref={containerRef}>
      {label && (
        <label
          htmlFor={id}
          className="block text-[12px] font-bold text-[#8a949d] mb-1 select-none"
        >
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      {/* Hidden input for form data / accessibility */}
      {name && (
        <input
          type="hidden"
          name={name}
          id={id}
          value={value ?? ""}
          required={required}
        />
      )}

      {/* Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => {
          if (!disabled) setIsOpen((prev) => !prev);
        }}
        className={cn(
          "w-full flex items-center justify-between gap-2 border border-line rounded-lg px-3 py-2 text-sm bg-white font-medium text-ink transition-all cursor-pointer text-left focus:outline-none",
          isOpen && "border-brand-green ring-2 ring-brand-green/20",
          disabled && "opacity-50 cursor-not-allowed bg-[#f8faf9]",
          error && "border-red-400 focus:border-red-500 ring-red-100",
          buttonClassName
        )}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
      >
        <span className="truncate flex-1">
          {selectedOption ? (
            <span className="font-semibold text-ink">
              {selectedOption.label}
              {selectedOption.sublabel && (
                <span className="ml-1.5 text-xs font-normal text-[#8a949d]">
                  ({selectedOption.sublabel})
                </span>
              )}
            </span>
          ) : (
            <span className="text-[#8a949d] font-normal">{placeholder}</span>
          )}
        </span>

        <ChevronDown
          className={cn(
            "w-4 h-4 text-[#8a949d] transition-transform duration-200 flex-shrink-0",
            isOpen && "rotate-180 text-brand-green"
          )}
        />
      </button>

      {error && <p className="mt-1 text-xs text-red-500 font-medium">{error}</p>}

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className={cn(
            "absolute left-0 right-0 top-full mt-1.5 z-[150] bg-white border border-[#d6e2d5] rounded-xl shadow-[0_14px_36px_rgba(8,18,22,0.15)] overflow-hidden flex flex-col",
            menuClassName
          )}
        >
          {/* Search Box */}
          {searchable && (
            <div className="p-2 border-b border-[#e4ece2] bg-[#fcfdfa] relative">
              <div className="relative flex items-center">
                <Search className="w-3.5 h-3.5 absolute left-3 text-[#8a949d] pointer-events-none" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search options..."
                  className="w-full pl-8 pr-7 py-1.5 bg-white border border-line rounded-lg text-xs font-medium text-ink placeholder:text-[#8a949d] focus:outline-none focus:border-brand-green"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="absolute right-2 text-[#8a949d] hover:text-ink cursor-pointer p-0.5"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* Options List */}
          <div className="max-h-56 overflow-y-auto p-1.5 space-y-0.5">
            {filteredOptions.length === 0 ? (
              <div className="py-4 px-3 text-center text-xs text-[#8a949d]">
                No options found
              </div>
            ) : (
              filteredOptions.map((opt) => {
                const isSelected = String(opt.value) === String(value);
                return (
                  <button
                    type="button"
                    key={opt.value}
                    disabled={opt.disabled}
                    onClick={() => handleSelect(opt.value, opt.disabled)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-colors text-left cursor-pointer",
                      isSelected
                        ? "bg-[#eff5ed] text-brand-green font-bold"
                        : "text-[#333e48] hover:bg-[#f4f8f3] hover:text-ink",
                      opt.disabled && "opacity-40 cursor-not-allowed hover:bg-transparent"
                    )}
                  >
                    <div className="truncate flex-1 pr-2">
                      <div className="truncate">{opt.label}</div>
                      {opt.sublabel && (
                        <div className="text-[10px] text-[#8a949d] truncate font-normal mt-0.5">
                          {opt.sublabel}
                        </div>
                      )}
                    </div>
                    {isSelected && (
                      <Check className="w-3.5 h-3.5 text-brand-green flex-shrink-0" />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
