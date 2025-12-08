"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"

// Icons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
)

const EditIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
  </svg>
)

const TrashIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3 6 5 6 21 6" />
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
)

const StarIcon = ({ className, filled }: { className?: string; filled?: boolean }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
  >
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
)

const GripIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="9" cy="5" r="1" />
    <circle cx="15" cy="5" r="1" />
    <circle cx="9" cy="12" r="1" />
    <circle cx="15" cy="12" r="1" />
    <circle cx="9" cy="19" r="1" />
    <circle cx="15" cy="19" r="1" />
  </svg>
)

const UploadIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
)

const CopyIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
)

export interface Agent {
  id: string
  name: string
  description: string
  avatar: string
  specialty: string
  online: boolean
  rating: number
  reviewCount: number
  languages: string[]
  systemPrompt?: string
  knowledgeBase?: string
  welcomeMessage?: string
  suggestedQuestions?: string[]
  order: number
}

const defaultAgents: Agent[] = [
  {
    id: "booking-agent",
    name: "סוכן הזמנות",
    description: "מומחה להזמנות מלונות ברחבי העולם",
    avatar: "/professional-booking-agent.jpg",
    specialty: "הזמנות מלונות",
    online: true,
    rating: 4.9,
    reviewCount: 1250,
    languages: ["עברית", "English", "العربية"],
    welcomeMessage: "שלום! אני סוכן ההזמנות שלך. איך אוכל לעזור לך למצוא את המלון המושלם?",
    suggestedQuestions: ["חפש מלון בדובאי", "מה הזמינות לסוף השבוע?", "כמה עולה חדר זוגי?"],
    order: 1,
  },
  {
    id: "dubai-expert",
    name: "מיסטר עזיז",
    description: "מומחה למלונות יוקרה בדובאי ואיחוד האמירויות",
    avatar: "/dubai-hotel-expert-man.jpg",
    specialty: "דובאי",
    online: true,
    rating: 4.8,
    reviewCount: 890,
    languages: ["العربية", "English", "עברית"],
    welcomeMessage: "مرحبا! אני עזיז, מומחה למלונות היוקרה הטובים ביותר בדובאי. מה אתם מחפשים?",
    suggestedQuestions: ["מלונות ליד הבורג' חליפה", "חופשה משפחתית בדובאי", "מלון עם נוף לים"],
    order: 2,
  },
  {
    id: "europe-expert",
    name: "סופיה",
    description: "מומחית לחופשות רומנטיות באירופה",
    avatar: "/european-travel-expert-woman.jpg",
    specialty: "אירופה",
    online: false,
    rating: 4.7,
    reviewCount: 620,
    languages: ["English", "Français", "עברית"],
    welcomeMessage: "Bonjour! אני סופיה, ואני אעזור לך לתכנן את החופשה הרומנטית המושלמת באירופה.",
    suggestedQuestions: ["מלון רומנטי בפריז", "סוף שבוע ברומא", "מלון בוטיק בברצלונה"],
    order: 3,
  },
]

const specialties = [
  "הזמנות מלונות",
  "דובאי",
  "אירופה",
  "אסיה",
  "ארה״ב",
  "ישראל",
  "יוקרה",
  "תקציב נמוך",
  "משפחות",
  "עסקים",
  "ספא ונופש",
  "חופשות חוף",
]

const availableLanguages = [
  "עברית",
  "English",
  "العربية",
  "Français",
  "Deutsch",
  "Español",
  "Italiano",
  "Русский",
  "中文",
  "日本語",
]

export function AgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>(defaultAgents)
  const [editingAgent, setEditingAgent] = useState<Agent | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("list")

  const handleCreateAgent = () => {
    setEditingAgent({
      id: `agent-${Date.now()}`,
      name: "",
      description: "",
      avatar: "",
      specialty: "",
      online: true,
      rating: 5.0,
      reviewCount: 0,
      languages: ["עברית"],
      welcomeMessage: "",
      suggestedQuestions: [],
      order: agents.length + 1,
    })
    setIsDialogOpen(true)
  }

  const handleEditAgent = (agent: Agent) => {
    setEditingAgent({ ...agent })
    setIsDialogOpen(true)
  }

  const handleSaveAgent = () => {
    if (!editingAgent) return

    setAgents((prev) => {
      const exists = prev.find((a) => a.id === editingAgent.id)
      if (exists) {
        return prev.map((a) => (a.id === editingAgent.id ? editingAgent : a))
      }
      return [...prev, editingAgent]
    })

    setIsDialogOpen(false)
    setEditingAgent(null)
  }

  const handleDeleteAgent = (agentId: string) => {
    if (confirm("האם אתה בטוח שברצונך למחוק סוכן זה?")) {
      setAgents((prev) => prev.filter((a) => a.id !== agentId))
    }
  }

  const handleToggleOnline = (agentId: string) => {
    setAgents((prev) => prev.map((a) => (a.id === agentId ? { ...a, online: !a.online } : a)))
  }

  const handleDuplicateAgent = (agent: Agent) => {
    const newAgent: Agent = {
      ...agent,
      id: `agent-${Date.now()}`,
      name: `${agent.name} (עותק)`,
      order: agents.length + 1,
    }
    setAgents((prev) => [...prev, newAgent])
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">ניהול סוכנים</h2>
          <p className="text-muted-foreground">צור ונהל סוכני AI בעלי התמחויות שונות</p>
        </div>
        <Button onClick={handleCreateAgent} className="bg-gradient-to-r from-emerald-600 to-cyan-600">
          <PlusIcon className="w-4 h-4 ml-2" />
          סוכן חדש
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="bg-muted/50">
          <TabsTrigger value="list">רשימת סוכנים</TabsTrigger>
          <TabsTrigger value="settings">הגדרות כלליות</TabsTrigger>
          <TabsTrigger value="analytics">סטטיסטיקות</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <div className="grid gap-4">
            {agents
              .sort((a, b) => a.order - b.order)
              .map((agent) => (
                <Card
                  key={agent.id}
                  className={cn(
                    "border transition-all duration-200 hover:shadow-lg",
                    agent.online ? "border-emerald-500/30 bg-emerald-500/5" : "border-border bg-muted/20 opacity-60",
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center gap-4">
                      {/* Drag Handle */}
                      <div className="cursor-grab text-muted-foreground hover:text-foreground">
                        <GripIcon className="w-5 h-5" />
                      </div>

                      {/* Avatar */}
                      <div className="relative">
                        <Avatar className="h-16 w-16 ring-2 ring-offset-2 ring-offset-background ring-emerald-500/50">
                          <AvatarImage src={agent.avatar || "/placeholder.svg"} alt={agent.name} />
                          <AvatarFallback className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white text-xl">
                            {agent.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div
                          className={cn(
                            "absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background",
                            agent.online ? "bg-emerald-500" : "bg-muted-foreground",
                          )}
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg text-foreground">{agent.name}</h3>
                          <Badge variant="outline" className="text-xs">
                            {agent.specialty}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-1">{agent.description}</p>
                        <div className="flex items-center gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <StarIcon className="w-4 h-4 text-yellow-500" filled />
                            <span className="text-sm font-medium">{agent.rating}</span>
                            <span className="text-xs text-muted-foreground">({agent.reviewCount} ביקורות)</span>
                          </div>
                          <div className="flex gap-1">
                            {agent.languages.slice(0, 3).map((lang) => (
                              <Badge key={lang} variant="secondary" className="text-xs">
                                {lang}
                              </Badge>
                            ))}
                            {agent.languages.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{agent.languages.length - 3}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2 ml-4">
                          <Label htmlFor={`online-${agent.id}`} className="text-sm text-muted-foreground">
                            {agent.online ? "מקוון" : "לא מקוון"}
                          </Label>
                          <Switch
                            id={`online-${agent.id}`}
                            checked={agent.online}
                            onCheckedChange={() => handleToggleOnline(agent.id)}
                          />
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDuplicateAgent(agent)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <CopyIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEditAgent(agent)}
                          className="text-muted-foreground hover:text-foreground"
                        >
                          <EditIcon className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAgent(agent.id)}
                          className="text-muted-foreground hover:text-red-500"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>

          {agents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-muted flex items-center justify-center">
                <PlusIcon className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium mb-2">אין סוכנים עדיין</h3>
              <p className="text-muted-foreground mb-4">צור את הסוכן הראשון שלך</p>
              <Button onClick={handleCreateAgent}>
                <PlusIcon className="w-4 h-4 ml-2" />
                צור סוכן
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות כלליות לסוכנים</CardTitle>
              <CardDescription>הגדרות שמשפיעות על כל הסוכנים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label>סוכן ברירת מחדל</Label>
                <Select defaultValue="booking-agent">
                  <SelectTrigger>
                    <SelectValue placeholder="בחר סוכן" />
                  </SelectTrigger>
                  <SelectContent>
                    {agents.map((agent) => (
                      <SelectItem key={agent.id} value={agent.id}>
                        {agent.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">סוכן זה ייבחר אוטומטית כשמשתמש נכנס לצ'אט</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>הצג רשימת סוכנים</Label>
                  <p className="text-xs text-muted-foreground">אפשר למשתמשים לבחור סוכן אחר</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>הצג דירוגים</Label>
                  <p className="text-xs text-muted-foreground">הצג דירוג וביקורות של סוכנים</p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>סינון לפי התמחות</Label>
                  <p className="text-xs text-muted-foreground">אפשר למשתמשים לסנן סוכנים לפי התמחות</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {agents.map((agent) => (
              <Card key={agent.id}>
                <CardHeader className="pb-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={agent.avatar || "/placeholder.svg"} />
                      <AvatarFallback>{agent.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <CardTitle className="text-base">{agent.name}</CardTitle>
                      <CardDescription>{agent.specialty}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-emerald-500">156</div>
                      <div className="text-xs text-muted-foreground">שיחות החודש</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold text-cyan-500">72%</div>
                      <div className="text-xs text-muted-foreground">אחוז המרה</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">{agent.rating}</div>
                      <div className="text-xs text-muted-foreground">דירוג ממוצע</div>
                    </div>
                    <div className="p-3 bg-muted/50 rounded-lg">
                      <div className="text-2xl font-bold">2.5m</div>
                      <div className="text-xs text-muted-foreground">זמן תגובה</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Edit/Create Agent Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingAgent?.name ? `עריכת סוכן: ${editingAgent.name}` : "יצירת סוכן חדש"}</DialogTitle>
            <DialogDescription>הגדר את פרטי הסוכן, התמחות והתנהגות</DialogDescription>
          </DialogHeader>

          {editingAgent && (
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="basic">פרטים בסיסיים</TabsTrigger>
                <TabsTrigger value="behavior">התנהגות</TabsTrigger>
                <TabsTrigger value="knowledge">ידע</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div className="flex gap-4">
                  {/* Avatar Upload */}
                  <div className="space-y-2">
                    <Label>תמונה</Label>
                    <div className="relative group">
                      <Avatar className="h-24 w-24 ring-2 ring-offset-2 ring-offset-background ring-muted">
                        <AvatarImage src={editingAgent.avatar || "/placeholder.svg"} />
                        <AvatarFallback className="bg-muted text-2xl">
                          {editingAgent.name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer">
                        <UploadIcon className="w-6 h-6 text-white" />
                      </div>
                    </div>
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">שם הסוכן</Label>
                      <Input
                        id="name"
                        value={editingAgent.name}
                        onChange={(e) => setEditingAgent({ ...editingAgent, name: e.target.value })}
                        placeholder="לדוגמה: מיסטר עזיז"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">תיאור</Label>
                      <Input
                        id="description"
                        value={editingAgent.description}
                        onChange={(e) => setEditingAgent({ ...editingAgent, description: e.target.value })}
                        placeholder="מומחה למלונות יוקרה בדובאי"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>התמחות</Label>
                    <Select
                      value={editingAgent.specialty}
                      onValueChange={(value) => setEditingAgent({ ...editingAgent, specialty: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="בחר התמחות" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((specialty) => (
                          <SelectItem key={specialty} value={specialty}>
                            {specialty}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>דירוג (1-5)</Label>
                    <Input
                      type="number"
                      min="1"
                      max="5"
                      step="0.1"
                      value={editingAgent.rating}
                      onChange={(e) =>
                        setEditingAgent({ ...editingAgent, rating: Number.parseFloat(e.target.value) || 5 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>שפות</Label>
                  <div className="flex flex-wrap gap-2">
                    {availableLanguages.map((lang) => (
                      <Badge
                        key={lang}
                        variant={editingAgent.languages.includes(lang) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => {
                          const languages = editingAgent.languages.includes(lang)
                            ? editingAgent.languages.filter((l) => l !== lang)
                            : [...editingAgent.languages, lang]
                          setEditingAgent({ ...editingAgent, languages })
                        }}
                      >
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="behavior" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="welcomeMessage">הודעת פתיחה</Label>
                  <Textarea
                    id="welcomeMessage"
                    value={editingAgent.welcomeMessage || ""}
                    onChange={(e) => setEditingAgent({ ...editingAgent, welcomeMessage: e.target.value })}
                    placeholder="שלום! אני סוכן ההזמנות שלך. איך אוכל לעזור?"
                    rows={3}
                  />
                </div>

                <div className="space-y-2">
                  <Label>שאלות מוצעות</Label>
                  <div className="space-y-2">
                    {(editingAgent.suggestedQuestions || []).map((question, index) => (
                      <div key={index} className="flex gap-2">
                        <Input
                          value={question}
                          onChange={(e) => {
                            const questions = [...(editingAgent.suggestedQuestions || [])]
                            questions[index] = e.target.value
                            setEditingAgent({ ...editingAgent, suggestedQuestions: questions })
                          }}
                          placeholder={`שאלה ${index + 1}`}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const questions = (editingAgent.suggestedQuestions || []).filter((_, i) => i !== index)
                            setEditingAgent({ ...editingAgent, suggestedQuestions: questions })
                          }}
                        >
                          <TrashIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const questions = [...(editingAgent.suggestedQuestions || []), ""]
                        setEditingAgent({ ...editingAgent, suggestedQuestions: questions })
                      }}
                    >
                      <PlusIcon className="w-4 h-4 ml-2" />
                      הוסף שאלה
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="systemPrompt">System Prompt</Label>
                  <Textarea
                    id="systemPrompt"
                    value={editingAgent.systemPrompt || ""}
                    onChange={(e) => setEditingAgent({ ...editingAgent, systemPrompt: e.target.value })}
                    placeholder="אתה סוכן הזמנות מלונות מקצועי..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    הנחיות ספציפיות לסוכן זה. ישלב עם ה-prompt הכללי של המערכת.
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="knowledge" className="space-y-4 mt-4">
                <div className="space-y-2">
                  <Label htmlFor="knowledgeBase">בסיס ידע</Label>
                  <Textarea
                    id="knowledgeBase"
                    value={editingAgent.knowledgeBase || ""}
                    onChange={(e) => setEditingAgent({ ...editingAgent, knowledgeBase: e.target.value })}
                    placeholder="מידע ספציפי שהסוכן צריך לדעת..."
                    rows={8}
                  />
                  <p className="text-xs text-muted-foreground">
                    מידע ייחודי לסוכן זה - מלונות מומלצים, טיפים, מידע על יעדים וכו'
                  </p>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-medium mb-2">מקורות מידע חיצוניים</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    הוסף לינקים לאתרים שהסוכן יוכל לחפש בהם מידע נוסף
                  </p>
                  <Button variant="outline" size="sm">
                    <PlusIcon className="w-4 h-4 ml-2" />
                    הוסף מקור מידע
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          )}

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              ביטול
            </Button>
            <Button onClick={handleSaveAgent} className="bg-gradient-to-r from-emerald-600 to-cyan-600">
              שמור סוכן
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
