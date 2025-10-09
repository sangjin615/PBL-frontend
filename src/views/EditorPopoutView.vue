<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <!-- 헤더 -->
    <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
      <div class="flex items-center space-x-3">
        <h1 class="text-lg font-semibold">팝아웃 에디터</h1>
        <span class="text-sm text-gray-500">레슨 ID: {{ lessonId }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <select
          v-model="selectedLanguage"
          @change="onChangeLanguage"
          class="px-3 py-1 border rounded text-sm"
        >
          <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
            {{ lang.name }}
          </option>
        </select>
        <button
          @click="windowClose"
          class="px-3 py-1 border rounded text-sm hover:bg-gray-50"
        >
          닫기
        </button>
      </div>
    </div>

    <!-- 에디터 -->
    <div class="flex-1 p-4 h-[calc(100vh-56px)]">
      <MonacoEditor
        v-if="isEditorReady"
        ref="monacoEditorRef"
        :key="editorConfig.languageId"
        :config="editorConfig"
        class="w-full h-full border rounded-lg"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <div class="text-gray-500">에디터 준비 중...</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import MonacoEditor from '../components/editor/MonacoEditor.vue'
import { languageApiService } from '../services/languageApi'
import type { MonacoEditorConfig } from '../services/extendedClient'

const route = useRoute()
const lessonId = route.params.lessonId as string

const monacoEditorRef = ref<any>(null)
const isEditorReady = ref(false)
const selectedLanguage = ref(71)
const supportedLanguages = ref<Array<{id: number, name: string}>>([])
const editorConfig = ref<MonacoEditorConfig>(
  languageApiService.createEditorConfig(selectedLanguage.value, '')
)

const loadLanguages = async () => {
  try {
    const langs = await languageApiService.getLanguages()
    supportedLanguages.value = (langs || []).map(l => ({ id: l.id, name: `${l.name}${l.version ? ' ' + l.version : ''}` }))
    if (!supportedLanguages.value.length) {
      // 빈 배열이면 기본 언어 목록로 대체
      const fallback = await languageApiService.getPopularLanguages()
      supportedLanguages.value = fallback.map(l => ({ id: l.id, name: `${l.name}${l.version ? ' ' + l.version : ''}` }))
    }
  } catch (e) {
    console.warn('언어 목록을 불러오지 못했습니다.', e)
    const fallback = await languageApiService.getPopularLanguages().catch(() => [])
    supportedLanguages.value = fallback.map((l: any) => ({ id: l.id, name: `${l.name}${l.version ? ' ' + l.version : ''}` }))
  }
}

const onChangeLanguage = () => {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || ''
  editorConfig.value = languageApiService.createEditorConfig(selectedLanguage.value, currentCode)
}

const windowClose = () => {
  window.close()
}

onMounted(async () => {
  await loadLanguages()
  isEditorReady.value = true
})
</script>

<style scoped>
</style>


