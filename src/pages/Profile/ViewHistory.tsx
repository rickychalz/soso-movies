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

interface WatchlistResponse {
  success: boolean;
  count: number;
}

const ViewHistory = () => {
  const [watchlistCount, setWatchlistCount] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuthStore();

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
                  {0}
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
                  {0}
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
                  {0}
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

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart margin={{ left: 0 }}>
                <XAxis
                  dataKey="displayDate"
                  tick={{ fill: "#ffffff" }}
                  axisLine={{ stroke: "#ffffff" }}
                  padding={{ left: 0, right: 0 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e1e1e",
                    border: "none",
                    color: "#ffffff",
                  }}
                />
                <Legend />
                <Bar dataKey="movies" fill="#14b8a6" name="Movies" />
                <Bar dataKey="tvShows" fill="#0d9488" name="TV Shows" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewHistory;