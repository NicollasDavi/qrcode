'use client'

import { useState } from 'react'
import { Maintenance } from '@/types/maintenance'

interface MaintenanceFormProps {
  onAddMaintenance: (maintenance: Maintenance) => void
}

export default function MaintenanceForm({ onAddMaintenance }: MaintenanceFormProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    part: '',
    mechanic: '',
    location: '',
    description: '',
    mileage: '',
    cost: '',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const maintenance: Maintenance = {
      id: Date.now().toString(),
      date: formData.date,
      part: formData.part,
      mechanic: formData.mechanic,
      location: formData.location,
      description: formData.description || undefined,
      mileage: formData.mileage ? Number(formData.mileage) : undefined,
      cost: formData.cost ? Number(formData.cost) : undefined,
    }

    onAddMaintenance(maintenance)
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      part: '',
      mechanic: '',
      location: '',
      description: '',
      mileage: '',
      cost: '',
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-900 mb-1">
            Data da Manutenção *
          </label>
          <input
            type="date"
            id="date"
            required
            value={formData.date}
            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="part" className="block text-sm font-medium text-gray-900 mb-1">
            Peça Utilizada *
          </label>
          <input
            type="text"
            id="part"
            required
            value={formData.part}
            onChange={(e) => setFormData({ ...formData, part: e.target.value })}
            placeholder="Ex: Filtro de óleo, Pastilhas de freio..."
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="mechanic" className="block text-sm font-medium text-gray-900 mb-1">
            Quem Fez a Manutenção *
          </label>
          <input
            type="text"
            id="mechanic"
            required
            value={formData.mechanic}
            onChange={(e) => setFormData({ ...formData, mechanic: e.target.value })}
            placeholder="Nome do mecânico ou oficina"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-900 mb-1">
            Onde Foi Feita *
          </label>
          <input
            type="text"
            id="location"
            required
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            placeholder="Endereço ou cidade"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-900 mb-1">
            Quilometragem (km)
          </label>
          <input
            type="number"
            id="mileage"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            placeholder="Ex: 50000"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>

        <div>
          <label htmlFor="cost" className="block text-sm font-medium text-gray-900 mb-1">
            Custo (R$)
          </label>
          <input
            type="number"
            step="0.01"
            id="cost"
            value={formData.cost}
            onChange={(e) => setFormData({ ...formData, cost: e.target.value })}
            placeholder="Ex: 250.00"
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
          Descrição Adicional
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Observações sobre a manutenção..."
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 resize-none"
        />
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium border border-gray-900"
      >
        Adicionar Manutenção
      </button>
    </form>
  )
}

