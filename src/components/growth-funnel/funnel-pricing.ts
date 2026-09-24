// Preview commercial configuration only. No billing products or quota enforcement.
export const PRICING_CONFIG_STATUS = 'PRICING_CONFIG_PROPOSED' as const
export type Period = 'weekly' | 'monthly' | 'annual'
export type Plan = 'free' | 'pro'
export type Volume = 'light' | 'daily' | 'heavy' | 'unsure'
export type Habit = 'forget' | 'find' | 'organized' | 'new'

export const PLAN_CAPACITY = {
  free: { saves: 1000, aiSavesPerMonth: 100, chatMessagesPerMonth: 25 },
  pro: { saves: null, aiSavesPerMonth: 1000, chatMessagesPerMonth: 500 },
} as const

export const PACKAGE_EXPECTED: Record<Period, string> = {
  weekly: 'PACKAGE_WEEKLY',
  monthly: 'PACKAGE_MONTHLY',
  annual: 'PACKAGE_ANNUAL',
}

export const PERIODS: ReadonlyArray<{
  id: Period; label: string; cents: number; unit: string; framing: string
}> = [
  { id: 'weekly', label: 'Weekly', cents: 1000, unit: 'week', framing: 'A week at a time' },
  { id: 'monthly', label: 'Monthly', cents: 1299, unit: 'month', framing: 'Stay flexible' },
  { id: 'annual', label: 'Annual', cents: 7900, unit: 'year', framing: 'Best value' },
]

export function formatPrice(cents: number) {
  return `$${(cents / 100).toFixed(cents % 100 === 0 ? 0 : 2)}`
}

export function getPeriod(period: Period) {
  const option = PERIODS.find(item => item.id === period)!
  const price = formatPrice(option.cents)
  return { ...option, price, renewal: `${price} today, then ${price} every ${option.unit}.` }
}

export function annualComparison() {
  const annual = getPeriod('annual').cents
  const twelveMonths = getPeriod('monthly').cents * 12
  const savingsCents = twelveMonths - annual
  return {
    savingsCents,
    savingsPercent: Math.round(savingsCents / twelveMonths * 1000) / 10,
    monthlyEquivalent: formatPrice(Math.round(annual / 12)),
    isBestValue: annual < twelveMonths && annual < getPeriod('weekly').cents * 52,
  }
}

export function recommendPlan(volume: Volume | null): Plan {
  return volume === 'daily' || volume === 'heavy' ? 'pro' : 'free'
}

export function resultFraming(habit: Habit | null, sources: string[]) {
  if (habit === 'find') return 'Keep more of what matters searchable and ready when you need it.'
  if (habit === 'forget') return 'Turn more of your saves into summaries, key ideas and conversations.'
  if (habit === 'organized') return 'Keep your system. Let Sted do more of the reading.'
  if (sources.length > 1 || sources.includes('Everywhere')) return 'Bring what you save into one Library — and organize it around Projects.'
  return 'Free lets you experience it. Pro gives you substantially more room.'
}

// These are expected package placeholders, never SDK identifiers or checkout URLs.
export function previewCheckoutIntent(period: Period) {
  return {
    mode: 'preview' as const,
    currency: 'USD' as const,
    amountCents: getPeriod(period).cents,
    period,
    packageExpected: PACKAGE_EXPECTED[period],
    pricingStatus: PRICING_CONFIG_STATUS,
  }
}
