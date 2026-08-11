import * as React from "react"

import { cn } from "@/lib/utils"

function Textarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        "flex field-sizing-content min-h-16 w-full rounded-[1rem] border border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,.92)_0%,rgba(244,245,247,.82)_100%)] px-3 py-2 text-base shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_8px_20px_rgba(15,23,42,.04)] transition-all outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:shadow-[0_1px_0_rgba(255,255,255,.98)_inset,0_10px_24px_rgba(0,113,227,.06)] disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Textarea }
