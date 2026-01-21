import React, { forwardRef, useId } from 'react'

import { cn } from '@/src/lib/utils'
import { Input } from '@/src/components/ui/input'
import { Label } from '@/src/components/ui/label'

interface TextFieldProps extends React.ComponentPropsWithoutRef<typeof Input> {
  label: string
  description?: string
  error?: string
}

const TextField = forwardRef<HTMLInputElement, TextFieldProps>(
  (
    {
      id,
      label,
      description,
      error,
      className,
      type = 'text',
      ...props
    },
    ref,
  ) => {
    const generatedId = useId()
    const fieldId = id ?? props.name ?? generatedId

    return (
      <div className="flex w-full flex-col gap-1.5">
        <Label htmlFor={fieldId}>{label}</Label>
        <Input
          id={fieldId}
          ref={ref}
          type={type}
          aria-invalid={!!error}
          className={cn(
            'h-11',
            error && 'border-destructive focus-visible:border-destructive focus-visible:ring-destructive/30',
            className,
          )}
          {...props}
        />
        {description && (
          <p className="text-muted-foreground text-sm leading-snug">{description}</p>
        )}
        {error && <p className="text-destructive text-sm leading-snug">{error}</p>}
      </div>
    )
  },
)

TextField.displayName = 'TextField'

export { TextField }
