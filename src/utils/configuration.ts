/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 16:48:58
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-29 16:54:50
 */
import * as vscode from "vscode";

const configuration = {
  yapiProjectList() {
    return vscode.workspace
      .getConfiguration()
      .get<IYApiProjectConfiguration[]>(
        "ts-modal-autocreate-from-yapi.yapiProjectTokenList"
      );
  },
  updateYapiProjectList(items: IYApiProjectConfiguration[]) {
    vscode.workspace
      .getConfiguration()
      .update("ts-modal-autocreate-from-yapi.yapiProjectTokenList", items);
  },
};

export default configuration;
