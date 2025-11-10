import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { WebstateLogo } from "@/components/ui/webstate-logo";
import { ButtonPremium } from "@/components/ui/button-premium";
import { Menu, X, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#features", label: "Fonctionnalités" },
    { href: "#use-cases", label: "Cas d'Usage" },
    { href: "#process", label: "Comment ça marche" },
    { href: "#pricing", label: "Tarifs" },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={cn(
          "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
          isScrolled ? "py-2" : "py-4",
          className
        )}
      >
        <div
          className={cn(
            "mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 transition-all duration-300",
            isScrolled && "backdrop-blur-md"
          )}
        >
          <div
            className={cn(
              "glass-card rounded-2xl px-6 py-3 transition-all duration-300",
              isScrolled ? "shadow-glass" : "shadow-sm"
            )}
          >
            <div className="flex items-center justify-between">
              {/* Logo */}
              <Link to="/" className="flex items-center">
                <WebstateLogo size="md" variant={isScrolled ? "gradient" : "default"} />
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden lg:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    className="link-premium text-sm font-medium text-muted-foreground hover:text-foreground transition-colors whitespace-nowrap"
                  >
                    {link.label}
                  </a>
                ))}
              </div>

              {/* CTA Buttons */}
              <div className="hidden lg:flex items-center space-x-3">
                <Link to="/auth">
                  <ButtonPremium variant="ghost" size="sm" className="whitespace-nowrap">
                    Connexion
                  </ButtonPremium>
                </Link>
                <Link to="/auth">
                  <ButtonPremium size="sm" className="group whitespace-nowrap">
                    Essai Gratuit
                    <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </ButtonPremium>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-accent transition-colors"
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
              onClick={() => setIsMobileMenuOpen(false)}
            />

            {/* Menu Content */}
            <motion.div
              initial={{ y: -100 }}
              animate={{ y: 0 }}
              exit={{ y: -100 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute top-20 left-4 right-4 glass-card rounded-2xl p-6 shadow-xl"
            >
              <nav className="space-y-4">
                {navLinks.map((link) => (
                  <a
                    key={link.href}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block py-2 text-lg font-medium text-foreground hover:text-primary transition-colors"
                  >
                    {link.label}
                  </a>
                ))}
                <div className="pt-4 space-y-3 border-t border-border">
                  <Link to="/auth" className="block">
                    <ButtonPremium variant="outline" size="default" className="w-full">
                      Connexion
                    </ButtonPremium>
                  </Link>
                  <Link to="/auth" className="block">
                    <ButtonPremium size="default" className="w-full group">
                      Essai Gratuit
                      <ArrowRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </ButtonPremium>
                  </Link>
                </div>
              </nav>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Spacer to push content below navbar */}
      <div className={cn("h-20", isScrolled ? "h-16" : "h-24")} />
    </>
  );
}

