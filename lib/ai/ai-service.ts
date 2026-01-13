/**
 * AI Service - Universal LLM Integration
 * Supports OpenAI, Anthropic (Claude), and Groq
 */

import OpenAI from 'openai'
import Anthropic from '@anthropic-ai/sdk'
import Groq from 'groq-sdk'

export type AIProvider = 'openai' | 'anthropic' | 'groq'

export interface AIMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

export interface AIServiceConfig {
  provider: AIProvider
  model?: string
  temperature?: number
  maxTokens?: number
}

export class AIService {
  private openai: OpenAI | null = null
  private anthropic: Anthropic | null = null
  private groq: Groq | null = null
  private provider: AIProvider
  private model: string = ''

  constructor(config: AIServiceConfig) {
    this.provider = config.provider

    // Initialize based on provider
    switch (config.provider) {
      case 'openai':
        if (process.env.OPENAI_API_KEY) {
          this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
          })
          this.model = config.model || 'gpt-4-turbo-preview'
        } else {
          console.warn('[AI] OpenAI API key not configured')
        }
        break

      case 'anthropic':
        if (process.env.ANTHROPIC_API_KEY) {
          this.anthropic = new Anthropic({
            apiKey: process.env.ANTHROPIC_API_KEY,
          })
          this.model = config.model || 'claude-3-5-sonnet-20241022'
        } else {
          console.warn('[AI] Anthropic API key not configured')
        }
        break

      case 'groq':
        if (process.env.GROQ_API_KEY) {
          this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
          })
          this.model = config.model || 'llama-3.3-70b-versatile'
        } else {
          console.warn('[AI] Groq API key not configured')
        }
        break
    }
  }

  isConfigured(): boolean {
    switch (this.provider) {
      case 'openai':
        return this.openai !== null
      case 'anthropic':
        return this.anthropic !== null
      case 'groq':
        return this.groq !== null
      default:
        return false
    }
  }

  async chat(
    messages: AIMessage[],
    options?: {
      temperature?: number
      maxTokens?: number
      stream?: boolean
    }
  ): Promise<string> {
    if (!this.isConfigured()) {
      throw new Error(`AI provider ${this.provider} is not configured`)
    }

    const temperature = options?.temperature ?? 0.7
    const maxTokens = options?.maxTokens ?? 2000

    try {
      switch (this.provider) {
        case 'openai':
          return await this.chatOpenAI(messages, temperature, maxTokens)

        case 'anthropic':
          return await this.chatAnthropic(messages, temperature, maxTokens)

        case 'groq':
          return await this.chatGroq(messages, temperature, maxTokens)

        default:
          throw new Error(`Unknown provider: ${this.provider}`)
      }
    } catch (error) {
      console.error(`[AI] Error with ${this.provider}:`, error)
      throw error
    }
  }

  private async chatOpenAI(
    messages: AIMessage[],
    temperature: number,
    maxTokens: number
  ): Promise<string> {
    if (!this.openai) throw new Error('OpenAI not configured')

    const response = await this.openai.chat.completions.create({
      model: this.model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
    })

    return response.choices[0]?.message?.content || ''
  }

  private async chatAnthropic(
    messages: AIMessage[],
    temperature: number,
    maxTokens: number
  ): Promise<string> {
    if (!this.anthropic) throw new Error('Anthropic not configured')

    // Anthropic requires system message separately
    const systemMessage = messages.find((m) => m.role === 'system')
    const conversationMessages = messages.filter((m) => m.role !== 'system')

    const response = await this.anthropic.messages.create({
      model: this.model,
      max_tokens: maxTokens,
      temperature,
      system: systemMessage?.content || undefined,
      messages: conversationMessages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    })

    const firstContent = response.content[0]
    return firstContent.type === 'text' ? firstContent.text : ''
  }

  private async chatGroq(
    messages: AIMessage[],
    temperature: number,
    maxTokens: number
  ): Promise<string> {
    if (!this.groq) throw new Error('Groq not configured')

    const response = await this.groq.chat.completions.create({
      model: this.model,
      messages: messages as any,
      temperature,
      max_tokens: maxTokens,
    })

    return response.choices[0]?.message?.content || ''
  }

  async embed(text: string): Promise<number[]> {
    if (this.provider !== 'openai' || !this.openai) {
      throw new Error('Embeddings only supported with OpenAI')
    }

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-3-small',
      input: text,
    })

    return response.data[0].embedding
  }
}

// Singleton instances for different use cases
export const hotelBookingAI = new AIService({
  provider: (process.env.AI_PROVIDER as AIProvider) || 'groq',
  temperature: 0.7,
})

export const customerServiceAI = new AIService({
  provider: (process.env.AI_PROVIDER as AIProvider) || 'groq',
  temperature: 0.5,
})

export const analyticsAI = new AIService({
  provider: 'openai',
  model: 'gpt-4-turbo-preview',
  temperature: 0.3,
})
