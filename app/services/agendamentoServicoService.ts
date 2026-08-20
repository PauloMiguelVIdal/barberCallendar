// services/agendamentoServicoService.ts

import { supabase } from '@/lib/supabase'
/**
 * Busca todos os serviços associados a um agendamento específico
 * @param agendamentoId - ID do agendamento
 * @returns Array de serviços com todos os detalhes (nome, duracao, valor, etc)
 */
export async function buscarServicosPorAgendamento(agendamentoId: string) {
  try {
    if (!agendamentoId) {
      console.warn('ID do agendamento não fornecido')
      return []
    }

    // 1. Busca os relacionamentos na tabela agendamento_servicos
    const { data: relacoes, error: relacoesError } = await supabase
      .from('agendamento_servicos')
      .select('servico_id')
      .eq('agendamento_id', agendamentoId)

    if (relacoesError) {
      console.error('Erro ao buscar serviços do agendamento:', relacoesError)
      return []
    }

    // Se não houver serviços associados, retorna array vazio
    if (!relacoes || relacoes.length === 0) {
      return []
    }

    // 2. Extrai os IDs dos serviços
    const servicoIds = relacoes.map(r => r.servico_id)

    // 3. Busca os detalhes completos dos serviços
    const { data: servicos, error: servicosError } = await supabase
      .from('servicos')
      .select('*')
      .in('id', servicoIds)
      .eq('ativo', true) // Opcional: filtra apenas serviços ativos

    if (servicosError) {
      console.error('Erro ao buscar detalhes dos serviços:', servicosError)
      return []
    }

    // Retorna os serviços encontrados (ou array vazio se não houver)
    return servicos || []

  } catch (error) {
    console.error('Erro inesperado ao buscar serviços do agendamento:', error)
    return []
  }
}


export async function buscarServicosPorMultiplosAgendamentos(agendamentoIds: string[]) {
  try {
    if (!agendamentoIds || agendamentoIds.length === 0) {
      return {}
    }

    // 1. Busca todos os relacionamentos para os agendamentos
    const { data: relacoes, error: relacoesError } = await supabase
      .from('agendamento_servicos')
      .select('agendamento_id, servico_id')
      .in('agendamento_id', agendamentoIds)

    if (relacoesError) {
      console.error('Erro ao buscar serviços dos agendamentos:', relacoesError)
      return {}
    }

    if (!relacoes || relacoes.length === 0) {
      return {}
    }

    // 2. Agrupa os IDs dos serviços por agendamento
    const servicoIdsPorAgendamento: Record<string, string[]> = {}
    const todosServicoIds: string[] = []

    relacoes.forEach(relacao => {
      if (!servicoIdsPorAgendamento[relacao.agendamento_id]) {
        servicoIdsPorAgendamento[relacao.agendamento_id] = []
      }
      servicoIdsPorAgendamento[relacao.agendamento_id].push(relacao.servico_id)
      todosServicoIds.push(relacao.servico_id)
    })

    // 3. Busca todos os serviços únicos
    const idsUnicos = [...new Set(todosServicoIds)]
    
    const { data: servicos, error: servicosError } = await supabase
      .from('servicos')
      .select('*')
      .in('id', idsUnicos)
      .eq('ativo', true)

    if (servicosError) {
      console.error('Erro ao buscar detalhes dos serviços:', servicosError)
      return {}
    }

    // 4. Cria um mapa de serviço_id para o objeto do serviço
    const mapaServicos: Record<string, any> = {}
    servicos?.forEach(servico => {
      mapaServicos[servico.id] = servico
    })

    // 5. Monta o resultado final
    const resultado: Record<string, any[]> = {}
    Object.keys(servicoIdsPorAgendamento).forEach(agendamentoId => {
      const servicosDoAgendamento = servicoIdsPorAgendamento[agendamentoId]
        .map(id => mapaServicos[id])
        .filter(Boolean) // Remove serviços que não foram encontrados
      
      resultado[agendamentoId] = servicosDoAgendamento
    })

    return resultado

  } catch (error) {
    console.error('Erro inesperado ao buscar serviços dos agendamentos:', error)
    return {}
  }
}


export function calcularTotaisServicos(servicos: any[]) {
  let duracaoTotal = 0
  let valorTotal = 0

  servicos.forEach(servico => {
    duracaoTotal += servico.duracao || 0
    valorTotal += servico.valor || 0
  })

  return { duracaoTotal, valorTotal }
}


export async function associarServicosAoAgendamento(
  agendamentoId: string,
  servicoIds: string[]
) {
  try {
    if (!agendamentoId || !servicoIds || servicoIds.length === 0) {
      return { success: false, error: 'Dados inválidos' }
    }

    // Cria os registros na tabela agendamento_servicos
    const registros = servicoIds.map(servicoId => ({
      agendamento_id: agendamentoId,
      servico_id: servicoId
    }))

    const { error } = await supabase
      .from('agendamento_servicos')
      .insert(registros)

    if (error) {
      console.error('Erro ao associar serviços ao agendamento:', error)
      return { success: false, error: error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Erro inesperado ao associar serviços:', error)
    return { success: false, error: 'Erro interno' }
  }
}

/**
 * Remove todos os serviços associados a um agendamento
 * @param agendamentoId - ID do agendamento
 * @returns Sucesso da operação
 */
export async function removerServicosDoAgendamento(agendamentoId: string) {
  try {
    if (!agendamentoId) {
      return { success: false, error: 'ID do agendamento não fornecido' }
    }

    const { error } = await supabase
      .from('agendamento_servicos')
      .delete()
      .eq('agendamento_id', agendamentoId)

    if (error) {
      console.error('Erro ao remover serviços do agendamento:', error)
      return { success: false, error: error.message }
    }

    return { success: true }

  } catch (error) {
    console.error('Erro inesperado ao remover serviços:', error)
    return { success: false, error: 'Erro interno' }
  }
}


export async function atualizarServicosDoAgendamento(
  agendamentoId: string,
  servicoIds: string[]
) {
  try {
    // 1. Remove serviços antigos
    const removerResult = await removerServicosDoAgendamento(agendamentoId)
    if (!removerResult.success) {
      return removerResult
    }

    // 2. Se não houver novos serviços, retorna sucesso
    if (!servicoIds || servicoIds.length === 0) {
      return { success: true }
    }

    // 3. Associa novos serviços
    return await associarServicosAoAgendamento(agendamentoId, servicoIds)

  } catch (error) {
    console.error('Erro inesperado ao atualizar serviços:', error)
    return { success: false, error: 'Erro interno' }
  }
}