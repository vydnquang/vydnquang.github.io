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
    loadComponent('theme/donatebt.html', 'donatebt-placeholder');
    loadComponent('theme/footer.html', 'footer-placeholder', () => {
        loadComponent('theme/modals.html', 'modals-placeholder', () => {
            const aboutBtn = document.getElementById('aboutBtn');
            const contactBtn = document.getElementById('contactBtn');
            const aboutModal = document.getElementById('aboutModal');
            const contactModal = document.getElementById('contactModal');
            const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');
            const closeContactModalBtn = document.getElementById('closeContactModalBtn');
            const searchDropdownBtn = document.getElementById('searchDropdownBtn');
            const searchDropdownMenu = document.getElementById('searchDropdownMenu');

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
                aboutBtn.addEventListener('click', () => openModal(aboutModal));
                closeAboutModalBtn.addEventListener('click', () => closeModal(aboutModal));
                aboutModal.addEventListener('click', (event) => {
                    if (event.target === aboutModal) {
                        closeModal(aboutModal);
                    }
                });
            }

            if (contactBtn) {
                contactBtn.addEventListener('click', () => openModal(contactModal));
                closeContactModalBtn.addEventListener('click', () => closeModal(contactModal));
                contactModal.addEventListener('click', (event) => {
                    if (event.target === contactModal) {
                        closeModal(contactModal);
                    }
                });
            }

            if (searchDropdownBtn) {
                searchDropdownBtn.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    searchDropdownMenu.classList.toggle('opacity-0');
                    searchDropdownMenu.classList.toggle('pointer-events-none');
                });
                document.addEventListener('click', (e) => {
                    if (!searchDropdownBtn.contains(e.target) && !searchDropdownMenu.contains(e.target)) {
                        searchDropdownMenu.classList.add('opacity-0');
                        searchDropdownMenu.classList.add('pointer-events-none');
                    }
                });
            }
        });
    });

});

