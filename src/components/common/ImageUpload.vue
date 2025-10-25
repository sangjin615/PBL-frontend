<template>
  <div class="space-y-4">
    <!-- 파일 업로드 영역 -->
    <div 
      @click="triggerFileInput"
      @dragover.prevent
      @drop.prevent="handleDrop"
      class="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
      :class="{ 'border-blue-400 bg-blue-50': isDragOver }"
    >
      <input
        ref="fileInput"
        type="file"
        multiple
        accept="image/*"
        @change="handleFileSelect"
        class="hidden"
      />
      
      <div class="space-y-2">
        <svg class="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
          <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        <div class="text-sm text-gray-600">
          <span class="font-medium text-blue-600 hover:text-blue-500">클릭하여 파일을 선택</span>
          또는 드래그하여 놓기
        </div>
        <p class="text-xs text-gray-500">
          PNG, JPG, GIF 파일만 업로드 가능 (최대 {{ maxFileSize }}MB)
        </p>
      </div>
    </div>

    <!-- 업로드된 이미지 목록 -->
    <div v-if="files.length > 0" class="space-y-3">
      <h4 class="text-sm font-medium text-gray-700">첨부된 이미지 ({{ files.length }}/{{ maxFiles }})</h4>
      
      <div class="grid grid-cols-2 md:grid-cols-3 gap-3">
        <div
          v-for="(file, index) in files"
          :key="index"
          class="relative group"
        >
          <!-- 이미지 미리보기 -->
          <div class="aspect-square rounded-lg overflow-hidden bg-gray-100">
            <img
              :src="file.preview"
              :alt="file.name"
              class="w-full h-full object-cover"
            />
          </div>
          
          <!-- 파일 정보 -->
          <div class="mt-1 text-xs text-gray-500 truncate">
            {{ file.name }}
          </div>
          
          <!-- 삭제 버튼 -->
          <button
            @click="removeFile(index)"
            class="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
          >
            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- 에러 메시지 -->
    <div v-if="error" class="text-red-500 text-sm">
      {{ error }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';

interface FileWithPreview {
  file: File;
  name: string;
  size: number;
  preview: string;
}

interface Props {
  maxFiles?: number;
  maxFileSize?: number; // MB
}

interface Emits {
  (e: 'update:files', files: File[]): void;
}

const props = withDefaults(defineProps<Props>(), {
  maxFiles: 5,
  maxFileSize: 5
});

const emit = defineEmits<Emits>();

const fileInput = ref<HTMLInputElement>();
const files = ref<FileWithPreview[]>([]);
const isDragOver = ref(false);
const error = ref('');

// 파일 입력 트리거
function triggerFileInput() {
  fileInput.value?.click();
}

// 드래그 오버 처리
function handleDragOver(event: DragEvent) {
  isDragOver.value = true;
}

// 드롭 처리
function handleDrop(event: DragEvent) {
  isDragOver.value = false;
  const droppedFiles = Array.from(event.dataTransfer?.files || []);
  processFiles(droppedFiles);
}

// 파일 선택 처리
function handleFileSelect(event: Event) {
  const target = event.target as HTMLInputElement;
  const selectedFiles = Array.from(target.files || []);
  processFiles(selectedFiles);
}

// 파일 처리
function processFiles(newFiles: File[]) {
  error.value = '';
  
  // 파일 개수 체크
  if (files.value.length + newFiles.length > props.maxFiles) {
    error.value = `최대 ${props.maxFiles}개까지 업로드할 수 있습니다.`;
    return;
  }

  // 각 파일 검증 및 처리
  for (const file of newFiles) {
    // 파일 타입 체크
    if (!file.type.startsWith('image/')) {
      error.value = '이미지 파일만 업로드할 수 있습니다.';
      continue;
    }

    // 파일 크기 체크
    if (file.size > props.maxFileSize * 1024 * 1024) {
      error.value = `파일 크기는 ${props.maxFileSize}MB를 초과할 수 없습니다.`;
      continue;
    }

    // 중복 파일 체크
    if (files.value.some(f => f.name === file.name && f.size === file.size)) {
      error.value = '이미 업로드된 파일입니다.';
      continue;
    }

    // 파일 추가
    const fileWithPreview: FileWithPreview = {
      file,
      name: file.name,
      size: file.size,
      preview: URL.createObjectURL(file)
    };

    files.value.push(fileWithPreview);
  }

  // 부모 컴포넌트에 파일 목록 전달
  emit('update:files', files.value.map(f => f.file));
}

// 파일 제거
function removeFile(index: number) {
  const removedFile = files.value[index];
  
  // 미리보기 URL 해제
  URL.revokeObjectURL(removedFile.preview);
  
  // 파일 목록에서 제거
  files.value.splice(index, 1);
  
  // 부모 컴포넌트에 업데이트된 파일 목록 전달
  emit('update:files', files.value.map(f => f.file));
}

// 컴포넌트 언마운트 시 URL 정리
function cleanup() {
  files.value.forEach(file => {
    URL.revokeObjectURL(file.preview);
  });
}

// 컴포넌트 언마운트 시 정리
import { onUnmounted } from 'vue';
onUnmounted(cleanup);
</script>
