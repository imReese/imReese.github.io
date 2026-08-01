import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  blockRemaining,
  blockSpeedup,
  checkpointAlignedResume,
  fullAttentionRemaining,
  kdaRemaining,
  remainingSpeedup,
  swaArea,
  swaRemaining,
  tokenWiseRemaining,
} from '../src/components/shared/attention-cache/math.ts'

const closeTo = (actual: number, expected: number, epsilon = 1e-10) => {
  assert.ok(
    Math.abs(actual - expected) <= epsilon,
    `expected ${actual} to be within ${epsilon} of ${expected}`,
  )
}

test('full causal attention remaining FLOPs follow 1 - alpha squared', () => {
  assert.equal(fullAttentionRemaining(0), 1)
  assert.equal(fullAttentionRemaining(0.5), 0.75)
  closeTo(fullAttentionRemaining(0.9), 0.19)
})

test('SWA area covers both sides of the window boundary', () => {
  closeTo(swaArea(0.2, 0.25), 0.02)
  assert.equal(swaArea(0.25, 0.25), 0.03125)
  assert.equal(swaArea(0.5, 0.25), 0.09375)
  closeTo(swaRemaining(0.5, 0.25), 4 / 7)
  closeTo(swaRemaining(0.9, 0.25), 4 / 35)
})

test('checkpoint resume is exact when aligned and rounds down when not aligned', () => {
  assert.equal(checkpointAlignedResume(16_384, 32_768, 4096), 16_384)
  assert.equal(checkpointAlignedResume(18_000, 32_768, 4096), 16_384)
  assert.equal(checkpointAlignedResume(40_000, 32_768, 4096), 32_768)
  assert.equal(checkpointAlignedResume(18_000, 32_768, 0), 0)
})

test('KDA recurrence remaining work uses the checkpoint-aligned boundary', () => {
  assert.equal(kdaRemaining(0, 32_768, 4096), 1)
  assert.equal(kdaRemaining(0.5, 32_768, 4096), 0.5)
  assert.equal(kdaRemaining(0.9, 32_768, 4096), 0.125)
})

test('block model combines attention and token-wise work', () => {
  assert.equal(tokenWiseRemaining(0.5), 0.5)
  assert.equal(blockRemaining(0, 0.5), 1)
  assert.equal(blockRemaining(0.5, 0.5), 0.625)
  closeTo(blockRemaining(0.9, 0.5), 0.145)
  closeTo(blockSpeedup(0.5, 0.3), 1 / 0.575)
  assert.equal(blockSpeedup(0.5, 0.5), 1.6)
  closeTo(blockSpeedup(0.5, 0.7), 1 / 0.675)
})

test('boundary and invalid inputs remain finite and non-negative', () => {
  const remainingValues = [
    fullAttentionRemaining(-1),
    fullAttentionRemaining(1),
    fullAttentionRemaining(Number.NaN),
    swaArea(-1, 0.25),
    swaRemaining(1, 0.25),
    swaRemaining(0.5, 0),
    kdaRemaining(1, 32_768, 4096),
    kdaRemaining(0.5, 0, 4096),
    blockRemaining(1, 1),
    blockRemaining(Number.POSITIVE_INFINITY, Number.NaN),
  ]
  const speedups = [
    remainingSpeedup(0),
    remainingSpeedup(Number.NaN),
    blockSpeedup(1, 1),
    blockSpeedup(Number.NaN, Number.POSITIVE_INFINITY),
  ]

  for (const value of [...remainingValues, ...speedups]) {
    assert.equal(Number.isFinite(value), true)
    assert.ok(value >= 0)
  }
})

test('MDX preview registers all four stable interactive names', () => {
  const previewConfig = JSON.parse(readFileSync('.mdx-previewrc.json', 'utf8'))
  const componentNames = [
    'AttentionSpeedupCurve',
    'AttentionStateEvolution',
    'PrefillSpeedupExplorer',
    'PrefixCacheTriangle',
  ]

  for (const componentName of componentNames) {
    assert.equal(
      previewConfig.components[componentName],
      `./src/components/shared/mdx-preview/${componentName}.tsx`,
    )
    assert.match(
      readFileSync(
        `src/components/shared/mdx-preview/${componentName}.tsx`,
        'utf8',
      ),
      new RegExp(`export \\{ ${componentName} as default \\}`),
    )
  }
})
