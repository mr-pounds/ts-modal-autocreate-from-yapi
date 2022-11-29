/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:13:29
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-29 19:36:42
 */
import * as vscode from "vscode";
import configuration from "./utils/configuration";
import {
  hostInputBox,
  tokenInputBox,
  titleInputBox,
} from "./components/inputbox";

export async function fetcher(args: any) {
  // 读取vscode的配置项
  const { host, token } = await chooseYApiProject();

  //  执行下一步动作

  //  判断在哪个路径生成文件
  // 如果 args 是 undefined，则生成到项目的根目录下，如果根目录不存在，就报错终止执行
}

async function addYApiProject() {
  // 获取新的url及token，并添加到配置中
  let host = "";
  await hostInputBox().then((newHost) => {
    host = newHost;
  });
  let token = "";
  await tokenInputBox().then((newToken) => {
    token = newToken;
  });

  let title = "";
  await titleInputBox().then((newTitle) => {
    title = newTitle;
  });
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

function chooseYApiProject() {
  const newProjectPlaceHolder = "New YApi Project";
  return new Promise<IChooseYApiProjectResponse>((resolve) => {
    const yapiProjectList = configuration.yapiProjectList();
    // 先选择项目
    let projectTitleList = yapiProjectList?.map((item) => {
      return item.title;
    });
    if (projectTitleList?.length === 0) {
      addYApiProject().then((item) => {
        resolve(item);
      });
    }
    projectTitleList?.push(newProjectPlaceHolder);
    vscode.window
      .showQuickPick(projectTitleList as readonly string[])
      .then((value) => {
        if (value === newProjectPlaceHolder) {
          addYApiProject().then((item) => {
            resolve(item);
          });
        }
        yapiProjectList?.forEach((item) => {
          if (item.title === value) {
            resolve({
              host: item.host,
              token: item.token,
            });
          }
        });
      });
  });
}
