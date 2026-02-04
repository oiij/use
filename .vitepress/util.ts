import fs from 'node:fs'
import path from 'node:path'

export function conversionPath(dirPath: string, prefix: string) {
  // 读取路径下的所有文件
  const files = fs.readdirSync(dirPath)

  // 筛选出 .md 文件并处理
  const mdFiles = files
    .filter(file => file.endsWith('.md'))
    .map((file) => {
      // 获取文件名（不含扩展名）
      const fileName = path.basename(file, '.md')

      // 将文件名转换为大驼峰
      const bigCamelName = fileName
        .split('-')
        .map(segment => segment.charAt(0).toUpperCase() + segment.slice(1))
        .join('')

      // 获取文件的完整路径
      const filePath = `${dirPath}/${file}`

      return {
        text: bigCamelName,
        path: filePath,
        link: `${prefix}/${fileName}`,
      }
    })

  return mdFiles
}
