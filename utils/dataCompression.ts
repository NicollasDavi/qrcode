import { VehicleMaintenanceData } from '@/types/maintenance'

// Comprimir dados removendo espaços e usando formato compacto
export function compressData(data: VehicleMaintenanceData): string {
  // Criar versão compacta do objeto
  const compressed = {
    v: data.version,
    vh: {
      id: data.vehicle.id,
      b: data.vehicle.brand,
      m: data.vehicle.model,
      y: data.vehicle.year,
      p: data.vehicle.plate,
      c: data.vehicle.color,
      ch: data.vehicle.chassis,
      km: data.vehicle.currentMileage,
      f: data.vehicle.fuelType,
    },
    m: data.maintenances.map(m => ({
      id: m.id,
      d: m.date,
      km: m.mileage,
      s: {
        id: m.service.id,
        n: m.service.name,
        d: m.service.description,
        c: m.service.category,
      },
      p: m.parts.map(part => ({
        id: part.id,
        n: part.name,
        c: part.code,
        b: part.brand,
        wm: part.warrantyMonths,
        wk: part.warrantyKm,
        we: part.warrantyExpires,
      })),
      me: {
        n: m.mechanic.name,
        w: m.mechanic.workshop,
        l: m.mechanic.location,
        ct: m.mechanic.contact,
      },
      co: {
        t: m.costs.total,
        l: m.costs.labor,
        pt: m.costs.parts,
        o: m.costs.other,
      },
      de: m.description,
      nm: m.nextMaintenance ? {
        km: m.nextMaintenance.mileage,
        d: m.nextMaintenance.date,
        t: m.nextMaintenance.type,
      } : undefined,
    })),
    ca: data.createdAt,
    lu: data.lastUpdated,
  }

  return JSON.stringify(compressed)
}

// Descomprimir dados
export function decompressData(compressed: string): VehicleMaintenanceData {
  const data = JSON.parse(compressed)
  
  return {
    version: data.v,
    vehicle: {
      id: data.vh.id,
      brand: data.vh.b,
      model: data.vh.m,
      year: data.vh.y,
      plate: data.vh.p,
      color: data.vh.c,
      chassis: data.vh.ch,
      currentMileage: data.vh.km,
      fuelType: data.vh.f,
      createdAt: data.ca,
      lastUpdated: data.lu,
    },
    maintenances: data.m.map((m: any) => ({
      id: m.id,
      date: m.d,
      mileage: m.km,
      service: {
        id: m.s.id,
        name: m.s.n,
        description: m.s.d,
        category: m.s.c,
      },
      parts: m.p.map((part: any) => ({
        id: part.id,
        name: part.n,
        code: part.c,
        brand: part.b,
        warrantyMonths: part.wm,
        warrantyKm: part.wk,
        warrantyExpires: part.we,
      })),
      mechanic: {
        name: m.me.n,
        workshop: m.me.w,
        location: m.me.l,
        contact: m.me.ct,
      },
      costs: {
        total: m.co.t,
        labor: m.co.l,
        parts: m.co.pt,
        other: m.co.o,
      },
      description: m.de,
      documents: [],
      nextMaintenance: m.nm ? {
        mileage: m.nm.km,
        date: m.nm.d,
        type: m.nm.t,
      } : undefined,
    })),
    createdAt: data.ca,
    lastUpdated: data.lu,
  }
}

// Verificar tamanho máximo recomendado para QR code (depende do nível de correção)
// Nível H (alta correção): ~2953 caracteres alfanuméricos
// Nível M (média correção): ~4296 caracteres alfanuméricos
export const MAX_QR_SIZE = 2500 // Usando um limite conservador

export function isDataTooLarge(data: string): boolean {
  return data.length > MAX_QR_SIZE
}

