import React from "react";
import { Flag } from "lucide-react";
import { AdminPage } from "@/components/admin/AdminUI";
import AdminGate from "@/components/admin/AdminGate";
import FlaggedQuestions from "@/components/admin/FlaggedQuestions";

export default function AdminFlags() {
  return (
    <AdminGate>
      <AdminPage
        title="Flagged questions"
        description="Reports from learners. Search, filter by course, then suppress or replace."
        icon={Flag}
      >
        <FlaggedQuestions />
      </AdminPage>
    </AdminGate>
  );
}
