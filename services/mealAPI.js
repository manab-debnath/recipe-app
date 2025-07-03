const BASE_URL = process.env.EXPO_PUBLIC_THE_MEAL_DB_URL;

export const MealAPI = {
	// search meal by name
	searchMealByName: async (query) => {
		try {
			const response = await fetch(
				`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`
			);
			const data = await response.json();

			return data.meals || [];
		} catch (error) {
			console.error("Error searching meal by name: ", error);
			return [];
		}
	},

	// lookup full meal details by id
	getMealById: async (id) => {
		try {
			const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
			const data = await response.json();

			return data.meals ? data.meals[0] : null;
		} catch (error) {
			console.error("Error getting meal by id: ", error);
			return null;
		}
	},

	// lookup a single random meal
	getRandomMeal: async () => {
		try {
			const response = await fetch(`${BASE_URL}/random.php`);
			const data = await response.json();

			return data.meals ? data.meals[0] : null;
		} catch (error) {
			console.error("Error getting random meal : ", error);
			return null;
		}
	},

	// get multiple random meal
	getRandomMeals: async (count = 6) => {
		try {
			const promises = Array(count)
				.fill()
				.map(() => MealAPI.getRandomMeal());

			const meals = await Promise.all(promises);

			return meals.filter((meal) => meal !== null);
		} catch (error) {
			console.error("Error getting random meals : ", error);
			return [];
		}
	},

	// list all meal categories
	getCategories: async () => {
		try {
			const response = await fetch(`${BASE_URL}/categories.php`);
			const data = await response.json();

			const filterData = data.categories.filter(
				(c) => c.strCategory !== "Beef"
			);

			return filterData || [];
		} catch (error) {
			console.error("Error getting categories: ", error);
			return [];
		}
	},

	// filter by main ingredient
	filterByIngredient: async (ingredient) => {
		try {
			const response = await fetch(
				`${BASE_URL}/filter.php?i=${encodeURIComponent(ingredient)}`
			);
			const data = await response.json();

			return data.meals || [];
		} catch (error) {
			console.error("Error filtering by ingredient: ", error);
			return [];
		}
	},

	// filter by category
	filterByCategory: async (category) => {
		try {
			const response = await fetch(
				`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`
			);
			const data = await response.json();

			return data.meals || [];
		} catch (error) {
			console.error("Error filtering by category': ", error);
			return [];
		}
	},

	// transform TheMealDB meal data to out app format
	transformMealData: (meal) => {
		if (!meal) return null;

		// extract ingredients from meal object
		const ingredients = [];

		for (let i = 1; i <= 20; i++) {
			const ingredient = meal[`strIngredient${i}`];
			const measure = meal[`strMeasure${i}`];

			if (ingredient && ingredient.trim()) {
				const measureText =
					measure && measure.trim() ? `${measure.trim()}` : "";

				ingredients.push(`${measureText}${ingredient.trim()}`);
			}
		}

		// extract instructions
		const instructions = meal.strInstructions
			? meal.strInstructions.split(/\r?\n/).filter((step) => step.trim())
			: [];

		return {
			id: meal.idMeal,
			title: meal.strMeal,
			description: meal.strInstructions
				? meal.strInstructions.substring(0, 120) + "..."
				: "Delicious meal from TheMealDB",
			image: meal.strMealThumb,
			cookTime: "30 minutes",
			servings: 4,
			category: meal.strCategory || "Main Course",
			area: meal.strArea,
			ingredients: ingredients,
			instructions: instructions,
			originalData: meal,
		};
	},
};
