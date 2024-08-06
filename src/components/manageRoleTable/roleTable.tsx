import React, { ChangeEvent, useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import './roleTable.css';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import { deleteUserMutation, usegetAllUsers, searchUsers } from '@/src/api/dashboard';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/src/utils/types';
import Loader from '../loader/loader';
import SearchField from '../searchField/searchField';
import { userLevelEnum } from '@/src/utils/config';
import CustomModal from '../modal/modal';

interface User {
  firstName: string;
  lastName: string;
  userLevel: string;
  id: string;
}

function RoleTable() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Adjust the number of items per page as needed
  const [userToDelete, setUserToDelete] = useState<User | null>(null);
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleteSuccess, setDeleteSuccess] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const { data, error, isLoading, refetchUsers } = usegetAllUsers(currentPage);
  const router = useRouter();
  const path = usePathname();
  const [userList, setUserList] = useState([]);
  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const {
    isDeleteUserError,
    deleteUserError,
    isDeleteUserSuccess,
    deleteUserResponse,
    deleteUserMutate,
  } = deleteUserMutation();

  const [searchString, setSearchString] = useState('');
  const { searchResult, searchError, searchSuccess, refetchSearch } = searchUsers(debouncedSearchString);

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

  useEffect(() => {
    refetchSearch();
  }, [debouncedSearchString]);

  useEffect(() => {
    if (searchSuccess) {
      const { data: responseData } = searchResult?.data;
      setTotalPages(responseData.totalPages);
      setUserList(responseData.items);
    }
  }, [searchResult]);

  useEffect(() => {
    if (isDeleteSuccess) {
      // Manually trigger a refetch when isDeleteSuccessModalOpen changes
      refetchUsers();
    }
  }, [isDeleteSuccess, refetchUsers]);

  useEffect(() => {
    if (!isLoading && !error) {
      const { statusCode, data: responseData } = data?.data;
      if (statusCode === 200) {
        setUserList(responseData.items);
      }
    }
  }, [isLoading, data, error]);

  useEffect(() => {
    if (isDeleteUserError) {
      const { statusCode, message, data } = (deleteUserError as AxiosError<ApiResponse>)?.response?.data || {};
      if (statusCode === 400) {
        console.log(data, 'error');
      }
    } else if (isDeleteUserSuccess) {
      const { statusCode, message } = deleteUserResponse?.data || {};
      if (statusCode === 200) {
        setDeleteSuccess(true);
      }
    }
  }, [isDeleteUserError, isDeleteUserSuccess, deleteUserError, deleteUserResponse]);

  const handleEdit = (userId: string) => {
    const newPath = `${path}/edit/${userId}`;
    router.push(newPath);
  };

  const handleDeleteBtnClick = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const handleCancel = () => {
    setDeleteDialogOpen(false)
    setDeleteSuccess(false)
  };

  const handleDelete = ()=>{
      deleteUserMutate(userToDelete?.id || '');
      setUserToDelete(null);
  }

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    console.log(page, 'page');
    setCurrentPage(page);
    refetchUsers();
  };

  const handleClearField = () => {
    setSearchString('');
  }

  return (
    <>
      { 
        !isLoading ? (
          <div className="userList w-full">
            <div className="manageRolesHeading w-full">
              <p>Manage Users</p>
            </div>
            <div className="search w-full bg-white">
              <SearchField handleSearch={handleSearch}  handleClearField={handleClearField} />
            </div>
            <div className="list">
              {userList.length > 0 ?
                userList.map((user: User) => (
                  <div key={user.id} className="user-item flex w-full">
                    <div className="fullName">
                      {user.firstName} {user.lastName}
                    </div>
                    <div className="userLevel">
                      <div className="txtBg">
                        <div className="txt">
                          {userLevelEnum[user.userLevel]}
                        </div>
                      </div>
                    </div>
                    <div className="actionButtons flex">
                      <Button
                        variant="outlined"
                        style={{
                          color: 'white',
                          background: '#0f4a8a',
                          borderColor: '#0f4a8a',
                        }}
                        startIcon={<EditIcon style={{ color: 'white' }} />}
                        onClick={() => handleEdit(user.id)}
                      />
                      <Button
                        variant="outlined"
                        style={{
                          color: 'red',
                          borderColor: 'grey',
                          background: 'white',
                        }}
                        startIcon={<DeleteIcon style={{ color: 'grey' }} />}
                        onClick={() => handleDeleteBtnClick(user)}
                      />
                    </div>
                    {/* Add other user properties as needed */}
                  </div>
                ))
                :
                <div className="user-item flex w-full">
                  <p className="no-record-text">No Users Found</p>
                </div>
              }
            </div> 
            {
              userList.length > 0 && (
                <Stack spacing={2} className="pagination-container">
                  <Pagination
                    count={totalPages}
                    page={currentPage}
                    onChange={handlePageChange}
                  />
                </Stack>
              )
            }
          </div>
        ) : <Loader />
      }
      {/* Delete Confirmation Modal */}
      <CustomModal
        isVisible={isDeleteDialogOpen}
        handleCancelButton={handleCancel}
        modalTitle="Confirm Deletion?"
        modalMessage="Are you sure you would like to delete this user? This action cannot be undone."
        showButtons={true}
        primaryButtonText="Delete"
        secondaryButtonText="Cancel"
        primaryButtonColor="red"
        secondaryButtonColor="#FFF"
        handlePrimaryButton={handleDelete}
        handleSecondaryButton={handleCancel}
        success={isDeleteSuccess}
        icon={() => <DeleteIcon style={{ color: 'grey', margin: 10 }} />}
        />
    </>
  );
}

export default RoleTable;
