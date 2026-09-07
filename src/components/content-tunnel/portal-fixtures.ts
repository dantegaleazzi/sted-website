import { realContentFixtures } from '../source-cards/real-content-fixtures'

// Temporary duplicate authorized to keep eight cards on each side.
// Replace this final slot with a new real item when supplied.
export const portalFixtures = [
  ...realContentFixtures,
  { ...realContentFixtures[0], id: 'portal-pending-replacement-revenuecat' },
]
