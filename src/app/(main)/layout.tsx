import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from 'next-themes'
import {dark} from "@clerk/themes"
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <ClerkProvider appearance={{baseTheme:dark}}>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            {children}  
          </ThemeProvider>  
    </ClerkProvider>
  )
}

export default Layout