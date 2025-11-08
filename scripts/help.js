window.addEventListener('DOMContentLoaded', checkCurrentUrl);

function goBack() {
  window.history.back();
}

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

function checkCurrentUrl() {
  const path = window.location.pathname.split('/').pop();
  let urlMap = {
    'privacy-policy-login.html' : 'privacyPolicy',
    'legal-notice-login.html': 'legalNotice'
  }
  const tabKey = urlMap[path];
  if(tabKey) {
    setPolicyFocusTabPc(tabKey);
  }
}