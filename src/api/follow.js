import request from '@/utils/request'

export function findPageFollow(data) {
  return request({
    url: '/follow/findPageFollow',
    method: 'post',
    data
  })
}
export function getAllFollow() {
  return request({
    url: '/follow/getAllFollow',
    method: 'get'
  })
}

export function uploadExcel(data) {
  return request({
    url: '/follow/importFollowFromExcel',
    headers: {'content-type': 'multipart/form-data'},
    method: 'post',
    data
  })
}

export function deleteFollow(data) {
  return request({
    url: '/follow/deleteFollow',
    method: 'post',
    data
  })
}

export function updateFollow(data) {
  return request({
    url: '/follow/updateFollow',
    method: 'post',
    data
  })
}

export function addFollow(data) {
  return request({
    url: '/follow/addFollow',
    method: 'post',
    data
  })
}
