interface UserTotalsSection {
  '_id': { 'status': 'draft' },
  'suspended': 0,
  'count': 12
}

export type UserTotalsKeys = 'draft' | 'active' | 'pendingAccess' | 'pendingSignature'

export type UserTotalsDto = Record<UserTotalsKeys, UserTotalsSection>
