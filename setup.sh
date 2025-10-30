#!/usr/bin/env bash

echo "🔧 Starting dev.f7en unified setup..."

# Ask for admin password
sudo -v
while true; do sudo -n true; sleep 60; kill -0 "$$" || exit; done 2>/dev/null &

OS=$(uname)

# Detect platform
case "$OS" in
  "Darwin") PLATFORM="mac";;
  "Linux") PLATFORM="linux";;
  "MINGW"*|"CYGWIN"*|"MSYS"*) PLATFORM="windows";;
  *) echo "❌ Unsupported platform"; exit 1;;
esac

echo "🧠 Detected platform: $PLATFORM"

# --- Core Infrastructure ---
echo "🧱 Installing core servers..."
brew install httpd nginx tomcat mysql postgresql samba bind isc-dhcp-server squid haproxy vsftpd
brew services start httpd nginx tomcat mysql postgresql samba squid haproxy

# --- Security Servers ---
echo "🛡️ Installing security servers..."
brew install openldap openvpn wireguard-tools keycloak
brew services start openldap

# --- Cloud & Virtualization ---
echo "☁️ Installing cloud and container tools..."
brew install docker docker-compose kubernetes-cli podman qemu
brew services start docker

# --- Specialized Servers ---
echo "🧠 Installing specialized servers..."
brew install jenkins gitlab-runner prometheus grafana nagios mailhog ntp bacula wowza minecraft-launcher

# --- Emerging Servers ---
echo "🧩 Installing emerging tech..."
brew install tensorflow-serving ethereum geth mosquitto awscli azure-cli

# --- Historical Servers ---
echo "🧮 Installing historical servers..."
brew install inetutils gopher bbs telnet netware

# --- Dev Tools ---
echo "🧰 Installing dev environments..."
brew install node pnpm python@3.11 ruby openjdk@11 go swift
brew install --cask visual-studio-code webstorm xcode

# --- Web Frameworks ---
echo "🌐 Installing Vue/Nuxt stack..."
pnpm add -g nuxt vite tailwindcss eslint prettier @nuxtjs/i18n

# --- iOS Dev ---
echo "📱 Setting up iOS dev tools..."
sudo xcode-select --install
brew install cocoapods swiftlint fastlane

# --- Windows Dev (WSL) ---
if [[ "$PLATFORM" == "windows" ]]; then
  powershell.exe -Command "Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux"
  powershell.exe -Command "wsl --install -d Ubuntu"
fi

# --- Linux Dev ---
if [[ "$PLATFORM" == "linux" ]]; then
  sudo apt update
  sudo apt install -y build-essential curl git zsh docker.io docker-compose
fi

# --- Workspace Setup ---
echo "📁 Creating dev folders..."
mkdir -p ~/Development/{vue,nuxt,swift,ios,backend,servers,legacy,cloud,security}

# --- Nuxt Starter App ---
echo "🚀 Creating Nuxt starter app..."
cd ~/Development/nuxt
pnpm dlx nuxi init starter
cd starter
pnpm install
pnpm add -D @nuxtjs/tailwindcss @nuxtjs/i18n

# --- SwiftUI Starter ---
echo "🧪 Creating SwiftUI starter..."
mkdir -p ~/Development/swiftui
cd ~/Development/swiftui
swift package init --type executable

# --- Final Message ---
echo "✅ All environments, servers, and tools installed!"
echo "🔄 Restart your terminal or run 'source ~/.zshrc' to apply changes."
