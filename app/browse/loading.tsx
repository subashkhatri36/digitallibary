import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Search, Filter, BookOpen, Heart } from "lucide-react"

export default function Loading() {
  return (
    <div className="min-h-screen animate-gradient p-6">
      {/* Header Loading */}
      <div className="mb-8 animate-slide-up">
        <div className="flex items-center gap-3 mb-4">
          <Search className="h-8 w-8 text-primary animate-rotate" />
          <Skeleton className="h-8 w-40" />
          <Heart className="h-6 w-6 text-pink-500 animate-pulse" />
        </div>
        <Skeleton className="h-4 w-80" />
      </div>

      {/* Search and Filters Loading */}
      <div className="mb-6 space-y-4 animate-slide-up" style={{animationDelay: '0.2s'}}>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="flex gap-2">
          <Filter className="h-5 w-5 text-accent animate-bounce" />
          <Skeleton className="h-8 w-24" />
          <Skeleton className="h-8 w-28" />
          <Skeleton className="h-8 w-20" />
          <Skeleton className="h-8 w-32" />
        </div>
      </div>

      {/* Books Grid Loading */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <Card key={i} className="glass-effect hover-lift animate-bounce-in" style={{animationDelay: `${i * 0.1}s`}}>
            <CardHeader>
              <div className="relative">
                <Skeleton className="h-64 w-full mb-4" />
                <BookOpen className="absolute top-2 right-2 h-6 w-6 text-primary/50 animate-float" />
              </div>
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-16" />
                  <Skeleton className="h-6 w-20" />
                </div>
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <div className="flex justify-between items-center mt-4">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-8 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination Loading */}
      <div className="flex justify-center mt-8 animate-slide-up" style={{animationDelay: '0.5s'}}>
        <div className="flex gap-2">
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-10" />
          <Skeleton className="h-10 w-16" />
          <Skeleton className="h-10 w-10" />
        </div>
      </div>
    </div>
  )
}
