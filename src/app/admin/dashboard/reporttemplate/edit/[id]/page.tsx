'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './editR.css';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useGetReportTemplateByID, useUpdateReportTemplateByID } from '@/src/api/admin';
import { useParams, useRouter } from 'next/navigation';
import { CustomHeader } from '@/src/components/customTable/customTable';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


interface ReportTemplateFormData {
    name: string;
    template: string;
    global: boolean;
}

interface ReportTemplateParams {
    id: string;
}

export default function EditReportTemplateByID() {
    const { control, register, trigger, handleSubmit, formState: { errors, isValid }, setValue } = useForm<ReportTemplateFormData>();
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [radioValue, setradioValue] = useState(true);
    const path = useParams();
    const { id } = path;
    const {
        getReportTemplateByIdError,
        getReportTemplateByIdErrorObject,
        getReportTemplateByIdSuccess,
        getReportTemplateByIdResponse,
        getReportTemplateByIdMutation,
    } = useGetReportTemplateByID();

    const {
        updateReportTemplateByIDError,
        updateReportTemplateByIDErrorObject,
        updateReportTemplateByIDSuccess,
        updateReportTemplateByIDResponse,
        updateReportTemplateByIDMutation,
    } = useUpdateReportTemplateByID();

    useEffect(() => {
        if (id != '') {
            getReportTemplateByIdMutation(id as string);
        }
    }, [id]);

    useEffect(() => {
        if (updateReportTemplateByIDError) {
            handleSnackbarOpen('Error fetching id');
        }
        if (getReportTemplateByIdError) {
            handleSnackbarOpen('Error in updating healthcare facility');
        }
    }, [updateReportTemplateByIDError, getReportTemplateByIdError]);

    useEffect(() => {
        if (updateReportTemplateByIDSuccess) {
            const { statusCode } = updateReportTemplateByIDResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/reporttemplate');
            }
        }
    }, [updateReportTemplateByIDSuccess, updateReportTemplateByIDResponse]);

    useEffect(() => {
        if (getReportTemplateByIdSuccess) {
            const { name, template, global } = getReportTemplateByIdResponse.data;
            setValue('name', name);
            setValue('template', template);
            setValue('global', global);
            setradioValue(global)

        }
    }, [getReportTemplateByIdSuccess, getReportTemplateByIdResponse]);

    const onSubmit = (data: ReportTemplateFormData) => {
        updateReportTemplateByIDMutation({ id, data });
        // Log form data
    };

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Edit Report Template" color='#0f4a8a' textcolor='white' />
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
                                    placeholder="Enter report template name"
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
                            name="template"
                            control={control}
                            rules={{ required: 'Template is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Template"
                                    placeholder="Enter report template"
                                    register={register}
                                    name='template'
                                    type='text'
                                    width='50%'
                                    errors={errors}
                                    field={field}
                                    onChange={() => trigger('template')}
                                />
                            )}
                        />
                    </div>
                    <div className="radioInput flex gap-3">
                        <label style={{ fontSize: '18px' }}>Global</label>
                        <input
                            type="radio"
                            value="true"
                            {...register('global')}
                            checked={radioValue === true}
                            onChange={() => setradioValue(true)}
                        />
                        Yes
                        <input
                            type="radio"
                            value="false"
                            {...register('global')}
                            checked={radioValue === false}
                            onChange={() => setradioValue(false)}
                        />
                        No
                    </div>

                    <div className="createSubmit flex justify-start mb-5">
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
