/**
 * Initializes tab highlighting based on the current URL once the DOM is fully loaded.
 * This ensures the correct tab is marked active when the page is first rendered.
 * This also prevents that the .active class is beind removed due to page reload.
 */
window.addEventListener('DOMContentLoaded', checkCurrentUrl);

/**
 * Toggles the submenu based on the current viewport width.
 * Calls the desktop submenu toggle if the width is greater than 850px,
 * otherwise calls the mobile submenu toggle.
 * @function toggleMobileSubmenu
 */
function toggleSubmenu (){
    let viewPortWidth = window.innerWidth;
    if(viewPortWidth > 850){
        toggleDesktopSubmenu();
    } else {
        toggleMobileSubmenu();
    }  
}

/**
 * Controls the visibility of the dropdown menu for desktop and mobile devices
 * If the dropdown menu is open and the user clicks outside it, the menu closes
 * @param {MouseEventevent} - The click event
 */
function handleDocumentClick(event) {
    const avatarBtn = document.getElementById('activeAvatar');
    const desktopSubmenu = document.getElementById('submenu');
    const mobileSubmenu = document.getElementById('mobile_submenu');
    if (!avatarBtn.contains(event.target) &&
        !desktopSubmenu.contains(event.target) &&
        !mobileSubmenu.contains(event.target)) {
        desktopSubmenu.classList.add('d-none');
        mobileSubmenu.classList.remove('open');
    }
}

/**
 * Attaches the global click handler on the whole document.
 * Ensures that clicks anywhere on the page are passed to handleDocumentClick.
 */
document.addEventListener('click', handleDocumentClick);

/**
 * Toggles the desktop submenu by adding or removing the 'd-none 'CSS class
 * Targets the DOM element with the ID 'submenu'
 * @function toggleDesktopSubmenu
 */
function toggleDesktopSubmenu(){
    let desktopSubmenu = document.getElementById('submenu');
    desktopSubmenu.classList.toggle('d-none');
}

/**
 * Toggles the mobile submenu by adding or removing the 'open' CSS class
 * Targets the DOM element with the ID 'mobile_submenu'
 * @function toggleMobileSubmenu
 */
function toggleMobileSubmenu(){
    let mobileSubmenu = document.getElementById('mobile_submenu');
    mobileSubmenu.classList.toggle('open');
}

/**
 * Sets focus on a specific desktop tab by toggling the 'active' CSS class.
 * Removes 'active' from all elements with the class 'sidebar-menu-elements',
 * then adds 'active' to the tab element corresponding to the given key.
 * @function setDesktopTabFocus
 * @param {string} tab - The key identifying the tab to activate ('summary', 'task', 'board', or 'contacts').
 */
function setDesktopTabFocus(tab){
    let asideTabs = document.querySelectorAll('.sidebar-menu-elements');
    asideTabs.forEach(t => t.classList.remove('active'));
    let idMap = {
        summary: 'summary_tab_pc',
        task: 'add_task_tab_pc',
        board: 'board_tab_pc',
        contacts: 'contacts_tab_pc',
    };
    const activeTab = document.getElementById(idMap[tab]);
    if(activeTab) activeTab.classList.add('active');
}

/**
 * Sets focus on a specific mobile tab by toggling the 'active' CSS class.
 * Removes 'active' from all elements with the class 'footer-menu-elements',
 * then adds 'active' to the tab element corresponding to the given key.
 * @function setMobileTabFocus
 * @param {string} tab - The key identifying the tab to activate ('summary', 'task', 'board', or 'contacts').
 */
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

/**
 * Checks the current URL path and activates the corresponding desktop and mobile tab.
 * Extracts the filename from the current window location and maps it to a tab key.
 * If a matching tab key is found, it sets focus on both desktop and mobile tabs.
 * @function checkCurrentUrl
 */
function checkCurrentUrl(){
    const path = window.location.pathname.split('/').pop();
    let urlMap = {
        'summary.html': 'summary',
        'add-task.html': 'task',
        'board.html': 'board',
        'contacts.html': 'contacts'
    }
    const tabKey = urlMap[path];
    if(tabKey) {
        setDesktopTabFocus(tabKey);
        setMobileTabFocus(tabKey);
    }
}
