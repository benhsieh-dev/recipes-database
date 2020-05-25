import Search from './models/Search'; 
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
import './../styles/app.css';
import './../styles/appStyles.scss'; 

import '@fortawesome/fontawesome-free/js/all'; 
import axios from './axios-orders'; 


const state = {}; 

const constrolSearch = async () => {
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query); 
        searchView.clearInput(); 
        searchView.clearResults(); 
        renderLoader(elements.searchRes); 

        await state.search.getResults(); 
   
        clearLoader();
        searchView.renderResults(state.search.result); 
    }
}

elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    constrolSearch();
});

elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest(".btn-inline");
    if (btn) {
        const goToPage = parseInt(btn.dataset.goto, 10); 
        searchView.clearResults(); 
        searchView.renderResults(state.search.result, goToPage); 
    }
}); 

const getData = () => {
  axios
    .get("/recipes.json")
    .then((res) => {
      let keys = Object.keys(res.data);
      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        const favoriteRecipes = `
            <div class="recipes_cards">
                <div class="recipe_card">   
                    <h2>${res.data[k].label}</h2>
                    <img class="recipe_card_image" src="${
                      res.data[k].image
                    }" alt="${res.data[k].label}">
                    <div class="recipe_card_content">
                    <p>
                      <ul>
                          ${res.data[k].ingredients.map( ingredient => `<li>${ingredient.text}</li><li>${ingredient.weight} g</li>`).join("")}
                      </ul>
                    </p>
                    </div>
                    <div class="recipe_card_info">
                        <div>
                          <button>Delete</button>
                        </div>
                        <div>
                          <a href="${
                            res.data[k].url
                          }" class="recipe_card_link" target="_blank">View Article</a> 
                        </div>
                    </div>
                </div>
            </div>
        `;
        elements.favorites.insertAdjacentHTML("beforeend", favoriteRecipes);
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

document.addEventListener("DOMContentLoaded", function() {
    getData();
});