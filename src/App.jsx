import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import Home from "./components/Home/Home.jsx";
import More from "./components/more/more.jsx";
import About from "./components/About/About.jsx";
import Contact from "./components/Contact/Contact.jsx";
import Login from "./components/Login/Login.jsx";
import Register from "./components/Register/Register.jsx";
import ProcessingIcon from "./components/ProcessingIcon/ProcessingIcon.jsx";
import CompleteProfile from "./components/Profile/Profile.jsx";
import MemberProfile from "./components/MemberProfile/MemberProfile.jsx";
import Teams from "./components/Teams/Teams.jsx";
import AdminRequestPage from "./components/AdminRequestPage/AdminRequestPage.jsx";
import AdminProductPage from "./components/AdminProductList/AdminProductPage.jsx";
import { FloatingDock } from "./components/Floating-docs/Floating-docs.jsx";
import VerifyEmail from "./components/verifyemail/VerifyEmail.jsx";
import EmailVerified from "./components/EmailVerified/EmailVerified.jsx";
import AdminBorrowApproval from "./components/BorrowApproval/BorrowApprovalPage.jsx";
import {
  IconUsersGroup,
  IconBoxSeam,
  IconArrowBackUp,
  IconShoppingCart,
  IconListDetails,
} from "@tabler/icons-react";
import BorrowList from "./components/UserBorrowList/UserBorrowList.jsx";
import { MdApproval } from "react-icons/md";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import Inventory from "./components/Inventory/Inventory.jsx";

function AppContent({ sidebarOpen, user }) {
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const API_PORT = import.meta.env.VITE_API_PORT;

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [location]);

  const excludedPaths = ["/login", "/register"];
  const showDock = !excludedPaths.includes(location.pathname);

  // Log current location and user
  console.log("📍 Current path:", location.pathname);
  console.log("👤 Current user:", user);

  const dockItems = [
    { title: "Teams", href: "/teams", icon: <IconUsersGroup /> },
    { title: "My Borrows", href: "/borrow", icon: <IconShoppingCart /> },
    { title: "Inventory", href: "/inventory", icon: <IconBoxSeam /> },
  ];

  if (user?.role === "admin") {
    console.log("✅ User is admin, adding admin dock items...");
    dockItems.push(
      {
        title: "Product Listing",
        href: "/admin/products",
        icon: <IconListDetails />,
      },
      {
        title: "Borrow Approvals",
        href: "/borrow-approval",
        icon: <MdApproval />,
      }
    );
  } else {
    console.log("ℹ️ User is not admin, only showing default dock items.");
  }

  // Log final dockItems array
  console.log("🛠️ Dock items being rendered:", dockItems);

  return (
    <div className="transition-all duration-300">
      <Header sidebarOpen={sidebarOpen} user={user} />
      {loading ? (
        <ProcessingIcon />
      ) : (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<CompleteProfile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/profile/:rollNumber" element={<MemberProfile />} />
          <Route path="/admin/requests" element={<AdminRequestPage />} />
          <Route path="/more" element={<More />} />
          <Route path="/admin/products" element={<AdminProductPage />} />
          <Route path="/borrow" element={<BorrowList />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/borrow-approval" element={<AdminBorrowApproval />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route
            path="/email-verified/:verificationToken"
            element={<EmailVerified />}
          />
        </Routes>
      )}
      {showDock && !loading && <FloatingDock items={dockItems} />}
      <Footer />
    </div>
  );
}

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const API_PORT = import.meta.env.VITE_API_PORT;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        console.log("🔄 Fetching current user from:", `${API_PORT}/api/v1/auth/current-user`);
        const res = await fetch(`${API_PORT}/api/v1/auth/current-user`, {
          method: "POST",
          credentials: "include",
        });
        if (!res.ok) throw new Error("Unauthorized");
        const data = await res.json();
        console.log("✅ User fetched successfully:", data.data);
        setUser(data.data);
      } catch (err) {
        console.warn("⚠️ User not logged in or fetch failed:", err.message);
        setUser(null);
      }
    };

    fetchUser();
  }, []);

  return (
    <ThemeProvider>
      <AppContent sidebarOpen={sidebarOpen} user={user} />
    </ThemeProvider>
  );
}

export default App;