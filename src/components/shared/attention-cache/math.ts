const MIN_REMAINING_RATIO = 1e-6

function finiteOr(value: number, fallback: number) {
  return Number.isFinite(value) ? value : fallback
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

export function clampUnit(value: number) {
  return clamp(finiteOr(value, 0), 0, 1)
}

export function fullAttentionRemaining(alpha: number) {
  const hitRatio = clampUnit(alpha)
  return clampUnit(1 - hitRatio * hitRatio)
}

export function tokenWiseRemaining(alpha: number) {
  return clampUnit(1 - clampUnit(alpha))
}

export function swaArea(length: number, windowRatio: number) {
  const normalizedLength = Math.max(0, finiteOr(length, 0))
  const normalizedWindow = Math.max(0, finiteOr(windowRatio, 0))

  if (normalizedLength <= normalizedWindow) {
    return (normalizedLength * normalizedLength) / 2
  }

  return Math.max(
    0,
    normalizedWindow * normalizedLength -
      (normalizedWindow * normalizedWindow) / 2,
  )
}

export function swaRemaining(alpha: number, windowRatio: number) {
  const totalArea = swaArea(1, windowRatio)

  if (totalArea <= 0) return 0

  const remainingArea = totalArea - swaArea(clampUnit(alpha), windowRatio)
  return clampUnit(remainingArea / totalArea)
}

export function checkpointAlignedResume(
  prefixTokens: number,
  totalTokens: number,
  checkpointInterval: number,
) {
  const total = Math.max(0, Math.floor(finiteOr(totalTokens, 0)))
  const interval = Math.max(0, Math.floor(finiteOr(checkpointInterval, 0)))

  if (total === 0 || interval === 0) return 0

  const prefix = clamp(Math.floor(finiteOr(prefixTokens, 0)), 0, total)

  return Math.min(total, Math.floor(prefix / interval) * interval)
}

export function kdaRemaining(
  alpha: number,
  totalTokens = 32_768,
  checkpointInterval = 1,
) {
  const total = Math.max(0, Math.floor(finiteOr(totalTokens, 0)))

  if (total === 0) return 0

  const prefixTokens = clampUnit(alpha) * total
  const effectiveResume = checkpointAlignedResume(
    prefixTokens,
    total,
    checkpointInterval,
  )

  return clampUnit((total - effectiveResume) / total)
}

export function blockRemaining(alpha: number, beta: number) {
  const attentionShare = clampUnit(beta)
  const attentionRemaining = fullAttentionRemaining(alpha)
  const linearRemaining = tokenWiseRemaining(alpha)

  return clampUnit(
    attentionShare * attentionRemaining +
      (1 - attentionShare) * linearRemaining,
  )
}

export function remainingSpeedup(remaining: number) {
  return 1 / Math.max(clampUnit(remaining), MIN_REMAINING_RATIO)
}

export function blockSpeedup(alpha: number, beta: number) {
  return remainingSpeedup(blockRemaining(alpha, beta))
}
