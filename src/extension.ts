// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { cleanAIResponse, findSelectedBlockFromSelection, indentCommentToCode } from "./helpers";
import { getAIResponse, parsePromptAndInsertInput } from "./openai-connection";

const safelyExtractStringSetting = (settingName: string, vscodeWindow: typeof vscode.window, vscodeWorkspace: typeof vscode.workspace) => {
  const setting = vscodeWorkspace.getConfiguration().get(settingName);
  if (!setting) {
    vscodeWindow.showInformationMessage(`${settingName} not found - please set it in the settings.`);
    return null;
  }
  if (typeof setting !== "string") {
    vscodeWindow.showInformationMessage(`${settingName} is not a string - please set it in the settings.`);
    return null;
  }

  return setting;
}


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export async function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "jsdoc-openai-powered-generator" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand("jsdoc-openai-powered-generator.generate", async () => {
    // Get the active text editor
    const editor = vscode.window.activeTextEditor;

    if (editor) {
      const document = editor.document;
      const selection = editor.selection;

      const entireFile = document.getText();

      const selectedBlock = findSelectedBlockFromSelection(entireFile, selection);

      if (!selectedBlock) {
        vscode.window.showInformationMessage("Could not find code - selection appears to be empty.");
      } else {
        const { contents, startLineIndex, endLineIndex } = selectedBlock;


        const apiKey = safelyExtractStringSetting("jsdoc-openai-powered-generator.apiKey", vscode.window, vscode.workspace);
        if (!apiKey) {
          return;
        }
        const promptFromConfig = safelyExtractStringSetting("jsdoc-openai-powered-generator.prompt", vscode.window, vscode.workspace);
        if(!promptFromConfig) {
          return;
        }
        const modelFromConfig = safelyExtractStringSetting("jsdoc-openai-powered-generator.model", vscode.window, vscode.workspace);
        if(!modelFromConfig) {
          return;
        }

        vscode.window
          .withProgress(
            {
              location: vscode.ProgressLocation.Notification,
              title: "Generating JSDoc",
              cancellable: false,
            },
            async (progress, token) => {
              progress.report({ increment: 20 });

              const {prompt, error: promptParseError} = parsePromptAndInsertInput(
                promptFromConfig,
                contents
              );
              if(promptParseError) {
                vscode.window.showInformationMessage(`Error parsing prompt: ${promptParseError}`);
                console.log(promptParseError);
                return;
              }
              if(!prompt) {
                vscode.window.showInformationMessage(`Error parsing prompt: no prompt returned.`);
                console.log(prompt);
                return;
              }

              const { result, error } = await getAIResponse(apiKey, contents, prompt, modelFromConfig);

              if (error) {
                vscode.window.showInformationMessage("Error generating JSDoc - please check the console.");
                console.log(error);
                return;
              } else {
                if (!result) {
                  vscode.window.showInformationMessage(
                    "Error generating JSDoc - no result returned. Check the console For more info."
                  );
                  console.log(result);
                  return;
                }

                const commentText = result.choices[0].message.content;

                if (!commentText) {
                  vscode.window.showInformationMessage(
                    "Error generating JSDoc - no text returned from API. Check the console For more info."
                  );
                  console.log("result:", result);
                  return;
                }

                const cleanedText = cleanAIResponse(commentText);
                const textAfterBeingIndentedCorrectly = indentCommentToCode(contents, cleanedText);

                editor.edit((editBuilder) => {
                  editBuilder.insert(new vscode.Position(startLineIndex, 0), textAfterBeingIndentedCorrectly);
                });
              }

              progress.report({ increment: 100 });
            }
          )
          .then(() => {
            console.log("JSDoc generated!");
          });
      }
    } else {
      vscode.window.showInformationMessage("Editor not found - please open a file.");
    }
  });

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
