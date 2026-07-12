import { useState, useEffect } from 'react';
import { getCategories, getProduits, appelServeur, getParametres } from '../lib/supabase';
import Book3D, { ProduitCard } from '../components/Book3D';
import Panier from '../components/Panier';

const C = {
  primary:    '#1A3A2A',
  primaryMid: '#2D5E42',
  gold:       '#B8943F',
  goldLight:  '#D4AF6A',
  beige:      '#F5EDD8',
  cream:      '#FBF8F0',
  dark:       '#1A1A14',
  darkSoft:   'rgba(26,26,20,0.55)',
  border:     'rgba(184,148,63,0.20)',
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  useEffect(() => {
    const fn = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', fn);
    return () => window.removeEventListener('resize', fn);
  }, []);
  return isMobile;
}

const ITEMS_PER_PAGE = 50; // tout afficher par catégorie

const L = {
  chargement: 'Chargement…',
  panier: 'Commande',
  appelServeurFull: '🔔 Appeler le serveur',
  tableModal: 'Votre numéro de table ?',
  tablePh: 'Ex: 5, Bar, Terrasse…',
  envoyer: 'Appeler',
  annuler: 'Annuler',
  appelOk: '🔔 Le serveur arrive !',
  errTable: 'Indiquez votre numéro de table.',
  errAppel: "Erreur : impossible d'appeler le serveur.",
  recherche: 'Rechercher un plat, une catégorie…',
};

export default function MenuPage() {
  const [categories, setCategories] = useState([]);
  const [produits, setProduits]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [panier, setPanier]         = useState([]);
  const [showPanier, setShowPanier] = useState(false);
  const [showAppel, setShowAppel]   = useState(false);
  const [tableAppel, setTableAppel] = useState('');
  const [errAppel, setErrAppel]     = useState('');
  const [toast, setToast]           = useState('');
  const [appelLoading, setAppelLoading] = useState(false);
  const [parametres, setParametres] = useState(null);
  const [search, setSearch]         = useState('');
  const isMobile = useIsMobile();

  useEffect(() => {
    Promise.all([getCategories(), getProduits(), getParametres()]).then(([cats, prods, params]) => {
      setCategories(cats.data || []);
      setProduits(prods.data || []);
      setParametres(params.data || null);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (!parametres) return;
    if (parametres.nom_restaurant) document.title = `${parametres.nom_restaurant} — Carte`;
    if (parametres.logo_url) {
      let link = document.querySelector("link[rel~='icon']");
      if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
      link.href = parametres.logo_url;
    }
  }, [parametres]);

  const buildPages = () => {
    const pages = [];
    categories.forEach(cat => {
      const catProds = produits.filter(p => p.categorie_id === cat.id);
      if (!catProds.length) return;
      pages.push({ categorie: cat, produits: catProds });
    });
    const sansCat = produits.filter(p => !p.categorie_id);
    if (sansCat.length > 0) pages.push({ categorie: { nom: 'Autres', emoji: '🍽️' }, produits: sansCat });
    return pages;
  };

  const handleAdd = (produit) => {
    setPanier(prev => {
      const idx = prev.findIndex(i => i.id === produit.id);
      if (idx >= 0) { const n = [...prev]; n[idx] = { ...n[idx], quantite: n[idx].quantite + produit.quantite }; return n; }
      return [...prev, { ...produit }];
    });
    showToast(`✓ ${produit.nom} ajouté`);
  };

  const handleUpdateQty = (idx, delta) => {
    setPanier(prev => {
      const n = [...prev];
      n[idx] = { ...n[idx], quantite: n[idx].quantite + delta };
      if (n[idx].quantite <= 0) n.splice(idx, 1);
      return n;
    });
  };

  const handleConfirm = (msg) => { setPanier([]); setShowPanier(false); showToast(msg); };

  const handleAppelServeur = async () => {
    if (!tableAppel.trim()) { setErrAppel(L.errTable); return; }
    setAppelLoading(true); setErrAppel('');
    const { error } = await appelServeur(tableAppel.trim());
    setAppelLoading(false);
    if (error) { setErrAppel(L.errAppel); return; }
    setShowAppel(false); setTableAppel(''); showToast(L.appelOk);
  };

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000); };

  const pages = buildPages();
  const totalItems = panier.reduce((s, i) => s + i.quantite, 0);

  const normalize = (s) => (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  const searchActive = search.trim().length > 0;
  const getCatName = (catId) => categories.find(c => c.id === catId)?.nom || '';
  const filteredProduits = searchActive
    ? produits.filter(p => {
        const q = normalize(search);
        return normalize(p.nom).includes(q) || normalize(p.description).includes(q) || normalize(getCatName(p.categorie_id)).includes(q);
      })
    : [];

  return (
    /* Root — pas de overflow hidden, scroll natif */
    <div style={{
      minHeight: '100dvh',
      background: C.cream,
      display: 'flex', flexDirection: 'column',
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    }}>

      {/* ── HEADER sticky ── */}
      <header style={{
        position: 'sticky', top: 0, zIndex: 100,
        padding: isMobile ? '12px 16px' : '14px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: C.primary, gap: 10,
        boxShadow: '0 2px 16px rgba(26,58,42,0.25)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 0 }}>
          {parametres?.logo_url ? (
            <img src={parametres.logo_url} alt="Logo" style={{ width: isMobile ? 36 : 42, height: isMobile ? 36 : 42, borderRadius: '50%', objectFit: 'cover', flexShrink: 0, border: `2px solid ${C.gold}` }} />
          ) : (
            <div style={{ width: isMobile ? 36 : 42, height: isMobile ? 36 : 42, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: 18 }}>🌿</div>
          )}
          <div style={{ minWidth: 0 }}>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 20 : 24, fontWeight: 700, color: C.beige, margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {parametres?.nom_restaurant || 'Le Centre'}
            </h1>
            {!isMobile && <p style={{ fontSize: 10, color: C.gold, margin: 0, letterSpacing: '0.14em', textTransform: 'uppercase' }}>Notre Carte</p>}
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? 8 : 12, flexShrink: 0 }}>
          <button onClick={() => setShowAppel(true)} style={{ background: 'rgba(255,255,255,0.10)', border: `1px solid rgba(184,148,63,0.40)`, color: C.gold, borderRadius: 8, padding: isMobile ? '7px 12px' : '8px 18px', fontSize: isMobile ? 14 : 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {isMobile ? '🔔' : L.appelServeurFull}
          </button>
          <button onClick={() => setShowPanier(true)} style={{
            background: totalItems > 0 ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : 'rgba(255,255,255,0.10)',
            border: totalItems > 0 ? 'none' : `1px solid rgba(184,148,63,0.40)`,
            color: '#fff', borderRadius: 8, padding: isMobile ? '7px 12px' : '8px 20px',
            fontSize: isMobile ? 14 : 13, fontWeight: 700, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap',
          }}>
            🛒 {!isMobile && L.panier}
            {totalItems > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '50%', minWidth: 20, height: 20, padding: '0 5px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800 }}>{totalItems}</span>}
          </button>
        </div>
      </header>

      {/* ── BARRE RECHERCHE sticky ── */}
      <div style={{ position: 'sticky', top: isMobile ? 60 : 70, zIndex: 99, padding: isMobile ? '10px 16px' : '12px 32px', background: C.primaryMid }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(255,255,255,0.10)', border: `1px solid rgba(184,148,63,0.25)`, borderRadius: 10, padding: isMobile ? '9px 14px' : '10px 16px', maxWidth: isMobile ? '100%' : 520, margin: isMobile ? 0 : '0 auto' }}>
          <span style={{ fontSize: 14, color: C.gold }}>🔎</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder={L.recherche}
            style={{ flex: 1, border: 'none', background: 'transparent', outline: 'none', fontSize: 14, color: C.beige, fontFamily: 'inherit' }} />
          {search && <button onClick={() => setSearch('')} style={{ border: 'none', background: 'transparent', color: 'rgba(245,237,216,0.5)', fontSize: 16, cursor: 'pointer' }}>✕</button>}
        </div>
      </div>

      {/* ── CONTENU — scroll natif ── */}
      <main style={{ flex: 1, padding: isMobile ? '16px 0 60px' : '24px 32px 60px' }}>
        <div style={{ maxWidth: 960, margin: '0 auto' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16, padding: '80px 0' }}>
              <div className="spinner" />
              <p style={{ color: C.darkSoft, fontSize: 14 }}>{L.chargement}</p>
            </div>
          ) : searchActive ? (
            filteredProduits.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '60px 20px', color: C.darkSoft }}>
                <div style={{ fontSize: 36, marginBottom: 10 }}>🔍</div>
                <p>Aucun résultat trouvé.</p>
              </div>
            ) : (
              Object.entries(
                filteredProduits.reduce((acc, p) => {
                  const key = getCatName(p.categorie_id) || 'Autres';
                  if (!acc[key]) acc[key] = [];
                  acc[key].push(p);
                  return acc;
                }, {})
              ).map(([catName, prods]) => (
                <div key={catName} style={{ marginBottom: 28, padding: isMobile ? '0 16px' : 0 }}>
                  <h3 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 18, fontWeight: 700, color: C.primary, margin: '0 0 8px', paddingBottom: 6, borderBottom: `2px solid ${C.gold}` }}>
                    {catName} <span style={{ fontSize: 12, fontWeight: 400, color: C.darkSoft }}>({prods.length})</span>
                  </h3>
                  {prods.map(p => <ProduitCard key={p.id} produit={p} onAdd={handleAdd} isMobile={isMobile} />)}
                </div>
              ))
            )
          ) : (
            <Book3D pages={pages} onAdd={handleAdd} isMobile={isMobile} parametres={parametres} />
          )}
        </div>
      </main>

      {/* ── FOOTER ── */}
      {!loading && parametres && (parametres.adresse || parametres.telephone) && (
        <footer style={{ borderTop: `1px solid ${C.border}`, padding: '16px 24px 24px', textAlign: 'center', color: C.darkSoft, fontSize: 13 }}>
          {parametres.adresse && <p style={{ marginBottom: 4, color: C.dark }}>{parametres.adresse}</p>}
          {parametres.horaires && <p style={{ marginBottom: 4 }}>{parametres.horaires}</p>}
          {parametres.telephone && (
            <p>{parametres.telephone}
              {parametres.whatsapp && <a href={`https://wa.me/${parametres.whatsapp}`} target="_blank" rel="noopener noreferrer" style={{ color: C.gold, marginLeft: 10, textDecoration: 'none', fontWeight: 600 }}>WhatsApp</a>}
            </p>
          )}
          <a href="https://wa.me/243977555768" target="_blank" rel="noopener noreferrer" style={{ display: 'block', marginTop: 10, color: 'rgba(26,26,20,0.20)', fontSize: 11, textDecoration: 'none' }}>Développé par Inspire by YuuStore</a>
        </footer>
      )}

      {/* ── PANIER ── */}
      {showPanier && <Panier items={panier} onUpdateQty={handleUpdateQty} onRemove={(idx) => setPanier(prev => prev.filter((_, i) => i !== idx))} onClose={() => setShowPanier(false)} onConfirm={handleConfirm} isMobile={isMobile} />}

      {/* ── MODAL APPEL ── */}
      {showAppel && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(26,58,42,0.50)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: 20 }} onClick={() => setShowAppel(false)}>
          <div style={{ background: '#fff', borderRadius: 20, padding: isMobile ? 24 : 32, width: '100%', maxWidth: 400, boxShadow: '0 20px 60px rgba(26,58,42,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', margin: '0 auto 16px', background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28 }}>🔔</div>
              <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: isMobile ? 20 : 24, color: C.primary, margin: 0, fontWeight: 700 }}>{L.tableModal}</h2>
            </div>
            <div style={{ marginBottom: 18 }}>
              <input value={tableAppel} onChange={e => { setTableAppel(e.target.value); setErrAppel(''); }} placeholder={L.tablePh} onKeyDown={e => e.key === 'Enter' && handleAppelServeur()} autoFocus style={{ width: '100%', padding: '13px 16px', border: `1.5px solid ${C.border}`, borderRadius: 12, fontSize: 16, fontFamily: 'inherit', outline: 'none', color: C.dark }} />
              {errAppel && <p style={{ color: '#C0392B', fontSize: 12, marginTop: 6 }}>⚠️ {errAppel}</p>}
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setShowAppel(false)} style={{ flex: 1, padding: 13, borderRadius: 10, border: `1px solid ${C.border}`, background: 'transparent', color: C.darkSoft, fontSize: 15, cursor: 'pointer', fontWeight: 600 }}>{L.annuler}</button>
              <button onClick={handleAppelServeur} disabled={appelLoading} style={{ flex: 2, padding: 13, borderRadius: 10, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`, color: C.beige, fontSize: 15, fontWeight: 700 }}>
                {appelLoading ? '⏳…' : L.envoyer}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── TOAST ── */}
      {toast && (
        <div style={{ position: 'fixed', bottom: isMobile ? 20 : 30, left: '50%', transform: 'translateX(-50%)', background: C.primary, color: C.beige, padding: '12px 24px', borderRadius: 12, fontSize: 14, fontWeight: 600, zIndex: 200, border: `1px solid ${C.gold}`, boxShadow: '0 8px 24px rgba(26,58,42,0.25)' }}>{toast}</div>
      )}
    </div>
  );
}
