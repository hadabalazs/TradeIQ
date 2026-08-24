import { Plus, FileJson } from 'lucide-react';
import StructuredCourseUpload from './StructuredCourseUpload';

export default function AddCourse() {
  return (
    <div className="mb-6 rounded-xl bg-white border border-tiq-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-tiq-mint/10 flex items-center justify-center">
          <Plus className="w-4 h-4 text-tiq-mint" />
        </div>
        <h2 className="font-slab text-lg text-tiq-ink font-semibold">Add New Course</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Upload a structured course JSON file. Generate the JSON with Claude, then publish it here — it becomes available to all users in the course catalog.
      </p>
      <div className="flex gap-2 mb-4 border-b border-tiq-border">
        <span className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium border-b-2 border-tiq-mint text-tiq-mint">
          <FileJson className="w-3.5 h-3.5" /> Structured Upload
        </span>
      </div>
      <StructuredCourseUpload />
    </div>
  );
}
