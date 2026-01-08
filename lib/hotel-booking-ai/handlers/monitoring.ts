/**
 * Hotel Booking AI - Price Monitoring Handler
 * Handles price tracking, alerts, and trend analysis
 */

import type { ConversationContext, ToolResult } from '../types';
import { registerToolHandler } from '../engine-manager';

// ========================================
// PRICE TRACKING DATA STRUCTURES
// ========================================

interface PriceAlert {
  id: string;
  hotelId: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  targetPrice?: number;
  alertType: 'price-drop' | 'availability' | 'threshold';
  thresholdPercentage?: number;
  status: 'active' | 'triggered' | 'expired' | 'cancelled';
  createdAt: string;
  lastChecked?: string;
  priceHistory: Array<{
    price: number;
    currency: string;
    timestamp: string;
  }>;
  userId?: string;
  notificationMethod: 'email' | 'sms' | 'push';
  notificationEmail?: string;
  notificationPhone?: string;
}

interface PriceSnapshot {
  hotelId: string;
  roomType: string;
  price: number;
  currency: string;
  timestamp: string;
  source: string;
}

// In-memory storage (in production, use database)
const priceAlerts = new Map<string, PriceAlert>();
const priceHistory = new Map<string, PriceSnapshot[]>();

// ========================================
// CREATE PRICE ALERT HANDLER
// ========================================

interface CreateAlertParams {
  hotelId: string;
  hotelName: string;
  roomType: string;
  checkIn: string;
  checkOut: string;
  alertType: 'price-drop' | 'availability' | 'threshold';
  targetPrice?: number;
  thresholdPercentage?: number;
  notificationMethod: 'email' | 'sms' | 'push';
  email?: string;
  phone?: string;
}

async function handleCreatePriceAlert(
  params: CreateAlertParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const alertId = `alert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const alert: PriceAlert = {
      id: alertId,
      hotelId: params.hotelId,
      hotelName: params.hotelName,
      roomType: params.roomType,
      checkIn: params.checkIn,
      checkOut: params.checkOut,
      alertType: params.alertType,
      targetPrice: params.targetPrice,
      thresholdPercentage: params.thresholdPercentage || 10,
      status: 'active',
      createdAt: new Date().toISOString(),
      priceHistory: [],
      userId: context.metadata.userId,
      notificationMethod: params.notificationMethod,
      notificationEmail: params.email,
      notificationPhone: params.phone
    };

    priceAlerts.set(alertId, alert);

    // Store alert ID in context
    if (!context.metadata.priceAlerts) {
      context.metadata.priceAlerts = [];
    }
    context.metadata.priceAlerts.push(alertId);

    return {
      success: true,
      data: {
        alertId,
        hotelName: params.hotelName,
        roomType: params.roomType,
        dates: `${params.checkIn} to ${params.checkOut}`,
        alertType: params.alertType,
        targetPrice: params.targetPrice,
        thresholdPercentage: params.thresholdPercentage,
        notificationMethod: params.notificationMethod,
        status: 'active',
        message: 'Price alert created successfully. You will be notified when conditions are met.'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to create price alert'
    };
  }
}

registerToolHandler('create_price_alert', handleCreatePriceAlert as any);

// ========================================
// GET PRICE ALERTS HANDLER
// ========================================

interface GetAlertsParams {
  status?: 'active' | 'triggered' | 'expired' | 'cancelled';
  hotelId?: string;
}

async function handleGetPriceAlerts(
  params: GetAlertsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    let alerts = Array.from(priceAlerts.values());

    // Filter by user if available
    if (context.metadata.userId) {
      alerts = alerts.filter(a => a.userId === context.metadata.userId);
    }

    // Filter by status
    if (params.status) {
      alerts = alerts.filter(a => a.status === params.status);
    }

    // Filter by hotel
    if (params.hotelId) {
      alerts = alerts.filter(a => a.hotelId === params.hotelId);
    }

    return {
      success: true,
      data: {
        totalAlerts: alerts.length,
        alerts: alerts.map(alert => ({
          id: alert.id,
          hotelName: alert.hotelName,
          roomType: alert.roomType,
          dates: `${alert.checkIn} to ${alert.checkOut}`,
          alertType: alert.alertType,
          targetPrice: alert.targetPrice,
          status: alert.status,
          createdAt: alert.createdAt,
          lastChecked: alert.lastChecked,
          currentPrice: alert.priceHistory[alert.priceHistory.length - 1]?.price,
          priceChanges: alert.priceHistory.length
        }))
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get price alerts'
    };
  }
}

registerToolHandler('get_price_alerts', handleGetPriceAlerts);

// ========================================
// CANCEL PRICE ALERT HANDLER
// ========================================

interface CancelAlertParams {
  alertId: string;
}

async function handleCancelPriceAlert(
  params: CancelAlertParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const alert = priceAlerts.get(params.alertId);

    if (!alert) {
      return {
        success: false,
        data: null,
        error: 'Price alert not found'
      };
    }

    // Verify ownership
    if (context.metadata.userId && alert.userId !== context.metadata.userId) {
      return {
        success: false,
        data: null,
        error: 'Not authorized to cancel this alert'
      };
    }

    alert.status = 'cancelled';

    return {
      success: true,
      data: {
        alertId: params.alertId,
        hotelName: alert.hotelName,
        status: 'cancelled',
        message: 'Price alert cancelled successfully'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to cancel price alert'
    };
  }
}

registerToolHandler('cancel_price_alert', handleCancelPriceAlert as any);

// ========================================
// GET PRICE HISTORY HANDLER
// ========================================

interface GetPriceHistoryParams {
  hotelId: string;
  roomType?: string;
  startDate?: string;
  endDate?: string;
}

async function handleGetPriceHistory(
  params: GetPriceHistoryParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const key = `${params.hotelId}-${params.roomType || 'all'}`;
    const history = priceHistory.get(key) || [];

    // Filter by date range if provided
    let filteredHistory = history;
    if (params.startDate || params.endDate) {
      filteredHistory = history.filter(snapshot => {
        const snapshotDate = new Date(snapshot.timestamp);
        if (params.startDate && snapshotDate < new Date(params.startDate)) return false;
        if (params.endDate && snapshotDate > new Date(params.endDate)) return false;
        return true;
      });
    }

    // Calculate statistics
    const prices = filteredHistory.map(s => s.price);
    const stats = prices.length > 0 ? {
      minPrice: Math.min(...prices),
      maxPrice: Math.max(...prices),
      avgPrice: Math.round(prices.reduce((a, b) => a + b, 0) / prices.length),
      currentPrice: prices[prices.length - 1],
      priceChange: prices.length > 1
        ? ((prices[prices.length - 1] - prices[0]) / prices[0] * 100).toFixed(1)
        : 0
    } : null;

    return {
      success: true,
      data: {
        hotelId: params.hotelId,
        roomType: params.roomType,
        dataPoints: filteredHistory.length,
        dateRange: {
          from: filteredHistory[0]?.timestamp,
          to: filteredHistory[filteredHistory.length - 1]?.timestamp
        },
        statistics: stats,
        trend: stats && Number(stats.priceChange) < -5 ? 'declining'
          : stats && Number(stats.priceChange) > 5 ? 'rising'
          : 'stable',
        history: filteredHistory.slice(-30) // Last 30 data points
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get price history'
    };
  }
}

registerToolHandler('get_price_history', handleGetPriceHistory as any);

// ========================================
// ANALYZE PRICE TRENDS HANDLER
// ========================================

interface AnalyzeTrendsParams {
  hotelId: string;
  roomType?: string;
  period?: 'week' | 'month' | 'quarter';
}

async function handleAnalyzePriceTrends(
  params: AnalyzeTrendsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const key = `${params.hotelId}-${params.roomType || 'all'}`;
    const history = priceHistory.get(key) || [];

    // Determine period in days
    const periodDays = params.period === 'week' ? 7
      : params.period === 'quarter' ? 90
      : 30;

    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - periodDays);

    const periodHistory = history.filter(
      s => new Date(s.timestamp) >= cutoffDate
    );

    if (periodHistory.length < 2) {
      return {
        success: true,
        data: {
          hotelId: params.hotelId,
          period: params.period || 'month',
          message: 'Insufficient data for trend analysis',
          recommendation: 'Continue monitoring to gather more price data'
        }
      };
    }

    const prices = periodHistory.map(s => s.price);
    const startPrice = prices[0];
    const endPrice = prices[prices.length - 1];
    const changePercent = ((endPrice - startPrice) / startPrice * 100).toFixed(1);

    // Calculate volatility
    const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
    const variance = prices.reduce((sum, p) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length;
    const volatility = Math.sqrt(variance);

    // Determine trend
    let trend: string;
    let recommendation: string;

    if (Number(changePercent) <= -10) {
      trend = 'strong-decline';
      recommendation = 'Great time to book! Prices have dropped significantly.';
    } else if (Number(changePercent) <= -5) {
      trend = 'moderate-decline';
      recommendation = 'Good opportunity to book. Prices are trending down.';
    } else if (Number(changePercent) >= 10) {
      trend = 'strong-increase';
      recommendation = 'Consider booking soon. Prices are rising quickly.';
    } else if (Number(changePercent) >= 5) {
      trend = 'moderate-increase';
      recommendation = 'Prices are slowly rising. Book when ready.';
    } else {
      trend = 'stable';
      recommendation = 'Prices are stable. No urgency to book.';
    }

    return {
      success: true,
      data: {
        hotelId: params.hotelId,
        roomType: params.roomType,
        period: params.period || 'month',
        dataPoints: periodHistory.length,
        analysis: {
          trend,
          changePercent: `${changePercent}%`,
          startPrice,
          endPrice,
          minPrice: Math.min(...prices),
          maxPrice: Math.max(...prices),
          avgPrice: Math.round(avgPrice),
          volatility: volatility.toFixed(2),
          volatilityLevel: volatility > avgPrice * 0.1 ? 'high'
            : volatility > avgPrice * 0.05 ? 'moderate'
            : 'low'
        },
        recommendation,
        bestTimeToBook: trend.includes('decline')
          ? 'Prices may drop further. Consider waiting a few more days.'
          : trend.includes('increase')
          ? 'Book now before prices increase more.'
          : 'Current prices are reasonable. Book at your convenience.'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to analyze price trends'
    };
  }
}

registerToolHandler('analyze_price_trends', handleAnalyzePriceTrends as any);

// ========================================
// COMPARE PRICES HANDLER
// ========================================

interface ComparePricesParams {
  hotelIds: string[];
  checkIn: string;
  checkOut: string;
  roomType?: string;
}

async function handleComparePrices(
  params: ComparePricesParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    // In production, this would fetch live prices from multiple sources
    // For now, we simulate comparison data

    const comparisons = params.hotelIds.map((hotelId, index) => {
      const basePrice = 150 + Math.random() * 200;
      return {
        hotelId,
        hotelName: `Hotel ${hotelId}`,
        prices: [
          { source: 'Direct', price: Math.round(basePrice), currency: 'USD' },
          { source: 'Booking.com', price: Math.round(basePrice * 1.05), currency: 'USD' },
          { source: 'Expedia', price: Math.round(basePrice * 1.08), currency: 'USD' },
          { source: 'Hotels.com', price: Math.round(basePrice * 1.03), currency: 'USD' }
        ],
        bestPrice: Math.round(basePrice),
        bestSource: 'Direct'
      };
    });

    // Find overall best deal
    const bestDeal = comparisons.reduce((best, current) =>
      current.bestPrice < best.bestPrice ? current : best
    );

    return {
      success: true,
      data: {
        checkIn: params.checkIn,
        checkOut: params.checkOut,
        roomType: params.roomType,
        comparisons,
        bestOverall: {
          hotelId: bestDeal.hotelId,
          hotelName: bestDeal.hotelName,
          price: bestDeal.bestPrice,
          source: bestDeal.bestSource
        },
        savings: `Book direct to save up to ${Math.round(Math.random() * 15 + 5)}%`
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to compare prices'
    };
  }
}

registerToolHandler('compare_prices', handleComparePrices as any);

// ========================================
// UTILITIES
// ========================================

export function getAlert(alertId: string): PriceAlert | undefined {
  return priceAlerts.get(alertId);
}

export function getActiveAlerts(): PriceAlert[] {
  return Array.from(priceAlerts.values()).filter(a => a.status === 'active');
}

export function addPriceSnapshot(snapshot: PriceSnapshot): void {
  const key = `${snapshot.hotelId}-${snapshot.roomType}`;
  const history = priceHistory.get(key) || [];
  history.push(snapshot);
  priceHistory.set(key, history);

  // Check for alerts
  checkPriceAlerts(snapshot);
}

function checkPriceAlerts(snapshot: PriceSnapshot): void {
  const alerts = getActiveAlerts();

  for (const alert of alerts) {
    if (alert.hotelId !== snapshot.hotelId) continue;
    if (alert.roomType && alert.roomType !== snapshot.roomType) continue;

    // Add to alert history
    alert.priceHistory.push({
      price: snapshot.price,
      currency: snapshot.currency,
      timestamp: snapshot.timestamp
    });
    alert.lastChecked = snapshot.timestamp;

    // Check trigger conditions
    if (alert.alertType === 'threshold' && alert.targetPrice) {
      if (snapshot.price <= alert.targetPrice) {
        triggerAlert(alert, snapshot);
      }
    } else if (alert.alertType === 'price-drop' && alert.priceHistory.length > 1) {
      const previousPrice = alert.priceHistory[alert.priceHistory.length - 2].price;
      const dropPercent = ((previousPrice - snapshot.price) / previousPrice) * 100;
      if (dropPercent >= (alert.thresholdPercentage || 10)) {
        triggerAlert(alert, snapshot);
      }
    }
  }
}

function triggerAlert(alert: PriceAlert, snapshot: PriceSnapshot): void {
  alert.status = 'triggered';
  console.log(`Alert triggered: ${alert.id} for ${alert.hotelName} at ${snapshot.price} ${snapshot.currency}`);
  // In production, send notification via email/SMS/push
}

export {
  handleCreatePriceAlert,
  handleGetPriceAlerts,
  handleCancelPriceAlert,
  handleGetPriceHistory,
  handleAnalyzePriceTrends,
  handleComparePrices
};
