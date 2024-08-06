import React, { useState, useEffect } from 'react';
import './sidepanel.css';
import { usePathname, useRouter } from 'next/navigation';
import { logoutMutation } from '@/src/api/user';
import logo from '../../../../assets/images/logo.png';
import Image from 'next/image';

export default function SidePanel() {
  const tabs = ['users', 'testimonials', 'healthcare', 'centers', 'modality', 'reporttemplate'];
  const router = useRouter();
  
  const path = usePathname();
  const { logout } = logoutMutation()
  const adminPath = '/admin/dashboard/'
  const tab = tabs.find((item)=> path.includes(item));
  const activeTab = tab;

  const handleLogout = () => {
    //e.preventDefault();
    logout();
  };

  const handleTabChange = (tabName: string) => {
    const demoPath = adminPath + tabName
    if(activeTab != demoPath){
      router.push(`/admin/dashboard/${tabName}`);
    }

  };

  return (
    <div className="side-panel flex flex-col justify-between h-full" >
      <div>
        <h2 className="heading my-5">
        <Image
          src={logo}
          alt={`Image`}
          width={230} //-30
          height={230}
          className="image"
        />
        </h2>
        <div className="tabs mt-5 flex flex-col gap-3">
          {tabs.map((tab) => (
            <div
              key={tab}
              className={`adminTab ${activeTab === tab ? 'active' : ''}`}
              onClick={() => handleTabChange(tab)}
            >
              {
                tab === 'reporttemplate' ? 'Report Templates' :
              tab.charAt(0).toUpperCase() + tab.slice(1)}
            </div>
          ))}
        </div>
      </div>
      <div className="logout" onClick={handleLogout}>
        Logout
      </div>
    </div>
  );
}
