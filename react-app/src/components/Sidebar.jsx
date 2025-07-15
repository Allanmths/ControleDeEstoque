import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { PermissionGuard } from './ProtectedRoute';
import { PERMISSIONS } from '../utils/permissions';
import { 
    FaHome, FaChartPie, FaBoxOpen, FaPlusCircle, 
    FaExchangeAlt, FaClipboardCheck, FaHistory, FaFileAlt, FaCog, FaSignOutAlt 
} from 'react-icons/fa';

// Links de navegação com permissões
const navLinks = [
    { to: '/', text: 'Início', icon: FaHome, permissions: [] },
    { to: '/dashboard', text: 'Dashboard', icon: FaChartPie, permissions: [] },
    { to: '/stock', text: 'Estoque', icon: FaBoxOpen, permissions: [PERMISSIONS.VIEW_STOCK] },
    { to: '/registers', text: 'Cadastros', icon: FaPlusCircle, permissions: [PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.VIEW_CATEGORIES, PERMISSIONS.VIEW_SUPPLIERS] },
    { to: '/movements', text: 'Movimentações', icon: FaExchangeAlt, permissions: [PERMISSIONS.VIEW_MOVEMENTS] },
    { to: '/counting', text: 'Contagem', icon: FaClipboardCheck, permissions: [PERMISSIONS.VIEW_COUNTING] },
    { to: '/audit', text: 'Auditoria', icon: FaHistory, permissions: [PERMISSIONS.VIEW_AUDIT] },
    { to: '/reports', text: 'Relatórios', icon: FaFileAlt, permissions: [PERMISSIONS.VIEW_REPORTS] },
];

// Componente de item de navegação reutilizável
const NavItem = ({ to, text, icon: Icon, onClick, permissions = [] }) => (
    <PermissionGuard requiredPermissions={permissions} requireAll={false}>
        <li>
            <NavLink
                to={to}
                end
                className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 rounded-lg transition-colors font-medium ${
                        isActive 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'text-slate-700 hover:bg-slate-100'
                    }`
                }
                onClick={onClick}
            >
                <Icon className="w-5 h-5 mr-3 text-slate-500" />
                {text}
            </NavLink>
        </li>
    </PermissionGuard>
);

export default function Sidebar({ isOpen, onClose }) {
    const { logout, userData } = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await logout();
        navigate('/auth');
    };

    return (
        <>
            {/* Overlay para fechar o menu em telas menores */}
            <div 
                className={`fixed inset-0 bg-black bg-opacity-50 z-40 transition-opacity lg:hidden ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onClose}
            ></div>

            {/* Sidebar */}
            <aside className={`fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
                <div className="p-4 border-b border-slate-200">
                    <h2 className="text-2xl font-bold text-slate-800">Menu</h2>
                    {userData && (
                        <div className="mt-2 text-sm text-slate-600">
                            <p className="font-medium">{userData.displayName}</p>
                            <p className="text-xs bg-slate-100 px-2 py-1 rounded mt-1 inline-block">
                                {userData.role?.toUpperCase() || 'VIEWER'}
                            </p>
                        </div>
                    )}
                </div>

                <div className="flex flex-col justify-between flex-grow p-2">
                    {/* Links Principais */}
                    <nav>
                        <ul className="space-y-1">
                            {navLinks.map(link => (
                                <NavItem key={link.to} {...link} />
                            ))}
                        </ul>
                    </nav>
                    
                    {/* Links Inferiores (Configurações e Sair) */}
                    <nav>
                        <ul className="pt-2 mt-2 space-y-1 border-t border-slate-200">
                            <NavItem 
                                to="/settings" 
                                icon={FaCog} 
                                text="Configurações" 
                                permissions={[PERMISSIONS.VIEW_SETTINGS]}
                            />
                            <NavItem to="/auth" icon={FaSignOutAlt} text="Sair" onClick={handleLogout} />
                        </ul>
                    </nav>
                </div>
            </aside>
        </>
    );
}
