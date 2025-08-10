document.addEventListener('DOMContentLoaded', () => {
    // Gắn các sự kiện cho menu footer và modal
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const homeDropdownBtn = document.getElementById('homeDropdownBtn');
    const homeDropdownMenu = document.getElementById('homeDropdownMenu');

    contactBtn.addEventListener('click', () => {
        contactModal.classList.add('active');
    });

    closeModalBtn.addEventListener('click', () => {
        contactModal.classList.remove('active');
    });

    contactModal.addEventListener('click', (event) => {
        if (event.target === contactModal) {
            contactModal.classList.remove('active');
        }
    });

    homeDropdownBtn.addEventListener('click', () => {
        homeDropdownMenu.classList.toggle('hidden');
        homeDropdownMenu.classList.toggle('scale-95');
        homeDropdownMenu.classList.toggle('opacity-0');
    });

    document.addEventListener('click', (event) => {
        if (!homeDropdownBtn.contains(event.target) && !homeDropdownMenu.contains(event.target)) {
            homeDropdownMenu.classList.add('hidden');
            homeDropdownMenu.classList.add('scale-95');
            homeDropdownMenu.classList.add('opacity-0');
        }
    });
});