import {Recipe} from '../types/index'

export const mockRecipes: Recipe[] = [
  {
    id: 1,
    title: 'Crispy Salt and Pepper Potatoes',
    image_name: 'crispy-salt-and-pepper-potatoes-dan-kluger',
    ingredients: [
      '2 large egg whites',
      '1 pound new potatoes (about 1 inch in diameter)',
      '2 teaspoons kosher salt',
      '¾ teaspoon finely ground black pepper',
      '1 teaspoon finely chopped rosemary',
      '1 teaspoon finely chopped thyme',
      '1 teaspoon finely chopped parsley'
    ],
    instructions: '1. Preheat oven to 400°F and line a rimmed baking sheet with parchment.\n2. In a large bowl, whisk the egg whites until foamy (there shouldn\'t be any liquid whites in the bowl).\n3. Add the potatoes and toss until they\'re well coated with the egg whites, then transfer to a strainer or colander and let the excess whites drain.\n4. Season the potatoes with the salt, pepper, and herbs.\n5. Scatter the potatoes on the baking sheet (make sure they\'re not touching) and roast until the potatoes are very crispy and tender when poked with a knife, 15 to 20 minutes (depending on the size of the potatoes).\n6. Transfer to a bowl and serve.',
    nutrition: {
      calories: 384,
      protein: 16,
      fat: 1,
      carbs: 78
    },
    diets: ['Vegetarian', 'Gluten Free', 'Lactose-Free'],
    dish_type: ['lunch', 'dinner'],
    taste_profile: {
      sweetness: 16,
      saltiness: 21,
      bitterness: 13,
      fattiness: 0,
      spiciness: 21
    }
  },
  {
    id: 2,
    title: 'Newton\'s Law',
    image_name: 'newtons-law-apple-bourbon-cocktail',
    ingredients: [
      '1 teaspoon dark brown sugar',
      '1 teaspoon hot water',
      '1 ½ oz. bourbon',
      '½ oz. fresh lemon juice',
      '2 teaspoons apple butter (storebought or homemade)',
      'Garnish: orange twist and freshly grated or ground cinnamon'
    ],
    instructions: '1. Stir together brown sugar and hot water in a cocktail shaker to dissolve.\n2. Let cool, then add bourbon, lemon juice, and apple butter and fill with ice.\n3. Shake until well chilled, about 15 seconds.\n4. Strain into an ice-filled rocks glass.\n5. Garnish with orange twist and cinnamon.',
    nutrition: {
      calories: 119,
      protein: 0,
      fat: 8,
      carbs: 5
    },
    diets: ['Vegetarian', 'Gluten Free'],
    dish_type: ['drink'],
    taste_profile: {
      sweetness: 31,
      saltiness: 5,
      bitterness: 30,
      fattiness: 17,
      spiciness: 0
    }
  },
  {
    id: 3,
    title: 'Warm Comfort',
    image_name: 'warm-comfort-tequila-chamomile-toddy',
    ingredients: [
      '2 chamomile tea bags',
      '1½ oz. reposado tequila',
      '¾ oz. fresh lemon juice',
      '1 Tbsp. agave nectar'
    ],
    instructions: '1. Place 2 chamomile tea bags in a heatsafe vessel, such as a large liquid measuring cup.\n2. Pour in 1 ½ cups boiling water, and let steep 5 minutes, then remove tea bags.\n3. Add 1 ½ oz. reposado tequila, ¾ oz. fresh lemon juice, and 1 Tbsp. agave nectar and stir until incorporated.\n4. Pour into a 16-ounce insulated mug (or two smaller 8-ounce mugs) and drink hot.',
    nutrition: {
      calories: 337,
      protein: 42,
      fat: 12,
      carbs: 14
    },
    diets: ['Vegetarian', 'Gluten Free', 'Lactose-Free'],
    dish_type: ['drink'],
    taste_profile: {
      sweetness: 33,
      saltiness: 31,
      bitterness: 16,
      fattiness: 17,
      spiciness: 0
    }
  }
];
