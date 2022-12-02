/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-30 16:18:52
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 13:39:53
 */
import * as vscode from "vscode";
import { dirname } from "path";
import { createUri } from "../utils/createUri";

async function getDir(args: vscode.Uri) {
  return await vscode.workspace.fs.stat(args).then((stats) => {
    if (stats.type === 1) {
      return createUri(dirname(args["fsPath"]));
    } else {
      return args;
    }
  });
}

export async function getWorkFolder(args: any) {
  if (args !== undefined) {
    return await getDir(args);
  }

  const folders = vscode.workspace.workspaceFolders;
  if (folders === undefined) {
    return;
  }
  let rootFolder = folders[0];
  return rootFolder.uri;
}
