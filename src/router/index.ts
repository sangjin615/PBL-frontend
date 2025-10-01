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
    path: '/subscriptions',
    name: 'subscriptions',
    component: () => import('../views/SubscriptionsView.vue'),
  },
  {
    path: '/my-submissions',
    name: 'my-submissions',
    component: () => import('../views/MySubmissionsView.vue'),
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
    path: '/problem-result/:problemId',
    name: 'problem-result',
    component: () => import('../views/ProblemResultView.vue'),
  },
  {
    path: '/instructor/create-course',
    name: 'instructor-create-course',
    component: () => import('../views/InstructorCreateCourseView.vue'),
  },
  {
    path: '/instructor/create-markdown',
    name: 'instructor-create-markdown',
    component: () => import('../views/InstructorCreateMarkdownView.vue'),
  },
  {
    path: '/instructor/create-problem',
    name: 'instructor-create-problem',
    component: () => import('../views/InstructorCreateProblemView.vue'),
  },
  {
    path: '/instructor/create-video',
    name: 'instructor-create-video',
    component: () => import('../views/InstructorCreateVideoView.vue'),
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
