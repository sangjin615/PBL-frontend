<template>
  <div class="markdown-editor-container">
    <h3 class="text-lg font-semibold mb-4">마크다운 강의 내용</h3>

    <div class="border border-gray-300 rounded-lg overflow-hidden">
      <MdEditor
        v-model="localContent"
        :theme="theme"
        :toolbars="toolbars"
        :height="600"
        placeholder="마크다운으로 강의 내용을 작성하세요..."
        @on-upload-img="onUploadImg"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { MdEditor, type Themes, type ToolbarNames } from 'md-editor-v3-ko'
import 'md-editor-v3-ko/lib/style.css'
import { s3ApiService, S3ApiService } from '@/services/s3Api'

interface Props {
  modelValue: string
  theme?: Themes
}

interface Emits {
  (e: 'update:modelValue', value: string): void
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'light'
})

const emit = defineEmits<Emits>()

const localContent = ref(props.modelValue)

// 양방향 바인딩
watch(localContent, (newValue) => {
  emit('update:modelValue', newValue)
})

watch(() => props.modelValue, (newValue) => {
  localContent.value = newValue
})

// 툴바 설정
const toolbars: ToolbarNames[] = [
  'bold', 'underline', 'italic', 'strikeThrough', 'sub', 'sup',
  'quote', 'unorderedList', 'orderedList', 'task', 'codeRow', 'code',
  'link', 'image', 'table', 'mermaid', 'katex', 'revoke', 'next',
  'save', 'pageFullscreen', 'fullscreen', 'preview', 'htmlPreview'
]

// 이미지 업로드
async function onUploadImg(files: File[], callback: (urls: string[]) => void) {
  try {
    console.log('이미지 업로드 시작:', files)

    // 모든 파일을 병렬로 업로드
    const uploadPromises = files.map(async (file) => {
      // 파일 유효성 검사
      const validation = S3ApiService.validateImageFile(file)
      if (!validation.isValid) {
        console.error('이미지 유효성 검사 실패:', validation.error)
        alert(validation.error)
        return null
      }

      try {
        // S3에 이미지 업로드
        const response = await s3ApiService.uploadImage(file, 'lectures')
        console.log('이미지 업로드 성공:', response)
        return response.imageUrl
      } catch (error) {
        console.error('이미지 업로드 실패:', error)
        alert(`이미지 업로드 실패: ${file.name}`)
        return null
      }
    })

    // 모든 업로드 완료 대기
    const uploadedUrls = await Promise.all(uploadPromises)

    // null이 아닌 URL만 필터링
    const validUrls = uploadedUrls.filter((url): url is string => url !== null)

    // 마크다운 에디터에 URL 전달
    callback(validUrls)

    console.log('모든 이미지 업로드 완료:', validUrls)
  } catch (error) {
    console.error('이미지 업로드 중 오류 발생:', error)
    alert('이미지 업로드 중 오류가 발생했습니다.')
    callback([])
  }
}
</script>

<style scoped>
.markdown-editor-container {
  width: 100%;
}
</style>
