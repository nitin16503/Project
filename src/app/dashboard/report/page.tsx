'use client'
import React, { useEffect, useRef, useState } from 'react'
import './report.css'
import { PACS_URL } from '@/src/utils/config';
import Button from '@/src/components/button/button';
import { useSearchParams } from 'next/navigation';
import { getUserInfo } from '@/src/utils/helper';
import { usePathname, useRouter } from 'next/navigation';
import DoneIcon from '@mui/icons-material/Done';
import CloseIcon from '@mui/icons-material/Close';
import WarningIcon from '@mui/icons-material/Warning';
import AddCommentIcon from '@mui/icons-material/AddComment';
import ExpandLessRoundedIcon from '@mui/icons-material/ExpandLessRounded';
import ExpandMoreRoundedIcon from '@mui/icons-material/ExpandMoreRounded';
import { getScanTestDetail } from '@/src/api/scantest';
import Loader from '@/src/components/loader/loader';
import { reviewAnnotation, publishReport, assignReportToMe, saveAsDraft} from '@/src/api/radioLogist';
import { AxiosError } from 'axios';
import { ApiResponse, ReviewAnnotationObject, AnnotationData } from '@/src/utils/types';
import CustomModal from '@/src/components/modal/modal';
import BackButton from '@/src/components/backButton/backButton';

interface ReportDetails {
  pacsReportId: string;
  pacsSegmentation:any;
  // other properties if needed
}

interface Report {
  _id: string;
  publish: string;
  reportDetails: ReportDetails[];
  // other properties if needed
}

interface Detail {
  report: Report[];
  // other properties if needed
}

export default function Report() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id') || '';
  const studyInstanceUID = searchParams.get('studyInstanceUID');
  const [token, setToken] = useState('');
  const userId = getUserInfo('userId');
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [detail, setDetail] = useState<Detail[]>([]);
  const [comment, setComment] = useState('');
  const [loader, setLoader] = useState(false);
  const [warnModalVisible, setWarnModalVisible] = useState(false);
  const [saveDraftSuccess, setSaveDraftSuccess] = useState('');
  const [addCommentOn, setAddCommentOn] = useState<any>({});
  const [otherAnnotations, setOtherAnnotations] = useState<AnnotationData[]>([]);
  const [removeOtherAnnotationId, setRemoveOtherAnnotationId] = useState('');
  const [reviewedAnnotation, setReviewedAnnotation] = useState<any>([]);
  const pathName = usePathname();
  const router = useRouter();
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [observations, setObservations] = useState<any>({});
  const [segmentationTool, setSegmentationTool] = useState(false)
  const {
    isErrorReviewAnnotation,
    errorReviewAnnotation,
    isSuccessReviewAnnotation,
    responseReviewAnnotation,
    reviewAnnotationMutate,
  } = reviewAnnotation();
  const {
    isErrorPublish,
    errorPublish,
    isSuccessPublish,
    responsePublish,
    publishMutate,
  } = publishReport();
  const {
    isErrorAssign,
    errorAssign,
    isSuccessAssign,
    responseAssign,
    assignMutate,
  } = assignReportToMe();
  const {
    scanTestDetail,
    error,
    isLoading,
    refetchDetail
  } = getScanTestDetail({ scanTestId: id });
  const {
    isErrorSaveAsDraft,
    errorSaveAsDraft,
    isSuccessSaveAsDraft,
    responseSaveAsDraft,
    saveAsDraftMutate,
  } = saveAsDraft();

  useEffect(() => {
    setToken(getUserInfo('token'));
    window.addEventListener('message', handleMessageFromIframe);
    return () => {
      window.removeEventListener('message', handleMessageFromIframe);
    }
  }, [])

  useEffect(() => {
    if (scanTestDetail) {
      const { statusCode, message, data } = scanTestDetail?.data || {};
      if (statusCode == 200) {
        if (data != null) {
          setDetail(data);
          data[0]?.report[0]?.reportDetails[0]?.annotations == null ? setLoader(false) : setLoader(true)
        }
      }
    }
    if (error) {
      console.log("error", error)
    }
  }, [scanTestDetail, error])

  useEffect(() => {
    if (isSuccessReviewAnnotation) {
      const { statusCode, data } = responseReviewAnnotation?.data || {};
      if (statusCode == 200) {
        /* create a radiologist report */
        const postMessageData = {
          reviewedAnnotation: reviewedAnnotation,
          observations: observations
        }
        handleAIAnnotation('save_report', postMessageData);
        setSaveDraftSuccess('Save successfully !!')
        setTimeout(() => {
          setSaveDraftSuccess('')
          refetchDetail();
        }, 1000)
      }
    }
    else if (isErrorReviewAnnotation) {
      const { statusCode, message } = (errorReviewAnnotation as AxiosError<ApiResponse>)?.response?.data ?? {};
      console.log("response error", message, statusCode)
    }
  }, [errorReviewAnnotation, responseReviewAnnotation])

  useEffect(() => {
    if (isSuccessPublish) {
      const { statusCode, data } = responsePublish?.data || {};
      if (statusCode == 200) {
        refetchDetail()
      }
    }
    else if (isErrorPublish) {
      const { statusCode, message } = (errorPublish as AxiosError<ApiResponse>)?.response?.data ?? {};
      console.log("response error", message, statusCode)
    }
  }, [errorPublish, responsePublish])

  useEffect(() => {
    if (isSuccessAssign) {
      const { statusCode, data } = responseAssign?.data || {};
      if (statusCode == 200) {
        refetchDetail()
        handleAIAnnotation('self_assign', null);
      }
    }
    else if (isErrorAssign) {
      const { statusCode, message } = (errorAssign as AxiosError<ApiResponse>)?.response?.data ?? {};
      console.log("response error", message, statusCode)
    }
  }, [errorAssign, responseAssign])

  useEffect(() => {
    if (removeOtherAnnotationId != '') {
      setOtherAnnotations(prevAnnotations => prevAnnotations.filter(annotation => annotation.uid !== removeOtherAnnotationId));
    }
  }, [removeOtherAnnotationId])

  useEffect(() => {
    if (Object.keys(addCommentOn).length > 0) {
      const filteredAnnotations = reviewedAnnotation?.find((annotation: any) =>
        annotation.sopInstanceUID == addCommentOn.sopInstanceUID && annotation.seriesInstanceUID == addCommentOn.seriesInstanceUID
      );
      if (filteredAnnotations != undefined) {
        setComment(filteredAnnotations.comment)
      } else {
        setComment('')
      }
      setIsModalVisible(true)
    } else {
      setIsModalVisible(false)
    }
  }, [addCommentOn])

  useEffect(() => {
    if (isSuccessSaveAsDraft) {
      const { statusCode, data } = responseSaveAsDraft?.data || {};
      if (statusCode == 200) {
        setSaveDraftSuccess('Save successfully !!')
        setTimeout(() => {
          setSaveDraftSuccess('')
          refetchDetail();
        }, 1000)
      }
    }
    else if (isErrorSaveAsDraft) {
      const { statusCode, message } = (errorSaveAsDraft as AxiosError<ApiResponse>)?.response?.data ?? {};
      console.log("response error", message, statusCode)
    }
  }, [errorSaveAsDraft, responseSaveAsDraft])

  // send message to iframe
  const handleAIAnnotation = (type: string, info: any) => {
    const data = {
      type: type, // view_measurement
      data: info
    }
    if (iframeRef?.current) {
      iframeRef?.current?.contentWindow?.postMessage(data, "*");
    }
  }

  // read message from iframe
  const handleMessageFromIframe = (event: MessageEvent) => {
    if (event.data.type === 'other_annotation') {

      setLoader(false)
      const newAnnotation: AnnotationData = event.data.data;
      //setOtherAnnotations(prevAnnotations => [...prevAnnotations, newAnnotation]);
      setOtherAnnotations(prevAnnotations => {
        // Check if an object with the same uid already exists in the array
        const exists = prevAnnotations.some(annotation => annotation.uid === newAnnotation.uid);

        // Only add the new annotation if it doesn't already exist
        if (!exists) {
          return [...prevAnnotations, newAnnotation];
        }

        // If it exists, return the previous annotations unchanged
        return prevAnnotations;
      });
    } else if (event.data.type === 'untrack_success') {
      setRemoveOtherAnnotationId(event.data.data)
    }
  };

  const handleSaveAsDraft = () => {
    /* save annoations */
    let combinedAnnotations: any = [];
    if (otherAnnotations.length > 0) {
      // Create a new array excluding the 'measurement' key from otherAnnotations
      const cleanedOtherAnnotations = otherAnnotations.map(annotation => {
        const { text, ...rest } = annotation;
        return rest;
      });
      // Combine the reviewedAnnotation with the cleaned otherAnnotations
      combinedAnnotations = [...reviewedAnnotation, ...cleanedOtherAnnotations];
    }
    const reportId = detail[0]?.report[0]?._id || '';
    const postData: ReviewAnnotationObject = {
      annotations: (combinedAnnotations.length > 0) ? combinedAnnotations : reviewedAnnotation
    };

    if(postData?.annotations.length == 0){
      saveAsDraftMutate({ id: reportId, data: observations })
    }else{
      reviewAnnotationMutate({ id: reportId, data: postData })
    }
  }

  const handleSaveComment = () => {
    const updatedAnnotations = reviewedAnnotation?.map((annotation: any) =>
      annotation.sopInstanceUID === addCommentOn?.sopInstanceUID && annotation.seriesInstanceUID === addCommentOn?.seriesInstanceUID
        ? { ...annotation, comment: comment } // Update the action status
        : annotation
    );
    setReviewedAnnotation(updatedAnnotations);
    handleModalCancel()
  }

  const handleModalCancel = () => {
    setAddCommentOn({})
  }

  const handlePublishReport = () => {
    const reportId = detail[0]?.report[0]?._id || '';
    publishMutate({ id: reportId })
    /* create a radiologist report */
    // const postMessageData = {
    //   reviewedAnnotation:reviewedAnnotation,
    //   observations:observations
    // }
    // handleAIAnnotation('publish_report', postMessageData);
    // setSaveDraftSuccess('Published report successfully !!')
  }

  const handleSegmentationTools = () => {
    setWarnModalVisible(false)
    if(segmentationTool) {
      window.location.reload(); // This will refresh the page
    }
    setSegmentationTool(!segmentationTool)
  }

  return (
    <>
      {isLoading ?
        <Loader /> :
        <div className="reportContainer">
          <div className="reportSubContainer flex flex-row gap-5">
          {segmentationTool && <div className=''>
            <BackButton onclick={handleSegmentationTools}/>
          </div>}
            <div className="reportLeft w-full">
              <div className="rImageContainer">
                {token !== '' && (
                  <>
                    {!segmentationTool &&<iframe
                      ref={iframeRef}
                      //src={`http://localhost:3000/viewer?StudyInstanceUIDs=${studyInstanceUID}&authToken=${token}&id=${id}&userId=${userId}&reportViewType=1`}
                      src={`${PACS_URL}/viewer?StudyInstanceUIDs=${studyInstanceUID}&id=${id}&userId=${userId}&authToken=${token}&reportViewType=1`}
                      width="100%"
                      height="600px"
                      title="DICOM Viewer"
                    ></iframe>}
                    {segmentationTool &&<iframe
                      ref={iframeRef}
                      //src={`http://localhost:3000/viewer?StudyInstanceUIDs=${studyInstanceUID}&authToken=${token}&id=${id}&userId=${userId}&reportViewType=1`}
                      src={`${PACS_URL}/segmentation?StudyInstanceUIDs=${studyInstanceUID}&id=${id}&userId=${userId}&authToken=${token}&reportViewType=0`}
                      width="100%"
                      height="600px"
                      title="DICOM Viewer"
                    ></iframe>}
                  </>
                )}
              </div>
            </div>
            {!segmentationTool && <div className="reportRight w-full">
              <div className="detailContainer flex flex-col gap-4">
                <UserDetail
                  scanTestDetail={detail}
                  handleSaveAsDraft={handleSaveAsDraft}
                  saveDraftSuccess={saveDraftSuccess}
                  otherAnnotations={otherAnnotations}
                  reviewedAnnotation={reviewedAnnotation}
                />
                {detail[0]?.['report']?.[0]?.['reportDetails']?.[0]?.['pacsSegmentation'] == undefined && 
                <AIdetail
                  scanTestDetail={detail}
                  otherAnnotations={otherAnnotations}
                  setOtherAnnotations={setOtherAnnotations}
                  handleAIAnnotation={handleAIAnnotation}
                  setIsModalVisible={setIsModalVisible}
                  reviewedAnnotation={reviewedAnnotation}
                  setReviewedAnnotation={setReviewedAnnotation}
                  setAddCommentOn={setAddCommentOn}
                  loader={loader}
                />}
                <div className="reviewButton flex gap-4">
                  {detail[0]?.report[0]?.reportDetails.length > 0 ? <Button
                    type="button"
                    label="Ask for Review"
                    btnStyle={{
                      color: '#fff',
                      borderRadius: '10px',
                      backgroundColor: '#0F4A8A',
                      minWidth: 'fit-content'
                    }}
                    disabled={true}
                  /> : <Button
                    type="button"
                    label="Assign to me"
                    btnStyle={{
                      color: '#fff',
                      borderRadius: '10px',
                      backgroundColor: '#0F4A8A',
                      minWidth: 'fit-content'
                    }}
                    onClick={() => assignMutate(detail[0]?.report[0]._id)}
                  />}
                  <Button
                    type="button"
                    label="Annotation Tools"
                    btnStyle={{
                      color: '#F0A400',
                      background: '#fff',
                      borderRadius: '10px',
                      border: '2px dotted #F0A400',
                      minWidth: 'fit-content',
                      borderColor: '#F0A400'
                    }}
                    onClick={() => {
                      const currentPath = pathName;
                      router.push(`${currentPath}/view?id=${id}&studyInstanceUID=${studyInstanceUID}`);
                    }}
                    disabled={true}
                  />
                  <Button
                    type="button"
                    label="Segmentation Tools"
                    btnStyle={{
                      color: '#F0A400',
                      background: '#fff',
                      borderRadius: '10px',
                      border: '2px dotted #F0A400',
                      minWidth: 'fit-content',
                      borderColor: '#F0A400'
                    }}
                    onClick={() => {
                      setWarnModalVisible(true)
                    }}
                    disabled={false}
                  />
                  <CustomModal
                    isVisible={warnModalVisible}
                    handleCancelButton={()=>{setWarnModalVisible(false)}}
                    modalTitle="Warning: Annotation Required"
                    modalMessage="Please ensure that you have completed all necessary annotations before proceeding to the segmentation tool. Accurate and thorough annotations are crucial for effective segmentation."
                    showButtons={true}
                    primaryButtonText="ok"
                    secondaryButtonText="Cancel"
                    primaryButtonColor="#0f4a8a"
                    secondaryButtonColor="#FFF"
                    handlePrimaryButton={()=>{handleSegmentationTools()}} 
                    handleSecondaryButton={()=>{setWarnModalVisible(false)}}
                    success={false}
                    icon={() => <WarningIcon style={{ margin: 10 }} />} // Assuming you have a DeleteIcon component
                />
                </div>
                <Observation scanTestDetail={detail} observations={observations} setObservations={setObservations} />
                {detail[0]?.report[0]?.reportDetails[0]?.pacsReportId != undefined && <Button
                  type="button"
                  label="Publish Report"
                  btnStyle={{
                    color: '#fff',
                    borderRadius: '10px',
                    backgroundColor: '#0F4A8A',
                    height: '40px',
                    minWidth: '70px'
                  }}
                  onClick={handlePublishReport}
                  disabled={detail[0]?.report[0]?.publish == 'SING_OFF' ? true : false}
                />}
              </div>
            </div>}
          </div>
        </div>
      }
      <CustomModal
        isVisible={isModalVisible}
        handleCancelButton={() => {
          handleModalCancel()
        }}
        modalTitle="Add Comment"
        modalContent={() => {
          return (
            <>
              <div className='selectCenter'>
                <textarea
                  placeholder={' Add Comment...'}
                  onChange={(e) => setComment(e.target.value)}
                  rows={2}
                  cols={50}
                  value={comment}
                  defaultValue={comment}
                />
              </div>
            </>
          )
        }}
        showButtons={true}
        primaryButtonText="add"
        secondaryButtonText="Cancel"
        primaryButtonColor="#0f4a8a"
        secondaryButtonColor="#FFF"
        handlePrimaryButton={handleSaveComment}
        handleSecondaryButton={() => { handleModalCancel() }}
        success={false}
      />
    </>
  );
}

const UserDetail = ({ scanTestDetail, handleSaveAsDraft, saveDraftSuccess, otherAnnotations, reviewedAnnotation }: any) => {
  const [expand, setExpand] = useState(false);
  return (
    <>
      <div className="detail">
        <div className="flex flex-row justify-between">
          <span className='RDname'>
            {scanTestDetail[0]?.patient?.firstName}{' '}{scanTestDetail[0]?.patient?.lastName}
          </span>
          <div className='flex'>
            {scanTestDetail[0]?.report[0]?.currentReviewerIsMe == true && <Button
              type="button"
              label="Save as draft"
              btnStyle={{
                color: '#fff',
                borderRadius: '10px',
                backgroundColor: '#0F4A8A',
                height: '40px',
                minWidth: '70px'
              }}
              onClick={handleSaveAsDraft}
              disabled={((scanTestDetail[0]?.report[0]?.publish == 'SING_OFF') || (reviewedAnnotation.length == 0 && otherAnnotations.length == 0 && scanTestDetail[0]?.['report']?.[0]?.['reportDetails']?.[0]?.['pacsSegmentation'] == undefined)) ? true : false}
            />}
            {saveDraftSuccess != '' && <span className='sucess'>{saveDraftSuccess}</span>}
          </div>
          <div className='circle'>
            {expand ?
              <ExpandLessRoundedIcon style={{ fontSize: 18 }} onClick={() => setExpand(false)} /> :
              <ExpandMoreRoundedIcon style={{ fontSize: 18 }} onClick={() => setExpand(true)} />}
          </div>
        </div>
        <div className="RD">
          Id: {scanTestDetail[0]?.refNumber}
        </div>
        {expand && <>
          <div className="RD">
            Scan Time: {new Date(scanTestDetail[0]?.report[0].scanTime).toLocaleString()}
          </div>
          <div className="RD">
            Radiologist:
            {scanTestDetail[0]?.report[0]?.currentReviewer.length == 0 ? ' Not Assigned' :
              scanTestDetail[0]?.report[0]?.currentReviewer[0]?.firstName + ' ' + scanTestDetail[0]?.report[0]?.currentReviewer[0]?.lastName
            }
          </div>
          {
            scanTestDetail[0].prescription && <div className="RD">
              Prescriptions Trail: <span className='prescriptionLink'>View</span>
            </div>
          }
        </>}
      </div>
    </>
  )
}

const AIdetail = ({ scanTestDetail, handleAIAnnotation, otherAnnotations, reviewedAnnotation, setReviewedAnnotation, setOtherAnnotations, setAddCommentOn, loader }: any) => {

  const clinicObj: { [key: string]: string } = {
    'cl1': 'CT scan of Concussion victim , Possible sinus infection also.'
  }
  const report = scanTestDetail[0]?.report[0];
  const [marking, setMarking] = useState<string[]>([]);
  const [alreadyMarked, setAlreadyMarked] = useState<string[]>([]);
  const annotations = scanTestDetail[0]?.report[0]?.reportDetails[0]?.annotations;

  const reviewAnnotation = (info: any, status: string) => {
    const filteredAnnotations = reviewedAnnotation?.find((annotation: any) =>
      annotation.sopInstanceUID == info.sopInstanceUID && annotation.seriesInstanceUID == info.seriesInstanceUID
    );
    if (filteredAnnotations != undefined) {
      // Update the existing annotation
      const updatedAnnotations = reviewedAnnotation?.map((annotation: any) =>
        annotation.sopInstanceUID === info.sopInstanceUID && annotation.seriesInstanceUID === info.seriesInstanceUID
          ? { ...annotation, action: status } // Update the action status
          : annotation
      );
      setReviewedAnnotation(updatedAnnotations);
    } else {
      const annotations: any = {
        'studyInstanceUID': info.studyInstanceUID,
        'seriesInstanceUID': info.seriesInstanceUID,
        'sopInstanceUID': info?.sopInstanceUID,
        "type": "AI",
        "action": status,
        "comment": "",
      };
      setReviewedAnnotation(() => [...reviewedAnnotation, annotations])
    }
  }

  const handleMark = (index: number, status: string) => {
    marking[index] = status
    setMarking(marking);
  }

  useEffect(() => {
    let foundAnno;
    if (scanTestDetail.length == 0) {
      return;
    }
    if (annotations != undefined) {
      let othAnno: any[] = []; let reviAnno: any[] = [];
      annotations.map((data: any, index: any) => {
        if (data.action == 'new') {
          othAnno.push(data)
        } else {
          reviAnno.push(data)
        }
      })
      // setOtherAnnotations(othAnno)
      setReviewedAnnotation(reviAnno)
    }
    report?.aiResult?.map((data: any, index: any) => {
      foundAnno = annotations?.find((anno: any) =>
        anno.sopInstanceUID == data.sopInstanceUID && anno.seriesInstanceUID == data.seriesInstanceUID
      );
      if (foundAnno != undefined) {
        marking[index] = foundAnno.action
      }
    })
    setAlreadyMarked(marking);
  }, [scanTestDetail])

  useEffect(() => {
    if (alreadyMarked.length > 0) {
      setMarking(alreadyMarked)
    }
  }, [alreadyMarked])

  return (
    <>
      <div className="flex flex-col">
        <div className="flex flex-row annotationTitle">
          <div className='annotatecontainer'>AI - Annotation</div>
          <div className='flex flex-row justify-around boolcontainer'>
            <div className='flex'>Correct</div>
            <div className='flex'>Incorrect</div>
            <div className='flex'></div>
          </div>
        </div>
        <div className="annotationDetails flex flex-col gap-3">
          {
            report?.aiResult?.map((data: any, index: any) => {
              return (
                <div className="annotation flex gap-3 items-center" key={index}>
                  <div className='flex flex-row annotatecontainer gap-1'>
                    {data?.measurementData?.text} hemorrhage is detected on <span onClick={() => { handleAIAnnotation('view_measurement', data) }} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>slice</span>
                  </div>
                  <div className='flex flex-row justify-around boolcontainer'>
                    <div className="yes flex gap-1 items-center" onClick={() => {
                      if (scanTestDetail[0]?.report[0]?.currentReviewerIsMe == true) {
                        reviewAnnotation(data, 'accept')
                        handleMark(index, 'accept')
                      }
                    }}
                      style={marking[index] === 'accept' ? { color: '#686868', backgroundColor: '#a0eba37d' } : {}}>
                      <DoneIcon style={{ color: marking[index] == 'accept' ? '#4CAF50' : 'grey', fontSize: 18 }} />Yes
                    </div>
                    <div className="no flex gap-1 items-center" onClick={() => {
                      if (scanTestDetail[0]?.report[0]?.currentReviewerIsMe == true) {
                        reviewAnnotation(data, 'reject')
                        handleMark(index, 'reject')
                      }
                    }}
                      style={marking[index] === 'reject' ? { color: '#686868', backgroundColor: '#E543351A' } : {}}>
                      <CloseIcon style={{ color: marking[index] == 'reject' ? '#E54335' : 'grey', fontSize: 18 }} />No
                    </div>
                  </div>
                  <div className='flex gap-1 items-center'><AddCommentIcon style={{ color: 'grey', fontSize: 18, cursor: 'pointer' }} onClick={() => {
                    if (scanTestDetail[0]?.report[0]?.currentReviewerIsMe == true) {
                      setAddCommentOn(data)
                    }
                  }} /></div>
                </div>
              )
            })
          }
        </div>
      </div>
      {/* <div className="other-annotationContainer flex flex-col">
        <div className="other-annotationTitle">
          Other Annotation
        </div>
        <div className="other-annotationDetails flex flex-col gap-3">
          {
            otherAnnotations.map((data: any, index: any) => {
              return (
                <div className="other-annotation flex gap-3 items-center" key={index}>
                  <div className='flex flex-row annotatecontainer gap-1'>
                    {data?.text} hemorrhage is detected on <span onClick={() => { handleAIAnnotation('view_measurement', data) }} style={{ color: 'blue', textDecoration: 'underline', cursor: 'pointer' }}>slice</span>
                  </div>
                  <div className='flex flex-row justify-around'>
                    <CloseIcon style={{ color: 'grey', fontSize: 18, cursor: 'pointer' }} onClick={() => { handleAIAnnotation('untrack_measurement', data) }} />
                  </div>
                </div>
              )
            })
          }
        </div>
      </div> */}
      <div className="clinicContainer flex flex-col gap-2">
        <div className="clinicTitle">
          Clinical Details
        </div>
        <div className="clinicDetail">
          {
            Object.keys(clinicObj).map((key: string, index) => {
              return (
                <div className="clinic flex gap-3 items-center" key={index}>
                  {clinicObj[key]}
                </div>
              )
            })
          }
        </div>
      </div>
    </>
  )
}

const Observation = ({ scanTestDetail, observations, setObservations }: any) => {

  const doctorName = 'Dr. Vikram';
  useEffect(() => {
    setObservations(scanTestDetail[0]?.report[0].observations)
  }, [scanTestDetail])

  const handleObservations = (key: string, value: any) => {
    setObservations({
      ...observations,
      [key]: value
    })
  }

  return (
    <>{observations !== undefined &&
      <div className="observationContainer flex flex-col">
        <div className="observationTitle flex justify-between">
          Observations & Comments
          <span className="doctorName">
            By: {doctorName}
          </span>
        </div>
        <div className="observationDetails flex flex-col gap-2">
          <div className="observation flex gap-3 items-center w-full">
            <div className="subPoint flex flex-col gap-2 p-3 pt-0 pb-0 w-full">
              <div className="subPointTitle">Clinical Details</div>
              <div className="subPointDetail flex-1 flex flex-col justify-start">
                <input defaultValue={observations['clinicalDetails']} placeholder='Enter clinical details' onChange={(e) => handleObservations('clinicalDetails', e.target.value)} className='inputText' />
              </div>
            </div>
          </div>
          <div className="observation flex gap-3 items-center w-full">
            <div className="subPoint flex flex-col gap-2 p-3 pt-0 pb-0 w-full">
              <div className="subPointTitle">Findings</div>
              <div className="subPointDetail flex-1 flex flex-col justify-start">
                <input defaultValue={observations['findings']} placeholder='Enter clinical details' onChange={(e) => handleObservations('findings', e.target.value)} className='inputText' />
              </div>
            </div>
          </div>
          <div className="observation flex gap-3 items-center w-full">
            <div className="subPoint flex flex-col gap-2 p-3 pt-0 pb-0 w-full">
              <div className="subPointTitle">Technique</div>
              <div className="subPointDetail flex-1 flex flex-col justify-start">
                <input defaultValue={observations['technique']} placeholder='Enter clinical details' onChange={(e) => handleObservations('technique', e.target.value)} className='inputText' />
              </div>
            </div>
          </div>
          <div className="observation flex gap-3 items-center w-full">
            <div className="subPoint flex flex-col gap-2 p-3 pt-0 pb-0 w-full">
              <div className="subPointTitle">Conclusions</div>
              <div className="subPointDetail flex-1 flex flex-col justify-start">
                <input defaultValue={observations['conclusions']} placeholder='Enter clinical details' onChange={(e) => handleObservations('conclusions', e.target.value)} className='inputText' />
              </div>
            </div>
          </div>
        </div>
      </div>}
    </>
  )

}

const AuditTrail = () => {
  const detail: { [key: string]: { [key: string]: string }[] } = {
    'today': [
      {
        "2023-09-22 09:30 AM": "Opened CT Scan for Patient John Maheshwari CT scan ID: 1234",
        "2023-09-22 09:45 AM": "Started Review for CT scan ID 899850",
        "2023-09-22 10:15 AM": 'Added Annotation "Possible tumor detected in left lun”'
      }
    ]
  };
  return (
    <>
      <div className="auditContainer flex flex-col">
        <div className="auditTitle flex justify-between">
          Audit Trail
        </div>
        <div className="auditDetails flex flex-col gap-2">
          {Object.keys(detail).map((key: string, index) => (
            <div className="audit" key={index}>
              <div className="subPoint flex flex-col gap-2 p-3 pt-0 pb-0 w-full">
                <div className="subPointTitle">
                  {key}
                </div>
                {detail[key].map((subDetail: any, subIndex: number) => (
                  <div className="subPoint" key={subIndex}>
                    {Object.keys(subDetail).map((subKey: string, subIndex: number) => (
                      <div className="subPoint" key={subIndex}>
                        <div className="subPointTitle">
                          {subKey}
                        </div>
                        <div className="subPointDetail">
                          {subDetail[subKey]}
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className="observationButton">
          <Button
            type="button"
            label="Add Addendum"
            btnStyle={{
              color: '#fff',
              borderRadius: '10px',
              backgroundColor: '#0F4A8A',
              minWidth: 'fit-content'
            }}
          />
        </div>
      </div>
    </>
  )
}


