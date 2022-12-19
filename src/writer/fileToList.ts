/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-07 14:41:52
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-19 15:36:01
 */
export function interfaceFileToCodeBlock(content: string): string[][] {
  let result: string[][] = [];
  let temp: string = "";
  let leftBracketNum = 0;
  for (var line of content.split(/[\r\n]/)) {
    // 为了更好的匹配，要去掉空白符号，因此用tLine
    let tLine = line.replace(/[\s;]/g, "");
    temp += line + "\n";
    if (tLine.endsWith("{")) {
      leftBracketNum += 1;
    }
    if (tLine.startsWith("}")) {
      leftBracketNum -= 1;
    }
    if (leftBracketNum === 0) {
      // 获取关键词 export or interface name
      let keyString = getKeyString(temp);
      result.push([keyString!, temp]);
      temp = "";
    }
  }
  return result;
}

function getKeyString(content: string) {
  if (content.startsWith("import")) {
    return "import";
  }
  if (content.startsWith("interface")) {
    // 获取关键词
    return content.split(" ")[1] !== undefined ? content.split(" ")[1] : "";
  }
  if (content.startsWith("export interface")) {
    // 获取关键词
    return content.split(" ")[2] !== undefined ? content.split(" ")[2] : "";
  }
}
