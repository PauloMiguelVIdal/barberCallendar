import { ClienteType } from '../../types/Cliente'

export function clienteToFormulario(

    cliente: ClienteType

) {

    return {

        nome: cliente.nome,

        telefone: cliente.telefone,

        email: cliente.email,

        observacoes: cliente.observacoes

    }

}