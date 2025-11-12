function getDialogMsgTemplate(text){
    return `<span>${text}</span>`;}

function getTemplateShowContact(obj, initials){
    return `<div class="contact-head">
                <div class="contact-circle" style="background-color:${obj.color}">
                    <span>${initials}</span>
                </div>
                <div class="contact-box">
                    <span class="name-line">${obj.name}</span>
                    <div class="contact-ctrl-box">
                        <img id="btn_edit" class="btn-contact-ctrl" src="../assets/img/edit_contact.svg" alt="edit button with pen icon"
                        onmouseover="changeImgHover('btn_edit')" onmouseout="changeImgOut('btn_edit')" onclick="renderEditDialog('${obj.mail}', '${initials}')">
                        <img id="btn_delete" class="btn-contact-ctrl" src="../assets/img/delete_contact.svg" alt="delete button with trash icon"
                        onmouseover="changeImgHover('btn_delete')" onmouseout="changeImgOut('btn_delete')" onclick="deleteContact('${obj.mail}')">
                    </div>
                </div>
            </div>
            <span class="contact-info-span">Contact Information</span>
            <div class="contact-data-container">
                <span class="bold-line">Email</span>
                <span class="mail-info-box">${obj.mail}</span>
                <span class="bold-line">Phone</span>
                <span class="phone-info-box">${obj.phone}</span>
            </div>`;
}

function getTemplateEditDialog(obj, initials){
    return `<div class="add-contact-container">
                <section class="add-contact-left-box">
                    <div class="left-box-content">
                        <img src="../assets/img/join_logo_white.svg" alt="join logo in white">
                        <span class="span-add">Edit contact</span>
                        <hr class="add-contact-underline">
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
                            <input type="text" required placeholder="Email" class="bg-input bg-img-mail" id="edit_mail" value='${obj.mail}'>
                            <input type="tel" required placeholder="Phone" class="bg-input bg-img-phone" id="edit_phone" value='${obj.phone}'>
                            <div class="form-ctrl-container">
                                <div class="btn-delete" onclick="deleteContactOnDialog('${obj.mail}')">
                                    <span>Delete</span>
                                </div>
                                <button class="btn-contact">
                                    <span>Save</span>
                                    <img src="../assets/img/check.svg" alt="check symbol">
                                </button>
                            </div>
                        </form>
                    </div>
                </section>
            </div>`
}