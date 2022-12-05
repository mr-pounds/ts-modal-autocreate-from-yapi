/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-30 15:27:13
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-05 17:18:06
 */

interface IYapiResponse<T> {
  errcode: number;
  errmsg: string;
  data: T;
}

interface IYapiApiList {
  count: number;
  total: number;
  list: IYapiApiBaseInfo[];
}

interface IYapiApiBaseInfo {
  _id: number;
  add_time: number;
  api_opened: boolean;
  catid: number;
  edit_uid: number;
  method: string;
  path: string;
  project_id: number;
  status: string;
  tag: number[];
  title: string;
  uid: number;
}

interface IYapiApiDetail {
  query_path: any;
  edit_uid: number;
  status: string;
  type: string;
  req_body_is_json_schema: boolean;
  res_body_is_json_schema: boolean;
  api_opened: boolean;
  index: number;
  tag: string[];
  _id: number;
  method: string;
  catid: number;
  title: string;
  path: string;
  project_id: number;
  req_params: IApiReqParams[];
  uid: number;
  add_time: number;
  up_time: number;
  req_query: IApiReqQuery[];
  req_headers: any;
  req_body_form: IApiReqBodyForm[];
  __v: number;
  desc: string;
  markdown: string;
  // 可以转成 json 对象
  req_body_other?: string;
  res_body_type: string;
  // 转成 json 对象
  res_body: string;
  username: string;
}
