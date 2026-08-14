export type CriarAgendamentoType = {

    cliente_id: string

    servicos_id: string[]

    data: string

    hora_inicio: string

    hora_fim: string

    observacoes?: string

    concluido?: boolean

    cancelado?: boolean

}