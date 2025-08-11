# Recipes Database

Users can search for recipes by keyword in the categories of meals, desserts, or drinks.  

[Live Site](https://benhsieh-dev.github.io/recipes-database/)

## Technologies Used

* JavaScript
  - MVC framework
  - Axios to communicate with Firebase database
* Edmamam API
* HTML5
* CSS3
  - CSS grid 
  - flexbox
  - animation
* Open graph tags
* Firebase Database

Some of chanllenges that I ran into were as follows: 
 1. Trying to refresh favorite recipes page on each new favorite added. 
 2. Deleting an individual recipe from favorites without wiping out the entire database. 

I overcame these issues by using asychonous JavaScript functions and event listeners

```javascript
document
          .querySelector(`[data-fav-recipe="${k}"]`)
          .addEventListener("click", function(event) {
            event.preventDefault();
            const oneRecord = firebase.database().ref('recipes/' + k)
            oneRecord.remove()
              .then(function() {
                elements.favorites.innerHTML = "";
                setTimeout(function(){
                  getData();
                }, 500);
              })
              .catch(function(error) {
                console.log("Remove failed", error)
              })
          });
```
    
![ezgif com-optimize](https://user-images.githubusercontent.com/43966507/84585421-b5eff100-addd-11ea-816c-f2bf1af63fe9.gif)

![ezgif com-optimize (1)](https://user-images.githubusercontent.com/43966507/84696759-f30dcd80-af1a-11ea-9ffc-ce040d787838.gif)

## Future considerations

* Ability to post photos and add comments
* Ability to add ratings

## GH pages deployment script
npx gh-pages -d dist 
