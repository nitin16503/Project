'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { getHealthcare, getModalityList, useCreateCenter } from '@/src/api/admin'; // Assuming you have a hook for creating centers
import { useRouter } from 'next/navigation';
import './createC.css'; // Update the CSS file path if needed
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { CustomHeader } from '@/src/components/customTable/customTable';
import AutocompleteInput from '@/src/components/AutocompleteInput/autocompleteInput';

interface CenterFormData {
    name: string;
    healthCareTypes: {
        id: string;
    };
    modalities: {
        id: string;
    };
}

export default function CreateCenter() {
    const { control, handleSubmit, register, trigger, formState: { errors, isValid } } = useForm<CenterFormData>();
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [limit, setLimit] = useState({ modalityLimit: 10, healthcareLimit: 10 });
    const [healthCareList, setHealthCareList] = useState([]);
    const [modalityList, setmodalityList] = useState([]);
    const {
        createCenterSuccess,
        createCenterError,
        createCenterResponse,
        createCenterMutation,
    } = useCreateCenter();

    const {
        handleHealthcareError,
        healthcareError,
        handleHealthcareSuccess,
        healthcareResponse,
        healthcareStatus,
        healthcareMutate,
    } = getHealthcare({
        search: '',
        limit: limit.healthcareLimit
    });

    const {
        handleModalityError,
        modalityError,
        handleModalitySuccess,
        modalityResponse,
        modalityStatus,
        modalityMutate,
    } = getModalityList({
        search: '',
        limit: limit.modalityLimit
    });

    useEffect(() => {
        if (createCenterError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
    }, [createCenterError]);

    useEffect(() => {
        healthcareMutate();
        modalityMutate();
    }, [])

    useEffect(() => {
        if (limit.modalityLimit > 10) {
            modalityMutate();
        }
        if (limit.healthcareLimit > 10) {
            modalityMutate();
        }
    }, [limit])

    useEffect(() => {
        if (handleModalitySuccess) {
            const { items, totalPages, totalItems } = modalityResponse?.data?.data || {};
            if (totalPages > 1) {
                setLimit({ ...limit, modalityLimit: totalItems })
            }
            setmodalityList(items || [])
        }
    }, [handleModalitySuccess, modalityResponse]);

    useEffect(() => {
        if (handleHealthcareSuccess) {
            const { items, totalPages, totalItems } = healthcareResponse?.data?.data || {};
            if (totalPages > 1) {
                setLimit({ ...limit, healthcareLimit: totalItems })
            }
            setHealthCareList(items || [])
        }
    }, [handleHealthcareSuccess, healthcareResponse]);

    const onSubmit = (data: CenterFormData) => {
        let { healthCareTypes, modalities } = data;

        createCenterMutation({ ...data, healthCareTypes: [healthCareTypes.id], modalities: [modalities.id] });
        // Log form data
    };

    useEffect(() => {
        if (createCenterSuccess) {
            const { statusCode, data } = createCenterResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/centers');
            }
        }
    }, [createCenterSuccess, createCenterResponse]);

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Create Center" color='#0f4a8a' textcolor='white' />
            <div className="formDiv flex mt-5 w-full">
                <form className="createForm flex flex-col gap-5 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Controller
                            name="name"
                            control={control}
                            rules={{ required: 'Name is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Name"
                                    placeholder="Enter name"
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
                            name="healthCareTypes"
                            control={control}
                            rules={{ required: 'Health care types are required' }}
                            render={({ field }) => (
                                <AutocompleteInput
                                    label="Health Care Types"
                                    list={healthCareList} // Sample data for demonstration
                                    defaultValue={field.value}
                                    handleChange={field.onChange}
                                />
                            )}
                        />
                    </div>
                    <div>
                        <Controller
                            name="modalities"
                            control={control}
                            rules={{ required: 'Modalities are required' }}
                            render={({ field }) => (
                                <AutocompleteInput
                                    label="Modalities"
                                    list={modalityList} // Sample data for demonstration
                                    defaultValue={field.value}
                                    multiple={true}
                                    handleChange={field.onChange}
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
