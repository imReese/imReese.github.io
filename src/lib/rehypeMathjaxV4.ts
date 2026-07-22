import { MathJaxNewcmFont } from '@mathjax/mathjax-newcm-font/js/chtml.js'
import { AssistiveMmlHandler } from '@mathjax/src/js/a11y/assistive-mml.js'
import { liteAdaptor } from '@mathjax/src/js/adaptors/liteAdaptor.js'
import { RegisterHTMLHandler } from '@mathjax/src/js/handlers/html.js'
import { TeX } from '@mathjax/src/js/input/tex.js'
import '@mathjax/src/js/input/tex/ams/AmsConfiguration.js'
import '@mathjax/src/js/input/tex/base/BaseConfiguration.js'
import '@mathjax/src/js/input/tex/boldsymbol/BoldsymbolConfiguration.js'
import '@mathjax/src/js/input/tex/newcommand/NewcommandConfiguration.js'
import '@mathjax/src/js/input/tex/noundefined/NoUndefinedConfiguration.js'
import { mathjax } from '@mathjax/src/js/mathjax.js'
import { CHTML } from '@mathjax/src/js/output/chtml.js'
import { toText } from 'hast-util-to-text'
import type { Element, Parent, Root, RootContent } from 'hast'
import { visitParents } from 'unist-util-visit-parents'
import type { VFile } from 'vfile'
import { mathjaxNewcmPreloads } from './mathjaxNewcmPreloads'

const EM_SIZE = 16
const EX_SIZE = 8
const CONTENT_WIDTH = 48 * EM_SIZE
const FONT_URL = '/mathjax/fonts/newcm'

const adaptor = liteAdaptor({ fontSize: EM_SIZE })
AssistiveMmlHandler(RegisterHTMLHandler(adaptor))

const tex = new TeX({
  packages: ['base', 'ams', 'boldsymbol', 'newcommand', 'noundefined'],
  formatError(_jax: unknown, error: { message: string }) {
    throw new Error(error.message)
  },
})

const chtml = new CHTML({
  fontData: MathJaxNewcmFont,
  fontURL: FONT_URL,
})

const newcmDynamicFiles = (
  MathJaxNewcmFont as unknown as {
    dynamicFiles: Record<string, { promise: Promise<void> | null }>
  }
).dynamicFiles

// The preload imports register each setup callback. Marking them resolved lets
// MathJax install only the ranges a formula uses without a runtime import.
for (const name of mathjaxNewcmPreloads) {
  newcmDynamicFiles[name].promise = Promise.resolve()
}

const mathDocument = mathjax.document('', {
  InputJax: tex,
  OutputJax: chtml,
})

let renderQueue = Promise.resolve()

type MathTarget = {
  display: boolean
  element: Element
  parent: Parent
  scope: RootContent
}

function classesOf(element: Element) {
  return Array.isArray(element.properties.className)
    ? element.properties.className
    : []
}

async function renderMath(tree: Root, file: VFile) {
  const targets: MathTarget[] = []

  visitParents(tree, 'element', (element, parents) => {
    const classes = classesOf(element)
    const languageMath = classes.includes('language-math')
    const mathDisplay = classes.includes('math-display')
    const mathInline = classes.includes('math-inline')

    if (!languageMath && !mathDisplay && !mathInline) {
      return
    }

    let parent = parents.at(-1)
    let scope: RootContent = element
    let display = mathDisplay

    if (
      languageMath &&
      element.tagName === 'code' &&
      parent?.type === 'element' &&
      parent.tagName === 'pre'
    ) {
      scope = parent
      parent = parents.at(-2)
      display = true
    }

    if (parent) {
      targets.push({ display, element, parent, scope })
    }
  })

  for (const target of targets) {
    const value = toText(target.element, { whitespace: 'pre' })

    try {
      const node = await mathDocument.convertPromise(value, {
        containerWidth: CONTENT_WIDTH,
        display: target.display,
        em: EM_SIZE,
        ex: EX_SIZE,
      })
      const markup = adaptor.outerHTML(
        node as Parameters<typeof adaptor.outerHTML>[0],
      )

      if (/<mjx-mtext[^>]*style="[^"]*color:\s*red/i.test(markup)) {
        throw new Error(`Undefined TeX command in: ${value}`)
      }

      const index = target.parent.children.indexOf(target.scope)

      if (index !== -1) {
        target.parent.children.splice(index, 1, {
          type: 'element',
          tagName: 'math-jax',
          properties: {
            display: target.display,
            markup,
          },
          children: [],
        })
      }
    } catch (error) {
      file.fail('Could not render math with MathJax 4', {
        cause: error as Error,
        place: target.element.position,
        ruleId: 'mathjax-v4',
        source: 'rehype-mathjax-v4',
      })
    }
  }

  if (targets.length > 0) {
    tree.children.unshift({
      type: 'element',
      tagName: 'style',
      properties: { 'data-mathjax': 'newcm' },
      children: [
        {
          type: 'text',
          value: adaptor.cssText(
            chtml.styleSheet(mathDocument) as Parameters<
              typeof adaptor.cssText
            >[0],
          ),
        },
      ],
    })
  }
}

export default function rehypeMathjaxV4() {
  return (tree: Root, file: VFile) => {
    const result = renderQueue.then(() => renderMath(tree, file))
    renderQueue = result.catch(() => undefined)
    return result
  }
}
