const light1 = document.querySelector(".light1");
const light2 = document.querySelector(".light2");
const podium = document.querySelector(".podium");

window.onload = function () {
    setTimeout(function () {
        light1.classList.remove("dn");
        podium.style.opacity = 0.5;
    }, 2000);
    setTimeout(function () {
        light2.classList.remove("dn");
        podium.style.opacity = 1;
    }, 4000);
};
const tg = document.querySelector(".tg");
const linkedin = document.querySelector(".in");
const github = document.querySelector(".github");
const colorVar1 = document.querySelectorAll(".colorVar1");
const colorVar2 = document.querySelectorAll(".colorVar2");

tg.addEventListener("mouseover", function () {
    colorVar1.forEach((e) => {
        e.classList.add("colorVar1__tg");
        e.classList.remove("colorVar1__in");
        e.classList.remove("colorVar1__github");
    });
    colorVar2.forEach((e) => {
        e.classList.add("colorVar2__tg");
        e.classList.remove("colorVar2__in");
    });
});
linkedin.addEventListener("mouseover", function () {
    colorVar1.forEach((e) => {
        e.classList.add("colorVar1__in");
        e.classList.remove("colorVar1__tg");
        e.classList.remove("colorVar1__github");
    });
    colorVar2.forEach((e) => {
        e.classList.add("colorVar2__in");
        e.classList.remove("colorVar2__tg");
    });
});
github.addEventListener("mouseover", function () {
    colorVar1.forEach((e) => {
        e.classList.add("colorVar1__github");
        e.classList.remove("colorVar1__tg");
        e.classList.remove("colorVar1__in");
    });
    colorVar2.forEach((e) => {
        e.classList.add("colorVar2__github");
        e.classList.remove("colorVar2__tg");
        e.classList.remove("colorVar2__in");
    });
});
