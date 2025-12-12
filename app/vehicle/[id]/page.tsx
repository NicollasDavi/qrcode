'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Vehicle, VehicleMaintenanceData, Maintenance, Alert } from '@/types/maintenance'
import Dashboard from '@/components/Dashboard'
import { generateAlerts } from '@/utils/alertGenerator'

export default function VehiclePage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [maintenances, setMaintenances] = useState<Maintenance[]>([])
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Carregar veículo
    const savedVehicles = localStorage.getItem('vehicles')
    if (savedVehicles) {
      const vehicles: Vehicle[] = JSON.parse(savedVehicles)
      const foundVehicle = vehicles.find(v => v.id === vehicleId)
      if (foundVehicle) {
        setVehicle(foundVehicle)
      }
    }

    // Carregar manutenções
    const savedData = localStorage.getItem(`vehicle-data-${vehicleId}`)
    if (savedData) {
      try {
        const data: VehicleMaintenanceData = JSON.parse(savedData)
        setMaintenances(data.maintenances || [])
      } catch (e) {
        console.error('Erro ao carregar manutenções:', e)
      }
    }

    setLoading(false)
  }, [vehicleId])

  useEffect(() => {
    if (vehicle) {
      const newAlerts = generateAlerts(vehicle, maintenances)
      setAlerts(newAlerts)
    }
  }, [vehicle, maintenances])

  // Calcular gastos do mês
  const totalCostThisMonth = maintenances
    .filter(m => {
      const maintenanceDate = new Date(m.date)
      const now = new Date()
      return maintenanceDate.getMonth() === now.getMonth() &&
             maintenanceDate.getFullYear() === now.getFullYear()
    })
    .reduce((sum, m) => sum + m.costs.total, 0)

  const handleAddMaintenance = () => {
    router.push(`/vehicle/${vehicleId}/maintenance/new`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Veículo não encontrado</p>
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-[#1B3A4B] text-white rounded-lg"
          >
            Voltar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <Dashboard
          vehicle={vehicle}
          maintenances={maintenances}
          alerts={alerts}
          totalCostThisMonth={totalCostThisMonth}
          onAddMaintenance={handleAddMaintenance}
        />
      </div>
    </div>
  )
}

