// app/admin/dashboard/page.tsx (versão simplificada para teste)
'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../../context/AuthContext'

export default function AdminDashboard() {
    const router = useRouter()
    const { isAuthenticated, isLoading, profile, logout } = useAuth()

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#121212] flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-[#D3AF37] border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    if (!isAuthenticated) {
        return null
    }

    return (
        <div className="min-h-screen bg-[#121212] text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold text-[#D3AF37] mb-4">
                    ✅ Dashboard Admin
                </h1>
                <p className="text-gray-400 mb-4">
                    Autenticação funcionando corretamente!
                </p>
                <div className="bg-[#1E1E1E] p-4 rounded-lg border border-[#2A2A2A] mb-4">
                    <p><strong>Usuário:</strong> {profile?.nome}</p>
                    <p><strong>Email:</strong> {profile?.email}</p>
                    <p><strong>Role:</strong> {profile?.role}</p>
                </div>
                <button
                    onClick={async () => {
                        await logout()
                        router.push('/admin')
                    }}
                    className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
                >
                    Sair
                </button>
                
                {/* Aqui você pode adicionar o Callendar depois */}
                <div className="mt-8 p-4 bg-[#1E1E1E] rounded-lg border border-[#2A2A2A]">
                    <p className="text-gray-400">Aqui virá o calendário administrativo</p>
                </div>
            </div>
        </div>
    )
}