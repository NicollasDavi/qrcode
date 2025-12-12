'use client'

import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import QRCode from 'qrcode'
import { Vehicle } from '@/types/maintenance'
import DataImportExport from '@/components/DataImportExport'

export default function QRCodePage() {
  const params = useParams()
  const router = useRouter()
  const vehicleId = params.id as string

  const [vehicle, setVehicle] = useState<Vehicle | null>(null)
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('')
  const [size, setSize] = useState(300)

  useEffect(() => {
    const savedVehicles = localStorage.getItem('vehicles')
    if (savedVehicles) {
      const vehicles: Vehicle[] = JSON.parse(savedVehicles)
      const foundVehicle = vehicles.find(v => v.id === vehicleId)
      if (foundVehicle) {
        setVehicle(foundVehicle)
      }
    }
  }, [vehicleId])

  useEffect(() => {
    if (vehicle) {
      generateQRCode()
    }
  }, [vehicle, size])

  const generateQRCode = async () => {
    if (!vehicle) return

    try {
      const qrData = JSON.stringify({
        type: 'vehicle-maintenance',
        vehicleId: vehicle.id,
        plate: vehicle.plate,
        brand: vehicle.brand,
        model: vehicle.model,
        year: vehicle.year,
      })

      const url = await QRCode.toDataURL(qrData, {
        width: size,
        margin: 2,
        color: {
          dark: '#1B3A4B',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      })
      setQrCodeUrl(url)
    } catch (err) {
      console.error('Erro ao gerar QR code:', err)
    }
  }

  const downloadQRCode = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `qrcode-${vehicle?.plate}-${new Date().toISOString().split('T')[0]}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const shareQRCode = async () => {
    if (qrCodeUrl && navigator.share) {
      try {
        const response = await fetch(qrCodeUrl)
        const blob = await response.blob()
        const file = new File([blob], `qrcode-${vehicle?.plate}.png`, { type: 'image/png' })
        await navigator.share({
          title: `QR Code - ${vehicle?.brand} ${vehicle?.model}`,
          files: [file],
        })
      } catch (err) {
        console.error('Erro ao compartilhar:', err)
      }
    } else {
      // Fallback: copiar para clipboard
      downloadQRCode()
    }
  }

  const printLabel = () => {
    const printWindow = window.open('', '_blank')
    if (printWindow && qrCodeUrl) {
      printWindow.document.write(`
        <html>
          <head>
            <title>QR Code - ${vehicle?.plate}</title>
            <style>
              body {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 40px;
                font-family: Arial, sans-serif;
              }
              img {
                max-width: 300px;
                margin-bottom: 20px;
              }
              .info {
                text-align: center;
                font-size: 14px;
                color: #333;
              }
            </style>
          </head>
          <body>
            <img src="${qrCodeUrl}" alt="QR Code" />
            <div class="info">
              <p><strong>${vehicle?.brand} ${vehicle?.model} ${vehicle?.year}</strong></p>
              <p>Placa: ${vehicle?.plate}</p>
            </div>
          </body>
        </html>
      `)
      printWindow.document.close()
      printWindow.print()
    }
  }

  if (!vehicle) {
    return (
      <div className="min-h-screen bg-[#F4F4F4] flex items-center justify-center">
        <p className="text-gray-600">Carregando...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">QR Code do Veículo</h1>
            <p className="text-gray-600">
              {vehicle.brand} {vehicle.model} {vehicle.year} • {vehicle.plate}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center mb-6">
            {qrCodeUrl ? (
              <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
                <img src={qrCodeUrl} alt="QR Code" className="w-full max-w-xs" />
              </div>
            ) : (
              <div className="w-64 h-64 bg-gray-100 rounded-lg flex items-center justify-center">
                <p className="text-gray-400">Gerando QR Code...</p>
              </div>
            )}
          </div>

          {/* Controles */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamanho: {size}px
            </label>
            <input
              type="range"
              min="200"
              max="500"
              step="50"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Botões */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-6">
            <button
              onClick={downloadQRCode}
              className="px-4 py-3 bg-[#1B3A4B] hover:bg-[#1a3342] text-white rounded-lg font-medium transition-colors"
            >
              Baixar QR
            </button>
            <button
              onClick={shareQRCode}
              className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              Compartilhar
            </button>
            <button
              onClick={printLabel}
              className="px-4 py-3 bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 rounded-lg font-medium transition-colors"
            >
              Imprimir Etiqueta
            </button>
          </div>

          {/* Informações do Veículo */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">Informações do Veículo</h3>
            <div className="grid grid-cols-2 gap-2 text-sm text-gray-600">
              <div>
                <span className="font-medium">Marca:</span> {vehicle.brand}
              </div>
              <div>
                <span className="font-medium">Modelo:</span> {vehicle.model}
              </div>
              <div>
                <span className="font-medium">Ano:</span> {vehicle.year}
              </div>
              <div>
                <span className="font-medium">Placa:</span> {vehicle.plate}
              </div>
              {vehicle.color && (
                <div>
                  <span className="font-medium">Cor:</span> {vehicle.color}
                </div>
              )}
              {vehicle.fuelType && (
                <div>
                  <span className="font-medium">Combustível:</span> {vehicle.fuelType}
                </div>
              )}
            </div>
          </div>

          {/* Importar/Exportar */}
          <DataImportExport
            vehicleId={vehicleId}
            onDataImported={() => {}}
          />

          {/* Voltar */}
          <div className="mt-6 text-center">
            <button
              onClick={() => router.push(`/vehicle/${vehicleId}`)}
              className="text-[#1B3A4B] hover:underline"
            >
              ← Voltar para Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

