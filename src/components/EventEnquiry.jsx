import React from 'react';
import './EventEnquiry.css';
import { API_BASE } from '../lib/apiBase';

const EVENT_TYPES = ['Private Lounge', 'Rooftop Table', 'Business Gathering', 'Celebration', 'Other'];

export default function EventEnquiry() {
  const [busy, setBusy] = React.useState(false);
  const [result, setResult] = React.useState('');
  const [error, setError] = React.useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError(''); setResult('');
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const response = await fetch(`${API_BASE}/api/events`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      const responseText = await response.text();
      let body;
      try {
        body = responseText ? JSON.parse(responseText) : null;
      } catch {
        body = null;
      }
      if (!body || typeof body !== 'object') {
        throw new Error(response.ok
          ? 'The event service returned an unexpected response. Please call Beanery so we can help with your enquiry.'
          : `The event service is temporarily unavailable (HTTP ${response.status}). Please call Beanery so we can help with your enquiry.`);
      }
      if (!response.ok) throw new Error(body.error || 'Please try again.');
      form.reset();
      setResult('Your event note is with our team. We’ll be in touch to plan the details.');
    } catch (err) {
      setError(err.message || 'We could not send that just now. Please try again.');
    } finally { setBusy(false); }
  }

  return (
    <section className="event-enquiry" id="event-enquiry">
      <div className="event-enquiry__intro">
        <p className="hospitality-label">A thoughtful place to gather</p>
        <h2>Tell us what<br /><em>you’re planning.</em></h2>
        <p>Share a few details and our team will help shape the right Beanery setting for your occasion.</p>
        <div className="event-enquiry__promise">Private Lounge <span>·</span> Rooftop Table <span>·</span> Business Gatherings</div>
      </div>
      <form className="event-form" onSubmit={submit}>
        <div className="event-form__row">
          <label>Your name<input name="name" autoComplete="name" maxLength="100" required placeholder="How should we address you?" /></label>
          <label>Phone number<input name="phone" type="tel" autoComplete="tel" maxLength="40" required placeholder="A number we can reach you on" /></label>
        </div>
        <div className="event-form__row">
          <label>Email <span>(optional)</span><input name="email" type="email" autoComplete="email" maxLength="160" placeholder="you@example.com" /></label>
          <label>What are you gathering for?<select name="eventType" required defaultValue=""><option value="" disabled>Select a setting</option>{EVENT_TYPES.map((type) => <option key={type}>{type}</option>)}</select></label>
        </div>
        <div className="event-form__row">
          <label>Preferred date <span>(optional)</span><input name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
          <label>Preferred time <span>(optional)</span><input name="preferredTime" maxLength="60" placeholder="Morning, afternoon, or a time" /></label>
        </div>
        <label>Anything we should know?<textarea name="message" required maxLength="2000" rows="4" placeholder="A little about the occasion, the atmosphere you have in mind, or any special requests…" /></label>
        <div className="event-form__submit"><p>Sending this asks our team to contact you about your event.</p><button disabled={busy}>{busy ? 'Sending…' : 'Send event enquiry'} <span aria-hidden="true">→</span></button></div>
        {result ? <p className="event-form__feedback" role="status">{result}</p> : null}
        {error ? <p className="event-form__feedback event-form__feedback--error" role="alert">{error}</p> : null}
      </form>
    </section>
  );
}
