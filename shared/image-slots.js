/**
 * What each image slot actually is, and where it appears on the site.
 *
 * The slot ids in the code ("btb-2", "sig-4") mean nothing on their own, so the
 * admin needs this to show a person which photograph they are about to replace.
 * `note` is the original art direction for the shot - useful when briefing a
 * replacement.
 *
 * Keep in step with App.jsx: adding an ImageSlot without adding it here leaves
 * it in the admin's "Other" group, which still works but reads poorly.
 */

export const SLOT_GROUPS = [
  {
    page: 'Sitewide',
    sections: [
      {
        name: 'Beanery face relief',
        slots: [['face-relief', 'Beanery face relief', 'The plaster face artwork used in the opening sequence, coffee feature and home story section']],
      },
    ],
  },
  {
    page: 'Home',
    sections: [
      {
        name: 'Hero',
        slots: [
          ['hero-grid-1', 'Hero — large left', 'The dining room in warm daylight: banquette, glassware, marble counter, guests mid-meal'],
          ['hero-grid-2', 'Hero — middle', 'Espresso extraction into a warm cup, crema forming, barista hands'],
          ['hero-grid-3', 'Hero — right', "Chef's hands finishing a dish with sauce and oil, overhead, dark ceramic"],
        ],
      },
      {
        name: 'Coffee feature',
        slots: [['feat-coffee', 'Coffee feature', 'V60 pour in a spiral, gooseneck kettle, steam catching daylight (portrait)']],
      },
      {
        name: 'Dishes',
        slots: [
          ['dish-1', 'Dish 1', 'Aglio olio nested with tongs, chilli oil and parsley, dark ceramic, overhead'],
          ['dish-2', 'Dish 2', 'Croque monsieur cut clean, béchamel edge under the grill, cornichons'],
          ['dish-3', 'Dish 3', 'Basque cheesecake, caramelised top, one wedge lifted'],
        ],
      },
      {
        name: 'All day (daypart rail)',
        slots: [
          ['part-morning', 'Morning', 'Sunlight across the counter, espresso being pulled, croissants on a tray'],
          ['part-afternoon', 'Afternoon', 'Two guests at a window table mid-conversation, plated pasta, west light'],
          ['part-evening', 'Evening', 'Low warm light, shared plates and glassware on marble, candle'],
        ],
      },
      {
        name: 'Philosophy',
        slots: [
          ['phil-coffee', 'Philosophy — coffee', 'Grinder chute and dosed portafilter, hands, textural close crop'],
          ['phil-food', 'Philosophy — food', 'Sourdough crumb torn open, olive oil pooling, marble and linen'],
        ],
      },
      {
        name: 'Signature plates rail',
        slots: [
          ['sig-1', 'Signature 1', 'Lychee cold brew, tall glass, clear ice, backlit garnish'],
          ['sig-2', 'Signature 2', 'Aglio olio plated restaurant-style, chilli oil, overhead'],
          ['sig-3', 'Signature 3', 'Basque cheesecake wedge plated, burnt top, cracked surface'],
          ['sig-4', 'Signature 4', 'Levain loaf, scored crust, flour dust, board'],
          ['sig-5', 'Signature 5', 'Comté and ham baguette cut clean, plated with cornichons'],
          ['sig-6', 'Signature 6', 'Saffron latte, threads on foam, ceramic cup, warm tones'],
        ],
      },
      {
        name: 'Pairings',
        slots: [
          ['pair-guji', 'Pairing — Guji', 'Basque cheesecake wedge on ceramic, pour-over carafe'],
          ['pair-lychee', 'Pairing — lychee', 'Aglio olio being twirled, tall glass of cold brew'],
          ['pair-espresso', 'Pairing — espresso', 'Espresso crema in a small ceramic cup, baguette'],
          ['pair-cortado', 'Pairing — cortado', 'Almond croissant with flaked almonds, cortado glass, marble'],
          ['pair-kenya', 'Pairing — Kenya', 'Open-faced sourdough with burrata and tomato, AeroPress mid-plunge'],
        ],
      },
      {
        name: 'Behind the bar',
        slots: [
          ['btb-1', 'Behind the bar 1', 'Barista at the machine mid-shot, apron, concentrated, warm daylight'],
          ['btb-2', 'Behind the bar 2', 'Scale, timer, tamper and cloth laid out on the bar'],
          ['btb-3', 'Behind the bar 3', 'Milk poured into a cortado, latte art closing, close crop'],
          ['btb-4', 'Behind the bar 4', 'The pass mid-service: plated dishes waiting under the lamp'],
        ],
      },
      {
        name: 'Instagram grid',
        slots: [
          ['ig-1', 'Instagram 1', 'Cortado and cake fork on marble'],
          ['ig-2', 'Instagram 2', 'Window seat, west light, half-finished plate'],
          ['ig-3', 'Instagram 3', 'Croissants racked, laminated layers visible'],
          ['ig-4', 'Instagram 4', 'Cold brew over clear ice, condensation'],
          ['ig-5', 'Instagram 5', 'Plated pasta, tongs, dark ceramic, overhead'],
          ['ig-6', 'Instagram 6', 'The team at the end of service, candid'],
        ],
      },
    ],
  },

  {
    page: 'Coffee',
    sections: [
      {
        name: 'Hero',
        slots: [['coffee-hero', 'Coffee hero', 'Cupping table mid-session: bowls, spoons, green and roasted lots, hands']],
      },
      {
        name: 'Origins',
        slots: [
          ['bean-eth', 'Ethiopia', 'Ethiopian green beans in a linen bag, hand-lettered origin tag'],
          ['bean-col', 'Colombia', 'Roasted beans cascading from a scoop, close-up, warm light'],
          ['bean-ken', 'Kenya', 'Cupping table: spoons, bowls, slurping in progress'],
          ['bean-ind', 'India', 'Drying beds on an Indian estate, low morning sun'],
        ],
      },
      {
        name: 'Brew methods',
        slots: [
          ['brew-esp', 'Espresso', 'Espresso pulling into a warm cup, crema forming'],
          ['brew-po', 'Pour over', 'Gooseneck kettle pouring in a spiral, steam catching daylight'],
          ['brew-fp', 'French press', 'French press on a linen tray, two cups, morning table'],
          ['brew-ap', 'AeroPress', 'AeroPress mid-plunge, barista hands, close crop'],
          ['brew-cb', 'Cold brew', 'Tall glass of cold brew, clear ice, condensation, dark wood'],
        ],
      },
      {
        name: 'Seasonal drink',
        slots: [['bev-hero', 'Seasonal drink', 'Saffron latte in glass on marble, cardamom and linen props']],
      },
    ],
  },

  {
    page: 'Our story',
    sections: [
      {
        name: 'Hero',
        slots: [['story-hero', 'Story hero', 'The room in afternoon light: occupied tables, glassware, west sun across marble']],
      },
      {
        name: 'The founder',
        slots: [['founder-kamlesh', 'Kamlesh Kale', 'Portrait of founder Kamlesh Kale']],
      },
      {
        name: 'Archive',
        slots: [['story-1', 'Early days', 'The first espresso machine, early days of the café']],
      },
      {
        name: 'The team',
        slots: [
          ['people-1', 'Head barista', 'Portrait: head barista at the bar, natural light'],
          ['people-2', 'Head chef', 'Portrait: head chef in the kitchen, apron, mid-service'],
          ['people-3', 'Baker', 'Portrait: baker with dough, early morning'],
        ],
      },
    ],
  },

  {
    page: 'Experiences',
    sections: [
      {
        name: 'Banner',
        slots: [['exp-banner', 'Experiences banner', 'Long communal table set for brunch, linen, dishes being passed']],
      },
      {
        name: 'The four experiences',
        slots: [
          ['exp-1', 'Coffee workshop', 'Guests at the bar with scales and V60s'],
          ['exp-2', 'Cupping', 'Cupping table with bowls and spoons, guests slurping'],
          ['exp-3', 'Private gathering', 'The room set for an evening event, candles'],
          ['exp-4', 'Baking class', 'Hands shaping dough on a floured counter'],
        ],
      },
    ],
  },

  {
    page: 'Journal',
    sections: [
      {
        name: 'Lead story',
        slots: [['journal-lead', 'Lead story', 'Roastery drum, beans mid-roast, warm smoke']],
      },
      {
        name: 'Articles',
        slots: [
          ['j-1', 'Article 1', 'Cupping spoons and bowls on a dark table, overhead'],
          ['j-2', 'Article 2', 'Standing bar counter, cups on saucers, motion blur of a barista'],
          ['j-3', 'Article 3', 'Baker hands shaping dough, flour, morning light'],
        ],
      },
    ],
  },

  {
    /**
     * These exist as artwork but nothing on the site renders them today: the
     * food page uses the practical menu, and story-preview was dropped. Kept
     * visible but flagged, so replacing one is never a silent no-op.
     */
    page: 'Not currently shown',
    unused: true,
    sections: [
      {
        name: 'Unused artwork',
        slots: [
          ['food-hero-1', 'Old food hero (left)', 'A full spread: plated pasta, shared boards, glassware, linen'],
          ['food-hero-2', 'Old food hero (right)', 'Tweezers finishing a plate, sauce spooned, motion at the pass'],
          ['dishstory-1', 'Old dish story', 'Aglio olio plated restaurant-style, nested strands, chilli oil'],
          ['bakery-1', 'Old bakery', 'Levain loaves cooling on racks, scored crust, flour and morning light'],
          ['dessert-1', 'Old dessert', 'Basque cheesecake, tarts and tiramisu plated for the case'],
          ['story-preview', 'Old story preview', 'The founders behind the bar mid-service, unposed, warm daylight'],
        ],
      },
    ],
  },
];

/** Flat lookup: slot id -> { page, section, label, note, unused }. */
export const SLOT_INFO = Object.fromEntries(
  SLOT_GROUPS.flatMap((group) =>
    group.sections.flatMap((section) =>
      section.slots.map(([id, label, note]) => [
        id,
        { id, page: group.page, section: section.name, label, note, unused: Boolean(group.unused) },
      ]),
    ),
  ),
);
