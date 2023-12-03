// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { findSelectedBlockFromSelection } from "./helpers";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "jsdoc-openai-powered-generator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("jsdoc-openai-powered-generator.generate", () => {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const selection = editor.selection;

      const entireFile = document.getText();

      const selectedBlock = findSelectedBlockFromSelection(entireFile, selection);

	  if(!selectedBlock) {
		vscode.window.showInformationMessage("Could not find code - selection appears to be empty.");
	  }else{
		const { contents, startLineIndex, endLineIndex } = selectedBlock;


		console.log(`###${selectedBlock}###`);
		
		// const openai = require('openai-api');
		const dummyText = "//Test Comment\n";

		editor.edit(editBuilder => {
			editBuilder.insert(new vscode.Position(startLineIndex, 0), dummyText);
		});

		vscode.window.showInformationMessage("Done!");
	  }
    }else{
		vscode.window.showInformationMessage("Editor not found - please open a file.");
	}
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
