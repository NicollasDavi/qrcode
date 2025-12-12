'use client'

import { Maintenance } from '@/types/maintenance'

interface MaintenanceListProps {
  maintenances: Maintenance[]
  onRemoveMaintenance: (id: string) => void
  showRemoveButton?: boolean
}

export default function MaintenanceList({ maintenances, onRemoveMaintenance, showRemoveButton = true }: MaintenanceListProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formatCurrency = (value?: number) => {
    if (!value) return '-'
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  if (maintenances.length === 0) {
    return (
      <div className="text-center py-8 text-gray-600">
        <p>Nenhuma manutenção cadastrada ainda.</p>
        <p className="text-sm mt-2">Adicione uma manutenção usando o formulário acima.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-base font-semibold text-gray-900 mb-4">
        Histórico de Manutenções ({maintenances.length})
      </h3>
      <div className="space-y-2">
        {maintenances
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
          .map((maintenance) => (
            <div
              key={maintenance.id}
              className="bg-gray-50 border border-gray-300 p-4"
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-semibold text-gray-900">
                      {formatDate(maintenance.date)}
                    </span>
                    {maintenance.mileage && (
                      <span className="text-xs text-gray-600">
                        • {maintenance.mileage.toLocaleString('pt-BR')} km
                      </span>
                    )}
                  </div>
                  
                  <div className="space-y-1 text-sm">
                    <p>
                      <span className="font-medium text-gray-900">Serviço:</span>{' '}
                      <span className="text-gray-700">{maintenance.service.name}</span>
                      {maintenance.service.category && (
                        <span className="text-xs text-gray-600 ml-1">({maintenance.service.category})</span>
                      )}
                    </p>
                    
                    {maintenance.parts.length > 0 && (
                      <div className="mt-1">
                        <span className="font-medium text-gray-900">Peças:</span>
                        <div className="text-gray-700 text-xs mt-1 space-y-0.5">
                          {maintenance.parts.map((part) => (
                            <div key={part.id}>
                              • {part.name}
                              {part.brand && ` (${part.brand})`}
                              {part.code && ` - Cód: ${part.code}`}
                              {part.warrantyMonths && ` - Garantia: ${part.warrantyMonths} meses`}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    <p>
                      <span className="font-medium text-gray-900">Mecânico:</span>{' '}
                      <span className="text-gray-700">{maintenance.mechanic.name}</span>
                      {maintenance.mechanic.workshop && (
                        <span className="text-gray-600"> - {maintenance.mechanic.workshop}</span>
                      )}
                    </p>
                    <p>
                      <span className="font-medium text-gray-900">Local:</span>{' '}
                      <span className="text-gray-700">{maintenance.mechanic.location}</span>
                    </p>
                    
                    <p>
                      <span className="font-medium text-gray-900">Custo Total:</span>{' '}
                      <span className="text-gray-700">{formatCurrency(maintenance.costs.total)}</span>
                    </p>
                    {(maintenance.costs.labor || maintenance.costs.parts || maintenance.costs.other) && (
                      <div className="text-xs text-gray-600 ml-2">
                        {maintenance.costs.labor && `Mão de obra: ${formatCurrency(maintenance.costs.labor)}`}
                        {maintenance.costs.parts && ` • Peças: ${formatCurrency(maintenance.costs.parts)}`}
                        {maintenance.costs.other && ` • Outros: ${formatCurrency(maintenance.costs.other)}`}
                      </div>
                    )}

                    {maintenance.nextMaintenance && (
                      <p className="text-xs text-gray-600 mt-2 pt-2 border-t border-gray-200">
                        <span className="font-medium">Próxima manutenção:</span> {maintenance.nextMaintenance.type}
                        {maintenance.nextMaintenance.mileage && 
                          ` em ${maintenance.nextMaintenance.mileage.toLocaleString('pt-BR')} km`}
                        {maintenance.nextMaintenance.date && 
                          ` ou em ${new Date(maintenance.nextMaintenance.date).toLocaleDateString('pt-BR')}`}
                      </p>
                    )}

                    {maintenance.description && (
                      <p className="text-gray-600 mt-2 pt-2 border-t border-gray-200 italic">
                        {maintenance.description}
                      </p>
                    )}
                  </div>
                </div>
                
                {showRemoveButton && (
                  <button
                    onClick={() => onRemoveMaintenance(maintenance.id)}
                    className="ml-4 px-2 py-1 text-sm text-gray-700 hover:text-gray-900 hover:bg-gray-200 border border-gray-300"
                    title="Remover manutenção"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  )
}

