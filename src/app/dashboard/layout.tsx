"use client"

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { sendGTMEvent } from '@next/third-parties/google'
import { useDispatch, useSelector } from 'react-redux';
import { Menu, MenuItem } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import './dashboard.css';
import Box from '@mui/material/Box';
import searchIcon from '../../assets/images/searchIcon.svg';
import notificationIcon from '../../assets/images/notificationIcon.svg';
import notificationIconActive from '../../assets/images/notificationIconActive.svg';
import profileIcon from '../../assets/images/profileIcon.png';
import LogoutIcon from '@mui/icons-material/Logout';
import { logoutMutation } from '@/src/api/user';
import { getUserInfo, updateUserInfo } from '@/src/utils/helper';
import { useRouter, usePathname } from 'next/navigation';
import { NotificationProps, NotificationTypes, SearchProps, CenterSelectProps, notificationMessageData } from '@/src/utils/types';
import CloseIcon from '@mui/icons-material/Close';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@/src/components/button/button';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { ApiResponse, FieldError } from '@/src/utils/types';
import { AxiosError } from 'axios';
import { setSearchQuery } from '@/src/store/searchSlice';
import { RootState } from '@/src/store/rootReducer';
import { useGetAllNotifications, useGetNotificationCount, useGetNotifications, useMarkNotificationReadMutation } from '@/src/api/notification';
import { disableNotificationAlert, updateCount } from '@/src/store/notification';
import { getTime } from '@/src/utils/helper';
import CustomModal from '@/src/components/modal/modal';
import AutocompleteInput from '@/src/components/AutocompleteInput/autocompleteInput';
import { Typography } from "@mui/material"
import Logo from '../../components/logo/logo';
import { centerMutation } from '@/src/api/user';
import { userLevelEnum } from '@/src/utils/config';
import { capitalizeEachWord } from '@/src/utils/helper';

const Layout = ({ children }: { children: React.ReactNode }) => {

  const dispatch = useDispatch();

  const [showNotification, setNotification] = useState(false);
  const [updateCenterModal, setUpdateCenterModal] = useState(false);
  const updatedCount = useSelector((state: RootState) => state.notification);
  const [notificationsCount, setNotificationsCount] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false)
  const router = useRouter();
  const path = usePathname();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { logout } = logoutMutation()
  const [center, setCenter] = useState({ id: '', name: '' });
  const [centerList, setCenterList] = useState([]);
  const [level, setLevel] = useState('')
  const pathname = usePathname()
  const [userName, setUserName] = useState('')
  const role = (level == 'admin' ? 'admin' : userLevelEnum['admin'])
  useEffect(() => {
    // Read the cookie on the client side
    const level = getUserInfo('level') || '';
    const center = getUserInfo('activeCenter');
    const centerList = getUserInfo('centerList');
    const name = getUserInfo('name') || '';
    if (level) {
      // Update state with the cookie value
      setLevel(level);
    }
    if (center) {
      setCenter(center)
    }
    if (centerList) {
      setCenterList(centerList)
    }
    if (name) {
      setUserName(name)
    }
  }, []);

  const {
    notificationCount,
    notificationCountError,
    isNotificationCountLoading,
    refetchNotificationCount,
  } = useGetNotificationCount();

  useEffect(() => {
    if (notificationCount) {
      const { statusCode, message, data } = notificationCount?.data || {};
      if (statusCode == 200) {
        setNotificationsCount(data?.count)
      }
    }
    if (notificationCountError) {
      const { statusCode, data, message } = (notificationCountError as AxiosError<ApiResponse>)?.response?.data || {};
    }
  }, [notificationCount])

  useEffect(() => {
    setTimeout(() => {
      refetchNotificationCount();
    }, 100);
  }, [updatedCount])

  const handleProfileClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleClick = (tab: string) => {
    if(!pathname.includes(tab)){
      sendGTMEvent({ event: 'tabClicked', value: `${tab} tab clicked` })
    }
    setIsModalVisible(false);
    router.push(`/dashboard/${tab}`)
  }
  const handleLogout = () => {
    //e.preventDefault();
    sendGTMEvent({ event: 'buttonClicked', value: 'Logout Button clicked' })
    logout();
  };
  const handleMarkasRead = () => {
    console.log('click on mark as all read');
  }
  const handleNotificationIcon = () => {
    setNotification(!showNotification)
  }

  const handleTypographyClick = () => {
    // Perform actions only if centerlist has more than one object
    if (centerList && centerList.length > 1) {
      setUpdateCenterModal(true);
    }
  };

  return (
    <div className="layoutContainer h-full">
      <div className="flex subLayoutContainer">
        <div className="subHeaderContainer justify-between items-center w-full flex">
          <Logo width={300} height={300} loggedIn={true} />
          <Typography
            variant="h6"
            className="subTittlea subTittleaLogged"
            style={{ cursor: centerList && centerList.length > 1 ? 'pointer' : 'default' }}
            onClick={handleTypographyClick}
          >{center?.name}</Typography>
          <div className="flex space-x-4">
            {level != 'patient' &&
              <>
                <p className="text tab" onClick={() => { handleClick('patients') }}>Patients</p>
                <p className="text tab" onClick={() => { handleClick('reports') }}>Reports</p>
                <p className="text tab" onClick={() => { handleClick('help') }}>Help</p>
                <div className="search tab" onClick={() => {
                  setIsModalVisible(!isModalVisible)
                }}>
                  <Image src={searchIcon} alt={`Image`} width={24} height={24} className="searchIcon" />
                </div>
                <div className="notificationTab tab" style={{ position: 'relative' }} >
                  {
                    showNotification ? (
                      <Image
                        src={notificationIconActive}
                        alt={`Image`}
                        width={24}
                        height={24}
                        onClick={handleNotificationIcon}
                        className="notificationIcon"
                      />
                    ) : (
                      <Image
                        src={notificationIcon}
                        alt={`Image`}
                        width={24}
                        height={24}
                        onClick={handleNotificationIcon}
                        className="notificationIcon"
                      />
                    )
                  }
                  {
                    notificationsCount != 0 && (
                      <div className="notificationNumber">
                        {notificationsCount}
                      </div>
                    )
                  }
                  {showNotification && (
                    <Notifications setNotification={setNotification} markAllAsRead={handleMarkasRead} />
                  )}
                </div>
              </>}
            {level != 'patient' &&
              <>
                <div className="profile tab" onClick={handleProfileClick}>
                  <Image src={profileIcon} alt={`Image`} width={24} height={24} className="profileIcon" />
                </div>
              </>
            }
            {level == 'patient' &&
              <div className="profile tab flex flex-row" onClick={handleLogout}>
                <p className="text tab" onClick={() => { handleClick('patients') }}>Logout</p>
                <LogoutIcon style={{ cursor: 'pointer', marginLeft: 10 }} />
              </div>}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              PaperProps={{
                style: {
                  maxHeight: 200,
                  width: 200,
                },
              }}
            >
              <MenuItem disabled sx={{
                '&.Mui-disabled': {
                  opacity: 1
                }
              }}>
                <Box sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center'
                }}>
                  <Typography sx={{
                    fontSize: '16px',
                    fontFamily: 'Noto-Sans-Regular',
                    color: '#0F4A8A'
                  }}>{capitalizeEachWord(userName)}</Typography>
                  <Typography sx={{
                    fontSize: '12px',
                    fontFamily: 'Noto-Sans-Regular',
                    color: '#0F4A8A'
                  }} >{userLevelEnum[level] ? userLevelEnum[level] : 'Admin'}</Typography>
                </Box>
              </MenuItem>
              {level == 'radiologistAdmin' &&
                <Link href={`/dashboard/users`} passHref>
                  <MenuItem onClick={handleClose}>Manage Users</MenuItem>
                </Link>}
              <Link href={`/dashboard/resetpassword`} passHref>
                <MenuItem onClick={handleClose}>Reset Password</MenuItem>
              </Link>
              {/* <Link href={`/dashboard/userprofile`} passHref> */}
              <MenuItem onClick={handleClose} disabled>User Profile</MenuItem>
              {/* </Link> */}
              {/* <Link href={`/dashboard/logout`}> */}
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
              {/* </Link> */}
            </Menu>
          </div>
        </div>
      </div>
      <NotificationAlert />
      <CenterSelect
        isModalVisible={updateCenterModal}
        setIsModalVisible={setUpdateCenterModal}
        selectedCenter={center}
        centerList={centerList}
      />
      <div className="contentContainer">
        <div className="subChildren w-full h-full flex justify-center items-start">
          {children}
        </div>
      </div>
      {
        path != '/dashboard/search' && <Search isModalVisible={isModalVisible} setIsModalVisible={setIsModalVisible} />
      }
    </div>
  );
};

export default Layout;

const Notifications: React.FC<NotificationProps> = ({ setNotification }) => {

  const dispatch = useDispatch();
  const updatedCount = useSelector((state: RootState) => state.notification);
  const [isData, setIsData] = useState(false);
  const [isInitial, setInitial] = useState(true);
  const [notificationData, setNotificationData] = useState<NotificationTypes[]>([]);
  const [tabValue, setTabValue] = useState(0);
  const popupRef = useRef<HTMLDivElement>(null);

  const {
    notificationsData,
    isNotificationSuccess,
    notificationError,
    isNotificationsLoading,
    isNotificationError,
    refetchNotifications,
  } = useGetNotifications({ read: tabValue == 1 ? true : false });
  const {
    allnotificationsData,
    allnotificationError,
    isallNotificationSuccess,
    isallNotificationError,
    isallNotificationsLoading,
    refetchallNotifications,
  } = useGetAllNotifications();

  const {
    markNotificationRead,
    isMarkingNotificationRead,
    markNotificationReadError,
    markNotificationReadErrorMessage,
    markNotificationReadSuccess,
    markNotificationReadData,
  } = useMarkNotificationReadMutation();

  useEffect(() => {
    if (isallNotificationSuccess) {
      const { statusCode, message, data } = notificationsData?.data || {};
      if (data?.items?.length > 0) {
        setIsData(true)
      }
      else if (data?.items?.length == 0) {
          setIsData(false)
      }
    }
    else if (isallNotificationError) {
      const { statusCode, data, message } = (notificationError as AxiosError<ApiResponse>)?.response?.data || {};
      console.log('Error in getting notification data', statusCode, message);
    }
  }, [allnotificationsData])

  useEffect(() => {
    if (markNotificationReadSuccess) {
      const { statusCode, message, data } = markNotificationReadData?.data || {};
      if (statusCode == 200) {
        dispatch(updateCount())
      }
    }
    else if (markNotificationReadError) {
      const { statusCode, data, message } = (markNotificationReadErrorMessage as AxiosError<ApiResponse>)?.response?.data || {};
      console.log('error in mark all notifications', statusCode);
    }
  }, [markNotificationReadData])

  useEffect(() => {
    if (isNotificationSuccess) {
      const { statusCode, message, data } = notificationsData?.data || {};
      if (data.items.length > 0) {
        const notificationData = data.items.map((item: any) => {
          let subject = '';
          if (item.type === 'type_1') {
            subject = `Patient ${item.params.patientName} created`;
          }
          else if (item.type === 'type_2') {
            subject = `New Test Scan - ${item.params.scanTestRefNumber} has been registered`;
          }
          else {
            subject = item.subject
          }
          return {
            id: item.id,
            message: subject,
            timestamp: item.createdAt,
            read: item.read,
            priority: item.priority
          };
        });
        setNotificationData(notificationData)
      }
      else if (data.items.length == 0) {
        setNotificationData([]);
      }
    }
    else if (isNotificationError) {
      const { statusCode, data, message } = (notificationError as AxiosError<ApiResponse>)?.response?.data || {};
      console.log('Error in getting notification data', statusCode, message);
    }
  }, [notificationsData])

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popupRef.current && !popupRef?.current?.contains(event.target as Node) && setNotification) {
        setNotification(false);
      }
    };

    if (setNotification) {
      document.addEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [setNotification, tabValue]);


  useEffect(() => {
    refetchNotifications();
  }, [updatedCount])

  useEffect(() => {
    refetchNotifications()
  }, [tabValue])


  const handleChangeTab = (event: any, newValue: number) => {
    setTabValue(newValue);
  };
  const handlemarkAllRead = () => {
    markNotificationRead([])
  }

  return (
    <div className="notification-popup" ref={popupRef} >
      <div className="notificationN flex flex-col">
        <div className="Notify">Notifications</div>
        {isData &&
          <Tabs
            value={tabValue}
            onChange={handleChangeTab}
            indicatorColor="primary"
            textColor="primary"
            variant="fullWidth"
            aria-label="notification tabs"
            TabIndicatorProps={{ style: { display: 'none' } }}
            sx={{
              '& .MuiTab-root.Mui-selected': {
                backgroundColor: ' #0F4A8A !important',
                color: 'white !important',
                padding: '4px 2px !important',
                borderRadius: '40px !important',
                width: ' 20px',
                height: '5px',
              }
            }}
          >
            <Tab label="Unread" />
            <Tab label="All" />
          </Tabs>
        }
        {
          notificationData.length > 0 ?
            <div className="notificationList flex flex-col">
              {
                notificationData?.map((notification, key) => (
                  <div key={key}>
                    <Message data={notification} />
                  </div>
                ))
              }
              <div className="markRead" onClick={handlemarkAllRead} style={{ color: '#0F4A8A', fontSize: '16px', alignSelf: 'center', fontWeight: '400' }}>
                Mark All Read
              </div>
            </div> : <div className="no-record-text">
              No Notifications
            </div>
        }
      </div>
    </div >
  );
}

// notification card
const Message: React.FC<notificationMessageData> = ({ data }) => {

  const dispatch = useDispatch();

  const {
    markNotificationRead,
    isMarkingNotificationRead,
    markNotificationReadError,
    markNotificationReadErrorMessage,
    markNotificationReadSuccess,
    markNotificationReadData,
  } = useMarkNotificationReadMutation();
  const notificationTime = getTime(data.timestamp) + ' ago';

  useEffect(() => {
    if (markNotificationReadSuccess) {
      const { statusCode, message, data } = markNotificationReadData?.data || {};
      if (statusCode == 200) {
        dispatch(updateCount())
      }
    }
    else if (markNotificationReadError) {
      const { statusCode, data, message } = (markNotificationReadErrorMessage as AxiosError<ApiResponse>)?.response?.data || {};
      console.log('error in mark notification as read', data);
    }
  }, [markNotificationReadData])

  const handleNotificationClick = (id: string) => {
    if (!data.read) {
      markNotificationRead([id])
    }
  }

  return (
    <>
      <div className={`notification-item flex flex-col row-5 justify-center items-start`} onClick={() => { handleNotificationClick(data.id) }}>
        <div className='flex flex-row gap-x-3 w-full justify-between items-start'>
          <div key={data.id} className={`notification-itemText ${data.read ? 'data.readed' : ''}`} >{data.message}</div>
          {!data.read && <div className={`${!data.read ? 'newNotification' : ''}`}>.</div>}
        </div>
        <div className={`time ${data.read ? 'readedTime' : ''}`}>{notificationTime}</div>
      </div>
    </>
  )
}

// global search
const Search: React.FC<SearchProps> = ({ isModalVisible, setIsModalVisible }) => {

  const dispatch = useDispatch();
  const router = useRouter();
  const searchQuery = useSelector((state: RootState) => state.search?.query);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchQuery(e.target.value));
  };

  const handleSearchClick = () => {
    setIsModalVisible(false);
    if (searchQuery !== null) {
      router.push(`/dashboard/search?query=${encodeURIComponent(searchQuery)}`);
    } else {
      router.push(`/dashboard/search`);
    }
  }

  return (
    <Modal
      open={isModalVisible}
      onClose={() => setIsModalVisible(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      BackdropProps={{
        invisible: true
      }}
    >
      <div className='modelSearch'>
        <TextField
          placeholder="Search"
          onChange={handleSearch}
          name="search"
          fullWidth
          autoFocus
          InputProps={{
            startAdornment: <SearchIcon style={{ color: 'grey' }} />,
            endAdornment: (
              <Button label='Search' type='button' disabled={(searchQuery == null || searchQuery == '') ? true : false} onClick={handleSearchClick} btnStyle={{
                minWidth: 'fit-content',
                padding: '6px 32px',
                color: 'white',
                height: '50px',
              }} />
            ),
            classes: {
              focused: 'custom-focused-border-color',
            },
            style: {
              // Set the border color to #ccc
              background: '#fff',
              borderRadius: '10px !important',
              boxShadow: '0 8px 14px rgba(0, 0, 0, 0.1), 0 -8px 14px rgba(0, 0, 0, 0.1), 8px 0 14px rgba(0, 0, 0, 0.1), -8px 0 14px rgba(0, 0, 0, 0.1)', // Add box shadow
              padding: '8px 14px',
            },
          }}
        />
      </div>
    </Modal>
  )
}

// notification alert
const NotificationAlert = () => {
  const { enableHighPriorityNotification: enableNotificationAlert, highPriorityNotificationData: data } = useSelector((state: RootState) => state.notification);
  const topPosition =100;
  const isData = Object.keys(data).length > 0;
  const dispatch = useDispatch();
  const handleClose = (id: string) => {
    dispatch(disableNotificationAlert(id));
  }

  return (
    <>
      {
        // add isData condtion and loop over data variable 
        isData && Object.values(data).map((item: any, index: number) => (
          <div className="alertBar" key={index} style={{ position: 'absolute', top: `${topPosition + index * 50}px` }}>
            <p className="alertText">New Report is available for Patient ID
              <span className="modifyLink">  {item?.refNumber}</span>
              .  Click here to
              <span className="modifyLink" onClick={() => { }}> View</span>
            </p>
            <CloseIcon className='closeIcon' style={{cursor: 'pointer'}} onClick={() => { handleClose(item._id) }} />
          </div>
        ))

      }
    </>
  )
}

const CenterSelect: React.FC<CenterSelectProps> = ({
  selectedCenter,
  centerList,
  isModalVisible,
  setIsModalVisible
}) => {

  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [select, setSelect] = useState({
    id: '',
    name: ''
  });
  const {
    isError,
    errorResponse,
    isSuccess,
    responseData,
    changeActiveCenterMutate,
  } = centerMutation();

  useEffect(() => {
    setSelect(selectedCenter)
  }, [selectedCenter])

  useEffect(() => {
    if (isSuccess) {
      const { statusCode, message, data } = responseData?.data || {};
      if (statusCode == 200) {
        setSuccess(true)
        updateUserInfo('activeCenter', data.activeCenter)
        console.log("success", message)
      }
    }
    if (isError) {
      const { message } = (errorResponse as AxiosError<ApiResponse>)?.response?.data || {};
      console.log("error", message)
      if (message) {
        setError(message);
      }
    }
  }, [responseData, errorResponse])

  const handlePrimaryButton = () => {
    changeActiveCenterMutate({
      centerId: select.id
    })
  }

  const handleCancelButton = () => {
    setIsModalVisible(false)
    if (success) {
      setSuccess(false)
      window.location.reload();
    } else {
      setSuccess(false)
    }
  }

  const handleChange = (newValue: any) => {
    setSelect(newValue)
    setError('')
  };

  return (
    <CustomModal
      isVisible={isModalVisible}
      handleCancelButton={handleCancelButton}
      modalTitle="Change Center"
      modalContent={() => {
        return (
          <>
            <div className='selectCenter'>
              <AutocompleteInput label="Select Center" list={centerList} defaultValue={selectedCenter} handleChange={handleChange} />
            </div>
            {error != '' && <p className='errorContent'>{error}</p>}
          </>
        )
      }}
      showButtons={true}
      primaryButtonText="Switch"
      secondaryButtonText="Cancel"
      primaryButtonColor="#0f4a8a"
      secondaryButtonColor="#FFF"
      handlePrimaryButton={handlePrimaryButton}
      handleSecondaryButton={handleCancelButton}
      success={success}
      successMessage={"Center changed successfully"}
    />
  )
}