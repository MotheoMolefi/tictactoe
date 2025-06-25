import { Session, User } from "@supabase/supabase-js"
import { supabase } from '@/lib/supabase/client'

export interface DataObject {
    user: User | null;
    session: Session | null;
}

export async function verifyOTP(email: string, token: string) {
    try {
        console.log("Initiating verificaition process...")
        const { data, error } = await supabase.auth.verifyOtp({
            email,
            token,
            type: 'email'
        })

        if (error) {
            console.error('Error verifying OTP:', error.message)
            return { success: false, error: error.message }
        }

        console.log("Verification was successfull!")

        return { 
            success: true, 
            data
        }
    } catch (error) {
        console.error('Error in verifyOTP:', error)
        return { success: false, error: 'An unexpected error occurred' }
    }
} 