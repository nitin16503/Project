import React, { useEffect, useState } from 'react'
import Image from 'next/image';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CustomHeader, CustomTableHeader } from '../customTable/customTable';
import shareIcon from '../../assets/images/shareIcon.svg'
import downloadIcon from '../../assets/images/downloadIcon.svg'
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import dayjs from 'dayjs';
import { getTestList } from '@/src/api/scantest';
import Button from '../button/button';
import { usePathname, useRouter } from 'next/navigation';
import { useDownloadReport } from '@/src/api/radioLogist';

export default function Reports() {

  const columns = [
    {
      id: 'id',
      label: 'Patient ID',
    },
    {
      id: 'name',
      label: 'Patient Name',
    },
    {
      id: 'scanTime',
      label: 'Time of CT Scan',
    },
    {
      id: 'status',
      label: 'Test Name',
    },
    {
      id: 'radiologist',
      label: 'Radiologist',
    },
    {
      id: 'status',
      label: 'Report Status',
    },
  ]
  const [list, setList] = useState([]);
  const router = useRouter(); 
  const pathName = usePathname();
  const [rowsPerPage, setRowsPerPage] = useState(10); // limit
  const [totalRows, setTotalRows] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const {
    testList,
    errorTestList,
    isErrorTestList,
    isLoadingTestList,
    isSuccessTestList,
    refetchAllTests
  } = getTestList({
    page: page,
    limit: rowsPerPage,
    sortBy: 'createdAt',
    sortOrder: 'desc',
    patientName: '',
    scanStartDate: '',
    scanEndDate: '',
  });
  const {
    downloadData, 
    errorDownload, 
    isErrorDownload, 
    isSuccessDownload, 
    download
  } = useDownloadReport();

  useEffect(() => {
    if (isSuccessDownload && downloadData) {
         // Create a URL for the blob and open it in a new tab
         const url = window.URL.createObjectURL(new Blob([downloadData?.data]));
         const link = document.createElement('a');
         link.href = url;
         link.setAttribute('download', 'report.pdf'); // or set a meaningful file name
         link.target = '_blank';
         document.body.appendChild(link);
         link.click();
         // Ensure link.parentNode is not null before removing
        if (link.parentNode) {
          link.parentNode.removeChild(link); // Clean up the DOM
        }
    }
    if (isErrorDownload && errorDownload) {
      console.log(errorDownload, "error in download report");
    }
  }, [downloadData, errorDownload]);

  useEffect(() => {
    if (isSuccessTestList && testList) {
      const { statusCode, data: responseData } = testList?.data;
      if (statusCode === 200) {
        setList(responseData.items);     
        setTotalRows(responseData.totalItems)
        setTotalPages(responseData.totalPages);
      }
    }
    if (isErrorTestList && errorTestList) {
      console.log(errorTestList, "error");
    }
  }, [errorTestList, testList]);

  useEffect(() => {
    // Run the query when the component mounts (on page load)
    refetchAllTests();
  }, []);

  const handleviewReport = (id: string, studyInstanceUID: string) => {
    const currentPath = pathName;
    router.push(`${currentPath}/report?id=${id}&studyInstanceUID=${studyInstanceUID}`);
  }

  const handleDownload = (reportId:string) => {
    download(reportId);
  };

  return (
    <div className='recordContainer'>
      <div style={{ marginBottom: '20px' }}>
        <CustomHeader label="Records and Status" color='#0F4A8A' textcolor='white' />
        {list.length > 0 ? <Table>
          <CustomTableHeader
            headerColor='#61CD7F'
            list={list}
            columns={columns}
            enableSort={false}
          />
          <TableBody>
            {list.map((record, index): any => {
              const report = record['report'] != undefined ? record['report'][0] : [];
              if(report.length === 0)
                return null
              const time = dayjs(record['createdAt']).format('YYYY-MM-DD hh:mm A');
              const isEvenRow = index % 2 === 0;
              return <TableRow key={index} style={{
                backgroundColor: isEvenRow ? '#F7F7F7' : '#FFFFFF',
              }}>
                <TableCell className='table-cell'>{record['refNumber']}</TableCell>
                <TableCell className='table-cell'>{`${record?.['patient']['firstName']} ${record?.['patient']['lastName']}`}</TableCell>
                <TableCell className='table-cell'>{time}</TableCell>
                <TableCell className='table-cell'>{record['testName']}</TableCell>
                <TableCell className='table-cell'>
                  {(record['report'] && record['report'][0] && record['report'][0]['currentReviewer'] !== undefined && record['report'][0]['currentReviewer'][0]) ?
                    record['report'][0]['currentReviewer'][0]['firstName'] + ' ' + record['report'][0]['currentReviewer'][0]['lastName']
                    : 'Not Assigned'
                  }
                </TableCell>
                <TableCell className='table-cell'>
                  {(record['report'] && record['report'][0] && record['report'][0]['reportStatus'] !== undefined)
                    ? record['report'][0]['reportStatus']
                    : record['status']}
                </TableCell>
                <TableCell className='table-cell'>
                  <div className='flex flex-row justify-between'>
                  <Button
                    label="View"
                    onClick={() => {
                      handleviewReport(record['id'], record['report'][0]['studyInstanceUID'])
                    }}
                    type='button'
                    disabled={(record['report'] && record['report'][0] && record['report'][0]['studyInstanceUID'] !== undefined && record['report'][0]['reportStatus'] == 'AI Report Ready' || record['report'][0]['reportStatus'] == 'Radiologist Processed' || record['report'][0]['reportStatus'] == 'Radiologist Processing') ? false : true}
                    btnStyle={{
                      color: '#fff',
                      backgroundColor: "#61CD7F",
                      minWidth: 0,
                      width: 'auto',
                      display: '',
                      height: 'unset',
                      padding: '5px 10px',
                    }}
                  />
                  {record['report'][0]['publish'] == 'SING_OFF' &&
                  <Image
                    src={downloadIcon}
                    alt="Download Image"
                    width={20}
                    height={20}
                    onClick={() => {
                      handleDownload(record['report'][0]['_id'])
                    }}
                    style={{ cursor: 'pointer' }}
                  />}
                  </div>
                </TableCell>
              </TableRow>
            })}
          </TableBody>
        </Table> :
          <Paper elevation={3} sx={{ bgcolor: 'white' }}>
            <Typography  sx={{ color: '0F4A8A', textAlign:'center', padding: '10px' }}>
              No Record Found
            </Typography>
          </Paper>
        }
      </div>
    </div>
  )
}

