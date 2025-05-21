import AgencyDetails from '@/components/forms/agency-details';
import { getAuthUserDetails, verifyAndAcceptInvitation } from '@/lib/queries'
import { currentUser } from '@clerk/nextjs/server';
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
  console.log(agencyId)
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
     const authUser = await currentUser();
     return (
       <div className="flex justify-center items-center mt-4">
         <div className="max-w-[850px] border-[1px] p-4 rounded-xl">
           <h1 className="text-2xl font-bold">Create An Agency</h1>
           <p className="text-gray-500">
             You are logged in as {authUser?.firstName} {authUser?.lastName}
           </p>
           <AgencyDetails data={undefined} />
         </div>
       </div>
     );
  }

}
export default page