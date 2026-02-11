# Advanced Code Editor

A browser-based code editor with VS Code-style keyboard shortcuts, built with React.

## Features

- **Advanced Keyboard Shortcuts**: Full support for VS Code-style shortcuts
- **Undo/Redo System**: Complete history management with Ctrl+Z/Ctrl+Shift+Z
- **Smart Indentation**: Auto-indentation and Tab/Shift+Tab support
- **Comment Toggle**: Ctrl+/ to toggle line comments
- **Chord Shortcuts**: Support for multi-key combinations like Ctrl+K, Ctrl+C
- **Cross-Platform**: Works with both Ctrl (Windows/Linux) and Cmd (macOS)
- **Real-time Event Dashboard**: Live debugging of keyboard events
- **Performance Optimized**: Debounced operations for smooth typing experience

## Quick Start

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
 cd Code-Editor-with-Advanced-Keyboard-Event-Handling

# Build and run with Docker Compose
docker-compose up --build

# Access the application
open http://localhost:3000
