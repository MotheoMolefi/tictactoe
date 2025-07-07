import { supabase } from '@/lib/supabase/client'
import { createProfile } from './profile'

export async function signUp(email: string, password: string, firstName: string, lastName: string) {
    try {
        const { data, error } = await supabase.auth.signUp(
            {
              email,
              password,
              options: {
                data: {
                  first_name: firstName, // Use the firstName variable from the form
                  last_name: lastName,  // Use the lastName variable from the form
                  // age: 27, // Remove or keep as needed
                }
              }
            }
          )

        if (error) {
            console.error('Error signing up:', error.message)
            return null
        }

        // Create profile after successful user creation
        if (data.user) {
            const username = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 1000)}`
            
            const profileData = {
                user_id: data.user.id,
                username: username,
                theme: 'light', // Default theme
                games_won: 0,
                games_lost: 0,
                games_drawn: 0
            }

            const profile = await createProfile(profileData)
            
            if (profile) {
                console.log('Profile created successfully:', profile)
            } else {
                console.error('Failed to create profile')
                // You might want to handle this case - maybe delete the user or show an error
            }
        }

        return data.user
    } catch (error) {
        console.error('Error in signUp:', error)
        return null
    }
}