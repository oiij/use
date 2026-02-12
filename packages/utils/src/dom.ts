/**
 * 检查是否支持触摸事件
 * @returns {boolean} 是否支持触摸事件
 * @example
 * // 返回 true 或 false
 * touchSupported()
 */
export const touchSupported = (): boolean => ('ontouchstart' in window || (window as any).DocumentTouch) && document instanceof (window as any).DocumentTouch

/**
 * 检查元素是否聚焦
 * @param {Node} ele - 要检查的元素
 * @returns {boolean} 元素是否聚焦
 * @example
 * // 检查元素是否聚焦
 * hasFocus(document.getElementById('input'))
 */
export const hasFocus = (ele: Node): boolean => ele === document.activeElement

/**
 * 获取元素的所有同级
 * @param {Node} ele - 参考元素
 * @returns {Node[]} 同级元素数组
 * @example
 * // 获取元素的所有同级
 * siblings(document.getElementById('element'))
 */
export const siblings = (ele: Node): Node[] => (ele.parentNode ? [].slice.call(ele.parentNode.children).filter(child => child !== ele) : [])

/**
 * 获取元素相对于文档的位置
 * @param {Element} ele - 要获取位置的元素
 * @returns {object} 包含 left 和 top 坐标的对象
 * @example
 * // 获取元素位置
 * getPosition(document.getElementById('element'))
 */
export const getPosition = (ele: Element) => ({ left: ele.getBoundingClientRect().left + window.scrollX, top: ele.getBoundingClientRect().top + window.scrollY })

/**
 * 返回上一页
 * @example
 * // 返回上一页
 * goBack()
 */
export const goBack = () => history && history.back()

/**
 * 获取所选文本
 * @returns {string} 选中的文本
 * @example
 * // 获取用户选中的文本
 * getSelectedText()
 */
export const getSelectedText = () => window!.getSelection()!.toString()

/**
 * 隐藏元素
 * @param {HTMLElement} ele - 要隐藏的元素
 * @returns {boolean} 隐藏状态
 * @example
 * // 隐藏元素
 * hide(document.getElementById('element'))
 */
export const hide = (ele: HTMLElement): boolean => (ele.hidden = true)

/**
 * 在另一个元素之后插入一个元素
 * @param {Element} ele - 要插入的元素
 * @param {Element} anotherEle - 参考元素
 * @returns {Element|null} 插入的元素或 null
 * @example
 * // 在元素后插入新元素
 * insertAfter(newDiv, document.getElementById('reference'))
 */
export const insertAfter = (ele: Element, anotherEle: Element): Element | null => anotherEle.insertAdjacentElement('afterend', ele)

/**
 * 在另一个元素之前插入一个元素
 * @param {Element} ele - 要插入的元素
 * @param {Element} anotherEle - 参考元素
 * @returns {Element|null} 插入的元素或 null
 * @example
 * // 在元素前插入新元素
 * insertBefore(newDiv, document.getElementById('reference'))
 */
export const insertBefore = (ele: Element, anotherEle: Element) => anotherEle.insertAdjacentElement('beforebegin', ele)

/**
 * 在元素后插入给定的HTML
 * @param {string} html - 要插入的HTML字符串
 * @param {Element} ele - 参考元素
 * @example
 * // 在元素后插入HTML
 * insertHtmlAfter('<div>New content</div>', document.getElementById('reference'))
 */
export const insertHtmlAfter = (html: string, ele: Element): void => ele.insertAdjacentHTML('afterend', html)

/**
 * 在元素之前插入给定的HTML
 * @param {string} html - 要插入的HTML字符串
 * @param {Element} ele - 参考元素
 * @example
 * // 在元素前插入HTML
 * insertHtmlBefore('<div>New content</div>', document.getElementById('reference'))
 */
export const insertHtmlBefore = (html: string, ele: Element): void => ele.insertAdjacentHTML('beforebegin', html)

/**
 * 重定向到另一页
 * @param {string} url - 目标URL
 * @returns {string} 新的URL
 * @example
 * // 重定向到百度
 * goTo('https://www.baidu.com')
 */
export const goTo = (url: string): string => (location.href = url)

/**
 * 重新加载当前页面
 * @example
 * // 重新加载页面
 * reload()
 */
export const reload = () => location.reload()

/**
 * 滚动到页面顶部
 * @example
 * // 滚动到页面顶部
 * goToTop()
 */
export const goToTop = (): void => window.scrollTo(0, 0)

/**
 * 切换元素的显示/隐藏状态
 * @param {HTMLElement} ele - 要切换的元素
 * @returns {boolean} 切换后的隐藏状态
 * @example
 * // 切换元素可见性
 * toggle(document.getElementById('element'))
 */
export const toggle = (ele: HTMLElement): boolean => (ele.hidden = !ele.hidden)

/**
 * 从给定的文本中剥离HTML
 * @param {string} html - 包含HTML的字符串
 * @returns {string} 剥离HTML后的纯文本
 * @example
 * // 剥离HTML标签
 * stripHtml('<div>Hello <b>world</b></div>') // 返回 "Hello world"
 */
export const stripHtml = (html: string): string => new DOMParser().parseFromString(html, 'text/html').body.textContent || ''

/**
 * 替换元素
 * @param {Element} ele - 要替换的元素
 * @param {Element} newEle - 新元素
 * @returns {Element|null} 被替换的元素或 null
 * @example
 * // 替换元素
 * replace(oldDiv, newDiv)
 */
export const replace = (ele: Element, newEle: Element): Element | null => (ele.parentNode ? ele.parentNode.replaceChild(newEle, ele) : null)
