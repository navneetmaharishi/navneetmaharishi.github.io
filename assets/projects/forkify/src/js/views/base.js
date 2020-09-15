export const elements = {
    searchBtn: document.querySelector(".search"),
    search: document.querySelector(".search__field"),
    resultList: document.querySelector(".results__list"),
    searchRes: document.querySelector(".results"),
    searchResPages: document.querySelector(".results__pages"),
    renderRecipe: document.querySelector(".recipe"),
    shopping: document.querySelector(".shopping__list"),
    likesMenu: document.querySelector(".likes__field"),
    likesList: document.querySelector(".likes__list"),
};

export const elementStrings = {
    loader: 'loader',
}

export const clearLoader = () => {
    const loader = document.querySelector(`.${elementStrings.loader}`);
    if (loader) loader.parentElement.removeChild(loader);
};

export const renderLoader = parent => {
    const loaderMarkup = `
        <div class="${elementStrings.loader}">
            <svg>
                <use href="img/icons.svg#icon-cw"></use>
            </svg>
        </div>`;
    
    parent.insertAdjacentHTML('afterbegin', loaderMarkup);
};