<template>
  <div class="discover-page">
    <h1>发现</h1>
    <Waterfall :fetch-data="fetchData" :page-size="10" />
  </div>
</template>

<script setup>
import axios from 'axios' 
import Waterfall from '@/components/Waterfall.vue'
import { ref } from 'vue'
// 模拟数据源
const getUrlParam = (key) => {
  const search = window.location.search || window.location.hash.split('?')[1] || ''
  const params = new URLSearchParams(search)
  return params.get(key)
}
const mockData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  image: `https://picsum.photos/300/${200 + Math.floor(Math.random() * 100)}`,
  title: `内容 ${i + 1}`
}))
// 根据 URL 参数模拟不同数据源
const fetchData = (page, pageSize) => {
  const type = getUrlParam('type') || 'all' // 支持 ?type=image 或 ?type=video

  return new Promise((resolve) => {
    setTimeout(() => {
      const data = Array.from({ length: pageSize }, (_, i) => {
        const id = (page - 1) * pageSize + i + 1
        const isImage = type === 'image' || (type === 'all' && Math.random() > 0.5)
        const isVideo = type === 'video' || (type === 'all' && !isImage)

        return {
          id,
          type: isImage ? 'image' : 'video',
          title: isImage ? `图片内容 ${id}` : `视频内容 ${id}`,
          image: `https://picsum.photos/300/${200 + Math.floor(Math.random() * 100)}`,
          video: 'https://www.w3schools.com/html/mov_bbb.mp4',
          height: 200 + Math.floor(Math.random() * 300)
        }
      })
      resolve(data)
    }, 500)
  })
}
// const fetchData = (page, pageSize) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       const data = Array.from({ length: pageSize }, (_, i) => ({
//         id: (page - 1) * pageSize + i + 1,
//         type: Math.random() > 0.5 ? 'image' : 'video',
//         title: `视频 ${(page - 1) * pageSize + i + 1}`,
//         image: `https://picsum.photos/300/${200 + Math.floor(Math.random() * 100)}`,
//         video: 'https://www.w3schools.com/html/mov_bbb.mp4',
//         height: 200 + Math.floor(Math.random() * 300)
//       }))
//       resolve(data)
//     }, 500)
//   })
// }
</script>

<style scoped>
.discover-page {
  padding: 20px;
}
</style>