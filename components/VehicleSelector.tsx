'use client'

import { Vehicle } from '@/types/maintenance'

interface VehicleSelectorProps {
  vehicles: Vehicle[]
  selectedVehicleId: string | null
  onSelectVehicle: (vehicleId: string) => void
  onAddVehicle: () => void
}

export default function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onSelectVehicle,
  onAddVehicle,
}: VehicleSelectorProps) {
  return (
    <div className="border border-gray-300 p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold text-gray-900">Veículos</h3>
        <button
          onClick={onAddVehicle}
          className="px-3 py-1 text-xs bg-gray-800 hover:bg-gray-900 text-white border border-gray-900"
        >
          + Novo Veículo
        </button>
      </div>
      
      {vehicles.length === 0 ? (
        <p className="text-sm text-gray-600">Nenhum veículo cadastrado</p>
      ) : (
        <div className="space-y-2">
          {vehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => onSelectVehicle(vehicle.id)}
              className={`w-full text-left px-3 py-2 border text-sm ${
                selectedVehicleId === vehicle.id
                  ? 'bg-gray-100 border-gray-900'
                  : 'bg-white border-gray-300 hover:bg-gray-50'
              }`}
            >
              <div className="font-medium text-gray-900">
                {vehicle.brand} {vehicle.model} {vehicle.year}
              </div>
              <div className="text-xs text-gray-600">
                {vehicle.plate} • {vehicle.currentMileage.toLocaleString('pt-BR')} km
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

