// Gerar ID único para o veículo baseado em suas características
export function generateVehicleId(plate: string, brand: string, model: string, year: number): string {
  // Criar um hash simples baseado nas características do veículo
  const baseString = `${plate}-${brand}-${model}-${year}`.toUpperCase().replace(/\s+/g, '-')
  // Adicionar timestamp para garantir unicidade
  const timestamp = Date.now().toString(36)
  return `VEH-${baseString}-${timestamp}`
}

// Validar formato do ID
export function isValidVehicleId(id: string): boolean {
  return id.startsWith('VEH-') && id.length > 10
}

// Extrair informações básicas do ID (se possível)
export function parseVehicleId(id: string): { plate?: string; brand?: string; model?: string; year?: number } | null {
  if (!isValidVehicleId(id)) return null
  
  const parts = id.split('-')
  if (parts.length < 3) return null
  
  // Tentar extrair informações se o formato permitir
  return {
    plate: parts[1]?.length === 7 ? parts[1] : undefined,
  }
}

