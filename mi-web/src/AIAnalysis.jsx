import React, { useEffect, useRef } from 'react';
import './AIAnalysis.css';

// Parsea el texto del análisis en secciones estructuradas
function parseAnalysis(text) {
  const sections = [
    { key: 'resumen',       title: 'RESUMEN DEL BUILD',       emoji: '🏆', color: '#38bdf8' },
    { key: 'cuello',        title: 'CUELLO DE BOTELLA',        emoji: '⚠️', color: '#f59e0b' },
    { key: 'compatibilidad',title: 'COMPATIBILIDAD',           emoji: '✅', color: '#22c55e' },
    { key: 'mejoras',       title: 'ASPECTOS A MEJORAR',       emoji: '💡', color: '#a78bfa' },
    { key: 'precio',        title: 'RELACION CALIDAD/PRECIO',  emoji: '💰', color: '#fb923c' },
  ];

  const result = [];
  const lines  = text.split('\n');

  let currentSection = null;
  let buffer         = [];

  for (const line of lines) {
    const trimmed = line.trim();

    // Detectar cabecera de sección (### TITULO o variantes con emoji)
    const matched = sections.find(s =>
      trimmed.toUpperCase().includes(s.title) ||
      trimmed.toUpperCase().includes(s.title.replace('RELACION', 'RELACIÓN').toUpperCase()) ||
      trimmed.toUpperCase().includes(s.title.replace('BOTELLA', 'BOTELLA').toUpperCase())
    );

    if (matched) {
      if (currentSection) {
        result.push({ ...currentSection, content: buffer.join('\n').trim() });
      }
      currentSection = matched;
      buffer = [];
    } else if (currentSection) {
      buffer.push(line);
    }
  }

  // última sección
  if (currentSection) {
    result.push({ ...currentSection, content: buffer.join('\n').trim() });
  }

  // Si el parseo falló (no encontró secciones), devolver el texto completo
  if (result.length === 0) {
    result.push({ key: 'raw', title: 'Análisis Completo', emoji: '🤖', color: '#38bdf8', content: text.trim() });
  }

  return result;
}

// Renderiza el contenido de una sección (con soporte para listas con guiones/asteriscos)
function SectionContent({ content }) {
  const lines = content.split('\n').filter(l => l.trim());
  return (
    <div className="ai-section-content">
      {lines.map((line, i) => {
        const trimmed = line.trim();
        const isBullet = /^[-*•]\s/.test(trimmed) || /^\d+\.\s/.test(trimmed);
        const text = isBullet ? trimmed.replace(/^[-*•\d.]\s+/, '') : trimmed;
        // Negrita inline: **texto**
        const parts = text.split(/\*\*(.*?)\*\*/g);
        const rendered = parts.map((p, j) => j % 2 === 1 ? <strong key={j}>{p}</strong> : p);

        if (isBullet) return (
          <div key={i} className="ai-bullet">
            <span className="ai-bullet-dot">▸</span>
            <span>{rendered}</span>
          </div>
        );
        return <p key={i} className="ai-para">{rendered}</p>;
      })}
    </div>
  );
}

export default function AIAnalysis({ selected, accent, accent2, onClose }) {
  const [status, setStatus]   = React.useState('loading'); // loading | done | error
  const [sections, setSections] = React.useState([]);
  const [errorMsg, setErrorMsg] = React.useState('');
  const [duration, setDuration] = React.useState(null);
  const [dots, setDots]       = React.useState('');
  const overlayRef            = useRef(null);

  // Animación de puntos suspensivos mientras carga
  useEffect(() => {
    if (status !== 'loading') return;
    const iv = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 500);
    return () => clearInterval(iv);
  }, [status]);

  // Llamada al backend
  useEffect(() => {
    const fetchAnalysis = async () => {
      try {
        const res = await fetch('http://localhost:3000/api/analizar-build', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(selected),
        });

        if (!res.ok) {
          const errData = await res.json().catch(() => ({}));
          throw new Error(errData.error || `HTTP ${res.status}`);
        }

        const data = await res.json();
        const parsed = parseAnalysis(data.analysis || '');
        setSections(parsed);
        setDuration(data.duracion_ms);
        setStatus('done');
      } catch (err) {
        setErrorMsg(err.message || 'Error desconocido');
        setStatus('error');
      }
    };

    fetchAnalysis();
  }, []);

  // Cerrar al pulsar fuera del modal
  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  // Cerrar con Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="ai-overlay" ref={overlayRef} onClick={handleOverlayClick}>
      <div className="ai-modal" style={{ '--accent': accent, '--accent2': accent2 }}>

        {/* ── HEADER ── */}
        <div className="ai-modal-header">
          <div className="ai-header-left">
            <div className="ai-logo-pulse">
              <span className="ai-logo-icon">🤖</span>
            </div>
            <div>
              <div className="ai-modal-title">Análisis IA del Build</div>
              <div className="ai-modal-sub">
                {status === 'loading' && <>Consultando Qwen 2.5 · 7B{dots}</>}
                {status === 'done'    && <>Powered by Qwen 2.5 · 7B{duration ? ` · ${(duration / 1000).toFixed(1)}s` : ''}</>}
                {status === 'error'   && <>Error al conectar con el modelo</>}
              </div>
            </div>
          </div>
          <button className="ai-close-btn" onClick={onClose} title="Cerrar (Esc)">✕</button>
        </div>

        {/* ── LOADING ── */}
        {status === 'loading' && (
          <div className="ai-loading">
            <div className="ai-spinner-wrap">
              <div className="ai-spinner-ring ring1" />
              <div className="ai-spinner-ring ring2" />
              <div className="ai-spinner-ring ring3" />
              <div className="ai-spinner-core">
                <span>⬡</span>
              </div>
            </div>
            <p className="ai-loading-text">Analizando tu configuración{dots}</p>
            <p className="ai-loading-sub">El modelo está evaluando compatibilidad, rendimiento y optimizaciones</p>
            <div className="ai-loading-tags">
              {['Procesador', 'GPU', 'RAM', 'Placa Base', 'Fuente', 'Almacenamiento', 'Caja'].map((tag, i) => (
                <span key={tag} className="ai-loading-tag" style={{ animationDelay: `${i * 0.15}s` }}>{tag}</span>
              ))}
            </div>
          </div>
        )}

        {/* ── ERROR ── */}
        {status === 'error' && (
          <div className="ai-error">
            <div className="ai-error-icon">⚠</div>
            <h3>No se pudo conectar con Qwen</h3>
            <p className="ai-error-msg">{errorMsg}</p>
            <div className="ai-error-help">
              <p>Posibles causas:</p>
              <ul>
                <li>Ollama no está ejecutándose (<code>docker-compose up</code>)</li>
                <li>El modelo <code>qwen2.5:7b</code> aún se está descargando</li>
                <li>El backend Express no está activo en el puerto 3000</li>
              </ul>
            </div>
            <button className="ai-retry-btn" onClick={onClose}>Cerrar</button>
          </div>
        )}

        {/* ── RESULTADO ── */}
        {status === 'done' && (
          <div className="ai-results">
            {sections.map((section, idx) => (
              <div
                key={section.key}
                className="ai-section"
                style={{
                  '--section-color': section.color,
                  animationDelay: `${idx * 0.1}s`,
                }}
              >
                <div className="ai-section-header">
                  <span className="ai-section-emoji">{section.emoji}</span>
                  <h3 className="ai-section-title">{section.title}</h3>
                </div>
                <SectionContent content={section.content} />
              </div>
            ))}

            {/* Footer con componentes del build */}
            <div className="ai-build-summary">
              <div className="ai-build-summary-title">Build analizado</div>
              <div className="ai-build-chips">
                {Object.entries(selected).map(([cat, item]) => item && (
                  <span key={cat} className="ai-chip" style={{ borderColor: accent + '55' }}>
                    <span style={{ color: accent }}>
                      {{ caja:'⬜', procesador:'⬡', grafica:'▬', ram:'▮', placaBase:'⊞', fuente:'⚡', almacenamiento:'▤' }[cat]}
                    </span>
                    {' '}{item.nombre.split(' ').slice(0, 3).join(' ')}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
