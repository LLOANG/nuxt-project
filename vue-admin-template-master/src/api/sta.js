import request from '@/utils/request'

export default {
//生成统计数据
  createStatistics(day) {
    return request({
      url: '/staservice/statistics-daily/registerCount/'+day,
      method: 'post',
    })
  },

  getDataSta(searchObj) {
    return request({
      url: `/staservice/statistics-daily/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get',
    })
  }
}

