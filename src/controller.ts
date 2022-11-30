/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:13:29
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-30 17:13:58
 */

import * as vscode from "vscode";
import { chooseYApiProject, chooseApis } from "./popup";
import { getWorkFolder } from "./utils/getWorkFolder";

export async function fetcher(args: any) {
  // 读取vscode的配置项
  let chooseResult = await chooseYApiProject();
  if (!chooseResult) {
    return;
  }
  const { host, token } = chooseResult;

  // 获取用户选择的接口
  const choosedAPiList = await chooseApis(host, token);

  //  判断在哪个路径生成文件
  // 如果 args 是 undefined，则生成到项目的根目录下，如果根目录不存在，就报错终止执行
  let targetDir = getWorkFolder(args);
  if (targetDir === undefined) {
    vscode.window.showErrorMessage("Output Dir doesn't exist!");
    return;
  }

  // 开始在后端执行
  await vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title: "create YApi modal file",
    },
    (progress) => {
      // 先校验是否存在对应的文件，不存在便创建；
      progress.report({
        increment: 1,
        message: "正在创建ts文件",
      });

      choosedAPiList?.forEach(async (api, index) => {
        // 获取接口数据
        // 生成接口请求参数的模型并返回
        // 生成公共模型并返回
        // 生成响应参数的模型并返回
        // 生成接口
        progress.report({
          increment: (index / choosedAPiList.length) * 100,
          message: `正在创建${api.title}相关模型及接口`,
        });
      });
      // 获取需要生成模型的接口数据，按接口顺序执行，获取一个生成一个。
      return new Promise(async (resolve) => resolve(null));
    }
  );
}
