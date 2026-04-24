import React, { useState, useEffect, useMemo } from 'react';
import { 
  Home, 
  History, 
  Tag, 
  Bell, 
  Plus, 
  Search, 
  MoreHorizontal, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownLeft,
  Wallet,
  Calendar,
  CreditCard,
  Utensils,
  ShoppingBag,
  Car,
  Home as HomeIcon,
  Smartphone,
  PiggyBank,
  TrendingDown,
  TrendingUp,
  ChevronLeft,
  Loader2,
  Lock,
  Mail,
  User,
  LogOut
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  format, 
  isSameDay, 
  parseISO, 
  startOfMonth, 
  endOfMonth, 
  isWithinInterval, 
  eachMonthOfInterval, 
  subMonths,
  getMonth,
  getYear
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from './supabaseClient';

// --- Constants ---
const CATEGORIES = [
  { id: 'food', name: 'Alimentation', icon: Utensils, color: '#FF9500', bg: '#FFF3E0' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#AF52DE', bg: '#F3E5F5' },
  { id: 'transport', name: 'Transport', icon: Car, color: '#5AC8FA', bg: '#E1F5FE' },
  { id: 'home', name: 'Logement', icon: HomeIcon, color: '#34C759', bg: '#E8F5E9' },
  { id: 'bills', name: 'Factures', icon: Smartphone, color: '#007AFF', bg: '#E1F5FE' },
  { id: 'other', name: 'Autre', icon: Tag, color: '#8E8E93', bg: '#F2F2F7' },
];

const INITIAL_SAVINGS = { current: 0, goal: 0, title: 'Nouvel Objectif' };

// --- Components ---

function LoginPage({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) alert("Erreur: " + error.message);
    setLoading(false);
  };

  return (
    <div style={{ 
      height: '100vh', 
      backgroundImage: 'url("/login-bg.jpg")', 
      backgroundSize: 'cover', 
      backgroundPosition: 'center',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
      padding: '24px'
    }}>
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        style={{ 
          background: 'rgba(255, 255, 255, 0.4)', 
          backdropFilter: 'blur(25px)',
          padding: '30px',
          borderRadius: '30px',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.3)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#1C1C1E' }}>Bienvenue</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Connectez-vous à votre foyer</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
              <input 
                type="email" 
                placeholder="Email" 
                value={email}
                onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'rgba(255,255,255,0.5)' }}
                required
              />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: 'var(--text-secondary)' }} />
              <input 
                type="password" 
                placeholder="Mot de passe" 
                value={password}
                onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid rgba(0,0,0,0.1)', outline: 'none', background: 'rgba(255,255,255,0.5)' }}
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>Se connecter <ChevronRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab, onAddClick }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'history', icon: History, label: 'Historique' },
    { id: 'add', icon: Plus, label: '', isFab: true },
    { id: 'savings', icon: PiggyBank, label: 'Tirelire' },
    { id: 'reminders', icon: Bell, label: 'Rappels' },
  ];

  return (
    <nav className="bottom-nav glass">
      {tabs.map((tab) => (
        <div 
          key={tab.id} 
          className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => tab.id === 'add' ? onAddClick() : setActiveTab(tab.id)}
        >
          {tab.isFab ? (
            <div className="fab">
              <Plus size={28} />
            </div>
          ) : (
            <>
              <tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} />
              <span>{tab.label}</span>
            </>
          )}
        </div>
      ))}
    </nav>
  );
}

function SummaryCard({ total, income, expense, selectedMonth }) {
  const monthLabel = format(selectedMonth, 'MMMM yyyy', { locale: fr });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="card" 
      style={{ 
        background: 'linear-gradient(135deg, #007AFF 0%, #5E5CE6 100%)', 
        color: 'white',
        boxShadow: '0 10px 30px rgba(94, 92, 230, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}>
        <Wallet size={120} />
      </div>

      <div>
        <p style={{ opacity: 0.8, fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>{monthLabel}</p>
        <h1 style={{ fontSize: '32px', marginTop: '4px' }}>{total.toLocaleString()} DA</h1>
      </div>
      
      <div style={{ display: 'flex', gap: '30px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}>
            <TrendingUp size={16} />
          </div>
          <div>
            <p style={{ opacity: 0.7, fontSize: '11px' }}>Entrées</p>
            <p style={{ fontWeight: 600, fontSize: '14px' }}>+{income.toLocaleString()} DA</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}>
            <TrendingDown size={16} />
          </div>
          <div>
            <p style={{ opacity: 0.7, fontSize: '11px' }}>Sorties</p>
            <p style={{ fontWeight: 600, fontSize: '14px' }}>-{expense.toLocaleString()} DA</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

const ExpenseItem = ({ item }) => {
  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[5];
  const Icon = cat.icon;
  
  return (
    <motion.div 
      whileTap={{ scale: 0.98 }}
      className="card" 
      style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '16px', marginBottom: '12px' }}
    >
      <div style={{ 
        width: '44px', 
        height: '44px', 
        borderRadius: '12px', 
        background: cat.bg, 
        color: cat.color,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        <Icon size={20} />
      </div>
      <div style={{ flex: 1 }}>
        <p style={{ fontWeight: 600, fontSize: '15px' }}>{item.title}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.name}</p>
          <span style={{ width: '3px', height: '3px', background: '#C6C6C8', borderRadius: '50%' }}></span>
          <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{format(parseISO(item.date), 'dd MMM', { locale: fr })}</p>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <p style={{ 
          fontWeight: 700, 
          color: item.type === 'income' ? 'var(--accent-green)' : 'var(--text-main)' 
        }}>
          {item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} DA
        </p>
        <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          {format(parseISO(item.date), 'HH:mm')}
        </p>
      </div>
    </motion.div>
  );
};

const MonthSelector = ({ selected, onSelect }) => {
  const months = useMemo(() => {
    const end = new Date();
    const start = subMonths(end, 5);
    return eachMonthOfInterval({ start, end }).reverse();
  }, []);

  return (
    <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', padding: '10px 0', marginBottom: '16px', scrollbarWidth: 'none' }}>
      {months.map(m => {
        const active = getMonth(m) === getMonth(selected) && getYear(m) === getYear(selected);
        return (
          <div 
            key={m.toISOString()}
            onClick={() => onSelect(m)}
            style={{ 
              padding: '10px 20px', 
              borderRadius: '20px', 
              background: active ? 'var(--accent-blue)' : 'white',
              color: active ? 'white' : 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              fontWeight: 600,
              fontSize: '14px',
              boxShadow: active ? '0 4px 12px rgba(0, 122, 255, 0.3)' : 'var(--shadow-sm)',
              cursor: 'pointer'
            }}
          >
            {format(m, 'MMMM', { locale: fr })}
          </div>
        )
      })}
    </div>
  );
};

const TirelireView = ({ savings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [editTitle, setEditTitle] = useState(savings.title);
  const [editGoal, setEditGoal] = useState(savings.goal);
  
  const progress = savings.goal > 0 ? Math.min((savings.current / savings.goal) * 100, 100) : 0;

  const handleSaveSettings = () => {
    onUpdate({ ...savings, title: editTitle, goal: parseFloat(editGoal) || 0 });
    setIsEditing(false);
  };
  
  return (
    <div className="animate-slide-up" style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2 style={{ fontSize: '24px' }}>Ma Tirelire</h2>
        <button 
          onClick={() => setIsEditing(!isEditing)}
          style={{ background: 'var(--pastel-blue)', color: 'var(--accent-blue)', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}
        >
          {isEditing ? 'Fermer' : 'Éditer'}
        </button>
      </div>
      
      {isEditing ? (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card">
          <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Paramètres de l'Objectif</h3>
          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Titre de l'objectif</label>
            <input 
              type="text" 
              value={editTitle} 
              onChange={e => setEditTitle(e.target.value)}
              className="glass" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#F2F2F7', outline: 'none' }}
            />
          </div>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Montant Objectif (DA)</label>
            <input 
              type="number" 
              value={editGoal} 
              onChange={e => setEditGoal(e.target.value)}
              className="glass" 
              style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#F2F2F7', outline: 'none' }}
            />
          </div>
          <button onClick={handleSaveSettings} className="btn-primary" style={{ width: '100%' }}>Enregistrer</button>
        </motion.div>
      ) : (
        <>
          <div className="card" style={{ 
            position: 'relative', 
            minHeight: '420px', 
            backgroundImage: 'url("/tirelire.jpg")',
            backgroundSize: 'contain',
            backgroundPosition: 'top center',
            backgroundRepeat: 'no-repeat',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            padding: '24px',
            overflow: 'hidden',
            backgroundColor: 'white'
          }}>
            <div className="glass" style={{ 
              padding: '20px', 
              borderRadius: '20px', 
              background: 'rgba(255,255,255,0.4)',
              backdropFilter: 'blur(10px)',
              WebkitBackdropFilter: 'blur(10px)',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid rgba(255,255,255,0.3)'
            }}>
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>{savings.title}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0' }}>
                <h2 style={{ fontSize: '28px' }}>{savings.current.toLocaleString()} DA</h2>
                <p style={{ color: 'var(--text-secondary)' }}>sur {savings.goal.toLocaleString()} DA</p>
              </div>
              
              <div style={{ height: '12px', background: '#E5E5EA', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}>
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  style={{ height: '100%', background: 'var(--accent-blue)', borderRadius: '10px' }}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
                  Manque: {Math.max(0, savings.goal - savings.current).toLocaleString()} DA
                </p>
                <p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-blue)' }}>{Math.round(progress)}%</p>
              </div>
            </div>
          </div>

          <div className="card" style={{ marginTop: '20px', padding: '20px' }}>
            <p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Ajouter un montant personnalisé</p>
            <div style={{ display: 'flex', gap: '10px' }}>
              <input 
                type="number" 
                placeholder="Montant (DA)"
                value={customAmount}
                onChange={e => setCustomAmount(e.target.value)}
                style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E5EA', outline: 'none' }}
              />
              <button 
                onClick={() => {
                  const val = parseFloat(customAmount);
                  if (val > 0) {
                    onUpdate({ ...savings, current: savings.current + val });
                    setCustomAmount('');
                  }
                }}
                style={{ background: 'var(--accent-green)', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 700 }}
              >+ Depôt</button>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}>
               <button 
                onClick={() => onUpdate({ ...savings, current: savings.current + 500 })}
                style={{ padding: '12px', background: 'var(--pastel-blue)', color: 'var(--accent-blue)', borderRadius: '12px', fontWeight: 600 }}
              >+ 500 DA</button>
               <button 
                onClick={() => {
                  const val = customAmount ? parseFloat(customAmount) : 500;
                  onUpdate({ ...savings, current: Math.max(0, savings.current - val) });
                  if (customAmount) setCustomAmount('');
                }}
                style={{ padding: '12px', background: 'var(--pastel-red)', color: 'var(--accent-red)', borderRadius: '12px', fontWeight: 600 }}
              >{customAmount ? `- ${customAmount} DA` : '- 500 DA'}</button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const AddModal = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState('');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState('expense');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!amount || !title) return;
    onAdd({
      title,
      amount: parseFloat(amount),
      category,
      date: new Date().toISOString(),
      type
    });
    setAmount('');
    setTitle('');
    onClose();
  };

  return (
    <div className="glass" style={{ 
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
      zIndex: 1000, display: 'flex', alignItems: 'flex-end' 
    }}>
      <motion.div 
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        style={{ 
          width: '100%', background: 'white', 
          borderTopLeftRadius: '30px', borderTopRightRadius: '30px',
          padding: '24px', paddingBottom: '40px',
          boxShadow: '0 -10px 40px rgba(0,0,0,0.1)'
        }}
      >
        <div style={{ width: '40px', height: '5px', background: '#E5E5EA', borderRadius: '10px', margin: '0 auto 20px' }} onClick={onClose}></div>
        <h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Nouvelle Opération</h2>
        
        <div style={{ display: 'flex', background: '#F2F2F7', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          <button 
            onClick={() => setType('expense')}
            style={{ 
              flex: 1, padding: '10px', borderRadius: '10px', 
              background: type === 'expense' ? 'white' : 'transparent',
              boxShadow: type === 'expense' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              fontWeight: 600
            }}
          >Dépense</button>
          <button 
            onClick={() => setType('income')}
            style={{ 
              flex: 1, padding: '10px', borderRadius: '10px',
              background: type === 'income' ? 'white' : 'transparent',
              boxShadow: type === 'income' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none',
              fontWeight: 600
            }}
          >Revenu</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Montant (DA)</label>
            <input 
              type="number" 
              value={amount} 
              onChange={e => setAmount(e.target.value)}
              placeholder="0.00"
              style={{ width: '100%', fontSize: '24px', border: 'none', borderBottom: '2px solid #E5E5EA', padding: '8px 0', outline: 'none', fontWeight: 700 }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Titre</label>
            <input 
              type="text" 
              value={title} 
              onChange={e => setTitle(e.target.value)}
              placeholder="Ex: Loyer, Pizza..."
              style={{ width: '100%', fontSize: '16px', border: 'none', borderBottom: '2px solid #E5E5EA', padding: '8px 0', outline: 'none' }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Catégorie</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
              {CATEGORIES.map(cat => (
                <div 
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  style={{ 
                    padding: '12px', borderRadius: '15px', textAlign: 'center',
                    background: category === cat.id ? cat.bg : '#F2F2F7',
                    border: category === cat.id ? `1px solid ${cat.color}` : '1px solid transparent',
                    cursor: 'pointer'
                  }}
                >
                  <cat.icon size={20} style={{ color: category === cat.id ? cat.color : '#8E8E93', marginBottom: '4px' }} />
                  <p style={{ fontSize: '10px', fontWeight: 600 }}>{cat.name}</p>
                </div>
              ))}
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '17px' }}>Ajouter</button>
          <button type="button" onClick={onClose} style={{ width: '100%', padding: '16px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '15px' }}>Annuler</button>
        </form>
      </motion.div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState('home');
  const [selectedMonth, setSelectedMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  
  const [expenses, setExpenses] = useState([]);
  const [bills, setBills] = useState([]);
  const [savings, setSavings] = useState(INITIAL_SAVINGS);

  const [isModalOpen, setIsModalOpen] = useState(false);

  // --- Auth & Sync ---

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchData();
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchData();
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const { data: expData } = await supabase.from('expenses').select('*').order('date', { ascending: false });
      const { data: billData } = await supabase.from('bills').select('*').order('due_date', { ascending: true });
      const { data: saveData } = await supabase.from('savings').select('*').single();

      setExpenses(expData || []);
      setBills(billData || []);
      if (saveData) setSavings(saveData);

    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const addExpense = async (newExp) => {
    const { data, error } = await supabase.from('expenses').insert([newExp]).select();
    if (!error && data) setExpenses([data[0], ...expenses]);
  };

  const toggleBill = async (id) => {
    const bill = bills.find(b => b.id === id);
    if (!bill) return;
    const { data, error } = await supabase.from('bills').update({ paid: !bill.paid }).eq('id', id).select();
    if (!error && data) setBills(bills.map(b => b.id === id ? data[0] : b));
  };

  const updateSavings = async (newSavings) => {
    const { data, error } = await supabase.from('savings').update(newSavings).eq('id', 1).select();
    if (!error && data) setSavings(data[0]);
  };

  // --- Derived State ---

  const filteredExpenses = useMemo(() => {
    return expenses.filter(exp => {
      const expDate = parseISO(exp.date);
      return getMonth(expDate) === getMonth(selectedMonth) && getYear(expDate) === getYear(selectedMonth);
    });
  }, [expenses, selectedMonth]);

  const stats = useMemo(() => {
    const income = filteredExpenses.filter(e => e.type === 'income').reduce((a, b) => a + b.amount, 0);
    const expense = filteredExpenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0);
    return { income, expense, total: income - expense };
  }, [filteredExpenses]);

  if (!session) {
    return <LoginPage />;
  }

  const renderContent = () => {
    if (loading) {
      return (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Loader2 className="animate-spin" size={48} color="var(--accent-blue)" />
        </div>
      );
    }

    switch (activeTab) {
      case 'home':
        return (
          <div className="animate-slide-up" style={{ padding: '0 20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Balance Mensuelle</p>
                <h2 style={{ fontSize: '24px' }}>Mon Foyer</h2>
              </div>
              <div onClick={handleLogout} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--pastel-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}>
                <LogOut size={20} color="var(--accent-blue)" />
              </div>
            </div>

            <MonthSelector selected={selectedMonth} onSelect={setSelectedMonth} />
            <SummaryCard {...stats} selectedMonth={selectedMonth} />

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '18px' }}>Opérations du mois</h3>
              <button onClick={() => setActiveTab('history')} style={{ background: 'transparent', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '14px' }}>Historique</button>
            </div>

            {filteredExpenses.slice(0, 5).map(exp => <ExpenseItem key={exp.id} item={exp} />)}
            {filteredExpenses.length === 0 && (
              <div style={{ textAlign: 'center', padding: '40px 0', opacity: 0.5 }}>
                <Search size={48} style={{ marginBottom: '10px' }} />
                <p>Aucune dépense ce mois-ci</p>
              </div>
            )}
          </div>
        );
      
      case 'history':
        return (
          <div className="animate-slide-up" style={{ padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Tout l'historique</h2>
            {expenses.map(exp => <ExpenseItem key={exp.id} item={exp} />)}
          </div>
        );

      case 'savings':
        return <TirelireView savings={savings} onUpdate={updateSavings} />;

      case 'reminders':
        return (
          <div className="animate-slide-up" style={{ padding: '0 20px' }}>
            <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Rappels Factures</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px', fontSize: '14px' }}>Ne ratez plus aucune échéance.</p>
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>À venir</h3>
              {bills.filter(b => !b.paid).map(bill => (
                <div key={bill.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `4px solid #FF9500` }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{bill.title}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Échéance: {bill.due_date}</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700 }}>{bill.amount.toLocaleString()} DA</p>
                    <button onClick={() => toggleBill(bill.id)} style={{ fontSize: '11px', marginTop: '4px', padding: '4px 8px', borderRadius: '8px', background: '#FFF3E0', color: '#FF9500' }}>À payer</button>
                  </div>
                </div>
              ))}
            </div>
            <div>
              <h3 style={{ fontSize: '16px', color: 'var(--text-secondary)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Réglées</h3>
              {bills.filter(b => b.paid).map(bill => (
                <div key={bill.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px', borderLeft: `4px solid #34C759` }}>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 600 }}>{bill.title}</p>
                    <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Payé</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700 }}>{bill.amount.toLocaleString()} DA</p>
                    <button onClick={() => toggleBill(bill.id)} style={{ fontSize: '11px', marginTop: '4px', padding: '4px 8px', borderRadius: '8px', background: '#E8F5E9', color: '#34C759' }}>Payé</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="app-container">
      {renderContent()}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setIsModalOpen(true)} />
      <AnimatePresence>
        {isModalOpen && <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addExpense} />}
      </AnimatePresence>
    </div>
  );
}
