import { describe, expect, it } from 'vitest'
import { annualComparison, getPeriod, previewCheckoutIntent, recommendPlan } from './funnel-pricing'

describe('funnel commercial preview', () => {
  it('compares the annual charge against twelve full monthly charges', () => {
    expect(getPeriod('monthly').cents * 12).toBe(15588)
    expect(annualComparison()).toEqual({
      savingsCents: 7589, savingsPercent: 48.7, monthlyEquivalent: '$6.66', isBestValue: true,
    })
  })

  it.each([
    ['weekly', 999, 'PACKAGE_WEEKLY', '$9.99 today, then $9.99 every week.'],
    ['monthly', 1299, 'PACKAGE_MONTHLY', '$12.99 today, then $12.99 every month.'],
    ['annual', 7999, 'PACKAGE_ANNUAL', '$79.99 today, then $79.99 every year.'],
  ] as const)('carries %s into the matching preview package and renewal copy', (period, amount, packageExpected, renewal) => {
    expect(previewCheckoutIntent(period)).toEqual({
      mode: 'preview', currency: 'USD', amountCents: amount, period,
      packageExpected, pricingStatus: 'PRICING_CONFIG_PROPOSED',
    })
    expect(getPeriod(period).renewal).toBe(renewal)
  })

  it('keeps low or unknown volume on Free without changing the commercial offer', () => {
    expect([null, 'light', 'unsure'].map(volume => recommendPlan(volume as null | 'light' | 'unsure'))).toEqual(['free', 'free', 'free'])
    expect(recommendPlan('daily')).toBe('pro')
    expect(recommendPlan('heavy')).toBe('pro')
  })
})
