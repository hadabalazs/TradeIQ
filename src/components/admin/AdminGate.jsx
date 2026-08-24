import React from "react";
import { Link } from "react-router-dom";
import { Shield } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import { isAdminUser } from "@/lib/adminRole";

// The admin check, in one place.
//
// It was previously inlined in the single admin page. With the admin area split
// across several routes, a copy of the check per page is a copy that can be
// forgotten — and the one that gets forgotten is the one that leaks. Every admin
// route wraps its content in this.
export default function AdminGate({ children }) {
  const { user, isAuthenticated } = useAuth();

  if (isAdminUser(user)) return children;

  return (
    <div className="max-w-md mx-auto text-center py-16">
      <div className="w-14 h-14 rounded-full bg-tiq-mintLight border border-tiq-border flex items-center justify-center mx-auto mb-4">
        <Shield className="w-7 h-7 text-slate-400" />
      </div>
      <h1 className="font-slab text-xl text-tiq-ink font-bold mb-2">Admins only</h1>
      <p className="text-sm text-slate-500 mb-6">
        {isAuthenticated
          ? "Your account doesn't have admin access. Course management and data tools are restricted to administrators."
          : "Sign in with an admin account to manage courses and data."}
      </p>
      <Link
        to={isAuthenticated ? "/" : "/login"}
        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-tiq-mint text-white text-sm font-medium hover:bg-tiq-mint/90 transition"
      >
        {isAuthenticated ? "Back to courses" : "Sign in"}
      </Link>
    </div>
  );
}
