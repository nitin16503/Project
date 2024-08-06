'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import './createT.css';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useCreateTestimonial } from '@/src/api/admin';
import { useRouter } from 'next/navigation';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

import { CustomHeader } from '@/src/components/customTable/customTable';

interface TestimonialFormData {
    description: string;
    active: boolean;
    authorName: string;
    authorTitle: string; // New field: Author Title
    rating: number; // New field: Rating
    image: File | null;
    email: string;
}

export default function CreateTestimonial() {
    const { control, register, trigger, handleSubmit, formState: { errors, isValid } } = useForm<TestimonialFormData>();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [snackbarOpen, setSnackbarOpen] = useState(false);

    const [snackbarMessage, setSnackbarMessage] = useState('');

    const router = useRouter();
    const {
        createTestimonialError,
        createTestimonialErrorObject,
        createTestimonialSuccess,
        createTestimonialResponse,
        createTestimonialMutation,
    } = useCreateTestimonial()

    const onSubmit = (data: TestimonialFormData) => {
        const formData = new FormData();
        formData.append('text', data.description);
        formData.append('status', data.active.toString());
        formData.append('authorName', data.authorName);
        formData.append('authorTitle', data.authorTitle); // Append authorTitle to formData
        formData.append('rating', data.rating.toString()); // Append rating to formData
        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        formData.append('authorEmail', data.email);
        createTestimonialMutation(formData)
        // Log formData
    };

    useEffect(() => {
        if (createTestimonialSuccess) {

            const { statusCode, data } = createTestimonialResponse || {};
            if (statusCode === 200) {

                router.push('/admin/dashboard/testimonials');

            }
        }
    }, [createTestimonialSuccess, createTestimonialResponse]);

    useEffect(() => {
        if (createTestimonialError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
    }, [createTestimonialError]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedFile(file);
    };

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Create Testimonial" color='#0f4a8a' textcolor='white' />

            <div className="formDiv flex mt-5 w-full">
                <form className="createForm flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <Controller
                            name="description"
                            control={control}
                            rules={{ required: 'Description is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Description"
                                    placeholder="Enter your description"
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
                    <div className='flex flex-col gap-1'>
                        <label style={{ fontSize: '18px' }}>Active</label>
                        <div className="radioInput flex gap-3">
                            <input type="radio" value="ACTIVE" {...register('active')} /> Yes
                            <input type="radio" value="DISABLED" {...register('active')} /> No
                        </div>
                    </div>
                    <div>
                        <Controller
                            name="authorName"
                            control={control}
                            rules={{ required: 'Author name is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Author Name"
                                    placeholder="Enter your name"
                                    register={register}
                                    name='authorName'
                                    type='text'
                                    errors={errors}
                                    field={field}
                                    width='50%'
                                    onChange={() => trigger('authorName')}
                                />

                            )}
                        />
                    </div>
                    {/* New field: Author Title */}
                    <div>
                        <Controller
                            name="authorTitle"
                            control={control}
                            rules={{ required: 'Author title is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Author Title"
                                    placeholder="Enter author title"
                                    register={register}
                                    name='authorTitle'
                                    type='text'
                                    errors={errors}
                                    field={field}
                                    width='50%'
                                    onChange={() => trigger('authorTitle')}
                                />

                            )}
                        />
                    </div>
                    {/* New field: Rating */}
                    <div>
                        <Controller
                            name="rating"
                            control={control}
                            rules={{ required: 'Rating is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Rating"
                                    placeholder="Enter rating (1-5)"
                                    register={register}
                                    name='rating'
                                    type='number'
                                    errors={errors}
                                    field={field}
                                    width='50%'
                                    onChange={() => trigger('rating')}
                                />
                            )}
                        />

                    </div>
                    <div className='flex flex-col gap-1'>
                        <label style={{ fontSize: '18px' }}>Image</label>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                    <div>
                        <Controller
                            name="email"
                            control={control}
                            rules={{ required: 'Email name is required' }}
                            render={({ field }) => (
                                <InputWithLabel
                                    label="Email"
                                    placeholder="Enter your email"
                                    register={register}
                                    width='50%'
                                    name='email'
                                    type='email'
                                    errors={errors}
                                    field={field}
                                    onChange={() => trigger('email')}
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
