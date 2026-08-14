export type AgendamentoLocalType = {

    id: string

    data: string

    hora: string

    hora_fim: string

    nome: string

    telefone: string

    servicos: {
        id: string
        nome: string
        duracao: number
        valor: number
    }[]

    duracao: number

    valor: number

    blocos: number

    cancelado: boolean

}