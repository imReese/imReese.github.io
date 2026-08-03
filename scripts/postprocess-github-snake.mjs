import { readFile, writeFile } from 'node:fs/promises'

const reducedMotionRule =
  '@media (prefers-reduced-motion:reduce){.c,.u,.s{animation:none!important}}'

const palettes = {
  light: {
    border: '#bcc0cc',
    snake: '#8839ef',
    dots: ['#dce0e8', '#acd8a3', '#78b66a', '#4b9342', '#2d7330'],
  },
  dark: {
    border: '#45475a',
    snake: '#cba6f7',
    dots: ['#313244', '#42674d', '#5f8f60', '#82b879', '#a6e3a1'],
  },
}

const rootVariablesPattern =
  /:root\{--cb:[^;]+;--cs:[^;]+;--ce:[^;]+;--c0:[^;]+;--c1:[^;]+;--c2:[^;]+;--c3:[^;]+;--c4:[^}]+\}/

function rootVariables({ border, snake, dots }) {
  const [empty, ...levels] = dots
  return `:root{--cb:${border};--cs:${snake};--ce:${empty};--c0:${empty};${levels
    .map((color, index) => `--c${index + 1}:${color}`)
    .join(';')}}`
}

async function postprocess(path) {
  const palette = path.includes('-dark.') ? palettes.dark : palettes.light
  let svg = await readFile(path, 'utf8')

  if (!rootVariablesPattern.test(svg)) {
    throw new Error(`Could not find snake color variables in ${path}`)
  }

  svg = svg.replace(rootVariablesPattern, rootVariables(palette))

  if (!svg.includes(reducedMotionRule)) {
    svg = svg.replace('</style>', `${reducedMotionRule}</style>`)
  }

  await writeFile(path, svg)
}

const paths = process.argv.slice(2)

if (paths.length === 0) {
  throw new Error('Provide at least one generated SVG path')
}

await Promise.all(paths.map(postprocess))
