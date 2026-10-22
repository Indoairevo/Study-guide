export type StudyPack = {
  title: string;
  subject: string;
  className: string;
  summary: string;
  keyPoints: string[];
  questions: { question: string; answer: string; marks: string }[];
  formulas: { name: string; formula: string; explanation: string; example: string }[];
  revision: string[];
};

const genericQuestions = [
  { question: "Define the main concept of this chapter and explain why it matters.", answer: "Start with a clear definition, then explain its purpose and give one relevant example from the chapter.", marks: "2 marks" },
  { question: "Explain the key process or idea step by step.", answer: "Write the steps in logical order. Use keywords, short sentences and a labelled diagram where useful.", marks: "3 marks" },
  { question: "Differentiate between two important terms from this chapter.", answer: "Use a comparison table with meaning, key feature and one example for each term.", marks: "3 marks" },
  { question: "Write a detailed answer on the most important topic in this chapter.", answer: "Begin with a short introduction, explain 3–5 key points, add a diagram/example if relevant, and finish with a concise conclusion.", marks: "5 marks" },
];

export function createStudyPack(chapter: string, subject: string, className: string, board: string): StudyPack {
  const safeChapter = chapter.trim() || "Your Chapter";
  const math = /math|algebra|trigon|geometry|arithmetic|calculus|quadratic|mensuration|coordinate/i.test(subject + " " + safeChapter);
  const history = /history|war|nationalism|revolution|independence|civilization|timeline/i.test(subject + " " + safeChapter);
  const science = /science|physics|chemistry|biology|light|electric|force|motion|reaction|cell|life process/i.test(subject + " " + safeChapter);
  const summary = math
    ? `${safeChapter} becomes easier when you identify the given information, select the correct rule or formula, substitute values carefully, and check the final answer. Learn what each symbol means before memorising a formula.`
    : history
    ? `${safeChapter} can be revised through its background, key people, major events, causes, consequences and significance. Connect events in chronological order and practise explaining cause-and-effect relationships.`
    : science
    ? `${safeChapter} is best understood by connecting definitions with real examples, processes and labelled diagrams. Focus on how and why something happens, not only on memorising the final definition.`
    : `This study pack for ${safeChapter} is organised around core ideas, definitions, examples and exam practice. Read the chapter once, learn the key terms, explain each idea in your own words, then test your recall with the questions below.`;
  const formulas = math ? [
    { name: "Identify the rule", formula: "Write: Given → Required → Formula", explanation: "This simple structure keeps your solution organised.", example: "Given values → choose a matching formula → substitute → simplify." },
    { name: "Check your answer", formula: "Substitute back / verify units", explanation: "A quick check can catch arithmetic or sign mistakes.", example: "Recheck calculations and confirm the answer fits the question." },
    { name: "Show each step", formula: "Method marks + final answer", explanation: "Write intermediate steps instead of jumping to the result.", example: "State the formula, substitute values and simplify line by line." },
  ] : [
    { name: "Keyword → Meaning", formula: "Term = definition + key feature", explanation: "Learn a precise definition and one distinguishing point.", example: "Write the term, explain it in one sentence, then add an example." },
    { name: "Cause and effect", formula: "Cause → Event / Process → Result", explanation: "Useful for history, geography and science explanations.", example: "Explain what started a process and what changed because of it." },
    { name: "Long-answer structure", formula: "Intro → 3–5 points → Example → Conclusion", explanation: "A clear structure makes answers easier to mark.", example: "Use headings or numbered points and include subject keywords." },
  ];
  return {
    title: safeChapter,
    subject: subject || "General Studies",
    className: className || "Your class",
    summary,
    keyPoints: [
      `Start with the exact definition and central idea of ${safeChapter}.`,
      "Learn all important terms, names, dates, units or symbols from your textbook.",
      "Connect the main ideas using a flowchart, timeline or comparison table.",
      "Practise explaining each major heading without looking at your notes.",
      `Use your ${board || "school"} textbook and teacher's notes to verify details before the exam.`,
    ],
    questions: genericQuestions,
    formulas,
    revision: [
      `Can I explain ${safeChapter} in 30 seconds?`,
      "Can I recall the key definitions without looking?",
      "Can I draw or explain the main diagram / process?",
      "Can I answer one short, one medium and one long question?",
      "Have I checked examples and exercise questions from my textbook?",
    ],
  };
}

export function extractStudySignals(transcript: string) {
  const clean = transcript.replace(/\s+/g, " ").trim();
  if (!clean) return { points: [], questions: [] as string[] };
  const sentences = clean.split(/(?<=[.!?।])\s+/).map(s => s.trim()).filter(s => s.length > 25);
  const points = sentences
    .map(s => s.replace(/^[\-\d.)\s]+/, ""))
    .filter(s => /important|exam|question|remember|definition|formula|because|therefore|means|known as|called|cause|result|feature|difference|example|first|second|third|key|मुख्य|महत्वपूर्ण|परिभाषा|कारण|परिणाम/i.test(s))
    .slice(0, 8);
  const selected = (points.length ? points : sentences).slice(0, 6);
  const questions = selected.slice(0, 5).map(s => {
    const short = s.length > 105 ? s.slice(0, 102).trim() + "…" : s;
    return `Explain the key idea: “${short}”`;
  });
  return { points: selected, questions };
}
