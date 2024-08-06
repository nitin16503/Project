'use client'
import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import InputWithLabel from '@/src/components/input/input';
import Button from '@/src/components/button/button';
import { useUpdateUserById, useGetUserById, getCentersList } from '@/src/api/admin'; // Import your updateUserById and getUserById hooks
import { useRouter, useParams } from 'next/navigation';
import { CustomHeader } from '@/src/components/customTable/customTable';
import SelectInput from '@/src/components/selectInput/selectInput';
import AutocompleteInput from '@/src/components/AutocompleteInput/autocompleteInput';

// Define the form data interface
interface UserData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    userLevel: string;
    phoneNo: string;
    centers: UserParams;
}

interface UserParams {
    id: string;
}

export default function EditUserByID() {
    const { control, register, trigger, handleSubmit, setValue, formState: { errors, isValid } } = useForm<UserData>();
    const router = useRouter();
    const [centersList, setCentersList] = useState([])
    const path = useParams();
    const [existCenters, setExistCenters] = useState([])

    const [centersLimit, setCenterLimit] = useState(10);
    const [isPhoneValid, setIsPhoneValid] = useState(false);
    const { id } = path;
    const userLevelsList = [
        {
            name: 'SuperAdmin',
            _id: 'superAdmin'
        },
        {
            nmme: 'RadioLogist',
            _id: 'radioLogist'
        },
        {
            name: 'RadioLolgistAdmin',
            _id: 'radioLogistAdmin'
        },
        {
            name: 'Admin',
            _id: 'ADMIN'
        }
    ]
    const {
        updateUserByIdError,
        updateUserByIdErrorObject,
        updateUserByIdSuccess,
        updateUserByIdResponse,
        updateUserByIdMutation,
    } = useUpdateUserById(); // Use your updateUserById hook here

    const {
        handleCentersError,
        centersError,
        handleCentersSuccess,
        centersResponse,
        centersStatus,
        centersMutate,
    } = getCentersList({
        search: '',
        limit: centersLimit
    });

    const {
        getUserByIdError,
        getUserByIdErrorObject,
        getUserByIdSuccess,
        getUserByIdResponse,
        getUserByIdMutation,
    } = useGetUserById(); // Use your getUserById hook here

    // Fetch user data by ID on component mount
    useEffect(() => {
        if (id !== '') {
            getUserByIdMutation(id as string);
            centersMutate();
        }
    }, [id]);

    useEffect(() => {
        if (centersLimit > 10) {
            centersMutate();
        }
    }, [centersLimit])

    useEffect(() => {
        if (handleCentersSuccess) {
            const { items, totalPages, totalItems } = centersResponse?.data?.data || {};
            setCentersList(items || [])

            if (totalPages > 1 && centersLimit == 10) {
                setCenterLimit(totalItems);
            }
        }
    }, [handleCentersSuccess])

    // Populate form fields with user data on successful fetch
    useEffect(() => {
        if (getUserByIdSuccess) {
            const { firstName, lastName, email, userLevel, phoneNo, centers } = getUserByIdResponse.data;
            setValue('firstName', firstName);
            setExistCenters(centers)
            setValue('lastName', lastName);
            setValue('email', email);
            setValue('userLevel', userLevel);
            setValue('phoneNo', phoneNo);

        }
    }, [getUserByIdSuccess, getUserByIdResponse]);

    // Handle form submission
    const onSubmit = (data: UserData) => {
        updateUserByIdMutation({ id, centerId: data.centers.id });
    };

    // Redirect on successful user update
    useEffect(() => {
        if (updateUserByIdSuccess) {
            const { statusCode } = updateUserByIdResponse || {};
            if (statusCode === 200) {
                router.push('/admin/dashboard/users'); // Redirect to user dashboard
            }
        }
    }, [updateUserByIdSuccess, updateUserByIdResponse, router]);

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
            <CustomHeader label="Edit User" color='#0f4a8a' textcolor='white' />
            <div className="formDiv flex mt-5 w-full">
                <form className="createForm flex flex-col gap-4 w-full" onSubmit={handleSubmit(onSubmit)}>
                    <div className='flex gap-4 flex-1'>
                        <div className='flex-1'>
                            <Controller
                                name="firstName"
                                control={control}
                                disabled
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
                                disabled
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
                                disabled
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
                                        disabled={true}
                                        name="userLevel"
                                    />
                                )}
                            />
                        </div>
                        <div className='flex-1'>
                            <Controller
                                name="phoneNo"
                                control={control}
                                disabled
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
                    <div className='flex-1'>
                        <>

                            {
                                existCenters.length > 0 && (
                                    <div className='mb-3 '>
                                        <div className="centersName mb-2" style={{fontSize: '18px'}}>Centers Name:</div>
                                        {existCenters.map((item: any) => (
                                            <div className="flex ml-2" key={item.id}>
                                                <div className='flex gap-4 flex-1' style={{fontSize: '14px'}}>
                                                    <p>{item.name}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )
                            }

                        </>
                        <Controller
                            name="centers"
                            control={control}
                            rules={{ required: 'Centers are required' }}
                            render={({ field }) => (
                                <AutocompleteInput
                                    label="Centers"
                                    list={centersList} // Assuming centersList is an array containing center options
                                    defaultValue={field.value}
                                    handleChange={field.onChange}

                                />
                            )}
                        />
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
