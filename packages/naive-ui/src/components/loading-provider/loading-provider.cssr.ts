import { cM } from 'naive-ui'
import { c, cB, nB } from '../_utils'

export const cName = nB('loading-provider')
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
        background: 'rgba(0,0,0,.4)',
      }),
      cM('blur', {
        backdropFilter: 'blur(10px)',
      }),
    ]),
  ])
}
