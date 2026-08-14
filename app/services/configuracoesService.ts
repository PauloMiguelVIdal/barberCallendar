import {
    buscarConfiguracoes,
    atualizarConfiguracoes
} from '../repositories/configuracoesRepository'

export async function obterConfiguracoes() {

    return await buscarConfiguracoes()

}

export async function salvarConfiguracoes(
    configuracoes: any
) {

    return await atualizarConfiguracoes(
        configuracoes
    )

}