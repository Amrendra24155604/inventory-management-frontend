import { FloatingDock } from "../components/FloatingDock";
import {
  IconUsersGroup,
  IconBoxSeam,
  IconArrowBackUp,
  IconShoppingCart,
} from "@tabler/icons-react";

const dockItems = [
  { title: "Teams", href: "/teams", icon: <IconUsersGroup /> },
  { title: "Borrow", href: "/borrow", icon: <IconShoppingCart /> },
  { title: "Return", href: "/return", icon: <IconArrowBackUp /> },
  { title: "Inventory", href: "/inventory", icon: <IconBoxSeam /> },
];

export default function MainLayout({ children }) {
  return (
    <>
      {children}
      <FloatingDock items={dockItems} />
    </>
  );
}