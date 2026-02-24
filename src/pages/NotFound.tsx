import { Navigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useSEO } from "@/hooks/use-seo";

const NotFound = () => {
  useSEO({
    title: "Page Not Found | WildWave Safaris",
    description: "The page you requested could not be found.",
    path: "/404",
    noindex: true,
  });

  const location = useLocation();
  const rawPath = decodeURIComponent(location.pathname || "/");
  const normalizedPath =
    rawPath
      .trim()
      .replace(/^['"]+|['"]+$/g, "")
      .replace(/\/+$/, "") || "/";
  const aliasToHome = new Set(["/", "/index.html", "/index.php", "/home", "/tours"]);

  useEffect(() => {
    const path = normalizedPath === "/index.html" ? "/" : normalizedPath;
    if (path !== "/" && import.meta.env.DEV) {
      console.warn("404 route:", path);
    }
  }, [normalizedPath]);

  if (aliasToHome.has(normalizedPath)) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">404</h1>
        <p className="mb-4 text-xl text-muted-foreground">Oops! Page not found</p>
        <a href="/" className="text-primary underline hover:text-primary/90">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
