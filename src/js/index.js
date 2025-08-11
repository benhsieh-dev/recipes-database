import Search from './models/Search'; 
import * as searchView from './views/searchView';
import { elements, renderLoader, clearLoader } from './views/base';
import './../styles/app.css';
import './../styles/appStyles.scss'; 

import '@fortawesome/fontawesome-free/js/all'; 
import axios from './axios-orders'; 


const state = {}; 

const constrolSearch = async () => {
  elements.favorites.innerHTML = '';
    const query = searchView.getInput();

    if (query) {
        state.search = new Search(query); 
        searchView.clearInput(); 
        searchView.clearResults(); 
        renderLoader(elements.searchRes); 

        await state.search.getResults(); 
   
        clearLoader();
        searchView.renderResults(state.search.result); 
        landingData();
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

const toggleModal = () => {
  elements.modal.classList.toggle('modal--hidden'); 
}

elements.help.addEventListener('click', toggleModal);
elements.closeModal.addEventListener('click', toggleModal); 


const landingData = () => {
  elements.favorites.innerHTML = '';
  axios
    .get("/recipes.json")
    .then((res) => {
      let keys = Object.keys(res.data);
      for (let i = 0; i < keys.length; i++) {
        let k = keys[i];
        const favoriteRecipes = `
            <div class="recipes_cards">
                <div class="recipe_card">   
                    <img class="recipe_card_image" src="${
                      res.data[k].image
                    }.jpg" alt="${res.data[k].label}">
                    <div class="recipe_card_content">
                    <h2 class="recipe-label">${res.data[k].label}</h2>
                    <p>
                      <h4>Ingredients</h4>
                      <ul>
                          ${res.data[k].ingredients
                            .map(
                              (ingredient) =>
                                `<li>${ingredient.text}</li><li>${ingredient.weight} g</li>`
                            )
                            .join("")}
                      </ul>
                    </p>
                    </div>
                    <div class="recipe_card_info">
                        <div>
                          <a href='#' class='like unfav-heart' data-fav-recipe=${k}>
                            <i class="fa fa-heart" aria-hidden="true"></i>
                          </a>
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
        document.querySelector(`[data-fav-recipe="${k}"]`)
        .addEventListener("click", function(event) {
          event.preventDefault();
          const oneRecord = firebase.database().ref('recipes/' + k)
          oneRecord.remove()
            .then(function() {
              // console.log("Remove succeeded.")
              landingData();
            })
            .catch(function(error) {
              console.log("Remove failed", error)
            })
        });
      }
    })
    .catch((error) => {
      console.log(error);
    });
};

document.addEventListener("DOMContentLoaded", function() {
    landingData();
});

