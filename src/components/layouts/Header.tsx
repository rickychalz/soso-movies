import { Search } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../../store/auth-context"; // Import the useAuthStore hook
import AvatarProfile from "../custom/AvatarProfile"; // Import the Avatar component from shadcn

export const Header = () => {
  const [bgColor, setBgColor] = useState("transparent");
  const [query, setQuery] = useState("");
  const navigate = useNavigate();
  const { isLoggedIn, user } = useAuthStore(); // Get authentication state

  const handleScroll = () => {
    if (window.scrollY > 50) {
      setBgColor("#121212");
    } else {
      setBgColor("transparent");
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?query=${query}`);
      setQuery(""); // Clear the search input after submitting
    }
  };

  // Function to get the first letter of the username
  const getFirstLetter = (username: string) => {
    return username.charAt(0).toUpperCase(); // Get the first letter and make it uppercase
  };

  return (
    <>
      <header
        className={`bg-[${bgColor}] w-full fixed z-50 transition-colors duration-300`}
      >
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-0">
          <div className="flex h-16 items-center justify-between">
            <div className="md:flex md:items-center md:gap-12">
              <a className="block text-white" href="#">
                <span className="font-bold text-2xl">Soso</span>
              </a>
            </div>

            <div className="hidden lg:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <a
                      className="text-gray-300 transition hover:text-gray-100/75 mx-3"
                      href="#"
                    >
                      Home
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-300 transition hover:text-gray-100/75 mx-3"
                      href="#"
                    >
                      Discover
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-300 transition hover:text-gray-100/75 mx-3"
                      href="#"
                    >
                      Movie Release
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-300 transition hover:text-gray-100/75 mx-3"
                      href="#"
                    >
                      Forum
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-gray-300 transition hover:text-gray-100/75 mx-3"
                      href="#"
                    >
                      About
                    </a>
                  </li>
                </ul>
              </nav>
            </div>

            <div className="flex items-center gap-4">
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies"
                  className="bg-gray-800 text-white px-3 py-1.5 rounded-l-md focus:outline-none focus:ring-0"
                />
                <button
                  type="submit"
                  className="bg-teal-600 p-1.5 rounded-r-md text-white"
                >
                  <Search size={22} />
                </button>
              </form>

              {/* For mobile screens */}
              <Search className="text-gray-300 mx-3 md:hidden" />

              <div className="sm:flex items-center sm:gap-4">
                {/* Conditionally render Get Started button or Avatar */}
                {!isLoggedIn ? (
                  <div className="hidden sm:flex">
                    <Link
                      to="/login"
                      className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white"
                      
                    >
                      Get Started
                    </Link>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AvatarProfile
                      image={user?.avatar}
                      username={getFirstLetter(user?.username || '')} // Show the first letter of the username
                    />
                  </div>
                )}
              </div>

              <div className="block lg:hidden">
                <button className="rounded bg-gray-100 p-2 text-gray-600 transition hover:text-gray-600/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="size-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};
