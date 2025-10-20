import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes: RouteRecordRaw[] = [
  {
    path: '/admin/reports',
    name: 'admin-reports',
    component: () => import('../views/AdminReportsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CoursesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/qna',
    name: 'qna',
    component: () => import('../views/QnAView.vue'),
  },
  {
    path: '/qna/:id',
    name: 'qna-detail',
    component: () => import('../views/QnADetailView.vue'),
  },
  {
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('../views/SubscriptionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/my-submissions',
    name: 'my-submissions',
    component: () => import('../views/MySubmissionsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/course/:id',
    name: 'course-overview',
    component: () => import('../views/CourseOverviewView.vue'),
  },
  {
    path: '/curriculum/:id',
    name: 'curriculum-overview',
    component: () => import('../views/CurriculumOverviewView.vue'),
  },
  {
    path: '/curriculum/:id/learn',
    name: 'curriculum-detail',
    component: () => import('../views/CurriculumDetailView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/learn/:lectureId',
    name: 'lecture',
    component: () => import('../views/LectureView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/problem-result/:problemId',
    name: 'problem-result',
    component: () => import('../views/ProblemResultView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/editor/popout/:lectureId',
    name: 'editor-popout',
    component: () => import('../views/EditorPopoutView.vue'),
  },
  {
    path: '/instructor/create-markdown',
    name: 'instructor-create-markdown',
    component: () => import('../views/InstructorCreateMarkdownView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/instructor/create-problem',
    name: 'instructor-create-problem',
    component: () => import('../views/InstructorCreateProblemView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/instructor/create-video',
    name: 'instructor-create-video',
    component: () => import('../views/InstructorCreateVideoView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/instructor/create-curriculum',
    name: 'instructor-create-curriculum',
    component: () => import('../views/InstructorCreateCurriculumView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/assistant/ai',
    name: 'ai-assistant',
    component: () => import('../views/AiAssistantView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/mypage',
    name: 'mypage',
    component: () => import('../views/MyPageView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/LoginView.vue'),
  },
  {
    path: '/signup',
    name: 'signup',
    component: () => import('../views/SignupView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

// 라우터 가드: 인증이 필요한 페이지 접근 시 로그인 페이지로 리다이렉트
router.beforeEach((to, from, next) => {
  const { isAuthenticated } = useAuth();
  
  // 인증이 필요한 페이지인지 확인
  if (to.meta.requiresAuth) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트 (원래 접근하려던 페이지 정보 포함)
    if (!isAuthenticated.value) {
      console.log('인증이 필요한 페이지에 접근하려고 합니다. 로그인 페이지로 리다이렉트합니다.');
      next({ 
        name: 'login', 
        query: { redirect: to.fullPath } 
      });
      return;
    }
  }
  
  // 이미 로그인된 사용자가 로그인/회원가입 페이지에 접근할 때 대시보드로 리다이렉트
  if ((to.name === 'login' || to.name === 'signup') && isAuthenticated.value) {
    console.log('이미 로그인된 사용자가 로그인/회원가입 페이지에 접근했습니다. 대시보드로 리다이렉트합니다.');
    next({ name: 'dashboard' });
    return;
  }
  
  next();
});

export default router;
