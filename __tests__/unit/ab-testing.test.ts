/**
 * Unit Tests for A/B Testing Service
 */

import { ExperimentService } from '@/lib/ab-testing/experiment-service'

// Mock Prisma
jest.mock('@/lib/db', () => ({
  prisma: {
    experiment: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
    },
    promptVariant: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
    },
    experimentAssignment: {
      findFirst: jest.fn(),
      create: jest.fn(),
    },
    experimentResult: {
      create: jest.fn(),
      findMany: jest.fn(),
    },
  },
}))

// Mock logger
jest.mock('@/lib/logger', () => ({
  logger: {
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  },
}))

describe('ExperimentService', () => {
  let service: ExperimentService

  beforeEach(() => {
    service = new ExperimentService()
    jest.clearAllMocks()
  })

  describe('createExperiment', () => {
    it('should create experiment with valid variants', async () => {
      const variants = [
        { name: 'Control', systemPrompt: 'Control prompt', weight: 50 },
        { name: 'Variant A', systemPrompt: 'Test prompt A', weight: 50 },
      ]

      const { prisma } = require('@/lib/db')
      prisma.experiment.create.mockResolvedValue({
        id: 'exp-123',
        name: 'Test Experiment',
      })

      const result = await service.createExperiment({
        name: 'Test Experiment',
        description: 'Testing prompts',
        variants,
      })

      expect(result.success).toBe(true)
      expect(result.experimentId).toBe('exp-123')
      expect(prisma.experiment.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          name: 'Test Experiment',
          active: true,
        }),
      })
    })

    it('should reject variants with invalid weights', async () => {
      const variants = [
        { name: 'Control', systemPrompt: 'Control prompt', weight: 30 },
        { name: 'Variant A', systemPrompt: 'Test prompt A', weight: 50 },
        // Total = 80, not 100
      ]

      const result = await service.createExperiment({
        name: 'Test Experiment',
        description: 'Testing prompts',
        variants,
      })

      expect(result.success).toBe(false)
      expect(result.error).toContain('must sum to 100')
    })
  })

  describe('getVariant', () => {
    it('should return cached variant for existing session', async () => {
      const { prisma } = require('@/lib/db')

      // Mock existing assignment
      prisma.experimentAssignment.findFirst.mockResolvedValue({
        variantId: 'var-123',
      })

      // Mock variant lookup
      prisma.promptVariant.findUnique.mockResolvedValue({
        id: 'var-123',
        name: 'Control',
        systemPrompt: 'Control prompt',
      })

      const variant = await service.getVariant('exp-123', 'session-456')

      expect(variant).not.toBeNull()
      expect(variant?.id).toBe('var-123')
      expect(prisma.experimentAssignment.create).not.toHaveBeenCalled()
    })

    it('should assign new variant for new session', async () => {
      const { prisma } = require('@/lib/db')

      // No existing assignment
      prisma.experimentAssignment.findFirst.mockResolvedValue(null)

      // Mock available variants
      const mockVariants = [
        { id: 'var-1', name: 'Control', weight: 50, active: true },
        { id: 'var-2', name: 'Variant A', weight: 50, active: true },
      ]
      prisma.promptVariant.findMany.mockResolvedValue(mockVariants)
      prisma.experimentAssignment.create.mockResolvedValue({})

      const variant = await service.getVariant('exp-123', 'session-789')

      expect(variant).not.toBeNull()
      expect(prisma.experimentAssignment.create).toHaveBeenCalled()
    })
  })

  describe('trackResult', () => {
    it('should track experiment results', async () => {
      const { prisma } = require('@/lib/db')
      prisma.experimentResult.create.mockResolvedValue({})

      await service.trackResult({
        variantId: 'var-123',
        sessionId: 'session-456',
        metrics: {
          conversions: 1,
          responseTime: 500,
          userSatisfaction: 4.5,
          completedBooking: true,
        },
      })

      expect(prisma.experimentResult.create).toHaveBeenCalledWith({
        data: expect.objectContaining({
          variantId: 'var-123',
          sessionId: 'session-456',
          completedBooking: true,
        }),
      })
    })
  })

  describe('getExperimentAnalytics', () => {
    it('should calculate conversion rates correctly', async () => {
      const { prisma } = require('@/lib/db')

      // Mock variants
      prisma.promptVariant.findMany.mockResolvedValue([
        {
          id: 'var-1',
          name: 'Control',
          _count: { assignments: 100, results: 100 },
        },
        {
          id: 'var-2',
          name: 'Variant A',
          _count: { assignments: 100, results: 100 },
        },
      ])

      // Mock results
      prisma.experimentResult.findMany
        .mockResolvedValueOnce([
          // Control: 10 conversions out of 100
          ...Array(10).fill({ completedBooking: true, responseTime: 500, userSatisfaction: 4 }),
          ...Array(90).fill({ completedBooking: false, responseTime: 400, userSatisfaction: 3 }),
        ])
        .mockResolvedValueOnce([
          // Variant A: 20 conversions out of 100
          ...Array(20).fill({ completedBooking: true, responseTime: 450, userSatisfaction: 4.5 }),
          ...Array(80).fill({ completedBooking: false, responseTime: 380, userSatisfaction: 3.2 }),
        ])

      const analytics = await service.getExperimentAnalytics('exp-123')

      expect(analytics.variants).toHaveLength(2)
      expect(analytics.variants[0].conversionRate).toBe(10)
      expect(analytics.variants[1].conversionRate).toBe(20)

      // Variant A should be the winner (higher conversion rate)
      expect(analytics.winner).toBe('var-2')
    })
  })
})
