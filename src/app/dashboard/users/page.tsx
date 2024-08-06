"use client"
import React from 'react'
import './users.css'
import Button from '@/src/components/button/button'
import { usePathname, useRouter } from 'next/navigation'
import RoleTable from '@/src/components/manageRoleTable/roleTable'

export default function ManageRoles() {
  
  const pathname = usePathname();
  const router = useRouter();
  const handleAddUser = () => {
    const newPath = `${pathname}/add`;
    router.push(newPath);
  }

  return (
    <>
      <div className="manageContainer flex w-full">
        <div className="addUser w-full flex justify-end">
          <Button
            label="+ Add New User"
            onClick={handleAddUser}
            type='button'
            btnStyle={{
              color: '#f0a400',
              backgroundColor: '#fff',
              width: "176.8px",
              height: "60px"
            }}
            disabled={false}
          />
        </div>
        <div className="manageRoles">
          <RoleTable />
        </div>
      </div>
    </>
  )
}
