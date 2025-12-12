'use client'

import { useState } from 'react'
import { Maintenance, Part, Service } from '@/types/maintenance'

interface MaintenanceFormExpandedProps {
  onAddMaintenance: (maintenance: Maintenance) => void
  currentMileage: number
}

export default function MaintenanceFormExpanded({ onAddMaintenance, currentMileage }: MaintenanceFormExpandedProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mileage: currentMileage.toString(),
    serviceName: '',
    serviceCategory: 'preventiva' as Service['category'],
    serviceDescription: '',
    parts: [] as Array<{ name: string; code: string; brand: string; warrantyMonths: string; warrantyKm: string }>,
    mechanicName: '',
    mechanicWorkshop: '',
    mechanicLocation: '',
    mechanicContact: '',
    costTotal: '',
    costLabor: '',
    costParts: '',
    costOther: '',
    description: '',
    nextMaintenanceMileage: '',
    nextMaintenanceDate: '',
    nextMaintenanceType: '',
  })

  const [newPart, setNewPart] = useState({
    name: '',
    code: '',
    brand: '',
    warrantyMonths: '',
    warrantyKm: '',
  })

  const addPart = () => {
    if (newPart.name) {
      setFormData({
        ...formData,
        parts: [...formData.parts, { ...newPart }],
      })
      setNewPart({ name: '', code: '', brand: '', warrantyMonths: '', warrantyKm: '' })
    }
  }

  const removePart = (index: number) => {
    setFormData({
      ...formData,
      parts: formData.parts.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const now = new Date()
    const warrantyExpires = formData.parts.map(part => {
      if (part.warrantyMonths) {
        const expiry = new Date(formData.date)
        expiry.setMonth(expiry.getMonth() + Number(part.warrantyMonths))
        return expiry.toISOString().split('T')[0]
      }
      return undefined
    })

    const maintenance: Maintenance = {
      id: Date.now().toString(),
      date: formData.date,
      mileage: Number(formData.mileage),
      service: {
        id: Date.now().toString(),
        name: formData.serviceName,
        description: formData.serviceDescription || undefined,
        category: formData.serviceCategory,
      },
      parts: formData.parts.map((part, index) => ({
        id: `${Date.now()}-${index}`,
        name: part.name,
        code: part.code || undefined,
        brand: part.brand || undefined,
        warrantyMonths: part.warrantyMonths ? Number(part.warrantyMonths) : undefined,
        warrantyKm: part.warrantyKm ? Number(part.warrantyKm) : undefined,
        warrantyExpires: warrantyExpires[index],
      })),
      mechanic: {
        name: formData.mechanicName,
        workshop: formData.mechanicWorkshop || undefined,
        location: formData.mechanicLocation,
        contact: formData.mechanicContact || undefined,
      },
      costs: {
        total: Number(formData.costTotal) || 0,
        labor: formData.costLabor ? Number(formData.costLabor) : undefined,
        parts: formData.costParts ? Number(formData.costParts) : undefined,
        other: formData.costOther ? Number(formData.costOther) : undefined,
      },
      description: formData.description || undefined,
      documents: [],
      nextMaintenance: formData.nextMaintenanceMileage || formData.nextMaintenanceDate
        ? {
            mileage: formData.nextMaintenanceMileage ? Number(formData.nextMaintenanceMileage) : undefined,
            date: formData.nextMaintenanceDate || undefined,
            type: formData.nextMaintenanceType || 'Revisão',
          }
        : undefined,
    }

    onAddMaintenance(maintenance)
    
    // Reset form
    setFormData({
      date: new Date().toISOString().split('T')[0],
      mileage: currentMileage.toString(),
      serviceName: '',
      serviceCategory: 'preventiva',
      serviceDescription: '',
      parts: [],
      mechanicName: '',
      mechanicWorkshop: '',
      mechanicLocation: '',
      mechanicContact: '',
      costTotal: '',
      costLabor: '',
      costParts: '',
      costOther: '',
      description: '',
      nextMaintenanceMileage: '',
      nextMaintenanceDate: '',
      nextMaintenanceType: '',
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
          <label htmlFor="mileage" className="block text-sm font-medium text-gray-900 mb-1">
            Quilometragem *
          </label>
          <input
            type="number"
            id="mileage"
            required
            min="0"
            value={formData.mileage}
            onChange={(e) => setFormData({ ...formData, mileage: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
          />
        </div>
      </div>

      <div className="border border-gray-300 p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Serviço Realizado</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="serviceName" className="block text-sm font-medium text-gray-900 mb-1">
              Nome do Serviço *
            </label>
            <input
              type="text"
              id="serviceName"
              required
              value={formData.serviceName}
              onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              placeholder="Ex: Troca de óleo, Revisão geral..."
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>

          <div>
            <label htmlFor="serviceCategory" className="block text-sm font-medium text-gray-900 mb-1">
              Categoria
            </label>
            <select
              id="serviceCategory"
              value={formData.serviceCategory}
              onChange={(e) => setFormData({ ...formData, serviceCategory: e.target.value as Service['category'] })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            >
              <option value="preventiva">Preventiva</option>
              <option value="corretiva">Corretiva</option>
              <option value="revisão">Revisão</option>
              <option value="inspeção">Inspeção</option>
              <option value="outro">Outro</option>
            </select>
          </div>

          <div>
            <label htmlFor="serviceDescription" className="block text-sm font-medium text-gray-900 mb-1">
              Descrição do Serviço
            </label>
            <textarea
              id="serviceDescription"
              value={formData.serviceDescription}
              onChange={(e) => setFormData({ ...formData, serviceDescription: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900 resize-none"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-300 p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Peças Utilizadas</h4>
        <div className="space-y-2 mb-3">
          {formData.parts.map((part, index) => (
            <div key={index} className="bg-gray-50 p-2 border border-gray-300 flex items-center justify-between">
              <div className="flex-1 text-sm">
                <span className="font-medium">{part.name}</span>
                {part.brand && <span className="text-gray-600"> • {part.brand}</span>}
                {part.code && <span className="text-gray-600"> • Cód: {part.code}</span>}
                {part.warrantyMonths && <span className="text-gray-600"> • Garantia: {part.warrantyMonths} meses</span>}
              </div>
              <button
                type="button"
                onClick={() => removePart(index)}
                className="ml-2 px-2 py-1 text-xs text-gray-700 hover:bg-gray-200 border border-gray-300"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
          <input
            type="text"
            placeholder="Nome da peça"
            value={newPart.name}
            onChange={(e) => setNewPart({ ...newPart, name: e.target.value })}
            className="px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:border-gray-900"
          />
          <input
            type="text"
            placeholder="Código"
            value={newPart.code}
            onChange={(e) => setNewPart({ ...newPart, code: e.target.value })}
            className="px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:border-gray-900"
          />
          <input
            type="text"
            placeholder="Marca"
            value={newPart.brand}
            onChange={(e) => setNewPart({ ...newPart, brand: e.target.value })}
            className="px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:border-gray-900"
          />
          <input
            type="number"
            placeholder="Garantia (meses)"
            value={newPart.warrantyMonths}
            onChange={(e) => setNewPart({ ...newPart, warrantyMonths: e.target.value })}
            className="px-2 py-1 text-sm border border-gray-300 focus:outline-none focus:border-gray-900"
          />
          <button
            type="button"
            onClick={addPart}
            className="px-2 py-1 text-xs bg-gray-800 hover:bg-gray-900 text-white border border-gray-900"
          >
            Adicionar
          </button>
        </div>
      </div>

      <div className="border border-gray-300 p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Oficina / Mecânico</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="mechanicName" className="block text-sm font-medium text-gray-900 mb-1">
              Nome do Mecânico / Oficina *
            </label>
            <input
              type="text"
              id="mechanicName"
              required
              value={formData.mechanicName}
              onChange={(e) => setFormData({ ...formData, mechanicName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="mechanicWorkshop" className="block text-sm font-medium text-gray-900 mb-1">
              Nome da Oficina
            </label>
            <input
              type="text"
              id="mechanicWorkshop"
              value={formData.mechanicWorkshop}
              onChange={(e) => setFormData({ ...formData, mechanicWorkshop: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="mechanicLocation" className="block text-sm font-medium text-gray-900 mb-1">
              Localização *
            </label>
            <input
              type="text"
              id="mechanicLocation"
              required
              value={formData.mechanicLocation}
              onChange={(e) => setFormData({ ...formData, mechanicLocation: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="mechanicContact" className="block text-sm font-medium text-gray-900 mb-1">
              Contato
            </label>
            <input
              type="text"
              id="mechanicContact"
              value={formData.mechanicContact}
              onChange={(e) => setFormData({ ...formData, mechanicContact: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-300 p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Custos</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label htmlFor="costTotal" className="block text-sm font-medium text-gray-900 mb-1">
              Valor Total *
            </label>
            <input
              type="number"
              step="0.01"
              id="costTotal"
              required
              value={formData.costTotal}
              onChange={(e) => setFormData({ ...formData, costTotal: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="costLabor" className="block text-sm font-medium text-gray-900 mb-1">
              Mão de Obra
            </label>
            <input
              type="number"
              step="0.01"
              id="costLabor"
              value={formData.costLabor}
              onChange={(e) => setFormData({ ...formData, costLabor: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="costParts" className="block text-sm font-medium text-gray-900 mb-1">
              Peças
            </label>
            <input
              type="number"
              step="0.01"
              id="costParts"
              value={formData.costParts}
              onChange={(e) => setFormData({ ...formData, costParts: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="costOther" className="block text-sm font-medium text-gray-900 mb-1">
              Outros
            </label>
            <input
              type="number"
              step="0.01"
              id="costOther"
              value={formData.costOther}
              onChange={(e) => setFormData({ ...formData, costOther: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
        </div>
      </div>

      <div className="border border-gray-300 p-3">
        <h4 className="text-sm font-semibold text-gray-900 mb-3">Próxima Manutenção</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <div>
            <label htmlFor="nextMaintenanceMileage" className="block text-sm font-medium text-gray-900 mb-1">
              Próxima por Quilometragem
            </label>
            <input
              type="number"
              id="nextMaintenanceMileage"
              value={formData.nextMaintenanceMileage}
              onChange={(e) => setFormData({ ...formData, nextMaintenanceMileage: e.target.value })}
              placeholder="Ex: 60000"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="nextMaintenanceDate" className="block text-sm font-medium text-gray-900 mb-1">
              Próxima por Data
            </label>
            <input
              type="date"
              id="nextMaintenanceDate"
              value={formData.nextMaintenanceDate}
              onChange={(e) => setFormData({ ...formData, nextMaintenanceDate: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
          <div>
            <label htmlFor="nextMaintenanceType" className="block text-sm font-medium text-gray-900 mb-1">
              Tipo
            </label>
            <input
              type="text"
              id="nextMaintenanceType"
              value={formData.nextMaintenanceType}
              onChange={(e) => setFormData({ ...formData, nextMaintenanceType: e.target.value })}
              placeholder="Ex: Troca de óleo"
              className="w-full px-3 py-2 border border-gray-300 focus:outline-none focus:border-gray-900"
            />
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-900 mb-1">
          Observações Adicionais
        </label>
        <textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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

