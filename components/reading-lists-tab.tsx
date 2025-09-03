"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { BookOpen, Plus, Users, Lock, Share2, Trash2 } from "lucide-react"
import { createClient } from "@/lib/neon/database"

interface ReadingListsTabProps {
  readingLists: {
    id: string
    name: string
    description: string
    is_public: boolean
    created_at: string
    reading_list_items: {
      books: {
        id: string
        title: string
        authors: { name: string } | null
        genres: { name: string } | null
      }
    }[]
  }[]
  userId: string
}

export function ReadingListsTab({ readingLists, userId }: ReadingListsTabProps) {
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [newListName, setNewListName] = useState("")
  const [newListDescription, setNewListDescription] = useState("")
  const [newListPublic, setNewListPublic] = useState(false)
  const db = createClient()

  const createReadingList = async () => {
    if (!newListName.trim()) return

    await db.from("reading_lists").insert({
      user_id: userId,
      name: newListName,
      description: newListDescription || null,
      is_public: newListPublic,
    }).execute()

    setNewListName("")
    setNewListDescription("")
    setNewListPublic(false)
    setShowCreateDialog(false)
    window.location.reload()
  }

  const deleteReadingList = async (listId: string) => {
    await db.from("reading_lists").delete().eq("id", listId).eq("user_id", userId).execute()
    window.location.reload()
  }

  return (
    <div className="space-y-6">
      {/* Create New List Button */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogTrigger asChild>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Create Reading List
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Reading List</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="list-name">List Name</Label>
              <Input
                id="list-name"
                placeholder="My Favorite Books"
                value={newListName}
                onChange={(e) => setNewListName(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="list-description">Description (Optional)</Label>
              <Textarea
                id="list-description"
                placeholder="A collection of my all-time favorite reads..."
                value={newListDescription}
                onChange={(e) => setNewListDescription(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2">
              <Switch id="list-public" checked={newListPublic} onCheckedChange={setNewListPublic} />
              <Label htmlFor="list-public">Make this list public</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={createReadingList} disabled={!newListName.trim()}>
                Create List
              </Button>
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reading Lists */}
      {readingLists.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <BookOpen className="h-16 w-16 text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">No reading lists yet</h3>
            <p className="text-gray-600 dark:text-gray-300 text-center mb-4">
              Create your first reading list to organize your favorite books
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {readingLists.map((list) => (
            <Card key={list.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{list.name}</CardTitle>
                    <CardDescription className="line-clamp-2">{list.description || "No description"}</CardDescription>
                  </div>
                  <div className="flex items-center gap-1 ml-2">
                    {list.is_public ? (
                      <Badge variant="secondary">
                        <Users className="h-3 w-3 mr-1" />
                        Public
                      </Badge>
                    ) : (
                      <Badge variant="outline">
                        <Lock className="h-3 w-3 mr-1" />
                        Private
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Book Count */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="h-4 w-4" />
                  {list.reading_list_items.length} books
                </div>

                {/* Sample Books */}
                {list.reading_list_items.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Books in this list:</h4>
                    <div className="space-y-1">
                      {list.reading_list_items.slice(0, 3).map((item, index) => (
                        <div key={index} className="text-sm text-muted-foreground">
                          • {item.books.title} by {item.books.authors?.name}
                        </div>
                      ))}
                      {list.reading_list_items.length > 3 && (
                        <div className="text-sm text-muted-foreground">
                          ... and {list.reading_list_items.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t">
                  <Button variant="outline" size="sm" className="flex-1 bg-transparent">
                    <BookOpen className="h-4 w-4 mr-2" />
                    View List
                  </Button>
                  {list.is_public && (
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => deleteReadingList(list.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-xs text-muted-foreground">
                  Created {new Date(list.created_at).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
