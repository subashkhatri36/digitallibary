import { requireAdmin } from "@/lib/admin-auth"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Sparkles, BookOpen, Mic, FileText, Wand2, Brain } from "lucide-react"

export default async function AdminAITools() {
  await requireAdmin()

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-8 h-8 text-purple-500" />
            <div>
              <h1 className="text-3xl font-bold">AI Content Tools</h1>
              <p className="text-muted-foreground">Generate and enhance content with AI</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Content Generation Tools */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-500" />
                <CardTitle>Novel Generator</CardTitle>
              </div>
              <CardDescription>Generate complete novels or chapters using AI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Genre</label>
                <Input placeholder="e.g., Fantasy, Romance, Mystery" />
              </div>
              <div>
                <label className="text-sm font-medium">Theme/Plot</label>
                <Textarea placeholder="Describe the main theme, characters, or plot points..." rows={3} />
              </div>
              <div>
                <label className="text-sm font-medium">Length</label>
                <select className="w-full p-2 border rounded-md">
                  <option>Short Story (5-10 pages)</option>
                  <option>Novella (50-100 pages)</option>
                  <option>Novel (200+ pages)</option>
                </select>
              </div>
              <Button className="w-full">
                <Wand2 className="w-4 h-4 mr-2" />
                Generate Novel
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-500" />
                <CardTitle>Summary Generator</CardTitle>
              </div>
              <CardDescription>Create compelling book summaries and descriptions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium">Book Title</label>
                <Input placeholder="Enter book title" />
              </div>
              <div>
                <label className="text-sm font-medium">Key Plot Points</label>
                <Textarea placeholder="List main characters, setting, conflict, and resolution..." rows={4} />
              </div>
              <div>
                <label className="text-sm font-medium">Target Audience</label>
                <Input placeholder="e.g., Young Adult, Adult Fiction" />
              </div>
              <Button className="w-full">
                <Brain className="w-4 h-4 mr-2" />
                Generate Summary
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Audio Generation */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mic className="w-5 h-5 text-red-500" />
              <CardTitle>Audiobook Narration</CardTitle>
            </div>
            <CardDescription>Generate AI narration for book pages</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Select Book</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Choose a book...</option>
                    <option>The Great Adventure</option>
                    <option>Mystery of the Lost City</option>
                    <option>Romance in Paris</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Voice Style</label>
                  <select className="w-full p-2 border rounded-md">
                    <option>Professional Male</option>
                    <option>Professional Female</option>
                    <option>Dramatic Male</option>
                    <option>Dramatic Female</option>
                    <option>Youthful</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium">Page Range</label>
                  <div className="flex gap-2">
                    <Input placeholder="From page" type="number" />
                    <Input placeholder="To page" type="number" />
                  </div>
                </div>
                <Button className="w-full">
                  <Mic className="w-4 h-4 mr-2" />
                  Generate Audio
                </Button>
              </div>
              <div className="bg-muted p-4 rounded-lg">
                <h4 className="font-medium mb-2">Audio Generation Status</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page 1-10</span>
                    <Badge variant="outline">Completed</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page 11-20</span>
                    <Badge>In Progress</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Page 21-30</span>
                    <Badge variant="secondary">Queued</Badge>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Content Analysis */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Brain className="w-5 h-5 text-purple-500" />
              <CardTitle>Content Analysis</CardTitle>
            </div>
            <CardDescription>AI-powered analysis of characters, themes, and plot elements</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <FileText className="w-6 h-6 mb-2" />
                <span>Extract Characters</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <Sparkles className="w-6 h-6 mb-2" />
                <span>Identify Themes</span>
              </Button>
              <Button variant="outline" className="h-20 flex-col bg-transparent">
                <BookOpen className="w-6 h-6 mb-2" />
                <span>Plot Analysis</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Recent AI Activities */}
        <Card>
          <CardHeader>
            <CardTitle>Recent AI Activities</CardTitle>
            <CardDescription>Latest AI-generated content and analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <BookOpen className="w-5 h-5 text-blue-500" />
                  <div>
                    <h5 className="font-medium">Generated novel: "The Digital Realm"</h5>
                    <p className="text-sm text-muted-foreground">Fantasy • 150 pages • 2 hours ago</p>
                  </div>
                </div>
                <Badge>Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Mic className="w-5 h-5 text-red-500" />
                  <div>
                    <h5 className="font-medium">Audio narration for "Mystery Novel"</h5>
                    <p className="text-sm text-muted-foreground">Pages 1-50 • 4 hours ago</p>
                  </div>
                </div>
                <Badge>Completed</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Brain className="w-5 h-5 text-purple-500" />
                  <div>
                    <h5 className="font-medium">Character analysis for "Romance Story"</h5>
                    <p className="text-sm text-muted-foreground">Extracted 12 characters • 6 hours ago</p>
                  </div>
                </div>
                <Badge>Completed</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
