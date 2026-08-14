import { ServicoType } from '../../types/Servico'
import { ServicoSelecionadoType } from '../../types/service'

export function servicoToSelecionado(
    servico: ServicoType
): ServicoSelecionadoType {

    return {
        checkbox: false,
        servico: servico,
    
    }
}