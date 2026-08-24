import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { BookOpen, ArrowRight } from "lucide-react";
import LessonDiagram from "@/components/tradeiq/LessonDiagram";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import CommunityNotes from "@/components/tradeiq/CommunityNotes";
import { lessonNoteKey } from "@/lib/localStore";
import { Brain, Check } from "lucide-react";
import { addNote } from "@/lib/localStore";

export default function LessonView({ topic, onStartQuiz, quizScore, course }) {
  // Split lesson by diagram markers: {{diagram:type}}
  const parts = topic.lesson.split(/(\{\{diagram:[^}]+\}\})/g);
  const [dump, setDump] = useState("");
  const [dumpSaved, setDumpSaved] = useState(false);

  const saveDump = () => {
    if (!dump.trim()) return;
    addNote(topic.id, `Recall check: ${dump.trim()}`);
    setDumpSaved(true);
  };

  return (
    <div className="max-w-3xl lg:max-w-4xl xl:max-w-5xl mx-auto">
      <Tabs defaultValue="lesson">
        <TabsList className="mb-5">
          <TabsTrigger value="lesson" className="text-sm">Lesson Material</TabsTrigger>
          <TabsTrigger value="notes" className="text-sm">My Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="lesson">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-3">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Lesson</span>
          </div>
          <div className="tiq-prose">
            {parts.map((part, i) => {
              const match = part.match(/^\{\{diagram:([^}]+)\}\}$/);
              if (match) {
                return <LessonDiagram key={i} type={match[1]} spec={course?.diagrams?.[match[1]]} />;
              }
              return <ReactMarkdown key={i}>{part}</ReactMarkdown>;
            })}
          </div>

          {/* Recall check — free recall before the quiz (generation effect) */}
          <div className="mt-8 p-4 rounded-xl bg-tiq-mintLight/60 border border-tiq-border">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-tiq-mint" />
              <h3 className="font-slab text-sm text-tiq-ink font-bold">Recall Check</h3>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider">optional · not graded</span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              Before the quiz: close your eyes for a moment, then write everything you remember from this lesson.
              Retrieving it from memory is what makes it stick — it's saved to your notes.
            </p>
            {dumpSaved ? (
              <p className="text-sm text-emerald-600 flex items-center gap-1.5"><Check className="w-4 h-4" /> Saved to your notes.</p>
            ) : (
              <div className="space-y-2">
                <textarea
                  value={dump}
                  onChange={(e) => setDump(e.target.value)}
                  rows={3}
                  placeholder="What do you remember? Key terms, rules, examples..."
                  className="w-full text-sm rounded-lg border border-tiq-border bg-white p-3 text-slate-700 focus:outline-none focus:border-tiq-mint/50 resize-none"
                />
                <button
                  onClick={saveDump}
                  disabled={!dump.trim()}
                  className="px-3 py-1.5 rounded-lg bg-tiq-mint text-white text-xs font-medium hover:bg-tiq-mint/90 transition disabled:opacity-40"
                >
                  Save recall
                </button>
              </div>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-tiq-border">
            {quizScore != null && (
              <p className="text-sm text-slate-600 mb-3">
                Your best score: <span className="text-tiq-mint font-mono-tiq font-semibold">{quizScore}%</span>
              </p>
            )}
            <button
              onClick={onStartQuiz}
              className="flex items-center gap-2 px-5 py-2.5 rounded-lg bg-tiq-mint text-white font-semibold hover:bg-tiq-mint/90 transition"
            >
              {quizScore != null ? "Retake Quiz" : "Start Quiz"}
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </TabsContent>

        <TabsContent value="notes">
          <CommunityNotes lessonId={lessonNoteKey(course?.id, topic.id)} />
        </TabsContent>
      </Tabs>
    </div>
  );
}