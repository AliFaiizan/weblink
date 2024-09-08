"use server";

import { clerkClient, currentUser } from "@clerk/nextjs/server";
import {db} from './db';
import { redirect } from "next/navigation";
import { User } from "@prisma/client";

export const getAuthUserDetails = async () => {
    const user = await currentUser();
    if(!user){
        return 
    }
    const userData = await db.user.findUnique({
        where:{
            email: user.emailAddresses[0].emailAddress,
        },
        include:{
            Agency:{
                include:{
                    SidebarOption:true,
                    SubAccount:{
                        include:{
                            SidebarOption:true
                        }
                    }
                }
            },
            Permissions:true
        },
    });

    return userData;
};

export const saveActivityLogsNotification = async (
  description: string,
  agencyId?: string,
  subaccountId?: string
) => {
  const authUser = await currentUser();

  let userData:User;

  if (!authUser) {
    const response = await db.user.findFirst({
        where: {
            Agency:{
                SubAccount:{
                    some:{ id:subaccountId },
                }
            }
        }
    })
    if(response){
        userData = response;
    }
  }else{
    userData = await db.user.findUnique({
        where:{
            email: authUser?.emailAddresses[0].emailAddress,
        }
    }) as User;

    if(!userData){
        console.log("User not found");
        return;
    }

    let foundAgencyId = agencyId;

    if(!foundAgencyId){
        if(!subaccountId){
            throw new Error("Agency or Subaccount id is required");
        }

        const response  = await db.subAccount.findUnique({
            where:{
                id:subaccountId
            }
        })

        if(response){
            foundAgencyId = response.agencyId;
        }
    }

    if(subaccountId){
        await db.notification.create({
            data:{
                notification:`${userData.name} | ${description}`,
                User:{
                    connect:{
                        id:userData.id
                    }
                },
                Agency:{
                    connect:{
                        id:foundAgencyId
                    }
                },
                SubAccount:{
                    connect:{
                        id:subaccountId
                    }
                }
            }
        })
    }



  }
};

export const createTeamUser = async (agencyId:string, user:User) => {
    if(user.role === "AGENCY_OWNER") return null;

    const response = await db.user.create({
        data:{...user}
    });

    return response;
}

export const verifyAndAcceptInvitation = async () => {
    const user = await currentUser();
    if(!user){
        return redirect("/sign-in");
    }
    //query to check if the invitation exists
    const invitationExists = await db.invitation.findUnique({
        where:{
            email: user.emailAddresses[0].emailAddress,
            status:"PENDING"
        },
    });

    if(invitationExists){
        const userDetail = await createTeamUser(invitationExists.agencyId,{
            email: invitationExists.email,
            agencyId: invitationExists.agencyId,
            avatarUrl: user.imageUrl,
            id: user.id,
            name: `${user.firstName} ${user.lastName}`,
            role: invitationExists.role,
            createdAt: new Date(),
            updatedAt: new Date(),
        });
        //activity log
        await saveActivityLogsNotification("Accepted invitation",invitationExists.agencyId, undefined);
        
        if(userDetail){
            await clerkClient.users.updateUserMetadata(user.id,{
                privateMetadata:{
                    role: userDetail?.role || "SUBACCOUNT_USER",
                }
            })
    
            //delete the invitation
    
            await db.invitation.delete({
                where:{
                    email: userDetail.email,
                }
            });
    
            return userDetail.agencyId;

        }else return null;
    }else{
        const foundUser = await db.user.findUnique({
            where:{
                email: user.emailAddresses[0].emailAddress,
            }
        })
        return foundUser ? foundUser.agencyId : null;
    }

    
};