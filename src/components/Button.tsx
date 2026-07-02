import Link from 'next/link'
import clsx from 'clsx'

const variantStyles = {
  primary:
    'bg-primary font-semibold text-primary-foreground hover:bg-primary/90 active:bg-primary active:text-primary-foreground/70',
  secondary:
    'bg-card font-medium text-foreground ring-1 ring-border/70 hover:bg-secondary active:bg-secondary active:text-foreground/60 dark:hover:bg-secondary dark:hover:text-foreground dark:active:bg-secondary dark:active:text-foreground/70',
}

type ButtonProps = {
  variant?: keyof typeof variantStyles
} & (
  | (React.ComponentPropsWithoutRef<'button'> & { href?: undefined })
  | React.ComponentPropsWithoutRef<typeof Link>
)

export function Button({
  variant = 'primary',
  className,
  ...props
}: ButtonProps) {
  className = clsx(
    'inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none',
    variantStyles[variant],
    className,
  )

  return typeof props.href === 'undefined' ? (
    <button className={className} {...props} />
  ) : (
    <Link className={className} {...props} />
  )
}
