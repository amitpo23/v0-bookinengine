'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  FeatureConfig,
  FeatureId,
  DEFAULT_FEATURE_CONFIG,
  AVAILABLE_FEATURES,
  TemplateFeatureConfig,
  AIAgentConfig,
} from '@/types/features';

interface FeaturesContextType {
  config: FeatureConfig;
  updateTemplateFeatures: (
    templateId: string,
    features: FeatureId[]
  ) => Promise<void>;
  updateAIAgentFeatures: (features: FeatureId[]) => Promise<void>;
  isFeatureEnabled: (featureId: FeatureId, context?: 'template' | 'ai', templateId?: string) => boolean;
  getEnabledFeatures: (context: 'template' | 'ai', templateId?: string) => FeatureId[];
  saveConfig: () => Promise<void>;
  loadConfig: () => Promise<void>;
}

const FeaturesContext = createContext<FeaturesContextType | undefined>(
  undefined
);

export function FeaturesProvider({ children }: { children: React.ReactNode }) {
  const [config, setConfig] = useState<FeatureConfig>(DEFAULT_FEATURE_CONFIG);
  const [isLoaded, setIsLoaded] = useState(false);

  // טעינת קונפיגורציה מ-localStorage או API
  const loadConfig = async () => {
    try {
      // נסה לטעון מ-localStorage
      const savedConfig = localStorage.getItem('features-config');
      if (savedConfig) {
        setConfig(JSON.parse(savedConfig));
      } else {
        // אם אין, נסה לטעון מהשרת
        const response = await fetch('/api/admin/features');
        if (response.ok) {
          const data = await response.json();
          setConfig(data);
        }
      }
    } catch (error) {
      console.error('Failed to load features config:', error);
      // אם יש שגיאה, השתמש בדיפולט
      setConfig(DEFAULT_FEATURE_CONFIG);
    } finally {
      setIsLoaded(true);
    }
  };

  // שמירת קונפיגורציה
  const saveConfig = async () => {
    try {
      // שמור ב-localStorage
      localStorage.setItem('features-config', JSON.stringify(config));
      
      // שמור גם בשרת
      await fetch('/api/admin/features', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config),
      });
    } catch (error) {
      console.error('Failed to save features config:', error);
    }
  };

  // עדכון features לטמפלט
  const updateTemplateFeatures = async (
    templateId: string,
    features: FeatureId[]
  ) => {
    setConfig((prev) => {
      const newTemplates = prev.templates.map((t) =>
        t.templateId === templateId
          ? { ...t, enabledFeatures: features }
          : t
      );
      return { ...prev, templates: newTemplates };
    });
    await saveConfig();
  };

  // עדכון features ל-AI Agent
  const updateAIAgentFeatures = async (features: FeatureId[]) => {
    setConfig((prev) => ({
      ...prev,
      aiAgent: {
        ...prev.aiAgent,
        enabledFeatures: features,
      },
    }));
    await saveConfig();
  };

  // בדיקה האם feature מופעל
  const isFeatureEnabled = (
    featureId: FeatureId,
    context?: 'template' | 'ai',
    templateId?: string
  ): boolean => {
    if (context === 'template' && templateId) {
      const template = config.templates.find((t) => t.templateId === templateId);
      return template?.enabledFeatures.includes(featureId) ?? false;
    }
    
    if (context === 'ai') {
      return config.aiAgent.enabledFeatures.includes(featureId);
    }
    
    // אם לא צוין context, בדוק בכל המקומות
    const inTemplates = config.templates.some((t) =>
      t.enabledFeatures.includes(featureId)
    );
    const inAI = config.aiAgent.enabledFeatures.includes(featureId);
    return inTemplates || inAI;
  };

  // קבלת רשימת features מופעלים
  const getEnabledFeatures = (
    context: 'template' | 'ai',
    templateId?: string
  ): FeatureId[] => {
    if (context === 'template' && templateId) {
      const template = config.templates.find((t) => t.templateId === templateId);
      return template?.enabledFeatures ?? [];
    }
    
    if (context === 'ai') {
      return config.aiAgent.enabledFeatures;
    }
    
    return [];
  };

  // טען את הקונפיגורציה בעליית הקומפוננטה
  useEffect(() => {
    loadConfig();
  }, []);

  // שמור אוטומטית כשיש שינויים
  useEffect(() => {
    if (isLoaded) {
      saveConfig();
    }
  }, [config, isLoaded]);

  return (
    <FeaturesContext.Provider
      value={{
        config,
        updateTemplateFeatures,
        updateAIAgentFeatures,
        isFeatureEnabled,
        getEnabledFeatures,
        saveConfig,
        loadConfig,
      }}
    >
      {children}
    </FeaturesContext.Provider>
  );
}

export function useFeatures() {
  const context = useContext(FeaturesContext);
  if (!context) {
    throw new Error('useFeatures must be used within FeaturesProvider');
  }
  return context;
}

// Hook לבדיקה מהירה אם feature מופעל
export function useFeature(
  featureId: FeatureId,
  context?: 'template' | 'ai',
  templateId?: string
): boolean {
  const { isFeatureEnabled } = useFeatures();
  return isFeatureEnabled(featureId, context, templateId);
}
