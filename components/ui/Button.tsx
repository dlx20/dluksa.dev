import React from "react"
import clsx from "clsx"

type ButtonVariant = "default" | "primary" | "secondary" | "borderless"
type ButtonSize = "xs" | "sm" | "md" | "lg" | "auto" | string

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  buttonText?: string
  variant?: ButtonVariant
  size?: ButtonSize
  isActive?: boolean
}

const Button: React.FC<ButtonProps> = ({
  buttonText,
  children,
  isActive = false,
  variant = "primary",
  size = "lg",
  className,
  ...props
}) => {
  // Variant base classes
  const variantClasses: Record<ButtonVariant, string> = {
    default: "site-btn__default site_btn__hover",
    primary: "site-btn__primary site_btn__hover",
    secondary: "site-btn__secondary site_btn__hover",
    borderless: "site-btn__borderless site_btn__hover",
  }

  const activeClasses: Record<ButtonVariant, string> = {
    default: "site-btn__active",
    primary: "site-btn__active",
    secondary: "site-btn__active",
    borderless: "site-btn__active",
  }
  // const activeStyle = 'site-btn__active'

  const sizeClasses: Record<ButtonSize, string> = {
    xs: "h-6 min-w-6 p-1 text-xs",
    sm: "h-8 min-w-8 p-2 text-sm",
    md: "h-10 min-w-10 p-4 text-md",
    lg: "h-12 min-w-12 p-6 text-lg",
    auto: 'w-full min-h-5 max-h-10 min-w-5 max-w-10 aspect-square p-0 text-base',
  }

  return (
    <button
      // Use isActive to conditionally apply the activeClasses for the current variant
      className={clsx(
        "inline-flex items-center justify-center transition-colors", 
        variantClasses[variant],
        sizeClasses[size],
        isActive && activeClasses[variant], // Only applies if isActive is true
        className
      )}
      aria-pressed={isActive} // Good for accessibility
      {...props}
    >
      {buttonText || children}
    </button>
  )
}

export default Button