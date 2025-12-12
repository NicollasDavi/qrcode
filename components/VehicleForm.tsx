'use client'

import { useState } from 'react'
import { Vehicle } from '@/types/maintenance'

interface VehicleFormProps {
  onSave: (vehicle: Omit<Vehicle, 'id' | 'createdAt' | 'lastUpdated'>) => void
  onCancel: () => void
  initialData?: Partial<Vehicle>
}

export default function VehicleForm({ onSave, onCancel, initialData }: VehicleFormProps) {
  const [formData, setFormData] = useState({
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    year: initialData?.year || new Date().getFullYear(),
    plate: initialData?.plate || '',
    color: initialData?.color || '',
    chassis: initialData?.chassis || '',
    currentMileage: initialData?.currentMileage || 0,
    fuelType: initialData?.fuelType || 'flex' as Vehicle['fuelType'],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 border border-gray-300 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-4">
        {initialData ? 'Editar Veículo' : 'Novo Veículo'}
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="brand" className="block text-sm font-medium text-gray-900 mb-1">
            Marca *
          </label>
          <input
            type="text"
            id="brand"
            required
            value={formData.brand}
            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="model" className="block text-sm font-medium text-gray-900 mb-1">
            Modelo *
          </label>
          <input
            type="text"
            id="model"
            required
            value={formData.model}
            onChange={(e) => setFormData({ ...formData, model: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="year" className="block text-sm font-medium text-gray-900 mb-1">
            Ano *
          </label>
          <input
            type="number"
            id="year"
            required
            min="1900"
            max={new Date().getFullYear() + 1}
            value={formData.year}
            onChange={(e) => setFormData({ ...formData, year: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="plate" className="block text-sm font-medium text-gray-900 mb-1">
            Placa *
          </label>
          <input
            type="text"
            id="plate"
            required
            value={formData.plate}
            onChange={(e) => setFormData({ ...formData, plate: e.target.value.toUpperCase() })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            maxLength={7}
          />
        </div>

        <div>
          <label htmlFor="color" className="block text-sm font-medium text-gray-900 mb-1">
            Cor
          </label>
          <input
            type="text"
            id="color"
            value={formData.color}
            onChange={(e) => setFormData({ ...formData, color: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="currentMileage" className="block text-sm font-medium text-gray-900 mb-1">
            Quilometragem Atual *
          </label>
          <input
            type="number"
            id="currentMileage"
            required
            min="0"
            value={formData.currentMileage}
            onChange={(e) => setFormData({ ...formData, currentMileage: Number(e.target.value) })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="fuelType" className="block text-sm font-medium text-gray-900 mb-1">
            Combustível
          </label>
          <select
            id="fuelType"
            value={formData.fuelType}
            onChange={(e) => setFormData({ ...formData, fuelType: e.target.value as Vehicle['fuelType'] })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          >
            <option value="gasolina">Gasolina</option>
            <option value="etanol">Etanol</option>
            <option value="flex">Flex</option>
            <option value="diesel">Diesel</option>
            <option value="elétrico">Elétrico</option>
            <option value="híbrido">Híbrido</option>
          </select>
        </div>

        <div>
          <label htmlFor="chassis" className="block text-sm font-medium text-gray-900 mb-1">
            Chassi
          </label>
          <input
            type="text"
            id="chassis"
            value={formData.chassis}
            onChange={(e) => setFormData({ ...formData, chassis: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>
      </div>

      <div className="flex gap-2 pt-2">
        <button
          type="submit"
          className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium border border-gray-900"
        >
          Salvar
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-white hover:bg-gray-50 text-gray-900 text-sm font-medium border border-gray-300"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}

