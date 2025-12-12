'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Vehicle } from '@/types/maintenance'
import VehicleForm from '@/components/VehicleForm'
import { generateVehicleId } from '@/utils/vehicleId'

export default function Home() {
  const router = useRouter()
  const [vehicles, setVehicles] = useState<Vehicle[]>([])
  const [showVehicleForm, setShowVehicleForm] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles')
    if (savedVehicles) {
      const parsed = JSON.parse(savedVehicles)
      setVehicles(parsed)
    }
    setLoading(false)
  }, [])

  const handleSaveVehicle = (vehicleData: Omit<Vehicle, 'id' | 'createdAt' | 'lastUpdated'>) => {
    const now = new Date().toISOString()
    const vehicleId = generateVehicleId(vehicleData.plate, vehicleData.brand, vehicleData.model, vehicleData.year)
    
    const newVehicle: Vehicle = {
      ...vehicleData,
      id: vehicleId,
      createdAt: now,
      lastUpdated: now,
    }

    const updatedVehicles = [...vehicles, newVehicle]
    setVehicles(updatedVehicles)
    localStorage.setItem('vehicles', JSON.stringify(updatedVehicles))
    setShowVehicleForm(false)
    
    // Redirecionar para o dashboard do novo veículo
    router.push(`/vehicle/${vehicleId}`)
  }

  const handleSelectVehicle = (vehicleId: string) => {
    router.push(`/vehicle/${vehicleId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  if (showVehicleForm) {
    return (
      <div className="min-h-screen bg-[#F4F4F4]">
        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <div className="mb-6">
            <button
              onClick={() => setShowVehicleForm(false)}
              className="text-[#1B3A4B] hover:underline"
            >
              ← Voltar
            </button>
          </div>
          <VehicleForm
            onSave={handleSaveVehicle}
            onCancel={() => setShowVehicleForm(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Meus Veículos
          </h1>
          <p className="text-gray-600">
            Gerencie o histórico de manutenções dos seus veículos
          </p>
        </div>

        {vehicles.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 p-12 text-center shadow-sm">
            <svg
              className="mx-auto h-16 w-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum veículo cadastrado
            </h3>
            <p className="text-gray-600 mb-6">
              Comece cadastrando seu primeiro veículo para gerenciar suas manutenções
            </p>
            <button
              onClick={() => setShowVehicleForm(true)}
              className="px-6 py-3 bg-[#1B3A4B] hover:bg-[#1a3342] text-white font-medium rounded-lg transition-colors"
            >
              Cadastrar Primeiro Veículo
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6 flex justify-end">
              <button
                onClick={() => setShowVehicleForm(true)}
                className="px-4 py-2 bg-[#1B3A4B] hover:bg-[#1a3342] text-white font-medium rounded-lg transition-colors"
              >
                + Novo Veículo
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((vehicle) => (
                <div
                  key={vehicle.id}
                  onClick={() => handleSelectVehicle(vehicle.id)}
                  className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {vehicle.brand} {vehicle.model}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {vehicle.year} • {vehicle.plate}
                      </p>
                    </div>
                    <div className="w-12 h-12 bg-[#1B3A4B] rounded-lg flex items-center justify-center">
                      <svg
                        className="w-6 h-6 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-600">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                        />
                      </svg>
                      {vehicle.currentMileage.toLocaleString('pt-BR')} km
                    </div>
                    {vehicle.fuelType && (
                      <div className="flex items-center text-gray-600">
                        <svg
                          className="w-4 h-4 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        {vehicle.fuelType}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <button className="w-full text-sm text-[#1B3A4B] hover:underline font-medium">
                      Ver Dashboard →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
