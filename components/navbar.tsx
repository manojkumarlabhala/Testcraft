"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Menu, X, LogOut, User } from "lucide-react"
import { Home, BookOpen, GraduationCap, School, University, FileText, Users, ShieldCheck, Crown, Settings, LogIn } from "lucide-react"
import { useTheme } from "next-themes"
import { useRouter, usePathname } from "next/navigation"
import { LoginModal } from "@/components/login-modal"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import Image from "next/image"

export function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const { user, loading, signOut } = useAuth()
  const { isPremium } = useSubscription()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  const handleLogoClick = () => {
    router.push("/")
  }

  const navLinks = user ? [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    {
      label: "Categories",
      dropdown: [
        { href: "#papers", label: "School Papers" },
        { href: "#ugc-universities", label: "UGC Universities" },
        { href: "#graduation", label: "Graduation" },
        { href: "#postgraduate", label: "Postgraduate" },
      ],
    },
    { href: "/mock-tests/create", label: "Mock Tests" },
    { href: "#pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
    { href: "/dashboard", label: "User Dashboard" },
    { href: "/test-history", label: "Test History" },
  ] : [
    { href: "/", label: "Home" },
    { href: "/blog", label: "Blog" },
    {
      label: "Categories",
      dropdown: [
        { href: "#papers", label: "School Papers" },
        { href: "#ugc-universities", label: "UGC Universities" },
        { href: "#graduation", label: "Graduation" },
        { href: "#postgraduate", label: "Postgraduate" },
      ],
    },
    { href: "/mock-tests/create", label: "Mock Tests" },
    { href: "#pricing", label: "Pricing" },
    { href: "/about", label: "About Us" },
  ]

  const scrollToSection = (href: string) => {
    // This function is only called in event handlers, so it's always client-side
    if (href.startsWith("http")) {
      window.location.href = href;
      setIsMenuOpen(false);
      return;
    }
    if (href.startsWith("/")) {
      router.push(href);
      setIsMenuOpen(false);
      return;
    }
    // For hash links, scroll directly using DOM API
    if (typeof document !== "undefined") {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
    setIsMenuOpen(false);
  }

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={handleLogoClick}
                className="group flex items-center space-x-2 hover:scale-105 transition-all duration-300 ease-out"
              >
                {pathname !== "/" && (
                  <div className="relative">
                    <Image
                      src="/testcraft-logo.svg"
                      alt="Testcraft.in"
                      width={40}
                      height={40}
                      className="h-10 w-10 object-contain"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full animate-ping opacity-75"></div>
                  </div>
                )}
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 transition-all duration-300">
                  <span className="relative">
                    Test
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 dark:bg-slate-100 group-hover:w-full transition-all duration-300"></span>
                  </span>
                  <span className="relative">
                    craft
                    <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-slate-900 dark:bg-slate-100 group-hover:w-full transition-all duration-300 delay-100"></span>
                  </span>
                  <span className="text-slate-600 dark:text-slate-400">.in</span>
                </h1>
              </button>
            </div>
            {/* Centered Desktop Navigation */}
            <nav className="hidden md:flex flex-1 justify-center items-center space-x-8">
              {navLinks.map((link) =>
                link.dropdown ? (
                  <div className="relative group" key={link.label}>
                    <button className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
                      {link.label}
                    </button>
                    <div className="absolute left-0 mt-2 w-48 bg-background border rounded shadow-lg opacity-0 group-hover:opacity-100 pointer-events-auto transition-opacity z-20">
                      {link.dropdown.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => {
                            if (item.href === "/admin/institution-dashboard") {
                              const subdomain = window.localStorage.getItem("institution_subdomain") || "demo";
                              window.location.href = `https://${subdomain}.testcraft.in/admin/institution-dashboard`;
                            } else if (item.href.startsWith("/")) {
                              router.push(item.href);
                              setIsMenuOpen(false);
                            } else {
                              scrollToSection(item.href);
                            }
                          }}
                          className="block w-full text-left px-4 py-2 text-sm text-muted-foreground hover:bg-primary/10 hover:text-primary transition-colors"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <button
                    key={link.href}
                    onClick={() => link.href && scrollToSection(link.href)}
                    className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
                  >
                    {link.label}
                  </button>
                )
              )}
            </nav>
            {/* Desktop Actions */}
            <div className="hidden md:flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9 p-0 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
              >
                {theme === "dark"
                  ? <Sun className="lucide lucide-sun h-4 w-4 text-yellow-400 hover:text-yellow-300 transition-colors" />
                  : <Moon className="lucide lucide-moon h-4 w-4 text-slate-600 hover:text-slate-400 transition-colors" />}
              </Button>

              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Loading...</span>
                </div>
              ) : user ? (
                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-3 py-2 rounded-full border border-emerald-200 dark:border-emerald-800">
                    <div className="w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                      <User className="h-3 w-3 text-white" />
                    </div>
                    <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                      {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOut}
                    className="hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300"
                  >
                    <LogOut className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                    Sign Out
                  </Button>
                </div>
              ) : (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsLoginOpen(true)}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login / Register
                </Button>
              )}
            </div>
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden h-9 w-9 p-0"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden border-t border-border py-4">
              <nav className="flex flex-col space-y-4">
                {navLinks.map((link) =>
                  link.dropdown ? (
                    <div key={link.label} className="flex flex-col">
                      <span className="text-left text-sm font-semibold text-primary mb-1">{link.label}</span>
                      {link.dropdown.map((item) => (
                        <button
                          key={item.href}
                          onClick={() => {
                            if (item.href === "/admin/institution-dashboard") {
                              const subdomain = window.localStorage.getItem("institution_subdomain") || "demo";
                              window.location.href = `https://${subdomain}.testcraft.in/admin/institution-dashboard`;
                            } else if (item.href.startsWith("/")) {
                              router.push(item.href);
                              setIsMenuOpen(false);
                            } else {
                              item.href && scrollToSection(item.href);
                            }
                          }}
                          className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <button
                      key={link.href}
                      onClick={() => {
                        if (link.href === "/admin/institution-dashboard") {
                          const subdomain = window.localStorage.getItem("institution_subdomain") || "demo";
                          window.location.href = `https://${subdomain}.testcraft.in/admin/institution-dashboard`;
                        } else {
                          link.href && scrollToSection(link.href);
                        }
                      }}
                      className="text-left text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-1 rounded-md hover:bg-primary/10"
                    >
                      {link.label}
                    </button>
                  )
                )}
                <div className="flex items-center space-x-4 pt-4 border-t border-border">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                    className="h-9 w-9 p-0 hover:bg-gradient-to-r hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/20 dark:hover:to-pink-900/20 transition-all duration-300"
                  >
                    {theme === "dark"
                      ? <Sun className="lucide lucide-sun h-4 w-4 text-yellow-400 hover:text-yellow-300 transition-colors" />
                      : <Moon className="lucide lucide-moon h-4 w-4 text-slate-600 hover:text-slate-400 transition-colors" />}
                  </Button>

                  {loading ? (
                    <div className="flex items-center space-x-2 px-3 py-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-purple-200 to-pink-200 dark:from-purple-800 dark:to-pink-800 rounded-full animate-pulse"></div>
                      <span className="text-sm text-muted-foreground">Loading...</span>
                    </div>
                  ) : user ? (
                    <div className="flex flex-col space-y-2 w-full">
                      <div className="flex items-center space-x-2 bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 px-3 py-2 rounded-lg border border-emerald-200 dark:border-emerald-800">
                        <div className="w-5 h-5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <span className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                          {user.user_metadata?.full_name || user.email?.split('@')[0] || 'Student'}
                        </span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleSignOut}
                        className="w-full hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 border-red-200 dark:border-red-800 hover:border-red-300 dark:hover:border-red-700 transition-all duration-300"
                      >
                        <LogOut className="h-4 w-4 mr-2 text-red-600 dark:text-red-400" />
                        Sign Out
                      </Button>
                    </div>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setIsLoginOpen(true)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                    >
                      <LogIn className="h-4 w-4 mr-2" />
                      Login / Register
                    </Button>
                  )}
                </div>
              </nav>
            </div>
          )}
        </div>
      </header>

      <LoginModal open={isLoginOpen} onOpenChange={setIsLoginOpen} />
    </>
  )
}
