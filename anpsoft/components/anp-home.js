//======================================================================
//                1. KHAI BÁO CÁC MODULE VÀ BIẾN
//======================================================================
import { setupAuthListeners } from './auth-logic.js';

// Khai báo các phần tử DOM cần thiết (nếu có logic riêng)
// const appContainer = document.getElementById('app-container');
// const loginFormContainer = document.getElementById('login-form-container');
// const userDisplay = document.getElementById('user-display');
// const logoutBtn = document.getElementById('logout-btn');

//======================================================================
//                2. HÀM HỖ TRỢ VÀ LOGIC
//======================================================================

// Hàm Modal tùy chỉnh thay thế alert()
const messageModal = (message, title = "Thông báo") => {
    const existingModal = document.getElementById('custom-modal');
    if (existingModal) {
        existingModal.remove();
    }

    const modalHtml = `
        <div id="custom-modal" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
            <div class="bg-white p-6 rounded-lg shadow-xl max-w-sm mx-auto">
                <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">${title}</h3>
                <p class="text-sm text-gray-500 mb-6">${message}</p>
                <div class="flex justify-end">
                    <button id="modal-close" class="px-4 py-2 bg-blue-600 text-white text-base font-medium rounded-md w-auto shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        Đóng
                    </button>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', modalHtml);

    document.getElementById('modal-close').addEventListener('click', () => {
        document.getElementById('custom-modal').remove();
    });
};

//======================================================================
//                3. CHẠY CÁC CHỨC NĂNG CHÍNH
//======================================================================

// Ghi đè hàm alert() gốc của trình duyệt bằng hàm messageModal() tùy chỉnh
window.alert = messageModal;

// Gọi hàm khởi tạo từ auth-logic.js để thiết lập các listener xác thực
setupAuthListeners(
    (uid) => { console.log("Người dùng đã đăng nhập với UID:", uid); },
    () => { console.log("Người dùng đã đăng xuất."); }
);