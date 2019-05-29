import request from "@/utils/request"

export function registerUser(params) {
  return request({
    url: '/user/registerUser',
    method: 'get',
    params
  });
}
