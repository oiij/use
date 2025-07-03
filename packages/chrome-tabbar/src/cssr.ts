import { useBem } from '@oiij/css-render'

export const { cssr, plugin, namespace } = useBem()
const { c, cB, cE, cM, cNotM } = { ...cssr, ...plugin }
export const tabsCssName = `${namespace}-chrome-tabs`
export const tabsItemCssName = `${namespace}-chrome-tabs-item`
const transition = 'all .2s cubic-bezier(.4, 0, .2, 1)'
export function tabsCssr() {
  return c([
    cB('chrome-tabs', {
      display: 'flex',
      width: '100%',
      height: '40px',
      padding: '0 10px',
      alignItems: 'center',
      backgroundColor: 'var(--background-color)',
      color: 'var(--background-color-dark)',
    }, [
      c('div', {
        boxSizing: 'border-box',
      }),
      c('.group-move, .group-enter-active, .group-leave-active', {
        transition,
      }),
      c('.group-enter-from, .group-leave-to', {
        opacity: 0,
      }),
      c('.group-leave-active', {

      }),
      cE('prefix', {

      }),
      cE('icon', {
        width: '28px',
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '5px',
        borderRadius: '10px',
        backgroundColor: 'var(--active-background-color)',
        transition,
      }, [
        c('svg', {
          width: '100%',
          height: '100%',
          fill: 'currentColor',
        }),
        c('&:hover', {
          backgroundColor: 'var(--primary-color)',
        }),
      ]),
      cE('content', {
        flex: '1',
        height: '100%',
        minWidth: 0,
        overflow: 'hidden',
        marginLeft: '-6px',
        padding: '0 10px',
      }),
      cE('scroll', {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: '100%',
      }, [
        cE('icon', {
          marginLeft: '5px',
          borderRadius: '50%',
          backgroundColor: 'transparent',
          flexShrink: 0,
        }, [
          c('&:hover', {
            backgroundColor: 'var(--primary-color)',
          }),
        ]),
      ]),
      cE('suffix', {

      }),

    ]),
    cB('chrome-tabs-item', {
      position: 'relative',
      margin: '0 -5px',
      height: '100%',
      flexShrink: 0,
      cursor: 'default',
      userSelect: 'none',
      padding: '6px 10px 0px 10px',
    }, [
      cM('disabled', {
        cursor: 'not-allowed',
        pointerEvents: 'none',
        opacity: 0.5,
        filter: 'grayscale(0.5)',
      }),
      cM('active', [
        cE('background', {
          opacity: 1,
        }),
      ]),
      cNotM('active', [
        c('&:hover', {

        }, [
          cE('content', {
            backgroundColor: 'var(--primary-color)',
          }),
        ]),
      ]),

      c('&::first-child', {
        marginLeft: '0 !important',
      }),
      c('&::last-child', {
        marginRight: '0 !important',
      }),
      cE('content', {
        position: 'relative',
        zIndex: 1,
        height: '28px',
        display: 'flex',
        alignItems: 'center',
        gap: '5px',
        borderRadius: '10px',
        padding: '0 10px',
        transition,
      }),
      cE('slot', {

      }),
      cE('icon', {
        lineHeight: 1,
      }, [
        c('svg', {
          width: '1.2em',
          height: '1.2em',
          fill: 'currentColor',
        }),
      ]),
      cE('close', {
        width: '16px',
        height: '16px',
        padding: '2px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '50%',
        transition,
      }, [
        c('&:hover', {
          backgroundColor: 'rgba(0,0,0,0.1)',
        }),
        c('svg', {
          width: '100%',
          height: '100%',
          fill: 'currentColor',
        }),
      ]),
      cE('background', {
        position: 'absolute',
        opacity: 0,
        left: 0,
        bottom: 0,
        zIndex: 0,
        height: '34px',
        width: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        transition,
      }, [
        cE('block', {
          height: '100%',
          flex: 1,
          minWidth: 0,
          borderRadius: '10px 10px 0 0',
          backgroundColor: 'var(--active-background-color)',
        }),
        c('svg', {
          fill: 'var(--active-background-color)',
        }),
      ]),
      cE('line', {
        position: 'absolute',
        bottom: '12px',
        right: '4px',
        height: '16px',
        width: '2px',
        borderRadius: '1px',
        transition,
        backgroundColor: 'var(--primary-color)',
        opacity: 0,
      }, [
        cM('show', {
          opacity: 1,
        }),
      ]),
    ]),
    c('.dark', [
      cB('chrome-tabs', {
        backgroundColor: 'var(--background-color-dark)',
        color: 'var(--background-color)',
      }, [
        cE('icon', {
          backgroundColor: 'var(--active-background-color-dark)',
        }, [
          c('&:hover', {
            backgroundColor: 'var(--primary-color-dark)',
          }),
        ]),
      ]),

      cB('chrome-tabs-item', {}, [
        cNotM('active', [
          c('&:hover', {

          }, [
            cE('content', {
              backgroundColor: 'var(--primary-color-dark)',
            }),
          ]),
        ]),
        cE('background', {}, [
          cE('block', {
            backgroundColor: 'var(--active-background-color-dark)',
          }),
          c('svg', {
            fill: 'var(--active-background-color-dark)',
          }),
        ]),
      ]),
    ]),
  ])
}
