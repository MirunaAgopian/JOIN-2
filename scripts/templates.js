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
                        onmouseover="changeImgHover('btn_edit')" onmouseout="changeImgOut('btn_edit')">
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