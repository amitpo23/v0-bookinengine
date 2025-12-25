'use client';

import React, { useState } from 'react';
import { useFeatures } from '@/lib/features-context';
import {
  AVAILABLE_FEATURES,
  Feature,
  FeatureCategory,
  FeatureId,
} from '@/types/features';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Settings, 
  Zap, 
  Save, 
  AlertCircle,
  CheckCircle2 
} from 'lucide-react';

const CATEGORY_LABELS: Record<FeatureCategory, { en: string; he: string }> = {
  notifications: { en: 'Notifications', he: 'התראות' },
  pricing: { en: 'Pricing', he: 'תמחור' },
  reviews: { en: 'Reviews', he: 'ביקורות' },
  location: { en: 'Location', he: 'מיקום' },
  loyalty: { en: 'Loyalty', he: 'נאמנות' },
  booking: { en: 'Booking', he: 'הזמנות' },
  analytics: { en: 'Analytics', he: 'אנליטיקס' },
  support: { en: 'Support', he: 'תמיכה' },
  localization: { en: 'Localization', he: 'לוקליזציה' },
  'travel-info': { en: 'Travel Info', he: 'מידע נסיעה' },
};

export function FeaturesManagement() {
  const { config, updateTemplateFeatures, updateAIAgentFeatures, saveConfig } = useFeatures();
  const [activeTab, setActiveTab] = useState<string>('nara');
  const [saved, setSaved] = useState(false);

  // קיבוץ features לפי קטגוריה
  const featuresByCategory = AVAILABLE_FEATURES.reduce((acc, feature) => {
    if (!acc[feature.category]) {
      acc[feature.category] = [];
    }
    acc[feature.category].push(feature);
    return acc;
  }, {} as Record<FeatureCategory, Feature[]>);

  const handleTemplateFeatureToggle = (templateId: string, featureId: FeatureId) => {
    const template = config.templates.find((t) => t.templateId === templateId);
    if (!template) return;

    const currentFeatures = template.enabledFeatures;
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];

    updateTemplateFeatures(templateId, newFeatures);
  };

  const handleAIFeatureToggle = (featureId: FeatureId) => {
    const currentFeatures = config.aiAgent.enabledFeatures;
    const newFeatures = currentFeatures.includes(featureId)
      ? currentFeatures.filter((f) => f !== featureId)
      : [...currentFeatures, featureId];

    updateAIAgentFeatures(newFeatures);
  };

  const handleSave = async () => {
    await saveConfig();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const isFeatureEnabled = (
    context: 'template' | 'ai',
    featureId: FeatureId,
    templateId?: string
  ): boolean => {
    if (context === 'template' && templateId) {
      const template = config.templates.find((t) => t.templateId === templateId);
      return template?.enabledFeatures.includes(featureId) ?? false;
    }
    if (context === 'ai') {
      return config.aiAgent.enabledFeatures.includes(featureId);
    }
    return false;
  };

  const renderFeatureCard = (
    feature: Feature,
    context: 'template' | 'ai',
    templateId?: string
  ) => {
    const enabled = isFeatureEnabled(context, feature.id, templateId);

    return (
      <Card key={feature.id} className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{feature.icon}</span>
              <div>
                <CardTitle className="text-sm">{feature.name}</CardTitle>
                <p className="text-xs text-muted-foreground">{feature.nameHe}</p>
              </div>
            </div>
            <Switch
              checked={enabled}
              onCheckedChange={() => {
                if (context === 'template' && templateId) {
                  handleTemplateFeatureToggle(templateId, feature.id);
                } else if (context === 'ai') {
                  handleAIFeatureToggle(feature.id);
                }
              }}
            />
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-xs text-muted-foreground mb-2">
            {feature.description}
          </p>
          <div className="flex flex-wrap gap-1">
            {feature.premium && (
              <Badge variant="secondary" className="text-xs">
                Premium
              </Badge>
            )}
            {feature.requiredApis && feature.requiredApis.length > 0 && (
              <Badge variant="outline" className="text-xs">
                API Required
              </Badge>
            )}
          </div>
          {feature.requiredApis && feature.requiredApis.length > 0 && (
            <p className="text-xs text-muted-foreground mt-2">
              Required: {feature.requiredApis.join(', ')}
            </p>
          )}
        </CardContent>
      </Card>
    );
  };

  const renderCategorySection = (
    category: FeatureCategory,
    features: Feature[],
    context: 'template' | 'ai',
    templateId?: string
  ) => {
    return (
      <div key={category} className="mb-8">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          {CATEGORY_LABELS[category].en}
          <span className="text-sm text-muted-foreground">
            ({CATEGORY_LABELS[category].he})
          </span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {features.map((feature) =>
            renderFeatureCard(feature, context, templateId)
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Zap className="h-8 w-8" />
            Features Management
          </h1>
          <p className="text-muted-foreground mt-1">
            בחר אילו תכונות להפעיל לכל טמפלט או ל-AI Agent
          </p>
        </div>
        <Button onClick={handleSave} size="lg">
          <Save className="h-4 w-4 mr-2" />
          Save Configuration
        </Button>
      </div>

      {/* Success Message */}
      {saved && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Configuration saved successfully!
          </AlertDescription>
        </Alert>
      )}

      {/* Info Alert */}
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>Note:</strong> Some features require external APIs or premium subscriptions.
          Make sure to configure the necessary API keys before enabling them.
        </AlertDescription>
      </Alert>

      {/* Tabs for Templates and AI */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="nara">NARA</TabsTrigger>
          <TabsTrigger value="modern-dark">Modern Dark</TabsTrigger>
          <TabsTrigger value="luxury">Luxury</TabsTrigger>
          <TabsTrigger value="family">Family</TabsTrigger>
          <TabsTrigger value="ai">AI Agent</TabsTrigger>
        </TabsList>

        {/* NARA Template */}
        <TabsContent value="nara" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NARA Template Features</CardTitle>
              <CardDescription>
                תכונות זמינות לטמפלט NARA (קרוסלה)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(featuresByCategory).map(([category, features]) =>
                renderCategorySection(
                  category as FeatureCategory,
                  features,
                  'template',
                  'nara'
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Modern Dark Template */}
        <TabsContent value="modern-dark" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Modern Dark Template Features</CardTitle>
              <CardDescription>
                תכונות זמינות לטמפלט Modern Dark (מינימליסטי)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(featuresByCategory).map(([category, features]) =>
                renderCategorySection(
                  category as FeatureCategory,
                  features,
                  'template',
                  'modern-dark'
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Luxury Template */}
        <TabsContent value="luxury" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Luxury Template Features</CardTitle>
              <CardDescription>
                תכונות זמינות לטמפלט Luxury (אלגנטי)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(featuresByCategory).map(([category, features]) =>
                renderCategorySection(
                  category as FeatureCategory,
                  features,
                  'template',
                  'luxury'
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Family Template */}
        <TabsContent value="family" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Family Template Features</CardTitle>
              <CardDescription>
                תכונות זמינות לטמפלט Family (משפחתי)
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(featuresByCategory).map(([category, features]) =>
                renderCategorySection(
                  category as FeatureCategory,
                  features,
                  'template',
                  'family'
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Agent */}
        <TabsContent value="ai" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>AI Agent Features</CardTitle>
              <CardDescription>
                תכונות זמינות ל-AI Booking Assistant
              </CardDescription>
            </CardHeader>
            <CardContent>
              {Object.entries(featuresByCategory).map(([category, features]) =>
                renderCategorySection(
                  category as FeatureCategory,
                  features,
                  'ai'
                )
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {config.templates.map((template) => (
              <div key={template.templateId} className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2">{template.templateName}</h4>
                <p className="text-sm text-muted-foreground">
                  {template.enabledFeatures.length} features enabled
                </p>
              </div>
            ))}
            <div className="p-4 border rounded-lg bg-blue-50">
              <h4 className="font-semibold mb-2">AI Agent</h4>
              <p className="text-sm text-muted-foreground">
                {config.aiAgent.enabledFeatures.length} features enabled
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
