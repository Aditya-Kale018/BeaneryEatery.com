// Client-editable venue details used by the public website and event API.
export const MEETING_ROOM_COVER_CHARGE = 2500;

// TODO: Confirm this is the floor manager's preferred call/WhatsApp number.
// Keep it in international format (for example, +919XXXXXXXXX).
export const FLOOR_MANAGER_PHONE = '+919860934080';

export const PUBLIC_EVENT_TYPES = [
  'Birthday Party',
  'Corporate Event',
  'Family Gathering',
  'Other',
];

// Keep legacy event types accepted by the existing API to preserve old enquiries.
export const LEGACY_EVENT_TYPES = [
  'Open Gathering Space',
  'Rooftop Table',
  'Conference Room',
  'Sunday Brunch',
  'Birthday Parties',
  'Meetup',
  'Business Gathering',
  'Celebration',
];
