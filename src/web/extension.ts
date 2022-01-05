import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
	context.subscriptions.push(vscode.commands.registerCommand('frame-host-delegate.activate', () => {
		const panel = vscode.window.createWebviewPanel(
			'openWebview',
			'frame-host-delegate',
			vscode.ViewColumn.One,
			{
				enableScripts: true,
				retainContextWhenHidden: true,
				localResourceRoots: [vscode.Uri.joinPath(context.extensionUri, 'src', 'webview')]
			}
		);

		const frameUrl = vscode.workspace.getConfiguration('frame-host-delegate').get('frameUrl');
		const scriptUri = panel.webview.asWebviewUri(vscode.Uri.joinPath(context.extensionUri, 'src', 'webview', 'main.js'));
		panel.webview.html = `
		  <!DOCTYPE html>
		  <style>
		  body, html {
		  	margin: 0;
		  }
		  iframe {
		  	border: 0
		  }
		  </style>
		  <body>
		  <iframe src="${frameUrl}"></iframe>
		  <script src="${scriptUri}"></script>
		`;
		panel.webview.onDidReceiveMessage(async (data) => {
			const path = data.get;
			let content = null;
			try {
				const uri = vscode.Uri.joinPath(vscode.workspace.workspaceFolders![0].uri, path);
				content = await vscode.workspace.fs.readFile(uri);
			} catch (e) {
			}
			panel.webview.postMessage({ got: data.get, result: content });
		});
	}));
}

export function deactivate() { }