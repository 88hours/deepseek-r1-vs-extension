# Ddeepseek-r1:1.5b VS Code Extension - POC

Welcome to the **Deepseek-r1:1.5b** VS Code extension! This extension provides a simple webview panel that interacts with the user through a button click.

## Features

- Activates a webview panel displaying custom HTML content.
- Sends and receives messages between the webview and the extension.

## Requirements

- Visual Studio Code
- Node.js

## Installation

1. **Clone the Repository**:

   ```bash
   git clone https://github.com/yourusername/deepseek-r1-1-5b-moe.git
   cd deepseek-r1-1-5b-moe
   ```

2. **Install Dependencies**:

   ```bash
   npm install
   ```

3. **Open in VS Code**:

   ```bash
   code .
   ```

## Usage

1. **Build the Extension**:

   Open the terminal in VS Code and run:

   ```bash
   npm run compile
   ```

2. **Launch the Extension**:

   Press `F5` or `Debug: Start Debugging` to open a new VS Code window with the extension loaded.

3. **Activate the Webview**:

   - Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on macOS).
   - Run the command `DeepSeek Start`.

4. **Interact with the Webview**:

   - Click the "Ask" button in the webview to send a message to the extension.
   - The extension will display a message in VS Code.

## Development

- **Modify `extension.ts`**: Customize the webview content and message handling.
- **Test Changes**: Use the debugger to test changes by pressing `F5`.

## Packaging


1. **Package the Extension:**
Use `vsce` to package your extension. If you don't have `vsce` installed, you can install it globally:
   ```bash

npm install -g vsce
   ```
Then package the extension:
 ```bash
vsce package
```
This will create a `.vsix` file in your project directory.
2. **Install the .vsix File:**

    - Open Visual Studio Code.
    - Go to the Extensions View (`Ctrl+Shift+X`).
    - Click on the three-dot menu and select Install from VSIX....
    - Choose the generated `.vsix` file.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License
None
