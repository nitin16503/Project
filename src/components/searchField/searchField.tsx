import React, { FC, ChangeEvent, useState, CSSProperties,useEffect } from 'react';
import TextField from '@mui/material/TextField';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './searchFields.css'

interface SearchFieldProps {
  handleSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  defaultValue?: string;
  handleClearField?: () => void;
  customStyles?: CSSProperties;
  label?:string;
  resetIcon?:boolean;
  reset?: boolean
}

const SearchField: FC<SearchFieldProps> = ({
  handleSearch, defaultValue, handleClearField, customStyles, label , resetIcon , reset
}) => {

  const [inputValue, setInputValue] = useState(defaultValue || '');

  const clearField = () => {
    setInputValue('');
    if (handleClearField) {
      handleClearField();
    }
  };

  useEffect(()=>{
    if(reset == true){ // reset
      setInputValue('');
    }
  },[reset])

  return (
    <TextField
      placeholder={label || 'Search'}
      value={inputValue}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
        handleSearch(e);
      }}
      name="search"
      // defaultValue={defaultValue}
      fullWidth
      InputProps={{
        startAdornment: <SearchIcon style={{ color: 'grey' , marginRight:5 }} />,
        endAdornment: (inputValue.length > 0 && resetIcon !=false) ? (
          <CloseIcon
            onClick={clearField}
            style={{ cursor: 'pointer', color: 'grey' }}
          />
        ) : null,
        style: {
          ...customStyles,         
        },
      }}
      sx={{
        '& .MuiOutlinedInput-root': {
          '& fieldset': {
            borderColor: 'transparent',
          },
          '&:hover fieldset': {
            borderColor: 'transparent',
            borderWidth:0
          },
          '&.Mui-focused fieldset': {
            borderColor: 'transparent',
          },
        },
      }}
    />
  );
};

export default SearchField;
