import useAuthStore from '@/store/auth-context';
import React, { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface ViewData {
  date: string;
  tvShows: number;
  movies: number;
  total: number;
}

const API_BASE_URL = "http://localhost:8000";

const ViewsChart: React.FC = () => {
  const [viewData, setViewData] = useState<ViewData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchViewHistory = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/view-history?days=7`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch view history');
        }

        const data = await response.json();
        setViewData(data);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchViewHistory();
  }, []);

  if (isLoading) {

    return<div className='flex justify-center items-center'><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-600" /></div> ;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="w-full h-[500px] p-4 mt-12">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={viewData}>
          <XAxis 
            dataKey="date" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#666', fontSize: 12 }}
          />
          <Tooltip 
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              border: 'none',
              borderRadius: '8px',
              padding: '10px'
            }}
          />
          
          <Bar 
            dataKey="movies" 
            fill="#8884d8" 
            name="Movies"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="tvShows" 
            fill="#82ca9d" 
            name="TV Shows"
            radius={[4, 4, 0, 0]}
          />
          <Bar 
            dataKey="total" 
            fill="#ffc658" 
            name="Total Views"
            radius={[4, 4, 0, 0]}
          />
          <Legend 
            verticalAlign="bottom" 
            height={24}
            wrapperStyle={{
              paddingBottom: '20px'
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ViewsChart;