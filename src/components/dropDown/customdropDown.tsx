import React, { FC, useState, useRef, useEffect } from 'react';
import './customdropDown.css';
import { KeyboardArrowDown } from '@mui/icons-material';

interface CustomDropdownProps {
  label: string;
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  showError?: boolean;
  errorMessage?: string;
  labelStyle?: React.CSSProperties,
  dropStyle?:React.CSSProperties;
  containerStyle?: React.CSSProperties,
  width?: string;
}

const CustomDropdown: FC<CustomDropdownProps> = ({
  width,
  label,
  options,
  value = '',
  onChange,
  labelStyle,
  dropStyle,
  containerStyle,
  showError = false,

  errorMessage = '',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedValue, setSelectedValue] = useState(value);

  const dropdownRef = useRef<HTMLDivElement>(null); // specify the type explicitly

  const handleDropdownChange = (selectedOption: string) => {
    setSelectedValue(selectedOption);
    setIsOpen(false);
    if (onChange) {
      onChange(selectedOption);
    }
  };

  const handleClickOutside = (event: Event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="customDropdownContainer" style={containerStyle}>
      <label className="dropLabel" style={labelStyle}>{label}</label>
      <div ref={dropdownRef} className="customDropdownWrapper">
        <div style={dropStyle} className={`customDropdownHeader flex flex-row justify-between w-full ${selectedValue ? 'selected' : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <div className={`selectedValue ${selectedValue !== '' ? 'selected' : ''}`}>
            {selectedValue || 'Select'}
            </div>
          <div className="dropIcon">
            <KeyboardArrowDown />
          </div>
        </div>
        {isOpen && (
          <ul className="customDropdownList">
            {options.map((option, key) => (
              <li
                key={option}
                onClick={() => handleDropdownChange(option)}
                className={selectedValue === option ? 'selected' : ''}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      {showError && <p className="error">{errorMessage}</p>}
    </div>
  );
};

export default CustomDropdown;
