import { Link } from "react-router-dom";
import { IoMenu } from "react-icons/io5";
import { RxCross2 } from "react-icons/rx";
import { useState, useRef, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { signOut } from "../store/actions/auth";

const Header = () => {

  const {user, isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch()
  const menuRef = useRef();
  const headerRef = useRef();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);

  const handleMobileOpen = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleClickOutside = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMobileOpen(false);
    }
  };

  // Calculate header height
  const updateHeaderHeight = () => {
    if (headerRef.current) {
      setHeaderHeight(headerRef.current.offsetHeight);
    }
  };

  useEffect(() => {
    // Initial calculation
    updateHeaderHeight();

    // Recalculate on window resize
    const handleResize = () => {
      updateHeaderHeight();
    };

    document.addEventListener("mousedown", handleClickOutside);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Also update height when mobile menu state changes (in case header content changes)
  useEffect(() => {
    updateHeaderHeight();
  }, [mobileOpen]);

  const signOutUser = () => {
    console.log('dispatching...')
    dispatch(signOut());
  };

  return (
    <>
      {/* Header */}
      <div
        ref={headerRef}
        className="bg-[rgba(30,41,59,0.8)] py-6 px-8 md:px-20
                    border-b border-white/30 fixed top-0 z-[1000] w-[100%] backdrop-blur-[20px]"
      >
        <div className="flex justify-between items-center">
          <div>
            <Link to="/">
              <h1 className="text-2xl font-bold before:content-['📹'] before:mr-2">
                PeerLink
              </h1>
            </Link>
          </div>

          <div className="hidden md:block">
            <ul className="flex justify-center items-center gap-8">
              <li>
                <Link
                    to='/'
                  className="text-[rgba(255, 255, 255, 0.8)] font-medium hover:text-[#667eea]
                                    transition-colors duration-300 ease-in-out"
                >
                  Home
                </Link>
              </li>
              {user && (
                <li>
                <Link
                    to='/dashboard'
                  className="text-[rgba(255, 255, 255, 0.8)] font-medium hover:text-[#667eea]
                                    transition-colors duration-300 ease-in-out"
                >
                  Dashboard
                </Link>
              </li>
              )

              }
              <li>
                <Link
                  className="text-[rgba(255, 255, 255, 0.8)] font-medium hover:text-[#667eea]
                                    transition-colors duration-300 ease-in-out"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  className="text-[rgba(255, 255, 255, 0.8)] font-medium hover:text-[#667eea]
                                    transition-colors duration-300 ease-in-out"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="hidden md:block">
            {!isAuthenticated ? (
              <div className="flex gap-8">
                <Link to="/auth">
                  <button
                    className="text-[0.9rem] bg-transparent py-3 px-6 rounded-xl 
                                font-semibold cursor-pointer transition-all duration-300 
                                ease-in-out text-[rgba(255,255,255,0.9)] border border-[rgba(255,255,255,0.2)]
                                hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]"
                  >
                    Login
                  </button>
                </Link>

                <Link to="/auth">
                  <button
                    className="text-[0.9rem] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] 
                                shadow-[0_4px_15px_rgba(102,126,234,0.3)] py-3 px-6 rounded-xl 
                                font-semibold cursor-pointer transition-all duration-300 
                                ease-in-out text-white
                                hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)]"
                  >
                    Register
                  </button>
                </Link>
              </div>
            ) : (
              <div className="flex gap-8">
                <button
                onClick={signOutUser}
                    className="text-[0.9rem] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] 
                                shadow-[0_4px_15px_rgba(102,126,234,0.3)] py-3 px-6 rounded-xl 
                                font-semibold cursor-pointer transition-all duration-300 
                                ease-in-out text-white
                                hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)]"
                  >
                    Logout
                  </button>
              </div>
            )}
          </div>

          {!mobileOpen && (
            <div
              className="md:hidden text-2xl cursor-pointer"
              onClick={() => handleMobileOpen()}
            >
              <IoMenu />
            </div>
          )}

          {mobileOpen && (
            <div
              className="md:hidden text-2xl cursor-pointer"
              onClick={() => handleMobileOpen()}
            >
              <RxCross2 />
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu  */}
      <div
        className={`${mobileOpen ? "block mobile-menu-active" : "hidden"} 
                    bg-[rgba(30,41,59,0.8)] backdrop-blur-[20px]
                    fixed right-0 left-0 z-[999]
                    shadow-[0_10px_30px_rgba(0, 0, 0, 0.3)]`}
        style={{ top: `${headerHeight}px` }}
        ref={menuRef}
      >
        <div className="px-6 py-4">
          <ul className="flex flex-col justify-center">
            <li
              className="border-b border-b-[rgba(255,255,255,0.05)] rounded-xl p-4"
              onClick={() => handleMobileOpen()}
            >
              <Link
              to='/'
                className="text-[rgba(255,255,255,0.8)] font-medium hover:text-[#667eea]
                                transition-colors duration-300 ease-in-out"
              >
                Home
              </Link>
            </li>
            <li
              className="border-b border-b-[rgba(255,255,255,0.05)] rounded-xl p-4"
              onClick={() => handleMobileOpen()}
            >
              <Link
                className="text-[rgba(255,255,255,0.8)] font-medium hover:text-[#667eea]
                                transition-colors duration-300 ease-in-out"
              >
                About
              </Link>
            </li>
            <li className="p-4" onClick={() => handleMobileOpen()}>
              <Link
                className="text-[rgba(255,255,255,0.8)] font-medium hover:text-[#667eea]
                                transition-colors duration-300 ease-in-out"
              >
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="border-t border-t-white/30 p-6">
          {!isAuthenticated ? (
            <div className="flex flex-col gap-4">
              <div onClick={() => handleMobileOpen()}>
            <Link
            to='/auth'
              className="w-full block text-center text-[0.9rem] bg-transparent py-3 px-6 rounded-xl 
                            font-semibold cursor-pointer transition-all duration-300 
                            ease-in-out text-[rgba(255,255,255,0.9)] border border-[rgba(255,255,255,0.2)]
                            hover:bg-[rgba(255,255,255,0.1)] hover:border-[rgba(255,255,255,0.3)]"
            >
              Login
            </Link>
          </div>

          <div onClick={() => handleMobileOpen()}>
            <Link
            to='/auth'
              className="w-full block text-center text-[0.9rem] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] 
                            shadow-[0_4px_15px_rgba(102,126,234,0.3)] py-3 px-6 rounded-xl 
                            font-semibold cursor-pointer transition-all duration-300 
                            ease-in-out text-white
                            hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)]"
            >
              Register
            </Link>
          </div>
            </div>
          ):(
            <div onClick={() => handleMobileOpen()}>
            <button
              onClick={signOutUser}
              className="w-full block text-center text-[0.9rem] bg-[linear-gradient(135deg,#667eea_0%,#764ba2_100%)] 
                            shadow-[0_4px_15px_rgba(102,126,234,0.3)] py-3 px-6 rounded-xl 
                            font-semibold cursor-pointer transition-all duration-300 
                            ease-in-out text-white
                            hover:translate-y-[-2px] hover:shadow-[0_8px_25px_rgba(102,126,234,0.4)]"
            >
              Logout
            </button>
          </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Header;
