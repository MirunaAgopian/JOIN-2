/**
 * This function returns the html tag with information for operator
 * 
 * @param {string} text - info string
 * @returns - span tag with info for operator
 */
function getDialogMsgTemplate(text){
    return `<span>${text}</span>`;}

/**
 * This function ist used to show the the contact data on contacts.html if a contact is clicked on list
 * 
 * @param {object} obj - includes the data object of clicked contact person 
 * @param {string} initials - includes the first characters of name and last name of clicked person 
 * @returns - html tags for render function
 */
function getTemplateShowContact(obj, initials){
    return `<div class="contact-head">
                <div class="contact-circle" style="background-color:${obj.color}">
                    <span>${initials}</span>
                </div>
                <div class="contact-box">
                    <span id="name_data" class="name-line">${obj.name}</span>
                    <div class="contact-visibility">
                        <div class="contact-ctrl-box">
                            <img id="btn_edit" class="btn-contact-ctrl" src="../assets/img/edit_contact.svg" alt="edit button with pen icon"
                            onmouseover="changeImgHover('btn_edit')" onmouseout="changeImgOut('btn_edit')" onclick="renderEditDialog('${obj.mail}', '${initials}')">
                            <img id="btn_delete" class="btn-contact-ctrl" src="../assets/img/delete_contact.svg" alt="delete button with trash icon"
                            onmouseover="changeImgHover('btn_delete')" onmouseout="changeImgOut('btn_delete')" onclick="deleteContact('${obj.mail}')">
                        </div>
                    </div>
                </div>
            </div>
            <span class="contact-info-span">Contact Information</span>
            <div class="contact-data-container">
                <span class="bold-line">Email</span>
                <span id="mail_data" class="mail-info-box">${obj.mail}</span>
                <span class="bold-line">Phone</span>
                <span class="phone-info-box">${obj.phone}</span>
            </div>`;
}

/**
 * This function includes the html code for the edit dialog, if the edit button is clicked on indicated contact
 * 
 * @param {object} obj - includes the data object of showed contact person 
 * @param {*} initials - includes the first characters of name and last name of showed person 
 * @returns - html tags for render function
 */
function getTemplateEditDialog(obj, initials){
    return `<div class="add-contact-container">
                <section class="add-contact-left-box">
                    <div class="left-box-content">
                        <div id="btn_close_edit" class="btn-close-container-top">
                            <div class="btn-close-box-top" onclick="closeDialogEditContact()">
                                <img class="close-img" src="../assets/img/close_btn_white.svg" alt="cross as close button">
                            </div>
                        </div>
                        <div class="overlay-box">
                            <div class="overlay-flex">
                                <div class="overlay-center">
                                    <img class="join-img" src="../assets/img/join_logo_white.svg" alt="join logo in white">
                                    <span class="span-add">Edit contact</span>
                                    <hr class="add-contact-underline">  
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <section class="add-contact-right-box">
                    <div class="btn-close-container">
                        <div class="btn-close-box" onclick="closeDialogEditContact()">
                            <img src="../assets/img/close_btn.svg" alt="cross as close button">
                        </div>
                    </div>
                    <div class="right-box-container">
                        <div class="person-container" style="background-color:${obj.color}">
                            <span class="edit-initials">${initials}</span>
                        </div>
                        <form onsubmit="saveChangedData('${obj.mail}'); return false" autocomplete="off">
                            <input type="text" required placeholder="Name" class="bg-input bg-img-name" id="edit_name" value='${obj.name}'>
                            <div class="mail-info">
                                <input type="text" required placeholder="Email" class="bg-input bg-img-mail" id="edit_mail" value='${obj.mail}'
                                onfocus="fieldMailOnFocus('edit_mail', 'edit_span', 'btn_edit')" onblur="checkMailOnDialog('edit_mail', 'edit_span', 'btn_edit')">
                                <span id="edit_span" class="info-span hidden">Invalid mail</span>
                            </div>
                            <input type="tel" required placeholder="Phone" class="bg-input bg-img-phone" id="edit_phone" value='${obj.phone}'>
                            <div class="form-ctrl-container">
                                <div class="btn-delete" onclick="deleteContactOnDialog('${obj.mail}')">
                                    <span>Delete</span>
                                </div>
                                <button id="btn_edit" class="btn-contact">
                                    <span>Save</span>
                                    <img src="../assets/img/check.svg" alt="check symbol">
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>`
}

// Template functions for Add Task

/** This function displays an alert message if the user does not type in a requested input field
 * @returns {string} - HTML string containing a span with the alert message
 */
function getAlert(){
  return `<span class='alert'>This field is required</span>`;
}

/**This function displays an overlay containing a confirmation message after the task has been added to the board
 * @returns {string} - HTML string containing a div with the confirmation message
 */
function getRedirectTemplate(){
  return `<div class="add-task-overlay">
            <div class="overlay-img-text">
              <span>Task added to board</span>
              <img class ='board-icon' src="/assets/img/board.svg" alt="the logo of the board tab">
            </div>
          </div>`;
}

/**
 * This function generates the list if contacts to which a task can be assigned
 * @param {object} contact - The contact object containing the name, the initials and the color
 * @param {string} initials - The name initials for each contact
 * @param {boolean} [isCurrentUser=false] - If the contact is the current user; adds "(You)" after the username if true.
 * @returns {string} - HTML string containing the contact list and the name initials
 */
function getContactList(contact, initials, isCurrentUser = false) {
   const isChecked = selectedContacts.has(contact.mail);
  return `<li>
              <div class='username'>
                <span class='contact-circle' style='background-color:${
                  contact.color
                }'>${initials}</span>
                <span>${contact.name}${isCurrentUser ? " (You)" : ""}</span> 
              </div>  
                <div onclick='setCheckMark(this, "${contact.mail}")' 
                class='checkbox ${isChecked ? "checked" : ""}'></div>
            </li>`;
}

/**
 * This function generates the initials of each contact
 * the initials appear in a round circle, each of them having a random background color
 * @param {object} contact - The contact object containing the name, the initials and the color
 * @param {string} initials - The name initials for each contact
 * @returns {string} - HTML string containing the name initials and the background color
 */
function getContactAvatar(contact, initials) {
  return `<div class="contact-circle" style="background-color:${contact.color}">
              <span>${initials}</span>
          </div>`;
}

/**
 * This function generates the subtask added by the user in the dedicated input field
 * includes both the display view and the editable view
 * @param {string} text - the user's input in the subtask field
 * @returns {string} - HTML string containing two <li> elements:
 * one for subtask diplay and one for editing each subtask
 */
function getAddedTasks(text){
  return `<li class="subtask-list">
              <span class='subtask-text'>${text}</span>
              <div class='subtask-element-img-wrapper'>
                <button onclick='openEditingEnvironment(this)' class='subtask-edit-btn' title="Edit"></button>
                <div class='subtask-btn-divider-secondary'></div>
                <button onclick='deleteAddedSubtask(this)' class='subtask-delete-btn' title="Delete"></button>
              </div>
          </li>
          <li class='subtask-edit-list d-none'>
            <span class="subtask-edit" contenteditable='true'></span>
            <div class="subtask-edit-btn-wrapper">
              <button onclick='deleteAddedSubtask(this)' class='subtask-delete-btn-secondary' title="Delete"></button>
              <div class='subtask-btn-divider-tertiary'></div>
              <button onclick='saveEditedSubtask(this)' class="subtask-save-btn" title="save"></button>
            </div>
          </li>`;
}