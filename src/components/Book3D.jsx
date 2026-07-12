import { useState } from 'react';

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

/* ─── ProduitCard ─────────────────────────────────────────── */
export function ProduitCard({ produit, onAdd, isMobile }) {
  const [qty, setQty] = useState(1);
  const hasImage = produit.image_url && produit.image_url.trim() !== '';

  return (
    <div style={{
      padding: '14px 0',
      borderBottom: `1px solid rgba(184,148,63,0.12)`,
      display: 'flex',
      gap: hasImage ? 14 : 0,
      alignItems: 'flex-start',
    }}>
      {hasImage && (
        <div style={{ width: 64, height: 64, borderRadius: 10, overflow: 'hidden', flexShrink: 0, background: C.cream, border: `1px solid ${C.border}` }}>
          <img src={produit.image_url} alt={produit.nom} style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        </div>
      )}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16, fontWeight: 700, color: C.dark, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: isMobile ? '55vw' : 340 }}>
            {produit.nom}
          </span>
          <span style={{ flex: 1, borderBottom: `1.5px dotted rgba(184,148,63,0.30)`, position: 'relative', top: -3, minWidth: 8 }} />
          <span style={{ fontSize: 15, fontWeight: 800, color: C.gold, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {Number(produit.prix).toFixed(2)} $
          </span>
        </div>
        {produit.description && (
          <p style={{ fontSize: 12.5, color: C.darkSoft, fontStyle: 'italic', marginTop: 3, lineHeight: 1.35 }}>
            {produit.description}
          </p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{ width: 28, height: 28, borderRadius: '50%', border: `1px solid ${C.border}`, background: 'transparent', cursor: 'pointer', fontSize: 15, color: C.darkSoft, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.dark, minWidth: 18, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{ width: 28, height: 28, borderRadius: '50%', border: 'none', background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, cursor: 'pointer', fontSize: 15, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
          </div>
          <button onClick={() => { onAdd({ ...produit, quantite: qty, prix_unit: produit.prix }); setQty(1); }} style={{ flex: 1, padding: '7px 12px', borderRadius: 8, border: 'none', cursor: 'pointer', background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`, color: C.beige, fontSize: 13, fontWeight: 700 }}>
            Ajouter
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─── Menu simple — scroll vertical, toutes catégories ────── */
export default function Book3D({ pages, onAdd, isMobile }) {
  const [activeIdx, setActiveIdx] = useState(null);

  if (!pages || pages.length === 0) return (
    <div style={{ textAlign: 'center', padding: '60px 20px', color: C.darkSoft }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16 }}>La carte est vide.</p>
    </div>
  );

  return (
    <div style={{ width: '100%' }}>
      {pages.map((page, idx) => (
        <div key={idx} style={{ marginBottom: 32 }}>
          {/* En-tête catégorie */}
          <div style={{
            padding: isMobile ? '14px 16px 12px' : '16px 24px 14px',
            background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryMid} 100%)`,
            borderRadius: 14,
            marginBottom: 0,
            borderBottom: `2px solid ${C.gold}`,
          }}>
            <h2 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: isMobile ? 20 : 24, fontWeight: 700,
              color: C.beige, margin: 0, letterSpacing: '0.02em',
            }}>
              {page.categorie.emoji && <span style={{ marginRight: 8 }}>{page.categorie.emoji}</span>}
              {page.categorie.nom}
            </h2>
            {page.categorie.description && (
              <p style={{ color: C.gold, fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>{page.categorie.description}</p>
            )}
          </div>

          {/* Produits */}
          <div style={{
            background: '#fff',
            borderRadius: '0 0 14px 14px',
            padding: isMobile ? '0 16px' : '0 24px',
            border: `1px solid ${C.border}`,
            borderTop: 'none',
            boxShadow: '0 4px 16px rgba(26,58,42,0.07)',
          }}>
            {page.produits.map(p => (
              <ProduitCard key={p.id} produit={p} onAdd={onAdd} isMobile={isMobile} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
