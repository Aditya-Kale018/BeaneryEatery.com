// Menu transcribed from the current Beanery menu PDF. The manual brewing
// guide is used for method specifications when available; the menu PDF itself
// only supplies bean profiles, method names and hot/iced availability.
const MENU_PRICES = {
  'Espresso Double Shot': '₹150/-', 'Americano (Hot/Iced)': '₹180/- hot · ₹210/- iced',
  'Cortado': '₹180/-', 'Latte (Hot/Iced)': '₹210/- hot · ₹230/- iced',
  'Cappuccino (Hot/Iced)': '₹210/- hot · ₹220/- iced', 'Cafe Mocha (Hot/Iced)': '₹235/- hot · ₹235/- iced',
  'Spanish Bon Bon': '₹180/-', 'Affogato': '₹250/-', 'Vietnamese Coffee': '₹250/-',
  'Shakerato': '₹265/-', 'Biscoff Iced Latte': '₹265/-', 'Classic Ice Cream Blend': '₹250/-',
  'Brownie Crumble Blend': '₹270/-', 'Biscoff Blend': '₹280/-', 'Nutella Mocha Blend': '₹280/-',
  'Milk Alternatives': '₹60/-', 'Flavour Syrups': '₹50/-', 'Honey Sun Dried Cold Brew': '₹240/-',
  'Whiskey Barrel Aged Cold Brew': '₹270/-', 'Cold Brew Tonic': '₹280/-', 'Honey Cinnamon Cold Brew': '₹240/-',
  'Citrus Cold Brew (Orange/Cranberry)': '₹300/-', 'Orange Zest Mocha (Hot/Iced)': '₹250/- hot · ₹260/- iced',
  'Spanish Latte (Hot/Iced)': '₹245/- hot · ₹260/- iced', 'Coconut Groove': '₹280/-',
  'Arabic Date Iced Latte': '₹280/-', 'Banoffee Iced Latte': '₹290/-', 'Vanilla Shake': '₹250/-',
  'Nutella Shake': '₹280/-', 'Brownie Shake': '₹280/-', 'Biscoff Shake': '₹280/-',
  'Strawberry Shake': '₹280/-', 'Mango Shake': '₹280/-', '55% Dark Hot Chocolate': '₹260/-',
  'Dirty Hot Chocolate': '₹260/-', 'Toppings and Finishes': '₹45/-', 'Jasmine Tea': '₹150/-',
  'Green Tea': '₹150/-', 'Hibiscus Tea': '₹180/-', 'Chamomile Tea': '₹150/-', 'Iced Matcha': '₹270/-',
  'Fruited Matcha (Strawberry/Mango)': '₹290/-', 'Coconut Cloud Matcha': '₹300/-',
  'Vanilla Ube Latte (Iced)': '₹270/-', 'Mango Ube (Iced)': '₹270/-', 'Coconut Ube Cloud (Iced)': '₹270/-',
  'Hibiscus Lemonade': '₹230/-', 'Fresh Lime Soda': '₹200/-', 'Peach Iced Tea': '₹200/-',
  'Lemon Iced Tea': '₹200/-', 'Berry Smoothie': '₹350/-', 'Chocolate Banana Smoothie': '₹350/-',
  'Avocado Smoothie': '₹350/-', 'Classic Fries with Garlic Sauce': '₹310/-',
  'Smoked Hot Garlic Lotus Stem': '₹285/-', 'Corn Ribs with Tzatziki Sauce': '₹260/-',
  'Couscous with Hummus': '₹330/-', 'Butter Garlic Mushrooms': '₹300/-', 'Crispy Chicken Bites': '₹350/-',
  'Chicken Croquettes with Muhammara Sauce': '₹310/-', 'Chicken Croquettes (with Muhammara Sauce)': '₹310/-', 'Garlic Butter Prawns': '₹410/-',
  'Eggplant Cream Cheese Roll': '₹310/-', 'Roasted Chicken Harissa Wings': '₹380/-', 'Soya Pudding': '₹299/-',
  'Veg Garden Croquettes': '₹330/-', 'Roast Tomato Ricotta': '₹330/-', 'Grilled Pomfret with Capers Sauce': '₹999/-',
  'Chilli Garlic Prawns': '₹530/-', 'Carrot Bisque with Sweet Potato Shard': '₹270/-',
  'Roasted Bell Pepper & Tomato Soup': '₹275/-', 'Truffle Mushroom Soup': '₹289/-', 'Chicken Broth Soup': '₹310/-',
  'Avocado & Coriander Walnut Salad': '₹410/-', 'Avocado Quinoa Salad': '₹360/-',
  'Burrata di Puglia with Cherry Tomatoes': '₹455/-', 'Grilled Chicken Salad with Couscous': '₹340/-',
  'Apple Cranberry Walnut Salad': '₹380/-', 'Choice of Protein': '₹45/-', 'Roasted Beetroot and Citrus Salad': '₹350/-',
  'Market Green Salad': '₹320/-', 'Cucumber Dill Salad': '₹300/-', 'Truffle Mushroom Sandwich': '₹389/-',
  'Chicken Mortadella Sandwich': '₹410/-', 'Buffalo Mozzarella Tomato Basil': '₹430/-',
  'Chicken Spicy Mortadella Sandwich': '₹390/-', 'Smoked Cottage Cheese Sandwich': '₹370/-',
  'Pulled Chicken Sandwich': '₹380/-', 'Roasted Vegetable Hummus Sandwich': '₹350/-',
  'Pesto Chicken Sandwich': '₹380/-', 'Paneer Pesto Sandwich': '₹385/-', 'Smoky Chicken Sandwich': '₹365/-',
  'Ratatouille Sandwich': '₹355/-', 'Chicken Garlic Mayo Sandwich': '₹370/-',
  'Protein Power Sandwich': '₹450/-', 'Bread Options': 'Charges apply', 'Cottage Cheese Stick': '₹510/-',
  'Harissa Grilled Chicken': '₹510/-', 'Grilled Chicken Plate': '₹525/-', 'Chicken Stroganoff': '₹530/-',
  'Fish and Chips': '₹500/-', 'Grilled Bhetki with Capers Sauce': '₹500/-', 'Grilled Paneer al Pesto': '₹510/-',
  'Chicken Xacuti with Butter Garlic Rice': '₹550/-', 'Confit Chicken with Mashed Potato': '₹350/-',
  'Grilled Veggie Burger': '₹330/-', 'Smoky Paneer Burger': '₹380/-', 'Grilled Chicken Burger': '₹389/-',
  'Crunchy Chicken Burger': '₹380/-', 'Mega-Bun Burger': '₹430/-', 'Prawns Popper Burger': '₹470/-',
  'Baked Beans on Toast': '₹310/-', 'Pulled Chicken Toast': '₹380/-', 'Avocado Toast': '₹389/-',
  'Protein Power Toast': '₹450/-', 'Burrata Caprese Toast': '₹430/-', 'Roasted Mushroom Hummus Toast': '₹355/-',
  'Classic Omelette': '₹245/-', 'Breakfast Platter (3 Eggs)': '₹485/-', 'Masala Omelette': '₹250/-',
  'Chicken Sausage Omelette': '₹255/-', 'Spanish Omelette': '₹260/-', 'Frittata Omelette': '₹270/-',
  'Truffle Scrambled Egg': '₹270/-', 'Turkish Eggs': '₹330/-', 'Egg Shakshuka': '₹325/-',
  'Eggs Benedict': '₹350/-', 'Sunny Side Up': '₹225/-', 'Spaghetti Aglio e Olio': '₹445/-',
  'Fettuccini Pasta Parmesan': '₹460/-', 'Farfalle Pasta Marinara / Pink Sauce': '₹480/-',
  'Gnocchi Pasta Pesto': '₹425/-', 'Gnocchi with Pumpkin Sauce': '₹450/-', 'Chicken Lasagna Pasta': '₹489/-',
  'Pasta Add-ons': 'Chicken ₹80/- · Broccoli ₹60/- · Assorted vegetables ₹70/-',
  'Margherita Pizza': '₹715/-', "Meat Lover's Pizza": '₹830/-', 'Smoky Paprika Cottage Cheese Pizza': '₹750/-',
  'Buffalo Chicken Pizza': '₹855/-', 'Truffle Mushroom Pizza': '₹810/-', 'New York Style Pizza': '₹869/-',
  'Neapolitan Veg Pizza': '₹730/-', 'Burrata Arugula Tomato Pizza': '₹910/-',
  'Chicken Mortadella Burrata Pizza': '₹935/-', 'Pesto Chicken Pizza': '₹850/-', 'Chicken Pepperoni Pizza': '₹779/-',
  'Tart — Strawberry': '₹99/- each', 'Tart — Berry': '₹99/- each', 'Tart — Chocolate': '₹99/- each',
  'Tart — Caramel Chocolate': '₹99/- each', 'Macaron — Strawberry': '₹75/- each', 'Macaron — Coffee': '₹75/- each',
  'Macaron — Pista': '₹75/- each', 'Macaron — Biscoff': '₹75/- each', 'Macarons — Pack of 6': '₹360/-',
  'Chocolate Brownie': '₹200/-', 'Biscoff Brownie': '₹280/-', 'Hazelnut Brownie': '₹280/-',
  'Blueberry Lemon Cake': '₹350/-', 'Pina Colada Cake': '₹350/-', 'London Cake': '₹350/-',
  'Dark Chocolate Cake': '₹350/-', 'Chocolate Orange Cake': '₹350/-', 'Nutty Crunch Cake': '₹375/-',
  'Cherry Chocolate Cake': '₹350/-', 'Nutella Pancakes': '₹350/-', 'Mix Fruits Pancakes': '₹350/-',
  'French Toast': '₹320/-', 'Tiramisu': '₹330/-', 'Sourdough Loaf': '₹280/-', 'Pick Your Four': '₹450/-'
};
const item = (name, description = '', diet = '', price = MENU_PRICES[name] || '') => ({ name, description, diet, price });

// Keep dietary marks consistent even for older saved menu records that predate
// the diet field. Only classify clear ingredients; bakery recipes can vary.
const BEVERAGE_GROUPS = new Set([
  'espresso-classics', 'iced-coffee', 'cold-blends', 'crafted-cold-brews',
  'barista-signature', 'milkshakes', 'hot-chocolate', 'tea-infusions',
  'matcha', 'ube', 'refreshments', 'smoothies'
]);
const KITCHEN_GROUPS = new Set([
  'starters', 'soups', 'salads', 'sandwiches', 'big-plates', 'entree-main-course',
  'burgers', 'open-toast', 'omelette-eggs', 'pasta', 'wood-fired-pizza'
]);

export const menuDietTag = (entry, groupId) => {
  if (entry?.diet === 'V' || entry?.diet === 'NV') return entry.diet;
  if (!entry?.name || !groupId) return '';

  const name = entry.name.toLowerCase();
  const description = String(entry.description || '').toLowerCase();
  if (name === 'avocado toast') return 'V';
  if (/choice of protein|bread options|toppings and finishes/.test(name)) return '';

  const nonVegIngredients = /\b(chicken|prawns?|fish|bhetki|pomfret|mortadella|sausage|pepperoni|salami|ham|egg|eggs|omelette)\b/;
  if (nonVegIngredients.test(`${name} ${description}`)) return 'NV';

  if (BEVERAGE_GROUPS.has(groupId)) return 'V';

  // Bakery and pancake recipes may contain egg, so leave them unmarked unless
  // the menu source provides an explicit diet value.
  if (groupId === 'desserts' || groupId === 'pancakes-french-toast') return '';

  return KITCHEN_GROUPS.has(groupId) ? (groupId === 'omelette-eggs' ? 'NV' : 'V') : '';
};

export const MENU_GROUPS = [
  {
    id: 'manual-brewing', number: '01', title: 'Manual Brewing', note: 'Choose your bean and brewing method · Available hot or iced.',
    items: [
      item('Ratnagiri Culture', 'Rose · Peach · Hibiscus', '', '₹290/-'),
      item('Attikan Arabica', 'Citrus · Dark chocolate · Fig', '', '₹290/-'),
      item('Pineapple Fermented', 'Berry · Milk chocolate · Almonds', '', '₹290/-'),
      item('Carbonic Natural', 'Fig · Red apple · Lemon', '', '₹290/-'),
      item('V60 Pour Over', 'Clean · Bright · Aromatic'),
      item('Clever Dripper', 'Smooth · Sweet · Full-bodied'),
      item('Chemex', 'Clean · Light · Silky'),
      item('Origami', 'Sweet · Balanced · Expressive'),
      item('French Press', 'Rich · Bold · Textured'),
      item('Kalita Wave', 'Balanced · Sweet · Smooth'),
      item('AeroPress', 'Smooth · Vibrant · Versatile'),
    ],
  },
  {
    id: 'espresso-classics', number: '01', title: 'Espresso Classics', note: 'Espresso favourites, served hot or iced where noted.',
    items: [
      item('Espresso Double Shot', 'Rich, bold and concentrated.'),
      item('Americano (Hot/Iced)', 'Espresso, lengthened with water.'),
      item('Cortado', 'Equal parts espresso and warm milk.'),
      item('Latte (Hot/Iced)', 'Smooth espresso with silky milk.'),
      item('Cappuccino (Hot/Iced)', 'Espresso, velvety milk and airy foam.'),
      item('Cafe Mocha (Hot/Iced)', 'Espresso, chocolate and creamy milk.'),
      item('Spanish Bon Bon', 'Espresso layered with sweet condensed milk.'),
      item('Affogato', 'Arabic espresso with vanilla ice cream.'),
    ],
  },
  {
    id: 'iced-coffee', number: '02', title: 'Iced Coffee', note: 'Chilled coffee favourites.',
    items: [
      item('Vietnamese Coffee', 'Robusta and chicory filter coffee, sweetened with condensed milk and served over ice.'),
      item('Shakerato', 'Robusta and chicory filter coffee with condensed milk and cinnamon, shaken over ice.'),
      item('Biscoff Iced Latte', 'Espresso, creamy milk and Biscoff spread, served over ice.'),
    ],
  },
  {
    id: 'cold-blends', number: '03', title: 'Cold Blends', note: 'Blended until smooth and creamy.',
    items: [
      item('Classic Ice Cream Blend', 'Vanilla ice cream, milk and espresso.'),
      item('Brownie Crumble Blend', 'Espresso, milk, vanilla ice cream and brownie crumble.'),
      item('Biscoff Blend', 'Espresso, milk, vanilla ice cream, Biscoff spread and cookie crumble.'),
      item('Nutella Mocha Blend', 'Espresso, milk, vanilla ice cream, Nutella and mocha.'),
      item('Milk Alternatives', 'Oat milk or almond milk.'),
      item('Flavour Syrups', 'Hazelnut, Irish, caramel or vanilla.'),
    ],
  },
  {
    id: 'crafted-cold-brews', number: '04', title: 'Beanery Crafted Cold Brews', note: 'Slow-brewed for hours and served chilled over ice.',
    items: [
      item('Honey Sun Dried Cold Brew', 'Smooth, naturally sweet cold brew with a clean, refreshing finish.'),
      item('Whiskey Barrel Aged Cold Brew', 'Barrel-aged coffee with rich, warming notes and a smooth finish.'),
      item('Cold Brew Tonic', 'Honey sun-dried cold brew topped with crisp tonic.'),
      item('Honey Cinnamon Cold Brew', 'Honey sun-dried cold brew with cinnamon-infused honey.'),
      item('Citrus Cold Brew (Orange/Cranberry)', 'Honey sun-dried cold brew, citrus juice and Sprite, served over ice.'),
    ],
  },
  {
    id: 'barista-signature', number: '05', title: "Barista's Signature", note: 'Crafted specials from behind the bar.',
    items: [
      item('Orange Zest Mocha (Hot/Iced)', 'Espresso, chocolate, fresh orange zest and milk, finished with a bright citrus aroma.'),
      item('Spanish Latte (Hot/Iced)', 'Espresso with condensed milk and steamed milk, finished with a delicate sprinkle of cinnamon.'),
      item('Coconut Groove', 'Cold filter coffee with condensed milk and coconut milk, served over ice.'),
      item('Arabic Date Iced Latte', 'Espresso infused with dates and combined with milk.'),
      item('Banoffee Iced Latte', 'Espresso, milk, banana and caramel.'),
    ],
  },
  {
    id: 'milkshakes', number: '06', title: 'Milkshakes', note: 'Vanilla ice cream and milk, blended smooth.',
    items: [
      item('Vanilla Shake', 'Vanilla ice cream and milk.'),
      item('Nutella Shake', 'Vanilla ice cream, milk and Nutella.'),
      item('Brownie Shake', 'Vanilla ice cream, milk and brownie.'),
      item('Biscoff Shake', 'Vanilla ice cream, milk and Biscoff spread.'),
      item('Strawberry Shake', 'Vanilla ice cream, milk and strawberry crush.'),
      item('Mango Shake', 'Vanilla ice cream, milk and mango crush.'),
    ],
  },
  {
    id: 'hot-chocolate', number: '07', title: 'Hot Chocolate', note: 'Rich chocolate cups and toppings.',
    items: [
      item('55% Dark Hot Chocolate', '55% dark chocolate crafted with Callebaut 811.'),
      item('Dirty Hot Chocolate', '55% dark chocolate with a shot of espresso.'),
      item('Toppings and Finishes', 'Marshmallow cloud, roasted nut crunch or chocolate shavings.'),
    ],
  },
  {
    id: 'tea-infusions', number: '08', title: 'Tea & Infusions', note: 'Brewed to bring out each tea’s character.',
    items: [
      item('Jasmine Tea', 'Delicately floral with a fragrant, aromatic finish.'),
      item('Green Tea', 'Light and refreshing with a clean, subtly vegetal character.'),
      item('Hibiscus Tea', 'Bright and tangy with a naturally vibrant, fruity character.'),
      item('Chamomile Tea', 'Soft, delicate floral notes with a soothing finish.'),
    ],
  },
  {
    id: 'matcha', number: '09', title: 'Matcha', note: 'Matcha, served hot or iced where noted.',
    items: [
      item('Iced Matcha', 'Smooth matcha with creamy milk, served over ice. Flavour or milk alternative available.'),
      item('Fruited Matcha (Strawberry/Mango)', 'Vibrant matcha with creamy milk and your choice of mango or strawberry, served over ice.'),
      item('Coconut Cloud Matcha', 'Whisked matcha with fresh cream and whipped cream over chilled coconut water and ice.'),
    ],
  },
  {
    id: 'ube', number: '10', title: 'Ube', note: 'Creamy, chilled ube drinks.',
    items: [
      item('Vanilla Ube Latte (Iced)', 'Creamy ube, vanilla and milk, served chilled over ice.'),
      item('Mango Ube (Iced)', 'Smooth ube and vibrant mango with creamy milk, served over ice.'),
      item('Coconut Ube Cloud (Iced)', 'Creamy ube with coconut water and a light whipped cream finish, served chilled over ice.'),
    ],
  },
  {
    id: 'refreshments', number: '11', title: 'The Refreshments', note: 'Bright, refreshing drinks served chilled.',
    items: [
      item('Hibiscus Lemonade', 'Vibrant hibiscus with zesty lemon.'),
      item('Fresh Lime Soda', 'Fresh lime, soda and a touch of sweetness.'),
      item('Peach Iced Tea', 'Refreshing iced tea with delicate peach notes.'),
      item('Lemon Iced Tea', 'Classic iced tea with bright lemon.'),
    ],
  },
  {
    id: 'smoothies', number: '12', title: 'Smoothies', note: 'Creamy fruit and chocolate blends.',
    items: [
      item('Berry Smoothie', 'Mixed berries, milk, banana and yogurt, finished with berry toppings.'),
      item('Chocolate Banana Smoothie', 'Chocolate and banana smoothie with chocolate and banana toppings.'),
      item('Avocado Smoothie', 'Creamy avocado smoothie with a naturally rich finish.'),
    ],
  },
  {
    id: 'starters', number: '13', title: 'Starters', note: 'Small plates for the table.',
    items: [
      item('Classic Fries with Garlic Sauce', 'Crispy golden French fries with a creamy garlic dip.'),
      item('Smoked Hot Garlic Lotus Stem', 'Crispy fried lotus stems in smoky, spicy hot garlic sauce.'),
      item('Corn Ribs with Tzatziki Sauce', 'Golden-fried corn ribs with peri-peri seasoning and cool tzatziki.'),
      item('Couscous with Hummus', 'Light couscous with assorted vegetables and creamy hummus.'),
      item('Butter Garlic Mushrooms', 'Mushrooms sautéed in garlic butter and finished with herbs.'),
      item('Crispy Chicken Bites', 'Crisp golden chicken with creamy, tangy peri-peri cocktail sauce.'),
      item('Chicken Croquettes (with Muhammara Sauce)', 'Golden chicken croquettes with a tender filling, served with smoky muhammara sauce.'),
      item('Garlic Butter Prawns', 'Prawns sautéed in garlic butter and finished with herbs.'),
      item('Eggplant Cream Cheese Roll', 'Eggplant rolls filled with cream cheese over tangy pomodoro sauce.'),
      item('Roasted Chicken Harissa Wings', 'Roasted chicken wings coated in a bold harissa glaze.'),
      item('Soya Pudding', 'Tender soya pieces tossed in a spicy, tangy hot red sauce.'),
      item('Veg Garden Croquettes', 'Garden vegetable croquettes with smoky, mildly spicy muhammara.'),
      item('Roast Tomato Ricotta', 'Blanched tomatoes with olive oil and herbs, served with whipped ricotta.'),
      item('Grilled Pomfret with Capers Sauce', 'Grilled pomfret, spicy baby potatoes and beans with white wine, butter, garlic and lemon caper sauce.'),
      item('Chilli Garlic Prawns', 'Prawns in chilli, lemon and ginger-garlic sauce with mint and coriander.'),
    ],
  },
  {
    id: 'soups', number: '14', title: 'Soups', note: 'Comforting bowls, made to order.',
    items: [
      item('Carrot Bisque with Sweet Potato Shard', 'Creamy carrot soup topped with a crisp sweet potato shard and fresh cream.'),
      item('Roasted Bell Pepper & Tomato Soup', 'Roasted tomato and bell pepper soup with olive oil and crisp toast.'),
      item('Truffle Mushroom Soup', 'Creamy mushroom soup with truffle oil and crisp toast.'),
      item('Chicken Broth Soup', 'Light chicken broth with garlic, herbs and crisp toast.'),
    ],
  },
  {
    id: 'salads', number: '15', title: 'Salads', note: 'Fresh greens, grains and seasonal produce.',
    items: [
      item('Avocado & Coriander Walnut Salad', 'Avocado and crunchy walnuts tossed in fresh cilantro dressing.'),
      item('Avocado Quinoa Salad', 'Quinoa, bell peppers, avocado guacamole, pomegranate, dill and pumpkin seeds.'),
      item('Burrata di Puglia with Cherry Tomatoes', 'Burrata and roasted cherry tomatoes over pesto, parmesan and fresh basil oil.'),
      item('Grilled Chicken Salad with Couscous', 'Grilled chicken, greens, vegetables and couscous with lemon-herb chilli-garlic dressing.'),
      item('Apple Cranberry Walnut Salad', 'Crisp iceberg, apple, lemon-honey vinaigrette, cranberries and pomegranate.'),
      item('Roasted Beetroot and Citrus Salad', 'Roasted beetroot, orange and feta with greens, nuts, seeds and citrus dressing.'),
      item('Market Green Salad', 'Lettuce, cherry tomatoes, lemon vinaigrette, olive oil, red chilli and couscous.'),
      item('Cucumber Dill Salad', 'Cucumber and cherry tomatoes in burnt garlic-dill dressing with mixed seeds.'),
      item('Choice of Protein', 'Chicken, egg or paneer.'),
    ],
  },
  {
    id: 'sandwiches', number: '16', title: 'Sandwiches', note: 'Toasted focaccia with sweet potato wafers; bread options vary.',
    items: [
      item('Truffle Mushroom Sandwich', 'Roasted mushrooms, garlic, herbs, cheese and truffle oil with mayo dip.'),
      item('Chicken Mortadella Sandwich', 'Chicken mortadella, salami, lettuce, parmesan and garlic mayo.'),
      item('Buffalo Mozzarella Tomato Basil', 'Buffalo mozzarella, tomato, basil and pesto with mayo dip.'),
      item('Chicken Spicy Mortadella Sandwich', 'Spicy chicken mortadella with chilli, garlic, egg and garlic butter.'),
      item('Smoked Cottage Cheese Sandwich', 'Harissa cottage cheese with onion cocktail sauce.'),
      item('Pulled Chicken Sandwich', 'Shredded chicken with pineapple salsa and creamy cocktail sauce.'),
      item('Roasted Vegetable Hummus Sandwich', 'Hummus with roasted zucchini, bell peppers and broccoli.'),
      item('Pesto Chicken Sandwich', 'Pesto-marinated chicken, roasted tomatoes and basil pesto.'),
      item('Paneer Pesto Sandwich', 'Pesto-marinated cottage cheese, roasted tomatoes and basil pesto.'),
      item('Smoky Chicken Sandwich', 'Indian-spiced chicken with smoky mayo and melted mozzarella.'),
      item('Ratatouille Sandwich', 'Roasted vegetables and eggplant in tomato-basil sauce.'),
      item('Chicken Garlic Mayo Sandwich', 'Minced chicken with garlic mayo, jalapeño, butter and garlic.'),
      item('Protein Power Sandwich', 'Grilled chicken, chicken salami, lettuce and garlic mayo, topped with egg.'),
      item('Bread Options', 'Focaccia or sourdough.'),
    ],
  },
  {
    id: 'big-plates', number: '17', title: 'Big Plates', note: 'A generous plate from the kitchen.',
    items: [
      item('Cottage Cheese Stick', 'Grilled coriander-marinated cottage cheese with zucchini spaghetti, cherry tomatoes and parmesan.'),
      item('Harissa Grilled Chicken', 'Harissa chicken with mashed potatoes and vegetables. Also available in cottage cheese.'),
      item('Grilled Chicken Plate', 'Herb-grilled chicken with herb rice, vegetables and creamy coconut sauce.'),
      item('Chicken Stroganoff', 'Chicken and mushrooms in creamy stroganoff sauce with herbs and herb rice.'),
      item('Fish and Chips', 'Crispy battered fish with golden fries and tartar sauce.'),
      item('Grilled Bhetki with Capers Sauce', 'Grilled bhetki, spicy baby potatoes and beans with white wine, butter, garlic and lemon caper sauce.'),
    ],
  },
  {
    id: 'entree-main-course', number: '18', title: 'Entrée & Main Course', note: 'Thoughtful, flavour-led plates.',
    items: [
      item('Grilled Paneer al Pesto', 'Herb rice, grilled paneer, assorted vegetables and basil pesto sauce.'),
      item('Chicken Xacuti with Butter Garlic Rice', 'Chicken in Goan-style xacuti curry with aromatic spices and buttery garlic rice.'),
      item('Confit Chicken with Mashed Potato', 'Slow-cooked confit chicken with creamy mashed potatoes and rich jus.'),
    ],
  },
  {
    id: 'burgers', number: '19', title: 'Burgers', note: 'Served with sweet potato wafers or fries as noted.',
    items: [
      item('Grilled Veggie Burger', 'Vegetable patty, lettuce, tomato, cheese and cocktail sauce in a toasted bun.'),
      item('Smoky Paneer Burger', 'Harissa paneer, lettuce and melted cheese in a toasted bun.'),
      item('Grilled Chicken Burger', 'Spicy grilled chicken, lettuce and garlic mayo in a toasted bun.'),
      item('Crunchy Chicken Burger', 'Buttermilk-marinated chicken, lettuce, tomato, cheese and cocktail sauce.'),
      item('Mega-Bun Burger', 'Minced chicken patty, chicken salami, lettuce, tomato, garlic mayo and egg.'),
      item('Prawns Popper Burger', 'Tempura prawns with tartare sauce, capers, parsley, mayo and mustard.'),
    ],
  },
  {
    id: 'open-toast', number: '20', title: 'Open Toast', note: 'Toasted bread topped with savoury favourites.',
    items: [
      item('Baked Beans on Toast', 'Homemade baked beans with vegetables, jaggery, chilli and garlic, topped with jalapeño.'),
      item('Pulled Chicken Toast', 'Shredded chicken with pineapple salsa and cocktail sauce on sourdough.'),
      item('Avocado Toast', 'Smashed avocado on sourdough; choice of eggs available as an add-on.'),
      item('Protein Power Toast', 'Roasted chicken, chicken salami, lettuce and garlic sauce with sunny-side-up eggs.'),
      item('Burrata Caprese Toast', 'Burrata, cherry tomatoes and basil pesto on sourdough.'),
      item('Roasted Mushroom Hummus Toast', 'Buttered sourdough with hummus, roasted mushrooms and olive oil.'),
    ],
  },
  {
    id: 'omelette-eggs', number: '21', title: 'Omelette & Eggs', note: 'Served with baked beans and toasted sourdough where noted.',
    items: [
      item('Classic Omelette', 'Three-egg omelette with salt and pepper.'),
      item('Breakfast Platter (3 Eggs)', 'Three eggs with baked beans, potatoes, chicken sausage, vegetables and sourdough.'),
      item('Masala Omelette', 'Three-egg Indian masala omelette with onion, chilli and tomato.'),
      item('Chicken Sausage Omelette', 'Three-egg omelette with chicken sausages.'),
      item('Spanish Omelette', 'Spanish-style omelette with fried potatoes and onions.'),
      item('Frittata Omelette', 'Italian-style frittata with zucchini, bell peppers, olives and vegetables.'),
      item('Truffle Scrambled Egg', 'Creamy scrambled eggs with truffle oil.'),
      item('Turkish Eggs', 'Poached eggs over garlic Greek yogurt with chilli oil and dill.'),
      item('Egg Shakshuka', 'Poached eggs in tomato-bell pepper sauce with spinach, chicken ham and hollandaise.'),
      item('Eggs Benedict', 'Poached eggs with garlic, spinach and chicken ham, finished with hollandaise on sourdough.'),
      item('Sunny Side Up', 'Three sunny-side-up eggs with salt and pepper.'),
    ],
  },
  {
    id: 'pasta', number: '22', title: 'Pasta', note: 'Pasta add-ons available: chicken, broccoli or assorted vegetables.',
    items: [
      item('Spaghetti Aglio e Olio', 'Spaghetti with garlic, chilli and olive oil, finished with olives and cherry tomatoes.'),
      item('Fettuccini Pasta Parmesan', 'Fettuccine in creamy parmesan and garlic sauce, finished with oregano.'),
      item('Farfalle Pasta Marinara / Pink Sauce', 'Farfalle in tomato marinara or creamy pink sauce, finished with herbs.'),
      item('Gnocchi Pasta Pesto', 'Gnocchi tossed in basil pesto with olives and cherry tomatoes.'),
      item('Gnocchi with Pumpkin Sauce', 'Gnocchi in creamy pumpkin sauce with onion, garlic, celery and chilli, topped with parmesan and sweet potato crisps.'),
      item('Chicken Lasagna Pasta', 'Lasagna sheets layered with chicken ragu, béchamel and melted cheese.'),
      item('Pasta Add-ons', 'Chicken · Broccoli · Assorted vegetables', '', 'Chicken ₹80/- · Broccoli ₹60/- · Assorted vegetables ₹70/-'),
    ],
  },
  {
    id: 'wood-fired-pizza', number: '23', title: 'Wood Fired Oven Pizza', note: 'Authentic wood-fired · hand tossed · fresh dough.',
    items: [
      item('Margherita Pizza', 'Neapolitan pizza with tomato sauce, mozzarella and fresh basil.'),
      item("Meat Lover's Pizza", 'Neapolitan pizza with marinara, chicken sausage, pepperoni and extra cheese.'),
      item('Smoky Paprika Cottage Cheese Pizza', 'Paprika-marinated cottage cheese, bell peppers, onions and melted cheese.'),
      item('Buffalo Chicken Pizza', 'Spicy buffalo chicken, onions and mozzarella, finished with ranch.'),
      item('Truffle Mushroom Pizza', 'Wild mushrooms, mozzarella, truffle oil and fresh arugula.'),
      item('New York Style Pizza', 'Foldable crust with tomato sauce, melted mozzarella and diced cheese.'),
      item('Neapolitan Veg Pizza', 'Marinara, mozzarella, seasonal vegetables and cocktail sauce.'),
      item('Burrata Arugula Tomato Pizza', 'Creamy burrata, sun-dried tomatoes, arugula and fresh salad.'),
      item('Chicken Mortadella Burrata Pizza', 'Chicken mortadella, creamy burrata and basil pesto.'),
      item('Pesto Chicken Pizza', 'Grilled chicken, basil pesto, mozzarella and roasted tomatoes.'),
      item('Chicken Pepperoni Pizza', 'Marinara, onions, spicy chicken pepperoni and melted mozzarella.'),
    ],
  },
  {
    id: 'desserts', number: '24', title: 'Desserts', note: 'Tarts, macarons, brownies and cakes from the bakery.',
    items: [
      item('Tart — Strawberry', ''),
      item('Tart — Berry', ''),
      item('Tart — Chocolate', ''),
      item('Tart — Caramel Chocolate', ''),
      item('Macaron — Strawberry', ''),
      item('Macaron — Coffee', ''),
      item('Macaron — Pista', ''),
      item('Macaron — Biscoff', ''),
      item('Macarons — Pack of 6', ''),
      item('Chocolate Brownie', 'Chocolate brownie.'),
      item('Biscoff Brownie', 'Biscoff brownie.'),
      item('Hazelnut Brownie', 'Hazelnut brownie.'),
      item('Blueberry Lemon Cake', 'Blueberry and lemon cake.'),
      item('Pina Colada Cake', 'Pina colada cake.'),
      item('London Cake', 'London cake.'),
      item('Dark Chocolate Cake', 'Dark chocolate cake.'),
      item('Chocolate Orange Cake', 'Chocolate orange cake.'),
      item('Nutty Crunch Cake', 'Nutty crunch cake.'),
      item('Cherry Chocolate Cake', 'Cherry chocolate cake.'),
    ],
  },
  {
    id: 'pancakes-french-toast', number: '25', title: 'Pancakes & French Toast', note: 'Freshly made sweet plates.',
    items: [
      item('Nutella Pancakes', 'Pancakes with Nutella, fresh strawberries and Nutella cream-cheese frosting.'),
      item('Mix Fruits Pancakes', 'Pancakes with apple, banana and blueberries, finished with maple syrup.'),
      item('French Toast', 'French toast with strawberries, blueberries, pear, maple syrup and ice cream.'),
      item('Tiramisu', 'Tiramisu.'),
      item('Sourdough Loaf', 'Sourdough loaf.'),
      item('Pick Your Four', 'Choose any four tarts, macarons and brownies; maximum one brownie.'),
    ],
  },
];

MENU_GROUPS.forEach((group, index) => {
  group.number = String(index + 1).padStart(2, '0');
});
