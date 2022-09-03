const auth = firebase.auth();

const signedIn = document.getElementById("signedIn");
const signedOut = document.getElementById("signedOut");

const signInButton = document.getElementById("signInButton");
const signOutButton = document.getElementById("signOutButton");

const userDetails = document.getElementById("userDetails");

const provider = new firebase.auth.GoogleAuthProvider();

signInButton.onclick = () => auth.signInWithPopup(provider);

signOutButton.onclick = () => auth.signOut();

auth.onAuthStateChanged(user => {
    if (user) {
        //logged in
        signedIn.hidden = false;
        signedOut.hidden = true;
        userDetails.innerHTML = `<h2>Hello ${user.displayName}</h2><p>User ID: ${user.uid}</p>`;
    } else {
        //not logged in
        signedIn.hidden = true;
        signedOut.hidden = false;
        userDetails.innerHTML = '';
    }
});

const db = firebase.firestore();

const addGame = document.getElementById("addGame");
const gameList = document.getElementById("gameList");

let gameRef;
let unsubscribe;

auth.onAuthStateChanged(user => {
    if (user) {
        gameRef = db.collection("games");
        addGame.onclick = () => {
            const { serverTimestamp } = firebase.firestore.FieldValue;
            gameRef.add({
                uid: user.uid,
                name: "Game " + Math.floor(Math.random() * 100000),
                score: Math.floor(Math.random() * 11),
                createdAt: serverTimestamp()
            });
        }
        unsubscribe = gameRef
            .where("uid", "==", user.uid)
            .orderBy("createdAt")
            .onSnapshot(querySnapshot => {
                const items = querySnapshot.docs.map(doc => {
                    return `<li>${ doc.data().name }`
                });
                gameList.innerHTML = items.join("");
            });
    } else {
        unsubscribe && unsubscribe();
    }
})