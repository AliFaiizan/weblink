import React from 'react'
import Image from 'next/image'
import { FileIcon, X } from 'lucide-react';
import { Button } from '../ui/button';
import { UploadDropzone } from '@/lib/uploadthing';

type FileUploadProps = {
    apiEndpoint: 'agencyLogo'| 'avatar'| 'subaccountLogo',
    onChange:( url?:string) => void,
    value?: string | null,
}

const FileUpload = ({apiEndpoint,onChange,value}:FileUploadProps) => {
    const type = value?.split('.').pop();
    if (value){
        return (<div className='flex flex-col justify-center items-center'>
            {type !== 'pdf' ? (<div className='relative w-40 h-40'>
                <Image src={value} alt={"uploaded Image"} className='object-contain' fill />
            </div>) : (
                <div className='relative flex items-center p-2 mt-2 rounded-md bg-background/10 w-40 h-40'>
                    <FileIcon/>
                    <a href={value} target="_blank" rel="noopener noreferrer" className='text-sm ml-2 text-indigo-500 dark:text-indigo-400 hover:underline'>View PDF</a>
                </div>
            )}
            <Button className='' variant="ghost" type="button" onClick={() => onChange(undefined)}>
                <X className='h-4 w-4' />
                Remove Logo</Button>
        </div>)
    }
    return (
        <div className='w-4 bg-muted/30'>
            <UploadDropzone
                endpoint={apiEndpoint}
                onClientUploadComplete={(res) => {
                    if (res && res[0]?.url) {
                        onChange(res[0].url);
                    }
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
                />
        </div>
    )
}

export default FileUpload