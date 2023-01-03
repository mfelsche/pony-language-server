// https://github.com/zigtools/zls-vscode/blob/master/src/extension.ts

import { ExtensionContext, window, StatusBarAlignment, StatusBarItem } from 'vscode';

import {
  ExecutableOptions,
  LanguageClient,
  LanguageClientOptions,
  ServerOptions,
} from 'vscode-languageclient/node';

let client: LanguageClient;

export async function activate(context: ExtensionContext) {
  let exe = context.asAbsolutePath("pony-lsp");
  window.showWarningMessage(`Absolute path pony-lsp :${exe}:`);
  showPony(exe);
  // If the extension is launched in debug mode then the debug server options are used
  // Otherwise the run options are used
  let serverOptions: ServerOptions = {
    command: exe,
    args: ["stdio"]
  };

  // Options to control the language client
  let clientOptions: LanguageClientOptions = {
    documentSelector: [{ scheme: "file", language: "zig" }],
    outputChannelName: "Pony LSP client",
    // synchronize: {
    //   // Notify the server about file changes to '.clientrc files contained in the workspace
    //   fileEvents: workspace.createFileSystemWatcher('**/.pony')
    // }
  };

  // Create the language client and start the client.
  client = new LanguageClient(
    'pony',
    'Pony Language Server',
    serverOptions,
    clientOptions
  );

  // Start the client. This will also launch the server
  return client.start().catch(reason => {
    window.showWarningMessage(`Failed to run Pony Language Server (PLS): ${reason}`);
    client = null;
  });
}

export function deactivate(): Thenable<void> | undefined {
  if (!client) {
    return undefined;
  }
  return client.stop();
}

export var ponyVerEntry: StatusBarItem;

export function showPony(p) {
  ponyVerEntry = window.createStatusBarItem(StatusBarAlignment.Left);
  ponyVerEntry.text = `Pony LSP ` + p;
  ponyVerEntry.show();
}
