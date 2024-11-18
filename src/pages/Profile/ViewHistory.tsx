import { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import useAuthStore from "@/store/auth-context";
import ViewsChart from "@/components/custom/Chart";

interface WatchlistResponse {
  success: boolean;
  count: number;
}

interface TodayStats {
  tvShowsViewed: number;
  moviesViewed: number;
  totalViewed: number;
}


const API_BASE_URL = "http://localhost:8000";


const ViewHistory = () => {
  const [watchlistCount, setWatchlistCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<TodayStats>({
    tvShowsViewed: 0,
    moviesViewed: 0,
    totalViewed: 0
  });
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchTodayStats = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/users/today-stats`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch today\'s stats');
        }

        const data = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching today\'s stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTodayStats();
  }, []);

  useEffect(() => {
    const fetchWatchlistCount = async () => {
      try {
        setError(null);
        const response = await fetch(
          `http://localhost:8000/api/users/get-watchlist-count`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${user?.token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error("Failed to fetch watchlist");
        }

        const data: WatchlistResponse = await response.json();
        setWatchlistCount(data.count);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        console.error("Error fetching watchlist:", error);
      }
    };

    fetchWatchlistCount();
  }, [user?.token]);

  return (
    <div className="w-full space-y-6">
      <Card className="bg-[#121212] text-white shadow-none border-none px-4">
        <CardHeader>
          <CardTitle>Viewing Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">
                  Today's Views
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {stats.totalViewed}
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
                  {stats.moviesViewed}
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
                  {stats.tvShowsViewed}
                </div>
              </CardContent>
            </Card>
            <Card className="bg-[#121212] text-white shadow-none border-[#212121]">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">Watchlist</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {watchlistCount}
                </div>
              </CardContent>
            </Card>
          </div>

          <ViewsChart/>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewHistory;