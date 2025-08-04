/** 检查是否支持触摸事件 */
export const touchSupported = (): boolean => ('ontouchstart' in window || (window as any).DocumentTouch) && document instanceof (window as any).DocumentTouch
/** 检查元素是否聚焦 */
export const hasFocus = (ele: Node): boolean => ele === document.activeElement
/** 获取元素的所有同级 */
export const siblings = (ele: Node): Node[] => (ele.parentNode ? [].slice.call(ele.parentNode.children).filter(child => child !== ele) : [])
/** 获取元素相对于文档的位置 */
export const getPosition = (ele: Element) => ({ left: ele.getBoundingClientRect().left + window.scrollX, top: ele.getBoundingClientRect().top + window.scrollY })
/** 返回上一页 */
export const goBack = () => history && history.back()
/** 获取所选文本 */
export const getSelectedText = () => window!.getSelection()!.toString()
/** 隐藏元素 */
export const hide = (ele: HTMLElement): boolean => (ele.hidden = true)
/** 在另一个元素之后插入一个元素 */
export const insertAfter = (ele: Element, anotherEle: Element): Element | null => anotherEle.insertAdjacentElement('afterend', ele)
/** 在另一个元素之前插入一个元素 */
export const insertBefore = (ele: Element, anotherEle: Element) => anotherEle.insertAdjacentElement('beforebegin', ele)
/** 在元素后插入给定的HTML */
export const insertHtmlAfter = (html: string, ele: Element): void => ele.insertAdjacentHTML('afterend', html)
/** .在元素之前插入给定的HTML */
export const insertHtmlBefore = (html: string, ele: Element): void => ele.insertAdjacentHTML('beforebegin', html)
/** 重定向到另一页 */
export const goTo = (url: string): string => (location.href = url)
/** 重新加载当前页面 */
export const reload = () => location.reload()
/** 滚动到页面顶部 */
export const goToTop = (): void => window.scrollTo(0, 0)
/** 切换元素 */
export const toggle = (ele: HTMLElement): boolean => (ele.hidden = !ele.hidden)
/** 从给定的文本中剥离HTML */
export const stripHtml = (html: string): string => new DOMParser().parseFromString(html, 'text/html').body.textContent || ''
/** 更换元件 */
export const replace = (ele: Element, newEle: Element): Element | null => (ele.parentNode ? ele.parentNode.replaceChild(newEle, ele) : null)
