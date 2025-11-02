function toggleSubmenu (){
    let viewPortWidth = window.innerWidth;
    if(viewPortWidth > 850){
        toggleDesktopSubmenu();
    } else {
        toggleMobileSubmenu();
    }  
}

function toggleDesktopSubmenu(){
    let desktopSubmenu = document.getElementById('submenu');
    desktopSubmenu.classList.toggle('d-none');
}

function toggleMobileSubmenu(){
    let mobileSubmenu = document.getElementById('mobile_submenu');
    mobileSubmenu.classList.toggle('open');
}
