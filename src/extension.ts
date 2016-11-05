import * as vscode from 'vscode';

export function getTestFnRegex(...fnNames: string[]): RegExp {
    // whitespace, fnName, optional .something for .only, .skip, etc, then ('name')
    const quotePattern = `(?:'|"|\`)`;
    return new RegExp(`^\\s*(${fnNames.join('|')})(?:\\.[a-zA-Z0-9]*)?\\(\\s*${quotePattern}(.*)${quotePattern}`);
}

export function getSymbolForMatch(testFnMatch: RegExpMatchArray, document: vscode.TextDocument, line: number, kind: vscode.SymbolKind): vscode.SymbolInformation {
    const container = testFnMatch[1];
    const name = testFnMatch[2];
    return new vscode.SymbolInformation(name, kind, container,
        new vscode.Location(document.uri, new vscode.Position(line, 0)));
}

const suitePattern = getTestFnRegex('suite', 'describe');
const testCasePattern = getTestFnRegex('test', 'it');
export function getSymbolForLine(document: vscode.TextDocument, line: number): vscode.SymbolInformation {
    const {text} = document.lineAt(line);
    const suiteMatch = text.match(suitePattern);
    if (suiteMatch) {
        return getSymbolForMatch(suiteMatch, document, line, vscode.SymbolKind.Module);
    }

    const testCaseMatch = text.match(testCasePattern);
    if (testCaseMatch) {
        return getSymbolForMatch(testCaseMatch, document, line, vscode.SymbolKind.Method);
    }
}

const symbolProvider = {
    provideDocumentSymbols(document: vscode.TextDocument, token: vscode.CancellationToken): vscode.SymbolInformation[] {
        const lineCount = Math.min(document.lineCount, 10000);
        const result: vscode.SymbolInformation[] = [];
        for (let line = 0; line < lineCount; line++) {
            const symbol = getSymbolForLine(document, line);
            if (symbol) result.push(symbol);
        }

        return result;
    }
};

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider('typescript', symbolProvider));
    context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider('javascript', symbolProvider));
}
