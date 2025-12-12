'use client'

import { Alert } from '@/types/maintenance'

interface AlertsPanelProps {
  alerts: Alert[]
  onDismiss: (alertId: string) => void
}

export default function AlertsPanel({ alerts, onDismiss }: AlertsPanelProps) {
  const formatDate = (dateString?: string) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const getPriorityColor = (priority: Alert['priority']) => {
    switch (priority) {
      case 'high':
        return 'bg-red-50 border-red-300 text-red-900'
      case 'medium':
        return 'bg-yellow-50 border-yellow-300 text-yellow-900'
      case 'low':
        return 'bg-blue-50 border-blue-300 text-blue-900'
      default:
        return 'bg-gray-50 border-gray-300 text-gray-900'
    }
  }

  const activeAlerts = alerts.filter(a => !a.dismissed)

  if (activeAlerts.length === 0) {
    return (
      <div className="border border-gray-300 p-4 bg-gray-50">
        <h3 className="text-sm font-semibold text-gray-900 mb-2">Alertas</h3>
        <p className="text-sm text-gray-600">Nenhum alerta ativo</p>
      </div>
    )
  }

  return (
    <div className="border border-gray-300 p-4">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">
        Alertas ({activeAlerts.length})
      </h3>
      <div className="space-y-2">
        {activeAlerts.map((alert) => (
          <div
            key={alert.id}
            className={`border p-3 ${getPriorityColor(alert.priority)}`}
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="text-sm font-medium mb-1">{alert.title}</div>
                <div className="text-xs">{alert.message}</div>
                {(alert.dueDate || alert.dueMileage) && (
                  <div className="text-xs mt-1 opacity-75">
                    {alert.dueDate && `Data: ${formatDate(alert.dueDate)}`}
                    {alert.dueMileage && ` • Quilometragem: ${alert.dueMileage.toLocaleString('pt-BR')} km`}
                  </div>
                )}
              </div>
              <button
                onClick={() => onDismiss(alert.id)}
                className="ml-2 px-2 py-1 text-xs border border-gray-400 hover:bg-white/50"
                title="Dispensar alerta"
              >
                ✕
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

