import React, { FC, useEffect, useState } from 'react';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  label: string;
  onDateChange: React.Dispatch<React.SetStateAction<null | string>>;
  reset: boolean
}

const CustomDropdown: FC<CustomDatePickerProps> = ({label,onDateChange,reset}) => {

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
    const formattedDate = dayjs(date).format('YYYY-MM-DDTHH:mm:ss');
    onDateChange(formattedDate); // Call the callback to handle date change
  };

  useEffect(()=>{
    if(reset){ // reset
      setSelectedDate(null);
    }
  },[reset])

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DemoContainer 
        components={['DatePicker']} 
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: '#FFF',
              //bgcolor: '#FFF',
              borderRadius:'10px'
            },
            '&:hover fieldset': {
              borderColor: '#FFF',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#FFF',
            },
            '& .MuiSvgIcon-root': {
             // color: 'black', // Set the color to grey for the icon
            },
            '&.Mui-focused label':{
              color: '#FFF',
            }
          },
        }}
      >
        <DatePicker 
          value={selectedDate} onChange={handleDateChange} label={label} />
      </DemoContainer>
    </LocalizationProvider>
  );
}

export default CustomDropdown;