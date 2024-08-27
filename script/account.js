import {
    storedEmail,
    storedUid,
    isUserAuthenticated,
    showCartContent,
    showHeaderAccount,
    deleteCookie,
} from "./firebase-index.js";
import {initializeApp} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-app.js";
import {
    getAuth,
    deleteUser,
    EmailAuthProvider,
    reauthenticateWithCredential,
} from "https://www.gstatic.com/firebasejs/10.12.5/firebase-auth.js";
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
const auth = getAuth();
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(";");
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == " ") {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

if (getCookie("email").length > 2) {
    document.body.innerHTML = `
    <section class="settings">
    <h1 id="hi">Good day, user</h1>
    <ul>
        <li><h3 id="email">example@gmail.com</h3></li>
        <li><button id="AccountDelete">Delete account</button></li>
        <li><button id="logout">Log Out</button></li>
        <li><a href="/index.html">Back</a></li>
    </ul>
    <div class="settings__modal">
        <h2>Are you sure you want to delete your account?</h2>
        <label for="passwordInput">Enter your password</label>
        <input id="passwordInput" type="text" />
        <div class="settings__modal--buttons">
            <button id="deleteAccountConfirm">Yes</button>
            <button id="deleteAccountCancel">No</button>
        </div>
    </div>
</section>`;
    const emailString = document.getElementById("email");
    emailString.textContent = getCookie("email");
    document.getElementById("logout").addEventListener("click", function () {
        deleteCookie("email");
        deleteCookie("uid");
        location.replace("/index.html");
    });
    document.getElementById("AccountDelete").addEventListener("click", function () {
        document.querySelector(".settings__modal").style.opacity = "1";
        document.querySelector(".settings__modal").style.visibility = "visible";
        document.querySelector(".settings__modal").style.transform = "translate(-50%, -50%)";
        document.getElementById("deleteAccountCancel").addEventListener("click", () => {
            document.querySelector(".settings__modal").style.opacity = "0";
            document.querySelector(".settings__modal").style.visibility = "hidden";
            document.querySelector(".settings__modal").style.transform = "translate(-50%, -30%)";
        });
        document.getElementById("deleteAccountConfirm").addEventListener("click", async () => {
            const user = auth.currentUser;
            const password = document.getElementById("passwordInput").value;
            const credential = EmailAuthProvider.credential(user.email, password);
            try {
                await reauthenticateWithCredential(user, credential);

                await deleteUser(user);
                deleteCookie("email");
                deleteCookie("uid");
                location.replace("/index.html");
            } catch (error) {
                console.error("Error deleting user: ", error);
                alert("Failed to delete the account. Please try again.");
            }
        });
    });
} else {
    console.log(`qwqwe`);
}
