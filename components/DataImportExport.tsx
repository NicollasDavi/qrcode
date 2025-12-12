'use client'

import { VehicleMaintenanceData } from '@/types/maintenance'

interface DataImportExportProps {
  vehicleId: string
  onDataImported: (data: VehicleMaintenanceData) => void
}

export default function DataImportExport({ vehicleId, onDataImported }: DataImportExportProps) {
  const handleExport = () => {
    const savedData = localStorage.getItem(`vehicle-data-${vehicleId}`)
    if (savedData) {
      const data: VehicleMaintenanceData = JSON.parse(savedData)
      const jsonString = JSON.stringify(data, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `veiculo-${data.vehicle.plate}-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    }
  }

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string
        const data: VehicleMaintenanceData = JSON.parse(content)
        
        // Validar estrutura
        if (data.vehicle && Array.isArray(data.maintenances)) {
          // Salvar dados do veículo
          localStorage.setItem(`vehicle-data-${vehicleId}`, JSON.stringify(data))
          
          // Adicionar veículo à lista de veículos se não existir
          const savedVehicles = localStorage.getItem('vehicles')
          let vehicles = savedVehicles ? JSON.parse(savedVehicles) : []
          
          const vehicleExists = vehicles.some((v: any) => v.id === vehicleId)
          if (!vehicleExists) {
            vehicles.push(data.vehicle)
            localStorage.setItem('vehicles', JSON.stringify(vehicles))
          }
          
          onDataImported(data)
          alert('Dados importados com sucesso!')
        } else {
          alert('Arquivo inválido. O arquivo deve conter dados de manutenção de veículo.')
        }
      } catch (err) {
        alert('Erro ao ler arquivo. Verifique se é um arquivo JSON válido.')
        console.error(err)
      }
    }
    reader.readAsText(file)
    
    // Reset input
    event.target.value = ''
  }

  return (
    <div className="border border-gray-300 p-4 bg-gray-50">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">Importar / Exportar Dados</h4>
      <div className="flex gap-2">
        <button
          onClick={handleExport}
          className="px-3 py-2 bg-gray-800 hover:bg-gray-900 text-white text-xs font-medium border border-gray-900"
        >
          Exportar Dados
        </button>
        <label className="px-3 py-2 bg-white hover:bg-gray-50 text-gray-900 text-xs font-medium border border-gray-300 cursor-pointer">
          Importar Dados
          <input
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />
        </label>
      </div>
      <p className="text-xs text-gray-600 mt-2">
        Exporte os dados para compartilhar ou fazer backup. Importe para restaurar em outro dispositivo.
      </p>
    </div>
  )
}

