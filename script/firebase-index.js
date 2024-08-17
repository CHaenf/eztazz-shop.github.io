// FIREBASE
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getFirestore,
    setDoc,
    collection,
    getDocs,
    doc,
    getDoc,
    updateDoc,
    arrayRemove,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

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

export function getCookie(name) {
    const nameEQ = name + "=";
    const ca = document.cookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) === " ") c = c.substring(1);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
}
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}
export const showAccount = document.querySelector(".account__content");
export let storedEmail;
export let storedUid;

export function isUserAuthenticated() {
    storedEmail = getCookie("email");
    storedUid = getCookie("uid");
    return !!(storedEmail && storedUid);
}
export function ShowHeaderAccount() {
    document.addEventListener("DOMContentLoaded", () => {
        if (isUserAuthenticated()) {
            // Display protected content
            showAccount.classList.add("signed");
            showAccount.innerHTML = `
            <li>${storedEmail}</li>
            <li><a href="./clothe_pages/settings.html">Settings</a></li>
            <li><button onclick="logout()">Log Out</button></li>
            `;
        } else {
            showAccount.innerHTML = `<li><a href="./clothe_pages/login.html">Log In</a></li>
            <li><a href="./clothe_pages/login.html">Sign Up</a></li>
            `;
        }
    });
}
const showCart = document.querySelector(".header__cart");
export const cart = document.querySelector(".Cart");

showCart.addEventListener("mouseover", function () {
    cart.style.visibility = "visible";
    cart.style.top = "2rem";
    showAccount.style.visibility = "hidden";
    showAccount.style.top = "-400%";
    cart.addEventListener("mouseleave", function () {
        cart.style.top = "-600%";
        cart.style.visibility = "hidden";
    });
});
const showAccountLink = document.querySelector(".account");
showAccountLink.addEventListener("mouseover", function () {
    showAccount.style.visibility = "visible";
    showAccount.style.top = "4rem";
    cart.style.top = "-600%";
    cart.style.visibility = "hidden";
    showAccount.addEventListener("mouseleave", function () {
        showAccount.style.visibility = "hidden";
        showAccount.style.top = "-400%";
    });
});
const addToCart = document.querySelectorAll(".clothes__card--btn");
export function deleteCookie(name) {
    setCookie(name, "", -1);
}
export function cartRemoveItem() {
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
}

export async function showCartContent() {
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
                <a href="./clothe_pages/item-template.html?item=${itemDoc.id}">
                    <img class="Cart__image" src=".${data.img}" alt="img">
                    <div class="Cart__content">
                        <h4>${data.Name}</h4>
                        <p>$${data.Cost}</p>
                    </div>
                </a>
                <button  class="Cart__item--btn" data-item-id="${itemDoc.id}">&#128937;</button>
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
}

export function showHeaderAccount() {
    document.addEventListener("DOMContentLoaded", () => {
        if (isUserAuthenticated()) {
            // Display protected content
            showAccount.classList.add("signed");
            showAccount.innerHTML = `
            <li>${storedEmail}</li>
            <li><a href="/clothe_pages/settings.html">Settings</a></li>
            <li><button class="log__out">Log Out</button></li>
            `;
            const deleteCoockieBtn = document.querySelector(".log__out");
            deleteCoockieBtn.addEventListener("click", function () {
                deleteCookie("email");
                deleteCookie("uid");
                location.reload();
            });
        } else {
            showAccount.innerHTML = `<li><a href="/clothe_pages/login.html">Log In</a></li>
            <li><a href="/clothe_pages/login.html">Sign Up</a></li>
            `;
        }
    });
}
