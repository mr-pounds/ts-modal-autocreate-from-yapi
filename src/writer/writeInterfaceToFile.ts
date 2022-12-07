/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-02 13:45:41
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-07 11:17:49
 */
import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";

export async function writeInterfaceToFile(
  path: vscode.Uri,
  interfaceList: IinterfaceStruct[],
  dependPublicInterfaceList: string[] = []
) {
  if (interfaceList === undefined) {
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
    interfaceList.forEach((aInterface) => {
      newContent += getInterfaceString(aInterface);
    });
  } else {
    newContent += getImportString(dependPublicInterfaceList);
    // 执行追加
    interfaceList.forEach((aInterface) => {
      newContent += getInterfaceString(aInterface);
    });
  }
  var uint8array = new TextEncoder().encode(newContent);
  await vscode.workspace.fs.writeFile(path, uint8array);
}

function getImportString(dependList: string[]) {
  if (dependList.length === 0) {
    return "";
  }
  let result = "import { ";
  dependList.forEach((item) => {
    result += item;
  });
  result += ' } from "./publicInterface.types";\n';
  return result;
}

function getInterfaceString(aInterface: IinterfaceStruct) {
  let result = "export interface " + aInterface.name + " {\n";
  aInterface.fields.forEach((aField) => {
    if (stringIsValid(aField.desc) && stringIsValid(aField.example)) {
      result +=
        "    // " +
        aField.name +
        ": " +
        aField.desc +
        ". Like " +
        aField.example +
        "\n";
    }

    if (!stringIsValid(aField.desc) && stringIsValid(aField.example)) {
      result += "    // Like " + aField.example + "\n";
    }

    if (stringIsValid(aField.desc) && !stringIsValid(aField.example)) {
      result += "    // " + aField.name + ": " + aField.desc + "\n";
    }
    result +=
      "    " +
      aField.name +
      isRequired(aField.required) +
      ": " +
      aField.type +
      ";\n";
  });
  result += "}\n";
  return result;
}

function isRequired(required: boolean) {
  return required ? "?" : "";
}

function stringIsValid(t: string | undefined) {
  return t !== null && t !== undefined && t !== "" ? true : false;
}
