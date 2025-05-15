const input = document.getElementById('search-input');
const searchbar = document.getElementById("searchbar");

input.addEventListener("focus", () => {
    searchbar.classList.add("focused")
})

input.addEventListener("blur", () => {
    searchbar.classList.remove("focused")
})