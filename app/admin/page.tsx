// app/admin/pageAdmin.tsx
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'
import { Lock, User, Scissors, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
    const router = useRouter()
    const { login, isAuthenticated, isLoading: authLoading } = useAuth()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!authLoading && isAuthenticated) {
            router.push('/admin/dashboard')
        }
    }, [isAuthenticated, authLoading, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(email, password)
            router.push('/admin/dashboard')
            router.refresh()
        } catch (error: any) {
            setError(error.message || 'Erro ao fazer login. Verifique suas credenciais.')
        } finally {
            setLoading(false)
        }
    }

    if (authLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#D3AF37] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#121212] flex items-center justify-center p-4">
            <div className="w-full max-w-[400px]">
                <div className="text-center mb-8">
                    <div className="w-20 h-20 rounded-full bg-[#D3AF37]/20 border-2 border-[#D3AF37] flex items-center justify-center mx-auto mb-4">
                        <Scissors size={32} color="#D3AF37" />
                    </div>
                    <h1 className="text-[#FFFFFF] text-2xl font-bold">Área do Barbeiro</h1>
                    <p className="text-[#A0A0A0] text-sm mt-2">Faça login para acessar o painel</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-[#1E1E1E] rounded-2xl p-6 border border-[#2A2A2A]">
                    <div className="flex flex-col gap-4">
                        <div className="relative">
                            <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Email"
                                className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] text-[#E0E0E0] rounded-lg border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D3AF37] placeholder:text-[#757575]"
                                required
                            />
                        </div>

                        <div className="relative">
                            <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#757575]" />
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Senha"
                                className="w-full pl-10 pr-4 py-3 bg-[#2A2A2A] text-[#E0E0E0] rounded-lg border border-[#333333] focus:outline-none focus:ring-2 focus:ring-[#D3AF37] placeholder:text-[#757575]"
                                required
                            />
                        </div>

                        {error && (
                            <div className="bg-[#D32F2F]/20 border border-[#D32F2F] rounded-lg p-3 flex items-start gap-2">
                                <AlertCircle size={18} className="text-[#FF4D4D] shrink-0 mt-0.5" />
                                <p className="text-[#FF4D4D] text-sm">{error}</p>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 rounded-xl bg-[#D3AF37] text-[#121212] font-bold hover:bg-[#C4A032] transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {loading ? (
                                <span className="flex items-center justify-center gap-2">
                                    <span className="w-5 h-5 border-2 border-[#121212] border-t-transparent rounded-full animate-spin" />
                                    ENTRANDO...
                                </span>
                            ) : (
                                'ENTRAR'
                            )}
                        </button>

                        <button
                            type="button"
                            onClick={() => router.push('/')}
                            className="text-sm text-[#757575] hover:text-[#A0A0A0] transition-colors text-center"
                        >
                            ← Voltar para o site
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}