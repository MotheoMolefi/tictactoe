'use server'

import { createServerSupabaseClient } from '@/lib/supabase/server'
import { DataObject } from '../api/verify'

export async function setAuthCookies(data: DataObject) {
    try {
        const supabase = await createServerSupabaseClient()

        // Check if session exists first
        if (!data.session) {
            console.error('No session found in data')
            return { error: 'No session found' }
        }

        const access_token = data.session.access_token
        const refresh_token = data.session.refresh_token

        // Validate tokens exist
        if (!access_token || !refresh_token) {
            console.error('Missing access or refresh token')
            return { error: 'Missing authentication tokens' }
        }

        // Set the session using Supabase's built-in cookie management
        const { error } = await supabase.auth.setSession({
            access_token,
            refresh_token,
        })

        if (error) {
            console.error('Error setting session:', error)
            return { error: error.message }
        }

        return { success: true }
    } catch (error) {
        console.error('Error in setAuthCookies:', error)
        return { error: 'Failed to set authentication cookies' }
    }
}

export async function signOut() {
    try {
        const supabase = await createServerSupabaseClient()
        const { error } = await supabase.auth.signOut()
        
        if (error) {
            console.error('Error signing out:', error)
            return { error: error.message }
        }
        
        return { success: true }
    } catch (error) {
        console.error('Error in signOut:', error)
        return { error: 'Failed to sign out' }
    }
}

export async function signIn(email: string, password: string) {
    try {
        const supabase = await createServerSupabaseClient()
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })
        
        if (error) {
            console.error('Error signing in:', error)
            return { error: error.message }
        }
        
        return { success: true, data }
    } catch (error) {
        console.error('Error in signIn:', error)
        return { error: 'Failed to sign in' }
    }
} 