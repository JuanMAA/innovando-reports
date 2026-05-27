/**
 * Factory + utilidades de la capa de pagos.
 *
 * Uso desde un endpoint:
 *
 *   import { getGateway, getPricingForService, makeOrderUrls } from '@/lib/payments'
 *
 *   const gw = getGateway('mercadopago')
 *   const pricing = getPricingForService('auditoria_web', 'CL')
 *   const result = await gw.createOrder({...})
 */

import { mercadopagoGateway } from './mercadopago'
import { stripeGateway }      from './stripe'
import { paypalGateway }      from './paypal'
import type { PaymentGateway, PaymentGatewayName, Currency } from './types'

export * from './types'

/** Retorna el adapter de la pasarela pedida. */
export function getGateway(name: PaymentGatewayName): PaymentGateway {
  switch (name) {
    case 'mercadopago': return mercadopagoGateway
    case 'stripe':      return stripeGateway
    case 'paypal':      return paypalGateway as PaymentGateway
    case 'flow':
    case 'khipu':
      throw new Error(`gateway "${name}" no implementado todavía`)
    default: {
      const _exhaustive: never = name
      throw new Error(`gateway desconocido: ${_exhaustive}`)
    }
  }
}

/**
 * Estrategia de ruteo:
 *   - Chile        → Mercado Pago (cuenta local, sin fees forex)
 *   - Resto mundo  → Stripe (default global, mejor UX en card)
 *   - PayPal queda disponible como opción explícita en el checkout.
 */
export function getDefaultGateway(country?: string | null): PaymentGatewayName {
  const c = (country ?? '').toUpperCase()
  if (c === 'CL') return 'mercadopago'
  return 'stripe'
}

/** Pasarelas disponibles para mostrar como opciones al usuario. */
export function getAvailableGateways(country?: string | null): PaymentGatewayName[] {
  const c = (country ?? '').toUpperCase()
  if (c === 'CL') {
    // En Chile permitimos MP (local) + PayPal como respaldo internacional.
    return ['mercadopago', 'paypal']
  }
  return ['stripe', 'paypal']
}

/* ── Pricing por servicio ────────────────────────────────────────
 * Fuente de verdad de los precios "list price". Cada servicio puede tener
 * precios distintos por país. Si no hay match exacto, se usa el default
 * por currency. Editar acá hasta que migremos a tabla en BD.
 */

export interface ServicePrice {
  amount:   number
  currency: Currency
  label:    string
}

type PricingTable = Record<string, Partial<Record<string, ServicePrice>>>

const PRICING: PricingTable = {
  // ── Desbloqueo de informe (paywall) ──
  // Se usa cuando un informe en innovando-reports requiere pagar para verse.
  // Fallback: si hay precio configurado en `country_pricing` (BD), gana el de BD.
  reporte_completo: {
    CL: { amount:  9_990, currency: 'CLP', label: 'Informe de Presencia Digital — desbloqueo' },
    default: { amount: 12, currency: 'USD', label: 'Digital Presence Report — unlock' },
  },
  huella_digital: {
    CL: { amount: 14_990, currency: 'CLP', label: 'Informe de Huella Digital — desbloqueo' },
    default: { amount: 19, currency: 'USD', label: 'Digital Footprint Report — unlock' },
  },
  // ── Pago único ──
  auditoria_web: {
    CL: { amount:  49_000, currency: 'CLP', label: 'Auditoría de Sitio Web' },
    default: { amount: 59, currency: 'USD', label: 'Website Audit' },
  },
  informe_presencia_digital: {
    CL: { amount:  29_000, currency: 'CLP', label: 'Informe de Presencia Digital' },
    default: { amount: 35, currency: 'USD', label: 'Digital Presence Report' },
  },
  // Huella digital — persona o empresa
  personal: {
    CL: { amount:  19_000, currency: 'CLP', label: 'Auditoría de Huella Digital (Persona)' },
    default: { amount: 25, currency: 'USD', label: 'Digital Footprint Audit (Personal)' },
  },
  empresa: {
    CL: { amount:  89_000, currency: 'CLP', label: 'Auditoría de Huella Digital (Empresa)' },
    default: { amount: 99, currency: 'USD', label: 'Digital Footprint Audit (Company)' },
  },
  // Limpieza
  limpieza_huella: {
    CL: { amount: 149_000, currency: 'CLP', label: 'Limpieza de Huella Digital' },
    default: { amount: 169, currency: 'USD', label: 'Digital Footprint Cleanup' },
  },
}

export function getPricingForService(
  serviceValue: string,
  country?: string | null,
): ServicePrice | null {
  const table = PRICING[serviceValue]
  if (!table) return null
  const key = (country ?? '').toUpperCase()
  return (key && table[key]) || table.default || null
}

/** Build absolute URLs para success/failure/pending + webhook por pasarela. */
export function makeOrderUrls(
  siteUrl: string,
  locale: string,
  orderId: string,
  gateway: PaymentGatewayName,
) {
  return {
    successUrl: `${siteUrl}/${locale}/checkout/${orderId}/success`,
    failureUrl: `${siteUrl}/${locale}/checkout/${orderId}/failed`,
    pendingUrl: `${siteUrl}/${locale}/checkout/${orderId}/pending`,
    webhookUrl: `${siteUrl}/api/payments/webhook/${gateway}`,
  }
}
