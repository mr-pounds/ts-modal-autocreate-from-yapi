/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 14:37:43
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-08 16:36:32
 */

interface IApiInfo {
  title: string;
  path: string;
  method: string;
  params: IApiReqParams[];
  query: IApiReqQuery[];
  bodyIsJson: boolean;
  bodyForm?: IApiReqBodyForm[];
  bodyJson?: IApiJsonObject;
  response: IApiJsonObject;
}

interface IApiReqParams {
  _id: string;
  name: string;
  example?: string;
  desc?: string;
}

interface IApiReqQuery {
  _id: string;
  required: string;
  name: string;
  desc: string;
}

interface IApiReqBodyForm {
  _id: string;
  required: string;
  name: string;
  type: string;
  example?: string;
  desc?: string;
}

interface IApiJsonObject {
  required: string[];
  title: string;
  type: string;
  properties: any;
}

interface IinterfaceStruct {
  name: string;
  isPublic: boolean;
  fields: IinterfaceField[];
}

interface IinterfaceField {
  name: string;
  type: string;
  required: boolean;
  desc?: string;
  example?: string;
}
