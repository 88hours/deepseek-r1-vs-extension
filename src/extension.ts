// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama';
let panel: vscode.WebviewPanel;

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "deepseek-r1-1-5b-moe" is now active!');
	panel =	vscode.window.createWebviewPanel('deepseek', 'Deepseek Chat', vscode.ViewColumn.One, { enableScripts: true });
	panel.webview.html = getWebviewContent();
	panel.webview.onDidReceiveMessage(
		async message => {
					
			switch (message.command) {
				case 'ask':
					try {
						const response = await ollama.chat({
							model: 'deepseek-r1:1.5b',
							stream: true,
							messages: [{ role: 'user', content: message.text }],
						});
						for await (const part of response) {
							let responseTest = part.message.content;
							panel.webview.postMessage({ command: 'chatResponse', text: responseTest });

						}
					} catch (error) {
						console.error('Error during chat:', error);
					}
					break;
			}
		}
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('deepseek-r1-1-5b-moe.deepseek', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Deepseek chat now active!');
		
	});

	context.subscriptions.push(disposable);
}

function getWebviewContent() {
	/*html*/
	return `
	<!DOCTYPE html>
	<html lang="en">
	<head>
		<meta charset="UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<title>Deepseek Chat</title>
			<style>
			body {
				font-family: Arial, sans-serif;
				margin: 20px;
			}
			h1 {
				color: #333;
			}
			textarea {
				width: 100%;
				padding: 10px;
				margin-bottom: 10px;
				border: 1px solid #ccc;
				border-radius: 4px;
				resize: vertical;
			}
			button {
				padding: 10px 20px;
				background-color: #0078d7;
				color: white;
				border: none;
				border-radius: 4px;
				cursor: pointer;
			}
			button:hover {
				background-color: #005fad;
			}
			#response {
				margin-top: 20px;
				padding: 10px;
				border: 1px solid #ccc;
				border-radius: 4px;
				background-color: #f9f9f9;
				min-height: 100px;
				color: #000;
			}
		</style>
	</head>
	<body>
		<h1>Deepseek Chat</h1>
		<textarea id="question" rows="4" cols="50" placeholder="Ask your question here..."></textarea>
		<br>
		<button id="askButton">Ask</button>
		<div id="response"></div>


		<script>
			const vscode = acquireVsCodeApi();
			document.getElementById('askButton').addEventListener('click', () => {
				const question = document.getElementById('question').value;
				vscode.postMessage({ command: 'ask', text: question });

			});
			window.addEventListener('message', event => {
				const message = event.data; // The json data that the extension sent
				const command = message.command; // The command that the extension sent	
				const text = message.text; // The text that the extension sent
				switch (command) {
					case 'chatResponse':
						document.getElementById('response').innerText += text;
						break;
				}
			});

		</script>
	</body>
	</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
