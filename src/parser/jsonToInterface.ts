import { camelCase } from "../utils";

/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 14:34:50
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 16:38:30
 */

interface IextractInterfaceResult {
  newTypeName: string;
  list: interfaceStruct[];
}

export function extractInterface(
  target: any,
  name: string,
  level: number = 0
): IextractInterfaceResult {
  //   name 由上层传递， type、required、properties 是关键属性
  let newInterfaceList: interfaceStruct[] = [];
  let fields: IField[] = [];
  // 如果对象类型不是有明确意义的object或array，直接返回空列

  if (target.type === "object") {
    for (const field in target.properties) {
      if (
        target.properties[field]["type"] === "object" &&
        Object.keys(target.properties[field]["properties"].length === 0)
      ) {
        fields.push({
          name: field,
          type: "null",
          isRequired:
            target["required"] !== undefined
              ? field in target["required"]
              : false,
        });
      }
      if (
        target.properties[field]["type"] === "object" &&
        Object.keys(target.properties[field]["properties"].length !== 0)
      ) {
        let result = extractInterface(
          target.properties[field],
          name + camelCase(field),
          level + 1
        );
        fields.push({
          name: field,
          type: result.newTypeName,
          isRequired:
            target["required"] !== undefined
              ? field in target["required"]
              : false,
        });
        newInterfaceList = newInterfaceList.concat(result.list);
        continue;
      }

      if (target.properties[field]["type"] === "array") {
        // 不是的话,直接返回 field
        // 判断 items.type 是不是 array 或者 object
        if (
          target.properties[field]["items"]["type"] === "array" ||
          target.properties[field]["items"]["type"] === "object"
        ) {
          let result = extractInterface(
            target.properties[field],
            name + camelCase(field),
            level + 1
          );
          fields.push({
            name: field,
            type: result.newTypeName + "[]",
            isRequired:
              target["required"] !== undefined
                ? field in target["required"]
                : false,
          });
          newInterfaceList = newInterfaceList.concat(result.list);
        } else {
          fields.push({
            name: field,
            type: target.properties[field]["items"]["type"] + "[]",
            isRequired:
              target["required"] !== undefined
                ? field in target["required"]
                : false,
          });
        }
        continue;
      }
      // field type isn't object or array
      fields.push({
        name: field,
        type: target.properties[field]["type"],
        isRequired:
          target["required"] !== undefined
            ? field in target["required"]
            : false,
      });
    }
    newInterfaceList.push({
      name: name,
      fields,
      isPublic: level > 1,
    });
  }

  if (target.type === "array") {
    if (
      target["items"]["type"] === "array" ||
      target["items"]["type"] === "object"
    ) {
      let result = extractInterface(target["items"], name, level + 1);
      fields.push({
        name: name,
        type: result.newTypeName + "[]",
        isRequired: false,
      });
      newInterfaceList = newInterfaceList.concat(result.list);
    } else {
      fields.push({
        name: name,
        type: target["items"]["type"] + "[]",
        isRequired: false,
      });
    }
  }
  return {
    newTypeName: name,
    list: newInterfaceList,
  };
}

function dataType(t: string): string {
  return t === "integer" ? "number" : t;
}
