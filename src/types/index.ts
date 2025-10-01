// Admin User Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'moderator' | 'analyst';
  permissions: string[];
  twoFactorEnabled: boolean;
  lastLogin: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdminLoginRequest {
  email: string;
  password: string;
  twoFactorToken?: string;
}

export interface AdminLoginResponse {
  user: AdminUser;
  token: string;
  refreshToken: string;
}

// User Management Types
export interface User {
  id: string;
  username: string;
  email: string;
  displayName?: string;
  plan: 'free' | 'pro' | 'enterprise';
  status: 'active' | 'suspended' | 'banned';
  isVerified: boolean;
  totalJobs: number;
  tokensUsed: number;
  revenue: number;
  lastActive: Date;
  registrationDate: Date;
  profile?: {
    firstName?: string;
    lastName?: string;
    company?: string;
    jobTitle?: string;
    location?: string;
    avatar?: string;
  };
  subscription?: {
    plan: string;
    status: string;
    currentPeriodStart?: Date;
    currentPeriodEnd?: Date;
    stripeCustomerId?: string;
  };
}

export interface UserListFilters {
  search?: string;
  plan?: string;
  status?: string;
  registrationDate?: {
    from: Date;
    to: Date;
  };
  lastActive?: {
    from: Date;
    to: Date;
  };
  usageLevel?: 'low' | 'medium' | 'high';
  sortBy?: 'created' | 'lastActive' | 'usage' | 'revenue';
  sortOrder?: 'asc' | 'desc';
  page: number;
  limit: number;
}

export interface UserAction {
  userId: string;
  action: 'suspend' | 'unsuspend' | 'ban' | 'delete' | 'reset_password' | 'change_plan';
  reason?: string;
  duration?: number;
  newPlan?: string;
}

// System Analytics Types
export interface SystemStats {
  totalUsers: number;
  activeUsers: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
  totalContentGroups: number;
  totalJobsProcessed: number;
  totalJobsToday: number;
  totalJobsThisWeek: number;
  totalJobsThisMonth: number;
  avgJobProcessingTime: number;
  systemUptime: number;
  aiTokensUsed: number;
  aiTokensToday: number;
  aiTokensThisWeek: number;
  aiTokensThisMonth: number;
  monthlyRevenue: number;
  conversionRate: number;
  errorRate: number;
  cpuUsage: number;
  memoryUsage: number;
  diskUsage: number;
}

export interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

export interface AnalyticsData {
  userGrowth: ChartDataPoint[];
  contentGeneration: ChartDataPoint[];
  revenueGrowth: ChartDataPoint[];
  tokenUsage: ChartDataPoint[];
  errorRates: ChartDataPoint[];
}

// Content Management Types
export interface ContentGroup {
  id: string;
  userId: string;
  userEmail: string;
  title: string;
  topic: string;
  description?: string;
  status: 'DRAFT' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED';
  completionPercentage: number;
  createdAt: Date;
  updatedAt: Date;
  isFlagged: boolean;
  flagReason?: string;
  keywordsCount: number;
  articleWordCount: number;
  seoScore?: number;
  tokensUsed: number;
}

export interface Job {
  id: string;
  userId: string;
  userEmail: string;
  contentGroupId?: string;
  type: 'KEYWORDS' | 'ARTICLE' | 'SEO' | 'META' | 'IMAGE' | 'HASHTAGS';
  status: 'PENDING' | 'RUNNING' | 'SUCCEEDED' | 'FAILED';
  createdAt: Date;
  completedAt?: Date;
  processingTime?: number;
  tokensUsed?: number;
  errorMessage?: string;
  attempt: number;
}

// Billing & Subscription Types
export interface Subscription {
  id: string;
  userId: string;
  userEmail: string;
  plan: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialEnd?: Date;
  amount: number;
  currency: string;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
}

export interface BillingTransaction {
  id: string;
  userId: string;
  userEmail: string;
  amount: number;
  currency: string;
  status: 'succeeded' | 'failed' | 'pending' | 'refunded';
  type: 'subscription' | 'one_time' | 'refund';
  description: string;
  createdAt: Date;
  stripePaymentIntentId?: string;
}

// Usage & Rate Limiting Types
export interface UserUsage {
  userId: string;
  period: string;
  jobs: {
    keywords: number;
    articles: number;
    seo: number;
    meta: number;
    images: number;
    hashtags: number;
    total: number;
  };
  tokens: number;
  apiCalls: number;
  limits: {
    maxJobs: number;
    maxTokens: number;
    maxApiCalls: number;
  };
  overages: {
    jobs: number;
    tokens: number;
    apiCalls: number;
  };
  resetDate: Date;
}

export interface RateLimitViolation {
  id: string;
  userId: string;
  userEmail: string;
  type: 'jobs' | 'tokens' | 'api_calls';
  limit: number;
  actual: number;
  timestamp: Date;
  action: 'warning' | 'throttle' | 'block';
}

// Security & Audit Types
export interface SecurityEvent {
  id: string;
  type: 'login_failure' | 'suspicious_activity' | 'data_breach_attempt' | 'privilege_escalation';
  userId?: string;
  adminUserId?: string;
  ip: string;
  userAgent: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
  resolvedBy?: string;
  resolvedAt?: Date;
}

export interface AuditLog {
  id: string;
  adminUserId: string;
  adminEmail: string;
  action: string;
  resource: string;
  resourceId?: string;
  targetUserId?: string;
  targetUserEmail?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ip: string;
  userAgent: string;
  timestamp: Date;
  success: boolean;
  errorMessage?: string;
}

// Activity Feed Types
export interface ActivityItem {
  id: string;
  type: 'user_registered' | 'content_generated' | 'subscription_changed' | 'error_occurred' | 'admin_action';
  userId?: string;
  userEmail?: string;
  adminUserId?: string;
  adminEmail?: string;
  title: string;
  description: string;
  timestamp: Date;
  severity: 'info' | 'warning' | 'error' | 'success';
  metadata?: Record<string, any>;
}

// API Response Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// Common Types
export interface DateRange {
  from: Date;
  to: Date;
}

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface TableColumn<T = any> {
  key: keyof T | string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T) => React.ReactNode;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'dateRange' | 'number';
  options?: SelectOption[];
  placeholder?: string;
}