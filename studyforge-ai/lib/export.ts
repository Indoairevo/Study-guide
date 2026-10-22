import { Document, HeadingLevel, Packer, Paragraph, TextRun } from "docx";
import { saveAs } from "file-saver";
import type { StudyPack } from "./study";

export async function exportDocx(pack: StudyPack) {
  const children: Paragraph[] = [
    new Paragraph({ text: pack.title, heading: HeadingLevel.TITLE }),
    new Paragraph({ children: [new TextRun({ text: `${pack.className} • ${pack.subject}`, italics: true })] }),
    new Paragraph({ text: "Chapter overview", heading: HeadingLevel.HEADING_1 }),
    new Paragraph(pack.summary),
    new Paragraph({ text: "Key points", heading: HeadingLevel.HEADING_1 }),
    ...pack.keyPoints.map(p => new Paragraph({ text: p, bullet: { level: 0 } })),
    new Paragraph({ text: "Formula & method lab", heading: HeadingLevel.HEADING_1 }),
    ...pack.formulas.flatMap(f => [
      new Paragraph({ text: f.name, heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ children: [new TextRun({ text: f.formula, bold: true })] }),
      new Paragraph(f.explanation),
      new Paragraph({ children: [new TextRun({ text: "Example: ", bold: true }), new TextRun(f.example)] }),
    ]),
    new Paragraph({ text: "Practice questions", heading: HeadingLevel.HEADING_1 }),
    ...pack.questions.flatMap((q, i) => [
      new Paragraph({ text: `${i + 1}. ${q.question}`, heading: HeadingLevel.HEADING_2 }),
      new Paragraph({ children: [new TextRun({ text: `${q.marks} • Suggested answer: `, bold: true }), new TextRun(q.answer)] }),
    ]),
    new Paragraph({ text: "Last-minute revision checklist", heading: HeadingLevel.HEADING_1 }),
    ...pack.revision.map(p => new Paragraph({ text: p, bullet: { level: 0 } })),
    new Paragraph({ children: [new TextRun({ text: "Study note: ", bold: true }), new TextRun("Verify syllabus-specific facts with your prescribed textbook and teacher's material.")] }),
  ];
  const doc = new Document({ sections: [{ properties: {}, children }] });
  const blob = await Packer.toBlob(doc);
  saveAs(blob, `${pack.title.replace(/[^a-z0-9-_]+/gi, "-").toLowerCase() || "study-pack"}.docx`);
}
