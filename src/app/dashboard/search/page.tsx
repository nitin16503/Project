"use client"

import SearchField from '@/src/components/searchField/searchField'
import React, { ChangeEvent, useEffect, useState } from 'react'
import './search.css'
import xray1 from '../../../assets/images/xray1.svg'
import { URProps, reportData } from '@/src/utils/types'
import Image from 'next/image'
import { Visibility, Download } from '@mui/icons-material';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
import { getGlobalSearch } from '@/src/api/dashboard'
import { RootState } from '@/src/store/rootReducer'
import { useDispatch, useSelector } from 'react-redux';
import { setSearchQuery, clearSearchQuery } from '@/src/store/searchSlice'
import { useSearchParams } from "next/navigation";

export default function GlobalSearch() {

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const [totalPages, setTotalPages] = useState(1);
  const endIndex = startIndex + itemsPerPage;
  const dispatch = useDispatch();
  const searchParams = useSearchParams();
  const searchQuery = searchParams?.get("query");
  const searchString = useSelector((state: RootState) => state.search?.query !== null ? state.search?.query : searchQuery);
  const [debouncedSearchString, setDebouncedSearchString] = useState(searchString);
  const [reportData, setReportData] = useState<reportData[]>([]);
  const {
    searchResults,
    errorGlobalSearch,
    isGlobalSearchLoading,
    isGlobalSearchSuccess,
    isErrorGlobalSearch,
    refetchGlobalSearch,
  } = getGlobalSearch({
    page: currentPage,
    search: debouncedSearchString == null ? '' : debouncedSearchString
  });

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedSearchString(searchString);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [searchString]);

  useEffect(() => {
    refetchGlobalSearch();
  }, [debouncedSearchString]);

  useEffect(() => {
    if (isGlobalSearchSuccess) {
      var data: reportData[] = [];
      searchResults?.data?.data.items.forEach((item: any) => {
        // Extract required fields and create new format
        const newItem = {
          name: `${item.patient.firstName} ${item.patient.lastName}`,
          userId: item.patient.patientId,
          overview: `CT scan of ${item.testName}, Possible sinus infection also.`,
          doctorsNote: 'Cracked frontal lobe, infection, Nosea when sitting up, and many more she need to be more carefull and she must eat  healthy foods',
          status: item.status,
          priority: item.priority,
          testName: item?.testName,
        };
        // Push the new item to the 'data' array
        data.push(newItem);
      });
      setReportData(data);
    }
    else if (isErrorGlobalSearch) {
      console.log('error');
    }
  }, [searchResults, errorGlobalSearch])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleClearField = () => {
    dispatch(clearSearchQuery());
  }

  const handlePageChange = (event: ChangeEvent<unknown>, page: number) => {
    setCurrentPage(page);;
  };

  return (
    <div className="globalSearch flex flex-col justify-center items-center w-full">
      <div className="filters w-full flex flex-row justify-center ">
        <div className="gsSearch">
          <SearchField
            defaultValue={searchString == null ? '' : searchString}
            handleClearField={handleClearField}
            handleSearch={handleSearch} customStyles={{ background: '#fff', borderRadius: '10px !important' }} />
        </div>
      </div>
      <div className="list w-full flex flex-col">
        {(reportData.length > 0 && searchString != '') &&
          reportData.map((userInfo: URProps, key) => (
            <div key={key}>
              <UserReportCard
                key={userInfo.userId}
                name={userInfo.name}
                userId={userInfo.userId}
                overview={userInfo.overview}
                doctorsNote={userInfo.doctorsNote}
                status={userInfo.status}
                priority={userInfo.priority}
                testName={userInfo?.testName}
              />
            </div>
          ))}
        {(reportData.length == 0 || searchString == '') &&
          <div className="noRecord">
            No Records Found
          </div>
        }
      </div>
      {
        (reportData.length > 0 && searchString != '') && (
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
  )
}

const UserReportCard: React.FC<URProps> = ({
  name,
  userId,
  overview,
  doctorsNote,
  status,
  priority,
  testName
}) => {
  
  const handleEyeClick = () => {
    // Handle the click event for the eye icon
    console.log('Eye icon clicked');
  };

  const handleDownloadClick = () => {
    // Handle the click event for the download icon
    console.log('Download icon clicked');
  };

  return (
    <div className="user-report-card flex" key={userId}>
      <div className="user-left flex flex-row">
        <div className="reportImg">
          <Image
            src={xray1}
            alt={`Image Dicom`}
            width={102}
            height={102}
            className="reportImage"
          />
        </div>
        <div className="reportInfo flex items-start">
          <div className="userName">
            {name}
          </div>
          <div className="user-info flex">
            <div className="user-text flex flex-row">
              Test :
              <span className="id">{testName || '-'}</span>
            </div>
            <div className="user-text flex flex-row">
              User ID:
              <span className="id">{userId}</span>
            </div>
            <div className="user-text flex flex-row">
              Status: <span className="status"
                style={{ color: status === 'In Progress' ? '#E54335' : priority === 'Ready' ? '#61CD7F' : '#F0A400' }}
              > {status}</span>
            </div>
            <div className="user-text flex flex-row">
              Priority:
              <span className="priority"
                style={{ color: priority === 'Medium' ? '#F0A400' : priority === 'High' ? '#E54335' : '#61CD7F' }}>
                {priority}
              </span>
            </div>

          </div>
          <div className="user-text flex flex-row">
            Overview:
            <span className="overveiw">
              {overview}
            </span>
          </div>
          <div className="user-text flex flex-row">
            Doctor's Note:
            <span className="notes">
              {doctorsNote}
            </span>
          </div>
        </div>
      </div>
      <div className="userRight flex flex-row items-center">
        <div className="eyeBox">
          <Visibility onClick={handleEyeClick} style={{ cursor: 'pointer', color: '#fff', width: '22px', height: '22px', marginBottom: '2px' }} />
        </div>
        <div className="downloadBox">
          <Download onClick={handleDownloadClick} style={{ cursor: 'pointer', color: '#F0A400', width: '35px', height: '35px', }} />
        </div>
      </div>
    </div>
  );
};
