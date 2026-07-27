import React, { useState, useEffect, useCallback } from "react";
import { NotebookPen, Send, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { listNotes, addNote, deleteNote } from "@/lib/localStore";

// Personal lesson notes, stored locally on this device.
export default function CommunityNotes({ lessonId }) {
  const [notes, setNotes] = useState([]);
  const [content, setContent] = useState("");

  const load = useCallback(() => {
    setNotes(listNotes(lessonId));
  }, [lessonId]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSubmit = () => {
    if (!content.trim()) return;
    addNote(lessonId, content.trim());
    setContent("");
    load();
  };

  const handleDelete = (noteId) => {
    deleteNote(lessonId, noteId);
    load();
  };

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write a summary or insight from this lesson — putting it in your own words helps it stick..."
          rows={4}
          className="resize-none"
        />
        <div className="flex justify-end">
          <Button
            onClick={handleSubmit}
            disabled={!content.trim()}
            className="flex items-center gap-2 bg-tiq-mint text-white hover:bg-tiq-mint/90"
          >
            <Send className="w-4 h-4" />
            Save Note
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          My Notes ({notes.length})
        </h4>
        {notes.length === 0 ? (
          <div className="text-center py-8">
            <NotebookPen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
            <p className="text-sm text-slate-500">
              No notes yet. Writing your own summary is one of the best ways to remember a lesson.
            </p>
          </div>
        ) : (
          notes.map((n) => (
            <div key={n.id} className="p-4 rounded-lg bg-white border border-tiq-border">
              <p className="text-sm text-slate-700 mb-3 whitespace-pre-wrap">{n.text}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {new Date(n.created_date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                </span>
                <button
                  onClick={() => handleDelete(n.id)}
                  className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-red-500 transition"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
