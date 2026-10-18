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
    groups: [
      {
        id: 'manual-brewing',
        number: '01',
        title: 'Manual Brewing',
        note: 'Coffee, brewed with intention. Choose your bean (290/-) and your method.',
        items: [
          item('Ratnagiri Culture', 'Profile — Rose, Peach, Hibiscus. Available V60, Clever Dripper, Chemex, Origami, French Press, Kalita Wave, Aeropress', 'V', '290/-'),
          item('Attikan Arabica', 'Profile — Citrus, Dark Chocolate, Fig. Available Hot/Iced', 'V', '290/-'),
          item('Pineapple Fermented', 'Profile — Berry, Milk Chocolate, Almonds. Available Hot/Iced', 'V', '290/-'),
          item('Carbonic Natural', 'Profile — Fig, Red Apple, Lemon. Available Hot/Iced', 'V', '290/-'),
        ],
      },
      {
        id: 'espresso-classics',
        number: '02',
        title: 'Espresso Classics',
        note: 'Our house espresso, pulled fresh.',
        items: [
          item('Espresso Double Shot', 'Rich, bold and concentrated', 'V', '150/-'),
          item('Americano', 'Espresso, lengthened with water. Hot/Iced', 'V', '180/- / 210/-'),
          item('Cortado', 'Equal parts espresso and warm milk', 'V', '180/-'),
          item('Latte', 'Smooth espresso with silky milk. Hot/Iced', 'V', '210/- / 230/-'),
          item('Cappuccino', 'Espresso, velvety milk and airy foam. Hot/Iced', 'V', '210/- / 220/-'),
          item('Cafe Mocha', 'Espresso, chocolate and creamy milk. Hot/Iced', 'V', '235/-'),
          item('Spanish Bon Bon', 'Espresso layered with sweet condensed milk', 'V', '180/-'),
          item('Affogato', 'Rich Arabic espresso with Vanilla ice cream', 'V', '250/-'),
        ],
      },
      {
        id: 'iced-coffee',
        number: '03',
        title: 'Iced Coffee',
        note: 'Chilled and refreshing.',
        items: [
          item('Vietnamese Coffee', 'Robusta and chicory filter coffee, sweetened with condensed milk, served over ice', 'V', '250/-'),
          item('Shakerato', 'Robusta and chicory filter coffee, sweetened with condensed milk and cinnamon, shaken over ice', 'V', '265/-'),
          item('Biscoff Iced Latte', 'Espresso, creamy milk and Biscoff spread, served over ice', 'V', '265/-'),
        ],
      },
      {
        id: 'cold-blends',
        number: '04',
        title: 'Cold Blends',
        note: 'Blended until smooth and creamy.',
        items: [
          item('Classic Ice Cream Blend', 'Vanilla ice cream, milk and espresso, blended until smooth and creamy', 'V', '250/-'),
          item('Brownie Crumble Blend', 'Espresso, milk and vanilla ice cream, blended with brownie crumble', 'V', '270/-'),
          item('Biscoff Blend', 'Espresso, milk and vanilla ice cream with Biscoff spread and cookie crumble', 'V', '280/-'),
          item('Nutella Mocha Blend', 'Espresso, milk and vanilla ice cream blended with Nutella and mocha', 'V', '280/-'),
        ],
      },
      {
        id: 'cold-brew',
        number: '05',
        title: 'Cold Brews',
        note: "Slow-brewed for hours, crafted to highlight the coffee's natural character.",
        items: [
          item('Honey Sun Dried Cold Brew', 'Smooth, naturally sweet cold brew with a clean, refreshing finish', 'V', '240/-'),
          item('Whiskey Barrel Aged Cold Brew', 'Barrel-aged coffee cold brew with rich, warming notes and a smooth finish', 'V', '270/-'),
          item('Cold Brew Tonic', 'Honey sun-dried cold brew topped with crisp tonic for a bright, refreshing finish', 'V', '280/-'),
          item('Honey Cinnamon Cold Brew', 'Honey sun-dried cold brew with cinnamon-infused honey, shaken over ice', 'V', '240/-'),
          item('Citrus Cold Brew', 'Honey sun-dried cold brew, citrus juice and Sprite, served over ice. Orange/Cranberry', 'V', '300/-'),
        ],
      },
      {
        id: 'barista-signature',
        number: '06',
        title: "Barista's Signature",
        note: 'Crafted specials from behind the bar.',
        items: [
          item('Orange Zest Mocha', 'Espresso, chocolate, fresh orange zest and milk, finished with a bright citrus aroma. Hot/Iced', 'V', '250/- / 260/-'),
          item('Spanish Latte', 'Espresso with condensed milk and steam milk, finished with a delicate sprinkle of cinnamon. Hot/Iced', 'V', '245/- / 260/-'),
          item('Coconut Groove', 'Cold filter coffee with condensed milk and coconut milk, served over ice', 'V', '280/-'),
          item('Arabic Date Iced Latte', 'Espresso infused with dates, combined with milk and served over ice for a naturally sweet finish', 'V', '280/-'),
          item('Banoffee Iced Latte', 'Espresso, milk, banana and caramel, served over ice for a smooth, dessert-inspired finish', 'V', '290/-'),
        ],
      },
      {
        id: 'milkshakes',
        number: '07',
        title: 'Milkshakes',
        note: 'Blended smooth and creamy.',
        items: [
          item('Vanilla Shake', 'Vanilla ice cream and milk, blended until smooth and creamy', 'V', '250/-'),
          item('Nutella Shake', 'Vanilla ice cream, milk and Nutella, blended into a rich, indulgent shake', 'V', '280/-'),
          item('Brownie Shake', 'Vanilla ice cream, milk and brownie, blended for a rich chocolate finish', 'V', '280/-'),
          item('Biscoff Shake', 'Vanilla ice cream, milk and Biscoff spread, blended with a smooth caramelised finish', 'V', '280/-'),
          item('Strawberry Shake', 'Vanilla ice cream, milk and strawberry crush, blended smooth and creamy', 'V', '280/-'),
          item('Mango Shake', 'Vanilla ice cream, milk and mango crush, blended into a rich, fruity shake', 'V', '280/-'),
        ],
      },
      {
        id: 'hot-chocolate',
        number: '08',
        title: 'Hot Chocolate',
        note: 'Made with Callebaut 811.',
        items: [
          item('55% Dark Hot Chocolate', '55% dark chocolate crafted with Callebaut 811, creating a rich, velvety and indulgent cup', 'V', '260/-'),
          item('Dirty Hot Chocolate', '55% dark chocolate with a shot of espresso for a bold, bittersweet finish', 'V', '280/-'),
        ],
      },
      {
        id: 'tea-infusions',
        number: '09',
        title: 'Tea & Infusions',
        note: 'Loose-leaf brewed to order.',
        items: [
          item('Jasmine Tea', 'Delicately floral with a fragrant, aromatic finish', 'V', '150/-'),
          item('Green Tea', 'Light and refreshing with a clean, subtly vegetal character', 'V', '150/-'),
          item('Hibiscus Tea', 'Bright and tangy with a naturally vibrant, fruity character', 'V', '180/-'),
          item('Chamomile Tea', 'Soft and delicate with gentle floral notes and a soothing finish', 'V', '150/-'),
        ],
      },
      {
        id: 'matcha-ube',
        number: '10',
        title: 'Matcha & Ube',
        note: 'Hot and iced ceremonial specials.',
        items: [
          item('Iced Matcha', 'Smooth matcha with creamy milk, served over ice', 'V', '270/-'),
          item('Fruited Matcha', 'Vibrant matcha with creamy milk and your choice of mango or strawberry, served over ice', 'V', '290/-'),
          item('Coconut Cloud Matcha', 'Whisked matcha with fresh cream and whipped cream, served over chilled coconut water and ice', 'V', '300/-'),
          item('Vanilla Ube Latte', 'Creamy ube, vanilla and milk, served chilled over ice', 'V', '270/-'),
          item('Mango Ube', 'Smooth ube and vibrant mango with creamy milk, served over ice', 'V', '270/-'),
          item('Coconut Ube Cloud', 'Creamy ube with coconut water and a light whipped cream finish, served chilled over ice', 'V', '270/-'),
        ],
      },
      {
        id: 'soups-salads',
        number: '11',
        title: 'Soups & Salads',
        note: 'Lighter plates, made to order.',
        items: [
          item('Carrot Bisque', 'Silky carrot and ginger soup, crispy sweet potato', 'V', ''),
          item('Burrata di Puglia', 'Burrata, heirloom tomatoes, basil, extra virgin olive oil', 'V', ''),
          item('Beetroot & Orange Salad', 'Kale, wild rice, candied walnut, mascarpone, citrus', 'V', ''),
          item('Chicken Caesar Salad', 'Roasted chicken, romaine, croutons, tomato, parmesan', 'NV', ''),
        ],
      },
      {
        id: 'small-plates',
        number: '12',
        title: 'Sandwiches & Small Plates',
        note: 'For the table or a quick lunch.',
        items: [
          item('Roasted Mushroom Sandwich', 'Sour cream, cheddar, mushroom and confit onion', 'V', ''),
          item('Three Cheese Sandwich', 'Focaccia, onion marmalade and three cheeses', 'V', ''),
          item('Corn Ribs', 'Charred sweet corn with herb tzatziki', 'V', ''),
          item('French Chicken Confit', 'Slow-cooked chicken, mash and chicken jus', 'NV', ''),
        ],
      },
      {
        id: 'big-plates',
        number: '13',
        title: 'Big Plates & Mains',
        note: 'Substantial plates from the kitchen.',
        items: [
          item('Cottage Cheese Stick', 'Grilled cottage cheese in coriander marinade with zucchini spaghetti, grilled cherry tomatoes and parmesan', 'V', '510/-'),
          item('Harissa Grilled Chicken', 'Juicy grilled chicken in spicy harissa with creamy mashed potatoes and assorted vegetables. Also available in Cottage Cheese', 'NV', '510/-'),
          item('Grilled Chicken Plate', 'Herb-grilled chicken with herb rice, assorted vegetables and creamy coconut sauce', 'NV', '525/-'),
          item('Chicken Stroganoff', 'Tender chicken and mushrooms in creamy stroganoff sauce with herbs and fragrant herb rice', 'NV', '530/-'),
          item('Fish and Chips', 'Crispy battered fish served with golden fries and tartar sauce', 'NV', '500/-'),
          item('Grilled Bhetki with Capers Sauce', 'Grilled bhetki with spicy baby potatoes, beans and white wine, butter, garlic and lemon caper sauce', 'NV', '500/-'),
          item('Grilled Paneer al Pesto', 'Herb-infused rice with grilled paneer, assorted vegetables and a fragrant basil pesto sauce', 'V', '510/-'),
          item('Chicken Xacuti with Butter Garlic Rice', 'Tender chicken in rich Goan-style xacuti curry with aromatic spices and buttery garlic rice', 'NV', '550/-'),
          item('Confit Chicken with Mashed Potato', 'Slow-cooked confit chicken served with creamy mashed potatoes, finished with a rich jus sauce', 'NV', '350/-'),
        ],
      },
      {
        id: 'burgers',
        number: '14',
        title: 'Burgers',
        note: 'Served with sweet potato wafers.',
        items: [
          item('Grilled Veggie Burger', 'Crispy vegetable patty with lettuce, tomatoes, cheese and cocktail sauce in a soft toasted bun', 'V', '330/-'),
          item('Smoky Paneer Burger', 'Harissa-marinated paneer with lettuce and melted cheese in a toasted bun, served with sweet potato wafers', 'V', '380/-'),
          item('Grilled Chicken Burger', 'Spicy marinated grilled chicken with lettuce and creamy garlic mayo in a toasted bun, with sweet potato wafers', 'NV', '389/-'),
          item('Crunchy Chicken Burger', 'Buttermilk-marinated chicken with lettuce, tomato, cheese and cocktail sauce, with sweet potato wafers', 'NV', '380/-'),
          item('Mega-Bun Burger', 'Minced chicken patty with chicken salami, lettuce, tomato, garlic mayo and sunny-side-up egg, served with sweet potato fries', 'NV', '430/-'),
          item('Prawns Popper Burger', 'Crispy tempura prawns with homemade tartare sauce, capers, parsley, mayo and mustard, served with sweet potato fries', 'NV', '470/-'),
        ],
      },
      {
        id: 'open-toast',
        number: '15',
        title: 'Open Toast',
        note: 'On sourdough or focaccia.',
        items: [
          item('Baked Beans on Toast', 'Homemade baked beans with bell peppers, jaggery, chilli, onion and garlic on toasted bread, topped with jalapeño', 'V', '310/-'),
          item('Avocado Toast', 'Creamy smashed avocado on toasted sourdough, served with choice of eggs as an optional add-on', 'V', '389/-'),
          item('Burrata Caprese Toast', 'Creamy burrata with cherry tomatoes and basil pesto on toasted sourdough bread', 'V', '430/-'),
          item('Roasted Mushroom Hummus Toast', 'Buttered sourdough topped with creamy hummus, roasted mushrooms and a drizzle of olive oil', 'V', '355/-'),
          item('Pulled Chicken Toast', 'Shredded chicken with pineapple salsa and creamy cocktail sauce on toasted sourdough', 'NV', '380/-'),
          item('Protein Power Toast', 'Roasted chicken, chicken salami, lettuce and garlic sauce on sourdough, topped with two sunny-side-up eggs', 'NV', '450/-'),
        ],
      },
      {
        id: 'omelette-eggs',
        number: '16',
        title: 'Omelette & Eggs',
        note: 'Served with baked beans and toasted sourdough.',
        items: [
          item('Classic Omelette', 'Fluffy three-egg omelette with salt and pepper, served with baked beans and toasted sourdough', 'V', '245/-'),
          item('Masala Omelette', 'Three-egg Indian masala omelette with onion, chilli and tomato', 'V', '250/-'),
          item('Chicken Sausage Omelette', 'Three-egg omelette with chicken sausages', 'NV', '255/-'),
          item('Spanish Omelette', 'Spanish-style omelette with fried potatoes and onions', 'V', '260/-'),
          item('Frittata Omelette', 'Italian-style frittata with zucchini, bell peppers, olives and assorted vegetables', 'V', '270/-'),
          item('Truffle Scrambled Egg', 'Creamy scrambled eggs with truffle oil', 'V', '270/-'),
          item('Turkish Eggs', 'Two poached eggs over creamy garlic Greek yogurt with chilli oil and dill', 'V', '330/-'),
          item('Egg Shakshuka', 'Two poached eggs in tomato-bell pepper sauce with onion, garlic, spinach, chicken ham and hollandaise', 'NV', '325/-'),
          item('Eggs Benedict', 'Two poached eggs with garlic, spinach and chicken ham, finished with hollandaise on toasted sourdough', 'NV', '350/-'),
          item('Sunny Side Up', 'Three sunny-side-up eggs with salt and pepper', 'V', '225/-'),
          item('Breakfast Platter (3 Eggs)', 'Three eggs with baked beans, crispy baby potatoes, chicken sausage, sautéed vegetables and toasted sourdough', 'NV', '485/-'),
        ],
      },
      {
        id: 'pasta',
        number: '17',
        title: 'Pasta',
        note: 'Add-ons: Chicken ₹80 · Broccoli ₹60 · Assorted Vegetables ₹70.',
        items: [
          item('Spaghetti Aglio e Olio', 'Spaghetti tossed with garlic, chilli and olive oil, finished with olives and cherry tomatoes', 'V', '445/-'),
          item('Fettuccini Pasta Parmesan', 'Fettuccine tossed in a creamy parmesan and garlic sauce, finished with oregano', 'V', '460/-'),
          item('Farfalle Pasta Marinara / Pink Sauce', 'Farfalle pasta tossed in a rich tomato marinara or creamy pink sauce, finished with herbs', 'V', '480/-'),
          item('Gnocchi Pasta Pesto', 'Soft gnocchi tossed in basil pesto, finished with olives and juicy cherry tomatoes', 'V', '425/-'),
          item('Gnocchi with Pumpkin Sauce', 'Soft gnocchi in creamy pumpkin sauce with onion, garlic, celery and chilli, topped with parmesan and sweet potato crisps', 'V', '450/-'),
          item('Chicken Lasagna Pasta', 'Layers of lasagna sheets with rich chicken ragu, creamy béchamel and melted cheese, baked to perfection', 'NV', '489/-'),
        ],
      },
      {
        id: 'pizza',
        number: '18',
        title: 'Wood Fired Oven Pizza',
        note: 'Authentic Wood-Fired · Hand Tossed · Fresh Dough.',
        items: [
          item('Margherita Pizza', 'Neapolitan-style pizza with rich tomato sauce, creamy mozzarella and fresh basil', 'V', '715/-'),
          item('Smoky Paprika Cottage Cheese Pizza', 'Neapolitan-style pizza with smoky paprika-marinated cottage cheese, bell peppers, onions and melted cheese', 'V', '750/-'),
          item('Neapolitan Veg Pizza', 'Neapolitan-style pizza with marinara, mozzarella, seasonal vegetables and cocktail sauce', 'V', '730/-'),
          item('Burrata Arugula Tomato Pizza', 'Neapolitan-style pizza with creamy burrata, sun-dried tomatoes, arugula and fresh salad', 'V', '910/-'),
          item('Truffle Mushroom Pizza', 'Neapolitan-style pizza with wild mushrooms, mozzarella, truffle oil and fresh arugula', 'V', '810/-'),
          item('New York Style Pizza', 'Foldable crust topped with rich tomato sauce and melted mozzarella and diced cheese', 'V', '869/-'),
          item('Meat Lover\'s Pizza', 'Neapolitan-style pizza with rich marinara sauce, chicken sausage, pepperoni and extra cheese', 'NV', '830/-'),
          item('Buffalo Chicken Pizza', 'Neapolitan-style pizza with spicy buffalo chicken, onions and mozzarella, finished with ranch', 'NV', '855/-'),
          item('Pesto Chicken Pizza', 'Neapolitan-style pizza with grilled chicken, basil pesto, mozzarella and roasted tomatoes', 'NV', '850/-'),
          item('Chicken Pepperoni Pizza', 'Neapolitan-style pizza with marinara, onions, spicy chicken pepperoni and melted mozzarella', 'NV', '779/-'),
          item('Chicken Mortadella Burrata Pizza', 'Neapolitan-style pizza with chicken mortadella, creamy burrata and basil pesto', 'NV', '935/-'),
        ],
      },
      {
        id: 'desserts',
        number: '19',
        title: 'Desserts & Bakery',
        note: 'Sweet things from the bakery counter.',
        items: [
          item('Tarts', 'Strawberry / Berry / Chocolate / Caramel Chocolate. 99/- each', 'V', '99/-'),
          item('Macarons', 'Strawberry / Coffee / Pista / Biscoff. 75/- each, Pack of 6 — 360/-', 'V', '75/-'),
          item('Brownie — Chocolate', 'Classic chocolate brownie', 'V', '200/-'),
          item('Brownie — Biscoff', 'Biscoff brownie', 'V', '280/-'),
          item('Brownie — Hazelnut', 'Hazelnut brownie', 'V', '280/-'),
          item('Nutella Pancakes', 'Pancakes topped with Nutella, fresh strawberries and creamy Nutella cream-cheese frosting', 'V', '350/-'),
          item('Mix Fruits Pancakes', 'Pancakes topped with fresh apple, banana and blueberries, finished with a drizzle of maple syrup', 'V', '350/-'),
          item('French Toast', 'French toast topped with fresh strawberries, blueberries and pear, served with maple syrup and a scoop of ice cream', 'V', '320/-'),
          item('Tiramisu', 'Classic Italian tiramisu', 'V', '330/-'),
          item('Sourdough Loaf', 'House-baked sourdough loaf', 'V', '280/-'),
          item('Pick Your Four', 'Choose any 4 pieces from our selection of tarts, macarons and brownies. Mix and match. Maximum 1 brownie per selection', 'V', '450/-'),
          item('Blueberry Lemon Cake', 'A slice of house blueberry lemon cake', 'V', '350/-'),
          item('Pina Colada Cake', 'A slice of house Pina Colada cake', 'V', '350/-'),
          item('London Cake', 'A slice of London cake', 'V', '350/-'),
          item('Dark Chocolate Cake', 'A slice of rich dark chocolate cake', 'V', '350/-'),
          item('Chocolate Orange Cake', 'A slice of chocolate orange cake', 'V', '350/-'),
          item('Nutty Crunch Cake', 'A slice of nutty crunch cake', 'V', '375/-'),
          item('Cherry Chocolate Cake', 'A slice of cherry chocolate cake', 'V', '350/-'),
        ],
      },
      {
        id: 'bake-house',
        number: '20',
        title: 'Bake House',
        note: 'Freshly baked bread, tartlets and savoury pastry bites.',
        items: [
          item('Garlic Bread', 'Freshly baked bread with aromatic garlic butter, golden crisp crust and a soft, flavourful centre', 'V', '280/-'),
          item('Three Cheese Garlic Bread', 'Freshly baked bread topped with three cheeses (mozzarella, processed cheese and cheddar) and aromatic garlic butter', 'V', '310/-'),
          item('Spinach Corn Tartlets', 'Golden, flaky tartlets filled with creamy spinach and sweet corn', 'V', '329/-'),
          item('Pulled Chicken Tartlets', 'Tartlet shells filled with pulled chicken, pineapple salsa and cocktail sauce', 'NV', '345/-'),
          item('Creamy Chicken Tartlets', 'Delicate, buttery tartlet shells filled with a rich and creamy chicken mixture', 'NV', '359/-'),
          item('Chicken Pastry Bites', 'Golden, flaky pastry bites filled with a delicious, savoury chicken filling', 'NV', '370/-'),
          item('Creamy Mushroom Tartlet', 'Golden, flaky pastry bites filled with a delicious, creamy roasted mushroom filling', 'V', '359/-'),
        ],
      },
    ],
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
