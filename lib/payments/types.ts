/**
 * Tipos comunes de la capa de pagos.
 *
 * Cada pasarela implementa `PaymentGateway`. El resto de la app consume
 * solo esta interfaz, así podemos agregar Stripe / Flow / Khipu sin
 * cambiar endpoints ni componentes UI.
 */

export type PaymentGatewayName = 'mercadopago' | 'stripe' | 'paypal' | 'flow' | 'khipu'

export type Currency = 'CLP' | 'USD' | 'BRL' | 'COP' | 'PEN' | 'EUR'

export type PaymentStatus =
  | 'pending'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled'
  | 'expired'

/** Lo que se le pide a una pasarela para iniciar una orden. */
export interface CreateOrderInput {
  orderId:        string            // uuid de payment_orders
  serviceValue:   string            // 'auditoria_web' | ...
  serviceLabel:   string            // legible: "Auditoría de Sitio Web"
  amount:         number            // 49.99 (2 decimales)
  currency:       Currency
  buyerEmail?:    string
  buyerName?:     string
  buyerPhone?:    string
  buyerCountry?:  string            // ISO-3166-1 alpha-2 (CL, BR, ...)
  successUrl:     string            // absolute URL
  failureUrl:     string
  pendingUrl:     string
  webhookUrl:     string            // donde la pasarela notifica
  metadata?:      Record<string, unknown>
}

/** Resultado de crear la orden en la pasarela. */
export interface CreateOrderResult {
  gatewayOrderId: string            // preference_id (MP) | session_id (Stripe)
  paymentUrl:     string            // donde redirigir al usuario
  expiresAt?:     Date | null
  rawResponse?:   unknown
}

/** Evento ya normalizado desde el webhook de la pasarela. */
export interface WebhookEvent {
  gateway:        PaymentGatewayName
  type:           string            // 'payment.created' | 'payment.updated' | ...
  gatewayOrderId?: string
  gatewayPaymentId?: string
  status?:        PaymentStatus
  signatureOk:    boolean
  rawPayload:     unknown
}

/** Cada pasarela debe implementar esto. */
export interface PaymentGateway {
  readonly name: PaymentGatewayName

  /** Crear orden y devolver la URL a la que mandar al buyer. */
  createOrder(input: CreateOrderInput): Promise<CreateOrderResult>

  /**
   * Procesar webhook entrante:
   *  1. Validar firma / autenticidad
   *  2. Convertir payload crudo a `WebhookEvent` normalizado
   */
  parseWebhook(
    headers: Record<string, string | undefined>,
    rawBody: string,
  ): Promise<WebhookEvent>

  /** (Opcional) Consulta directa de estado contra la pasarela. */
  fetchOrderStatus?(gatewayOrderId: string): Promise<{
    status:        PaymentStatus
    paymentId?:    string
    paidAt?:       Date | null
  }>
}
