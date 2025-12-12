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

  const getServiceIcon = (category: string, serviceName: string) => {
    const name = serviceName.toLowerCase()
    
    // Ícones específicos por tipo de serviço
    if (name.includes('óleo') || name.includes('oleo')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
        </svg>
      )
    }
    if (name.includes('freio') || name.includes('pastilha') || name.includes('disco')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      )
    }
    if (name.includes('pneu') || name.includes('pneu')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
        </svg>
      )
    }
    if (name.includes('bateria') || name.includes('elétrico') || name.includes('eletrico')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
    if (name.includes('suspensão') || name.includes('suspensao') || name.includes('amortecedor')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
        </svg>
      )
    }
    if (name.includes('filtro')) {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
        </svg>
      )
    }
    if (name.includes('revisão') || name.includes('revisao') || category === 'revisão') {
      return (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    }
    
    // Ícone padrão baseado na categoria
    switch (category) {
      case 'preventiva':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        )
      case 'corretiva':
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        )
      default:
        return (
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        )
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'preventiva':
        return 'bg-green-100 text-green-700 border-green-200'
      case 'corretiva':
        return 'bg-red-100 text-red-700 border-red-200'
      case 'revisão':
        return 'bg-blue-100 text-blue-700 border-blue-200'
      case 'inspeção':
        return 'bg-yellow-100 text-yellow-700 border-yellow-200'
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const getStatusBadge = (maintenance: Maintenance) => {
    const now = new Date()
    const maintenanceDate = new Date(maintenance.date)
    const daysSince = Math.floor((now.getTime() - maintenanceDate.getTime()) / (1000 * 60 * 60 * 24))
    
    // Verificar garantias
    const hasActiveWarranty = maintenance.parts.some(part => {
      if (part.warrantyExpires) {
        return new Date(part.warrantyExpires) > now
      }
      return false
    })

    if (hasActiveWarranty) {
      return (
        <span className="px-2 py-1 text-xs font-medium bg-green-100 text-green-700 rounded-full border border-green-200">
          Em Garantia
        </span>
      )
    }

    if (maintenance.nextMaintenance) {
      const nextDate = maintenance.nextMaintenance.date ? new Date(maintenance.nextMaintenance.date) : null
      const nextKm = maintenance.nextMaintenance.mileage
      
      if (nextDate && nextDate < now) {
        return (
          <span className="px-2 py-1 text-xs font-medium bg-red-100 text-red-700 rounded-full border border-red-200">
            Pendente
          </span>
        )
      }
    }

    return (
      <span className="px-2 py-1 text-xs font-medium bg-gray-100 text-gray-700 rounded-full border border-gray-200">
        Concluído
      </span>
    )
  }

  const sortedMaintenances = [...maintenances].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  )

  if (sortedMaintenances.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <svg
          className="mx-auto h-12 w-12 text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <p className="text-gray-600">Nenhuma manutenção cadastrada ainda.</p>
      </div>
    )
  }

  return (
    <div className="relative">
      {/* Linha vertical da timeline */}
      <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
      
      <div className="space-y-6">
        {sortedMaintenances.map((maintenance, index) => (
          <div key={maintenance.id} className="relative flex items-start">
            {/* Ponto da timeline com ícone */}
            <div className="absolute left-3 z-10">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 border-white shadow-sm ${
                maintenance.service.category === 'preventiva' ? 'bg-green-500' :
                maintenance.service.category === 'corretiva' ? 'bg-red-500' :
                maintenance.service.category === 'revisão' ? 'bg-blue-500' :
                'bg-gray-500'
              }`}>
                <div className="text-white">
                  {getServiceIcon(maintenance.service.category, maintenance.service.name)}
                </div>
              </div>
            </div>

            {/* Card da manutenção */}
            <div className="ml-12 flex-1 bg-white rounded-lg border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
              {/* Cabeçalho */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-base font-semibold text-gray-900">
                      {maintenance.service.name}
                    </h3>
                    <span className={`px-2 py-0.5 text-xs font-medium rounded-full border ${getCategoryColor(maintenance.service.category)}`}>
                      {maintenance.service.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(maintenance.date)}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      {maintenance.mileage.toLocaleString('pt-BR')} km
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-900 mb-1">
                    {formatCurrency(maintenance.costs.total)}
                  </div>
                  {getStatusBadge(maintenance)}
                </div>
              </div>

              {/* Peças */}
              {maintenance.parts.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-2">
                    <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                    </svg>
                    <span className="text-xs font-semibold text-gray-700">Peças Utilizadas</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {maintenance.parts.map((part) => (
                      <div key={part.id} className="bg-gray-50 rounded p-2 text-xs">
                        <div className="font-medium text-gray-900">{part.name}</div>
                        {part.brand && (
                          <div className="text-gray-600">Marca: {part.brand}</div>
                        )}
                        {part.code && (
                          <div className="text-gray-600">Código: {part.code}</div>
                        )}
                        {part.warrantyMonths && (
                          <div className="text-green-600 font-medium">
                            Garantia: {part.warrantyMonths} meses
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Oficina */}
              <div className="mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <span className="text-xs font-semibold text-gray-700">Oficina Responsável</span>
                </div>
                <div className="text-sm text-gray-700">
                  <div className="font-medium">{maintenance.mechanic.name}</div>
                  {maintenance.mechanic.workshop && (
                    <div className="text-gray-600">{maintenance.mechanic.workshop}</div>
                  )}
                  <div className="text-gray-600">{maintenance.mechanic.location}</div>
                  {maintenance.mechanic.contact && (
                    <div className="text-gray-600">{maintenance.mechanic.contact}</div>
                  )}
                </div>
              </div>

              {/* Detalhamento de custos */}
              {(maintenance.costs.labor || maintenance.costs.parts || maintenance.costs.other) && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-700 mb-2">Detalhamento de Custos</div>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    {maintenance.costs.labor && (
                      <div>
                        <div className="text-gray-500">Mão de Obra</div>
                        <div className="font-medium text-gray-900">{formatCurrency(maintenance.costs.labor)}</div>
                      </div>
                    )}
                    {maintenance.costs.parts && (
                      <div>
                        <div className="text-gray-500">Peças</div>
                        <div className="font-medium text-gray-900">{formatCurrency(maintenance.costs.parts)}</div>
                      </div>
                    )}
                    {maintenance.costs.other && (
                      <div>
                        <div className="text-gray-500">Outros</div>
                        <div className="font-medium text-gray-900">{formatCurrency(maintenance.costs.other)}</div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Próxima manutenção */}
              {maintenance.nextMaintenance && (
                <div className="mt-4 pt-4 border-t border-gray-100 bg-blue-50 rounded p-3">
                  <div className="flex items-center gap-2 mb-1">
                    <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-xs font-semibold text-blue-900">Próxima Manutenção</span>
                  </div>
                  <div className="text-sm text-blue-800">
                    <div className="font-medium">{maintenance.nextMaintenance.type}</div>
                    {maintenance.nextMaintenance.mileage && (
                      <div className="text-xs mt-1">
                        Em {maintenance.nextMaintenance.mileage.toLocaleString('pt-BR')} km
                      </div>
                    )}
                    {maintenance.nextMaintenance.date && (
                      <div className="text-xs mt-1">
                        Ou em {new Date(maintenance.nextMaintenance.date).toLocaleDateString('pt-BR')}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Descrição */}
              {maintenance.description && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <div className="text-xs font-semibold text-gray-700 mb-1">Observações</div>
                  <p className="text-sm text-gray-600 italic">{maintenance.description}</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

