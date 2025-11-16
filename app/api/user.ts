import { supabase } from '@/lib/supabase/client'
import { createProfile } from './profile'

// Helper function to retry profile creation
async function retryProfileCreation(profileData: any, maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            const profile = await createProfile(profileData)
            if (profile) {
                return profile
            }
        } catch (error) {
            console.log(`Profile creation attempt ${attempt} failed:`, error)
            if (attempt === maxRetries) {
                throw error
            }
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, attempt * 500))
        }
    }
    return null
}

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
            // Check if it's a duplicate user error
            if (error.message.includes('already registered') || error.message.includes('already exists')) {
                return { error: 'User with this email already exists' }
            }
            return { error: error.message }
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

            try {
                const profile = await retryProfileCreation(profileData)
                
                if (profile) {
                    console.log('Profile created successfully:', profile)
                } else {
                    console.error('Failed to create profile after retries')
                    return { 
                        user: data.user, 
                        warning: 'Account created but profile setup failed. You can still verify your email and log in.' 
                    }
                }
            } catch (profileError) {
                console.error('Profile creation failed:', profileError)
                return { 
                    user: data.user, 
                    warning: 'Account created but profile setup failed. You can still verify your email and log in.' 
                }
            }
        }

        return { user: data.user }
    } catch (error) {
        console.error('Error in signUp:', error)
        return { error: 'An unexpected error occurred' }
    }
}