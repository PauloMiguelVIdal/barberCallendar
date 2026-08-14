export type AgendamentoUIType = {

    id: string

    data: string

    hora: string

    nome: string | null

    telefone: string | null

    servicos: string[]

    valor: number

    duracao: number

    observacoes: string | null

    concluido: boolean

    cancelado: boolean

}