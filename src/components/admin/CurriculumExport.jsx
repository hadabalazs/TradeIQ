import React, { useState } from "react";
import { Download, Loader2, FileText } from "lucide-react";
import { COURSES } from "@/lib/courses";
import { useToast } from "@/components/ui/use-toast";

const ICONS = {
  TrendingUp: "📈", Building2: "🏛️", BookOpen: "📚", GraduationCap: "🎓",
  Briefcase: "💼", Shield: "🛡️", Code: "💻", FlaskConical: "🧪", Globe: "🌍",
  LineChart: "📊", Scale: "⚖️", Banknote: "💵", Cpu: "🔧", Rocket: "🚀",
};

function buildCourseExportText(course) {
  let text = `${course.title.toUpperCase()} — LEARNING MATERIALS\n`;
  text += `Exported: ${new Date().toISOString()}\n`;
  text += `${"=".repeat(80)}\n\n`;
  text += `Category: ${course.category} · Level: ${course.level}\n`;
  text += `${course.description}\n\n`;

  course.modules.forEach((mod, mi) => {
    text += `${"=".repeat(80)}\n`;
    text += `MODULE ${mi + 1}: ${mod.title}\n`;
    text += `${mod.subtitle || ""}\n`;
    text += `${"=".repeat(80)}\n\n`;

    mod.topics.forEach((topic, ti) => {
      text += `${"-".repeat(60)}\n`;
      text += `Topic ${mi + 1}.${ti + 1}: ${topic.title}\n`;
      text += `${"-".repeat(60)}\n\n`;
      text += `${topic.lesson}\n\n`;

      if (topic.quiz && topic.quiz.length > 0) {
        text += `\n--- Quiz Questions ---\n\n`;
        topic.quiz.forEach((q, qi) => {
          text += `Q${qi + 1}: ${q.q}\n`;
          text += `Type: ${q.questionType ? q.questionType.replace(/-/g, " ") : "multiple-choice"}\n`;

          if (q.questionType === "sorting") {
            text += `Correct Order:\n`;
            q.options.forEach((opt, oi) => {
              text += `  ${String.fromCharCode(65 + oi)}. ${opt}\n`;
            });
          } else if (q.questionType === "term-match" && q.pairs) {
            text += `Correct Matches:\n`;
            q.pairs.forEach((p, pi) => {
              text += `  ${String.fromCharCode(65 + pi)}. ${p.term} — ${p.definition}\n`;
            });
          } else if (q.options && q.answer != null) {
            q.options.forEach((opt, oi) => {
              text += `  ${String.fromCharCode(65 + oi)}) ${opt}${oi === q.answer ? " ✓" : ""}\n`;
            });
          }

          if (q.answerText) {
            text += `Answer: ${q.answerText}\n`;
          }
          if (q.explain) {
            text += `Explanation: ${q.explain}\n`;
          }
          text += `\n`;
        });
      }
    });
  });

  if (course.finalAssessment && course.finalAssessment.length > 0) {
    text += `\n${"=".repeat(80)}\n`;
    text += `FINAL ASSESSMENT\n`;
    text += `${"=".repeat(80)}\n\n`;
    course.finalAssessment.forEach((q, qi) => {
      text += `Q${qi + 1}: ${q.q}\n`;
      text += `Type: ${q.questionType ? q.questionType.replace(/-/g, " ") : "multiple-choice"}\n`;

      if (q.questionType === "sorting") {
        text += `Correct Order:\n`;
        q.options.forEach((opt, oi) => {
          text += `  ${String.fromCharCode(65 + oi)}. ${opt}\n`;
        });
      } else if (q.questionType === "term-match" && q.pairs) {
        text += `Correct Matches:\n`;
        q.pairs.forEach((p, pi) => {
          text += `  ${String.fromCharCode(65 + pi)}. ${p.term} — ${p.definition}\n`;
        });
      } else if (q.options && q.answer != null) {
        q.options.forEach((opt, oi) => {
          text += `  ${String.fromCharCode(65 + oi)}) ${opt}${oi === q.answer ? " ✓" : ""}\n`;
        });
      }

      if (q.answerText) {
        text += `Answer: ${q.answerText}\n`;
      }
      if (q.explain) {
        text += `Explanation: ${q.explain}\n`;
      }
      text += `\n`;
    });
  }

  if (course.glossary && course.glossary.length > 0) {
    text += `\n${"=".repeat(80)}\n`;
    text += `GLOSSARY\n`;
    text += `${"=".repeat(80)}\n\n`;
    course.glossary.forEach((g) => {
      text += `${g.term}: ${g.def}\n\n`;
    });
  }

  return text;
}

export default function CurriculumExport() {
  const [exporting, setExporting] = useState(null);
  const { toast } = useToast();

  const handleExport = (course) => {
    setExporting(course.id);
    try {
      const text = buildCourseExportText(course);
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${course.id}-learning-materials.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "Export ready",
        description: `${course.title} materials have been downloaded.`,
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: err.message || "An error occurred",
      });
    } finally {
      setExporting(null);
    }
  };

  const handleExportAll = () => {
    setExporting("all");
    try {
      let text = `TRADEIQ ACADEMY — ALL COURSES LEARNING MATERIALS\n`;
      text += `Exported: ${new Date().toISOString()}\n`;
      text += `${"=".repeat(80)}\n\n`;
      COURSES.forEach((course) => {
        text += `\n${buildCourseExportText(course)}\n${"#".repeat(80)}\n`;
      });
      const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "tradeiq-all-courses.txt";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      toast({
        title: "All courses exported",
        description: "All course materials have been downloaded in one file.",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Export failed",
        description: err.message || "An error occurred",
      });
    } finally {
      setExporting(null);
    }
  };

  return (
    <div className="mb-6 rounded-xl bg-white border border-tiq-border p-5">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-8 h-8 rounded-lg bg-tiq-gold/10 flex items-center justify-center">
          <FileText className="w-4 h-4 text-tiq-gold" />
        </div>
        <h2 className="font-slab text-lg text-tiq-ink font-semibold">Export Learning Materials</h2>
      </div>
      <p className="text-sm text-slate-500 mb-4">
        Download each course's complete curriculum — modules, lessons, quiz questions, final assessment, and glossary — as a separate text file.
      </p>

      <div className="space-y-2 mb-4">
        {COURSES.map((course) => {
          const icon = ICONS[course.icon] || "📚";
          const isExporting = exporting === course.id;
          const disabled = exporting !== null;
          return (
            <div
              key={course.id}
              className="flex items-center gap-3 p-3 rounded-lg border border-tiq-border bg-tiq-mintLight/40"
            >
              <span className="text-lg shrink-0">{icon}</span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-tiq-ink truncate">{course.title}</p>
                <p className="text-xs text-slate-500">
                  {course.modules.length} modules · {course.modules.reduce((s, m) => s + m.topics.length, 0)} topics
                </p>
              </div>
              <button
                onClick={() => handleExport(course)}
                disabled={disabled}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-tiq-ink text-white text-xs font-medium hover:bg-tiq-ink/90 transition disabled:opacity-40 shrink-0"
              >
                {isExporting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Download className="w-3.5 h-3.5" />}
                Download
              </button>
            </div>
          );
        })}
      </div>

      <button
        onClick={handleExportAll}
        disabled={exporting !== null}
        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-tiq-mint text-white text-sm font-semibold hover:bg-tiq-mint/90 transition disabled:opacity-40"
      >
        {exporting === "all" ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
        Download All Courses
      </button>
    </div>
  );
}