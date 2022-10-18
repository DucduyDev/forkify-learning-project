import * as Model from "./model.js";
import recipeView from "./views/RecipeView.js";
import searchView from "./views/SearchView.js";
import resultsView from "./views/ResultsView.js";
import paginationView from "./views/PaginationView.js";
import bookmarksView from "./views/BookmarksView.js";
import addRecipeView from "./views/AddRecipeView.js";

import { MODAL_CLOSE_SECONDS } from "./config.js";

import "core-js/stable";
import "regenerator-runtime/runtime";

// Subscriber => code that wants to react => code executed when the event happens
const controlRecipe = async function () {
  try {
    // Render default message when a recipe loaded (ResultsView)
    if (Model.getSearchResultsPage().length === 0) {
      resultsView.renderMessage();
    }

    // Render default message when a recipe loaded (RecipeView)
    recipeView.renderMessage();

    // Get id from url
    const id = location.hash.slice(1);
    if (!id) return;

    // Active recipe
    resultsView.update(Model.getSearchResultsPage());
    bookmarksView.update(Model.state.bookmarks);

    // Render spinner
    recipeView.renderSpinner();

    // Load recipe from the API
    await Model.loadRecipe(id);

    //Render recipe to the View
    recipeView.render(Model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

// SEARCH
const controlSearchRecipes = async function () {
  try {
    // Get keyword from the View
    const keywork = searchView.getQuery();
    if (!keywork) return;

    // Render spinner
    resultsView.renderSpinner();

    // Load recipes from the Model
    await Model.loadSearchRecipes(keywork);

    // Render recipes to the View
    resultsView.render(Model.getSearchResultsPage());

    // Render pagination buttons
    paginationView.render(Model.state.search);
  } catch (err) {
    resultsView.renderErrorMessage();
  }
};

// PAGINATION
const controlPagination = function (goToPage) {
  resultsView.render(Model.getSearchResultsPage(goToPage));
  paginationView.render(Model.state.search);
};

// CHANGE SERVINGS
const controlServings = function (newServings) {
  Model.updateServing(newServings);
  recipeView.update(Model.state.recipe);
};

// BOOKMARK
const controlAddBookmark = function () {
  // Add / remove bookmark
  if (!Model.state.recipe.bookmarked) {
    Model.bookmark(Model.state.recipe);
  } else {
    Model.unbookmark(Model.state.recipe.id);
  }

  // Update RecipeView
  recipeView.update(Model.state.recipe);

  // Render bookmarks
  if (Model.state.bookmarks.length === 0) {
    bookmarksView.renderMessage();
  } else {
    bookmarksView.render(Model.state.bookmarks);
  }
};

const controlBookmarks = function () {
  if (Model.state.bookmarks.length === 0) {
    bookmarksView.renderMessage();
  } else {
    bookmarksView.render(Model.state.bookmarks);
  }
};

const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();

    await Model.uploadRecipe(newRecipe);

    // Render recipe
    recipeView.render(Model.state.recipe);

    // Success message
    addRecipeView.renderMessage();

    // Render BookmarkView
    bookmarksView.render(Model.state.bookmarks);

    // Change ID in URL
    history.pushState(null, "", `#${Model.state.recipe.id}`);

    // Close the form after seconds
    setTimeout(() => {
      location.reload();
    }, MODAL_CLOSE_SECONDS * 1000);
  } catch (err) {
    addRecipeView.renderErrorMessage(err.message);
    setTimeout(() => {
      location.reload();
    }, MODAL_CLOSE_SECONDS * 1000);
  }
};

const init = function () {
  // Subscribe control function to addHandler function
  // As soon as the publisher publishes an event => the subscriber will get called
  bookmarksView.addHandler(controlBookmarks);
  recipeView.addHandler(controlRecipe);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandler(controlSearchRecipes);
  paginationView.addHandler(controlPagination);
  addRecipeView.addHandler(controlAddRecipe);
};
init();
