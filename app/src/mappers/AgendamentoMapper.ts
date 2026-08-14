import { AgendamentoType } from '../../types/Agendamento'
import { ClienteType } from '../../types/Cliente'
import { ServicoType } from '../../types/Servico'
import { AgendamentoUIType } from '@/app/types/AgendamentoUI'

export function agendamentoToUI(
    agendamento: AgendamentoType,
    cliente: ClienteType,
    servicos: ServicoType[]
): AgendamentoUIType {

    const duracaoTotal =
        servicos.reduce(
            (total, servico) =>
                total + servico.duracao,
            0
        )

    const valorTotal =
        servicos.reduce(
            (total, servico) =>
                total + servico.valor,
            0
        )

    return {

        id:
            agendamento.id,

        data:
            agendamento.data,

        hora:
            agendamento.hora_inicio,

        nome:
            cliente.nome,

        telefone:
            cliente.telefone,

        servicos:
            servicos.map(
                servico =>
                    servico.nome
            ),

        valor:
            valorTotal,

        duracao:
            duracaoTotal,

        observacoes:
            agendamento.observacoes,

        concluido:
            agendamento.concluido,

        cancelado:
            agendamento.cancelado

    }

}