"use client";

import Header from '@/app/components/Header'
import SetNewPasswordForm from '@/app/components/SetNewPasswordFormData'
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