import { NextResponse } from "next/server" 
 import type { NextRequest } from "next/server" 
 
 export function middleware(req: NextRequest) { 
   const host = req.headers.get("host") 
 
   // If user is on the root domain 
   if (host === "touchlife.africa" || host === "www.touchlife.africa") { 
     // Allow only landing page 
     if (req.nextUrl.pathname !== "/") { 
       return NextResponse.redirect( 
         new URL("/", req.url) 
       ) 
     } 
   } 
 
   // If user is on app subdomain 
   if (host === "app.touchlife.africa") { 
     return NextResponse.next() 
   } 
 
   return NextResponse.next() 
 }