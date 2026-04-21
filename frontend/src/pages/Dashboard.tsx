import { DataTable } from '@/components/data-table/DataTable';
import { columns } from '@/components/data-table/columns';

type Application = {
  id: string;
  title: string;
  company: string;
  status: 'applied' | 'interviewing' | 'rejected';
  next: 'follow up' | '1st round' | '2nd round' | 'none';
};

const applications: Application[] = [
  {
    id: 'app-001',
    title: 'Senior Frontend Developer',
    company: 'TechCorp',
    status: 'interviewing',
    next: '2nd round',
  },
  {
    id: 'app-002',
    title: 'Full Stack Engineer',
    company: 'StartupXYZ',
    status: 'applied',
    next: 'follow up',
  },
  {
    id: 'app-003',
    title: 'React Developer',
    company: 'WebSolutions Inc',
    status: 'rejected',
    next: 'none',
  },
  {
    id: 'app-004',
    title: 'Software Engineer',
    company: 'BigTech Co',
    status: 'interviewing',
    next: '1st round',
  },
  {
    id: 'app-005',
    title: 'Frontend Architect',
    company: 'DesignStudio',
    status: 'applied',
    next: 'follow up',
  },
  {
    id: 'app-006',
    title: 'JavaScript Developer',
    company: 'CodeFactory',
    status: 'interviewing',
    next: '2nd round',
  },
  {
    id: 'app-007',
    title: 'UI/UX Developer',
    company: 'Creative Agency',
    status: 'rejected',
    next: 'none',
  },
  {
    id: 'app-008',
    title: 'TypeScript Developer',
    company: 'ModernTech',
    status: 'applied',
    next: 'follow up',
  },
  {
    id: 'app-009',
    title: 'Lead Developer',
    company: 'Enterprise Solutions',
    status: 'interviewing',
    next: '1st round',
  },
  {
    id: 'app-010',
    title: 'Web Developer',
    company: 'Digital Marketing Co',
    status: 'applied',
    next: 'follow up',
  },
  {
    id: 'app-006',
    title: 'JavaScript Developer',
    company: 'CodeFactory',
    status: 'interviewing',
    next: '2nd round',
  },
  {
    id: 'app-007',
    title: 'UI/UX Developer',
    company: 'Creative Agency',
    status: 'rejected',
    next: 'none',
  },
  {
    id: 'app-008',
    title: 'TypeScript Developer',
    company: 'ModernTech',
    status: 'applied',
    next: 'follow up',
  },
  {
    id: 'app-009',
    title: 'Lead Developer',
    company: 'Enterprise Solutions',
    status: 'interviewing',
    next: '1st round',
  },
  {
    id: 'app-010',
    title: 'Web Developer',
    company: 'Digital Marketing Co',
    status: 'applied',
    next: 'follow up',
  },
];

export function Dashboard() {
  return (
    <div className="px-10 py-4">
      <span className="text-4xl font-semibold">Applications</span>
      <DataTable columns={columns} data={applications} />
    </div>
  );
}
