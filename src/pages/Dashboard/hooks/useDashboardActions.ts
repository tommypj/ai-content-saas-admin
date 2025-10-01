import { useEffect } from 'react';
import { useDashboardStore } from '../../../store/ui';
import { useUIStore } from '../../../store/ui';
import { SystemStats } from '../types';

export const useDashboardActions = (
  stats: SystemStats | undefined,
  isLoading: boolean,
  error: any,
  handleRefresh: () => void
) => {
  const { setStats, setLoading, setError } = useDashboardStore();
  const { addNotification } = useUIStore();

  useEffect(() => {
    setLoading(isLoading);
    if (error) {
      setError(error.message);
    } else if (stats) {
      setStats(stats);
      setError(null);
    }
  }, [stats, isLoading, error, setStats, setLoading, setError]);

  const onRefresh = () => {
    handleRefresh();
    addNotification({
      type: 'info',
      title: 'Refreshing Dashboard',
      message: 'Updating all metrics...'
    });
  };

  const getStatCardColor = (type: string) => {
    switch (type) {
      case 'users': return 'border-l-blue-500 bg-blue-50';
      case 'content': return 'border-l-green-500 bg-green-50';
      case 'revenue': return 'border-l-purple-500 bg-purple-50';
      case 'performance': return 'border-l-orange-500 bg-orange-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  return {
    onRefresh,
    getStatCardColor
  };
};