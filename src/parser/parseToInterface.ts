/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 11:29:34
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 21:21:55
 */
import { type } from "os";
import { camelCase, getApiTitle } from "../utils";
import { jsonToInterface } from "./jsonToInterface";

export function parseToInterface(apiInfo: IApiInfo) {
  // 生成 api 的基本名称，用于后续的拼接;
  const apiBaseTitle = getApiTitle(
    apiInfo.path,
    apiInfo.params.map((item) => item.name)
  );
  // 解析 params 的 interface
  const apiParams: IinterfaceStruct | undefined =
    apiInfo.params.length !== 0
      ? {
          name: "I" + apiBaseTitle + "Params",
          fields: apiInfo.params.map((item) => {
            return {
              required: true,
              name: item.name,
              type: "string",
              desc: item.desc,
              example: item.example,
            };
          }),
        }
      : undefined;

  // 解析 query 的 interface
  const apiQuery: IinterfaceStruct | undefined =
    apiInfo.query.length !== 0
      ? {
          name: "I" + apiBaseTitle + "Query",
          fields: apiInfo.query.map((item) => {
            return {
              required: item.required === "1",
              name: item.name,
              type: "string",
              desc: item.desc,
            };
          }),
        }
      : undefined;

  // 解析 bodyform 的 interface
  const apiBodyForm: IinterfaceStruct | undefined =
    apiInfo.bodyForm?.length !== 0
      ? {
          name: "I" + apiBaseTitle + "BodyForm",
          fields: apiInfo.bodyForm!.map((item) => {
            return {
              required: item.required === "1",
              name: item.name,
              type: item.type,
              desc: item.desc,
              example: item.example,
            };
          }),
        }
      : undefined;

  // 解析 bodyjson 的 interface
  const apiBodyJson = undefined;
  if (Object.keys(apiInfo.bodyJson!).length !== 0) {
    const result = jsonToInterface(
      apiBaseTitle + "BodyJson",
      apiInfo.bodyJson!
    );
    console.log(result);
  }

  // 解析 response 的 interface
}
