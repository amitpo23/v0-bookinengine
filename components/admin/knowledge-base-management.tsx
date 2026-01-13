"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, HelpCircle, ThumbsUp, ThumbsDown, Eye, Clock, Search, Tag, AlertTriangle } from "lucide-react"
import { KNOWLEDGE_BASE, SYSTEM_GUIDELINES } from "@/lib/admin/admin-system-data"
import type { KnowledgeArticle, SystemGuideline } from "@/types/admin-types"

export function KnowledgeBaseManagement() {
  const [searchQuery, setSearchQuery] = useState("")
  const [articles] = useState<KnowledgeArticle[]>(KNOWLEDGE_BASE)
  const [guidelines] = useState<SystemGuideline[]>(SYSTEM_GUIDELINES)
  const [selectedArticle, setSelectedArticle] = useState<KnowledgeArticle | null>(null)

  // Filter articles
  const filteredArticles = articles.filter(article =>
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const getDifficultyColor = (difficulty: KnowledgeArticle["difficulty"]) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/10 text-green-500"
      case "intermediate":
        return "bg-yellow-500/10 text-yellow-500"
      case "advanced":
        return "bg-red-500/10 text-red-500"
    }
  }

  const getPriorityColor = (priority: SystemGuideline["priority"]) => {
    switch (priority) {
      case "low":
        return "bg-blue-500/10 text-blue-500"
      case "medium":
        return "bg-yellow-500/10 text-yellow-500"
      case "high":
        return "bg-orange-500/10 text-orange-500"
      case "critical":
        return "bg-red-500/10 text-red-500"
    }
  }

  const getCategoryColor = (category: SystemGuideline["category"]) => {
    switch (category) {
      case "security":
        return "bg-red-500/10 text-red-500"
      case "operations":
        return "bg-blue-500/10 text-blue-500"
      case "development":
        return "bg-purple-500/10 text-purple-500"
      case "support":
        return "bg-green-500/10 text-green-500"
      case "compliance":
        return "bg-orange-500/10 text-orange-500"
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>מרכז ידע והנחיות</CardTitle>
              <CardDescription>מדריכים, הנחיות ומדיניות מערכת</CardDescription>
            </div>
            <Button>
              <BookOpen className="h-4 w-4 mr-2" />
              מאמר חדש
            </Button>
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="knowledge" dir="rtl">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="knowledge">מרכז ידע</TabsTrigger>
          <TabsTrigger value="guidelines">הנחיות מערכת</TabsTrigger>
        </TabsList>

        {/* Knowledge Base Tab */}
        <TabsContent value="knowledge" className="space-y-4">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardDescription>סך המאמרים</CardDescription>
                <CardTitle className="text-3xl">{articles.length}</CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Eye className="h-4 w-4 text-blue-500" />
                  סך צפיות
                </CardDescription>
                <CardTitle className="text-3xl text-blue-500">
                  {articles.reduce((sum, a) => sum + a.views, 0)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <ThumbsUp className="h-4 w-4 text-green-500" />
                  דירוג חיובי
                </CardDescription>
                <CardTitle className="text-3xl text-green-500">
                  {Math.round(
                    (articles.reduce((sum, a) => sum + a.helpful, 0) /
                      (articles.reduce((sum, a) => sum + a.helpful + a.notHelpful, 0) || 1)) *
                      100
                  )}
                  %
                </CardTitle>
              </CardHeader>
            </Card>
            <Card>
              <CardHeader className="pb-3">
                <CardDescription className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-purple-500" />
                  זמן קריאה ממוצע
                </CardDescription>
                <CardTitle className="text-3xl text-purple-500">
                  {Math.round(
                    articles.reduce((sum, a) => sum + a.estimatedReadTime, 0) / articles.length
                  )}{" "}
                  דק'
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Search */}
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="חפש במרכז הידע..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
            />
          </div>

          {/* Articles Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredArticles.map((article) => (
              <Card
                key={article.id}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedArticle(article)}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="text-lg">{article.title}</CardTitle>
                    <Badge className={getDifficultyColor(article.difficulty)}>
                      {article.difficulty === "beginner" && "מתחילים"}
                      {article.difficulty === "intermediate" && "בינוני"}
                      {article.difficulty === "advanced" && "מתקדם"}
                    </Badge>
                  </div>
                  <CardDescription>{article.summary}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Tags */}
                    <div className="flex flex-wrap gap-1">
                      {article.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          <Tag className="h-3 w-3 mr-1" />
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="h-3 w-3 text-green-500" />
                        {article.helpful}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {article.estimatedReadTime} דק'
                      </span>
                    </div>

                    {/* Related Templates */}
                    {article.relatedTemplates.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {article.relatedTemplates.map((template) => (
                          <Badge key={template} variant="outline" className="text-xs">
                            {template}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredArticles.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>לא נמצאו מאמרים התואמים את החיפוש</p>
            </div>
          )}
        </TabsContent>

        {/* Guidelines Tab */}
        <TabsContent value="guidelines" className="space-y-4">
          {/* Guidelines List */}
          <div className="space-y-3">
            {guidelines.map((guideline) => (
              <Card key={guideline.id} className={guideline.mandatory ? "border-yellow-500" : ""}>
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg">{guideline.title}</CardTitle>
                        {guideline.mandatory && (
                          <Badge className="bg-yellow-500/10 text-yellow-500">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            חובה
                          </Badge>
                        )}
                      </div>
                      <CardDescription>{guideline.content}</CardDescription>
                    </div>
                    <div className="flex flex-col gap-2">
                      <Badge className={getPriorityColor(guideline.priority)}>
                        {guideline.priority === "low" && "נמוך"}
                        {guideline.priority === "medium" && "בינוני"}
                        {guideline.priority === "high" && "גבוה"}
                        {guideline.priority === "critical" && "קריטי"}
                      </Badge>
                      <Badge className={getCategoryColor(guideline.category)}>
                        {guideline.category === "security" && "אבטחה"}
                        {guideline.category === "operations" && "תפעול"}
                        {guideline.category === "development" && "פיתוח"}
                        {guideline.category === "support" && "תמיכה"}
                        {guideline.category === "compliance" && "תאימות"}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Enforced Rules */}
                    {guideline.enforcedRules.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">כללים נאכפים:</p>
                        <div className="flex flex-wrap gap-1">
                          {guideline.enforcedRules.map((rule) => (
                            <Badge key={rule} variant="secondary" className="text-xs">
                              {rule}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Applicable Roles */}
                    <div>
                      <p className="text-sm font-medium mb-2">חל על תפקידים:</p>
                      <div className="flex flex-wrap gap-1">
                        {guideline.applicableRoles.map((role) => (
                          <Badge key={role} variant="outline" className="text-xs">
                            {role}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Applicable Templates */}
                    {guideline.applicableTemplates.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">חל על טמפלטים:</p>
                        <div className="flex flex-wrap gap-1">
                          {guideline.applicableTemplates.map((template) => (
                            <Badge key={template} variant="outline" className="text-xs">
                              {template}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-3xl w-full max-h-[80vh] overflow-y-auto">
            <CardHeader>
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-2xl">{selectedArticle.title}</CardTitle>
                <Button variant="ghost" size="sm" onClick={() => setSelectedArticle(null)}>
                  ×
                </Button>
              </div>
              <CardDescription>
                <div className="flex items-center gap-4 mt-2">
                  <Badge className={getDifficultyColor(selectedArticle.difficulty)}>
                    {selectedArticle.difficulty}
                  </Badge>
                  <span className="flex items-center gap-1 text-sm">
                    <Eye className="h-3 w-3" />
                    {selectedArticle.views} צפיות
                  </span>
                  <span className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3" />
                    {selectedArticle.estimatedReadTime} דקות
                  </span>
                </div>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="prose prose-sm max-w-none">{selectedArticle.content}</div>

              {/* Feedback */}
              <div className="flex items-center gap-4 pt-4 border-t">
                <p className="text-sm font-medium">האם המאמר עזר לך?</p>
                <Button variant="outline" size="sm">
                  <ThumbsUp className="h-4 w-4 mr-2" />
                  כן ({selectedArticle.helpful})
                </Button>
                <Button variant="outline" size="sm">
                  <ThumbsDown className="h-4 w-4 mr-2" />
                  לא ({selectedArticle.notHelpful})
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
