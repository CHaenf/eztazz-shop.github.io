const newsBtnOpen = document.getElementById("btn1");
const NewsModal = document.querySelector(".newsModal");
const newsOverlay = document.querySelector(".overflowModal");
const NewsModalClose = document.querySelector(".newsModal__close");

newsBtnOpen.addEventListener("click", function () {
    NewsModal.classList.add("showNews");
    newsOverlay.classList.toggle("hidden");
});

newsOverlay.addEventListener("click", function () {
    NewsModal.classList.remove("showNews");
    newsOverlay.classList.toggle("hidden");
});
NewsModalClose.addEventListener("click", function () {
    NewsModal.classList.remove("showNews");
    newsOverlay.classList.toggle("hidden");
});
