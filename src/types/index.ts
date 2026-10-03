export type ViewId = 'overview' | 'projects' | 'analytics' | 'team' | 'settings';

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'Infrastructure' | 'Frontend' | 'Core Platform' | 'Data Pipeline' | 'Design System';
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'Planning' | 'In Progress' | 'Review' | 'Completed';
  progress: number; // 0 to 100
  dueDate: string;
  lead: {
    name: string;
    role: string;
    avatar: string;
  };
  team: Array<{
    name: string;
    avatar: string;
  }>;
  budget: string;
  tasksCount: number;
  completedTasksCount: number;
  tags: string[];
}

export interface ActivityItem {
  id: string;
  user: {
    name: string;
    avatar: string;
    initials: string;
  };
  action: string;
  target: string;
  category: string;
  timestamp: string;
  type: 'deploy' | 'commit' | 'task' | 'review' | 'alert';
}

export interface MetricCard {
  id: string;
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  timeframe: string;
  category: string;
  description: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  department: 'Engineering' | 'Product' | 'Design' | 'Operations' | 'Leadership';
  email: string;
  avatar: string;
  initials: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  timezone: string;
  activeProjects: string[];
  bio: string;
  skills: string[];
}

export interface EndpointMetric {
  id: string;
  endpoint: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  requests: number;
  latencyMs: number;
  errorRate: number;
  status: 'healthy' | 'degraded' | 'critical';
  service: string;
}

export interface SettingItem {
  id: string;
  category: 'General' | 'Notifications' | 'Security' | 'Appearance' | 'API & Webhooks';
  title: string;
  description: string;
  keywords: string[];
  type: 'toggle' | 'select' | 'input';
  value: boolean | string;
  options?: string[];
}

export interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  read: boolean;
  type: 'system' | 'mention' | 'update';
}
