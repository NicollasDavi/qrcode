export interface Part {
  id: string
  name: string
  code?: string
  brand?: string
  compatibility?: string
  warrantyMonths?: number
  warrantyKm?: number
  warrantyExpires?: string
}

export interface Service {
  id: string
  name: string
  description?: string
  category: 'preventiva' | 'corretiva' | 'revisão' | 'inspeção' | 'outro'
}

export interface Document {
  id: string
  type: 'photo' | 'invoice' | 'report' | 'video' | 'other'
  url: string
  name: string
  uploadedAt: string
}

export interface Maintenance {
  id: string
  date: string
  mileage: number
  service: Service
  parts: Part[]
  mechanic: {
    name: string
    workshop?: string
    location: string
    contact?: string
  }
  costs: {
    total: number
    labor?: number
    parts?: number
    other?: number
    breakdown?: Array<{ item: string; value: number }>
  }
  description?: string
  documents: Document[]
  nextMaintenance?: {
    mileage?: number
    date?: string
    type: string
  }
  alerts?: string[]
}

export interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plate: string
  color?: string
  chassis?: string
  currentMileage: number
  fuelType?: 'gasolina' | 'etanol' | 'flex' | 'diesel' | 'elétrico' | 'híbrido'
  createdAt: string
  lastUpdated: string
}

export interface VehicleMaintenanceData {
  vehicle: Vehicle
  maintenances: Maintenance[]
  createdAt: string
  lastUpdated: string
  version: string
}

export interface Alert {
  id: string
  type: 'mileage' | 'time' | 'warranty' | 'recall' | 'custom'
  title: string
  message: string
  priority: 'low' | 'medium' | 'high'
  dueDate?: string
  dueMileage?: number
  dismissed?: boolean
  createdAt: string
}

