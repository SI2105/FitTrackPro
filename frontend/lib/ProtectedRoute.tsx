import { useRouter } from "next/navigation";
import { useAuth } from "./auth-context";
import { useEffect } from "react";
export function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();
    const router = useRouter();
    
    useEffect(() => {
        console.log(token)
      if (!isLoading && !token) {
        router.push('/auth/login?redirect=' + encodeURIComponent(window.location.pathname));
      }
    }, [token, isLoading, router]);
    
    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-lg">Loading...</div>
        </div>
    )
    if (!token) return null;
    
    return <>{children}</>;
  }