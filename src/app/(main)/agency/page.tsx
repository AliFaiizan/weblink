import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import React from 'react'

const page = async () => {
  
  const agencyId = await verifyAndAcceptInvitation();
  const user = await getAuthUserDetails(); 
  
  return (
    <div>Agency</div>
  )
}

export default page