// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import ollama from 'ollama'

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "deepseek-r1-1-5b-moe" is now active!');
	const panel =	vscode.window.createWebviewPanel('deepseek', 'Deepseek Chat', vscode.ViewColumn.One, { enableScripts: true });
	panel.webview.html = getWebviewContent();
	panel.webview.onDidReceiveMessage(
		async message => {
					let response;
			switch (message.command) {
				case 'ask':
					vscode.window.showInformationMessage(`You asked: ${message.text}`);
					response = await ollama.chat({
					model: 'deepseek-r1-1.5b',
					messages: [{ role: 'user', content: message.text }],
					});
					panel.webview.postMessage({ command: 'response', text: response });
					break;
			}
		},
		undefined,
		context.subscriptions
	);

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('deepseek-r1-1-5b-moe.deepseek', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Deepseek-r1-1.5b-moe is now active!');
		
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
	</head>
	<body>
		<h1>Deepseek Chat</h1>
		<textarea id="question" rows="4" cols="50" placeholder="Ask your question here..."></textarea>
		<br>
		<button id="askButton">Ask</button>

		<script>
			const vscode = acquireVsCodeApi();
			window.addEventListener('message', event => {
				const message = event.data;
				switch (message.command) {
					case 'response':
						document.getElementById('question').value = message.text;
						break;
				}
			});
			document.getElementById('askButton').addEventListener('click', () => {
				const question = document.getElementById('question').value;
				vscode.postMessage({ command: 'ask', text: question });
			});
		</script>
	</body>
	</html>
	`;
}

// This method is called when your extension is deactivated
export function deactivate() {}
