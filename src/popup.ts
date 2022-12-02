/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 21:10:52
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-02 15:51:57
 */
import * as vscode from "vscode";
import { configuration } from "./utils";
import {
  hostInputBox,
  tokenInputBox,
  titleInputBox,
} from "./components/inputbox";
import yapiServices from "./yapi";

/**
 * @description : 新增 YApi 的项目信息并直接使用
 * @return      正常情况返回 {host, token}。若是中断输入动作，则返回 undefined
 */
export async function addYApiProject() {
  // 获取新的url及token，并添加到配置中
  let host = await hostInputBox().then((newHost) => {
    return newHost;
  });
  if (host === undefined) {
    return;
  }
  let token = await tokenInputBox().then((newToken) => {
    return newToken;
  });
  if (token === undefined) {
    return;
  }
  let title = await titleInputBox().then((newTitle) => {
    return newTitle;
  });
  if (title === undefined) {
    return;
  }
  //  更新配置
  let oldProjectList = configuration.yapiProjectList();
  oldProjectList?.push({
    host,
    token,
    title,
  });
  configuration.updateYapiProjectList(oldProjectList!);
  return {
    host,
    token,
  };
}

/**
 * @description :
 * @return       {*}
 */
export async function chooseYApiProject() {
  const newProjectPlaceHolder = "New YApi Project";
  const yapiProjectList = configuration.yapiProjectList();
  // 先选择项目
  let projectTitleList = yapiProjectList?.map((item) => item.title);
  if (projectTitleList?.length === 0) {
    return await addYApiProject().then((item) => item);
  }
  projectTitleList?.push(newProjectPlaceHolder);
  return await vscode.window
    .showQuickPick(projectTitleList as readonly string[])
    .then(async (value) => {
      if (value === undefined) {
        return;
      }
      if (value === newProjectPlaceHolder) {
        return await addYApiProject().then((item) => item);
      }
      let result = undefined;
      yapiProjectList?.forEach((item) => {
        if (item.title === value) {
          result = {
            host: item.host,
            token: item.token,
          };
        }
      });
      return result;
    });
}

export async function chooseApis(host: string, token: string) {
  let apiList = await yapiServices.getApiList(host, token);
  if (apiList === undefined) {
    return;
  }
  let choosedList = await vscode.window
    .showQuickPick(apiList?.map((item) => item.title) as readonly string[], {
      canPickMany: true,
    })
    .then((values) => values);
  if (choosedList === undefined) {
    return;
  }
  const choosedAPiList: IApi[] = [];
  apiList?.forEach((item) => {
    if (choosedList?.includes(item.title)) {
      choosedAPiList.push(item);
    }
  });
  return choosedAPiList;
}
