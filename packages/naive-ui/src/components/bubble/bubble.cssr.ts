import { cssr, namespace, plugin } from '../_utils'

const { c, cB, cE, cM } = { ...cssr, ...plugin }

export const cName = `${namespace}-bubble`
export function bubbleCssr() {
  return c([
    cB('bubble', {
      display: 'flex',
      gap: '10px',
      fontSize: 'var(--n-font-size);',
    }, [
      cM('reverse', {
        flexDirection: 'row-reverse',
      }),
      cE('content', {
        backgroundColor: 'var(--tag-color)',
        padding: '10px',
        borderRadius: 'var(--border-radius)',
        minHeight: '44px',
      }),
    ]),
  ])
}
