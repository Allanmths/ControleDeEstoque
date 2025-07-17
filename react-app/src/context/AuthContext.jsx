import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { auth, db } from '../services/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Função para buscar dados do usuário no Firestore
  const fetchUserData = async (user) => {
    if (!user) {
      setUserData(null);
      return;
    }

    try {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        setUserData({ ...userDoc.data(), uid: user.uid });
      } else {
        // Criar documento do usuário se não existir
        const newUserData = {
          email: user.email,
          displayName: user.displayName || user.email.split('@')[0],
          role: 'user',
          createdAt: new Date(),
          lastLogin: new Date()
        };
        
        await setDoc(doc(db, 'users', user.uid), newUserData);
        setUserData({ ...newUserData, uid: user.uid });
      }
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      setUserData(null);
    }
  };

  // Função de login
  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Atualizar último login
      await updateDoc(doc(db, 'users', result.user.uid), {
        lastLogin: new Date()
      });
      
      toast.success('Login realizado com sucesso!');
      return result;
    } catch (error) {
      console.error('Erro no login:', error);
      
      let errorMessage = 'Erro ao fazer login';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'Usuário não encontrado';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'Senha incorreta';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Função de registro
  const register = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Atualizar perfil do usuário
      await updateProfile(result.user, {
        displayName: displayName
      });

      // Criar documento do usuário no Firestore
      const newUserData = {
        email: email,
        displayName: displayName,
        role: 'user',
        createdAt: new Date(),
        lastLogin: new Date()
      };
      
      await setDoc(doc(db, 'users', result.user.uid), newUserData);
      
      toast.success('Conta criada com sucesso!');
      return result;
    } catch (error) {
      console.error('Erro no registro:', error);
      
      let errorMessage = 'Erro ao criar conta';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'Este email já está em uso';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'A senha deve ter pelo menos 6 caracteres';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Email inválido';
      }
      
      toast.error(errorMessage);
      throw error;
    }
  };

  // Função de logout
  const logout = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setUserData(null);
      toast.success('Logout realizado com sucesso!');
    } catch (error) {
      console.error('Erro no logout:', error);
      toast.error('Erro ao fazer logout');
    }
  };

  // Verificar se usuário é admin
  const isAdmin = () => {
    return userData?.role === 'admin';
  };

  // Verificar se usuário pode editar
  const canEdit = () => {
    return userData?.role === 'admin' || userData?.role === 'editor';
  };

  // Monitorar mudanças de autenticação
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      await fetchUserData(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userData,
    login,
    register,
    logout,
    isAdmin,
    canEdit,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
