/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-12-02 15:44:13
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 15:51:17
 */
import * as vscode from "vscode";
import { dirname } from "path";
import { join } from "path";

async function getDir(args: vscode.Uri) {
  return await vscode.workspace.fs.stat(args).then((stats) => {
    if (stats.type === 1) {
      return createUri(dirname(args["fsPath"]));
    } else {
      return args;
    }
  });
}

export async function getWorkFolder(args: any) {
  if (args !== undefined) {
    return await getDir(args);
  }

  const folders = vscode.workspace.workspaceFolders;
  if (folders === undefined) {
    return;
  }
  let rootFolder = folders[0];
  return rootFolder.uri;
}

export function createUri(path: string, dir?: string) {
  if (dir !== undefined) {
    return vscode.Uri.from({
      scheme: "file",
      path: join(dir, path),
    });
  }
  return vscode.Uri.from({
    scheme: "file",
    path,
  });
}

export function getApiTitle(apiDetail: IApiDetail) {
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

function validateProject(project: any) {
  if (project.title && project.token && project.host) {
    return true;
  }
  return false;
}

export const configuration = {
  yapiProjectList() {
    let result: IYApiProjectConfiguration[] = [];
    vscode.workspace
      .getConfiguration()
      .get<IYApiProjectConfiguration[]>(
        "ts-modal-autocreate-from-yapi.yapiProjectTokenList"
      )
      ?.forEach((project) => {
        if (validateProject(project)) {
          result.push(project);
        }
      });
    return result;
  },
  updateYapiProjectList(items: IYApiProjectConfiguration[]) {
    vscode.workspace
      .getConfiguration()
      .update("ts-modal-autocreate-from-yapi.yapiProjectTokenList", items);
  },
};
