import axios from 'axios'

export default class Recipe {
    constructor(id) {
        this.id = id;
    };

    async getRecipe() {
        try {
            const res = await axios(`https://forkify-api.herokuapp.com/api/get?rId=${this.id}`);
            this.title = res.data.recipe.title;
            this.img = res.data.recipe.image_url;
            this.recipeId = res.data.recipe.recipe_id;
            this.ingredients = res.data.recipe.ingredients;
            this.publisher = res.data.recipe.publisher;
            this.publisherURL = res.data.recipe.publisher_url;
            this.socialRank = res.data.recipe.social_rank;
            this.sourceURL = res.data.recipe.source_url;
        } catch (error) {
            alert(`Something went wrong : ${error}`);
        }
    };

    calcTime() {
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    };

    calcServings() {
        this.servings = 4;
    };

    parseIngredients() {
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g'];

        const newIngredients = this.ingredients.map(el => {

            // 1) Uniform units

            let ingredient = el.toLowerCase();

            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses

            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count,unit and ingredient

            const arrIng = ingredient.split(' ');
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2));

            let obj;
            if (unitIndex > -1) {
                // there is a unit

                const arrCount = arrIng.slice(0, unitIndex);
                let count;
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }

                obj = {
                    count,
                    unit: arrIng[unitIndex],
                    ingredient: arrIng.slice(0, unitIndex + 1).join(' ')
                }

            } else if (parseInt(arrIng[0], 10)) {
                // there is no unit,but 1st element is number
                obj = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }

            } else if (unitIndex === -1) {
                // there is no a unit
                obj = {
                    count: 1,
                    unit: '',
                    ingredient
                }
            };

            return obj;
        });
        this.ingredients = newIngredients;
    };

    updateServings(type) {

        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;

        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings;
    };
};