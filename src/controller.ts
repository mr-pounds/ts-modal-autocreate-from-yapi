/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:13:29
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-06 15:58:53
 */

import * as vscode from "vscode";
import { chooseYApiProject, chooseApis } from "./popup";
import { getWorkFolder, createUri, getApiTitle } from "./utils";
import yapiService from "./yapi";
import { parseToJson } from "./parser/parsetToJson";
import { parseToInterface } from "./parser/parseToInterface";
import { writeInterfaceToFile } from "./writer/writeInterfaceToFile";

export async function controller(args: any) {
  // 获取用户选择 yapi 的项目
  let chooseResult = await chooseYApiProject();
  if (chooseResult === undefined) {
    return;
  }
  const { host, token } = chooseResult;

  // 获取用户选择的接口
  const choosedAPiList = await chooseApis(host, token);

  //  判断在哪个路径生成文件
  // 如果 args 是 undefined，则生成到项目的根目录下，如果根目录不存在，就报错终止执行
  let targetDir = await getWorkFolder(args);
  if (targetDir === undefined) {
    vscode.window.showErrorMessage("Output Dir doesn't exist!");
    return;
  }
  // 公共模型文件的 uri
  const publicInterfaceUri = createUri(
    "publicInterface.types.ts",
    targetDir["fsPath"]
  );
  // 请求参数模型文件的 uri
  const inputBoInterfaceUri = createUri(
    "inputBoInterface.types.ts",
    targetDir["fsPath"]
  );
  // 响应参数模型文件的 uri
  const outputVoInterfaceUri = createUri(
    "outputVoInterface.types.ts",
    targetDir["fsPath"]
  );
  // 接口文件文件的 uri
  const serviceUri = createUri("services.ts", targetDir["fsPath"]);

  // 开始在后端执行
  await vscode.window.withProgress(
    {
      cancellable: false,
      location: vscode.ProgressLocation.Notification,
      title: "create YApi modal file",
    },
    (progress) => {
      return new Promise(async (resolve) => {
        // 启动进度条
        progress.report({
          increment: 0,
          message: "start to update interface...",
        });

        // 查询用户选择的接口,并将其全部转变为 json
        let apiDetailList: IApiInfo[] = new Array();
        for (var i = 0; i < choosedAPiList!.length; i++) {
          await yapiService
            .getApiDetail(host, token, choosedAPiList![i]._id)
            .then((data) => {
              if (data !== undefined) {
                apiDetailList.push(parseToJson(data));
                console.log(apiDetailList);
                return;
              } else {
                vscode.window.showErrorMessage(
                  `can not fetch ${choosedAPiList![i].title} data`
                );
                return;
              }
            });
        }
        // 根据 Json 抽取每个接口包含的 interface
        apiDetailList.forEach((item) => {
          parseToInterface(item);
        });
        // progress.report({
        //   increment: (index / choosedAPiList.length) * 70,
        //   message: `正在创建${api.title}相关模型及接口`,
        // });
        resolve(null);
        // 生成公共模型并返回
      });
    }
  );
}

function getAllApiDetail(choosedAPiList: IYapiApiBaseInfo[]) {}
