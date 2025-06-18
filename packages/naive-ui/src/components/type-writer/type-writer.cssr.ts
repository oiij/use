import { cssr, namespace, plugin } from '../_utils'
import prismjsDark from '../assets/prism-one-dark.css?inline'
import prismjsLight from '../assets/prism-one-light.css?inline'

const { c, cB, cE } = { ...cssr, ...plugin }

export const cName = `${namespace}-type-writer`
export function typeWriterCssr() {
  return c([
    cB('type-writer', {
      overflowX: 'auto',
    }, [
      cE('cursor::after', {
        content: `var(--cursor-content)`,
        marginLeft: `2px`,
        display: `inline-block`,
      }),
      cE('markdown', `${prismjsLight}`, [
        c('pre', {
          backgroundColor: `var(--tag-color)`,
          borderRadius: `var(--border-radius)`,
        }),
      ]),
    ]),
    c('.dark', [
      cB('type-writer', [
        cE('markdown', `${prismjsDark}`),
      ]),
    ]),
  ])
}
