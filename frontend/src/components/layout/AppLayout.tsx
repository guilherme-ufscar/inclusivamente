import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LogOut,
    LayoutDashboard,
    Users,
    Users2,
    HeartHandshake,
    Menu,
    Bell,
    Settings,
    MessageSquare,
    BrainCircuit,
    FileText
} from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface LayoutProps {
    children: ReactNode;
}

export default function AppLayout({ children }: LayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getNavItems = () => {
        if (user?.role === 'admin') {
            return [
                { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
                { category: 'Pedagógico' },
                { name: 'Matérias', icon: FileText, path: '/admin/subjects' },
                { name: 'Capítulos', icon: FileText, path: '/admin/chapters' },
                { name: 'Turmas', icon: Users, path: '/admin/classes' },
                { name: 'Alunos', icon: Users2, path: '/admin/students' },
                { name: 'Tutores', icon: HeartHandshake, path: '/admin/staff' },
                { category: 'Acompanhamento' },
                { name: 'Atividades', icon: BrainCircuit, path: '/admin/activities' },
                { name: 'Relatórios', icon: FileText, path: '/admin/reports' },
                { name: 'Check-ins', icon: MessageSquare, path: '/admin/checkins' },
                { category: 'Anamnese' },
                { name: 'Esferas', icon: Settings, path: '/admin/anamnesis-spheres' },
                { name: 'Perguntas', icon: Settings, path: '/admin/anamnesis-questions' },
                { category: 'Sistema' },
                { name: 'BNCC', icon: Settings, path: '/admin/bncc' },
                { name: 'Parentesco', icon: Users, path: '/admin/kinship' },
                { name: 'Escolas', icon: Settings, path: '/admin/schools' },
                { name: 'Configurações', icon: Settings, path: '/admin/settings' },
            ];
        } else if (user?.role === 'tutor') {
            return [
                { name: 'Meu Painel', icon: LayoutDashboard, path: '/tutor/dashboard' },
                { category: 'Acompanhamento' },
                { name: 'Meus Alunos', icon: Users2, path: '/tutor/students' },
                { name: 'Lançar Atividade', icon: BrainCircuit, path: '/tutor/activities' },
                { name: 'Pareceres IA', icon: FileText, path: '/tutor/reports' },
            ];
        } else if (user?.role === 'parent') {
            return [
                { name: 'Início', icon: LayoutDashboard, path: '/parent/dashboard' },
                { category: 'Evolução' },
                { name: 'Relatórios', icon: FileText, path: '/parent/reports' },
                { name: 'Atividades Realizadas', icon: BrainCircuit, path: '/parent/activities' },
            ];
        }
        return [];
    };

    const navItems = getNavItems();

    return (
        <div className="min-h-screen bg-app-bg flex overflow-hidden">
            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="h-16 flex items-center px-6 bg-brand-primary shrink-0">
                    <img src="/logo-branca.svg" alt="Logo" className="h-9 w-auto" />
                </div>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item: any, idx) => {
                        if (item.category) {
                            return <div key={`cat-${idx}`} className="pt-4 pb-1 px-3 text-[10px] uppercase tracking-wider font-bold text-slate-400">{item.category}</div>
                        }
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.name}
                                to={item.path}
                                className={cn(
                                    "flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors group",
                                    isActive
                                        ? "bg-brand-primary/10 text-brand-primary"
                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                )}
                            >
                                <item.icon className={cn(
                                    "mr-3 h-5 w-5 shrink-0 transition-colors",
                                    isActive ? "text-brand-primary" : "text-slate-400 group-hover:text-slate-600"
                                )} />
                                {item.name}
                            </Link>
                        )
                    })}
                </nav>

                <div className="p-4 border-t border-slate-100 shrink-0">
                    <div className="flex bg-slate-50 rounded-xl p-3 items-center mb-4">
                        <div className="h-10 w-10 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold">
                            {user?.name?.charAt(0) || 'U'}
                        </div>
                        <div className="ml-3 overflow-hidden">
                            <p className="text-sm font-medium text-slate-900 truncate">{user?.name}</p>
                            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="flex w-full items-center px-3 py-2 text-sm font-medium text-red-600 rounded-xl hover:bg-red-50 transition-colors"
                    >
                        <LogOut className="mr-3 h-5 w-5" />
                        Sair
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                    <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 text-slate-400">
                        <Menu className="h-6 w-6" />
                    </button>
                    <div className="flex-1" />
                    <button className="p-2 text-slate-400 hover:text-slate-500 transition-colors">
                        <Bell className="h-5 w-5" />
                    </button>
                </header>

                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}
