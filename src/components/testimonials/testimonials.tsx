import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query'
import AutoCarousel from '../autoCarousel/autoCarousel';
import Logo from '../logo/logo';
import './testimonials.css'
import { getTestimonials } from '@/src/api/testimonials';

export default function Testimonials() {

    const [list, setList] = useState<[]>([]);
    const { response, isSuccess, isLoading } = getTestimonials();
    useEffect(() => {
        if (isSuccess) {
            const { data, statusCode } = response?.data
            if (statusCode == 200) {
                setList(data)
            }
        }
    }, [isSuccess])

    return (
        <div className="ssContainer w-full">
            <div className="ssSubContainer ">
                <Logo
                    width={500}
                    height={500}
                    subTitle='Bring Operational efficiency with us.'
                />
                <div className="crousel">
                    <AutoCarousel slides={list} />
                </div>
            </div>
        </div>
    );
}
