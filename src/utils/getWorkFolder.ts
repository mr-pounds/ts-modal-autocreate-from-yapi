/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-30 16:18:52
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-30 16:33:16
 */
import * as vscode from "vscode";
import { dirname } from "path";

function getDir(input: string) {
  return dirname(input);
}

export function getWorkFolder(args: any) {
  if (args !== undefined) {
    return getDir(args["fsPath"]);
  }

  const folders = vscode.workspace.workspaceFolders;
  if (folders === undefined) {
    return;
  }
  let rootFolder = folders[0];
  return rootFolder.uri.fsPath;
}
