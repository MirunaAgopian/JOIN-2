function openDialogAddContact(){
    const contentDialogContactRef = document.getElementById('add_contact_dialog');
    contentDialogContactRef.showModal();
}

function changeColorHover(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #29ABE2;';
    contentImageRef.src = '../assets/img/cancel_x_hover.svg';
}

function changeColorOut(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #2A3647;';
    contentImageRef.src = '../assets/img/cancel_x.svg';
}

function changeColorDown(){
    const contentImageRef = document.getElementById('cancel_img');
    const contentSpanRef = document.getElementById('cancel_span');

    contentSpanRef.style = 'color : #091931;';
    contentImageRef.src = '../assets/img/cancel_x_active.svg';
}