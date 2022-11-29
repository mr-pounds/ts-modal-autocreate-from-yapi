/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 14:58:13
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-29 21:12:00
 */
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";
import { fetcher } from "./controller";

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log(
    'Congratulations, your extension "ts-modal-autocreate-from-yapi" is now active!'
  );

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "ts-modal-autocreate-from-yapi.helloWorld",
    (args) => {
      // The code you place here will be executed every time your command is executed
      // Display a message box to the user
      fetcher(args);
    }
  );

  context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
