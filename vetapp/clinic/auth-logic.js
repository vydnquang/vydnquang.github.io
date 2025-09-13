import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from './firebase-config.js';

// Khai báo các phần tử DOM
const appContainer = document.getElementById('app-container');
const loginFormContainer = document.getElementById('login-form-container');
const loginForm = document.getElementById('login-form');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const userDisplay = document.getElementById('user-display');

/**
 * Thiết lập các listeners cho trạng thái xác thực.
 * @param {function} callback - Hàm callback sẽ được gọi khi trạng thái đăng nhập thay đổi.
 */
export function setupAuthListeners(callback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Đã đăng nhập
            userDisplay.textContent = `Xin chào, ${user.email}`;
            logoutBtn.classList.remove('hidden');
            loginFormContainer.style.display = 'none';
            appContainer.style.display = 'block';
            callback(user.uid);
        } else {
            // Chưa đăng nhập
            userDisplay.textContent = '';
            logoutBtn.classList.add('hidden');
            loginFormContainer.style.display = 'block';
            appContainer.style.display = 'none';
            callback(null);
        }
    });

    // Gắn sự kiện cho các form và nút
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        try {
            await signInWithEmailAndPassword(auth, email, password);
            alert("Đăng nhập thành công!");
        } catch (error) {
            alert("Lỗi đăng nhập: " + error.message);
            console.error("Login error: ", error);
        }
    });

    registerBtn.addEventListener('click', async () => {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        if (!email || !password) {
            alert("Vui lòng nhập email và mật khẩu để đăng ký.");
            return;
        }
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Thêm trường dữ liệu ban đầu cho người dùng mới
            await setDoc(doc(db, "users", user.uid), {
                email: user.email,
                createdAt: new Date()
            });
            
            alert("Đăng ký thành công! Bạn đã được tự động đăng nhập.");
        } catch (error) {
            alert("Lỗi đăng ký: " + error.message);
            console.error("Registration error: ", error);
        }
    });

    logoutBtn.addEventListener('click', async () => {
        try {
            await signOut(auth);
            alert("Đã đăng xuất thành công.");
        } catch (error) {
            console.error("Logout error: ", error);
        }
    });
}