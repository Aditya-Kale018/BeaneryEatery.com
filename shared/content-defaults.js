import { MENU_GROUPS } from './menu-data.js';
/**
 * The site's editable content, in its shipped state.
 *
 * Both the server and the browser import this. The server seeds `content.json`
 * from it on first run; the browser uses it as the fallback so the site still
 * renders its real copy when the API is unreachable or not running at all.
 *
 * Anything the admin can change lives here. Anything not here stays in the JSX.
 * Keys are stable - renaming one orphans whatever an admin has already saved.
 */

// Menu prices ship empty: the real ones belong to the business, not to this
// file. An item with an empty price simply renders without one.
const item = (name, description, diet, price = '') => ({ name, description, diet, price });



export const DISTRICT_RESERVATION_URL =
  'https://www.district.in/dining/pune/beanery-cafe-senapati-bapat-road';

export const DEFAULT_CONTENT = {
  site: {
    reserveUrl: DISTRICT_RESERVATION_URL,
    mapsUrl: 'https://maps.app.goo.gl/VFNfybtJFMzzDoCM9?g_st=aw',
    instagramUrl: 'https://www.instagram.com/beanery.pune/',
    liveMenuUrl:
      'https://www.zomato.com/pune/beanery-cafe-senapati-bapat-road/order?disableOpenApp=1&fsc=1',
  },

  pages: {
    home: {
      label: 'Home',
      eyebrowLeft: 'Pune, India',
      eyebrowRight: 'Coffee · Kitchen · Gatherings',
      titleLine1: 'Made for coffee.',
      titleLine2: 'Built for the whole day.',
      intro:
        'From traceable coffees and precise brews to sourdough, pasta and dessert, Beanery is built around the things we want to return to, made with care, served without fuss.',
    },
    coffee: {
      label: 'Coffee',
      eyebrowLeft: 'Coffee',
      eyebrowRight: 'Origins · Espresso · Manual brews',
      titleLine1: 'Coffee, chosen',
      titleLine2: 'with purpose,',
      titleLine3: 'brewed with care.',
      intro:
        'Our coffee list moves with the season. We choose traceable lots for sweetness and character, then dial each one for the way it is served: espresso, filter or milk.',
    },
    story: {
      label: 'Our story',
      eyebrowLeft: 'Our story · Coffee, food & people',
      eyebrowRight: 'Senapati Bapat Road · Pune',
      titleLine1: 'From the espresso bar',
      titleLine2: 'to a room of our own.',
      intro:
        'From a barista at Barista Café to the founder of Beanery, Kamlesh Kale’s journey has unfolded one café chapter at a time. This is the story of how a career in coffee became a place for all of us to gather.',
    },
    experiences: {
      label: 'Events',
      eyebrowLeft: 'Gather at Beanery',
      eyebrowRight: 'Private lounge · Rooftop · Business gatherings',
      titleLine1: 'Make room for',
      titleLine2: 'something',
      titleLine3: 'worth gathering for.',
      intro: 'Tell us what you are planning. We’ll help you find the right setting at Beanery.',
    },
    journal: {
      label: 'Journal',
      eyebrowLeft: 'Journal',
      eyebrowRight: 'Coffee · Food · People · Behind the scenes',
      titleLine1: 'Stories from behind',
      titleLine2: 'the cup and plate.',
      intro: '',
    },
    visit: {
      label: 'Visit',
      eyebrowLeft: 'Visit Beanery',
      eyebrowRight: 'Doors open from 8 AM',
      titleLine1: 'Beanery,',
      titleLine2: 'Senapati Bapat Road.',
      intro: '',
      address: 'Beside Chaturshrungi Temple\nSenapati Bapat Road\nPune 411016',
      hours: 'Mon – Thu 8:00 – 23:00\nFri – Sun 8:00 – 23:30\nKitchen until 22:30',
      contact: '+91 98609 34080\nhello@beanery.cafe\n@beanery.pune',
      goodToKnow: 'Walk-ins welcome\nLaptops welcome until 5 PM\nStreet parking after 7 PM',
    },
  },

  menu: {
    eyebrowLeft: 'Beanery · Pune',
    eyebrowRight: 'Served daily from 8 AM',
    kicker: 'The full menu',
    titleLine1: 'Choose well.',
    titleLine2: 'Stay a while.',
    intro:
      'A full guide to our coffee, kitchen and bakery. Availability and pricing can change with the day; the live ordering menu is always current.',
    legendNote: 'Please tell the team about allergies before ordering.',
    groups: MENU_GROUPS,
  },

  // Journal posts are authored from the content admin. Keep the shipped list
  // empty until the Beanery team publishes its first story.
  journal: [],

  /**
   * Slot id -> uploaded image URL. Empty by design: an entry here overrides the
   * photograph bundled for that slot, and removing the entry restores it.
   */
  images: {},

  /**
   * Slot id -> { x, y } crop focus, expressed from -50 to 50. Keeping this
   * separate from the URL means original, uploaded and linked images can all
   * be aligned without changing the image itself.
   */
  imagePositions: {},
};

export const DIETS = ['V', 'NV'];

/** Deep clone, so callers cannot mutate the shipped defaults by accident. */
export function cloneDefaults() {
  return structuredClone(DEFAULT_CONTENT);
}
