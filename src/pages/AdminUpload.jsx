import React from "react";
import { Link } from "react-router-dom";
import { Plus } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminUI";
import AdminGate from "@/components/admin/AdminGate";
import StructuredCourseUpload from "@/components/admin/StructuredCourseUpload";

export default function AdminUpload() {
  return (
    <AdminGate>
      <AdminPage
        title="Add a course"
        description="Publish a structured course JSON. It becomes available to every learner immediately."
        icon={Plus}
      >
        <div className="rounded-xl bg-white border border-tiq-border p-5">
          <StructuredCourseUpload />
        </div>
        <p className="text-xs text-slate-500 mt-4">
          Module and topic ids that another course already uses are automatically prefixed with this
          course's own namespace on publish, so the catalog stays collision-free however many courses
          you add. The <Link to="/admin/audit" className="text-tiq-mint hover:underline">catalog audit</Link> lists
          any collisions that predate that check.
        </p>
      </AdminPage>
    </AdminGate>
  );
}
