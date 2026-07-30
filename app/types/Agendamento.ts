
export type AgendamentoType = {

  id: string

  data: string

  hora: string

  nome: string

  telefone: string

  // Quantidade de blocos de 45 minutos
  blocos?: number

  // Duração total em minutos
  duracao?: number

}

