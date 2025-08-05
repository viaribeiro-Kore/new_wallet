import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { AlertCircle, Loader2 } from "lucide-react"

import { cn } from "@/lib/utils"

const inputVariants = cva(
  "flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        error: "border-red-500 focus-visible:ring-red-500",
        success: "border-green-500 focus-visible:ring-green-500",
        warning: "border-yellow-500 focus-visible:ring-yellow-500",
      },
      size: {
        default: "h-10",
        sm: "h-9 px-2 py-1 text-xs",
        lg: "h-11 px-4 py-3",
        xl: "h-12 px-4 py-3 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
    VariantProps<typeof inputVariants> {
  error?: string
  helperText?: string
  label?: string
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    className, 
    type, 
    variant,
    size,
    error,
    helperText,
    label,
    loading = false,
    leftIcon,
    rightIcon,
    ...props 
  }, ref) => {
    const hasError = !!error
    const inputVariant = hasError ? "error" : variant
    
    return (
      <div className="w-full">
        {label && (
          <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 mb-2 block">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
              {leftIcon}
            </div>
          )}
          
          <input
            type={type}
            className={cn(
              inputVariants({ variant: inputVariant, size }),
              leftIcon && "pl-10",
              (rightIcon || loading || hasError) && "pr-10",
              className
            )}
            ref={ref}
            disabled={loading || props.disabled}
            {...props}
          />
          
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {loading && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
            {!loading && hasError && (
              <AlertCircle className="h-4 w-4 text-red-500" />
            )}
            {!loading && !hasError && rightIcon && (
              <span className="text-muted-foreground">{rightIcon}</span>
            )}
          </div>
        </div>
        
        {(error || helperText) && (
          <p className={cn(
            "text-xs mt-1",
            hasError ? "text-red-500" : "text-muted-foreground"
          )}>
            {error || helperText}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = "Input"

export { Input, inputVariants }