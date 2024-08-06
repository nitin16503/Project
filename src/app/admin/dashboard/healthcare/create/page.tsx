'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useCreateHealthcareFacility } from '@/src/api/admin';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import './createH.css';
import { CustomHeader } from '@/src/components/customTable/customTable';

interface HealthcareFacilityFormData {
    name: string;
    description: string;
}

export default function CreateHealthcareFacility() {
    const { control, handleSubmit, register, trigger, formState: { errors, isValid } } = useForm<HealthcareFacilityFormData>();
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const {
        createHealthcareFacilitySuccess,
        createHealthcareFacilityResponse,
        createHealthcareFacilityError,
        createHealthcareFacilityMutation,
    } = useCreateHealthcareFacility();

    useEffect(() => {
        if (createHealthcareFacilityError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
    }, [createHealthcareFacilityError]);

    const onSubmit = (data: HealthcareFacilityFormData) => {
        createHealthcareFacilityMutation(data);

    };

    useEffect(() => {
        if (createHealthcareFacilitySuccess) {
            const { statusCode, data } = createHealthcareFacilityResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/healthcare');
            }
        }
    }, [createHealthcareFacilitySuccess, createHealthcareFacilityResponse]);

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Create Healthcare Facility" color='#0f4a8a' textcolor='white' />
            <div className="formDiv flex mt-5 w-full">
                <form className="createForm flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Name"
                                    placeholder="Enter facility name"
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
                                    placeholder="Enter facility description"
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
                    <div className="createSumbit flex justify-start mb-5">
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
