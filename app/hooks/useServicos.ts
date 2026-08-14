'use client'

import {
    useEffect,
    useState
} from 'react'

import {
    buscarServicos
} from '../services/servicosService'

import {
    ServicoType
} from '../types/Servico'


export function useServicos() {

    const [
        servicos,
        setServicos
    ] = useState<ServicoType[]>([])

    const [
        carregando,
        setCarregando
    ] = useState(true)

    const [
        erro,
        setErro
    ] = useState<string | null>(null)


    useEffect(() => {

        async function carregarServicos() {

            try {

                setCarregando(true)

                const dados =
                    await buscarServicos()

                setServicos(dados)

            } catch (error) {

                console.error(
                    'Erro ao carregar serviços:',
                    error
                )

                setErro(
                    'Não foi possível carregar os serviços.'
                )

            } finally {

                setCarregando(false)

            }

        }


        carregarServicos()

    }, [])


    return {

        servicos,

        carregando,

        erro

    }

}