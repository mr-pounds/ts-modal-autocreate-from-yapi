/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 11:29:34
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 16:38:35
 */
import { camelCase } from "../utils";
import { extractInterface } from "./jsonToInterface";

export function getQueryInterface(apiDetail: IApiDetail, apiTitle: string) {
  return apiDetail.req_query.length !== 0
    ? {
        name: "I" + camelCase(apiDetail.method) + apiTitle + "Query",
        isPublic: false,
        content: getBodyInterface(apiDetail.req_query),
      }
    : undefined;
}

export function getFormInterface(apiDetail: IApiDetail, apiTitle: string) {
  if (
    apiDetail.req_body_form.length === 0 &&
    apiDetail.req_body_is_json_schema === false
  ) {
    return undefined;
  }

  if (apiDetail.req_body_form.length !== 0) {
    return {
      name: "I" + camelCase(apiDetail.method) + apiTitle + "Form",
      list: [
        {
          name: "I" + camelCase(apiDetail.method) + apiTitle + "Form",
          content: getBodyInterface(apiDetail.req_body_form),
        },
      ],
    };
  }

  if (
    apiDetail.req_body_other !== "" &&
    apiDetail.req_body_other !== undefined
  ) {
    const interfaceName = "I" + camelCase(apiDetail.method) + apiTitle + "Form";
    const { list } = extractInterface(
      JSON.parse(apiDetail.req_body_other),
      interfaceName
    );
    let interfaceList = list;
    let result: any[] = [];
    interfaceList.forEach((item) => {
      let t = "";
      item.fields?.forEach((field) => {
        t += fieldToString(field.name, field.type, field.isRequired);
      });
      result.push({
        name: item.name,
        isPublic: item.isPublic,
        content: t,
      });
    });

    return { name: interfaceName, list: result };
  }
  return undefined;
}

export function getResponseInterface(apiDetail: IApiDetail, apiTitle: string) {
  if (apiDetail.res_body !== "") {
    const interfaceName =
      "I" + camelCase(apiDetail.method) + apiTitle + "Response";
    const { list } = extractInterface(
      JSON.parse(apiDetail.res_body),
      interfaceName
    );
    let interfaceList = list;
    let result: any[] = [];
    interfaceList.forEach((item) => {
      let t = "";
      item.fields?.forEach((field) => {
        t += fieldToString(field.name, field.type, field.isRequired);
      });
      result.push({
        name: item.name,
        isPublic: item.isPublic,
        content: t,
      });
    });

    return {
      name: interfaceName,
      list: result,
    };
  }
  return undefined;
}

function getBodyInterface(body: IReqQuery[]) {
  // 生成interface的内容
  let result = "";
  body.forEach((item) => {
    result += fieldToString(item.name, "string", item.required === "1");
  });
  return result;
}

function fieldToString(name: string, type: string, isRequired: boolean) {
  return "    " + name + (isRequired ? "?" : "") + ": " + type + ";\n";
}
