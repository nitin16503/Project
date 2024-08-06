'use client'
import SignInComponent from '@/src/components/signIn/signIn';
import Testimonials from '@/src/components/testimonials/testimonials'
import React, { useEffect, useState } from 'react'
import './support.css'
import { ContactCardProps } from '@/src/utils/types';
import locationImg from '../../../assets/images/location.svg'
import chatImg from '../../../assets/images/chat.svg'
import call from '../../../assets/images/call.svg'
import cCare from '../../../assets/images/cCare.svg'
import Image from 'next/image';

export default function Support() {

    const [parentContainerHeight, setParentContainerHeight] = useState('auto');

    useEffect(() => {
        const handleResize = () => {
            const windowWidth = window.innerWidth;
            const windowHeight = window.innerHeight;
            if (windowHeight > 700) {
                setParentContainerHeight('100%');
            }
            else {
                setParentContainerHeight('auto');
            }
        };

        // Initial call to set the height
        handleResize();

        // Add event listener for window resize
        window.addEventListener('resize', handleResize);

        // Cleanup event listener on component unmount
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div className="supportParentContainer" style={{ height: parentContainerHeight }}>
            <div className='supportContainer'>
                <div className='sideScreen'>
                    <Testimonials />
                </div>
                <div className='support flex items-center justify-center    '>
                    <div className="supportCards flex flex-wrap justify-center items-center">
                        <div className="supoortRow1 flex flex-row w-full justify-center items-center">
                            <ContactCard title='Chat to us' subtitle='Our friendly team is here to help.'
                                link='hi@radpretation.com' icon={chatImg} />
                            <ContactCard title='Office' subtitle='Come say hello at our office HQ'
                                link='100 Smith Street, Collingwood VIC 3066 AU' icon={locationImg} />
                        </div>
                        <div className="supoortRow2 flex flex-row w-full justify-center items-center">

                            <ContactCard title='Phone' subtitle='Tollfree Number'
                                link='1800 - 98765432' icon={call} />
                            <ContactCard title='Whatsapp Support' subtitle='Message us on whatsapp.'
                                link='whatsapp.com/radpretation' icon={cCare} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


const ContactCard: React.FC<ContactCardProps> = ({ title, subtitle, link, icon }) => {
    return (
        <div className="contact-card flex flex-col justify-center items-center">
            <div className="contact-icon">
                <Image
                    src={icon}
                    alt={title}
                    className='supportIcon'
                    width={42}
                    height={42}
                />
            </div>
            <div className="contact-info flex flex-col justify-center items-center">
                <div className="supportTitle">
                    {title}
                </div>
                <div className="supportSubTitle">
                    {subtitle}
                </div>
                <a href={link} target="_blank" rel="noopener noreferrer"
                    style={{ color: '#0f4a8a', fontWeight: '600', fontSize: '12px' }}>{link}</a>
            </div>
        </div>
    );
}
