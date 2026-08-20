// components/CallendarMonth.tsx
'use client'

import {
    ArrowBigLeft,
    ArrowBigRight
} from 'lucide-react'

import {
    useCentralDados,
    useAgendamentos
} from '../context/PersistData'


export default function CallendarMonth() {


    // =========================================================
    // CONTEXT
    // =========================================================

    const {

        dataVisualizada,

        definirDataVisualizada,

        setInterfaceView,

        proximoMes,

        mesAnterior

    } = useCentralDados()


    // =========================================================
    // AGENDAMENTOS - PARA VERIFICAR LOADING
    // =========================================================

    const {
        isLoading
    } = useAgendamentos()


    // =========================================================
    // DATA ATUAL
    // =========================================================

    const hoje = new Date()

    hoje.setHours(
        0,
        0,
        0,
        0
    )


    const anoAtual =
        hoje.getFullYear()


    const mesAtual =
        hoje.getMonth()


    const diaAtual =
        hoje.getDate()


    // =========================================================
    // DATA MÁXIMA DE AGENDAMENTO
    // =========================================================

    const dataMaximaAgendamento =
        new Date(
            anoAtual,
            mesAtual + 2,
            0
        )


    dataMaximaAgendamento.setHours(
        0,
        0,
        0,
        0
    )


    // =========================================================
    // MÊS VISUALIZADO
    // =========================================================

    const mesVisualizado =
        dataVisualizada.getMonth()


    const anoVisualizado =
        dataVisualizada.getFullYear()


    // =========================================================
    // NOME DOS MESES
    // =========================================================

    const months: string[] = [

        'Janeiro',

        'Fevereiro',

        'Março',

        'Abril',

        'Maio',

        'Junho',

        'Julho',

        'Agosto',

        'Setembro',

        'Outubro',

        'Novembro',

        'Dezembro'

    ]


    // =========================================================
    // DIAS DA SEMANA
    // =========================================================

    const diaSemanaNome = [

        'Domingo',

        'Segunda-feira',

        'Terça-feira',

        'Quarta-feira',

        'Quinta-feira',

        'Sexta-feira',

        'Sábado'

    ]


    // =========================================================
    // VERIFICAR DIAS ESPECÍFICOS
    // =========================================================

    function getDiaSemana(data: Date) {
        return data.getDay() // 0 = Domingo, 6 = Sábado
    }

    function dataEhDomingo(data: Date) {
        return getDiaSemana(data) === 0
    }

    function dataEhSegunda(data: Date) {
        return getDiaSemana(data) === 1
    }

    function dataEhSexta(data: Date) {
        return getDiaSemana(data) === 5
    }

    function dataEhSabado(data: Date) {
        return getDiaSemana(data) === 6
    }

    function dataEstaFechada(data: Date) {
        return dataEhDomingo(data) || dataEhSegunda(data)
    }

    function dataEhOrdemChegada(data: Date) {
        return dataEhSexta(data) || dataEhSabado(data)
    }


    // =========================================================
    // VERIFICAR SE MÊS É O ATUAL
    // =========================================================

    const mesEhAtual =

        anoVisualizado === anoAtual &&

        mesVisualizado === mesAtual


    // =========================================================
    // VERIFICAR SE MÊS É O PRÓXIMO MÊS PERMITIDO
    // =========================================================

    const dataInicioProximoMes =
        new Date(
            anoAtual,
            mesAtual + 1,
            1
        )


    dataInicioProximoMes.setHours(
        0,
        0,
        0,
        0
    )


    const mesEhProximoPermitido =

        anoVisualizado ===
            dataInicioProximoMes.getFullYear()

        &&

        mesVisualizado ===
            dataInicioProximoMes.getMonth()


    // =========================================================
    // VERIFICAR SE MÊS ESTÁ ALÉM DO LIMITE
    // =========================================================

    const mesEstaAlemDoLimite =

        anoVisualizado >
            dataMaximaAgendamento.getFullYear()

        ||

        (

            anoVisualizado ===
                dataMaximaAgendamento.getFullYear()

            &&

            mesVisualizado >
                dataMaximaAgendamento.getMonth()

        )


    // =========================================================
    // NAVEGAÇÃO DO MÊS
    // =========================================================

    function setProximoMes() {

        if (
            mesEstaAlemDoLimite
        ) {

            return

        }

        if (
            mesEhProximoPermitido
        ) {

            return

        }

        proximoMes()

    }


    function setAnteriorMes() {

        if (
            mesEhAtual
        ) {

            return

        }

        mesAnterior()

    }


    // =========================================================
    // DIAS DO MÊS
    // =========================================================

    const diasNoMes =
        new Date(

            anoVisualizado,

            mesVisualizado + 1,

            0

        ).getDate()


    // =========================================================
    // PRIMEIRO DIA DA SEMANA
    // =========================================================

    const primeiroDiaSemana =
        new Date(

            anoVisualizado,

            mesVisualizado,

            1

        ).getDay()


    // =========================================================
    // DIAS DO MÊS ANTERIOR
    // =========================================================

    const diasMesAnterior =
        new Date(

            anoVisualizado,

            mesVisualizado,

            0

        ).getDate()


    // =========================================================
    // CALENDÁRIO
    // =========================================================

    const calendario: {

        dia: number

        atual: boolean

        hoje: boolean

        passado: boolean

        alemDoLimite: boolean

        fechado: boolean

        ordemChegada: boolean

        data: Date

    }[] = []


    // =========================================================
    // MÊS ANTERIOR
    // =========================================================

    for (

        let i =
            diasMesAnterior -
            primeiroDiaSemana +
            1;

        i <= diasMesAnterior;

        i++

    ) {

        const data =
            new Date(

                anoVisualizado,

                mesVisualizado - 1,

                i

            )


        data.setHours(
            0,
            0,
            0,
            0
        )


        calendario.push({

            dia: i,

            atual: false,

            hoje: false,

            passado: true,

            alemDoLimite:
                data.getTime() >
                dataMaximaAgendamento.getTime(),

            fechado:
                dataEstaFechada(data),

            ordemChegada:
                dataEhOrdemChegada(data),

            data

        })

    }


    // =========================================================
    // MÊS ATUAL / MÊS VISUALIZADO
    // =========================================================

    for (

        let i = 1;

        i <= diasNoMes;

        i++

    ) {

        const data =
            new Date(

                anoVisualizado,

                mesVisualizado,

                i

            )


        data.setHours(

            0,
            0,
            0,
            0

        )


        const ehHoje =

            i === diaAtual &&

            mesVisualizado === mesAtual &&

            anoVisualizado === anoAtual


        const ehPassado =

            data.getTime() <

            hoje.getTime()


        const ehAlemDoLimite =

            data.getTime() >

            dataMaximaAgendamento.getTime()


        calendario.push({

            dia: i,

            atual: true,

            hoje: ehHoje,

            passado: ehPassado,

            alemDoLimite:
                ehAlemDoLimite,

            fechado:
                dataEstaFechada(data),

            ordemChegada:
                dataEhOrdemChegada(data),

            data

        })

    }


    // =========================================================
    // PRÓXIMO MÊS
    // =========================================================

    let proxDia = 1


    while (

        calendario.length < 42

    ) {

        const data =
            new Date(

                anoVisualizado,

                mesVisualizado + 1,

                proxDia

            )


        data.setHours(
            0,
            0,
            0,
            0
        )


        calendario.push({

            dia: proxDia,

            atual: false,

            hoje: false,

            passado:
                data.getTime() <
                hoje.getTime(),

            alemDoLimite:
                data.getTime() >
                dataMaximaAgendamento.getTime(),

            fechado:
                dataEstaFechada(data),

            ordemChegada:
                dataEhOrdemChegada(data),

            data

        })


        proxDia++

    }


    // =========================================================
    // SELECIONAR DIA
    // =========================================================

    function selecionarDia(

        data: Date

    ) {

        const dataSelecionada =
            new Date(data)

        dataSelecionada.setHours(
            0,
            0,
            0,
            0
        )

        // Data passada
        if (
            dataSelecionada.getTime() <
            hoje.getTime()
        ) {
            return
        }

        // Data além do limite
        if (
            dataSelecionada.getTime() >
            dataMaximaAgendamento.getTime()
        ) {
            return
        }

        // Data fechada (Domingo ou Segunda)
        if (
            dataEstaFechada(dataSelecionada)
        ) {
            return
        }

        // Data ordem de chegada (Sexta ou Sábado)
        if (
            dataEhOrdemChegada(dataSelecionada)
        ) {
            return
        }

        // Define data no context
        definirDataVisualizada(
            dataSelecionada
        )

        // Muda para o calendário diário
        setInterfaceView(
            'day'
        )

    }


    // =========================================================
    // RENDER
    // =========================================================

    return (

        <div className="
            w-full
            max-w-[700px]
            mx-auto
            bg-[#121212]
            p-4
            rounded-xl
        ">


            {/* =====================================================
                CABEÇALHO
            ====================================================== */}

            <div className="
                w-full
                h-[80px]
                bg-[#121212]
                flex
                items-center
                justify-around
                border-b
                border-[#2A2A2A]
                mb-4
            ">


                {/* MÊS ANTERIOR */}

                <button

                    onClick={
                        setAnteriorMes
                    }

                    disabled={
                        mesEhAtual
                    }

                    className={`
                        flex
                        w-[50px]
                        h-[50px]
                        rounded-full
                        items-center
                        justify-center
                        transition-all
                        duration-200

                        ${
                            mesEhAtual

                                ? 'bg-[#333333] cursor-not-allowed'

                                : 'bg-[#D3AF37] hover:bg-[#C4A032] hover:scale-105'
                        }
                    `}

                >

                    <ArrowBigLeft

                        color={

                            mesEhAtual

                                ? '#757575'

                                : '#121212'

                        }

                        size={24}

                    />

                </button>


                {/* NOME DO MÊS */}

                <div className="
                    flex
                    flex-col
                    items-center
                ">

                    <h1 className="
                        text-[30px]
                        text-[#FFFFFF]
                        font-bold
                    ">

                        {
                            months[
                                mesVisualizado
                            ]
                        }

                        {' '}

                        {
                            anoVisualizado
                        }

                    </h1>

                    <span className="
                        text-[11px]
                        text-[#757575]
                        mt-1
                    ">

                        Agendamentos até{' '}

                        {
                            dataMaximaAgendamento.getDate()
                        }

                        /

                        {
                            dataMaximaAgendamento.getMonth() + 1
                        }

                        /

                        {
                            dataMaximaAgendamento.getFullYear()
                        }

                    </span>

                </div>


                {/* PRÓXIMO MÊS */}

                <button

                    onClick={
                        setProximoMes
                    }

                    disabled={
                        mesEhProximoPermitido ||
                        mesEstaAlemDoLimite
                    }

                    className={`
                        flex
                        w-[50px]
                        h-[50px]
                        rounded-full
                        items-center
                        justify-center
                        transition-all
                        duration-200

                        ${
                            mesEhProximoPermitido ||
                            mesEstaAlemDoLimite

                                ? 'bg-[#333333] cursor-not-allowed'

                                : 'bg-[#D3AF37] hover:bg-[#C4A032] hover:scale-105'
                        }
                    `}

                >

                    <ArrowBigRight

                        color={

                            mesEhProximoPermitido ||
                            mesEstaAlemDoLimite

                                ? '#757575'

                                : '#121212'

                        }

                        size={24}

                    />

                </button>


            </div>


            {/* =====================================================
                MENSAGENS DE STATUS
            ====================================================== */}

            <div className="mb-4 flex flex-col gap-2">
                {/* Mensagem de Fechado */}
                <div className="p-3 bg-[#2A1A1A] border-2 border-[#FF6B6B] rounded-lg text-center">
                    <p className="text-[#FF6B6B] text-sm font-bold">
                        🔒 BARBEARIA FECHADA - DOMINGO E SEGUNDA
                    </p>
                    <p className="text-[#E0E0E0] text-xs mt-1">
                        Não realizamos atendimentos aos domingos e segundas-feiras
                    </p>
                </div>

                {/* Mensagem de Ordem de Chegada */}
                <div className="p-3 bg-[#2A1A1A] border-2 border-[#FFA500] rounded-lg text-center">
                    <p className="text-[#FFA500] text-sm font-bold">
                        ⏰ ATENDIMENTO POR ORDEM DE CHEGADA - SEXTA E SÁBADO
                    </p>
                    <p className="text-[#E0E0E0] text-xs mt-1">
                        Não é possível realizar agendamentos para estes dias
                    </p>
                </div>
            </div>


            {/* =====================================================
                CALENDÁRIO
            ====================================================== */}

            <div className="
                w-full
                mt-4
            ">

                {isLoading ? (

                    <div
                        className="
                            w-full
                            flex
                            flex-col
                            items-center
                            justify-center
                            py-12
                            gap-6
                        "
                    >

                        <div
                            className="
                                w-12
                                h-12
                                border-4
                                border-[#D3AF37]
                                border-t-transparent
                                rounded-full
                                animate-spin
                            "
                        />

                        <p
                            className="
                                text-[#A0A0A0]
                                text-sm
                                animate-pulse
                            "
                        >
                            Carregando calendário...
                        </p>

                        <div
                            className="
                                w-full
                                grid
                                grid-cols-7
                                gap-2
                                mt-2
                            "
                        >

                            {[...Array(7)].map((_, index) => (

                                <div
                                    key={`header-${index}`}
                                    className="
                                        h-6
                                        bg-[#1E1E1E]
                                        rounded
                                        animate-pulse
                                    "
                                />

                            ))}

                            {[...Array(35)].map((_, index) => (

                                <div
                                    key={`day-${index}`}
                                    className="
                                        aspect-square
                                        bg-[#1E1E1E]
                                        rounded-xl
                                        animate-pulse
                                        border
                                        border-[#2A2A2A]
                                    "
                                />

                            ))}

                        </div>

                    </div>

                ) : (

                    <div className="
                        grid
                        grid-cols-7
                        gap-2
                    ">


                        {/* NOMES DOS DIAS */}

                        {
                            diaSemanaNome.map(

                                (dia) => (

                                    <div

                                        key={dia}

                                        className={`
                                            text-xs
                                            font-semibold
                                            text-center
                                            pb-3
                                            ${
                                                dia === 'Domingo' || dia === 'Segunda-feira'
                                                    ? 'text-[#FF6B6B]'
                                                    : dia === 'Sexta-feira' || dia === 'Sábado'
                                                        ? 'text-[#FFA500]'
                                                        : 'text-[#A0A0A0]'
                                            }
                                        `}

                                    >

                                        {
                                            dia.slice(
                                                0,
                                                3
                                            )
                                        }

                                    </div>

                                )

                            )
                        }


                        {/* DIAS */}

                        {
                            calendario.map(

                                (
                                    item,
                                    index
                                ) => {


                                    // Verificar se pode selecionar
                                    const podeSelecionar =

                                        item.atual &&

                                        !item.passado &&

                                        !item.alemDoLimite &&

                                        !item.fechado &&

                                        !item.ordemChegada


                                    // Determinar cor do status
                                    let statusColor = ''
                                    let statusText = ''
                                    
                                    if (item.fechado) {
                                        statusColor = 'text-[#FF6B6B]'
                                        statusText = '🔒'
                                    } else if (item.ordemChegada) {
                                        statusColor = 'text-[#FFA500]'
                                        statusText = '⏰'
                                    }


                                    return (

                                        <button

                                            key={index}

                                            onClick={() => {

                                                if (
                                                    podeSelecionar
                                                ) {

                                                    selecionarDia(
                                                        item.data
                                                    )

                                                }

                                            }}

                                            disabled={
                                                !podeSelecionar
                                            }

                                            className={`


                                                aspect-square

                                                w-full

                                                rounded-xl

                                                flex

                                                flex-col

                                                justify-center

                                                items-center

                                                text-sm

                                                font-medium

                                                transition-all

                                                duration-200

                                                gap-1

                                                border-2

                                                relative

                                                ${

                                                    item.fechado

                                                        ? 'bg-[#2A1A1A] border-[#FF6B6B] text-[#FF6B6B] cursor-not-allowed'

                                                        : item.ordemChegada

                                                            ? 'bg-[#2A1A1A] border-[#FFA500] text-[#FFA500] cursor-not-allowed'

                                                            : item.hoje

                                                                ? 'bg-[#1E1E1E] border-[#D3AF37] text-[#D3AF37] shadow-lg shadow-[#D3AF37]/20'

                                                                : item.passado

                                                                    ? 'bg-[#333333] border-[#333333] text-[#757575] cursor-not-allowed'

                                                                    : item.alemDoLimite

                                                                        ? 'bg-[#333333] border-[#333333] text-[#757575] cursor-not-allowed'

                                                                        : item.atual

                                                                            ? 'bg-[#1E1E1E] border-[#2A2A2A] text-[#E0E0E0] cursor-pointer hover:border-[#D3AF37] hover:bg-[#2A2A2A]'

                                                                            : 'bg-[#1E1E1E] border-[#2A2A2A] text-[#757575] cursor-not-allowed'

                                                }

                                            `}

                                        >

                                            {statusText && (

                                                <span className="
                                                    absolute
                                                    -top-2
                                                    -right-2
                                                    text-xs
                                                    bg-[#1A1A1A]
                                                    px-1
                                                    rounded
                                                    border
                                                    ${item.fechado ? 'border-[#FF6B6B]' : 'border-[#FFA500]'}
                                                ">

                                                    {statusText}

                                                </span>

                                            )}

                                            {
                                                item.dia
                                            }

                                            <div

                                                className={`


                                                    w-[8px]

                                                    h-[8px]

                                                    rounded-full

                                                    transition-all

                                                    duration-200

                                                    ${

                                                        item.fechado

                                                            ? 'bg-[#FF6B6B]'

                                                            : item.ordemChegada

                                                                ? 'bg-[#FFA500]'

                                                                : item.hoje

                                                                    ? 'bg-[#D3AF37]'

                                                                    : item.atual &&
                                                                      !item.passado &&
                                                                      !item.alemDoLimite &&
                                                                      !item.fechado &&
                                                                      !item.ordemChegada

                                                                        ? 'bg-[#FFFFFF]'

                                                                        : 'bg-[#333333]'

                                                    }

                                                `}

                                            />

                                        </button>

                                    )

                                }

                            )
                        }


                    </div>

                )}

            </div>

        </div>

    )

}