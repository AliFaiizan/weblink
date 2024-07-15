import Navigation from '@/components/site/navigation'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import {dark} from "@clerk/themes"
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
       <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <main className='h-full'>
            <Navigation />
            {children}
          </main>
        </ThemeProvider>  
     
       
      
    </ClerkProvider>
    
  )
}

export default layout