// Rule-based ranking engine

export interface ScoreEntry {
  student_id: string;
  marks_obtained: number;
  max_marks: number;
  credits: number;
}

export interface RankingResult {
  student_id: string;
  total_marks: number;
  percentage: number;
  gpa: number;
  rank: number;
  classification: string;
}

function marksToGradePoint(percentage: number): number {
  if (percentage >= 90) return 10;
  if (percentage >= 80) return 9;
  if (percentage >= 70) return 8;
  if (percentage >= 60) return 7;
  if (percentage >= 50) return 6;
  if (percentage >= 40) return 5;
  return 0;
}

function classify(percentage: number): string {
  if (percentage >= 90) return "Outstanding";
  if (percentage >= 75) return "Distinction";
  if (percentage >= 60) return "First Class";
  if (percentage >= 50) return "Second Class";
  if (percentage >= 40) return "Pass";
  return "Fail";
}

export function calculateGrade(marks: number, maxMarks: number): string {
  const pct = (marks / maxMarks) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 80) return "A";
  if (pct >= 70) return "B+";
  if (pct >= 60) return "B";
  if (pct >= 50) return "C";
  if (pct >= 40) return "D";
  return "F";
}

export function computeRankings(
  studentScores: Map<string, ScoreEntry[]>
): RankingResult[] {
  const results: Omit<RankingResult, "rank">[] = [];

  studentScores.forEach((scores, studentId) => {
    const totalMarks = scores.reduce((sum, s) => sum + s.marks_obtained, 0);
    const totalMaxMarks = scores.reduce((sum, s) => sum + s.max_marks, 0);
    const percentage = totalMaxMarks > 0 ? (totalMarks / totalMaxMarks) * 100 : 0;

    // Weighted GPA
    const totalCredits = scores.reduce((sum, s) => sum + s.credits, 0);
    const weightedGP = scores.reduce((sum, s) => {
      const pct = (s.marks_obtained / s.max_marks) * 100;
      return sum + marksToGradePoint(pct) * s.credits;
    }, 0);
    const gpa = totalCredits > 0 ? weightedGP / totalCredits : 0;

    results.push({
      student_id: studentId,
      total_marks: Math.round(totalMarks * 100) / 100,
      percentage: Math.round(percentage * 100) / 100,
      gpa: Math.round(gpa * 100) / 100,
      classification: classify(percentage),
    });
  });

  // Sort by percentage descending, then by GPA
  results.sort((a, b) => b.percentage - a.percentage || b.gpa - a.gpa);

  return results.map((r, i) => ({ ...r, rank: i + 1 }));
}
