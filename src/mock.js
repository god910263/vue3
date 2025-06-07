import Mock from 'mockjs'

// 模拟数据接口
Mock.mock('/api/posts', 'post', () => {
    
  return {
    code: 200,
    message: 'success',
    data: Mock.mock({
      'list|10': [
        {
          'id|+1': 1,
          type: '@pick(["image", "video"])',// 随机类型
          title: '@ctitle(8, 20)',
          width: '@integer(300, 600)',     // 宽度随机
          height: '@integer(200, 800)',    // 高度随机
          image: '@image("600x400", "#4A7856", "#FFF", "pic")',
          video: 'https://www.w3schools.com/html/mov_bbb.mp4' // 固定视频源或随机
        }
      ]
    }).list
  }
})