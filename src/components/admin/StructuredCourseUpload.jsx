import { useState } from 'react';
import { Upload, Download, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { useCourses } from '@/lib/CoursesContext';
import { validateCourseStructure, publishCustomCourse } from '@/lib/courseUtils';

const TEMPLATE = {
  title: "My New Course",
  subtitle: "Short subtitle",
  description: "Course description goes here.",
  category: "General",
  level: "Intermediate",
  certificateText: "Certificate of Completion",
  icon: "BookOpen",
  gradient: "from-blue-500/10 to-indigo-500/5",
  modules: [
    {
      id: "m1",
      title: "Module 1: Introduction",
      subtitle: "Getting started",
      topics: [
        {
          id: "m1t1",
          title: "Topic 1: Key Concepts",
          lesson: "## Key Concepts\n\nWrite your lesson content in **markdown**.\n\n{{diagram:concept-flow}}\n\n### Subheading\n- Point one\n- Point two",
          quiz: [
            {
              q: "Multiple choice: sample question text?",
              options: ["Option A", "Option B (correct)", "Option C", "Option D"],
              answer: 1,
              explain: "Explanation of why option B is correct."
            },
            {
              questionType: "flashcard",
              q: "Front of the flashcard — a term or prompt to recall",
              answerText: "The answer shown when flipped",
              explain: "Extra context reinforcing the answer."
            },
            {
              questionType: "fill-in-the-blank",
              q: "Revenue is recognised when control _______ to the customer.",
              answerText: "transfers",
              explain: "Use exactly 7 underscores in 'q' to mark the blank. Answer matching is case-insensitive."
            },
            {
              questionType: "sorting",
              q: "Put the steps in the correct order:",
              options: ["First step", "Second step", "Third step", "Fourth step"],
              explain: "List 'options' in the CORRECT order — the app shuffles them for the learner."
            },
            {
              questionType: "term-match",
              q: "Match each term to its definition:",
              pairs: [
                { term: "Term A", definition: "Definition of term A" },
                { term: "Term B", definition: "Definition of term B" },
                { term: "Term C", definition: "Definition of term C" }
              ],
              explain: "3-5 pairs works best."
            }
          ]
        }
      ]
    }
  ],
  finalAssessment: [
    {
      q: "Final assessment question?",
      options: ["A", "B (correct)", "C", "D"],
      answer: 1,
      explain: "Explanation."
    }
  ],
  glossary: [
    { term: "Term A", def: "Definition of term A." },
    { term: "Term B", def: "Definition of term B." }
  ],
  dilemmas: [
    {
      id: "m1_dilemma1",
      title: "The FOB vs CIF Decision",
      module: 1,
      dilemmaType: "commercial_tradeoff",
      characters: ["Priya (Trader)", "Daniel (Controller)"],
      startNode: "start",
      nodes: {
        start: {
          type: "decision",
          speaker: "Daniel",
          text: "The buyer wants us to handle freight too. What do we do?",
          choices: [
            { text: "Agree informally — keep contract as FOB", next: "outcome_informal" },
            { text: "Amend the contract to CIF", next: "outcome_cif" }
          ]
        },
        outcome_informal: {
          type: "consequence",
          tone: "negative",
          text: "The contract says FOB but you're handling freight. Auditors will flag the mismatch.",
          learningPoint: "Always update the Incoterm to reflect the real commercial arrangement.",
          choices: [{ text: "Continue", next: "end" }]
        },
        outcome_cif: {
          type: "consequence",
          tone: "positive",
          text: "You amend the contract to CIF. Everything is properly documented and the accounting analysis is correct.",
          learningPoint: "Switching to CIF changes risk exposure but keeps documentation clean.",
          choices: [{ text: "Continue", next: "end" }]
        },
        end: {
          type: "ending",
          text: "The Incoterm you choose drives revenue recognition under IFRS 15.",
          relatedTopics: ["Topic 1: Key Concepts"]
        }
      }
    }
  ],
  diagrams: {
    "concept-flow": {
      layout: "flow",
      title: "How the process works",
      items: [
        { label: "Step 1", desc: "Short description" },
        { label: "Step 2", desc: "Short description" },
        { label: "Step 3", desc: "Short description", accent: true }
      ],
      caption: "Layouts: flow, cycle, comparison (use 'columns'), stack, grid. Reference in lessons as {{diagram:concept-flow}}."
    }
  }
};

export default function StructuredCourseUpload() {
  const [parsedCourse, setParsedCourse] = useState(null);
  const [validationErrors, setValidationErrors] = useState([]);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState(null);
  const { toast } = useToast();
  const { reloadCourses } = useCourses();

  const downloadTemplate = () => {
    const blob = new Blob([JSON.stringify(TEMPLATE, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'tradeiq-course-template.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setError(null);
    setValidationErrors([]);
    setParsedCourse(null);

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const json = JSON.parse(ev.target.result);
        const errors = validateCourseStructure(json);
        if (errors.length > 0) {
          setValidationErrors(errors);
        } else {
          setParsedCourse(json);
          toast({ title: "Course file loaded", description: "Structure is valid. Review and publish." });
        }
      } catch (err) {
        setError("Invalid JSON file: " + err.message);
      }
    };
    reader.readAsText(file);
  };

  const handlePublish = async () => {
    setPublishing(true);
    setError(null);
    try {
      await publishCustomCourse(parsedCourse, 'structured_upload');
      await reloadCourses();
      toast({ title: "Course published!", description: `${parsedCourse.title} is now live.` });
      setParsedCourse(null);
    } catch (err) {
      setError(err.message || "Failed to publish course");
    } finally {
      setPublishing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="text-sm text-slate-600 mb-3">
          Upload a JSON file with the exact course structure. No AI needed — the course is created directly from your file.
        </p>
        <button onClick={downloadTemplate} className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-tiq-border text-slate-600 hover:bg-tiq-mintLight text-sm font-medium mb-3">
          <Download className="w-4 h-4" /> Download Template
        </button>
      </div>

      <div>
        <label className="flex items-center gap-2 px-4 py-3 rounded-lg border-2 border-dashed border-tiq-border bg-tiq-mintLight/20 text-slate-600 hover:bg-tiq-mintLight/40 cursor-pointer transition text-sm">
          <Upload className="w-4 h-4" /> Select JSON file
          <input type="file" accept=".json" onChange={handleFileSelect} className="hidden" />
        </label>
      </div>

      {validationErrors.length > 0 && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-500" />
            <span className="text-sm font-medium text-red-700">{validationErrors.length} validation error(s):</span>
          </div>
          <ul className="text-xs text-red-600 space-y-0.5 ml-6">
            {validationErrors.map((err, i) => <li key={i}>• {err}</li>)}
          </ul>
        </div>
      )}

      {parsedCourse && validationErrors.length === 0 && (
        <div className="space-y-3">
          <div className="p-4 rounded-lg bg-tiq-mintLight/40 border border-tiq-border">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span className="font-medium text-sm text-tiq-ink">{parsedCourse.title}</span>
            </div>
            <p className="text-sm text-slate-600 mb-3">{parsedCourse.description}</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="text-xl font-mono-tiq text-tiq-mint font-bold">{parsedCourse.modules?.length || 0}</p>
                <p className="text-xs text-slate-500">Modules</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-mono-tiq text-tiq-mint font-bold">{parsedCourse.modules?.reduce((s, m) => s + (m.topics?.length || 0), 0) || 0}</p>
                <p className="text-xs text-slate-500">Topics</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-mono-tiq text-tiq-mint font-bold">{parsedCourse.finalAssessment?.length || 0}</p>
                <p className="text-xs text-slate-500">Final Qs</p>
              </div>
            </div>
            <div className="space-y-1.5">
              {parsedCourse.modules?.map((mod, mi) => (
                <div key={mi} className="text-sm">
                  <span className="font-medium text-tiq-ink">{mod.title}</span>
                  <span className="text-xs text-slate-500 ml-2">
                    {mod.topics?.length || 0} topics · {mod.topics?.reduce((s, t) => s + (t.quiz?.length || 0), 0) || 0} questions
                  </span>
                </div>
              ))}
            </div>
            {parsedCourse.glossary?.length > 0 && (
              <p className="text-xs text-slate-500 mt-2 pt-2 border-t border-tiq-border">{parsedCourse.glossary.length} glossary terms</p>
            )}
            {parsedCourse.dilemmas?.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">{parsedCourse.dilemmas.length} daily dilemmas</p>
            )}
          </div>

          <button onClick={handlePublish} disabled={publishing} className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-emerald-500 text-white text-sm font-semibold hover:bg-emerald-600 disabled:opacity-40">
            {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
            {publishing ? "Publishing..." : "Publish Course"}
          </button>
        </div>
      )}

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}