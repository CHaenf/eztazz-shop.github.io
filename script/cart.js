import {storedEmail, storedUid, isUserAuthenticated, getCookie, cart, showAccount} from "./firebase-index.js";
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
    FieldValue,
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
import {showHeaderAccount} from "./firebase-index.js";
showHeaderAccount();

// Cart
if (isUserAuthenticated()) {
    const clothesCartRef = doc(db, "users", storedEmail);
    const docSnap = await getDoc(clothesCartRef);
    const clothesInCart = docSnap.data().Cart;
    const cartItems = document.createElement("div");
    cartItems.className = "Cart__items";
    cart.appendChild(cartItems);
    let totalCost = 0;

    if (clothesInCart.length === 0) {
        const cartTitle = document.querySelector(".cart__title");
        cartTitle.textContent = "Your cart is empty";
    } else {
        for (const itemId of clothesInCart) {
            const itemRef = doc(db, "Clothes", itemId);
            const itemDoc = await getDoc(itemRef);
            const data = itemDoc.data();

            const cartItem = document.createElement("div");
            cartItem.className = "cart__card";
            cartItem.innerHTML = `
            <img src="..${data.img}" alt="image">
                               <button data-item-id="${itemDoc.id}" class="cart__card--btn">&#128937;</button>
                                <div class="cart__card--content">
                                    <a href="/clothe_pages/${itemDoc.id}" class="cart__card--name">${data.Name}</a>
                                    <p class="cart__card--cost">$${data.Cost}</p>
                                </div>
        
            `;
            totalCost += data.Cost;
            const cartItems = document.querySelector(".cart__grid");
            document.getElementById("total").textContent = `Total: ${totalCost}$`;
            cartItems.appendChild(cartItem);
        }
    }
}

// show payment
const cartPay = document.querySelector(".cart__pay");
const cartModal = document.querySelector(".pay");
const cartModalHide = document.querySelector(".pay__return");
cartPay.addEventListener("click", () => {
    cartModal.style.left = "0";
    cartModal.style.opacity = "1";
    cartModal.style.visibility = "visible";
    document.body.style.overflow = "hidden";
    cartPay.style.display = "none";
});
function hideModal() {
    cartModal.style.left = "100%";
    cartModal.style.opacity = "0";
    cartModal.style.visibility = "hidden";
    document.body.style.overflow = "auto";
    document.body.style.overflowX = "hidden";
    cartPay.style.display = "flex";
}
cartModalHide.addEventListener("click", hideModal);
document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" || event.key === "Esc") {
        hideModal();
    }
});
// toggle cc or crypto
const payCrypto = document.querySelector(".pay__crypto");
const payCc = document.querySelector(".pay__cc");
const payCryptoBtn = document.querySelector(".pay__crypto--btn");
const payCcBtn = document.querySelector(".pay__cc--btn");

payCryptoBtn.addEventListener("click", () => {
    payCrypto.style.display = "flex";
    payCc.style.display = "none";
});

payCcBtn.addEventListener("click", () => {
    payCc.style.display = "flex";
    payCrypto.style.display = "none";
});
document.querySelectorAll(".cart__card--btn").forEach((button) => {
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
// validate cc
function validateCreditCard(cardNumber) {
    // Remove any non-digit characters (spaces, dashes, etc.)
    cardNumber = cardNumber.replace(/\D/g, "");

    // Check if the card number has the appropriate length
    if (cardNumber.length < 13 || cardNumber.length > 19) {
        return false;
    }

    // Implement the Luhn algorithm to validate the card number
    let sum = 0;
    let shouldDouble = false;

    // Loop through the card number digits from right to left
    for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i));

        if (shouldDouble) {
            digit *= 2;
            if (digit > 9) {
                digit -= 9;
            }
        }

        sum += digit;
        shouldDouble = !shouldDouble;
    }

    // If the sum is divisible by 10, the card number is valid
    return sum % 10 === 0;
}
const ccInput = document.querySelector("#cardNumber");
ccInput.addEventListener("input", function () {
    if (validateCreditCard(ccInput.value)) {
        console.log(`qqqqqqqqqqq`);
        document.querySelector(".cardnumberLabel").textContent = "Card Number";
    } else {
        document.querySelector(".cardnumberLabel").textContent = "Card Number is invalid";
    }
});
