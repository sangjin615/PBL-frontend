<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">
              {{ loading ? '강의 정보 로딩 중...' : lecture?.title || '' }}
            </h1>
            <p class="text-sm text-gray-600">
              {{ lecture?.author?.username || '알 수 없음' }} • {{ lecture?.durationMinutes ? `${lecture.durationMinutes}분` : '' }}
            </p>
            <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
          </div>
        </div>
        
        <div class="flex items-center space-x-4">
          <!-- 신고 버튼 -->
          <ReportButton
            v-if="lecture"
            report-type="lecture"
            :target-id="lecture.id"
            :target-title="lecture.title"
            @reported="handleReported"
          />
          
          <!-- 다음 강의 버튼 -->
          <button 
            v-if="nextLesson"
            @click="goToNextLesson"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
            </svg>
            <span>다음 강의</span>
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 컨텐츠 -->
    <div class="flex h-screen select-none">
      <!-- 왼쪽: 타입별 분기 영역 -->
      <div class="border-r overflow-y-auto bg-white" :style="{ width: leftPaneWidth + '%' }">
        <div class="p-6">
          <!-- 로딩/에러 상태 -->
          <div v-if="loading" class="flex justify-center items-center py-12">
            <div class="text-gray-600">강의 내용을 불러오는 중...</div>
          </div>
          <div v-else-if="error" class="flex justify-center items-center py-12">
            <div class="text-red-600">{{ error }}</div>
          </div>
          
          <!-- MARKDOWN 타입: 마크다운 뷰어 -->
          <div v-else-if="lecture?.type === 'MARKDOWN'" class="markdown-content">
            <MdPreview
              :modelValue="lecture.content || lecture.description || '# 강의 내용이 없습니다.'"
              :theme="'light'"
              :editorId="'learning-markdown-preview'"
            />
          </div>

          <!-- PROBLEM 타입: 문제 설명 -->
          <div v-else-if="lecture?.type === 'PROBLEM'" class="problem-content">
            <!-- 문제 제목 -->
            <h2 class="text-2xl font-bold text-gray-900 mb-6">{{ lecture.title }}</h2>

            <!-- 문제 제약조건 -->
            <div class="bg-gray-50 rounded-lg p-4 mb-6">
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="text-gray-600">시간제한</span>
                  <p class="font-semibold">{{ lecture.constraints?.cpu_time_limit || 1 }}초</p>
                </div>
                <div>
                  <span class="text-gray-600">메모리 제한</span>
                  <p class="font-semibold">{{ Math.round((lecture.constraints?.memory_limit || 128000) / 1000) }}MB</p>
                </div>
              </div>
            </div>

            <!-- 문제 설명 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">문제</h3>
              <div class="markdown-preview-container">
                <MdPreview :model-value="lecture.content || ''" />
              </div>
            </div>

            <!-- 입력 설명 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">입력</h3>
              <div class="markdown-preview-container">
                <MdPreview :model-value="lecture.input_content || ''" />
              </div>
            </div>

            <!-- 출력 설명 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">출력</h3>
              <div class="markdown-preview-container">
                <MdPreview :model-value="lecture.output_content || ''" />
              </div>
            </div>

            <!-- 테스트케이스 -->
            <div class="mb-6">
              <h3 class="text-lg font-semibold mb-3">테스트 케이스</h3>
              <div v-if="!lecture.testCases || lecture.testCases.length === 0" class="text-gray-500">
                테스트 케이스가 없습니다.
              </div>
              <div v-else class="space-y-4">
                <div
                  v-for="(tc, idx) in lecture.testCases"
                  :key="idx"
                  class="bg-gray-50 rounded-lg p-4"
                >
                  <div class="flex items-start justify-between mb-2">
                    <h4 class="font-medium text-gray-700">테스트케이스 {{ idx + 1 }}</h4>
                    <button
                      :aria-label="`테스트케이스 ${idx + 1} 실행`"
                      class="p-2 rounded hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      @click="runTestCase(tc)"
                      :disabled="isRunning"
                      title="이 테스트케이스로 실행"
                    >
                      <svg v-if="!isRunning" class="w-5 h-5 text-gray-700" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.5 5.5v9l8-4.5-8-4.5z"></path>
                      </svg>
                      <div v-else class="w-5 h-5 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></div>
                    </button>
                  </div>
                  <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h5 class="font-medium text-gray-700 mb-2">입력</h5>
                      <pre class="text-sm bg-white p-2 rounded border">{{ tc.input }}</pre>
                    </div>
                    <div>
                      <h5 class="font-medium text-gray-700 mb-2">출력</h5>
                      <pre class="text-sm bg-white p-2 rounded border">{{ tc.expectedOutput }}</pre>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- 사용자 임의 입력 실행 영역 -->
              <div class="mt-6 bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-700 mb-2">사용자 입력으로 실행</h4>
                <textarea
                  v-model="customInput"
                  class="w-full h-24 text-sm bg-white p-2 rounded border focus:outline-none focus:ring"
                  placeholder="표준 입력(stdin)에 들어갈 값을 입력하세요. 여러 줄 입력 가능"
                ></textarea>
                <div class="mt-3 flex justify-end">
                  <button
                    @click="runCustomInput"
                    :disabled="isRunning"
                    class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {{ isRunning ? '실행 중...' : '입력으로 실행' }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 세로 분리선 -->
      <div class="w-1 bg-gray-300 hover:bg-gray-400 cursor-col-resize" @mousedown="startDragLeftRight"></div>

      <!-- 오른쪽: 코드 에디터 영역 -->
      <div class="bg-gray-50 flex flex-col" :style="{ width: (100 - leftPaneWidth) + '%' }">
        <!-- 파일명과 언어 선택 -->
        <div class="bg-white border-b px-4 py-3 flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <h3 class="font-semibold">코드 에디터</h3>
            <select
              v-model="selectedLanguage"
              @change="changeLanguage(selectedLanguage)"
              class="px-3 py-1 border rounded text-sm"
            >
              <option v-for="lang in supportedLanguages" :key="lang.id" :value="lang.id">
                {{ lang.name }}
              </option>
            </select>
          </div>
          
          <div class="flex space-x-2">
            <!-- MARKDOWN 타입: 코드 실행 버튼 -->
            <button
              v-if="lecture?.type === 'MARKDOWN'"
              @click="runCode"
              :disabled="isRunning"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isRunning ? '실행 중...' : '코드 실행' }}
            </button>
            <!-- PROBLEM 타입: 제출 버튼 -->
            <button
              v-if="lecture?.type === 'PROBLEM'"
              @click="submitCode"
              :disabled="isRunning"
              class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {{ isRunning ? '채점 중...' : '제출하기' }}
            </button>
          </div>
        </div>

        <!-- 코드 에디터 / 실행 결과 - 수직 분할 컨테이너 -->
        <div class="flex-1 p-4 flex flex-col">
          <div class="border rounded-lg overflow-hidden" :style="{ height: editorAreaHeight + '%' }">
            <MonacoEditor
              v-if="isEditorReady"
              ref="monacoEditorRef"
              :key="editorConfig.languageId"
              :config="editorConfig"
              class="w-full h-full"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <div class="text-gray-500">에디터 준비 중...</div>
            </div>
          </div>
          <!-- 가로 분리선 -->
          <div class="h-1 bg-gray-300 hover:bg-gray-400 cursor-row-resize" @mousedown="startDragEditorTerminal"></div>
          <div class="border bg-gray-50 flex-1 flex flex-col" :style="{ height: (100 - editorAreaHeight) + '%' }">
            <div class="px-4 py-2 border-b">
              <h4 class="font-semibold text-sm">실행 결과</h4>
            </div>
            <div class="flex-1 p-4 bg-black text-green-400 font-mono text-sm overflow-auto">
              <div v-if="isRunning" class="flex items-center space-x-2">
                <div class="animate-spin w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full"></div>
                <span>실행 중...</span>
              </div>
              <div v-else-if="executionResult" class="whitespace-pre-wrap">
                {{ executionResult.stdout || executionResult.message || '실행 결과가 없습니다.' }}
              </div>
              <div v-else class="text-gray-500">실행 결과가 여기에 표시됩니다.</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 하단 버튼들 (주석 처리) -->
    <!-- 
    <div class="bg-white border-t px-6 py-4">
      <div class="flex items-center justify-start">
        <div class="flex items-center space-x-4">
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            질문하기
          </button>
          <button class="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors">
            초기화
          </button>
        </div>
      </div>
    </div>
    -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRoute, useRouter, onBeforeRouteLeave } from 'vue-router';
import MonacoEditor from '../components/editor/MonacoEditor.vue';
import ReportButton from '@/components/common/ReportButton.vue';
import { languageApiService } from '../services/languageApi';
import { submissionAPI, type SubmissionResult } from '../services/submissionAPI';
import type { MonacoEditorConfig } from '../services/extendedClient';
import { lectureApiService } from '../services/lectureApi';
import type { Lecture, TestCase } from '../types/lecture';
import { curriculumApiService } from '../services/curriculumApi';
import type { CurriculumNavigationResponse } from '@/types/curriculum';
import { MdPreview } from 'md-editor-v3-ko';
import 'md-editor-v3-ko/lib/style.css';
import { gradingAPI, type GradingRequest } from '../services/gradingAPI';
import { SUPPORTED_LANGUAGES_FALLBACK } from '@/constants';
import { enrollmentApiService } from '@/services/enrollmentApi';
import { getCurrentUserId } from '@/config/api';

const route = useRoute();
const router = useRouter();

// 반응형 데이터
const isRunning = ref(false);
const executionResult = ref<SubmissionResult | null>(null);
const monacoEditorRef = ref<any>(null);
const selectedLanguage = ref(71); // Python 3의 ID를 기본값으로
const supportedLanguages = ref<Array<{id: number, name: string, version?: string, file_extension?: string}>>([]); // API에서 가져올 언어 목록
const isSubmitted = ref(false); // 제출 완료 플래그

// API 연결 상태
const loading = ref(true);
const error = ref<string | null>(null);

// 강의 데이터 (API에서 직접 로드)
const lecture = ref<Lecture | null>(null);

// 사용자 임의 입력 실행 기능
const customInput = ref('');

// Monaco Editor 통합 설정 (기본 소스코드 없음)
const editorConfig = ref<MonacoEditorConfig>(
  languageApiService.createEditorConfig(71, '') // 빈 문자열로 시작
)

// 에디터 준비 상태
const isEditorReady = ref(false);

// 다음 강의 정보
const nextLesson = ref<{id: number} | null>(null);

// lessonData 제거 - lecture를 직접 사용

// enrollmentId 찾기 함수
async function findEnrollmentId(curriculumIdNum: number): Promise<number | null> {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      console.log('[진행률 업데이트] 사용자 ID를 찾을 수 없습니다.');
      return null;
    }

    const enrollments = await enrollmentApiService.getUserEnrollments(userId);
    const enrollment = enrollments.find(e => 
      e.curriculumId === curriculumIdNum && e.status === 'ENROLLED'
    );

    if (enrollment) {
      console.log('[진행률 업데이트] enrollmentId 찾음:', enrollment.id);
      return enrollment.id;
    } else {
      console.log('[진행률 업데이트] enrollment를 찾을 수 없습니다.');
      return null;
    }
  } catch (err) {
    console.error('[진행률 업데이트] enrollmentId 찾기 실패:', err);
    return null;
  }
}

// 강의 완료 처리 (마크다운 강의)
async function markMarkdownLectureAsRead(lectureId: number, curriculumIdNum: number | null) {
  if (!curriculumIdNum) {
    console.log('[진행률 업데이트] curriculumId가 없어 진행률을 업데이트할 수 없습니다.');
    return;
  }

  try {
    const enrollmentId = await findEnrollmentId(curriculumIdNum);
    if (!enrollmentId) {
      console.log('[진행률 업데이트] enrollmentId를 찾을 수 없어 진행률을 업데이트할 수 없습니다.');
      return;
    }

    await enrollmentApiService.markLectureAsRead(enrollmentId, lectureId);
    console.log('[진행률 업데이트] ✅ 마크다운 강의 읽기 완료 처리 성공:', lectureId);
  } catch (err) {
    console.error('[진행률 업데이트] 마크다운 강의 완료 처리 실패:', err);
  }
}

// Lecture API에서 강의 정보 로드
async function loadLectureData() {
  try {
    loading.value = true;
    error.value = null;

    const lectureId = Number(route.params.lectureId);
    if (!lectureId) {
      throw new Error('강의 ID가 없습니다.');
    }

    // Lecture API 호출 - 직접 lecture ref에 저장
    lecture.value = await lectureApiService.getLecture(lectureId);

    // 마크다운 강의인 경우 읽기 완료 처리
    if (lecture.value?.type === 'MARKDOWN') {
      const curriculumIdNum = route.query.curriculumId ? Number(route.query.curriculumId) : null;
      if (curriculumIdNum) {
        // 비동기로 처리하되 에러가 발생해도 강의 로드에는 영향 없음
        markMarkdownLectureAsRead(lectureId, curriculumIdNum).catch(err => {
          console.error('[마크다운 강의 완료 처리] 실패:', err);
        });
      }
    }

  } catch (err) {
    console.error('강의 데이터 로드 실패:', err);
    error.value = '강의 정보를 불러오는 중 오류가 발생했습니다.';
  } finally {
    loading.value = false;
  }
}

// 다음 강의 정보 로드 (새 네비게이션 API 사용)
async function loadNextLecture() {
  try {
    const currentLectureId = Number(route.params.lectureId);
    const curriculumId = route.query.curriculumId ? Number(route.query.curriculumId) : null;

    if (!curriculumId) {
      nextLesson.value = null;
      return;
    }

    // 새로운 네비게이션 API 호출
    const nav = await curriculumApiService.getNavigationInfo(curriculumId, currentLectureId);

    // 다음 강의 ID만 저장
    if (nav.nextLectureId) {
      nextLesson.value = {
        id: nav.nextLectureId
      };
    } else {
      nextLesson.value = null;
    }

  } catch (err) {
    console.error('다음 강의 로드 실패:', err);
    nextLesson.value = null;
  }
}

// 메서드
function goBack() {
  // 제출 완료 후에는 경고 없이 이동
  if (isSubmitted.value) {
    console.log('제출 완료 상태 - 경고 없이 뒤로 가기');
    router.back();
    return;
  }

  const confirmMessage = '강의를 나가시겠습니까? 진행 상황이 저장되지 않을 수 있습니다.';
  const answer = window.confirm(confirmMessage);
  if (answer) {
    router.back();
  }
}

// 다음 강의로 이동
function goToNextLesson() {
  if (nextLesson.value) {
    // 제출 완료 후에는 경고 없이 이동
    if (isSubmitted.value) {
      console.log('제출 완료 상태 - 경고 없이 다음 강의로 이동');
      const curriculumId = route.query.curriculumId;
      const url = `/learn/${nextLesson.value.id}${curriculumId ? `?curriculumId=${curriculumId}` : ''}`;
      window.location.href = url;
      return;
    }

    const confirmMessage = '다음 강의로 이동하시겠습니까? 현재 강의의 진행 상황이 저장되지 않을 수 있습니다.';
    const answer = window.confirm(confirmMessage);
    if (answer) {
      const curriculumId = route.query.curriculumId;
      // 페이지를 완전히 새로 로드하여 컴포넌트를 재마운트
      const url = `/learn/${nextLesson.value.id}${curriculumId ? `?curriculumId=${curriculumId}` : ''}`;
      window.location.href = url;
    }
  }
}

function copyCode(codeText: string) {
  navigator.clipboard.writeText(codeText);
  // 간단한 알림 (실제로는 토스트 메시지 사용)
  window.alert('코드가 클립보드에 복사되었습니다!');
}

// 신고 완료 핸들러
function handleReported() {
  window.alert('신고가 접수되었습니다. 검토 후 조치하겠습니다.');
}

function openEditorPopout() {
  const lectureId = route.params.lectureId as string;
  const features = [
    'popup=yes',
    'width=1200',
    'height=800',
    'resizable=yes',
    'scrollbars=yes'
  ].join(',');
  const url = router.resolve({ name: 'editor-popout', params: { lectureId } }).href;
  window.open(url, '_blank', features);
}

async function runCode() {
  // Monaco Editor에서 현재 코드 가져오기
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  
  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    };
    return;
  }

  isRunning.value = true;
  executionResult.value = null;

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: ''
    });

    executionResult.value = result;
    
  } catch (error: any) {
    console.error('코드 실행 오류:', error);
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    };
  } finally {
    isRunning.value = false;
  }
}

// 테스트케이스 실행 함수
async function runTestCase(testCase: TestCase) {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';

  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    };
    return;
  }

  isRunning.value = true;
  executionResult.value = null;

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: testCase.input
    });

    executionResult.value = result;

  } catch (error: any) {
    console.error('테스트케이스 실행 오류:', error);
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    };
  } finally {
    isRunning.value = false;
  }
}

// 사용자 임의 입력으로 실행
async function runCustomInput() {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  
  if (!currentCode.trim()) {
    executionResult.value = {
      message: '실행할 코드가 없습니다.'
    };
    return;
  }

  isRunning.value = true;
  executionResult.value = null;

  try {
    const result = await submissionAPI.executeCode({
      source_code: currentCode,
      language_id: selectedLanguage.value,
      stdin: customInput.value || ''
    });

    executionResult.value = result;
    
  } catch (error: any) {
    console.error('사용자 입력 실행 오류:', error);
    executionResult.value = {
      message: `실행 오류: ${error.message}`
    };
  } finally {
    isRunning.value = false;
  }
}

// 코드 제출 함수 (PROBLEM 타입용)
async function submitCode() {
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';

  if (!currentCode.trim()) {
    window.alert('제출할 코드가 없습니다.');
    return;
  }

  console.log('=== 제출 시작 ===');
  console.log('코드:', currentCode);
  console.log('언어 ID:', selectedLanguage.value);
  console.log('문제 ID:', Number(route.params.lectureId));

  isRunning.value = true;
  executionResult.value = {
    message: '채점을 제출하고 있습니다...'
  };

  try {
    const lectureId = Number(route.params.lectureId);
    const curriculumId = route.query.curriculumId as string | undefined;

    const gradingRequest: GradingRequest = {
      source_code: currentCode,
      language_id: selectedLanguage.value,
      problem_id: lectureId
    };

    console.log('채점 요청:', gradingRequest);
    const result = await gradingAPI.submitForGrading(gradingRequest);
    console.log('채점 응답:', result);

    // 제출 성공 플래그 설정
    isSubmitted.value = true;

    // 제출 성공 메시지 표시
    executionResult.value = {
      message: `제출 완료! 채점 토큰: ${result.token}\n결과 페이지로 이동합니다...`
    };

    // 즉시 결과 페이지로 이동 (토큰 + curriculumId 포함)
    const routeParams = {
      name: 'problem-result',
      params: { problemId: lectureId.toString() },
      query: {
        token: result.token,
        ...(curriculumId && { curriculumId })
      }
    };
    console.log('라우팅 시도:', routeParams);

    router.push(routeParams).then(() => {
      console.log('라우팅 성공!');
    }).catch((error) => {
      console.error('라우팅 실패:', error);
      executionResult.value = {
        message: `라우팅 오류: ${error.message}`
      };
      isRunning.value = false;
    });
    
  } catch (error: any) {
    console.error('채점 제출 오류:', error);
    executionResult.value = {
      message: `채점 제출 오류: ${error.message}`
    };
    isRunning.value = false;
  }
}

// API에서 지원하는 언어 목록을 가져오는 함수
async function fetchSupportedLanguages() {
  try {
    const languages = await languageApiService.getLanguages();
    supportedLanguages.value = languages;
    console.log('언어 목록 로드 완료:', languages.length, '개 언어');
  } catch (error) {
    console.error('언어 목록 로드 실패:', error);
    // 기본 언어 목록으로 fallback
    supportedLanguages.value = [...SUPPORTED_LANGUAGES_FALLBACK];
  }
}

// 언어 변경 핸들러 - 에디터 설정 재생성
const changeLanguage = (newLanguageId: number) => {
  selectedLanguage.value = newLanguageId;
  const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
  editorConfig.value = languageApiService.createEditorConfig(newLanguageId, currentCode);
  console.log('언어 변경:', newLanguageId, '에디터 재생성됨');
};

// -----------------------------
// 레이아웃: 분할바 드래그 (좌/우)
// -----------------------------
const leftPaneWidth = ref(50); // %
let isDraggingLR = false;
const startDragLeftRight = (e: MouseEvent) => {
  isDraggingLR = true;
  window.addEventListener('mousemove', onDragLR);
  window.addEventListener('mouseup', stopDragLR);
};
const onDragLR = (e: MouseEvent) => {
  if (!isDraggingLR) return;
  const totalWidth = window.innerWidth;
  const newLeft = Math.max(20, Math.min(80, (e.clientX / totalWidth) * 100));
  leftPaneWidth.value = Math.round(newLeft);
};
const stopDragLR = () => {
  isDraggingLR = false;
  window.removeEventListener('mousemove', onDragLR);
  window.removeEventListener('mouseup', stopDragLR);
};

// -----------------------------
// 레이아웃: 에디터/터미널 수직 분할
// -----------------------------
const editorAreaHeight = ref(65); // %
let isDraggingET = false;
const startDragEditorTerminal = () => {
  isDraggingET = true;
  window.addEventListener('mousemove', onDragET);
  window.addEventListener('mouseup', stopDragET);
};
const onDragET = (e: MouseEvent) => {
  if (!isDraggingET) return;
  const usableHeight = window.innerHeight - 200; // 상단 헤더/여백 보정
  const rectTop = 150; // 대략적 헤더 높이 보정
  const y = e.clientY - rectTop;
  const next = Math.max(30, Math.min(85, (y / Math.max(usableHeight, 1)) * 100));
  editorAreaHeight.value = Math.round(next);
};
const stopDragET = () => {
  isDraggingET = false;
  window.removeEventListener('mousemove', onDragET);
  window.removeEventListener('mouseup', stopDragET);
};

// 코드 존재 여부 확인 함수
function hasUnsavedCode(): boolean {
  try {
    const currentCode = monacoEditorRef.value?.getCurrentCode() || '';
    const hasCode = currentCode.trim().length > 0;
    console.log('코드 존재 여부 확인:', {
      currentCode: currentCode,
      trimmedLength: currentCode.trim().length,
      hasCode: hasCode
    });
    return hasCode;
  } catch (error) {
    console.error('코드 존재 여부 확인 중 오류:', error);
    return false;
  }
}


// 페이지 이탈 시 경고 (브라우저 새로고침, 뒤로가기 등)
function handleBeforeUnload(e: BeforeUnloadEvent) {
  // 코드가 있거나 강의를 듣고 있다면 항상 확인
  e.preventDefault();
  e.returnValue = '강의를 나가시겠습니까? 진행 상황이 저장되지 않을 수 있습니다.'; // Chrome에서 필요
  return '강의를 나가시겠습니까? 진행 상황이 저장되지 않을 수 있습니다.';
}

// Vue Router navigation guard (페이지 내 라우팅)
onBeforeRouteLeave((to, from, next) => {
  // 제출 완료 후에는 경고 없이 이동
  if (isSubmitted.value) {
    console.log('제출 완료 상태 - 경고 없이 페이지 이동');
    next();
    return;
  }

  const confirmMessage = '강의를 나가시겠습니까? 진행 상황이 저장되지 않을 수 있습니다.';
  const answer = window.confirm(confirmMessage);
  if (answer) {
    next();
  } else {
    next(false);
  }
});

// 초기화
onMounted(async () => {
  // beforeunload 이벤트 리스너 등록
  window.addEventListener('beforeunload', handleBeforeUnload);

  // 1. 언어 목록 먼저 가져오기
  await fetchSupportedLanguages();

  // 2. 토큰이 있으면 소스코드와 언어 정보 가져오기
  const tokenParam = route.query.token as string;
  if (tokenParam) {
    try {
      const result = await gradingAPI.getGradingResult(tokenParam, false);

      // 에디터 설정 업데이트 (언어 + 소스코드)
      if (result.language_id && result.source_code) {
        selectedLanguage.value = result.language_id;
        editorConfig.value = languageApiService.createEditorConfig(
          result.language_id,
          result.source_code
        );
      }
    } catch (error) {
      console.error('토큰으로 정보 가져오기 실패:', error);
    }
  }

  // 3. 강의 데이터 로드 (API에서)
  await loadLectureData();

  // 3.5. 토큰이 없고 강의에 languageId가 있으면 적용
  if (!tokenParam && lecture.value?.languageId) {
    selectedLanguage.value = lecture.value.languageId;
    editorConfig.value = languageApiService.createEditorConfig(
      lecture.value.languageId,
      '' // 빈 문자열로 시작
    );
    console.log('강의 기본 언어 적용:', lecture.value.languageId);
  }

  // 4. 에디터 렌더링 허용
  isEditorReady.value = true;

  // 5. 다음 강의 정보 설정
  await loadNextLecture();
});

// 컴포넌트 언마운트 시 이벤트 리스너 제거
onBeforeUnmount(() => {
  window.removeEventListener('beforeunload', handleBeforeUnload);
});
</script>

