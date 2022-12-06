import { stringify } from "querystring";
import { camelCase } from "../utils";

/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 14:34:50
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 21:31:21
 */
interface IjsonToInterfaceResponse {
  current: IinterfaceStruct;
  denpend: IinterfaceStruct[];
}

interface Icontent {
  type: string;
  required: string[];
  properties: any;
  desc?: string;
}

// 只接受 object 结构
export function jsonToInterface(
  interfaceName: string,
  content: Icontent,
  level: number = 0
): IjsonToInterfaceResponse {
  let fields: IinterfaceField[] = [];
  let denpend: IinterfaceStruct[] = [];
  for (var key in content.properties) {
    switch (content.properties[key]["type"]) {
      case "object":
        const t = jsonToInterface(
          interfaceName + camelCase(key),
          content.properties[key],
          level + 1
        );
        fields.push({
          name: key,
          type: t.current.name,
          required: key in content.required,
          desc: content.properties[key]["desc"],
        });
        denpend.push(...t.denpend);
        break;
      case "array":
        const arrayResult = arrayInterface(
          interfaceName + camelCase(key),
          content.properties[key]
        );
        fields.push({
          name: key,
          type: arrayResult.type,
          required: key in content.required,
          desc: content.properties[key]["desc"],
        });
        denpend.push(...arrayResult.depend);
        break;
      default:
        fields.push({
          name: key,
          type: dataType(content.properties[key]["type"]),
          required: key in content.required,
          desc: content.properties[key]["desc"],
        });
    }
  }
  let current = {
    name: interfaceName,
    fields,
  };
  denpend.push(current);
  return {
    current,
    denpend,
  };
}

function arrayInterface(
  name: string,
  content: any
): {
  type: string;
  depend: IinterfaceStruct[];
} {
  let depend = [];
  let type = "";
  switch (content.items.type) {
    case "object":
      const objectResult = jsonToInterface(name, content.items);
      type = objectResult.current.name + "[]";
      depend.push(...objectResult.denpend);
      break;
    case "array":
      const arrayResult = arrayInterface(name, content.items);
      type = arrayResult.type + "[]";
      depend.push(...arrayResult.depend);
    default:
      type = content.items.type + "[]";
  }
  return {
    type,
    depend,
  };
}

function dataType(type: string) {
  return type === "integer" ? "number" : type;
}
