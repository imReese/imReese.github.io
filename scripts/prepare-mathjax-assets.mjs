import { cp, mkdir } from 'node:fs/promises'
import path from 'node:path'

const projectRoot = process.cwd()
const source = path.join(
  projectRoot,
  'node_modules/@mathjax/mathjax-newcm-font/chtml/woff2',
)
const destination = path.join(projectRoot, 'public/mathjax/fonts/newcm')

await mkdir(destination, { recursive: true })
await cp(source, destination, { force: true, recursive: true })
