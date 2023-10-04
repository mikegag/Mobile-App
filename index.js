import { initializeApp } from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js"
import { getDatabase, ref, push, onValue, set} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js"

const appSettings = { //reference to firebase database
    databaseURL: "https://realtime-database-b2706-default-rtdb.firebaseio.com/"
}

const app = initializeApp(appSettings) //initializes database
const database = getDatabase(app) //sets database for use
const endorsementsInDB = ref(database, "endorsements") //reference to endorsements list in database
const publishBtn = document.getElementById("publish-btn")
const endorsementInputEl = document.getElementById("endorsement-input")
const senderInputEl = document.getElementById("sender-input")
const receiverInputEl = document.getElementById("receiver-input")
const endorsementOutputEl = document.getElementById("endorsement-output")
let count = 0 //count for amount of likes on each endorsement post

publishBtn.addEventListener("click", function (){ //listens for publish button clicks

    let inputValue = {  endorsement: endorsementInputEl.value, //formats input for each endorsement
                        from: senderInputEl.value,
                        to: receiverInputEl.value,
                        likeCount: count
                     }
    push(endorsementsInDB, inputValue) //pushes endorsement post info to database
    clearInput() //clears all input fields
})

function clearInput() //clears all input fields "write endorsement", "from", & "to"
{
    endorsementInputEl.value=""
    senderInputEl.value=""
    receiverInputEl.value=""
}

onValue(endorsementsInDB, function(snapshot) { //obtains info on all endorsements in database
    let itemsArray = Object.entries(snapshot.val())
    
    clearEndorsementsEl() //clears previously loaded endorsement posts, prevents duplications
    
    for (let i = 0; i < itemsArray.length; i++) { //traverses each endorsement in database
        let currentItem = itemsArray[i] //selects current endorsement
        let currentItemID = currentItem[0] //selects key value of endorsement
        let currentItemValue = currentItem[1] //selects entry value of endorsement
        
        appendItemToEndorsementsEl(currentItem) //sends currently selected endorsement to be appended
    }
})

function clearEndorsementsEl() { //clears previously loaded posts from page, prevents duplications
    endorsementOutputEl.innerHTML = ""
}

function appendItemToEndorsementsEl(item) { //appends given endorsement to "-endorsements-" section
    let itemID = item[0] //gets key value of given endorsement
    let itemValue = item[1] //gets entry value of given endorsement
    let exactLocationOfItemInDB = ref(database, `endorsements/${itemID}`) //path to current endorsement in database
    let updatedLikes = (itemValue.likeCount + 1) //updates like count on each endorsement
    let likesLocation = exactLocationOfItemInDB + "/likesCount" //path to "likeCount" value for current endorsement in database
    let newEl = document.createElement("li") //creates new list element to store new endorsement post
    //formats values for new endorsement post
    newEl.innerHTML= ` <div class= "endorsement-post" >
                         To: ${itemValue.to} <br /><br />
                         <span id="endorsement-text"> ${itemValue.endorsement} </span> <br /><br />
                            <div id ="endorsement-post-bottom"> 
                                <div id="sender-output"> From: ${itemValue.from} </div>  
                                <div id="endorsement-likes"> <span id="heartSymbol"> &#9829 ${itemValue.likeCount} </span> </div>   
                            </div>  
                        </div>          
                     `
    
    newEl.addEventListener("click", function() { //listens for heart clicks
        //sets new "likeCount" value in database for given endorsement post
        set(exactLocationOfItemInDB, {endorsement: itemValue.endorsement, from: itemValue.from, likeCount: updatedLikes, to: itemValue.to})
    })
            endorsementOutputEl.append(newEl) //appends newly formatted endorsement to page
}