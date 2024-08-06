'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import { CustomHeader, CustomTableHeader, CustomTablePagination } from '@/src/components/customTable/customTable';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import dayjs from 'dayjs';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { deleteModalitites, getModalityList } from '@/src/api/admin'; // Adjust the import to the correct API call
import SearchField from '@/src/components/searchField/searchField';
import Button from '@/src/components/button/button';
import { useRouter } from 'next/navigation';
import CustomModal from '@/src/components/modal/modal';

type ModalityItem = {
    name: string;
    description: string;
    id: string;
};

type SortOrder = {
    [key: string]: string;
};

export default function Modality() {
    const [list, setList] = useState<ModalityItem[]>([]);
    const [activeColumn, setActiveColumn] = useState('name');
    const [totalRows, setTotalRows] = useState(10);
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [searchString, setSearchString] = useState('');
    const [success, setissuccess] = useState(false)
    const [isModalVisible, setisModalVisible] = useState(false);
    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState('');
    const router = useRouter();
    const [sortOrder, setSortOrder] = useState<SortOrder>({
        name: 'asc',
        description: 'asc',
    });

    const {
        handleDeleteError,
        deleteError,
        handleDeleteSuccess,
        deleteMutation,
    } = deleteModalitites(deleteId);

    const {
        handleModalityError,
        modalityError,
        handleModalitySuccess,
        modalityResponse,
        modalityStatus,
        modalityMutate,
    } = getModalityList({
        search: debouncedSearchString,
        page,
        limit: rowsPerPage,
        sortBy: activeColumn,
        sortOrder: sortOrder[activeColumn],
    });

    useEffect(() => {
        modalityMutate();
    }, [page, rowsPerPage, sortOrder, activeColumn, debouncedSearchString]);

    useEffect(() => {
        if (handleDeleteSuccess) {
            modalityMutate();
            setisModalVisible(false);
            setDeleteId("")
        }
    }, [handleDeleteSuccess]);

    useEffect(() => {
        if (handleDeleteError) {
            handleSnackbarOpen('Error deleting testimonial');
            setisModalVisible(false);
            setDeleteId('')
        }
    }, [handleDeleteError]);


    useEffect(() => {
        if (handleModalitySuccess) {
            const { items, totalPages, totalItems } = modalityResponse?.data?.data || {};
            setList(items || []);
            setTotalPages(totalPages || 1);
            setTotalRows(totalItems || 0);
        }
    }, [handleModalitySuccess, modalityResponse]);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [searchString]);

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage + 1);
    };

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchString(value);
    };

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const handleCancel = () => {
        setisModalVisible(false);
        setDeleteId('');
    };

    const handleDelete = () => {
        deleteMutation();
    };

    const handleClearField = () => {
        setSearchString('');
    }

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

    const handleCreateTestimonial = () => {
        router.push('/admin/dashboard/modality/create');
    }

    return (
        <>
            <div className="adminContentContainer">
                <div className="createButton flex justify-end mb-4">
                    <Button
                        label="Create"
                        type='button'
                        onClick={handleCreateTestimonial}
                        btnStyle={{
                            color: "#fff",
                            background: "#0F4A8A",
                            minWidth: "fit-content"
                        }}
                    />
                </div>
                <CustomHeader label="Modality" color='#0f4a8a' textcolor='white' />
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
                            { id: 'description', label: 'Description' },
                        ]}
                        enableSort={true}
                        handleSort={handleSort}
                        activeColumn={activeColumn}
                    />
                    <TableBody>
                        {list.map((item: ModalityItem, index: number) => (
                            <TableRow key={item.id} style={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#FFFFFF' }}>
                                <TableCell className="table-cell">{item.name}</TableCell>
                                <TableCell className="table-cell">{item.description}</TableCell>
                                <TableCell className="table-cell">
                                    <IconButton
                                        onClick={() => {
                                            router.push(`/admin/dashboard/modality/edit/${item.id}`)
                                        }}
                                        aria-label="Edit"
                                        sx={{ color: '#61CD7F' }}
                                    >
                                        <EditIcon />
                                    </IconButton>
                                    <IconButton
                                        onClick={() => {
                                            setDeleteId(item.id)
                                            setisModalVisible(true)
                                        }}
                                        aria-label="delete"
                                        sx={{
                                            color: 'red',
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
