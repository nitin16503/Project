'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './editM.css'; // Update the CSS file path if needed
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useEditModality, useGetModalityById } from '@/src/api/admin'; // Adjust imports as needed
import { useParams, useRouter } from 'next/navigation';
import { CustomHeader } from '@/src/components/customTable/customTable';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


interface EditModalityFormData {
    name: string;
    description: string;
}

export default function EditModality() {
    const path = useParams();
    const router = useRouter();
    const { id } = path;
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { control, handleSubmit, register, trigger, formState: { errors, isValid }, setValue } = useForm<EditModalityFormData>();
    const {
        modalityData,
        modalityError,
        modalityLoading,
        modalitySuccess,
        ismodalityError,
    } = useGetModalityById(id as string); // Assume useGetModality fetches the modality data based on the ID

    const {
        editModalityError,
        editModalityErrorObject,
        editModalitySuccess,
        editModalityResponse,
        editModalityMutation,
    } = useEditModality();

    useEffect(() => {
        if (editModalityError) {
            handleSnackbarOpen('Error fetching id');
        }
        if (modalityError) {
            handleSnackbarOpen('Error in updating healthcare facility');
        }
    }, [editModalityError, modalityError]);

    useEffect(() => {
        if (modalityData) {
            const { name, description } = modalityData.data; // Assuming the API response structure
            setValue('name', name);
            setValue('description', description);
        }
    }, [modalitySuccess, modalityData]);

    const onSubmit = (data: EditModalityFormData) => {
        editModalityMutation({ id: id as string, ...data });
    };

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    useEffect(() => {
        if (editModalitySuccess) {
            const { statusCode } = editModalityResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/modality');
            }
        }
    }, [editModalitySuccess, editModalityResponse]);

    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Edit Modality" color='#0f4a8a' textcolor='white' />
            <div className="formDiv flex mt-5 w-full">
                <form className="editForm flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Name"
                                    placeholder="Enter modality name"
                                    register={register}
                                    name='name'
                                    type='text'
                                    width='50%'
                                    errors={errors}
                                    field={field}
                                    onChange={() => trigger('name')}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Description"
                                    placeholder="Enter modality description"
                                    register={register}
                                    name='description'
                                    type='text'
                                    width='50%'
                                    errors={errors}
                                    field={field}
                                    onChange={() => trigger('description')}
                                />
                            )}
                        />
                    </div>
                    <div className="editSubmit flex justify-start mb-5">
                        <Button
                            type="submit"
                            label="Submit"
                            disabled={!isValid}
                            btnStyle={{
                                color: '#fff',
                                backgroundColor: '#0f4a8a',
                                minWidth: "fit-content"
                            }}
                        />
                    </div>
                </form>
            </div>
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

        </div>
    );
}
