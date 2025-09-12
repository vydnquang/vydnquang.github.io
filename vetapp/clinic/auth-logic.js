import { auth } from './firebase-config.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Khai báo các phần tử DOM liên quan đến xác thực
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authButton = document.getElementById('auth-button');
const toggleAuthModeBtn = document.getElementById('toggle-auth-mode');
const mainContent = document.getElementById('main-content');
const currentUserIdSpan = document.getElementById('current-user-id');
const customModalBackdrop = document.getElementById('custom-modal-backdrop');
const customModalMessage = document.getElementById('custom-modal-message');

let isLoginMode = false;

// Hàm hiển thị modal thông báo tùy chỉnh
function showCustomModal(message) {
    customModalMessage.textContent = message;
    customModalBackdrop.style.display = 'flex';
}

// Xử lý sự kiện sau khi toàn bộ DOM đã được tải
window.addEventListener('DOMContentLoaded', () => {
    // Lắng nghe trạng thái xác thực
    onAuthStateChanged(auth, (user) => {
        if (user) {
            authModal.style.display = 'none';
            mainContent.classList.remove('hidden');
            currentUserIdSpan.textContent = user.uid;
            // Bắt đầu lắng nghe dữ liệu hoặc thực hiện các hành động khác sau khi đăng nhập
        } else {
            authModal.style.display = 'flex';
            mainContent.classList.add('hidden');
            currentUserIdSpan.textContent = '';
        }
    });

    // Chuyển đổi giữa chế độ đăng nhập và đăng ký
    toggleAuthModeBtn.addEventListener('click', () => {
        isLoginMode = !isLoginMode;
        if (isLoginMode) {
            authButton.textContent = 'Đăng nhập';
            toggleAuthModeBtn.textContent = 'Chưa có tài khoản? Đăng ký ngay';
        } else {
            authButton.textContent = 'Đăng ký';
            toggleAuthModeBtn.textContent = 'Đã có tài khoản? Đăng nhập ngay';
        }
    });

    // Xử lý form đăng nhập/đăng ký
    authForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = authForm.email.value;
        const password = authForm.password.value;
        
        try {
            if (isLoginMode) {
                await signInWithEmailAndPassword(auth, email, password);
                showCustomModal("Đăng nhập thành công!");
            } else {
                await createUserWithEmailAndPassword(auth, email, password);
                showCustomModal("Đăng ký thành công!");
            }
        } catch (error) {
            console.error("Authentication failed:", error);
            let message = "Đã xảy ra lỗi. Vui lòng thử lại.";
            if (error.code === 'auth/email-already-in-use') {
                message = "Email này đã được sử dụng. Vui lòng chọn Đăng nhập hoặc sử dụng Email khác.";
            } else if (error.code === 'auth/invalid-email') {
                message = "Địa chỉ email không hợp lệ.";
            } else if (error.code === 'auth/weak-password') {
                message = "Mật khẩu phải có ít nhất 6 ký tự.";
            } else if (error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
                message = "Sai email hoặc mật khẩu.";
            }
            showCustomModal(message);
        }
    });
});