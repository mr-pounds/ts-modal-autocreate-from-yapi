/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-02 13:45:41
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 21:32:16
 */
import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";

export async function writeInterfaceToFile(
  path: vscode.Uri,
  aInterface: IinterfaceStruct
) {
  if (aInterface === undefined) {
    return;
  }
  let fileContent = await vscode.workspace.fs.readFile(path).then(
    (data) => new TextDecoder().decode(data),
    (err) => {
      return undefined;
    }
  );
  let newContent = "";
  if (fileContent !== undefined) {
    // todo 更新先欠着
    newContent = fileContent;
    newContent += getInterfaceString(aInterface);
  } else {
    // 执行追加
    newContent += getInterfaceString(aInterface);
  }
  var uint8array = new TextEncoder().encode(newContent);
  await vscode.workspace.fs.writeFile(path, uint8array);
}

function getInterfaceString(aInterface: IinterfaceStruct) {
  // return (
  //   "export interface " + aInterface.name + " {\n" + aInterface.content + "}\n"
  // );
}
