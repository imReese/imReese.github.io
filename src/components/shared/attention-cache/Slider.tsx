'use client'

import * as React from 'react'

export function Slider({
  id,
  label,
  value,
  min = 0,
  max,
  step = 1,
  valueLabel = String(value),
  minLabel = String(min),
  maxLabel = String(max),
  description,
  onChange,
}: {
  id: string
  label: string
  value: number
  min?: number
  max: number
  step?: number
  valueLabel?: string
  minLabel?: string
  maxLabel?: string
  description?: string
  onChange: (value: number) => void
}) {
  const descriptionId = description ? `${id}-description` : undefined
  const updateValue = (nextValue: number) => onChange(nextValue)

  return (
    <div className="rounded-[8px] border border-border/80 bg-background/55 p-4">
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm font-semibold text-foreground">
          {label}
        </label>
        <output
          htmlFor={id}
          aria-live="polite"
          className="font-mono text-lg font-semibold tabular-nums text-primary"
        >
          {valueLabel}
        </output>
      </div>
      {description && (
        <p
          id={descriptionId}
          className="mb-3 text-xs leading-5 text-muted-foreground"
        >
          {description}
        </p>
      )}
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        aria-describedby={descriptionId}
        aria-valuetext={valueLabel}
        onChange={(event) => updateValue(Number(event.target.value))}
        onInput={(event) => updateValue(Number(event.currentTarget.value))}
        className="h-2 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      />
      <div className="mt-2 flex justify-between font-mono text-[11px] text-muted-foreground">
        <span>{minLabel}</span>
        <span>{maxLabel}</span>
      </div>
    </div>
  )
}
