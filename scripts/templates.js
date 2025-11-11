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
                        <img id="btn_edit" class="btn-contact-ctrl" src="../assets/img/edit_contact.svg" alt="edit button with pen icon">
                        <img id="btn_delete" class="btn-contact-ctrl" src="../assets/img/delete_contact.svg" alt="delete button with trash icon">
                    </div>
                </div>
            </div>`;
}