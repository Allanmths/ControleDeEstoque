import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { hasPermission, hasAnyPermission } from '../utils/permissions';

/**
 * Componente para proteger rotas baseado em permissões
 * @param {React.ReactNode} children - Componentes filhos
 * @param {string|string[]} requiredPermissions - Permissão(ões) necessária(s)
 * @param {boolean} requireAll - Se true, requer todas as permissões. Se false, requer apenas uma
 * @param {string} fallbackRoute - Rota para redirecionar se não tiver permissão
 * @param {React.ReactNode} fallbackComponent - Componente a ser exibido se não tiver permissão
 */
export const ProtectedRoute = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false,
  fallbackRoute = '/dashboard',
  fallbackComponent = null 
}) => {
  const { currentUser, userData, loading } = useAuth();
  
  // Aguarda o carregamento da autenticação
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  
  // Redireciona para login se não estiver autenticado
  if (!currentUser) {
    return <Navigate to="/auth" replace />;
  }
  
  // Se não há permissões requeridas, permite acesso
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return children;
  }
  
  const userRole = userData?.role;
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  let hasAccess = false;
  
  if (requireAll) {
    // Requer todas as permissões
    hasAccess = permissions.every(permission => hasPermission(userRole, permission));
  } else {
    // Requer apenas uma permissão
    hasAccess = hasAnyPermission(userRole, permissions);
  }
  
  if (!hasAccess) {
    // Se há um componente de fallback, exibe ele
    if (fallbackComponent) {
      return fallbackComponent;
    }
    
    // Caso contrário, redireciona para a rota de fallback
    return <Navigate to={fallbackRoute} replace />;
  }
  
  return children;
};

/**
 * Componente para exibir conteúdo baseado em permissões
 * @param {React.ReactNode} children - Componentes filhos
 * @param {string|string[]} requiredPermissions - Permissão(ões) necessária(s)
 * @param {boolean} requireAll - Se true, requer todas as permissões. Se false, requer apenas uma
 * @param {React.ReactNode} fallback - Componente a ser exibido se não tiver permissão
 */
export const PermissionGuard = ({ 
  children, 
  requiredPermissions = [], 
  requireAll = false,
  fallback = null 
}) => {
  const { userData } = useAuth();
  
  // Se não há permissões requeridas, permite acesso
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return children;
  }
  
  const userRole = userData?.role;
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  let hasAccess = false;
  
  if (requireAll) {
    // Requer todas as permissões
    hasAccess = permissions.every(permission => hasPermission(userRole, permission));
  } else {
    // Requer apenas uma permissão
    hasAccess = hasAnyPermission(userRole, permissions);
  }
  
  if (!hasAccess) {
    return fallback;
  }
  
  return children;
};

/**
 * Hook para verificar permissões
 * @param {string|string[]} requiredPermissions - Permissão(ões) necessária(s)
 * @param {boolean} requireAll - Se true, requer todas as permissões. Se false, requer apenas uma
 * @returns {boolean} - Se o usuário tem as permissões necessárias
 */
export const usePermissions = (requiredPermissions = [], requireAll = false) => {
  const { userData } = useAuth();
  
  // Se não há permissões requeridas, permite acesso
  if (!requiredPermissions || requiredPermissions.length === 0) {
    return true;
  }
  
  const userRole = userData?.role;
  const permissions = Array.isArray(requiredPermissions) ? requiredPermissions : [requiredPermissions];
  
  if (requireAll) {
    // Requer todas as permissões
    return permissions.every(permission => hasPermission(userRole, permission));
  } else {
    // Requer apenas uma permissão
    return hasAnyPermission(userRole, permissions);
  }
};

export default ProtectedRoute;
