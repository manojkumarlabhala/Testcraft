"use client"
import { SuperAdminDashboard } from "@/components/admin/super-admin-dashboard"
import { useState, useEffect } from "react"
import { isSuperAdmin } from "@/lib/admin/super-admin-emails"

export default function SuperAdminDashboardPage() {
  // Use Supabase client to check session and email
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<boolean | null>(null); // null = loading, true = verified, false = not verified

  useEffect(() => {
    async function checkAuth() {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { data, error } = await supabase.auth.getUser();
        
        if (error) {
          console.error('Auth error:', error);
          setIsVerified(false);
          return;
        }

        if (data?.user && data.user.email && isSuperAdmin(data.user.email) && data.user.email_confirmed_at) {
          setUserEmail(data.user.email);
          setIsVerified(true);
        } else {
          setUserEmail(null);
          setIsVerified(false);
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsVerified(false);
      }
    }
    checkAuth();
  }, []);

  // Show loading spinner while checking authentication
  if (isVerified === null) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700 mb-2">Verifying Access</h2>
          <p className="text-gray-500">Checking super admin credentials...</p>
        </div>
      </div>
    );
  }

  // Show access denied if not verified
  if (!isVerified) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="bg-red-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-red-700 mb-2">Access Denied</h2>
            <p className="text-red-600 mb-6">You must be a verified super admin to access this dashboard.</p>
            <div className="space-y-3">
              <button 
                onClick={() => window.location.href = '/auth/login'}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 transition-colors"
              >
                Go to Login
              </button>
              <button 
                onClick={() => window.location.href = '/dashboard'}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-300 transition-colors"
              >
                Return to Dashboard
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Render dashboard if verified
  return <SuperAdminDashboard userEmail={userEmail!} />;
}
