
'use client'

import {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'

import { supabase } from '../../lib/supabase'
import {
    isBarbeiro,
    getCurrentProfile,
    logoutBarbeiro,
    loginBarbeiro
} from '../services/authService'
import { ProfileType } from '../types/profile'

type AuthContextType = {
    isAuthenticated: boolean
    isLoading: boolean
    profile: ProfileType | null
    login: (email: string, password: string) => Promise<void>
    logout: () => Promise<void>
    checkAuth: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [profile, setProfile] = useState<ProfileType | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true)
            try {
                const authed = await isBarbeiro()
                setIsAuthenticated(authed)

                if (authed) {
                    const userProfile = await getCurrentProfile()
                    setProfile(userProfile)
                }
            } catch (error) {
                console.error('Erro ao verificar autenticação:', error)
            } finally {
                setIsLoading(false)
            }
        }

        checkAuth()

        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    const authed = await isBarbeiro()
                    setIsAuthenticated(authed)

                    if (authed) {
                        const userProfile = await getCurrentProfile()
                        setProfile(userProfile)
                    }
                } else {
                    setIsAuthenticated(false)
                    setProfile(null)
                }
                setIsLoading(false)
            }
        )

        return () => {
            subscription.unsubscribe()
        }
    }, [])

    const login = async (email: string, password: string) => {
        setIsLoading(true)
        try {
            const result = await loginBarbeiro(email, password)
            setIsAuthenticated(true)
            setProfile(result.profile)
        } finally {
            setIsLoading(false)
        }
    }

    const logout = async () => {
        setIsLoading(true)
        try {
            await logoutBarbeiro()
            setIsAuthenticated(false)
            setProfile(null)
        } finally {
            setIsLoading(false)
        }
    }

    const checkAuth = async () => {
        const authed = await isBarbeiro()
        setIsAuthenticated(authed)
        return authed
    }

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                isLoading,
                profile,
                login,
                logout,
                checkAuth,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth deve ser usado dentro do AuthProvider')
    }
    return context
}