import * as vscode from 'vscode';
import ollama from 'ollama';
let panel: vscode.WebviewPanel;

export function activate(context: vscode.ExtensionContext) {
    console.log('Deepseek VS Code extension activated!');

    panel = vscode.window.createWebviewPanel('deepseek', 'Deepseek Chat', vscode.ViewColumn.One, { enableScripts: true });
    panel.webview.html = getWebviewContent();

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

    let disposable = vscode.commands.registerCommand('deepseek.start', () => {
        vscode.window.showInformationMessage('Deepseek chat is now active!');
    });

    context.subscriptions.push(disposable);
}

function getWebviewContent() {
    return /*html*/`
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
            #response { margin-top: 20px; padding: 10px; background-color: #f9f9f9; color: #000; }
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

export function deactivate() {}