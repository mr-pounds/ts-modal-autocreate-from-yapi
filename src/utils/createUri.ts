/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-02 13:36:46
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 13:38:39
 */
import * as vscode from "vscode";
import { join } from "path";

export function createUri(path: string, dir?: string) {
  if (dir !== undefined) {
    return vscode.Uri.from({
      scheme: "file",
      path: join(dir, path),
    });
  }
  return vscode.Uri.from({
    scheme: "file",
    path,
  });
}
