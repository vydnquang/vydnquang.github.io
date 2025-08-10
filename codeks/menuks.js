// TOÀN BỘ CODE CỦA FILE codeks/menuks.js đã được chỉnh sửa
import { getAuth } from 'firebase/auth';

document.addEventListener('DOMContentLoaded', () => {
    // Gắn các sự kiện cho menu footer và modal
    const contactBtn = document.getElementById('contactBtn');
    const contactModal = document.getElementById('contactModal');
    const closeContactModalBtn = document.getElementById('closeContactModalBtn');
    const aboutBtn = document.getElementById('aboutBtn');
    const aboutModal = document.getElementById('aboutModal');
    const closeAboutModalBtn = document.getElementById('closeAboutModalBtn');
    const homeDropdownBtn = document.getElementById('homeDropdownBtn');
    const homeDropdownMenu = document.getElementById('homeDropdownMenu');

    // Kiểm tra và thêm event listener cho các nút modal
    if (contactBtn && contactModal && closeContactModalBtn) {
        contactBtn.addEventListener('click', () => {
            contactModal.classList.add('active');
        });

        closeContactModalBtn.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });

        contactModal.addEventListener('click', (event) => {
            if (event.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });
    }

    if (aboutBtn && aboutModal && closeAboutModalBtn) {
        aboutBtn.addEventListener('click', () => {
            aboutModal.classList.add('active');
        });

        closeAboutModalBtn.addEventListener('click', () => {
            aboutModal.classList.remove('active');
        });

        aboutModal.addEventListener('click', (event) => {
            if (event.target === aboutModal) {
                aboutModal.classList.remove('active');
            }
        });
    }

    // Kiểm tra và thêm event listener cho dropdown
    if (homeDropdownBtn && homeDropdownMenu) {
        homeDropdownBtn.addEventListener('click', (event) => {
            event.stopPropagation(); // Ngăn sự kiện click lan truyền ra ngoài
            homeDropdownMenu.classList.toggle('hidden');
            homeDropdownMenu.classList.toggle('scale-95');
            homeDropdownMenu.classList.toggle('opacity-0');
        });
    }

    // Đóng dropdown khi click ra ngoài
    document.addEventListener('click', (event) => {
        if (homeDropdownMenu && !homeDropdownMenu.classList.contains('hidden') && !homeDropdownBtn.contains(event.target)) {
            homeDropdownMenu.classList.add('hidden');
            homeDropdownMenu.classList.add('scale-95');
            homeDropdownMenu.classList.add('opacity-0');
        }
    });
});
