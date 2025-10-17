<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center px-4">
    <div class="w-full max-w-md bg-white rounded-xl border p-8 shadow-sm">
      <h1 class="text-2xl font-bold text-gray-900 mb-6">로그인</h1>

      <form @submit.prevent="handleLogin" class="space-y-4">
        <FormInput
          v-model="userId"
          label="아이디"
          placeholder="아이디를 입력하세요"
          :error="userIdError"
          required
        />

        <FormInput
          v-model="password"
          label="비밀번호"
          type="password"
          placeholder="비밀번호를 입력하세요"
          :error="passwordError"
          required
        />

        <ErrorMessage v-if="error" :message="error" />

        <Button
          type="submit"
          variant="success"
          size="lg"
          :loading="isLoading"
          loading-text="로그인 중..."
          full-width
        >
          로그인
        </Button>
      </form>

      <div class="mt-6 text-sm text-gray-600 text-center">
        아직 회원이 아니신가요?
        <router-link to="/signup" class="text-blue-600 hover:underline">회원가입</router-link>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { userApiService } from '@/services/userApi'
import { useAuth } from '@/composables/useAuth'
import { FormInput, ErrorMessage, Button } from '@/components/common'
import { validateLoginId, validatePassword, handleApiError, MESSAGES } from '@/utils'

const router = useRouter()
const { login: authLogin } = useAuth()

const userId = ref('')
const password = ref('')
const error = ref('')
const isLoading = ref(false)

// 유효성 검사
const userIdError = computed(() => validateLoginId(userId.value))
const passwordError = computed(() => validatePassword(password.value))

function loadUsers(): Array<{ nickname: string; userId: string; password: string }> {
  try {
    return JSON.parse(localStorage.getItem('users') || '[]')
  } catch {
    return []
  }
}

async function handleLogin() {
  error.value = ''
  
  // 유효성 검사
  const userIdValidation = validateLoginId(userId.value)
  const passwordValidation = validatePassword(password.value)
  
  if (userIdValidation || passwordValidation) {
    return
  }

  isLoading.value = true
  
  try {
    const response = await userApiService.login({
      loginId: userId.value,
      password: password.value
    })
    
    // 로그인 성공 시 사용자 정보 저장
    await authLogin(response)
    
    alert(MESSAGES.SUCCESS.LOGIN)
    
    // 로그인 전에 접근하려던 페이지가 있으면 해당 페이지로, 없으면 대시보드로 이동
    const redirectTo = router.currentRoute.value.query.redirect as string || '/dashboard'
    router.push(redirectTo)
  } catch (err: any) {
    console.error('로그인 실패:', err)
    error.value = handleApiError(err)
  } finally {
    isLoading.value = false
  }
}
</script>

