import { ReactNode } from "react";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useAdmin } from "@/hooks/useAdmin";
import { Badge } from "@/components/ui/badge";
import { useTheme } from "next-themes";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
  SidebarTrigger,
  SidebarGroupLabel,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Link, useLocation } from "react-router-dom";
import { 
  Home, 
  Bot, 
  Settings, 
  LifeBuoy, 
  CreditCard, 
  Sparkles,
  Megaphone,
  ShoppingCart,
  Database,
  Mail,
  MessageSquare,
  FileText,
  Shield,
  Users,
  BarChart3,
  Rocket,
  Activity,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Sun,
  Moon,
} from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user } = useAuth();
  const location = useLocation();
  const { isAdmin, loading: adminLoading } = useAdmin();
  const { theme, setTheme } = useTheme();

  const menuItems = [
    {
      title: "Principal",
      items: [
        {
          title: "Vue d'ensemble",
          url: "/app",
          icon: Home,
        },
      ],
    },
    {
      title: "Automations",
      items: [
        {
          title: "Toutes les automations",
          url: "/app/automations",
          icon: Bot,
        },
        {
          title: "Marketing",
          url: "/app/automations?category=marketing",
          icon: Megaphone,
        },
        {
          title: "E-commerce",
          url: "/app/automations?category=ecommerce",
          icon: ShoppingCart,
        },
        {
          title: "Data & CRM",
          url: "/app/automations?category=data",
          icon: Database,
        },
        {
          title: "Email",
          url: "/app/automations?category=email",
          icon: Mail,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "Documents",
          url: "/app/documents",
          icon: FileText,
        },
        {
          title: "Abonnement",
          url: "/app/pricing",
          icon: CreditCard,
        },
        {
          title: "Support",
          url: "/app/support",
          icon: LifeBuoy,
        },
        {
          title: "Paramètres",
          url: "/app/settings",
          icon: Settings,
        },
      ],
    },
    // Menu Admin - Visible uniquement si isAdmin
    ...(isAdmin ? [{
      title: "Admin",
      items: [
        {
          title: "Gestion Clients",
          url: "/app/admin/clients",
          icon: Users,
        },
        {
          title: "Workflows Multi-tenant",
          url: "/app/admin/workflows",
          icon: Rocket,
        },
        {
          title: "Santé Système",
          url: "/app/admin/health",
          icon: Activity,
        },
        {
          title: "Métriques Globales",
          url: "/app/admin/metrics",
          icon: BarChart3,
        },
      ],
    }] : []),
  ];

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" className="border-r" role="navigation" aria-label="Navigation principale">
        <SidebarHeader className="px-3 py-4">
          <div className="flex items-center gap-2 px-1">
            <div className="size-7 rounded-md bg-primary/10 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary" />
            </div>
            <span className="font-semibold">n8n Client Hub</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          {menuItems.map((group, groupIndex) => (
            <SidebarGroup key={group.title}>
              <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
              <SidebarMenu>
                {group.items.map((item) => {
                  const Icon = item.icon;
                  // Gestion spéciale pour les catégories d'automatisations
                  let isActive = false;
                  if (item.url === "/app/automations") {
                    // Active si on est sur /app/automations sans catégorie
                    isActive = location.pathname === "/app/automations" && !location.search;
                  } else if (item.url.includes("?category=")) {
                    // Active si la catégorie dans l'URL correspond
                    const category = item.url.split("category=")[1];
                    const currentCategory = new URLSearchParams(location.search).get("category");
                    isActive = location.pathname === "/app/automations" && currentCategory === category;
                  } else {
                    isActive = location.pathname === item.url || 
                      (item.url !== "/app" && location.pathname.startsWith(item.url));
                  }
                  
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link to={item.url} className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
              {groupIndex < menuItems.length - 1 && <SidebarSeparator className="my-2" />}
            </SidebarGroup>
          ))}
          
          {/* Chatbot Support */}
          <SidebarGroup>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton 
                  asChild 
                  className="bg-primary/10 hover:bg-primary/20 text-primary"
                  aria-label="Ouvrir le chat support IA"
                >
                  <button className="flex items-center gap-2 w-full">
                    <MessageSquare className="w-4 h-4" aria-hidden="true" />
                    <span>Chat Support IA</span>
                  </button>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <div className="sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
          <div className="flex h-14 items-center justify-between px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger aria-label="Toggle sidebar" />
            <div className="hidden sm:flex items-center gap-2">
              <span className="text-sm text-muted-foreground" aria-label="User email">
                {user?.email ? `Connecté en tant que ${user.email.split('@')[0]}` : "Dashboard"}
              </span>
              {isAdmin && (
                <Badge variant="default" className="gap-1 bg-purple-600 text-white border-purple-700" aria-label="Administrateur">
                  <Shield className="w-3 h-3" aria-hidden="true" />
                  Admin
                </Badge>
              )}
            </div>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle dark mode"
                className="h-9 w-9"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4" aria-hidden="true" />
                ) : (
                  <Moon className="h-4 w-4" aria-hidden="true" />
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={() => supabase.auth.signOut()} aria-label="Se déconnecter">
                Se déconnecter
              </Button>
            </div>
          </div>
        </div>
        <main className="min-h-[calc(100vh-3.5rem)] p-6">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

