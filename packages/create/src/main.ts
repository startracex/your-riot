import { Command } from 'commander'
import inquirer from 'inquirer'
import { copyFile, mkdir, readdir } from 'node:fs/promises'
import { createRequire } from 'node:module'
import { join } from 'node:path'

const program = new Command()
const require = createRequire(import.meta.url)
const pkg = require('../package.json')

program
  .name(pkg.name)
  .description(pkg.description)
  .version(pkg.version)
  .argument('[location]', 'new project location')
  .option('-t, --template <TEMPLATE>')

program.parse()

const options = program.opts()
const args = program.args

let location = args[0]

async function main() {
  if (!location) {
    const answers = await inquirer.prompt([
      {
        type: 'input',
        name: 'location',
        message: 'project location:',
        default: './my-riot',
      },
    ])
    location = answers.location
  }

  const allTemplates = ['riot-js', 'your-riot-ts', 'your-riot-js']

  if (!options.template) {
    const answers = await inquirer.prompt([
      {
        type: 'list',
        name: 'template',
        message: 'select a template',
        choices: allTemplates,
      },
    ])
    options.template = answers.template
  }

  if (!allTemplates.includes(options.template)) {
    throw new Error('template not found')
  }

  copyDirectory(
    join(import.meta.dirname, '../templates', options.template),
    location,
  )
}
main().catch((err) => {
  console.error(err)
  process.exit(1)
})

async function copyDirectory(src: string, dst: string): Promise<void> {
  await mkdir(dst, { recursive: true })

  const entries = await readdir(src, { withFileTypes: true })

  for (const entry of entries) {
    const srcPath = join(src, entry.name)
    const dstPath = join(dst, entry.name)

    if (entry.isDirectory()) {
      await copyDirectory(srcPath, dstPath)
    } else {
      try {
        await copyFile(srcPath, dstPath)
      } catch {}
    }
  }
}
