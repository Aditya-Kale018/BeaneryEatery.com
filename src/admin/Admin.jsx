import React from 'react';
import { SLOTS } from '../assets/images';
import { DEFAULT_CONTENT } from '../../shared/content-defaults.js';
import { SLOT_GROUPS, SLOT_INFO } from '../../shared/image-slots.js';
import { api } from './api';
import './admin.css';

/* ------------------------------------------------------------ small parts -- */

function Field({ label, value, onChange, multiline = false, rows = 3, hint, ...rest }) {
  const Tag = multiline ? 'textarea' : 'input';
  return (
    <label className="field">
      <span className="field__label">{label}</span>
      <Tag
        className="field__input"
        value={value ?? ''}
        rows={multiline ? rows : undefined}
        onChange={(e) => onChange(e.target.value)}
        {...rest}
      />
      {hint ? <span className="field__hint">{hint}</span> : null}
    </label>
  );
}

/** Human label for a content key, so the editor reads as English. */
const LABELS = {
  eyebrowLeft: 'Eyebrow (left)',
  eyebrowRight: 'Eyebrow (right)',
  titleLine1: 'Heading line 1',
  titleLine2: 'Heading line 2',
  titleLine3: 'Heading line 3',
  intro: 'Intro paragraph',
  kicker: 'Kicker',
  legendNote: 'Legend note',
  address: 'Address',
  hours: 'Hours',
  contact: 'Contact',
  goodToKnow: 'Good to know',
  label: 'Nav label',
};

const MULTILINE = new Set(['intro', 'address', 'hours', 'contact', 'goodToKnow']);

/* ------------------------------------------------------------------ login -- */

/**
 * Loads Google Identity Services once and resolves when window.google is ready.
 * The script is only fetched when Google sign-in is actually configured.
 */
const GIS_SRC = 'https://accounts.google.com/gsi/client';
let gisPromise = null;

function loadGis() {
  if (gisPromise) return gisPromise;
  gisPromise = new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Could not reach Google to load sign-in.'));
    document.head.appendChild(script);
  });
  return gisPromise;
}

function GoogleSignIn({ clientId, onCredential, onError }) {
  const holder = React.useRef(null);

  React.useEffect(() => {
    let cancelled = false;

    loadGis()
      .then(() => {
        if (cancelled || !holder.current) return;
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => onCredential(response.credential),
        });
        window.google.accounts.id.renderButton(holder.current, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          width: 300,
        });
      })
      .catch(onError);

    return () => {
      cancelled = true;
    };
  }, [clientId, onCredential, onError]);

  return <div className="gsi" ref={holder} />;
}

function LoginView({ onSignedIn, hasAdmin, authMode, googleClientId, googleAllowlistEmpty }) {
  const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [showPassword, setShowPassword] = React.useState(false);
  const [error, setError] = React.useState('');
  const [busy, setBusy] = React.useState(false);

  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const user = await api.login(username, password);
      onSignedIn(user);
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  }

  const signInWithGoogle = React.useCallback(
    async (credential) => {
      setBusy(true);
      setError('');
      try {
        onSignedIn(await api.google(credential));
      } catch (err) {
        setError(err.message);
      } finally {
        setBusy(false);
      }
    },
    [onSignedIn],
  );

  const showError = React.useCallback((err) => setError(err.message), []);

  if (authMode === 'google') {
    return (
      <div className="login">
        <div className="login__card">
          <h1 className="login__title">Beanery</h1>
          <p className="login__sub">Content admin</p>

          {googleAllowlistEmpty ? (
            <p className="notice notice--warn">
              No admin emails are configured yet. Add <code>ADMIN_EMAILS</code> to the server's{' '}
              <code>.env</code> and restart it.
            </p>
          ) : (
            <p className="login__hint">Sign in with an approved Google account.</p>
          )}

          <GoogleSignIn
            clientId={googleClientId}
            onCredential={signInWithGoogle}
            onError={showError}
          />

          {busy ? <p className="login__hint">Signing in…</p> : null}
          {error ? <p className="notice notice--error">{error}</p> : null}
        </div>
      </div>
    );
  }

  return (
    <div className="login">
      <form className="login__card" onSubmit={submit}>
        <h1 className="login__title">Beanery</h1>
        <p className="login__sub">Content admin</p>

        {!hasAdmin ? (
          <p className="notice notice--warn">
            No admin account exists yet. In the project folder run{' '}
            <code>npm run admin:password</code> to create one.
          </p>
        ) : null}

        <Field label="Username" value={username} onChange={setUsername} autoComplete="username" />
        <div className="field">
          <span className="field__label">Password</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <input
              className="field__input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              style={{ paddingRight: '44px' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              title={showPassword ? 'Hide password' : 'Show password'}
              style={{
                position: 'absolute',
                right: '8px',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: '6px',
                color: 'var(--ink-soft)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {showPassword ? (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                  <line x1="1" y1="1" x2="23" y2="23" />
                </svg>
              ) : (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {error ? <p className="notice notice--error">{error}</p> : null}

        <button className="btn btn--primary" type="submit" disabled={busy || !hasAdmin}>
          {busy ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}

/* ------------------------------------------------------------- page editor -- */

function PagesTab({ content, update }) {
  const pageKeys = Object.keys(DEFAULT_CONTENT.pages);
  const [active, setActive] = React.useState(pageKeys[0]);
  const page = content.pages[active] ?? {};

  return (
    <div className="split">
      <nav className="split__rail">
        {pageKeys.map((key) => (
          <button
            key={key}
            className={`rail__item${key === active ? ' is-active' : ''}`}
            onClick={() => setActive(key)}
          >
            {DEFAULT_CONTENT.pages[key].label}
          </button>
        ))}
      </nav>

      <div className="split__body">
        <h2 className="section__title">{DEFAULT_CONTENT.pages[active].label} page</h2>
        {Object.keys(DEFAULT_CONTENT.pages[active]).map((key) => (
          <Field
            key={key}
            label={LABELS[key] ?? key}
            value={page[key]}
            multiline={MULTILINE.has(key)}
            rows={key === 'intro' ? 4 : 3}
            hint={MULTILINE.has(key) && key !== 'intro' ? 'One line per line break.' : undefined}
            onChange={(value) =>
              update((draft) => {
                draft.pages[active][key] = value;
              })
            }
          />
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------- menu editor -- */

function MenuTab({ content, update }) {
  const { menu } = content;

  const setGroup = (gi, patch) =>
    update((draft) => Object.assign(draft.menu.groups[gi], patch));

  const setItem = (gi, ii, patch) =>
    update((draft) => Object.assign(draft.menu.groups[gi].items[ii], patch));

  const move = (list, from, to) => {
    if (to < 0 || to >= list.length) return;
    const [moved] = list.splice(from, 1);
    list.splice(to, 0, moved);
  };

  return (
    <div className="stack">
      <section className="card">
        <h2 className="section__title">Menu page header</h2>
        {['eyebrowLeft', 'eyebrowRight', 'kicker', 'titleLine1', 'titleLine2', 'intro', 'legendNote'].map(
          (key) => (
            <Field
              key={key}
              label={LABELS[key] ?? key}
              value={menu[key]}
              multiline={MULTILINE.has(key)}
              onChange={(value) =>
                update((draft) => {
                  draft.menu[key] = value;
                })
              }
            />
          ),
        )}
      </section>

      {menu.groups.map((group, gi) => (
        <section className="card" key={gi}>
          <div className="card__head">
            <h2 className="section__title">{group.title || 'Untitled section'}</h2>
            <div className="btn-row">
              <button className="btn btn--ghost" onClick={() => update((d) => move(d.menu.groups, gi, gi - 1))} disabled={gi === 0}>↑</button>
              <button className="btn btn--ghost" onClick={() => update((d) => move(d.menu.groups, gi, gi + 1))} disabled={gi === menu.groups.length - 1}>↓</button>
              <button
                className="btn btn--danger"
                onClick={() => {
                  if (confirm(`Delete the section "${group.title}" and all its items?`)) {
                    update((d) => d.menu.groups.splice(gi, 1));
                  }
                }}
              >
                Delete section
              </button>
            </div>
          </div>

          <div className="grid-3">
            <Field label="Number" value={group.number} onChange={(v) => setGroup(gi, { number: v })} />
            <Field label="Title" value={group.title} onChange={(v) => setGroup(gi, { title: v })} />
            <Field label="Note" value={group.note} onChange={(v) => setGroup(gi, { note: v })} />
          </div>

          <table className="items">
            <thead>
              <tr>
                <th>Dish</th>
                <th>Description</th>
                <th className="items__price">Price</th>
                <th className="items__diet">Type</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {group.items.map((entry, ii) => (
                <tr key={ii}>
                  <td>
                    <input
                      className="field__input"
                      value={entry.name}
                      onChange={(e) => setItem(gi, ii, { name: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="field__input"
                      value={entry.description}
                      onChange={(e) => setItem(gi, ii, { description: e.target.value })}
                    />
                  </td>
                  <td>
                    <input
                      className="field__input"
                      value={entry.price}
                      placeholder="₹450"
                      onChange={(e) => setItem(gi, ii, { price: e.target.value })}
                    />
                  </td>
                  <td>
                    <select
                      className={`field__input diet diet--${entry.diet === 'V' ? 'veg' : 'nonveg'}`}
                      value={entry.diet}
                      onChange={(e) => setItem(gi, ii, { diet: e.target.value })}
                    >
                      <option value="V">Veg</option>
                      <option value="NV">Non-veg</option>
                    </select>
                  </td>
                  <td className="items__actions">
                    <button className="btn btn--ghost" onClick={() => update((d) => move(d.menu.groups[gi].items, ii, ii - 1))} disabled={ii === 0}>↑</button>
                    <button className="btn btn--ghost" onClick={() => update((d) => move(d.menu.groups[gi].items, ii, ii + 1))} disabled={ii === group.items.length - 1}>↓</button>
                    <button className="btn btn--danger" onClick={() => update((d) => d.menu.groups[gi].items.splice(ii, 1))}>×</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <button
            className="btn"
            onClick={() =>
              update((d) =>
                d.menu.groups[gi].items.push({ name: '', description: '', price: '', diet: 'V' }),
              )
            }
          >
            Add dish
          </button>
        </section>
      ))}

      <button
        className="btn btn--primary"
        onClick={() =>
          update((d) =>
            d.menu.groups.push({
              id: `section-${d.menu.groups.length + 1}`,
              number: String(d.menu.groups.length + 1).padStart(2, '0'),
              title: 'New section',
              note: '',
              items: [],
            }),
          )
        }
      >
        Add menu section
      </button>
    </div>
  );
}

/* ------------------------------------------------------------ image editor -- */

function SlotCard({ id, info, override, uploads, update, onUpload, busyId }) {
  const [picking, setPicking] = React.useState(false);
  const bundled = SLOTS[id];
  const current = override || bundled?.src;
  const busy = busyId === id;

  return (
    <article className={`slot${override ? ' is-replaced' : ''}`}>
      <div className="slot__figure">
        <img src={current} alt="" loading="lazy" />
        {override ? <span className="slot__badge">Replaced</span> : null}
      </div>

      <div className="slot__text">
        <h4 className="slot__label">{info.label}</h4>
        <p className="slot__note">{info.note}</p>
        <code className="slot__id">{id}</code>
      </div>

      <div className="slot__actions">
        <label className={`btn btn--primary${busy ? ' is-busy' : ''}`}>
          {busy ? 'Uploading…' : 'Upload new'}
          <input
            type="file"
            accept="image/webp,image/jpeg,image/png,image/avif"
            hidden
            disabled={busy}
            onChange={(e) => {
              const file = e.target.files?.[0];
              e.target.value = '';
              if (file) onUpload(id, file);
            }}
          />
        </label>

        {uploads.length > 0 ? (
          <button className="btn" onClick={() => setPicking((v) => !v)}>
            {picking ? 'Close' : 'Use existing'}
          </button>
        ) : null}

        {override ? (
          <button
            className="btn btn--danger"
            onClick={() => update((d) => { delete d.images[id]; })}
          >
            Reset
          </button>
        ) : null}
      </div>

      {picking ? (
        <select
          className="field__input slot__picker"
          value={override || ''}
          onChange={(e) => {
            const value = e.target.value;
            update((d) => {
              if (value) d.images[id] = value;
              else delete d.images[id];
            });
            setPicking(false);
          }}
        >
          <option value="">Original photo</option>
          {uploads.map((file) => (
            <option key={file.id} value={file.url}>{file.name}</option>
          ))}
        </select>
      ) : null}
    </article>
  );
}

function ImagesTab({ content, update, uploads, refreshUploads, onError }) {
  const [query, setQuery] = React.useState('');
  const [onlyReplaced, setOnlyReplaced] = React.useState(false);
  const [busyId, setBusyId] = React.useState('');

  /** Upload straight into a slot: one step instead of upload-then-assign. */
  const uploadInto = React.useCallback(
    async (slotId, file) => {
      setBusyId(slotId);
      try {
        const created = await api.uploadImage(file);
        await refreshUploads();
        update((d) => { d.images[slotId] = created.url; });
      } catch (err) {
        onError(err);
      } finally {
        setBusyId('');
      }
    },
    [refreshUploads, update, onError],
  );

  const needle = query.trim().toLowerCase();
  const matches = (id, info) =>
    (!onlyReplaced || content.images[id]) &&
    (!needle ||
      id.includes(needle) ||
      info.label.toLowerCase().includes(needle) ||
      info.note.toLowerCase().includes(needle) ||
      info.section.toLowerCase().includes(needle) ||
      info.page.toLowerCase().includes(needle));

  const replacedCount = Object.keys(content.images).length;

  return (
    <div className="stack">
      <section className="card">
        <div className="card__head">
          <h2 className="section__title">Photographs</h2>
          <input
            className="field__input field__input--search"
            placeholder="Search by name, page or description…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="checkline">
            <input
              type="checkbox"
              checked={onlyReplaced}
              onChange={(e) => setOnlyReplaced(e.target.checked)}
            />
            Only replaced ({replacedCount})
          </label>
        </div>
        <p className="field__hint">
          Every photograph on the site, grouped by the page it appears on. “Upload new” replaces one
          straight away; “Reset” puts the original back. Remember to press Save changes.
        </p>
      </section>

      {SLOT_GROUPS.map((group) => {
        const sections = group.sections
          .map((section) => ({
            ...section,
            slots: section.slots.filter(([id]) => matches(id, SLOT_INFO[id])),
          }))
          .filter((section) => section.slots.length > 0);

        if (sections.length === 0) return null;

        return (
          <section className="card" key={group.page}>
            <h2 className="section__title">
              {group.page}
              {group.unused ? <span className="tag tag--muted">not on the site</span> : null}
            </h2>
            {group.unused ? (
              <p className="field__hint">
                These photographs are in the project but nothing currently renders them, so
                replacing one will not change the live site.
              </p>
            ) : null}

            {sections.map((section) => (
              <div className="slotgroup" key={section.name}>
                <h3 className="slotgroup__title">{section.name}</h3>
                <div className="slotgrid">
                  {section.slots.map(([id]) => (
                    <SlotCard
                      key={id}
                      id={id}
                      info={SLOT_INFO[id]}
                      override={content.images[id] || ''}
                      uploads={uploads}
                      update={update}
                      onUpload={uploadInto}
                      busyId={busyId}
                    />
                  ))}
                </div>
              </div>
            ))}
          </section>
        );
      })}

      <section className="card">
        <h2 className="section__title">Uploaded files</h2>
        {uploads.length === 0 ? (
          <p className="empty">Nothing uploaded yet.</p>
        ) : (
          <div className="uploads">
            {uploads.map((file) => {
              const usedBy = Object.entries(content.images)
                .filter(([, url]) => url === file.url)
                .map(([slotId]) => SLOT_INFO[slotId]?.label || slotId);
              return (
                <figure className="uploads__item" key={file.id}>
                  <img src={file.url} alt="" loading="lazy" />
                  <figcaption title={file.name}>{file.name}</figcaption>
                  <span className="uploads__used">
                    {usedBy.length ? `In use: ${usedBy.join(', ')}` : 'Not used'}
                  </span>
                  <button
                    className="btn btn--danger"
                    onClick={async () => {
                      const warn = usedBy.length
                        ? `"${file.name}" is used by ${usedBy.join(', ')}. Delete it and restore the original photo there?`
                        : `Delete "${file.name}"?`;
                      if (!confirm(warn)) return;
                      try {
                        await api.deleteUpload(file.id);
                        await refreshUploads();
                        update((d) => {
                          for (const [slot, url] of Object.entries(d.images)) {
                            if (url === file.url) delete d.images[slot];
                          }
                        });
                      } catch (err) {
                        onError(err);
                      }
                    }}
                  >
                    Delete
                  </button>
                </figure>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

/* ------------------------------------------------------------- links editor -- */

function LinksTab({ content, update }) {
  const fields = [
    ['reserveUrl', 'Reserve a table'],
    ['mapsUrl', 'Google Maps / Order'],
    ['liveMenuUrl', 'Live ordering menu'],
    ['instagramUrl', 'Instagram'],
  ];
  return (
    <section className="card">
      <h2 className="section__title">Links</h2>
      <p className="field__hint">Each must start with http:// or https://.</p>
      {fields.map(([key, label]) => (
        <Field
          key={key}
          label={label}
          value={content.site[key]}
          onChange={(value) =>
            update((draft) => {
              draft.site[key] = value;
            })
          }
        />
      ))}
    </section>
  );
}

/* ------------------------------------------------------------------- shell -- */

function EventsTab({ events, onRefresh }) {
  return (
    <div className="stack">
      <section className="card">
        <h2 className="section__title">Incoming event enquiries</h2>
        <p className="field__hint">New requests from the public Events page appear here, newest first.</p>
        <button className="btn" onClick={onRefresh}>Refresh enquiries</button>
      </section>
      {events.length === 0 ? <section className="card"><p className="empty">No event enquiries yet.</p></section> : events.map((event) => (
        <article className="card event-entry" key={event.id}>
          <div className="event-entry__heading">
            <div><span className="tag">New enquiry</span><h3>{event.name}</h3></div>
            <time>{new Date(event.submittedAt).toLocaleString()}</time>
          </div>
          <p className="event-entry__type">{event.eventType}</p>
          <div className="event-entry__contact">
            <a href={`tel:${event.phone}`}>{event.phone}</a>
            {event.email ? <a href={`mailto:${event.email}`}>{event.email}</a> : <span>No email provided</span>}
          </div>
          {(event.preferredDate || event.preferredTime) ? <p><strong>Preferred timing:</strong> {[event.preferredDate, event.preferredTime].filter(Boolean).join(' · ')}</p> : <p><strong>Preferred timing:</strong> Flexible / not specified</p>}
          <p className="event-entry__message">{event.message}</p>
        </article>
      ))}
    </div>
  );
}

const TABS = [
  ['events', 'Incoming events'],
  ['pages', 'Pages'],
  ['menu', 'Menu'],
  ['images', 'Images'],
  ['links', 'Links'],
];

function Editor({ user, onSignedOut }) {
  const [content, setContent] = React.useState(null);
  const [saved, setSaved] = React.useState(null);
  const [uploads, setUploads] = React.useState([]);
  const [events, setEvents] = React.useState([]);
  const [tab, setTab] = React.useState('pages');
  const [status, setStatus] = React.useState('');
  const [error, setError] = React.useState('');
  const [saving, setSaving] = React.useState(false);

  const refreshUploads = React.useCallback(
    () => api.listUploads().then(setUploads).catch(handleError),
    [],
  );

  function handleError(err) {
    if (err?.unauthorised) {
      onSignedOut();
      return;
    }
    setError(err.message);
  }

  const refreshEvents = React.useCallback(() => api.listEvents().then(setEvents).catch(handleError), []);

  React.useEffect(() => {
    api
      .getContent()
      .then((loaded) => {
        setContent(loaded);
        setSaved(JSON.stringify(loaded));
      })
      .catch(handleError);
    refreshUploads();
  }, [refreshUploads]);

  React.useEffect(() => {
    refreshEvents();
    const timer = window.setInterval(refreshEvents, 30000);
    return () => window.clearInterval(timer);
  }, [refreshEvents]);

  /** Apply a mutation to a draft copy - never mutate state in place. */
  const update = React.useCallback((mutate) => {
    setContent((current) => {
      const draft = structuredClone(current);
      mutate(draft);
      return draft;
    });
    setStatus('');
  }, []);

  const dirty = content !== null && JSON.stringify(content) !== saved;

  // Guard against closing the tab with edits that were never saved.
  React.useEffect(() => {
    if (!dirty) return undefined;
    const warn = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);

  async function save() {
    setSaving(true);
    setError('');
    try {
      // The server normalises what it stores, so adopt its response as truth
      // rather than assuming the local draft was accepted verbatim.
      const stored = await api.saveContent(content);
      setContent(stored);
      setSaved(JSON.stringify(stored));
      setStatus('Saved. The live site now shows these changes.');
    } catch (err) {
      handleError(err);
    } finally {
      setSaving(false);
    }
  }

  if (!content) {
    return <div className="loading">{error || 'Loading content…'}</div>;
  }

  const shared = { content, update };

  return (
    <div className="admin">
      <header className="topbar">
        <div className="topbar__brand">
          Beanery <span>admin</span>
        </div>
        <nav className="topbar__tabs">
          {TABS.map(([key, label]) => (
            <button
              key={key}
              className={`tab${tab === key ? ' is-active' : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <div className="topbar__actions">
          <a className="btn btn--ghost" href="/" target="_blank" rel="noreferrer">
            View site ↗
          </a>
          <span className="topbar__user">{user.username}</span>
          <button
            className="btn btn--ghost"
            onClick={async () => {
              if (dirty && !confirm('You have unsaved changes. Sign out anyway?')) return;
              await api.logout().catch(() => {});
              // Otherwise Google silently signs the same account straight back in.
              window.google?.accounts?.id?.disableAutoSelect?.();
              onSignedOut();
            }}
          >
            Sign out
          </button>
        </div>
      </header>

      {error ? <p className="notice notice--error">{error}</p> : null}
      {status ? <p className="notice notice--ok">{status}</p> : null}

      <main className="admin__body">
        {tab === 'events' ? <EventsTab events={events} onRefresh={refreshEvents} /> : null}
        {tab === 'pages' ? <PagesTab {...shared} /> : null}
        {tab === 'menu' ? <MenuTab {...shared} /> : null}
        {tab === 'images' ? (
          <ImagesTab
            {...shared}
            uploads={uploads}
            refreshUploads={refreshUploads}
            onError={handleError}
          />
        ) : null}
        {tab === 'links' ? <LinksTab {...shared} /> : null}
      </main>

      <footer className="savebar">
        <span className={`savebar__state${dirty ? ' is-dirty' : ''}`}>
          {dirty ? 'Unsaved changes' : 'All changes saved'}
        </span>
        <button className="btn btn--primary" onClick={save} disabled={!dirty || saving}>
          {saving ? 'Saving…' : 'Save changes'}
        </button>
      </footer>
    </div>
  );
}

export default function Admin() {
  const [session, setSession] = React.useState(null);

  React.useEffect(() => {
    api
      .me()
      .then(setSession)
      .catch(() => setSession({ user: null, hasAdmin: false, authMode: 'password' }));
  }, []);

  if (!session) return <div className="loading">Loading…</div>;

  if (!session.user) {
    return (
      <LoginView
        hasAdmin={session.hasAdmin}
        authMode={session.authMode}
        googleClientId={session.googleClientId}
        googleAllowlistEmpty={session.googleAllowlistEmpty}
        onSignedIn={(user) => setSession({ ...session, user })}
      />
    );
  }

  return (
    <Editor user={session.user} onSignedOut={() => setSession({ ...session, user: null })} />
  );
}
