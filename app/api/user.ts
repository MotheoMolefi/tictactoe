import { supabase } from '@/lib/supabase/client'

export async function signUp(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        })

        if (error) {
            console.error('Error signing up:', error.message)
            return null
        }

        return data.user
    } catch (error) {
        console.error('Error in signUp:', error)
        return null
    }
}