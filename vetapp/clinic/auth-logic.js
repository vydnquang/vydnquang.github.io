import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from './firebase-config.js';

// Khai báo các phần tử DOM
const loginForm = document.getElementById('login-form');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const loginContainer = document.getElementById('login-form-container'); // Đã sửa ID để khớp với HTML
const appContainer = document.getElementById('app-container');
const userDisplay = document.getElementById('user-display');
const authStatus = document.getElementById('auth-status');

/**
 * Thiết lập các listeners cho trạng thái xác thực.
 * @param {function} loggedInCallback - Hàm callback sẽ được gọi khi người dùng đăng nhập.
 * @param {function} loggedOutCallback - Hàm callback sẽ được gọi khi người dùng đăng xuất.
 */
export function setupAuthListeners(loggedInCallback, loggedOutCallback) {
    onAuthStateChanged(auth, (user) => {
        if (user) {
            // Đã đăng nhập
            if (loginContainer) loginContainer.style.display = 'none';
            if (appContainer) appContainer.style.display = 'block'; // Hiển thị khối chính
            if (userDisplay) userDisplay.textContent = `Xin chào, ${user.email}`;
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (authStatus) authStatus.style.display = 'block';
            if (loggedInCallback) loggedInCallback(user.uid);
        } else {
            // Chưa đăng nhập
            if (loginContainer) loginContainer.style.display = 'block'; // Hiển thị form đăng nhập
            if (appContainer) appContainer.style.display = 'none';
            if (userDisplay) userDisplay.textContent = '';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loggedOutCallback) loggedOutCallback();
        }
    });

    // Gắn sự kiện cho các form và nút
    if (loginForm) {
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
    }

    if (registerBtn) {
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
    }

    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await signOut(auth);
                alert("Đã đăng xuất thành công.");
            } catch (error) {
                console.error("Logout error: ", error);
            }
        });
    }
}
