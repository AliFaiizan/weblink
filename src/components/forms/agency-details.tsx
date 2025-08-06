'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Agency } from '@prisma/client'
import { useToast } from '../ui/use-toast'
import { AlertDialog } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { NumberInput } from '@tremor/react'

import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { FormProvider, useForm } from 'react-hook-form'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '../ui/form'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { saveActivityLogsNotification, updateAgencyDetails } from '@/lib/queries'
import Loading from '../global/loading'


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
  const [deletingAgency,  setDeletingAgency] = React.useState(false);
  
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
  }, [data,form]);

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
                  <FormItem className="flex-1">
                    <FormLabel>Agency Logo</FormLabel>
                    <FormControl>
                      <FileUpload
                        apiEndpoint="agencyLogo"
                        onChange={(url) => {
                          field.onChange(url);
                        }}
                        value={field.value}
                      />
                    </FormControl>
                  </FormItem>
                )}
              ></FormField>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Agency Name" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyEmail"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>AgencyEmail</FormLabel>
                      <FormControl>
                        <Input placeholder="Agency Email" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="companyPhone"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Phone</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Agency Phone"
                          type="number"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="whiteLabel"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounted-lg border gap-4 p-4">
                      <div>
                        <FormLabel>White Label</FormLabel>
                        <FormDescription>
                         Turning on whitelabel mode will show your agency logo to all sub accounts by default . You can override this setting for each sub account.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={(checked) => {
                            field.onChange(checked);
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Agency Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Agency Address"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div className="flex md:flex-row gap-4">
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder="City" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder="State" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="zipCode"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Zipcode</FormLabel>
                      <FormControl>
                        <Input placeholder="Zipcode" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              <div>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name="country"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormLabel>Country</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Country"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                ></FormField>
              </div>
              {data?.id && <div className='flex flex-col gap-2'>
                <FormLabel>Create a Goal</FormLabel>
                <FormDescription>
                  <span role="img" aria-label="sparkle">✨</span> Create a goal for your agency. as your business grows your goals grow too so dont forget to set the bar higher.
                </FormDescription>
                <NumberInput
                defaultValue={data?.goal}
                onValueChange={async(value) => {
                  if(!data?.goal) return;
                  await updateAgencyDetails(data?.id, { goal: value });
                  await saveActivityLogsNotification(`Updated agency goal to | ${value}`, data?.id, undefined);
                }}
                min={1}
                className='bg-background !border !border-input'
              />
              </div>}
              <Button type='submit' disabled={isLoading} className="w-full mt-4">
                {isLoading ? <Loading /> : 'Save Agency Details'}
              </Button>
            </form>
          </FormProvider>
          {data?.id && (<div className='flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4'>
            <div>
              <h3 className='text-destructive font-semibold'>Delete Agency</h3>
              <p className='text-muted-foreground text-sm'>This will delete your agency and all associated data. This action cannot be undone.</p>
            </div>
            <Button variant='destructive' onClick={() => setDeletingAgency(true)}>Delete Agency</Button>
          </div>)}
        </CardContent>
      </Card>
    </AlertDialog>
  );
}

export default AgencyDetails