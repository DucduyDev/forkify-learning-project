import previewView from "./PreviewView.js";
import View from "./View.js";

class ResultsView extends View {
  // Override
  _generateMarkup() {
    return this._data.map(recipe => previewView.render(recipe, false)).join("");
  }
}

export default new ResultsView(
  ".results",
  "No recipes found for your query! Please try another one ;)",
  "Search for more recipes ;) "
);
