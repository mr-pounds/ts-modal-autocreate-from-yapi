/*
 * @Name         :
 * @Version      : 1.0.1
 * @Author       : zzz
 * @Date         : 2022-11-29 15:18:00
 * @LastEditors  : zzz
 * @LastEditTime : 2022-11-29 19:01:07
 */
import axios from "axios";

const yapiRequests = {
  getBaseInfo(url: string, token: string) {
    return axios
      .get(url, {
        params: {
          token,
        },
      })
      .then((data) => {
        console.log(data);
      })
      .catch(() => {});
  },
};

export default yapiRequests;
