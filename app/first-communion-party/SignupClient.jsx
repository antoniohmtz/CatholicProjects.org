'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function SignupClient() {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function load() {
    const { data, error } = await supabase
      .from('fc_party_slots')
      .select('*')
      .order('item_key', { ascending: true })
      .order('slot_index', { ascending: true });
    if (error) setError(error.message);
    else setSlots(data || []);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  async function claim(id) {
    if (!name.trim()) { setError('Please enter your name.'); return; }
    setSubmitting(true);
    setError('');
    const { data, error } = await supabase
      .from('fc_party_slots')
      .update({ claimed_by: name.trim(), claimed_at: new Date().toISOString() })
      .eq('id', id)
      .is('claimed_by', null)
      .select();
    setSubmitting(false);
    if (error) { setError(error.message); return; }
    if (!data || data.length === 0) {
      setError('Sorry — someone just claimed that one. Try another.');
      await load();
      return;
    }
    setOpenId(null);
    setName('');
    await load();
  }

  // Group by item_key, preserving order
  const grouped = slots.reduce((acc, s) => {
    (acc[s.item_key] ||= { meta: s, rows: [] }).rows.push(s);
    return acc;
  }, {});
  const groups = Object.values(grouped);

  return (
    <main className="page">
      <div className="sheet">
        <header className="hero">
          <div className="eyebrow">Saint Joseph Catholic Church · Diocese of Fresno</div>
          <h1>Our First Communion Class Party</h1>
          <p className="sub">
            1st Year · 5th Grade · Mr. Hipolito's Class
          </p>
          <p className="lede">
            Pick one thing you'd like to bring. Write your name, tap <em>Claim</em>,
            and that slot is yours. Pizza is already taken care of.
          </p>
        </header>

        <section className="given">
          <div className="given-row">
            <span className="emoji">🍕</span>
            <div>
              <div className="given-label">Pizza</div>
              <div className="given-sub">Provided by Mr. Hipolito</div>
            </div>
            <span className="pill">Taken care of</span>
          </div>
        </section>

        <section className="list">
          {loading && <div className="loading">Loading…</div>}

          {!loading && groups.map(({ meta, rows }) => (
            <div className="group" key={meta.item_key}>
              <div className="group-head">
                <span className="emoji">{meta.item_emoji}</span>
                <div>
                  <div className="group-label">{meta.item_label}</div>
                  {meta.item_note && <div className="group-note">{meta.item_note}{rows.length > 1 ? ` · need ${rows.length}` : ''}</div>}
                </div>
              </div>
              <div className="slots">
                {rows.map((slot) => {
                  const taken = !!slot.claimed_by;
                  const open = openId === slot.id;
                  return (
                    <div key={slot.id} className={`slot ${taken ? 'taken' : ''}`}>
                      {taken ? (
                        <>
                          <span className="slot-state">✓ Claimed by</span>
                          <span className="slot-name">{slot.claimed_by}</span>
                        </>
                      ) : open ? (
                        <div className="claim-form">
                          <input
                            autoFocus
                            type="text"
                            placeholder="Your name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            maxLength={60}
                          />
                          <button
                            className="btn primary"
                            onClick={() => claim(slot.id)}
                            disabled={submitting}
                          >
                            {submitting ? '…' : 'Claim'}
                          </button>
                          <button
                            className="btn ghost"
                            onClick={() => { setOpenId(null); setError(''); }}
                            disabled={submitting}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="slot-state open">Available</span>
                          <button className="btn primary" onClick={() => { setOpenId(slot.id); setError(''); }}>
                            I'll bring this
                          </button>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {error && <div className="error">{error}</div>}
        </section>

        <footer className="foot">
          <p>Thank you for helping make this celebration special. 🕊️</p>
        </footer>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background:
            radial-gradient(1200px 600px at 50% -10%, #efe4cf 0%, transparent 60%),
            #f6efdd;
          padding: clamp(20px, 4vw, 56px) 16px;
          font-family: 'DM Sans', system-ui, sans-serif;
          color: #2a1d10;
        }
        .sheet {
          max-width: 720px;
          margin: 0 auto;
          background: #fbf6e8;
          border: 1px solid #e4d6b3;
          border-radius: 20px;
          box-shadow: 0 1px 0 #fff inset, 0 30px 60px -30px rgba(74, 44, 16, 0.35);
          overflow: hidden;
        }
        .hero {
          padding: clamp(28px, 5vw, 48px) clamp(24px, 5vw, 48px) clamp(20px, 3vw, 32px);
          text-align: center;
          border-bottom: 1px dashed #d9c79a;
        }
        .eyebrow {
          font-size: 11px;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #8a6a3a;
          margin-bottom: 14px;
        }
        h1 {
          font-family: 'Cormorant Garamond', Cormorant, serif;
          font-weight: 600;
          font-size: clamp(32px, 6vw, 48px);
          line-height: 1.05;
          margin: 0 0 10px;
          color: #3a2410;
          letter-spacing: -0.01em;
        }
        .sub {
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          font-size: 18px;
          color: #6b4a24;
          margin: 0 0 16px;
        }
        .lede {
          max-width: 44ch;
          margin: 0 auto;
          font-size: 15px;
          line-height: 1.55;
          color: #5a4228;
        }
        .lede em { font-style: italic; color: #3a2410; }

        .given {
          padding: 20px clamp(24px, 5vw, 48px);
          background: #f3e9cc;
          border-bottom: 1px solid #e4d6b3;
        }
        .given-row {
          display: flex;
          align-items: center;
          gap: 14px;
        }
        .given-row > div { flex: 1; }
        .given-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 22px;
          font-weight: 600;
          color: #3a2410;
        }
        .given-sub { font-size: 13px; color: #7a5a30; margin-top: 2px; }
        .pill {
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          background: #3a2410;
          color: #f6efdd;
          padding: 6px 10px;
          border-radius: 999px;
          font-weight: 500;
        }
        .emoji { font-size: 28px; line-height: 1; }

        .list {
          padding: clamp(20px, 3vw, 32px) clamp(24px, 5vw, 48px);
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        .group { }
        .group-head {
          display: flex;
          align-items: center;
          gap: 14px;
          margin-bottom: 12px;
        }
        .group-label {
          font-family: 'Cormorant Garamond', serif;
          font-size: 24px;
          font-weight: 600;
          color: #3a2410;
          line-height: 1.1;
        }
        .group-note {
          font-size: 12px;
          color: #8a6a3a;
          letter-spacing: 0.04em;
          margin-top: 2px;
        }
        .slots { display: flex; flex-direction: column; gap: 8px; }
        .slot {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 14px 16px;
          background: #fff;
          border: 1px solid #e4d6b3;
          border-radius: 12px;
          min-height: 56px;
        }
        .slot.taken {
          background: #ede3c7;
          border-style: dashed;
          opacity: 0.85;
        }
        .slot-state {
          font-size: 11px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #8a6a3a;
          flex: 0 0 auto;
        }
        .slot-state.open { color: #3a7a3a; }
        .slot-name {
          font-family: 'Cormorant Garamond', serif;
          font-size: 18px;
          font-weight: 600;
          color: #3a2410;
          flex: 1;
        }
        .slot .btn { margin-left: auto; }

        .claim-form {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          width: 100%;
          align-items: center;
        }
        .claim-form input {
          flex: 1;
          min-width: 140px;
          padding: 10px 12px;
          border: 1px solid #d9c79a;
          border-radius: 8px;
          background: #fff;
          font-family: inherit;
          font-size: 15px;
          color: #2a1d10;
        }
        .claim-form input:focus {
          outline: none;
          border-color: #3a2410;
          box-shadow: 0 0 0 3px rgba(58, 36, 16, 0.12);
        }

        .btn {
          font-family: inherit;
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.04em;
          padding: 9px 14px;
          border-radius: 8px;
          cursor: pointer;
          border: 1px solid transparent;
          transition: transform 0.06s ease, background 0.15s ease;
        }
        .btn:active { transform: translateY(1px); }
        .btn.primary { background: #3a2410; color: #f6efdd; }
        .btn.primary:hover { background: #4a2e14; }
        .btn.primary:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn.ghost { background: transparent; color: #6b4a24; border-color: #d9c79a; }
        .btn.ghost:hover { background: #f3e9cc; }

        .loading { text-align: center; color: #8a6a3a; padding: 24px; font-style: italic; }
        .error {
          margin-top: 4px;
          padding: 10px 14px;
          background: #fbeaea;
          border: 1px solid #e4bcbc;
          border-radius: 8px;
          color: #7a2a2a;
          font-size: 13px;
        }

        .foot {
          padding: 20px 24px 28px;
          text-align: center;
          border-top: 1px dashed #d9c79a;
          font-family: 'Cormorant Garamond', serif;
          font-style: italic;
          color: #7a5a30;
          font-size: 15px;
        }
        .foot p { margin: 0; }

        @media (max-width: 480px) {
          .slot { flex-wrap: wrap; }
          .slot .btn { margin-left: 0; width: 100%; }
          .pill { font-size: 10px; }
        }
      `}</style>
    </main>
  );
}
