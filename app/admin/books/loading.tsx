import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { BookOpen, Sparkles } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen animate-gradient p-6">
      {/* Header Loading */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <BookOpen className="h-8 w-8 text-primary animate-float" />
          <Skeleton className="h-8 w-48" />
          <Sparkles className="h-6 w-6 text-purple-500 animate-bounce" />
        </div>
        <Skeleton className="h-4 w-96" />
      </div>

      {/* Action Bar Loading */}
      <div className="flex justify-between items-center mb-6 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <Skeleton className="h-10 w-32" />
        <div className="flex gap-2">
          <Skeleton className="h-10 w-24" />
          <Skeleton className="h-10 w-28" />
        </div>
      </div>

      {/* Books Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="glass-effect hover-lift animate-bounce-in" style={{animationDelay: `${i * 0.1}s`}}>
            <CardHeader>
              <Skeleton className="h-48 w-full mb-4" />
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-1/2" />
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
