import crypto from "crypto"

export class PhonePePayment {
  private merchantId: string
  private apiKey: string
  private isTestMode: boolean

  constructor(merchantId: string, apiKey: string, isTestMode: boolean = true) {
    this.merchantId = merchantId
    this.apiKey = apiKey
    this.isTestMode = isTestMode
  }

  private getBaseUrl(): string {
    return this.isTestMode
      ? "https://api-preprod.phonepe.com/apis/pg-sandbox"
      : "https://api.phonepe.com/apis/pg"
  }

  async createOrder(amount: number, orderId: string, userId: string, planType: string) {
    const payload = {
      merchantId: this.merchantId,
      merchantTransactionId: orderId,
      merchantUserId: userId,
      amount: amount * 100, // Convert to paise
      redirectUrl: `${process.env.NEXT_PUBLIC_APP_URL}/payment/success`,
      redirectMode: "REDIRECT",
      callbackUrl: `${process.env.NEXT_PUBLIC_APP_URL}/api/payments/phonepe/webhook`,
      paymentInstrument: {
        type: "PAY_PAGE"
      }
    }

    const payloadString = JSON.stringify(payload)
    const base64Payload = Buffer.from(payloadString).toString('base64')

    const endpoint = "/pg/v1/pay"
    const url = `${this.getBaseUrl()}${endpoint}`

    // Create X-VERIFY header
    const xVerify = crypto
      .createHash('sha256')
      .update(base64Payload + endpoint + this.apiKey)
      .digest('hex') + "###1"

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-VERIFY': xVerify,
        'X-MERCHANT-ID': this.merchantId
      },
      body: JSON.stringify({ request: base64Payload })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'PhonePe payment creation failed')
    }

    return {
      orderId: orderId,
      amount: amount,
      currency: "INR",
      paymentUrl: data.data?.instrumentResponse?.redirectInfo?.url || data.data?.payPageUrl,
      merchantTransactionId: orderId
    }
  }

  verifyPayment(merchantTransactionId: string, phonepeTransactionId: string, amount: number) {
    // PhonePe verification logic would go here
    // This is a simplified version
    return {
      isValid: true,
      transactionId: phonepeTransactionId,
      amount: amount
    }
  }
}
