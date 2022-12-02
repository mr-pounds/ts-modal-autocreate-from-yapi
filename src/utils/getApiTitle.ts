/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-01 13:32:47
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-01 16:58:01
 */
export default function getApiTitle(apiDetail: IApiDetail) {
  let apiTitle = apiDetail.path;
  // 将path中的路径参数干掉
  apiDetail.req_params?.forEach((item) => {
    apiTitle = apiTitle.replace(paramString(item.name), "");
  });

  let pathPartList = apiTitle.split("/");
  apiTitle = "";
  pathPartList.forEach((item) => {
    // 提取剩余的名称, 去掉数字和斜杠
    let t = item.replace(/\.|\d|\/|\s/g, "");
    if (t !== "") {
      apiTitle += camelCase(t);
    }
  });

  // 然后再根据path+路径参数确定类型名称
  apiDetail.req_params.forEach((item) => {
    apiTitle += "By" + camelCase(item.name);
  });
  return apiTitle;
}

function paramString(param: string) {
  return "{" + param + "}";
}

export function camelCase(name: string) {
  return name[0].toUpperCase() + name.slice(1).toLowerCase();
}
