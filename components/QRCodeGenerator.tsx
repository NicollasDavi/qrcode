'use client'

import { useState, useEffect, useCallback } from 'react'
import QRCode from 'qrcode'
import { Maintenance, Vehicle, VehicleMaintenanceData } from '@/types/maintenance'
import MaintenanceFormExpanded from './MaintenanceFormExpanded'
import MaintenanceList from './MaintenanceList'
import { generateVehicleId } from '@/utils/vehicleId'
import DataImportExport from './DataImportExport'

interface QRCodeGeneratorProps {
  vehicle: Vehicle
  maintenances: Maintenance[]
  onAddMaintenance: (maintenance: Maintenance) => void
  onRemoveMaintenance: (id: string) => void
}

export default function QRCodeGenerator({
  vehicle,
  maintenances,
  onAddMaintenance,
  onRemoveMaintenance,
}: QRCodeGeneratorProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [size, setSize] = useState(256)
  const [vehicleId, setVehicleId] = useState<string>('')

  // Garantir que o veículo tenha um ID único
  useEffect(() => {
    if (vehicle) {
      // Verificar se o veículo já tem um ID salvo
      const savedData = localStorage.getItem(`vehicle-${vehicle.id}`)
      let id = vehicle.id
      
      if (savedData) {
        try {
          const parsed: VehicleMaintenanceData = JSON.parse(savedData)
          // Usar o ID do veículo como referência
          id = parsed.vehicle.id
        } catch (e) {
          // Se não conseguir ler, gerar novo ID
          id = generateVehicleId(vehicle.plate, vehicle.brand, vehicle.model, vehicle.year)
        }
      } else {
        // Gerar ID único para o veículo
        id = generateVehicleId(vehicle.plate, vehicle.brand, vehicle.model, vehicle.year)
      }
      
      setVehicleId(id)
    }
  }, [vehicle])

  const generateQRCode = useCallback(async () => {
    try {
      setError('')
      
      if (!vehicleId) {
        setError('ID do veículo não encontrado')
        return
      }

      // Salvar dados do veículo no localStorage com o ID como chave
      const vehicleData: VehicleMaintenanceData = {
        vehicle: {
          ...vehicle,
          id: vehicleId,
        },
        maintenances: maintenances,
        createdAt: vehicle.createdAt,
        lastUpdated: new Date().toISOString(),
        version: '1.0',
      }

      // Salvar dados localmente (sempre atualizar quando gerar QR code)
      localStorage.setItem(`vehicle-data-${vehicleId}`, JSON.stringify(vehicleData))
      
      // O QR code contém apenas o ID de referência (pequeno e sempre funciona)
      const qrData = JSON.stringify({
        type: 'vehicle-maintenance',
        vehicleId: vehicleId,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
      })
      
      const url = await QRCode.toDataURL(qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H', // Alta correção pois o ID é pequeno
      })
      setQrCodeUrl(url)
    } catch (err: any) {
      setError('Erro ao gerar QR code: ' + (err.message || 'Erro desconhecido'))
      console.error(err)
    }
  }, [vehicleId, vehicle, maintenances, size])

  useEffect(() => {
    if (vehicleId) {
      generateQRCode()
    } else {
      setQrCodeUrl('')
      setError('')
    }
  }, [vehicleId, maintenances, size, vehicle, generateQRCode])

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `qrcode-${vehicle.plate}-${new Date().toISOString().split('T')[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDataImported = (data: VehicleMaintenanceData) => {
    // Atualizar dados após importação
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      <div className="bg-gray-50 border border-gray-300 p-4">
        <h2 className="text-base font-semibold text-gray-900 mb-1">
          Cadastro de Manutenções
        </h2>
        <p className="text-sm text-gray-700">
          Veículo: <strong>{vehicle.brand} {vehicle.model} {vehicle.year}</strong> - {vehicle.plate}
        </p>
        <p className="text-sm text-gray-700 mt-1">
          Quilometragem atual: {vehicle.currentMileage.toLocaleString('pt-BR')} km
        </p>
      </div>

      <div className="border border-gray-300 p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">
          Nova Manutenção
        </h3>
        <MaintenanceFormExpanded
          onAddMaintenance={onAddMaintenance}
          currentMileage={vehicle.currentMileage}
        />
      </div>

      {maintenances.length > 0 && (
        <div className="border border-gray-300 p-4">
          <MaintenanceList
            maintenances={maintenances}
            onRemoveMaintenance={onRemoveMaintenance}
          />
        </div>
      )}

      {vehicleId && (
        <>
          <div className="border border-gray-300 p-4">
            <div className="mb-4">
              <div className="mb-3">
                <label
                  htmlFor="size-input"
                  className="text-sm font-medium text-gray-900 block mb-2"
                >
                  Tamanho do QR Code: {size}px
                </label>
                <div className="text-xs text-gray-600 mb-2">
                  O QR code contém apenas uma referência ao veículo. Os dados completos são armazenados localmente.
                </div>
                <div className="text-xs text-gray-700 bg-gray-50 border border-gray-200 p-2">
                  <strong>ID do Veículo:</strong> {vehicleId}
                </div>
              </div>
              <input
                id="size-input"
                type="range"
                min="256"
                max="512"
                step="32"
                value={size}
                onChange={(e) => setSize(Number(e.target.value))}
                className="w-full h-1 bg-gray-300 appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>256px</span>
                <span>512px</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3">
              {error}
            </div>
          )}

          {qrCodeUrl && (
            <div className="flex flex-col items-center space-y-4 border border-gray-300 p-4">
              <div className="bg-white p-4 border border-gray-300">
                <img src={qrCodeUrl} alt="QR Code de Manutenção" className="max-w-full h-auto" />
              </div>
              <div className="text-center text-xs text-gray-600 mb-2">
                Este QR code contém apenas uma referência ao veículo.<br />
                Os dados completos são armazenados localmente.
              </div>
              <div className="flex gap-2">
                <button
                  onClick={downloadQRCode}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium border border-gray-900"
                >
                  Download QR Code
                </button>
              </div>
              <div className="w-full">
                <DataImportExport
                  vehicleId={vehicleId}
                  onDataImported={handleDataImported}
                />
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
