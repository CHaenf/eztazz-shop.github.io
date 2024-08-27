// Videos auto-play and fade-out
const videoCollection = document.querySelector(".videoCollection");
const videoCollection__video = document.querySelector(".videoCollection__video");

document.addEventListener("DOMContentLoaded", (event) => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                videoCollection__video.play();
                videoCollection__video.classList.remove("endedVideo");
                logo.style.opacity = "0.3";
            } else {
                videoCollection__video.pause();
                logo.style.opacity = "1";
            }
        });
    });

    observer.observe(videoCollection);
});

videoCollection__video.addEventListener("ended", function () {
    videoCollection__video.classList.add("endedVideo");
});
// Videos auto-play and fade-out END

// Modal privacy policy
const ModalPrivacy = document.querySelector(".modal");
const CloseModal = document.querySelector(".modalClose");
const ModalOverflow = document.querySelector(".modal-content");
window.addEventListener("DOMContentLoaded", () => {
    getCookie("modalHidden") == null ? (ModalPrivacy.style.display = "block") : hidePrivacy();
});
CloseModal.addEventListener("click", hidePrivacy);
function hidePrivacy() {
    ModalPrivacy.style.display = "none";
    setTimeout(function () {
        let logo__a = document.getElementById("logo__a");
        let logo = document.getElementById("logo");
        logo.classList.add("centered");
        logo__a.classList.add("centered");
    }, 500);
    document.cookie = "modalHidden=true";
}
ModalOverflow.addEventListener("click", hidePrivacy);

// Sale Timer start
const Sale = {
    Discount: document.querySelectorAll(".discount_price"),
    SaleDate: document.querySelector(".sale__date"),
    StockPrice: document.querySelectorAll(".normal_price"),
    SaleInfo: document.querySelector(".sale"),
};

const endDiscount = new Date();
endDiscount.setHours(endDiscount.getHours() + 99999);
endDiscount.setMinutes(endDiscount.getMinutes() + 0);

const UpdateCountDown = () => {
    const now = new Date();
    const remainingTime = endDiscount - now;
    const {hours, minutes, seconds} = {
        hours: String(Math.floor(remainingTime / (1000 * 60 * 60))).padStart(2, "0"),
        minutes: String(Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60))).padStart(2, "0"),
        seconds: String(Math.floor((remainingTime % (1000 * 60)) / 1000)).padStart(2, "0"),
    };
    Sale.SaleDate.textContent = `${hours} h ${minutes} m ${seconds} s`;
    if (remainingTime < 0) {
        clearInterval(intervalValid);
        Sale.Discount.forEach((element) => {
            element.style.display = "none";
        });
        Sale.StockPrice.forEach((item) => {
            item.style.textDecoration = "none";
        });
        Sale.SaleInfo.textContent = "Sale Ended";
    }
};
UpdateCountDown();
const intervalValid = setInterval(UpdateCountDown, 1000);

// // FIREBASE
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

// // FETCH DATA
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
    const clothesList = document.querySelector(".image-track");

    clothesSnapshot.forEach((doc) => {
        const data = doc.data();
        const clothesCard = document.createElement("a");

        clothesCard.innerHTML = `
        <a href="clothe_pages/${data.Name}.html" target="_blank">
        <img src="${data.img}" alt="${data.Name}">
        <div class="discount"><b class="normal_price">3199$</b>
        <span class="discount_price">${data.Cost}$</span>
        </div></a>`;

        clothesList.appendChild(clothesCard);
    });
}

// Call the function to display the clothes on page load
window.onload = displayClothes;
import {
    storedEmail,
    storedUid,
    isUserAuthenticated,
    getCookie,
    cart,
    cartRemoveItem,
    showCartContent,
    showHeaderAccount,
    deleteCookie,
    showAccountLink,
} from "./firebase-index.js";

window.onload = cartRemoveItem();
// if (isUserAuthenticated()) {
//     const clothesCartRef = doc(db, "users", storedEmail);
//     const docSnap = await getDoc(clothesCartRef);
//     const clothesInCart = docSnap.data().Cart;
//     const cartItems = document.createElement("div");
//     cartItems.className = "Cart__items";
//     cart.appendChild(cartItems);
//     let totalCost = 0;
//     if (clothesInCart.length === 0) {
//         const noCartItems = document.createElement("div");
//         noCartItems.className = "Cart__Noitems";
//         cart.appendChild(noCartItems);
//         noCartItems.textContent = "No items in cart";
//         document.querySelector(".Total__count").style.display = "none";
//         document.querySelector(".Cart__link").style.display = "none";
//     } else {
//         for (const itemId of clothesInCart) {
//             const itemRef = doc(db, "Clothes", itemId);
//             const itemDoc = await getDoc(itemRef);
//             const data = itemDoc.data();

//             const cartItem = document.createElement("div");
//             cartItem.className = "Cart__item";
//             cartItem.innerHTML = `
//             <a href="/clothe_pages/${itemDoc.id}.html">
//                 <img class="Cart__image" src="${data.img}" alt="img">
//                 <div class="Cart__content">
//                     <h4>${data.Name}</h4>
//                     <p>$${data.Cost}</p>
//                 </div>
//             </a>
//             <button class="Cart__item--btn" data-item-id="${itemDoc.id}">&#128937;</button>

//             `;
//             totalCost += data.Cost;

//             document.querySelector(".Total__count").textContent = `Total: ${totalCost}$`;
//             cartItems.appendChild(cartItem);
//             cart.insertBefore(cartItems, cart.firstChild);
//         }
//     }
// } else {
//     const noCartItems = document.createElement("div");
//     noCartItems.className = "Cart__Noitems";
//     cart.appendChild(noCartItems);
//     noCartItems.textContent = "No items in cart";
//     document.querySelector(".Total__count").style.display = "none";
//     document.querySelector(".Cart__link").style.display = "none";
// }
// Show header on footer start
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
// benefits brightness
const benefitsObserverOptions = {
    threshold: 0.5,
};
const materialsBenefits = document.querySelectorAll(".materials__benefit");
const benefitsObserver = new IntersectionObserver(function (e) {
    e.forEach((el) => {
        if (el.isIntersecting) {
            el.target.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
        } else {
            el.target.style.backgroundColor = "transparent";
        }
    });
}, benefitsObserverOptions);

materialsBenefits.forEach((e) => {
    benefitsObserver.observe(e);
});

showCartContent();
showHeaderAccount();
document.addEventListener("DOMContentLoaded", function () {
    // Use event delegation to ensure the button click is captured even if buttons are loaded dynamically
    document.body.addEventListener("click", async function (event) {
        if (event.target.classList.contains("Cart__item--btn")) {
            const itemId = event.target.getAttribute("data-item-id");
            try {
                const userCartRef = doc(db, "users", storedEmail);
                await updateDoc(userCartRef, {
                    Cart: arrayRemove(itemId),
                });
                location.reload();
                // Optionally, remove the item from the DOM or update the UI
            } catch (error) {
                console.error("Error deleting item from cart: ", error);
            }
        }
    });
});
