import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Clock, Target, Flame } from "lucide-react"

interface ReadingStatsProps {
  profile: {
    reading_streak: number
    total_books_read: number
    subscription_tier: string
  } | null
  readingProgress: {
    current_page: number
    total_pages_read: number
    reading_time_minutes: number
    is_completed: boolean
    books: {
      title: string
      page_count: number
    }
  }[]
  totalBooks: number
}

export function ReadingStats({ profile, readingProgress, totalBooks }: ReadingStatsProps) {
  const currentlyReading = readingProgress.filter((p) => !p.is_completed).length
  const totalReadingTime = readingProgress.reduce((sum, p) => sum + p.reading_time_minutes, 0)
  const averageProgress =
    readingProgress.length > 0
      ? readingProgress.reduce((sum, p) => sum + (p.current_page / p.books.page_count) * 100, 0) /
        readingProgress.length
      : 0

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Books in Library</CardTitle>
          <BookOpen className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalBooks}</div>
          <p className="text-xs text-muted-foreground">{currentlyReading} currently reading</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Books Completed</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.total_books_read || 0}</div>
          <p className="text-xs text-muted-foreground">All time achievements</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reading Streak</CardTitle>
          <Flame className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{profile?.reading_streak || 0}</div>
          <p className="text-xs text-muted-foreground">Days in a row</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Reading Time</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{Math.floor(totalReadingTime / 60)}h</div>
          <p className="text-xs text-muted-foreground">{totalReadingTime % 60}m total</p>
        </CardContent>
      </Card>
    </div>
  )
}
