import { cn } from "@/lib/utils"

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "bg-gradient-to-r from-primary/20 via-accent/30 to-secondary/20 animate-shimmer rounded-md relative overflow-hidden",
        "before:absolute before:inset-0 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        "before:animate-shimmer before:transform before:translate-x-[-100%] before:animate-pulse",
        className
      )}
      {...props}
    />
  )
}

export { Skeleton }
