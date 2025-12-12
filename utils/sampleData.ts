import { Vehicle, VehicleMaintenanceData, Maintenance } from '@/types/maintenance'
import { generateVehicleId } from './vehicleId'

export function initializeSampleData() {
  // Garantir que está no cliente
  if (typeof window === 'undefined') return

  try {
    // Verificar se já existem veículos
    const existingVehicles = localStorage.getItem('vehicles')
    if (existingVehicles && JSON.parse(existingVehicles).length > 0) {
      return // Não inicializar se já houver dados
    }
  } catch (error) {
    console.error('Erro ao verificar veículos existentes:', error)
    return
  }

  const now = new Date()
  const vehicleId = generateVehicleId('ABC-1234', 'Toyota', 'Corolla', 2020)

  const sampleVehicle: Vehicle = {
    id: vehicleId,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    plate: 'ABC-1234',
    color: 'Branco',
    chassis: '9BW12345678901234',
    currentMileage: 85000,
    fuelType: 'flex',
    createdAt: new Date(2020, 0, 1).toISOString(),
    lastUpdated: now.toISOString(),
  }

  const sampleMaintenances: Maintenance[] = [
    {
      id: '1',
      date: new Date(2024, 0, 15).toISOString().split('T')[0],
      mileage: 80000,
      service: {
        id: 's1',
        name: 'Troca de óleo e filtro',
        description: 'Troca completa de óleo do motor e filtro de óleo',
        category: 'preventiva',
      },
      parts: [
        {
          id: 'p1',
          name: 'Óleo Motor 5W30',
          code: 'OIL-5W30-001',
          brand: 'Mobil',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 6, 15).toISOString().split('T')[0],
        },
        {
          id: 'p2',
          name: 'Filtro de Óleo',
          code: 'FIL-OIL-001',
          brand: 'Fram',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 6, 15).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'João Silva',
        workshop: 'Auto Center Silva',
        location: 'São Paulo, SP',
        contact: '(11) 98765-4321',
      },
      costs: {
        total: 350.00,
        labor: 80.00,
        parts: 250.00,
        other: 20.00,
      },
      description: 'Troca de óleo realizada conforme recomendação do fabricante. Motor funcionando perfeitamente.',
      documents: [],
      nextMaintenance: {
        mileage: 90000,
        type: 'Troca de óleo',
      },
    },
    {
      id: '2',
      date: new Date(2024, 1, 20).toISOString().split('T')[0],
      mileage: 82000,
      service: {
        id: 's2',
        name: 'Troca de pastilhas de freio dianteiras',
        description: 'Substituição das pastilhas de freio dianteiras e verificação do sistema',
        category: 'corretiva',
      },
      parts: [
        {
          id: 'p3',
          name: 'Pastilha de Freio Dianteira',
          code: 'PAST-FR-001',
          brand: 'Bosch',
          warrantyMonths: 12,
          warrantyKm: 20000,
          warrantyExpires: new Date(2025, 1, 20).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'Carlos Mendes',
        workshop: 'Mecânica Mendes',
        location: 'São Paulo, SP',
        contact: '(11) 91234-5678',
      },
      costs: {
        total: 450.00,
        labor: 150.00,
        parts: 280.00,
        other: 20.00,
      },
      description: 'Pastilhas estavam desgastadas. Sistema de freios verificado e funcionando normalmente.',
      documents: [],
      nextMaintenance: {
        mileage: 102000,
        type: 'Verificação de freios',
      },
    },
    {
      id: '3',
      date: new Date(2024, 2, 10).toISOString().split('T')[0],
      mileage: 83000,
      service: {
        id: 's3',
        name: 'Revisão geral',
        description: 'Revisão completa do veículo incluindo todos os sistemas',
        category: 'revisão',
      },
      parts: [
        {
          id: 'p4',
          name: 'Filtro de Ar',
          code: 'FIL-AIR-001',
          brand: 'Mann',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 8, 10).toISOString().split('T')[0],
        },
        {
          id: 'p5',
          name: 'Filtro de Combustível',
          code: 'FIL-FUEL-001',
          brand: 'Mann',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 8, 10).toISOString().split('T')[0],
        },
        {
          id: 'p6',
          name: 'Velas de Ignição',
          code: 'VEL-IGN-001',
          brand: 'NGK',
          warrantyMonths: 12,
          warrantyKm: 30000,
          warrantyExpires: new Date(2025, 2, 10).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'Maria Santos',
        workshop: 'Oficina Premium',
        location: 'São Paulo, SP',
        contact: '(11) 99876-5432',
      },
      costs: {
        total: 850.00,
        labor: 300.00,
        parts: 520.00,
        other: 30.00,
      },
      description: 'Revisão completa realizada. Todos os sistemas verificados e funcionando corretamente.',
      documents: [],
      nextMaintenance: {
        mileage: 93000,
        date: new Date(2024, 8, 10).toISOString().split('T')[0],
        type: 'Revisão geral',
      },
    },
    {
      id: '4',
      date: new Date(2024, 3, 5).toISOString().split('T')[0],
      mileage: 84000,
      service: {
        id: 's4',
        name: 'Troca de pneus',
        description: 'Substituição dos 4 pneus por novos',
        category: 'preventiva',
      },
      parts: [
        {
          id: 'p7',
          name: 'Pneu 205/55 R16',
          code: 'PNEU-205-55-16',
          brand: 'Michelin',
          warrantyMonths: 60,
          warrantyKm: 80000,
          warrantyExpires: new Date(2029, 3, 5).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'Roberto Alves',
        workshop: 'Pneus & Rodas',
        location: 'São Paulo, SP',
        contact: '(11) 92345-6789',
      },
      costs: {
        total: 2400.00,
        labor: 200.00,
        parts: 2200.00,
      },
      description: 'Troca dos 4 pneus. Alinhamento e balanceamento incluídos.',
      documents: [],
      nextMaintenance: {
        mileage: 164000,
        type: 'Verificação de pneus',
      },
    },
    {
      id: '5',
      date: new Date(2024, 4, 12).toISOString().split('T')[0],
      mileage: 85000,
      service: {
        id: 's5',
        name: 'Troca de bateria',
        description: 'Substituição da bateria do veículo',
        category: 'corretiva',
      },
      parts: [
        {
          id: 'p8',
          name: 'Bateria 60Ah',
          code: 'BAT-60AH-001',
          brand: 'Moura',
          warrantyMonths: 18,
          warrantyKm: undefined,
          warrantyExpires: new Date(2025, 10, 12).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'João Silva',
        workshop: 'Auto Center Silva',
        location: 'São Paulo, SP',
        contact: '(11) 98765-4321',
      },
      costs: {
        total: 480.00,
        labor: 50.00,
        parts: 430.00,
      },
      description: 'Bateria apresentou falha. Substituída por nova com garantia de 18 meses.',
      documents: [],
      nextMaintenance: {
        date: new Date(2025, 10, 12).toISOString().split('T')[0],
        type: 'Verificação de bateria',
      },
    },
    {
      id: '6',
      date: new Date(2024, 5, 18).toISOString().split('T')[0],
      mileage: 86000,
      service: {
        id: 's6',
        name: 'Troca de amortecedores dianteiros',
        description: 'Substituição dos amortecedores dianteiros',
        category: 'corretiva',
      },
      parts: [
        {
          id: 'p9',
          name: 'Amortecedor Dianteiro',
          code: 'AMORT-FR-001',
          brand: 'Monroe',
          warrantyMonths: 12,
          warrantyKm: 20000,
          warrantyExpires: new Date(2025, 5, 18).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'Carlos Mendes',
        workshop: 'Mecânica Mendes',
        location: 'São Paulo, SP',
        contact: '(11) 91234-5678',
      },
      costs: {
        total: 1200.00,
        labor: 300.00,
        parts: 900.00,
      },
      description: 'Amortecedores apresentavam vazamento. Substituídos por novos.',
      documents: [],
      nextMaintenance: {
        mileage: 106000,
        type: 'Verificação de suspensão',
      },
    },
    {
      id: '7',
      date: new Date(2024, 6, 25).toISOString().split('T')[0],
      mileage: 87000,
      service: {
        id: 's7',
        name: 'Troca de óleo e filtros',
        description: 'Troca de óleo, filtro de óleo e filtro de ar',
        category: 'preventiva',
      },
      parts: [
        {
          id: 'p10',
          name: 'Óleo Motor 5W30',
          code: 'OIL-5W30-001',
          brand: 'Mobil',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 12, 25).toISOString().split('T')[0],
        },
        {
          id: 'p11',
          name: 'Filtro de Óleo',
          code: 'FIL-OIL-001',
          brand: 'Fram',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 12, 25).toISOString().split('T')[0],
        },
        {
          id: 'p12',
          name: 'Filtro de Ar',
          code: 'FIL-AIR-001',
          brand: 'Mann',
          warrantyMonths: 6,
          warrantyKm: 10000,
          warrantyExpires: new Date(2024, 12, 25).toISOString().split('T')[0],
        },
      ],
      mechanic: {
        name: 'Maria Santos',
        workshop: 'Oficina Premium',
        location: 'São Paulo, SP',
        contact: '(11) 99876-5432',
      },
      costs: {
        total: 420.00,
        labor: 100.00,
        parts: 300.00,
        other: 20.00,
      },
      description: 'Manutenção preventiva realizada. Próxima troca de óleo em 10.000 km ou 6 meses.',
      documents: [],
      nextMaintenance: {
        mileage: 97000,
        date: new Date(2024, 12, 25).toISOString().split('T')[0],
        type: 'Troca de óleo',
      },
    },
    {
      id: '8',
      date: new Date(2024, 7, 10).toISOString().split('T')[0],
      mileage: 88000,
      service: {
        id: 's8',
        name: 'Inspeção de segurança',
        description: 'Inspeção completa de segurança do veículo',
        category: 'inspeção',
      },
      parts: [],
      mechanic: {
        name: 'João Silva',
        workshop: 'Auto Center Silva',
        location: 'São Paulo, SP',
        contact: '(11) 98765-4321',
      },
      costs: {
        total: 150.00,
        labor: 150.00,
      },
      description: 'Inspeção realizada. Todos os sistemas de segurança funcionando corretamente.',
      documents: [],
      nextMaintenance: {
        mileage: 98000,
        type: 'Inspeção de segurança',
      },
    },
  ]

  const vehicleData: VehicleMaintenanceData = {
    vehicle: sampleVehicle,
    maintenances: sampleMaintenances,
    createdAt: sampleVehicle.createdAt,
    lastUpdated: now.toISOString(),
    version: '1.0',
  }

  try {
    // Salvar veículo
    const vehicles = [sampleVehicle]
    localStorage.setItem('vehicles', JSON.stringify(vehicles))

    // Salvar dados do veículo
    localStorage.setItem(`vehicle-data-${vehicleId}`, JSON.stringify(vehicleData))
    localStorage.setItem(`vehicle-${vehicleId}`, JSON.stringify(vehicleData))

    return vehicleId
  } catch (error) {
    console.error('Erro ao inicializar dados de exemplo:', error)
    return null
  }
}

