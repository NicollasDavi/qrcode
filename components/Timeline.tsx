'use client'

import { Maintenance } from '@/types/maintenance'

interface TimelineProps {
  maintenances: Maintenance[]
}

export default function Timeline({ maintenances }: TimelineProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  const sortedMaintenances = [...maintenances].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sortedMaintenances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Nenhuma manutenção cadastrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
      <div className="space-y-6">
        {sortedMaintenances.map((maintenance, index) => (
          <div key={maintenance.id} className="relative flex items-start">
            <div className="absolute left-3 w-3 h-3 bg-gray-800 border-2 border-white rounded-full z-10"></div>
            <div className="ml-8 flex-1 border border-gray-300 bg-white p-4">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="text-sm font-semibold text-gray-900 mb-1">
                    {maintenance.service.name}
                  </div>
                  <div className="text-xs text-gray-600">
                    {formatDate(maintenance.date)} • {maintenance.mileage.toLocaleString('pt-BR')} km
                  </div>
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {formatCurrency(maintenance.costs.total)}
                </div>
              </div>

              {maintenance.parts.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-700 mb-1">Peças:</div>
                  <div className="text-xs text-gray-600 space-y-1">
                    {maintenance.parts.map((part) => (
                      <div key={part.id}>
                        • {part.name}
                        {part.brand && ` (${part.brand})`}
                        {part.warrantyMonths && ` - Garantia: ${part.warrantyMonths} meses`}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600">
                <div>Mecânico: {maintenance.mechanic.name}</div>
                {maintenance.mechanic.workshop && (
                  <div>Oficina: {maintenance.mechanic.workshop}</div>
                )}
                <div>Local: {maintenance.mechanic.location}</div>
              </div>

              {maintenance.nextMaintenance && (
                <div className="mt-2 pt-2 border-t border-gray-200">
                  <div className="text-xs font-medium text-gray-700">
                    Próxima manutenção: {maintenance.nextMaintenance.type}
                    {maintenance.nextMaintenance.mileage && 
                      ` em ${maintenance.nextMaintenance.mileage.toLocaleString('pt-BR')} km`}
                    {maintenance.nextMaintenance.date && 
                      ` ou em ${new Date(maintenance.nextMaintenance.date).toLocaleDateString('pt-BR')}`}
                  </div>
                </div>
              )}

              {maintenance.description && (
                <div className="mt-2 pt-2 border-t border-gray-200 text-xs text-gray-600 italic">
                  {maintenance.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

