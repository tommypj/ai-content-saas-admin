import { ActivityItem } from '../types';

export const useDashboardConstants = () => {
  const recentActivities: ActivityItem[] = [
    { id: '1', type: 'user_registered', message: 'New user registration: john@example.com', time: '2 minutes ago', severity: 'info' as const },
    { id: '2', type: 'content_generated', message: 'Article generated: "React Best Practices"', time: '5 minutes ago', severity: 'success' as const },
    { id: '3', type: 'error_occurred', message: 'AI service timeout for user ID: 12345', time: '8 minutes ago', severity: 'error' as const },
    { id: '4', type: 'subscription_changed', message: 'User upgraded to Pro plan: sarah@company.com', time: '12 minutes ago', severity: 'success' as const },
    { id: '5', type: 'admin_action', message: 'User suspended: spammer@fake.com', time: '15 minutes ago', severity: 'warning' as const }
  ];

  return {
    recentActivities
  };
};