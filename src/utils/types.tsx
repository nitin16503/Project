'use client'
import { ChangeEvent } from 'react';

export interface LoginForm {
    email: string;
    password: string;
    ip: string;
    platform?: string;
    device?: string;
}

export interface RestFormData {
    currentPassword: string;
    newPassword: string;
    confirmNewPassword: string;
    form?: boolean
};

export interface PatientListApiType {
    firstName: string;
    lastName: string;
    patientId: string;
    email: string;
    phoneNo: number;
    id: string;
    previousPrescription: string
}

export interface PatientListType {
    name: string;
    patientId: string;
    id: string;
    email: string;
    phoneNo: number;
    previousPrescription: string
}

export interface ApiResponse {
    statusCode: number;
    message: string;
    data: any;
}

export interface Center {
    name: string;
    modalities: string[];
    healthCareTypes: string[];
}

export interface SignupForm {
    password: string;
    email: string;
    confirmPassword: string;
    phoneNo: string;
    firstName: string;
    lastName: string;
    otpCode: string;
    center: Center;
}

export interface InputWithLabelProps {
    name: string;
    label: string;
    disabled?: boolean;
    type?: string;
    onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
    placeholder?: string;
    width?: string;
    register: any;
    errors: any;
    defaultValue?: string | number;
    field?: any;
    onFocus?: (e: ChangeEvent<HTMLInputElement>) => void;
    onBlur?: (e: ChangeEvent<HTMLInputElement>) => void;
    inputContainerStyle?: React.CSSProperties;
}

export interface AddPatientForm {
    phoneNo?: string;
    email?: string;
    firstName?: string;
    lastName?: string;
    form?: boolean;
    test?: string;
    patientId?: string;
    centerId?: string;
    startDate?: string;
    endDate?: string;
    testId?: string;
    testPrice?: string;
    file?: any;
    conflictAction?: string;
    priority?: string;
}

export interface VerifyProps {
    message?: string;
    isSuccess?: boolean;
    label?: string;
    style?: React.CSSProperties;
    showCustom?: boolean;
    handleClick?: () => void;
}

export interface CustomModalProps {
    reportId: string,
    errorMessage?: string,
    handleCancelButton: (status: string) => void;
}

export interface assignReviewerMutationType {
    scanReportId: string;
    reviewerId: string;
}

export interface helpBoxType {
    title: string,
    subtitle?: string,
    buttonName: string,
    width: number
    icon: string,
    handleClick: () => void;
}

export interface ContactCardProps {
    title: string;
    subtitle: string;
    link: string;
    icon: string;
}

export interface Notification {
    id: number;
    message: string;
    timestamp: string;
    read: boolean;
}

export interface NotificationProps {
    markAllAsRead?: () => void;
    showNotification?: boolean;
    setNotification?: any;
    popupRef?: any;
}

export interface ForgotPassFormData {
    password: string;
    confirmPassword: string;
    form?: boolean
}

export interface NotificationTypes {
    id: string,
    message: string,
    timestamp: string;
    read: boolean,
    priority: number
}

export interface patientActionCardType {
    title: string;
    name?: string;
    subTitle: string;
    icon: string;
    color: string
}
export interface URProps {
    name: string;
    userId: number;
    overview: string;
    doctorsNote: string;
    status: string;
    priority?: string;
    testName?: string;
}

export type FieldError = {
    message: string;
    // Add other properties as needed
};

export interface addUserFormData {
    email: string;
    phoneNo: string;
    firstName: string;
    lastName: string;
    userLevel: string;
}

export interface editUserFormData {
    email: string;
    id: string
    phoneNo: string;
    firstName: string;
    lastName: string;
    userLevel: string;
}

export interface SearchBoxProps {
    defaultValue?: string;
    handleSearch: (value: string) => void;
}
export interface SearchProps {
    isModalVisible: boolean;
    setIsModalVisible: (isVisible: boolean) => void;
}

export interface reportData {

    name: string;
    userId: number;
    overview: string;
    doctorsNote: string;
    status: string;
    priority: string;
    testName?: string;
}

export interface notificationMessage {
    id: string;
    message: string;
    timestamp: string;
    read: boolean;
    priority: number;
}

export interface notificationMessageData {
    data: NotificationTypes;
}

export interface ForgetPasswordFormData {
    email: string;
    form?: boolean
}

export interface RaiseRequestModalProps {
    isModalOpen: boolean;
    setModalOpen: any;
}

export interface RaiseFormData {
    name: string;
    email: string;
    description: string;
    form?: boolean;
}

export interface CenterSelectProps {
    isModalVisible: boolean;
    setIsModalVisible: any;
    selectedCenter: {
        id: string
        name: string
    };
    centerList: any
}

export interface changeCenterForm {
    centerId: string
}

export interface OTPFormData {
    phoneNo: string;
    otpCode: string;
    form?: boolean
};

export interface ReviewAnnotationObject {
    annotations:
    {
        studyInstanceUID: string,
        seriesInstanceUID: string,
        sopInstanceUID: string,
        type: string,
        action: string,
        comment: string
    }[]
}

export interface AnnotationData {
    studyInstanceUID: string;
    seriesInstanceUID: string;
    sopInstanceUID: string;
    uid: string;
    text: string;
  }