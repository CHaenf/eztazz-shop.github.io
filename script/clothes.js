// GRID COLUMN TOGGLE
const showbtn = document.querySelector(".clothes__show");
const clothesGrid = document.querySelector(".clothes__grid");

showbtn.addEventListener("click", function () {
    clothesGrid.classList.toggle("clothes__grid6");
    if (clothesGrid.classList.contains("clothes__grid6")) {
        showbtn.textContent = "SHOW BY 3";
    } else {
        showbtn.textContent = "SHOW BY 6";
    }
});

// FILTER

const filterDropdownBtn = document.querySelector(".clothes__filter--btn");
const filterDropdown = document.querySelector(".clothes__filter--dropdown");
const filterDropdownClose = document.querySelector(".clothes__filter--dropdown-close");
const overlay = document.querySelector(".overlay");

filterDropdownBtn.addEventListener("click", function () {
    filterDropdown.classList.toggle("dropdownClosed");
    overlay.classList.toggle("dn");
});

filterDropdownClose.addEventListener("click", function () {
    filterDropdown.classList.toggle("dropdownClosed");
    overlay.classList.toggle("dn");
});

overlay.addEventListener("click", function () {
    filterDropdown.classList.toggle("dropdownClosed");
    overlay.classList.toggle("dn");
});
const colorFilterBtn = document.querySelector(".clothes__filter--color-btn");
const colorVariable = document.querySelectorAll(".color_variable");

colorFilterBtn.addEventListener("click", function () {
    colorVariable.forEach((e) => {
        e.classList.toggle("color__hide");
    });
});
// FIREBASE
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getFirestore,
    setDoc,
    collection,
    getDocs,
    doc,
    arrayUnion,
    updateDoc,
    getDoc,
    arrayRemove,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";
import {getAuth} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
const firebaseConfig = {
    apiKey: "AIzaSyBKB3E5gCcdUuxtdHNBWLvGM29yPRTubVs",
    authDomain: "extaz-shop.firebaseapp.com",
    projectId: "extaz-shop",
    storageBucket: "extaz-shop.appspot.com",
    messagingSenderId: "302412331942",
    appId: "1:302412331942:web:b6d9d58eacf420254e2d67",
    measurementId: "G-2GPC56BSDG",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const clothesRef = collection(db, "Clothes");

// FETCH DATA
async function fetchClothesData() {
    try {
        const clothesSnapshot = await getDocs(clothesRef);
        const clothesList = clothesSnapshot.docs.map((doc) => doc.data());
    } catch (error) {
        console.error("Error fetching clothes data:", error);
    }
}
fetchClothesData();

// Function to fetch and display clothes data
async function displayClothes() {
    const clothesRef = collection(db, "Clothes");
    const clothesSnapshot = await getDocs(clothesRef);
    const clothesList = document.querySelector(".clothes__grid");

    clothesSnapshot.forEach((doc) => {
        const data = doc.data();
        const clothesCard = document.createElement("li");
        clothesCard.className = "clothes__card";

        clothesCard.innerHTML = `
            <a  href="/clothe_pages/item-template.html?item=${doc.id}">
                <img src="..${data.img}" alt="${data.Name}" class="clothes__card--img">
                <div class="clothes__card--content">
                    <h3>${data.Name}</h3>
                    <p>$${data.Cost}</p>
                    <button type="button" data-item-id="${doc.id}" class="clothes__card--btn">Add to cart</button>
                </div>
            </a>
        `;

        clothesList.appendChild(clothesCard);
    });
    attachCartButtonListeners();
}
// Call the function to display the clothes on page load
window.onload = displayClothes;
// SEARCH
const searchShowBtn = document.querySelector(".search__btn");
const searchInupt = document.querySelector(".clothes__search");

searchShowBtn.addEventListener("click", function (event) {
    searchInupt.classList.toggle("hide__search");
    event.preventDefault();
});

// Cart items
import {
    storedEmail,
    storedUid,
    isUserAuthenticated,
    getCookie,
    cart,
    showCartContent,
    showHeaderAccount,
} from "./firebase-index.js";
showHeaderAccount();
if (isUserAuthenticated()) {
    const clothesCartRef = doc(db, "users", storedEmail);
    const docSnap = await getDoc(clothesCartRef);
    const clothesInCart = docSnap.data().Cart;
    const cartItems = document.createElement("div");
    cartItems.className = "Cart__items";
    cart.appendChild(cartItems);
    let totalCost = 0;
    if (clothesInCart.length === 0) {
        const noCartItems = document.createElement("div");
        noCartItems.className = "Cart__Noitems";
        cart.appendChild(noCartItems);
        noCartItems.textContent = "No items in cart";
        document.querySelector(".Total__count").style.display = "none";
        document.querySelector(".Cart__link").style.display = "none";
    } else {
        for (const itemId of clothesInCart) {
            const itemRef = doc(db, "Clothes", itemId);
            const itemDoc = await getDoc(itemRef);
            const data = itemDoc.data();

            const cartItem = document.createElement("div");
            cartItem.className = "Cart__item";
            cartItem.innerHTML = `
            <a href="./item-template.html?item=${itemDoc.id}">
                <img class="Cart__image" src="..${data.img}" alt="img">
                <div class="Cart__content">
                    <h4>${data.Name}</h4>
                    <p>$${data.Cost}</p>
                </div>
            </a>
            <button class="Cart__item--btn" data-item-id="${itemDoc.id}">&#128937;</button>

            `;
            totalCost += data.Cost;

            document.querySelector(".Total__count").textContent = `Total: ${totalCost}$`;
            cartItems.appendChild(cartItem);
            cart.insertBefore(cartItems, cart.firstChild);
        }
    }
} else {
    const noCartItems = document.createElement("div");
    noCartItems.className = "Cart__Noitems";
    cart.appendChild(noCartItems);
    noCartItems.textContent = "No items in cart";
    document.querySelector(".Total__count").style.display = "none";
    document.querySelector(".Cart__link").style.display = "none";
}

const form = document.querySelector("form");
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent form submission and page reload
});
function attachCartButtonListeners() {
    document.querySelectorAll(".clothes__card--btn").forEach((button) => {
        button.addEventListener("click", async (event) => {
            event.preventDefault();
            const itemId = event.target.getAttribute("data-item-id");
            const user = auth.currentUser;
            if (user) {
                try {
                    const userCartRef = doc(db, "users", storedEmail);
                    await updateDoc(userCartRef, {
                        Cart: arrayUnion(itemId),
                    });
                    const addedToCart = document.querySelector(".cartAdded");
                    addedToCart.style.transform = "translateX(0)";
                    setTimeout(() => {
                        addedToCart.style.transform = "translateX(120%)";
                    }, 2000);
                } catch (error) {
                    console.error("Error adding item to cart: ", error);
                }
            } else {
                console.log("User is not signed in");
            }
        });
    });
}
const footerObserverOptions = {
    threshold: 1,
};
const header = document.querySelector(".header_buttons");
const footer = document.querySelector(".footer__links");

const footerObserver = new IntersectionObserver(function (e) {
    e.forEach((el) => {
        if (el.isIntersecting) {
            header.classList.add("header_buttons--footer");
        } else {
            header.classList.remove("header_buttons--footer");
        }
    });
}, footerObserverOptions);
window.onload = setTimeout(() => {
    footerObserver.observe(footer);
}, 1000);
// remove from cart
document.querySelectorAll(".Cart__item--btn").forEach((button) => {
    button.addEventListener("click", async (event) => {
        const itemId = event.target.getAttribute("data-item-id");
        try {
            const userCartRef = doc(db, "users", storedEmail);
            await updateDoc(userCartRef, {
                Cart: arrayRemove(itemId),
            });
            location.reload();
        } catch (error) {
            console.error("Error deleting item of cart: ", error);
        }
    });
});
