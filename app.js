import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import { getAuth, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, query, writeBatch, runTransaction, serverTimestamp, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { firebaseConfig } from './firebase-config.js';

const debounce = (func, delay) => {
    let timeoutId;
    return function(...args) {
        const context = this;
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(context, args), delay);
    };
};

const appId = 'default-stock-app';

class StockApp {
    app;
    auth;
    db;
    state = {
        products: [], categories: [], locations: [], movements: [], allUsers: [], auditLog: [], countingHistory: [],
        selectedProducts: [],
        currentPage: 1, itemsPerPage: 10,
        firestoreRefs: null, dom: null, chartInstance: null,
        deleteQueue: { id: null, type: null, isBulk: false },
        isAuthReady: false,
        currentUser: null, 
        currentUserData: null,
        userRole: null, 
        dashboardSettings: { chartType: 'bar', period: '7days', startDate: null, endDate: null },
        unsubscribers: [],
    };

    constructor() {
        if (!firebaseConfig || !firebaseConfig.apiKey) {
            console.error("Firebase config is not set or is missing API key.");
            document.addEventListener('DOMContentLoaded', () => {
                document.body.innerHTML = `<div class="w-full h-screen flex items-center justify-center p-4"><div class="text-center bg-red-100 p-8 rounded-lg shadow-md"><h1 class="text-2xl font-bold text-danger mb-2">Erro de Configuração</h1><p class="text-red-700">As credenciais do Firebase não foram configuradas corretamente ou a API Key está ausente. Verifique o console para mais detalhes.</p></div></div>`;
            });
            return;
        }
        this.app = initializeApp(firebaseConfig);
        this.auth = getAuth(this.app);
        this.db = getFirestore(this.app);
        this.debouncedRenderProducts = debounce(this.renderProducts.bind(this), 300);
        document.addEventListener('DOMContentLoaded', this.init.bind(this));
    }

    init() {
        this.cacheDomElements();
        this.injectPanelContent();
        this.setupFirestoreRefs();
        this.setupEventListeners();
        this.handleAuthentication();
    }
    
    cacheDomElements() {
        this.state.dom = {
            loadingBar: document.getElementById('loading-bar'),
            appSection: document.getElementById('app-section'),
            authSection: document.getElementById('auth-section'),
            authContainer: document.getElementById('auth-container'),
            loginFormContainer: document.getElementById('login-form-container'),
            registerFormContainer: document.getElementById('register-form-container'),
            contentEl: document.getElementById('tab-content'),
            panels: { 
                home: document.getElementById('panel-home'), 
                stock: document.getElementById('panel-stock'), 
                register: document.getElementById('panel-register'), 
                movements: document.getElementById('panel-movements'), 
                reports: document.getElementById('panel-reports'), 
                settings: document.getElementById('panel-settings'),
                audit: document.getElementById('panel-audit'),
                counting: document.getElementById('panel-counting'),
            },
            sidebar: { menu: document.getElementById('sidebar-menu'), nav: document.getElementById('sidebar-nav'), overlay: document.getElementById('sidebar-overlay'), toggleBtn: document.getElementById('menu-toggle-btn'), logoutBtn: document.getElementById('logout-btn') },
            modals: {
                edit: { self: document.getElementById('edit-modal'), productName: document.getElementById('edit-product-name'), quantitiesContainer: document.getElementById('edit-quantities-container'), saveBtn: document.getElementById('save-edit'), cancelBtn: document.getElementById('cancel-edit') },
                delete: { self: document.getElementById('delete-modal'), text: document.getElementById('delete-modal-text'), confirmBtn: document.getElementById('confirm-delete'), cancelBtn: document.getElementById('cancel-delete') },
                permissions: { self: document.getElementById('permissions-modal'), userEmail: document.getElementById('permissions-user-email'), checkboxContainer: document.getElementById('permissions-checkbox-container'), saveBtn: document.getElementById('save-permissions'), cancelBtn: document.getElementById('cancel-permissions') },
            },
        };
    }
    
    setLoading(isLoading) {
        if (this.state.dom.loadingBar) {
            this.state.dom.loadingBar.classList.toggle('show', isLoading);
        }
    }

    setupEventListeners() {
        const { dom } = this.state;
        if (!dom) return;

        document.getElementById('login-form').addEventListener('submit', (e) => { e.preventDefault(); this.handleLogin(e.target); });
        document.getElementById('register-form').addEventListener('submit', (e) => { e.preventDefault(); this.handleRegister(e.target); });
        document.getElementById('show-register-link').addEventListener('click', (e) => { e.preventDefault(); this.toggleAuthForm(true); });
        document.getElementById('show-login-link').addEventListener('click', (e) => { e.preventDefault(); this.toggleAuthForm(false); });
        dom.sidebar.logoutBtn.addEventListener('click', (e) => { e.preventDefault(); this.handleLogout(); });
        dom.modals.edit.cancelBtn.addEventListener('click', () => this.closeEditModal());
        dom.modals.edit.saveBtn.addEventListener('click', (e) => this.handleSaveEdit(e.target));
        dom.modals.delete.cancelBtn.addEventListener('click', () => this.closeDeleteModal());
        dom.modals.delete.confirmBtn.addEventListener('click', () => this.handleDelete());
        dom.modals.permissions.cancelBtn.addEventListener('click', () => this.closePermissionsModal());
        dom.modals.permissions.saveBtn.addEventListener('click', () => this.handleSavePermissions());
        dom.sidebar.toggleBtn.addEventListener('click', () => this.toggleSidebar(true));
        dom.sidebar.overlay.addEventListener('click', () => this.toggleSidebar(false));
        dom.sidebar.menu.addEventListener('click', (e) => {
            const link = e.target.closest('.sidebar-link');
            if (link && link.dataset.tab) {
                e.preventDefault();
                this.switchTab(link.dataset.tab);
                this.toggleSidebar(false);
            }
        });
        dom.contentEl.addEventListener('submit', (e) => this.handleFormSubmit(e));
        dom.contentEl.addEventListener('click', (e) => this.handleContentClick(e));
        dom.contentEl.addEventListener('change', (e) => this.handleContentChange(e));
        dom.contentEl.addEventListener('input', (e) => this.handleContentInput(e));
    }

    // --- AUTHENTICATION & PERMISSIONS ---
    handleAuthentication() {
        onAuthStateChanged(this.auth, async (user) => {
            this.setLoading(true);
            this.clearAllListeners(); 

            if (user) {
                try {
                    this.state.currentUser = user;
                    const userDocRef = doc(this.db, 'users', user.uid);
                    const userDoc = await getDoc(userDocRef);

                    if (userDoc.exists()) {
                        this.state.currentUserData = userDoc.data();
                        this.state.userRole = this.state.currentUserData.role || 'viewer';
                        // Migration logic for old permissions structure
                        if (this.state.currentUserData.permissions && typeof this.state.currentUserData.permissions.home === 'boolean') {
                            console.log("Migrating old permissions structure for user:", user.email);
                            const newPermissions = this.migratePermissions(this.state.currentUserData.permissions);
                            this.state.currentUserData.permissions = newPermissions;
                            await updateDoc(userDocRef, { permissions: newPermissions });
                        }
                    } else {
                        // This case should ideally not happen after registration, but as a fallback:
                        this.state.userRole = 'viewer';
                        this.state.currentUserData = { 
                            email: user.email,
                            role: 'viewer',
                            permissions: this.getDefaultPermissions()
                        };
                        await setDoc(userDocRef, this.state.currentUserData);
                    }
                    
                    this.state.isAuthReady = true; 
                    
                    this.showAppUI(); 
                    this.initializeAppDataListeners(); 
                    this.renderCurrentTab(); 

                } catch (error) {
                    console.error("Erro fatal durante a autenticação ou inicialização:", error);
                    this.showAlert("Ocorreu um erro crítico ao carregar a aplicação.", true);
                    this.showAuthUI(); 
                } finally {
                    this.setLoading(false);
                }
            } else {
                this.showAuthUI();
                this.setLoading(false);
            }
        });
    }

    async handleLogin(form) {
        const email = form.querySelector('#login-email').value;
        const password = form.querySelector('#login-password').value;
        this.setLoading(true);
        try {
            await signInWithEmailAndPassword(this.auth, email, password);
        } catch (error) {
            this.showAlert(this.getFriendlyAuthError(error.code), true);
            this.setLoading(false);
        }
    }

    async handleRegister(form) {
        const email = form.querySelector('#register-email').value;
        const password = form.querySelector('#register-password').value;
        this.setLoading(true);
        try {
            const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
            await setDoc(doc(this.db, "users", userCredential.user.uid), {
                email: userCredential.user.email,
                role: 'viewer',
                permissions: this.getDefaultPermissions(),
                createdAt: serverTimestamp()
            });
        } catch (error) {
            this.showAlert(this.getFriendlyAuthError(error.code), true);
        } finally {
            this.setLoading(false);
        }
    }

    async handleLogout() {
        this.setLoading(true);
        try {
            await signOut(this.auth);
            this.state = { ...this.state, currentUser: null, currentUserData: null, userRole: null, isAuthReady: false };
        } catch (error) {
            console.error("Error signing out: ", error);
            this.showAlert("Erro ao tentar sair. Tente novamente.", true);
        } finally {
            this.setLoading(false);
        }
    }

    // ... (rest of the class methods) ...
}

new StockApp();
