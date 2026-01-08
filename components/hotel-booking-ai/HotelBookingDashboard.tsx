'use client';

/**
 * Hotel Booking AI - Dashboard Component
 * Main dashboard for managing AI booking engines
 */

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingDown, 
  Headphones, 
  Phone, 
  Sparkles, 
  Users, 
  Star,
  Plus,
  Play,
  Pause,
  Trash2,
  MessageSquare,
  BarChart3,
  Clock,
  Zap,
  AlertCircle,
  RefreshCw,
  Settings
} from 'lucide-react';

// ========================================
// TYPES
// ========================================

interface EngineTemplate {
  id: string;
  type: string;
  name: string;
  nameHe: string;
  description: string;
  descriptionHe: string;
  icon: string;
  color: string;
  capabilities: string[];
  skillCount: number;
}

interface EngineInstance {
  id: string;
  templateId: string;
  templateName: string;
  status: string;
  createdAt: string;
  lastActiveAt: string;
  metrics: {
    messagesProcessed: number;
    toolsExecuted: number;
    avgResponseTime: number;
    errorCount: number;
  };
}

interface DashboardStats {
  activeEngines: number;
  totalConversations: number;
  totalMessages: number;
  totalToolCalls: number;
  avgResponseTime: number;
  errorRate: number;
  enginesByType: Record<string, number>;
}

// ========================================
// ICON MAP
// ========================================

const iconMap: Record<string, React.ComponentType<any>> = {
  'building-2': Building2,
  'trending-down': TrendingDown,
  'headphones': Headphones,
  'phone': Phone,
  'sparkles': Sparkles,
  'users': Users,
  'star': Star
};

const getIcon = (iconName: string) => {
  return iconMap[iconName] || Building2;
};

// ========================================
// DASHBOARD COMPONENT
// ========================================

interface HotelBookingDashboardProps {
  language?: 'en' | 'he';
  onSelectEngine?: (instanceId: string) => void;
}

export function HotelBookingDashboard({ 
  language = 'en',
  onSelectEngine 
}: HotelBookingDashboardProps) {
  const [templates, setTemplates] = useState<EngineTemplate[]>([]);
  const [engines, setEngines] = useState<EngineInstance[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [creatingEngine, setCreatingEngine] = useState(false);

  const isRtl = language === 'he';

  // Fetch data
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [templatesRes, enginesRes, statsRes] = await Promise.all([
        fetch('/api/hotel-booking-ai?action=templates'),
        fetch('/api/hotel-booking-ai?action=engines'),
        fetch('/api/hotel-booking-ai?action=stats')
      ]);

      const templatesData = await templatesRes.json();
      const enginesData = await enginesRes.json();
      const statsData = await statsRes.json();

      if (templatesData.success) setTemplates(templatesData.data);
      if (enginesData.success) setEngines(enginesData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (err: any) {
      setError(err.message || 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const createEngine = async (templateId: string) => {
    try {
      setCreatingEngine(true);
      const res = await fetch('/api/hotel-booking-ai', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', templateId })
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        if (onSelectEngine) {
          onSelectEngine(data.data.id);
        }
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setCreatingEngine(false);
    }
  };

  const destroyEngine = async (instanceId: string) => {
    try {
      const res = await fetch(`/api/hotel-booking-ai?id=${instanceId}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <RefreshCw className="w-8 h-8 animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">
          {language === 'he' ? 'טוען...' : 'Loading...'}
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96 text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        <span>{error}</span>
        <button 
          onClick={fetchData}
          className="ml-4 px-4 py-2 bg-red-100 rounded-lg hover:bg-red-200"
        >
          {language === 'he' ? 'נסה שוב' : 'Retry'}
        </button>
      </div>
    );
  }

  return (
    <div className={`p-6 space-y-8 ${isRtl ? 'rtl' : 'ltr'}`} dir={isRtl ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            {language === 'he' ? 'מנועי הזמנות AI' : 'Hotel Booking AI'}
          </h1>
          <p className="text-gray-600 mt-1">
            {language === 'he' 
              ? 'ניהול וניטור מנועי הזמנות מבוססי AI'
              : 'Manage and monitor AI-powered booking engines'}
          </p>
        </div>
        <button 
          onClick={fetchData}
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          {language === 'he' ? 'רענון' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          <StatCard
            icon={<Zap className="w-5 h-5 text-green-500" />}
            label={language === 'he' ? 'מנועים פעילים' : 'Active Engines'}
            value={stats.activeEngines}
            color="green"
          />
          <StatCard
            icon={<MessageSquare className="w-5 h-5 text-blue-500" />}
            label={language === 'he' ? 'שיחות' : 'Conversations'}
            value={stats.totalConversations}
            color="blue"
          />
          <StatCard
            icon={<BarChart3 className="w-5 h-5 text-purple-500" />}
            label={language === 'he' ? 'הודעות' : 'Messages'}
            value={stats.totalMessages}
            color="purple"
          />
          <StatCard
            icon={<Settings className="w-5 h-5 text-orange-500" />}
            label={language === 'he' ? 'כלים' : 'Tool Calls'}
            value={stats.totalToolCalls}
            color="orange"
          />
          <StatCard
            icon={<Clock className="w-5 h-5 text-cyan-500" />}
            label={language === 'he' ? 'זמן תגובה ממוצע' : 'Avg Response'}
            value={`${Math.round(stats.avgResponseTime)}ms`}
            color="cyan"
          />
          <StatCard
            icon={<AlertCircle className="w-5 h-5 text-red-500" />}
            label={language === 'he' ? 'שגיאות' : 'Error Rate'}
            value={`${stats.errorRate.toFixed(1)}%`}
            color="red"
          />
        </div>
      )}

      {/* Engine Templates */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'he' ? 'תבניות מנועים' : 'Engine Templates'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {templates.map((template) => {
            const IconComponent = getIcon(template.icon);
            return (
              <div
                key={template.id}
                className={`bg-white rounded-xl border-2 p-5 hover:shadow-lg transition-all cursor-pointer ${
                  selectedTemplate === template.id 
                    ? 'border-blue-500 shadow-md' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg bg-${template.color}-100`}>
                    <IconComponent className={`w-6 h-6 text-${template.color}-600`} />
                  </div>
                  <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                    {template.skillCount} {language === 'he' ? 'יכולות' : 'skills'}
                  </span>
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  {language === 'he' ? template.nameHe : template.name}
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  {language === 'he' ? template.descriptionHe : template.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {template.capabilities.slice(0, 3).map((cap) => (
                    <span 
                      key={cap}
                      className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded"
                    >
                      {cap}
                    </span>
                  ))}
                  {template.capabilities.length > 3 && (
                    <span className="text-xs text-gray-400">
                      +{template.capabilities.length - 3}
                    </span>
                  )}
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    createEngine(template.id);
                  }}
                  disabled={creatingEngine}
                  className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                >
                  <Plus className="w-4 h-4" />
                  {language === 'he' ? 'צור מנוע' : 'Create Engine'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Active Engines */}
      <div>
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          {language === 'he' ? 'מנועים פעילים' : 'Active Engines'}
          <span className="text-sm font-normal text-gray-500 ml-2">
            ({engines.length})
          </span>
        </h2>
        {engines.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">
            <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-600">
              {language === 'he' 
                ? 'אין מנועים פעילים. צור אחד מהתבניות למעלה.'
                : 'No active engines. Create one from the templates above.'}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {language === 'he' ? 'מנוע' : 'Engine'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {language === 'he' ? 'סטטוס' : 'Status'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {language === 'he' ? 'הודעות' : 'Messages'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {language === 'he' ? 'זמן תגובה' : 'Avg Response'}
                  </th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-600">
                    {language === 'he' ? 'פעילות אחרונה' : 'Last Active'}
                  </th>
                  <th className="px-4 py-3 text-right text-sm font-medium text-gray-600">
                    {language === 'he' ? 'פעולות' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {engines.map((engine) => (
                  <tr key={engine.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <div className="font-medium text-gray-900">
                        {engine.templateName}
                      </div>
                      <div className="text-xs text-gray-500 font-mono">
                        {engine.id.slice(0, 20)}...
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                        engine.status === 'active' 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          engine.status === 'active' ? 'bg-green-500' : 'bg-gray-400'
                        }`} />
                        {engine.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {engine.metrics.messagesProcessed}
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {Math.round(engine.metrics.avgResponseTime)}ms
                    </td>
                    <td className="px-4 py-3 text-gray-600 text-sm">
                      {new Date(engine.lastActiveAt).toLocaleString(
                        language === 'he' ? 'he-IL' : 'en-US'
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectEngine?.(engine.id)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title={language === 'he' ? 'פתח צ\'אט' : 'Open Chat'}
                        >
                          <MessageSquare className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => destroyEngine(engine.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title={language === 'he' ? 'מחק' : 'Delete'}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

// ========================================
// STAT CARD COMPONENT
// ========================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
}

function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg bg-${color}-50`}>
          {icon}
        </div>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      </div>
    </div>
  );
}

export default HotelBookingDashboard;
