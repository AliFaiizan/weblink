'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Agency } from '@prisma/client'
import { useToast } from '../ui/use-toast'
import { AlertDialog } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel } from '../ui/form'
import FileUpload from '../global/file-upload'


type AgencyDetailsProps = {
    data?: Partial<Agency>
}

const agencyDetailsSchema = z.object({
  name: z.string().min(2, { message: 'Agency name is requiredand must be 2 character' }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean().default(false),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),

})

const AgencyDetails = ({data}:AgencyDetailsProps) => {

  const {toast } = useToast();
  const router = useRouter();
  const [deletingAgency, setDeletingAgency] = React.useState(false);
  
  const form = useForm<z.infer<typeof agencyDetailsSchema>>({
      mode: 'onChange',
      resolver: zodResolver(agencyDetailsSchema),
      defaultValues: {
          name: data?.name || '',
          companyEmail: data?.companyEmail || '',
          companyPhone: data?.companyPhone || '',
          whiteLabel: data?.whiteLabel || false,
          address: data?.address || '',
          city: data?.city || '',
          zipCode: data?.zipCode || '',
          state: data?.state || '',
          country: data?.country || '',
          agencyLogo: data?.agencyLogo || '',
        },
    });
  const isLoading = form.formState.isSubmitting;
    
  useEffect(() => {
    if(data){
      form.reset(data);
    }
  }, [data]);

  const handleSubmit = async (values: z.infer<typeof agencyDetailsSchema>) => {
    try {
      // Call your API to create the agency
      // await createAgency(values);
      toast({
        title: 'Agency created successfully',
        description: 'Your agency has been created successfully.',
        variant: 'default',
      });
      router.push('/agency');
    } catch (error) {
      toast({
        title: 'Error creating agency',
        description: 'There was an error creating your agency. Please try again.',
        variant: 'destructive',
      });
    }
  };
  return (
    <AlertDialog>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Agency Details</CardTitle>
          <CardDescription>
            Lets create an agency for your business. You can edit agency
            settings later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4"
            >
              <FormField
                disabled={isLoading}
                control={form.control}
                name="agencyLogo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint={"agencyLogo"}
                        onChange={(url) => {
                          field.onChange(url);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
            </form>
          </FormProvider>
        </CardContent>
        <CardFooter className="flex justify-between">
          <div onClick={() => setDeletingAgency(true)}>Delete Agency</div>
        </CardFooter>
      </Card>
    </AlertDialog>
  );
}

export default AgencyDetails