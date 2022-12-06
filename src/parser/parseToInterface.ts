/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 11:29:34
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 16:06:05
 */
import { camelCase, getApiTitle } from "../utils";
import { extractInterface } from "./jsonToInterface";

export function parseToInterface(apiInfo: IApiInfo) {
  // 生成 api 的基本名称，用于后续的拼接;
  const apiBaseTitle = getApiTitle(
    apiInfo.path,
    apiInfo.params.map((item) => item.name)
  );
  // 解析 query 的 interface
  // 解析 bodyform 的 interface
  // 解析 bodyjson 的 interface
  // 解析 response 的 interface
}
