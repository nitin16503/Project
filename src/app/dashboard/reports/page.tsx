"use client"

import React, { ChangeEvent, FC, useState, useEffect } from 'react'
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Button from '@/src/components/button/button';
import './reports.css'
import SearchField from '@/src/components/searchField/searchField';
import CustomDatePicker from '@/src/components/customDatePicker/customDatePicker';
import { downloadScanTest, getTestList } from '@/src/api/scantest';
import Loader from '@/src/components/loader/loader';
import dayjs from 'dayjs';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import { CustomTableHeader, CustomTablePagination } from '@/src/components/customTable/customTable';
import { Download } from '@mui/icons-material';
import { BACKEND_URL } from '@/src/utils/config';
import { getUserInfo } from '@/src/utils/helper';
import { useRouter } from 'next/navigation';

type SortOrder = {
    [key: string]: string;
}

export default function Reports() {

    const columns = [{
        id: 'refNumber',
        label: 'Test Id',
    },
    {
        id: 'testName',
        label: 'Test Name',
    },
    {
        id: 'firstName',
        label: 'Patient Name',
    },
    {
        id: 'createdAt',
        label: 'Time of CT Scan',
    }
    ]
    const [activeTab, setActiveTab] = useState(0);
    const [searchString, setSearchString] = useState('');
    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const [list, setList] = useState([]);
    const [activeColumn, setActiveColumn] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<SortOrder>({
        refNumber: 'desc',
        testName: 'desc',
        firstName: 'desc',
        createdAt: 'desc'
    });
    const [resetFilter, setResetFilter] = useState(false);
    const today = dayjs().toDate(); // Today's date
    const defaultEndDate = dayjs(today).format('YYYY-MM-DDTHH:mm:ss');
    const defaultStartDate = dayjs('2000-01-01').format('YYYY-MM-DDTHH:mm:ss'); // 2000-01-01 as default start date
    const [startDate, setStartDate] = useState<null | string>(null);
    const [endDate, setEndDate] = useState<null | string>(null);
    const [totalRows, setTotalRows] = useState(10);
    const [rowsPerPage, setRowsPerPage] = useState(10); // limit
    const [totalPages, setTotalPages] = useState(1);
    const [page, setPage] = useState(1);
    const router = useRouter();
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
        sortBy: activeColumn,
        sortOrder: sortOrder[activeColumn],
        patientName: searchString,
        scanStartDate: startDate == null ? '' : startDate,
        scanEndDate: endDate == null ? '' : endDate,
    });

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
        if (activeColumn !== '') {
            setPage(1); // Reset the page number when the active column changes
            refetchAllTests();
        }
    }, [activeColumn, sortOrder]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchString]);

    useEffect(() => {
        refetchAllTests()
    }, [page, rowsPerPage]);

    useEffect(() => {
        if (resetFilter) {
            refetchAllTests()
            setResetFilter(false)
        }
    }, [resetFilter]);

    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage + 1);
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setPage(1);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleDownloadClick = () => {
        const token = getUserInfo('token');

        const downloadUrl = `${BACKEND_URL}/download-scan-tests?page=${page}&sortBy=${activeColumn}&sortOrder=${sortOrder[activeColumn]}&limit=${rowsPerPage}&patientName=${searchString}&scanStartDate=${startDate}&scanEndDate=${endDate}&token=${token}`;
        window.open(downloadUrl, '_blank');
    }

    const handleChangeTab = (_event: ChangeEvent<any>, newValue: number) => {
        setActiveTab(newValue);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchString(value);
    };

    const handleClearField = () => {
        setSearchString('');
    }

    const handleSort = (column: string) => {
        setSortOrder((prevSortOrder) => ({
            ...prevSortOrder,
            [column]: prevSortOrder[column as keyof typeof prevSortOrder] === 'asc' ? 'desc' : 'asc',
        }));
        setActiveColumn(column);
    };

    const handleSearchClick = () => {
        if (startDate != null && endDate == null) {
            setEndDate(defaultEndDate)
        }
        if (startDate == null && endDate != null) {
            setStartDate(defaultStartDate)
        }
        setTimeout(() => {
            refetchAllTests();
        }, 2000);
    };

    const handleResetClick = () => {
        setSearchString('');
        setStartDate(null)
        setEndDate(null)
        setResetFilter(true);
    };

    const handleviewReport = (id: string, studyInstanceUID: string) => {
        router.push(`/dashboard/report?id=${id}&studyInstanceUID=${studyInstanceUID}`);
      }

    return (
        <div className='w-full flex flex-col'>
            <div className='tabContainer'>
                <Tabs
                    value={activeTab}
                    onChange={handleChangeTab}
                    indicatorColor="primary"
                    textColor="primary"
                    aria-label="notification tabs"
                    TabIndicatorProps={{ style: { display: 'none' } }}
                    sx={{
                        '& .MuiTab-root.Mui-selected': {
                            backgroundColor: ' #0F4A8A !important',
                            color: 'white !important',
                            height: '5px',
                        }
                    }}
                >
                    <Tab label="Final Reports" sx={{ '& .MuiTab-root': { className: 'tabText' } }} />
                    <Tab label="Draft Reports" sx={{ '& .MuiTab-root': { className: 'tabText' } }} />
                </Tabs>
            </div>
            <div className='filterContainer'>
                <div className='searchBar flex-1'>
                    <SearchField
                        handleSearch={handleSearch}
                        handleClearField={handleClearField}
                        label="Search Patient List"
                        resetIcon={false}
                        customStyles={{
                            height: '64px',
                        }}
                        reset={resetFilter}
                    />
                </div>
                <div className='flex flex-1 flex-row dateContainer'>
                    <div className='date'>
                        <CustomDatePicker label="Start Date" onDateChange={setStartDate} reset={resetFilter} />
                    </div>
                    &nbsp;&nbsp;
                    <div className='date'>
                        <CustomDatePicker label="End Date" onDateChange={setEndDate} reset={resetFilter} />
                    </div>
                </div>
                <div className='flex flex-1 flex-row items-center searchButtonBox'>
                    <Button label='Search' type='button' onClick={handleSearchClick} btnStyle={{
                        minWidth: 'fit-content',
                        padding: '6px 32px',
                        height: '64px',
                        color: 'white',
                    }} />&nbsp;&nbsp;
                    {(searchString != '' || startDate != null || endDate != null) &&
                        <Button label='Reset' type='button' onClick={handleResetClick} btnStyle={{
                            minWidth: 'fit-content',
                            padding: '6px 32px',
                            height: '64px',
                            color: 'white',
                        }} />}
                    <div className="downloadBox ml-3">
                        <Download onClick={handleDownloadClick} style={{ cursor: 'pointer', color: '#F0A400', width: '35px', height: '56px', }} />
                    </div>
                </div>
            </div>
            <div className='tableContainer'>
                <Table>
                    <CustomTableHeader
                        enableSort={true}
                        headerColor='#0F4A8A'
                        list={list}
                        columns={columns}
                        handleSort={handleSort}
                        activeColumn={activeColumn}
                        sortOrder={sortOrder}
                    />
                    <TableBody>
                        {list.map((record: any, index) => {
                            const time = dayjs(record?.createdAt).format('YYYY-MM-DD hh:mm A');
                            const isEvenRow = index % 2 === 0;
                            return (
                                <TableRow key={index} style={{
                                    backgroundColor: isEvenRow ? '#F7F7F7' : '#FFFFFF',
                                }}>
                                    <TableCell className='table-cell'>{record?.refNumber}</TableCell>
                                    <TableCell className='table-cell'>{record?.testName}</TableCell>
                                    <TableCell className='table-cell'>{`${record?.patient?.firstName} ${record?.patient?.lastName}`}</TableCell>
                                    <TableCell className='table-cell'>{time}</TableCell>
                                    <TableCell className='table-cell'>
                                        <Button
                                            label="View"
                                            onClick={() => {
                                                handleviewReport(record['id'],record['report'][0]['studyInstanceUID'])
                                            }}
                                            type='button'
                                            disabled={(record['report'][0] && record['report'][0]['studyInstanceUID'])  ? false : true}
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
                                    </TableCell>
                                </TableRow>)
                        })}
                        {(list.length == 0) && (
                            <TableRow className="w-full">
                                <TableCell colSpan={5} className="no-record-text" style={{ textAlign: 'center' }}>No Report Found</TableCell>
                            </TableRow>
                        )
                        }
                    </TableBody>
                    {isLoadingTestList && <Loader />}
                </Table>
                <CustomTablePagination
                    totalRows={totalRows}
                    rowsPerPage={rowsPerPage}
                    totalPages={totalPages}
                    page={page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
            </div>
        </div>
    )
}
