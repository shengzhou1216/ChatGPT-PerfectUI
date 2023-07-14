import { get } from '@/utils/request'

export const getList = (data?: any) => {
  return get({
    url: '/projects',
    data,
  })
}
