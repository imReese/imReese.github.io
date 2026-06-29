import { forwardRef } from 'react'
import clsx from 'clsx'

export const ContainerOuter = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'>
>(function OuterContainer({ className, children, ...props }, ref) {
  return (
    <div ref={ref} className={clsx('w-full max-w-full overflow-x-clip sm:px-8', className)} {...props}>
      <div className="mx-auto w-full max-w-full lg:max-w-[1600px] lg:px-8">{children}</div>
    </div>
  )
})

export const ContainerInner = forwardRef<
  React.ElementRef<'div'>,
  React.ComponentPropsWithoutRef<'div'> & {
    contentClassName?: string
  }
>(function InnerContainer({ className, contentClassName, children, ...props }, ref) {
  return (
    <div
      ref={ref}
      className={clsx('relative w-full max-w-full min-w-0 px-4 sm:px-8 lg:px-12', className)}
      {...props}
    >
      <div
        className={clsx(
          'mx-auto w-full max-w-2xl min-w-0 lg:max-w-6xl xl:max-w-7xl 2xl:max-w-[1440px]',
          contentClassName,
        )}
      >
        {children}
      </div>
    </div>
  )
})

export const Container = forwardRef<
  React.ElementRef<typeof ContainerOuter>,
  React.ComponentPropsWithoutRef<typeof ContainerOuter> & {
    contentClassName?: string
  }
>(function Container({ children, contentClassName, ...props }, ref) {
  return (
    <ContainerOuter ref={ref} {...props}>
      <ContainerInner contentClassName={contentClassName}>{children}</ContainerInner>
    </ContainerOuter>
  )
})
