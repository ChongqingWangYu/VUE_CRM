import request from '@/utils/request'

export function findPageContact(data) {
  return request({
    url: '/contact/findPageContact',
    method: 'post',
    data
  })
}
export function getAllContact() {
  return request({
    url: '/contact/getAllContact',
    method: 'get'
  })
}

export function uploadExcel(data) {
  return request({
    url: '/contact/importContactFromExcel',
    headers: {'content-type': 'multipart/form-data'},
    method: 'post',
    data
  })
}

export function findContactByCusID(data) {
  return request({
    url: '/contact/findContactByCusID',
    method: 'post',
    data
  })
}

export function deleteContact(data) {
  return request({
    url: '/contact/deleteContact',
    method: 'post',
    data
  })
}

export function updateContact(data) {
  return request({
    url: '/contact/updateContact',
    method: 'post',
    data
  })
}

export function addContact(data) {
  return request({
    url: '/contact/addContact',
    method: 'post',
    data
  })
}
