/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 14:37:43
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-05 17:28:42
 */

//  old interface: wait to delete
interface interfaceStruct {
  name: string;
  isPublic: boolean;
  fields?: IField[];
}

interface IField {
  name: string;
  type: string;
  isRequired: boolean;
}

interface IInterfaceResult {
  name: string;
  isPublic?: boolean;
  content: string;
}

// new interface

interface IApiBaseInfo {
  title: string;
  path: string;
  method: string;
  params: IApiReqParams[];
  query: IApiReqQuery[];
  bodyIsJson: boolean;
  body?: IApiReqBodyForm[];
  response: string[];
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
  isPublic: boolean;
  // interface name
  name: string;
  properties: IApiJsonField[];
}

interface IApiJsonField {
  name: string;
  type: string;
  required: string;
  desc?: string;
}
