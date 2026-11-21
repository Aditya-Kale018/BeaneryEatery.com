import React from 'react';
import './EventEnquiry.css';
import { API_BASE } from '../lib/apiBase';
import { FLOOR_MANAGER_PHONE, PUBLIC_EVENT_TYPES } from '../../shared/venue-config';

const FLOOR_MANAGER_DIGITS = FLOOR_MANAGER_PHONE.replace(/\D/g, '');

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
    <section className="event-enquiry" id="event-enquiry" aria-labelledby="event-enquiry-title">
      <div className="event-enquiry__inner">
        <div className="event-enquiry__intro">
          <p className="hospitality-label">A thoughtful place to gather</p>
          <h2 id="event-enquiry-title">Tell us what<br /><em>you’re planning.</em></h2>
          <p>We host events for 25 or more guests, with an unlimited buffet and beverages. Share a few details and our team will help shape the right Beanery setting.</p>
          <div className="event-enquiry__promise">Sunday Brunch <span>·</span> Corporate Events <span>·</span> Birthday Parties <span>·</span> Family Gatherings <span>·</span> Meeting Room</div>
          <div className="event-enquiry__manager">
            <p>For event pricing, call or WhatsApp our floor manager.</p>
            <div>
              <a href={`tel:${FLOOR_MANAGER_PHONE}`}>Call floor manager <span aria-hidden="true">↗</span></a>
              <a href={`https://wa.me/${FLOOR_MANAGER_DIGITS}`} target="_blank" rel="noopener noreferrer">WhatsApp <span aria-hidden="true">↗</span></a>
            </div>
            {/* TODO: Confirm the floor manager's direct number in shared/venue-config.js. */}
          </div>
        </div>
        <form className="event-form" onSubmit={submit}>
          <div className="event-form__row">
            <label htmlFor="event-name">Your name<input id="event-name" name="name" autoComplete="name" maxLength="100" required placeholder="How should we address you?" /></label>
            <label htmlFor="event-phone">Phone number<input id="event-phone" name="phone" type="tel" autoComplete="tel" inputMode="tel" pattern="[+0-9() .-]{7,40}" maxLength="40" required placeholder="A number we can reach you on" /></label>
          </div>
          <div className="event-form__row">
            <label htmlFor="event-email">Email <span>(optional)</span><input id="event-email" name="email" type="email" autoComplete="email" maxLength="160" placeholder="you@example.com" /></label>
            <label htmlFor="event-type">Event type<select id="event-type" name="eventType" required defaultValue=""><option value="" disabled>Select an event</option>{PUBLIC_EVENT_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}</select></label>
          </div>
          <div className="event-form__row event-form__row--timing">
            <label htmlFor="event-guests">Number of guests<input id="event-guests" name="guestCount" type="number" inputMode="numeric" min="25" max="500" step="1" required placeholder="Minimum 25" onInvalid={(event) => event.currentTarget.setCustomValidity(event.currentTarget.value && Number(event.currentTarget.value) < 25 ? 'Event bookings are available for groups of 25 or more guests.' : '')} onInput={(event) => event.currentTarget.setCustomValidity('')} /></label>
            <label htmlFor="event-date">Preferred date <span>(optional)</span><input id="event-date" name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
            <label htmlFor="event-time">Preferred time <span>(optional)</span><input id="event-time" name="preferredTime" maxLength="60" placeholder="Morning, afternoon, or a time" /></label>
          </div>
          <label htmlFor="event-notes">Additional notes <span>(optional)</span><textarea id="event-notes" name="message" maxLength="2000" rows="4" placeholder="Tell us about the occasion or any details we should know…" /></label>
          <label className="event-form__website" aria-hidden="true">Leave this field empty<input name="website" tabIndex="-1" autoComplete="off" /></label>
          <div className="event-form__submit"><p>For 25+ guests · Unlimited buffet and beverages</p><button disabled={busy}>{busy ? 'Sending…' : 'Send event enquiry'} <span aria-hidden="true">→</span></button></div>
          {result ? <p className="event-form__feedback" role="status">{result}</p> : null}
          {error ? <p className="event-form__feedback event-form__feedback--error" role="alert">{error}</p> : null}
        </form>
      </div>
    </section>
  );
}
