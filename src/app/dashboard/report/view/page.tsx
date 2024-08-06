'use client'
import React, { useEffect, useRef, useState } from 'react'
import { PACS_URL, BACKEND_URL } from '@/src/utils/config';
import { useSearchParams } from 'next/navigation';
import { getUserInfo } from '@/src/utils/helper';
import { CustomModalProps } from '@/src/utils/types';
import { assignReviewerMutation, getAllRadiologist } from '@/src/api/radioLogist';
import Verify from '@/src/components/verify/verify';
import Button from '@/src/components/button/button';
import { Clear } from '@mui/icons-material'
import CircularProgress from '@mui/material/CircularProgress';

export default function View() {

    const [modalOpen, setModalOpen] = useState(false);
    const [token, setToken] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const iframeData = useRef<any>();
    const searchParams = useSearchParams()
    const id = searchParams.get('id');
    const studyInstanceUID = searchParams.get('studyInstanceUID');
    const userId = getUserInfo('userId');
    const iframeRef = useRef<HTMLIFrameElement>(null);

    const handleMessageFromIframe = (event: MessageEvent) => {
        if (event.data.type === 'ReportId') {
            iframeData.current = event.data.data;
            setModalOpen(true);
        }
        else if (event.data.type === 'prescription') {
            const url = `${BACKEND_URL}/${event.data.data}`;
            window.open(url, '_blank');
        }
        else if (event.data.type === 'Error') {
            setModalOpen(true);

            setErrorMessage(event.data.data);
        }
    };

    useEffect(() => {
        // Add event listener to listen for messages from the iframe
        const subChildrenElements = document.querySelectorAll('.subChildren');
        const contentContainerElements = document.querySelectorAll('.contentContainer');

        subChildrenElements.forEach(element => {
            (element as HTMLElement).style.maxWidth = '100%';
        });

        contentContainerElements.forEach(element => {
            (element as HTMLElement).style.padding = '0px';
        });
        window.addEventListener('message', handleMessageFromIframe);
        setToken(getUserInfo('token'));
        return () => {
            subChildrenElements.forEach(element => {
                (element as HTMLElement).style.maxWidth = '1442px';
            });

            contentContainerElements.forEach(element => {
                (element as HTMLElement).style.padding = '30px 80px';
            });
            // Remove event listener when component unmounts
            window.removeEventListener('message', handleMessageFromIframe);
        };
    }, []);

    const sendDataToIframe = (data: any) => {
        if (iframeRef.current) {
            iframeRef.current.contentWindow?.postMessage(data, '*');
        }
    };

    const handleCancelButton = (status: string) => {
        sendDataToIframe(status);
        setModalOpen(false);
    }

    return (
        <div className="flex-1 h-full">
            <div className="iframe flex-1 h-full">
                {token !== '' && (
                    <iframe
                        ref={iframeRef}
                        //src={`http://localhost:3000/viewer?StudyInstanceUIDs=${studyInstanceUID}&authToken=${token}&id=${id}&userId=${userId}&reportViewType=0`}
                        src={`${PACS_URL}/viewer?StudyInstanceUIDs=${studyInstanceUID}&id=${id}&userId=${userId}&authToken=${token}&reportViewType=0`}
                        width="100%"
                        height="100%"
                        title="DICOM Viewer"
                    ></iframe>
                )}
            </div>
            {/* Render modal component */}
            {modalOpen && (
                <CustomModal
                    reportId={iframeData.current}
                    errorMessage={errorMessage}
                    handleCancelButton={(status: string) => {
                        handleCancelButton(status)
                    }}
                />
            )}
        </div>
    )
}


const CustomModal: React.FC<CustomModalProps> = ({ errorMessage = '', reportId, handleCancelButton }) => {
    const [RadiologistList, setRadiologistList] = useState<any>([]);
    const { response, isSuccess, isLoading } = getAllRadiologist();
    const [success, setSuccess] = useState(errorMessage.length > 0 ? true : false);
    const randomColor = useRef<string | undefined>();
    const [loading, setLoading] = useState(false);
    const {
        isAssignReviewerError,
        assignReviewerStatus,
        assignReviewerError,
        isAssignReviewerSuccess,
        assignReviewerResponse,
        assignReviewerMutate,
    } = assignReviewerMutation();

    useEffect(() => {
        if (isAssignReviewerSuccess) {
            const { statusCode } = assignReviewerResponse;

            if (statusCode == 200) {
                setSuccess(true)
                setLoading(false);
            }
        }
        else if (isAssignReviewerError) {
            setSuccess(true)
            setLoading(false);

        }

    }, [isAssignReviewerSuccess, assignReviewerResponse, isAssignReviewerError])

    useEffect(() => {
        console.log(loading, 'isLoading');

    }, [loading])

    useEffect(() => {
        if (isSuccess) {
            const { data, statusCode } = response?.data
            if (statusCode == 200) {
                setRadiologistList(data)
            }
        }

    }, [response, isSuccess]);

    function getRandomColor() {

        const letters = "0123456789ABCDEF";
        let color = "#";
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        randomColor.current = color
        return color;
    }

    const handleAsk = (id: string) => {
        setLoading(true);
        assignReviewerMutate({
            reviewerId: id,
            scanReportId: reportId
        });
    };

    const handleClose = () => {
        const status = errorMessage.length > 0 ? 'error' : 'success';
        setSuccess(false);
        handleCancelButton(status);

    };

    return (
        <div className='custom-modal'>
            {success ? (
                <div>
                    <Verify
                        message={errorMessage.length > 0 ? errorMessage : isAssignReviewerSuccess ? 'Reviewer Added Successfully' : 'Error Occured while adding reviewer'}
                        label='Close'
                        showCustom={true}
                        isSuccess={errorMessage.length > 0 ? false : isAssignReviewerSuccess}
                        handleClick={() => {
                            handleClose();
                        }}
                        style={
                            {
                                borderRadius: '1px',
                            }
                        }
                    />
                </div>
            ) : (
                <>
                    <div className="askContainer">
                        <div className="askMessage w-full flex justify-between items-center">
                            <span>
                                Ask for Review
                            </span>
                            <span>
                                <Clear sx={{ color: 'red', fontSize: 20, cursor: 'pointer' }} onClick={handleClose} />
                            </span>
                        </div>
                        <div className="radioList">
                            {RadiologistList.length > 0 ? (
                                RadiologistList.map((item: any, index: number) => (
                                    <div className="radioItem flex justify-between mt-4 w-100" key={index}>
                                        <div className="radioLeft flex gap-2 items-center">
                                            <div
                                                className="radioAvatar flex justify-center items-center"
                                                style={{
                                                    background: `linear-gradient(to right, ${getRandomColor()},${randomColor.current + '99'})`,
                                                }}
                                            >
                                                {item.firstName.charAt(0)}
                                            </div>
                                            <div className="radioName">Dr. {item.firstName} {item.lastName}</div>
                                        </div>
                                        <div className="radioRight">
                                            <Button
                                                type="button"
                                                label="Ask"
                                                onClick={() => handleAsk(item.id)}
                                                btnStyle={{
                                                    color: '#fff',
                                                    borderRadius: '10px',
                                                    height: '40px',
                                                    backgroundColor: '#0F4A8A',
                                                    minWidth: 'fit-content',
                                                }}
                                            />
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No Radiologist Found</p>
                            )}
                        </div>
                    </div>
                    {loading &&
                        <div className="loading-modal">
                            <CircularProgress />
                        </div>
                    }
                </>
            )}
        </div>
    );
};