# Password Manager

A secure, offline password manager built with Electron and React. This application allows you to generate, store, and manage your passwords locally with encryption.

## Features

- 🔐 Generate strong passwords with customizable length and symbols
- 💾 Save passwords locally with website and username information
- 🎨 Dark/Light theme with customizable accent colors
- 🔒 Encrypted password storage using electron-store
- 📱 Modern, responsive UI
- 🚫 No cloud storage - all data stored locally
- 📦 Portable - no installation required

## Development

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

### Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/password-manager.git
   cd password-manager
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. In a new terminal, start Electron:
   ```bash
   npm run electron:dev
   ```

### Building

To create a portable executable:

```bash
npm run build
npm run electron:build
```

The executable will be created in the `dist_electron` directory.

## Security

- Passwords are stored locally using electron-store
- Data is encrypted with a secure encryption key
- No data is transmitted over the internet
- All password operations are performed locally

## License

MIT License - feel free to use and modify for your own projects. 