# Connect Deepseek R1 Model to VS Code in 10 Minutes

## Introduction
Integrating AI models into your development workflow can significantly enhance productivity. This guide explains how to connect the Deepseek model running on Ollama to a VS Code extension, enabling seamless interaction with an AI assistant within your editor.

## Code Repository
The code for this project is available on GitHub: [Deepseek R1 VS Extension POC](https://github.com/88hours/deepseek-r1-vs-extension)

## Prerequisites
Before proceeding, ensure you have the following:
- VS Code installed
- Node.js and npm installed
- [Ollama](https://ollama.com) installed and running locally
- Deepseek model downloaded in Ollama using:
  ```sh
  ollama pull deepseek-r1:1.5b
  ```
- Basic understanding of VS Code extension development

## Setting Up the VS Code Extension
### 1. Create a New Extension Project
Run the following commands to initialize a new VS Code extension project:
```sh
mkdir vscode-deepseek
cd vscode-deepseek
npx @vscode/create-extension
```
Choose `TypeScript` when prompted.

### 2. Install Dependencies
Install the Ollama client library to enable communication with the Deepseek model:
```sh
npm install ollama
```

## Implementing the Extension
### 1. Setting Up the Extension
Modify `src/extension.ts` to register the Deepseek command and set up the Webview Panel:
```typescript
import * as vscode from 'vscode';
import ollama from 'ollama';
let panel: vscode.WebviewPanel;

export function activate(context: vscode.ExtensionContext) {
    console.log('Deepseek VS Code extension activated!');

    panel = vscode.window.createWebviewPanel('deepseek', 'Deepseek Chat', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getWebviewContent();

    let disposable = vscode.commands.registerCommand('deepseek.start', () => {
        vscode.window.showInformationMessage('Deepseek chat is now active!');
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
```

### 2. Handling User Queries
Add a message listener inside `activate()` to handle communication between the Webview and the Deepseek model:
```typescript
panel.webview.onDidReceiveMessage(async message => {
    if (message.command === 'ask') {
        try {
            const response = await ollama.chat({
                model: 'deepseek-r1:1.5b',
                stream: true,
                messages: [{ role: 'user', content: message.text }],
            });
            for await (const part of response) {
                panel.webview.postMessage({ command: 'chatResponse', text: part.message.content });
            }
        } catch (error) {
            console.error('Error during chat:', error);
        }
    }
});
```

### 3. Creating the Webview Interface
Define the Webview's HTML structure to enable user interaction:
```typescript
function getWebviewContent() {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Deepseek Chat</title>
        <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            textarea { width: 100%; padding: 10px; border: 1px solid #ccc; }
            button { padding: 10px; background-color: #0078d7; color: white; }
            #response { margin-top: 20px; padding: 10px; background-color: #f9f9f9; }
        </style>
    </head>
    <body>
        <h1>Deepseek Chat</h1>
        <textarea id="question" placeholder="Ask your question..."></textarea>
        <button id="askButton">Ask</button>
        <div id="response"></div>
        <script>
            const vscode = acquireVsCodeApi();
            document.getElementById('askButton').addEventListener('click', () => {
                vscode.postMessage({ command: 'ask', text: document.getElementById('question').value });
            });
            window.addEventListener('message', event => {
                if (event.data.command === 'chatResponse') {
                    document.getElementById('response').innerText += event.data.text;
                }
            });
        </script>
    </body>
    </html>`;
}
```

## Updating package.json
Modify `package.json` to define the command for activating Deepseek:
```json
"commands": [
    {
        "command": "deepseek.start",
        "title": "DeepSeek Chat"
    }
]
```

## Running the Extension
1. Open the extension folder in VS Code.
2. Run `npm install` to ensure dependencies are installed.
3. Press `F5` to launch a new VS Code window with the extension activated.
4. Use the command `Deepseek: Start` to open the chat interface.

## Conclusion
This extension enables real-time interaction with the Deepseek AI model inside VS Code, streamlining your development process. You can further enhance it by integrating additional AI capabilities, such as code completion and debugging assistance.

