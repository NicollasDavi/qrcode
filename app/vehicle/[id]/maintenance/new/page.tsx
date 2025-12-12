'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Vehicle, Maintenance, VehicleMaintenanceData } from '@/types/maintenance'
import MaintenanceFormExpanded from '@/components/MaintenanceFormExpanded'

export default function NewMaintenancePage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)

  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles')
    if (savedVehicles) {
      const vehicles: Vehicle[] = JSON.parse(savedVehicles)
      const foundVehicle = vehicles.find(v => v.id === vehicleId)
      if (foundVehicle) {
        setVehicle(foundVehicle)
      }
    }
  }, [vehicleId])

  const handleAddMaintenance = (maintenance: Maintenance) => {
    if (!vehicle) return

    // Carregar manutenções existentes
    const savedData = localStorage.getItem(`vehicle-data-${vehicleId}`)
    let maintenances: Maintenance[] = []

    if (savedData) {
      try {
        const data: VehicleMaintenanceData = JSON.parse(savedData)
        maintenances = data.maintenances || []
      } catch (e) {
        console.error('Erro ao carregar manutenções:', e)
      }
    }

    // Adicionar nova manutenção
    const updatedMaintenances = [...maintenances, maintenance]

    // Atualizar quilometragem do veículo se necessário
    if (maintenance.mileage > vehicle.currentMileage) {
      const updatedVehicles = JSON.parse(localStorage.getItem('vehicles') || '[]')
      const vehicleIndex = updatedVehicles.findIndex((v: Vehicle) => v.id === vehicleId)
      if (vehicleIndex !== -1) {
        updatedVehicles[vehicleIndex].currentMileage = maintenance.mileage
        updatedVehicles[vehicleIndex].lastUpdated = new Date().toISOString()
        localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
      }
    }

    // Salvar dados
    const vehicleData: VehicleMaintenanceData = {
      vehicle: {
        ...vehicle,
        currentMileage: Math.max(vehicle.currentMileage, maintenance.mileage),
      },
      maintenances: updatedMaintenances,
      createdAt: vehicle.createdAt,
      lastUpdated: new Date().toISOString(),
      version: '1.0',
    }

    localStorage.setItem(`vehicle-data-${vehicleId}`, JSON.stringify(vehicleData))
    localStorage.setItem(`vehicle-${vehicleId}`, JSON.stringify(vehicleData))

    // Redirecionar para o dashboard
    router.push(`/vehicle/${vehicleId}`)
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
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.push(`/vehicle/${vehicleId}`)}
            className="text-[#1B3A4B] hover:underline mb-4"
          >
            ← Voltar para Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Registrar Nova Manutenção
          </h1>
          <p className="text-gray-600">
            {vehicle.brand} {vehicle.model} {vehicle.year} • {vehicle.plate}
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <MaintenanceFormExpanded
            onAddMaintenance={handleAddMaintenance}
            currentMileage={vehicle.currentMileage}
          />
        </div>
      </div>
    </div>
  )
}

