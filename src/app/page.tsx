"use client"

import { useState, useEffect } from 'react'
import { Calendar, Users, MapPin, DollarSign, Clock, User, Plus, Edit, Trash2, CheckCircle, LogOut, Eye, EyeOff, Globe, Search, RotateCcw, CalendarDays, TrendingUp, UserX, UserPlus, RefreshCw, Sun, Moon, Menu, X } from 'lucide-react'

// Tipos de dados
interface Cliente {
  id: string
  nome: string
  endereco: string
  telefone: string
  valorServico: number
  observacoes: string
  recorrencia?: 'semanal' | 'quinzenal' | 'mensal' | 'seis-semanas' | 'nenhuma'
  proximoAgendamento?: string
}

interface Funcionario {
  id: string
  nome: string
  telefone: string
  especialidade: string
}

interface Helper {
  username: string
  password: string
  nome: string
}

interface Agendamento {
  id: string
  clienteId: string
  funcionarioId: string
  data: string
  horario: string
  status: 'agendado' | 'em-andamento' | 'concluido' | 'cancelado'
  observacoes: string
  valorHelper?: number
  valorPago?: number // Valor real pago (com gorjetas)
  recorrente?: boolean
  clienteSubstituto?: string // Nome do cliente substituto
  clienteRemovido?: boolean // Se cliente foi removido mas agendamento mantido
}

interface User {
  username: string
  role: 'admin' | 'helper'
  nome: string
}

// Configurações de usuários fixos
const USERS = {
  admin: { username: 'Paula', password: '9001', nome: 'Paula' },
  helpers: [
    { username: 'Adna', password: '9440', nome: 'Adna' },
    { username: 'Layla', password: '5706', nome: 'Layla' },
    { username: 'Rose', password: '2233', nome: 'Rose' },
    { username: 'Karina', password: '9908', nome: 'Karina' },
    { username: 'Dalitsa', password: '1607', nome: 'Dalitsa' }
  ]
}

// Traduções
const TRANSLATIONS = {
  en: {
    // Login
    login: 'Login',
    username: 'Username',
    password: 'Password',
    rememberMe: 'Remember Me',
    signIn: 'Sign In',
    invalidCredentials: 'Invalid credentials',
    
    // Navigation
    dashboard: 'Dashboard',
    clients: 'Clients',
    employees: 'Employees',
    appointments: 'Appointments',
    logout: 'Logout',
    
    // Dashboard
    totalClients: 'Total Clients',
    totalEmployees: 'Employees',
    todayAppointments: 'Today\'s Appointments',
    estimatedRevenue: 'Estimated Revenue Today',
    weeklyRevenue: 'Weekly Revenue',
    monthlyRevenue: 'Monthly Revenue',
    todaySchedule: 'Today\'s Schedule',
    weeklySchedule: 'Weekly Schedule',
    monthlySchedule: 'Monthly Schedule',
    noAppointments: 'No appointments',
    
    // Clients
    newClient: 'New Client',
    editClient: 'Edit Client',
    clientName: 'Client Name',
    address: 'Address',
    phone: 'Phone',
    serviceValue: 'Service Value',
    observations: 'Observations',
    recurrence: 'Recurrence',
    none: 'None',
    weekly: 'Weekly',
    biweekly: 'Biweekly',
    monthly: 'Monthly',
    sixWeeks: 'Every 6 weeks',
    
    // Employees
    newEmployee: 'New Employee',
    employeeName: 'Employee Name',
    specialty: 'Specialty',
    generalCleaning: 'General Cleaning',
    heavyCleaning: 'Heavy Cleaning',
    organization: 'Organization',
    postConstruction: 'Post-Construction Cleaning',
    
    // Appointments
    newAppointment: 'New Appointment',
    client: 'Client',
    employee: 'Employee',
    date: 'Date',
    time: 'Time',
    status: 'Status',
    value: 'Value',
    helperPayment: 'Helper Payment',
    paidAmount: 'Amount Paid',
    scheduled: 'Scheduled',
    inProgress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
    substituteClient: 'Substitute Client',
    removeClient: 'Remove Client',
    editPayment: 'Edit Payment',
    
    // Actions
    add: 'Add',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    start: 'Start',
    complete: 'Complete',
    actions: 'Actions',
    substitute: 'Substitute',
    remove: 'Remove',
    
    // Helper payments
    helperPayments: 'Helper Payments',
    weeklyPayments: 'Weekly Payments',
    completedServices: 'Completed Services',
    totalPayment: 'Total Payment',
    
    // Available times
    availableTimes: 'Available Times',
    suggestedTimes: 'Suggested Times',
    findAvailableTimes: 'Find Available Times',
    
    // New features
    clientSubstituted: 'Client Substituted',
    clientRemoved: 'Client Removed',
    originalClient: 'Original Client',
    autoCompleted: 'Auto-completed at 8 PM',
    nextDayServices: 'Next Day Services',
    
    // Theme
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode'
  },
  pt: {
    // Login
    login: 'Login',
    username: 'Usuário',
    password: 'Senha',
    rememberMe: 'Lembrar de mim',
    signIn: 'Entrar',
    invalidCredentials: 'Credenciais inválidas',
    
    // Navigation
    dashboard: 'Dashboard',
    clients: 'Clientes',
    employees: 'Funcionários',
    appointments: 'Agendamentos',
    logout: 'Sair',
    
    // Dashboard
    totalClients: 'Total de Clientes',
    totalEmployees: 'Funcionários',
    todayAppointments: 'Agendamentos Hoje',
    estimatedRevenue: 'Receita Estimada Hoje',
    weeklyRevenue: 'Receita Semanal',
    monthlyRevenue: 'Receita Mensal',
    todaySchedule: 'Agenda de Hoje',
    weeklySchedule: 'Agenda Semanal',
    monthlySchedule: 'Agenda Mensal',
    noAppointments: 'Nenhum agendamento',
    
    // Clients
    newClient: 'Novo Cliente',
    editClient: 'Editar Cliente',
    clientName: 'Nome do Cliente',
    address: 'Endereço',
    phone: 'Telefone',
    serviceValue: 'Valor do Serviço',
    observations: 'Observações',
    recurrence: 'Recorrência',
    none: 'Nenhuma',
    weekly: 'Semanal',
    biweekly: 'Quinzenal',
    monthly: 'Mensal',
    sixWeeks: 'A cada 6 semanas',
    
    // Employees
    newEmployee: 'Novo Funcionário',
    employeeName: 'Nome do Funcionário',
    specialty: 'Especialidade',
    generalCleaning: 'Limpeza Geral',
    heavyCleaning: 'Limpeza Pesada',
    organization: 'Organização',
    postConstruction: 'Limpeza Pós-Obra',
    
    // Appointments
    newAppointment: 'Novo Agendamento',
    client: 'Cliente',
    employee: 'Funcionário',
    date: 'Data',
    time: 'Horário',
    status: 'Status',
    value: 'Valor',
    helperPayment: 'Pagamento Helper',
    paidAmount: 'Valor Pago',
    scheduled: 'Agendado',
    inProgress: 'Em Andamento',
    completed: 'Concluído',
    cancelled: 'Cancelado',
    substituteClient: 'Substituir Cliente',
    removeClient: 'Remover Cliente',
    editPayment: 'Editar Pagamento',
    
    // Actions
    add: 'Adicionar',
    edit: 'Editar',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    start: 'Iniciar',
    complete: 'Concluir',
    actions: 'Ações',
    substitute: 'Substituir',
    remove: 'Remover',
    
    // Helper payments
    helperPayments: 'Pagamentos dos Helpers',
    weeklyPayments: 'Pagamentos Semanais',
    completedServices: 'Serviços Concluídos',
    totalPayment: 'Pagamento Total',
    
    // Available times
    availableTimes: 'Horários Disponíveis',
    suggestedTimes: 'Horários Sugeridos',
    findAvailableTimes: 'Buscar Horários Disponíveis',
    
    // New features
    clientSubstituted: 'Cliente Substituído',
    clientRemoved: 'Cliente Removido',
    originalClient: 'Cliente Original',
    autoCompleted: 'Auto-concluído às 20h',
    nextDayServices: 'Serviços do Próximo Dia',
    
    // Theme
    darkMode: 'Modo Escuro',
    lightMode: 'Modo Claro'
  },
  es: {
    // Login
    login: 'Iniciar Sesión',
    username: 'Usuario',
    password: 'Contraseña',
    rememberMe: 'Recordarme',
    signIn: 'Entrar',
    invalidCredentials: 'Credenciales inválidas',
    
    // Navigation
    dashboard: 'Panel',
    clients: 'Clientes',
    employees: 'Empleados',
    appointments: 'Citas',
    logout: 'Salir',
    
    // Dashboard
    totalClients: 'Total de Clientes',
    totalEmployees: 'Empleados',
    todayAppointments: 'Citas de Hoy',
    estimatedRevenue: 'Ingresos Estimados Hoy',
    weeklyRevenue: 'Ingresos Semanales',
    monthlyRevenue: 'Ingresos Mensuales',
    todaySchedule: 'Agenda de Hoy',
    weeklySchedule: 'Agenda Semanal',
    monthlySchedule: 'Agenda Mensual',
    noAppointments: 'Sin citas',
    
    // Clients
    newClient: 'Nuevo Cliente',
    editClient: 'Editar Cliente',
    clientName: 'Nombre del Cliente',
    address: 'Dirección',
    phone: 'Teléfono',
    serviceValue: 'Valor del Servicio',
    observations: 'Observaciones',
    recurrence: 'Recurrencia',
    none: 'Ninguna',
    weekly: 'Semanal',
    biweekly: 'Quincenal',
    monthly: 'Mensual',
    sixWeeks: 'Cada 6 semanas',
    
    // Employees
    newEmployee: 'Nuevo Empleado',
    employeeName: 'Nombre del Empleado',
    specialty: 'Especialidad',
    generalCleaning: 'Limpieza General',
    heavyCleaning: 'Limpieza Pesada',
    organization: 'Organización',
    postConstruction: 'Limpieza Post-Construcción',
    
    // Appointments
    newAppointment: 'Nueva Cita',
    client: 'Cliente',
    employee: 'Empleado',
    date: 'Fecha',
    time: 'Hora',
    status: 'Estado',
    value: 'Valor',
    helperPayment: 'Pago Helper',
    paidAmount: 'Cantidad Pagada',
    scheduled: 'Programado',
    inProgress: 'En Progreso',
    completed: 'Completado',
    cancelled: 'Cancelado',
    substituteClient: 'Sustituir Cliente',
    removeClient: 'Remover Cliente',
    editPayment: 'Editar Pago',
    
    // Actions
    add: 'Agregar',
    edit: 'Editar',
    save: 'Guardar',
    cancel: 'Cancelar',
    delete: 'Eliminar',
    start: 'Iniciar',
    complete: 'Completar',
    actions: 'Acciones',
    substitute: 'Sustituir',
    remove: 'Remover',
    
    // Helper payments
    helperPayments: 'Pagos de Helpers',
    weeklyPayments: 'Pagos Semanales',
    completedServices: 'Servicios Completados',
    totalPayment: 'Pago Total',
    
    // Available times
    availableTimes: 'Horarios Disponibles',
    suggestedTimes: 'Horarios Sugeridos',
    findAvailableTimes: 'Buscar Horarios Disponibles',
    
    // New features
    clientSubstituted: 'Cliente Sustituido',
    clientRemoved: 'Cliente Removido',
    originalClient: 'Cliente Original',
    autoCompleted: 'Auto-completado a las 8 PM',
    nextDayServices: 'Servicios del Próximo Día',
    
    // Theme
    darkMode: 'Modo Oscuro',
    lightMode: 'Modo Claro'
  }
}

export default function IDO4UCRM() {
  // Estados de autenticação
  const [user, setUser] = useState<User | null>(null)
  const [loginForm, setLoginForm] = useState({ username: '', password: '', rememberMe: false })
  const [showPassword, setShowPassword] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [language, setLanguage] = useState<'en' | 'pt' | 'es'>('en')
  const [darkMode, setDarkMode] = useState(false)

  // Estados principais
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [funcionarios, setFuncionarios] = useState<Funcionario[]>([])
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([])
  
  // Estados para formulários
  const [novoCliente, setNovoCliente] = useState<Omit<Cliente, 'id'>>({
    nome: '', endereco: '', telefone: '', valorServico: 0, observacoes: '', recorrencia: 'nenhuma'
  })
  const [novoFuncionario, setNovoFuncionario] = useState<Omit<Funcionario, 'id'>>({
    nome: '', telefone: '', especialidade: ''
  })
  const [novoAgendamento, setNovoAgendamento] = useState<Omit<Agendamento, 'id'>>({
    clienteId: '', funcionarioId: '', data: '', horario: '', status: 'agendado', observacoes: '', valorHelper: 0
  })

  const [editandoCliente, setEditandoCliente] = useState<Cliente | null>(null)
  const [mostrarFormCliente, setMostrarFormCliente] = useState(false)
  const [mostrarFormFuncionario, setMostrarFormFuncionario] = useState(false)
  const [mostrarFormAgendamento, setMostrarFormAgendamento] = useState(false)
  const [horariosDisponiveis, setHorariosDisponiveis] = useState<string[]>([])
  const [mostrarHorarios, setMostrarHorarios] = useState(false)

  // Estados para novas funcionalidades
  const [editandoPagamento, setEditandoPagamento] = useState<string | null>(null)
  const [novoValorPago, setNovoValorPago] = useState<number>(0)
  const [substituindoCliente, setSubstituindoCliente] = useState<string | null>(null)
  const [nomeClienteSubstituto, setNomeClienteSubstituto] = useState('')

  const t = TRANSLATIONS[language]

  // Função para obter horário GMT-4
  const getGMT4Time = () => {
    const now = new Date()
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000)
    const gmt4 = new Date(utc + (-4 * 3600000))
    return gmt4
  }

  // Auto-atualização após 8 PM GMT-4
  useEffect(() => {
    const checkAutoUpdate = () => {
      const currentTime = getGMT4Time()
      const currentHour = currentTime.getHours()
      
      if (currentHour >= 20) { // 8 PM ou depois
        // Auto-completar serviços do dia
        const hoje = new Date().toISOString().split('T')[0]
        setAgendamentos(prev => prev.map(agendamento => {
          if (agendamento.data === hoje && 
              (agendamento.status === 'agendado' || agendamento.status === 'em-andamento')) {
            return { ...agendamento, status: 'concluido' as const }
          }
          return agendamento
        }))
      }
    }

    // Verificar a cada minuto
    const interval = setInterval(checkAutoUpdate, 60000)
    checkAutoUpdate() // Verificar imediatamente

    return () => clearInterval(interval)
  }, [])

  // Verificar login salvo
  useEffect(() => {
    const savedUser = localStorage.getItem('crm-user')
    const rememberMe = localStorage.getItem('crm-remember-me')
    const savedDarkMode = localStorage.getItem('crm-dark-mode')
    
    if (savedUser && rememberMe === 'true') {
      setUser(JSON.parse(savedUser))
    }
    
    if (savedDarkMode === 'true') {
      setDarkMode(true)
    }
  }, [])

  // Aplicar dark mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('crm-dark-mode', darkMode.toString())
  }, [darkMode])

  // Carregar dados do localStorage
  useEffect(() => {
    if (user) {
      const clientesSalvos = localStorage.getItem('crm-clientes')
      const funcionariosSalvos = localStorage.getItem('crm-funcionarios')
      const agendamentosSalvos = localStorage.getItem('crm-agendamentos')
      const languageSaved = localStorage.getItem('crm-language')

      if (clientesSalvos) setClientes(JSON.parse(clientesSalvos))
      if (funcionariosSalvos) setFuncionarios(JSON.parse(funcionariosSalvos))
      if (agendamentosSalvos) setAgendamentos(JSON.parse(agendamentosSalvos))
      if (languageSaved) setLanguage(languageSaved as 'en' | 'pt' | 'es')
    }
  }, [user])

  // Salvar dados no localStorage
  useEffect(() => {
    if (user) {
      localStorage.setItem('crm-clientes', JSON.stringify(clientes))
    }
  }, [clientes, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem('crm-funcionarios', JSON.stringify(funcionarios))
    }
  }, [funcionarios, user])

  useEffect(() => {
    if (user) {
      localStorage.setItem('crm-agendamentos', JSON.stringify(agendamentos))
    }
  }, [agendamentos, user])

  useEffect(() => {
    localStorage.setItem('crm-language', language)
  }, [language])

  // Gerar agendamentos recorrentes automaticamente
  const gerarAgendamentosRecorrentes = (cliente: Cliente, dataInicial: string, horario: string, funcionarioId: string) => {
    if (!cliente.recorrencia || cliente.recorrencia === 'nenhuma') return []

    const agendamentosRecorrentes: Agendamento[] = []
    const dataBase = new Date(dataInicial)
    
    // Gerar próximos 12 agendamentos (1 ano)
    for (let i = 1; i <= 12; i++) {
      const proximaData = new Date(dataBase)
      
      switch (cliente.recorrencia) {
        case 'semanal':
          proximaData.setDate(proximaData.getDate() + (7 * i))
          break
        case 'quinzenal':
          proximaData.setDate(proximaData.getDate() + (15 * i))
          break
        case 'mensal':
          proximaData.setMonth(proximaData.getMonth() + i)
          break
        case 'seis-semanas':
          proximaData.setDate(proximaData.getDate() + (42 * i)) // 6 semanas = 42 dias
          break
      }
      
      const dataStr = proximaData.toISOString().split('T')[0]
      
      // Verificar se não existe conflito de horário
      const conflito = agendamentos.some(a => 
        a.data === dataStr && 
        a.horario === horario && 
        a.funcionarioId === funcionarioId &&
        a.status !== 'cancelado'
      )
      
      if (!conflito) {
        const agendamentoRecorrente: Agendamento = {
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9) + i,
          clienteId: cliente.id,
          funcionarioId: funcionarioId,
          data: dataStr,
          horario: horario,
          status: 'agendado',
          observacoes: `Agendamento recorrente automático (${cliente.recorrencia})`,
          recorrente: true,
          valorHelper: 0
        }
        
        agendamentosRecorrentes.push(agendamentoRecorrente)
      }
    }
    
    return agendamentosRecorrentes
  }

  // Funções de autenticação
  const handleLogin = () => {
    setLoginError('')
    
    // Verificar admin
    if (loginForm.username === USERS.admin.username && loginForm.password === USERS.admin.password) {
      const userData = { username: USERS.admin.username, role: 'admin' as const, nome: USERS.admin.nome }
      setUser(userData)
      localStorage.setItem('crm-user', JSON.stringify(userData))
      if (loginForm.rememberMe) {
        localStorage.setItem('crm-remember-me', 'true')
      }
      return
    }
    
    // Verificar helpers
    const helper = USERS.helpers.find(h => h.username === loginForm.username && h.password === loginForm.password)
    if (helper) {
      const userData = { username: helper.username, role: 'helper' as const, nome: helper.nome }
      setUser(userData)
      localStorage.setItem('crm-user', JSON.stringify(userData))
      if (loginForm.rememberMe) {
        localStorage.setItem('crm-remember-me', 'true')
      }
      return
    }
    
    setLoginError(t.invalidCredentials)
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('crm-user')
    localStorage.removeItem('crm-remember-me')
    setLoginForm({ username: '', password: '', rememberMe: false })
  }

  // Formatação de telefone US
  const formatPhoneUS = (phone: string) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 10) {
      return `+1 (${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
    }
    return phone.startsWith('+1') ? phone : `+1 ${phone}`
  }

  // Formatação de valor em dólares
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(value)
  }

  // Buscar horários disponíveis
  const buscarHorariosDisponiveis = (data: string, funcionarioId?: string) => {
    const horariosBase = [
      '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', 
      '14:00', '15:00', '16:00', '17:00', '18:00'
    ]
    
    const agendamentosData = agendamentos.filter(a => 
      a.data === data && 
      a.status !== 'cancelado' &&
      (!funcionarioId || a.funcionarioId === funcionarioId)
    )
    
    const horariosOcupados = agendamentosData.map(a => a.horario)
    const disponiveis = horariosBase.filter(h => !horariosOcupados.includes(h))
    
    setHorariosDisponiveis(disponiveis)
    setMostrarHorarios(true)
  }

  // Substituir cliente no agendamento
  const substituirCliente = (agendamentoId: string, nomeSubstituto: string) => {
    setAgendamentos(prev => prev.map(agendamento => {
      if (agendamento.id === agendamentoId) {
        return {
          ...agendamento,
          clienteSubstituto: nomeSubstituto,
          observacoes: `${agendamento.observacoes} | Cliente substituído: ${nomeSubstituto}`
        }
      }
      return agendamento
    }))
    setSubstituindoCliente(null)
    setNomeClienteSubstituto('')
  }

  // Remover cliente do agendamento
  const removerClienteAgendamento = (agendamentoId: string) => {
    setAgendamentos(prev => prev.map(agendamento => {
      if (agendamento.id === agendamentoId) {
        return {
          ...agendamento,
          clienteRemovido: true,
          observacoes: `${agendamento.observacoes} | Cliente removido do agendamento`
        }
      }
      return agendamento
    }))
  }

  // Editar valor pago (gorjetas)
  const editarValorPago = (agendamentoId: string, novoValor: number) => {
    setAgendamentos(prev => prev.map(agendamento => {
      if (agendamento.id === agendamentoId) {
        return {
          ...agendamento,
          valorPago: novoValor
        }
      }
      return agendamento
    }))
    setEditandoPagamento(null)
    setNovoValorPago(0)
  }

  // Funções CRUD (mantendo as existentes)
  const adicionarCliente = () => {
    if (!novoCliente.nome || !novoCliente.endereco) return
    
    const cliente: Cliente = {
      ...novoCliente,
      id: Date.now().toString(),
      telefone: formatPhoneUS(novoCliente.telefone)
    }
    
    setClientes([...clientes, cliente])
    setNovoCliente({ nome: '', endereco: '', telefone: '', valorServico: 0, observacoes: '', recorrencia: 'nenhuma' })
    setMostrarFormCliente(false)
    
    // NÃO criar agendamento automático - apenas manual
  }

  const editarCliente = (cliente: Cliente) => {
    setEditandoCliente(cliente)
    setNovoCliente(cliente)
    setMostrarFormCliente(true)
  }

  const salvarEdicaoCliente = () => {
    if (!editandoCliente) return
    
    const clienteAtualizado = {
      ...novoCliente,
      id: editandoCliente.id,
      telefone: formatPhoneUS(novoCliente.telefone)
    }
    
    setClientes(clientes.map(c => 
      c.id === editandoCliente.id ? clienteAtualizado : c
    ))
    setEditandoCliente(null)
    setNovoCliente({ nome: '', endereco: '', telefone: '', valorServico: 0, observacoes: '', recorrencia: 'nenhuma' })
    setMostrarFormCliente(false)
  }

  const removerCliente = (id: string) => {
    setClientes(clientes.filter(c => c.id !== id))
    setAgendamentos(agendamentos.filter(a => a.clienteId !== id))
  }

  const adicionarFuncionario = () => {
    if (!novoFuncionario.nome) return
    
    const funcionario: Funcionario = {
      ...novoFuncionario,
      id: Date.now().toString(),
      telefone: formatPhoneUS(novoFuncionario.telefone)
    }
    
    setFuncionarios([...funcionarios, funcionario])
    setNovoFuncionario({ nome: '', telefone: '', especialidade: '' })
    setMostrarFormFuncionario(false)
  }

  const removerFuncionario = (id: string) => {
    setFuncionarios(funcionarios.filter(f => f.id !== id))
    setAgendamentos(agendamentos.filter(a => a.funcionarioId !== id))
  }

  const adicionarAgendamento = () => {
    if (!novoAgendamento.clienteId || !novoAgendamento.funcionarioId || !novoAgendamento.data) return
    
    const cliente = clientes.find(c => c.id === novoAgendamento.clienteId)
    
    const agendamento: Agendamento = {
      ...novoAgendamento,
      id: Date.now().toString()
    }
    
    // Adicionar agendamento principal
    const novosAgendamentos = [agendamento]
    
    // Se cliente tem recorrência, gerar agendamentos automáticos
    if (cliente && cliente.recorrencia && cliente.recorrencia !== 'nenhuma') {
      const agendamentosRecorrentes = gerarAgendamentosRecorrentes(
        cliente, 
        novoAgendamento.data, 
        novoAgendamento.horario, 
        novoAgendamento.funcionarioId
      )
      novosAgendamentos.push(...agendamentosRecorrentes)
    }
    
    setAgendamentos([...agendamentos, ...novosAgendamentos])
    setNovoAgendamento({ clienteId: '', funcionarioId: '', data: '', horario: '', status: 'agendado', observacoes: '', valorHelper: 0 })
    setMostrarFormAgendamento(false)
    setMostrarHorarios(false)
  }

  const atualizarStatusAgendamento = (id: string, status: Agendamento['status']) => {
    setAgendamentos(agendamentos.map(a => 
      a.id === id ? { ...a, status } : a
    ))
  }

  const removerAgendamento = (id: string) => {
    setAgendamentos(agendamentos.filter(a => a.id !== id))
  }

  // Funções auxiliares
  const getClienteNome = (agendamento: Agendamento) => {
    if (agendamento.clienteSubstituto) {
      return agendamento.clienteSubstituto
    }
    if (agendamento.clienteRemovido) {
      return t.clientRemoved
    }
    const cliente = clientes.find(c => c.id === agendamento.clienteId)
    return cliente ? cliente.nome : 'Cliente não encontrado'
  }

  const getFuncionarioNome = (id: string) => {
    const funcionario = funcionarios.find(f => f.id === id)
    return funcionario ? funcionario.nome : 'Funcionário não encontrado'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'agendado': return 'bg-blue-500'
      case 'em-andamento': return 'bg-yellow-500'
      case 'concluido': return 'bg-green-500'
      case 'cancelado': return 'bg-red-500'
      default: return 'bg-gray-500'
    }
  }

  // Cálculos de dashboard
  const hoje = new Date().toISOString().split('T')[0]
  const inicioSemana = new Date()
  inicioSemana.setDate(inicioSemana.getDate() - inicioSemana.getDay())
  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(fimSemana.getDate() + 6)
  
  const inicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  const fimMes = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0)

  const agendamentosHoje = agendamentos.filter(a => a.data === hoje)
  const agendamentosSemana = agendamentos.filter(a => {
    const dataAgendamento = new Date(a.data)
    return dataAgendamento >= inicioSemana && dataAgendamento <= fimSemana
  })
  const agendamentosMes = agendamentos.filter(a => {
    const dataAgendamento = new Date(a.data)
    return dataAgendamento >= inicioMes && dataAgendamento <= fimMes
  })

  // Cálculos de pagamento para helpers (usando valorPago se disponível)
  const calcularPagamentosSemanais = () => {
    const pagamentos: { [key: string]: { nome: string, servicos: number, total: number } } = {}
    
    const agendamentosConcluidos = agendamentosSemana.filter(a => a.status === 'concluido')
    
    agendamentosConcluidos.forEach(agendamento => {
      const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioId)
      if (funcionario && agendamento.valorHelper) {
        if (!pagamentos[funcionario.id]) {
          pagamentos[funcionario.id] = {
            nome: funcionario.nome,
            servicos: 0,
            total: 0
          }
        }
        pagamentos[funcionario.id].servicos++
        // Usar valorPago se disponível, senão valorHelper
        const valorFinal = agendamento.valorPago || agendamento.valorHelper
        pagamentos[funcionario.id].total += valorFinal
      }
    })
    
    return pagamentos
  }

  // Filtrar dados baseado no tipo de usuário
  const getFilteredAgendamentos = () => {
    if (user?.role === 'admin') {
      return agendamentos
    } else {
      // Helpers só veem seus próprios agendamentos
      const funcionario = funcionarios.find(f => f.nome === user?.nome)
      return funcionario ? agendamentos.filter(a => a.funcionarioId === funcionario.id) : []
    }
  }

  const getFilteredClientes = (agendamentosFiltrados: Agendamento[]) => {
    if (user?.role === 'admin') {
      return clientes
    } else {
      // Helpers só veem clientes dos seus agendamentos
      const clienteIds = agendamentosFiltrados.map(a => a.clienteId)
      return clientes.filter(c => clienteIds.includes(c.id))
    }
  }

  // Tela de login
  if (!user) {
    return (
      <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
        <div className="min-h-screen bg-gradient-to-br from-yellow-400 to-black dark:from-yellow-600 dark:to-gray-900 flex items-center justify-center p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 w-full max-w-md">
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4">
                <img 
                  src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d8ed5f9b-5c9f-43ab-89fc-4c88e07dbfa8.png" 
                  alt="IDO4U Logo" 
                  className="w-full h-full object-contain"
                />
              </div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">IDO4U CRM</h1>
              <p className="text-gray-600 dark:text-gray-300 mt-2">{t.login}</p>
            </div>

            {/* Toggle Dark Mode */}
            <div className="flex justify-center mb-4">
              <button
                onClick={() => setDarkMode(!darkMode)}
                className="flex items-center space-x-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                <span className="text-sm">{darkMode ? t.lightMode : t.darkMode}</span>
              </button>
            </div>

            {/* Seletor de idioma */}
            <div className="flex justify-center mb-6">
              <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
                {(['en', 'pt', 'es'] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                      language === lang
                        ? 'bg-yellow-500 text-white'
                        : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                    }`}
                  >
                    {lang.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.username}
                </label>
                <input
                  type="text"
                  value={loginForm.username}
                  onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder={t.username}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  {t.password}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent pr-12 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    placeholder={t.password}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="rememberMe"
                  checked={loginForm.rememberMe}
                  onChange={(e) => setLoginForm({ ...loginForm, rememberMe: e.target.checked })}
                  className="w-4 h-4 text-yellow-500 border-gray-300 rounded focus:ring-yellow-500"
                />
                <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
                  {t.rememberMe}
                </label>
              </div>

              {loginError && (
                <div className="text-red-600 text-sm text-center bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-3 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
              >
                {t.signIn}
              </button>
            </form>


          </div>
        </div>
      </div>
    )
  }

  const agendamentosFiltrados = getFilteredAgendamentos()
  const clientesFiltrados = getFilteredClientes(agendamentosFiltrados)
  const agendamentosHojeFiltrados = agendamentosFiltrados.filter(a => a.data === hoje)
  const agendamentosSemanaFiltrados = agendamentosFiltrados.filter(a => {
    const dataAgendamento = new Date(a.data)
    return dataAgendamento >= inicioSemana && dataAgendamento <= fimSemana
  })
  const agendamentosMesFiltrados = agendamentosFiltrados.filter(a => {
    const dataAgendamento = new Date(a.data)
    return dataAgendamento >= inicioMes && dataAgendamento <= fimMes
  })

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <header className="bg-black dark:bg-gray-800 text-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10">
                  <img 
                    src="https://k6hrqrxuu8obbfwn.public.blob.vercel-storage.com/temp/d8ed5f9b-5c9f-43ab-89fc-4c88e07dbfa8.png" 
                    alt="IDO4U Logo" 
                    className="w-full h-full object-contain"
                  />
                </div>
                <div>
                  <h1 className="text-xl sm:text-2xl font-bold">IDO4U CRM</h1>
                  <p className="text-gray-300 text-xs sm:text-sm">
                    {user.role === 'admin' ? 'Admin Panel' : `Helper: ${user.nome}`}
                  </p>
                </div>
              </div>
              
              {/* Desktop Header Controls */}
              <div className="hidden md:flex items-center space-x-4">
                {/* Toggle Dark Mode */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center space-x-2 px-3 py-2 bg-gray-700 dark:bg-gray-600 rounded-lg hover:bg-gray-600 dark:hover:bg-gray-500 transition-colors"
                >
                  {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="text-sm">{darkMode ? t.lightMode : t.darkMode}</span>
                </button>

                {/* Seletor de idioma */}
                <div className="flex bg-gray-700 dark:bg-gray-600 rounded-lg p-1">
                  <Globe className="w-4 h-4 text-gray-300 mr-2 self-center" />
                  {(['en', 'pt', 'es'] as const).map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setLanguage(lang)}
                      className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                        language === lang
                          ? 'bg-yellow-500 text-white'
                          : 'text-gray-300 hover:text-white'
                      }`}
                    >
                      {lang.toUpperCase()}
                    </button>
                  ))}
                </div>
                
                <div className="text-right">
                  <p className="text-sm text-gray-300">{t.todayAppointments}</p>
                  <p className="text-xl font-bold text-yellow-500">{agendamentosHojeFiltrados.length}</p>
                </div>
                
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  <span className="text-sm">{t.logout}</span>
                </button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
                >
                  {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-800 border-b dark:border-gray-700 shadow-lg">
            <div className="px-4 py-4 space-y-4">
              {/* Mobile Controls */}
              <div className="flex flex-col space-y-3">
                {/* Dark Mode Toggle */}
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className="flex items-center justify-between p-3 bg-gray-100 dark:bg-gray-700 rounded-lg"
                >
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {darkMode ? t.lightMode : t.darkMode}
                  </span>
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>

                {/* Language Selector */}
                <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">Language</span>
                    <Globe className="w-5 h-5 text-gray-500" />
                  </div>
                  <div className="flex space-x-2">
                    {(['en', 'pt', 'es'] as const).map((lang) => (
                      <button
                        key={lang}
                        onClick={() => setLanguage(lang)}
                        className={`flex-1 py-2 px-3 rounded text-sm font-medium transition-colors ${
                          language === lang
                            ? 'bg-yellow-500 text-white'
                            : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {lang.toUpperCase()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Today's Appointments */}
                <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                  <div className="text-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{t.todayAppointments}</p>
                    <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{agendamentosHojeFiltrados.length}</p>
                  </div>
                </div>

                {/* Logout */}
                <button
                  onClick={handleLogout}
                  className="flex items-center justify-center space-x-2 w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg transition-colors"
                >
                  <LogOut className="w-5 h-5" />
                  <span>{t.logout}</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className="bg-white dark:bg-gray-800 shadow-sm border-b dark:border-gray-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {[
                { id: 'dashboard', label: t.dashboard, icon: Calendar },
                ...(user.role === 'admin' ? [
                  { id: 'clientes', label: t.clients, icon: Users },
                  { id: 'funcionarios', label: t.employees, icon: User },
                ] : []),
                { id: 'agendamentos', label: t.appointments, icon: Clock },
                ...(user.role === 'admin' ? [
                  { id: 'pagamentos', label: t.helperPayments, icon: DollarSign }
                ] : [])
              ].map(({ id, label, icon: Icon }) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === id
                      ? 'border-yellow-500 text-yellow-600 dark:text-yellow-400'
                      : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </button>
              ))}
            </div>

            {/* Mobile Navigation */}
            <div className="md:hidden">
              <div className="flex overflow-x-auto py-2 space-x-4">
                {[
                  { id: 'dashboard', label: t.dashboard, icon: Calendar },
                  ...(user.role === 'admin' ? [
                    { id: 'clientes', label: t.clients, icon: Users },
                    { id: 'funcionarios', label: t.employees, icon: User },
                  ] : []),
                  { id: 'agendamentos', label: t.appointments, icon: Clock },
                  ...(user.role === 'admin' ? [
                    { id: 'pagamentos', label: t.helperPayments, icon: DollarSign }
                  ] : [])
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => {
                      setActiveTab(id)
                      setMobileMenuOpen(false)
                    }}
                    className={`flex flex-col items-center space-y-1 py-2 px-3 rounded-lg font-medium text-xs transition-colors whitespace-nowrap ${
                      activeTab === id
                        ? 'bg-yellow-500 text-white'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{label}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* Content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          {/* Dashboard */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Users className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalClients}</p>
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{clientesFiltrados.length}</p>
                    </div>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <User className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.totalEmployees}</p>
                        <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{funcionarios.length}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
                    </div>
                    <div className="ml-4">
                      <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.todayAppointments}</p>
                      <p className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white">{agendamentosHojeFiltrados.length}</p>
                    </div>
                  </div>
                </div>

                {user.role === 'admin' && (
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <DollarSign className="h-6 sm:h-8 w-6 sm:w-8 text-yellow-500" />
                      </div>
                      <div className="ml-4">
                        <p className="text-xs sm:text-sm font-medium text-gray-500 dark:text-gray-400">{t.estimatedRevenue}</p>
                        <p className="text-lg sm:text-2xl font-semibold text-gray-900 dark:text-white">
                          {formatCurrency(agendamentosHojeFiltrados.reduce((total, agendamento) => {
                            const cliente = clientes.find(c => c.id === agendamento.clienteId)
                            return total + (cliente?.valorServico || 0)
                          }, 0))}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Métricas semanais e mensais */}
              {user.role === 'admin' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{t.weeklyRevenue}</h3>
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-green-600">
                      {formatCurrency(agendamentosSemanaFiltrados.reduce((total, agendamento) => {
                        const cliente = clientes.find(c => c.id === agendamento.clienteId)
                        return total + (cliente?.valorServico || 0)
                      }, 0))}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {agendamentosSemanaFiltrados.length} {t.appointments.toLowerCase()}
                    </p>
                  </div>

                  <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{t.monthlyRevenue}</h3>
                      <CalendarDays className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">
                      {formatCurrency(agendamentosMesFiltrados.reduce((total, agendamento) => {
                        const cliente = clientes.find(c => c.id === agendamento.clienteId)
                        return total + (cliente?.valorServico || 0)
                      }, 0))}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
                      {agendamentosMesFiltrados.length} {t.appointments.toLowerCase()}
                    </p>
                  </div>
                </div>
              )}

              {/* Agendamentos de Hoje */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{t.todaySchedule}</h3>
                </div>
                <div className="p-4 sm:p-6">
                  {agendamentosHojeFiltrados.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">{t.noAppointments}</p>
                  ) : (
                    <div className="space-y-4">
                      {agendamentosHojeFiltrados.map((agendamento) => {
                        const cliente = clientes.find(c => c.id === agendamento.clienteId)
                        const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioId)
                        return (
                          <div key={agendamento.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg space-y-2 sm:space-y-0">
                            <div className="flex items-center space-x-4">
                              <div className={`w-3 h-3 rounded-full ${getStatusColor(agendamento.status)}`}></div>
                              <div className="flex-1">
                                <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">
                                  {getClienteNome(agendamento)}
                                  {agendamento.clienteSubstituto && (
                                    <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                      {t.clientSubstituted}
                                    </span>
                                  )}
                                  {agendamento.clienteRemovido && (
                                    <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                                      {t.clientRemoved}
                                    </span>
                                  )}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{cliente?.endereco}</p>
                                {user.role === 'helper' && agendamento.observacoes && (
                                  <p className="text-xs sm:text-sm text-blue-600 dark:text-blue-400">{agendamento.observacoes}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-left sm:text-right">
                              <p className="font-medium text-gray-900 dark:text-white text-sm sm:text-base">{funcionario?.nome}</p>
                              <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{agendamento.horario}</p>
                              {user.role === 'admin' && (
                                <p className="text-xs sm:text-sm text-green-600">{formatCurrency(cliente?.valorServico || 0)}</p>
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Clientes - Apenas para Admin */}
          {activeTab === 'clientes' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.clients}</h2>
                <button
                  onClick={() => setMostrarFormCliente(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{t.newClient}</span>
                </button>
              </div>

              {/* Formulário de Cliente */}
              {mostrarFormCliente && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">
                    {editandoCliente ? t.editClient : t.newClient}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.clientName}</label>
                      <input
                        type="text"
                        value={novoCliente.nome}
                        onChange={(e) => setNovoCliente({ ...novoCliente, nome: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.clientName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.phone}</label>
                      <input
                        type="text"
                        value={novoCliente.telefone}
                        onChange={(e) => setNovoCliente({ ...novoCliente, telefone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.address}</label>
                      <input
                        type="text"
                        value={novoCliente.endereco}
                        onChange={(e) => setNovoCliente({ ...novoCliente, endereco: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.address}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.serviceValue}</label>
                      <input
                        type="number"
                        value={novoCliente.valorServico}
                        onChange={(e) => setNovoCliente({ ...novoCliente, valorServico: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.recurrence}</label>
                      <select
                        value={novoCliente.recorrencia}
                        onChange={(e) => setNovoCliente({ ...novoCliente, recorrencia: e.target.value as Cliente['recorrencia'] })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="nenhuma">{t.none}</option>
                        <option value="semanal">{t.weekly}</option>
                        <option value="quinzenal">{t.biweekly}</option>
                        <option value="mensal">{t.monthly}</option>
                        <option value="seis-semanas">{t.sixWeeks}</option>
                      </select>
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.observations}</label>
                      <input
                        type="text"
                        value={novoCliente.observacoes}
                        onChange={(e) => setNovoCliente({ ...novoCliente, observacoes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.observations}
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setMostrarFormCliente(false)
                        setEditandoCliente(null)
                        setNovoCliente({ nome: '', endereco: '', telefone: '', valorServico: 0, observacoes: '', recorrencia: 'nenhuma' })
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={editandoCliente ? salvarEdicaoCliente : adicionarCliente}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      {editandoCliente ? t.save : t.add}
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Clientes */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.client}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.address}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.phone}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.value}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.recurrence}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {clientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{cliente.nome}</div>
                            {cliente.observacoes && (
                              <div className="text-sm text-gray-500 dark:text-gray-400">{cliente.observacoes}</div>
                            )}
                          </td>
                          <td className="px-4 sm:px-6 py-4">
                            <div className="text-sm text-gray-900 dark:text-white flex items-center">
                              <MapPin className="w-4 h-4 mr-1 text-gray-400" />
                              {cliente.endereco}
                            </div>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                            {formatPhoneUS(cliente.telefone)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                            {formatCurrency(cliente.valorServico)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              cliente.recorrencia === 'nenhuma' ? 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300' :
                              cliente.recorrencia === 'semanal' ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200' :
                              cliente.recorrencia === 'quinzenal' ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200' :
                              cliente.recorrencia === 'seis-semanas' ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-200' :
                              'bg-purple-100 dark:bg-purple-900 text-purple-800 dark:text-purple-200'
                            }`}>
                              {cliente.recorrencia === 'nenhuma' ? t.none :
                               cliente.recorrencia === 'semanal' ? t.weekly :
                               cliente.recorrencia === 'quinzenal' ? t.biweekly :
                               cliente.recorrencia === 'seis-semanas' ? t.sixWeeks :
                               t.monthly}
                              {cliente.recorrencia !== 'nenhuma' && <RotateCcw className="w-3 h-3 ml-1" />}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => editarCliente(cliente)}
                                className="text-yellow-600 hover:text-yellow-900 dark:text-yellow-400 dark:hover:text-yellow-300"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => removerCliente(cliente.id)}
                                className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {clientes.length === 0 && (
                    <div className="text-center py-12">
                      <Users className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No clients registered</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by adding a new client.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Funcionários - Apenas para Admin */}
          {activeTab === 'funcionarios' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.employees}</h2>
                <button
                  onClick={() => setMostrarFormFuncionario(true)}
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                >
                  <Plus className="w-5 h-5" />
                  <span>{t.newEmployee}</span>
                </button>
              </div>

              {/* Formulário de Funcionário */}
              {mostrarFormFuncionario && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">{t.newEmployee}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.employeeName}</label>
                      <input
                        type="text"
                        value={novoFuncionario.nome}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, nome: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.employeeName}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.phone}</label>
                      <input
                        type="text"
                        value={novoFuncionario.telefone}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, telefone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.specialty}</label>
                      <select
                        value={novoFuncionario.especialidade}
                        onChange={(e) => setNovoFuncionario({ ...novoFuncionario, especialidade: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select...</option>
                        <option value="Limpeza Geral">{t.generalCleaning}</option>
                        <option value="Limpeza Pesada">{t.heavyCleaning}</option>
                        <option value="Organização">{t.organization}</option>
                        <option value="Limpeza Pós-Obra">{t.postConstruction}</option>
                      </select>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setMostrarFormFuncionario(false)
                        setNovoFuncionario({ nome: '', telefone: '', especialidade: '' })
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={adicionarFuncionario}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      {t.add}
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Funcionários */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {funcionarios.map((funcionario) => (
                  <div key={funcionario.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 sm:w-12 h-10 sm:h-12 bg-yellow-500 rounded-full flex items-center justify-center">
                          <User className="w-5 sm:w-6 h-5 sm:h-6 text-white" />
                        </div>
                        <div>
                          <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">{funcionario.nome}</h3>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{funcionario.especialidade}</p>
                        </div>
                      </div>
                      <button
                        onClick={() => removerFuncionario(funcionario.id)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-300">📞 {formatPhoneUS(funcionario.telefone)}</p>
                      <div className="pt-2">
                        <p className="text-xs text-gray-500 dark:text-gray-400">{t.todayAppointments}:</p>
                        <p className="text-lg font-semibold text-yellow-500">
                          {agendamentosHojeFiltrados.filter(a => a.funcionarioId === funcionario.id).length}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
                {funcionarios.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <User className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No employees registered</h3>
                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by adding a new employee.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Agendamentos */}
          {activeTab === 'agendamentos' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.appointments}</h2>
                {user.role === 'admin' && (
                  <button
                    onClick={() => setMostrarFormAgendamento(true)}
                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors flex items-center justify-center space-x-2"
                  >
                    <Plus className="w-5 h-5" />
                    <span>{t.newAppointment}</span>
                  </button>
                )}
              </div>

              {/* Formulário de Agendamento - Apenas Admin */}
              {mostrarFormAgendamento && user.role === 'admin' && (
                <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">{t.newAppointment}</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.client}</label>
                      <select
                        value={novoAgendamento.clienteId}
                        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, clienteId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select a client</option>
                        {clientes.map((cliente) => (
                          <option key={cliente.id} value={cliente.id}>{cliente.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.employee}</label>
                      <select
                        value={novoAgendamento.funcionarioId}
                        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, funcionarioId: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        <option value="">Select an employee</option>
                        {funcionarios.map((funcionario) => (
                          <option key={funcionario.id} value={funcionario.id}>{funcionario.nome}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.date}</label>
                      <input
                        type="date"
                        value={novoAgendamento.data}
                        onChange={(e) => {
                          setNovoAgendamento({ ...novoAgendamento, data: e.target.value })
                          if (e.target.value && novoAgendamento.funcionarioId) {
                            buscarHorariosDisponiveis(e.target.value, novoAgendamento.funcionarioId)
                          }
                        }}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.time}</label>
                      <div className="flex space-x-2">
                        <input
                          type="time"
                          value={novoAgendamento.horario}
                          onChange={(e) => setNovoAgendamento({ ...novoAgendamento, horario: e.target.value })}
                          className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                        <button
                          type="button"
                          onClick={() => novoAgendamento.data && buscarHorariosDisponiveis(novoAgendamento.data, novoAgendamento.funcionarioId)}
                          className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                          title={t.findAvailableTimes}
                        >
                          <Search className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.helperPayment}</label>
                      <input
                        type="number"
                        value={novoAgendamento.valorHelper}
                        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, valorHelper: parseFloat(e.target.value) || 0 })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="0.00"
                        step="0.01"
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{t.observations}</label>
                      <input
                        type="text"
                        value={novoAgendamento.observacoes}
                        onChange={(e) => setNovoAgendamento({ ...novoAgendamento, observacoes: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder={t.observations}
                      />
                    </div>
                  </div>

                  {/* Horários disponíveis */}
                  {mostrarHorarios && horariosDisponiveis.length > 0 && (
                    <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <h4 className="text-sm font-medium text-blue-900 dark:text-blue-200 mb-2">{t.availableTimes}:</h4>
                      <div className="flex flex-wrap gap-2">
                        {horariosDisponiveis.map((horario) => (
                          <button
                            key={horario}
                            onClick={() => {
                              setNovoAgendamento({ ...novoAgendamento, horario })
                              setMostrarHorarios(false)
                            }}
                            className="px-3 py-1 bg-blue-500 text-white rounded text-sm hover:bg-blue-600 transition-colors"
                          >
                            {horario}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-3 mt-6">
                    <button
                      onClick={() => {
                        setMostrarFormAgendamento(false)
                        setNovoAgendamento({ clienteId: '', funcionarioId: '', data: '', horario: '', status: 'agendado', observacoes: '', valorHelper: 0 })
                        setMostrarHorarios(false)
                      }}
                      className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-gray-200 dark:bg-gray-600 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors"
                    >
                      {t.cancel}
                    </button>
                    <button
                      onClick={adicionarAgendamento}
                      className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                    >
                      {t.add}
                    </button>
                  </div>
                </div>
              )}

              {/* Lista de Agendamentos */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.client}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.employee}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.date}/{t.time}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.status}</th>
                        {user.role === 'admin' && (
                          <>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.value}</th>
                            <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.paidAmount}</th>
                          </>
                        )}
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {agendamentosFiltrados.map((agendamento) => {
                        const cliente = clientes.find(c => c.id === agendamento.clienteId)
                        const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioId)
                        return (
                          <tr key={agendamento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {getClienteNome(agendamento)}
                                {agendamento.clienteSubstituto && (
                                  <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">
                                    {t.clientSubstituted}
                                  </span>
                                )}
                                {agendamento.clienteRemovido && (
                                  <span className="ml-2 text-xs bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 px-2 py-1 rounded">
                                    {t.clientRemoved}
                                  </span>
                                )}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{cliente?.endereco}</div>
                              {agendamento.observacoes && (
                                <div className="text-sm text-blue-600 dark:text-blue-400">{agendamento.observacoes}</div>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">{funcionario?.nome || 'Funcionário removido'}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{funcionario?.especialidade}</div>
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900 dark:text-white">{new Date(agendamento.data).toLocaleDateString()}</div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">{agendamento.horario}</div>
                              {agendamento.recorrente && (
                                <div className="text-xs text-purple-600 dark:text-purple-400 flex items-center">
                                  <RotateCcw className="w-3 h-3 mr-1" />
                                  Recorrente
                                </div>
                              )}
                            </td>
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white ${getStatusColor(agendamento.status)}`}>
                                {agendamento.status === 'agendado' ? t.scheduled :
                                 agendamento.status === 'em-andamento' ? t.inProgress :
                                 agendamento.status === 'concluido' ? t.completed :
                                 t.cancelled}
                              </span>
                            </td>
                            {user.role === 'admin' && (
                              <>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                  {formatCurrency(cliente?.valorServico || 0)}
                                </td>
                                <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                  {editandoPagamento === agendamento.id ? (
                                    <div className="flex items-center space-x-2">
                                      <input
                                        type="number"
                                        value={novoValorPago}
                                        onChange={(e) => setNovoValorPago(parseFloat(e.target.value) || 0)}
                                        className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        step="0.01"
                                      />
                                      <button
                                        onClick={() => editarValorPago(agendamento.id, novoValorPago)}
                                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                      >
                                        <CheckCircle className="w-4 h-4" />
                                      </button>
                                    </div>
                                  ) : (
                                    <div className="flex items-center space-x-2">
                                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                        {formatCurrency(agendamento.valorPago || agendamento.valorHelper || 0)}
                                      </span>
                                      <button
                                        onClick={() => {
                                          setEditandoPagamento(agendamento.id)
                                          setNovoValorPago(agendamento.valorPago || agendamento.valorHelper || 0)
                                        }}
                                        className="text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                                        title={t.editPayment}
                                      >
                                        <Edit className="w-3 h-3" />
                                      </button>
                                    </div>
                                  )}
                                </td>
                              </>
                            )}
                            <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <div className="flex space-x-2">
                                {user.role === 'admin' && (
                                  <>
                                    {/* Substituir cliente */}
                                    {substituindoCliente === agendamento.id ? (
                                      <div className="flex items-center space-x-2">
                                        <input
                                          type="text"
                                          value={nomeClienteSubstituto}
                                          onChange={(e) => setNomeClienteSubstituto(e.target.value)}
                                          className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                          placeholder="Nome"
                                        />
                                        <button
                                          onClick={() => substituirCliente(agendamento.id, nomeClienteSubstituto)}
                                          className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300"
                                        >
                                          <CheckCircle className="w-4 h-4" />
                                        </button>
                                      </div>
                                    ) : (
                                      <button
                                        onClick={() => {
                                          setSubstituindoCliente(agendamento.id)
                                          setNomeClienteSubstituto('')
                                        }}
                                        className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                                        title={t.substituteClient}
                                      >
                                        <UserPlus className="w-4 h-4" />
                                      </button>
                                    )}
                                    
                                    {/* Remover cliente */}
                                    <button
                                      onClick={() => removerClienteAgendamento(agendamento.id)}
                                      className="text-orange-600 hover:text-orange-900 dark:text-orange-400 dark:hover:text-orange-300"
                                      title={t.removeClient}
                                    >
                                      <UserX className="w-4 h-4" />
                                    </button>
                                    
                                    {/* Remover agendamento */}
                                    <button
                                      onClick={() => removerAgendamento(agendamento.id)}
                                      className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300"
                                      title={t.delete}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                  {agendamentosFiltrados.length === 0 && (
                    <div className="text-center py-12">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">{t.noAppointments}</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Start by creating a new appointment.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Pagamentos dos Helpers - Apenas Admin */}
          {activeTab === 'pagamentos' && user.role === 'admin' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{t.helperPayments}</h2>
              </div>

              {/* Resumo de pagamentos semanais */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 sm:p-6">
                <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white mb-4">{t.weeklyPayments}</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {Object.entries(calcularPagamentosSemanais()).map(([funcionarioId, dados]) => (
                    <div key={funcionarioId} className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-8 sm:w-10 h-8 sm:h-10 bg-yellow-500 rounded-full flex items-center justify-center">
                          <User className="w-4 sm:w-5 h-4 sm:h-5 text-white" />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900 dark:text-white">{dados.nome}</h4>
                          <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{dados.servicos} {t.completedServices.toLowerCase()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">{t.totalPayment}</p>
                        <p className="text-xl sm:text-2xl font-bold text-green-600">{formatCurrency(dados.total)}</p>
                      </div>
                    </div>
                  ))}
                  {Object.keys(calcularPagamentosSemanais()).length === 0 && (
                    <div className="col-span-full text-center py-8">
                      <DollarSign className="mx-auto h-12 w-12 text-gray-400" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No payments this week</h3>
                      <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Payments will appear when services are completed.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Histórico detalhado */}
              <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                <div className="px-4 sm:px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h3 className="text-base sm:text-lg font-medium text-gray-900 dark:text-white">Detailed Payment History</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-700">
                      <tr>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.employee}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.client}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.date}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">{t.status}</th>
                        <th className="px-4 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Payment</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                      {agendamentos
                        .filter(a => a.status === 'concluido' && a.valorHelper && a.valorHelper > 0)
                        .sort((a, b) => new Date(b.data).getTime() - new Date(a.data).getTime())
                        .map((agendamento) => {
                          const cliente = clientes.find(c => c.id === agendamento.clienteId)
                          const funcionario = funcionarios.find(f => f.id === agendamento.funcionarioId)
                          return (
                            <tr key={agendamento.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">{funcionario?.nome}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{funcionario?.especialidade}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-white">
                                  {getClienteNome(agendamento)}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{cliente?.endereco}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900 dark:text-white">{new Date(agendamento.data).toLocaleDateString()}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{agendamento.horario}</div>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium text-white bg-green-500">
                                  {t.completed}
                                </span>
                              </td>
                              <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                {formatCurrency(agendamento.valorPago || agendamento.valorHelper || 0)}
                                {agendamento.valorPago && agendamento.valorPago !== agendamento.valorHelper && (
                                  <span className="text-xs text-blue-600 dark:text-blue-400 block">
                                    (Original: {formatCurrency(agendamento.valorHelper || 0)})
                                  </span>
                                )}
                              </td>
                            </tr>
                          )
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}