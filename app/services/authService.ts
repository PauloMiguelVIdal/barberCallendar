// services/authService.ts
import { supabase } from '../../lib/supabase'
import { ProfileType } from '../types/profile'

/**
 * Login do barbeiro
 */
export async function loginBarbeiro(email: string, password: string) {
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        })

        if (error) throw error

        const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single()

        if (profileError) {
            await supabase.auth.signOut()
            throw new Error('Perfil não encontrado')
        }

        if (!['barbeiro', 'admin'].includes(profile.role)) {
            await supabase.auth.signOut()
            throw new Error('Acesso negado. Você não tem permissão.')
        }

        if (!profile.ativo) {
            await supabase.auth.signOut()
            throw new Error('Conta desativada. Entre em contato com o administrador.')
        }

        return {
            user: data.user,
            profile,
        }
    } catch (error: any) {
        console.error('Erro no login:', error)
        throw error
    }
}

/**
 * Logout
 */
export async function logoutBarbeiro() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
    } catch (error) {
        console.error('Erro ao fazer logout:', error)
        throw error
    }
}

/**
 * Verificar se o usuário atual é barbeiro/admin
 */
export async function isBarbeiro(): Promise<boolean> {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return false

        const { data: profile } = await supabase
            .from('profiles')
            .select('role, ativo')
            .eq('id', user.id)
            .single()

        return profile?.ativo && ['barbeiro', 'admin'].includes(profile?.role)
    } catch (error) {
        return false
    }
}

/**
 * Obter perfil atual
 */
export async function getCurrentProfile(): Promise<ProfileType | null> {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) return null

        const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()

        return profile
    } catch (error) {
        return null
    }
}