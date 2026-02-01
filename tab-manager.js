// ========================================
// TAB MANAGER
// ========================================

document.addEventListener('DOMContentLoaded', () => {
    initializeTabs();
});

function initializeTabs() {
    const tabs = document.querySelectorAll('.tab-item');
    const tabContents = document.querySelectorAll('.tab-content');
    
    // Function to switch tabs
    function switchTab(tabId) {
        // Remove active class from all tabs and contents
        tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        tabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // Add active class to selected tab and content
        const selectedTab = document.querySelector(`[data-tab="${tabId}"]`);
        const selectedContent = document.getElementById(tabId);
        
        if (selectedTab) {
            selectedTab.classList.add('active');
        }
        
        if (selectedContent) {
            selectedContent.classList.add('active');
        }
        
        // Save active tab to localStorage
        localStorage.setItem('activeTab', tabId);
    }
    
    // Add click event to each tab
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const tabId = tab.getAttribute('data-tab');
            switchTab(tabId);
            
            // Update URL hash for bookmarking
            window.location.hash = tabId;
        });
    });
    
    // Check for saved tab or URL hash on page load
    function checkInitialTab() {
        const hash = window.location.hash.substring(1);
        const savedTab = localStorage.getItem('activeTab');
        
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        } else if (savedTab && document.getElementById(savedTab)) {
            switchTab(savedTab);
        } else {
            // Default to first tab
            const firstTab = tabs[0];
            if (firstTab) {
                const firstTabId = firstTab.getAttribute('data-tab');
                switchTab(firstTabId);
            }
        }
    }
    
    // Check initial tab on page load
    checkInitialTab();
    
    // Listen for hash changes
    window.addEventListener('hashchange', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        }
    });
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', () => {
        const hash = window.location.hash.substring(1);
        if (hash && document.getElementById(hash)) {
            switchTab(hash);
        }
    });
}
