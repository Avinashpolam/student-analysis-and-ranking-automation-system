import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useStudents, useAddStudent, useDeleteStudent } from "@/hooks/useStudents";

const StudentsPage = () => {
  const { data: students, isLoading } = useStudents();
  const addStudent = useAddStudent();
  const deleteStudent = useDeleteStudent();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ student_id: "", first_name: "", last_name: "", email: "", department: "", enrollment_year: new Date().getFullYear() });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStudent.mutate(form, { onSuccess: () => { setOpen(false); setForm({ student_id: "", first_name: "", last_name: "", email: "", department: "", enrollment_year: new Date().getFullYear() }); } });
  };

  return (
    <PageLayout
      title="Students"
      subtitle="Manage student records"
      actions={
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="w-4 h-4 mr-2" />Add Student</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle className="font-display">Add New Student</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div><Label>Student ID</Label><Input required value={form.student_id} onChange={(e) => setForm({ ...form, student_id: e.target.value })} placeholder="e.g. STU001" /></div>
                <div><Label>Department</Label><Input required value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} placeholder="e.g. Computer Science" /></div>
                <div><Label>First Name</Label><Input required value={form.first_name} onChange={(e) => setForm({ ...form, first_name: e.target.value })} /></div>
                <div><Label>Last Name</Label><Input required value={form.last_name} onChange={(e) => setForm({ ...form, last_name: e.target.value })} /></div>
                <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
                <div><Label>Enrollment Year</Label><Input type="number" required value={form.enrollment_year} onChange={(e) => setForm({ ...form, enrollment_year: parseInt(e.target.value) })} /></div>
              </div>
              <Button type="submit" className="w-full" disabled={addStudent.isPending}>{addStudent.isPending ? "Adding..." : "Add Student"}</Button>
            </form>
          </DialogContent>
        </Dialog>
      }
    >
      <div className="glass-card rounded-xl overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="data-table-header">ID</TableHead>
              <TableHead className="data-table-header">Name</TableHead>
              <TableHead className="data-table-header">Department</TableHead>
              <TableHead className="data-table-header">Email</TableHead>
              <TableHead className="data-table-header">Year</TableHead>
              <TableHead className="data-table-header w-16"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">Loading...</TableCell></TableRow>
            ) : !students?.length ? (
              <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No students yet. Add your first student above.</TableCell></TableRow>
            ) : (
              students.map((s) => (
                <TableRow key={s.id}>
                  <TableCell className="font-mono text-sm">{s.student_id}</TableCell>
                  <TableCell className="font-medium">{s.first_name} {s.last_name}</TableCell>
                  <TableCell>{s.department}</TableCell>
                  <TableCell className="text-muted-foreground">{s.email || "—"}</TableCell>
                  <TableCell>{s.enrollment_year}</TableCell>
                  <TableCell>
                    <Button variant="ghost" size="icon" onClick={() => deleteStudent.mutate(s.id)}>
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </PageLayout>
  );
};

export default StudentsPage;
