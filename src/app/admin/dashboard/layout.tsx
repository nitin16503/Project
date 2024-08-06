'use client'
import SidePanel from '@/src/components/admin/signIn/sidepanel/sidepanel';
import { getUserInfo } from '@/src/utils/helper';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function Layout({
  children,
}: {
  children: React.ReactNode
}) {

  const [level, setLevel] = useState('');
  const [center, setCenter] = useState({ id: '', name: '' });
  const [centerList, setCenterList] = useState([]);
  const [userName, setUserName] = useState('');

  const router = useRouter();

  useEffect(() => {
    // Read the cookie on the client side
    // const level = getUserInfo('level') || '';
    const level = 'superAdmin';
    const name = getUserInfo('name') || '';
    level == 'superAdmin' ? setLevel('superAdmin') : router.push('/admin/login');

    if (name) {
      setUserName(name)
    }
  }, []);

  return (
    <>
      {
        level == 'superAdmin' ?
          (
            <>
              <div className="adminDash flex gap-4 h-full" style={{overflowY: 'hidden'}}>
                <div className="sidePanel">
                  <SidePanel />
                </div>
                <div className="mainPanel flex-1" style={{overflowY: 'scroll'}}>
                  {children}
                </div>
              </div>
            </>
          )
          :
          <>

          </>
      }

    </>
  )
}
