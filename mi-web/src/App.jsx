import React, { useState } from 'react';
import './App.css';
import { baseDeDatos, CATEGORY_LABELS, CATEGORY_ICONS, SPEC_KEYS } from './datos';

function StarRating({ count }) {
  return (
    <div style={{ display: 'flex', gap: 2, marginTop: 4 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="12" height="12" viewBox="0 0 24 24" fill={i <= count ? '#f59e0b' : '#374151'}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}

export default function App() {
  const [selected, setSelected] = useState({
    caja: null, placaBase: null, procesador: null, ram: null,
    grafica: null, fuente: null, almacenamiento: null,
  });
  const [activeCategory, setActiveCategory] = useState(null);
  const [hoveredPart, setHoveredPart] = useState(null);

  const total = Object.values(selected).reduce((s, c) => s + (c?.precio || 0), 0);
  const completedCount = Object.values(selected).filter(Boolean).length;

  // Colores dinámicos de la caja seleccionada
  const accent  = selected.caja?.accentColor  || '#38bdf8';
  const accent2 = selected.caja?.accentColor2 || '#818cf8';
  const caseBody = selected.caja?.bodyColor   || '#1e2d42';

  const handlePick   = (cat)       => setActiveCategory(activeCategory === cat ? null : cat);
  const handleSelect = (cat, item) => { setSelected(p => ({ ...p, [cat]: item })); setActiveCategory(null); };
  const isInstalled  = (cat)       => !!selected[cat];

  // Para el tooltip — mapa inverso de hoveredPart
  const hoveredCat = hoveredPart?.replace('-nvme', '') || null;

  return (
    <div className="app-root">

      {/* ── HEADER ── */}
      <header className="app-header">
        <div className="logo">
          <span className="logo-icon" style={{ color: accent, filter: `drop-shadow(0 0 8px ${accent})` }}>◈</span>
          <div>
            <div className="logo-name">CompuPartesPC</div>
            <div className="logo-sub">Ensamblador Profesional</div>
          </div>
        </div>
        <div className="progress-wrap">
          <div className="progress-bar">
            <div className="progress-fill" style={{
              width: `${(completedCount / 7) * 100}%`,
              background: `linear-gradient(90deg, ${accent}, ${accent2})`,
            }} />
          </div>
          <span className="progress-label">{completedCount} / 7 componentes</span>
        </div>
        <div className="total-box">
          <span className="total-label">TOTAL BUILD</span>
          <span className="total-value" style={{ color: accent, textShadow: `0 0 20px ${accent}66` }}>
            {total.toLocaleString('es-ES')} €
          </span>
        </div>
      </header>

      {/* ── WORKSPACE ── */}
      <div className="workspace">

        {/* ── PC 3D ── */}
        <div className="pc-container">
          <div className="scene-wrapper">
            <div className="pc-scene">
              <div className="pc-case">

                {/* CHASIS — clickable para elegir caja */}
                <div
                  className={`case-frame ${isInstalled('caja') ? 'case-installed' : ''} ${hoveredPart === 'caja' ? 'hovered' : ''}`}
                  style={{
                    background: `linear-gradient(160deg, ${caseBody} 0%, #16202e 60%, #111827 100%)`,
                    borderColor: isInstalled('caja') ? accent + '55' : '#2e4060',
                    '--accent': accent,
                    '--accent2': accent2,
                  }}
                  onClick={() => handlePick('caja')}
                  onMouseEnter={() => setHoveredPart('caja')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <div className="case-name-tag" style={{ color: isInstalled('caja') ? accent + 'cc' : '#c8dff0' }}>
                    {isInstalled('caja') ? selected.caja.nombre : '+ ELEGIR CAJA'}
                  </div>
                </div>

                {/* VENTILADORES DE CAJA (top-right) */}
                <div className="case-fans">
                  {[0, 1].map(i => (
                    <div key={i} className="case-fan" style={{ borderColor: accent + '44' }}>
                      <div className="fan-blade" style={{
                        animationDuration: isInstalled('fuente') ? '1.1s' : '4s',
                        animationDelay: `${-i * 0.4}s`,
                      }} />
                    </div>
                  ))}
                </div>

                {/* ── PLACA BASE ── */}
                <div
                  className={`mb-tray ${isInstalled('placaBase') ? 'installed' : ''} ${hoveredPart === 'placaBase' ? 'hovered' : ''}`}
                  style={{ '--accent': accent }}
                  onClick={() => handlePick('placaBase')}
                  onMouseEnter={() => setHoveredPart('placaBase')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <span className="part-label">
                    {isInstalled('placaBase')
                      ? selected.placaBase.nombre.split(' ').slice(0, 3).join(' ')
                      : '+ PLACA BASE'}
                  </span>
                  {isInstalled('placaBase') && <div className="installed-badge" style={{ borderColor: accent, color: accent }}>✓</div>}

                  {/* CPU */}
                  <div
                    className={`cpu-block ${isInstalled('procesador') ? 'installed' : ''} ${hoveredPart === 'procesador' ? 'hovered' : ''}`}
                    style={{ '--accent': accent }}
                    onClick={e => { e.stopPropagation(); handlePick('procesador'); }}
                    onMouseEnter={e => { e.stopPropagation(); setHoveredPart('procesador'); }}
                    onMouseLeave={() => setHoveredPart(null)}
                  >
                    <div className="cpu-lid">
                      {isInstalled('procesador')
                        ? <div className="cpu-logo">{selected.procesador.nombre.includes('Intel') ? 'intel' : 'AMD'}</div>
                        : <span className="part-label-sm">+ CPU</span>}
                    </div>
                    {isInstalled('procesador') && <div className="installed-badge sm" style={{ borderColor: accent, color: accent }}>✓</div>}
                  </div>

                  {/* RAM */}
                  <div
                    className={`ram-block ${isInstalled('ram') ? 'installed' : ''} ${hoveredPart === 'ram' ? 'hovered' : ''}`}
                    style={{ '--accent': accent, '--accent2': accent2 }}
                    onClick={e => { e.stopPropagation(); handlePick('ram'); }}
                    onMouseEnter={e => { e.stopPropagation(); setHoveredPart('ram'); }}
                    onMouseLeave={() => setHoveredPart(null)}
                  >
                    <div className="ram-stick" />
                    <div className="ram-stick" />
                    <div className="ram-stick dim" />
                    <div className="ram-stick dim" />
                    {!isInstalled('ram') && <span className="part-label-sm ram-label">+ RAM</span>}
                    {isInstalled('ram') && <div className="installed-badge sm" style={{ borderColor: accent, color: accent }}>✓</div>}
                  </div>

                  {/* GPU */}
                  <div
                    className={`gpu-block ${isInstalled('grafica') ? 'installed' : ''} ${hoveredPart === 'grafica' ? 'hovered' : ''}`}
                    style={{ '--accent': accent, borderTopColor: accent }}
                    onClick={e => { e.stopPropagation(); handlePick('grafica'); }}
                    onMouseEnter={e => { e.stopPropagation(); setHoveredPart('grafica'); }}
                    onMouseLeave={() => setHoveredPart(null)}
                  >
                    {isInstalled('grafica') ? (
                      <>
                        <div className="gpu-fans">
                          <div className="gpu-fan" />
                          <div className="gpu-fan" />
                          <div className="gpu-fan" />
                        </div>
                        <span className="part-label-sm gpu-name">
                          {selected.grafica.nombre.includes('NVIDIA') ? 'NVIDIA' : 'AMD'}
                        </span>
                      </>
                    ) : (
                      <span className="part-label-sm">+ GPU</span>
                    )}
                    {isInstalled('grafica') && <div className="installed-badge sm" style={{ borderColor: accent, color: accent }}>✓</div>}
                  </div>

                  {/* NVMe slot en la placa */}
                  <div
                    className={`nvme-block ${isInstalled('almacenamiento') ? 'installed' : ''} ${hoveredPart === 'almacenamiento' ? 'hovered' : ''}`}
                    style={{ '--accent': accent }}
                    onClick={e => { e.stopPropagation(); handlePick('almacenamiento'); }}
                    onMouseEnter={e => { e.stopPropagation(); setHoveredPart('almacenamiento'); }}
                    onMouseLeave={() => setHoveredPart(null)}
                  >
                    {!isInstalled('almacenamiento') && <span className="part-label-sm">+ M.2</span>}
                    {isInstalled('almacenamiento') && <div className="installed-badge sm" style={{ borderColor: accent, color: accent }}>✓</div>}
                  </div>
                </div>

                {/* ── PSU — abajo a la IZQUIERDA ── */}
                <div
                  className={`psu-block ${isInstalled('fuente') ? 'installed' : ''} ${hoveredPart === 'fuente' ? 'hovered' : ''}`}
                  style={{ '--accent': accent }}
                  onClick={() => handlePick('fuente')}
                  onMouseEnter={() => setHoveredPart('fuente')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <div className="psu-fan-hole" style={isInstalled('fuente') ? { borderColor: accent + '88' } : {}} />
                  {isInstalled('fuente')
                    ? <span className="part-label-sm">{selected.fuente.potencia}</span>
                    : <span className="part-label-sm">+ PSU</span>}
                  {isInstalled('fuente') && <div className="installed-badge sm" style={{ borderColor: accent, color: accent }}>✓</div>}
                </div>

                {/* ── BAHÍA HDD/SSD — abajo al CENTRO ── */}
                <div
                  className={`hdd-bay ${isInstalled('almacenamiento') ? 'installed' : ''} ${hoveredPart === 'hdd-bay' ? 'hovered' : ''}`}
                  style={{ '--accent': accent }}
                  onClick={() => handlePick('almacenamiento')}
                  onMouseEnter={() => setHoveredPart('hdd-bay')}
                  onMouseLeave={() => setHoveredPart(null)}
                >
                  <div className="bay-slot">
                    {isInstalled('almacenamiento') ? (
                      <div className="bay-drive" style={{ borderColor: accent + '66', background: `linear-gradient(90deg, #162030, #0a1828, #162030)` }}>
                        <span className="bay-label" style={{ color: accent }}>
                          {selected.almacenamiento.nombre.includes('Barracuda') ? 'HDD' : 'SSD'}
                        </span>
                        <div className="bay-activity" style={{ background: accent }} />
                      </div>
                    ) : (
                      <div className="bay-empty">
                        <span className="part-label-sm">+ HDD/SSD</span>
                      </div>
                    )}
                  </div>
                  <div className="bay-slot muted">
                    <div className="bay-empty-muted" />
                  </div>
                  {isInstalled('almacenamiento') && (
                    <div className="installed-badge sm" style={{ borderColor: accent, color: accent }}>✓</div>
                  )}
                </div>

              </div>
            </div>
          </div>

          {/* Tooltip */}
          {hoveredPart && (
            <div className="tooltip" style={{ borderColor: accent + '55' }}>
              <span className="tooltip-icon" style={{ color: accent }}>
                {CATEGORY_ICONS[hoveredCat] || '⊡'}
              </span>
              <span className="tooltip-text">
                {hoveredCat && isInstalled(hoveredCat)
                  ? selected[hoveredCat]?.nombre
                  : `Añadir ${CATEGORY_LABELS[hoveredCat] || 'componente'}`}
              </span>
            </div>
          )}
        </div>

        {/* ── SIDEBAR ── */}
        <div className="sidebar">
          <div className="component-grid">
            {Object.keys(baseDeDatos).map((cat) => (
              <button
                key={cat}
                className={`slot-btn ${activeCategory === cat ? 'active' : ''} ${isInstalled(cat) ? 'done' : ''}`}
                style={activeCategory === cat
                  ? { borderColor: accent, boxShadow: `0 0 0 1px ${accent}33, inset 0 0 20px ${accent}08`, background: '#0e2035' }
                  : {}}
                onClick={() => handlePick(cat)}
              >
                <span className="slot-icon" style={{ color: isInstalled(cat) ? accent : '#4a6a85' }}>
                  {CATEGORY_ICONS[cat]}
                </span>
                <div className="slot-info">
                  <div className="slot-cat">{CATEGORY_LABELS[cat]}</div>
                  <div className="slot-name">{isInstalled(cat) ? selected[cat].nombre : 'Sin seleccionar'}</div>
                </div>
                {isInstalled(cat)
                  ? <span className="slot-price" style={{ color: accent }}>{selected[cat].precio} €</span>
                  : <span className="slot-add">＋</span>}
              </button>
            ))}
          </div>

          {/* ── PANEL DE SELECCIÓN ── */}
          {activeCategory && (
            <div className="sel-panel panel-slide" style={{ borderColor: accent + '44' }}>
              <div className="panel-header" style={{ borderBottomColor: accent + '22' }}>
                <span className="panel-icon" style={{ color: accent }}>{CATEGORY_ICONS[activeCategory]}</span>
                <span className="panel-title">Elegir {CATEGORY_LABELS[activeCategory]}</span>
                <button className="close-btn" onClick={() => setActiveCategory(null)}>✕</button>
              </div>

              {/* ── VISTA ESPECIAL PARA CAJAS ── */}
              {activeCategory === 'caja' && (
                <div className="case-preview-grid">
                  {baseDeDatos.caja.map((item) => {
                    const chosen = selected.caja?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`case-card ${chosen ? 'chosen' : ''}`}
                        style={{
                          borderColor: chosen ? item.accentColor : '#1e2d40',
                          boxShadow: chosen ? `0 0 14px ${item.accentColor}44` : 'none',
                        }}
                        onClick={() => handleSelect('caja', item)}
                      >
                        {/* Mini preview visual */}
                        <div className="case-mini-preview" style={{
                          background: item.bodyColor,
                          borderTop: `3px solid ${item.accentColor}`,
                        }}>
                          <div className="mini-stripe" style={{
                            background: `linear-gradient(90deg, ${item.accentColor}, ${item.accentColor2})`,
                          }} />
                          <div className="mini-fans-row">
                            {[0, 1].map(i => (
                              <div key={i} className="mini-fan">
                                <div className="mini-fan-blade" style={{
                                  background: `repeating-conic-gradient(${item.accentColor}33 0deg, ${item.accentColor}33 45deg, transparent 45deg, transparent 90deg)`,
                                  animationDelay: `${-i * 0.5}s`,
                                }} />
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="case-card-info">
                          <div className="option-name">{item.nombre}</div>
                          <div className="case-meta">
                            <span className="spec-tag">{item.formato}</span>
                            <span className="spec-tag">{item.material}</span>
                            <span className="spec-tag" style={{ color: item.accentColor, borderColor: item.accentColor + '44' }}>
                              {item.colorNombre}
                            </span>
                          </div>
                          <div className="option-mid" style={{ marginTop: 8 }}>
                            <span className="option-price" style={{ color: item.accentColor }}>{item.precio} €</span>
                            <StarRating count={item.valoracion} />
                          </div>
                        </div>
                        {chosen && (
                          <span className="chosen-badge" style={{ color: item.accentColor, borderColor: item.accentColor }}>
                            ✓ ELEGIDA
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* ── OPCIONES NORMALES ── */}
              {activeCategory !== 'caja' && (
                <div className="option-list">
                  {baseDeDatos[activeCategory].map((item) => {
                    const chosen = selected[activeCategory]?.id === item.id;
                    return (
                      <div
                        key={item.id}
                        className={`option-card ${chosen ? 'chosen' : ''}`}
                        style={chosen ? { borderColor: accent, background: '#0a1e30', boxShadow: `0 0 0 1px ${accent}22` } : {}}
                        onClick={() => handleSelect(activeCategory, item)}
                      >
                        <div className="option-top">
                          <div className="option-name">{item.nombre}</div>
                          {chosen && <span className="chosen-badge" style={{ color: accent, borderColor: accent }}>✓ ELEGIDO</span>}
                        </div>
                        <div className="option-mid">
                          <span className="option-price" style={{ color: accent }}>{item.precio.toLocaleString('es-ES')} €</span>
                          <StarRating count={item.valoracion} />
                        </div>
                        <div className="spec-row">
                          {SPEC_KEYS[activeCategory].map(k => item[k] && (
                            <span key={k} className="spec-tag">{item[k]}</span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}