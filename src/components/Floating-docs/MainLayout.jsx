import { FloatingDock } from "../components/FloatingDock";
import {
  IconUsersGroup,
  IconBoxSeam,
  IconArrowBackUp,
  IconShoppingCart,
  IconListDetails,
} from "@tabler/icons-react";
import { MdApproval } from "react-icons/md";
import { useMemo } from "react";

const dockItems = useMemo(() => {
  const items = [
    { title: "Teams", href: "/teams", icon: <IconUsersGroup /> },
    { title: "My Borrows", href: "/borrow", icon: <IconShoppingCart /> },
    { title: "Inventory", href: "/inventory", icon: <IconBoxSeam /> },
  ];
  if (user?.role === "admin") {
    items.push(
      { title: "Product Listing", href: "/admin/products", icon: <IconListDetails /> },
      { title: "Borrow Approvals", href: "/borrow-approval", icon: <MdApproval /> }
    );
  }
  return items;
}, [user]);