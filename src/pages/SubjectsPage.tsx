import { useState } from "react";
import { Plus } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useSubjects, useAddSubject } from "@/hooks/useSubjects";

const SubjectsPage = () => {
  const { data: subjects, isLoading } = useSubjects();
  const addSubject = useAddSubject();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ code: "", name: "", max_marks: 100, credits: 3, department: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSubject.mutate(form, { onSuccess: () => { setOpen(false); setForm({ code: "", name: "", max_marks: 100, credits: 3, department: "" }); } });
  };

  return (
    <PageLayout
      title="Subjects"
      subtitle="Define subjects with credits and max marks"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Subject</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Add New Subject</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Code</Label><Input required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="e.g. CS101" /></div>
                <div><Label>Name</Label><Input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Data Structures" /></div>
                <div><Label>Max Marks</Label><Input type="number" required value={form.max_marks} onChange={(e) => setForm({ ...form, max_marks: parseInt(e.target.value) })} /></div>
                <div><Label>Credits</Label><Input type="number" required value={form.credits} onChange={(e) => setForm({ ...form, credits: parseInt(e.target.value) })} /></div>
              </div>
              <div><Label>Department</Label><Input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} /></div>
              <Button type="submit" className="w-full" disabled={addSubject.isPending}>{addSubject.isPending ? "Adding..." : "Add Subject"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="data-table-header">Code</TableHead>
              <TableHead className="data-table-header">Name</TableHead>
              <TableHead className="data-table-header">Department</TableHead>
              <TableHead className="data-table-header">Max Marks</TableHead>
              <TableHead className="data-table-header">Credits</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : !subjects?.length ? (
              <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No subjects yet.</TableCell></TableRow>
            ) : (
              subjects.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm font-medium">{s.code}</TableCell>
                  <TableCell className="font-medium">{s.name}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell>{s.max_marks}</TableCell>
                  <TableCell>{s.credits}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
};

export default SubjectsPage;
