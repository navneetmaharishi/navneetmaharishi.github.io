import { elements } from './base';

export const getInput = () => elements.search.value;

export const clearFilter = () => {
    elements.search.value = '';
};

export const clearResultList = () => {
    elements.resultList.innerHTML = '';
    elements.searchResPages.innerHTML = '';
};

export const setLimit = (title, limit = 17) => {
    const newTitle = []
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
            if (acc + cur.length < limit) {
                newTitle.push(cur)
            };
            return acc + cur.length;
        }, 0);

        return `${newTitle.join(' ')} ...`
    }
    return title;
};

const renderList = recipe => {
    const markup =
        `<li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${setLimit(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>`
    elements.resultList.insertAdjacentHTML('beforeend', markup);
};

const getNavBtn = (type, page) => `                
<button class="btn-inline results__btn--${type}" data-goto=${type === "prev" ? page - 1 : page + 1}>
<span>Page ${type === "prev" ? page - 1 : page + 1}</span>
<svg class="search__icon">
    <use href="img/icons.svg#icon-triangle-${type === "prev" ? "left" : "right"}"></use>
</svg>
</button>`

const renderBtn = (totalRecipes, pageNo, elPerPage) => {

    const pages = Math.ceil(totalRecipes / elPerPage);
    let button;

    if (pageNo === 1 && pages > 1) {
        button = getNavBtn("next", pageNo);
    } else if (pageNo < pages) {
        button = `${getNavBtn("next", pageNo)} ${getNavBtn("prev", pageNo)}`
    } else if (pageNo === pages && pages > 1) {
        button = getNavBtn("prev", pageNo);
    }

    elements.searchResPages.insertAdjacentHTML('afterbegin', button);
};

export const getResultList = (recipes, pageNo = 1, elPerPage = 10) => {
    const start = (pageNo - 1) * elPerPage;
    const end = pageNo * elPerPage;

    recipes.slice(start, end).forEach(renderList);

    renderBtn(recipes.length, pageNo, elPerPage);
};

export const activeItem = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link'));
    resultsArr.forEach(el => {
        el.classList.remove('results__link--active');
    });
    document.querySelector(`.results__link[href*='${id}']`).classList.add('results__link--active');
};