document.addEventListener("DOMContentLoaded", function() {
    function loadComponent(file, targetId, callback) {
        fetch(file)
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
                if (callback) {
                    callback();
                }
            })
            .catch(error => {
                console.error(`Error loading component from ${file}:`, error);
            });
    }

    loadComponent('theme/header.html', 'header-placeholder');
    loadComponent('theme/donatebt.html', 'donate-placeholder');
    loadComponent('theme/footer.html', 'footer-placeholder', () => {
        loadComponent('theme/modals.html', 'modals-placeholder', () => {
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

            if (aboutBtn) {
                aboutBtn.addEventListener('click', () => {
                    // Đóng menu trượt trước khi mở modal
                    offCanvasMenu.classList.remove('active'); 
                    openModal(aboutModal);
                });
                closeAboutModalBtn.addEventListener('click', () => closeModal(aboutModal));
                aboutModal.addEventListener('click', (event) => {
                    if (event.target === aboutModal) {
                        closeModal(aboutModal);
                    }
                });
            }

            if (contactBtn) {
                contactBtn.addEventListener('click', () => {
                    // Đóng menu trượt trước khi mở modal
                    offCanvasMenu.classList.remove('active');
                    openModal(contactModal);
                });
                closeContactModalBtn.addEventListener('click', () => closeModal(contactModal));
                contactModal.addEventListener('click', (event) => {
                    if (event.target === contactModal) {
                        closeModal(contactModal);
                    }
                });
            }

            if (menuBtn) {
                menuBtn.addEventListener('click', () => {
                    offCanvasMenu.classList.toggle('active');
                });
            }
            if (offCanvasMenuCloseBtn) {
                offCanvasMenuCloseBtn.addEventListener('click', () => {
                    offCanvasMenu.classList.remove('active');
                });
            }
        });
    });
});
