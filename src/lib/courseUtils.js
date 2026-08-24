import { courseIdExists, adminPublishCourse } from '@/lib/remoteCourses';
import { COURSES, collectCourseIds } from '@/lib/courses';

export function slugify(text) {
  return (text || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
}

export function validateCourseStructure(course) {
  const errors = [];
  if (!course) { errors.push("No course data provided"); return errors; }
  if (!course.title) errors.push("Missing 'title'");
  if (!course.modules || !Array.isArray(course.modules)) {
    errors.push("Missing or invalid 'modules' (must be an array)");
    return errors;
  }
  if (course.modules.length === 0) errors.push("'modules' array is empty");

  const allTopicIds = new Set();
  course.modules.forEach((mod, mi) => {
    if (!mod.id) errors.push(`Module ${mi + 1}: Missing 'id'`);
    if (!mod.title) errors.push(`Module ${mi + 1}: Missing 'title'`);
    if (!mod.topics || !Array.isArray(mod.topics)) {
      errors.push(`Module ${mi + 1}: Missing or invalid 'topics' (must be an array)`);
      return;
    }
    mod.topics.forEach((topic, ti) => {
      if (!topic.id) errors.push(`Module ${mi + 1} Topic ${ti + 1}: Missing 'id'`);
      if (allTopicIds.has(topic.id)) errors.push(`Duplicate topic ID: ${topic.id}`);
      allTopicIds.add(topic.id);
      if (!topic.title) errors.push(`Module ${mi + 1} Topic ${ti + 1}: Missing 'title'`);
      if (!topic.lesson) errors.push(`Module ${mi + 1} Topic ${ti + 1}: Missing 'lesson'`);
      if (!topic.quiz || !Array.isArray(topic.quiz) || topic.quiz.length === 0) {
        errors.push(`Module ${mi + 1} Topic ${ti + 1}: Missing or empty 'quiz'`);
        return;
      }
      topic.quiz.forEach((q, qi) => {
        const label = `M${mi + 1}T${ti + 1} Q${qi + 1}`;
        if (!q.q) errors.push(`${label}: Missing 'q' (question text)`);
        if (q.questionType === 'sorting') {
          if (!q.options || !Array.isArray(q.options) || q.options.length < 2)
            errors.push(`${label}: Sorting question needs 2+ options`);
          if (!q.explain) errors.push(`${label}: Missing 'explain'`);
        } else if (q.questionType === 'term-match') {
          if (!q.pairs || !Array.isArray(q.pairs) || q.pairs.length < 2)
            errors.push(`${label}: Term-match needs 2+ pairs`);
        } else if (q.questionType === 'flashcard' || q.questionType === 'fill-in-the-blank') {
          if (!q.answerText) errors.push(`${label}: Missing 'answerText'`);
          if (!q.explain) errors.push(`${label}: Missing 'explain'`);
        } else {
          if (!q.options || !Array.isArray(q.options) || q.options.length !== 4)
            errors.push(`${label}: MCQ must have exactly 4 options`);
          if (typeof q.answer !== 'number' || q.answer < 0 || q.answer > 3)
            errors.push(`${label}: 'answer' must be 0-3`);
          if (!q.explain) errors.push(`${label}: Missing 'explain'`);
        }
      });
    });
  });

  // Validate diagrams (optional — only if present)
  if (course.diagrams !== undefined) {
    if (typeof course.diagrams !== 'object' || Array.isArray(course.diagrams)) {
      errors.push("'diagrams' must be an object keyed by diagram id");
    } else {
      const validLayouts = ['flow', 'cycle', 'comparison', 'stack', 'grid'];
      for (const [key, spec] of Object.entries(course.diagrams)) {
        if (!spec || !validLayouts.includes(spec.layout))
          errors.push(`Diagram '${key}': 'layout' must be one of ${validLayouts.join(', ')}`);
        else if (spec.layout === 'comparison') {
          if (!Array.isArray(spec.columns) || spec.columns.length < 2)
            errors.push(`Diagram '${key}': comparison layout needs 'columns' (2+)`);
        } else if (!Array.isArray(spec.items) || spec.items.length < 2) {
          errors.push(`Diagram '${key}': needs 'items' (2+)`);
        }
      }
    }
  }

  // Validate dilemmas (optional — only if present)
  if (course.dilemmas !== undefined) {
    if (!Array.isArray(course.dilemmas)) {
      errors.push("'dilemmas' must be an array if present");
    } else {
      const validNodeTypes = ['decision', 'consequence', 'ending'];
      const validTones = ['positive', 'negative', 'neutral'];
      course.dilemmas.forEach((d, di) => {
        const label = `Dilemma ${di + 1}`;
        if (!d.id) errors.push(`${label}: Missing 'id'`);
        if (!d.title) errors.push(`${label}: Missing 'title'`);
        if (typeof d.module !== 'number') errors.push(`${label}: Missing or non-number 'module'`);
        if (!d.dilemmaType) errors.push(`${label}: Missing 'dilemmaType'`);
        if (!d.startNode) errors.push(`${label}: Missing 'startNode'`);
        if (!d.nodes || typeof d.nodes !== 'object' || Array.isArray(d.nodes)) {
          errors.push(`${label}: Missing or invalid 'nodes' (must be an object)`);
          return;
        }
        if (!d.nodes[d.startNode]) {
          errors.push(`${label}: 'startNode' "${d.startNode}" not found in nodes`);
        }
        const allNodeIds = Object.keys(d.nodes);
        const allChoiceTargets = new Set();
        Object.entries(d.nodes).forEach(([nodeId, node]) => {
          const nodeLabel = `${label} node "${nodeId}"`;
          if (!node.type || !validNodeTypes.includes(node.type)) {
            errors.push(`${nodeLabel}: Missing or invalid 'type' (must be decision, consequence, or ending)`);
          }
          if (!node.text) errors.push(`${nodeLabel}: Missing 'text'`);
          if (node.type === 'decision') {
            if (!node.speaker) errors.push(`${nodeLabel}: Missing 'speaker'`);
            if (!node.choices || !Array.isArray(node.choices) || node.choices.length < 2) {
              errors.push(`${nodeLabel}: Decision node needs 2+ choices`);
            } else {
              node.choices.forEach((c, ci) => {
                if (!c.text) errors.push(`${nodeLabel} choice ${ci + 1}: Missing 'text'`);
                if (!c.next) errors.push(`${nodeLabel} choice ${ci + 1}: Missing 'next'`);
                else allChoiceTargets.add(c.next);
              });
            }
          }
          if (node.type === 'consequence') {
            if (!node.tone || !validTones.includes(node.tone)) {
              errors.push(`${nodeLabel}: Missing or invalid 'tone' (must be positive, negative, or neutral)`);
            }
            if (!node.learningPoint) errors.push(`${nodeLabel}: Missing 'learningPoint'`);
            if (!node.choices || !Array.isArray(node.choices) || node.choices.length < 1) {
              errors.push(`${nodeLabel}: Consequence node needs at least 1 choice`);
            } else {
              node.choices.forEach((c, ci) => {
                if (!c.text) errors.push(`${nodeLabel} choice ${ci + 1}: Missing 'text'`);
                if (!c.next) errors.push(`${nodeLabel} choice ${ci + 1}: Missing 'next'`);
                else allChoiceTargets.add(c.next);
              });
            }
          }
        });
        // Check all choice targets exist as nodes
        allChoiceTargets.forEach((target) => {
          if (!allNodeIds.includes(target)) {
            errors.push(`${label}: Choice target "${target}" not found in nodes`);
          }
        });
      });
    }
  }

  return errors;
}

export function generateFinalAssessment(courseData) {
  const modules = courseData.modules || [];
  if (modules.length === 0) return [];

  const targetCount = 12;
  const perModule = Math.max(1, Math.ceil(targetCount / modules.length));

  const questions = [];
  for (const mod of modules) {
    const modQuestions = (mod.topics || [])
      .flatMap(t => (t.quiz || []).map(q => ({ ...q, _topicId: t.id })))
      // Flashcards are excluded because they are self-graded — the learner taps
      // "I Remembered This", which cannot decide a certification. Every other
      // type is checked against a definitive answer and belongs in the exam.
      .filter(q => q.questionType !== 'flashcard');
    questions.push(...modQuestions.slice(0, perModule));
  }

  return questions.slice(0, targetCount);
}

// A short, stable prefix derived from the course slug — "uae-banking-
// fundamentals" becomes "uaebf". Initials rather than the whole slug so ids stay
// readable in the editor and in exports.
function idPrefix(slug) {
  const words = slug.split('-').filter(Boolean);
  const initials = words.map((w) => w[0]).join('');
  return (initials.length >= 3 ? initials : slug.replace(/-/g, '')).slice(0, 8);
}

// Namespace a course's module and topic ids when any of them are already used by
// another course in the catalog.
//
// Topic ids only have to be unique within a course, and every store that holds
// learner state keys by course id too, so a collision is not corrupting today.
// It is still worth removing at the point of upload: an unprefixed course
// ("m1", "m1t1") collides with every other unprefixed course, and each
// collision is a latent bug for anything that later keys by bare topic id.
// Renaming here is free — the course has not been published, nothing references
// its ids yet, and nothing inside course_data points at a topic id (diagrams are
// keyed by diagram name, dilemmas by module number).
//
// Returns the possibly-rewritten course plus the renames, so the upload UI can
// say what happened rather than silently changing the file the admin supplied.
export function namespaceCourseIds(courseData, slug, takenIds) {
  const used = collectCourseIds(courseData);
  const clashing = [...used].filter((id) => takenIds.has(id));
  if (clashing.length === 0) return { courseData, renamed: [] };

  const prefix = idPrefix(slug);
  const renamed = [];
  const rename = (id) => {
    if (!id || id.startsWith(`${prefix}_`)) return id;
    const next = `${prefix}_${id}`;
    renamed.push({ from: id, to: next });
    return next;
  };

  const modules = (courseData.modules || []).map((m) => ({
    ...m,
    id: rename(m.id),
    topics: (m.topics || []).map((t) => ({ ...t, id: rename(t.id) })),
  }));

  return { courseData: { ...courseData, modules }, renamed };
}

export async function publishCustomCourse(courseData, source) {
  const slug = slugify(courseData.title);
  if (!slug) throw new Error('Could not generate course ID from title');

  if (await courseIdExists(slug)) {
    throw new Error(`A course with ID "${slug}" already exists. Please use a different title.`);
  }

  // Keep the catalog expandable: ids that already belong to another course are
  // prefixed with this course's own namespace before anything is written.
  const taken = new Set();
  for (const existing of COURSES) for (const id of collectCourseIds(existing)) taken.add(id);
  const { courseData: namespaced, renamed } = namespaceCourseIds(courseData, slug, taken);
  courseData = namespaced;

  const certificateText = courseData.certificateText || courseData.description || courseData.title;
  const finalAssessment = (courseData.finalAssessment && courseData.finalAssessment.length > 0)
    ? courseData.finalAssessment
    : generateFinalAssessment(courseData);

  await adminPublishCourse({
    course_id: slug,
    title: courseData.title,
    subtitle: courseData.subtitle || '',
    description: courseData.description || '',
    category: courseData.category || 'General',
    level: courseData.level || 'Intermediate',
    certificate_text: certificateText,
    icon: courseData.icon || 'BookOpen',
    gradient: courseData.gradient || 'from-blue-500/10 to-indigo-500/5',
    course_data: { ...courseData, certificateText, finalAssessment },
    source,
    is_published: true,
    modules_count: (courseData.modules || []).length,
    topics_count: (courseData.modules || []).reduce((s, m) => s + (m.topics || []).length, 0),
  });

  return { slug, renamed };
}