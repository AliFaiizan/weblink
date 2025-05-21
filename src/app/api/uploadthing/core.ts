import { createUploadthing, type FileRouter } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

const authenticateUser = () => {
  const user = auth();
  if (!user) throw new Error("Unauthorized");
  return { user };
}

export const ourFileRouter = {
    subaccountLogo: f({
        image:{
            maxFileSize: "4MB",
            maxFileCount: 1,
        }
    }).middleware(authenticateUser).onUploadComplete(()=>{
        // do something with the file after upload
        console.log("File uploaded");
    }),
    avatar:f({
        image:{
            maxFileSize: "4MB",
            maxFileCount: 1,
        }
    }).middleware(authenticateUser).onUploadComplete(()=>{
        // do something with the file after upload
        console.log("avatar uploaded");
    }),
    agencyLogo:f({
        image:{
            maxFileSize: "4MB",
            maxFileCount: 1,
        }
    }).middleware(authenticateUser).onUploadComplete(()=>{
        // do something with the file after upload
        console.log("agency logo uploaded");
    }),
    media:f({
        image:{
            maxFileSize: "4MB",
            maxFileCount: 1,
        }
    }).middleware(authenticateUser).onUploadComplete(()=>{
        // do something with the file after upload
        console.log("media uploaded");
    })
} satisfies FileRouter;
export type OurFileRouter = typeof ourFileRouter;