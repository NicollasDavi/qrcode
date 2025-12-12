'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Vehicle, VehicleMaintenanceData, Maintenance } from '@/types/maintenance'
import Timeline from '@/components/Timeline'

export default function HistoryPage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [filteredMaintenances, setFilteredMaintenances] = useState<Maintenance[]>([])
  const [filters, setFilters] = useState({
    serviceType: '',
    dateFrom: '',
    dateTo: '',
    workshop: '',
    minCost: '',
    maxCost: '',
  })

  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles')
    if (savedVehicles) {
      const vehicles: Vehicle[] = JSON.parse(savedVehicles)
      const foundVehicle = vehicles.find(v => v.id === vehicleId)
      if (foundVehicle) {
        setVehicle(foundVehicle)
      }
    }

    const savedData = localStorage.getItem(`vehicle-data-${vehicleId}`)
    if (savedData) {
      try {
        const data: VehicleMaintenanceData = JSON.parse(savedData)
        setMaintenances(data.maintenances || [])
        setFilteredMaintenances(data.maintenances || [])
      } catch (e) {
        console.error('Erro ao carregar manutenções:', e)
      }
    }
  }, [vehicleId])

  useEffect(() => {
    let filtered = [...maintenances]

    if (filters.serviceType) {
      filtered = filtered.filter(m => m.service.category === filters.serviceType)
    }

    if (filters.dateFrom) {
      filtered = filtered.filter(m => new Date(m.date) >= new Date(filters.dateFrom))
    }

    if (filters.dateTo) {
      filtered = filtered.filter(m => new Date(m.date) <= new Date(filters.dateTo))
    }

    if (filters.workshop) {
      filtered = filtered.filter(m =>
        m.mechanic.name.toLowerCase().includes(filters.workshop.toLowerCase()) ||
        m.mechanic.workshop?.toLowerCase().includes(filters.workshop.toLowerCase())
      )
    }

    if (filters.minCost) {
      filtered = filtered.filter(m => m.costs.total >= Number(filters.minCost))
    }

    if (filters.maxCost) {
      filtered = filtered.filter(m => m.costs.total <= Number(filters.maxCost))
    }

    setFilteredMaintenances(filtered)
  }, [filters, maintenances])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/vehicle/${vehicleId}`)}
            className="text-[#1B3A4B] hover:underline mb-4"
          >
            ← Voltar para Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Histórico de Manutenções
          </h1>
          <p className="text-gray-600">
            {vehicle.brand} {vehicle.model} {vehicle.year} • {vehicle.plate}
          </p>
        </div>

        {/* Filtros */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Filtros</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Tipo de Serviço
              </label>
              <select
                value={filters.serviceType}
                onChange={(e) => setFilters({ ...filters, serviceType: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Todos</option>
                <option value="preventiva">Preventiva</option>
                <option value="corretiva">Corretiva</option>
                <option value="revisão">Revisão</option>
                <option value="inspeção">Inspeção</option>
                <option value="outro">Outro</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Data Inicial
              </label>
              <input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters({ ...filters, dateFrom: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Data Final
              </label>
              <input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters({ ...filters, dateTo: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Oficina
              </label>
              <input
                type="text"
                value={filters.workshop}
                onChange={(e) => setFilters({ ...filters, workshop: e.target.value })}
                placeholder="Nome da oficina"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custo Mínimo (R$)
              </label>
              <input
                type="number"
                value={filters.minCost}
                onChange={(e) => setFilters({ ...filters, minCost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                Custo Máximo (R$)
              </label>
              <input
                type="number"
                value={filters.maxCost}
                onChange={(e) => setFilters({ ...filters, maxCost: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={() => setFilters({
                serviceType: '',
                dateFrom: '',
                dateTo: '',
                workshop: '',
                minCost: '',
                maxCost: '',
              })}
              className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900"
            >
              Limpar Filtros
            </button>
          </div>
        </div>

        {/* Resumo */}
        <div className="bg-white rounded-lg border border-gray-200 p-4 mb-6 shadow-sm">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-xs text-gray-500">Total de Manutenções</p>
              <p className="text-lg font-semibold text-gray-900">{filteredMaintenances.length}</p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Custo Total</p>
              <p className="text-lg font-semibold text-gray-900">
                {formatCurrency(filteredMaintenances.reduce((sum, m) => sum + m.costs.total, 0))}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Custo Médio</p>
              <p className="text-lg font-semibold text-gray-900">
                {filteredMaintenances.length > 0
                  ? formatCurrency(filteredMaintenances.reduce((sum, m) => sum + m.costs.total, 0) / filteredMaintenances.length)
                  : formatCurrency(0)}
              </p>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          {filteredMaintenances.length > 0 ? (
            <Timeline maintenances={filteredMaintenances} />
          ) : (
            <div className="text-center py-12 text-gray-500">
              <p>Nenhuma manutenção encontrada com os filtros aplicados.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

