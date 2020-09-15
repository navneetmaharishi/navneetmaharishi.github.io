// Global app controller
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List';
import Likes from './models/Likes';

import * as searchView from './views/searchView';
import * as recipeView from './views/recipeView';
import * as listView from './views/listView';
import * as likeView from './views/likeView';

import { elements, renderLoader, clearLoader } from './views/base';

const state = {};


// Search Control

const searchControl = async () => {
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query);

        searchView.clearFilter();
        searchView.clearResultList();
        renderLoader(elements.searchRes);

        try {
            await state.search.getResults();
            clearLoader();
            searchView.getResultList(state.search.result);
        } catch (error) {
            alert(`Something went wrong : ${error}`);
        };
    };
};

elements.searchBtn.addEventListener('submit', e => {
    e.preventDefault();
    searchControl();
});

elements.searchResPages.addEventListener('click', event => {
    const btn = event.target.closest('.btn-inline');
    if (btn) {
        const gotoPage = parseInt(btn.dataset.goto, 10);
        searchView.clearResultList();
        searchView.getResultList(state.search.result, gotoPage);
    };
});


// Recipe Control

const recipeControl = async () => {
    const id = window.location.hash.replace('#', '');

    if (id) {
        recipeView.clearRecipe();
        renderLoader(elements.renderRecipe);

        if (state.search) searchView.activeItem(id);
        state.recipe = new Recipe(id);
        try {
            await state.recipe.getRecipe();

            state.recipe.parseIngredients();
            state.recipe.calcTime();
            state.recipe.calcServings();
            clearLoader();
            recipeView.renderRecipe(state.recipe, state.likes.isLiked(id));
        } catch (error) {
            alert(`Something went wrong : ${error}`);
        };
    };
};

['hashchange', 'load'].forEach(cur => window.addEventListener(cur, recipeControl));


// List Control

const controlList = () => {
    if (!state.list) state.list = new List();
    state.recipe.ingredients.forEach(el => {
        const item = state.list.addItems(el.count, el.unit, el.ingredient);
        listView.renderItem(item);
    });
};


elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;

    if (e.target.matches('.shopping__delete,.shopping__delete *')) {
        state.list.deleteItem(id);
        listView.deleteItem(id);
    } else if (e.target.matches('.shopping__count--value')) {
        const val = parseFloat(e.target.value, 10);
        state.list.updateCount(id, val);
    };
});

// Like Control

const controlLike = () => {
    if (!state.likes) state.likes = new Likes();

    const currentID = state.recipe.id;

    if (!state.likes.isLiked(currentID)) {
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.publisher,
            state.recipe.img
        );
        likeView.toggleLikeBtn(true);
        likeView.renderLike(newLike);
    } else {
        state.likes.deleteLike(currentID);
        likeView.toggleLikeBtn(false);
        likeView.deleteLike(currentID);
    };

    likeView.toggleLikeMenu(state.likes.getNumLikes());
};

window.addEventListener('load', () => {
    state.likes = new Likes();
    state.likes.readStorage();

    likeView.toggleLikeMenu(state.likes.getNumLikes());
    state.likes.likes.forEach(like => likeView.renderLike(like));
});

// Handing recipe button clicks

elements.renderRecipe.addEventListener('click', e => {
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        if (state.recipe.servings > 1) {
            state.recipe.updateServings('dec');
            recipeView.updateServingsUI(state.recipe);
        };
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        state.recipe.updateServings('inc');
        recipeView.updateServingsUI(state.recipe);
    } else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        controlList();
    } else if (e.target.matches('.recipe__love, .recipe__love *')) {
        controlLike();
    };
});