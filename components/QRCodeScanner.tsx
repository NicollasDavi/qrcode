'use client'

import { useState, useEffect, useRef } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import { VehicleMaintenanceData } from '@/types/maintenance'
import { isValidVehicleId } from '@/utils/vehicleId'
import DataImportExport from './DataImportExport'
import MaintenanceList from './MaintenanceList'

export default function QRCodeScanner() {
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<string>('')
  const [maintenanceData, setMaintenanceData] = useState<VehicleMaintenanceData | null>(null)
  const [error, setError] = useState<string>('')
  const [scannedVehicleId, setScannedVehicleId] = useState<string | null>(null)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const scannerContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    return () => {
      // Cleanup ao desmontar o componente
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {
          // Ignorar erros no cleanup
        })
        scannerRef.current = null
      }
    }
  }, [])

  const parseQRCodeResult = (text: string) => {
    // Garantir que está no cliente
    if (typeof window === 'undefined') return false

    try {
      const parsed = JSON.parse(text)
      
      // Verificar se é um QR code de referência (novo formato)
      if (parsed.type === 'vehicle-maintenance' && parsed.vehicleId) {
        // Buscar dados no localStorage usando o ID
        const vehicleId = parsed.vehicleId
        setScannedVehicleId(vehicleId)
        const savedData = localStorage.getItem(`vehicle-data-${vehicleId}`)
        
        if (savedData) {
          try {
            const data: VehicleMaintenanceData = JSON.parse(savedData)
            if (data && data.vehicle && Array.isArray(data.maintenances)) {
              setMaintenanceData(data)
              setError('')
              return true
            }
          } catch (e) {
            setError('Erro ao ler dados do veículo. Os dados podem ter sido removidos.')
            return false
          }
        } else {
          // Veículo não encontrado - mostrar opção de importar
          setError('')
          setMaintenanceData(null)
          return true // Retornar true para mostrar a interface de importação
        }
      }
      // Compatibilidade com formato antigo (dados completos no QR)
      else if (parsed.vehicle && Array.isArray(parsed.maintenances)) {
        const data = parsed as VehicleMaintenanceData
        setMaintenanceData(data)
        setError('')
        return true
      }
      // Verificar se é apenas um ID de veículo
      else if (isValidVehicleId(text)) {
        setScannedVehicleId(text)
        const savedData = typeof window !== 'undefined' ? localStorage.getItem(`vehicle-data-${text}`) : null
        if (savedData) {
          try {
            const data: VehicleMaintenanceData = JSON.parse(savedData)
            setMaintenanceData(data)
            setError('')
            return true
          } catch (e) {
            setError('Erro ao ler dados do veículo')
            return false
          }
        } else {
          // Veículo não encontrado - mostrar opção de importar
          setError('')
          setMaintenanceData(null)
          return true // Retornar true para mostrar a interface de importação
        }
      }
      else {
        setError('QR code não contém dados de manutenção válidos')
        return false
      }
    } catch (err) {
      // Se não for JSON, pode ser texto simples ou ID direto
      if (isValidVehicleId(text)) {
        setScannedVehicleId(text)
        const savedData = typeof window !== 'undefined' ? localStorage.getItem(`vehicle-data-${text}`) : null
        if (savedData) {
          try {
            const data: VehicleMaintenanceData = JSON.parse(savedData)
            setMaintenanceData(data)
            setError('')
            return true
          } catch (e) {
            setError('Erro ao ler dados do veículo')
            return false
          }
        } else {
          // Veículo não encontrado - mostrar opção de importar
          setError('')
          setMaintenanceData(null)
          return true // Retornar true para mostrar a interface de importação
        }
      } else {
        setResult(text)
        setMaintenanceData(null)
        setScannedVehicleId(null)
        return false
      }
    }
  }

  const startScanning = async () => {
    // Parar scanner anterior se existir
    if (scannerRef.current) {
      try {
        await stopScanning()
      } catch (e) {
        // Ignorar erros ao parar scanner anterior
      }
    }

    try {
      setError('')
      setResult('')
      setMaintenanceData(null)
      setScannedVehicleId(null)
      
      // Verificar se o elemento existe
      const containerElement = document.getElementById('scanner-container')
      if (!containerElement) {
        setError('Elemento do scanner não encontrado')
        return
      }

      const scanner = new Html5Qrcode('scanner-container')
      scannerRef.current = scanner

      await scanner.start(
        { facingMode: 'environment' },
        {
          fps: 10,
          qrbox: { width: 250, height: 250 },
        },
        (decodedText) => {
          // Processar resultado
          const success = parseQRCodeResult(decodedText)
          if (success) {
            // Parar após ler com sucesso (com delay para evitar race conditions)
            setTimeout(async () => {
              await stopScanning()
            }, 500)
          }
        },
        (errorMessage) => {
          // Ignora erros de leitura contínua
        }
      )

      setScanning(true)
    } catch (err: any) {
      setError('Erro ao iniciar a câmera. Verifique as permissões.')
      console.error(err)
      setScanning(false)
      scannerRef.current = null
    }
  }

  const stopScanning = async () => {
    if (!scannerRef.current) {
      setScanning(false)
      return
    }

    const scanner = scannerRef.current
    scannerRef.current = null // Limpar referência primeiro para evitar chamadas duplicadas
    setScanning(false)

    try {
      // Verificar se o elemento ainda existe no DOM
      const containerElement = document.getElementById('scanner-container')
      if (!containerElement) {
        // Elemento já foi removido, não precisa parar
        return
      }

      await scanner.stop()
    } catch (err: any) {
      // Ignorar erros específicos relacionados a elementos já removidos ou câmera já parada
      const errorMessage = err?.message || err?.toString() || ''
      if (
        errorMessage.includes('removeChild') ||
        errorMessage.includes('not a child') ||
        errorMessage.includes('AbortError') ||
        errorMessage.includes('media was removed') ||
        errorMessage.includes('camera already stopped')
      ) {
        // Erros esperados - ignorar silenciosamente
        return
      }
      console.error('Erro ao parar scanner:', err)
    } finally {
      try {
        scanner.clear()
      } catch (clearError) {
        // Ignorar erros ao limpar (pode já estar limpo)
      }
    }
  }

  const copyToClipboard = () => {
    const textToCopy = maintenanceData
      ? JSON.stringify(maintenanceData, null, 2)
      : result
    
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy)
      alert('Dados copiados para a área de transferência!')
    }
  }

  const handleDataImported = (data: VehicleMaintenanceData) => {
    setMaintenanceData(data)
    setError('')
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4">
        {!scanning ? (
          <button
            onClick={startScanning}
            className="flex-1 px-4 py-2 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium border border-gray-900"
          >
            Iniciar Leitura
          </button>
        ) : (
          <button
            onClick={stopScanning}
            className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium border border-gray-700"
          >
            Parar Leitura
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-300 text-red-800 px-4 py-3">
          {error}
        </div>
      )}

      <div
        id="scanner-container"
        ref={scannerContainerRef}
        className={`w-full border border-gray-300 overflow-hidden ${
          scanning ? 'min-h-[300px]' : 'min-h-[200px] bg-gray-50 flex items-center justify-center'
        }`}
      >
        {!scanning && (
          <div className="text-center text-gray-600">
            <svg
              className="mx-auto h-12 w-12 mb-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
              />
            </svg>
            <p className="text-sm">Clique em &quot;Iniciar Leitura&quot; para começar</p>
          </div>
        )}
      </div>

      {scannedVehicleId && !maintenanceData && (
        <div className="bg-yellow-50 border border-yellow-300 p-4">
          <h3 className="text-base font-semibold text-yellow-900 mb-2">
            Veículo Não Encontrado Localmente
          </h3>
          <p className="text-sm text-yellow-800 mb-3">
            O QR code foi lido com sucesso, mas os dados deste veículo não estão salvos neste dispositivo.
          </p>
          <div className="text-xs text-yellow-700 mb-3">
            <p><strong>ID do Veículo:</strong> {scannedVehicleId}</p>
          </div>
          <DataImportExport
            vehicleId={scannedVehicleId}
            onDataImported={handleDataImported}
          />
        </div>
      )}

      {maintenanceData && (
        <div className="bg-gray-50 border border-gray-300 p-4">
          <div className="mb-4 pb-4 border-b border-gray-300">
            <h3 className="text-base font-semibold text-gray-900 mb-2">
              Veículo
            </h3>
            <div className="text-sm text-gray-700">
              <p><strong>{maintenanceData.vehicle.brand} {maintenanceData.vehicle.model} {maintenanceData.vehicle.year}</strong></p>
              <p>Placa: {maintenanceData.vehicle.plate}</p>
              <p>Quilometragem atual: {maintenanceData.vehicle.currentMileage.toLocaleString('pt-BR')} km</p>
            </div>
          </div>

          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-gray-900 mb-2">
                Histórico de Manutenções
              </h3>
              <div className="text-sm text-gray-700 space-y-1">
                {maintenanceData.createdAt && (
                  <p>Criado em: {formatDate(maintenanceData.createdAt)}</p>
                )}
                {maintenanceData.lastUpdated && (
                  <p>Atualizado em: {formatDate(maintenanceData.lastUpdated)}</p>
                )}
                <p className="font-medium mt-2">
                  Total de manutenções: {maintenanceData.maintenances.length}
                </p>
              </div>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-4 px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium border border-gray-900"
            >
              Copiar Dados
            </button>
          </div>
          
          <div className="mt-4">
            <MaintenanceList
              maintenances={maintenanceData.maintenances}
              onRemoveMaintenance={() => {}} // Não permite remover ao ler
              showRemoveButton={false}
            />
          </div>
        </div>
      )}

      {result && !maintenanceData && (
        <div className="bg-gray-50 border border-gray-300 p-4">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900 mb-2">
                QR Code lido (texto simples):
              </p>
              <p className="text-gray-700 break-all">
                {result}
              </p>
            </div>
            <button
              onClick={copyToClipboard}
              className="ml-4 px-3 py-1 bg-gray-800 hover:bg-gray-900 text-white text-sm font-medium border border-gray-900"
            >
              Copiar
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
