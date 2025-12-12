'use client'

import { useState } from 'react'
import { Vehicle, Maintenance, Alert } from '@/types/maintenance'
import { generateAlerts } from '@/utils/alertGenerator'
import Link from 'next/link'

interface DashboardProps {
  vehicle: Vehicle
  maintenances: Maintenance[]
  alerts: Alert[]
  totalCostThisMonth: number
  onAddMaintenance: () => void
}

export default function Dashboard({
  vehicle,
  maintenances,
  alerts,
  totalCostThisMonth,
  onAddMaintenance,
}: DashboardProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  // Encontrar próxima manutenção
  const nextMaintenance = maintenances
    .filter(m => m.nextMaintenance)
    .sort((a, b) => {
      const aDate = a.nextMaintenance?.date ? new Date(a.nextMaintenance.date).getTime() : Infinity
      const bDate = b.nextMaintenance?.date ? new Date(b.nextMaintenance.date).getTime() : Infinity
      const aKm = a.nextMaintenance?.mileage || Infinity
      const bKm = b.nextMaintenance?.mileage || Infinity
      return Math.min(aDate, aKm) - Math.min(bDate, bKm)
    })[0]

  // Contar manutenções pendentes
  const pendingAlerts = alerts.filter(a => !a.dismissed && (a.priority === 'high' || a.priority === 'medium'))

  return (
    <div className="space-y-6">
      {/* Card do Veículo */}
      <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">
              {vehicle.brand} {vehicle.model}
            </h2>
            <p className="text-gray-600">{vehicle.year} • {vehicle.plate}</p>
          </div>
          <Link
            href={`/vehicle/${vehicle.id}/qr`}
            className="px-4 py-2 bg-[#1B3A4B] hover:bg-[#1a3342] text-white text-sm font-medium rounded-lg transition-colors"
          >
            Ver QR Code
          </Link>
        </div>
      </div>

      {/* Indicadores Rápidos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Próxima Manutenção */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Próxima Manutenção</p>
              {nextMaintenance?.nextMaintenance ? (
                <p className="text-sm font-semibold text-gray-900">
                  {nextMaintenance.nextMaintenance.type}
                </p>
              ) : (
                <p className="text-sm font-semibold text-gray-400">Nenhuma agendada</p>
              )}
            </div>
          </div>
          {nextMaintenance?.nextMaintenance && (
            <div className="text-xs text-gray-600 mt-2">
              {nextMaintenance.nextMaintenance.mileage && (
                <span>{nextMaintenance.nextMaintenance.mileage.toLocaleString('pt-BR')} km</span>
              )}
              {nextMaintenance.nextMaintenance.date && (
                <span className="ml-2">
                  {new Date(nextMaintenance.nextMaintenance.date).toLocaleDateString('pt-BR')}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Manutenções Pendentes */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Pendentes</p>
              <p className="text-sm font-semibold text-gray-900">
                {pendingAlerts.length} {pendingAlerts.length === 1 ? 'alerta' : 'alertas'}
              </p>
            </div>
          </div>
        </div>

        {/* Gastos no Mês */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Gastos no Mês</p>
              <p className="text-sm font-semibold text-gray-900">
                {formatCurrency(totalCostThisMonth)}
              </p>
            </div>
          </div>
        </div>

        {/* Quilometragem */}
        <div className="bg-white rounded-lg border border-gray-200 p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-xs text-gray-500">Quilometragem</p>
              <p className="text-sm font-semibold text-gray-900">
                {vehicle.currentMileage.toLocaleString('pt-BR')} km
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alertas Recentes */}
      {pendingAlerts.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Alertas Importantes</h3>
          <div className="space-y-2">
            {pendingAlerts.slice(0, 3).map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${
                  alert.priority === 'high'
                    ? 'bg-red-50 border-red-200'
                    : 'bg-yellow-50 border-yellow-200'
                }`}
              >
                <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
              </div>
            ))}
          </div>
          {pendingAlerts.length > 3 && (
            <Link
              href={`/vehicle/${vehicle.id}/alerts`}
              className="text-sm text-[#1B3A4B] hover:underline mt-4 inline-block"
            >
              Ver todos os alertas ({pendingAlerts.length})
            </Link>
          )}
        </div>
      )}

      {/* Botão Flutuante */}
      <button
        onClick={onAddMaintenance}
        className="fixed bottom-6 right-6 w-14 h-14 bg-[#1B3A4B] hover:bg-[#1a3342] text-white rounded-full shadow-lg flex items-center justify-center transition-all hover:scale-110 z-50"
        title="Registrar Manutenção"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
      </button>
    </div>
  )
}

