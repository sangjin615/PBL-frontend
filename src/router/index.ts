import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
  },
  {
    path: '/courses',
    name: 'courses',
    component: () => import('../views/CoursesView.vue'),
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component: () => import('../views/DashboardView.vue'),
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
  },
  {
    path: '/learn/:lessonId',
    name: 'learning',
    component: () => import('../views/LearningView.vue'),
  },
  {
    path: '/problem/:problemId',
    name: 'problem',
    component: () => import('../views/ProblemView.vue'),
  },
  {
    path: '/problem/:problemId/result',
    name: 'problem-result',
    component: () => import('../views/ProblemResultView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
