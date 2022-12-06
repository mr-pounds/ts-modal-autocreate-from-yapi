/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-06 14:51:06
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 15:14:21
 */
export function parseToJson(content: IYapiApiDetail): IApiInfo {
  return {
    title: content.title,
    path: content.path,
    method: content.method.toLowerCase(),
    params: content.req_params,
    query: content.req_query,
    bodyIsJson: content.req_body_type === "json",
    body:
      content.req_body_type === "json"
        ? _parse(content.req_body_other!)
        : content.req_body_form,
    response: _parse(content.res_body),
  };
}

function _parse(data: string) {
  return data === undefined ? [] : JSON.parse(data);
}
