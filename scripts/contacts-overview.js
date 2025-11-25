let contactList = {};

let elementContactRev = {
    contacts: document.getElementById("contactsList-content")
}

/**
 * Initializes and renders the contact book on page load.
 * Fetches all users, creates an address book grouped by initial letters,
 * and renders the contact list in the DOM.
 */
async function onloadFuncContact() {
    const ALL_USER = await getAllUsers("contacts");
    contactList = createAddressBook(ALL_USER);
    let arrOfContacts = createArrayForIdInContactList(ALL_USER);
    activatedContact = 0;
    elementContactRev.contacts.innerHTML = "";

    renderContacts(contactList, arrOfContacts); 
    renderActiveAvatar();
}

/**
 * Creates an address book object grouped by the first letter of each user's name.
 * Users are sorted alphabetically before grouping.
 * @param {Object} usersObj - An object containing user data keyed by user IDs.
 * @returns {Object } An object with keys as capital letters and values as arrays of user objects.
 */
function createAddressBook(usersObj) {
    const usersArray = Object.values(usersObj);
    usersArray.sort((a, b) => a.name.localeCompare(b.name));

    const addressBook = {};

    for (const user of usersArray) {
        const initialLetter = user.name.charAt(0).toUpperCase();
        if (!addressBook[initialLetter]) {
            addressBook[initialLetter] = [];
        }
        addressBook[initialLetter].push(user);
    }

    return { addressBook };
}

/**
 * Renders the contact list grouped by initial letters into the DOM.
 * @param {Object} bookObj - The structured address book object.
 */
function renderContacts(bookObj, contactsArr) {
    const addressBook = bookObj.addressBook;

    Object.keys(addressBook)
        .sort()
        .forEach(letter => {
            elementContactRev.contacts.innerHTML += renderContactLetter(letter);
            addressBook[letter].forEach(user => {
                let id = findArrIndexOfUser(user, contactsArr);
                elementContactRev.contacts.innerHTML += renderContactInfo(user, id);
            });
        });
}

/**
 * Generates HTML markup for a contact group heading based on the initial letter.
 * @param {string} letter - The initial letter representing a contact group.
 * @returns {string} HTML string for the group heading.
 */
function renderContactLetter(letter) {
    let output =`<div class="capitalLatter">
                    <h5>${letter}</h5>
                    <hr class="hr-underline">
                </div>`;

    return output;
}

function createArrayForIdInContactList(userResponse){
    let keysArr = Object.keys(userResponse);
    fillArrayOfContacts(keysArr, userResponse);
    return joinContacts;
}

/**
 * Generates HTML markup for an individual contact entry.
 * Includes avatar initials, name, and email, and sets up a click handler.
 * @param {Object} user - USer Object
 * @returns {string} HTML string for the contact entry.
 */
function renderContactInfo(user, id) {
    return `
    <div id="id_${id}" class="contactID" onmouseover="changeBackgroundIfNotActivated(${id})" onmouseout="changeBackgroundOut(${id})" onclick="showClickedContact('${user.mail}')">
        <div class="contactAvater" style="background-color: ${user.color}">
            ${getUserItem(user.name)}
        </div>
        <div class="contact-entry">
            <span id="spanId_${id}" class="contact-name">${user.name}</span><br>
            <span class="contact-email">${user.mail}</span>
        </div>
    </div>
  `;
}

function changeBackgroundIfNotActivated(id){
    if(id != activatedContact){
        document.getElementById('id_' + id).classList.add('contactID-hover');
    }
}

function changeBackgroundOut(id){
    if(id != activatedContact){
        document.getElementById('id_' + id).classList.remove('contactID-hover');
    }
}

function showName(mail){
    alert(mail);
}

function findArrIndexOfUser(user, arrOfContacts){
    let id = 0;
    for (let index = 0; index < arrOfContacts.length; index++) {
        if(user.mail == arrOfContacts[index].mail){
            id = index + 1;
            break;
        }
    }
    return id;
}
