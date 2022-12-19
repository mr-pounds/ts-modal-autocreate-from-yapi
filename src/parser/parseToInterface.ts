/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 11:29:34
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-19 15:39:32
 */
import { getApiTitle, dataType, validList } from "../utils";
import { jsonToInterface } from "./jsonToInterface";

export interface IparseToInterfaceResponse {
  apiTitle: string;
  method: string;
  path: string;
  apiParams?: IApiReqParams[];
  apiQuery?: IinterfaceStruct;
  apiBodyForm?: IinterfaceStruct;
  apiBodyJsonInterface?: string;
  apiBodyJsonDepend?: IinterfaceStruct[];
  apiResponseInterface?: string;
  apiResponseDepend?: IinterfaceStruct[];
}

export function parseToInterface(apiInfo: IApiInfo): IparseToInterfaceResponse {
  // 生成 api 的基本名称，用于后续的拼接;
  const apiBaseTitle = getApiTitle(
    apiInfo.path,
    apiInfo.params.map((item) => item.name)
  );
  // 解析 params 的 interface
  const apiParams: IApiReqParams[] | undefined = validList(apiInfo.params)
    ? apiInfo.params
    : undefined;

  // 解析 query 的 interface
  const apiQuery: IinterfaceStruct | undefined = validList(apiInfo.query)
    ? {
        name: "I" + apiBaseTitle + "Query",
        isPublic: false,
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
  const apiBodyForm: IinterfaceStruct | undefined = validList(apiInfo.bodyForm)
    ? {
        name: "I" + apiBaseTitle + "BodyForm",
        isPublic: false,
        fields: apiInfo.bodyForm!.map((item) => {
          return {
            required: item.required === "1",
            name: item.name,
            type: dataType(item.type),
            desc: item.desc,
            example: item.example,
          };
        }),
      }
    : undefined;

  // 解析 bodyjson 的 interface
  let apiBodyJsonInterface = undefined;
  let apiBodyJsonDepend: IinterfaceStruct[] = [];
  if (apiInfo.bodyJson && Object.keys(apiInfo.bodyJson!).length !== 0) {
    const result = jsonToInterface(
      apiBaseTitle + "BodyJson",
      apiInfo.bodyJson!
    );
    apiBodyJsonInterface = result.current.name;
    apiBodyJsonDepend = result.denpend;
  }

  // 解析 response 的 interface
  let apiResponseInterface = undefined;
  let apiResponseDepend: IinterfaceStruct[] = [];
  if (apiInfo.response && Object.keys(apiInfo.response!).length !== 0) {
    const result = jsonToInterface(
      apiBaseTitle + "Response",
      apiInfo.response!
    );
    apiResponseInterface = result.current.name;
    apiResponseDepend = result.denpend;
  }
  return {
    apiTitle: apiBaseTitle,
    method: apiInfo.method,
    path: apiInfo.path,
    apiParams,
    apiQuery,
    apiBodyForm,
    apiBodyJsonInterface,
    apiBodyJsonDepend,
    apiResponseInterface,
    apiResponseDepend,
  };
}
