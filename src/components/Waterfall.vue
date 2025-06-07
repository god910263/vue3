<template>
  <div class="waterfall-container" ref="container">
    <div v-for="(item, index) in items" :key="index" class="waterfall-item">
      <div class="content">
        <div v-if="item.type === 'image'" class="image-wrapper">
          <img v-lazy="item.image" :src="item.image" alt="图片" />
        </div>
        <div v-else class="video-wrapper">
          <video :src="item.video" controls v-video-lazy v-video-autoplay autoplay muted loop class="video-player"></video>
        </div>
        <div class="text">{{ item.title }}</div>
      </div>
    </div>

    <div v-if="loading" class="loading">加载中...</div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import Masonry from 'masonry-layout'
import imagesLoaded from 'imagesloaded'
let masonryInstance = null
const initMasonry = () => {
  const containerEl = container.value
  if (!containerEl) return

  imagesLoaded(containerEl, () => {
    if (masonryInstance) {
      masonryInstance.reloadItems()
      masonryInstance.layout()
    } else {
      masonryInstance = new Masonry(containerEl, {
        itemSelector: '.waterfall-item',
        columnWidth: '.waterfall-item',
        percentPosition: true
      })
    }
  })
}
const props = defineProps({
  fetchData: {
    type: Function,
    required: true
  },
  pageSize: {
    type: Number,
    default: 6
  }
})
const container = ref(null)
const items = ref([])
const loading = ref(false)
const page = ref(1)
const hasMore = ref(true)

// 模拟获取数据
const loadMore = async () => {
  if (loading.value || !hasMore.value) return
  loading.value = true
  const newItems = await props.fetchData(page.value, props.pageSize)
  if (newItems.length === 0) hasMore.value = false
  items.value.push(...newItems)
  loading.value = false
  page.value++
  setTimeout(initMasonry, 100)
}
onMounted(() => {
    loadMore()
})

// 上拉加载更多  节流防止重复点击

let ticking = false

window.addEventListener('scroll', () => {
  if (!container.value || ticking) return
  const rect = container.value.getBoundingClientRect()
  if (rect.bottom <= window.innerHeight + 300) {
    loadMore()
    ticking = true
    requestAnimationFrame(() => {
      ticking = false
    })
  }
})
// 下拉刷新
let startY = 0
let isDragging = false

window.addEventListener('touchstart', (e) => {
  if (window.scrollY === 0) {
    startY = e.touches[0].clientY
    isDragging = true
  }
})

window.addEventListener('touchmove', (e) => {
  if (!isDragging) return
  const currentY = e.touches[0].clientY
  const diff = currentY - startY
  if (diff > 50) {
    refreshData()
    isDragging = false
  }
})

window.addEventListener('touchend', () => {
  isDragging = false
})

const refreshData = () => {
  items.value = []
  page.value = 1
  hasMore.value = true
  loadMore()
}
</script>

<style scoped>
.waterfall-container {
  display: block;
}

.waterfall-item {
  width: calc(50% - 8px); /* 移动端也保持两列 */
  margin-right: 8px;
  margin-bottom: 8px;
}
.waterfall-item:nth-child(even) {
  margin-right: 0;
}
.waterfall-item .content {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-bottom: 16px;
  transition: all 0.3s ease;
}

.image-wrapper img {
  width: 100%;
  height: auto;
  object-fit: cover;
}

.video-wrapper .video-player {
  width: 100%;
  height: auto;
  display: block;
}

.text {
  padding: 10px;
}
</style>