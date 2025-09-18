#!/usr/bin/env node
/**
 * Repository Manager Script
 * Pulls/clones all configured repositories to a specified directory
 */

import { execSync } from 'child_process'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

class RepoManager {
  constructor(config = {}) {
    this.config = {
      targetDir: 'e:\\github',
      configFile: join(__dirname, '..', 'repo-config.json'),
      ...config
    }
  }

  /**
   * Ensure target directory exists
   */
  ensureTargetDir() {
    const targetDir = resolve(this.config.targetDir)

    if (!existsSync(targetDir)) {
      console.log(`Creating target directory: ${targetDir}`)
      mkdirSync(targetDir, { recursive: true })
    }

    return targetDir
  }

  /**
   * Load repository configuration
   */
  loadRepoConfig() {
    if (!existsSync(this.config.configFile)) {
      console.warn(`Config file not found: ${this.config.configFile}`)
      return { repositories: [] }
    }

    try {
      const configContent = readFileSync(this.config.configFile, 'utf8')
      return JSON.parse(configContent)
    } catch (error) {
      console.error(`Error reading config file: ${error.message}`)
      return { repositories: [] }
    }
  }

  /**
   * Check if git is available
   */
  checkGitAvailable() {
    try {
      execSync('git --version', { stdio: 'ignore' })
      return true
    } catch {
      console.error('Git is not available in the system PATH')
      return false
    }
  }

  /**
   * Clone or pull a repository
   */
  async processRepository(repo) {
    const { url, name, branch = 'main' } = repo
    const targetDir = this.ensureTargetDir()
    const repoPath = join(targetDir, name)

    console.log(`\nProcessing repository: ${name}`)
    console.log(`URL: ${url}`)
    console.log(`Target path: ${repoPath}`)

    try {
      if (existsSync(repoPath)) {
        // Repository exists, pull latest changes
        console.log('Repository exists, pulling latest changes...')
        process.chdir(repoPath)

        // Check if it's a git repository
        if (!existsSync(join(repoPath, '.git'))) {
          console.warn(`Directory ${repoPath} exists but is not a git repository`)
          return false
        }

        // Fetch and pull
        execSync('git fetch --all', { stdio: 'inherit' })
        execSync(`git checkout ${branch}`, { stdio: 'inherit' })
        execSync('git pull origin ' + branch, { stdio: 'inherit' })

        console.log(`✅ Successfully updated ${name}`)
      } else {
        // Repository doesn't exist, clone it
        console.log('Cloning repository...')
        process.chdir(targetDir)

        execSync(`git clone ${url} ${name}`, { stdio: 'inherit' })

        if (branch !== 'main' && branch !== 'master') {
          process.chdir(repoPath)
          execSync(`git checkout ${branch}`, { stdio: 'inherit' })
        }

        console.log(`✅ Successfully cloned ${name}`)
      }

      return true
    } catch (error) {
      console.error(`❌ Error processing ${name}: ${error.message}`)
      return false
    }
  }

  /**
   * Process all repositories
   */
  async pullAllRepositories() {
    console.log('🚀 Starting repository management...')

    if (!this.checkGitAvailable()) {
      return false
    }

    const config = this.loadRepoConfig()
    const repositories = config.repositories || []

    if (repositories.length === 0) {
      console.log('No repositories configured. Please check your repo-config.json file.')
      return false
    }

    console.log(`Found ${repositories.length} repositories to process`)
    console.log(`Target directory: ${this.config.targetDir}`)

    const originalCwd = process.cwd()
    let successCount = 0
    let failureCount = 0

    for (const repo of repositories) {
      const success = await this.processRepository(repo)
      if (success) {
        successCount++
      } else {
        failureCount++
      }

      // Return to original directory
      process.chdir(originalCwd)
    }

    console.log('\n📊 Summary:')
    console.log(`✅ Successfully processed: ${successCount}`)
    console.log(`❌ Failed: ${failureCount}`)
    console.log(`📂 Target directory: ${this.config.targetDir}`)

    return failureCount === 0
  }
}

// CLI Usage
if (import.meta.url === `file://${process.argv[1]}`) {
  const args = process.argv.slice(2)
  const targetDir = args[0] || 'e:\\github'

  const repoManager = new RepoManager({ targetDir })

  repoManager.pullAllRepositories()
    .then((success) => {
      process.exit(success ? 0 : 1)
    })
    .catch((error) => {
      console.error('Fatal error:', error.message)
      process.exit(1)
    })
}

export default RepoManager
