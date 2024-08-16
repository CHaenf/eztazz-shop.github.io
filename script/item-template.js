import {storedEmail, storedUid, isUserAuthenticated, getCookie, cart, showHeaderAccount} from "./firebase-index.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getFirestore,
    setDoc,
    collection,
    getDocs,
    arrayUnion,
    updateDoc,
    getDoc,
    doc,
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
const userRef = collection(db, "users");

if (isUserAuthenticated()) {
    showHeaderAccount();
    const clothesCartRef = doc(db, "users", storedEmail);
    const docSnap = await getDoc(clothesCartRef);
    const clothesInCart = docSnap.data().Cart;
    const cartItems = document.createElement("div");
    cartItems.className = "Cart__items";
    cart.appendChild(cartItems);
    let totalCost = 0;
    if (clothesInCart == undefined) {
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
            <a href="/clothe_pages/item-template.html?item=${itemDoc.id}">
                <img class="Cart__image" src="${data.img}" alt="img">
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
const footerObserverOptions = {
    threshold: 1,
};

const header = document.querySelector(".header_buttons");
const footer = document.querySelector(".footer__links");

const footerObserver = new IntersectionObserver(function (e) {
    e.forEach((el) => {
        if (el.isIntersecting) {
            header.classList.add("header_buttons--footer");
            document.getElementById("header").style.top = "1rem";
        } else {
            header.classList.remove("header_buttons--footer");
            document.getElementById("header").style.top = "2rem";
        }
    });
}, footerObserverOptions);
window.onload = setTimeout(() => {
    footerObserver.observe(footer);
}, 1000);

// display item
function loadItem(itemId) {
    const itemDocRef = doc(db, "Clothes", itemId);
    getDoc(itemDocRef).then((docItem) => {
        const data = docItem.data();
        const item = document.querySelector(".item");
        item.innerHTML = "";
        item.innerHTML = `
        <div class="image">
        <img src="${data.img}" alt="IMAGE">
        </div>
     <div class="description">
        <h1>${data.Name}</h1>
        <h2>${data.Color}</h2>
        <h3>${data.Cost}$</h3>
        <p>${data.Descr}</p>
        <button  data-item-id="${itemId}" class="item__add">Add to cart</button>
    </div>`;
        const addBtn = document.querySelector(".item__add");
        addBtn.addEventListener("click", async (event) => {
            const itemId = event.target.getAttribute("data-item-id");
            const user = auth.currentUser;
            if (user) {
                try {
                    const userCartRef = doc(db, "users", storedEmail);
                    await updateDoc(userCartRef, {
                        Cart: arrayUnion(itemId),
                    });
                    addBtn.textContent = "In Cart";
                } catch (error) {
                    console.error("Error adding item to cart: ", error);
                }
            } else {
                console.log("User is not signed in");
            }
        });
    });
}

const urlParams = new URLSearchParams(window.location.search);
const itemId = urlParams.get("item");
loadItem(itemId);
// remove item
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
