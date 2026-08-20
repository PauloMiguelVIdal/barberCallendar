'use client'

import {
  ArrowBigLeft,
  ArrowBigRight,
  Users,
  User,
  CalendarCheck,
  Copy,
  Check,
  Edit2,
  Trash2,
  Scissors,
  Clock,
  X,
  DollarSign
} from 'lucide-react'

import {
  useEffect,
  useState,
  useMemo
} from 'react'

import Formulario from './Formulario'
import FormularioEdicao from './FormularioEdicao'

import {
  horarioType
} from '../types/horario'

import {
  useCentralDados,
  useAgendamentos
} from '../context/PersistData'

// =========================================================
// IMPORTAÇÕES DO BANCO DE DADOS
// =========================================================
import { buscarClientePorId } from '../services/clienteService'
import { buscarServicos } from '../services/servicosService'
import { buscarServicosPorAgendamento } from '../services/agendamentoServicoService'

export default function CallendarAdmin() {

  // =========================================================
  // CONTEXT
  // =========================================================

  const {
    dataVisualizada,
    proximoDia,
    diaAnterior
  } = useCentralDados()

  // =========================================================
  // AGENDAMENTOS
  // =========================================================

  const {
    agendamentos,
    isLoading,
    removerAgendamento,
    agendamentosCliente
  } = useAgendamentos()

  // =========================================================
  // ESTADO DO MODAL E ADMIN
  // =========================================================

  const [
    modalCancelar,
    setModalCancelar
  ] = useState(false)

  const [
    agendamentoSelecionado,
    setAgendamentoSelecionado
  ] = useState<any>(null)

  const [
    copiado,
    setCopiado
  ] = useState(false)

  const [modalEdicao, setModalEdicao] = useState(false)
  const [agendamentoEditando, setAgendamentoEditando] = useState<any>(null)

  // Estados extras para buscar dados do Banco no Modo Admin
  const [dadosAdminMap, setDadosAdminMap] = useState<Record<string, any>>({})
  const [servicosAgendamentoMap, setServicosAgendamentoMap] = useState<Record<string, any[]>>({})
  const [carregandoAdmin, setCarregandoAdmin] = useState(false)

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

  const DURACAO_BLOCO = 45
  const TEMPO_TOLERANCIA = 20

  // =========================================================
  // DATA VISUALIZADA
  // =========================================================

  const diaVisualizado = dataVisualizada.getDate()
  const mesVisualizado = dataVisualizada.getMonth()
  const anoVisualizado = dataVisualizada.getFullYear()
  const diaDaSemana = dataVisualizada.getDay()
  const ehSabado = diaDaSemana === 6

  // =========================================================
  // HORÁRIOS DISPONÍVEIS
  // =========================================================

  const horarios: horarioType[] = [
    { hora: '9:00', ocupado: false },
    { hora: '9:45', ocupado: false },
    { hora: '10:30', ocupado: false },
    { hora: '11:15', ocupado: false },
    { hora: '12:00', ocupado: false },
    { hora: '12:45', ocupado: false },
    { hora: '13:30', ocupado: false },
    { hora: '14:15', ocupado: false },
    { hora: '15:00', ocupado: false },
    { hora: '15:45', ocupado: false },
    { hora: '16:30', ocupado: false },
    { hora: '17:15', ocupado: false },
    { hora: '18:00', ocupado: false },
    { hora: '18:45', ocupado: false },
    { hora: '19:30', ocupado: false }
  ]

  // =========================================================
  // DATA FORMATADA
  // =========================================================

  const dataFormatada =
    `${anoVisualizado}-${String(
      mesVisualizado + 1
    ).padStart(2, '0')}-${String(
      diaVisualizado
    ).padStart(2, '0')}`

  // =========================================================
  // FUNÇÕES AUXILIARES
  // =========================================================

  function formatarDataParaExibicao(data: string) {
    if (!data) return '--/--/----'
    const [ano, mes, dia] = data.split('-')
    return `${dia}/${mes}/${ano}`
  }

  function horarioParaMinutos(horario: string) {
    const [horas, minutos] = horario.split(':').map(Number)
    return (horas * 60 + minutos)
  }

  // =========================================================
  // VERIFICAR SE HORÁRIO ESTÁ OCUPADO
  // =========================================================

  function horarioEstaOcupado(horarioVerificado: string) {

    if (ehSabado) {
      return true
    }

    const minutoVerificado = horarioParaMinutos(horarioVerificado)

    return agendamentos.some(agendamento => {
      if (agendamento.data !== dataFormatada) return false
      if (agendamento.cancelado) return false

      const inicioAgendamento = horarioParaMinutos(agendamento.hora_inicio.slice(0, 5))
      const fimAgendamento = horarioParaMinutos(agendamento.hora_fim.slice(0, 5))

      return (minutoVerificado >= inicioAgendamento && minutoVerificado < fimAgendamento)
    })
  }

  // =========================================================
  // OBTER AGENDAMENTO POR HORÁRIO
  // =========================================================

  function obterAgendamentoPorHorario(horarioVerificado: string) {

    const minutoVerificado = horarioParaMinutos(horarioVerificado)

    const agendamentoEncontrado = agendamentos.find(agendamento => {
      if (agendamento.data !== dataFormatada) return false
      if (agendamento.cancelado) return false

      const inicioAgendamento = horarioParaMinutos(agendamento.hora_inicio.slice(0, 5))
      const fimAgendamento = horarioParaMinutos(agendamento.hora_fim.slice(0, 5))

      return (minutoVerificado >= inicioAgendamento && minutoVerificado < fimAgendamento)
    })

    return agendamentoEncontrado
  }

  // =========================================================
  // OBTER DADOS DO CLIENTE DO AGENDAMENTO LOCAL
  // =========================================================

  function obterDadosCliente(agendamentoId: string) {
    const agendamentoLocal = agendamentosCliente.find(
      a => a.id === agendamentoId
    )
    
    return {
      nome: agendamentoLocal?.nome || 'Cliente não identificado',
      telefone: agendamentoLocal?.telefone || '',
      servicos: agendamentoLocal?.servicos || [],
      duracao: agendamentoLocal?.duracao || 0,
      valor: agendamentoLocal?.valor || 0
    }
  }

  // =========================================================
  // FUNÇÃO PARA CALCULAR DURAÇÃO E VALOR TOTAL DOS SERVIÇOS
  // =========================================================

  function calcularTotaisServicos(servicos: any[]) {
    let duracaoTotal = 0
    let valorTotal = 0

    servicos.forEach(servico => {
      duracaoTotal += servico.duracao || 0
      valorTotal += servico.valor || 0
    })

    return { duracaoTotal, valorTotal }
  }

  // =========================================================
  // FORMATAR TELEFONE
  // =========================================================

  function formatarTelefone(telefone: string) {
    if (!telefone) return ''
    const apenasNumeros = telefone.replace(/\D/g, '')
    if (apenasNumeros.length === 11) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 7)}-${apenasNumeros.slice(7, 11)}`
    }
    if (apenasNumeros.length === 10) {
      return `(${apenasNumeros.slice(0, 2)}) ${apenasNumeros.slice(2, 6)}-${apenasNumeros.slice(6, 10)}`
    }
    return telefone
  }

  // =========================================================
  // COPIAR TELEFONE
  // =========================================================

  async function copiarTelefone(telefone: string) {
    try {
      await navigator.clipboard.writeText(telefone)
      setCopiado(true)
      setTimeout(() => setCopiado(false), 3000)
    } catch (error) {
      console.error('Erro ao copiar:', error)
    }
  }

  // =========================================================
  // CANCELAR AGENDAMENTO (ADMIN)
  // =========================================================

  async function handleCancelarAgendamento() {
    if (!agendamentoSelecionado) return

    try {
      await removerAgendamento(agendamentoSelecionado.id)
      setModalCancelar(false)
      setAgendamentoSelecionado(null)
    } catch (error) {
      console.error('Erro ao cancelar:', error)
      alert('Erro ao cancelar agendamento. Tente novamente.')
    }
  }

  // =========================================================
  // ADAPTAR AGENDAMENTOS PARA O FORMULÁRIO
  // =========================================================

  const agendamentosFormulario = agendamentos.map(
    (agendamento) => ({
      id: agendamento.id,
      data: agendamento.data,
      hora: agendamento.hora_inicio,
      nome: '',
      telefone: ''
    })
  )

  // =========================================================
  // BUSCAR DADOS REAIS DO BANCO PARA O ADMIN
  // =========================================================

  useEffect(() => {
    async function buscarDadosAdmin() {
      setCarregandoAdmin(true)

      try {
        // 1. Puxar todos os serviços do banco
        const servicosDB = await buscarServicos()
        const mapServicos: Record<string, any> = {}
        servicosDB.forEach(s => { mapServicos[s.id] = s })

        // 2. Puxar os clientes de cada agendamento do dia atual
        const agendamentosDoDia = agendamentos.filter(a => a.data === dataFormatada && !a.cancelado)
        
        // Criar um mapa de cliente_id para os dados do cliente
        const mapClientes: Record<string, any> = {}
        
        for (const agendamento of agendamentosDoDia) {
          if (agendamento.cliente_id && !mapClientes[agendamento.cliente_id]) {
            const cliente = await buscarClientePorId(agendamento.cliente_id)
            if (cliente) {
              mapClientes[agendamento.cliente_id] = cliente
            }
          }
        }
        setDadosAdminMap(mapClientes)

        // 3. Buscar serviços de cada agendamento
        const mapServicosAgendamento: Record<string, any[]> = {}
        
        for (const agendamento of agendamentosDoDia) {
          if (agendamento.id) {
            const servicosAgendamento = await buscarServicosPorAgendamento(agendamento.id)
            mapServicosAgendamento[agendamento.id] = servicosAgendamento
          }
        }
        setServicosAgendamentoMap(mapServicosAgendamento)

      } catch (error) {
        console.error('Erro ao carregar dados do Admin:', error)
      } finally {
        setCarregandoAdmin(false)
      }
    }

    buscarDadosAdmin()
  }, [agendamentos, dataFormatada])

  // =========================================================
  // RESUMO FINANCEIRO - ADMIN
  // =========================================================

  const resumoFinanceiro = useMemo(() => {
    // Pega todos os agendamentos do dia (não cancelados)
    const agendamentosDoDia = agendamentos.filter(
      a => a.data === dataFormatada && !a.cancelado
    )

    // Total de clientes (agendamentos)
    const totalClientes = agendamentosDoDia.length

    // Total de serviços e faturamento
    let totalServicos = 0
    let faturamentoTotal = 0

    agendamentosDoDia.forEach(agendamento => {
      const servicos = servicosAgendamentoMap[agendamento.id] || []
      const { valorTotal } = calcularTotaisServicos(servicos)
      
      totalServicos += servicos.length
      faturamentoTotal += valorTotal
    })

    return {
      totalClientes,
      totalServicos,
      faturamentoTotal
    }
  }, [agendamentos, servicosAgendamentoMap, dataFormatada])

  // =========================================================
  // NOME DOS DIAS DA SEMANA
  // =========================================================

  const diasSemana = [
    'Domingo', 'Segunda', 'Terça', 'Quarta',
    'Quinta', 'Sexta', 'Sábado'
  ]

  // =========================================================
  // RENDER
  // =========================================================

  return (

    <div
      className="
        w-full
        h-full
        bg-[#121212]
        text-[#E0E0E0]
        p-4
        overflow-y-auto
      "
    >

      {/* =====================================================
          CABEÇALHO
      ====================================================== */}

      <div
        className="
          w-full
          h-[80px]
          bg-[#121212]
          flex
          items-center
          justify-around
          border-b
          border-[#2A2A2A]
          mb-4
          flex-wrap
          gap-2
        "
      >

        {/* DIA ANTERIOR */}
        <button
          onClick={diaAnterior}
          disabled={dataVisualizada.getTime() === hoje.getTime()}
          className={`
            flex
            w-[50px]
            h-[50px]
            rounded-full
            items-center
            justify-center
            ${dataVisualizada.getTime() === hoje.getTime()
              ? 'bg-[#333333] cursor-not-allowed'
              : 'bg-[#D3AF37] hover:bg-[#C4A032]'
            }
          `}
        >
          <ArrowBigLeft color="white" />
        </button>

        {/* DATA */}
        <div className="text-center">
          <h1 className="text-[25px] text-[#FFFFFF] text-center font-bold">
            {diaVisualizado}/{mesVisualizado + 1}/{anoVisualizado}
          </h1>
          <p className={`text-sm mt-1 ${ehSabado ? 'text-[#FF6B6B]' : 'text-[#AAAAAA]'}`}>
            {diasSemana[diaDaSemana]}
          </p>
        </div>

        {/* PRÓXIMO DIA */}
        <button
          onClick={proximoDia}
          className="flex w-[50px] h-[50px] bg-[#D3AF37] rounded-full items-center justify-center hover:bg-[#C4A032]"
        >
          <ArrowBigRight color="white" />
        </button>

      </div>

      {/* =====================================================
          MENSAGEM DE SÁBADO
      ====================================================== */}

      {ehSabado && (
        <div className="w-full p-6 mb-4 bg-[#2A1A1A] border-2 border-[#FF6B6B] rounded-lg text-center">
          <p className="text-[#FF6B6B] text-lg font-bold">⚠️ ATENÇÃO: AOS SÁBADOS NÃO REALIZAMOS AGENDAMENTOS</p>
          <p className="text-[#E0E0E0] mt-2">O atendimento é realizado por ordem de chegada.</p>
        </div>
      )}

      {/* =====================================================
          RESUMO FINANCEIRO
      ====================================================== */}

      {!isLoading && !carregandoAdmin && (
        <div className="w-full mb-6">
          <div className="
            bg-gradient-to-r from-[#1E1E1E] to-[#2A2A2A]
            border border-[#D3AF37]/30
            rounded-2xl
            p-5
            grid
            grid-cols-1
            sm:grid-cols-3
            gap-4
          ">
            {/* Total de Clientes */}
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-xl bg-[#D3AF37]/20 flex items-center justify-center border border-[#D3AF37]/30">
                <Users size={24} color="#D3AF37" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">Clientes</p>
                <p className="text-2xl font-bold text-[#FFFFFF]">
                  {resumoFinanceiro.totalClientes}
                </p>
              </div>
            </div>

            {/* Total de Serviços */}
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-xl bg-[#D3AF37]/20 flex items-center justify-center border border-[#D3AF37]/30">
                <Scissors size={24} color="#D3AF37" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">Serviços</p>
                <p className="text-2xl font-bold text-[#FFFFFF]">
                  {resumoFinanceiro.totalServicos}
                </p>
              </div>
            </div>

            {/* Faturamento Total */}
            <div className="flex items-center gap-4">
              <div className="w-[50px] h-[50px] rounded-xl bg-[#D3AF37]/20 flex items-center justify-center border border-[#D3AF37]/30">
                <DollarSign size={24} color="#D3AF37" />
              </div>
              <div>
                <p className="text-xs text-[#A0A0A0] uppercase tracking-wider">Faturamento</p>
                <p className="text-2xl font-bold text-[#D3AF37]">
                  R$ {resumoFinanceiro.faturamentoTotal.toFixed(2).replace('.', ',')}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          LISTA DE AGENDAMENTOS (MODO ADMIN)
      ====================================================== */}

      <div className="flex flex-col gap-4 pb-[80px]">
        {isLoading || carregandoAdmin ? (
          <div className="w-full flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-12 h-12 border-4 border-[#D3AF37] border-t-transparent rounded-full animate-spin" />
            <p className="text-[#A0A0A0] text-sm">Carregando dados do servidor...</p>
          </div>
        ) : (
          <>
            {horarios.map(horario => {
              const agendamento = obterAgendamentoPorHorario(horario.hora)
              
              if (!agendamento) return null

              // Busca os dados do cliente
              const clienteDB = dadosAdminMap[agendamento.cliente_id]
              
              // Busca os serviços do agendamento
              const servicosAgendamento = servicosAgendamentoMap[agendamento.id] || []
              
              // Calcula duração e valor total
              const { duracaoTotal, valorTotal } = calcularTotaisServicos(servicosAgendamento)
              
              // Dados do cliente
              const dadosCliente = clienteDB ? {
                nome: clienteDB.nome || 'Cliente não identificado',
                telefone: clienteDB.telefone || '',
              } : obterDadosCliente(agendamento.id)

              const telefone = dadosCliente.telefone || ''

              // Nomes dos serviços
              const servicosNomes = servicosAgendamento.map(servico => servico.nome)

              return (
                <div
                  key={agendamento.id + '-' + horario.hora + '-' + dataFormatada}
                  className="
                    bg-[#1E1E1E]
                    border
                    border-[#2A2A2A]
                    rounded-2xl
                    p-5
                    flex
                    flex-col
                    gap-4
                    transition-all
                    duration-200
                    hover:border-[#D3AF37]
                  "
                >
                  {/* Cabeçalho */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-[45px] aspect-square rounded-xl bg-[#2A2A2A] flex items-center justify-center border border-[#D3AF37] shrink-0">
                        <CalendarCheck color="#D3AF37" size={22} />
                      </div>
                      <div className="flex flex-col min-w-0">
                        <span className="font-bold text-base text-[#FFFFFF] truncate">
                          {dadosCliente.nome}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-[#A0A0A0]">{horario.hora}</span>
                          {telefone && (
                            <>
                              <span className="text-xs text-[#757575]">•</span>
                              <span className="text-sm text-[#A0A0A0]">{formatarTelefone(telefone)}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Botões de ação */}
                    <div className="flex gap-2 shrink-0">
                      {telefone && (
                        <button
                          onClick={() => copiarTelefone(telefone)}
                          className="w-[36px] h-[36px] rounded-xl bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333333] transition-colors relative"
                          title="Copiar telefone"
                        >
                          {copiado ? (
                            <Check size={16} color="#4CAF50" />
                          ) : (
                            <Copy size={16} color="#A0A0A0" />
                          )}
                        </button>
                      )}
                      <button
                        onClick={() => {
                          const agendamentoCompleto = agendamentos.find(a => a.id === agendamento.id)
                          setAgendamentoEditando(agendamentoCompleto)
                          setModalEdicao(true)
                        }}
                        className="w-[36px] h-[36px] rounded-xl bg-[#2A2A2A] flex items-center justify-center hover:bg-[#333333] transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={16} color="#A0A0A0" />
                      </button>
                      <button
                        onClick={() => {
                          setAgendamentoSelecionado(agendamento)
                          setModalCancelar(true)
                        }}
                        className="w-[36px] h-[36px] rounded-xl bg-[#D32F2F]/20 flex items-center justify-center hover:bg-[#D32F2F]/40 transition-colors"
                        title="Cancelar"
                      >
                        <Trash2 size={16} color="#FF6B6B" />
                      </button>
                    </div>
                  </div>

                  {/* Serviços */}
                  {servicosNomes.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {servicosNomes.map((nome, index) => (
                        <span
                          key={index}
                          className="bg-[#2A2A2A] text-xs text-[#E0E0E0] px-3 py-1 rounded-full border border-[#333333]"
                        >
                          {nome}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Resumo */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-[#2A2A2A]">
                    <div className="flex items-center gap-4">
                      {duracaoTotal > 0 && (
                        <span className="text-sm text-[#A0A0A0] flex items-center gap-1">
                          <Clock size={14} color="#757575" />
                          {duracaoTotal} min
                        </span>
                      )}
                      {valorTotal > 0 && (
                        <strong className="text-[#D3AF37] text-base">
                          R$ {valorTotal.toFixed(2).replace('.', ',')}
                        </strong>
                      )}
                    </div>

                    <button
                      onClick={() => {
                        setAgendamentoSelecionado(agendamento)
                        setModalCancelar(true)
                      }}
                      className="bg-[#D32F2F] text-white px-4 py-2 rounded-xl text-xs font-semibold hover:bg-[#B71C1C] transition-colors"
                    >
                      CANCELAR AGENDAMENTO
                    </button>
                  </div>
                </div>
              )
            }).filter(Boolean)}

            {/* Mensagem quando não há agendamentos */}
            {!isLoading && horarios.every(h => !obterAgendamentoPorHorario(h.hora)) && (
              <div className="w-full flex flex-col items-center justify-center py-12 gap-4 bg-[#1E1E1E] border border-[#2A2A2A] rounded-2xl">
                <CalendarCheck size={40} color="#757575" />
                <p className="text-sm text-[#A0A0A0]">Nenhum agendamento para este dia</p>
              </div>
            )}
            
          </>
        )}
      </div>

      {/* =====================================================
          MODAL CANCELAR (ADMIN)
      ====================================================== */}
      {modalEdicao && agendamentoEditando && (
        <FormularioEdicao
          agendamentoId={agendamentoEditando.id}
          agendamentoData={agendamentoEditando}
          fecharModal={() => {
            setModalEdicao(false)
            setAgendamentoEditando(null)
          }}
          agendamentos={agendamentosFormulario}
          onUpdate={() => {
            setModalEdicao(false)
            setAgendamentoEditando(null)
          }}
        />
      )}

      {modalCancelar && agendamentoSelecionado && (
        <div className="fixed inset-0 bg-[#121212]/90 flex items-center justify-center z-50 p-4">
          <div className="bg-[#1E1E1E] rounded-2xl p-6 w-[90%] max-w-[380px] flex flex-col gap-6 border border-[#2A2A2A]">
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setModalCancelar(false)
                  setAgendamentoSelecionado(null)
                }}
                className="bg-[#2A2A2A] rounded-full p-2 hover:bg-[#333333] transition-colors"
              >
                <X size={20} color="#757575" />
              </button>
            </div>

            <div className="text-center">
              <h2 className="text-xl font-bold text-[#FFFFFF]">Cancelar agendamento?</h2>
              <p className="text-sm text-[#A0A0A0] mt-2">
                {obterDadosCliente(agendamentoSelecionado.id).nome}
                {' - '}
                {formatarDataParaExibicao(dataFormatada)}
                {' às '}
                {agendamentoSelecionado.hora_inicio?.slice(0, 5)}
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setModalCancelar(false)
                  setAgendamentoSelecionado(null)
                }}
                className="flex-1 border-2 border-[#333333] rounded-xl py-3 font-semibold text-[#E0E0E0] hover:bg-[#2A2A2A] transition-colors"
              >
                Voltar
              </button>
              <button
                type="button"
                onClick={handleCancelarAgendamento}
                className="flex-1 rounded-xl bg-[#D32F2F] text-[#FFFFFF] py-3 font-semibold hover:bg-[#B71C1C] transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}