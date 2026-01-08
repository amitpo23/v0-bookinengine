/**
 * Hotel Booking AI - Voice Handler
 * Handles voice-based interactions using Azure Communication Services
 */

import type { ConversationContext, ToolResult } from '../types';
import { registerToolHandler } from '../engine-manager';

// ========================================
// AZURE COMMUNICATION SERVICES CONFIG
// ========================================

const AZURE_COMMUNICATION_CONNECTION_STRING = process.env.AZURE_COMMUNICATION_CONNECTION_STRING;
const AZURE_SPEECH_KEY = process.env.AZURE_SPEECH_KEY;
const AZURE_SPEECH_REGION = process.env.AZURE_SPEECH_REGION || 'eastus';
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER;

// ========================================
// VOICE SESSION MANAGEMENT
// ========================================

interface VoiceSession {
  sessionId: string;
  callId?: string;
  phoneNumber: string;
  status: 'initiating' | 'ringing' | 'connected' | 'ended' | 'failed';
  startTime: string;
  endTime?: string;
  transcript: Array<{
    speaker: 'agent' | 'customer';
    text: string;
    timestamp: string;
  }>;
  metadata: Record<string, any>;
}

const voiceSessions = new Map<string, VoiceSession>();

// ========================================
// INITIATE CALL HANDLER
// ========================================

interface InitiateCallParams {
  phoneNumber: string;
  language?: string;
  initialMessage?: string;
  callbackUrl?: string;
}

async function handleInitiateCall(
  params: InitiateCallParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    // Validate phone number format
    const phoneNumber = params.phoneNumber.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
      return {
        success: false,
        data: null,
        error: 'Invalid phone number format'
      };
    }

    const sessionId = `voice-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Create voice session
    const session: VoiceSession = {
      sessionId,
      phoneNumber: params.phoneNumber,
      status: 'initiating',
      startTime: new Date().toISOString(),
      transcript: [],
      metadata: {
        language: params.language || 'en',
        initialMessage: params.initialMessage,
        conversationSessionId: context.sessionId
      }
    };

    voiceSessions.set(sessionId, session);

    // In production, this would initiate the actual call via Azure/Twilio
    // For now, we simulate the response
    
    // Simulate call initiation
    session.status = 'ringing';
    session.callId = `call-${Date.now()}`;

    // Store session ID in context
    context.metadata.activeVoiceSession = sessionId;

    return {
      success: true,
      data: {
        sessionId,
        callId: session.callId,
        status: session.status,
        phoneNumber: params.phoneNumber,
        message: 'Call initiated successfully. Waiting for customer to answer.'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to initiate call'
    };
  }
}

registerToolHandler('initiate_call', handleInitiateCall as any);

// ========================================
// END CALL HANDLER
// ========================================

interface EndCallParams {
  sessionId?: string;
  reason?: string;
}

async function handleEndCall(
  params: EndCallParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const sessionId = params.sessionId || context.metadata.activeVoiceSession;

    if (!sessionId) {
      return {
        success: false,
        data: null,
        error: 'No active voice session found'
      };
    }

    const session = voiceSessions.get(sessionId);
    if (!session) {
      return {
        success: false,
        data: null,
        error: 'Voice session not found'
      };
    }

    // End the session
    session.status = 'ended';
    session.endTime = new Date().toISOString();

    // Calculate duration
    const startTime = new Date(session.startTime).getTime();
    const endTime = new Date(session.endTime).getTime();
    const durationSeconds = Math.round((endTime - startTime) / 1000);

    // Clear active session from context
    delete context.metadata.activeVoiceSession;

    return {
      success: true,
      data: {
        sessionId,
        status: 'ended',
        duration: durationSeconds,
        transcriptLength: session.transcript.length,
        endReason: params.reason || 'completed',
        message: 'Call ended successfully'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to end call'
    };
  }
}

registerToolHandler('end_call', handleEndCall);

// ========================================
// TEXT TO SPEECH HANDLER
// ========================================

interface SpeakParams {
  text: string;
  language?: string;
  voiceId?: string;
  rate?: number;
  pitch?: number;
}

async function handleSpeak(
  params: SpeakParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const sessionId = context.metadata.activeVoiceSession;

    if (!sessionId) {
      return {
        success: false,
        data: null,
        error: 'No active voice session'
      };
    }

    const session = voiceSessions.get(sessionId);
    if (!session || session.status !== 'connected') {
      return {
        success: false,
        data: null,
        error: 'Voice session not connected'
      };
    }

    // Add to transcript
    session.transcript.push({
      speaker: 'agent',
      text: params.text,
      timestamp: new Date().toISOString()
    });

    // In production, this would use Azure Speech SDK to synthesize speech
    // For now, we simulate the response

    return {
      success: true,
      data: {
        sessionId,
        text: params.text,
        language: params.language || session.metadata.language,
        voiceId: params.voiceId || 'he-IL-HilaNeural',
        duration: Math.ceil(params.text.length / 15), // Approximate duration in seconds
        message: 'Speech synthesized and played'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to synthesize speech'
    };
  }
}

registerToolHandler('speak_text', handleSpeak as any);

// ========================================
// SPEECH TO TEXT HANDLER
// ========================================

interface ListenParams {
  timeout?: number;
  language?: string;
  hints?: string[];
}

async function handleListen(
  params: ListenParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const sessionId = context.metadata.activeVoiceSession;

    if (!sessionId) {
      return {
        success: false,
        data: null,
        error: 'No active voice session'
      };
    }

    const session = voiceSessions.get(sessionId);
    if (!session || session.status !== 'connected') {
      return {
        success: false,
        data: null,
        error: 'Voice session not connected'
      };
    }

    // In production, this would use Azure Speech SDK for speech recognition
    // For now, we return a placeholder response

    return {
      success: true,
      data: {
        sessionId,
        recognized: true,
        text: '[Customer response would be transcribed here]',
        confidence: 0.95,
        language: params.language || session.metadata.language,
        message: 'Listening for customer input'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to recognize speech'
    };
  }
}

registerToolHandler('listen_speech', handleListen);

// ========================================
// SEND SMS HANDLER
// ========================================

interface SendSmsParams {
  phoneNumber: string;
  message: string;
  templateId?: string;
}

async function handleSendSms(
  params: SendSmsParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    // Validate phone number
    const phoneNumber = params.phoneNumber.replace(/\D/g, '');
    if (phoneNumber.length < 10) {
      return {
        success: false,
        data: null,
        error: 'Invalid phone number format'
      };
    }

    // Validate message length
    if (params.message.length > 1600) {
      return {
        success: false,
        data: null,
        error: 'Message too long. Maximum 1600 characters.'
      };
    }

    // In production, this would use Twilio/Azure to send SMS
    // For now, we simulate the response

    const messageId = `sms-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    // Store in context for tracking
    if (!context.metadata.sentMessages) {
      context.metadata.sentMessages = [];
    }
    context.metadata.sentMessages.push({
      id: messageId,
      type: 'sms',
      to: params.phoneNumber,
      content: params.message,
      sentAt: new Date().toISOString()
    });

    return {
      success: true,
      data: {
        messageId,
        to: params.phoneNumber,
        status: 'sent',
        segments: Math.ceil(params.message.length / 160),
        message: 'SMS sent successfully'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to send SMS'
    };
  }
}

registerToolHandler('send_sms', handleSendSms as any);

// ========================================
// CALL STATUS HANDLER
// ========================================

interface CallStatusParams {
  sessionId?: string;
}

async function handleCallStatus(
  params: CallStatusParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const sessionId = params.sessionId || context.metadata.activeVoiceSession;

    if (!sessionId) {
      return {
        success: false,
        data: null,
        error: 'No voice session specified'
      };
    }

    const session = voiceSessions.get(sessionId);
    if (!session) {
      return {
        success: false,
        data: null,
        error: 'Voice session not found'
      };
    }

    const startTime = new Date(session.startTime).getTime();
    const endTime = session.endTime
      ? new Date(session.endTime).getTime()
      : Date.now();
    const durationSeconds = Math.round((endTime - startTime) / 1000);

    return {
      success: true,
      data: {
        sessionId,
        callId: session.callId,
        status: session.status,
        phoneNumber: session.phoneNumber,
        duration: durationSeconds,
        transcriptLength: session.transcript.length,
        language: session.metadata.language
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to get call status'
    };
  }
}

registerToolHandler('get_call_status', handleCallStatus);

// ========================================
// TRANSFER CALL HANDLER
// ========================================

interface TransferCallParams {
  sessionId?: string;
  targetNumber: string;
  reason?: string;
}

async function handleTransferCall(
  params: TransferCallParams,
  context: ConversationContext
): Promise<ToolResult> {
  try {
    const sessionId = params.sessionId || context.metadata.activeVoiceSession;

    if (!sessionId) {
      return {
        success: false,
        data: null,
        error: 'No voice session to transfer'
      };
    }

    const session = voiceSessions.get(sessionId);
    if (!session || session.status !== 'connected') {
      return {
        success: false,
        data: null,
        error: 'Voice session not connected'
      };
    }

    // In production, this would transfer the call
    // For now, we simulate the response

    return {
      success: true,
      data: {
        sessionId,
        status: 'transferring',
        targetNumber: params.targetNumber,
        reason: params.reason || 'Customer request',
        message: 'Call transfer initiated'
      }
    };
  } catch (error: any) {
    return {
      success: false,
      data: null,
      error: error.message || 'Failed to transfer call'
    };
  }
}

registerToolHandler('transfer_call', handleTransferCall as any);

// ========================================
// VOICE SESSION UTILITIES
// ========================================

export function getVoiceSession(sessionId: string): VoiceSession | undefined {
  return voiceSessions.get(sessionId);
}

export function getActiveVoiceSessions(): VoiceSession[] {
  return Array.from(voiceSessions.values()).filter(
    session => session.status === 'connected' || session.status === 'ringing'
  );
}

export function getVoiceSessionTranscript(sessionId: string): VoiceSession['transcript'] | null {
  const session = voiceSessions.get(sessionId);
  return session ? session.transcript : null;
}

export {
  handleInitiateCall,
  handleEndCall,
  handleSpeak,
  handleListen,
  handleSendSms,
  handleCallStatus,
  handleTransferCall
};
