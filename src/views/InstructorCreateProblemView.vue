<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 헤더 -->
    <div class="bg-white border-b px-6 py-4">
      <div class="flex items-center justify-between">
        <div class="flex items-center space-x-4">
          <button @click="goBack" class="p-2 hover:bg-gray-100 rounded-lg">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>
          <div>
            <h1 class="text-lg font-semibold">문제 생성</h1>
            <p class="text-sm text-gray-600">프로그래밍 문제를 생성하세요</p>
          </div>
        </div>
        <div class="flex items-center space-x-3">
          <button 
            @click="previewProblem"
            class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            미리보기
          </button>
          <button 
            @click="saveDraft"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            임시저장
          </button>
          <button 
            @click="publishProblem"
            class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            문제 발행
          </button>
        </div>
      </div>
    </div>

    <!-- 메인 콘텐츠 -->
    <div class="flex">
      <!-- 사이드바 -->
      <div class="w-64 bg-white border-r border-gray-200 p-4">
        <nav class="space-y-2">
          <button 
            v-for="tab in tabs" 
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'w-full text-left px-3 py-2 rounded-lg transition-colors',
              activeTab === tab.id 
                ? 'bg-green-100 text-green-700' 
                : 'text-gray-600 hover:bg-gray-100'
            ]"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <!-- 콘텐츠 영역 -->
      <div class="flex-1 p-6">
        <!-- 기본 정보 탭 -->
        <div v-if="activeTab === 'basic'" class="max-w-4xl">
          <h2 class="text-xl font-semibold mb-6">기본 정보</h2>
          
          <div class="space-y-6">
            <!-- 문제 제목 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 제목 *</label>
              <input 
                v-model="problemData.title"
                type="text" 
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="문제 제목을 입력하세요"
              />
            </div>

            <!-- 문제 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명 *</label>
              <textarea 
                v-model="problemData.description"
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="문제에 대한 간단한 설명을 입력하세요"
              ></textarea>
            </div>

            <!-- 카테고리 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">카테고리 *</label>
              <select 
                v-model="problemData.category"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">카테고리를 선택하세요</option>
                <option value="알고리즘">알고리즘</option>
                <option value="자료구조">자료구조</option>
                <option value="수학">수학</option>
                <option value="구현">구현</option>
                <option value="그래프">그래프</option>
                <option value="동적계획법">동적계획법</option>
                <option value="기타">기타</option>
              </select>
            </div>

            <!-- 난이도 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">난이도 *</label>
              <select 
                v-model="problemData.difficulty"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">난이도를 선택하세요</option>
                <option value="브론즈">브론즈</option>
                <option value="실버">실버</option>
                <option value="골드">골드</option>
                <option value="플래티넘">플래티넘</option>
                <option value="다이아몬드">다이아몬드</option>
              </select>
            </div>

            <!-- 시간 제한 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">시간 제한 (초) *</label>
              <input 
                v-model.number="problemData.timeLimit"
                type="number" 
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="1"
              />
            </div>

            <!-- 메모리 제한 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">메모리 제한 (MB) *</label>
              <input 
                v-model.number="problemData.memoryLimit"
                type="number" 
                min="1"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="256"
              />
            </div>
          </div>
        </div>

        <!-- 문제 내용 탭 -->
        <div v-if="activeTab === 'content'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">문제 내용</h2>
          
          <div class="space-y-6">
            <!-- 문제 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">문제 설명 *</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.problemDescription"
                  :theme="editorTheme"
                  :toolbars="toolbars"
                  :height="300"
                  :locale="koKR"
                  placeholder="문제를 자세히 설명해주세요..."
                />
              </div>
            </div>

            <!-- 입력 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">입력 설명</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.inputDescription"
                  :theme="editorTheme"
                  :toolbars="toolbars"
                  :height="200"
                  :locale="koKR"
                  placeholder="입력 형식을 설명해주세요..."
                />
              </div>
            </div>

            <!-- 출력 설명 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">출력 설명</label>
              <div class="border border-gray-300 rounded-lg overflow-hidden">
                <MdEditor
                  v-model="problemData.outputDescription"
                  :theme="editorTheme"
                  :toolbars="toolbars"
                  :height="200"
                  :locale="koKR"
                  placeholder="출력 형식을 설명해주세요..."
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 테스트 케이스 탭 -->
        <div v-if="activeTab === 'testcases'" class="max-w-6xl">
          <h2 class="text-xl font-semibold mb-6">테스트 케이스</h2>
          
          <div class="space-y-4">
            <div 
              v-for="(testCase, index) in problemData.testCases" 
              :key="index"
              class="border border-gray-300 rounded-lg p-4"
            >
              <div class="flex items-center justify-between mb-4">
                <h3 class="font-medium">테스트 케이스 {{ index + 1 }}</h3>
                <button 
                  @click="removeTestCase(index)"
                  class="text-red-600 hover:text-red-800"
                >
                  삭제
                </button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">입력</label>
                  <textarea 
                    v-model="testCase.input"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="테스트 입력 데이터"
                  ></textarea>
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-2">출력</label>
                  <textarea 
                    v-model="testCase.output"
                    rows="6"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg font-mono text-sm"
                    placeholder="예상 출력 데이터"
                  ></textarea>
                </div>
              </div>
            </div>
            
            <button 
              @click="addTestCase"
              class="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors"
            >
              + 테스트 케이스 추가
            </button>
          </div>
        </div>

        <!-- 설정 탭 -->
        <div v-if="activeTab === 'settings'" class="max-w-4xl">
          <h2 class="text-xl font-semibold mb-6">문제 설정</h2>
          
          <div class="space-y-6">
            <!-- 공개 설정 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">공개 설정</label>
              <div class="space-y-2">
                <label class="flex items-center">
                  <input 
                    v-model="problemData.isPublic" 
                    type="radio" 
                    :value="true" 
                    class="mr-2"
                  />
                  공개 (모든 사용자가 볼 수 있음)
                </label>
                <label class="flex items-center">
                  <input 
                    v-model="problemData.isPublic" 
                    type="radio" 
                    :value="false" 
                    class="mr-2"
                  />
                  비공개 (링크를 아는 사용자만 볼 수 있음)
                </label>
              </div>
            </div>

            <!-- 지원 언어 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">지원 언어</label>
              <div class="flex flex-wrap gap-2">
                <label 
                  v-for="language in availableLanguages" 
                  :key="language"
                  class="flex items-center"
                >
                  <input 
                    v-model="problemData.languages"
                    :value="language"
                    type="checkbox" 
                    class="mr-2"
                  />
                  {{ language }}
                </label>
              </div>
            </div>

            <!-- 에디터 테마 -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">에디터 테마</label>
              <select 
                v-model="editorTheme"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="light">라이트</option>
                <option value="dark">다크</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import { MdEditor } from 'md-editor-v3'
import 'md-editor-v3/lib/style.css'
import '../styles/md-editor-korean.css'
import koKR from '../locales/ko-KR'

const router = useRouter()

// 탭 관리
const tabs = [
  { id: 'basic', label: '기본 정보' },
  { id: 'content', label: '문제 내용' },
  { id: 'testcases', label: '테스트 케이스' },
  { id: 'settings', label: '설정' }
]

const activeTab = ref('basic')

// 문제 데이터
const problemData = reactive({
  title: '',
  description: '',
  category: '',
  difficulty: '',
  timeLimit: 1,
  memoryLimit: 256,
  problemDescription: `## 문제

두 정수 A와 B를 입력받은 다음, A+B를 출력하는 프로그램을 작성하시오.

## 입력

첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)

## 출력

첫째 줄에 A+B를 출력한다.

## 예제 입력 1
\`\`\`
1 1
\`\`\`

## 예제 출력 1
\`\`\`
2
\`\`\``,
  inputDescription: '첫째 줄에 A와 B가 주어진다. (0 < A, B < 10)',
  outputDescription: '첫째 줄에 A+B를 출력한다.',
  testCases: [
    {
      input: '1 1',
      output: '2'
    },
    {
      input: '2 3',
      output: '5'
    }
  ],
  isPublic: true,
  languages: [] as string[]
})

// 에디터 설정
const editorTheme = ref('light')

// 사용 가능한 언어
const availableLanguages = ['Python', 'Java', 'JavaScript', 'C++', 'C#', 'Go', 'Rust']

// 툴바 설정
const toolbars = [
  'bold', 'underline', 'italic', 'strikeThrough',
  'quote', 'unorderedList', 'orderedList', 'task',
  'codeRow', 'code', 'link', 'table'
]

// 테스트 케이스 관리
function addTestCase() {
  problemData.testCases.push({ input: '', output: '' })
}

function removeTestCase(index: number) {
  problemData.testCases.splice(index, 1)
}

// 액션 함수들
function goBack() {
  router.back()
}

function previewProblem() {
  // 미리보기 기능 구현
  alert('미리보기 기능은 구현 예정입니다.')
}

function saveDraft() {
  // 임시저장 기능 구현
  console.log('임시저장:', problemData)
  alert('임시저장되었습니다.')
}

function publishProblem() {
  // 문제 발행 기능 구현
  console.log('문제 발행:', problemData)
  alert('문제가 발행되었습니다.')
}

// 중국어와 글자 깨짐 문제 해결 (최종 강화 버전)
function translateChineseToKorean() {
  const mdEditor = document.querySelector('.md-editor')
  if (!mdEditor) return

  const translations = {
    // 기본 UI
    '字数': '글자 수',
    '同步滚动': '동기화 스크롤',
    'mermaid图': '다이어그램',
    'katex公式': '수학식',
    '行内公式': '인라인 수식',
    '块公式': '블록 수식',
    '块级公式': '블록 수식',
    '块级代码': '코드 블록',
    
    // 다이어그램 타입
    '流程图': '플로우차트',
    '时序图': '시퀀스 다이어그램',
    '甘特图': '간트 차트',
    '类图': '클래스 다이어그램',
    '状态图': '상태 다이어그램',
    '饼图': '파이 차트',
    '关系图': '관계 다이어그램',
    '旅程图': '여정 맵',
    
    // 툴바 버튼
    '粗体': '굵게',
    '斜体': '기울임꼴',
    '下划线': '밑줄',
    '删除线': '취소선',
    '下标': '아래 첨자',
    '上标': '위 첨자',
    '引用': '인용',
    '无序列表': '순서 없는 목록',
    '有序列表': '순서 있는 목록',
    '任务列表': '할 일 목록',
    '行内代码': '인라인 코드',
    '代码块': '코드 블록',
    '链接': '링크',
    '图片': '이미지',
    '表格': '표',
    '撤销': '실행 취소',
    '重做': '다시 실행',
    '前进': '다시 실행',
    '后퇴': '실행 취소',
    '保存': '저장',
    '全屏': '전체 화면',
    '浏览器全屏': '전체 화면',
    '浏览器': '브라우저',
    '预览': '미리보기',
    'HTML预览': 'HTML 미리보기',
    'html代码미리보기': 'HTML 미리보기',
    '代码': '코드',
    '添加链接': '링크 추가',
    '上传图片': '이미지 업로드',
    '裁剪上传': '크롭 업로드',
    '添加링크': '링크 추가',
    '上传이미지': '이미지 업로드',
    '后退': '실행 취소',
    '屏幕 전체 화면': '전체 화면',
    '屏幕': '화면'
  }

  // 1. 모든 텍스트 노드 변경
  const walker = document.createTreeWalker(
    mdEditor,
    NodeFilter.SHOW_TEXT,
    null,
    false
  )

  let node
  while (node = walker.nextNode()) {
    if (node.textContent) {
      let text = node.textContent
      let changed = false

      for (const [chinese, korean] of Object.entries(translations)) {
        if (text.includes(chinese)) {
          text = text.replace(new RegExp(chinese, 'g'), korean)
          changed = true
        }
      }

      if (changed) {
        node.textContent = text
      }
    }
  }

  // 2. 모든 요소의 title 속성 변경
  const allElements = mdEditor.querySelectorAll('*')
  allElements.forEach(element => {
    const title = element.getAttribute('title')
    if (title) {
      let newTitle = title
      for (const [chinese, korean] of Object.entries(translations)) {
        newTitle = newTitle.replace(new RegExp(chinese, 'g'), korean)
      }
      if (newTitle !== title) {
        element.setAttribute('title', newTitle)
      }
    }
  })

  // 3. 특정 클래스의 요소들 직접 변경
  const specificSelectors = [
    '.md-editor-toolbar button',
    '.md-editor-dropdown-item',
    '[data-type]',
    '.md-editor-footer',
    '.md-editor-status',
    '.md-editor-toolbar-name',
    '.md-editor-toolbar-item'
  ]

  specificSelectors.forEach(selector => {
    const elements = mdEditor.querySelectorAll(selector)
    elements.forEach(element => {
      if (element.textContent) {
        let newText = element.textContent
        for (const [chinese, korean] of Object.entries(translations)) {
          newText = newText.replace(new RegExp(chinese, 'g'), korean)
        }
        if (newText !== element.textContent) {
          element.textContent = newText
        }
      }
    })
  })

  // 4. 드롭다운 메뉴 항목들 강제 변경 (더 적극적)
  const dropdownItems = mdEditor.querySelectorAll('.md-editor-dropdown-item, [data-type], .md-editor-toolbar-item, .md-editor-dropdown .md-editor-dropdown-item')
  dropdownItems.forEach(item => {
    if (item.textContent) {
      let newText = item.textContent
      for (const [chinese, korean] of Object.entries(translations)) {
        newText = newText.replace(new RegExp(chinese, 'g'), korean)
      }
      if (newText !== item.textContent) {
        item.textContent = newText
      }
    }
  })

  // 드롭다운 메뉴 전체 강제 수정
  const allDropdowns = mdEditor.querySelectorAll('.md-editor-dropdown')
  allDropdowns.forEach(dropdown => {
    const items = dropdown.querySelectorAll('.md-editor-dropdown-item, [data-type]')
    items.forEach(item => {
      if (item.textContent) {
        let newText = item.textContent
        // 중국어를 한국어로 강제 변경
        newText = newText.replace(/添加链接/g, '링크 추가')
        newText = newText.replace(/上传图片/g, '이미지 업로드')
        newText = newText.replace(/裁剪上传/g, '크롭 업로드')
        newText = newText.replace(/行内公式/g, '인라인 수식')
        newText = newText.replace(/块级公式/g, '블록 수식')
        newText = newText.replace(/流程图/g, '플로우차트')
        newText = newText.replace(/时序图/g, '시퀀스 다이어그램')
        newText = newText.replace(/甘特图/g, '간트 차트')
        newText = newText.replace(/类图/g, '클래스 다이어그램')
        newText = newText.replace(/状态图/g, '상태 다이어그램')
        newText = newText.replace(/饼图/g, '파이 차트')
        newText = newText.replace(/关系图/g, '관계 다이어그램')
        newText = newText.replace(/旅程图/g, '여정 맵')
        
        if (newText !== item.textContent) {
          item.textContent = newText
        }
      }
    })
  })

  // 5. 특정 문제 해결 (1, 14, 18, 22번 항목 집중)
  
  // 1번 항목 - 굵게 버튼 (B)
  const boldButton = mdEditor.querySelector('.md-editor-toolbar button:nth-child(1)')
  if (boldButton) {
    boldButton.setAttribute('title', '굵게')
    if (boldButton.textContent) {
      boldButton.textContent = boldButton.textContent.replace(/[가굵粗体]/g, '굵게')
    }
  }

  // 14번 항목 - 이미지 버튼
  const imageButton = mdEditor.querySelector('.md-editor-toolbar button:nth-child(14)')
  if (imageButton) {
    imageButton.setAttribute('title', '이미지')
    if (imageButton.textContent) {
      imageButton.textContent = imageButton.textContent.replace(/[图片]/g, '이미지')
    }
    
    // 이미지 드롭다운 메뉴 항목들도 수정
    const imageDropdown = mdEditor.querySelector('.md-editor-dropdown[data-type="image"]')
    if (imageDropdown) {
      const dropdownItems = imageDropdown.querySelectorAll('.md-editor-dropdown-item')
      dropdownItems.forEach(item => {
        if (item.textContent?.includes('添加链接')) {
          item.textContent = item.textContent.replace('添加链接', '링크 추가')
        }
        if (item.textContent?.includes('上传图片')) {
          item.textContent = item.textContent.replace('上传图片', '이미지 업로드')
        }
        if (item.textContent?.includes('裁剪上传')) {
          item.textContent = item.textContent.replace('裁剪上传', '크롭 업로드')
        }
      })
    }
  }

  // 18번 항목 - katex 수학식 버튼
  const katexButton = mdEditor.querySelector('.md-editor-toolbar button:nth-child(18)')
  if (katexButton) {
    katexButton.setAttribute('title', '수학식')
    if (katexButton.textContent) {
      katexButton.textContent = katexButton.textContent.replace(/[katex公式]/g, '수학식')
    }
    
    // katex 드롭다운 메뉴 항목들도 수정
    const katexDropdown = mdEditor.querySelector('.md-editor-dropdown[data-type="katex"]')
    if (katexDropdown) {
      const dropdownItems = katexDropdown.querySelectorAll('.md-editor-dropdown-item')
      dropdownItems.forEach(item => {
        if (item.textContent?.includes('行内公式')) {
          item.textContent = item.textContent.replace('行内公式', '인라인 수식')
        }
        if (item.textContent?.includes('块级公式')) {
          item.textContent = item.textContent.replace('块级公式', '블록 수식')
        }
      })
    }
  }

  // 22번 항목 - 저장 버튼
  const saveButton = mdEditor.querySelector('.md-editor-toolbar button:nth-child(22)')
  if (saveButton) {
    saveButton.setAttribute('title', '저장')
    if (saveButton.textContent) {
      saveButton.textContent = saveButton.textContent.replace(/[保存]/g, '저장')
    }
  }

  // 추가: 모든 툴바 버튼의 title 속성 강제 수정
  const allToolbarButtons = mdEditor.querySelectorAll('.md-editor-toolbar button')
  allToolbarButtons.forEach((button, index) => {
    const title = button.getAttribute('title')
    if (title) {
      let newTitle = title
      // 중국어를 한국어로 변경
      newTitle = newTitle.replace(/[粗体]/g, '굵게')
      newTitle = newTitle.replace(/[图片]/g, '이미지')
      newTitle = newTitle.replace(/[katex公式]/g, '수학식')
      newTitle = newTitle.replace(/[保存]/g, '저장')
      newTitle = newTitle.replace(/[行内公式]/g, '인라인 수식')
      newTitle = newTitle.replace(/[块级公式]/g, '블록 수식')
      newTitle = newTitle.replace(/[后退]/g, '실행 취소')
      newTitle = newTitle.replace(/[屏幕]/g, '화면')
      
      if (newTitle !== title) {
        button.setAttribute('title', newTitle)
      }
    }
  })

  // "后退" 버튼 특별 처리
  const undoButtons = mdEditor.querySelectorAll('.md-editor-toolbar button[title*="后退"]')
  undoButtons.forEach(button => {
    button.setAttribute('title', '실행 취소')
  })

  // "屏幕 전체 화면" 버튼 특별 처리
  const fullscreenButtons = mdEditor.querySelectorAll('.md-editor-toolbar button[title*="屏幕"]')
  fullscreenButtons.forEach(button => {
    const title = button.getAttribute('title')
    if (title) {
      let newTitle = title.replace(/屏幕/g, '화면')
      if (newTitle.includes('화면 전체 화면')) {
        newTitle = '전체 화면'
      }
      button.setAttribute('title', newTitle)
    }
  })

  // 6. 모든 툴팁 강제 수정
  const allTooltips = mdEditor.querySelectorAll('[title]')
  allTooltips.forEach(element => {
    const title = element.getAttribute('title')
    if (title) {
      let newTitle = title
      for (const [chinese, korean] of Object.entries(translations)) {
        newTitle = newTitle.replace(new RegExp(chinese, 'g'), korean)
      }
      if (newTitle !== title) {
        element.setAttribute('title', newTitle)
      }
    }
  })
}

onMounted(() => {
  setTimeout(translateChineseToKorean, 500)
  setTimeout(translateChineseToKorean, 1000)
  setTimeout(translateChineseToKorean, 2000)
  setInterval(translateChineseToKorean, 1000)
  
  // 드롭다운 메뉴 전용 번역 함수 (강화된 버전)
  function translateDropdownMenus() {
    const dropdowns = document.querySelectorAll('.md-editor-dropdown')
    dropdowns.forEach(dropdown => {
      const items = dropdown.querySelectorAll('.md-editor-dropdown-item')
      items.forEach(item => {
        if (item.textContent) {
          let newText = item.textContent
          
          // 중국어+한국어 혼합 텍스트 처리
          newText = newText.replace(/添加링크/g, '링크 추가')
          newText = newText.replace(/上传이미지/g, '이미지 업로드')
          newText = newText.replace(/크롭 업로드/g, '크롭 업로드')
          
          // 순수 중국어 텍스트 처리
          newText = newText.replace(/添加链接/g, '링크 추가')
          newText = newText.replace(/上传图片/g, '이미지 업로드')
          newText = newText.replace(/裁剪上传/g, '크롭 업로드')
          newText = newText.replace(/行内公式/g, '인라인 수식')
          newText = newText.replace(/块级公式/g, '블록 수식')
          newText = newText.replace(/流程图/g, '플로우차트')
          newText = newText.replace(/时序图/g, '시퀀스 다이어그램')
          newText = newText.replace(/甘特图/g, '간트 차트')
          newText = newText.replace(/类图/g, '클래스 다이어그램')
          newText = newText.replace(/状态图/g, '상태 다이어그램')
          newText = newText.replace(/饼图/g, '파이 차트')
          newText = newText.replace(/关系图/g, '관계 다이어그램')
          newText = newText.replace(/旅程图/g, '여정 맵')
          
          // 개별 중국어 문자 처리
          newText = newText.replace(/添加/g, '추가')
          newText = newText.replace(/上传/g, '업로드')
          newText = newText.replace(/裁剪/g, '크롭')
          newText = newText.replace(/链接/g, '링크')
          newText = newText.replace(/图片/g, '이미지')
          
          if (newText !== item.textContent) {
            item.textContent = newText
          }
        }
      })
    })
    
    // 추가: 모든 드롭다운 메뉴 항목 강제 수정
    const allDropdownItems = document.querySelectorAll('.md-editor-dropdown .md-editor-dropdown-item')
    allDropdownItems.forEach(item => {
      if (item.textContent) {
        let text = item.textContent
        // 중국어+한국어 혼합 텍스트 강제 교체
        if (text.includes('添加') && text.includes('링크')) {
          item.textContent = '링크 추가'
        } else if (text.includes('上传') && text.includes('이미지')) {
          item.textContent = '이미지 업로드'
        } else if (text.includes('크롭') && text.includes('업로드')) {
          item.textContent = '크롭 업로드'
        }
      }
    })
  }

  // MutationObserver로 실시간 DOM 변경 감지
  const observer = new MutationObserver((mutations) => {
    let shouldTranslate = false
    mutations.forEach((mutation) => {
      if (mutation.type === 'childList' || mutation.type === 'characterData') {
        shouldTranslate = true
      }
    })
    if (shouldTranslate) {
      setTimeout(translateChineseToKorean, 100)
      setTimeout(translateDropdownMenus, 150)
    }
  })
  
  // md-editor 영역 감시
  const mdEditor = document.querySelector('.md-editor')
  if (mdEditor) {
    observer.observe(mdEditor, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ['title']
    })
    
    // 드롭다운 메뉴 클릭 이벤트 리스너 추가
    mdEditor.addEventListener('click', (event) => {
      const target = event.target
      if (target.classList.contains('md-editor-toolbar-item') || 
          target.closest('.md-editor-toolbar-item')) {
        // 드롭다운 메뉴가 열릴 때까지 잠시 기다린 후 번역 실행
        setTimeout(translateDropdownMenus, 200)
        setTimeout(translateDropdownMenus, 500)
        setTimeout(translateDropdownMenus, 1000)
      }
    })
  }
  
  // 페이지 언마운트 시 observer 정리
  onUnmounted(() => {
    observer.disconnect()
  })
})
</script>
