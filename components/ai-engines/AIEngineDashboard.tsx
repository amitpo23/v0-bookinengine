"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bot, Settings, MessageSquare, Zap, TrendingUp, Users, RefreshCw, Play, AlertCircle } from "lucide-react";
import Link from "next/link";

interface AIEngine {
  id: string;
  instanceId?: string;
  name: string;
  description: string;
  status: "active" | "inactive" | "maintenance";
  usage: number;
  type: "booking" | "support" | "sales" | "hotel-booking" | "travel-agent" | "concierge";
  activeConversations?: number;
  totalConversations?: number;
}

interface EngineStats {
  totalEngines: number;
  activeEngines: number;
  totalConversations: number;
  activeConversations: number;
  totalMessages: number;
}

export function AIEngineDashboard() {
  const [engines, setEngines] = useState<AIEngine[]>([]);
  const [stats, setStats] = useState<EngineStats>({
    totalEngines: 0,
    activeEngines: 0,
    totalConversations: 0,
    activeConversations: 0,
    totalMessages: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Fetch engines from API
      const enginesRes = await fetch('/api/ai-engines?action=engines');
      const enginesData = await enginesRes.json();
      
      if (enginesData.success && enginesData.engines) {
        const mappedEngines: AIEngine[] = enginesData.engines.map((e: any) => ({
          id: e.instanceId || e.id,
          instanceId: e.instanceId,
          name: e.name || e.templateId,
          description: `${e.type} engine with ${e.toolCount || 0} tools`,
          status: e.status || 'active',
          usage: Math.round(Math.random() * 100), // Placeholder until real analytics
          type: e.type,
          activeConversations: e.activeConversations || 0,
          totalConversations: e.totalConversations || 0
        }));
        setEngines(mappedEngines);
      }

      // Fetch stats
      const statsRes = await fetch('/api/ai-engines?action=stats');
      const statsData = await statsRes.json();
      
      if (statsData.success && statsData.stats) {
        setStats({
          totalEngines: statsData.stats.totalEngines || engines.length,
          activeEngines: statsData.stats.activeEngines || engines.filter(e => e.status === 'active').length,
          totalConversations: statsData.stats.totalConversations || 0,
          activeConversations: statsData.stats.activeConversations || 0,
          totalMessages: statsData.stats.totalMessages || 0
        });
      }
    } catch (err) {
      console.error('Error fetching AI engines data:', err);
      setError('Failed to load AI engines data');
      
      // Use demo data as fallback
      setEngines([
        {
          id: "1",
          name: "Booking Assistant",
          description: "AI-powered hotel booking assistant for customer inquiries",
          status: "active",
          usage: 85,
          type: "booking",
        },
        {
          id: "2",
          name: "Support Bot",
          description: "Customer support automation for common questions",
          status: "active",
          usage: 72,
          type: "support",
        },
        {
          id: "3",
          name: "Sales Agent",
          description: "Proactive sales assistant for upselling and promotions",
          status: "inactive",
          usage: 45,
          type: "sales",
        },
      ]);
      setStats({
        totalEngines: 3,
        activeEngines: 2,
        totalConversations: 156,
        activeConversations: 12,
        totalMessages: 1234
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (status: AIEngine["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-500";
      case "inactive":
        return "bg-gray-500";
      case "maintenance":
        return "bg-yellow-500";
    }
  };

  const getTypeLabel = (type: AIEngine["type"]) => {
    const labels: Record<string, string> = {
      'hotel-booking': 'Hotel',
      'travel-agent': 'Travel',
      'concierge': 'Concierge',
      'booking': 'Booking',
      'support': 'Support',
      'sales': 'Sales'
    };
    return labels[type] || type;
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">AI Engine Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Manage and monitor your AI booking engines
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={fetchData} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button className="gap-2">
            <Zap className="w-4 h-4" />
            New Engine
          </Button>
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-center gap-2">
          <AlertCircle className="w-5 h-5 text-yellow-600" />
          <span className="text-yellow-800">{error} - Showing demo data</span>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-100">
                <Bot className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Engines</p>
                <p className="text-2xl font-bold">
                  {stats.activeEngines} / {stats.totalEngines}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <MessageSquare className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Messages</p>
                <p className="text-2xl font-bold">{stats.totalMessages.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Conversations</p>
                <p className="text-2xl font-bold">{stats.totalConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-100">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Active Chats</p>
                <p className="text-2xl font-bold">{stats.activeConversations}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Engines List */}
      <div className="grid gap-4">
        {loading ? (
          <Card>
            <CardContent className="p-6 text-center">
              <RefreshCw className="w-8 h-8 mx-auto animate-spin text-muted-foreground" />
              <p className="mt-2 text-muted-foreground">Loading engines...</p>
            </CardContent>
          </Card>
        ) : engines.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center">
              <Bot className="w-12 h-12 mx-auto text-muted-foreground mb-2" />
              <h3 className="font-semibold">No AI Engines</h3>
              <p className="text-muted-foreground">Create your first AI engine to get started</p>
            </CardContent>
          </Card>
        ) : (
          engines.map((engine) => (
            <Card key={engine.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-slate-100">
                      <Bot className="w-6 h-6 text-slate-700" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-lg">{engine.name}</h3>
                        <div
                          className={`w-2 h-2 rounded-full ${getStatusColor(engine.status)}`}
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {engine.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Conversations</p>
                      <p className="font-semibold">{engine.totalConversations || 0}</p>
                    </div>
                    <Badge variant="secondary" className="capitalize">
                      {getTypeLabel(engine.type)}
                    </Badge>
                    <Link href={`/ai-engines/chat?engine=${engine.instanceId || engine.id}`}>
                      <Button variant="outline" size="icon" title="Start Chat">
                        <Play className="w-4 h-4" />
                      </Button>
                    </Link>
                    <Button variant="outline" size="icon" title="Settings">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}

export default AIEngineDashboard;
