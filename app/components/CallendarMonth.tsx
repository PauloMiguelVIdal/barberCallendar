'use client'

import {
    ArrowBigLeft,
    ArrowBigRight
} from 'lucide-react'

import {
    useCentralDados
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
    //
    // O usuário pode agendar somente:
    //
    // HOJE
    // +
    // RESTANTE DO MÊS ATUAL
    // +
    // TODO O PRÓXIMO MÊS
    //
    // Exemplo:
    //
    // Hoje = Agosto/2026
    //
    // Pode:
    // Agosto/2026
    // Setembro/2026
    //
    // Não pode:
    // Outubro/2026 em diante
    //
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


        // -----------------------------------------------------
        // Se já estamos no próximo mês permitido,
        // não podemos avançar mais.
        // -----------------------------------------------------

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


        // =====================================================
        // NORMALIZAR DATA
        // =====================================================

        const dataSelecionada =
            new Date(data)


        dataSelecionada.setHours(

            0,
            0,
            0,
            0

        )


        // =====================================================
        // NÃO PERMITE DATAS PASSADAS
        // =====================================================

        if (

            dataSelecionada.getTime() <

            hoje.getTime()

        ) {

            return

        }


        // =====================================================
        // NÃO PERMITE DATAS ALÉM DO LIMITE
        // =====================================================

        if (

            dataSelecionada.getTime() >

            dataMaximaAgendamento.getTime()

        ) {

            return

        }


        // =====================================================
        // DEFINE DATA NO CONTEXT
        // =====================================================

        definirDataVisualizada(

            dataSelecionada

        )


        // =====================================================
        // MUDA PARA O CALENDÁRIO DIÁRIO
        // =====================================================

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


                {/* =================================================
                    MÊS ANTERIOR
                ================================================== */}

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


                {/* =================================================
                    NOME DO MÊS
                ================================================== */}

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


                {/* =================================================
                    PRÓXIMO MÊS
                ================================================== */}

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
                CALENDÁRIO
            ====================================================== */}

            <div className="
                w-full
                mt-4
            ">


                <div className="
                    grid
                    grid-cols-7
                    gap-2
                ">


                    {/* =================================================
                        NOMES DOS DIAS
                    ================================================== */}

                    {
                        diaSemanaNome.map(

                            (dia) => (

                                <div

                                    key={dia}

                                    className="
                                        text-xs
                                        text-[#A0A0A0]
                                        font-semibold
                                        text-center
                                        pb-3
                                    "

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


                    {/* =================================================
                        DIAS
                    ================================================== */}

                    {
                        calendario.map(

                            (
                                item,
                                index
                            ) => {


                                // =============================================
                                // VERIFICAR SE PODE SELECIONAR
                                // =============================================

                                const podeSelecionar =

                                    item.atual &&

                                    !item.passado &&

                                    !item.alemDoLimite


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

                                            ${

                                                item.hoje

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

                                                    item.hoje

                                                        ? 'bg-[#D3AF37]'

                                                        : item.atual &&
                                                          !item.passado &&
                                                          !item.alemDoLimite

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


            </div>


        </div>

    )

}