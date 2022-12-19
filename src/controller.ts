/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:13:29
 * @LastEditors  : zzz
 * @LastEditTime : 2022-12-19 14:57:46
 */

import * as vscode from "vscode";
import { chooseYApiProject, chooseApis } from "./popup";
import { getWorkFolder, createUri } from "./utils";
import yapiService from "./yapi";
import { parseToJson } from "./parser/parsetToJson";
import { parseToInterface } from "./parser/parseToInterface";
import { writeInterfaceToFile } from "./writer/writeInterfaceToFile";
import { writerApiToFile } from "./writer/writeApiToFile";

export async function controller(args: any) {
  // 获取用户选择 yapi 的项目
  let chooseResult = await chooseYApiProject();
  if (chooseResult === undefined) {
    return;
  }
  const { host, token } = chooseResult;

  // 获取用户选择的接口
  const choosedAPiList = await chooseApis(host, token);
  if (choosedAPiList === undefined) {
    return;
  }

  //  判断在哪个路径生成文件
  // 如果 args 是 undefined，则生成到项目的根目录下，如果根目录不存在，就报错终止执行
  let targetDir = await getWorkFolder(args);
  if (targetDir === undefined) {
    vscode.window.showErrorMessage("Output Dir doesn't exist!");
    return;
  }
  // 公共模型文件的 uri
  const publicInterfaceUri = createUri("public.types.ts", targetDir["fsPath"]);
  // 请求参数模型文件的 uri
  const inputBoInterfaceUri = createUri(
    "inputBo.types.ts",
    targetDir["fsPath"]
  );
  // 响应参数模型文件的 uri
  const outputVoInterfaceUri = createUri(
    "outputVo.types.ts",
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
                return;
              } else {
                vscode.window.showErrorMessage(
                  `can not fetch ${choosedAPiList![i].title} data`
                );
                return;
              }
            });
          progress.report({
            increment: (i / choosedAPiList!.length) * 40,
            message: `正在抓取 yapi 的数据`,
          });
        }

        // 根据 Json 抽取每个接口包含的 interface
        progress.report({
          increment: 41,
          message: `正在解析 yapi 的数据`,
        });
        let apiDetailStructList = apiDetailList.map((item) => {
          return parseToInterface(item);
        });
        progress.report({
          increment: 50,
          message: `yapi 的数据解析完成`,
        });

        progress.report({
          increment: 51,
          message: `正在提取模型数据`,
        });
        let publicInterfaceList: IinterfaceStruct[] = [];
        let inputBoInterfaceList: IinterfaceStruct[] = [];
        let inputBoDependPublicInterfaceList: string[] = [];
        let outputVoInterfaceList: IinterfaceStruct[] = [];
        let outputVoDependPublicInterfaceList: string[] = [];
        // 将 api 数据分解到每个文件里
        apiDetailStructList.forEach((aApiDetailStruct) => {
          // 将 isPublic 为 true 的模型添加到 publicInterfaceList
          aApiDetailStruct.apiBodyJsonDepend?.forEach((aItem) => {
            if (aItem.isPublic) {
              publicInterfaceList.push(aItem);
            }
          });
          aApiDetailStruct.apiResponseDepend?.forEach((aItem) => {
            if (aItem.isPublic) {
              publicInterfaceList.push(aItem);
            }
          });

          // 将输入参数的模型添加到 inputBoInterfaceList
          if (aApiDetailStruct.apiQuery !== undefined) {
            inputBoInterfaceList.push(aApiDetailStruct.apiQuery);
          }
          if (aApiDetailStruct.apiBodyForm !== undefined) {
            inputBoInterfaceList.push(aApiDetailStruct.apiBodyForm);
          }
          aApiDetailStruct.apiBodyJsonDepend?.forEach((aItem) => {
            if (!aItem.isPublic) {
              inputBoInterfaceList.push(aItem);
            } else {
              inputBoDependPublicInterfaceList.push(aItem.name);
            }
          });

          // 将输出参数的模型添加到 outputVoInterfaceList
          aApiDetailStruct.apiResponseDepend?.forEach((aItem) => {
            if (!aItem.isPublic) {
              outputVoInterfaceList.push(aItem);
            } else {
              outputVoDependPublicInterfaceList.push(aItem.name);
            }
          });
        });
        progress.report({
          increment: 60,
          message: `模型提取完成`,
        });

        // 开始生成公共模型
        progress.report({
          increment: 61,
          message: `正在生成公共模型`,
        });
        await writeInterfaceToFile(publicInterfaceUri, publicInterfaceList);

        // 开始生成输入参数模型
        progress.report({
          increment: 70,
          message: `正在生成输入参数的模型`,
        });
        await writeInterfaceToFile(
          inputBoInterfaceUri,
          inputBoInterfaceList,
          inputBoDependPublicInterfaceList
        );

        // 开始生成输出参数模型
        progress.report({
          increment: 80,
          message: `正在生成输出参数的模型`,
        });
        await writeInterfaceToFile(
          outputVoInterfaceUri,
          outputVoInterfaceList,
          outputVoDependPublicInterfaceList
        );

        // 开始生成service
        progress.report({
          increment: 90,
          message: `正在生成service文件`,
        });
        await writerApiToFile(serviceUri, apiDetailStructList);
        resolve(null);
      });
    }
  );
  return;
}
