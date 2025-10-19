<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b">
      <div class="px-8 py-6">
        <h1 class="text-2xl font-bold text-gray-900">마이페이지</h1>
        <p class="text-gray-600 mt-1">계정 설정 및 채널 관리</p>
      </div>
    </div>

    <!-- 탭 네비게이션 -->
    <div class="bg-white border-b">
      <div class="px-8">
        <div class="flex space-x-8">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="handleTabChange(tab.id)"
            class="py-4 px-1 border-b-2 font-medium text-sm transition-colors"
            :class="
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            "
          >
            {{ tab.name }}
          </button>
        </div>
      </div>
    </div>

    <!-- 탭 컨텐츠 -->
    <div class="px-8 py-8">
      <!-- 채널 관리 탭 -->
      <div v-if="activeTab === 'channel'" class="max-w-4xl">
        <div class="bg-white rounded-lg shadow-sm border p-8 text-center">
          <div class="w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg class="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"/>
            </svg>
          </div>
          <h3 class="text-lg font-semibold mb-2 text-gray-900">채널 관리</h3>
          <p class="text-sm text-gray-500 mb-4">채널 관리 기능은 추후 업데이트 예정입니다.</p>
          <div class="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd"/>
            </svg>
            개발 중
          </div>
        </div>
      </div>

      <!-- 회원 수정 탭 -->
      <div v-if="activeTab === 'profile'" class="max-w-2xl">
        <div class="bg-white rounded-lg shadow-sm border">
          <!-- 프로필 사진 수정 -->
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">프로필 사진</h3>
            <div class="flex items-center space-x-4">
              <div class="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                <img
                  v-if="profileImage"
                  :src="profileImage"
                  alt="프로필 사진"
                  class="w-full h-full object-cover"
                />
                <svg
                  v-else
                  class="w-8 h-8 text-gray-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"/>
                </svg>
              </div>
              <div>
                <button
                  @click="selectProfileImage"
                  class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
                >
                  사진 변경
                </button>
                <p class="text-xs text-gray-500 mt-1">JPG, PNG 파일만 업로드 가능</p>
              </div>
            </div>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleImageUpload"
              class="hidden"
            />
          </div>

          <!-- 닉네임 수정 -->
          <div class="p-6 border-b border-gray-200">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">닉네임</h3>
            <div class="max-w-md">
              <input
                v-model="username"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="닉네임을 입력하세요"
              />
              <p class="text-xs text-gray-500 mt-1">2-20자 사이로 입력해주세요</p>
            </div>
          </div>

          <!-- 비밀번호 변경 -->
          <div class="p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">비밀번호 변경</h3>
            <div class="space-y-4 max-w-md">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">현재 비밀번호</label>
                <input
                  v-model="currentPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input
                  v-model="newPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
            </div>
          </div>

          <!-- 저장 버튼 -->
          <div class="p-6 bg-gray-50 rounded-b-lg">
            <div class="flex justify-end space-x-3">
              <button
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                @click="saveChanges"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const { currentUser } = useAuth();
const route = useRoute();

// 탭 관리
const tabs = [
  { id: 'channel', name: '채널 관리' },
  { id: 'profile', name: '회원 수정' }
];

const activeTab = ref('profile');

// 쿼리 파라미터에서 탭 설정
onMounted(() => {
  const tabParam = route.query.tab as string;
  if (tabParam && tabs.some(tab => tab.id === tabParam)) {
    activeTab.value = tabParam;
  }
});

function handleTabChange(tabId: string) {
  activeTab.value = tabId;
}

// 프로필 수정 관련
const username = ref(currentUser.value?.username || '');
const profileImage = ref<string | null>(null);
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

function selectProfileImage() {
  fileInput.value?.click();
}

function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      profileImage.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
}

function resetForm() {
  username.value = currentUser.value?.username || '';
  profileImage.value = null;
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
}

function saveChanges() {
  // TODO: 실제 API 호출로 변경
  console.log('프로필 수정 저장:', {
    username: username.value,
    profileImage: profileImage.value,
    passwordChange: {
      current: currentPassword.value,
      new: newPassword.value,
      confirm: confirmPassword.value
    }
  });
  
  // 임시로 성공 메시지 표시
  alert('변경사항이 저장되었습니다.');
}
</script>
