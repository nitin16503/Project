'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useCreateUser } from '@/src/api/admin'; // Import your createUser hook
import { useRouter } from 'next/navigation';
import { CustomHeader } from '@/src/components/customTable/customTable';
import SelectInput from '@/src/components/selectInput/selectInput';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';


// Define the form data interface
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userLevel: string;
    phoneNo: string;
}

export default function CreateUser() {
    const { control, register, trigger, handleSubmit, getValues, setValue, formState: { errors, isValid } } = useForm<UserData>();
    const router = useRouter();
    const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');

    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const userLevelsList = [
        {
            name: 'Super Admin',
            _id: 'superAdmin'
        }
    ]
    const {
        createUserError,
        createUserErrorObject,
        createUserSuccess,
        createUserResponse,
        createUserMutation,
    } = useCreateUser(); // Use your createUser hook here

    useEffect(() => {
        if (createUserError) {
            handleSnackbarOpen('Error deleting testimonial');
        }
    }, [createUserError]);

    // Redirect on successful user creation
    useEffect(() => {
        if (createUserSuccess) {
            const { statusCode, data } = createUserResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/users'); // Redirect to user dashboard
            }
        }
    }, [createUserSuccess, createUserResponse, router]);

    const handleSnackbarOpen = (message: string) => {
        setSnackbarMessage(message);
        setSnackbarOpen(true);
    };

    const onSubmit = (data: UserData) => {
        let phoneNumber = getValues('phoneNo').toString();
        if (!phoneNumber.startsWith('+91')) {
            // If not, add +91 to the beginning
            phoneNumber = '+91' + phoneNumber;
        }
        createUserMutation({ ...data, phoneNo: phoneNumber }); // Call the createUserMutation with form data
        // Log form data
    };

    const validatePhone = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.value.toString().length > 0) {

            e.target.value = Math.max(0, parseInt(e.target.value))
                .toString()
                .slice(0, 10);
            setValue('phoneNo', e.target.value)
            if (e.target.value.toString().length === 10) {
                setIsPhoneValid(true)
            }
        }
    };


    return (
        <div className='adminContentContainer'>
            <CustomHeader label="Create User" color='#0f4a8a' textcolor='white' />
            <div className="formDiv flex mt-5 w-full">
                <form className="createForm flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex gap-4 flex-1'>
                        <div className='flex-1'>
                            <Controller
                                name="firstName"
                                control={control}
                                rules={{ required: 'First Name is required' }}
                                render={({ field }) => (
                                    <InputWithLabel
                                        label="First Name"
                                        placeholder="Enter first name"
                                        register={register}
                                        name='firstName'
                                        type='text'

                                        errors={errors}
                                        field={field}
                                        onChange={() => trigger('firstName')}
                                    />
                                )}
                            />
                        </div>
                        <div className='flex-1'>
                            <Controller
                                name="lastName"
                                control={control}
                                rules={{ required: 'Last Name is required' }}
                                render={({ field }) => (
                                    <InputWithLabel
                                        label="Last Name"
                                        placeholder="Enter last name"
                                        register={register}
                                        name='lastName'
                                        type='text'

                                        errors={errors}
                                        field={field}
                                        onChange={() => trigger('lastName')}
                                    />
                                )}
                            />
                        </div>
                    </div>

                    <div className='flex gap-4 flex-1'>
                        <div className="flex-1">

                            <Controller
                                name="email"
                                control={control}
                                rules={{ required: 'Email is required' }}
                                render={({ field }) => (
                                    <InputWithLabel
                                        label="Email"
                                        placeholder="Enter email"
                                        register={register}
                                        name='email'
                                        type='email'

                                        errors={errors}
                                        field={field}
                                        onChange={() => trigger('email')}
                                    />
                                )}
                            />
                        </div>
                        <div className='flex-1'>
                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'Password is required' }}
                                render={({ field }) => (
                                    <InputWithLabel
                                        label="Password"
                                        placeholder="Enter password"
                                        register={register}
                                        name='password'
                                        type='password'

                                        errors={errors}
                                        field={field}
                                        onChange={() => trigger('password')}
                                    />
                                )}
                            />
                        </div>
                    </div>
                    <div className="flex gap-4 flex-1">
                        <div className="flex-1">
                            <Controller
                                name="userLevel"
                                control={control}
                                render={({ field }) => (
                                    <SelectInput
                                        list={userLevelsList} // Assuming userLevelsList is an array containing user level options
                                        field={field}
                                        isMulti={false}
                                        onChange={(e) => field.onChange(e.target.value)}
                                        error={!!errors.userLevel}
                                        label="User Level"
                                        errors={errors}
                                        name="userLevel"
                                    />
                                )}
                            />

                        </div>
                        <div className='flex-1'>
                            <Controller
                                name="phoneNo"
                                control={control}
                                rules={{ required: 'Mobile no. is required' }}
                                render={({ field }) => (
                                    <InputWithLabel
                                        label="Mobile no."
                                        placeholder="Enter Mobile no."
                                        register={register}
                                        name='phoneNo'
                                        type='text'

                                        errors={errors}
                                        field={field}
                                        onChange={(e) => {
                                            trigger('phoneNo')

                                            validatePhone(e); // Additional validation on change
                                        }}
                                    />
                                )}
                            />
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
