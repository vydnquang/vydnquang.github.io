import { db } from './firebase-config.js';
import { setupAuthListeners } from './auth-logic.js';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, getDocs, getDoc, orderBy, limit, where } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

document.addEventListener('DOMContentLoaded', () => {
    const petsList = document.getElementById('pets-list');
    const searchInput = document.getElementById('search-input');
    const ownerSelect = document.getElementById('owner-select');
    const tableBody = document.getElementById('vaccination-table-body');
    const managePaymentsBtn = document.getElementById('manage-payments-btn');
    const exportExcelBtn = document.getElementById('export-excel-btn');
    const importExcelBtn = document.getElementById('import-excel-btn');
    const showUpcomingBtn = document.getElementById('check-reminder-btn');
    const closePetDetailBtn = document.getElementById('close-pet-detail-modal');
    const printQrBtn = document.getElementById('print-qr-btn');
    const addVaccineBtn = document.getElementById('add-vaccination-btn');
    const closeManagePaymentsModalBtn = document.getElementById('close-manage-payments-modal');
    const addVaccinationModal = document.getElementById('add-vaccination-modal');
    const closeAddVaccinationModalBtn = document.getElementById('close-add-vaccination-modal');
    const addVaccinationForm = document.getElementById('add-vaccination-form');
    const vaccineNameSelect = document.getElementById('vaccine-name-select');
    const doctorAddSelect = document.getElementById('doctor-add');
    const dewormingDateAddInput = document.getElementById('deworming-date-add');
    const vaccineNotesAddTextarea = document.getElementById('vaccine-notes');
    const editVaccinationModal = document.getElementById('edit-vaccination-modal');
    const closeEditVaccinationModalBtn = document.getElementById('close-edit-vaccination-modal');
    const editVaccinationForm = document.getElementById('edit-vaccination-form');
    const currentEditVaccinationIdInput = document.getElementById('current-edit-vaccination-id');
    const editVaccineNameSelect = document.getElementById('edit-vaccine-name-select');
    const editVaccineDateInput = document.getElementById('edit-vaccine-date');
    const doctorEditSelect = document.getElementById('doctor-edit');
    const editVaccineNotesTextarea = document.getElementById('edit-vaccine-notes');
    const dewormingDateEditInput = document.getElementById('deworming-date-edit');
    const totalPaidLabel = document.getElementById('total-payment-amount');
    const totalOwedLabel = document.getElementById('total-amount-owed');
    const savePaymentsBtn = document.getElementById('save-payments-status-btn');
    const paymentsTableBody = document.getElementById('payments-table-body');
    const managePaymentsModal = document.getElementById('manage-payments-modal');

    let currentUserId = null;
    let currentPetId = null;
    let currentOwnerId = null;
    let petspecies = null;
    let ownersColRef = null;

    const upcomingVaccinationsModal = document.getElementById('upcoming-vaccinations-modal');
    const closeUpcomingModalBtn = document.getElementById('close-upcoming-modal');
    const upcomingVaccinationsList = document.getElementById('upcoming-vaccinations-list');

    function showModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('hidden');
            modal.classList.add('flex');
        }
    }

    function closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('hidden');
            modal.classList.remove('flex');
        }
    }

/** ĐOẠN CODE TẠO AVATAR TẠM THỜI VÔ HIỆU HÓA    function generateAvatarUrl(petName) {
        const trimmedName = petName.trim();
        let initials = '';
        if (trimmedName.length > 0) {
            const nameParts = trimmedName.split(' ');
            if (nameParts.length > 1) {
                initials = `${nameParts[0].charAt(0).toUpperCase()}${nameParts[nameParts.length - 1].charAt(0).toUpperCase()}`;
            } else if (trimmedName.length >= 2) {
                initials = `${trimmedName.charAt(0).toUpperCase()}${trimmedName.charAt(1).toUpperCase()}`;
            } else {
                initials = trimmedName.charAt(0).toUpperCase();
            }
        }
        const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50', '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800', '#ff5722', '#795548', '#9e9e9e', '#607d8b'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const canvas = document.createElement('canvas');
        canvas.width = 100;
        canvas.height = 100;
        const context = canvas.getContext('2d');
        context.fillStyle = randomColor;
        context.arc(50, 50, 50, 0, 2 * Math.PI);
        context.fill();
        context.fillStyle = '#FFFFFF';
        context.font = 'bold 48px Inter, sans-serif';
        context.textAlign = 'center';
        context.textBaseline = 'middle';
        context.fillText(initials, 50, 50);
        return canvas.toDataURL();
    }
// ĐOẠN CODE TẠO AVATAR TẠM THỜI VÔ HIỆU HÓA */

// Hàm render danh sách thú cưng
function createPetCard(pet, petDocId, ownerDocId, recentlyVaccinatedIds, upcomingIds, overdueIds) {
    const li = document.createElement('li');
    li.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'pet-item', 'transition', 'duration-300', 'hover:shadow-lg', 'hover:scale-105', 'flex', 'items-center', 'gap-4');
    li.setAttribute('data-id', petDocId);
    li.setAttribute('data-owner-id', ownerDocId);
    li.setAttribute('data-pet-id', petDocId);

    const avatarUrl = pet.avatar || 'dogcatavatar.png';

    const hasTerminationRecord = pet.vaccinations ? Object.values(pet.vaccinations).some(v => v.name === 'Dừng tiêm vaccine') : false;
    const isRecentlyVaccinated = recentlyVaccinatedIds.has(petDocId);
    const isUpcoming = upcomingIds.has(petDocId);
    const isOverdue = overdueIds.has(petDocId);

    let tagsHtml = '';
    if (hasTerminationRecord) {
        tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800"><i class="fa-solid fa-ban text-sm mr-1 text-[#ff6969]"></i></span>`;
    }
    if (isRecentlyVaccinated) {
        tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800"><i class="fa-solid fa-syringe text-sm mr-1 text-[#006eff]"></i></span>`;
    }
    if (isUpcoming) {
        tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800"><i class="fa-solid fa-calendar-days text-sm mr-1 text-[#ffbb00]"></i></span>`;
    }
    if (isOverdue) {
        tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800"><i class="fa-solid fa-triangle-exclamation text-sm mr-1 text-[#ff0000]"></i></span>`;
    }

    li.innerHTML = `
        <img src="${avatarUrl}" alt="Avatar thú cưng" class="w-16 h-16 rounded-full object-cover shadow-sm">
        <div class="flex-grow">
            <div class="flex items-center justify-between mb-2">
                <h4 class="text-xl font-bold text-blue-600 flex items-center">
                    ${pet.petName}${tagsHtml}
                </h4>
                <div class="flex gap-2">
                    <button class="view-btn bg-yellow-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold hover:bg-yellow-200" data-id="${petDocId}" data-owner-id="${ownerDocId}">Xem chi tiết</button>
                </div>
            </div>
            <p class="text-gray-600 text-sm">ID: ${petDocId}</p>
            <p class="text-gray-600 text-sm">Loài: ${pet.species}</p>
            <p class="text-gray-600 text-sm owner-name">Chủ: ${pet.ownerName}</p>
        </div>
    `;
    return li;
}

// Hàm truy vấn thông tin của chủ và từng thú nuôi để phục vụ cho các hàm khác có dữ liệu mà thực thi
async function fetchOwnersAndPets() {
    if (!ownersColRef) {
        console.error("Owners collection reference is not initialized.");
        return;
    }
    try {
        petsList.innerHTML = '';
        const ownersSnapshot = await getDocs(query(ownersColRef));
        const allPets = [];
        for (const ownerDoc of ownersSnapshot.docs) {
            const ownerData = ownerDoc.data();
            const ownerId = ownerDoc.id;
            const petsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
            const petsSnapshot = await getDocs(query(petsSubColRef));
            for (const petDoc of petsSnapshot.docs) {
                const vaccinationsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petDoc.id}/vaccinations`);
                const vaccinationsSnapshot = await getDocs(query(vaccinationsSubColRef));
                const vaccinations = {};
                
                // Thu thập và xử lý tất cả các bản ghi tiêm chủng
                vaccinationsSnapshot.forEach(vaccineDoc => {
                    const vaccineData = vaccineDoc.data();
                    // Tính toán nextDoseDate cho từng mũi tiêm
                    const nextVaccine = findNextVaccineDetails(vaccineData.vaccineName, vaccineData.date);
                    if (nextVaccine) {
                        vaccineData.nextDoseDate = nextVaccine.date;
                    }
                    vaccinations[vaccineDoc.id] = vaccineData;
                });

                const petData = petDoc.data();
                const combinedPetData = {
                    ...petData,
                    ownerId: ownerId,
                    ownerName: ownerData.ownerName || 'Không có tên',
                    petId: petDoc.id,
                    vaccinations: vaccinations
                };
                allPets.push(combinedPetData);
            }
        }
        
        const recentlyVaccinatedIds = getRecentlyVaccinatedPets(allPets);
        const upcomingIds = getUpcomingVaccinations(allPets);
        const overdueIds = getOverdueVaccinations(allPets);

        allPets.forEach(pet => {
            const li = createPetCard(pet, pet.petId, pet.ownerId, recentlyVaccinatedIds, upcomingIds, overdueIds);
            petsList.appendChild(li);
        });
    } catch (e) {
        console.error("Lỗi khi tải dữ liệu chủ và thú cưng: ", e);
        alert("Có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
    }
}

/**
 * Tính toán ngày tiêm kế tiếp dựa trên tên vaccine và ngày tiêm trước đó, kèm theo nhắc nhở.
 * @param {string} vaccineName - Tên của loại vaccine đã tiêm.
 * @param {string} lastVaccinationDate - Ngày tiêm trước đó (định dạng 'YYYY-MM-DD').
 * @returns {string} Ngày tiêm kế tiếp và kèm nhắc nhở nếu quá hạn hoặc sắp đến.
 */
function calculateNextVaccinationDate(vaccineName, lastVaccinationDate) {
    // Xử lý trường hợp đặc biệt "Dừng tiêm vaccine"
    if (vaccineName === 'Dừng tiêm vaccine') {
        return 'Đã ngừng quản lý tiêm phòng';
    }

    if (!lastVaccinationDate || typeof lastVaccinationDate !== 'string') {
        return 'N/A';
    }

    const lastDate = new Date(lastVaccinationDate);
    if (isNaN(lastDate.getTime())) {
        return 'N/A';
    }

    let nextDate = new Date(lastDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Đặt giờ về 00:00:00 để so sánh chính xác

    // Logic của ngày tiêm kế tiếp dựa trên tên vaccine
    switch (vaccineName) {
        case 'Dại':
        case '7 bệnh mũi 3':
        case '7 bệnh hằng năm':
        case '4 bệnh mũi 3':
        case '4 bệnh hằng năm':
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        case '7 bệnh mũi 1':
        case '7 bệnh mũi 2':
        case '4 bệnh mũi 1':
        case '4 bệnh mũi 2':
            nextDate.setDate(nextDate.getDate() + 21);
            break;
        default:
            return 'N/A';
    }

    const nextDateString = nextDate.toISOString().split('T')[0];
    
    // Tính toán số ngày còn lại đến lịch tiêm
    const oneDay = 1000 * 60 * 60 * 24;
    const remainingDays = Math.ceil((nextDate.getTime() - today.getTime()) / oneDay);

    // Kiểm tra và trả về kết quả
    if (remainingDays < 0) {
        const overdueDays = Math.abs(remainingDays);
        return `${nextDateString} (Đã quá hạn ${overdueDays} ngày - Cần tiêm nhắc ngay)`;
    } else if (remainingDays >= 0 && remainingDays <= 5) {
        return `${nextDateString} (Sắp tới lịch tiêm mũi kế tiếp)`;
    } else {
        return nextDateString;
    }
}

    // Hàm tải lịch sử tiêm phòng của thú cưng
    async function fetchVaccinationHistory(petId, ownerId) {
        const historyTableBody = document.getElementById('vaccination-history-table-body');
        if (!historyTableBody) return;
        historyTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Đang tải lịch sử tiêm phòng...</td></tr>';
        const vaccinationsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}/vaccinations`);
        try {
            const vaccinationsSnapshot = await getDocs(query(vaccinationsSubColRef));
            historyTableBody.innerHTML = '';
            if (vaccinationsSnapshot.empty) {
                historyTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Chưa có mũi tiêm nào được ghi nhận.</td></tr>';
            } else {
                vaccinationsSnapshot.forEach(vaccineDoc => {
                    const vaccineData = vaccineDoc.data();
                    const nextVaccinationDate = calculateNextVaccinationDate(vaccineData.name, vaccineData.date);
                    const row = document.createElement('tr');
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccineData.name || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccineData.date || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${nextVaccinationDate || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccineData.doctor || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccineData.notes || 'N/A'}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <button class="edit-vaccination-btn text-indigo-600 hover:text-indigo-900 mr-2" data-id="${vaccineDoc.id}">Chỉnh sửa</button>
                            <button class="delete-vaccination-btn text-red-600 hover:text-red-900" data-id="${vaccineDoc.id}">Xóa</button>
                        </td>
                    `;
                    historyTableBody.appendChild(row);
                });
            }
        } catch (e) {
            console.error("Lỗi khi tải lịch sử tiêm phòng: ", e);
            historyTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-red-500">Lỗi khi tải dữ liệu.</td></tr>';
        }
    }

// Hàm hiển thị thông tin thú cưng khi nhấn nút "Xem chi tiết"
    async function showPetDetails(petId, ownerId) {
    if (!ownerId) {
        console.error("Owner ID is missing.");
        alert("Thông tin chủ thú cưng không hợp lệ.");
        return;
    }
    currentPetId = petId;
    currentOwnerId = ownerId;
    const petDocRef = doc(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`, petId);
    const ownerDocRef = doc(db, `users/${currentUserId}/private/data/owners`, ownerId);
    try {
        const petDoc = await getDoc(petDocRef);
        const ownerDoc = await getDoc(ownerDocRef);
        if (petDoc.exists() && ownerDoc.exists()) {
            const petData = petDoc.data();
            const ownerData = ownerDoc.data();
            petspecies = petData.species;
            // Cập nhật đường dẫn ảnh để lấy từ dữ liệu đã lưu trữ, sử dụng ảnh mặc định nếu không có
            document.getElementById('pet-detail-pet-photo').src = petData.avatar || 'dogcatavatar.png';
            document.getElementById('pet-detail-pet-id').textContent = `ID: ${petId}`;
            document.getElementById('pet-detail-pet-name').textContent = petData.petName;
            document.getElementById('pet-detail-pet-type').textContent = `Loài: ${petData.species}`;
            document.getElementById('pet-detail-pet-breed').textContent = `Giống: ${petData.breed || 'N/A'}`;
            document.getElementById('pet-detail-pet-dob').textContent = `Ngày sinh: ${petData.dob || 'N/A'}`;
            document.getElementById('pet-detail-pet-gender').textContent = `Giới tính: ${petData.sex || 'N/A'}`;
            document.getElementById('pet-detail-pet-owner').textContent = `Chủ: ${ownerData.ownerName || 'N/A'}`;
            document.getElementById('pet-detail-pet-phone').textContent = `Số điện thoại: ${ownerData.phoneNumber || 'N/A'}`;
            document.getElementById('pet-detail-pet-address').textContent = `Địa chỉ: ${ownerData.address || 'N/A'}`;
            const qrCodeContainer = document.getElementById('pet-qr-code');
            qrCodeContainer.innerHTML = '';
            new QRCode(qrCodeContainer, {
                text: petId,
                width: 64,
                height: 64,
                colorDark : "#000000",
                colorLight : "#ffffff",
                correctLevel : QRCode.CorrectLevel.H
            });



            // Bổ sung code cho nút "Gọi điện"
            document.getElementById('call-btn').onclick = () => {
                const phoneNumber = ownerData.phoneNumber;
                if (phoneNumber) {
                    window.location.href = `tel:${ownerData.phoneNumber.replace(/\s/g, '')}`;
                } else {
                    alert('Không có số điện thoại để gọi.');
                }
            };

            // Bổ sung code cho nút "Chat Zalo"
            document.getElementById('zalo-btn').onclick = () => {
                const phoneNumber = ownerData.phoneNumber;
                if (phoneNumber) {
                    window.open(`https://zalo.me/${ownerData.phoneNumber.replace(/\s/g, '')}`, '_blank');
                } else {
                    alert('Không có số điện thoại để chat Zalo.');
                }
            };




            fetchVaccinationHistory(petId, ownerId);
            showModal('pet-detail-modal');
        } else {
            console.error("No such pet or owner document!");
            alert("Không tìm thấy thông tin thú cưng.");
        }
    } catch (e) {
        console.error("Lỗi khi hiển thị chi tiết thú cưng: ", e);
        alert("Có lỗi xảy ra, không thể hiển thị chi tiết thú cưng.");
    }
}

// Hàm in mã QR số ID thú cưng
function printQRCode() {
    const qrCodeContainer = document.getElementById('pet-qr-code');
    if (!qrCodeContainer) {
        alert("Không tìm thấy mã QR để in.");
        return;
    }

    const petName = document.getElementById('pet-detail-pet-name').textContent;

    // Tạo một div duy nhất để chứa tất cả nội dung in
    const printDiv = document.createElement('div');
    printDiv.style.fontFamily = 'sans-serif';
    printDiv.style.fontSize = '10px';
    printDiv.style.lineHeight = '1.2'; // Khoảng cách các dòng
    
    // Thêm các phần tử vào một div duy nhất
    printDiv.innerHTML = `
        <p style="margin: 0; padding: 0; font-weight: bold;">An Nhơn Pet</p>
        <div style="margin: 2px 0;">
            ${qrCodeContainer.innerHTML}
        </div>
        <p style="margin: 0; padding: 0;">${petName}</p>
    `;

    const printWindow = window.open('', '_blank', 'height=150,width=113'); // Tỉ lệ xấp xỉ kích cỡ tem 3x4cm (113x150 px)
    printWindow.document.write('<html><head><title>In Mã QR</title>');
    printWindow.document.write('<style>');
    // Áp dụng căn giữa cho toàn bộ body
    printWindow.document.write('body { margin: 0; padding: 5px; text-align: center; }'); 
    printWindow.document.write('img { width: 80px; height: 80px; display: block; margin: 0 auto; }'); // Kích thước ảnh QR khi in ra
    printWindow.document.write('</style>');
    printWindow.document.write('</head><body>');
    printWindow.document.write(printDiv.innerHTML);
    printWindow.document.write('</body></html>');
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
}

    async function addVaccinationToDb(vaccinationData) {
        if (!currentPetId || !currentOwnerId) {
            alert("Thiếu thông tin thú cưng hoặc chủ nuôi.");
            return;
        }
        const vaccinationsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${currentOwnerId}/pets/${currentPetId}/vaccinations`);
        try {
            await addDoc(vaccinationsSubColRef, vaccinationData);
            alert("Thêm mũi tiêm thành công!");
            closeModal('add-vaccination-modal');
            addVaccinationForm.reset();
            fetchVaccinationHistory(currentPetId, currentOwnerId);
        } catch (e) {
            console.error("Lỗi khi thêm mũi tiêm: ", e);
            alert("Lỗi khi thêm mũi tiêm. Vui lòng thử lại.");
        }
    }

    async function updateVaccinationInDb(vaccinationId, updatedData) {
        if (!currentPetId || !currentOwnerId || !vaccinationId) {
            alert("Thiếu thông tin để cập nhật.");
            return;
        }
        const vaccinationDocRef = doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerId}/pets/${currentPetId}/vaccinations`, vaccinationId);
        try {
            await updateDoc(vaccinationDocRef, updatedData);
            alert("Cập nhật mũi tiêm thành công!");
            closeModal('edit-vaccination-modal');
            editVaccinationForm.reset();
            fetchVaccinationHistory(currentPetId, currentOwnerId);
        } catch (e) {
            console.error("Lỗi khi cập nhật mũi tiêm: ", e);
            alert("Lỗi khi cập nhật mũi tiêm. Vui lòng thử lại.");
        }
    }

    async function deleteVaccinationFromDb(vaccinationId) {
        if (!currentPetId || !currentOwnerId || !vaccinationId) {
            alert("Thiếu thông tin để xóa.");
            return;
        }

        if (confirm("Bạn có chắc chắn muốn xóa mũi tiêm này? Hành động này không thể hoàn tác.")) {
            const vaccinationDocRef = doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerId}/pets/${currentPetId}/vaccinations`, vaccinationId);
            try {
                await deleteDoc(vaccinationDocRef);
                alert("Xóa mũi tiêm thành công!");
                fetchVaccinationHistory(currentPetId, currentOwnerId);
            } catch (e) {
                console.error("Lỗi khi xóa mũi tiêm: ", e);
                alert("Lỗi khi xóa mũi tiêm. Vui lòng thử lại.");
            }
        }
    }

    function populateVaccineSelect(species, selectElement) {
        let vaccines = [];
        const normalizedSpecies = species ? species.toLowerCase() : '';
        if (normalizedSpecies === 'chó') {
            vaccines = ['Dại', '7 bệnh mũi 1', '7 bệnh mũi 2', '7 bệnh mũi 3', '7 bệnh hằng năm', 'Dừng tiêm vaccine'];
        } else if (normalizedSpecies === 'mèo') {
            vaccines = ['Dại', '4 bệnh mũi 1', '4 bệnh mũi 2', '4 bệnh mũi 3', '4 bệnh hằng năm', 'Dừng tiêm vaccine'];
        } else {
            vaccines = [];
        }
        selectElement.innerHTML = '<option value="">Chọn vắc xin</option>';
        vaccines.forEach(vaccine => {
            const option = document.createElement('option');
            option.value = vaccine;
            option.textContent = vaccine;
            selectElement.appendChild(option);
        });
    }


// Hàm hiển thị tình trạng thanh toán của từng mũi tiêm cho thú cưng
    async function fetchAndDisplayAllVaccinationsForPayment() {
        const paymentsTableBody = document.getElementById('payments-table-body');
        if (!paymentsTableBody) return;
        paymentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">Đang tải danh sách thanh toán...</td></tr>';
        try {
            const allVaccinations = [];
            const ownersSnapshot = await getDocs(query(ownersColRef));
            for (const ownerDoc of ownersSnapshot.docs) {
                const ownerId = ownerDoc.id;
                const petsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
                const petsSnapshot = await getDocs(query(petsSubColRef));
                for (const petDoc of petsSnapshot.docs) {
                    const petData = petDoc.data();
                    const petId = petDoc.id;
                    const vaccinationsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}/vaccinations`);
                    const vaccinationsSnapshot = await getDocs(query(vaccinationsSubColRef));
                    vaccinationsSnapshot.forEach(vaccineDoc => {
                        const vaccineData = vaccineDoc.data();
                        allVaccinations.push({
                            petName: petData.petName,
                            vaccinationId: vaccineDoc.id,
                            vaccinationName: vaccineData.name,
                            vaccinationDate: vaccineData.date,
                            paymentAmount: vaccineData.paymentAmount || 0,
                            paymentStatus: vaccineData.paymentStatus || 'Còn nợ',
                            petId: petId,
                            ownerId: ownerId
                        });
                    });
                }
            }
            paymentsTableBody.innerHTML = '';
            if (allVaccinations.length === 0) {
                paymentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-gray-500">Chưa có mũi tiêm nào được ghi nhận.</td></tr>';
            } else {
                allVaccinations.forEach(vaccine => {
                    const row = document.createElement('tr');
                    row.classList.add('cursor-pointer', 'hover:bg-gray-100');
                    row.setAttribute('data-pet-id', vaccine.petId);
                    row.setAttribute('data-owner-id', vaccine.ownerId);
                    row.setAttribute('data-vaccination-id', vaccine.vaccinationId);
                    const isPaid = vaccine.paymentStatus === 'Đã thanh toán';
                    row.innerHTML = `
                        <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">${vaccine.petName}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccine.vaccinationDate}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccine.vaccinationName}</td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <input type="number" class="payment-amount-input w-24 border border-gray-300 rounded-md p-1 text-sm text-right" placeholder="0" value="${vaccine.paymentAmount}">
                        </td>
                        <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            <div class="flex items-center gap-4">
                                <label class="inline-flex items-center">
                                    <input type="radio" class="form-radio" name="status-${vaccine.vaccinationId}" value="Đã thanh toán" ${isPaid ? 'checked' : ''}>
                                    <span class="ml-2">Đã thanh toán</span>
                                </label>
                                <label class="inline-flex items-center">
                                    <input type="radio" class="form-radio" name="status-${vaccine.vaccinationId}" value="Còn nợ" ${!isPaid ? 'checked' : ''}>
                                    <span class="ml-2">Còn nợ</span>
                                </label>
                            </div>
                        </td>
                    `;
                    paymentsTableBody.appendChild(row);
                });
            }
        } catch (e) {
            console.error("Lỗi khi tải danh sách thanh toán: ", e);
            paymentsTableBody.innerHTML = '<tr><td colspan="5" class="text-center py-4 text-red-500">Lỗi khi tải dữ liệu thanh toán.</td></tr>';
        }
    }

    const updateTotals = () => {
        if (!totalPaidLabel || !totalOwedLabel || !paymentsTableBody) {
            console.warn("HTML elements for payments are not yet available.");
            return;
        }
        let totalPaid = 0;
        let totalOwed = 0;
        const rows = paymentsTableBody.querySelectorAll('tr[data-vaccination-id]');
        rows.forEach(row => {
            const amountInput = row.querySelector('.payment-amount-input');
            const paidRadio = row.querySelector('input[type="radio"][value="Đã thanh toán"]');
            const amount = parseFloat(amountInput.value) || 0;
            if (paidRadio.checked) {
                totalPaid += amount;
            } else {
                totalOwed += amount;
            }
        });
        totalPaidLabel.textContent = `Tổng số tiền đã thanh toán: ${totalPaid.toLocaleString('vi-VN')} VNĐ`;
        totalOwedLabel.textContent = `Tổng số tiền còn nợ: ${totalOwed.toLocaleString('vi-VN')} VNĐ`;
    };

    function initializeFirestoreReferences(userId) {
        ownersColRef = collection(db, `users/${userId}/private/data/owners`);
    }

    function loadPetsFromFirebase() {
        if (currentUserId) {
            fetchOwnersAndPets();
        }
    }

// Khai báo các biến DOM cho nút và khung quét mã QR
    const qrScanBtn = document.getElementById('qr-scan-btn');
    const closeQrBtn = document.getElementById('close-qr-btn');
    const qrReader = document.getElementById('qr-reader');

    let html5QrCode;

// Hàm xử lý khi quét mã QR thành công
const onScanSuccess = (decodedText, decodedResult) => {
    // decodedText chính là nội dung của mã QR (ID thú cưng)
    alert(`Mã QR đã quét: ${decodedText}`);

    // Điền ID thú cưng vào ô tìm kiếm
    searchInput.value = decodedText;

    // Gọi hàm lọc để tự động tìm kiếm ngay lập tức
    filterPets();

    // Dừng camera
    html5QrCode.stop().then(ignore => {
        qrReader.style.display = 'none';
        qrScanBtn.style.display = 'block';
        closeQrBtn.style.display = 'none';
    }).catch(err => {
        console.error("Lỗi khi dừng camera:", err);
    });
};

    // Hàm xử lý khi có lỗi quét mã QR
    const onScanFailure = (error) => {
        // console.warn(`Mã QR không quét được, hãy thử lại: ${error}`);
    };

    // Gắn sự kiện click cho nút "Quét mã QR"
    qrScanBtn?.addEventListener('click', () => {
        qrReader.style.display = 'block';
        qrScanBtn.style.display = 'none';
        closeQrBtn.style.display = 'block';

        html5QrCode = new Html5Qrcode("qr-reader");
        html5QrCode.start(
            { facingMode: "environment" }, // Ưu tiên camera sau
            { fps: 10, qrbox: { width: 250, height: 250 } },
            onScanSuccess,
            onScanFailure
        ).catch(err => {
            console.error("Lỗi khi khởi động camera:", err);
            alert("Không thể khởi động camera. Vui lòng cho phép quyền truy cập.");
            qrReader.style.display = 'none';
            qrScanBtn.style.display = 'block';
            closeQrBtn.style.display = 'none';
        });
    });

    // Gắn sự kiện click cho nút "Tắt Camera"
    closeQrBtn?.addEventListener('click', () => {
        if (html5QrCode) {
            html5QrCode.stop().then(ignore => {
                qrReader.style.display = 'none';
                qrScanBtn.style.display = 'block';
                closeQrBtn.style.display = 'none';
            }).catch(err => {
                console.error("Lỗi khi dừng camera:", err);
            });
        }
    });

// Hàm tìm kiếm thú cưng
function filterPets() {
    // Lấy giá trị gốc từ ô tìm kiếm, không chuẩn hóa
    const rawFilterText = searchInput.value.trim();

    // Biến để theo dõi xem đã tìm thấy thú cưng nào chưa
    let petFound = false;

    // Duyệt qua tất cả các thú cưng
    Array.from(petsList.getElementsByClassName('pet-item')).forEach(item => {
        const petId = item.dataset.petId;
        const petName = item.querySelector('h4').textContent;
        const ownerName = item.querySelector('.owner-name').textContent;

        // --- Bước 1: Tìm kiếm theo ID thú cưng từ mã QR (Ưu tiên) ---
        // So sánh trực tiếp ID gốc, không qua chuẩn hóa
        if (rawFilterText === petId) {
            item.style.display = 'flex';
            petFound = true;
            return; // Dừng vòng lặp forEach ngay lập tức khi tìm thấy
        }

        // --- Bước 2: Nếu không khớp ID, tìm kiếm theo Tên hoặc Chủ ---
        // Chuẩn hóa từ khóa tìm kiếm và các tên để so sánh
        const normalizedFilterText = rawFilterText
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const normalizedPetName = petName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        const normalizedOwnerName = ownerName
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');

        if (normalizedPetName.includes(normalizedFilterText) || normalizedOwnerName.includes(normalizedFilterText)) {
            // Nếu tìm thấy theo tên, hiển thị ra
            item.style.display = 'flex';
            petFound = true;
        } else {
            // Nếu không tìm thấy, ẩn đi
            item.style.display = 'none';
        }
    });

    // Nếu không tìm thấy thú cưng nào qua cả hai cách, tất cả đều sẽ bị ẩn
    if (rawFilterText === '' && petFound === false) {
      Array.from(petsList.getElementsByClassName('pet-item')).forEach(item => {
        item.style.display = 'flex';
      });
    }
}



// đoạn vừa bỏ

    // Hàm phụ trợ: tính toán ngày và tên mũi tiêm kế tiếp dựa trên logic của bạn
    function findNextVaccineDetails(vaccineName, lastVaccinationDate) {
        if (!lastVaccinationDate || typeof lastVaccinationDate !== 'string') {
            return null;
        }

        const lastDate = new Date(lastVaccinationDate);
        if (isNaN(lastDate.getTime())) {
            return null;
        }

        let nextDate = new Date(lastDate);
        let nextVaccineName = 'N/A';
        
        switch (vaccineName) {
            case 'Dại':
            case '7 bệnh hằng năm':
            case '4 bệnh hằng năm':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                nextVaccineName = vaccineName;
                break;
            case '7 bệnh mũi 1':
                nextDate.setDate(nextDate.getDate() + 21);
                nextVaccineName = '7 bệnh mũi 2';
                break;
            case '7 bệnh mũi 2':
                nextDate.setDate(nextDate.getDate() + 21);
                nextVaccineName = '7 bệnh mũi 3';
                break;
            case '7 bệnh mũi 3':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                nextVaccineName = '7 bệnh hằng năm';
                break;
            case '4 bệnh mũi 1':
                nextDate.setDate(nextDate.getDate() + 21);
                nextVaccineName = '4 bệnh mũi 2';
                break;
            case '4 bệnh mũi 2':
                nextDate.setDate(nextDate.getDate() + 21);
                nextVaccineName = '4 bệnh mũi 3';
                break;
            case '4 bệnh mũi 3':
                nextDate.setFullYear(nextDate.getFullYear() + 1);
                nextVaccineName = '4 bệnh hằng năm';
                break;
            default:
                return null;
        }

        return {
            name: nextVaccineName,
            date: nextDate.toISOString().split('T')[0]
        };
    }

// Hàm chính để tìm tất cả lịch tiêm sắp tới và cập nhật số lượng trên nút
async function findUpcomingVaccinations() {
    showLoadingSpinner();
    const ownersSnapshot = await getDocs(query(ownersColRef));
    
    const ownersMap = {};
    ownersSnapshot.forEach(doc => {
        ownersMap[doc.id] = doc.data().ownerName || 'N/A';
    });

    const reminders = [];
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    for (const ownerDoc of ownersSnapshot.docs) {
        const ownerId = ownerDoc.id;
        const petsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
        const petsSnapshot = await getDocs(query(petsSubColRef));

        for (const petDoc of petsSnapshot.docs) {
            const petData = petDoc.data();
            const petId = petDoc.id;
            
            // Lấy tất cả các mũi tiêm của thú cưng
            const vaccinationsSubColRef = collection(doc(petsSubColRef, petId), 'vaccinations');
            const vaccinationsSnapshot = await getDocs(query(vaccinationsSubColRef));
            const vaccinations = vaccinationsSnapshot.docs.map(doc => doc.data());
            
            if (vaccinations.length === 0) {
                continue;
            }

            // Bỏ qua nếu có mũi tiêm "Dừng tiêm vaccine"
            const hasTerminationRecord = vaccinations.some(v => v.name === 'Dừng tiêm vaccine');
            if (hasTerminationRecord) {
                continue;
            }

            // Tách các mũi tiêm theo từng loại vaccine để kiểm tra độc lập
            const latestVaccines = {
                'dại': null,
                '7benh': null,
                '4benh': null,
            };

            vaccinations.forEach(vaccine => {
                const vaccineDate = new Date(vaccine.date);
                if (vaccine.name === 'Dại') {
                    if (!latestVaccines['dại'] || vaccineDate > new Date(latestVaccines['dại'].date)) {
                        latestVaccines['dại'] = vaccine;
                    }
                } else if (vaccine.name.includes('7 bệnh')) {
                    if (!latestVaccines['7benh'] || vaccineDate > new Date(latestVaccines['7benh'].date)) {
                        latestVaccines['7benh'] = vaccine;
                    }
                } else if (vaccine.name.includes('4 bệnh')) {
                    if (!latestVaccines['4benh'] || vaccineDate > new Date(latestVaccines['4benh'].date)) {
                        latestVaccines['4benh'] = vaccine;
                    }
                }
            });

            // Kiểm tra lịch tiêm sắp tới cho từng loại vaccine
            for (const type in latestVaccines) {
                const latestVaccine = latestVaccines[type];
                if (latestVaccine) {
                    const nextVaccine = findNextVaccineDetails(latestVaccine.name, latestVaccine.date);
                    if (nextVaccine) {
                        const nextDoseDate = new Date(nextVaccine.date);
                        nextDoseDate.setHours(0, 0, 0, 0);

                        if (nextDoseDate >= today && nextDoseDate <= oneWeekFromNow) {
                            const oneDay = 1000 * 60 * 60 * 24;
                            const remainingDays = Math.ceil((nextDoseDate.getTime() - today.getTime()) / oneDay);
                            
                            const ownerName = ownersMap[ownerId];

                            reminders.push({
                                petName: petData.petName,
                                ownerName: ownerName || 'N/A',
                                nextVaccineName: nextVaccine.name,
                                nextVaccineDate: nextVaccine.date,
                                reminderText: `(Còn ${remainingDays} ngày)`,
                                ownerId: ownerId,
                                petId: petId
                            });
                            // Thoát vòng lặp khi tìm thấy một lịch tiêm sắp tới
                            break;
                        } else if (nextDoseDate < today) {
                            const oneDay = 1000 * 60 * 60 * 24;
                            const overdueDays = Math.abs(Math.floor((nextDoseDate.getTime() - today.getTime()) / oneDay));
                            
                            const ownerName = ownersMap[ownerId];
                            
                            reminders.push({
                                petName: petData.petName,
                                ownerName: ownerName || 'N/A',
                                nextVaccineName: nextVaccine.name,
                                nextVaccineDate: nextVaccine.date,
                                reminderText: `(Đã quá hạn ${overdueDays} ngày)`,
                                ownerId: ownerId,
                                petId: petId
                            });
                            // Thoát vòng lặp khi tìm thấy một lịch tiêm quá hạn
                            break;
                        }
                    }
                }
            }
        }
    }
    
    hideLoadingSpinner();
    return reminders;
}


// CÁC HÀM PHỤ ĐỂ HIỆN NHẮC LỊCH TIÊM



// Hàm hiển thị hiệu ứng tải
function showLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'flex';
}


// Hàm ẩn hiệu ứng tải
function hideLoadingSpinner() {
    document.getElementById('loading-spinner').style.display = 'none';
}

// Hàm hiển thị danh sách lịch tiêm sắp tới lên modal
function renderUpcomingVaccinations(reminders) {
    const reminderListContainer = document.getElementById('reminder-list');
    const reminderModal = document.getElementById('reminder-modal');
    const reminderListTitle = document.getElementById('reminder-list-title');

    if (!reminderListContainer || !reminderModal) {
        console.error("Không tìm thấy các phần tử DOM cần thiết cho modal nhắc lịch.");
        return;
    }

    reminderListContainer.innerHTML = '';
    
    if (reminders.length === 0) {
        reminderListContainer.innerHTML = '<p class="text-center text-gray-500">Không có lịch tiêm nào cần nhắc nhở.</p>';
        reminderListTitle.textContent = "Lịch tiêm sắp tới (0)";
    } else {
        reminderListTitle.textContent = `Lịch tiêm sắp tới (${reminders.length})`;
        reminders.forEach(reminder => {
            const item = document.createElement('div');
            item.className = 'bg-gray-100 p-4 rounded-lg shadow-sm border border-l-4 border-blue-400 mb-2 cursor-pointer transition-transform hover:scale-[1.01]';
            item.innerHTML = `
                <h4 class="font-semibold text-lg text-blue-800">${reminder.petName} <span class="text-sm text-gray-500">- Chủ: ${reminder.ownerName}</span></h4>
                <p class="text-gray-700">Mũi tiêm kế tiếp: <span class="font-medium">${reminder.nextVaccineName}</span></p>
                <p class="text-gray-700">Ngày tiêm: <span class="font-medium">${reminder.nextVaccineDate} ${reminder.reminderText}</span></p>
            `;
            reminderListContainer.appendChild(item);

            // GẮN SỰ KIỆN CLICK VÀO ĐÂY
            item.addEventListener('click', () => {
                // Đóng modal nhắc lịch
                closeModal('reminder-modal');
                // Gọi hàm hiển thị chi tiết thú cưng
                showPetDetails(reminder.petId, reminder.ownerId);
            });
        });
    }
    
    showModal('reminder-modal');
}

// Gắn sự kiện cho nút "Kiểm tra nhắc lịch tiêm"
document.getElementById('check-reminder-btn')?.addEventListener('click', async () => {
    // Khi click, vừa lấy dữ liệu vừa hiển thị modal
    const reminders = await findUpcomingVaccinations();
    renderUpcomingVaccinations(reminders);
});

// Gắn sự kiện nút đóng modal nhắc lịch
document.getElementById('close-reminder-modal')?.addEventListener('click', () => {
    closeModal('reminder-modal');
});


// Hàm xuất dữ liệu ra file Excel, bao gồm cả lịch sử tiêm phòng, có bộ lọc
// Hàm xuất dữ liệu ra file Excel có lọc theo vaccine và ngày
async function exportToExcel() {
    showLoadingSpinner();
    
    try {
        const vaccineName = document.getElementById('vaccine-select').value;
        const startDateStr = document.getElementById('start-date').value;
        const endDateStr = document.getElementById('end-date').value;

        // Chuyển đổi ngày sang định dạng chuẩn để truy vấn Firestore
        const startDate = startDateStr ? startDateStr : null;
        const endDate = endDateStr ? endDateStr : null;
        
        const ownersSnapshot = await getDocs(query(ownersColRef));
        const filteredPetsData = [];
        const filteredVaccinationsData = [];
        const ownersMap = {};
        const petsWithMatchingVaccines = new Set();
        
        ownersSnapshot.forEach(doc => {
            ownersMap[doc.id] = doc.data();
        });

        // Bước 1: Lấy tất cả các mũi tiêm phù hợp với tiêu chí lọc
        for (const ownerDoc of ownersSnapshot.docs) {
            const ownerId = ownerDoc.id;
            const petsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
            const petsSnapshot = await getDocs(query(petsSubColRef));

            for (const petDoc of petsSnapshot.docs) {
                const petId = petDoc.id;
                const vaccinationsColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}/vaccinations`);
                
                let q = query(vaccinationsColRef);
                
                // Thêm các điều kiện lọc vào query nếu có
                if (vaccineName) {
                    q = query(q, where('name', '==', vaccineName));
                }
                if (startDate && endDate) {
                    q = query(q, where('date', '>=', startDate), where('date', '<=', endDate));
                }
                
                const vaccinationsSnapshot = await getDocs(q);

                vaccinationsSnapshot.forEach(vaccineDoc => {
                    const vaccineData = vaccineDoc.data();
                    filteredVaccinationsData.push({
                        'ID Mũi tiêm': vaccineDoc.id,
                        'ID Thú cưng': petId,
                        'ID Chủ nuôi': ownerId,
                        'Tên Vắc xin': vaccineData.name,
                        'Ngày Tiêm': vaccineData.date,
                        'Ngày Tẩy Giun': vaccineData.dewormingDate,
                        'Bác Sĩ': vaccineData.doctor,
                        'Ghi Chú': vaccineData.notes,
                        'Số Tiền': vaccineData.paymentAmount,
                        'Trạng Thái Thanh Toán': vaccineData.paymentStatus,
                    });
                    petsWithMatchingVaccines.add(petId);
                });
            }
        }
        
        // Bước 2: Lấy thông tin thú cưng và chủ nuôi của những mũi tiêm đã lọc
        for (const ownerDoc of ownersSnapshot.docs) {
            const ownerId = ownerDoc.id;
            const ownerData = ownersMap[ownerId] || {};
            const petsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
            const petsSnapshot = await getDocs(query(petsSubColRef));

            petsSnapshot.forEach(petDoc => {
                if (petsWithMatchingVaccines.has(petDoc.id)) {
                    const petData = petDoc.data();
                    filteredPetsData.push({
                        'ID Thú cưng': petDoc.id,
                        'Tên Thú cưng': petData.petName,
                        'Loài': petData.species,
                        'Giống': petData.breed,
                        'Ngày sinh': petData.dob,
                        'Giới tính': petData.sex,
                        'ID Chủ nuôi': ownerId,
                        'Tên chủ nuôi': ownerData.ownerName,
                        'SĐT chủ nuôi': ownerData.phoneNumber,
                        'Địa chỉ chủ nuôi': ownerData.address,
                        'Ghi chú': petData.description,
                    });
                }
            });
        }
        
        // Bước 3: Tạo và xuất file Excel
        const workbook = XLSX.utils.book_new();

        if (filteredPetsData.length > 0) {
            const petWorksheet = XLSX.utils.json_to_sheet(filteredPetsData);
            XLSX.utils.book_append_sheet(workbook, petWorksheet, 'Danh sách thú cưng đã lọc');
        }

        if (filteredVaccinationsData.length > 0) {
            const vaccineWorksheet = XLSX.utils.json_to_sheet(filteredVaccinationsData);
            XLSX.utils.book_append_sheet(workbook, vaccineWorksheet, 'Lịch sử tiêm phòng đã lọc');
        }

        if (filteredPetsData.length > 0 || filteredVaccinationsData.length > 0) {
            XLSX.writeFile(workbook, 'danh_sach_loc_quan_ly_thu_cung.xlsx');
            alert('Xuất file Excel thành công!');
        } else {
            alert('Không tìm thấy dữ liệu phù hợp với tiêu chí lọc.');
        }

    } catch (error) {
        console.error("Lỗi khi xuất file Excel:", error);
        alert('Đã xảy ra lỗi khi xuất file Excel.');
    } finally {
        hideLoadingSpinner();
    }
}
// -------------------------------------------------------------------------------------------------------------------------------------
// Đoạn code bạn cần giữ lại và thay thế đoạn gắn sự kiện click cũ
const exportModal = document.getElementById('export-modal');
const closeBtn = document.getElementById('close-modal-btn');
const exportBtn = document.getElementById('export-excel-btn');
const executeExportBtn = document.getElementById('execute-export-btn');

// Hàm để hiển thị modal
function showExportModal() {
    exportModal.style.display = 'flex';
}

// Hàm để ẩn modal
function hideExportModal() {
    exportModal.style.display = 'none';
}

// Gắn sự kiện click cho nút "Xuất ra Excel" ngoài trang để HIỂN THỊ modal
exportBtn?.addEventListener('click', showExportModal);

// Gắn sự kiện click cho nút "X" trong modal để ẨN modal
closeBtn?.addEventListener('click', hideExportModal);

// Gắn sự kiện click cho nút "Xuất file Excel" trong modal để THỰC HIỆN xuất file
executeExportBtn?.addEventListener('click', () => {
    hideExportModal();
    exportToExcel();
});


// ĐOẠN CODE NÀY ĐỂ PHỤC VỤ GẮN CÁC TAG LÊN THẺ THÚ CƯNG
// Hàm kiểm tra và lấy danh sách thú cưng sắp đến ngày tiêm
function getUpcomingVaccinations(pets) {
    const upcoming = new Set();
    const today = new Date();
    const oneWeekFromNow = new Date();
    oneWeekFromNow.setDate(today.getDate() + 7);

    pets.forEach(pet => {
        if (!pet.vaccinations) return;
        const vaccinations = Object.values(pet.vaccinations);

        // Bỏ qua nếu có mũi tiêm "Dừng tiêm vaccine"
        const hasTerminationRecord = vaccinations.some(v => v.name === 'Dừng tiêm vaccine');
        if (hasTerminationRecord) {
            return;
        }

        const latestVaccines = {
            'dại': null,
            '7benh': null,
            '4benh': null,
        };

        vaccinations.forEach(vaccine => {
            const vaccineDate = new Date(vaccine.date);
            if (vaccine.name === 'Dại') {
                if (!latestVaccines['dại'] || vaccineDate > new Date(latestVaccines['dại'].date)) {
                    latestVaccines['dại'] = vaccine;
                }
            } else if (vaccine.name.includes('7 bệnh')) {
                if (!latestVaccines['7benh'] || vaccineDate > new Date(latestVaccines['7benh'].date)) {
                    latestVaccines['7benh'] = vaccine;
                }
            } else if (vaccine.name.includes('4 bệnh')) {
                if (!latestVaccines['4benh'] || vaccineDate > new Date(latestVaccines['4benh'].date)) {
                    latestVaccines['4benh'] = vaccine;
                }
            }
        });

        for (const type in latestVaccines) {
            const latestVaccine = latestVaccines[type];
            if (latestVaccine) {
                const nextVaccine = findNextVaccineDetails(latestVaccine.name, latestVaccine.date);
                if (nextVaccine) {
                    const nextDoseDate = new Date(nextVaccine.date);
                    nextDoseDate.setHours(0, 0, 0, 0);
                    
                    if (nextDoseDate >= today && nextDoseDate <= oneWeekFromNow) {
                        upcoming.add(pet.petId);
                        break;
                    }
                }
            }
        }
    });
    return upcoming;
}

// Hàm kiểm tra và lấy danh sách thú cưng quá hạn tiêm
function getOverdueVaccinations(pets) {
    const overdue = new Set();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    pets.forEach(pet => {
        if (!pet.vaccinations) return;
        const vaccinations = Object.values(pet.vaccinations);
        
        // Bỏ qua nếu có mũi tiêm "Dừng tiêm vaccine"
        const hasTerminationRecord = vaccinations.some(v => v.name === 'Dừng tiêm vaccine');
        if (hasTerminationRecord) {
            return;
        }

        // Tách các mũi tiêm theo từng loại vaccine để kiểm tra độc lập
        const latestVaccines = {
            'dại': null,
            '7benh': null,
            '4benh': null,
        };

        vaccinations.forEach(vaccine => {
            const vaccineDate = new Date(vaccine.date);
            if (vaccine.name === 'Dại') {
                if (!latestVaccines['dại'] || vaccineDate > new Date(latestVaccines['dại'].date)) {
                    latestVaccines['dại'] = vaccine;
                }
            } else if (vaccine.name.includes('7 bệnh')) {
                if (!latestVaccines['7benh'] || vaccineDate > new Date(latestVaccines['7benh'].date)) {
                    latestVaccines['7benh'] = vaccine;
                }
            } else if (vaccine.name.includes('4 bệnh')) {
                if (!latestVaccines['4benh'] || vaccineDate > new Date(latestVaccines['4benh'].date)) {
                    latestVaccines['4benh'] = vaccine;
                }
            }
        });

        // Kiểm tra quá hạn cho từng loại vaccine
        for (const type in latestVaccines) {
            const latestVaccine = latestVaccines[type];
            if (latestVaccine) {
                const nextVaccine = findNextVaccineDetails(latestVaccine.name, latestVaccine.date);
                if (nextVaccine) {
                    const nextDoseDate = new Date(nextVaccine.date);
                    nextDoseDate.setHours(0, 0, 0, 0);

                    if (nextDoseDate < today) {
                        overdue.add(pet.petId);
                        // Thoát vòng lặp khi tìm thấy một loại vaccine quá hạn
                        break;
                    }
                }
            }
        }
    });
    return overdue;
}

// Hàm này tìm kiếm 5 thú cưng được tiêm vaccine gần đây nhất
const getRecentlyVaccinatedPets = (pets) => {
    const recentlyVaccinated = pets.map(pet => {
        const vaccinations = pet.vaccinations ? Object.values(pet.vaccinations) : [];
        if (vaccinations.length === 0) {
            return null;
        }

        const latestVaccination = vaccinations.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        return {
            ...pet,
            latestVaccinationDate: new Date(latestVaccination.date),
            // Đã sửa tên trường từ 'vaccineName' thành 'name'
            latestVaccineName: latestVaccination.name
        };
    }).filter(pet => pet !== null);

    recentlyVaccinated.sort((a, b) => b.latestVaccinationDate - a.latestVaccinationDate);

    return new Set(recentlyVaccinated.slice(0, 5).map(pet => pet.petId));
};



// QUẢN LÝ TẤT CẢ SỰ KIỆN CLICK Ở ĐÂY
    // Gắn sự kiện cho các nút
    document.addEventListener('click', (e) => {
        const viewBtn = e.target.closest('.view-btn');
        if (viewBtn) {
            const petId = viewBtn.dataset.id;
            const ownerId = viewBtn.dataset.ownerId;
            showPetDetails(petId, ownerId);
        }
        const editBtn = e.target.closest('.edit-vaccination-btn');
        if (editBtn) {
            const vaccinationId = editBtn.dataset.id;
            const vaccinationDocRef = doc(db, `users/${currentUserId}/private/data/owners/${currentOwnerId}/pets/${currentPetId}/vaccinations`, vaccinationId);
            getDoc(vaccinationDocRef).then(docSnapshot => {
                if (docSnapshot.exists()) {
                    const data = docSnapshot.data();
                    currentEditVaccinationIdInput.value = docSnapshot.id;
                    populateVaccineSelect(petspecies, editVaccineNameSelect);
                    editVaccineNameSelect.value = data.name;
                    editVaccineDateInput.value = data.date;
                    doctorEditSelect.value = data.doctor;
                    editVaccineNotesTextarea.value = data.notes;
                    dewormingDateEditInput.value = data.dewormingDate;
                    showModal('edit-vaccination-modal');
                } else {
                    alert("Không tìm thấy mũi tiêm để chỉnh sửa.");
                }
            }).catch(error => {
                console.error("Lỗi khi tải dữ liệu mũi tiêm để chỉnh sửa: ", error);
                alert("Lỗi khi tải dữ liệu. Vui lòng thử lại.");
            });
        }
        const deleteBtn = e.target.closest('.delete-vaccination-btn');
        if (deleteBtn) {
            const vaccinationId = deleteBtn.dataset.id;
            deleteVaccinationFromDb(vaccinationId);
        }
    });

    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'LABEL') {
            return;
        }
        const row = e.target.closest('#payments-table-body tr');
        if (row) {
            const petId = row.getAttribute('data-pet-id');
            const ownerId = row.getAttribute('data-owner-id');
            if (petId && ownerId) {
                closeModal('manage-payments-modal');
                showPetDetails(petId, ownerId);
            }
        }
    });

    if (searchInput) {
        searchInput.addEventListener('input', filterPets);
    }
    
    if (managePaymentsBtn) {
        managePaymentsBtn.addEventListener('click', () => {
            fetchAndDisplayAllVaccinationsForPayment();
            showModal('manage-payments-modal');
        });
    }
    
    if(closeManagePaymentsModalBtn) {
        closeManagePaymentsModalBtn.addEventListener('click', () => {
            closeModal('manage-payments-modal');
        });
    }

    if(closePetDetailBtn) {
        closePetDetailBtn.addEventListener('click', () => closeModal('pet-detail-modal'));
    }

    if(printQrBtn) {
        printQrBtn.addEventListener('click', printQRCode);
    }

    if(addVaccineBtn) {
        addVaccineBtn.addEventListener('click', () => {
            closeModal('pet-detail-modal');
            populateVaccineSelect(petspecies, vaccineNameSelect);
            addVaccinationForm.reset();
            showModal('add-vaccination-modal');
        });
    }

    if(closeAddVaccinationModalBtn) {
        closeAddVaccinationModalBtn.addEventListener('click', () => {
            closeModal('add-vaccination-modal');
        });
    }

    if(closeEditVaccinationModalBtn) {
        closeEditVaccinationModalBtn.addEventListener('click', () => {
            closeModal('edit-vaccination-modal');
        });
    }

    if (addVaccinationForm) {
        addVaccinationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const vaccinationData = {
                name: vaccineNameSelect.value,
                date: document.getElementById('vaccine-date').value,
                doctor: doctorAddSelect.value,
                notes: vaccineNotesAddTextarea.value,
                dewormingDate: dewormingDateAddInput.value,
                createdAt: new Date().toISOString()
            };
            await addVaccinationToDb(vaccinationData);
        });
    }

    if (editVaccinationForm) {
        editVaccinationForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const vaccinationId = currentEditVaccinationIdInput.value;
            const updatedData = {
                name: editVaccineNameSelect.value,
                date: editVaccineDateInput.value,
                doctor: doctorEditSelect.value,
                notes: editVaccineNotesTextarea.value,
                dewormingDate: dewormingDateEditInput.value
            };
            await updateVaccinationInDb(vaccinationId, updatedData);
        });
    }

    if (managePaymentsModal) {
        managePaymentsModal.addEventListener('transitionend', (event) => {
            if (!managePaymentsModal.classList.contains('hidden')) {
                updateTotals();
            }
        });
    }

    if (paymentsTableBody) {
        paymentsTableBody.addEventListener('change', (e) => {
            if (e.target.classList.contains('payment-amount-input') || e.target.type === 'radio') {
                updateTotals();
            }
        });
    }

    if (savePaymentsBtn) {
        savePaymentsBtn.addEventListener('click', async () => {
            const rows = paymentsTableBody.querySelectorAll('tr[data-vaccination-id]');
            if (rows.length === 0) {
                console.warn('Không có hàng nào để cập nhật.');
                alert('Không có mũi tiêm nào để lưu.');
                return;
            }
            const updates = [];
            rows.forEach(row => {
                const ownerId = row.getAttribute('data-owner-id');
                const petId = row.getAttribute('data-pet-id');
                const vaccinationId = row.getAttribute('data-vaccination-id');
                const amountInput = row.querySelector('.payment-amount-input');
                const paidRadio = row.querySelector('input[type="radio"][value="Đã thanh toán"]');
                const paymentAmount = parseFloat(amountInput.value) || 0;
                const paymentStatus = paidRadio.checked ? paidRadio.value : 'Còn nợ';
                const docRef = doc(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}/vaccinations`, vaccinationId);
                const updatePromise = updateDoc(docRef, {
                    paymentAmount: paymentAmount,
                    paymentStatus: paymentStatus
                });
                updates.push(updatePromise);
            });
            try {
                await Promise.all(updates);
                console.log('Cập nhật trạng thái thanh toán thành công!');
                alert('Cập nhật trạng thái thanh toán thành công!');
                closeModal('manage-payments-modal');
            } catch (error) {
                console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
                alert('Đã xảy ra lỗi khi lưu. Vui lòng thử lại.');
            }
        });
    }
    
    if (showUpcomingBtn) {
        showUpcomingBtn.addEventListener('click', () => {
            showModal('upcoming-vaccinations-modal');
            findUpcomingVaccinations();
        });
    }

    if (closeUpcomingModalBtn) {
        closeUpcomingModalBtn.addEventListener('click', () => {
            closeModal('upcoming-vaccinations-modal');
        });
    }


// TOÀN BỘ CODE ĐIỀU KHIỂN NÚT QR-PAY
// Bắt đầu hàm hiển thị mã QR
const qrOverlay = document.getElementById('qrOverlay');
            const showQrpayBtn = document.getElementById('showQrpayBtn');

            const closeQrpayBtn = document.getElementById('closeQrpayBtn');
            const qrImage = document.getElementById('qrImage');
            const prevBtn = document.getElementById('prevBtn');
            const nextBtn = document.getElementById('nextBtn');
            const imageCounter = document.getElementById('imageCounter');

            // BẮT ĐẦU PHẦN BỔ SUNG LIGHTBOX
            const lightbox = document.getElementById('lightbox');
            const lightboxImage = document.getElementById('lightboxImage');
            const lightboxClose = document.getElementById('lightboxClose');
            // KẾT THÚC PHẦN BỔ SUNG LIGHTBOX

            const qrImages = [
                'qr-t-agri.png',
                'qr-q-bidv.png'
            ];

            let currentImageIndex = 0;

            const updateQrImage = () => {
                if (qrImages.length > 0) {
                    qrImage.src = qrImages[currentImageIndex];
                    imageCounter.textContent = `${currentImageIndex + 1} / ${qrImages.length}`;
                }
            };

            // Ẩn khung ảnh khi trang tải xong
            qrOverlay.style.display = 'none';

            updateQrImage(); // Tải ảnh ngay khi hiện khung hiển thị ảnh

            showQrpayBtn.addEventListener('click', () => {
                qrOverlay.style.display = 'flex';

            });

            closeQrpayBtn.addEventListener('click', () => {
                qrOverlay.style.display = 'none';
            });

            qrOverlay.addEventListener('click', (e) => {
                if (e.target === qrOverlay) {
                    qrOverlay.style.display = 'flex';
                }
            });

            nextBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex + 1) % qrImages.length;
                updateQrImage();
            });

            prevBtn.addEventListener('click', () => {
                currentImageIndex = (currentImageIndex - 1 + qrImages.length) % qrImages.length;
                updateQrImage();
            });
// Kết thúc hàm hiển thị mã QR

        // BẮT ĐẦU LOGIC XỬ LÝ LIGHTBOX
        qrImage.addEventListener('click', () => {
            lightboxImage.src = qrImage.src; // Gán nguồn ảnh hiện tại cho lightbox
            lightbox.style.display = 'flex'; // Hiển thị lightbox
        });

        lightboxClose.addEventListener('click', () => {
            lightbox.style.display = 'none'; // Ẩn lightbox khi nhấn nút đóng
        });
        
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) { // Ẩn lightbox khi nhấn ra ngoài
                lightbox.style.display = 'none';
            }
        });
        // KẾT THÚC LOGIC XỬ LÝ LIGHTBOX

// Bổ sung hỗ trợ phím ESC để đóng cả hai khung
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Kiểm tra xem khung overlay có đang hiển thị không
        if (qrOverlay.style.display === 'flex') {
            qrOverlay.style.display = 'none';
        }
        // Kiểm tra xem lightbox có đang hiển thị không
        if (lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    }
});



// Hàm xác thực người dùng đã đăng nhập
setupAuthListeners((userId) => {
    currentUserId = userId;
    initializeFirestoreReferences(userId);
    loadPetsFromFirebase();

    // Gọi hàm kiểm tra lịch tiêm ngay sau khi xác thực thành công
    findUpcomingVaccinations().then(reminders => {
        // Cập nhật số lượng nhắc nhở trên nút
        const reminderCountSpan = document.getElementById('upcoming-reminder-count');
        if (reminderCountSpan) {
            reminderCountSpan.textContent = reminders.length;
            if (reminders.length > 0) {
                reminderCountSpan.classList.remove('hidden');
            } else {
                reminderCountSpan.classList.add('hidden');
            }
        }
    });

}, () => {
    currentUserId = null;
    if (petsList) petsList.innerHTML = '';
    if (tableBody) tableBody.innerHTML = '';
});

});