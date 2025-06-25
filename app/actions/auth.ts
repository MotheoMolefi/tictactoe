'use server'

import { cookies } from 'next/headers'
import { DataObject } from '../api/verify'

export async function setAuthCookies(data: DataObject) {
    const cookieStore = await cookies()

    // Check if session exists first
    if (!data.session) {
        console.error('No session found in data')
        return // or throw an error
    }

    const access_token = data.session.access_token
    const refresh_token = data.session.refresh_token
    const expiry = data.session.expires_in

    // Validate tokens exist
    if (!access_token || !refresh_token) {
        console.error('Missing access or refresh token')
        return // or throw an error
    }

console.log("Access Token:\n"+access_token)
console.log("Refresh Token:\n"+refresh_token)
console.log("Expiry Time:\n"+expiry)
console.log("Cookies are not being set. Session is there but still getting 403 error.")
console.log("Issue is likely in the middleware.ts...")

    cookieStore.set('sb-access-token', access_token,{
        path: '/',
        maxAge: expiry,
        secure: true,
        sameSite: 'lax'
    })
    
    cookieStore.set('sb-refresh-token', refresh_token, {
        path: '/',
        maxAge: expiry,
        secure: true,
        sameSite: 'lax'
    })
} 