import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { Layout } from "./components/layouts/Layout";
import GuestHome from "../src/pages/GuestHome";
import MovieDetails from "./pages/MovieDetails";
import TvShowDetails from "./pages/TvShowDetails";
import AllMedia from "./pages/AllMedia";
import SearchResults from "./pages/SearchResults";
import MediaDetails from "./pages/MediaDetails";
import LoginPage from "./components/layouts/Auth/LoginPage";
import Profile from "./pages/Profile";
import LatestMovies from "./pages/LatestMovies";
import RegisterPage from "./components/layouts/Auth/RegisterPage";
import ProtectedRoute from "./utils/ProtectedRoute";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />}></Route>
          <Route path="/register" element={<RegisterPage />}></Route>
          <Route path="/" element={<Layout />}>
            <Route index element={<GuestHome />}></Route>
            <Route path="/latest-movies" element={<LatestMovies />}></Route>
            <Route path="/all-media" element={<AllMedia />}></Route>
            <Route path="/search" element={<SearchResults />} />
            <Route path="/movies/:id" element={<MovieDetails />} />
            <Route path="/tv/:id" element={<TvShowDetails />} />
            <Route path="/media/:mediaType/:id" element={<MediaDetails />} />
          </Route>

          <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/wishlist"  />
              <Route path="/viewhistory" />
              <Route path="/update-profile" />
            </Route>
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
