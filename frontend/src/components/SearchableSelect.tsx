import React, { useState, useRef, useEffect } from 'react';

interface SearchableSelectProps {
  id?: string;
  label?: string;
  options: string[];
  value: string;
  placeholder?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  isInvalid?: boolean;
  onChange: (value: string) => void;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
  id,
  options,
  value,
  placeholder = 'Select or search...',
  searchPlaceholder = 'Type to search...',
  disabled = false,
  isInvalid = false,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [highlightedIndex, setHighlightedIndex] = useState<number>(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Filter options based on search query
  const filteredOptions = options.filter((opt) =>
    opt.toLowerCase().includes(searchTerm.trim().toLowerCase())
  );

  // Close on outside click
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isOpen]);

  // Focus search input when opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isOpen]);

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchTerm('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < filteredOptions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : filteredOptions.length - 1));
    } else if (e.key === 'Enter' && highlightedIndex >= 0 && highlightedIndex < filteredOptions.length) {
      e.preventDefault();
      handleSelect(filteredOptions[highlightedIndex]);
    }
  };

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
    setHighlightedIndex(-1);
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    setSearchTerm('');
  };

  return (
    <div
      ref={containerRef}
      className="searchable-select-container"
      style={{ position: 'relative', width: '100%' }}
      onKeyDown={handleKeyDown}
    >
      {/* Trigger Button */}
      <div
        id={id}
        tabIndex={disabled ? -1 : 0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        className={`searchable-select-trigger ${isInvalid ? 'invalid' : ''} ${disabled ? 'disabled' : ''}`}
        onClick={() => {
          if (!disabled) {
            setIsOpen(!isOpen);
            setSearchTerm('');
          }
        }}
        style={{
          width: '100%',
          background: disabled ? '#f5f4ef' : '#fdfcf9',
          border: isInvalid ? '1.5px solid var(--danger)' : '1.5px solid var(--border-strong)',
          borderRadius: 'var(--radius-md)',
          padding: '14px 17px',
          minHeight: '54px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: disabled ? 'not-allowed' : 'pointer',
          color: value ? 'var(--ink)' : 'var(--ink-faint)',
          fontSize: '16px',
          fontWeight: value ? 600 : 400,
          boxShadow: isOpen ? '0 0 0 4px var(--accent-soft)' : 'none',
          borderColor: isOpen ? 'var(--accent)' : undefined,
          transition: 'all 0.2s ease',
        }}
      >
        <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginRight: '8px' }}>
          {value || placeholder}
        </span>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
          {value && !disabled && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear selection"
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink-faint)',
                cursor: 'pointer',
                fontSize: '16px',
                padding: '2px 6px',
                lineHeight: 1,
              }}
            >
              ×
            </button>
          )}
          <svg
            viewBox="0 0 24 24"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{
              color: 'var(--ink-muted)',
              transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease',
            }}
          >
            <polyline points="6 9 12 15 18 9" />
          </svg>
        </div>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          className="searchable-select-dropdown"
          style={{
            position: 'absolute',
            top: 'calc(100% + 6px)',
            left: 0,
            right: 0,
            background: '#ffffff',
            border: '1.5px solid var(--border-strong)',
            borderRadius: 'var(--radius-md)',
            boxShadow: 'var(--shadow-card)',
            zIndex: 100,
            overflow: 'hidden',
            animation: 'dropdownIn 0.2s ease',
          }}
        >
          {/* Search Box */}
          <div style={{ padding: '10px 12px', borderBottom: '1px solid var(--border)', background: '#faf9f5' }}>
            <input
              ref={searchInputRef}
              type="text"
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setHighlightedIndex(0);
              }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: '100%',
                background: '#ffffff',
                border: '1px solid var(--border-strong)',
                borderRadius: '8px',
                padding: '9px 12px',
                fontSize: '14.5px',
                outline: 'none',
                minHeight: '38px',
              }}
            />
          </div>

          {/* Options List */}
          <div
            ref={listRef}
            role="listbox"
            style={{
              maxHeight: '260px',
              overflowY: 'auto',
              padding: '6px 0',
            }}
          >
            {filteredOptions.length === 0 ? (
              <div
                style={{
                  padding: '16px',
                  textAlign: 'center',
                  color: 'var(--ink-faint)',
                  fontSize: '14px',
                }}
              >
                No matching courses found.
              </div>
            ) : (
              filteredOptions.map((opt, idx) => {
                const isSelected = opt === value;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <div
                    key={opt}
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelect(opt)}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    style={{
                      padding: '11px 16px',
                      fontSize: '14.5px',
                      cursor: 'pointer',
                      background: isSelected
                        ? 'var(--accent-soft)'
                        : isHighlighted
                        ? '#f6f4ee'
                        : 'transparent',
                      color: isSelected ? 'var(--accent-deep)' : 'var(--ink)',
                      fontWeight: isSelected ? 700 : 500,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'background 0.15s ease',
                    }}
                  >
                    <span>{opt}</span>
                    {isSelected && (
                      <span style={{ color: 'var(--accent-deep)', fontWeight: 800, fontSize: '13px' }}>
                        ✓
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
};
