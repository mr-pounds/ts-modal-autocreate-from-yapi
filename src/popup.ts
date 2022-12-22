/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 21:10:52
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-22 13:29:25
 */
import * as vscode from "vscode";
import { configuration } from "./utils";
import {
  hostInputBox,
  tokenInputBox,
  titleInputBox,
} from "./components/inputbox";
import yapiService from "./yapi";

function _excuteInputBox(func: IinputBoxFunction): Promise<string> | undefined {
  return func()?.then((value) => value);
}

/**
 * @description : 新增 YApi 的项目信息并直接使用
 * @return      正常情况返回 {host, token}。若是中断输入动作，则返回 undefined
 */
export async function addYApiProject() {
  // 获取新的url及token，并添加到配置中
  let host = await _excuteInputBox(hostInputBox);
  if (host === undefined) {
    return;
  }
  let token = await _excuteInputBox(tokenInputBox);
  if (token === undefined) {
    return;
  }
  let title = await await _excuteInputBox(titleInputBox);
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
 * @description : 让用户选择 yapi 的项目，若是配置中没有项目，则直接让用户新增项目。
 * @return
 */
export async function chooseYApiProject() {
  // 获取配置
  const yapiProjectList = configuration.yapiProjectList();

  // 若配置中，没有有效的配置数据，就直接新增项目
  if (yapiProjectList === undefined || yapiProjectList.length === 0) {
    return await addYApiProject();
  }

  // 展示所有的项目及新增项目选项
  const newProjectPlaceHolder = ">> New YApi Project <<";
  let yapiProjectTitleList = yapiProjectList.map((item) => item.title);
  yapiProjectTitleList.push(newProjectPlaceHolder);
  return await vscode.window
    .showQuickPick(yapiProjectTitleList!, {
      ignoreFocusOut: true,
    })
    .then(async (value) => {
      // 中断输入，则返回 undefined
      if (value === undefined) {
        return;
      }
      // 选择新增项目
      if (value === newProjectPlaceHolder) {
        return await addYApiProject();
      }
      // 找到对应的 yapiProject
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
  let apiList = await yapiService.getApiList(host, token);
  if (apiList === undefined) {
    return;
  }
  // 让用户选择接口，支持多选。
  let choosedList = await vscode.window
    .showQuickPick(
      apiList.map((item) => item.title),
      {
        canPickMany: true,
        ignoreFocusOut: true,
      }
    )
    .then((values) => values);
  // 中断输入
  if (choosedList === undefined) {
    return;
  }

  // 匹配选中的接口
  const choosedAPiList: IYapiApiBaseInfo[] = [];
  apiList?.forEach((item) => {
    if (choosedList?.includes(item.title)) {
      choosedAPiList.push(item);
    }
  });
  return choosedAPiList;
}
