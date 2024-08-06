'use client'
import React, { FC, ChangeEvent } from 'react';
import scanIcon from '../../assets/images/upload.png'
import Image from 'next/image';
import UploadIcon from '@mui/icons-material/Upload';

interface UploadProps {
    label: string;
    file:any;
    setFile: React.Dispatch<React.SetStateAction<File | null>>;
    disabled:boolean;
}

const Upload: FC<UploadProps> = ({ label, setFile,file,disabled }) => {

    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            const selectedFile = e.target.files[0];
            // Check if the selected file type is allowed (PDF or image)
            if (isValidFileType(selectedFile)) {
                setFile(selectedFile);
            } else {
                console.error('Invalid file type. Please select a PDF or image file.');
            }
        }
    };

    const isValidFileType = (file: File): boolean => {
        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/gif'];
        return allowedTypes.includes(file.type);
    };

    return (
        <>
            <label className="label">{label}</label>
            <div className="mt-2 flex justify-center items-center p-5  border-2 border-dashed rounded-md" style={{ border: '1px dashed #0F4A8A',width:'20%',aspectRatio:2/1 }}>
                <div className="space-y-1 text-center">
                    {!file && (<Image alt='icon' src={scanIcon} className="mx-auto text-gray-400" />)}
                    
                    {/* <scanIcon className="mx-auto h-12 w-12 text-gray-400" /> */}
                    <div className="flex text-sm text-gray-600">
                        <label
                            className="relative cursor-pointer bg-white rounded-md font-medium  hover:text-indigo-500 focus-within:outline-none"
                            htmlFor="file-upload"
                        >
                            <span style={disabled ? {cursor: 'not-allowed',color:"grey"}:{cursor:'pointer',color:"#0F4A8A"}}>{file ? file.name : 'Upload'}</span>
                            <input id="file-upload" className="hidden" type="file" accept=".pdf, .jpg, .jpeg, .png" onChange={handleFileChange} disabled={disabled} />
                        </label>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Upload


