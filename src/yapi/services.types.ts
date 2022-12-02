/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-30 15:27:13
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-01 14:32:28
 */

interface IYApiResponse<T> {
  errcode: number;
  errmsg: string;
  data: T;
}

interface IApiListResponse {
  count: number;
  total: number;
  list: IApi[];
}

interface IApi {
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

interface IQueryPath {
  path: string;
  params: any[];
}

interface IReqQuery {
  required: string;
  _id: string;
  name: string;
  example: string;
  desc: string;
}

interface IReqForm {
  required: string;
  _id: string;
  name: string;
  type: string;
  desc: string;
}

interface IReqHeaders {
  required: string;
  _id: string;
  name: string;
  value: string;
  example: string;
}

interface IApiDetail {
  query_path: IQueryPath;
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
  req_params: any[];
  res_body_type: string;
  uid: number;
  add_time: number;
  up_time: number;
  req_query: IReqQuery[];
  req_headers: IReqHeaders[];
  req_body_form: any[];
  req_body_other: string;
  __v: number;
  desc: string;
  markdown: string;
  res_body: string;
  username: string;
}
