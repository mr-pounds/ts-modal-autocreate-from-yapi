/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-02 13:45:41
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-19 15:14:55
 */
import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";
import { interfaceFileToCodeBlock } from "./fileToList";

export async function writeInterfaceToFile(
  path: vscode.Uri,
  interfaceList: IinterfaceStruct[],
  dependPublicInterfaceList: string[] = []
) {
  // 若存在该文件，便读取该文件内容
  let fileContent = await vscode.workspace.fs.readFile(path).then(
    (data) => new TextDecoder().decode(data),
    () => {
      return undefined;
    }
  );

  let newContent = "";
  if (fileContent !== undefined) {
    // 将 interface 文件解析成代码块
    let contentList = interfaceFileToCodeBlock(fileContent);
    interfaceList.forEach((aInterface) => {
      let targetIndex = -1;
      // 如果 interface 文件中存在同名的模型,则进行更新;
      // 反之,则追加到文件尾部.
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
      // 更新 public 模型的依赖
      if (
        t[0] === "import" &&
        t[1].includes('from "./public.types"') &&
        dependPublicInterfaceList.length > 0
      ) {
        newContent += updateImport(t[1], dependPublicInterfaceList);
      }
      newContent += t[1];
    });
  } else {
    // 生成 import 代码块
    newContent += getImportString(dependPublicInterfaceList);
    // 生成 interface 代码块
    interfaceList.forEach((aInterface) => {
      newContent += getInterfaceString(aInterface);
    });
  }

  var uint8array = new TextEncoder().encode(newContent);
  await vscode.workspace.fs.writeFile(path, uint8array).then(
    () => {
      return;
    },
    (err) => {
      vscode.window.showErrorMessage(err);
    }
  );
  return;
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

function updateImport(content: string, needImportList: string[]) {
  let matchResult = content.match(/{[\s\S]+}/);
  if (matchResult === null) {
    return content;
  }
  if (matchResult?.length === 0) {
    return content;
  }

  let tBlock = matchResult[0].replace(/[\s{}]/g, "");
  let importList: string[] = [];
  for (var imp of tBlock.split(",")) {
    if (imp !== "") {
      importList.push(imp);
    }
  }
  needImportList.forEach((t) => {
    let position = importList.indexOf(t);
    if (position === -1) {
      importList.push(t);
    } else {
      importList[position] = t;
    }
  });

  // 重新组合import
  let result = "";
  const prefixString = content.slice(0, matchResult.index!);
  result += prefixString;
  const suffixString = content.slice(
    matchResult.index! + matchResult[0].length + 1
  );
  if (importList.length > 2) {
    result += "{\n";
    importList.forEach((t) => {
      result += "  " + t + ",\n";
    });
    result += "} ";
  } else {
    result += "{";
    importList.forEach((t) => {
      result += " " + t + ", ";
    });
    result += "} ";
  }
  result += suffixString;
  return result;
}
