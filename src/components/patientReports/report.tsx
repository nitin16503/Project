import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CustomHeader, CustomTableHeader } from '../customTable/customTable';
import { getPatientTests } from '@/src/api/scantest';
import shareIcon from '../../assets/images/shareIcon.svg'
import downloadIcon from '../../assets/images/downloadIcon.svg'
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import dayjs from 'dayjs';

export default function PatientReports() {

  const columns = [
    {
      id: 'name',
      label: 'Test\'s Name',
    },
    {
      id: 'scanTime',
      label: 'Date of Report',
    },
    {
      id: 'status',
      label: 'Hospital/Clinic Name',
    }
  ]
  const [list, setList] = useState([]);
  const {
    testList,
    errorTestList,
    loadingTestDetail,
    isSuccessTestDetail,
    isErrorTestList,
  } = getPatientTests();

  useEffect(() => {
    if (isSuccessTestDetail && testList) {
      const { statusCode, data: responseData } = testList?.data;
      if (statusCode === 200) {
        setList(responseData.items);
      }
    }
    if (isErrorTestList && errorTestList) {
      console.log(errorTestList, "error");
    }
  }, [errorTestList, testList]);

  const records = [
    {
      name: 'Jane Sharma',
      id: '121212',
      scanTime: '23/09/22 - 11:30 AM',
      radiologist: 'Dr. Vikram',
      status: 'AI Processed',
      hospitalName: 'DLF Green',
    },
    {
      name: 'Maya Agnihotri',
      id: '345678',
      scanTime: '23/09/22 - 12:45 PM',
      radiologist: 'Dr. Williams',
      status: 'AI report ready',
      hospitalName: 'DLF Green',
    },
    {
      name: 'Olivia Smith',
      id: '456789',
      scanTime: '23/09/22 - 07:30 AM',
      radiologist: 'Dr. Garcia',
      status: 'Radiologist processing',
      hospitalName: 'DLF Green',
    },
  ]

  return (
    <div className='recordContainer'>
      <div style={{marginBottom: '20px'}}>
        <CustomHeader label="All Reports" color='#FFFFFF' textcolor='#0F4A8A' />
        <Table>
          <CustomTableHeader
            headerColor='#333333'
            list={records}
            columns={columns}
            enableSort={false}
          />
          <TableBody>
            {list.map((record, index): any => {
              const isEvenRow = index % 2 === 0;
              return <TableRow key={index} style={{
                backgroundColor: isEvenRow ? '#F7F7F7' : '#FFFFFF',
              }}>
                <TableCell className='table-cell'>{record['test']['name']}</TableCell>
                <TableCell className='table-cell'>{dayjs(record['center']['createdAt']).format('YYYY-MM-DD hh:mm A')}</TableCell>
                <TableCell className='table-cell'>{record['center']['name']}</TableCell>
                <TableCell className='table-cell'>
                  <Grid container spacing={2} className='root'>
                    {/* <Grid item xs={6}>
                        <Image src={shareIcon} alt="Image" className="image" />
                    </Grid> */}
                    <Grid item xs={6}>
                        <Image src={downloadIcon} alt="Image" className="image" />
                    </Grid>
                  </Grid>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

