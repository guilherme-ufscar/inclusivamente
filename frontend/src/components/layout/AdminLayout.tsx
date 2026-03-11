import { ReactNode } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import {
    LogOut,
    LayoutDashboard,
    Users,
    School,
    BrainCircuit,
    FileText,
    Settings,
    Menu,
    Bell,
    BookOpen,
    Users2,
    HeartHandshake,
    MessageSquare,
    ClipboardCheck,
    ListTodo,
    Compass,
    Image as ImageIcon
} from 'lucide-react';
import { useState } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface AdminLayoutProps {
    children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isSidebarOpen, setSidebarOpen] = useState(true);
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, title: 'Novo Aluno Cadastrado', text: 'O aluno Gabriel Silva foi adicionado à Escola Sol.', time: 'Há 10 minutos' },
        { id: 2, title: 'Atividade Concluída', text: 'Maria Oliveira finalizou "Jogo de Cores" (80% autonomia).', time: 'Há 1 hora' },
    ]);

    const handleClearNotifications = () => {
        setNotifications([]);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { name: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },

        { category: 'Pedagógico' },
        { name: 'Matérias', icon: BookOpen, path: '/admin/subjects' },
        { name: 'Capítulos', icon: ListTodo, path: '/admin/chapters' },
        { name: 'Turmas', icon: Users, path: '/admin/classes' },
        { name: 'Alunos', icon: Users2, path: '/admin/students' },
        { name: 'Tutores', icon: HeartHandshake, path: '/admin/staff' },
        { name: 'BNCC', icon: Compass, path: '/admin/bncc' },

        { category: 'Acompanhamento' },
        { name: 'Atividades Corporais', icon: BrainCircuit, path: '/admin/activities' },
        { name: 'Histórico de Tutoria', icon: HeartHandshake, path: '/admin/tutor-history' },
        { name: 'Relatórios Analíticos', icon: FileText, path: '/admin/reports' },
        { name: 'Check-ins (Troca 360)', icon: MessageSquare, path: '/admin/checkins' },

        { category: 'Anamnese' },
        { name: 'Esferas', icon: ClipboardCheck, path: '/admin/anamnesis-spheres' },
        { name: 'Perguntas', icon: ClipboardCheck, path: '/admin/anamnesis-questions' },
        { name: 'Graus Parentesco', icon: Users, path: '/admin/kinship' },

        { category: 'Sistema' },
        { name: 'Imagens', icon: ImageIcon, path: '/admin/images' },
        { name: 'Escolas', icon: School, path: '/admin/schools' },
        { name: 'Configurações', icon: Settings, path: '/admin/settings' },
    ];

    return (
        <div className="min-h-screen bg-app-bg flex overflow-hidden">

            {/* Sidebar */}
            <aside className={cn(
                "fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 flex flex-col",
                isSidebarOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <Link to="/admin/dashboard" className="h-16 flex items-center px-6 bg-brand-primary shrink-0 hover:opacity-95 transition-opacity">
                    <img src="/logo-branca.svg" alt="Logo" className="h-9 w-auto" />
                </Link>

                <nav className="flex-1 overflow-y-auto p-4 space-y-1">
                    {navItems.map((item, idx) => {
                        if ('category' in item) {
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
                            {user?.name?.charAt(0) || 'A'}
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
                        Sair da Plataforma
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0 bg-slate-50">

                {/* Top Header */}
                <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-4 sm:px-6 lg:px-8 shrink-0">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="lg:hidden p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="flex-1" />

                    <div className="flex items-center gap-4 relative">
                        <button
                            onClick={() => setShowNotifications(!showNotifications)}
                            className="relative p-2 text-slate-400 hover:text-slate-500 transition-colors"
                        >
                            <Bell className="h-5 w-5" />
                            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white"></span>
                        </button>

                        {showNotifications && (
                            <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-in fade-in zoom-in-95">
                                <div className="px-4 py-2 border-b border-slate-50 font-bold text-sm text-slate-800 flex justify-between items-center">
                                    Notificações
                                    <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{notifications.length} {notifications.length === 1 ? 'nova' : 'novas'}</span>
                                </div>
                                <div className="max-h-64 overflow-y-auto">
                                    {notifications.length === 0 ? (
                                        <div className="px-4 py-8 text-center text-slate-400 text-xs">
                                            Nenhuma notificação no momento.
                                        </div>
                                    ) : (
                                        notifications.map(n => (
                                            <div key={n.id} className="px-4 py-3 hover:bg-slate-50 transition-colors cursor-pointer border-b border-slate-50/50">
                                                <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                                                <p className="text-[10px] text-slate-500">{n.text}</p>
                                                <p className="text-[9px] text-slate-400 mt-1">{n.time}</p>
                                            </div>
                                        ))
                                    )}
                                </div>
                                {notifications.length > 0 && (
                                    <div className="px-4 py-2 border-t border-slate-50 text-center">
                                        <button
                                            onClick={handleClearNotifications}
                                            className="text-[10px] font-bold text-brand-primary hover:underline"
                                        >
                                            Limpar todas
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>

        </div>
    );
}
