import React, { useState, useMemo, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import DilemmaEngine from "@/components/tradeiq/DilemmaEngine";
import { DILEMMA_TYPE_LABELS } from "@/lib/dilemmas";
import { recordCompletion, getPath } from "@/lib/dilemmaProgress";
import { useProgress } from "@/lib/ProgressContext";

export default function DilemmaModal({ course, dilemma, open, onClose }) {
  const { progress, save } = useProgress();
  const [previousPath, setPreviousPath] = useState(null);

  useEffect(() => {
    if (open && dilemma) {
      getPath(course.id, dilemma.id).then(setPreviousPath);
    } else {
      setPreviousPath(null);
    }
  }, [open, dilemma, course.id]);

  // Build related topic links: map topic title -> route path
  const relatedTopicLinks = useMemo(() => {
    if (!course || !dilemma) return {};
    const links = {};
    for (const node of Object.values(dilemma.nodes)) {
      if (!node.relatedTopics) continue;
      for (const title of node.relatedTopics) {
        if (links[title]) continue;
        for (const m of course.modules) {
          for (const t of m.topics) {
            if (t.title === title) {
              links[title] = `/course/${course.id}/learn/${t.id}`;
            }
          }
        }
      }
    }
    return links;
  }, [course, dilemma]);

  const handleComplete = async (newPath, pathChanged) => {
    const isFirstCompletion = !previousPath;
    await recordCompletion(course.id, dilemma.id, newPath);

    let xpGain = 0;
    if (isFirstCompletion) xpGain += 15;
    if (pathChanged) xpGain += 5;

    if (xpGain > 0) {
      save({
        total_xp: (progress?.total_xp || 0) + xpGain,
      });
    }
  };

  if (!dilemma) return null;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto tiq-scroll">
        <DialogHeader className="pr-8">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-lg">🎭</span>
            <span className="text-[10px] font-mono-tiq text-tiq-mint bg-tiq-mint/10 px-2 py-0.5 rounded uppercase tracking-wider">
              {DILEMMA_TYPE_LABELS[dilemma.dilemmaType] || dilemma.dilemmaType}
            </span>
            {previousPath && (
              <span className="text-[10px] font-medium text-slate-400">
                · Replay
              </span>
            )}
          </div>
          <DialogTitle className="font-slab text-lg text-tiq-ink">
            {dilemma.title}
          </DialogTitle>
          <p className="text-xs text-slate-500 mt-1">
            Module {dilemma.module} · {dilemma.characters.join(" · ")}
          </p>
        </DialogHeader>
        <div className="mt-2">
          <DilemmaEngine
            key={open ? "open" : "closed"}
            dilemma={dilemma}
            course={course}
            previousPath={previousPath}
            onComplete={handleComplete}
            onClose={onClose}
            relatedTopicLinks={relatedTopicLinks}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}