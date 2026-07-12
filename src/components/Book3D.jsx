import { useState, useRef, useCallback, useEffect } from 'react';

// ─── Couleurs Le Centre ───────────────────────────────────────
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
      padding: isMobile ? '12px 0' : '14px 0',
      borderBottom: `1px solid rgba(184,148,63,0.12)`,
      display: 'flex',
      gap: hasImage ? (isMobile ? 12 : 16) : 0,
      alignItems: 'flex-start',
    }}>
      {hasImage && (
        <div style={{
          width: isMobile ? 64 : 72, height: isMobile ? 64 : 72,
          borderRadius: 12, overflow: 'hidden', flexShrink: 0,
          background: C.cream, border: `1px solid ${C.border}`,
        }}>
          <img src={produit.image_url} alt={produit.nom}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }} loading="lazy" />
        </div>
      )}

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
          <span style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: isMobile ? 15.5 : 16.5, fontWeight: 700, color: C.dark,
            overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            maxWidth: isMobile ? '55vw' : 280,
          }}>{produit.nom}</span>
          <span style={{ flex: 1, borderBottom: `1.5px dotted rgba(184,148,63,0.30)`, position: 'relative', top: -3, minWidth: 8 }} />
          <span style={{ fontSize: isMobile ? 15 : 16, fontWeight: 800, color: C.gold, whiteSpace: 'nowrap', flexShrink: 0 }}>
            {Number(produit.prix).toFixed(2)} $
          </span>
        </div>
        {produit.description && (
          <p style={{
            fontSize: isMobile ? 12 : 12.5, color: C.darkSoft, fontStyle: 'italic',
            marginTop: 3, lineHeight: 1.35,
            display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
          }}>{produit.description}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: isMobile ? 8 : 10 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <button onClick={() => setQty(q => Math.max(1, q - 1))} style={{
              width: 28, height: 28, borderRadius: '50%', border: `1px solid ${C.border}`,
              background: 'transparent', cursor: 'pointer', fontSize: 15, color: C.darkSoft,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>−</button>
            <span style={{ fontSize: 14, fontWeight: 700, color: C.dark, minWidth: 18, textAlign: 'center' }}>{qty}</span>
            <button onClick={() => setQty(q => q + 1)} style={{
              width: 28, height: 28, borderRadius: '50%', border: 'none',
              background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`,
              cursor: 'pointer', fontSize: 15, color: '#fff',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>+</button>
          </div>
          <button onClick={() => { onAdd({ ...produit, quantite: qty, prix_unit: produit.prix }); setQty(1); }} style={{
            flex: 1, padding: isMobile ? '7px 10px' : '8px 14px',
            borderRadius: 8, border: 'none', cursor: 'pointer',
            background: `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`,
            color: C.beige, fontSize: 13, fontWeight: 700, whiteSpace: 'nowrap',
          }}>Ajouter</button>
        </div>
      </div>
    </div>
  );
}

/* ─── PageContent ─────────────────────────────────────────── */
function PageContent({ categorie, produits, onAdd, isMobile }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#fff', overflow: 'hidden', minHeight: 0 }}>
      {/* Header catégorie */}
      <div style={{
        padding: isMobile ? '14px 16px 12px' : '18px 24px 14px',
        borderBottom: `2px solid ${C.gold}`,
        background: `linear-gradient(135deg, ${C.primary} 0%, ${C.primaryMid} 100%)`,
        flexShrink: 0,
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', Georgia, serif",
          fontSize: isMobile ? 20 : 24, fontWeight: 700,
          color: C.beige, margin: 0, letterSpacing: '0.02em',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
        }}>
          {categorie.emoji && <span style={{ marginRight: 8 }}>{categorie.emoji}</span>}
          {categorie.nom}
        </h2>
        {categorie.description && (
          <p style={{ color: C.gold, fontSize: 12, marginTop: 4, fontStyle: 'italic' }}>{categorie.description}</p>
        )}
      </div>
      {/* Produits */}
      <div style={{
        flex: 1, overflowY: 'auto',
        padding: isMobile ? '0 16px' : '0 24px',
        scrollbarWidth: 'thin', scrollbarColor: `${C.border} transparent`,
      }}>
        {produits.map(p => (
          <ProduitCard key={p.id} produit={p} onAdd={onAdd} isMobile={isMobile} />
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   Book3D — TOUS les états au niveau racine (règles des Hooks)
───────────────────────────────────────────────────────────── */
export default function Book3D({ pages, onAdd, isMobile }) {
  // États mobile
  const [mobileCurrent, setMobileCurrent] = useState(0);
  const [mobileAnimating, setMobileAnimating] = useState(false);
  const [mobileDir, setMobileDir]         = useState('next');

  // États desktop (paires de pages)
  const [pairIdx, setPairIdx]             = useState(0);
  const [pairAnimating, setPairAnimating] = useState(false);
  const [flipKey, setFlipKey]             = useState(0);
  const [flipSide, setFlipSide]           = useState(null); // 'right' | 'left'

  // Touch
  const touchStartX = useRef(null);
  const touchStartY = useRef(null);

  const total = pages?.length || 0;

  // Grouper en paires pour desktop
  const pairs = [];
  for (let i = 0; i < total; i += 2) {
    pairs.push([pages[i], i + 1 < total ? pages[i + 1] : null]);
  }
  const totalPairs = pairs.length;

  // Navigation mobile
  const goMobile = useCallback((dir) => {
    if (mobileAnimating) return;
    const next = dir === 'next' ? mobileCurrent + 1 : mobileCurrent - 1;
    if (next < 0 || next >= total) return;
    setMobileDir(dir);
    setMobileAnimating(true);
    setTimeout(() => { setMobileCurrent(next); setMobileAnimating(false); }, 280);
  }, [mobileAnimating, mobileCurrent, total]);

  // Navigation desktop
  const goPair = useCallback((dir) => {
    if (pairAnimating) return;
    const next = dir === 'next' ? pairIdx + 1 : pairIdx - 1;
    if (next < 0 || next >= totalPairs) return;
    setFlipSide(dir === 'next' ? 'right' : 'left');
    setFlipKey(k => k + 1);
    setPairAnimating(true);
    setTimeout(() => {
      setPairIdx(next);
      setFlipSide(null);
      setPairAnimating(false);
    }, 500);
  }, [pairAnimating, pairIdx, totalPairs]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') isMobile ? goMobile('next') : goPair('next');
      if (e.key === 'ArrowLeft')  isMobile ? goMobile('prev') : goPair('prev');
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isMobile, goMobile, goPair]);

  // Swipe touch
  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current || 0));
    if (Math.abs(dx) > 40 && dy < 80) goMobile(dx < 0 ? 'next' : 'prev');
    touchStartX.current = null;
  };

  if (!pages || total === 0) return (
    <div style={{ textAlign: 'center', padding: '80px 20px', color: C.darkSoft }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🍽️</div>
      <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 16 }}>La carte est vide.</p>
    </div>
  );

  // ═══════════════════════════════════
  // MOBILE
  // ═══════════════════════════════════
  if (isMobile) {
    return (
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}
        onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>

        {/* Onglets */}
        <div style={{ display: 'flex', gap: 6, padding: '8px 16px 10px', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
          {pages.map((p, i) => (
            <button key={i} onClick={() => { setMobileCurrent(i); }} style={{
              padding: '5px 12px', borderRadius: 20, border: 'none',
              cursor: 'pointer', flexShrink: 0,
              background: i === mobileCurrent ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : `rgba(26,58,42,0.08)`,
              color: i === mobileCurrent ? '#fff' : C.dark,
              fontSize: 12, fontWeight: i === mobileCurrent ? 700 : 400,
              transition: 'all 0.2s',
              boxShadow: i === mobileCurrent ? `0 2px 8px rgba(184,148,63,0.25)` : 'none',
            }}>{p.categorie.emoji} {p.categorie.nom}</button>
          ))}
        </div>

        {/* Page */}
        <div style={{
          flex: 1, minHeight: 0,
          borderRadius: 16, border: `1px solid ${C.border}`,
          overflow: 'hidden', boxShadow: `0 4px 24px rgba(26,58,42,0.10)`,
          transition: 'opacity 0.25s, transform 0.25s',
          opacity: mobileAnimating ? 0 : 1,
          transform: mobileAnimating
            ? `translateX(${mobileDir === 'next' ? '-16px' : '16px'})`
            : 'translateX(0)',
        }}>
          <PageContent
            categorie={pages[mobileCurrent].categorie}
            produits={pages[mobileCurrent].produits}
            onAdd={onAdd} isMobile={true}
          />
        </div>

        {/* Nav mobile */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px 0', flexShrink: 0 }}>
          <button onClick={() => goMobile('prev')} disabled={mobileCurrent === 0} style={{
            padding: '9px 16px', borderRadius: 10, border: `1px solid ${C.border}`,
            background: 'transparent', cursor: mobileCurrent === 0 ? 'not-allowed' : 'pointer',
            color: mobileCurrent === 0 ? 'rgba(26,26,20,0.20)' : C.primary,
            fontSize: 13, fontWeight: 600,
          }}>← Préc.</button>
          <span style={{ fontSize: 11, color: C.darkSoft }}>{mobileCurrent + 1} / {total}</span>
          <button onClick={() => goMobile('next')} disabled={mobileCurrent >= total - 1} style={{
            padding: '9px 16px', borderRadius: 10, border: 'none',
            cursor: mobileCurrent >= total - 1 ? 'not-allowed' : 'pointer',
            background: mobileCurrent >= total - 1 ? 'rgba(26,26,20,0.08)' : `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`,
            color: mobileCurrent >= total - 1 ? 'rgba(26,26,20,0.25)' : C.beige,
            fontSize: 13, fontWeight: 700,
          }}>Suiv. →</button>
        </div>
      </div>
    );
  }

  // ═══════════════════════════════════
  // DESKTOP — double page avec flip
  // ═══════════════════════════════════
  const [leftPage, rightPage] = pairs[pairIdx] || [null, null];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: 0 }}>

      {/* Onglets paires */}
      <div style={{ display: 'flex', gap: 6, padding: '10px 0 12px', overflowX: 'auto', flexShrink: 0, scrollbarWidth: 'none' }}>
        {pairs.map((pair, i) => (
          <button key={i} onClick={() => !pairAnimating && setPairIdx(i)} style={{
            padding: '5px 14px', borderRadius: 20, border: 'none',
            cursor: 'pointer', flexShrink: 0,
            background: i === pairIdx ? `linear-gradient(135deg, ${C.gold}, ${C.goldLight})` : `rgba(26,58,42,0.08)`,
            color: i === pairIdx ? '#fff' : C.dark,
            fontSize: 12, fontWeight: i === pairIdx ? 700 : 400,
            transition: 'all 0.2s',
            boxShadow: i === pairIdx ? `0 2px 10px rgba(184,148,63,0.30)` : 'none',
          }}>
            {pair[0].categorie.emoji} {pair[0].categorie.nom}
            {pair[1] && <span style={{ opacity: 0.7 }}> · {pair[1].categorie.nom}</span>}
          </button>
        ))}
      </div>

      {/* Livre double page */}
      <div style={{ flex: 1, minHeight: 0, display: 'flex', position: 'relative', alignItems: 'stretch' }}>

        {/* Reliure centrale */}
        <div style={{
          position: 'absolute', top: 0, bottom: 0, left: '50%',
          transform: 'translateX(-50%)', width: 18, zIndex: 10, pointerEvents: 'none',
          background: `linear-gradient(to right,
            rgba(26,58,42,0.22) 0%,
            rgba(26,58,42,0.08) 35%,
            rgba(184,148,63,0.10) 50%,
            rgba(26,58,42,0.08) 65%,
            rgba(26,58,42,0.22) 100%)`,
        }} />

        {/* Page gauche */}
        <div
          key={`left-${pairIdx}-${flipKey}`}
          style={{
            flex: 1, minWidth: 0, minHeight: 0,
            border: `1px solid ${C.border}`, borderRight: 'none',
            borderRadius: '14px 0 0 14px', overflow: 'hidden',
            boxShadow: `-2px 0 20px rgba(26,58,42,0.07)`,
            transformOrigin: 'right center',
            animation: flipSide === 'left' ? 'flipLeftOut 0.5s ease forwards' : 'none',
          }}>
          {leftPage && <PageContent categorie={leftPage.categorie} produits={leftPage.produits} onAdd={onAdd} isMobile={false} />}
        </div>

        {/* Page droite — tourne vers la gauche pour "next" */}
        <div
          key={`right-${pairIdx}-${flipKey}`}
          style={{
            flex: 1, minWidth: 0, minHeight: 0,
            border: `1px solid ${C.border}`, borderLeft: 'none',
            borderRadius: '0 14px 14px 0', overflow: 'hidden',
            boxShadow: `2px 0 20px rgba(26,58,42,0.07)`,
            transformOrigin: 'left center',
            animation: flipSide === 'right' ? 'flipRightOut 0.5s ease forwards' : 'none',
          }}>
          {rightPage ? (
            <PageContent categorie={rightPage.categorie} produits={rightPage.produits} onAdd={onAdd} isMobile={false} />
          ) : (
            <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: C.cream, flexDirection: 'column', gap: 12 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg, ${C.gold}, ${C.goldLight})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32 }}>🌿</div>
              <p style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: 17, color: C.darkSoft, fontStyle: 'italic' }}>Fin de la carte</p>
            </div>
          )}
        </div>

        <style>{`
          @keyframes flipRightOut {
            0%   { transform: perspective(1600px) rotateY(0deg); }
            45%  { transform: perspective(1600px) rotateY(-90deg); filter: brightness(0.85); }
            100% { transform: perspective(1600px) rotateY(-180deg); opacity: 0; }
          }
          @keyframes flipLeftOut {
            0%   { transform: perspective(1600px) rotateY(0deg); }
            45%  { transform: perspective(1600px) rotateY(90deg); filter: brightness(0.85); }
            100% { transform: perspective(1600px) rotateY(180deg); opacity: 0; }
          }
        `}</style>
      </div>

      {/* Nav desktop */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0 0', flexShrink: 0 }}>
        <button onClick={() => goPair('prev')} disabled={pairIdx === 0 || pairAnimating} style={{
          padding: '10px 24px', borderRadius: 10, border: `1px solid ${C.border}`,
          background: 'transparent', cursor: pairIdx === 0 ? 'not-allowed' : 'pointer',
          color: pairIdx === 0 ? 'rgba(26,26,20,0.20)' : C.primary,
          fontSize: 14, fontWeight: 600, transition: 'all 0.2s',
        }}>← Précédent</button>
        <span style={{ fontSize: 12, color: C.darkSoft }}>{pairIdx + 1} / {totalPairs}</span>
        <button onClick={() => goPair('next')} disabled={pairIdx >= totalPairs - 1 || pairAnimating} style={{
          padding: '10px 24px', borderRadius: 10, border: 'none',
          cursor: pairIdx >= totalPairs - 1 ? 'not-allowed' : 'pointer',
          background: pairIdx >= totalPairs - 1 ? 'rgba(26,26,20,0.08)' : `linear-gradient(135deg, ${C.primary}, ${C.primaryMid})`,
          color: pairIdx >= totalPairs - 1 ? 'rgba(26,26,20,0.25)' : C.beige,
          fontSize: 14, fontWeight: 700, transition: 'all 0.2s',
        }}>Suivant →</button>
      </div>
    </div>
  );
}
