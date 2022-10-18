import View from "./View.js";

class SearchView extends View {
  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value.trim();
    this._clear();
    return query;
  }

  // Override
  addHandler(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }

  // Override
  _clear() {
    this._parentElement.querySelector(".search__field").value = "";
  }
}

export default new SearchView(".search");
