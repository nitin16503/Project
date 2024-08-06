'use client'

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './tests.css';
import SearchField from '@/src/components/searchField/searchField';
import Button from '@mui/material/Button';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '@/src/components/loader/loader';
import EditIcon from '@mui/icons-material/Edit';
import { getTestList } from '@/src/api/scantest';

const TestList = () => {

    const [searchString, setSearchString] = useState('');
    const [limit, setLimit] = useState(10);
    const [sortBy, setSortBy] = useState('status');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [list, setList] = useState([]);
    const {
        testList,
        errorTestList,
        isErrorTestList,
        isLoadingTestList,
        isSuccessTestList,
        refetchAllTests
    } = getTestList({ page: currentPage, limit, sortBy, sortOrder });

    useEffect(() => {
        if (isSuccessTestList && testList) {
            const { statusCode, data: responseData } = testList?.data;
            if (statusCode === 200) {
                setList(responseData.items);
                setTotalPages(responseData.totalPages);
            }
        }
    }, [isSuccessTestList, testList]);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchString(value);
    };

    const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
        refetchAllTests();
    };

    return (
        <>
            {!isLoadingTestList ?
                <div className='patientListContainer w-full'>
                    <div className='headingContainer'>
                        <p className='tableHeading'>Scan Test List</p>
                    </div>
                    <div className='search w-full bg-white'>
                        <SearchField handleSearch={handleSearch} />
                    </div>
                    {(list.length == 0) ?
                        <div className="listPatient w-full">
                            <div className="user-item flex w-full">
                                <p className="no-record-text">No Tests Found</p>
                            </div>
                        </div>
                        :
                        <div className='patientTable'>
                            <table className='table'>
                                <thead>
                                    <tr className='headingText'>
                                        <th>Test Id</th>
                                        <th>Patient Id</th>
                                        <th>status</th>
                                        <th>Test Price</th>
                                        <th>refNumber</th>
                                        {/* <th>Action</th> */}
                                    </tr>
                                </thead>
                                <tbody className=''>
                                    {list.map((test: any, index) => (
                                        <tr key={index} className='contentText'>
                                            <td>{test.id}</td>
                                            <td>{test.patientId}</td>
                                            <td>{test.status}</td>
                                            <td>{test.testPrice}</td>
                                            <td>{test.refNumber}</td>
                                            {/* <td>
                                                <div className="actionButtons flex">
                                                    <Button
                                                        variant="outlined"
                                                        style={{
                                                            color: 'white',
                                                            background: '#0f4a8a',
                                                            borderColor: '#0f4a8a',
                                                            minWidth: 'unset'
                                                        }}
                                                        startIcon={<EditIcon style={{ color: 'white' }} />}
                                                        onClick={() => { console.log('edit') }}
                                                    />
                                                    <Button
                                                        variant="outlined"
                                                        style={{
                                                            color: 'red',
                                                            borderColor: 'grey',
                                                            background: 'white',
                                                            minWidth: 'unset'
                                                        }}
                                                        startIcon={<DeleteIcon style={{ color: 'grey' }} />}
                                                        onClick={() => { console.log('delete') }}
                                                    />
                                                </div>
                                            </td> */}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <Stack spacing={2} className="pagination-container">
                                <Pagination count={totalPages}
                                    page={currentPage}
                                    onChange={handlePageChange} />
                            </Stack>
                        </div>
                    }
                </div> :
                <Loader />
            }
        </>
    );
};


export default TestList;
