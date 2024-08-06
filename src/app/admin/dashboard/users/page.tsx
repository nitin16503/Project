'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import './user.css';
import { CustomHeader, CustomTableHeader, CustomTablePagination } from '@/src/components/customTable/customTable';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import { getCentersList, getUserAdmin, useActivateUser, useDeleteUser } from '@/src/api/admin';
import SearchField from '@/src/components/searchField/searchField';
import Button from '@/src/components/button/button';
import CustomModal from '@/src/components/modal/modal';
import { useRouter } from 'next/navigation';

type SortOrder = {
    [key: string]: string;
};

export default function User() {
    const [list, setList] = useState<any>([]);
    const [activeColumn, setActiveColumn] = useState('createdAt');
    const [success, setissuccess] = useState(false)
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isModalVisible, setisModalVisible] = useState(false);
    const [totalRows, setTotalRows] = useState(10);
    const [rowsPerPage, setRowsPerPage] = useState(10); // limit
    const [totalPages, setTotalPages] = useState(1);
    const [activiteUser, setActiveUser] = useState({ id: '', type: '' });
    const [deleteUserId, setDeleteUserId] = useState('')
    const [searchString, setSearchString] = useState('');
    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [centersLimit, setCenterLimit] = useState(10);
    const [sortOrder, setSortOrder] = useState<SortOrder>({
        createdAt: 'asc',
        updatedAt: 'asc'
    });
    const {
        handleUserError,
        userError,
        handleUserSuccess,
        userResponse,
        userStatus,
        userMutate,
    } = getUserAdmin({
        search: debouncedSearchString,
        page: page,
        limit: rowsPerPage,
        sortBy: activeColumn,
        sortOrder: sortOrder[activeColumn],
    });



    const {
        activateUserError,
        activateUserErrorObject,
        activateUserSuccess,
        activateUserMutation,
        activateResponse
    } = useActivateUser({
        id: activiteUser.id,
        type: activiteUser.type
    });

    const columns = [
        {
            id: 'id',
            label: 'SNo.',
        },
        {
            id: 'name',
            label: 'Name',
        },
        {
            id: 'email',
            label: 'Email',
        },
        {
            id: 'userLevel',
            label: 'User Level',
        },
        {
            id: 'createdAt',
            label: 'Created At',
        },
        {
            id: 'updatedAt',
            label: 'Updated At',
        },
        {
            id: 'isActive',
            label: 'Active',
        },
    ];



    useEffect(() => {
        if (activateUserError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
        if (handleUserError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
    }, [activateUserError, handleUserError]);

    useEffect(() => {
        userMutate();

    }, []);

    useEffect(() => {
        if (activateUserSuccess) {
            const { statusCode, data } = activateResponse || {};
            if (statusCode === 200) {
                userMutate();
            }
        }
    }, [activateUserSuccess, activateResponse]);

    useEffect(() => {
        if (success) {
            setisModalVisible(true);
        }
    }, [success])

    useEffect(() => {
        if (activiteUser.id !== '' && activiteUser.type !== '') {
            activateUserMutation();
        }
    }, [activiteUser])

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchString]);

    useEffect(() => {
        userMutate();
    }, [page, rowsPerPage, debouncedSearchString]);

    useEffect(() => {
        if (handleUserSuccess) {
            const { statusCode, data } = userResponse?.data || {};
            if (statusCode === 200) {
                setList(data.items);
                setTotalPages(data.totalPages);
                setTotalRows(data.totalItems);
            }
        }
    }, [handleUserSuccess, userResponse]);

    useEffect(() => {
        if (activeColumn !== '') {
            setPage(1); // Reset the page number when the active column changes
            userMutate();
        }
    }, [activeColumn, sortOrder]);

    const handleDelete = () => {
        //activateUserMutation();

    };

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    const handleCancel = () => {
        setisModalVisible(false);
        // Cancel operation or close the modal here
        // This function should handle the cancellation of the deletion operation
    };


    const handleChangePage = (
        event: React.MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        setPage(newPage + 1);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchString(value);
    };

    const handleClearField = () => {
        setSearchString('');
    };

    const handleChangeRowsPerPage = (
        event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setPage(1);
        setRowsPerPage(parseInt(event.target.value, 10));
    };

    const handleSort = (column: string) => {
        setSortOrder((prevSortOrder) => ({
            ...prevSortOrder,
            [column]: prevSortOrder[column as keyof typeof prevSortOrder] === 'asc' ? 'desc' : 'asc',
        }));
        setActiveColumn(column);
    };

    // Function to handle click event
    const handleClick = (id: string, type: string) => {

        //setisModalVisible(true)
        setActiveUser({ id, type })
    };

    const handleCreateUser = () => {
        router.push('/admin/dashboard/users/create');
    }

    return (
        <>
            <div className="adminContentContainer">
                <div className="createButton flex justify-end mb-4">
                    <Button
                        label="Create"
                        type='button'
                        onClick={handleCreateUser}
                        btnStyle={{
                            color: "#fff",
                            background: "#0F4A8A",
                            minWidth: "fit-content"
                        }}
                    />
                </div>
                <CustomHeader label="Users" color='#0f4a8a' textcolor='white' />
                <div className='searchBar flex-1'>
                    <SearchField
                        handleSearch={handleSearch}
                        handleClearField={handleClearField}
                        label="Search Users"
                        resetIcon={false}
                        customStyles={{
                            height: '64px',
                            border: ' 1px solid #61CD7F'
                        }}
                    />
                </div>
                <Table>
                    <CustomTableHeader
                        headerColor='#61CD7F'
                        list={list}
                        sortOrder={sortOrder}
                        columns={columns}
                        enableSort={true}
                        handleSort={handleSort}
                        activeColumn={activeColumn}
                    />
                    <TableBody>
                        {list.map((record: any, index: number): any => {
                            const Ctime = dayjs(record['createdAt']).format('YYYY-MM-DD hh:mm A');
                            const Utime = dayjs(record['updatedAt']).format('YYYY-MM-DD hh:mm A');
                            const isEvenRow = index % 2 === 0;
                            return <TableRow key={index} style={{
                                backgroundColor: isEvenRow ? '#F7F7F7' : '#FFFFFF',
                            }}>
                                <TableCell className='table-cell'>{index + 1}</TableCell>
                                <TableCell className='table-cell'>{`${record['firstName']} ${record['lastName']}`}</TableCell>
                                <TableCell className='table-cell'>{record['email']}</TableCell>
                                <TableCell className='table-cell'>{record['userLevel']}</TableCell>
                                <TableCell className='table-cell'>{Ctime}</TableCell>
                                <TableCell className='table-cell'>{Utime}</TableCell>
                                <TableCell className='table-cell'>
                                    {record.isActive ? (
                                        <Button
                                            label="DeActivate"
                                            type='button'
                                            onClick={() => { handleClick(record.id, 'disable') }}
                                            btnStyle={{
                                                color: "#fff",
                                                background: "#0F4A8A",
                                                minWidth: "fit-content"
                                            }}
                                        />
                                    ) : (
                                        <Button
                                            label="Activate"
                                            type='button'
                                            onClick={() => { handleClick(record.id, 'activate') }}
                                            btnStyle={{
                                                color: "#fff",
                                                background: "#0F4A8A",
                                                minWidth: "fit-content"
                                            }}
                                        />
                                    )}
                                </TableCell>
                                <TableCell className='table-cell'>
                                    <IconButton
                                        onClick={() => {
                                            router.push('/admin/dashboard/users/edit/' + record.id);
                                        }}
                                        aria-label="Edit"
                                        sx={{
                                            color: '#61CD7F',
                                        }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    {/* <IconButton
                                        onClick={() => {
                                            setDeleteUserId(record.id)
                                            setisModalVisible(true) // Handle edit icon click event here
                                        }}
                                        aria-label="delete"
                                        sx={{
                                            color: 'red',
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton> */}
                                </TableCell>

                            </TableRow>
                        })}
                    </TableBody>
                </Table>
                <CustomTablePagination
                    totalRows={totalRows}
                    rowsPerPage={rowsPerPage}
                    totalPages={totalPages}
                    page={page}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                />
                <CustomModal
                    isVisible={isModalVisible}
                    handleCancelButton={handleCancel}
                    modalTitle="Confirm deletion?"
                    modalMessage="Are you sure you want to delete this user?"
                    showButtons={true}
                    primaryButtonText="Delete"
                    secondaryButtonText="Cancel"
                    primaryButtonColor="#FF0000"
                    secondaryButtonColor="#FFF"
                    handlePrimaryButton={handleDelete} // Pass the delete function
                    handleSecondaryButton={handleCancel} // Cancel function
                    success={success}
                    icon={() => <DeleteIcon style={{ color: 'red', margin: 10 }} />} // Assuming you have a DeleteIcon component
                />
                <Snackbar
                    open={snackbarOpen}
                    autoHideDuration={6000}
                    onClose={() => setSnackbarOpen(false)}
                >
                    <MuiAlert
                        elevation={6}
                        variant="filled"
                        onClose={() => setSnackbarOpen(false)}
                        severity="error"
                    >
                        {snackbarMessage}
                    </MuiAlert>
                </Snackbar>

            </div>
        </>
    );
}
