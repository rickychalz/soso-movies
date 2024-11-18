import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  Navigate,
} from "react-router-dom";
import { GuestLayout } from "./components/layouts/Layout";
import { Layout } from "./components/layouts/DashboardLayout";
import GuestHome from "../src/pages/GuestHome";
import Home from "./pages/Home";

import SearchResults from "./pages/SearchResults";

import LoginPage from "./components/layouts/Auth/LoginPage";
import Profile from "./pages/Profile";
import LatestMovies from "./pages/LatestMovies";
import RegisterPage from "./components/layouts/Auth/RegisterPage";
import useAuthStore from "./store/auth-context";
import Movies from "./pages/Movies";
import TVShows from "./pages/TvShows";

import Details from "./pages/MediaDetails";
import Watchlist from "./pages/Watchlist";
import UpdateProfile from "./pages/UpdateProfile";

const queryClient = new QueryClient();

function App() {
  const { isLoggedIn } = useAuthStore();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Auth routes - accessible when logged out */}
          <Route
            path="/login"
            element={
              isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />
            }
          />
          <Route
            path="/register"
            element={
              isLoggedIn ? (
                <Navigate to="/dashboard" replace />
              ) : (
                <RegisterPage />
              )
            }
          />

          {/* Authenticated routes */}
          {isLoggedIn ? (
            <Route path="/" element={<Layout />}>
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={<Home />} />
              <Route path="/latest-movies" element={<LatestMovies />} />

              <Route path="/search" element={<SearchResults />} />
              <Route path="/watchlist" element={<Watchlist />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/update-profile" element={<UpdateProfile />} />
              <Route path="/movies" element={<Movies />} />
              <Route path="/tv-shows" element={<TVShows />} />

              <Route path="/media/:mediaType/:id" element={<Details />} />
            </Route>
          ) : (
            /* Guest routes */
            <Route path="/" element={<GuestLayout />}>
              <Route index element={<GuestHome />} />
              <Route path="/latest-movies" element={<LatestMovies />} />

              <Route path="/search" element={<SearchResults />} />

              <Route path="/media/:mediaType/:id" element={<Details />} />
              <Route
                path="/profile"
                element={<Navigate to="/login" replace />}
              />
              {/* Redirect dashboard to home for guests */}
              <Route path="/dashboard" element={<Navigate to="/" replace />} />
            </Route>
          )}

          {/* Catch all route */}
          <Route
            path="*"
            element={<Navigate to={isLoggedIn ? "/dashboard" : "/"} replace />}
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
