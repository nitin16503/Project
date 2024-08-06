'use client'


import { verifyCodeMutation } from '@/src/api/user'
import { ApiResponse } from '@/src/utils/types'
import { AxiosError } from 'axios'
import { useSearchParams } from 'next/navigation'
import React, { useEffect } from 'react'

export default function Layout({ children }: {
  children: React.ReactNode
}) {

  const searchParams = useSearchParams()
  const email = searchParams?.get('email')
  const code = searchParams?.get('code')
  const {
    handleVerifyCodeError,
    handleVerifyCodeSuccess,
    verifyCodeError, verifyCodeResponse,
    verifyCodeMutate
  } = verifyCodeMutation();

  useEffect(() => {
    if (email && code)
      verifyCodeMutate({ email, code })
  }, [])

  useEffect(() => {
    if (handleVerifyCodeSuccess) {
      const { statusCode, data } = verifyCodeResponse?.data || {};
      if (statusCode === 200) {

      }
    }
  }, [handleVerifyCodeSuccess]);

  useEffect(() => {
    if (handleVerifyCodeError) {
      const { statusCode, message } = (verifyCodeError as AxiosError<ApiResponse>)?.response?.data ?? {};
      if (statusCode === 400) {
      }
    }
  }, [handleVerifyCodeError]);

  return (
    <>
      {children}
    </>
  );

}
