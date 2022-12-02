/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 14:37:43
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 09:35:54
 */
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
