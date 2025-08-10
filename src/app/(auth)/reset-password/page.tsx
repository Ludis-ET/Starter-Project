"use client";

import Header from '@/components/app/Header'
import SetNewPasswordForm from '@/components/app/SetNewPasswordFormData'
import React, { Suspense } from 'react'

const ResetPassword = () => {
  return (
    <>
      <Header />
      <Suspense fallback={<div>Loading...</div>}>
        <SetNewPasswordForm />
      </Suspense>
    </>
  )
}

export default ResetPassword