/**
 * Initializes tab highlighting based on the current URL once the DOM is fully loaded.
 * This ensures the correct tab is marked active when the page is first rendered.
 * This also prevents that the .active class is beind removed due to page reload.
 */
window.addEventListener('DOMContentLoaded', checkCurrentUrl);

document.addEventListener('DOMContentLoaded', () => {
    const storedUser = JSON.parse(sessionStorage.getItem('loggedInUser'));
    if(storedUser) {
        greet(storedUser === "Guest" ? null : storedUser);
        sessionStorage.removeItem("loggedInUser");
    }
});

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

function getGreetingWord(){
    const hours = new Date().getHours();
    if(hours >= 6 && hours < 12) return 'morning';
    if(hours >= 12 && hours < 18) return 'afternoon';
    if(hours >= 18 && hours < 23) return 'evening';
    return 'night';
} 

function toggleOverlay(show){
    let overlay = document.getElementById('mobile_overlay');
    if(show) {
        overlay.classList.add('active');
    } else {
        overlay.classList.remove('active');
    }
}

function setOverlayTimeout(duration = 3000) {
    toggleOverlay(true);
    setTimeout(() => toggleOverlay(false), duration);
}

function greetOnPC(username = null) {
    const greeting = getGreetingWord();
    document.getElementById('greeting_word').innerHTML = greeting;
    if(username) {
        document.getElementById('username').innerHTML = username;
        document.getElementById('punctuation').innerHTML = ',';
    } else {
        document.getElementById('username').innerHTML = '';
        document.getElementById('punctuation').innerHTML = '!';
    }
}

function greetOnMobile(username = null) {
  const isMobile = window.innerWidth < 851;
  if (isMobile) {
    const greeting = getGreetingWord();
    let message;
    if (username) {
      message = `Good ${greeting}, ${username}`;
    } else {
      message = `Good ${greeting}!`;
    }
    document.getElementById('mobile_greeting').innerHTML = message;
    setOverlayTimeout();
  } else {
    toggleOverlay(false);
  }
}

function greet(username = null){
    let viewPortWidth = window.innerWidth;
    if(viewPortWidth > 850) {
        greetOnPC(username);
    } else {
        greetOnMobile(username);
    }
}
