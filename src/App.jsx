import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  LogOut,
  Trash2,
  AlertCircle,
  PieChart as PieIcon,
  BarChart3,
  RefreshCw,
  Users,
  Copy,
  CheckCircle2,
  DoorOpen,
  Camera,
  Scan
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
  eachDayOfInterval,
  subMonths,
  getMonth,
  getYear,
  isToday,
  isBefore,
  addDays,
  startOfToday,
  getDate
} from 'date-fns';
import { fr } from 'date-fns/locale';
import { supabase } from './supabaseClient';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  BarChart,
  Bar
} from 'recharts';
import Tesseract from 'tesseract.js';

// --- Constants ---
const CATEGORIES = [
  { id: 'food', name: 'Alimentation', icon: Utensils, color: '#FF9500', bg: '#FFF3E0' },
  { id: 'shopping', name: 'Shopping', icon: ShoppingBag, color: '#AF52DE', bg: '#F3E5F5' },
  { id: 'transport', name: 'Transport', icon: Car, color: '#5AC8FA', bg: '#E1F5FE' },
  { id: 'home', name: 'Logement', icon: HomeIcon, color: '#D89A5B', bg: '#FDF4E9' },
  { id: 'bills', name: 'Factures', icon: Smartphone, color: '#007AFF', bg: '#E1F5FE' },
  { id: 'other', name: 'Autre', icon: Tag, color: '#8E8E93', bg: '#F2F2F7' },
];

const INITIAL_SAVINGS = { current: 0, goal: 0, title: 'Nouvel Objectif' };

// --- Components ---

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    let error;
    if (isRegistering) {
      const { error: signUpError } = await supabase.auth.signUp({ email, password });
      error = signUpError;
    } else {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      error = signInError;
    }
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
          background: 'rgba(255, 255, 255, 0.15)', 
          backdropFilter: 'blur(20px)',
          padding: '30px',
          borderRadius: '30px',
          boxShadow: 'var(--shadow-lg)',
          marginBottom: '40px',
          border: '1px solid rgba(255, 255, 255, 0.2)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '30px' }}>
          <h2 style={{ fontSize: '28px', color: '#2D241E' }}>{isRegistering ? 'Nouveau foyer' : 'Bienvenue'}</h2>
          <p style={{ color: '#2D241E', fontWeight: 500 }}>{isRegistering ? 'Créez votre compte familial' : 'Connectez-vous à votre foyer'}</p>
        </div>

        <form onSubmit={handleAuth}>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ position: 'relative' }}>
              <Mail size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#2D241E' }} />
              <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', outline: 'none', background: 'rgba(255,255,255,0.2)', color: '#2D241E' }}
                required />
            </div>
          </div>
          <div style={{ marginBottom: '24px' }}>
            <div style={{ position: 'relative' }}>
              <Lock size={18} style={{ position: 'absolute', left: '12px', top: '15px', color: '#2D241E' }} />
              <input type="password" placeholder="Mot de passe" value={password} onChange={e => setPassword(e.target.value)}
                style={{ width: '100%', padding: '14px 14px 14px 40px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.3)', outline: 'none', background: 'rgba(255,255,255,0.2)', color: '#2D241E' }}
                required />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary" style={{ width: '100%', padding: '16px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
            {loading ? <Loader2 size={20} className="animate-spin" /> : <>{isRegistering ? "S'inscrire" : 'Se connecter'} <ChevronRight size={18} /></>}
          </button>
          <p onClick={() => setIsRegistering(!isRegistering)} style={{ textAlign: 'center', marginTop: '20px', fontSize: '13px', color: '#2D241E', cursor: 'pointer', fontWeight: 600 }}>
            {isRegistering ? "Déjà un compte ? Se connecter" : "Pas de compte ? S'inscrire"}
          </p>
        </form>
      </motion.div>
    </div>
  );
}

function HouseholdOnboarding({ onComplete }) {
  const [step, setStep] = useState('choice'); // choice, create, join
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);

  const createHousehold = async () => {
    if (!name) return;
    setLoading(true);
    const { data: household, error: hError } = await supabase.from('households').insert([{ name }]).select().single();
    if (!hError && household) {
      const { error: pError } = await supabase.from('profiles').update({ household_id: household.id }).eq('id', (await supabase.auth.getUser()).data.user.id);
      if (!pError) {
        onComplete(household.id);
      } else {
        alert("Erreur profil: " + pError.message);
      }
    } else {
      alert("Erreur foyer: " + hError.message);
    }
    setLoading(false);
  };

  const joinHousehold = async () => {
    if (!code) return;
    setLoading(true);
    const { data: household, error: hError } = await supabase.from('households').select('*').eq('invite_code', code.toLowerCase().trim()).single();
    if (!hError && household) {
      const { error: pError } = await supabase.from('profiles').update({ household_id: household.id }).eq('id', (await supabase.auth.getUser()).data.user.id);
      if (!pError) onComplete(household.id);
      else alert("Erreur lors de la jonction: " + pError.message);
    } else {
      alert("Code invalide ou foyer introuvable.");
    }
    setLoading(false);
  };

  return (
    <div style={{ height: '100vh', background: 'var(--bg-color)', padding: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
      <div className="card animate-slide-up" style={{ padding: '30px' }}>
        {step === 'choice' && (
          <div style={{ textAlign: 'center' }}>
            <Users size={64} color="var(--accent-blue)" style={{ marginBottom: '20px' }} />
            <h2 style={{ fontSize: '24px', marginBottom: '10px' }}>Dernière étape !</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '30px' }}>Vous devez appartenir à un foyer pour commencer le suivi.</p>
            <button onClick={() => setStep('create')} className="btn-primary" style={{ width: '100%', marginBottom: '12px' }}>Créer un nouveau foyer</button>
            <button onClick={() => setStep('join')} style={{ width: '100%', padding: '16px', borderRadius: '15px', background: 'var(--pastel-blue)', color: 'var(--accent-blue)', fontWeight: 600 }}>Rejoindre avec un code</button>
          </div>
        )}

        {step === 'create' && (
          <div>
            <button onClick={() => setStep('choice')} style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}><ChevronLeft size={24} /></button>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Nommez votre foyer</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Ex: Famille Benali, Notre Appartement...</p>
            <input type="text" placeholder="Nom du foyer" value={name} onChange={e => setName(e.target.value)} 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E5EA', marginBottom: '20px', outline: 'none' }} />
            <button onClick={createHousehold} disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? <Loader2 className="animate-spin" /> : "C'est parti !"}
            </button>
          </div>
        )}

        {step === 'join' && (
          <div>
            <button onClick={() => setStep('choice')} style={{ marginBottom: '20px', color: 'var(--text-secondary)' }}><ChevronLeft size={24} /></button>
            <h2 style={{ fontSize: '22px', marginBottom: '10px' }}>Entrez le code d'invitation</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>Demandez le code à un membre déjà inscrit.</p>
            <input type="text" placeholder="Code (ex: a1b2c3d4)" value={code} onChange={e => setCode(e.target.value)} 
              style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '1px solid #E5E5EA', marginBottom: '20px', outline: 'none', textTransform: 'lowercase' }} />
            <button onClick={joinHousehold} disabled={loading} className="btn-primary" style={{ width: '100%' }}>
              {loading ? <Loader2 className="animate-spin" /> : "Rejoindre le foyer"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function BottomNav({ activeTab, setActiveTab, onAddClick }) {
  const tabs = [
    { id: 'home', icon: Home, label: 'Accueil' },
    { id: 'stats', icon: PieChart, label: 'Analyses' },
    { id: 'add', icon: Plus, label: '', isFab: true },
    { id: 'savings', icon: PiggyBank, label: 'Tirelire' },
    { id: 'reminders', icon: Bell, label: 'Rappels' },
  ];

  return (
    <nav className="bottom-nav glass">
      {tabs.map((tab) => (
        <div key={tab.id} className={`nav-item ${activeTab === tab.id ? 'active' : ''}`} onClick={() => tab.id === 'add' ? onAddClick() : setActiveTab(tab.id)}>
          {tab.isFab ? <div className="fab"><Plus size={28} /></div> : <><tab.icon size={24} strokeWidth={activeTab === tab.id ? 2.5 : 2} /><span>{tab.label}</span></>}
        </div>
      ))}
    </nav>
  );
}

function SummaryCard({ total, income, expense, selectedMonth }) {
  const monthLabel = format(selectedMonth, 'MMMM yyyy', { locale: fr });
  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card" style={{ background: 'linear-gradient(135deg, #D89A5B 0%, #B77A3F 100%)', color: 'white', boxShadow: '0 10px 30px rgba(216, 154, 91, 0.3)', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', right: '-20px', top: '-20px', opacity: 0.1 }}><Wallet size={120} /></div>
      <div><p style={{ opacity: 0.8, fontSize: '14px', fontWeight: 500, textTransform: 'capitalize' }}>{monthLabel}</p><h1 style={{ fontSize: '32px', marginTop: '4px' }}>{total.toLocaleString()} DA</h1></div>
      <div style={{ display: 'flex', gap: '30px', marginTop: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}><TrendingUp size={16} /></div><div><p style={{ opacity: 0.7, fontSize: '11px' }}>Entrées</p><p style={{ fontWeight: 600, fontSize: '14px' }}>+{income.toLocaleString()} DA</p></div></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><div style={{ background: 'rgba(255,255,255,0.2)', padding: '6px', borderRadius: '8px' }}><TrendingDown size={16} /></div><div><p style={{ opacity: 0.7, fontSize: '11px' }}>Sorties</p><p style={{ fontWeight: 600, fontSize: '14px' }}>-{expense.toLocaleString()} DA</p></div></div>
      </div>
    </motion.div>
  );
}

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
          <div key={m.toISOString()} onClick={() => onSelect(m)} style={{ padding: '10px 20px', borderRadius: '20px', background: active ? 'var(--accent-blue)' : 'white', color: active ? 'white' : 'var(--text-secondary)', whiteSpace: 'nowrap', fontWeight: 600, fontSize: '14px', boxShadow: active ? '0 4px 12px rgba(216, 154, 91, 0.3)' : 'var(--shadow-sm)', cursor: 'pointer' }}>
            {format(m, 'MMMM', { locale: fr })}
          </div>
        )
      })}
    </div>
  );
};

const ExpenseItem = ({ item, onDelete }) => {
  const cat = CATEGORIES.find(c => c.id === item.category) || CATEGORIES[5];
  const Icon = cat.icon;
  return (
    <motion.div whileTap={{ scale: 0.98 }} className="card" style={{ display: 'flex', alignItems: 'center', padding: '16px', gap: '16px', marginBottom: '12px' }}>
      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: cat.bg, color: cat.color, display: 'flex', justifyContent: 'center', alignItems: 'center' }}><Icon size={20} /></div>
      <div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: '15px' }}>{item.title}</p><div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{cat.name}</p><span style={{ width: '3px', height: '3px', background: '#C6C6C8', borderRadius: '50%' }}></span><p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{format(parseISO(item.date), 'dd MMM', { locale: fr })}</p></div></div>
      <div style={{ textAlign: 'right', display: 'flex', alignItems: 'center', gap: '12px' }}><div><p style={{ fontWeight: 700, color: item.type === 'income' ? 'var(--accent-green)' : 'var(--text-main)' }}>{item.type === 'income' ? '+' : '-'}{item.amount.toLocaleString()} DA</p></div><button onClick={(e) => { e.stopPropagation(); onDelete(item.id); }} style={{ background: '#FFEBEE', color: '#FF3B30', padding: '8px', borderRadius: '8px' }}><Trash2 size={16} /></button></div>
    </motion.div>
  );
};

const StatisticsView = ({ expenses, subscriptions, onAddSub, onDeleteSub, selectedMonth }) => {
  const [isAddingSub, setIsAddingSub] = useState(false);
  const [newSub, setNewSub] = useState({ title: '', amount: '', category: 'bills', billing_day: 1 });
  const filtered = expenses.filter(exp => { const expDate = parseISO(exp.date); return getMonth(expDate) === getMonth(selectedMonth) && getYear(expDate) === getYear(selectedMonth); });
  const categoryData = useMemo(() => CATEGORIES.map(cat => ({ name: cat.name, value: filtered.filter(exp => exp.category === cat.id && exp.type === 'expense').reduce((sum, exp) => sum + exp.amount, 0), color: cat.color })).filter(d => d.value > 0), [filtered]);
  const dailyData = useMemo(() => eachDayOfInterval({ start: startOfMonth(selectedMonth), end: endOfMonth(selectedMonth) }).map(day => ({ date: format(day, 'd'), amount: filtered.filter(exp => isSameDay(parseISO(exp.date), day) && exp.type === 'expense').reduce((sum, exp) => sum + exp.amount, 0) })), [filtered, selectedMonth]);
  return (
    <div className="animate-slide-up" style={{ padding: '0 20px', paddingBottom: '100px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Analyses & Abonnements</h2>
      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Répartition par Catégorie</h3>
        {categoryData.length > 0 ? <div style={{ height: '250px' }}><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">{categoryData.map((entry, index) => (<Cell key={`cell-${index}`} fill={entry.color} />))}</Pie><Tooltip formatter={(val) => `${val.toLocaleString()} DA`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} /></PieChart></ResponsiveContainer></div> : <div style={{ height: '250px', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-secondary)' }}><p>Pas encore de dépenses ce mois-ci</p></div>}
      </div>
      <div className="card" style={{ padding: '20px', marginTop: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}><h3 style={{ fontSize: '16px' }}>Abonnements (Récurrents)</h3><button onClick={() => setIsAddingSub(true)} style={{ background: 'var(--pastel-blue)', color: 'var(--accent-blue)', padding: '6px 12px', borderRadius: '10px', fontSize: '12px', fontWeight: 700 }}>+ Ajouter</button></div>
        <AnimatePresence>{isAddingSub && (<motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} style={{ overflow: 'hidden' }}><div style={{ background: '#F8F5F2', padding: '15px', borderRadius: '15px', marginBottom: '20px' }}><input type="text" placeholder="Nom (ex: Netflix)" value={newSub.title} onChange={e => setNewSub({...newSub, title: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E5E5EA', marginBottom: '10px' }} /><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}><input type="number" placeholder="Montant DA" value={newSub.amount} onChange={e => setNewSub({...newSub, amount: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E5E5EA' }} /><input type="number" placeholder="Jour (1-31)" value={newSub.billing_day} onChange={e => setNewSub({...newSub, billing_day: e.target.value})} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E5E5EA' }} /></div><div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}><button onClick={() => { onAddSub(newSub); setIsAddingSub(false); }} className="btn-primary" style={{ flex: 1, padding: '10px' }}>Enregistrer</button><button onClick={() => setIsAddingSub(false)} style={{ flex: 1, padding: '10px', color: 'var(--text-secondary)' }}>Annuler</button></div></div></motion.div>)}</AnimatePresence>
        {subscriptions.map(sub => (<div key={sub.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 0', borderBottom: '1px solid var(--sep-color)' }}><div style={{ width: '40px', height: '40px', borderRadius: '10px', background: 'var(--pastel-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><RefreshCw size={18} color="var(--accent-blue)" /></div><div style={{ flex: 1 }}><p style={{ fontWeight: 600, fontSize: '14px' }}>{sub.title}</p><p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Prélèvement le {sub.billing_day} de chaque mois</p></div><div style={{ textAlign: 'right' }}><p style={{ fontWeight: 700, fontSize: '14px' }}>{sub.amount.toLocaleString()} DA</p><button onClick={() => onDeleteSub(sub.id)} style={{ color: 'var(--accent-red)', marginLeft: '10px' }}><Trash2 size={14} /></button></div></div>))}
      </div>
      <div className="card" style={{ padding: '20px', marginTop: '20px' }}><h3 style={{ fontSize: '16px', marginBottom: '20px' }}>Évolution Journalière</h3><div style={{ height: '200px' }}><ResponsiveContainer width="100%" height="100%"><AreaChart data={dailyData}><defs><linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent-blue)" stopOpacity={0.3}/><stop offset="95%" stopColor="var(--accent-blue)" stopOpacity={0}/></linearGradient></defs><CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E0DA" /><XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10 }} /><YAxis hide /><Tooltip formatter={(val) => `${val.toLocaleString()} DA`} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow-md)' }} /><Area type="monotone" dataKey="amount" stroke="var(--accent-blue)" strokeWidth={3} fillOpacity={1} fill="url(#colorAmount)" /></AreaChart></ResponsiveContainer></div></div>
    </div>
  );
};

const TirelireView = ({ savings, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false); const [customAmount, setCustomAmount] = useState(''); const [editTitle, setEditTitle] = useState(savings.title); const [editGoal, setEditGoal] = useState(savings.goal); const progress = savings.goal > 0 ? Math.min((savings.current / savings.goal) * 100, 100) : 0;
  const handleSaveSettings = () => { onUpdate({ ...savings, title: editTitle, goal: parseFloat(editGoal) || 0 }); setIsEditing(false); };
  return (
    <div className="animate-slide-up" style={{ padding: '0 20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}><h2 style={{ fontSize: '24px' }}>Ma Tirelire</h2><button onClick={() => setIsEditing(!isEditing)} style={{ background: 'var(--pastel-blue)', color: 'var(--accent-blue)', padding: '6px 12px', borderRadius: '10px', fontSize: '13px', fontWeight: 600 }}>{isEditing ? 'Fermer' : 'Éditer'}</button></div>
      {isEditing ? (<motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="card"><h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Paramètres de l'Objectif</h3><div style={{ marginBottom: '12px' }}><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Titre de l'objectif</label><input type="text" value={editTitle} onChange={e => setEditTitle(e.target.value)} className="glass" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#F8F5F2', outline: 'none' }} /></div><div style={{ marginBottom: '20px' }}><label style={{ fontSize: '12px', color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>Montant Objectif (DA)</label><input type="number" value={editGoal} onChange={e => setEditGoal(e.target.value)} className="glass" style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#F8F5F2', outline: 'none' }} /></div><button onClick={handleSaveSettings} className="btn-primary" style={{ width: '100%' }}>Enregistrer</button></motion.div>) : (<><div className="card" style={{ position: 'relative', minHeight: '420px', backgroundImage: 'url("/tirelire.jpg")', backgroundSize: 'contain', backgroundPosition: 'top center', backgroundRepeat: 'no-repeat', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '24px', overflow: 'hidden', backgroundColor: 'white' }}><div className="glass" style={{ padding: '20px', borderRadius: '20px', background: 'rgba(255,255,255,0.3)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', boxShadow: 'var(--shadow-md)', border: '1px solid rgba(255,255,255,0.3)' }}><p style={{ color: 'var(--text-secondary)', fontSize: '13px', fontWeight: 600, textTransform: 'uppercase' }}>{savings.title}</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', margin: '10px 0' }}><h2 style={{ fontSize: '28px' }}>{savings.current.toLocaleString()} DA</h2><p style={{ color: 'var(--text-secondary)' }}>sur {savings.goal.toLocaleString()} DA</p></div><div style={{ height: '12px', background: '#E5E5EA', borderRadius: '10px', overflow: 'hidden', marginBottom: '10px' }}><motion.div initial={{ width: 0 }} animate={{ width: `${progress}%` }} style={{ height: '100%', background: 'var(--accent-blue)', borderRadius: '10px' }} /></div><div style={{ display: 'flex', justifyContent: 'space-between' }}><p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Manque: {Math.max(0, savings.goal - savings.current).toLocaleString()} DA</p><p style={{ fontSize: '13px', fontWeight: 700, color: 'var(--accent-blue)' }}>{savings.goal > 0 ? Math.round(progress) : 0}%</p></div></div></div><div className="card" style={{ marginTop: '20px', padding: '20px' }}><p style={{ fontSize: '14px', fontWeight: 600, marginBottom: '12px' }}>Gérer mes économies</p><div style={{ display: 'flex', gap: '10px' }}><input type="number" placeholder="Montant (DA)" value={customAmount} onChange={e => setCustomAmount(e.target.value)} style={{ flex: 1, padding: '12px', borderRadius: '12px', border: '1px solid #E5E5EA', outline: 'none' }} /><button onClick={() => { const val = parseFloat(customAmount); if (val > 0) { onUpdate({ ...savings, current: savings.current + val }, true); setCustomAmount(''); } }} style={{ background: 'var(--accent-green)', color: 'white', padding: '12px 20px', borderRadius: '12px', fontWeight: 700 }}>+ Depôt</button></div><div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginTop: '12px' }}><button onClick={() => onUpdate({ ...savings, current: savings.current + 500 }, true)} style={{ padding: '12px', background: 'var(--pastel-blue)', color: 'var(--accent-blue)', borderRadius: '12px', fontWeight: 600 }}>+ 500 DA</button><button onClick={() => { const val = customAmount ? parseFloat(customAmount) : 500; onUpdate({ ...savings, current: Math.max(0, savings.current - val) }, false); if (customAmount) setCustomAmount(''); }} style={{ padding: '12px', background: 'var(--pastel-red)', color: 'var(--accent-red)', borderRadius: '12px', fontWeight: 600 }}>{customAmount ? `- ${customAmount} DA` : '- 500 DA'}</button></div><p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '10px', textAlign: 'center' }}>Note: Un dépôt retire la somme de votre solde principal.</p></div></>)}
    </div>
  );
};

const AddModal = ({ isOpen, onClose, onAdd }) => {
  const [amount, setAmount] = useState(''); const [title, setTitle] = useState(''); const [category, setCategory] = useState('food'); const [type, setType] = useState('expense'); const [isReminder, setIsReminder] = useState(false); const [dueDate, setDueDate] = useState(format(addDays(new Date(), 7), 'yyyy-MM-dd')); const [isScanning, setIsScanning] = useState(false); const fileInputRef = useRef(null);
  if (!isOpen) return null;
  const handleScan = async (e) => { const file = e.target.files[0]; if (!file) return; setIsScanning(true); try { const { data: { text } } = await Tesseract.recognize(file, 'fra+eng'); const amounts = text.match(/\d+[.,]\d{2}/g); if (amounts) { const sorted = amounts.map(a => parseFloat(a.replace(',', '.'))).sort((a, b) => b - a); setAmount(sorted[0].toString()); } const lines = text.split('\n').filter(l => l.trim().length > 3); if (lines.length > 0) setTitle(lines[0].trim().substring(0, 20)); } catch (err) { alert("Échec du scan."); } finally { setIsScanning(false); } };
  const handleSubmit = (e) => { e.preventDefault(); if (!amount || !title) return; onAdd({ title, amount: parseFloat(amount), category, date: new Date().toISOString(), type, isReminder, dueDate }); setAmount(''); setTitle(''); setIsReminder(false); onClose(); };
  return (
    <div className="glass" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end' }}><div style={{ width: '100%', padding: '10px', position: 'absolute', top: 0, left: 0 }}></div>
      <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }} style={{ width: '100%', background: 'white', borderTopLeftRadius: '30px', borderTopRightRadius: '30px', padding: '24px', paddingBottom: '40px', boxShadow: '0 -10px 40px rgba(0,0,0,0.1)' }}><div style={{ width: '40px', height: '5px', background: '#E5E5EA', borderRadius: '10px', margin: '0 auto 20px' }} onClick={onClose}></div><h2 style={{ marginBottom: '20px', textAlign: 'center' }}>Nouvelle Opération</h2>
        <div style={{ display: 'flex', background: '#F8F5F2', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}><button onClick={() => setType('expense')} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: type === 'expense' ? 'white' : 'transparent', boxShadow: type === 'expense' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', fontWeight: 600 }}>Dépense</button><button onClick={() => setType('income')} style={{ flex: 1, padding: '10px', borderRadius: '10px', background: type === 'income' ? 'white' : 'transparent', boxShadow: type === 'income' ? '0 2px 8px rgba(0,0,0,0.1)' : 'none', fontWeight: 600 }}>Revenu</button></div>
        <form onSubmit={handleSubmit}><div style={{ marginBottom: '16px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}><label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)' }}>Montant (DA)</label><button type="button" onClick={() => fileInputRef.current?.click()} style={{ background: 'var(--pastel-blue)', color: 'var(--accent-blue)', padding: '6px 10px', borderRadius: '8px', fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '5px' }}>{isScanning ? <Loader2 size={14} className="animate-spin" /> : <><Camera size={14} /> Scanner ticket</>}</button><input type="file" ref={fileInputRef} onChange={handleScan} accept="image/*" style={{ display: 'none' }} /></div><input type="number" value={amount} onChange={e => setAmount(e.target.value)} placeholder="0.00" style={{ width: '100%', fontSize: '24px', border: 'none', borderBottom: '2px solid #E5E5EA', padding: '8px 0', outline: 'none', fontWeight: 700 }} /></div><div style={{ marginBottom: '16px' }}><label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '8px', display: 'block' }}>Titre</label><input type="text" value={title} onChange={e => setTitle(e.target.value)} placeholder="Ex: Loyer, Pizza..." style={{ width: '100%', fontSize: '16px', border: 'none', borderBottom: '2px solid #E5E5EA', padding: '8px 0', outline: 'none' }} /></div><div style={{ marginBottom: '20px', background: '#F8F5F2', padding: '15px', borderRadius: '15px' }}><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={18} color="var(--accent-blue)" /><p style={{ fontWeight: 600, fontSize: '14px' }}>Activer un rappel / facture</p></div><input type="checkbox" checked={isReminder} onChange={(e) => setIsReminder(e.target.checked)} style={{ width: '20px', height: '20px', accentColor: 'var(--accent-blue)' }} /></div>{isReminder && (<div style={{ marginTop: '12px' }}><label style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Échéance</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '10px', border: '1px solid #E5E5EA', marginTop: '4px', outline: 'none' }} /></div>)}</div><div style={{ marginBottom: '24px' }}><label style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '12px', display: 'block' }}>Catégorie</label><div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>{CATEGORIES.map(cat => (<div key={cat.id} onClick={() => setCategory(cat.id)} style={{ padding: '12px', borderRadius: '15px', textAlign: 'center', background: category === cat.id ? cat.bg : '#F8F5F2', border: category === cat.id ? `1px solid ${cat.color}` : '1px solid transparent', cursor: 'pointer' }}><cat.icon size={20} style={{ color: category === cat.id ? cat.color : '#8E847E', marginBottom: '4px' }} /><p style={{ fontSize: '10px', fontWeight: 600 }}>{cat.name}</p></div>))}</div></div><button type="submit" className="btn-primary" style={{ width: '100%', fontSize: '17px' }}>{isReminder ? 'Planifier le rappel' : 'Ajouter'}</button><button type="button" onClick={onClose} style={{ width: '100%', padding: '16px', background: 'transparent', color: 'var(--text-secondary)', fontSize: '15px' }}>Annuler</button></form></motion.div>
    </div>
  );
};

function SettingsView({ household, profile, onLogout }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => { navigator.clipboard.writeText(household.invite_code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="animate-slide-up" style={{ padding: '0 20px' }}>
      <h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Paramètres</h2>
      <div className="card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '20px' }}><div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'var(--pastel-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}><User size={30} color="var(--accent-blue)" /></div><div><p style={{ fontWeight: 700, fontSize: '18px' }}>{profile.username || 'Utilisateur'}</p><p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>{profile.email}</p></div></div>
        <div style={{ padding: '15px', background: '#F8F5F2', borderRadius: '15px' }}><p style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', marginBottom: '8px' }}>Foyer Actif</p><div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><p style={{ fontWeight: 700, fontSize: '16px' }}>{household.name}</p></div></div>
        <div style={{ marginTop: '20px' }}><p style={{ fontSize: '13px', marginBottom: '10px' }}>Inviter un membre :</p><div onClick={copyCode} style={{ background: 'white', border: '1px dashed var(--accent-blue)', padding: '12px', borderRadius: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}><p style={{ fontWeight: 800, letterSpacing: '2px', color: 'var(--accent-blue)' }}>{household.invite_code}</p>{copied ? <CheckCircle2 size={18} color="var(--accent-green)" /> : <Copy size={18} color="var(--accent-blue)" />}</div></div>
      </div>
      <button onClick={onLogout} className="card" style={{ width: '100%', marginTop: '20px', padding: '20px', display: 'flex', alignItems: 'center', gap: '15px', color: 'var(--accent-red)' }}><LogOut size={20} /> <p style={{ fontWeight: 600 }}>Se déconnecter</p></button>
    </div>
  );
}

// --- Main App ---

export default function App() {
  const [session, setSession] = useState(null); const [profile, setProfile] = useState(null); const [household, setHousehold] = useState(null); const [activeTab, setActiveTab] = useState('home'); const [selectedMonth, setSelectedMonth] = useState(new Date()); const [loading, setLoading] = useState(true);
  const [expenses, setExpenses] = useState([]); const [bills, setBills] = useState([]); const [subscriptions, setSubscriptions] = useState([]); const [savings, setSavings] = useState(INITIAL_SAVINGS);
  const [isModalOpen, setIsModalOpen] = useState(false); const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => { setSession(session); if (session) fetchProfile(session.user.id); else setLoading(false); });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => { setSession(session); if (session) fetchProfile(session.user.id); else { setProfile(null); setHousehold(null); setLoading(false); } });
    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId) => {
    // Fallback profile creation if trigger failed or for existing users
    const { data: prof, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
    if (!error && prof) {
       setProfile(prof);
       if (prof.household_id) fetchHouseholdData(prof.household_id);
       else setLoading(false);
    } else {
       // Force profile creation attempt if not found
       const { data: newProf } = await supabase.from('profiles').upsert([{ id: userId, email: (await supabase.auth.getUser()).data.user.email }]).select().single();
       if (newProf) {
         setProfile(newProf);
         if (newProf.household_id) fetchHouseholdData(newProf.household_id);
         else setLoading(false);
       } else setLoading(false);
    }
  };

  const fetchHouseholdData = async (hId) => {
    const { data: h } = await supabase.from('households').select('*').eq('id', hId).single();
    if (h) setHousehold(h);
    const { data: exp } = await supabase.from('expenses').select('*').eq('household_id', hId).order('date', { ascending: false });
    const { data: bill } = await supabase.from('bills').select('*').eq('household_id', hId).order('due_date', { ascending: true });
    const { data: sub } = await supabase.from('subscriptions').select('*').eq('household_id', hId).order('billing_day', { ascending: true });
    const { data: save } = await supabase.from('savings').select('*').eq('household_id', hId).single();
    setExpenses(exp || []); setBills(bill || []); setSubscriptions(sub || []); if (save) setSavings(save);
    checkDueBills(bill || []); if (sub) processSubscriptions(sub, exp || [], hId);
    setLoading(false);
  };

  const processSubscriptions = async (subs, existingExpenses, hId) => {
    const today = new Date(); for (const sub of subs) {
      if (sub.active && sub.billing_day <= getDate(today)) {
        const alreadyExists = existingExpenses.some(exp => exp.title.includes(sub.title) && getMonth(parseISO(exp.date)) === getMonth(today) && getYear(parseISO(exp.date)) === getYear(today));
        if (!alreadyExists) {
          const { data } = await supabase.from('expenses').insert([{ title: `Abonnement: ${sub.title}`, amount: sub.amount, category: sub.category, date: today.toISOString(), type: 'expense', household_id: hId }]).select();
          if (data) setExpenses(prev => [data[0], ...prev]);
        }
      }
    }
  };

  const checkDueBills = (billList) => {
    const today = new Date(); const dueSoon = billList.filter(b => !b.paid && (isToday(parseISO(b.due_date)) || isBefore(parseISO(b.due_date), today)));
    if (dueSoon.length > 0) {
      setNotifications(dueSoon.map(b => `${b.title} (${b.amount.toLocaleString()} DA)`));
      if ("Notification" in window && Notification.permission === "granted") new Notification("Rappel de facture", { body: `Factures en attente !`, icon: "/favicon.svg" });
    }
  };

  const handleLogout = async () => { await supabase.auth.signOut(); setHousehold(null); setProfile(null); };
  const addExpense = async (payload) => {
    const { isReminder, dueDate, ...newExp } = payload;
    if (isReminder) { const { data } = await supabase.from('bills').insert([{ ...newExp, due_date: dueDate, paid: false, household_id: household.id }]).select(); if (data) setBills([...bills, data[0]]); }
    else { const { data } = await supabase.from('expenses').insert([{ ...newExp, household_id: household.id }]).select(); if (data) setExpenses([data[0], ...expenses]); }
  };
  const deleteExpense = async (id) => { if (!id) return; await supabase.from('expenses').delete().eq('id', id); fetchData(); };
  const toggleBill = async (id) => {
    const bill = bills.find(b => b.id === id); if (!bill) return; const isPaying = !bill.paid; const { data } = await supabase.from('bills').update({ paid: isPaying }).eq('id', id).select();
    if (data) { setBills(prev => prev.map(b => b.id === id ? data[0] : b)); if (isPaying) addExpense({ title: `Facture: ${bill.title}`, amount: bill.amount, category: 'bills', date: new Date().toISOString(), type: 'expense' }); }
  };
  const addSub = async (sub) => { const { data } = await supabase.from('subscriptions').insert([{ ...sub, household_id: household.id }]).select(); if (data) setSubscriptions([...subscriptions, data[0]]); };
  const deleteSub = async (id) => { await supabase.from('subscriptions').delete().eq('id', id); setSubscriptions(prev => prev.filter(s => s.id !== id)); };
  
  const updateSavings = async (newSavings, isDeposit) => {
    const { data } = await supabase.from('savings').upsert([{ ...newSavings, household_id: household.id }], { onConflict: 'household_id' }).select();
    if (data) { setSavings(data[0]); if (isDeposit !== undefined) { const diff = Math.abs(newSavings.current - savings.current); addExpense({ title: isDeposit ? "Dépôt Tirelire" : "Retrait Tirelire", amount: diff, category: 'other', date: new Date().toISOString(), type: isDeposit ? 'expense' : 'income' }); } }
  };
  const deleteBill = async (id) => { const { error } = await supabase.from('bills').delete().eq('id', id); if (!error) setBills(bills.filter(b => b.id !== id)); };

  const filteredExpenses = useMemo(() => expenses.filter(exp => { const expDate = parseISO(exp.date); return getMonth(expDate) === getMonth(selectedMonth) && getYear(expDate) === getYear(selectedMonth); }), [expenses, selectedMonth]);
  const stats = useMemo(() => { const inc = filteredExpenses.filter(e => e.type === Inc).reduce((a, b) => a + b.amount, 0); const exp = filteredExpenses.filter(e => e.type === 'expense').reduce((a, b) => a + b.amount, 0); return { income: inc, expense: exp, total: inc - exp }; }, [filteredExpenses]);

  const Inc = 'income'; // To fix potential issues

  if (!session) return <LoginPage />;
  if (loading) return <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'var(--bg-color)' }}><Loader2 className="animate-spin" size={48} color="var(--accent-blue)" /></div>;
  if (!household) return <HouseholdOnboarding onComplete={(hId) => fetchHouseholdData(hId)} />;

  return (
    <div className="app-container">
      {activeTab === 'home' && (
        <div className="animate-slide-up" style={{ padding: '0 20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}><div><p style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>Balance Mensuelle</p><h2 style={{ fontSize: '24px' }}>{household.name}</h2></div><div onClick={() => setActiveTab('settings')} style={{ width: '45px', height: '45px', borderRadius: '50%', background: 'var(--pastel-blue)', display: 'flex', justifyContent: 'center', alignItems: 'center', cursor: 'pointer' }}><Users size={20} color="var(--accent-blue)" /></div></div>
          <MonthSelector selected={selectedMonth} onSelect={setSelectedMonth} />
          <SummaryCard {...stats} selectedMonth={selectedMonth} />
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '24px', marginBottom: '16px' }}><h3 style={{ fontSize: '18px' }}>Opérations du mois</h3><button onClick={() => setActiveTab('history')} style={{ background: 'transparent', color: 'var(--accent-blue)', fontWeight: 600, fontSize: '14px' }}>Historique</button></div>
          {filteredExpenses.slice(0, 5).map(exp => <ExpenseItem key={exp.id} item={exp} onDelete={deleteExpense} />)}
        </div>
      )}
      {activeTab === 'history' && <div className="animate-slide-up" style={{ padding: '0 20px' }}><h2 style={{ fontSize: '24px', marginBottom: '20px' }}>Historique</h2>{expenses.map(exp => <ExpenseItem key={exp.id} item={exp} onDelete={deleteExpense} />)}</div>}
      {activeTab === 'stats' && <StatisticsView expenses={expenses} subscriptions={subscriptions} onAddSub={addSub} onDeleteSub={deleteSub} selectedMonth={selectedMonth} />}
      {activeTab === 'savings' && <TirelireView savings={savings} onUpdate={updateSavings} />}
      {activeTab === 'reminders' && (
        <div className="animate-slide-up" style={{ padding: '0 20px' }}>
          <h2 style={{ fontSize: '24px', marginBottom: '8px' }}>Rappels</h2>
          {bills.filter(b => !b.paid).map(bill => (<div key={bill.id} className="card" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><div style={{ flex: 1 }}><p style={{ fontWeight: 600 }}>{bill.title}</p><p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>{bill.due_date}</p></div><button onClick={() => toggleBill(bill.id)}>Payer</button></div>))}
        </div>
      )}
      {activeTab === 'settings' && <SettingsView household={household} profile={profile} onLogout={handleLogout} />}
      <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} onAddClick={() => setIsModalOpen(true)} />
      <AnimatePresence>{isModalOpen && <AddModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onAdd={addExpense} />}</AnimatePresence>
    </div>
  );
}
