import { Maintenance, Vehicle, Alert } from '@/types/maintenance'

export function generateAlerts(
  vehicle: Vehicle,
  maintenances: Maintenance[]
): Alert[] {
  const alerts: Alert[] = []
  const now = new Date()
  const currentMileage = vehicle.currentMileage

  // Alertas de quilometragem
  maintenances.forEach((maintenance) => {
    if (maintenance.nextMaintenance?.mileage) {
      const nextMileage = maintenance.nextMaintenance.mileage
      const remainingKm = nextMileage - currentMileage

      if (remainingKm <= 0) {
        alerts.push({
          id: `mileage-overdue-${maintenance.id}`,
          type: 'mileage',
          title: 'Revisão Atrasada por Quilometragem',
          message: `${maintenance.service.name} está ${Math.abs(remainingKm)} km atrasada`,
          priority: 'high',
          dueMileage: nextMileage,
          dismissed: false,
          createdAt: now.toISOString(),
        })
      } else if (remainingKm <= 1000) {
        alerts.push({
          id: `mileage-due-${maintenance.id}`,
          type: 'mileage',
          title: 'Revisão Próxima por Quilometragem',
          message: `${maintenance.service.name} deve ser feita em ${remainingKm} km`,
          priority: 'medium',
          dueMileage: nextMileage,
          dismissed: false,
          createdAt: now.toISOString(),
        })
      }
    }
  })

  // Alertas de tempo
  maintenances.forEach((maintenance) => {
    if (maintenance.nextMaintenance?.date) {
      const nextDate = new Date(maintenance.nextMaintenance.date)
      const daysUntil = Math.floor((nextDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

      if (daysUntil < 0) {
        alerts.push({
          id: `time-overdue-${maintenance.id}`,
          type: 'time',
          title: 'Revisão Atrasada por Tempo',
          message: `${maintenance.service.name} está ${Math.abs(daysUntil)} dias atrasada`,
          priority: 'high',
          dueDate: maintenance.nextMaintenance.date,
          dismissed: false,
          createdAt: now.toISOString(),
        })
      } else if (daysUntil <= 30) {
        alerts.push({
          id: `time-due-${maintenance.id}`,
          type: 'time',
          title: 'Revisão Próxima por Tempo',
          message: `${maintenance.service.name} deve ser feita em ${daysUntil} dias`,
          priority: 'medium',
          dueDate: maintenance.nextMaintenance.date,
          dismissed: false,
          createdAt: now.toISOString(),
        })
      }
    }
  })

  // Alertas de garantia
  maintenances.forEach((maintenance) => {
    maintenance.parts.forEach((part) => {
      if (part.warrantyExpires) {
        const warrantyDate = new Date(part.warrantyExpires)
        const daysUntil = Math.floor((warrantyDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))

        if (daysUntil < 0) {
          alerts.push({
            id: `warranty-expired-${part.id}`,
            type: 'warranty',
            title: 'Garantia Expirada',
            message: `Garantia da peça ${part.name} expirou`,
            priority: 'low',
            dueDate: part.warrantyExpires,
            dismissed: false,
            createdAt: now.toISOString(),
          })
        } else if (daysUntil <= 30) {
          alerts.push({
            id: `warranty-expiring-${part.id}`,
            type: 'warranty',
            title: 'Garantia Prestes a Expirar',
            message: `Garantia da peça ${part.name} expira em ${daysUntil} dias`,
            priority: 'medium',
            dueDate: part.warrantyExpires,
            dismissed: false,
            createdAt: now.toISOString(),
          })
        }
      }
    })
  })

  return alerts.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

