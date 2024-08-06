"use client"

import React from 'react'
import IconButton from '@mui/material/IconButton';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface BackButtonProps {
onclick: () => void
}

const BackButton: React.FC<BackButtonProps> = ({
onclick
}) => {
    return (
        <>
        <IconButton onClick={onclick}>
            <ArrowBackIcon />
        </IconButton>
        </>
    );
}

export default BackButton;
