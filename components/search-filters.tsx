"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, X } from "lucide-react"

interface Genre {
  name: string
}

interface SearchFiltersProps {
  genres: Genre[]
}

export function SearchFilters({ genres }: SearchFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [genre, setGenre] = useState(searchParams.get("genre") || "all")
  const [sort, setSort] = useState(searchParams.get("sort") || "created_at")

  const updateFilters = () => {
    const params = new URLSearchParams()

    if (search) params.set("search", search)
    if (genre !== "all") params.set("genre", genre)
    if (sort !== "created_at") params.set("sort", sort)

    router.push(`/browse?${params.toString()}`)
  }

  const clearFilters = () => {
    setSearch("")
    setGenre("all")
    setSort("created_at")
    router.push("/browse")
  }

  const hasActiveFilters = search || genre !== "all" || sort !== "created_at"

  return (
    <div className="bg-white dark:bg-gray-900 rounded-lg p-6 shadow-sm border">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search books by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10"
            onKeyDown={(e) => e.key === "Enter" && updateFilters()}
          />
        </div>

        {/* Genre Filter */}
        <Select value={genre} onValueChange={setGenre}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue placeholder="All Genres" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Genres</SelectItem>
            {genres.map((g) => (
              <SelectItem key={g.name} value={g.name}>
                {g.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sort Filter */}
        <Select value={sort} onValueChange={setSort}>
          <SelectTrigger className="w-full lg:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="created_at">Newest First</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="price">Price Low-High</SelectItem>
            <SelectItem value="average_rating">Highest Rated</SelectItem>
          </SelectContent>
        </Select>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button onClick={updateFilters} className="flex-1 lg:flex-none">
            <Filter className="h-4 w-4 mr-2" />
            Apply
          </Button>
          {hasActiveFilters && (
            <Button variant="outline" onClick={clearFilters}>
              <X className="h-4 w-4 mr-2" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
