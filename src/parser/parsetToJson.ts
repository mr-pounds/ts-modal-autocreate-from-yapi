/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-06 14:51:06
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 19:52:46
 */
export function parseToJson(content: IYapiApiDetail): IApiInfo {
  return {
    title: content.title,
    path: content.path,
    method: content.method.toLowerCase(),
    params: content.req_params,
    query: content.req_query,
    bodyIsJson: content.req_body_type === "json",
    bodyForm: content.req_body_form,
    bodyJson: _parse(content.req_body_other!),
    response: _parse(content.res_body),
  };
}

function _parse(data: string) {
  return data === undefined ? [] : JSON.parse(data);
}
