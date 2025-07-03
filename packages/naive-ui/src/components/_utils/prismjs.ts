import Prism from 'prismjs'

if (typeof document !== 'undefined') {
  Prism.highlightAll()
}
export function highlight(code: string, lang: string) {
  try {
    const grammar = Prism.languages[lang]
    if (grammar) {
      // 调用 Prism 高亮代码
      const highlightedCode = Prism.highlight(code, grammar || Prism.languages.text, lang)

      // 生成带 Prism 样式的 HTML
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>`
      // return Prism.highlight(code, grammar, lang)
    }
    return code
  }
  catch {
    return code
  }
}
