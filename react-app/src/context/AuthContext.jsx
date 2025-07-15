import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut
} from 'firebase/auth';
import { auth, db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {    
      setCurrentUser(user);
      if (user) {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setUserData({ id: userDoc.id, ...userDoc.data() });
        } else {
          // Se o usuário existe no Auth mas não no Firestore, criar documento
          let role = 'viewer';
          if (user.email === 'allanmths@gmail.com') {
            role = 'admin';
          }
          
          await setDoc(doc(db, 'users', user.uid), {
            email: user.email,
            role: role,
            createdAt: new Date(),
            displayName: user.email.split('@')[0]
          });
          
          setUserData({
            id: user.uid,
            email: user.email,
            role: role,
            createdAt: new Date(),
            displayName: user.email.split('@')[0]
          });
        }
      } else {
        setUserData(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email, password) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    // Definir role baseado no email
    let role = 'viewer'; // Usuários novos começam como 'viewer'
    if (email === 'allanmths@gmail.com') {
      role = 'admin'; // Definir admin automaticamente
    }
    
    // Criar documento do usuário no Firestore
    await setDoc(doc(db, 'users', result.user.uid), {
      email: result.user.email,
      role: role,
      createdAt: new Date(),
      displayName: result.user.email.split('@')[0]
    });
    return result;
  };

  const logout = () => {
    return signOut(auth);
  };

  const value = {
    currentUser,
    userData,
    loading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
