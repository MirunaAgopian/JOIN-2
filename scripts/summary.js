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

function setDesktopTabFocus(tab){
    let asideTabs = document.querySelectorAll('.sidebar-menu-elements');
    asideTabs.forEach(t => t.classList.remove('active'));
    let idMap = {
        summary: 'summary_tab_pc',
        task: 'add_task_tab_pc',
        board: 'board_tab_pc',
        contacts: 'contacts_tab_pc'
    };
    const activeTab = document.getElementById(idMap[tab]);
    if(activeTab) activeTab.classList.add('active');
}

function setMobileTabFocus(tab){
    let footerTabs = document.querySelectorAll('.footer-menu-elements');
    footerTabs.forEach(t => t.classList.remove('active'));
    let idMap = {
        summary: 'summary_tab_mobile',
        task: 'add_task_tab_mobile',
        board: 'board_tab_mobile',
        contacts: 'contacts_tab_mobile'
    };
    const activeTab = document.getElementById(idMap[tab]);
    if(activeTab) activeTab.classList.add('active');
}

function checkCurrentUrl(){
    const path = window.location.pathname;
    let urlMap = {
        '/html/summary.html': 'summary',
        '/html/add-task.html': 'task',
        '/html/board.html': 'board',
        '/html/contacts.html': 'contacts'
    }
    const tabKey = urlMap[path];
    if(tabKey) {
        setDesktopTabFocus(tabKey);
        setMobileTabFocus(tabKey);
    }
}

window.addEventListener('DOMContentLoaded', checkCurrentUrl);