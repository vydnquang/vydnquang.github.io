import { auth } from './firebase-config.js';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { setDoc, doc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { db } from './firebase-config.js';

// Khai báo các phần tử DOM
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const registerBtn = document.getElementById('register-btn');
const showLoginLink = document.getElementById('show-login-form');
const logoutBtn = document.getElementById('logout-btn');
const loginContainer = document.getElementById('login-form-container');
const appContainer = document.getElementById('app-container');
const userDisplay = document.getElementById('user-display');
const authStatus = document.getElementById('auth-status');
const forgotPasswordLink = document.getElementById('forgot-password-link');
const loginSubmitBtn = document.getElementById('login-submit-btn');
const registerSubmitBtn = document.getElementById('register-submit-btn');

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
            if (appContainer) appContainer.style.display = 'block';
            if (userDisplay) userDisplay.textContent = `Xin chào, ${user.email}`;
            if (logoutBtn) logoutBtn.style.display = 'inline-block';
            if (authStatus) authStatus.style.display = 'block';
            if (loggedInCallback) loggedInCallback(user.uid);
        } else {
            // Chưa đăng nhập
            if (loginContainer) loginContainer.style.display = 'block';
            if (appContainer) appContainer.style.display = 'none';
            if (userDisplay) userDisplay.textContent = '';
            if (logoutBtn) logoutBtn.style.display = 'none';
            if (loggedOutCallback) loggedOutCallback();
        }
    });
    
    // Gắn sự kiện CLICK cho nút Đăng nhập
    if (loginSubmitBtn) {
        loginSubmitBtn.addEventListener('click', async (e) => {
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

    // Gắn sự kiện CLICK cho nút Đăng ký
    if (registerSubmitBtn) {
        registerSubmitBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            const email = document.getElementById('register-email').value;
            const password = document.getElementById('register-password').value;
            try {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const user = userCredential.user;
                
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
    
    // Các logic chuyển đổi form, quên mật khẩu vẫn giữ nguyên
    if (registerBtn) {
        registerBtn.addEventListener('click', () => {
            if (loginForm) loginForm.style.display = 'none';
            if (registerForm) registerForm.style.display = 'block';
        });
    }

    if (showLoginLink) {
        showLoginLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (registerForm) registerForm.style.display = 'none';
            if (loginForm) loginForm.style.display = 'block';
        });
    }
    
    if (forgotPasswordLink) {
        forgotPasswordLink.addEventListener('click', (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            if (email) {
                sendPasswordResetEmail(auth, email)
                    .then(() => {
                        alert("Một email khôi phục mật khẩu đã được gửi đến địa chỉ của bạn. Vui lòng kiểm tra hộp thư!");
                    })
                    .catch((error) => {
                        alert(`Lỗi: ${error.message}. Vui lòng kiểm tra lại email và thử lại.`);
                        console.error("Lỗi khi gửi email khôi phục mật khẩu:", error);
                    });
            } else {
                alert("Vui lòng nhập địa chỉ email của bạn vào trường Email trước khi nhấn 'Quên mật khẩu?'");
            }
        });
    }
}