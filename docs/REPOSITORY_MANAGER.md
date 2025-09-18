# Repository Manager

This tool allows you to pull/clone all configured repositories to a specific directory structure. It's designed to manage multiple repositories efficiently.

## Features

- **Automated Repository Management**: Clone new repositories or pull updates for existing ones
- **Configurable Target Directory**: Specify where repositories should be stored (defaults to `e:\github`)
- **Cross-Platform Support**: Works on Windows, macOS, and Linux
- **Branch Management**: Support for specific branches per repository
- **Error Handling**: Comprehensive error reporting and recovery

## Usage

### Quick Start

1. **Configure Repositories**: Edit `repo-config.json` to specify which repositories to manage
2. **Run the Script**: Use the npm script to pull all repositories

```bash
# Pull all repositories to the default directory (e:\github)
pnpm run pull-repos

# Pull all repositories to a custom directory
pnpm run pull-repos:custom /path/to/your/directory
```

### Manual Execution

You can also run the script directly:

```bash
# Use default directory
node scripts/repo-manager.js

# Specify custom directory
node scripts/repo-manager.js "d:\projects\github"
```

## Configuration

The `repo-config.json` file defines which repositories to manage:

```json
{
  "repositories": [
    {
      "name": "SaaS",
      "url": "https://github.com/Devf7en/SaaS.git",
      "branch": "main",
      "description": "Nuxt UI Pro SaaS Template"
    }
  ],
  "settings": {
    "targetDirectory": "e:\\github",
    "defaultBranch": "main",
    "autoUpdate": true,
    "parallel": false
  }
}
```

### Repository Configuration

Each repository entry supports:

- `name` (required): Directory name for the repository
- `url` (required): Git clone URL
- `branch` (optional): Specific branch to checkout (defaults to "main")
- `description` (optional): Human-readable description

### Settings

- `targetDirectory`: Default directory for all repositories
- `defaultBranch`: Default branch if not specified per repository
- `autoUpdate`: Whether to automatically pull updates for existing repositories
- `parallel`: Whether to process repositories in parallel (future feature)

## How It Works

1. **Directory Setup**: Creates the target directory if it doesn't exist
2. **Repository Processing**: For each configured repository:
   - If the repository doesn't exist locally: Clone it
   - If the repository exists: Pull the latest changes
3. **Branch Management**: Ensures the correct branch is checked out
4. **Error Reporting**: Provides detailed feedback on success/failure

## Requirements

- **Git**: Must be installed and available in system PATH
- **Node.js**: Version 14 or higher
- **Network Access**: For cloning/pulling repositories

## Examples

### Adding a New Repository

Edit `repo-config.json`:

```json
{
  "repositories": [
    {
      "name": "my-project",
      "url": "https://github.com/username/my-project.git",
      "branch": "develop",
      "description": "My awesome project"
    }
  ]
}
```

### Custom Directory Structure

You can organize repositories by modifying the `name` field:

```json
{
  "repositories": [
    {
      "name": "frontend/my-app",
      "url": "https://github.com/username/my-app.git"
    },
    {
      "name": "backend/api-server",
      "url": "https://github.com/username/api-server.git"
    }
  ]
}
```

This will create:
```
e:\github\
├── frontend\
│   └── my-app\
└── backend\
    └── api-server\
```

## Troubleshooting

### Common Issues

1. **Git not found**: Ensure Git is installed and in your system PATH
2. **Permission denied**: Check write permissions for the target directory
3. **Network issues**: Verify internet connection and repository URLs
4. **Authentication**: For private repositories, ensure SSH keys or credentials are configured

### Debug Mode

For detailed logging, you can modify the script or check the console output for specific error messages.

## Integration

This tool can be integrated into your development workflow:

- **CI/CD**: Run as part of deployment scripts
- **Development Setup**: Use for onboarding new team members
- **Backup**: Regular synchronization of important repositories