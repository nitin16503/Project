'use client'

import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useUpdateTestimonialById, useGetTestimonialById } from '@/src/api/admin'; // Import hooks for updating and getting testimonial by ID
import { useParams, useRouter } from 'next/navigation';
import { CustomHeader } from '@/src/components/customTable/customTable';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import Image from 'next/image';
import { BASE_URL } from '@/src/utils/config';

interface TestimonialFormData {
    description: string;
    active: boolean;
    authorName: string;
    authorTitle: string;
    rating: number;
    image: File | null;
    email: string;
}

interface TestimonialParams {
    id: string;
}

export default function EditTestimonialByID() {
    const { control, register, trigger, handleSubmit, getValues,setValue, formState: { errors, isValid } } = useForm<TestimonialFormData>();
    const router = useRouter();
    const [image, setImage] = useState('')
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const { id } = useParams();
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // Hooks for getting and updating testimonial by ID
    const {
        updateTestimonialByIdError,
        updateTestimonialByIdSuccess,
        updateTestimonialByIdResponse,
        updateTestimonialByIdMutation,
    } = useUpdateTestimonialById();

    const {
        getTestimonialByIdError,
        getTestimonialByIdSuccess,
        getTestimonialByIdResponse,
        getTestimonialByIdMutation,
    } = useGetTestimonialById();

    // Fetch testimonial data by ID on component mount
    useEffect(() => {
        if (id !== '') {
            getTestimonialByIdMutation(id as string);
        }
    }, [id]);

    useEffect(() => {
        if (getTestimonialByIdError) {
            handleSnackbarOpen('Error fetching id');
        }
        if (updateTestimonialByIdError) {
            handleSnackbarOpen('Error in updating healthcare facility');
        }
    }, [getTestimonialByIdError, updateTestimonialByIdError]);

    // Populate form fields with testimonial data on successful fetch
    useEffect(() => {
        if (getTestimonialByIdSuccess) {
            const { text, active, author, rating, email } = getTestimonialByIdResponse.data;
            setValue('description', text);
            setValue('active', active == 'ACTIVE' ? true : false);
            setValue('authorName', author?.name);
            setValue('authorTitle', author?.title);
            setValue('rating', rating);
            setValue('email', author?.email);
            setValue('image', author?.avatar);
            setImage(author?.avatar);
        }
    }, [getTestimonialByIdSuccess, getTestimonialByIdResponse]);

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };


    // Handle form submission
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
        updateTestimonialByIdMutation({ id, data: formData }); // Call the updateTestimonialByIdMutation with form data and ID
    };

    // Redirect on successful testimonial update
    useEffect(() => {
        if (updateTestimonialByIdSuccess) {
            const { statusCode } = updateTestimonialByIdResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/testimonials'); // Redirect to testimonials dashboard
            }
        }
    }, [updateTestimonialByIdSuccess, updateTestimonialByIdResponse, router]);

    // Function to handle file change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files && e.target.files[0];
        setSelectedFile(file);
    };

    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Edit Testimonial" color='#0f4a8a' textcolor='white' />
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
                        
                        {image ? (
                            <>
                             <input type="file" onChange={handleFileChange} />
                            <Image src={`${BASE_URL}/${image}`} alt="Testimonial Image" width={300} height={300} />
                            </>
                            // If an image value exists, display the image
                        ) : (
                            // If no image value exists, display the file input
                            <input type="file" onChange={handleFileChange} />
                        )}
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
