import { neon } from "@neondatabase/serverless"
import { drizzle } from "drizzle-orm/neon-http"
import { complianceRules, products } from "./schema"
import * as dotenv from "dotenv"

dotenv.config({ path: ".env.local" })

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql)

async function seed() {
  console.log("Seeding compliance rules (NBR 8995-1)...")

  await db.insert(complianceRules).values([
    { activityType: "escritorio_open_plan", minLux: 500, minCri: 80, description: "Escritório aberto / Open plan — NBR 8995-1" },
    { activityType: "sala_reuniao", minLux: 500, minCri: 80, description: "Sala de reunião — NBR 8995-1" },
    { activityType: "corredor", minLux: 100, minCri: 40, description: "Corredor — NBR 8995-1" },
    { activityType: "lobby", minLux: 200, minCri: 80, description: "Hall de entrada / Lobby — NBR 8995-1" },
    { activityType: "recepcao", minLux: 300, minCri: 80, description: "Recepção — NBR 8995-1" },
    { activityType: "copa", minLux: 200, minCri: 80, description: "Copa / Cozinha — NBR 8995-1" },
    { activityType: "banheiro", minLux: 200, minCri: 80, description: "Banheiro / Sanitário — NBR 8995-1" },
    { activityType: "sala_diretoria", minLux: 500, minCri: 80, description: "Sala de diretoria — NBR 8995-1" },
    { activityType: "auditorio", minLux: 300, minCri: 80, description: "Auditório — NBR 8995-1" },
    { activityType: "estacionamento", minLux: 75, minCri: 40, description: "Estacionamento interno — NBR 8995-1" },
  ])

  console.log("Seeding LED products...")

  await db.insert(products).values([
    // Spots
    { sku: "CL-SP-001", name: "Spot LED Redondo 7W", brand: "CasaRão", category: "spots", fluxLumens: 630, powerWatts: 7, cctKelvin: 3000, cri: 90, beamAngle: 38, ipRating: "IP20", priceBrl: 45.90 },
    { sku: "CL-SP-002", name: "Spot LED Redondo 12W", brand: "CasaRão", category: "spots", fluxLumens: 1100, powerWatts: 12, cctKelvin: 4000, cri: 90, beamAngle: 60, ipRating: "IP20", priceBrl: 69.90 },
    { sku: "CL-SP-003", name: "Spot LED Direcional 18W", brand: "CasaRão", category: "spots", fluxLumens: 1800, powerWatts: 18, cctKelvin: 3000, cri: 95, beamAngle: 24, ipRating: "IP20", priceBrl: 129.90 },
    { sku: "CL-SP-004", name: "Spot LED Mini 5W", brand: "Lumina", category: "spots", fluxLumens: 450, powerWatts: 5, cctKelvin: 2700, cri: 92, beamAngle: 36, ipRating: "IP20", priceBrl: 35.90 },
    // Linear
    { sku: "CL-LN-001", name: "Perfil Linear LED 1.2m 36W", brand: "CasaRão", category: "linear", fluxLumens: 3600, powerWatts: 36, cctKelvin: 4000, cri: 90, beamAngle: 120, ipRating: "IP20", dimensions: "1200x50x75mm", priceBrl: 289.90 },
    { sku: "CL-LN-002", name: "Perfil Linear LED 0.6m 18W", brand: "CasaRão", category: "linear", fluxLumens: 1800, powerWatts: 18, cctKelvin: 4000, cri: 90, beamAngle: 120, ipRating: "IP20", dimensions: "600x50x75mm", priceBrl: 169.90 },
    { sku: "CL-LN-003", name: "Perfil Linear Embutir 2.4m 72W", brand: "Lumina", category: "linear", fluxLumens: 7200, powerWatts: 72, cctKelvin: 4000, cri: 92, beamAngle: 110, ipRating: "IP20", dimensions: "2400x60x85mm", priceBrl: 549.90 },
    // Pendentes
    { sku: "CL-PD-001", name: "Pendente LED Disco 24W", brand: "CasaRão", category: "pendentes", fluxLumens: 2200, powerWatts: 24, cctKelvin: 3000, cri: 90, beamAngle: 120, ipRating: "IP20", priceBrl: 399.90 },
    { sku: "CL-PD-002", name: "Pendente LED Cilindro 15W", brand: "CasaRão", category: "pendentes", fluxLumens: 1400, powerWatts: 15, cctKelvin: 2700, cri: 92, beamAngle: 90, ipRating: "IP20", priceBrl: 259.90 },
    // Arandelas
    { sku: "CL-AR-001", name: "Arandela LED Retangular 12W", brand: "CasaRão", category: "arandelas", fluxLumens: 1000, powerWatts: 12, cctKelvin: 3000, cri: 80, beamAngle: 120, ipRating: "IP65", priceBrl: 189.90 },
    { sku: "CL-AR-002", name: "Arandela LED Facho Duplo 10W", brand: "Lumina", category: "arandelas", fluxLumens: 900, powerWatts: 10, cctKelvin: 3000, cri: 85, beamAngle: 90, ipRating: "IP65", priceBrl: 149.90 },
    // Plafons
    { sku: "CL-PL-001", name: "Plafon LED Quadrado 18W", brand: "CasaRão", category: "plafons", fluxLumens: 1600, powerWatts: 18, cctKelvin: 4000, cri: 80, beamAngle: 120, ipRating: "IP20", priceBrl: 79.90 },
    { sku: "CL-PL-002", name: "Plafon LED Redondo 24W", brand: "CasaRão", category: "plafons", fluxLumens: 2200, powerWatts: 24, cctKelvin: 4000, cri: 85, beamAngle: 120, ipRating: "IP20", priceBrl: 99.90 },
    // Embutidos
    { sku: "CL-EM-001", name: "Embutido LED Quadrado 15W", brand: "CasaRão", category: "embutidos", fluxLumens: 1350, powerWatts: 15, cctKelvin: 4000, cri: 90, beamAngle: 100, ipRating: "IP20", priceBrl: 89.90 },
    { sku: "CL-EM-002", name: "Embutido LED Redondo 20W", brand: "CasaRão", category: "embutidos", fluxLumens: 1900, powerWatts: 20, cctKelvin: 3000, cri: 92, beamAngle: 100, ipRating: "IP20", priceBrl: 119.90 },
    { sku: "CL-EM-003", name: "Embutido LED Slim 10W", brand: "Lumina", category: "embutidos", fluxLumens: 900, powerWatts: 10, cctKelvin: 4000, cri: 85, beamAngle: 110, ipRating: "IP44", priceBrl: 59.90 },
  ])

  console.log("Seed complete!")
}

seed().catch(console.error)
