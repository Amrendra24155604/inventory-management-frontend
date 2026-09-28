import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import Header from "./components/Header/Header.jsx";
import Footer from "./components/Footer/Footer.jsx";
import LandingPage from "./components/LandingPage/LandingPage.jsx";
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
import BorrowList from "./components/UserBorrowList/UserBorrowList.jsx";
import Inventory from "./components/Inventory/Inventory.jsx";
import ShapeGrid from "./components/ShapeGrid/ShapeGrid.jsx";

import {
  IconUsersGroup,
  IconBoxSeam,
  IconShoppingCart,
  IconListDetails,
} from "@tabler/icons-react";
import { MdApproval } from "react-icons/md";
import { ThemeProvider } from "./context/ThemeContext.jsx";
import { getCachedUser, fetchCurrentUser } from "./utils/auth.js";

function AppShell({ user }) {
  const location = useLocation();

  const excludedPaths = ["/login", "/register"];
  const hideChrome = excludedPaths.includes(location.pathname);

  const dockItems = [
    { title: "Teams", href: "/teams", icon: <IconUsersGroup /> },
    { title: "My Borrows", href: "/borrow", icon: <IconShoppingCart /> },
    { title: "Inventory", href: "/inventory", icon: <IconBoxSeam /> },
  ];

  if (user?.role === "admin") {
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
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 transition-colors duration-300 flex flex-col relative z-0">
      <ShapeGrid 
        speed={0.5}
        squareSize={40}
        direction="diagonal"
        hoverTrailAmount={0}
        shape="square"
      />
      {!hideChrome && <Header user={user} />}

      <main className="flex-1 pt-16 pb-8">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/profile" element={<CompleteProfile />} />
          <Route path="/teams" element={<Teams />} />
          <Route path="/profile/:rollNumber" element={<MemberProfile />} />
          <Route path="/admin/requests" element={<AdminRequestPage />} />
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
      </main>

      {!hideChrome && <FloatingDock items={dockItems} />}
      {!hideChrome && <Footer />}
    </div>
  );
}

function App() {
  const [user, setUser] = useState(getCachedUser);

  useEffect(() => {
    const loadUser = async () => {
      const currentUser = await fetchCurrentUser();
      setUser(currentUser);
    };
    loadUser();
  }, []);

  return (
    <ThemeProvider>
      <AppShell user={user} />
    </ThemeProvider>
  );
}

export default App;
