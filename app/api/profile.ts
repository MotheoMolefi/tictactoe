import { supabase } from '@/lib/supabase/client'
import { Profile } from '@/models/profile'

export async function createProfile(profileData: Omit<Profile, 'id' | 'created_at' | 'updated_at'>) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .insert([profileData])
            .select()
            .single()

        if (error) {
            console.error('Error creating profile:', error.message)
            return null
        }

        return data
    } catch (error) {
        console.error('Error in createProfile:', error)
        return null
    }
}

export async function getProfileByUserId(userId: string) {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('user_id', userId)
            .single()

        if (error) {
            console.error('Error fetching profile:', error.message)
            return null
        }

        return data
    } catch (error) {
        console.error('Error in getProfileByUserId:', error)
        return null
    }
} 