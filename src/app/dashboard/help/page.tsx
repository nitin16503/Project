'use client'

import React, { ChangeEvent, useEffect, useState } from 'react'
import Modal from '@mui/material/Modal';
import ratImg from '../../../assets/images/rat.svg'
import kbImg from '../../../assets/images/rb.svg';
import { helpBoxType } from '@/src/utils/types';
import Image from 'next/image';
import Button from '@/src/components/button/button';
import './help.css'
import CloseIcon from '@mui/icons-material/Close';
import SearchField from '@/src/components/searchField/searchField';
import InputWithLabel from '@/src/components/input/input';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import { RaiseRequestModalProps , RaiseFormData } from '@/src/utils/types';

export default function Help() {

    const [debouncedSearchString, setDebouncedSearchString] = useState('');
    const [searchString, setSearchString] = useState('');
    const [isModalOpen, setModalOpen] = useState(false);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedSearchString(searchString);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchString]);

    useEffect(() => {
        console.log('string search', debouncedSearchString);
        // refetchSearch();
    }, [debouncedSearchString]);

    const handleSearch = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target;
        setSearchString(value);
    };
    const handleClearField = () => {
        setSearchString('');
    }
    const handleRaiseTicket = () => {
        setModalOpen(true)
        console.log('click');
    }
    const handleKB = () => {
        console.log('click Kb');
    }

    return (
        <>
            <div className="helpContainer w-full flex flex-col">
                <HelpBox title='Raise a Support Ticket' width={33} icon={ratImg} buttonName='Raise Ticket' handleClick={() => { handleRaiseTicket() }} />
                <HelpBox title='Knowledge base' width={20} subtitle='Send a message to any of your insurance providers and get a response within 3 days'
                    icon={kbImg} buttonName='View' handleClick={() => { handleKB() }} />
                <div className="faq">
                    <div className="faqHeader">
                        Frequently Asked Questions
                    </div>
                    <div style={{backgroundColor:'#FFFFFF'}}>
                    <SearchField 
                        handleSearch={handleSearch} 
                        handleClearField={handleClearField}
                        label="Search"
                        customStyles={{
                            height: '64px',
                        }}
                    />
                    </div>
                    
                </div>
            </div>
            <RaiseRequestModal
                isModalOpen={isModalOpen}
                setModalOpen={setModalOpen}
            />
        </>
    )
}

const HelpBox: React.FC<helpBoxType> = (
    {
        title,
        subtitle,
        buttonName,
        width,
        icon,
        handleClick
    }
) => {

    return (
        <div className="helpBox flex flex-row w-full">
            <div className="help-left items-center flex">
                <div className="helpIcon">
                    <Image
                        src={icon}
                        alt={`${title} Image`}
                        width={width}
                        className='hl'
                        height={20}
                    />
                </div>
                <div className="help-tittle flex flex-col">
                    <div className="helpTitle">
                        {title}
                    </div>
                    {
                        subtitle && <div className="helpSubTitle">
                            {subtitle}
                        </div>
                    }

                </div>

            </div>
            <div className="help-right">
                <Button
                    label={buttonName}
                    type='button'
                    onClick={() => { handleClick() }}
                    btnStyle={{
                        color: "#fff",
                        background: "#0F4A8A",
                        minWidth: "fit-content"
                    }}
                />
            </div>
        </div>
    )
}

const RaiseRequestModal: React.FC<RaiseRequestModalProps> = ({
    isModalOpen,
    setModalOpen,
}) => {

    const validationSchema = yup.object().shape({
        name: yup.string().required('Name is required'),
        email: yup.string().email('Invalid email').required('Email is required'),
        description: yup.string().required('Description is required'),
    });

    const { register, handleSubmit, control, setError, getValues, trigger, formState: { errors, isValid } } = useForm<RaiseFormData>({
        resolver: yupResolver(validationSchema),
    });

    const handleFormSubmit = (data: RaiseFormData) => {
        console.log(data, 'log')
    }
    const handleClose = () => {
        setModalOpen(false)
    }

    return (
        <Modal
            open={isModalOpen}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <div className="modal-container">
                <div className="modal-content flex flex-col">
                    <div className="modal-top flex flex-row justify-between">
                        <div className="ticket-heading">
                            Raise a ticket
                        </div>
                        <div className="close" style={{ color: '#625f5f', cursor: 'pointer' }}>
                            <CloseIcon className="modal-close-button" onClick={() => { handleClose() }} />
                        </div>
                    </div>
                    <form className='w-full' onSubmit={handleSubmit(handleFormSubmit)}>
                        <div className="form flex flex-col w-full">
                            <div className='flex flex-col justify-start' style={{ rowGap: '20px' }}>
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field }: any) => (
                                        <InputWithLabel
                                            label="Name"
                                            placeholder="Enter your password"
                                            register={register}
                                            name='name'
                                            type='name'
                                            errors={errors}
                                            field={field}
                                            onChange={() => trigger('name')}
                                        />
                                    )}
                                />
                                <Controller
                                    name="email"
                                    control={control}
                                    rules={{ required: 'Email is required' }}
                                    render={({ field }: any) => (
                                        <InputWithLabel
                                            label="Email"
                                            placeholder="Enter your email"
                                            register={register}
                                            name='email'
                                            type='email'
                                            errors={errors}
                                            field={field}
                                            onChange={() => trigger('email')}
                                        />
                                    )}
                                />
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: 'Description is required' }}
                                    render={({ field }: any) => (
                                        <InputWithLabel
                                            label="Description"
                                            placeholder="Enter your description"
                                            register={register}
                                            name='description'
                                            type='description'
                                            errors={errors}
                                            field={field}
                                            onChange={() => trigger('description')}
                                        />
                                    )}
                                />
                            </div>
                            {errors.form && <p className="formError">{errors.form.message}</p>}
                            <div className="loginButton" style={{ marginTop: '26px' }}>
                                <Button
                                    type="submit"
                                    label="Raise Ticket"
                                    disabled={!isValid}
                                    btnStyle={{
                                        color: '#fff',
                                        backgroundColor: '#0f4a8a',
                                        minWidth: "fit-content"
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Modal>
    )
}