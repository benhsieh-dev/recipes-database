// Favorites functionality (extracted from old bundle.js)
window.FavoritesManager = {
    
    async loadFavorites() {
        try {
            console.log('Loading favorites from Firebase...');
            const snapshot = await firebase.database().ref('recipes').once('value');
            const data = snapshot.val();
            
            if (!data) {
                document.querySelector('.favorites').innerHTML = '<p style="text-align:center; padding:20px; color:#666;">No favorite recipes yet. Search and save some recipes!</p>';
                return;
            }
            
            const favoritesContainer = document.querySelector('.favorites');
            favoritesContainer.innerHTML = '';
            
            Object.keys(data).forEach(key => {
                const recipe = data[key];
                const favoriteCard = `
                    <div class="recipes_cards">
                        <div class="recipe_card">
                            <img class="recipe_card_image" src="${recipe.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='}" 
                                 alt="${recipe.label}" 
                                 onerror="this.onerror=null; this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2RkZCIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwsc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5OSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPk5vIEltYWdlPC90ZXh0Pjwvc3ZnPg=='"
                            <div class="recipe_card_content">
                                <h2 class="recipe-label">${recipe.label}</h2>
                                <p>
                                    <h4>Ingredients</h4>
                                    <ul>
                                        ${(recipe.ingredientLines || []).map(ingredient => `<li>${ingredient}</li>`).join('')}
                                    </ul>
                                </p>
                            </div>
                            <div class="recipe_card_info">
                                <div>
                                    <a href="#" class="like unfav-heart" data-fav-recipe="${key}">
                                        <i class="fa fa-heart" aria-hidden="true"></i>
                                    </a>
                                </div>
                                <div>
                                    <a href="${recipe.url}" class="recipe_card_link" target="_blank">View Article</a>
                                </div>
                            </div>
                        </div>
                    </div>
                `;
                favoritesContainer.innerHTML += favoriteCard;
            });
            
            // Add remove functionality
            document.querySelectorAll('[data-fav-recipe]').forEach(btn => {
                btn.addEventListener('click', async function(e) {
                    e.preventDefault();
                    const recipeId = this.getAttribute('data-fav-recipe');
                    
                    try {
                        await firebase.database().ref('recipes/' + recipeId).remove();
                        console.log('Recipe removed from favorites');
                        setTimeout(() => window.FavoritesManager.loadFavorites(), 500);
                    } catch (error) {
                        console.error('Failed to remove favorite:', error);
                    }
                });
            });
            
        } catch (error) {
            console.error('Error loading favorites:', error);
            document.querySelector('.favorites').innerHTML = '<p style="text-align:center; padding:20px; color:#666;">Unable to load favorites. Please try again later.</p>';
        }
    },
    
    async addFavorite(recipe) {
        try {
            await firebase.database().ref('recipes').push(recipe);
            console.log('Recipe added to favorites');
            this.loadFavorites();
            return true;
        } catch (error) {
            console.error('Failed to add favorite:', error);
            return false;
        }
    }
};

// Auto-load favorites when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Wait a bit for Firebase to initialize
    setTimeout(() => {
        if (window.firebase) {
            window.FavoritesManager.loadFavorites();
        }
    }, 1000);
});