import previewView from "./PreviewView.js";
import View from "./View.js";

class BookmarksView extends View {
  // Override
  _generateMarkup() {
    return this._data.map(bookmark => previewView.render(bookmark, false)).join("");
  }

  // Override
  addHandler(handler) {
    window.addEventListener("load", handler);
  }
}

export default new BookmarksView(
  ".bookmarks__list",
  "",
  "No bookmarks yet. Find a nice recipe and bookmark it :)"
);
