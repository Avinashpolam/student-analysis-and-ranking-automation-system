import { useState } from "react";
import { Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useScores, useAddScore } from "@/hooks/useScores";
import { useStudents } from "@/hooks/useStudents";
import { useSubjects } from "@/hooks/useSubjects";
import { useCycles, useAddCycle } from "@/hooks/useCycles";

const gradeColor = (grade: string | null) => {
  if (!grade) return "bg-muted text-muted-foreground";
  if (grade === "A+" || grade === "A") return "bg-accent/15 text-accent";
  if (grade === "B+" || grade === "B") return "bg-primary/10 text-primary";
  if (grade === "C") return "bg-secondary/20 text-secondary";
  if (grade === "D") return "bg-warning/15 text-warning";
  return "bg-destructive/15 text-destructive";
};

const ScoresPage = () => {
  const { data: students } = useStudents();
  const { data: subjects } = useSubjects();
  const { data: cycles } = useCycles();
  const addScore = useAddScore();
  const addCycle = useAddCycle();

  const [selectedCycle, setSelectedCycle] = useState<string>("");
  const { data: scores, isLoading } = useScores(selectedCycle);

  const [open, setOpen] = useState(false);
  const [cycleOpen, setCycleOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", subject_id: "", marks_obtained: 0 });
  const [cycleForm, setCycleForm] = useState({ name: "", academic_year: "2025-2026", semester: "Fall" });

  const handleAddScore = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = subjects?.find((s) => s.id === form.subject_id);
    addScore.mutate(
      { ...form, cycle_id: selectedCycle, max_marks: subject?.max_marks ?? 100 },
      { onSuccess: () => { setOpen(false); setForm({ student_id: "", subject_id: "", marks_obtained: 0 }); } }
    );
  };

  const handleAddCycle = (e: React.FormEvent) => {
    e.preventDefault();
    addCycle.mutate(cycleForm, {
      onSuccess: (data) => {
        setCycleOpen(false);
        setSelectedCycle(data.id);
        setCycleForm({ name: "", academic_year: "2025-2026", semester: "Fall" });
      },
    });
  };

  return (
    <PageLayout
      title="Scores"
      subtitle="Record and manage student marks"
      actions={
        <div className="flex items-center gap-3">
          <Select value={selectedCycle} onValueChange={setSelectedCycle}>
            <SelectTrigger className="w-56"><SelectValue placeholder="Select cycle..." /></SelectTrigger>
            <SelectContent>
              {cycles?.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name} ({c.semester} {c.academic_year})</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Dialog open={cycleOpen} onOpenChange={setCycleOpen}>
            <DialogTrigger asChild><Button variant="outline">New Cycle</Button></DialogTrigger>
            <DialogContent>
              <DialogHeader><DialogTitle className="font-display">Create Evaluation Cycle</DialogTitle></DialogHeader>
              <form onSubmit={handleAddCycle} className="space-y-4">
                <div><Label>Name</Label><Input required value={cycleForm.name} onChange={(e) => setCycleForm({ ...cycleForm, name: e.target.value })} placeholder="e.g. Midterm Exam" /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Academic Year</Label><Input required value={cycleForm.academic_year} onChange={(e) => setCycleForm({ ...cycleForm, academic_year: e.target.value })} /></div>
                  <div><Label>Semester</Label><Input required value={cycleForm.semester} onChange={(e) => setCycleForm({ ...cycleForm, semester: e.target.value })} /></div>
                </div>
                <Button type="submit" className="w-full" disabled={addCycle.isPending}>Create Cycle</Button>
              </form>
            </DialogContent>
          </Dialog>

          {selectedCycle && (
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild><Button><Plus className="w-4 h-4 mr-2" />Add Score</Button></DialogTrigger>
              <DialogContent>
                <DialogHeader><DialogTitle className="font-display">Record Score</DialogTitle></DialogHeader>
                <form onSubmit={handleAddScore} className="space-y-4">
                  <div>
                    <Label>Student</Label>
                    <Select value={form.student_id} onValueChange={(v) => setForm({ ...form, student_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                      <SelectContent>{students?.map((s) => <SelectItem key={s.id} value={s.id}>{s.first_name} {s.last_name} ({s.student_id})</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Subject</Label>
                    <Select value={form.subject_id} onValueChange={(v) => setForm({ ...form, subject_id: v })}>
                      <SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger>
                      <SelectContent>{subjects?.map((s) => <SelectItem key={s.id} value={s.id}>{s.code} — {s.name}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Marks Obtained {form.subject_id && `(Max: ${subjects?.find((s) => s.id === form.subject_id)?.max_marks})`}</Label>
                    <Input type="number" required min={0} value={form.marks_obtained} onChange={(e) => setForm({ ...form, marks_obtained: parseFloat(e.target.value) })} />
                  </div>
                  <Button type="submit" className="w-full" disabled={addScore.isPending}>Record Score</Button>
                </form>
              </DialogContent>
            </Dialog>
          )}
        </div>
      }
    >
      {!selectedCycle ? (
        <div className="text-center py-20 text-muted-foreground">
          <p className="text-lg font-medium">Select or create an evaluation cycle to view scores</p>
        </div>
      ) : (
        <div className="glass-card rounded-xl overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="data-table-header">Student</TableHead>
                <TableHead className="data-table-header">Subject</TableHead>
                <TableHead className="data-table-header">Marks</TableHead>
                <TableHead className="data-table-header">Grade</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
              ) : !scores?.length ? (
                <TableRow><TableCell colSpan={4} className="text-center py-8 text-muted-foreground">No scores recorded for this cycle.</TableCell></TableRow>
              ) : (
                scores.map((s) => (
                  <TableRow key={s.id}>
                    <TableCell className="font-medium">{s.students?.first_name} {s.students?.last_name}</TableCell>
                    <TableCell>{s.subjects?.code} — {s.subjects?.name}</TableCell>
                    <TableCell className="font-mono">{s.marks_obtained} / {s.subjects?.max_marks}</TableCell>
                    <TableCell><Badge className={gradeColor(s.grade)}>{s.grade}</Badge></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </PageLayout>
  );
};

export default ScoresPage;
