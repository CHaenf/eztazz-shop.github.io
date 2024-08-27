import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {getAnalytics} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-analytics.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
import {
    getFirestore,
    setDoc,
    collection,
    getDocs,
    doc,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-firestore.js";

// Initialize Firebase
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

// Sign-In Form
const signInForm = document.getElementById("signInForm");
signInForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        const user = userCredential.user;
        storeUserInfo(user, rememberMe);
        blockLogin.classList.add("hidden");
        blockSignup.classList.add("hidden");
        LoginButton.classList.add("hidden");
        SignupButton.classList.add("hidden");
        document.querySelector(".success__block").classList.toggle("hidden");
        setTimeout(function () {
            location.replace("/index.html");
        }, 1000);
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
    });
});

// Sign-Up Form
const signUpForm = document.getElementById("signUpForm");
signUpForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const email = document.getElementById("signUpForm__input").value;
    const password = document.getElementById("signUpForm__password").value;
    const rememberMeCheckbox = document.getElementById("rememberMe");
    const rememberMe = rememberMeCheckbox.checked;

    createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        var user = userCredential.user;
        storeUserInfo(user, rememberMe);
        const userDocRef = doc(db, "users", email);

        // Set document in the "users" collection with user's information
        setDoc(userDocRef, {
            email: user.email,
            uid: user.uid,
            createdAt: new Date(),
            isAdmin: false,
        });
        blockLogin.classList.add("hidden");
        blockSignup.classList.add("hidden");
        LoginButton.classList.add("hidden");
        SignupButton.classList.add("hidden");
        document.querySelector(".success__block").classList.toggle("hidden");
        setTimeout(function () {
            location.replace("/index.html");
        }, 1000);
    })
    .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
        // ..
    });
});

//   COOCKIE
function storeUserInfo(user, rememberMe) {
    const email = user.email;
    const uid = user.uid;

    if (rememberMe) {
        // Store email and uid in local storage or cookies
        setCookie("email", email, 7); // stores for 7 days
        setCookie("uid", uid, 7); // stores for 7 days
    } else {
        // Store in session storage if rememberMe is not checked
        sessionStorage.setItem("email", email);
        sessionStorage.setItem("uid", uid);
    }
}
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = name + "=" + value + ";expires=" + expires.toUTCString() + ";path=/";
}

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

function deleteCookie(name) {
    setCookie(name, "", -1);
}
window.onload = () => {
    const storedEmail = getCookie("email");
    const storedPassword = getCookie("password");

    if (storedEmail && storedPassword) {
        // Automatically log in the user
        // ...
    }
};

// LOGIN _ SIGN UP
const LoginButton = document.getElementById("linkLogin");
const SignupButton = document.getElementById("linkSignup");
const blockLogin = document.querySelector(".blockLogin");
const blockSignup = document.querySelector(".blockSignup");

SignupButton.addEventListener("click", function () {
    blockLogin.classList.add("hidden");
    blockSignup.classList.remove("hidden");
});
LoginButton.addEventListener("click", () => {
    blockLogin.classList.remove("hidden");
    blockSignup.classList.add("hidden");
});
