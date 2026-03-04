import { Users, BookOpen, Trophy, ClipboardList } from "lucide-react";
import PageLayout from "@/components/PageLayout";
import { useStudents } from "@/hooks/useStudents";
import { useSubjects } from "@/hooks/useSubjects";
import { useCycles } from "@/hooks/useCycles";

const StatCard = ({ icon: Icon, label, value, color }: { icon: any; label: string; value: string | number; color: string }) => (
  <div className="stat-card">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm text-muted-foreground font-medium">{label}</p>
        <p className="text-3xl font-display font-bold mt-1">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  const { data: students } = useStudents();
  const { data: subjects } = useSubjects();
  const { data: cycles } = useCycles();

  const activeCycles = cycles?.filter((c) => c.status === "active").length ?? 0;

  return (
    <PageLayout title="Dashboard" subtitle="Overview of academic evaluation system">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={Users} label="Total Students" value={students?.length ?? 0} color="bg-primary/10 text-primary" />
        <StatCard icon={BookOpen} label="Subjects" value={subjects?.length ?? 0} color="bg-secondary/20 text-secondary" />
        <StatCard icon={ClipboardList} label="Active Cycles" value={activeCycles} color="bg-accent/15 text-accent" />
        <StatCard icon={Trophy} label="Evaluations" value={cycles?.length ?? 0} color="bg-info/15 text-info" />
      </div>

      <div className="mt-10 glass-card rounded-xl p-6">
        <h2 className="font-display text-lg font-semibold mb-4">Getting Started</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { step: "1", title: "Add Students & Subjects", desc: "Register students and define subjects with credits and max marks." },
            { step: "2", title: "Record Scores", desc: "Enter marks for each student per subject within an evaluation cycle." },
            { step: "3", title: "Generate Rankings", desc: "Run the ranking engine to compute GPA, percentages, and classifications." },
          ].map((item) => (
            <div key={item.step} className="flex gap-4 p-4 rounded-lg bg-muted/50">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-bold shrink-0">
                {item.step}
              </div>
              <div>
                <p className="font-semibold text-sm">{item.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageLayout>
  );
};

export default Dashboard;
