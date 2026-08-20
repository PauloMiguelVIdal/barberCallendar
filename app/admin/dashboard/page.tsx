// app/admin/dashboard/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import Callendar from '../../components/Callendar'
import { LogOut, ArrowLeft, User as UserIcon } from 'lucide-react'

export default function Dashboard() {
    const router = useRouter()
    const { isAuthenticated, isLoading, profile, logout } = useAuth()
    const [isClient, setIsClient] = useState(false)

    useEffect(() => {
        setIsClient(true)
    }, [])

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push('/admin')
        }
    }, [isAuthenticated, isLoading, router])

    if (isLoading || !isClient) {
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
        <div className="min-h-screen bg-[#121212]">
            {/* Barra superior do Admin */}
            <div className="bg-[#1E1E1E] border-b border-[#2A2A2A] p-4 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => router.push('/')}
                            className="flex items-center gap-2 text-[#A0A0A0] hover:text-[#FFFFFF] transition-colors"
                        >
                            <ArrowLeft size={20} />
                            <span className="text-sm hidden sm:inline">Voltar ao site</span>
                        </button>
                        <div className="h-6 w-px bg-[#2A2A2A]" />
                        <h1 className="text-[#D3AF37] font-bold text-lg">
                            📊 Painel Administrativo
                        </h1>
                    </div>

                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-3 bg-[#2A2A2A] rounded-lg px-3 py-2">
                            <UserIcon size={16} color="#D3AF37" />
                            <span className="text-sm text-[#E0E0E0]">
                                {profile?.nome || 'Barbeiro'}
                            </span>
                        </div>

                        <button
                            onClick={async () => {
                                await logout()
                                router.push('/admin')
                            }}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#D32F2F]/20 text-[#FF6B6B] hover:bg-[#D32F2F]/30 transition-colors text-sm font-medium"
                        >
                            <LogOut size={16} />
                            <span className="hidden sm:inline">Sair</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Conteúdo do Admin */}
            <div className="max-w-7xl mx-auto p-4">
                <Callendar />
            </div>
        </div>
    )
}