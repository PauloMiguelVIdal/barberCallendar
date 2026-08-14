
// export type AgendamentoType = {

//   id: string

//   data: string

//   hora: string

//   nome: string

//   telefone: string

//   // Quantidade de blocos de 45 minutos
//   blocos?: number

//   // Duração total em minutos
//   duracao?: number

// }

import { AgendamentoServicoType } from "./AgendamentoServico"

export type AgendamentoType = {

    id: string

    cliente_id: string

    data: string

    hora_inicio: string

    hora_fim: string

    observacoes: string | null

    concluido: boolean

    cancelado: boolean

    created_at: string

    agendamento_servicos?: AgendamentoServicoType[]

}