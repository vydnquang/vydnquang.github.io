import { db } from './firebase-config.js';
import { addDoc, onSnapshot, collection, doc, getDoc, getDocs, updateDoc, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setupAuthListeners } from './auth-logic.js';

// Khai báo các phần tử DOM liên quan đến trang owner_management
const toggleAddOwnerBtn = document.getElementById('toggle-add-owner');
const addOwnerFormContainer = document.getElementById('add-owner-form-container');
const ownerIcon = document.getElementById('owner-icon');
const addOwnerForm = document.getElementById('add-owner-form');
const ownerListDiv = document.getElementById('owner-list');
const managementSection = document.getElementById('management-section');
const currentOwnerNameSpan = document.getElementById('current-owner-name');
const managePetsBtn = document.getElementById('manage-pets-btn');
const managePaymentsBtn = document.getElementById('manage-payments-btn');
const petManagementSection = document.getElementById('pet-management-section');
const paymentManagementSection = document.getElementById('payment-management-section');
const toggleAddPetBtn = document.getElementById('toggle-add-pet');
const addPetFormContainer = document.getElementById('add-pet-form-container');
const petIcon = document.getElementById('pet-icon');
const addPetForm = document.getElementById('add-pet-form');
const petListDiv = document.getElementById('pet-list');
const toggleAddPaymentBtn = document.getElementById('toggle-add-payment');
const addPaymentFormContainer = document.getElementById('add-payment-form-container');
const paymentIcon = document.getElementById('payment-icon');
const paymentForm = document.getElementById('payment-form');
const paymentModal = document.getElementById('payment-modal-backdrop');
const paymentModalCloseBtn = document.getElementById('payment-modal-close-btn');
const paymentModalTitle = document.getElementById('payment-modal-title');
const paymentListDiv = document.getElementById('payment-list');
const manageOwnerBackBtn = document.getElementById('manage-owner-back-btn');
const currentUserIdSpan = document.getElementById('current-user-id');
const customModalBackdrop = document.getElementById('custom-modal-backdrop');
const customModalMessage = document.getElementById('custom-modal-message');
const homeBtn = document.getElementById('home-btn');
const loginContainer = document.getElementById('login-form-container');
const appContainer = document.getElementById('app-container');
// Khai báo các phần tử DOM mới
const ownerSearchInput = document.getElementById('owner-search');

// Khai báo biến toàn cục
let currentUserId = null;
let currentOwnerDocId = null;
// Biến lưu toàn bộ danh sách chủ vật nuôi để phục vụ tìm kiếm
let ownerDataList = [];

//======================================================================
//                2. HÀM HIỂN THỊ MODAL THÔNG BÁO TÙY CHỈNH
//======================================================================
function showCustomModal(message) {
    customModalMessage.textContent = message;
    customModalBackdrop.style.display = 'flex';
}

//======================================================================
//                3. CÁC HÀM LIÊN QUAN ĐẾN OWNER (CHỦ VẬT NUÔI)
//======================================================================
// Hàm tạo ảnh đại diện (avatar) dạng Base64
function generateAvatar(name) {
    const words = name.split(' ').filter(word => word.length > 0);
    let initials = '';

    // Nếu tên có 2 từ trở lên, lấy chữ cái đầu của từ đầu và từ cuối
    if (words.length >= 2) {
        initials = words[0].charAt(0) + words[words.length - 1].charAt(0);
    } 
    // Nếu tên chỉ có 1 từ và dài hơn 1 chữ cái, lấy 2 chữ cái đầu
    else if (words.length === 1 && words[0].length > 1) {
        initials = words[0].substring(0, 2);
    } 
    // Các trường hợp còn lại (tên 1 chữ cái hoặc rỗng), lấy chữ cái đầu tiên
    else if (words.length === 1) {
        initials = words[0].charAt(0);
    }
    else {
        initials = '?';
    }

    const canvas = document.createElement('canvas');
    canvas.width = 60;
    canvas.height = 60;
    const ctx = canvas.getContext('2d');

    // Tạo màu nền ngẫu nhiên
    const colors = ['#f87171', '#fb923c', '#fbbf24', '#facc15', '#a3e635', '#4ade80', '#2dd4bf', '#22d3ee', '#38bdf8', '#60a5fa', '#818cf8', '#a78bfa', '#c084fc', '#e879f9', '#f472b6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    ctx.fillStyle = randomColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Vẽ chữ cái đầu
    ctx.fillStyle = '#fff';
    ctx.font = 'bold 24px Inter';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials.toUpperCase(), canvas.width / 2, canvas.height / 2);

    return canvas.toDataURL(); // Trả về chuỗi Base64
}

// Hàm chuẩn hóa tên để tìm kiếm
function normalizeName(name) {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
}

//======================================================================
//                4. HIỂN THỊ DANH SÁCH CHỦ VẬT NUÔI
//======================================================================
// Lắng nghe danh sách chủ vật nuôi của người dùng hiện tại
function listenForOwners() {
    if (!currentUserId) {
        ownerListDiv.innerHTML = '<p class="text-gray-500 text-center">Vui lòng đăng nhập để xem danh sách.</p>';
        return;
    }

    const ownersCollection = collection(db, `users/${currentUserId}/private/data/owners`);
    onSnapshot(ownersCollection, (snapshot) => {
        ownerDataList = snapshot.docs; // Lưu toàn bộ dữ liệu vào biến toàn cục
        renderOwnerList(ownerDataList);
    }, (error) => {
        console.error("Lỗi khi lắng nghe danh sách chủ vật nuôi: ", error);
        showCustomModal("Lỗi: Không thể tải danh sách chủ vật nuôi. Vui lòng thử lại sau.");
    });
}

// Render toàn bộ danh sách chủ vật nuôi
function renderOwnerList(owners) {
    ownerListDiv.innerHTML = '';
    if (owners.length === 0) {
        ownerListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có chủ vật nuôi nào được thêm.</p>';
        return;
    }

    owners.forEach(doc => {
        const ownerData = doc.data();
        const docId = doc.id;
        
        // Lấy avatar từ Firestore, nếu chưa có thì tạo mới
        const ownerAvatar = ownerData.avatar || generateAvatar(ownerData.ownerName);

        const ownerItem = document.createElement('div');
        ownerItem.className = 'owner-item p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition flex items-center space-x-4';
        ownerItem.dataset.id = docId;
        ownerItem.dataset.name = ownerData.ownerName;
        ownerItem.innerHTML = `
            <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                <img src="${ownerAvatar}" alt="${ownerData.ownerName}" class="w-full h-full object-cover">
            </div>
            <div class="flex-grow">
                <h3 class="font-semibold text-lg text-gray-800">${ownerData.ownerName}</h3>
                <p class="text-gray-600 text-sm"><i class="fas fa-phone-alt mr-2 text-blue-500"></i>${ownerData.phoneNumber}</p>
                <p class="text-gray-600 text-sm"><i class="fa-solid fa-user-group mr-2 text-orange-500"></i>${ownerData.pronoun}</p>
                <p class="text-gray-600 text-sm"><i class="fas fa-map-marker-alt mr-2 text-green-500"></i>${ownerData.address || 'Không có địa chỉ'}</p>
            </div>
            <div>
                <button class="edit-owner-btn text-blue-600 hover:text-blue-800 transition mr-2" data-id="${docId}"><i class="fas fa-edit"></i></button>
                <button class="delete-owner-btn text-red-600 hover:text-red-800 transition" data-id="${docId}"><i class="fas fa-trash-alt"></i></button>
            </div>
        `;
        ownerListDiv.appendChild(ownerItem);
    });
}

// Xử lý sự kiện khi click vào một chủ vật nuôi
function selectOwner(docId, ownerName) {
    currentOwnerDocId = docId;
    currentOwnerNameSpan.textContent = ownerName;
    managementSection.classList.remove('hidden');
    appContainer.classList.add('hidden');
    
    // Tự động chuyển sang tab quản lý thú nuôi và tải dữ liệu
    petManagementSection.classList.remove('hidden');
    paymentManagementSection.classList.add('hidden');
    managePetsBtn.classList.add('bg-blue-600');
    managePaymentsBtn.classList.remove('bg-purple-600');

    listenForPets(currentOwnerDocId);

    // Dòng code mới để tự động cuộn trang
    petManagementSection.scrollIntoView({ behavior: 'smooth' });
}

//======================================================================
//                5. CÁC HÀM LIÊN QUAN ĐẾN PET (THÚ NUÔI)
//======================================================================
// Lắng nghe danh sách thú nuôi của một chủ cụ thể
function listenForPets(ownerId) {
    const petsCollection = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
    onSnapshot(petsCollection, (snapshot) => {
        if (snapshot.empty) {
            petListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có thú nuôi nào cho chủ này.</p>';
            return;
        }

        petListDiv.innerHTML = '';
        snapshot.forEach(doc => {
            const petData = doc.data();
            renderPet(doc.id, petData);
        });
    }, (error) => {
        console.error("Lỗi khi lắng nghe danh sách thú nuôi: ", error);
    });
}

// Render một thú nuôi vào danh sách
function renderPet(docId, petData) {
    const petItem = document.createElement('div');
    petItem.className = 'pet-item p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition flex items-center space-x-4';
    petItem.dataset.id = docId;
    petItem.innerHTML = `
        <div class="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
            <img src="${petData.avatar}" alt="${petData.petName}" class="w-full h-full object-cover">
        </div>
        <div class="flex-grow">
            <h3 class="font-semibold text-lg text-gray-800">${petData.petName}</h3>
            <p class="text-gray-600 text-sm"><strong>Loài:</strong> ${petData.species}</p>
            <p class="text-gray-600 text-sm"><strong>Giống:</strong> ${petData.breed || 'N/A'}</p>
            <p class="text-gray-600 text-sm"><strong>Tính biệt:</strong> ${petData.sex}</p>
        </div>
        <div class="flex-shrink-0 flex items-center space-x-2">
            <button class="edit-pet-btn text-blue-600 hover:text-blue-800 transition mr-2" data-id="${docId}">
                <i class="fas fa-edit"></i>
            </button>
            <button class="delete-pet-btn text-red-600 hover:text-red-800 transition" data-id="${docId}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
    petListDiv.appendChild(petItem);
}

//======================================================================
//                6. CÁC HÀM LIÊN QUAN ĐẾN PAYMENT (THANH TOÁN)
//======================================================================
function listenForPayments(ownerId) {
    const paymentsRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/payments`);
    onSnapshot(paymentsRef, (snapshot) => {
        paymentListDiv.innerHTML = ''; // Clear previous content
        if (snapshot.empty) {
            paymentListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có lịch sử thanh toán nào.</p>';
            return;
        }
        snapshot.forEach(doc => {
            const paymentData = doc.data();
            renderPayment(doc.id, paymentData);
        });
    }, (error) => {
        console.error("Lỗi khi lắng nghe lịch sử thanh toán: ", error);
        showCustomModal("Lỗi: Không thể tải lịch sử thanh toán.");
    });
}

function renderPayment(docId, paymentData) {
    const paymentItem = document.createElement('div');
    paymentItem.className = 'payment-item p-4 bg-gray-100 rounded-lg shadow hover:shadow-lg transition';
    paymentItem.dataset.id = docId;
    paymentItem.dataset.recordId = paymentData.recordId;
    paymentItem.dataset.petId = paymentData.petId;
    paymentItem.innerHTML = `
        <div class="flex justify-between items-center mb-2">
            <h4 class="font-bold text-gray-800 text-lg">Mã hóa đơn: ${paymentData.recordId}</h4>
            <span class="px-3 py-1 rounded-full text-xs font-semibold ${paymentData.paymentStatus === 'paid' ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}">
                ${paymentData.paymentStatus === 'paid' ? 'Đã thanh toán' : 'Chưa thanh toán'}
            </span>
        </div>
        <p class="text-gray-600 text-sm"><strong>Tổng tiền:</strong> ${paymentData.totalPrice ? paymentData.totalPrice.toLocaleString('vi-VN') + ' VND' : 'N/A'}</p>
        <p class="text-gray-600 text-sm"><strong>Ứng trước:</strong> ${paymentData.prepaidAmount ? paymentData.prepaidAmount.toLocaleString('vi-VN') + ' VND' : '0 VND'}</p>
        <p class="text-gray-600 text-sm"><strong>Còn nợ:</strong> <span class="text-red-600 font-semibold">${paymentData.remainingDebt ? paymentData.remainingDebt.toLocaleString('vi-VN') + ' VND' : 'N/A'}</span></p>
    `;
    paymentListDiv.appendChild(paymentItem);
}

//======================================================================
//                7. THIẾT LẬP CÁC SỰ KIỆN CHUNG
//======================================================================
document.addEventListener('DOMContentLoaded', () => {
    // Thu gọn/mở rộng form thêm mới chủ vật nuôi
    toggleAddOwnerBtn.addEventListener('click', () => {
        addOwnerFormContainer.classList.toggle('hidden');
        ownerIcon.classList.toggle('rotated');
    });

// Thu gọn/mở rộng form thêm mới thú nuôi (ĐÃ SỬA LỖI TẠI ĐÂY)
    toggleAddPetBtn.addEventListener('click', () => {
        addPetFormContainer.classList.toggle('hidden');
        petIcon.classList.toggle('rotated');
    });

    // Xử lý các nút tab quản lý
    managePetsBtn.addEventListener('click', () => {
        petManagementSection.classList.remove('hidden');
        paymentManagementSection.classList.add('hidden');
        managePetsBtn.classList.add('bg-blue-600');
        managePetsBtn.classList.remove('bg-blue-500', 'hover:bg-blue-600');
        managePaymentsBtn.classList.remove('bg-purple-600');
        managePaymentsBtn.classList.add('bg-purple-500', 'hover:bg-purple-600');
        listenForPets(currentOwnerDocId);
    });

    managePaymentsBtn.addEventListener('click', () => {
        petManagementSection.classList.add('hidden');
        paymentManagementSection.classList.remove('hidden');
        managePaymentsBtn.classList.add('bg-purple-600');
        managePaymentsBtn.classList.remove('bg-purple-500', 'hover:bg-purple-600');
        managePetsBtn.classList.remove('bg-blue-600');
        managePetsBtn.classList.add('bg-blue-500', 'hover:bg-blue-600');
        listenForPayments(currentOwnerDocId);
    });

    // Quay lại trang quản lý chủ
    manageOwnerBackBtn.addEventListener('click', () => {
        managementSection.classList.add('hidden');
        appContainer.classList.remove('hidden');
    });

    // Lắng nghe các sự kiện click trên danh sách chủ vật nuôi
    ownerListDiv.addEventListener('click', async (e) => {
        const ownerItem = e.target.closest('.owner-item');
        if (!ownerItem) return;

        const docId = ownerItem.dataset.id;

        // Xử lý nút Xóa
        if (e.target.closest('.delete-owner-btn')) {
            if (confirm("Bạn có chắc chắn muốn xóa chủ vật nuôi này và tất cả dữ liệu liên quan (thú nuôi, lịch sử thanh toán)?")) {
                try {
                    const ownerRef = doc(db, `users/${currentUserId}/private/data/owners`, docId);
                    
                    // Xóa các thú cưng
                    const petsSnapshot = await getDocs(collection(ownerRef, "pets"));
                    const petDeletePromises = petsSnapshot.docs.map(petDoc => deleteDoc(petDoc.ref));
                    await Promise.all(petDeletePromises);

                    // Xóa các thanh toán
                    const paymentsSnapshot = await getDocs(collection(ownerRef, "payments"));
                    const paymentDeletePromises = paymentsSnapshot.docs.map(paymentDoc => deleteDoc(paymentDoc.ref));
                    await Promise.all(paymentDeletePromises);
                    
                    // Xóa chủ
                    await deleteDoc(ownerRef);
                    showCustomModal("Xóa chủ vật nuôi và tất cả dữ liệu liên quan thành công!");
                } catch (error) {
                    console.error("Lỗi khi xóa chủ vật nuôi: ", error);
                    showCustomModal("Lỗi: Không thể xóa chủ vật nuôi. Vui lòng thử lại sau.");
                }
            }
        }
        // Xử lý nút Sửa (chủ nuôi)
        else if (e.target.closest('.edit-owner-btn')) {
            // Lấy dữ liệu và điền vào form
            const ownerRef = doc(db, `users/${currentUserId}/private/data/owners`, docId);
            const ownerDoc = await getDoc(ownerRef);
            if (ownerDoc.exists()) {
                const data = ownerDoc.data();
                document.getElementById('ownerName').value = data.ownerName;
                document.getElementById('pronoun').value = data.pronoun;
                document.getElementById('phoneNumber').value = data.phoneNumber;
                document.getElementById('address').value = data.address;
                addOwnerForm.dataset.editingId = docId;
                document.getElementById('cancel-owner-btn').classList.remove('hidden');
                addOwnerFormContainer.classList.remove('hidden');
                toggleAddOwnerBtn.querySelector('.collapsible-icon').classList.add('rotated');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        }
        // Click vào item để xem chi tiết
        else {
            selectOwner(docId, ownerItem.dataset.name);
        }
    });

//======================================================================
//                8. XỬ LÝ FORM THÊM/SỬA CHỦ VẬT NUÔI
//======================================================================
// Lắng nghe sự kiện submit form thêm/sửa chủ vật nuôi
addOwnerForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editingId = addOwnerForm.dataset.editingId;
    const ownerName = document.getElementById('ownerName').value;
    const pronoun = document.getElementById('pronoun').value; // Thêm trường mới
    const phoneNumber = document.getElementById('phoneNumber').value;
    const address = document.getElementById('address').value;

    let ownerData = {};

    // Bước 1: Lấy dữ liệu cũ nếu đang ở chế độ chỉnh sửa
    if (editingId) {
        const docRef = doc(db, `users/${currentUserId}/private/data/owners`, editingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            ownerData = docSnap.data();
        } else {
            console.error("Không tìm thấy tài liệu để cập nhật.");
            return;
        }
    } else {
        // Nếu là chế độ thêm mới, tạo thời gian tạo mới
        ownerData.createdAt = new Date();
    }

    // Bước 2: Cập nhật các trường thông tin từ form
    ownerData.ownerName = ownerName;
    ownerData.pronoun = pronoun;
    ownerData.phoneNumber = phoneNumber;
    ownerData.address = address;

    // Bước 3: Kiểm tra và tạo avatar nếu chưa có
    if (!ownerData.avatar) {
        ownerData.avatar = generateAvatar(ownerName);
    }

    try {
        if (editingId) {
            // Chế độ sửa: cập nhật tài liệu hiện có
            await updateDoc(doc(db, `users/${currentUserId}/private/data/owners`, editingId), ownerData);
            showCustomModal("Cập nhật thông tin chủ vật nuôi thành công!");
            addOwnerForm.dataset.editingId = '';
            document.getElementById('cancel-owner-btn').classList.add('hidden');
        } else {
            // Chế độ thêm mới: thêm tài liệu mới
            await addDoc(collection(db, `users/${currentUserId}/private/data/owners`), ownerData);
            showCustomModal("Thêm chủ vật nuôi thành công!");
        }
        addOwnerForm.reset();
    } catch (error) {
        console.error("Lỗi khi thêm/sửa chủ vật nuôi: ", error);
        showCustomModal("Lỗi: Không thể lưu thông tin. Vui lòng thử lại.");
    }
});

    // Hủy bỏ sửa chữa (chủ thú cưng)
    document.getElementById('cancel-owner-btn').addEventListener('click', () => {
        addOwnerForm.reset();
        addOwnerForm.dataset.editingId = '';
        document.getElementById('cancel-owner-btn').classList.add('hidden');
        addOwnerFormContainer.classList.add('hidden');
        toggleAddOwnerBtn.querySelector('.collapsible-icon').classList.remove('rotated');
    });

    // Lắng nghe các sự kiện click trên danh sách thú nuôi
    petListDiv.addEventListener('click', async (e) => {
        const petItem = e.target.closest('.pet-item');
        if (!petItem) return;

        const docId = petItem.dataset.id; // Đây là pet ID

        // Xử lý nút Xóa
        if (e.target.closest('.delete-pet-btn')) {
            if (confirm("Bạn có chắc chắn muốn xóa thú nuôi này?")) {
                try {
                    await deleteDoc(doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerDocId}/pets`, docId));
                    showCustomModal("Xóa thú nuôi thành công!");
                } catch (error) {
                    console.error("Lỗi khi xóa thú nuôi: ", error);
                    showCustomModal("Lỗi: Không thể xóa thú nuôi. Vui lòng thử lại.");
                }
            }
        }
        // Xử lý nút Sửa (thú cưng)
        else if (e.target.closest('.edit-pet-btn')) {
            // Lấy dữ liệu và điền vào form
            const petRef = doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerDocId}/pets`, docId);
            const petDoc = await getDoc(petRef);
            if (petDoc.exists()) {
                const data = petDoc.data();
                document.getElementById('petName').value = data.petName;
                document.getElementById('petSpecies').value = data.species;
                document.getElementById('petBreed').value = data.breed;
                document.getElementById('petBirthday').value = data.dob;
                document.getElementById('petSex').value = data.sex;
                document.getElementById('petDescription').value = data.description;
                document.getElementById('petIdChip').value = data.petIdChip;
                addPetForm.dataset.editingId = docId;
                document.getElementById('cancel-pet-btn').classList.remove('hidden');
                addPetFormContainer.classList.remove('hidden');
                toggleAddPetBtn.querySelector('.collapsible-icon').classList.add('rotated');
            }
        }
    
// Xử lý click vào thẻ thú nuôi để xem lịch sử khám
        else {
            if (currentOwnerDocId && docId) {
                window.location.href = `medical_records.html?ownerId=${currentOwnerDocId}&petId=${docId}`;
            } else {
                showCustomModal("Lỗi: Không thể tìm thấy thông tin chủ hoặc thú nuôi.");
            }
        }
    });

// Lắng nghe sự kiện submit form thêm/sửa thú nuôi
addPetForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const editingId = addPetForm.dataset.editingId;
    const petName = document.getElementById('petName').value;
    const species = document.getElementById('petSpecies').value;
    const breed = document.getElementById('petBreed').value;
    const dob = document.getElementById('petBirthday').value;
    const sex = document.getElementById('petSex').value;
    const description = document.getElementById('petDescription').value;
    const petIdChip = document.getElementById('petIdChip').value;

    let petData = {};

    // Bước 1: Lấy dữ liệu cũ nếu đang ở chế độ chỉnh sửa
    if (editingId) {
        const docRef = doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerDocId}/pets`, editingId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            petData = docSnap.data();
        } else {
            console.error("Không tìm thấy thú nuôi để cập nhật.");
            return;
        }
    } else {
        // Nếu là chế độ thêm mới, tạo thời gian tạo
        petData.createdAt = new Date();
    }

    // Bước 2: Cập nhật các trường thông tin từ form
    petData.petName = petName;
    petData.species = species;
    petData.breed = breed;
    petData.dob = dob;
    petData.sex = sex;
    petData.description = description;
    petData.petIdChip = petIdChip;

    // Bước 3: Kiểm tra và tạo avatar nếu chưa có
    if (!petData.avatar) {
        petData.avatar = generateAvatar(petName);
    }
    
    try {
        if (editingId) {
            // Chế độ sửa: cập nhật tài liệu hiện có
            await updateDoc(doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerDocId}/pets`, editingId), petData);
            showCustomModal("Cập nhật thông tin thú nuôi thành công!");
            addPetForm.dataset.editingId = '';
            document.getElementById('cancel-pet-btn').classList.add('hidden');
        } else {
            // Chế độ thêm mới: thêm tài liệu mới
            await addDoc(collection(db, `users/${currentUserId}/private/data/owners/${currentOwnerDocId}/pets`), petData);
            showCustomModal("Thêm thú nuôi thành công!");
        }
        addPetForm.reset();
    } catch (error) {
        console.error("Lỗi khi thêm/sửa thú nuôi: ", error);
        showCustomModal("Lỗi: Không thể lưu thông tin. Vui lòng thử lại.");
    }
});

    // Hủy bỏ sửa chữa (thú nuôi)
    document.getElementById('cancel-pet-btn').addEventListener('click', () => {
        addPetForm.reset();
        addPetForm.dataset.editingId = '';
        document.getElementById('cancel-pet-btn').classList.add('hidden');
        addPetFormContainer.classList.add('hidden');
        toggleAddPetBtn.querySelector('.collapsible-icon').classList.remove('rotated');
    });

    // Lắng nghe sự kiện click trên danh sách thanh toán
    paymentListDiv.addEventListener('click', async (e) => {
        const paymentItem = e.target.closest('.payment-item');
        if (!paymentItem) return;

        const docId = paymentItem.dataset.id;

        // Xử lý nút Xóa
        if (e.target.closest('.delete-payment-btn')) {
            if (confirm("Bạn có chắc chắn muốn xóa lịch sử thanh toán này?")) {
                try {
                    await deleteDoc(doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerDocId}/payments`, docId));
                    showCustomModal("Xóa lịch sử thanh toán thành công!");
                } catch (error) {
                    console.error("Lỗi khi xóa thanh toán: ", error);
                    showCustomModal("Lỗi: Không thể xóa lịch sử thanh toán. Vui lòng thử lại.");
                }
            }
        }
    });
});


//======================================================================
//                9. XỬ LÝ TÌM KIẾM CHỦ NUÔI
//======================================================================
ownerSearchInput.addEventListener('input', (e) => {
    const searchTerm = normalizeName(e.target.value);
    const filteredOwners = ownerDataList.filter(doc => {
        const owner = doc.data();
        const normalizedName = normalizeName(owner.ownerName);
        const normalizedPhone = normalizeName(owner.phoneNumber);
        return normalizedName.includes(searchTerm) || normalizedPhone.includes(searchTerm);
    });
    renderOwnerList(filteredOwners);
});


//======================================================================
//                10. LOGIC XÁC THỰC
//======================================================================
// Định nghĩa hàm callback khi người dùng đăng nhập
const onUserLoggedIn = (uid) => {
    currentUserId = uid;
    currentUserIdSpan.textContent = uid;
    console.log("User logged in with ID:", currentUserId);
    listenForOwners();
};

// Định nghĩa hàm callback khi người dùng đăng xuất
const onUserLoggedOut = () => {
    currentUserId = null;
    currentUserIdSpan.textContent = '';
    console.log("User is not logged in.");
    ownerListDiv.innerHTML = '<p class="text-gray-500 text-center">Vui lòng đăng nhập để xem danh sách.</p>';
    managementSection.classList.add('hidden');
};

// GỌI HÀM KHỞI TẠO TỪ auth-logic.js
setupAuthListeners(onUserLoggedIn, onUserLoggedOut);
