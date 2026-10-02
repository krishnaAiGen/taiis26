import { FEES, EARLY_BIRD_CUTOFF_ISO, TEST_CATEGORY, TEST_FEE } from "./fees.ts"

/**
 * The US$1 live-payment test entry is only priceable while
 * ALLOW_TEST_CATEGORY is "true".
 *
 * Hiding the option in the browser is not enough on its own: the category
 * string ships in the public bundle whenever it is shown, so without this
 * server-side gate anyone who read it once could keep registering for a dollar
 * after the test window closed. Defaults to disabled.
 */
function testCategoryEnabled(): boolean {
  return Deno.env.get("ALLOW_TEST_CATEGORY") === "true"
}

/**
 * PayPal rejects decimals for zero-decimal currencies. TWD is one of them.
 * https://developer.paypal.com/api/rest/reference/currency-codes/
 */
const ZERO_DECIMAL = new Set(["TWD", "JPY", "HUF", "KRW", "VND", "CLP"])

export type Currency = "USD" | "TWD"

/** Which provider collects each currency. */
export type PaymentMethod = "paypal" | "ntd"

export interface Price {
  currency: Currency
  /** Decimal string in the exact shape PayPal expects for this currency. */
  value: string
  /** Numeric amount, for storing alongside the registration. */
  amount: number
  isEarlyBird: boolean
}

export function isCurrency(value: unknown): value is Currency {
  return value === "USD" || value === "TWD"
}

/**
 * The merchant account is registered in Taiwan, and PayPal blocks payments
 * between two Taiwan-registered accounts — so NT$ is collected by a separate
 * Taiwanese provider rather than through PayPal.
 */
export function methodForCurrency(currency: Currency): PaymentMethod {
  return currency === "TWD" ? "ntd" : "paypal"
}

export function formatAmount(amount: number, currency: Currency): string {
  if (ZERO_DECIMAL.has(currency)) {
    if (!Number.isInteger(amount)) {
      throw new Error(`${currency} cannot carry decimals; got ${amount}`)
    }
    return String(amount)
  }
  return amount.toFixed(2)
}

/**
 * Resolves the amount to charge for a category in a given currency.
 *
 * The browser chooses the currency but never the amount — that is recomputed
 * here from the published fee table and the early-bird cutoff, so a tampered
 * client cannot pay less than the advertised fee.
 */
export function priceFor(
  registrationCategory: string,
  currency: Currency,
  now: Date,
): Price {
  const isTest = registrationCategory === TEST_CATEGORY
  if (isTest && !testCategoryEnabled()) {
    throw new Error(
      "The test registration category is not enabled. Set ALLOW_TEST_CATEGORY=true to use it.",
    )
  }

  const fee = isTest ? TEST_FEE : FEES[registrationCategory]
  if (!fee) {
    throw new Error(`Unknown registration category: ${registrationCategory}`)
  }

  const isEarlyBird = now.getTime() <= Date.parse(EARLY_BIRD_CUTOFF_ISO)

  const amount =
    currency === "TWD"
      ? isEarlyBird
        ? fee.earlyBirdNtd
        : fee.lateNtd
      : isEarlyBird
        ? fee.earlyBirdUsd
        : fee.lateUsd

  return { currency, value: formatAmount(amount, currency), amount, isEarlyBird }
}
