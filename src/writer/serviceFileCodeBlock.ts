/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-08 16:29:05
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-19 15:45:01
 */
import { IparseToInterfaceResponse } from "../parser/parseToInterface";
import { getOneApiContent } from "./writeApiToFile";

export function fileToCodeBlock(content: string) {
  // 解析成一级的代码块
  let result: string[] = [];
  let temp = "";
  let bigBracketNum = 0;
  let smallBracketNum = 0;
  for (var line of content.split(/[\r\n]/)) {
    temp += line;
    // 为了更好的匹配，要去掉空白符号，因此用tLine
    let tLine = line.replace(/[\s;]/g, "");
    bigBracketNum += tLine.endsWith("{") ? 1 : 0;
    smallBracketNum += tLine.endsWith("(") ? 1 : 0;
    bigBracketNum -= tLine.startsWith("}") ? 1 : 0;
    smallBracketNum -= tLine.startsWith(")") ? 1 : 0;
    if (bigBracketNum === 0 && smallBracketNum === 0) {
      // console.log("check", temp.split("\n").length);
      result.push(temp);
      temp = "";
    } else {
      temp += "\n";
    }
  }
  // 更新 import
  return result;
}

export function updateImport(
  content: string[],
  apiList: IparseToInterfaceResponse[]
) {
  let newConetnt = content;
  // 先解析从 inputBo 及 outputVo 中导入的部分，其他部分保留不动
  content.forEach((block, index) => {
    if (
      block.startsWith("import") &&
      block.includes('from "./inputBo.types"')
    ) {
      // 处理input依赖的内容
      let needImportList: string[] = [];
      apiList.forEach((aApi) => {
        if (aApi.apiQuery !== undefined) {
          needImportList.push(aApi.apiQuery.name);
        }
        if (aApi.apiBodyForm !== undefined) {
          needImportList.push(aApi.apiBodyForm.name);
        }
        if (aApi.apiBodyJsonInterface !== undefined) {
          needImportList.push(aApi.apiBodyJsonInterface);
        }
      });
      newConetnt[index] = getImportContent(block, needImportList);
    }

    if (
      block.startsWith("import") &&
      block.includes('from "./outputVo.types"')
    ) {
      // 处理output依赖的内容
      let needImportList: string[] = [];
      apiList.forEach((aApi) => {
        if (aApi.apiResponseInterface !== undefined) {
          needImportList.push(aApi.apiResponseInterface);
        }
      });
      newConetnt[index] = getImportContent(block, needImportList);
    }
  });
  return newConetnt;
}

function getImportContent(block: string, needImportList: string[]) {
  let matchResult = block.match(/{[\s\S]+}/);
  if (matchResult === null) {
    return block;
  }
  if (matchResult?.length === 0) {
    return block;
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
  const prefixString = block.slice(0, matchResult.index!);
  result += prefixString;
  const suffixString = block.slice(
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

export function updateService(
  content: string[],
  apiList: IparseToInterfaceResponse[]
) {
  let newConetnt = content;

  content.forEach((item, index) => {
    if (item.startsWith("export default {")) {
      let matchResult = item.match(/{[\s\S]+}/);
      if (matchResult === null || matchResult?.length === 0) {
        return;
      }
      let functionString = matchResult[0].slice(1, matchResult[0].length - 1);
      let functionList = fileToCodeBlock(functionString);
      let newFunctionList = functionList;
      apiList.forEach((aItem) => {
        const functionName = aItem.method.toLowerCase() + aItem.apiTitle + "(";
        let haveMatched = false;
        functionList.forEach((value, index) => {
          if (value.includes(functionName)) {
            newFunctionList[index] = getOneApiContent(aItem);
            haveMatched = true;
          }
        });
        if (!haveMatched) {
          newFunctionList.push(getOneApiContent(aItem));
        }
      });

      // 重组方法
      let functionContent = "export default {\n";
      newFunctionList.forEach((value) => {
        functionContent += value + "\n";
      });
      functionContent += "};";
      newConetnt[index] = functionContent;
    }
  });

  return newConetnt;
}
