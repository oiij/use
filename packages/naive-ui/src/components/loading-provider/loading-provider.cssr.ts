import { cM } from 'naive-ui'
import { cssr, namespace, plugin } from '../_utils'

const { c, cB } = { ...cssr, ...plugin }

export const cName = `${namespace}-loading-provider`
export function loadingProviderCssr() {
  return c([
    cB('loading-provider', {
      position: 'fixed',
      inset: 0,
      zIndex: 99,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }, [
      cM('mask', {
        background: 'rgba(0,0,0,.3)',
      }),
      cM('blur', {
        backdropFilter: 'blur(10px)',
      }),
    ]),
  ])
}
