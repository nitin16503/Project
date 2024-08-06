'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './createR.css';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useCreateReportTemplate } from '@/src/api/admin';
import { useRouter } from 'next/navigation';
import { CustomHeader } from '@/src/components/customTable/customTable';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


interface ReportTemplateFormData {
    name: string;
    template: string;
    global: boolean;
}

export default function CreateReportTemplate() {
    const { control, register, trigger, handleSubmit, formState: { errors, isValid } } = useForm<ReportTemplateFormData>();
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const {
        createReportTemplateError,
        createReportTemplateErrorObject,
        createReportTemplateSuccess,
        createReportTemplateResponse,
        createReportTemplateMutation,
    } = useCreateReportTemplate();

    const onSubmit = (data: ReportTemplateFormData) => {
        createReportTemplateMutation(data);

    };

    useEffect(() => {
        if (createReportTemplateError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
    }, [createReportTemplateError]);

    useEffect(() => {
        if (createReportTemplateSuccess) {
            const { statusCode, data } = createReportTemplateResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/reporttemplate');
            }
        }
    }, [createReportTemplateSuccess, createReportTemplateResponse]);

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Create Report Template" color='#0f4a8a' textcolor='white' />
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
                    <div className='flex flex-col gap-1'>
                        <label style={{ fontSize: '18px' }}>Global</label>
                        <div className="radioInput flex gap-3">
                            <input type="radio" value="true" {...register('global')} /> Yes
                            <input type="radio" value="false" {...register('global')} /> No
                        </div>
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
        </div>
    );
}
