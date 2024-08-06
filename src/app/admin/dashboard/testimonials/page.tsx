'use client'
import React, { ChangeEvent, useEffect, useState } from 'react';
import './testimonials.css';
import { CustomHeader, CustomTableHeader, CustomTablePagination } from '@/src/components/customTable/customTable';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import EditIcon from '@mui/icons-material/Edit';
import dayjs from 'dayjs';
import { deleteTestimonial, getTestimonials } from '@/src/api/admin';
import SearchField from '@/src/components/searchField/searchField';
import Button from '@/src/components/button/button';
import { useRouter } from 'next/navigation';
import CustomModal from '@/src/components/modal/modal';

type Testimonial = {
  id: string;
  author: {
    name: string;
    title: string;
    company: string;
    email: string;
    website: string;
    avatar: string;
  };
  text: string;
  rating: number;
  status: string;
  createdAt: string;
  updatedAt: string;
};

type SortOrder = {
  [key: string]: string;
};

export default function Testimonials() {
  const [list, setList] = useState<Testimonial[]>([]);
  const [activeColumn, setActiveColumn] = useState('createdAt');
  const [totalRows, setTotalRows] = useState(10);
  const [success, setissuccess] = useState(false)
  const [isModalVisible, setisModalVisible] = useState(false);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  const [totalPages, setTotalPages] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const [page, setPage] = useState(1);
  const router = useRouter();
  const [sortOrder, setSortOrder] = useState<SortOrder>({
    createdAt: 'asc',
    updatedAt: 'asc',
  });
  const [deleteId, setDeleteId] = useState('');

  const {
    handleDeleteError,
    deleteError,
    handleDeleteSuccess,
    deletResponse,
    deleteMutation,
  } = deleteTestimonial(deleteId);

  const {
    handleTestimonialsError,
    testimonialsResponse,
    handleTestimonialsSuccess,
    testimonialsMutate,
  } = getTestimonials({
    search: debouncedSearchString,
    page,
    limit: rowsPerPage,
    sortBy: activeColumn,
    sortOrder: sortOrder[activeColumn],
  });

  useEffect(() => {
    if (handleDeleteError) {
      handleSnackbarOpen('Error Deleting Testimonial');
      setisModalVisible(false);
      setDeleteId('')
    }
  }, [handleDeleteError]);

  useEffect(() => {
    if (handleTestimonialsError) {
      handleSnackbarOpen('Error Fetching Testimonials');
    }
  }, [handleTestimonialsError]);


  useEffect(() => {
    testimonialsMutate();
  }, [page, rowsPerPage, sortOrder, activeColumn, debouncedSearchString]);

  useEffect(() => {
    if (handleDeleteSuccess) {
      const { statusCode, data } = deletResponse?.data || {};
      if (statusCode === 200) {
        setisModalVisible(false);
        testimonialsMutate();
      }
    }
  }, [handleDeleteSuccess, deletResponse]);

  useEffect(() => {
    if (handleTestimonialsSuccess) {
      const { statusCode, data } = testimonialsResponse?.data || {};
      if (statusCode === 200) {
        setList(data.items);
        setTotalPages(data.totalPages);
        setTotalRows(data.totalItems);
      }
    }
  }, [handleTestimonialsSuccess, testimonialsResponse]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchString(searchString);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchString]);

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchString(value);
  };


  const handleCancel = () => {
    setisModalVisible(false);
    setDeleteId('');
  };

  const handleSnackbarOpen = (message: string) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  };

  const handleClearField = () => {
    setSearchString('');
  }

  const resetFilter = () => {
    setSearchString('');
  };

  useEffect(() => {
    if (handleDeleteSuccess) {
      // If the delete operation was successful, refetch the testimonials
      testimonialsMutate();
    }
  }, [handleDeleteSuccess]);

  const handleDelete = async () => {
    deleteMutation();
  };

  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    setPage(newPage + 1);
  };

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
    router.push('/admin/dashboard/testimonials/create');
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
        <CustomHeader label="Testimonials" color="#0f4a8a" textcolor="white" />
        <div className='searchBar flex-1'>
          <SearchField
            handleSearch={handleSearch}
            handleClearField={handleClearField}
            label="Search Testimonials"
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
              { id: 'author.name', label: 'Author Name' },
              { id: 'author.email', label: 'Email' },
              { id: 'author.title', label: 'Title' },
              { id: 'rating', label: 'Rating' },
              { id: 'createdAt', label: 'Created At' },
              { id: 'updatedAt', label: 'Updated At' },
            ]}
            enableSort={true}
            handleSort={handleSort}
            cellWidths={['30%', '', '', '', '30%', '30%', '195px']}
            activeColumn={activeColumn}
          />
          <TableBody>
            {list.map((testimonial: Testimonial, index: number) => {
              const Ctime = dayjs(testimonial.createdAt).format('YYYY-MM-DD hh:mm A');
              const Utime = dayjs(testimonial.updatedAt).format('YYYY-MM-DD hh:mm A');
              const isEvenRow = index % 2 === 0;
              return (
                <TableRow key={testimonial.id} style={{ backgroundColor: isEvenRow ? '#F7F7F7' : '#FFFFFF' }}>
                  <TableCell className="table-cell">{testimonial.author.name}</TableCell>
                  <TableCell className="table-cell">{testimonial.author.email}</TableCell>
                  <TableCell className="table-cell">{testimonial.author.title}</TableCell>
                  <TableCell className="table-cell">{testimonial.rating}</TableCell>
                  <TableCell className="table-cell">{Ctime}</TableCell>
                  <TableCell className="table-cell">{Utime}</TableCell>
                  <TableCell className="table-cell">
                    <IconButton
                      onClick={() => {
                        router.push('/admin/dashboard/testimonials/edit/' + testimonial.id);
                      }}
                      aria-label="Edit"
                      sx={{
                        color: '#61CD7F',
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      onClick={() => {
                        setisModalVisible(true)
                        setDeleteId(testimonial.id);
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
              );
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
      </div>
    </>
  );
}
