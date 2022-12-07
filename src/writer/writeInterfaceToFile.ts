/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-02 13:45:41
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-07 17:38:39
 */
import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";
import { fileToList } from "./fileToList";

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
    let contentList = fileToList(fileContent);
    // console.log(contentList);
    interfaceList.forEach((aInterface) => {
      let targetIndex = -1;
      contentList.forEach((item, index) => {
        if (item[0] === aInterface.name) {
          targetIndex = index;
        }
      });
      if (targetIndex !== -1) {
        contentList[targetIndex][1] = getInterfaceString(aInterface);
      } else {
        contentList.push([aInterface.name, getInterfaceString(aInterface)]);
      }
    });
    contentList.forEach((t) => {
      newContent += t[1];
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
  result += ' } from "./public.types";\n\n';
  return result;
}

function getInterfaceString(aInterface: IinterfaceStruct) {
  let result = "export interface " + aInterface.name + " {\n";
  aInterface.fields.forEach((aField) => {
    if (stringIsValid(aField.desc) && stringIsValid(aField.example)) {
      result +=
        "  // " +
        aField.name +
        ": " +
        aField.desc +
        ". Like " +
        aField.example +
        "\n";
    }

    if (!stringIsValid(aField.desc) && stringIsValid(aField.example)) {
      result += "  // Like " + aField.example + "\n";
    }

    if (stringIsValid(aField.desc) && !stringIsValid(aField.example)) {
      result += "  // " + aField.name + ": " + aField.desc + "\n";
    }
    result +=
      "  " +
      aField.name +
      isRequired(aField.required) +
      ": " +
      aField.type +
      ";\n";
  });
  result += "}\n\n";
  return result;
}

function isRequired(required: boolean) {
  return required ? "?" : "";
}

function stringIsValid(t: string | undefined) {
  return t !== null && t !== undefined && t !== "" ? true : false;
}
