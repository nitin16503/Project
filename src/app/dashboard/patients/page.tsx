"use client"

import React, { ChangeEvent, useEffect, useMemo, useState } from 'react';
import './patientlist.css';
import SearchField from '@/src/components/searchField/searchField';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { deletePatientMutation, getPatients } from '@/src/api/patients';
import { PatientListApiType, PatientListType } from '@/src/utils/types';
import DeleteIcon from '@mui/icons-material/Delete';
import Loader from '@/src/components/loader/loader';
import { useRouter } from 'next/navigation';
import { usePathname } from 'next/navigation';
import CustomModal from '@/src/components/modal/modal';
import AddIcon from '@mui/icons-material/Add';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { getPatientTestsById } from '@/src/api/scantest';
import { ApiResponse } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { formatDateTime } from '@/src/utils/helper';
import Button from '@/src/components/button/button';
import { getUserInfo } from '@/src/utils/helper';

const PatientList: React.FC = () => {

  const router = useRouter();
  const path = usePathname();
  const [level, setLevel] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchString, setSearchString] = useState('');
  const [totalPages, setTotalPages] = useState(1);
  const [patientSelected, setPatientSelected] = useState('');
  const [patientTestList, setPatientTestList] = useState([]);
  const [debouncedSearchString, setDebouncedSearchString] = useState('');
  const [isDeleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleteSuccess, setDeleteSuccess] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<{ id: string, patientId: string }>({ id: '', patientId: '' });
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const [accordionLoader, setAccordionLoader] = useState(false);
  const {
    testDetail,
    errorTestDetail,
    loadingTestDetail,
    isSuccessTestDetail,
    isErrorTestDetail,
    refetchAllTests
  } = getPatientTestsById({ patientId: patientSelected, page: currentPage });

  const handleChange = (index: number, patientId: string) => () => {
    setAccordionLoader(true)
    // Toggle the accordion by updating the state
    setExpandedIndex((prevIndex) => (prevIndex === index ? null : index));
    setPatientSelected((prevIndex) => (prevIndex === patientId ? '' : patientId))
  };

  useEffect(() => {
    // Read the cookie on the client side
    const level = getUserInfo('level') || '';
    if (level) {
      // Update state with the cookie value
      setLevel(level);
    }
  }, []);

  useEffect(() => {
    if (isSuccessTestDetail) {
      const { statusCode, message, data } = testDetail?.data || {};
      if (statusCode == 200) {
        setAccordionLoader(false)
        if (data != null) {
          setPatientTestList(data?.items)
        }
      }
    }
    if (isErrorTestDetail) {
      const { statusCode, data, message } = (errorTestDetail as AxiosError<ApiResponse>)?.response?.data || {};
      console.log(message, statusCode, data)
      setAccordionLoader(false)
    }
  }, [testDetail, errorTestDetail]);

  useEffect(() => {
    if (patientSelected != '') {
      refetchAllTests()
    }
  }, [patientSelected])

  useEffect(() => {
    if (expandedIndex == null) {
      setPatientTestList([])
    }
  }, [expandedIndex])

  const {
    patientsList,
    errorPatients,
    isPatientListLoaded,
    isSuccessPatients,
    isErrorPatients,
    refetchAllPatients,
  } = getPatients({ page: currentPage, search: debouncedSearchString });
  const {
    isDeletePatientError,
    deletePatientError,
    isDeletePatientSuccess,
    deletePatientResponse,
    deletePatientMutate,
  } = deletePatientMutation();

  const paginatedPatients: PatientListType[] = useMemo(() => {
    if (isSuccessPatients && patientsList) {
      setTotalPages(patientsList.data.data.totalPages);
      return patientsList.data.data.items.map((item: PatientListApiType) => ({
        name: `${item.firstName} ${item.lastName}`,
        patientId: item.patientId,
        id: item.id,
        email: item.email,
        phoneNo: item.phoneNo,
        previousPrescription: 'Yes', // Assuming this is a static value for all patients
      }));
    }
    return [];
  }, [isSuccessPatients, patientsList]);

  useEffect(() => {
    refetchAllPatients();
  }, [isDeleteSuccess])

  useEffect(() => {
    if (isDeletePatientSuccess) {
      setDeleteSuccess(true);
    }
  }, [isDeletePatientSuccess, isDeletePatientError])

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);
    refetchAllPatients();
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchString(searchString);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchString]);

  useEffect(() => {
    refetchAllPatients();
  }, [debouncedSearchString])

  const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    setSearchString(value);
  };
  const handleDeleteBtnClick = (id: string, patientId: string) => {
    setSelectedPatientId({ id, patientId });
    setDeleteDialogOpen(true);
  };
  const handleCancel = () => {
    setDeleteDialogOpen(false);
    setDeleteSuccess(false)
  };
  const handleDelete = () => {
    deletePatientMutate(selectedPatientId['id']);
    setSelectedPatientId({ id: '', patientId: '' });
  }
  const handleEdit = (userId: string) => {
    const newPath = `${path}/edit/${userId}`;
    router.push(newPath);
  };

  const handleAddTest = (phoneNo: number) => {
    const newPath = `${path}/add?number=${encodeURIComponent(phoneNo)}`;
    router.push(newPath);
  };

  const handleClearField = () => {
    setSearchString('');
  }

  return (
    <>
      {!isPatientListLoaded ?
      <div className='w-full'> 
        {level == 'radiologistFrontDesk' && <div className="w-full flex justify-end mb-5">
          <Button
            label="+ Add New Patient"
            onClick={()=>{ router.push(`${path}/add`)}}
            type='button'
            btnStyle={{
              color: '#f0a400',
              backgroundColor: '#fff',
              width: "176.8px",
              height: "60px"
            }}
            disabled={false}
          />
        </div>}
        <div className='patientListContainer w-full'>
          <div className='headingContainer'>
            <p className='tableHeading'>Patients List</p>
          </div>
          <div className='w-full bg-white'>
            <SearchField handleSearch={handleSearch} handleClearField={handleClearField}/>
          </div>
          <div className='w-full'>
            {paginatedPatients.length > 0 &&
            <Grid container className='headingBlock'>
              {/* Patient ID */}
              <Grid item sx={{ width: '15%' }}>
                <Typography className='MuiTypography-root hText'>
                  Patient ID
                </Typography>
              </Grid>
              {/* Patient Name */}
              <Grid item sx={{ width: '30%' }}>
                <Typography className="MuiTypography-root hText">
                  Patient Name
                </Typography>
              </Grid>
              {/* Email */}
              <Grid item sx={{ width: '25%' }}>
                <Typography className='MuiTypography-root hText'>
                  Email
                </Typography>
              </Grid>
              {/* Phone Number */}
              <Grid item sx={{ width: '20%' }}>
                <Typography className='MuiTypography-root hText'>
                  Phone Number
                </Typography>
              </Grid>
              {/* Action */}
              {level == 'radiologistFrontDesk' &&
              <Grid item sx={{ width: '10%' }}>
                <Typography className='MuiTypography-root hText'>
                  Action
                </Typography>
              </Grid>}
            </Grid>}
            {
              paginatedPatients.length > 0 &&
              (
                paginatedPatients.map((patient, index) => (
                  <Accordion
                    key={index}
                    expanded={index === expandedIndex}
                    onChange={handleChange(index, patient.id)}
                  >
                    <AccordionSummary
                      expandIcon={null}
                      aria-controls={`panel${index + 1}-content`}
                      id={`panel${index + 1}-header`}
                      sx={{ backgroundColor: index % 2 === 0 ? '#F7F7F7' : '#FFFFFF', padding: '8px' }}
                    >
                      <Grid container>
                        <Grid item sx={{ width: '15%' }}>
                          <Typography className='MuiTypography-root cText'>
                            {patient.patientId}
                          </Typography>
                        </Grid>
                        <Grid item sx={{ width: '30%' }}>
                          <Typography className='MuiTypography-root cText'>
                            {patient.name}
                          </Typography>
                        </Grid>
                        <Grid item sx={{ width: '25%' }}>
                          <Typography className='MuiTypography-root cText'>
                            {patient.email}
                          </Typography>
                        </Grid>
                        <Grid item sx={{ width: '20%' }}>
                          <Typography className='MuiTypography-root cText'>
                            {patient.phoneNo}
                          </Typography>
                        </Grid>
                        <Grid item sx={{ width: '10%',display: 'flex', justifyContent:'space-around' }}>
                          {level == 'radiologistFrontDesk'  && <span onClick={(event) => { event.stopPropagation(); handleAddTest(patient?.phoneNo) }}><AddIcon style={{ color: '#0F4A8A' }}/></span>}
                          <ExpandMoreIcon />
                        </Grid>
                      </Grid>
                    </AccordionSummary>
                    <AccordionDetails>
                      {accordionLoader ? <Loader /> :
                        (patientTestList.length > 0 && expandedIndex == index) ?
                          <TestCard customKey={index} patientTestList={patientTestList} /> :
                          null
                      }
                    </AccordionDetails>
                  </Accordion>
                ))
              )
            }
            {(paginatedPatients.length == 0 && !isPatientListLoaded) && (
              <div className="w-full">
                <div className="user-item flex w-full">
                  <p className="no-record-text">No Patient Found</p>
                </div>
              </div>
            )
            }
            {paginatedPatients.length > 0 && (
              <Stack spacing={2} className="pagination-container">
                <Pagination count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange} />
              </Stack>
            )}
          </div>
          {/* Dialog for confirming deletion */}
          <CustomModal
            isVisible={isDeleteDialogOpen}
            handleCancelButton={handleCancel}
            modalTitle="Confirm Deletion?"
            modalMessage="Are you sure you would like to delete this patient? This action cannot be undone."
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
        </div>
      </div> :
        <Loader />
      }
    </>
  );
};


interface TestCardType {
  patientTestList: any;
  customKey: number;
}

const TestCard: React.FC<TestCardType> = (
  {
    patientTestList,
    customKey
  }
) => {
  return (
    <div key={customKey}>
      <Box width="100%" border="1px solid #ccc">
        <Grid container className='headingTestBlock'>
          <Grid item xs={3} sm={2}>
            <Typography className='MuiTypography-root hText'>
              Test Id
            </Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography className='MuiTypography-root hText'>
              Test Name
            </Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography className='MuiTypography-root hText'>
              Scan Time
            </Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography className='MuiTypography-root hText'>
              Radiologist
            </Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography className='MuiTypography-root hText'>
              Report Status
            </Typography>
          </Grid>
          <Grid item xs={3} sm={2}>
            <Typography className='MuiTypography-root hText'>
              Priority
            </Typography>
          </Grid>
        </Grid>
        {patientTestList.map((test: any, index: number) => (
          <Grid key={index} container className="testContainer">
            <Grid item xs={3} sm={2}>
              <Typography className='MuiTypography-root cText testdata'>
                {test.refNumber}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Typography className='MuiTypography-root cText testdata'>
                {test.testName}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Typography className='MuiTypography-root cText testdata'>
                {formatDateTime(test.startDate)}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Typography className='MuiTypography-root cText testdata'>
                {/* {test.testName} */}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Typography className='MuiTypography-root cText testdata'>
                {test.status}
              </Typography>
            </Grid>
            <Grid item xs={3} sm={2}>
              <Typography className='MuiTypography-root cText testdata'>
                {test.priority}
              </Typography>
            </Grid>
          </Grid>
        ))}
      </Box>
    </div>
  )
}



export default PatientList;
