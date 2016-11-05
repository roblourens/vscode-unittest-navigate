import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const suitePattern = /^\s*(describe|suite).*\((?:'|")(.*)(?:'|")\s*,/;
    const testCasePattern = /^\s*(it|test).*\((?:'|")(.*)(?:'|")\s*,/;

    let disposable = vscode.languages.registerDocumentSymbolProvider('typescript', {
        provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.SymbolInformation[] {
            const lineCount = Math.min(document.lineCount, 10000);
            const result: vscode.SymbolInformation[] = [];
            for (let line = 0; line < lineCount; line++) {
                const {text} = document.lineAt(line);

                const suiteMatch = text.match(suitePattern);
                if (suiteMatch) {
                    const container = suiteMatch[1];
                    const name = suiteMatch[2];
                    result.push(new vscode.SymbolInformation(name, vscode.SymbolKind.Module, container,
                        new vscode.Location(document.uri, new vscode.Position(line, 0))));
                } else {
                    const testCaseMatch = text.match(testCasePattern);
                    if (testCaseMatch) {
                        const container = testCaseMatch[1];
                        const name = testCaseMatch[2];
                        result.push(new vscode.SymbolInformation(name, vscode.SymbolKind.Method, container,
                            new vscode.Location(document.uri, new vscode.Position(line, 0))));
                    }
                }
            }

            return result;
        }
    });

    context.subscriptions.push(disposable);
}
