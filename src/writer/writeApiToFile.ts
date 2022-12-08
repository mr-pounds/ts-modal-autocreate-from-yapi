/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-07 17:14:58
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-08 15:22:28
 */
import { TextDecoder, TextEncoder } from "util";
import * as vscode from "vscode";
import { fileToList } from "./fileToList";
import { IparseToInterfaceResponse } from "../parser/parseToInterface";

export async function writerApiToFile(
  path: vscode.Uri,
  apiList: IparseToInterfaceResponse[]
) {
  if (apiList.length === 0) {
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
    // 如果文件已存在 TODO
    let contentList = fileToList(fileContent);
    // console.log(contentList);
    // interfaceList.forEach((aInterface) => {
    //   let targetIndex = -1;
    //   contentList.forEach((item, index) => {
    //     if (item[0] === aInterface.name) {
    //       targetIndex = index;
    //     }
    //   });
    //   if (targetIndex !== -1) {
    //     contentList[targetIndex][1] = getInterfaceString(aInterface);
    //   } else {
    //     contentList.push([aInterface.name, getInterfaceString(aInterface)]);
    //   }
    // });
    // contentList.forEach((t) => {
    //   newContent += t[1];
    // });
  } else {
    // 生成需要导入的文件
    newContent += getImportContent(apiList);
    // 开始生成请求方法
    newContent += getApiContent(apiList);
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

function getImportContent(apiList: IparseToInterfaceResponse[]) {
  let result = 'import { get, put, post, del, page } from "@/api/service";\n';
  let importInputInterfaceList: string[] = [];
  let importOutputInterfaceList: string[] = [];
  apiList.forEach((aApi) => {
    if (aApi.apiQuery !== undefined) {
      importInputInterfaceList.push(aApi.apiQuery!.name);
    }
    if (aApi.apiBodyForm !== undefined) {
      importInputInterfaceList.push(aApi.apiBodyForm!.name);
    }
    if (aApi.apiBodyJsonInterface !== undefined) {
      importInputInterfaceList.push(aApi.apiBodyJsonInterface);
    }
    if (aApi.apiResponseInterface !== undefined) {
      importOutputInterfaceList.push(aApi.apiResponseInterface);
    }
  });
  result += getImportString("./inputBo.types", importInputInterfaceList);
  result += getImportString("./outputVo.types", importOutputInterfaceList);
  return result;
}

function getImportString(file: string, list: string[]) {
  let result = "";
  if (list.length > 2) {
    result += "import {\n";
    list.forEach((t) => {
      result += "  " + t + ",\n";
    });
    result += '} from "' + file + '";\n';
  } else {
    result += "import {";
    list.forEach((t) => {
      result += t + ", ";
    });
    result += '} from "' + file + '";\n';
  }
  return result;
}

function getApiContent(apiList: IparseToInterfaceResponse[]) {
  let result = "\nexport default {\n";
  apiList.forEach((aItem) => {
    // 写入函数头
    result += "  " + aItem.apiTitle + "(";
    result += getFunctionParams(aItem);
    result += "  ) {\n";
    // 写入函数体
    // 先构建url
    result += "    const url = `" + aItem.path.replace("{", "${") + "`;\n";
    // 构建return
    result +=
      "    return " +
      aItem.method.toLowerCase() +
      "<" +
      aItem.apiResponseInterface +
      ">(url, " +
      (aItem.apiQuery !== undefined ? "query, " : "");
    if (
      aItem.apiBodyForm !== undefined &&
      aItem.apiBodyJsonInterface === undefined
    ) {
      result +=
        "data, " +
        '{\n      "Content-Type": "application/x-www-form-urlencoded"\n    }';
    }
    if (aItem.apiBodyJsonInterface !== undefined) {
      result += "data";
    }
    result += ");\n  },\n\n";
  });
  result += "}\n";
  return result;
}

function getFunctionParams(aItem: IparseToInterfaceResponse) {
  let paramNum = aItem.apiParams?.length !== 0 ? aItem.apiParams!.length : 0;
  paramNum += aItem.apiQuery !== undefined ? 1 : 0;
  paramNum += aItem.apiBodyForm !== undefined ? 1 : 0;
  paramNum += aItem.apiBodyJsonInterface !== undefined ? 1 : 0;
  paramNum += aItem.apiResponseInterface !== undefined ? 1 : 0;

  let suffixString = paramNum >= 2 ? "\n" : " ";
  let prefixString = paramNum >= 2 ? "    " : "";
  let result = paramNum >= 2 ? "\n" : "";
  if (aItem.apiParams?.length !== 0) {
    aItem.apiParams?.forEach((item) => {
      result += prefixString + item.name + ": string," + suffixString;
    });
  }

  if (aItem.apiQuery !== undefined) {
    result +=
      prefixString + "query: " + aItem.apiQuery.name + "," + suffixString;
  }

  if (
    aItem.apiBodyForm !== undefined &&
    aItem.apiBodyJsonInterface === undefined
  ) {
    result +=
      prefixString + "data: " + aItem.apiBodyForm.name + "," + suffixString;
  }

  if (aItem.apiBodyJsonInterface !== undefined) {
    result +=
      prefixString + "data: " + aItem.apiBodyJsonInterface + "," + suffixString;
  }
  return result;
}
