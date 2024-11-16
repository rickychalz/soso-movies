import { useState, useEffect } from 'react';
import { 
  BarChart,
  Bar,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ResponsiveContainer 
} from 'recharts';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

// Types
type ViewHistoryEntry = {
  id: string;
  movieId: string;
  title: string;
  viewedAt: string;
  type: 'movie' | 'tv';
};

type DailyStats = {
  date: string;
  movies: number;
  tvShows: number;
  total: number;
  displayDate: string;
};

const ViewHistory = () => {
  const [viewHistory, setViewHistory] = useState<ViewHistoryEntry[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyStats[]>([]);

  // Load view history from localStorage on component mount
  useEffect(() => {
    const storedHistory = localStorage.getItem('viewHistory');
    if (storedHistory) {
      setViewHistory(JSON.parse(storedHistory));
    }
  }, []);

  // Calculate daily stats for the last 7 days whenever view history changes
  useEffect(() => {
    // Create array of last 7 days
    const last7Days = Array.from({length: 7}, (_, i) => {
      const date = new Date();
      date.setHours(0, 0, 0, 0);
      date.setDate(date.getDate() - i);
      return date;
    }).reverse();

    // Initialize stats object with all days
    const stats = last7Days.reduce((acc: { [key: string]: DailyStats }, date) => {
      const dateStr = date.toISOString().split('T')[0];
      const displayDate = date.toLocaleDateString('en-US', { 
        weekday: 'short',
        month: 'short',
        day: 'numeric'
      });
      
      acc[dateStr] = {
        date: dateStr,
        displayDate,
        movies: 0,
        tvShows: 0,
        total: 0
      };
      return acc;
    }, {});

    // Fill in actual view data
    viewHistory.forEach(view => {
      const dateStr = new Date(view.viewedAt).toISOString().split('T')[0];
      if (stats[dateStr]) {
        if (view.type === 'movie') {
          stats[dateStr].movies += 1;
        } else {
          stats[dateStr].tvShows += 1;
        }
        stats[dateStr].total += 1;
      }
    });

    // Convert to array and sort by date
    setDailyStats(Object.values(stats).sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    ));
  }, [viewHistory]);

  // Function to record a new view
  const recordView = (mediaInfo: { 
    id: string, 
    title: string, 
    type: 'movie' | 'tv' 
  }) => {
    const newView: ViewHistoryEntry = {
      id: `${mediaInfo.id}-${Date.now()}`,
      movieId: mediaInfo.id,
      title: mediaInfo.title,
      type: mediaInfo.type,
      viewedAt: new Date().toISOString()
    };

    const updatedHistory = [...viewHistory, newView];
    setViewHistory(updatedHistory);
    localStorage.setItem('viewHistory', JSON.stringify(updatedHistory));
  };

  // Function to clear history
  const clearHistory = () => {
    setViewHistory([]);
    localStorage.removeItem('viewHistory');
  };

  return (
    <div className="w-full space-y-6 my-12">
      <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
        <CardHeader>
          <CardTitle>Viewing Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats[dailyStats.length - 1]?.total || 0}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Movies Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats[dailyStats.length - 1]?.movies || 0}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  TV Shows Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {dailyStats[dailyStats.length - 1]?.tvShows || 0}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyStats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="displayDate" 
                  tick={{ fill: '#ffffff' }}
                />
                <YAxis 
                  tick={{ fill: '#ffffff' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1e1e1e',
                    border: 'none',
                    color: '#ffffff'
                  }}
                />
                <Legend />
                <Bar 
                  dataKey="movies" 
                  fill="#14b8a6" 
                  name="Movies"
                />
                <Bar 
                  dataKey="tvShows" 
                  fill="#0d9488" 
                  name="TV Shows"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Recent Views</CardTitle>
            <button
              onClick={clearHistory}
              className="px-3 py-1 text-sm text-red-500 hover:text-red-700"
            >
              Clear History
            </button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {viewHistory.slice(-5).reverse().map((entry) => (
              <div 
                key={entry.id} 
                className="flex justify-between items-center p-4 border rounded"
              >
                <div>
                  <p className="font-medium">{entry.title}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(entry.viewedAt).toLocaleDateString()} {" "}
                    {new Date(entry.viewedAt).toLocaleTimeString()}
                  </p>
                </div>
                <div className="px-2 py-1 rounded bg-gray-100">
                  {entry.type === 'movie' ? 'Movie' : 'TV Show'}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewHistory;