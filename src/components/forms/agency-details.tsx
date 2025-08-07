'use client'
import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Agency } from '@prisma/client'
import { useToast } from '../ui/use-toast'
import { AlertDialog, AlertDialogTrigger } from '../ui/alert-dialog'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { NumberInput } from '@tremor/react'

import { v4 } from 'uuid'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '../ui/form'
import FileUpload from '../global/file-upload'
import { Input } from '../ui/input'
import { Button } from '../ui/button'
import { Switch } from '../ui/switch'
import { deleteAgency, initUser, saveActivityLogsNotification, updateAgencyDetails, upsertAgency } from '@/lib/queries'
import Loading from '../global/loading'
import { AlertDialogContent , AlertDialogTitle, AlertDialogDescription, AlertDialogAction } from '@radix-ui/react-alert-dialog'


type AgencyDetailsProps = {
    data?: Partial<Agency>
}

const agencyDetailsSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: "Agency name is required and must be at least 2 characters",
    }),
  companyEmail: z
    .string()
    .min(1, { message: "Email is required" })
    .email({ message: "Invalid email address" }),
  companyPhone: z.string().min(1, { message: "Phone number is required" }),
  whiteLabel: z.boolean(),
  address: z.string().min(1, { message: "Address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  zipCode: z.string().min(1, { message: "Zip code is required" }),
  state: z.string().min(1, { message: "State is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  agencyLogo: z.string().optional(),
});

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
      console.log('handleSubmit received values:', values);
      
      // Call your API to create the agency
      // await createAgency(values);
      let newUserData;
      let customerId;
      if(!data?.id){
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping:{
            address:{
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode
            },
            name: values.name
          },
          address:{
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode
          }
        }
      }
 
      // WIP
      if (!data?.id) {
        //initiate clerk userwith new role?
        newUserData = await initUser({
          role: "AGENCY_OWNER",
        });
        const response = await upsertAgency({
          id: data?.id ? data.id : v4(),
          address: values.address,
          agencyLogo: values.agencyLogo || "",
          city: values.city,
          companyPhone: values.companyPhone,
          country: values.country,
          name: values.name,
          state: values.state,
          whiteLabel: values.whiteLabel,
          zipCode: values.zipCode,
          createdAt: new Date(),
          updatedAt: new Date(),
          companyEmail: values.companyEmail,
          connectAccountId: "",
          goal: 5,
        });
        toast({
          title: "Agency created successfully",
          description: "Your agency has been created successfully.",
          variant: "default",
        });
        return router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error creating agency",
        description: "There was an error creating your agency. Please try again.",
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAgency = async () => {
    
    try {
      if(!data?.id) return;
      
      setDeletingAgency(true);
      const response = await deleteAgency(data.id);
      if(response){
        toast({
          title: 'Agency deleted successfully',
          description: 'Your agency has been deleted with all subaccounts.',
          variant: 'default',
        });
        router.push('/agency');
      }
    } catch (error) {
      toast({
        title: 'Error deleting agency',
        description: 'There was an error deleting your agency. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setDeletingAgency(false);
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
            <Form {...form}>
              <div className="space-y-4">
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
                          onChange={field.onChange}
                          value={field.value}
                        />
                      </FormControl>
                      <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                            Turning on whitelabel mode will show your agency
                            logo to all sub accounts by default . You can
                            override this setting for each sub account.
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
                        <FormMessage />
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
                          <Input placeholder="Agency Address" {...field} />
                        </FormControl>
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                        <FormMessage />
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
                          <Input placeholder="Country" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  ></FormField>
                </div>
                {data?.id && (
                  <div className="flex flex-col gap-2">
                    <FormLabel>Create a Goal</FormLabel>
                    <FormDescription>
                      <span role="img" aria-label="sparkle">
                        ✨
                      </span>{" "}
                      Create a goal for your agency. as your business grows your
                      goals grow too so dont forget to set the bar higher.
                    </FormDescription>
                    <NumberInput
                      defaultValue={data?.goal}
                      onValueChange={async (value) => {
                        if (!data?.id ) return;
                        await updateAgencyDetails(data?.id, { goal: value });
                        await saveActivityLogsNotification(
                          `Updated agency goal to | ${value}`,
                          data?.id,
                          undefined
                        );
                      }}
                      min={1}
                      className="bg-background !border !border-input"
                    />
                  </div>
                )}
                <Button
                  type="button"
                  disabled={isLoading}
                  className="w-full mt-4"
                  onClick={() => {
                    const values = form.getValues();
                    handleSubmit(values);
                  }}
                >
                  {isLoading ? <Loading /> : "Save Agency Details"}
                </Button>
              </div>
            </Form>
          {data?.id && (
            <div className="flex flex-row items-center justify-between rounded-lg border border-destructive gap-4 p-4 mt-4">
              <div>
                <h3 className="text-destructive font-semibold">
                  Delete Agency
                </h3>
                <p className="text-muted-foreground text-sm">
                  This will delete your agency and all associated data. This
                  action cannot be undone.
                </p>
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className="bg-destructive p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
              >
                {deletingAgency ? "Deleting..." : "Delete Agency"}
              </AlertDialogTrigger>
            </div>
          )}
          <AlertDialogContent>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your
              agency and all associated data.
            </AlertDialogDescription>
            <AlertDialogAction
              asChild
              disabled={deletingAgency}
              className="bg-destructive p-2 text-center mt-2 rounded-md hover:bg-red-600 hover:text-white whitespace-nowrap"
            >
              <Button
                variant="destructive"
                disabled={isLoading || deletingAgency}
              >
                Delete
              </Button>
            </AlertDialogAction>
          </AlertDialogContent>
        </CardContent>
      </Card>
    </AlertDialog>
  );
}

export default AgencyDetails