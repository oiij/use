<!-- eslint-disable no-console -->
<script setup lang="ts">
import { useSpline } from '@oiij/spline'
import { computed, ref, useTemplateRef } from 'vue'

const canvasRef = useTemplateRef('canvas-ref')

const scenes = {
  cube: 'https://prod.spline.design/6Wq1Q7YGyM-iab9i/scene.splinecode',
  sphere: 'https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode',
  torus: 'https://prod.spline.design/M-3-kF9j-bKChd2R/scene.splinecode',
}

const currentScene = ref('cube')
const sceneUrl = computed(() => scenes[currentScene.value as keyof typeof scenes])

const {
  app,
  isLoading,
  error,
  width,
  height,
  reload,
  dispose,
  onCreated,
  onLoaded,
  onError,
  onDisposed,
} = useSpline(canvasRef, {
  scene: sceneUrl,
})

onCreated((spline) => {
  console.log('Spline 实例已创建:', spline)
})

onLoaded((spline) => {
  console.log('场景加载完成:', spline)
})

onError((err) => {
  console.error('加载失败:', err)
})

onDisposed(() => {
  console.log('资源已清理')
})

function switchScene(scene: keyof typeof scenes) {
  currentScene.value = scene
}
</script>

<template>
  <div class="demo-container">
    <div class="controls">
      <h2>UseSpline 示例</h2>
      <div class="scene-selector">
        <button
          v-for="(url, name) in scenes"
          :key="name"
          :class="{ active: currentScene === name }"
          :disabled="isLoading"
          @click="switchScene(name)"
        >
          {{ name }}
        </button>
      </div>
      <div class="actions">
        <button :disabled="isLoading" @click="reload">
          {{ isLoading ? '加载中...' : '重新加载' }}
        </button>
        <button :disabled="!app" @click="dispose">
          销毁场景
        </button>
      </div>
      <div class="info">
        <p>容器尺寸: {{ width }} x {{ height }}</p>
        <p v-if="error" class="error">
          错误: {{ error.message }}
        </p>
      </div>
    </div>
    <div class="canvas-container">
      <div v-if="isLoading" class="loading-overlay">
        <div class="spinner" />
        <p>加载中...</p>
      </div>
      <div ref="canvas-ref" class="spline-canvas" />
    </div>
  </div>
</template>

<style scoped>
.demo-container {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.controls h2 {
  margin: 0;
  font-size: 24px;
  color: #333;
}

.scene-selector {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.scene-selector button {
  padding: 8px 16px;
  border: 2px solid #e0e0e0;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 14px;
}

.scene-selector button:hover:not(:disabled) {
  border-color: #4a90e2;
  color: #4a90e2;
}

.scene-selector button.active {
  background: #4a90e2;
  color: white;
  border-color: #4a90e2;
}

.scene-selector button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.actions {
  display: flex;
  gap: 10px;
}

.actions button {
  padding: 8px 16px;
  border: none;
  background: #4a90e2;
  color: white;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.2s;
  font-size: 14px;
}

.actions button:hover:not(:disabled) {
  background: #357abd;
}

.actions button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 5px;
  font-size: 14px;
  color: #666;
}

.info .error {
  color: #e74c3c;
}

.canvas-container {
  position: relative;
  width: 100%;
  height: 500px;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.loading-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  z-index: 10;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(74, 144, 226, 0.2);
  border-top-color: #4a90e2;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.spline-canvas {
  width: 100%;
  height: 100%;
}
</style>
