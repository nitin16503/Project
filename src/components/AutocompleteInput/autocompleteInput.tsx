import React, { FC } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete, { AutocompleteProps } from '@mui/material/Autocomplete';
import Paper, { PaperProps } from '@mui/material/Paper';

interface AutocompleteInputProps {
  label?: string;
  defaultValue?: any;
  list: any;
  multiple?: boolean;
  handleChange: (value: any) => void;
  dropdownMaxHeight?: number; // New prop to specify the maximum height of the dropdown
}

const AutocompleteInput: FC<AutocompleteInputProps> = ({
  label,
  list,
  defaultValue,
  handleChange,
  multiple = false,
  dropdownMaxHeight = 300, // Default maximum height value
}) => {
  
  // Custom paper component with maxHeight set
  const CustomPaper: React.FC<PaperProps> = (props) => (
    <Paper {...props} style={{ maxHeight: dropdownMaxHeight, overflow: 'auto' }} />
  );

  return (
    <>
      <Autocomplete
        disablePortal
        defaultValue={defaultValue || null}
        id="combo-box-demo"
        options={list}
       
        onChange={(event, value, reason, details) => handleChange(value)}
        getOptionLabel={(option: { name: string }) => option.name}
        PaperComponent={CustomPaper} // Set custom paper component with maxHeight
        sx={{ width: 300 }}
        disableClearable
        renderInput={(params) => <TextField {...params} label={label} />}
      />
    </>
  );
};

export default AutocompleteInput;
