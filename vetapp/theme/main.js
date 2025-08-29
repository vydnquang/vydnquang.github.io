// Hàm tải component từ file HTML
function loadComponent(file, targetId) {
    return fetch(file)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.text();
        })
        .then(data => {
            document.getElementById(targetId).innerHTML = data;
            if (typeof lucide !== 'undefined') {
                lucide.createIcons();
            }
        })
        .catch(error => {
            console.error(`Error loading component from ${file}:`, error);
        });
}

// Hàm xử lý logic của modals và menu
function setupUI() {
    const aboutBtn = document.getElementById('aboutBtn');
    const contactBtn = document.getElementById('contactBtn');
    const aboutModal = document.getElementById('aboutModal');
    const contactModal = document.getElementById('contactModal');
    const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');
    const closeContactModalBtn = document.getElementById('closeContactModalBtn');
    const menuBtn = document.getElementById('searchDropdownBtn');
    const offCanvasMenu = document.getElementById('offCanvasMenu');
    const offCanvasMenuCloseBtn = document.querySelector('.off-canvas-menu-close');

    const openModal = (modalElement) => {
        modalElement.classList.remove('hidden');
        setTimeout(() => {
            modalElement.classList.remove('opacity-0');
            modalElement.classList.add('opacity-100');
            const contentElement = modalElement.querySelector('div.bg-white');
            if (contentElement) {
                contentElement.classList.remove('scale-95');
                contentElement.classList.add('scale-100');
            }
        }, 10);
    };

    const closeModal = (modalElement) => {
        modalElement.classList.remove('opacity-100');
        modalElement.classList.add('opacity-0');
        const contentElement = modalElement.querySelector('div.bg-white');
        if (contentElement) {
            contentElement.classList.remove('scale-100');
            contentElement.classList.add('scale-95');
        }
        setTimeout(() => {
            modalElement.classList.add('hidden');
        }, 300);
    };

    if (aboutBtn && aboutModal) {
        aboutBtn.addEventListener('click', () => {
            if (offCanvasMenu) offCanvasMenu.classList.remove('active');
            openModal(aboutModal);
        });
        closeAboutModalBtn.addEventListener('click', () => closeModal(aboutModal));
        aboutModal.addEventListener('click', (event) => {
            if (event.target === aboutModal) {
                closeModal(aboutModal);
            }
        });
    }

    if (contactBtn && contactModal) {
        contactBtn.addEventListener('click', () => {
            if (offCanvasMenu) offCanvasMenu.classList.remove('active');
            openModal(contactModal);
        });
        closeContactModalBtn.addEventListener('click', () => closeModal(contactModal));
        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) {
                closeModal(contactModal);
            }
        });
    }

    if (menuBtn && offCanvasMenu) {
        menuBtn.addEventListener('click', (e) => {
            e.preventDefault();
            offCanvasMenu.classList.toggle('active');
        });
        document.addEventListener('click', (e) => {
            if (!offCanvasMenu.contains(e.target) && !menuBtn.contains(e.target) && offCanvasMenu.classList.contains('active')) {
                offCanvasMenu.classList.remove('active');
            }
        });
    }
    
    if (offCanvasMenuCloseBtn && offCanvasMenu) {
         offCanvasMenuCloseBtn.addEventListener('click', () => {
             offCanvasMenu.classList.remove('active');
         });
    }
}

// Định nghĩa hàm khởi tạo trang
window.initializePage = async function(mainContentFile) {
    try {
        // Tải các component chung
        await loadComponent('theme/header.html', 'header-placeholder');
        await loadComponent('theme/donatebt.html', 'donate-placeholder');
        await loadComponent('theme/footer.html', 'footer-placeholder');
        await loadComponent('theme/modals.html', 'modals-placeholder');
        
        // Tải nội dung chính của trang từ tham số truyền vào
        await loadComponent(mainContentFile, 'main-placeholder');
        
        // Chạy logic UI sau khi tất cả đã tải xong
        setupUI();
        
    } catch (error) {
        console.error('Lỗi khi tải các thành phần:', error);
    }
};
