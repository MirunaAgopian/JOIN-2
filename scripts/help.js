/** This function checks the url the page is currently on */
window.addEventListener('DOMContentLoaded', checkCurrentUrl);

//** This fnction tracks back the url and redirects the user to the previous page */
function goBack() {
  window.history.back();
}

/**
 * This function sets an .active CSS class on the tab the user has clicked, thus highlighting the tab on PC devices
 * @param {string} tab - this is the name of the tab the user has clicked on (e.g. 'privacyPolicy')
 */
function setPolicyFocusTabPc(tab) {
  let activeTabs = document.querySelectorAll('.aside-policy-links');
  activeTabs.forEach(t => t.classList.remove('active'));
  let idMap = {
    privacyPolicy : 'privacy_policy_pc',
    legalNotice: 'legal_notice_pc'
  }
  const activeTab = document.getElementById(idMap[tab]);
  if(activeTab) activeTab.classList.add('active');
}

/**
 * This function sets an .active CSS class on the tab the user has clicked, thus highlighting the tab on mobile devices
 * @param {string} tab - this is the name of the tab the user has clicked on (e.g. 'privacyPolicy')
 */

function setPolicyFocusTabMobile(tab){
  let activeTabs = document.querySelectorAll('.footer-policy-links');
  activeTabs.forEach(t => t.classList.remove('active'));
  let idMap = {
    privacyPolicy : 'privacy_policy_mobile',
    legalNotice: 'legal_notice_mobile'
  }
  const activeTab = document.getElementById(idMap[tab]);
  if(activeTab) activeTab.classList.add('active');
}

//** This function checks on which url the user is
// it edits the url name so that only its ending is taken into consideration
// after the current url is identified, it fires the functions which highlight the tabs the user has clicked*/
function checkCurrentUrl() {
  const path = window.location.pathname.split('/').pop();
  let urlMap = {
    'privacy-policy-login.html' : 'privacyPolicy',
    'legal-notice-login.html': 'legalNotice',
    'privacy-policy.html': 'privacyPolicy',
    'legal-notice.html': 'legalNotice'
  }
  const tabKey = urlMap[path];
  if(tabKey) {
    setPolicyFocusTabPc(tabKey);
    setPolicyFocusTabMobile(tabKey);
  }
}