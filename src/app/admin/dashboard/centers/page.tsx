'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import './centers.css'; // Update the CSS file path if needed
import { CustomHeader, CustomTableHeader, CustomTablePagination } from '@/src/components/customTable/customTable';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import dayjs from 'dayjs';
import { deleteCenter, getCentersList } from '@/src/api/admin';
import SearchField from '@/src/components/searchField/searchField';
import { useRouter } from 'next/navigation';
import CustomModal from '@/src/components/modal/modal';
import Button from '@/src/components/button/button';

type HealthcareItem = {
    name: string;
    description: string;
    createdBy: {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
    };
    createdAt: string;
    updatedAt: string;
    id: string;
};


type SortOrder = {
    [key: string]: string;
};

export default function Centers() {
    const [list, setList] = useState<HealthcareItem[]>([]);
    const [activeColumn, setActiveColumn] = useState('name');
    const [totalRows, setTotalRows] = useState(10);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [searchString, setSearchString] = useState('');
    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const [page, setPage] = useState(1);
    const router = useRouter();
    const [isModalVisible, setisModalVisible] = useState(false);
    const [success, setissuccess] = useState(false)
    const [deleteId, setDeleteId] = useState('');

    const [sortOrder, setSortOrder] = useState<SortOrder>({
        name: 'asc',
        description: 'asc',
        updatedAt: 'asc',
        createdAt: 'asc',
    });

    const {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deleteMutation,
    } = deleteCenter(deleteId);

    const {
        handleCentersError,
        centersError,
        handleCentersSuccess,
        centersResponse,
        centersStatus,
        centersMutate,
    } = getCentersList({
        search: debouncedSearchString,
        page,
        limit: rowsPerPage,
        sortBy: activeColumn,
        sortOrder: sortOrder[activeColumn],
    });

    useEffect(() => {
        centersMutate();
    }, [page, rowsPerPage, sortOrder, activeColumn, debouncedSearchString]);

    useEffect(() => {
        if (handleCentersSuccess) {
            const { items, totalPages, totalItems } = centersResponse?.data?.data || {};
            setList(items || []);
            setTotalPages(totalPages || 1);
            setTotalRows(totalItems || 0);
        }
    }, [handleCentersSuccess, centersResponse]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchString]);

    useEffect(() => {
        if (handleDeleteError) {
            handleSnackbarOpen('Error deleting testimonial');
            setisModalVisible(false);
            setDeleteId('');
        }
    }, [handleDeleteError]);

    useEffect(() => {
        if (handleDeleteSuccess) {
            setisModalVisible(false);
            setDeleteId('');
            centersMutate();
        }
    }, [handleDeleteSuccess]);

    const handleCancel = () => {
        setisModalVisible(false);
        setDeleteId('');
    };

    const handleDelete = async () => {
        deleteMutation();
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPage(1);
        setRowsPerPage(parseInt(event.target.value, 10));
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

    const handleCreateHealthCare = () => {
        router.push('/admin/dashboard/centers/create');
    }

    return (
        <>
            <div className="adminContentContainer">
                <div className="createButton flex justify-end mb-4">
                    <Button
                        label="Create"
                        type='button'
                        onClick={handleCreateHealthCare}
                        btnStyle={{
                            color: "#fff",
                            background: "#0F4A8A",
                            minWidth: "fit-content"
                        }}
                    />
                </div>
                <CustomHeader label="Centers" color='#0f4a8a' textcolor='white' />
                <div className='searchBar flex-1'>
                    <SearchField
                        handleSearch={handleSearch}
                        handleClearField={handleClearField}
                        label="Search Centers"
                        resetIcon={false}
                        customStyles={{
                            height: '64px',
                            border: ' 1px solid #61CD7F'
                        }}
                    />
                </div>
                <Table>
                    <CustomTableHeader
                        headerColor="#61CD7F"
                        list={list}
                        sortOrder={sortOrder}
                        columns={[
                            { id: 'name', label: 'Name' },
                            { id: 'createdBy', label: 'Created By' },
                            { id: 'createdAt', label: 'Created At' },
                            { id: 'updatedAt', label: 'Updated At' },
                        ]}
                        enableSort={true}
                        handleSort={handleSort}
                        activeColumn={activeColumn}
                    />
                    <TableBody>
                        {list.map((item: HealthcareItem, index: number) => (
                            <TableRow key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#FFFFFF' }}>
                                <TableCell className="table-cell">{item.name}</TableCell>
                                <TableCell className="table-cell">{`${item?.createdBy?.firstName} ${item?.createdBy?.lastName}`}</TableCell>
                                <TableCell className="table-cell">{dayjs(item.createdAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell className="table-cell">{dayjs(item.updatedAt).format('YYYY-MM-DD HH:mm:ss')}</TableCell>
                                <TableCell className="table-cell" >

                                    <IconButton
                                        onClick={() => {
                                            setDeleteId(item.id);
                                            setisModalVisible(true);
                                        }}
                                        aria-label="delete"
                                        sx={{
                                            color: 'red',
                                            marginLeft: '10px',
                                        }}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
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

