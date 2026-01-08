/**
 * Hotel Booking AI - Loyalty Handler
 * Handles loyalty program, points, and member benefits
 */

import type { ConversationContext, ToolResult } from '../types';
import { registerToolHandler } from '../engine-manager';

// ========================================
// LOYALTY DATA STRUCTURES
// ========================================

interface LoyaltyMember {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  points: number;
  lifetimePoints: number;
  tierProgressPoints: number;
  nextTierThreshold: number;
  joinDate: string;
  expiringPoints?: {
    amount: number;
    expiryDate: string;
  };
  preferences: Record<string, any>;
}

interface LoyaltyTransaction {
  id: string;
  memberId: string;
  type: 'earn' | 'redeem' | 'expire' | 'bonus' | 'adjustment';
  points: number;
  description: string;
  bookingId?: string;
  timestamp: string;
}

// In-memory storage (in production, use database)
const loyaltyMembers = new Map<string, LoyaltyMember>();
const loyaltyTransactions: LoyaltyTransaction[] = [];

// Tier thresholds
const TIER_THRESHOLDS = {
  bronze: 0,
  silver: 5000,
  gold: 15000,
  platinum: 50000
};

const TIER_BENEFITS = {
  bronze: ['Earn 1 point per $1', 'Member-only rates', 'Birthday bonus'],
  silver: ['Earn 1.25 points per $1', 'Late checkout', 'Welcome drink', 'Priority support'],
  gold: ['Earn 1.5 points per $1', 'Room upgrade when available', 'Lounge access', 'Free breakfast'],
  platinum: ['Earn 2 points per $1', 'Guaranteed upgrade', 'Suite access', 'Personal concierge', 'Airport transfer']
};

// ========================================
// GET LOYALTY ACCOUNT HANDLER
// ========================================

interface GetLoyaltyAccountParams {
  memberId?: string;
  email?: string;
}

async function handleGetLoyaltyAccount(
  params: GetLoyaltyAccountParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    let member: LoyaltyMember | undefined;

    if (params.memberId) {
      member = loyaltyMembers.get(params.memberId);
    } else if (params.email) {
      member = Array.from(loyaltyMembers.values()).find(m => m.email === params.email);
    } else if (context.metadata.loyaltyMemberId) {
      member = loyaltyMembers.get(context.metadata.loyaltyMemberId);
    }

    if (!member) {
      return {
        success: false,
        data: null,
        error: 'Loyalty member not found'
      };
    }

    const tierBenefits = TIER_BENEFITS[member.tier];
    const nextTier = member.tier === 'platinum' ? null
      : member.tier === 'gold' ? 'platinum'
      : member.tier === 'silver' ? 'gold'
      : 'silver';

    const pointsToNextTier = nextTier
      ? TIER_THRESHOLDS[nextTier] - member.tierProgressPoints
      : 0;

    return {
      success: true,
      data: {
        memberId: member.id,
        name: `${member.firstName} ${member.lastName}`,
        email: member.email,
        tier: member.tier,
        points: member.points,
        lifetimePoints: member.lifetimePoints,
        tierProgress: {
          currentPoints: member.tierProgressPoints,
          nextTier,
          pointsToNextTier,
          progressPercent: nextTier
            ? Math.round((member.tierProgressPoints / TIER_THRESHOLDS[nextTier]) * 100)
            : 100
        },
        benefits: tierBenefits,
        expiringPoints: member.expiringPoints,
        memberSince: member.joinDate
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get loyalty account'
    };
  }
}

registerToolHandler('get_loyalty_account', handleGetLoyaltyAccount);

// ========================================
// GET POINTS BALANCE HANDLER
// ========================================

interface GetPointsBalanceParams {
  memberId?: string;
}

async function handleGetPointsBalance(
  params: GetPointsBalanceParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const memberId = params.memberId || context.metadata.loyaltyMemberId;

    if (!memberId) {
      return {
        success: false,
        data: null,
        error: 'Member ID required'
      };
    }

    const member = loyaltyMembers.get(memberId);
    if (!member) {
      return {
        success: false,
        data: null,
        error: 'Loyalty member not found'
      };
    }

    // Get recent transactions
    const recentTransactions = loyaltyTransactions
      .filter(t => t.memberId === memberId)
      .slice(-5)
      .map(t => ({
        type: t.type,
        points: t.points,
        description: t.description,
        date: t.timestamp
      }));

    return {
      success: true,
      data: {
        memberId: member.id,
        availablePoints: member.points,
        lifetimePoints: member.lifetimePoints,
        tier: member.tier,
        expiringPoints: member.expiringPoints,
        recentTransactions
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get points balance'
    };
  }
}

registerToolHandler('get_points_balance', handleGetPointsBalance);

// ========================================
// EARN POINTS HANDLER
// ========================================

interface EarnPointsParams {
  memberId?: string;
  email?: string;
  amount: number;
  bookingId?: string;
  description?: string;
  bonusMultiplier?: number;
}

async function handleEarnPoints(
  params: EarnPointsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    let member: LoyaltyMember | undefined;

    if (params.memberId) {
      member = loyaltyMembers.get(params.memberId);
    } else if (params.email) {
      member = Array.from(loyaltyMembers.values()).find(m => m.email === params.email);
    }

    if (!member) {
      return {
        success: false,
        data: null,
        error: 'Loyalty member not found'
      };
    }

    // Calculate points based on tier
    const tierMultipliers = {
      bronze: 1,
      silver: 1.25,
      gold: 1.5,
      platinum: 2
    };

    const basePoints = Math.round(params.amount);
    const tierMultiplier = tierMultipliers[member.tier];
    const bonusMultiplier = params.bonusMultiplier || 1;
    const earnedPoints = Math.round(basePoints * tierMultiplier * bonusMultiplier);

    // Update member points
    member.points += earnedPoints;
    member.lifetimePoints += earnedPoints;
    member.tierProgressPoints += earnedPoints;

    // Check for tier upgrade
    let tierUpgrade: string | null = null;
    if (member.tier === 'bronze' && member.tierProgressPoints >= TIER_THRESHOLDS.silver) {
      member.tier = 'silver';
      tierUpgrade = 'silver';
    } else if (member.tier === 'silver' && member.tierProgressPoints >= TIER_THRESHOLDS.gold) {
      member.tier = 'gold';
      tierUpgrade = 'gold';
    } else if (member.tier === 'gold' && member.tierProgressPoints >= TIER_THRESHOLDS.platinum) {
      member.tier = 'platinum';
      tierUpgrade = 'platinum';
    }

    // Record transaction
    const transaction: LoyaltyTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      memberId: member.id,
      type: 'earn',
      points: earnedPoints,
      description: params.description || `Earned from booking ${params.bookingId || 'N/A'}`,
      bookingId: params.bookingId,
      timestamp: new Date().toISOString()
    };
    loyaltyTransactions.push(transaction);

    return {
      success: true,
      data: {
        memberId: member.id,
        pointsEarned: earnedPoints,
        breakdown: {
          basePoints,
          tierMultiplier,
          bonusMultiplier,
          total: earnedPoints
        },
        newBalance: member.points,
        tierUpgrade,
        tier: member.tier,
        transactionId: transaction.id,
        message: tierUpgrade
          ? `Congratulations! You earned ${earnedPoints} points and upgraded to ${tierUpgrade}!`
          : `You earned ${earnedPoints} points!`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to earn points'
    };
  }
}

registerToolHandler('earn_points', handleEarnPoints as any);

// ========================================
// REDEEM POINTS HANDLER
// ========================================

interface RedeemPointsParams {
  memberId?: string;
  points: number;
  rewardType: 'discount' | 'free-night' | 'upgrade' | 'experience' | 'transfer';
  rewardDetails?: Record<string, any>;
}

async function handleRedeemPoints(
  params: RedeemPointsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const memberId = params.memberId || context.metadata.loyaltyMemberId;

    if (!memberId) {
      return {
        success: false,
        data: null,
        error: 'Member ID required'
      };
    }

    const member = loyaltyMembers.get(memberId);
    if (!member) {
      return {
        success: false,
        data: null,
        error: 'Loyalty member not found'
      };
    }

    if (member.points < params.points) {
      return {
        success: false,
        data: null,
        error: `Insufficient points. You have ${member.points} points, need ${params.points}`
      };
    }

    // Deduct points
    member.points -= params.points;

    // Record transaction
    const transaction: LoyaltyTransaction = {
      id: `txn-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      memberId: member.id,
      type: 'redeem',
      points: -params.points,
      description: `Redeemed for ${params.rewardType}`,
      timestamp: new Date().toISOString()
    };
    loyaltyTransactions.push(transaction);

    // Calculate reward value
    const rewardValues = {
      discount: params.points * 0.01, // 1 cent per point
      'free-night': params.points >= 10000 ? 1 : 0,
      upgrade: params.points >= 5000 ? 'room-upgrade' : null,
      experience: 'experience-voucher',
      transfer: params.points
    };

    return {
      success: true,
      data: {
        memberId: member.id,
        pointsRedeemed: params.points,
        rewardType: params.rewardType,
        rewardValue: rewardValues[params.rewardType],
        remainingPoints: member.points,
        transactionId: transaction.id,
        redemptionCode: `RDM-${Date.now().toString(36).toUpperCase()}`,
        message: `Successfully redeemed ${params.points} points for ${params.rewardType}`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to redeem points'
    };
  }
}

registerToolHandler('redeem_points', handleRedeemPoints as any);

// ========================================
// GET TIER BENEFITS HANDLER
// ========================================

interface GetTierBenefitsParams {
  tier?: 'bronze' | 'silver' | 'gold' | 'platinum';
  memberId?: string;
}

async function handleGetTierBenefits(
  params: GetTierBenefitsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    let tier = params.tier;

    if (!tier && params.memberId) {
      const member = loyaltyMembers.get(params.memberId);
      if (member) tier = member.tier;
    }

    if (!tier && context.metadata.loyaltyMemberId) {
      const member = loyaltyMembers.get(context.metadata.loyaltyMemberId);
      if (member) tier = member.tier;
    }

    if (!tier) tier = 'bronze';

    const allTiers = ['bronze', 'silver', 'gold', 'platinum'] as const;
    const tierIndex = allTiers.indexOf(tier);

    return {
      success: true,
      data: {
        currentTier: tier,
        benefits: TIER_BENEFITS[tier],
        threshold: TIER_THRESHOLDS[tier],
        nextTier: tierIndex < 3 ? allTiers[tierIndex + 1] : null,
        nextTierThreshold: tierIndex < 3 ? TIER_THRESHOLDS[allTiers[tierIndex + 1]] : null,
        allTiers: allTiers.map(t => ({
          name: t,
          threshold: TIER_THRESHOLDS[t],
          benefits: TIER_BENEFITS[t]
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get tier benefits'
    };
  }
}

registerToolHandler('get_tier_benefits', handleGetTierBenefits);

// ========================================
// GET TRANSACTION HISTORY HANDLER
// ========================================

interface GetTransactionHistoryParams {
  memberId?: string;
  type?: 'earn' | 'redeem' | 'expire' | 'bonus' | 'adjustment';
  limit?: number;
}

async function handleGetTransactionHistory(
  params: GetTransactionHistoryParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const memberId = params.memberId || context.metadata.loyaltyMemberId;

    if (!memberId) {
      return {
        success: false,
        data: null,
        error: 'Member ID required'
      };
    }

    let transactions = loyaltyTransactions.filter(t => t.memberId === memberId);

    if (params.type) {
      transactions = transactions.filter(t => t.type === params.type);
    }

    if (params.limit) {
      transactions = transactions.slice(-params.limit);
    }

    const totalEarned = transactions
      .filter(t => t.type === 'earn' || t.type === 'bonus')
      .reduce((sum, t) => sum + t.points, 0);

    const totalRedeemed = transactions
      .filter(t => t.type === 'redeem')
      .reduce((sum, t) => sum + Math.abs(t.points), 0);

    return {
      success: true,
      data: {
        memberId,
        totalTransactions: transactions.length,
        summary: {
          totalEarned,
          totalRedeemed,
          netPoints: totalEarned - totalRedeemed
        },
        transactions: transactions.map(t => ({
          id: t.id,
          type: t.type,
          points: t.points,
          description: t.description,
          bookingId: t.bookingId,
          date: t.timestamp
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get transaction history'
    };
  }
}

registerToolHandler('get_transaction_history', handleGetTransactionHistory);

// ========================================
// UTILITIES
// ========================================

export function createMember(data: {
  email: string;
  firstName: string;
  lastName: string;
}): LoyaltyMember {
  const member: LoyaltyMember = {
    id: `member-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    email: data.email,
    firstName: data.firstName,
    lastName: data.lastName,
    tier: 'bronze',
    points: 0,
    lifetimePoints: 0,
    tierProgressPoints: 0,
    nextTierThreshold: TIER_THRESHOLDS.silver,
    joinDate: new Date().toISOString(),
    preferences: {}
  };

  loyaltyMembers.set(member.id, member);
  return member;
}

export function getMember(memberId: string): LoyaltyMember | undefined {
  return loyaltyMembers.get(memberId);
}

export function getMemberByEmail(email: string): LoyaltyMember | undefined {
  return Array.from(loyaltyMembers.values()).find(m => m.email === email);
}

export {
  handleGetLoyaltyAccount,
  handleGetPointsBalance,
  handleEarnPoints,
  handleRedeemPoints,
  handleGetTierBenefits,
  handleGetTransactionHistory
};
