export type ProfileRoleType = 'barbeiro' | 'admin'

export type ProfileType = {
    id: string
    nome: string
    telefone: string | null
    role: ProfileRoleType
    ativo: boolean
    created_at: string
    updated_at: string
}