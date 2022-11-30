/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 16:48:58
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-30 11:01:35
 */
import * as vscode from "vscode";

function validateProject(project: any) {
  if (project.title && project.token && project.host) {
    return true;
  }
  return false;
}

const configuration = {
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

export default configuration;
