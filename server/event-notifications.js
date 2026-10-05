import webPush from 'web-push';
import { listPushSubscriptions, removePushSubscription } from './store.js';

export const EVENT_NOTIFICATION_EMAIL = process.env.EVENT_NOTIFICATION_EMAIL || 'Beaneryeatery@gmail.com';

function vapidSettings() {
  const { VAPID_PUBLIC_KEY: publicKey, VAPID_PRIVATE_KEY: privateKey } = process.env;
  const subject = process.env.VAPID_SUBJECT || `mailto:${EVENT_NOTIFICATION_EMAIL}`;
  return publicKey && privateKey ? { publicKey, privateKey, subject } : null;
}

export function eventNotificationConfig() {
  const vapid = vapidSettings();
  return {
    email: { enabled: Boolean(process.env.RESEND_API_KEY && process.env.EVENT_NOTIFICATION_FROM), to: EVENT_NOTIFICATION_EMAIL },
    push: { enabled: Boolean(vapid), publicKey: vapid?.publicKey || '' },
  };
}

function escapeHtml(value) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  })[char]);
}

function eventEmailText(entry) {
  return [
    'A new Beanery event enquiry was sent.',
    '',
    `Name: ${entry.name}`,
    `Phone: ${entry.phone}`,
    `Email: ${entry.email || 'Not provided'}`,
    `Event: ${entry.eventType}`,
    `Preferred date: ${entry.preferredDate || 'Flexible'}`,
    `Preferred time: ${entry.preferredTime || 'Flexible'}`,
    '',
    'Message:',
    entry.message,
    '',
    'Open the Beanery admin to review this enquiry.',
    'https://beaneryeatery.com/admin',
  ].join('\n');
}

async function sendEventEmail(entry) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EVENT_NOTIFICATION_FROM;
  if (!apiKey || !from) return;

  const detail = (label, value) => `<tr><th align="left" style="padding:6px 16px 6px 0">${label}</th><td>${escapeHtml(value || 'Not provided')}</td></tr>`;
  const html = `<div style="font-family:Arial,sans-serif;color:#35261f;max-width:640px"><p style="color:#a35730;font-size:12px;letter-spacing:2px;text-transform:uppercase">Beanery · Events</p><h1 style="font-weight:500">A new event enquiry was sent</h1><table>${detail('Name', entry.name)}${detail('Phone', entry.phone)}${detail('Email', entry.email)}${detail('Event', entry.eventType)}${detail('Preferred date', entry.preferredDate || 'Flexible')}${detail('Preferred time', entry.preferredTime || 'Flexible')}</table><h2 style="font-size:16px">Message</h2><p style="white-space:pre-wrap;line-height:1.6">${escapeHtml(entry.message)}</p><p><a href="https://beaneryeatery.com/admin">Open Beanery admin</a></p></div>`;
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': `beanery-event-${entry.id}`,
    },
    body: JSON.stringify({
      from,
      to: [EVENT_NOTIFICATION_EMAIL],
      subject: `New event enquiry · ${entry.eventType}`,
      text: eventEmailText(entry),
      html,
    }),
  });
  if (!response.ok) {
    console.error(`Event email notification failed (Resend HTTP ${response.status}).`);
  }
}

async function sendDevicePush(entry) {
  const settings = vapidSettings();
  if (!settings) return;

  webPush.setVapidDetails(settings.subject, settings.publicKey, settings.privateKey);
  const subscriptions = await listPushSubscriptions();
  const payload = JSON.stringify({
    title: 'New Beanery event enquiry',
    body: 'A new event enquiry is waiting in the Beanery admin.',
    url: '/admin',
  });

  await Promise.all(subscriptions.map(async (subscription) => {
    try {
      await webPush.sendNotification(subscription, payload, { TTL: 60 * 60, urgency: 'high', timeout: 5000 });
    } catch (error) {
      if (error.statusCode === 404 || error.statusCode === 410) {
        await removePushSubscription(subscription.endpoint);
        return;
      }
      console.error(`Device notification failed (push HTTP ${Number(error.statusCode) || 0}).`);
    }
  }));
}

export async function notifyNewEvent(entry) {
  await Promise.all([
    sendEventEmail(entry).catch(() => console.error('Event email notification could not be delivered.')),
    sendDevicePush(entry).catch(() => console.error('Device notifications could not be delivered.')),
  ]);
}
