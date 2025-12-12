'use client'

import { useRouter } from 'next/navigation'
import QRCodeScanner from '@/components/QRCodeScanner'

export default function ScanPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-[#F4F4F4]">
      <div className="container mx-auto px-4 py-6 max-w-4xl">
        <div className="mb-6">
          <button
            onClick={() => router.push('/')}
            className="text-[#1B3A4B] hover:underline mb-4"
          >
            ← Voltar
          </button>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Ler QR Code
          </h1>
          <p className="text-gray-600">
            Escaneie o QR code de um veículo para visualizar o histórico de manutenções
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <QRCodeScanner />
        </div>
      </div>
    </div>
  )
}

