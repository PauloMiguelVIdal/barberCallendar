'use client'

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    useCallback
} from 'react'


import {
    AgendamentoLocalType
} from '../types/AgendamentoLocal'

import {
    AgendamentoComRelacionamentos
} from '../services/agendamentoService'


import {
    AgendamentoType
} from '../types/Agendamento'


import {
    CriarAgendamentoType
} from '../types/CriarAgendamento'


import {
    buscarAgendamentosPorData,
    buscarAgendamentosPorPeriodo,
    buscarAgendamentosPorCliente,
    criarAgendamento,
    cancelarAgendamento
} from '../services/agendamentoService'


// ======================================================
// CHAVE ÚNICA DO LOCAL STORAGE
// ======================================================
//
// IMPORTANTE:
// Não depende de clienteId.
//
// O objetivo aqui é simplesmente manter os agendamentos
// disponíveis para o usuário neste navegador.
//
// ======================================================

const CHAVE_AGENDAMENTOS_LOCAL =
    'brave-boss-agendamentos'


const CHAVE_CLIENTE_LOCAL =
    'brave-boss-cliente-id'


// ======================================================
// TIPOS
// ======================================================

type CentralDadosContextType = {

    // ====================================================
    // AGENDAMENTOS DO CALENDÁRIO
    // ====================================================

    agendamentos: AgendamentoType[]

    adicionarAgendamento: (
        agendamento: CriarAgendamentoType,
        dadosLocal: Omit<AgendamentoLocalType, 'id'>
    ) => Promise<void>

    removerAgendamento: (
        id: string
    ) => Promise<void>

    carregandoAgendamentosCliente: boolean

    carregarAgendamentosPorPeriodo: (
        dataInicio: string,
        dataFim: string
    ) => Promise<void>

    // ====================================================
    // AGENDAMENTOS DO CLIENTE
    // ====================================================

    agendamentosCliente:
        AgendamentoLocalType[]

    adicionarAgendamentoCliente: () => Promise<void>

    removerAgendamentoCliente: (
        id: string
    ) => Promise<void>

    carregarAgendamentosCliente: () => Promise<void>


    // ====================================================
    // CARREGAMENTO
    // ====================================================

    carregandoAgendamentos: boolean

    // NOVO: ADICIONAR ESTA LINHA
    isLoading: boolean


    // ====================================================
    // CLIENTE
    // ====================================================

    clienteId: string | null

    definirClienteId: (
        id: string | null
    ) => void

    // ====================================================
    // DATA VISUALIZADA
    // ====================================================

    dataVisualizada: Date

    definirDataVisualizada: (
        data: Date
    ) => void

    proximoDia: () => void

    diaAnterior: () => void

    proximaSemana: () => void

    semanaAnterior: () => void

    proximoMes: () => void

    mesAnterior: () => void


    // ====================================================
    // DATA DO AGENDAMENTO
    // ====================================================

    dataAgendamento: string | null

    definirDataAgendamento: (
        data: string | null
    ) => void


    // ====================================================
    // HORÁRIO SELECIONADO
    // ====================================================

    horarioSelecionado: string | null

    selecionarHorario: (
        hora: string | null
    ) => void


    // ====================================================
    // INTERFACE
    // ====================================================

    interfaceView:
        | 'day'
        | 'week'
        | 'month'
        | 'appointments'

    setInterfaceView: (
        view:
            | 'day'
            | 'week'
            | 'month'
            | 'appointments'
    ) => void

}


// ======================================================
// CONTEXT
// ======================================================

const CentralDadosContext =
    createContext<CentralDadosContextType | null>(null)


// ======================================================
// PROVIDER
// ======================================================

export function CentralDadosProvider({
    children
}: {
    children: React.ReactNode
}) {


    // ====================================================
    // AGENDAMENTOS
    // ====================================================

    const [
        agendamentos,
        setAgendamentos
    ] = useState<AgendamentoType[]>([])

    

    // ====================================================
    // AGENDAMENTOS DO CLIENTE
    // ====================================================

const [
    agendamentosCliente,
    setAgendamentosCliente
] = useState<
    AgendamentoLocalType[]
>([])


    // ====================================================
    // CONTROLE DE CARREGAMENTO DO CLIENTE
    // ====================================================

    const [
        carregandoAgendamentosCliente,
        setCarregandoAgendamentosCliente
    ] = useState(false)


    // ====================================================
    // CONTROLE DE CARREGAMENTO DO CALENDÁRIO
    // ====================================================

    const [
        carregandoAgendamentos,
        setCarregandoAgendamentos
    ] = useState(false)


// ====================================================
// ESTADO DE LOADING GERAL (ISLOADING)
// ====================================================

const [
    isLoading,
    setIsLoading
] = useState(false)

    // ====================================================
    // CONTROLE DO LOCAL STORAGE
    // ====================================================




    const [
        localStorageCarregado,
        setLocalStorageCarregado
    ] = useState(false)


    // ====================================================
    // CLIENTE
    // ====================================================

    const [
        clienteId,
        setClienteId
    ] = useState<string | null>(null)


    // ====================================================
    // CARREGAR DADOS DO LOCAL STORAGE
    // ====================================================

    useEffect(() => {

        if (
            typeof window === 'undefined'
        ) {

            return

        }


        // ------------------------------------------------
        // CARREGAR CLIENTE
        // ------------------------------------------------

        try {

            const clienteSalvo =
                localStorage.getItem(
                    CHAVE_CLIENTE_LOCAL
                )


            if (clienteSalvo) {

                setClienteId(
                    clienteSalvo
                )

            }

        } catch (error) {

            console.error(
                'Erro ao carregar cliente do localStorage:',
                error
            )

        }


        // ------------------------------------------------
        // CARREGAR AGENDAMENTOS
        // ------------------------------------------------

        try {

            const dadosSalvos =
                localStorage.getItem(
                    CHAVE_AGENDAMENTOS_LOCAL
                )


            if (!dadosSalvos) {

                setAgendamentosCliente([])

                setLocalStorageCarregado(true)

                return

            }


            const dados =
                JSON.parse(
                    dadosSalvos
                )


            if (
                Array.isArray(dados)
            ) {

                setAgendamentosCliente(
                    dados
                )

            } else {

                setAgendamentosCliente([])

            }

        } catch (error) {

            console.error(
                'Erro ao carregar agendamentos do localStorage:',
                error
            )

            setAgendamentosCliente([])

        } finally {

            setLocalStorageCarregado(true)

        }

    }, [])


    // ====================================================
    // SALVAR AGENDAMENTOS NO LOCAL STORAGE
    // ====================================================
    //
    // Esse efeito é a principal garantia de persistência
    // local.
    //
    // Sempre que agendamentosCliente mudar, o conteúdo
    // inteiro é salvo novamente.
    //
    // ====================================================

    useEffect(() => {

        if (
            typeof window === 'undefined'
        ) {

            return

        }


        // ------------------------------------------------
        // MUITO IMPORTANTE
        //
        // Não salvar antes de terminar o carregamento
        // inicial.
        //
        // Isso evita:
        //
        // localStorage possui dados
        //        ↓
        // React inicia com []
        //        ↓
        // useEffect salva []
        //        ↓
        // dados antigos são apagados
        //
        // ------------------------------------------------

        if (
            !localStorageCarregado
        ) {

            return

        }


        try {

            localStorage.setItem(
                CHAVE_AGENDAMENTOS_LOCAL,
                JSON.stringify(
                    agendamentosCliente
                )
            )


            console.log(
                '[LOCAL STORAGE] Agendamentos salvos:',
                agendamentosCliente
            )

        } catch (error) {

            console.error(
                'Erro ao salvar agendamentos no localStorage:',
                error
            )

        }

    }, [
        agendamentosCliente,
        localStorageCarregado
    ])


    // ====================================================
    // DEFINIR CLIENTE
    // ====================================================

    function definirClienteId(
        id: string | null
    ) {

        setClienteId(id)


        try {

            if (id) {

                localStorage.setItem(
                    CHAVE_CLIENTE_LOCAL,
                    id
                )

            } else {

                localStorage.removeItem(
                    CHAVE_CLIENTE_LOCAL
                )

            }

        } catch (error) {

            console.error(
                'Erro ao salvar cliente no localStorage:',
                error
            )

        }

    }


    // ====================================================
    // FORMATAR DATA PARA BANCO
    // ====================================================

    const formatarDataBanco = useCallback(
        (data: Date) => {

            const ano =
                data.getFullYear()


            const mes =
                String(
                    data.getMonth() + 1
                ).padStart(
                    2,
                    '0'
                )


            const dia =
                String(
                    data.getDate()
                ).padStart(
                    2,
                    '0'
                )


            return `${ano}-${mes}-${dia}`

        },
        []
    )


    // ====================================================
    // BUSCAR AGENDAMENTOS POR DATA
    // ====================================================

const carregarAgendamentosPorData =
    useCallback(
        async (
            data: string
        ) => {

            setCarregandoAgendamentos(true)
            setIsLoading(true) // <- ADICIONAR ESTA LINHA

            try {

                const dados =
                    await buscarAgendamentosPorData(
                        data
                    )

                setAgendamentos(
                    dados
                )

            } catch (error) {

                console.error(
                    'Erro ao carregar agendamentos:',
                    error
                )

            } finally {

                setCarregandoAgendamentos(false)
                setIsLoading(false) // <- ADICIONAR ESTA LINHA

            }

        },
        []
    )
    // ====================================================
    // BUSCAR AGENDAMENTOS DO SUPABASE
    // ====================================================
    //
    // IMPORTANTE:
    //
    // O Supabase NÃO substitui simplesmente o localStorage.
    //
    // Fazemos um MERGE.
    //
    // Assim, se existir um agendamento local que ainda não
    // apareceu na resposta do Supabase, ele continua na
    // interface.
    //
    // ====================================================

// ====================================================
// BUSCAR AGENDAMENTOS POR PERÍODO (SEMANA)
// ====================================================

const carregarAgendamentosPorPeriodo =
    useCallback(
        async (
            dataInicio: string,
            dataFim: string
        ) => {

            setCarregandoAgendamentos(true)
            setIsLoading(true) // <- ADICIONAR ESTA LINHA

            try {

                const dados =
                    await buscarAgendamentosPorPeriodo(
                        dataInicio,
                        dataFim
                    )

                setAgendamentos(
                    dados
                )

            } catch (error) {

                console.error(
                    'Erro ao carregar agendamentos do período:',
                    error
                )

            } finally {

                setCarregandoAgendamentos(false)
                setIsLoading(false) // <- ADICIONAR ESTA LINHA

            }

        },
        []
    )

const carregarAgendamentosCliente =
    useCallback(
        async () => {

            if (!clienteId) {
                return
            }

            setCarregandoAgendamentosCliente(true)
            setIsLoading(true) // <- ADICIONAR ESTA LINHA

            try {

                const dados =
                    await buscarAgendamentosPorCliente(
                        clienteId
                    )

                setAgendamentosCliente(
                    dadosLocais => {

                        const mapa =
                            new Map<
                                string,
                                AgendamentoLocalType
                            >()


                        // =========================================
                        // 1. DADOS VINDOS DO SUPABASE
                        // =========================================

dados.forEach(
    agendamento => {

        // =====================================================
        // CLIENTE
        // =====================================================

        const cliente =
            agendamento.clientes?.[0]


        // =====================================================
        // SERVIÇOS
        // =====================================================

        const servicos =
            agendamento.agendamento_servicos
                ?.flatMap(
                    item =>
                        item.servicos ?? []
                )
                ?? []


        // =====================================================
        // DURAÇÃO TOTAL
        // =====================================================

        const duracao =
            servicos.reduce(
                (
                    total,
                    servico
                ) =>
                    total +
                    Number(
                        servico.duracao
                    ),
                0
            )


        // =====================================================
        // VALOR TOTAL
        // =====================================================

        const valor =
            servicos.reduce(
                (
                    total,
                    servico
                ) =>
                    total +
                    Number(
                        servico.valor
                    ),
                0
            )


        // =====================================================
        // BLOCOS
        // =====================================================

        const blocos =
            Math.ceil(
                duracao / 45
            )


        // =====================================================
        // CONVERTER PARA O FORMATO LOCAL
        // =====================================================

        const agendamentoLocal:
            AgendamentoLocalType = {

            id:
                agendamento.id,

            data:
                agendamento.data,

            hora:
                agendamento.hora_inicio,

            hora_fim:
                agendamento.hora_fim,

            nome:
                cliente?.nome
                ?? '',

            telefone:
                cliente?.telefone
                ?? '',

            servicos:
                servicos.map(
                    servico => ({

                        id:
                            servico.id,

                        nome:
                            servico.nome,

                        duracao:
                            Number(
                                servico.duracao
                            ),

                        valor:
                            Number(
                                servico.valor
                            )

                    })
                ),

            duracao,

            valor,

            blocos,

            cancelado:
                agendamento.cancelado

        }


        // =====================================================
        // ADICIONAR AO MAPA
        // =====================================================

        mapa.set(
            agendamento.id,
            agendamentoLocal
        )

    }
)

                        // =========================================
                        // 2. PRESERVAR DADOS LOCAIS
                        // =========================================

                        dadosLocais.forEach(
                            agendamento => {

                                if (
                                    !mapa.has(
                                        agendamento.id
                                    )
                                ) {

                                    mapa.set(
                                        agendamento.id,
                                        agendamento
                                    )

                                }

                            }
                        )


                        // =========================================
                        // 3. RETORNAR MERGE
                        // =========================================

                        return Array.from(
                            mapa.values()
                        )

                    }
                )

            } catch (error) {

                console.error(
                    'Erro ao carregar agendamentos do cliente:',
                    error
                )

            } finally {

                setCarregandoAgendamentosCliente(
                    false
                )
setIsLoading(false) 
            }

        },
        [
            clienteId
        ]
    )
    // ====================================================
    // ADICIONAR AGENDAMENTO
    // ====================================================

async function adicionarAgendamento(
    novoAgendamento: CriarAgendamentoType,
    dadosLocal: Omit<AgendamentoLocalType, 'id'>
) {

    try {

        // ==================================================
        // 1. SALVAR NO SUPABASE
        // ==================================================

        const agendamentoCriado =
            await criarAgendamento(
                novoAgendamento
            )


        // ==================================================
        // 2. ATUALIZAR CALENDÁRIO
        // ==================================================

        const dataAtual =
            formatarDataBanco(
                dataVisualizada
            )


        if (
            agendamentoCriado.data ===
            dataAtual
        ) {

            setAgendamentos(
                prev => {

                    const jaExiste =
                        prev.some(
                            agendamento =>
                                agendamento.id ===
                                agendamentoCriado.id
                        )


                    if (jaExiste) {

                        return prev

                    }


                    return [
                        ...prev,
                        agendamentoCriado
                    ]

                }
            )

        }


        // ==================================================
        // 3. CRIAR REGISTRO PARA O LOCAL STORAGE
        // ==================================================

        const novoAgendamentoLocal:
            AgendamentoLocalType = {

            ...dadosLocal,

            id:
                agendamentoCriado.id

        }


        // ==================================================
        // 4. SALVAR NO LOCAL STORAGE
        // ==================================================

        setAgendamentosCliente(
            prev => {

                const jaExiste =
                    prev.some(
                        agendamento =>
                            agendamento.id ===
                            novoAgendamentoLocal.id
                    )


                if (jaExiste) {

                    return prev

                }


                return [
                    ...prev,
                    novoAgendamentoLocal
                ]

            }
        )


    } catch (error) {

        console.error(
            'Erro ao adicionar agendamento:',
            error
        )

        throw error

    }

}

    // ====================================================
    // REMOVER / CANCELAR AGENDAMENTO
    // ====================================================

    async function removerAgendamento(
        id: string
    ) {

        try {

            // ------------------------------------------------
            // 1. CANCELAR NO SUPABASE
            // ------------------------------------------------

            await cancelarAgendamento(
                id
            )


            // ------------------------------------------------
            // 2. REMOVER DO CALENDÁRIO
            // ------------------------------------------------

            setAgendamentos(
                prev =>
                    prev.filter(
                        agendamento =>
                            agendamento.id !== id
                    )
            )


            // ------------------------------------------------
            // 3. REMOVER DO LOCAL STORAGE
            // ------------------------------------------------

            setAgendamentosCliente(
                prev =>
                    prev.filter(
                        agendamento =>
                            agendamento.id !== id
                    )
            )


            console.log(
                '[AGENDAMENTO] Removido:',
                id
            )


        } catch (error) {

            console.error(
                'Erro ao cancelar agendamento:',
                error
            )

            throw error

        }

    }


    // ====================================================
    // ADICIONAR AGENDAMENTO DO CLIENTE
    // ====================================================

    async function adicionarAgendamentoCliente() {

        await carregarAgendamentosCliente()

    }


    // ====================================================
    // REMOVER AGENDAMENTO DO CLIENTE
    // ====================================================

    async function removerAgendamentoCliente(
        id: string
    ) {

        try {

            await cancelarAgendamento(
                id
            )


            // ----------------------------------------------
            // REMOVER DO ESTADO
            // ----------------------------------------------

            setAgendamentosCliente(
                prev =>
                    prev.filter(
                        agendamento =>
                            agendamento.id !== id
                    )
            )


            // ----------------------------------------------
            // REMOVER DO CALENDÁRIO
            // ----------------------------------------------

            setAgendamentos(
                prev =>
                    prev.filter(
                        agendamento =>
                            agendamento.id !== id
                    )
            )


            console.log(
                '[AGENDAMENTO CLIENTE] Removido:',
                id
            )


        } catch (error) {

            console.error(
                'Erro ao cancelar agendamento do cliente:',
                error
            )

            throw error

        }

    }


    // ====================================================
    // DATA VISUALIZADA
    // ====================================================

    const [
        dataVisualizada,
        setDataVisualizada
    ] = useState<Date>(
        () => {

            const hoje =
                new Date()


            hoje.setHours(
                0,
                0,
                0,
                0
            )


            return hoje

        }
    )

function salvarAgendamentosClienteLocal(
    agendamentos:
        AgendamentoLocalType[]
) {

    if (
        typeof window === 'undefined'
    ) {

        return

    }

    try {

        localStorage.setItem(
            CHAVE_AGENDAMENTOS_LOCAL,
            JSON.stringify(
                agendamentos
            )
        )

    } catch (error) {

        console.error(
            'Erro ao salvar agendamentos no localStorage:',
            error
        )

    }

}


function carregarAgendamentosClienteLocal():
    AgendamentoLocalType[] {

    if (
        typeof window === 'undefined'
    ) {

        return []

    }

    try {

        const dadosSalvos =
            localStorage.getItem(
                CHAVE_AGENDAMENTOS_LOCAL
            )


        if (!dadosSalvos) {

            return []

        }


        const dados =
            JSON.parse(
                dadosSalvos
            )


        if (
            !Array.isArray(dados)
        ) {

            return []

        }


        return dados as AgendamentoLocalType[]

    } catch (error) {

        console.error(
            'Erro ao carregar agendamentos do localStorage:',
            error
        )

        return []

    }

}

useEffect(() => {

    const agendamentosLocais =
        carregarAgendamentosClienteLocal()


    setAgendamentosCliente(
        agendamentosLocais
    )

    setLocalStorageCarregado(
        true
    )

}, [])


useEffect(() => {

    if (!localStorageCarregado) {

        return

    }

    salvarAgendamentosClienteLocal(
        agendamentosCliente
    )

}, [
    agendamentosCliente,
    localStorageCarregado
])
    // ====================================================
    // DEFINIR DATA VISUALIZADA
    // ====================================================

    function definirDataVisualizada(
        data: Date
    ) {

        const novaData =
            new Date(data)


        novaData.setHours(
            0,
            0,
            0,
            0
        )


        setDataVisualizada(
            novaData
        )

    }


    // ====================================================
    // CARREGAR AGENDAMENTOS QUANDO DATA MUDA
    // ====================================================


    // ====================================================
    // NAVEGAÇÃO POR DIA
    // ====================================================

    function proximoDia() {

        setDataVisualizada(
            prev => {

                const novaData =
                    new Date(prev)


                novaData.setDate(
                    novaData.getDate() + 1
                )


                return novaData

            }
        )

    }


    function diaAnterior() {

        setDataVisualizada(
            prev => {

                const novaData =
                    new Date(prev)


                novaData.setDate(
                    novaData.getDate() - 1
                )


                return novaData

            }
        )

    }


    // ====================================================
    // NAVEGAÇÃO POR SEMANA
    // ====================================================

    function proximaSemana() {

        setDataVisualizada(
            prev => {

                const novaData =
                    new Date(prev)


                novaData.setDate(
                    novaData.getDate() + 7
                )


                return novaData

            }
        )

    }


    function semanaAnterior() {

        setDataVisualizada(
            prev => {

                const novaData =
                    new Date(prev)


                novaData.setDate(
                    novaData.getDate() - 7
                )


                return novaData

            }
        )

    }


    // ====================================================
    // NAVEGAÇÃO POR MÊS
    // ====================================================

    function proximoMes() {

        setDataVisualizada(
            prev => {

                const novaData =
                    new Date(prev)


                novaData.setMonth(
                    novaData.getMonth() + 1
                )


                return novaData

            }
        )

    }


    function mesAnterior() {

        setDataVisualizada(
            prev => {

                const novaData =
                    new Date(prev)


                novaData.setMonth(
                    novaData.getMonth() - 1
                )


                return novaData

            }
        )

    }


    // ====================================================
    // DATA DO AGENDAMENTO
    // ====================================================

    const [
        dataAgendamento,
        setDataAgendamento
    ] = useState<string | null>(null)


    function definirDataAgendamento(
        data: string | null
    ) {

        setDataAgendamento(
            data
        )

    }


    // ====================================================
    // HORÁRIO SELECIONADO
    // ====================================================

    const [
        horarioSelecionado,
        setHorarioSelecionado
    ] = useState<string | null>(null)


    function selecionarHorario(
        hora: string | null
    ) {

        setHorarioSelecionado(
            hora
        )

    }


    // ====================================================
    // INTERFACE
    // ====================================================

    const [
        interfaceView,
        setInterfaceView
    ] = useState<
        | 'day'
        | 'week'
        | 'month'
        | 'appointments'
    >(
        'day'
    )

useEffect(() => {

    // ------------------------------------------------
    // Na visão de semana, quem controla a busca é o
    // próprio CallendarWeek (via carregarAgendamentosPorPeriodo)
    // ------------------------------------------------

    if (
        interfaceView === 'week'
    ) {

        return

    }

    const data =
        formatarDataBanco(
            dataVisualizada
        )

    void carregarAgendamentosPorData(
        data
    )

}, [
    dataVisualizada,
    interfaceView,              
    carregarAgendamentosPorData,
    formatarDataBanco
])

    // ====================================================
    // PROVIDER
    // ====================================================

return (

    <CentralDadosContext.Provider
        value={{

            // =========================================
            // AGENDAMENTOS
            // =========================================

            agendamentos,

            adicionarAgendamento,

            removerAgendamento,

            carregandoAgendamentosCliente,


            // =========================================
            // AGENDAMENTOS DO CLIENTE
            // =========================================

            agendamentosCliente,
            
            carregarAgendamentosPorPeriodo,

            adicionarAgendamentoCliente,

            removerAgendamentoCliente,

            carregarAgendamentosCliente,


            // =========================================
            // CARREGAMENTO
            // =========================================

            carregandoAgendamentos,

            isLoading, // <- ADICIONAR ESTA LINHA


            // =========================================
            // CLIENTE
            // =========================================

            clienteId,

            definirClienteId,


            // =========================================
            // DATA VISUALIZADA
            // =========================================

            dataVisualizada,

            definirDataVisualizada,

            proximoDia,

            diaAnterior,

            proximaSemana,

            semanaAnterior,

            proximoMes,

            mesAnterior,


            // =========================================
            // DATA DO AGENDAMENTO
            // =========================================

            dataAgendamento,

            definirDataAgendamento,


            // =========================================
            // HORÁRIO
            // =========================================

            horarioSelecionado,

            selecionarHorario,


            // =========================================
            // INTERFACE
            // =========================================

            interfaceView,

            setInterfaceView

        }}
    >

        {children}

    </CentralDadosContext.Provider>

)

}


// ======================================================
// HOOK PRINCIPAL
// ======================================================

export function useCentralDados() {

    const context =
        useContext(
            CentralDadosContext
        )


    if (!context) {

        throw new Error(
            'useCentralDados deve ser usado dentro do CentralDadosProvider'
        )

    }


    return context

}


// ======================================================
// HOOK DE AGENDAMENTOS
// ======================================================

export function useAgendamentos() {

    const context =
        useCentralDados()

    return {

        agendamentos:
            context.agendamentos,

        adicionarAgendamento:
            context.adicionarAgendamento,

        removerAgendamento:
            context.removerAgendamento,

        carregarAgendamentosPorPeriodo:   
            context.carregarAgendamentosPorPeriodo,
            
        agendamentosCliente:
            context.agendamentosCliente,

        adicionarAgendamentoCliente:
            context.adicionarAgendamentoCliente,

        removerAgendamentoCliente:
            context.removerAgendamentoCliente,

        carregarAgendamentosCliente:
            context.carregarAgendamentosCliente,

        carregandoAgendamentos:
            context.carregandoAgendamentos,

        // NOVO: ADICIONAR ESTA LINHA
        isLoading:
            context.isLoading

    }

}