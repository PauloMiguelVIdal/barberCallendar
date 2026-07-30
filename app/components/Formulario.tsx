
'use client'

import {
  useMemo,
  useState
} from 'react'

import {
  X,
  CalendarCheck2,
  AlertTriangle
} from 'lucide-react'

import Services from './Services'

import { servicesType } from '../types/service'

import {
  useCentralDados
} from './PersistData'

// =========================================================
// TIPOS
// =========================================================

type Sugestao = {
  data: string
  horario: string
  descricao: string
}

type Agendamento = {
  id: string
  data: string
  hora: string
  nome: string
  telefone: string

  blocos?: number

  duracao?: number
}

type Props = {

  horario: string

  fecharModal: () => void

  agendarHorario: (
    nome: string,
    telefone: string,
    data: string,
    horario: string,
    blocos: number,
    duracao: number
  ) => void

  data: string

  agendamentos?: Agendamento[]

}

// =========================================================
// CONFIGURAÇÕES
// =========================================================

const DURACAO_BLOCO = 45

// Tempo que pode ultrapassar o bloco sem consumir o próximo
const TEMPO_TOLERANCIA = 20

const LIMITE_SOBREPOSICAO_AVISO = 20

const LIMITE_BLOCOS_SUGESTAO = 2.5

// =========================================================
// HORÁRIOS DISPONÍVEIS
// =========================================================

const HORARIOS_DISPONIVEIS = [

  '9:00',

  '9:45',

  '10:30',

  '11:15',

  '12:00',

  '12:45',

  '13:30',

  '14:15',

  '15:00',

  '15:45',

  '16:30',

  '17:15',

  '18:00',

  '18:45',

  '19:30'

]

// =========================================================
// DURAÇÃO DOS SERVIÇOS
// =========================================================

const DURACAO_SERVICOS: Record<string, number> = {

  'Corte social': 25,

  'Degrade 0/1/2': 30,

  'Navalhado': 35,

  'Corte kids': 45,

  'Corte tesoura': 45,

  'Barba': 20,

  'Sobrancelha': 5,

  'Alisamento': 30,

  'Luzes': 90,

  'Platinado': 130,

  'Pigmentação': 20,

  'Tintura': 20

}

// =========================================================
// COMPONENTE
// =========================================================

export default function Formulario({

  horario,

  fecharModal,

  agendarHorario,

  data,

  agendamentos = []

}: Props) {

  // =======================================================
  // CONTEXT
  // =======================================================

  const {

    selecionarHorario,

    definirDataAgendamento

  } = useCentralDados()

  // =======================================================
  // DADOS DO CLIENTE
  // =======================================================

  const [
    horarioSelecionado,
    setHorarioSelecionado
  ] = useState(horario)

  const [
    dataSelecionada,
    setDataSelecionada
  ] = useState(data)

  const [
    sugestaoSelecionada,
    setSugestaoSelecionada
  ] = useState<string | null>(null)

  const [
    nome,
    setNome
  ] = useState('')

  const [
    telefone,
    setTelefone
  ] = useState('')

  const [
    erroTelefone,
    setErroTelefone
  ] = useState('')

  // =======================================================
  // SERVIÇOS
  // =======================================================

  const [
    services,
    setServices
  ] = useState<servicesType[]>([

    {
      checkbox: false,
      serviço: 'Corte social',
      price: 30
    },

    {
      checkbox: false,
      serviço: 'Degrade 0/1/2',
      price: 35
    },

    {
      checkbox: false,
      serviço: 'Navalhado',
      price: 40
    },

    {
      checkbox: false,
      serviço: 'Corte kids',
      price: 40
    },

    {
      checkbox: false,
      serviço: 'Corte tesoura',
      price: 45
    },

    {
      checkbox: false,
      serviço: 'Barba',
      price: 30
    },

    {
      checkbox: false,
      serviço: 'Sobrancelha',
      price: 10
    },

    {
      checkbox: false,
      serviço: 'Alisamento',
      price: 45
    },

    {
      checkbox: false,
      serviço: 'Luzes',
      price: 100
    },

    {
      checkbox: false,
      serviço: 'Platinado',
      price: 120
    },

    {
      checkbox: false,
      serviço: 'Pigmentação',
      price: 25
    },

    {
      checkbox: false,
      serviço: 'Tintura',
      price: 20
    }

  ])

  // =======================================================
  // SELECIONAR SERVIÇO
  // =======================================================

  function selecionarServicos(
    index: number
  ) {

    setServices(prev =>

      prev.map(
        (service, i) =>

          i === index

            ? {
              ...service,

              checkbox:
                !service.checkbox
            }

            : service

      )

    )

  }

  // =======================================================
  // SELECIONAR SUGESTÃO
  // =======================================================

  function selecionarSugestao(
    sugestao: Sugestao
  ) {

    setHorarioSelecionado(
      sugestao.horario
    )

    setDataSelecionada(
      sugestao.data
    )

    selecionarHorario(
      sugestao.horario
    )

    definirDataAgendamento(
      sugestao.data
    )

    setSugestaoSelecionada(

      `${sugestao.data}-${sugestao.horario}`

    )

  }

  // =======================================================
  // SERVIÇOS SELECIONADOS
  // =======================================================

  const servicosSelecionados =

    services.filter(
      service =>
        service.checkbox
    )

  // =======================================================
  // TEMPO TOTAL
  // =======================================================

  const tempoTotal =

    servicosSelecionados.reduce(

      (
        total,
        service
      ) =>

        total +

        (
          DURACAO_SERVICOS[
            service.serviço
          ]

          ??

          DURACAO_BLOCO
        ),

      0

    )

  // =======================================================
  // CALCULAR BLOCOS NECESSÁRIOS
  // =======================================================

  /*
    Cada bloco possui 45 minutos.

    Existe uma tolerância de 20 minutos.

    Exemplos:

    25 min  -> 1 bloco
    45 min  -> 1 bloco
    50 min  -> 1 bloco
    65 min  -> 1 bloco

    66 min  -> 2 blocos
    90 min  -> 2 blocos
    110 min -> 2 blocos

    111 min -> 3 blocos
  */

  const blocosNecessarios =

    tempoTotal > 0

      ? Math.max(

        1,

        Math.ceil(

          (
            tempoTotal -
            TEMPO_TOLERANCIA
          ) /

          DURACAO_BLOCO

        )

      )

      : 0

  // =======================================================
  // VALOR TOTAL
  // =======================================================

  const somaFatu =

    servicosSelecionados.reduce(

      (
        total,
        service
      ) =>

        total +

        service.price,

      0

    )

  // =======================================================
  // FORMATAR TEMPO
  // =======================================================

  function formatarTempo(
    minutos: number
  ) {

    const horas =

      Math.floor(
        minutos / 60
      )

    const minutosRestantes =

      minutos % 60

    if (
      horas === 0
    ) {

      return `${minutosRestantes} min`

    }

    if (
      minutosRestantes === 0
    ) {

      return `${horas}h`

    }

    return `${horas}h ${minutosRestantes}min`

  }

  // =======================================================
  // CONVERTER HORÁRIO PARA MINUTOS
  // =======================================================

  function horarioParaMinutos(
    horarioString: string
  ) {

    const [
      horas,
      minutos
    ] = horarioString
      .split(':')
      .map(Number)

    return (

      horas * 60 +

      minutos

    )

  }

  // =======================================================
  // ADICIONAR DIAS
  // =======================================================

  function adicionarDias(

    dataString: string,

    quantidade: number

  ) {

    const [

      ano,

      mes,

      dia

    ] = dataString
      .split('-')
      .map(Number)

    const dataAtual =

      new Date(
        ano,
        mes - 1,
        dia
      )

    dataAtual.setDate(

      dataAtual.getDate() +

      quantidade

    )

    return (

      `${dataAtual.getFullYear()}-` +

      `${String(
        dataAtual.getMonth() + 1
      ).padStart(2, '0')}-` +

      `${String(
        dataAtual.getDate()
      ).padStart(2, '0')}`

    )

  }

  // =======================================================
  // VERIFICAR SE UM BLOCO ESTÁ OCUPADO
  // =======================================================

  function blocoEstaOcupado(

    dataVerificacao: string,

    horarioVerificacao: string

  ) {

    const minutoVerificacao =

      horarioParaMinutos(
        horarioVerificacao
      )

    return agendamentos.some(

      agendamento => {

        if (

          agendamento.data !==
          dataVerificacao

        ) {

          return false

        }

        const inicioAgendamento =

          horarioParaMinutos(
            agendamento.hora
          )

        /*
          IMPORTANTE:

          O agendamento existente também
          respeita os 20 minutos de tolerância.

          Exemplo:

          atendimento de 50 min

          50 - 20 = 30

          ceil(30 / 45) = 1 bloco

          Portanto ele não bloqueia o
          próximo horário.
        */

        const duracaoAgendamento =

          agendamento.duracao ?? 45

        const blocosAgendamento =

          agendamento.blocos ??

          Math.max(

            1,

            Math.ceil(

              (
                duracaoAgendamento -
                TEMPO_TOLERANCIA
              ) /

              DURACAO_BLOCO

            )

          )

        const fimAgendamento =

          inicioAgendamento +

          (

            blocosAgendamento *

            DURACAO_BLOCO

          )

        return (

          minutoVerificacao >=
          inicioAgendamento

          &&

          minutoVerificacao <
          fimAgendamento

        )

      }

    )

  }

  // =======================================================
  // VERIFICAR DISPONIBILIDADE
  // =======================================================

  function verificarDisponibilidade(

    dataVerificacao: string,

    horarioInicial: string

  ) {

    if (
      blocosNecessarios <= 0
    ) {

      return false

    }

    const indiceInicial =

      HORARIOS_DISPONIVEIS.indexOf(
        horarioInicial
      )

    if (
      indiceInicial === -1
    ) {

      return false

    }

    for (

      let i = 0;

      i < blocosNecessarios;

      i++

    ) {

      const indiceHorario =

        indiceInicial +

        i

      if (

        indiceHorario >=
        HORARIOS_DISPONIVEIS.length

      ) {

        return false

      }

      const horarioAtual =

        HORARIOS_DISPONIVEIS[
          indiceHorario
        ]

      if (

        blocoEstaOcupado(

          dataVerificacao,

          horarioAtual

        )

      ) {

        return false

      }

    }

    return true

  }

  // =======================================================
  // VERIFICAR CLIENTE ANTERIOR
  // =======================================================

  function obterClienteAnterior() {

    const indiceHorarioSelecionado =

      HORARIOS_DISPONIVEIS.indexOf(

        horarioSelecionado

      )

    if (
      indiceHorarioSelecionado <= 0
    ) {

      return null

    }

    for (

      let i =
        indiceHorarioSelecionado - 1;

      i >= 0;

      i--

    ) {

      const horarioAnterior =

        HORARIOS_DISPONIVEIS[i]

      const clienteExiste =

        blocoEstaOcupado(

          dataSelecionada,

          horarioAnterior

        )

      if (
        clienteExiste
      ) {

        return {

          horario:
            horarioAnterior,

          indice:
            i

        }

      }

    }

    return null

  }

  // =======================================================
  // CALCULAR SOBREPOSIÇÃO
  // =======================================================

  const sobreposicaoEstimada =

    useMemo(() => {

      if (
        agendamentos.length === 0 ||
        !servicosSelecionados.length
      ) {

        return 0

      }

      const clienteAnterior =

        obterClienteAnterior()

      if (
        !clienteAnterior
      ) {

        return 0

      }

      const inicioNovoCliente =

        horarioParaMinutos(

          horarioSelecionado

        )

      /*
        Aqui usamos a duração REAL do
        atendimento novo.

        A tolerância não aumenta o
        tempo real do serviço.
      */

      const fimNovoCliente =

        inicioNovoCliente +

        tempoTotal

      const inicioClienteAnterior =

        horarioParaMinutos(

          clienteAnterior.horario

        )

      const agendamentoAnterior =

        agendamentos.find(

          agendamento =>

            agendamento.data ===
            dataSelecionada &&

            agendamento.hora ===
            clienteAnterior.horario

        )

      const duracaoClienteAnterior =

        agendamentoAnterior?.duracao ??

        DURACAO_BLOCO

      const fimClienteAnterior =

        inicioClienteAnterior +

        duracaoClienteAnterior

      const sobreposicao =

        Math.max(

          0,

          Math.min(

            fimNovoCliente,

            fimClienteAnterior

          ) -

          Math.max(

            inicioNovoCliente,

            inicioClienteAnterior

          )

        )

      return sobreposicao

    }, [

      agendamentos,

      dataSelecionada,

      horarioSelecionado,

      blocosNecessarios,

      tempoTotal,

      servicosSelecionados.length

    ])

  // =======================================================
  // AVISO DE SOBREPOSIÇÃO
  // =======================================================

  const mostrarAvisoSobreposicao =

    sobreposicaoEstimada >

    LIMITE_SOBREPOSICAO_AVISO

  const atrasoEstimado =

    Math.ceil(

      sobreposicaoEstimada / 2

    )

  // =======================================================
  // DISPONIBILIDADE ATUAL
  // =======================================================

  const possuiServicosSelecionados =

    servicosSelecionados.length > 0

  const podeAgendar =

    possuiServicosSelecionados &&

    verificarDisponibilidade(

      dataSelecionada,

      horarioSelecionado

    )

  const mostrarMensagemIndisponivel =

    possuiServicosSelecionados &&

    !podeAgendar

  // =======================================================
  // SUGESTÕES
  // =======================================================

  const sugestoes =

    useMemo<Sugestao[]>(() => {

      /*
        Não existem sugestões quando:

        1. Nenhum serviço foi selecionado.
        2. O horário atual já comporta
           todos os serviços.

        Assim as sugestões só aparecem
        quando REALMENTE são necessárias.
      */

      if (

        !possuiServicosSelecionados ||

        verificarDisponibilidade(

          dataSelecionada,

          horarioSelecionado

        )

      ) {

        return []

      }

      const resultado: Sugestao[] = []

      // ===================================================
      // SUGESTÃO 1
      // ===================================================

      for (

        const horarioSugestao
        of HORARIOS_DISPONIVEIS

      ) {

        if (

          horarioSugestao ===
          horarioSelecionado

        ) {

          continue

        }

        if (

          verificarDisponibilidade(

            dataSelecionada,

            horarioSugestao

          )

        ) {

          resultado.push({

            data:
              dataSelecionada,

            horario:
              horarioSugestao,

            descricao:
              'Outro horário disponível no mesmo dia'

          })

          break

        }

      }

      // ===================================================
      // SUGESTÃO 2
      // ===================================================

      for (

        let dias = 1;

        dias <= 30;

        dias++

      ) {

        const novaData =

          adicionarDias(

            dataSelecionada,

            dias

          )

        if (

          verificarDisponibilidade(

            novaData,

            horarioSelecionado

          )

        ) {

          resultado.push({

            data:
              novaData,

            horario:
              horarioSelecionado,

            descricao:
              'Mesmo horário no dia mais próximo'

          })

          break

        }

      }

      // ===================================================
      // SUGESTÃO 3
      // ===================================================

      const proximaSemana =

        adicionarDias(

          dataSelecionada,

          7

        )

      if (

        verificarDisponibilidade(

          proximaSemana,

          horarioSelecionado

        )

      ) {

        resultado.push({

          data:
            proximaSemana,

          horario:
            horarioSelecionado,

          descricao:
            'Mesmo horário no mesmo dia da semana, na próxima semana'

        })

      }

      return resultado

    }, [

      blocosNecessarios,

      horarioSelecionado,

      dataSelecionada,

      agendamentos,

      possuiServicosSelecionados

    ])

  // =======================================================
  // FORMATAR TELEFONE
  // =======================================================

  function formatarTelefone(
    valor: string
  ) {

    const apenasNumeros =

      valor.replace(
        /\D/g,
        ''
      )

    const numerosLimitados =

      apenasNumeros.slice(
        0,
        11
      )

    if (

      numerosLimitados.length <= 2

    ) {

      return numerosLimitados

        ? `(${numerosLimitados}`

        : ''

    }

    if (

      numerosLimitados.length <= 7

    ) {

      return (

        `(${numerosLimitados.slice(
          0,
          2
        )}) ` +

        numerosLimitados.slice(
          2
        )

      )

    }

    return (

      `(${numerosLimitados.slice(
        0,
        2
      )}) ` +

      `${numerosLimitados.slice(
        2,
        7
      )}-` +

      numerosLimitados.slice(
        7,
        11
      )

    )

  }

  // =======================================================
  // ALTERAR TELEFONE
  // =======================================================

  function handleTelefoneChange(
    valor: string
  ) {

    setTelefone(

      formatarTelefone(
        valor
      )

    )

    setErroTelefone('')

  }

  // =======================================================
  // VALIDAR TELEFONE
  // =======================================================

  function telefoneValido() {

    const apenasNumeros =

      telefone.replace(
        /\D/g,
        ''
      )

    if (

      apenasNumeros.length !== 11

    ) {

      return false

    }

    if (

      apenasNumeros[2] !== '9'

    ) {

      return false

    }

    if (

      /^(\d)\1+$/.test(
        apenasNumeros
      )

    ) {

      return false

    }

    return true

  }

  // =======================================================
  // CONFIRMAR AGENDAMENTO
  // =======================================================

  function confirmarAgendamento() {

    if (

      !nome.trim()

    ) {

      alert(

        'Digite seu nome para realizar o agendamento.'

      )

      return

    }

    if (

      !telefoneValido()

    ) {

      setErroTelefone(

        'Digite um telefone celular válido. Exemplo: (11) 99999-9999'

      )

      return

    }

    if (

      servicosSelecionados.length === 0

    ) {

      alert(

        'Selecione pelo menos um serviço.'

      )

      return

    }

    if (

      !verificarDisponibilidade(

        dataSelecionada,

        horarioSelecionado

      )

    ) {

      alert(

        'Esse horário não possui blocos consecutivos suficientes para realizar todos os serviços selecionados. Escolha outro horário.'

      )

      return

    }

    selecionarHorario(
      horarioSelecionado
    )

    definirDataAgendamento(
      dataSelecionada
    )

    agendarHorario(

      nome.trim(),

      telefone,

      dataSelecionada,

      horarioSelecionado,

      blocosNecessarios,

      tempoTotal

    )

  }

  // =======================================================
  // RENDER
  // =======================================================

  return (

    <div className="
      w-full
      h-screen
      bg-black/80
      fixed
      top-0
      left-0
      z-[100]
      flex
      items-center
      justify-center
      p-4
    ">

      <div className="
        w-[90%]
        max-w-[500px]
        max-h-[90vh]
        overflow-y-auto
        bg-white
        flex
        flex-col
        p-4
        gap-4
        rounded-xl
      ">

        <button

          type="button"

          className="
            bg-black
            flex
            items-center
            justify-center
            rounded-xl
            w-[35px]
            h-[35px]
            self-end
          "

          onClick={
            fecharModal
          }

        >

          <X color="white" />

        </button>

        <div className="
          w-full
          flex
          flex-col
          gap-2
        ">

          <input

            type="text"

            value={
              nome
            }

            className="
              text-black
              bg-black/10
              p-2
              w-full
              h-[40px]
              rounded-sm
            "

            onChange={e =>

              setNome(

                e.target.value.toUpperCase()

              )

            }

            placeholder="NOME"

          />

          <input

            type="tel"

            value={
              telefone
            }

            placeholder="(11) 99999-9999"

            maxLength={
              15
            }

            className={`

              text-black

              bg-black/10

              p-2

              w-full

              h-[40px]

              rounded-sm

              ${
                erroTelefone
                  ? 'border-2 border-red-500'
                  : ''
              }

            `}

            onChange={e =>

              handleTelefoneChange(

                e.target.value

              )

            }

          />

          {erroTelefone && (

            <p className="
              text-red-500
              text-xs
            ">

              {
                erroTelefone
              }

            </p>

          )}

        </div>

        <div className="
          bg-black
          w-full
          rounded-xl
          p-2
          flex
          flex-col
          gap-2
        ">

          {services.map(

            (
              serviço,
              index
            ) => (

              <Services

                key={
                  serviço.serviço
                }

                serviços={
                  serviço
                }

                onServices={() =>

                  selecionarServicos(
                    index
                  )

                }

              />

            )

          )}

        </div>

        <div className="
          w-full
          bg-zinc-100
          rounded-xl
          p-4
          flex
          flex-col
          gap-2
          text-black
        ">

          <div className="
            flex
            justify-between
          ">

            <span>
              Data:
            </span>

            <strong>
              {dataSelecionada}
            </strong>

          </div>

          <div className="
            flex
            justify-between
          ">

            <span>
              Horário:
            </span>

            <strong>
              {horarioSelecionado}
            </strong>

          </div>

          <div className="
            flex
            justify-between
          ">

            <span>
              Tempo estimado:
            </span>

            <strong>

              {
                formatarTempo(
                  tempoTotal
                )
              }

            </strong>

          </div>

          <div className="
            flex
            justify-between
          ">

            <span>
              Blocos necessários:
            </span>

            <strong>

              {
                blocosNecessarios
              }

            </strong>

          </div>

          <div className="
            flex
            justify-between
          ">

            <span>
              Total:
            </span>

            <strong>

              R$ {
                somaFatu
              }

            </strong>

          </div>

        </div>

        {mostrarAvisoSobreposicao && (

          <div className="
            w-full
            bg-yellow-100
            border
            border-yellow-500
            rounded-xl
            p-4
            flex
            gap-3
            items-start
          ">

            <AlertTriangle

              className="
                text-yellow-600
                shrink-0
              "

            />

            <p className="
              text-sm
              text-black
            ">

              Por conta do cliente antes de você,
              existe uma possibilidade de pequeno
              atraso.

              A estimativa é de aproximadamente

              <strong>

                {' '}

                {
                  atrasoEstimado
                }

                {' '}

                minutos

              </strong>.

              Isso pode variar de acordo com a duração
              real do atendimento anterior.

            </p>

          </div>

        )}

        {mostrarMensagemIndisponivel &&
          sugestoes.length > 0 && (

            <div className="
              w-full
              bg-blue-50
              border
              border-blue-300
              rounded-xl
              p-4
              flex
              flex-col
              gap-3
            ">

              <h3 className="
                text-black
                font-bold
              ">

                💡 Temos horários mais confortáveis
                para esse atendimento

              </h3>

              <p className="
                text-sm
                text-black
              ">

                Como os serviços selecionados precisam
                de mais tempo, encontramos algumas opções
                que permitem realizar seu atendimento
                com mais tranquilidade.

              </p>

              {sugestoes.map(

                (
                  sugestao,
                  index
                ) => {

                  const selecionada =

                    sugestaoSelecionada ===

                    `${sugestao.data}-${sugestao.horario}`

                  return (

                    <button

                      type="button"

                      onClick={() =>

                        selecionarSugestao(
                          sugestao
                        )

                      }

                      key={

                        `${sugestao.data}-${sugestao.horario}`

                      }

                      className={`

                        w-full

                        rounded-lg

                        p-3

                        flex

                        flex-col

                        gap-1

                        border

                        text-left

                        transition-all

                        cursor-pointer

                        ${
                          selecionada

                            ? 'border-blue-600 bg-blue-100 ring-2 ring-blue-400'

                            : 'border-zinc-200 bg-white hover:border-blue-500 hover:bg-blue-50'
                        }

                      `}

                    >

                      <strong className="
                        text-black
                      ">

                        Opção {
                          index + 1
                        }

                        {
                          selecionada &&
                          ' ✓'
                        }

                      </strong>

                      <span className="
                        text-black
                        font-semibold
                      ">

                        {
                          sugestao.horario
                        }

                      </span>

                      <span className="
                        text-xs
                        text-zinc-600
                      ">

                        {
                          sugestao.descricao
                        }

                      </span>

                      <span className="
                        text-xs
                        text-zinc-500
                      ">

                        Data: {
                          sugestao.data
                        }

                      </span>

                    </button>

                  )

                }

              )}

              <p className="
                text-xs
                text-zinc-500
              ">

                Escolha uma das sugestões acima
                para continuar o agendamento.

              </p>

            </div>

          )}

        {/* =================================================
            CONFIRMAR AGENDAMENTO
        ================================================= */}

        {!possuiServicosSelecionados ||

        podeAgendar ? (

          <div className="
            w-full
            rounded-xl
            bg-black
          ">

            <button

              type="button"

              className="
                w-full
                p-4
                flex
                items-center
                justify-around
                rounded-xl
                text-white
              "

              onClick={
                confirmarAgendamento
              }

            >

              <CalendarCheck2 />

              <span className="
                font-bold
                text-center
              ">

                CONFIRMAR AGENDAMENTO

              </span>

            </button>

          </div>

        ) : (

          <div className="
            w-full
            rounded-xl
            border-2
            border-red-300
            bg-red-50
            p-5
            flex
            flex-col
            items-center
            gap-2
          ">

            <span className="
              text-red-700
              font-bold
              text-center
            ">

              Não é possível realizar este
              agendamento neste horário.

            </span>

            <span className="
              text-sm
              text-red-600
              text-center
            ">

              Escolha uma das sugestões acima
              para continuar o agendamento.

            </span>

          </div>

        )}

      </div>

    </div>

  )

}

