import { Home, User, Settings, Users, Stethoscope, ShoppingCart, FileText, Image, Package, Bell } from "lucide-react";

type MenuItem = {
  icon: any;
  label: string;
  href: string;
}

type MenuLinks = {
  [key: string]: MenuItem[];
}

export const menuLinks: MenuLinks = {
  administrator: [
    { icon: Home, label: "Dashboard", href: "/administrator" },
    { icon: Users, label: "Admins", href: "/administrator/list/admins" },
    { icon: Stethoscope, label: "Medical Staff", href: "/administrator/list/medical-staff" },
    { icon: User, label: "Customers", href: "/administrator/list/customers" },
    { icon: ShoppingCart, label: "Products", href: "/administrator/list/products" },
    { icon: FileText, label: "Orders", href: "/administrator/list/orders" },
    { icon: FileText, label: "Categories", href: "/administrator/list/categories" },
    { icon: Image, label: "Banners", href: "/administrator/list/banners" },
    { icon: Settings, label: "Settings", href: "/administrator/settings" },
    { icon: Bell, label: "Notifications", href: "/administrator/notifications" },
  ],
  admin: [
    { icon: Home, label: "Dashboard", href: "/admin" },
    { icon: Stethoscope, label: "Medical Staff", href: "/admin/list/medical-staff" },
    { icon: User, label: "Customers", href: "/admin/list/customers" },
    { icon: ShoppingCart, label: "Products", href: "/admin/list/products" },
    { icon: FileText, label: "Orders", href: "/admin/list/orders" },
    { icon: FileText, label: "Categories", href: "/admin/list/categories" },
    { icon: Image, label: "Banners", href: "/admin/list/banners" },
    { icon: Settings, label: "Settings", href: "/admin/settings" },
    { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  ],
  "medical-staff": [
    { icon: Home, label: "Dashboard", href: "/medical-staff" },
    { icon: ShoppingCart, label: "My Products", href: "/medical-staff/products" },
    { icon: Package, label: "My Channels", href: "/medical-staff/channels" },
    { icon: Bell, label: "Notifications", href: "/medical-staff/notifications" },
  ],
  customer: [
    { icon: Home, label: "Dashboard", href: "/customer" },
    { icon: Package, label: "Purchases", href: "/customer/purchases" },
    { icon: FileText, label: "Transaction", href: "/customer/transaction" },
    { icon: Bell, label: "Notifications", href: "/customer/notifications" },
  ]
};
