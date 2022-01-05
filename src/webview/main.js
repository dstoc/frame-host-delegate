const iframe = document.querySelector('iframe');
iframe.onload = e => iframe.contentWindow.postMessage('ready', '*');

const vscode = acquireVsCodeApi();
const handlers = {};
addEventListener('message', e => {
  if (e.data.get) {
    vscode.postMessage({get: e.data.get});
    (handlers[e.data.get] = handlers[e.data.get] || []).push(e.data.port);
  }
  if (e.data.got) {
    const handler = (handlers[e.data.got] ?? []).shift();
    if (!handler) return;
    handler.postMessage(e.data.result);
  }
});
