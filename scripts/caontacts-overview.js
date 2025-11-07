let contactList = {};

let elementContactRev = {
    contacts: document.getElementById("contactsList-content")
}

async function renderContacts() {
    const ALL_USER = await getAllUsers("joinUsers");
    contactList = createAddressBook(ALL_USER);
    elementContactRev.contacts.innerHTML = "";

    printAddressBook(contactList); // ← Hier liegt die Korrektur!
}


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


function printAddressBook(bookObj) {
    const addressBook = bookObj.addressBook;

    Object.keys(addressBook)
        .sort()
        .forEach(letter => {
            elementContactRev.contacts.innerHTML += renderContactLetter(letter);
            addressBook[letter].forEach(user => {
                elementContactRev.contacts.innerHTML += renderContactInfo(user.name, user.mail);
            });
        });
}


function renderContactLetter(letter) {
    let output = `<h5 class="capitalLatter">${letter}</h5>`;

    return output;
}

function renderContactInfo(name, email) {
    return `
    <div class="contactID" onclick="showName('${name}')">
        <div class="contactAvater">
            ${getUserItem(name)}
        </div>
        <div class="contact-entry">
            <span class="contact-name">${name}</span><br>
            <span class="contact-email">${email}</span>
        </div>
    </div>
  `;
}

function getUserItem(name) {
    let output = "";
    let parts = name.trim().split(" ");

    if (parts.length >= 2) {
        output = parts[0].charAt(0).toUpperCase() + parts[1].charAt(0).toUpperCase();
    } else if (parts.length === 1) {
        output = parts[0].charAt(0).toUpperCase();
    }

    return output;
}

function showName(name){
    alert(name);
}
