import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

function Input({ className, type, ...props }: React.ComponentProps<"input">) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      className={cn(
        "h-9 w-full min-w-0 rounded-[1rem] border border-transparent bg-[linear-gradient(180deg,rgba(255,255,255,.92)_0%,rgba(244,245,247,.82)_100%)] px-3 py-1 text-base shadow-[0_1px_0_rgba(255,255,255,.95)_inset,0_8px_20px_rgba(15,23,42,.04)] transition-all outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-primary/15 focus-visible:shadow-[0_1px_0_rgba(255,255,255,.98)_inset,0_10px_24px_rgba(0,113,227,.06)] disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
