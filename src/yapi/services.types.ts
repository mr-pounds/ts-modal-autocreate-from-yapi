/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-30 15:27:13
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-30 15:39:49
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
