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
              <div class="flex flex-col space-y-2">
                <div class="flex space-x-2">
                  <button
                    @click="selectProfileImage"
                    :disabled="isUploadingImage"
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isUploadingImage ? '업로드 중...' : '사진 변경' }}
                  </button>
                  <button
                    v-if="profileImageUrl"
                    @click="deleteProfileImage"
                    :disabled="isDeletingImage"
                    class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {{ isDeletingImage ? '삭제 중...' : '삭제' }}
                  </button>
                </div>
                <p v-if="imageError" class="text-xs text-red-600">
                  {{ imageError }}
                </p>
                <p v-else class="text-xs text-gray-500">
                  JPEG, PNG, GIF, WEBP, BMP (최대 10MB)
                </p>
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
                :class="[
                  'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent',
                  usernameError
                    ? 'border-red-500 focus:ring-red-500'
                    : 'border-gray-300 focus:ring-blue-500'
                ]"
                placeholder="닉네임을 입력하세요"
              />
              <p v-if="usernameError" class="text-xs text-red-600 mt-1">
                {{ usernameError }}
              </p>
              <p v-else class="text-xs text-gray-500 mt-1">
                2자 이상 50자 이하로 입력해주세요
              </p>
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
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent',
                    passwordError && passwordError.includes('현재 비밀번호')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  ]"
                  placeholder="현재 비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호</label>
                <input
                  v-model="newPassword"
                  type="password"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent',
                    passwordError && (passwordError.includes('새 비밀번호') || passwordError.includes('비밀번호는'))
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  ]"
                  placeholder="새 비밀번호를 입력하세요"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">새 비밀번호 확인</label>
                <input
                  v-model="confirmPassword"
                  type="password"
                  :class="[
                    'w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent',
                    passwordError && passwordError.includes('일치')
                      ? 'border-red-500 focus:ring-red-500'
                      : 'border-gray-300 focus:ring-blue-500'
                  ]"
                  placeholder="새 비밀번호를 다시 입력하세요"
                />
              </div>
              <p v-if="passwordError" class="text-xs text-red-600">
                {{ passwordError }}
              </p>
              <p v-else class="text-xs text-gray-500">
                6자 이상 50자 이하로 입력해주세요
              </p>
            </div>
          </div>

          <!-- 저장 버튼 -->
          <div class="p-6 bg-gray-50 rounded-b-lg">
            <div class="flex justify-end space-x-3">
              <button
                @click="resetForm"
                class="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
                :disabled="isSaving"
              >
                취소
              </button>
              <button
                @click="saveChanges"
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                :disabled="isSaving"
              >
                {{ isSaving ? '저장 중...' : '저장' }}
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
import { userApiService } from '@/services/userApi';
import { getCurrentUserId } from '@/config/api';
import { S3ApiService } from '@/services/s3Api';

const { currentUser, setUser } = useAuth();
const route = useRoute();

// 탭 관리
const tabs = [
  { id: 'channel', name: '채널 관리' },
  { id: 'profile', name: '회원 수정' }
];

const activeTab = ref('profile');

// 쿼리 파라미터에서 탭 설정
onMounted(async () => {
  const tabParam = route.query.tab as string;
  if (tabParam && tabs.some(tab => tab.id === tabParam)) {
    activeTab.value = tabParam;
  }
  
  // 프로필 이미지 로드
  await loadProfileImage();
});

function handleTabChange(tabId: string) {
  activeTab.value = tabId;
}

// 프로필 수정 관련
const username = ref(currentUser.value?.username || '');
const profileImage = ref<string | null>(null);
const profileImageUrl = ref<string | null>(null); // 서버의 이미지 URL (objectKey)
const currentPassword = ref('');
const newPassword = ref('');
const confirmPassword = ref('');
const fileInput = ref<HTMLInputElement | null>(null);

// 에러 메시지 및 로딩 상태
const usernameError = ref('');
const passwordError = ref('');
const imageError = ref('');
const isSaving = ref(false);
const isUploadingImage = ref(false);
const isDeletingImage = ref(false);

// 프로필 이미지 로드
async function loadProfileImage() {
  if (!currentUser.value?.id) return;
  
  try {
    const response = await userApiService.getProfileImage(currentUser.value.id);
    if (response.profileImageUrl) {
      profileImageUrl.value = response.profileImageUrl;
      // MinIO URL로 변환하여 표시
      profileImage.value = S3ApiService.getImageUrl(response.profileImageUrl);
    } else {
      profileImageUrl.value = null;
      profileImage.value = null;
    }
  } catch (error: any) {
    console.error('프로필 이미지 로드 실패:', error);
    // 에러가 발생해도 기본 아이콘 표시
    profileImageUrl.value = null;
    profileImage.value = null;
  }
}

function selectProfileImage() {
  fileInput.value?.click();
}

async function handleImageUpload(event: Event) {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (!file) return;

  // 파일 검증
  const validation = S3ApiService.validateImageFile(file);
  if (!validation.isValid) {
    imageError.value = validation.error || '파일 검증에 실패했습니다.';
    // 파일 입력 초기화
    if (target) {
      target.value = '';
    }
    return;
  }

  // 미리보기 표시
  const reader = new FileReader();
  reader.onload = (e) => {
    profileImage.value = e.target?.result as string;
  };
  reader.readAsDataURL(file);

  // 업로드 시작
  isUploadingImage.value = true;
  imageError.value = '';

  try {
    const response = await userApiService.uploadProfileImage(file);
    
    // 성공 시 서버 응답 업데이트
    if (response.user && currentUser.value) {
      // 사용자 정보 업데이트 (profileImageUrl 포함)
      setUser({
        ...currentUser.value,
        username: response.user.username,
      });
      
      // 프로필 이미지 URL 업데이트
      if (response.user.profileImageUrl) {
        profileImageUrl.value = response.user.profileImageUrl;
        profileImage.value = S3ApiService.getImageUrl(response.user.profileImageUrl);
      }
    }
    
    alert('프로필 이미지가 업로드되었습니다.');
  } catch (error: any) {
    console.error('프로필 이미지 업로드 실패:', error);
    
    // 에러 처리
    if (error.status === 400) {
      imageError.value = error.message || '잘못된 파일 형식이거나 크기가 초과되었습니다.';
    } else if (error.status === 401) {
      imageError.value = '로그인이 필요합니다.';
    } else if (error.status === 404) {
      imageError.value = '사용자를 찾을 수 없습니다.';
    } else if (error.status === 503) {
      imageError.value = '이미지 서비스가 일시적으로 사용할 수 없습니다.';
    } else {
      imageError.value = '프로필 이미지 업로드 중 오류가 발생했습니다.';
    }
    
    // 실패 시 미리보기 제거
    profileImage.value = profileImageUrl.value 
      ? S3ApiService.getImageUrl(profileImageUrl.value)
      : null;
  } finally {
    isUploadingImage.value = false;
    // 파일 입력 초기화
    if (target) {
      target.value = '';
    }
  }
}

async function deleteProfileImage() {
  if (!profileImageUrl.value) return;
  
  if (!confirm('프로필 이미지를 삭제하시겠습니까?')) {
    return;
  }

  isDeletingImage.value = true;
  imageError.value = '';

  try {
    const response = await userApiService.deleteProfileImage();
    
    // 성공 시 사용자 정보 업데이트
    if (response.user && currentUser.value) {
      setUser({
        ...currentUser.value,
        username: response.user.username,
      });
    }
    
    // 프로필 이미지 제거
    profileImageUrl.value = null;
    profileImage.value = null;
    
    alert('프로필 이미지가 삭제되었습니다.');
  } catch (error: any) {
    console.error('프로필 이미지 삭제 실패:', error);
    
    if (error.status === 400) {
      imageError.value = error.message || '프로필 이미지가 없습니다.';
    } else if (error.status === 401) {
      imageError.value = '로그인이 필요합니다.';
    } else {
      imageError.value = '프로필 이미지 삭제 중 오류가 발생했습니다.';
    }
  } finally {
    isDeletingImage.value = false;
  }
}

function resetForm() {
  username.value = currentUser.value?.username || '';
  // 프로필 이미지는 다시 로드 (삭제 취소)
  loadProfileImage();
  currentPassword.value = '';
  newPassword.value = '';
  confirmPassword.value = '';
  usernameError.value = '';
  passwordError.value = '';
  imageError.value = '';
}

async function saveChanges() {
  // 에러 초기화
  usernameError.value = '';
  passwordError.value = '';
  
  // 로그인 확인
  const userId = getCurrentUserId();
  if (!userId) {
    alert('로그인이 필요합니다.');
    return;
  }

  isSaving.value = true;

  try {
    // 1. 닉네임 변경 처리
    if (username.value && username.value !== currentUser.value?.username) {
      try {
        // 클라이언트 측 검증
        if (username.value.length < 2 || username.value.length > 50) {
          usernameError.value = '닉네임은 2자 이상 50자 이하여야 합니다.';
          isSaving.value = false;
          return;
        }

        const usernameResponse = await userApiService.updateUsername({
          username: username.value,
        });

        // 성공 시 사용자 정보 업데이트
        if (usernameResponse.user && currentUser.value) {
          setUser({
            ...currentUser.value,
            username: usernameResponse.user.username,
          });
        }
      } catch (error: any) {
        // API 에러 처리
        if (error.status === 400) {
          const errorMessage = error.message || '닉네임 변경에 실패했습니다.';
          usernameError.value = errorMessage;
        } else if (error.status === 401) {
          usernameError.value = '로그인이 필요합니다.';
        } else {
          usernameError.value = '닉네임 변경 중 오류가 발생했습니다.';
        }
        isSaving.value = false;
        return;
      }
    }

    // 2. 비밀번호 변경 처리
    if (currentPassword.value || newPassword.value || confirmPassword.value) {
      try {
        // 클라이언트 측 검증
        if (!currentPassword.value) {
          passwordError.value = '현재 비밀번호를 입력해주세요.';
          isSaving.value = false;
          return;
        }

        if (!newPassword.value) {
          passwordError.value = '새 비밀번호를 입력해주세요.';
          isSaving.value = false;
          return;
        }

        if (newPassword.value.length < 6 || newPassword.value.length > 50) {
          passwordError.value = '비밀번호는 6자 이상 50자 이하여야 합니다.';
          isSaving.value = false;
          return;
        }

        if (newPassword.value !== confirmPassword.value) {
          passwordError.value = '새 비밀번호와 확인 비밀번호가 일치하지 않습니다.';
          isSaving.value = false;
          return;
        }

        if (currentPassword.value === newPassword.value) {
          passwordError.value = '새 비밀번호는 현재 비밀번호와 달라야 합니다.';
          isSaving.value = false;
          return;
        }

        await userApiService.updatePassword({
          currentPassword: currentPassword.value,
          newPassword: newPassword.value,
        });

        // 성공 시 비밀번호 필드 초기화
        currentPassword.value = '';
        newPassword.value = '';
        confirmPassword.value = '';
      } catch (error: any) {
        // API 에러 처리
        if (error.status === 400) {
          const errorMessage = error.message || '비밀번호 변경에 실패했습니다.';
          passwordError.value = errorMessage;
        } else if (error.status === 401) {
          passwordError.value = '로그인이 필요합니다.';
        } else {
          passwordError.value = '비밀번호 변경 중 오류가 발생했습니다.';
        }
        isSaving.value = false;
        return;
      }
    }

    // 모두 성공한 경우
    alert('변경사항이 저장되었습니다.');
    resetForm();
  } catch (error: any) {
    console.error('프로필 수정 실패:', error);
    alert('변경사항 저장 중 오류가 발생했습니다.');
  } finally {
    isSaving.value = false;
  }
}
</script>
