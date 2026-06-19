const vscode = require('vscode');
const path = require('path');

function activate(context) {

  let runCommand = vscode.commands.registerCommand('tadpole.runFile', () => {

    let terminal = vscode.window.activeTerminal;
    const editor = vscode.window.activeTextEditor;

    const filePath = editor.document.fileName;
    const fileName = path.basename(filePath);

    terminal.show();
    terminal.sendText(`.\\tadpole ${fileName}`);
  });

  context.subscriptions.push(runCommand);


  let completionProvider = vscode.languages.registerCompletionItemProvider(
    'tad',
    {
      provideCompletionItems(document, position) {

        const lineText = document.lineAt(position).text;
        const dotPosition = position.character - 1;

        if (lineText[dotPosition] !== '.') return;

        const functions = [
          {
            label: 'read',
            insertText: new vscode.SnippetString('read()'),
          },
		  {
            label: 'readfill',
            insertText: new vscode.SnippetString('readfill()'),
          },
		  {
            label: 'replaceNA',
            insertText: new vscode.SnippetString('replaceNA()'),
          },
		  {
            label: 'rename',
            insertText: new vscode.SnippetString('rename()'),
          },
		  {
            label: 'append',
            insertText: new vscode.SnippetString('append()'),
          },
		  {
            label: 'remove',
            insertText: new vscode.SnippetString('remove()'),
          },
		  {
            label: 'mutate',
            insertText: new vscode.SnippetString('mutate()'),
          },
		  {
            label: 'filterall',
            insertText: new vscode.SnippetString('filterall()'),
          },
		  {
            label: 'filtercol',
            insertText: new vscode.SnippetString('filtercol()'),
          },
		  {
            label: 'mean',
            insertText: new vscode.SnippetString('mean()'),
          },
		  {
            label: 'min',
            insertText: new vscode.SnippetString('min()'),
          },
		  {
            label: 'max',
            insertText: new vscode.SnippetString('max()'),
          },
		  {
            label: 'sum',
            insertText: new vscode.SnippetString('sum()'),
          }
        ];

        return functions.map(f => {
          const item = new vscode.CompletionItem(
            f.label,
            vscode.CompletionItemKind.Function
          );
          item.detail = f.detail;
          item.documentation = new vscode.MarkdownString(f.documentation);
          item.insertText = f.insertText;
          return item;
        });
      }
    },
    '.'
  );

  context.subscriptions.push(completionProvider);

  const hoverProvider = vscode.languages.registerHoverProvider('tad', {
    provideHover(document, position) {

      const range = document.getWordRangeAtPosition(position);
      const word = document.getText(range);

  const functions = {
      read: `
    (Function) read (
          Path: URL | Relative filepath
          )  -> 'tbl'

    Reads a CSV file and converts it into a Tadpole table.

    **Parameters**
    - \`Path\`: The url to a CSV file. | The relative path to a CSV file.

    **Returns**
    A table containing the data from the CSV file.
    `,
      length: 'Returns the length of a list or string',
      tostring: 'Converts a value to a string'
    };

      if (functions[word]) {
        return new vscode.Hover(
          new vscode.MarkdownString(`**${word}**\n\n${functions[word]}`)
        );
      }

      return null;
    }
  });
  context.subscriptions.push(hoverProvider)
}

function deactivate() {}

module.exports = { activate, deactivate };