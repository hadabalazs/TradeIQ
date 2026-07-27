import React, { useState, useMemo, useEffect } from "react";
import DilemmaEngine from "@/components/tradeiq/DilemmaEngine";
import { recordCompletion, getPath } from "@/lib/dilemmaProgress";
import { useProgress } from "@/lib/ProgressContext";

export default function InlineDilemma({ course, dilemma, onAdvance }) {
  const { progress, save } = useProgress();
  const [previousPath, setPreviousPath] = useState(null);

  useEffect(() => {
    if (dilemma) {
      getPath(course.id, dilemma.id).then(setPreviousPath);
    } else {
      setPreviousPath(null);
    }
  }, [course.id, dilemma]);

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
    <DilemmaEngine
      dilemma={dilemma}
      course={course}
      previousPath={previousPath}
      onComplete={handleComplete}
      onAdvance={onAdvance}
      relatedTopicLinks={relatedTopicLinks}
    />
  );
}