import { elements } from './base'; 

import axios from '../axios-orders';

export const getInput = () => elements.searchInput.value; 

export const clearInput = () => {
    elements.searchInput.value = ''; 
};

export const clearResults = () => {
    elements.searchResList.innerHTML = '';
    elements.searchResPages.innerHTML = ''; 

};

const limitRecipeLabel = (label, limit = 10) => {
     
    const newLabel = [];
    if (label.length > limit) {
        label.split(' ').reduce((acc, cur) => {
            if (acc + cur.length <= limit) {
                newLabel.push(cur);
            }
            return acc + cur.length;
        }, 0); 
        return `${newLabel.join(' ')} ...`;
    }
    return label; 
}


const getData = () => {
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
                      res.data[k].image || 'https://via.placeholder.com/300x200?text=Recipe+Image'
                    }" alt="${res.data[k].label}" onerror="this.src='https://via.placeholder.com/300x200?text=Recipe+Image'">
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
        document
          .querySelector(`[data-fav-recipe="${k}"]`)
          .addEventListener("click", function(event) {
            event.preventDefault();
            const oneRecord = firebase.database().ref('recipes/' + k)
            oneRecord.remove()
              .then(function() {
                // console.log("Remove succeeded.");
                elements.favorites.innerHTML = "";
                setTimeout(function(){
                  getData();
                }, 500);
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

const searchFirebase = (url, idx) => 
{
     firebase
       .app()
       .database()
       .ref("recipes")
       .orderByChild("url")
       .equalTo(url)
       .once("value", (snapshot) => {
         if (snapshot.exists()) {
           const userData = snapshot.val();
          //  console.log("exists!", userData);
           document.querySelector(`[data-recipe-id="${idx}"]`)
           .classList.replace('fav-heart', 'unfav-heart'); 
         } else {
           return false; 
         }
       });
}


const renderRecipe = (recipe, idx) => {
    // Debug logging
    console.log('Recipe data:', recipe.recipe);
    console.log('Image URL:', recipe.recipe.image);
    
    const markup = `
    <div class="card">
        <img class="recipe_image" src="${
          recipe.recipe.image || 'https://via.placeholder.com/300x200?text=Recipe+Image'
        }" alt="${limitRecipeLabel(recipe.recipe.label)}" onerror="this.src='https://via.placeholder.com/300x200?text=Recipe+Image'">
            <div class="card_content">
               <a class="results_link" href="${
                 recipe.recipe.url
               }" target="_blank">
               <h4>${recipe.recipe.label}</h4>
        </a>
                <h4>Calories</h4>
                <p>${Math.ceil(recipe.recipe.calories)}</p>
                <h4>Health Labels</h4>
                <p>${recipe.recipe.healthLabels}</p>
                <h4>Ingredients</h4>
                <p>${recipe.recipe.ingredientLines}</p>
                <h4>Source: </h4>
                <p>${recipe.recipe.source}</p>
            </div>
            <div class="card_info">
                <div class="heart-btn">
                
                      <a href='#' class='like fav-heart' data-recipe-id=${idx}>
                        <i class="fa fa-heart" aria-hidden="true"></i>
                      </a>          
                </div>
                <div>
                    <a class="results_link" href="${
                      recipe.recipe.url
                    }" target="_blank">View Recipe Article</a>
                </div>
            </div>
        <div>
        </div>
    
    </div>
    `;
    elements.searchResList.insertAdjacentHTML('beforeend', markup); 
    searchFirebase(recipe.recipe.url, idx)
    document.querySelector(`[data-recipe-id="${idx}"]`)
        .addEventListener("click", function(event) {
          event.preventDefault();
            axios
              .post("/recipes.json", recipe.recipe)
              .then((response) => {
                // console.log(response)
                getData();
              })
              .then($(`[data-recipe-id="${idx}"]`).toggleClass("heart"))
              .then($(`[data-recipe-id="${idx}"]`).toggleClass("disabled-click"))
              .catch((error) => {
                console.log(error);
              });
        });
        document.querySelector(`[data-recipe-id="${idx}"]`)
        .addEventListener("click", function(event) {
          event.preventDefault();
          getData();
        });
};


const createButton = (page, type) => `
    <button class="btn-inline results_btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
    </button>
`;
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button;
    if (page === 1 && pages > 1) {
        button = createButton(page, 'next');
    } else if (page < pages) {
        button = `
            ${createButton(page, 'prev')}
            ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        button = createButton(page, "prev");   
    }
    elements.searchResPages.insertAdjacentHTML('afterbegin', button); 
}


export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    const start = (page - 1) * resPerPage;
    const end = page * resPerPage; 
    recipes.slice(start, end).forEach(renderRecipe);
    renderButtons(page, recipes.length, resPerPage); 
};



