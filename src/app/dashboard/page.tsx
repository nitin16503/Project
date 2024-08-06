"use client"
import React, { useEffect, useState } from 'react'
import Report from '@/src/components/report/report'
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import billingIcon from '../../assets/images/billingIcon.svg'
import avarageTimeIcon from '../../assets/images/avarageTimeIcon.svg'
import addIcon from '../../assets/images/add.svg'
import turnAroundTimeIcon from '../../assets/images/turnAroundTimeIcon.png'
import blueIcon from '../../assets/images/blueIcon.svg'
import tbdIcon from '../../assets/images/tbdIcon.png'
import yellowIcon from '../../assets/images/yellowIcon.svg'
import pinkIcon from '../../assets/images/pinkIcon.svg'
import redIcon from '../../assets/images/redIcon.svg'
import purpleIcon from '../../assets/images/purpleIcon.svg'
import lightGreenIcon from '../../assets/images/lightGreenIcon.svg'
import greenishBlueIcon from '../../assets/images/greenishBlueIcon.svg'
import darkOrangeIcon from '../../assets/images/darkOrangeIcon.svg'
import scanIcon from '../../assets/images/scanIcon.svg'
import reviewIcon from '../../assets/images/reviewIcon.png'
import processingIcon from '../../assets/images/processingIcon.png'
import radiologistReviewIcon from '../../assets/images/radiologistReviewIcon.png'
import reportIcon from '../../assets/images/reportIcon.png'
import accuracyIcon from '../../assets/images/accuracyIcon.png'
import Group from '../../assets/images/Group.png'
import time from '../../assets/images/time.png'
import critical from '../../assets/images/critical.png'
import Groups from '../../assets/images/Groups.png'
import ratingIcon from '../../assets/images/ratingIcon.png'
import Card from '../../components/cards/cards'
import { getUserInfo } from '@/src/utils/helper';
import Loader from '@/src/components/loader/loader';
import { patientActionCardType } from '@/src/utils/types';
import PatientReports from '@/src/components/patientReports/report';
import { capitalizeEachWord } from '@/src/utils/helper';
import Button from '@/src/components/button/button';
import { syncReportMutation } from '@/src/api/scantest';
import { AxiosError } from 'axios';
import { ApiResponse } from '@/src/utils/types';

const page = () => {

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [level, setLevel] = useState('');
  const [patientName, setPatientName] = useState('')

  useEffect(() => {
    // Read the cookie on the client side
    const level = getUserInfo('level') || '';
    const name = getUserInfo('name') || '';
    if (level) {
      // Update state with the cookie value
      setLevel(level);
      setIsLoading(false)
    }
    if (name) {
      setPatientName(name)
    }
  }, []);

  const handleSync = () => {
    syncMutate()
  }

  const { isError,
    error,
    isSuccess,
    response,
    status,
    syncMutate, } = syncReportMutation();

  useEffect(() => {
    if (response) {
      const { statusCode, data } = response?.data || {};
      if(statusCode===200){
        window.location.reload();
      }
    }
  }, [response]);

  useEffect(() => {
    if (error) {
      const { statusCode, message } = (error as AxiosError<ApiResponse>)?.response?.data ?? {};
      console.log("response error==>", statusCode, message )
    }
  }, [error]);

  return (
    <>
      {!isLoading ?
        (
          <>
            {
              level != 'patient' ?
                (
                  <div className='dashboard gap-5 w-full flex flex-1 flex-col'>
                     {false && <Button
                        type="button"
                        label="Sync PAC Report"
                        onClick={() => handleSync()}
                        btnStyle={{
                          color: '#fff',
                          borderRadius: '10px',
                          height: '40px',
                          backgroundColor: '#0F4A8A',
                          width: '10%',
                        }}
                      />}
                    <div className='boxParent flex flex-1 '>
                      <div className="parentCard flex flex-col">
                        {(level == 'radiologistAdmin' || level == 'radiologistFrontDesk')
                          &&
                          <>
                            <div className="subParentCard flex flex-1">
                              {(level == 'radiologistAdmin' || level == 'radiologistFrontDesk')
                                &&
                                <Card title="Total CT Scan" count={12} colorIcon={blueIcon} mainIcon={scanIcon} />
                              }
                              {(level == 'radiologistAdmin' || level == 'radiologistFrontDesk')
                                &&
                                <Card title="Radiologist Review" count={8} colorIcon={redIcon} mainIcon={radiologistReviewIcon} />
                              }
                              {level == 'radiologistAdmin'
                                &&
                                <Card title="Users Rating" count={4.5} colorIcon={yellowIcon} mainIcon={ratingIcon} />
                              }
                            </div>
                            <div className="subParentCard flex flex-1">
                              {(level == 'radiologistAdmin' || level == 'radiologistFrontDesk')
                                &&
                                <Card title="Pending Review" count={12} colorIcon={darkOrangeIcon} mainIcon={reviewIcon} />
                              }
                              {(level == 'radiologistAdmin' || level == 'radiologistFrontDesk')
                                &&
                                <Card title="Completed Reports" count={4} colorIcon={greenishBlueIcon} mainIcon={reportIcon} />
                              }
                            </div>
                            <div className="subParentCard flex flex-1">
                              {(level == 'radiologistAdmin' || level == 'radiologistFrontDesk')
                                &&
                                <Card title="AI Processing" count={12} colorIcon={lightGreenIcon} mainIcon={processingIcon} />
                              }
                              {level == 'radiologistAdmin'
                                &&
                                <Card title="AI Accuracy" count="60%" colorIcon={purpleIcon} mainIcon={accuracyIcon} />
                              }
                              {level == 'radiologistFrontDesk'
                                &&
                                <Card title="TBD" count={'X'} colorIcon={purpleIcon} mainIcon={tbdIcon} />
                              }
                            </div>
                          </>
                        }
                        {level == 'radiologist'
                          &&
                          <>
                            <div className="subParentCard flex flex-1">
                              {level == 'radiologist'
                                &&
                                <Card title="Total Patients" count={12} colorIcon={blueIcon} mainIcon={Group} />
                              }
                              {level == 'radiologist'
                                &&
                                <Card title="Completed Reports" count={4} colorIcon={greenishBlueIcon} mainIcon={reportIcon} />
                              }
                            </div>
                            <div className="subParentCard flex flex-1">
                              {level == 'radiologist'
                                &&
                                <Card title="Pending" count={3} colorIcon={yellowIcon} mainIcon={reviewIcon} />
                              }
                              {level == 'radiologist'
                                &&
                                <Card title="In Queue" count={9} colorIcon={purpleIcon} mainIcon={Groups} />
                              }
                            </div>
                            <div className="subParentCard flex flex-1">
                              {level == 'radiologist'
                                &&
                                <Card title="AI Coverage" count={12} colorIcon={lightGreenIcon} mainIcon={processingIcon} />
                              }
                              {level == 'radiologist'
                                &&
                                <Card title="Avg. AI Processing Time" count="04:12" colorIcon={yellowIcon} mainIcon={time} />
                              }
                            </div>
                            <div className="subParentCard flex flex-1">
                              {level == 'radiologist'
                                &&
                                <Card title="Critical" count={2} colorIcon={redIcon} mainIcon={critical} />
                              }
                              {level == 'radiologist'
                                &&
                                <Card title="Your Report Processing Time" count="07: 05" colorIcon={pinkIcon} mainIcon={accuracyIcon} />
                              }

                            </div>
                          </>
                        }
                      </div>
                      {level == 'radiologistAdmin'
                        &&
                        <div className='parentInfoCard flex flex-col items-center'>
                          <div className='infoCard'>
                            <div className="infoIconContainer orange-color">
                              <Image
                                src={turnAroundTimeIcon}
                                alt={`Image`}
                                width={34} //-32
                                height={42}
                              />
                            </div>
                            <div className="textContainerCard flex ">
                              <p className="infoText">Turn Around Time</p>
                              <p className="infoCountText">04:12 mins</p>
                            </div>
                          </div>
                          <div className='infoCard'>
                            <div className="infoIconContainer green-color">
                              <Image
                                src={billingIcon}
                                alt={`Image`}
                                width={34} //-32
                                height={42}
                              />
                            </div>
                            <div className="textContainerCard flex ">
                              <p className="infoText">Billing</p>
                              <p className="infoCountText">11k USD</p>
                            </div>
                          </div>
                          <div className='infoCard'>
                            <div className="infoIconContainer blue-color">
                              <Image
                                src={avarageTimeIcon}
                                alt={`Image`}
                                width={34} //-32
                                height={42}
                              />
                            </div>
                            <div className="textContainerCard flex ">
                              <p className="infoText">Avg Report Processing Time</p>
                              <p className="infoCountText">07:05 mins</p>
                            </div>
                          </div>
                        </div>
                      }
                      {level == 'radiologistFrontDesk'
                        &&
                        <div
                          onClick={() => router.push('/dashboard/patients/add')}
                          className="patientCardBox flex justify-center items-center">
                          <div className="patientCard flex justify-center items-center">
                            <Image
                              src={addIcon}
                              width={62}
                              alt="AddIcon"
                              height={62}
                            />
                            <div className="patientCardtext">
                              Add Patient/Scan Test
                            </div>
                          </div>
                        </div>
                      }
                    </div>
                    <Report />
                  </div>
                ) :
                <div className='dashboard gap-5 w-full flex flex-1 flex-col'>
                  <PatientDash name={patientName} />
                  <PatientReports/>
                </div>

            }
          </>
        )

        :
        <Loader />}
    </>
  )
}

export default page


const PatientDash: React.FC<{ name: string }> = ({ name }) => {
  return (
    <>
      <div className="patientDash flex flex-col justify-center items-center w-full">
        <div className="patientName">
          Hello, {capitalizeEachWord(name)}
        </div>
        {/* <div className="actionArea flex flex-row flex-wrap justify-start w-full ">
          <ActionCard title='Recent Appointment' name='Dr Sher Singh Rana'
            subTitle='On 28 Sept 23- 02:49AM' icon={CalenderImg} color='rgba(15, 74, 138, 0.1)' />
          <ActionCard title='Recent Appointment' name='Dr Sher Singh Rana'
            subTitle='On 28 Sept 23- 02:49AM' icon={CalenderImg} color='rgba(15, 74, 138, 0.1)' />
          <ActionCard title='Recent Appointment' name='Dr Sher Singh Rana'
            subTitle='On 28 Sept 23- 02:49AM' icon={CalenderImg} color='rgba(15, 74, 138, 0.1)' />
        </div> */}
      </div>
    </>
  )
}


const ActionCard: React.FC<patientActionCardType> = ({
  title, subTitle, icon, name, color
}) => {
  return (
    <>
      <div className="aCard flex flex-row items-start justify-center">
        <div className="aIcon" style={{ background: color }}>
          <Image
            src={icon}
            width={52}
            height={52}
            alt={title}
          />
        </div>
        <div className="aDetail">
          <div className="aTitle">
            {title}
          </div>
          <div className="aBox flex flex-col justify-start">
            {
              name && <div className="aName">
                {name}
              </div>
            }

            <div className="asubTittle">
              {subTitle}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}