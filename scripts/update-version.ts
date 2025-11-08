import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
function updateVersion() {
  const packages = fs.readdirSync(path.resolve(__dirname, '../packages'))
  console.log(packages)
  for (const pkg of packages) {
    const pkgPath = path.resolve(__dirname, '../packages', pkg)
    const pkgJsonPath = path.resolve(pkgPath, 'package.json')
    if (fs.existsSync(pkgJsonPath)) {
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgJsonPath, 'utf-8')) as { version?: string }
        if (pkgJson.version) {
          const oldVersion = pkgJson.version
          const version = pkgJson.version.split('.')
          version[version.length - 1] = (Number.parseInt(version[version.length - 1]) + 1).toString()
          pkgJson.version = version.join('.')
          console.log(pkgJson.version)
          fs.writeFileSync(pkgJsonPath, JSON.stringify(pkgJson, null, 2))
          console.log(`Updated ${pkgJsonPath}: ${oldVersion} to version ${pkgJson.version}`)
        }
      }
      catch (error) {
        console.error(`Error parsing ${pkgJsonPath}:`, error)
      }
    }
  }
}

updateVersion()
