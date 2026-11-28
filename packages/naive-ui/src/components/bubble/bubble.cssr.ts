import { c, cB, cE, cM, nB } from '../_utils/cssr-bem'

export const cName = nB('bubble')

export function bubbleCssr() {
  return c([
    cB('bubble', {
      display: 'flex',
      alignItems: 'flex-start',
      gap: '10px',
      width: '100%',
      boxSizing: 'border-box',
    }, [
      cM('end', {
        flexDirection: 'row-reverse',
      }),
      cM('end', [
        cE('body', {
          alignItems: 'flex-end',
        }),
      ]),
      cE('avatar', {
        flex: 'none',
      }),
      cE('body', {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        gap: '6px',
        minWidth: '0',
        maxWidth: 'var(--n-bubble-max-width, 80%)',
      }),
      cE('header', {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '12px',
        lineHeight: '1',
        color: 'var(--n-bubble-meta-color, #999)',
      }),
      cE('name', {
        fontWeight: '500',
      }),
      cE('datetime', {
        fontSize: '11px',
        opacity: '0.8',
      }),
      cE('content', {
        padding: '10px 14px',
        borderRadius: '14px',
        borderTopLeftRadius: '4px',
        background: 'var(--n-bubble-color, #f2f3f5)',
        color: 'var(--n-bubble-text-color, #333)',
        fontSize: 'var(--n-bubble-font-size, 14px)',
        lineHeight: '1.6',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'anywhere',
      }),
      cM('end', [
        cE('content', {
          borderTopLeftRadius: '14px',
          borderTopRightRadius: '4px',
        }),
      ]),
      cE('footer', {
        fontSize: '12px',
        color: 'var(--n-bubble-meta-color, #999)',
      }),
      cE('dots', {
        display: 'inline-flex',
        alignItems: 'center',
        gap: '3px',
        height: '1em',
      }, [
        c('i', {
          width: '5px',
          height: '5px',
          borderRadius: '50%',
          background: 'currentColor',
          opacity: '0.4',
          animation: 'n-bubble-bounce 1.2s ease-in-out infinite',
        }, [
          c('&:nth-child(2)', {
            animationDelay: '0.2s',
          }),
          c('&:nth-child(3)', {
            animationDelay: '0.4s',
          }),
        ]),
      ]),
      cM('typing', [
        cE('content', [
          c('&::after', {
            content: '""',
            display: 'inline-block',
            width: '2px',
            height: '1em',
            marginLeft: '2px',
            verticalAlign: '-0.15em',
            background: 'currentColor',
            animation: 'n-bubble-blink 1s steps(1) infinite',
          }),
        ]),
      ]),
    ]),
    c('@keyframes n-bubble-bounce', {
      '0%, 60%, 100%': {
        opacity: '0.4',
        transform: 'translateY(0)',
      },
      '30%': {
        opacity: '1',
        transform: 'translateY(-4px)',
      },
    }),
    c('@keyframes n-bubble-blink', {
      '50%': {
        opacity: '0',
      },
    }),
  ])
}
