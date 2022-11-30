/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 17:02:33
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-30 15:00:48
 */
import * as vscode from "vscode";

function inputBox(config: any) {
  return new Promise<string>((resolve) => {
    vscode.window.showInputBox(config).then((result) => {
      resolve(result as string);
    });
  });
}

export async function hostInputBox() {
  return inputBox({
    title: "YApi Host",
    password: false,
    ignoreFocusOut: false,
    placeHolder: "Please enter yapi host",
    validateInput: (text: any) => {
      if (!(text.startsWith("http://") || text.startsWith("https://"))) {
        return "host should be starts with http:// or https://";
      }
      return null;
    },
  });
}

export async function tokenInputBox() {
  return await inputBox({
    title: "YApi Project Token",
    password: false,
    ignoreFocusOut: true,
    placeHolder: "Please enter yapi project token",
    validateInput: (text: any) => {
      if (text === "") {
        return "token can't be empty";
      }
      return null;
    },
  });
}

export async function titleInputBox() {
  return await inputBox({
    title: "YApi Project Title",
    password: false,
    ignoreFocusOut: true,
    placeHolder: "Please enter yapi project title",
    validateInput: (text: any) => {
      if (text === "") {
        return "title can't be empty";
      }
      return null;
    },
  });
}
