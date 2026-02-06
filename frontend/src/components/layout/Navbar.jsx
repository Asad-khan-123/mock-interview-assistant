import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import {
  Home,
  Video,
  Code2,
  BarChart3,
  User,
  LogOut,
} from "lucide-react";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8000/api/v1/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        }
      });
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed");
    }
  };

  return (
    <nav className="w-full bg-[#0B1C2D]/95 backdrop-blur 
    border-b border-[#1F3B5B] px-10 py-4 flex items-center justify-between">

      {/* LOGO */}
      <h2 className="text-xl font-bold tracking-wide text-[#E6F1FF]">
        Inter<span className="text-[#3FD1FF]">Vysiz</span>
      </h2>

      {/* NAV LINKS */}
      <div className="hidden md:flex gap-8">
        <NavItem to="/" icon={<Home size={18} />} label="Home" path={location.pathname} />
        <NavItem to="/interview" icon={<Video size={18} />} label="Interview" path={location.pathname} />
        <NavItem to="/coding" icon={<Code2 size={18} />} label="Coding" path={location.pathname} />
        <NavItem to="/feedback" icon={<BarChart3 size={18} />} label="Feedback" path={location.pathname} />
      </div>

      {/* PROFILE */}
      <div className="relative">
        <div
          onClick={() => setOpen(!open)}
          className="w-10 h-10 rounded-full bg-gradient-to-br 
          from-[#3FD1FF] to-[#38BDF8] 
          flex items-center justify-center text-[#0B1C2D] 
          font-bold cursor-pointer 
          hover:shadow-[0_0_15px_#3FD1FF] transition"
        >
          A
        </div>

        {open && (
          <div className="absolute right-0 mt-3 w-48 bg-[#102A43]
          border border-[#1F3B5B] rounded-xl shadow-2xl overflow-hidden
          animate-fade-in">

            <div className="px-4 py-3 border-b border-[#1F3B5B]">
              <p className="text-sm font-medium text-[#E6F1FF]">Asad Khan</p>
              <p className="text-xs text-[#9FB3C8]">Interview Candidate</p>
            </div>

            <button
              onClick={() => navigate("/profile")}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm 
              text-[#E6F1FF] hover:bg-[#0B1C2D]"
            >
              <User size={16} /> Profile
            </button>

            <button
              onClick={handleLogout}
              className="flex items-center gap-2 w-full px-4 py-3 text-sm 
              text-red-400 hover:bg-red-500/10"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
}

/* NAV ITEM COMPONENT */
function NavItem({ to, icon, label, path }) {
  const active = path === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-2 text-sm font-medium 
      transition relative
      ${active ? "text-[#3FD1FF]" : "text-[#9FB3C8] hover:text-[#3FD1FF]"}`}
    >
      {icon}
      {label}

      {/* underline */}
      <span
        className={`absolute -bottom-1 left-0 h-[2px] bg-[#3FD1FF] transition-all
        ${active ? "w-full" : "w-0 group-hover:w-full"}`}
      />
    </Link>
  );
}