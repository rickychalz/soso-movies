import { Search, X } from "lucide-react";
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export const Header = () => {
  const [bgColor, setBgColor] = useState("transparent");
  const [query, setQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const navigate = useNavigate();

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
      setQuery("");
      setIsMobileSearchOpen(false);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleMobileSearch = () => {
    setIsMobileSearchOpen(!isMobileSearchOpen);
  };

  return (
    <>
      <header className="bg-[#121212] w-full fixed z-50 transition-colors duration-300">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-0">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-2 md:gap-12">
              <div className="block lg:hidden">
                <button
                  onClick={toggleMenu}
                  className="rounded bg-teal-600 p-2 text-white transition hover:text-teal-600/75"
                >
                  {isMenuOpen ? (
                    <X className="size-4" />
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-4"
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
                  )}
                </button>
              </div>
              <Link className="block text-white" to="/">
                <span className="font-bold text-2xl">Soso</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:block">
              <nav aria-label="Global">
                <ul className="flex items-center gap-6 text-sm">
                  <li>
                    <Link
                      className="text-gray-300 transition hover:text-gray-100/75 mx-3"
                      to="/"
                    >
                      Home
                    </Link>
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
              {/* Desktop Search */}
              <form
                onSubmit={handleSearchSubmit}
                className="hidden md:flex items-center"
              >
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies"
                  className="bg-transparent text-white border border-white px-3 py-2 rounded-l-lg focus:outline-none focus:ring-0 w-full sm:max-w-xs"
                />
                <button
                  type="submit"
                  className="bg-transparent py-2 border border-white px-2 rounded-r-lg text-white"
                >
                  <Search size={24} />
                </button>
              </form>

              {/* Mobile Search Icon */}
              <button
                onClick={toggleMobileSearch}
                className="text-gray-300 mx-3 md:hidden"
              >
                {isMobileSearchOpen ? <X size={24} /> : <Search size={24} />}
              </button>

              <div className="sm:flex items-center sm:gap-4">
                <div className="flex">
                  <Link
                    to="/login"
                    className="rounded-md bg-teal-600 px-4 py-2 text-sm font-medium text-white"
                  >
                    Get Started
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div className="lg:hidden">
              <nav className="flex flex-col bg-[#121212] py-4">
                <Link
                  to="/"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Home
                </Link>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Discover
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Movie Release
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  Forum
                </a>
                <a
                  href="#"
                  className="block px-4 py-2 text-gray-300 hover:bg-gray-700"
                >
                  About
                </a>
              </nav>
            </div>
          )}

          {/* Mobile Search Bar */}
          {isMobileSearchOpen && (
            <div className="lg:hidden px-2 py-3 bg-[#121212]">
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search for movies"
                  className="bg-transparent text-white border border-white px-3 py-2 rounded-l-lg focus:outline-none focus:ring-0 w-full"
                />
                <button
                  type="submit"
                  className="bg-transparent py-2 border border-white px-2 rounded-r-lg text-white"
                >
                  <Search size={24} />
                </button>
              </form>
            </div>
          )}
        </div>
      </header>
    </>
  );
};

export default Header;
