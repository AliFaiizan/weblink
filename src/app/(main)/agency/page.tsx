import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { Plan } from '@prisma/client';
import { redirect } from 'next/navigation';
import React from 'react'

type pageProps = {
  searchParams:{
    plan:Plan;
    state:string,
    code:string
  }
}

const page = async ({searchParams}:pageProps) => {
  
  
  const agencyId = await verifyAndAcceptInvitation();
  const user = await getAuthUserDetails(); // get current authroized user

  if(agencyId){
    if(user?.role=== "SUBACCOUNT_GUEST" || user?.role=== "SUBACCOUNT_USER"){
      return redirect(`/subaccount`);
    }else if(user?.role === "AGENCY_OWNER" || user?.role === "AGENCY_ADMIN"){
      if(searchParams.plan){
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`);
      }
      if(searchParams.state){
        const statePath  = searchParams.state.split('__'[0]);
        const stateAgencyId = searchParams.state.split('___'[1]);
        if(!stateAgencyId){
          return <div>Not authroized</div>
        }

        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`);
      }
    }else return redirect(`/agency/${agencyId}`);

  }else{
    return <div>Not authroized</div>
  }
  return (
    <div>{user?.email}</div>
  )
}
export default page