import { db } from './firebase-config.js';
import { setupAuthListeners } from './auth-logic.js';
import { collection, addDoc, doc, updateDoc, deleteDoc, onSnapshot, query, getDocs, getDoc, orderBy, limit, where, writeBatch } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

// ⭐ BIẾN GLOBAL CẦN TRUY CẬP TỪ CÁC HÀM KHÁC ⭐
// ⭐ KHAI BÁO BIẾN TOÀN CỤC (GLOBAL SCOPE) BẰNG 'let' ⭐
// Dùng 'let' vì chúng ta sẽ gán giá trị sau này (trong DOMContentLoaded hoặc setupAuthListeners)

let currentUserId = null;
let currentPetId = null;
let currentOwnerId = null;
let petspecies = null;
let ownersColRef = null;

// Bổ sung nơi lưu trữ dữ liệu chủ nuôi và thú cưng
let ownersMap = {}; 

// Các tham chiếu Firebase mới cho danh sách quản lý
let staffColRef;
let dogVaccineColRef;
let catVaccineColRef;

// Biến cho các phần tử DOM quan trọng cần truy cập ngoài DOMContentLoaded
let vaccineNameSelect;
let editVaccineNameSelect;
let doctorAddInput;
let doctorEditInput;

// ⭐ THÊM KHAI BÁO MODAL THANH TOÁN ⭐
let managePaymentsModal;
let totalPaidLabel;
let totalOwedLabel;

// Biến cho danh sách vaccine được tải
let dogVaccinesList = []; 
let catVaccinesList = []; 

// Biến toàn cục để lưu trữ danh sách nhắc nhở
window.currentReminders = [];
// Bổ sung biến global để lưu trữ dữ liệu gốc cho việc lọc
window.allPaymentRecords = [];

document.addEventListener('DOMContentLoaded', () => {
    const petsList = document.getElementById('pets-list');
    const searchInput = document.getElementById('search-input');
    const ownerSelect = document.getElementById('owner-select');
    const tableBody = document.getElementById('vaccination-table-body');

    const exportExcelBtn = document.getElementById('export-excel-btn');
    const importExcelBtn = document.getElementById('import-excel-btn');
    const closePetDetailBtn = document.getElementById('close-pet-detail-modal');
    const printQrBtn = document.getElementById('print-qr-btn');
    const addVaccineBtn = document.getElementById('add-vaccination-btn');

    const addVaccinationModal = document.getElementById('add-vaccination-modal');
    const closeAddVaccinationModalBtn = document.getElementById('close-add-vaccination-modal');
    const addVaccinationForm = document.getElementById('add-vaccination-form');
    const doctorAddSelect = document.getElementById('doctor-add');
    const dewormingDateAddInput = document.getElementById('deworming-date-add');
    const vaccineNotesAddTextarea = document.getElementById('vaccine-notes');
    const editVaccinationModal = document.getElementById('edit-vaccination-modal');
    const closeEditVaccinationModalBtn = document.getElementById('close-edit-vaccination-modal');
    const editVaccinationForm = document.getElementById('edit-vaccination-form');
    const currentEditVaccinationIdInput = document.getElementById('current-edit-vaccination-id');
    const editVaccineDateInput = document.getElementById('edit-vaccine-date');
    const doctorEditSelect = document.getElementById('doctor-edit');
    const editVaccineNotesTextarea = document.getElementById('edit-vaccine-notes');
    const dewormingDateEditInput = document.getElementById('deworming-date-edit');

// Khai báo mới cho nút "Quản lý danh sách"
const manageListsBtn = document.getElementById('manage-lists-btn');
const manageListsModal = document.getElementById('manage-lists-modal');
const closeManageListsModalBtn = document.getElementById('close-manage-lists-modal');
const manageListsTabs = document.getElementById('manage-lists-tabs');
const tabContents = document.querySelectorAll('.tab-content');
const tabButtons = document.querySelectorAll('#manage-lists-tabs button');
    // ⭐ KHAI BÁO CÁC PHẦN TỬ CHO MODAL NHẮC LỊCH TIÊM (DẠNG BẢNG) ⭐
    const reminderModal = document.getElementById('reminder-modal');
    const closeReminderModalBtn = document.getElementById('close-reminder-modal');
    const reminderTableBody = document.getElementById('reminder-table-body');
    const reminderSearchInput = document.getElementById('reminder-search-input');
    const emptyReminderRow = document.getElementById('empty-reminder-row');
    const showUpcomingBtn = document.getElementById('check-reminder-btn');


    const upcomingVaccinationsModal = document.getElementById('upcoming-vaccinations-modal');
    const closeUpcomingModalBtn = document.getElementById('close-upcoming-modal');
    const upcomingVaccinationsList = document.getElementById('upcoming-vaccinations-list');


// KHAI BÁO CHO MODAL QUẢN LÝ THANH TOÁN
    const managePaymentsBtn = document.getElementById('manage-payments-btn');
    const closeManagePaymentsModalBtn = document.getElementById('close-manage-payments-modal');
    // const totalPaidLabel = document.getElementById('total-payment-amount');
    // const totalOwedLabel = document.getElementById('total-amount-owed');
    const savePaymentsBtn = document.getElementById('save-payments-status-btn');
    const paymentsTableBody = document.getElementById('payments-table-body');
    managePaymentsModal = document.getElementById('manage-payments-modal');
    const paymentSearchInput = document.getElementById('payment-search-input'); // ⭐ Dùng CONST ⭐

    // ⭐ KHAI BÁO MỚI CHO VACCINE VÀ BÁC SĨ ⭐
    // ⭐ XÓA BỎ 'const' VÀ CHỈ GÁN GIÁ TRỊ VÀO BIẾN LET TOÀN CỤC ⭐
    vaccineNameSelect = document.getElementById('vaccine-name-select');
    editVaccineNameSelect = document.getElementById('edit-vaccine-name-select');
    doctorAddInput = document.getElementById('doctor-add'); 
    doctorEditInput = document.getElementById('doctor-edit');

    // ⭐ Gán giá trị cho các biến tổng tiền ⭐
    totalPaidLabel = document.getElementById('total-payment-amount');
    totalOwedLabel = document.getElementById('total-amount-owed');




// Hàm Hiện và Ẩn các modal
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


/**
 * Tính toán số lượng Chó và Mèo từ danh sách thú cưng.
 * @param {Array<object>} petRecords - Danh sách các bản ghi thú cưng.
 * @returns {object} {total, dogCount, catCount}
 */
function calculatePetCounts(petRecords) {
    let dogCount = 0;
    let catCount = 0;

    petRecords.forEach(pet => {
        // Giả định rằng trường 'species' (loài) chứa thông tin về loài vật
        const species = pet.species ? String(pet.species).toLowerCase() : '';
        
        // Kiểm tra linh hoạt (có thể là 'Chó' hoặc 'Dog')
        if (species.includes('chó') || species.includes('dog')) {
            dogCount++;
        } else if (species.includes('mèo') || species.includes('cat')) {
            catCount++;
        }
    });

    return { total: petRecords.length, dogCount, catCount };
}

/**
 * Cập nhật dòng thống kê số lượng thú cưng vào giao diện.
 * @param {Array<object>} petRecords - Danh sách các bản ghi thú cưng.
 */
function updatePetCountSummary(petRecords) {
    const counts = calculatePetCounts(petRecords);
    const summaryElement = document.getElementById('pet-count-summary');

    if (summaryElement) {
        summaryElement.innerHTML = `
            <span class="font-bold text-md text-indigo-700">Tổng số thú cưng trong danh sách: </span>
            <span class="font-bold text-md text-red-600">${counts.dogCount} chó</span> 
            & 
            <span class="font-bold text-md text-orange-600">${counts.catCount} mèo</span>.
        `;
    }
}


// Hàm render một thẻ thông tin thú cưng
function createPetCard(pet, petDocId, ownerDocId, recentlyVaccinatedIds, upcomingIds, overdueIds) {
    const li = document.createElement('li');
    li.classList.add('bg-white', 'p-4', 'rounded-lg', 'shadow-md', 'pet-item', 'transition', 'duration-300', 'hover:shadow-lg', 'hover:scale-105', 'flex', 'items-center', 'gap-4');
    li.setAttribute('data-id', petDocId);
    li.setAttribute('data-owner-id', ownerDocId);
    li.setAttribute('data-pet-id', petDocId);

    const avatarUrl = pet.avatar || 'dogcatavatar.png';
    
    // ⭐ ĐÃ SỬA LỖI CỐT LÕI: Dùng cú pháp mảng Array.some() và kiểm tra trường 'vaccineName' ⭐
    const hasTerminationRecord = pet.vaccinations?.some(v => 
        v.vaccineName && v.vaccineName.toLowerCase().includes('dừng tiêm vaccine')
    ) || false;

    const isRecentlyVaccinated = recentlyVaccinatedIds.has(petDocId);
    const isUpcoming = upcomingIds.has(petDocId);
    const isOverdue = overdueIds.has(petDocId);

    let tagsHtml = '';
    
    // ⭐ LOGIC ƯU TIÊN TAG: Dừng Tiêm > Quá hạn > Sắp tới > Gần đây ⭐
    if (hasTerminationRecord) {
        // Tag ưu tiên cao nhất, độc lập với các cảnh báo khác
        tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-800"><i class="fa-solid fa-ban text-sm mr-1 text-[#ff6969]"></i> Dừng quản lý</span>`;
    } else {
        // Chỉ kiểm tra các cảnh báo tiêm chủng nếu KHÔNG có lệnh Dừng Tiêm
        if (isOverdue) {
            tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-semibold text-orange-800"><i class="fa-solid fa-triangle-exclamation text-sm mr-1 text-[#ff0000]"></i> Quá hạn</span>`;
        } else if (isUpcoming) {
            tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-yellow-100 px-2 py-1 text-xs font-semibold text-yellow-800"><i class="fa-solid fa-calendar-days text-sm mr-1 text-[#ffbb00]"></i> Sắp tới</span>`;
        }
    }
    
    // Tag Tiêm gần đây luôn có thể hiển thị (trừ khi có lệnh Dừng Tiêm)
    if (isRecentlyVaccinated && !hasTerminationRecord) {
        tagsHtml += `<span class="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800"><i class="fa-solid fa-syringe text-sm mr-1 text-[#006eff]"></i> Gần đây</span>`;
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
    
    // ⭐ BẮT ĐẦU HIỂN THỊ SPINNER ⭐
    if (typeof showLoadingSpinner === 'function') {
        showLoadingSpinner();
    }
    
    try {
        petsList.innerHTML = '';
        const ownersSnapshot = await getDocs(query(ownersColRef));
        const allPets = [];
        
        // ⭐ BƯỚC CỐT LÕI: KHỞI TẠO LẠI ownersMap TOÀN CỤC ⭐
        ownersMap = {}; 

        for (const ownerDoc of ownersSnapshot.docs) {
            const ownerData = ownerDoc.data();
            const ownerId = ownerDoc.id;
            
            // LƯU DỮ LIỆU CHỦ NUÔI
            ownersMap[ownerId] = {
                id: ownerId,
                ownerName: ownerData.ownerName || 'Không có tên',
                phoneNumber: ownerData.phoneNumber || 'N/A',
                address: ownerData.address || 'N/A',
                pets: [] // Mảng để lưu trữ thú cưng của chủ này
            };

            const petsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets`);
            const petsSnapshot = await getDocs(query(petsSubColRef));
            for (const petDoc of petsSnapshot.docs) {
                const petData = petDoc.data();
                
                // Lấy Sub-collection Vaccinations
                const vaccinationsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petDoc.id}/vaccinations`);
                const vaccinationsSnapshot = await getDocs(query(vaccinationsSubColRef));
                
                // ⭐ XỬ LÝ DỮ LIỆU TIÊM CHỦNG ĐỂ TẠO THÀNH MẢNG ⭐
                const vaccinationsArray = [];
                vaccinationsSnapshot.forEach(vaccineDoc => {
                    const vaccineData = vaccineDoc.data();
                    // Lưu ý: Tên vaccine được lưu trong trường 'name' của sub-collection
                    vaccinationsArray.push({
                        id: vaccineDoc.id,
                        date: vaccineData.date, 
                        vaccineName: vaccineData.name, // Lấy từ trường 'name'
                        notes: vaccineData.notes,
                        doctor: vaccineData.doctor
                    });
                });

                const combinedPetData = {
                    // Dữ liệu từ doc thú cưng
                    ...petData, 
                    ownerId: ownerId,
                    ownerName: ownerData.ownerName || 'Không có tên',
                    petId: petDoc.id,
                    name: petData.petName || 'Không có tên', // Sử dụng petName
                    type: petData.species || 'Không rõ', // Sử dụng species
                    vaccinations: vaccinationsArray // Gán mảng tiêm chủng đã xử lý
                };
                
                allPets.push(combinedPetData); 
                // Đổ dữ liệu thú cưng vào ownersMap
                ownersMap[ownerId].pets.push(combinedPetData); 
            }
        }
        
    // --- LOGIC RENDER DANH SÁCH THÚ CƯNG ---
    
    // ⭐ 1. Lấy danh sách Pet ID cần gắn tag Dừng Tiêm (Đồng bộ) ⭐
    const stopReminderIds = getStopReminderPets(allPets); // <--- THÊM MỚI

    // 2. Lấy danh sách ID cho các tag cảnh báo khác (Bất đồng bộ)
    const recentlyVaccinatedIds = await getRecentlyVaccinatedPets(allPets); // <--- THÊM 'await'
    const upcomingIds = await getUpcomingVaccinations(allPets);           // <--- THÊM 'await'
    const overdueIds = await getOverdueVaccinations(allPets);             // <--- THÊM 'await'

            allPets.forEach(pet => {
    // ⭐ LƯU Ý: Giữ nguyên tham số tạo thẻ của bạn để tránh lỗi mới ⭐
    // (createPetCard(pet, pet.petId, pet.ownerId, recentlyVaccinatedIds, upcomingIds, overdueIds);)
    
    // Nếu pet.ownerId không tồn tại, bạn cần lấy từ ownersMap
    const owner = ownersMap[pet.ownerId];
    
    const li = createPetCard(
        pet, 
        pet.petId, 
        pet.ownerId, // Các tham số ID này có thể bị thừa, nhưng giữ lại theo code bạn
        recentlyVaccinatedIds, 
        upcomingIds, 
        overdueIds
    );
        
        petsList.appendChild(li);
    });
        
        // Danh sách thú cưng đã được render thành công tại đây!

        // GỌI HÀM THỐNG KÊ SỐ LƯỢNG SAU KHI VÒNG LẶP KẾT THÚC ⭐
        updatePetCountSummary(allPets);

    } catch (e) {
        console.error("Lỗi khi tải dữ liệu chủ và thú cưng: ", e);
        // ⭐ Hiển thị lỗi ra giao diện nếu cần
        petsList.innerHTML = `<p class="p-4 text-red-600 bg-red-100 rounded-lg">Lỗi khi tải danh sách thú cưng: ${e.message}</p>`;
    } finally {
        // ⭐ ĐẢM BẢO ẨN SPINNER SAU KHI XONG ⭐
        if (typeof hideLoadingSpinner === 'function') {
            hideLoadingSpinner();
        }
    }
}


// --- Các hàm Render Chi tiết Quản lý Danh sách ---

/**
 * Render một thẻ nhân viên (staff card).
 * @param {object} staff - Dữ liệu nhân viên.
 * @returns {string} HTML string của thẻ.
 */
function renderStaffCard(staff) {
    return `
        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm flex justify-between items-center transition duration-300 hover:shadow-md">
            <div>
                <p class="text-lg font-semibold text-blue-700">${staff.name} (<span class="text-gray-600">${staff.position}</span>)</p>
                <p class="text-sm text-gray-500">ĐT: ${staff.phone || 'N/A'} | Địa chỉ: ${staff.address || 'N/A'}</p>
                <p class="text-xs text-gray-400">Ngày vào làm: ${staff.dateHired || 'N/A'}</p>
            </div>
            <div class="flex space-x-2">
                <button data-id="${staff.id}" data-type="staff" class="edit-list-item-btn bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition">
                    <i class="fas fa-edit"></i>
                </button>
                <button data-id="${staff.id}" data-type="staff" class="delete-list-item-btn bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        </div>
    `;
}

/**
 * Render một thẻ vaccine.
 * @param {object} vaccine - Dữ liệu vaccine.
 * @param {string} type - Loại vaccine ('dog' hoặc 'cat').
 * @returns {string} HTML string của thẻ.
 */
function renderVaccineCard(vaccine, type) {
    return `
        <div class="p-4 bg-white border border-gray-200 rounded-lg shadow-sm transition duration-300 hover:shadow-md">
            <div class="flex justify-between items-start">
                <div>
                    <p class="text-lg font-semibold text-green-700">${vaccine.name} (${vaccine.company || 'N/A'})</p>
                    <p class="text-sm text-gray-600">Đơn giá: ${vaccine.price ? vaccine.price.toLocaleString('vi-VN') + ' VNĐ' : 'N/A'}</p>
                    <p class="text-sm text-gray-500 mt-1 border-t pt-1">Mũi tiếp theo: <span class="font-medium">${vaccine.nextDoseName}</span> sau <span class="font-medium text-orange-600">${vaccine.nextDoseDays}</span> ngày</p>
                </div>
                <div class="flex space-x-2 flex-shrink-0 mt-1">
                    <button data-id="${vaccine.id}" data-type="${type}-vaccine" class="edit-list-item-btn bg-yellow-500 text-white p-2 rounded-full hover:bg-yellow-600 transition">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button data-id="${vaccine.id}" data-type="${type}-vaccine" class="delete-list-item-btn bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

/**
 * Hàm chính để tải và render danh sách.
 * @param {FirestoreCollectionReference} collectionRef - Tham chiếu collection.
 * @param {string} renderAreaId - ID của khu vực render trong HTML.
 * @param {function} renderFunction - Hàm render chi tiết (renderStaffCard hoặc renderVaccineCard).
 * @param {string} type - Loại dữ liệu ('staff', 'dog' hoặc 'cat').
 */
function setupListListener(collectionRef, renderAreaId, renderFunction, type) {
    if (!collectionRef) return; // Đảm bảo collectionRef đã được khởi tạo

    const renderArea = document.getElementById(renderAreaId);
    
    // Sắp xếp theo tên (orderBy('name'))
    const q = query(collectionRef, orderBy('name'));

    onSnapshot(q, (snapshot) => {
        let htmlContent = '';
        if (snapshot.empty) {
            htmlContent = `<p class="text-gray-500 p-4 bg-gray-50 rounded-lg">Chưa có dữ liệu nào được tạo.</p>`;
        } else {
            snapshot.docs.forEach(doc => {
                const data = doc.data();
                data.id = doc.id;
                // Truyền type vào hàm renderVaccineCard nếu là vaccine
                if (type === 'dog' || type === 'cat') {
                    htmlContent += renderFunction(data, type);
                } else {
                    htmlContent += renderFunction(data);
                }
            });
        }
        renderArea.innerHTML = htmlContent;
    }, (error) => {
        console.error(`Lỗi khi lắng nghe danh sách ${renderAreaId}:`, error);
        renderArea.innerHTML = `<p class="text-red-500">Lỗi khi tải dữ liệu. Vui lòng kiểm tra console.</p>`;
    });
}


// --- Logic Xử lý Chỉnh sửa (Edit) và Xóa (Delete) Quản lý danh sách ---

/**
 * Xử lý sự kiện chỉnh sửa một mục danh sách.
 * @param {string} docId - ID của document Firestore.
 * @param {string} type - Loại danh sách ('staff', 'dog-vaccine', 'cat-vaccine').
 */
async function handleEditListItem(docId, type) {
    let collectionRef;
    let formIdPrefix;
    
    if (type === 'staff') {
        collectionRef = staffColRef;
        formIdPrefix = 'staff';
    } else if (type === 'dog-vaccine') {
        collectionRef = dogVaccineColRef;
        formIdPrefix = 'dog-vaccine';
    } else if (type === 'cat-vaccine') {
        collectionRef = catVaccineColRef;
        formIdPrefix = 'cat-vaccine';
    } else {
        return;
    }

    try {
        const docRef = doc(collectionRef, docId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            
            // 1. Đổ dữ liệu vào form
            document.getElementById(`${formIdPrefix}-id`).value = docId; // Lưu ID để biết đây là thao tác UPDATE
            
            if (type === 'staff') {
                document.getElementById('staff-name').value = data.name || '';
                document.getElementById('staff-position').value = data.position || '';
                document.getElementById('staff-phone').value = data.phone || '';
                document.getElementById('staff-address').value = data.address || '';
                document.getElementById('staff-date-hired').value = data.dateHired || '';
                document.getElementById('save-staff-btn').textContent = 'Cập nhật Nhân viên';
            } else {
                const prefix = type === 'dog-vaccine' ? 'dog' : 'cat';
                document.getElementById(`${prefix}-vaccine-name`).value = data.name || '';
                document.getElementById(`${prefix}-vaccine-company`).value = data.company || '';
                document.getElementById(`${prefix}-vaccine-price`).value = data.price || 0;
                document.getElementById(`${prefix}-vaccine-next-name`).value = data.nextDoseName || '';
                document.getElementById(`${prefix}-vaccine-next-days`).value = data.nextDoseDays || 0;
                document.getElementById(`save-${prefix}-vaccine-btn`).textContent = `Cập nhật Vaccine ${prefix === 'dog' ? 'Chó' : 'Mèo'}`;
            }

            // 2. Cuộn lên đầu form
            document.getElementById(type + '-content').scrollIntoView({ behavior: 'smooth' });

        } else {
            alert("Không tìm thấy dữ liệu để chỉnh sửa.");
        }
    } catch (error) {
        console.error("Lỗi khi tải dữ liệu chỉnh sửa:", error);
        alert("Lỗi khi tải dữ liệu chỉnh sửa.");
    }
}

/**
 * Xử lý sự kiện xóa một mục danh sách.
 * @param {string} docId - ID của document Firestore.
 * @param {string} type - Loại danh sách ('staff', 'dog-vaccine', 'cat-vaccine').
 */
async function handleDeleteListItem(docId, type) {
    let collectionRef;
    let displayName = '';

    if (type === 'staff') {
        collectionRef = staffColRef;
        displayName = 'Nhân viên';
    } else if (type === 'dog-vaccine') {
        collectionRef = dogVaccineColRef;
        displayName = 'Vaccine cho Chó';
    } else if (type === 'cat-vaccine') {
        collectionRef = catVaccineColRef;
        displayName = 'Vaccine cho Mèo';
    } else {
        return;
    }

    if (!confirm(`Bạn có chắc chắn muốn xóa mục ${displayName} này không?`)) {
        return;
    }

    try {
        const docRef = doc(collectionRef, docId);
        await deleteDoc(docRef);
        alert(`Xóa ${displayName} thành công!`);
        // Vì chúng ta dùng onSnapshot, danh sách sẽ tự động cập nhật, không cần tải lại
    } catch (error) {
        console.error("Lỗi khi xóa dữ liệu:", error);
        alert(`Lỗi khi xóa ${displayName}. Vui lòng kiểm tra console.`);
    }
}

// Bổ sung lắng nghe sự kiện click cho các nút Edit/Delete (Dùng Event Delegation)
const manageListsModalContent = document.getElementById('manage-lists-modal');

if (manageListsModalContent) {
    manageListsModalContent.addEventListener('click', (e) => {
        // Xử lý nút Chỉnh sửa
        const editBtn = e.target.closest('.edit-list-item-btn');
        if (editBtn) {
            const docId = editBtn.getAttribute('data-id');
            const type = editBtn.getAttribute('data-type');
            handleEditListItem(docId, type);
            return;
        }

        // Xử lý nút Xóa
        const deleteBtn = e.target.closest('.delete-list-item-btn');
        if (deleteBtn) {
            const docId = deleteBtn.getAttribute('data-id');
            const type = deleteBtn.getAttribute('data-type');
            handleDeleteListItem(docId, type);
            return;
        }
    });
}

// --- Logic Xử lý Nút HỦY (Cancel Edit) Quản lý danh sách---

/**
 * Reset form về trạng thái "Thêm mới" ban đầu sau khi hủy hoặc lưu thành công.
 * @param {string} type - Loại form ('staff', 'dog-vaccine', 'cat-vaccine').
 */
function resetListForm(type) {
    let formIdPrefix = type;
    
    // 1. Reset ID ẩn (Hidden ID) - SỬA LỖI TẠI ĐÂY
    const hiddenIdInput = document.getElementById(`${formIdPrefix}-id`);
    if (hiddenIdInput) {
        hiddenIdInput.value = ''; // Dòng 521 đã được bảo vệ
    }
    
    // 2. Reset form
    const formElement = document.getElementById(`${formIdPrefix}-form`);
    if (formElement) {
        // Sử dụng .reset() sau khi bạn đã thêm thuộc tính 'name' là cách hiệu quả nhất
        formElement.reset();
    }
    
    // 3. Đặt lại nội dung nút Lưu (Save button text)
    if (type === 'staff') {
        const saveStaffBtn = document.getElementById('save-staff-btn');
        if (saveStaffBtn) saveStaffBtn.textContent = 'Lưu nhân viên';
        
    } else if (type === 'dog-vaccine') {
        const saveDogVaccineBtn = document.getElementById('save-dog-vaccine-btn');
        if (saveDogVaccineBtn) saveDogVaccineBtn.textContent = 'Lưu vaccine chó';
        
    } else if (type === 'cat-vaccine') {
        const saveCatVaccineBtn = document.getElementById('save-cat-vaccine-btn');
        if (saveCatVaccineBtn) saveCatVaccineBtn.textContent = 'Lưu vaccine mèo';
    }
}

// Bổ sung Lắng nghe sự kiện cho tất cả các nút Hủy
const cancelButtons = document.querySelectorAll('.cancel-edit-btn');
if (cancelButtons) {
    cancelButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const type = btn.getAttribute('data-form-type');
            resetListForm(type);
        });
    });
}



/**
 * Điền dữ liệu vào thẻ select (vaccine) hoặc datalist (doctor).
 * @param {HTMLElement} element - Phần tử DOM đích (Select hoặc Datalist).
 * @param {Array<string>} items - Mảng dữ liệu (tên vaccine/bác sĩ).
 */
function populateDropdown(element, items) {
    if (!element) return;
    
    // Nếu là thẻ <select>, giữ nguyên option đầu tiên và thêm option mới
    if (element.tagName === 'SELECT') {
        // Xóa các option cũ
        element.innerHTML = ''; 
        
        // Thêm option mặc định 
        const placeholderOption = document.createElement('option');
        placeholderOption.value = "";
        placeholderOption.textContent = "Chọn tên vaccine";
        placeholderOption.disabled = true;
        placeholderOption.selected = true;
        element.appendChild(placeholderOption);

        // Thêm các option mới từ Firestore
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            option.textContent = item;
            element.appendChild(option);
        });
    } 
    // Nếu là datalist (dùng cho bác sĩ)
    else if (element.tagName === 'DATALIST') {
        element.innerHTML = '';
        items.forEach(item => {
            const option = document.createElement('option');
            option.value = item;
            element.appendChild(option);
        });
    }
}



/**
 * Lọc và điền danh sách vaccine vào thẻ SELECT dựa trên loài thú cưng.
 * @param {string} species - Loài thú cưng ('chó' hoặc 'mèo').
 * @param {HTMLElement} selectElement - Thẻ SELECT cần điền dữ liệu (vaccineNameSelect hoặc editVaccineNameSelect).
 */
function populateVaccineSelectBySpecies(species, selectElement) {
    if (!selectElement) return;

    let vaccinesToDisplay = [];
    const normalizedSpecies = species ? species.toLowerCase() : '';

    if (normalizedSpecies === 'chó') {
        vaccinesToDisplay = dogVaccinesList.slice(); // Sao chép mảng
    } else if (normalizedSpecies === 'mèo') {
        vaccinesToDisplay = catVaccinesList.slice(); // Sao chép mảng
    }

    // Sắp xếp lại danh sách
    vaccinesToDisplay.sort(); 

    // Tái sử dụng logic điền vào Select (Tương tự như populateDropdown cho Select)
    selectElement.innerHTML = ''; 
    
    // Thêm option mặc định 
    const placeholderOption = document.createElement('option');
    placeholderOption.value = "";
    placeholderOption.textContent = "Chọn vắc xin";
    placeholderOption.disabled = true;
    placeholderOption.selected = true;
    selectElement.appendChild(placeholderOption);

    // Thêm các option vaccine
    vaccinesToDisplay.forEach(vaccine => {
        const option = document.createElement('option');
        option.value = vaccine;
        option.textContent = vaccine;
        selectElement.appendChild(option);
    });
}



/**
 * Tính toán ngày tiêm kế tiếp dựa trên số ngày cần tiêm nhắc và ngày tiêm trước đó.
 * (Đã tối ưu hóa để khắc phục lỗi múi giờ +/- 1 ngày)
 * @param {number} nextDoseDays - Số ngày cần cộng thêm.
 * @param {string} nextDoseName - Tên mũi tiêm kế tiếp.
 * @param {string} lastVaccinationDate - Ngày tiêm trước đó (định dạng 'YYYY-MM-DD').
 * @returns {object} Một đối tượng chứa thông tin nhắc nhở đã được tính toán.
 */
function calculateNextVaccinationInfo(nextDoseDays, nextDoseName, lastVaccinationDate) {
    if (!lastVaccinationDate || typeof lastVaccinationDate !== 'string' || !nextDoseDays || nextDoseDays <= 0) {
        return {
            nextDate: 'N/A',
            nextDoseName: nextDoseName || 'N/A',
            daysRemaining: Infinity,
            statusText: 'Không xác định',
            rawDate: null
        };
    }

    // ⭐ CÁCH KHỞI TẠO ĐỐI TƯỢNG DATE ĐỂ TRÁNH LỖI MÚI GIỜ: ⭐
    // Thêm "T00:00:00" để đảm bảo Date được khởi tạo tại 00:00:00 UTC, giúp tránh lỗi lệch ngày
    const lastDate = new Date(lastVaccinationDate + 'T00:00:00'); 
    
    if (isNaN(lastDate.getTime())) {
        return { nextDate: 'N/A', nextDoseName: nextDoseName || 'N/A', daysRemaining: Infinity, statusText: 'Lỗi ngày', rawDate: null };
    }

    let nextDate = new Date(lastDate);
    // ⭐ CỘNG NGÀY BẰNG setDate() ⭐
    nextDate.setDate(nextDate.getDate() + nextDoseDays); 
    nextDate.setHours(0, 0, 0, 0); // Đặt lại giờ về 00:00:00

    const today = new Date();
    today.setHours(0, 0, 0, 0); 
    
// ⭐ DÒNG CODE MỚI ĐÃ SỬA: SỬ DỤNG LOCAL GETTER ĐỂ TRÁNH LỖI MÚI GIỜ ⭐
const year = nextDate.getFullYear();
const month = String(nextDate.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
const day = String(nextDate.getDate()).padStart(2, '0');
const nextDateString = `${year}-${month}-${day}`;
    
    const oneDay = 1000 * 60 * 60 * 24;
    const remainingDays = Math.ceil((nextDate.getTime() - today.getTime()) / oneDay); // Sử dụng Math.ceil để làm tròn lên
    
    // ... (logic statusText không thay đổi)
    let statusText = nextDoseName || 'Mũi kế tiếp';

    if (remainingDays < 0) {
        const overdueDays = Math.abs(remainingDays);
        statusText = `Quá hạn ${overdueDays} ngày`; 
    } else if (remainingDays >= 0 && remainingDays <= 7) { 
        statusText = `Sắp tới (${remainingDays} ngày)`;
    } else if (remainingDays > 7 && remainingDays <= 60) {
        statusText = `Đến hạn (${remainingDays} ngày)`;
    }

    return {
        nextDate: nextDateString,
        nextDoseName: nextDoseName || 'Mũi kế tiếp',
        daysRemaining: remainingDays,
        statusText: statusText,
        rawDate: nextDate 
    };
}


/**
 * Hàm tải lịch sử tiêm phòng của thú cưng
 * @param {string} petId - ID của thú cưng.
 * @param {string} ownerId - ID của chủ nuôi.
 */
async function fetchVaccinationHistory(petId, ownerId) {
    const historyTableBody = document.getElementById('vaccination-history-table-body');
    if (!historyTableBody) return;
    historyTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Đang tải lịch sử tiêm phòng...</td></tr>';
    
    const vaccinationsSubColRef = collection(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}/vaccinations`);
    
    try {
        // ⭐ BƯỚC 1: Tải thông tin thú cưng để biết loại (Chó/Mèo) ⭐
        const petDocRef = doc(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}`);
        const petDocSnap = await getDoc(petDocRef);
        const petData = petDocSnap.exists() ? petDocSnap.data() : null;
        
let petType = null;
// ⭐ ĐÃ SỬA LỖI: ĐỌC TRƯỜNG 'species' THAY VÌ 'type' ⭐
if (petData && petData.species) { 
    // Chuẩn hóa và xác định loại thú cưng
    const petSpeciesLower = petData.species.trim().toLowerCase();
    
    // Logic so sánh linh hoạt
    if (petSpeciesLower.includes('chó') || petSpeciesLower.includes('cho') || petSpeciesLower.includes('dog')) {
        petType = 'Dog';
    } 
    else if (petSpeciesLower.includes('mèo') || petSpeciesLower.includes('meo') || petSpeciesLower.includes('cat')) {
        petType = 'Cat';
    } 
    else {
        // Mặc định là Dog nếu không nhận dạng được
        console.warn(`Loại thú cưng '${petData.species}' không được nhận dạng. Mặc định là 'Dog'.`);
        petType = 'Dog';
    }
} else {
    // Trường 'species' bị thiếu (lỗi dữ liệu cũ)
    console.warn("Thiếu trường 'species' trong tài liệu thú cưng. Mặc định là 'Dog'.");
    petType = 'Dog';
}

        if (!window.protocols) {
            // Cần đảm bảo loadVaccineProtocols() đã tải dữ liệu vào biến global
            window.protocols = await loadVaccineProtocols(); 
        }
        // Lấy phác đồ tương ứng (Dog hoặc Cat), nếu không có thì là mảng rỗng
        const petProtocols = window.protocols[petType] || [];


        const vaccinationsSnapshot = await getDocs(query(vaccinationsSubColRef, orderBy('date', 'desc'))); 
        
        historyTableBody.innerHTML = '';

        if (vaccinationsSnapshot.empty) {
            historyTableBody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-gray-500">Chưa có mũi tiêm nào được ghi nhận.</td></tr>';
        } else {
            vaccinationsSnapshot.forEach(vaccineDoc => {
                const vaccineData = vaccineDoc.data();
                
                let nextDateDisplay = 'N/A';
                
                // ⭐ BƯỚC 2: Tra cứu phác đồ cho mũi tiêm này ⭐
                // Sử dụng .trim().toLowerCase() để so sánh linh hoạt
                const matchingProtocol = petProtocols.find(p => 
                    p.name.trim().toLowerCase() === vaccineData.name.trim().toLowerCase()
                );

                if (matchingProtocol && matchingProtocol.nextDoseDays > 0) {
                    // ⭐ BƯỚC 3: Gọi hàm tính toán với đủ tham số ⭐
                    const nextInfo = calculateNextVaccinationInfo(
                        matchingProtocol.nextDoseDays,
                        matchingProtocol.nextDoseName,
                        vaccineData.date // Ngày tiêm trước đó
                    );
                    
                    // ⭐ BƯỚC 4: Hiển thị chuỗi (Khắc phục lỗi [object Object]) ⭐
                    nextDateDisplay = `${nextInfo.nextDate} (${nextInfo.nextDoseName})`;
                }

                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccineData.name || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${vaccineData.date || 'N/A'}</td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${nextDateDisplay}</td>
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
            // ⭐ GỌI HÀM LỌC DANH SÁCH VACCINE Ở ĐÂY ⭐
            // Áp dụng cho modal Thêm mới
            populateVaccineSelectBySpecies(petspecies, vaccineNameSelect); 
            // Áp dụng cho modal Chỉnh sửa
            populateVaccineSelectBySpecies(petspecies, editVaccineNameSelect);
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



/**
 * Khởi tạo các tham chiếu Firestore.
 * @param {string} userId ID người dùng hiện tại
 */
function initializeFirestoreReferences(userId) {
    // Tham chiếu cũ (Giữ nguyên ownersColRef)
    ownersColRef = collection(db, `users/${userId}/private/data/owners`);
    
    // Bổ sung các Tham chiếu mới cho danh sách quản lý
    staffColRef = collection(db, `users/${userId}/private/data/staff`);
    dogVaccineColRef = collection(db, `users/${userId}/private/data/dog_vaccines`);
    catVaccineColRef = collection(db, `users/${userId}/private/data/cat_vaccines`);
}

// Hàm lắng nghe danh sách từ Firestore
// Hàm lắng nghe danh sách
async function loadPetsFromFirebase() { // ⭐ THÊM 'async'
    if (currentUserId) {
        // ⭐ BƯỚC 1: CHỜ tải dữ liệu thú cưng VÀ render danh sách (hàm này đã có logic render)
        if (typeof fetchOwnersAndPets === 'function') {
            await fetchOwnersAndPets(); // ⭐ THÊM 'await'
        }

        // BỔ SUNG: Tải và lắng nghe cập nhật cho 3 danh sách quản lý
        setupListListener(staffColRef, 'staff-list-render-area', renderStaffCard, 'staff');
        setupListListener(dogVaccineColRef, 'dog-vaccine-list-render-area', renderVaccineCard, 'dog');
        setupListListener(catVaccineColRef, 'cat-vaccine-list-render-area', renderVaccineCard, 'cat');
    }
}



/**
 * Tải danh sách vaccine (chó/mèo) và danh sách bác sĩ từ Firestore.
 * @param {string} type - Loại dữ liệu cần tải ('dog_vaccine', 'cat_vaccine', 'doctor').
 * @returns {Promise<Array<string>>} Mảng các tên/tên bác sĩ.
 */
async function fetchListItems(type) {
    if (!currentUserId) {
        console.error(`Không thể tải ${type}: currentUserId không xác định.`);
        return [];
    }

    try {
        let collectionName = '';
        if (type === 'dog_vaccine') collectionName = 'dog_vaccines';
        else if (type === 'cat_vaccine') collectionName = 'cat_vaccines';
        // Đã sửa: Dùng 'staff' thay vì 'doctor'
        else if (type === 'doctor') collectionName = 'staff'; 
        else return [];

        // ⭐ ĐÃ SỬA LỖI ĐƯỜNG DẪN: THÊM 'private', 'data' ⭐
        const listCollectionRef = collection(
            db, 
            'users', 
            currentUserId, 
            'private', 
            'data', // Phân đoạn bị thiếu
            collectionName // dog_vaccines, cat_vaccines, hoặc staff
        ); 
        
        // Sắp xếp theo tên (name)
        const q = query(listCollectionRef, orderBy('name', 'asc')); 
        const querySnapshot = await getDocs(q);
        
        const items = [];
        querySnapshot.forEach(doc => {
            // Chỉ lấy trường 'name'
            items.push(doc.data().name); 
        });
        
        return items;
    } catch (error) {
        // Lỗi này giờ chỉ còn là lỗi "Missing or insufficient permissions"
        console.error(`Lỗi khi tải danh sách ${type}:`, error);
        return [];
    }
}



/**
 * Tải danh sách giá vaccine (Chó và Mèo) từ Firestore và lưu vào biến toàn cục.
 */
async function loadVaccinePriceLists() {
    if (!currentUserId) {
        console.error("Không tìm thấy User ID, không thể tải danh sách vaccine.");
        return;
    }
    
    try {
        const userRef = `users/${currentUserId}/private/data`;
        
        // 1. Tải danh sách vaccine cho CHÓ
        const dogVaccineColRef = collection(db, `${userRef}/dog_vaccines`); // Dùng dog_vaccines
        const dogSnapshot = await getDocs(query(dogVaccineColRef));
        
        // ⭐ QUAN TRỌNG: Lấy TOÀN BỘ DỮ LIỆU tài liệu (bao gồm cả price) ⭐
        dogVaccinesList = dogSnapshot.docs.map(doc => ({ 
            ...doc.data(), 
            id: doc.id 
        }));
        
        // 2. Tải danh sách vaccine cho MÈO
        const catVaccineColRef = collection(db, `${userRef}/cat_vaccines`); // Dùng cat_vaccines
        const catSnapshot = await getDocs(query(catVaccineColRef));
        
        // ⭐ QUAN TRỌNG: Lấy TOÀN BỘ DỮ LIỆU tài liệu (bao gồm cả price) ⭐
        catVaccinesList = catSnapshot.docs.map(doc => ({ 
            ...doc.data(), 
            id: doc.id 
        }));
        
        console.log(`Đã tải giá cho ${dogVaccinesList.length} vaccine chó và ${catVaccinesList.length} vaccine mèo.`);

    } catch (e) {
        console.error("Lỗi khi tải danh sách giá vaccine:", e);
    }
}


// TOÀN BỘ LOGIC SỬ DỤNG CAMERA QUÉT MÃ QR VỚI ZXING
// Khai báo các biến DOM cho nút và khung quét mã QR
const qrScanBtn = document.getElementById('qr-scan-btn');
const closeQrBtn = document.getElementById('close-qr-btn');
const videoElement = document.getElementById('qr-video'); // <--- Cần thêm thẻ <video>
const qrReader = document.getElementById('qr-reader'); // <--- Giữ lại container

let codeReader;
let videoStream;

// --- HÀM XỬ LÝ THÀNH CÔNG ---
const onScanSuccess = (result) => {
    // result.text chính là nội dung của mã QR
    const decodedText = result.text;
    
    searchInput.value = decodedText;
    filterPets();

    // ⭐ Dừng stream video và ẩn giao diện ⭐
    codeReader.reset(); 
    qrReader.style.display = 'none';
    qrScanBtn.style.display = 'block';
    closeQrBtn.style.display = 'none';
    
    if (navigator.vibrate) {
        navigator.vibrate(50);
    }
};

// --- HÀM KHỞI ĐỘNG CAMERA (BrowserMultiFormatReader) ---
qrScanBtn?.addEventListener('click', async () => {
    qrReader.style.display = 'block';
    qrScanBtn.style.display = 'none';
    closeQrBtn.style.display = 'block';

    try {
        // 1. Khởi tạo ZXing Reader
        codeReader = new ZXing.BrowserMultiFormatReader(); // Hoặc BrowserMultiFormatReader nếu dùng import

        // 2. Lấy ID của camera sau (để tránh lỗi)
        const videoInputDevices = await codeReader.listVideoInputDevices();
        const rearCamera = videoInputDevices.find(device => 
            device.label.toLowerCase().includes('back') || device.label.toLowerCase().includes('environment')
        );
        
        const cameraId = rearCamera ? rearCamera.deviceId : undefined;

        // 3. Bắt đầu quét
        // Sử dụng thẻ <video> đã tồn tại trong DOM
        codeReader.decodeFromVideoDevice(
            cameraId, 
            'qr-video', // ID của thẻ <video> 
            (result, error) => {
                if (result) {
                    onScanSuccess(result);
                }
                // Bạn có thể xử lý lỗi ở đây, nhưng ZXing thường rất yên tĩnh khi quét thất bại
            }
        );

    } catch (err) {
        console.error("Lỗi khi khởi động camera với ZXing:", err);
        alert("Không thể khởi động camera. Vui lòng cho phép quyền truy cập.");
        qrReader.style.display = 'none';
        qrScanBtn.style.display = 'block';
        closeQrBtn.style.display = 'none';
    }
});

// --- HÀM TẮT CAMERA ---
closeQrBtn?.addEventListener('click', () => {
    if (codeReader) {
        codeReader.reset(); // Hàm reset của ZXing sẽ tự động tắt stream và giải phóng tài nguyên
        qrReader.style.display = 'none';
        qrScanBtn.style.display = 'block';
        closeQrBtn.style.display = 'none';
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


// Hàm chính để tìm tất cả lịch tiêm sắp tới và cập nhật số lượng trên nút
/**
 * Tải tất cả các phác đồ vaccine (chó và mèo) từ Firestore.
 * @returns {object} Một đối tượng chứa danh sách vaccine: { Dog: [...], Cat: [...] }
 */
async function loadVaccineProtocols() {
    const protocols = {
        Dog: [],
        Cat: []
    };

    // Tải Vaccine cho Chó
    if (dogVaccineColRef) {
        const dogSnapshot = await getDocs(dogVaccineColRef);
        dogSnapshot.forEach(doc => {
            const data = doc.data();
            protocols.Dog.push(data);
        });
    }

    // Tải Vaccine cho Mèo
    if (catVaccineColRef) {
        const catSnapshot = await getDocs(catVaccineColRef);
        catSnapshot.forEach(doc => {
            const data = doc.data();
            protocols.Cat.push(data);
        });
    }

    return protocols;
}


/**
 * Tải tất cả thông tin chủ nuôi vào một bản đồ tra cứu (ownersMap) 
 * để sử dụng trong findUpcomingVaccinations.
 * @returns {object} Bản đồ các chủ nuôi với key là ownerId.
 */





/**
 * Sử dụng phác đồ linh hoạt để tìm lịch tiêm sắp tới.
 * (Hàm này được gọi khi nhấn nút "Kiểm tra nhắc lịch tiêm")
 * @returns {Array} Danh sách các nhắc nhở sắp đến hạn.
 */
async function findUpcomingVaccinations() {
    // ⭐ BỔ SUNG: Bắt đầu hiển thị Spinner
    if (typeof showLoadingSpinner === 'function') {
        showLoadingSpinner();
    }
    
    const reminders = [];
    
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const threeWeeksInMs = 21 * 24 * 60 * 60 * 1000;
        
        // ⭐ BƯỚC 1: Tải tất cả các phác đồ vaccine từ Firestore
        const protocols = await loadVaccineProtocols();

        // 2. Lặp qua tất cả chủ nuôi (logic fetchOwnersAndPets() đã tải vào ownersMap)
        for (const ownerId in ownersMap) {
            const owner = ownersMap[ownerId];
    // ⭐ CHẮC CHẮN TRUY CẬP ĐÚNG ownerName và phoneNumber ⭐
    const ownerName = owner ? owner.ownerName : 'Chưa rõ chủ nuôi'; 
    const ownerPhoneNumber = owner ? owner.phoneNumber : 'N/A'; 
            
            // 3. Lặp qua từng thú cưng
            owner.pets.forEach(pet => {
                // Xác định phác đồ vaccine tương ứng (Chó hoặc Mèo)
// **************** ĐOẠN NÀY VỪA ĐƯỢC CHUẨN HÓA
                // CODE CŨ - const petType = pet.type === 'Chó' ? 'Dog' : 'Cat';

// Giả định trường dữ liệu là 'species' và cần chuẩn hóa
const petSpeciesLower = pet.species ? pet.species.trim().toLowerCase() : '';
let petType = 'Dog'; // Mặc định là Dog
if (petSpeciesLower.includes('mèo') || petSpeciesLower.includes('cat')) {
    petType = 'Cat';
} // HẾT ĐOẠN CHUẨN HÓA
                const petProtocols = protocols[petType];
                
                if (!pet.vaccinations || pet.vaccinations.length === 0 || petProtocols.length === 0) {
                    return; // Bỏ qua nếu không có lịch sử tiêm hoặc không có phác đồ
                }

                // ⭐ BƯỚC MỚI 1: TẠO SET (TẬP HỢP) TÊN CÁC MŨI ĐÃ TIÊM ⭐
                // Giúp việc kiểm tra tồn tại cực nhanh (O(1))
                const allVaccinatedNames = new Set(pet.vaccinations.map(v => v.vaccineName));
                
                // ⭐ BƯỚC MỚI 2: TÌM MŨI TIÊM GẦN NHẤT CHO MỖI PHÁC ĐỒ CÓ THỂ BẮT ĐẦU NHẮC NHỞ ⭐
                
                // Sử dụng Map để lưu lại mũi tiêm GẦN NHẤT cho mỗi TÊN MŨI TIÊM 
                // đã tiêm (VD: Dại, 7 bệnh mũi 3)
                const latestVaccinationsMap = pet.vaccinations.reduce((acc, current) => {
                    const name = current.vaccineName;
                    const currentDate = new Date(current.date);
                    
                    if (!acc[name] || new Date(acc[name].date) < currentDate) {
                        acc[name] = current;
                    }
                    return acc;
                }, {});

                
                // ⭐ BƯỚC MỚI 3: LẶP QUA CÁC MŨI ĐÃ TIÊM GẦN NHẤT VÀ TÍNH TOÁN NHẮC NHỞ ⭐
                Object.values(latestVaccinationsMap).forEach(latestVaccine => {
                    
                    // Lấy Tên mũi tiêm hiện tại (VD: '7 bệnh mũi 3' hoặc 'Dại')
                    const currentVaccineName = latestVaccine.vaccineName;

                    // 1. Tìm phác đồ tương ứng với mũi tiêm hiện tại
                    const matchingProtocol = petProtocols.find(p => p.name === currentVaccineName);

                    if (matchingProtocol) {
                        const nextDoseName = matchingProtocol.nextDoseName;
                        const nextDoseDays = matchingProtocol.nextDoseDays;
        

                        // ⭐ BỔ SUNG: Kiểm tra xem đây có phải là mũi tiêm TỰ LẶP LẠI (Hằng năm) không ⭐
                        const isSelfRepeating = currentVaccineName === nextDoseName;

                        // Điều kiện tạo nhắc nhở:
                        // 1. Phải có lịch trình tiếp theo (nextDoseDays > 0)
                        // 2. PHẢI KHÔNG có trong lịch sử tiêm, HOẶC mũi tiêm là loại TỰ LẶP LẠI (Hằng năm)
                        const shouldCreateReminder = nextDoseDays > 0 && 
                                                    (!allVaccinatedNames.has(nextDoseName) || isSelfRepeating);

                        if (shouldCreateReminder) {
                            
                            const nextInfo = calculateNextVaccinationInfo(
                                nextDoseDays,
                                nextDoseName, 
                                latestVaccine.date 
                            );
        
                            // Logic lọc nhắc nhở (Không đổi so với code cũ của bạn)
                            const maxDaysAhead = 15; 
                            const maxDaysOverdue = 60; 

                            if (nextInfo.rawDate && nextInfo.daysRemaining <= maxDaysAhead && nextInfo.daysRemaining >= -maxDaysOverdue) {
                                
                                reminders.push({
                                    // ... (các trường dữ liệu không đổi) ...
                                    petId: pet.petId,
                                    ownerId: ownerId, 
                                    petName: pet.petName,
                                    ownerName: owner.ownerName,
                                    ownerPhoneNumber: owner.phoneNumber,
                                    
                                    // Tên mũi tiêm tiếp theo (Ví dụ: 'Dại nhắc lần 1', '7 bệnh hằng năm')
                                    nextVaccine: nextInfo.nextDoseName, 
                                    nextVaccineDate: nextInfo.nextDate, 
                                    rawNextDate: nextInfo.rawDate, 
                                    statusText: nextInfo.statusText,
                                    daysLeft: nextInfo.daysRemaining 
                                });
                            }
                        }
                        // Nếu nextDoseName đã tồn tại trong allVaccinatedNames, thì nhắc nhở này bị bỏ qua.
                        // Ví dụ: Mũi tiêm '7 bệnh mũi 2' có nextDoseName là '7 bệnh mũi 3'. Nếu '7 bệnh mũi 3' 
                        // đã tiêm rồi, thì nhắc nhở cho '7 bệnh mũi 2' bị loại bỏ.
                    }
                })
            });
        }                
        return reminders;
        
    } catch (error) {
        console.error("Lỗi khi tìm kiếm lịch tiêm sắp tới:", error);
        // Trả về mảng rỗng nếu có lỗi
        return []; 
    } finally {
        // ⭐ BỔ SUNG: Luôn ẩn Spinner sau khi hoàn tất (dù thành công hay thất bại)
        if (typeof hideLoadingSpinner === 'function') {
            hideLoadingSpinner();
        }
    }
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

// Tải phác đồ vaccine một lần duy nhất (giống như trong findUpcomingVaccinations)
let vaccineProtocolsCache = null; 
async function getVaccineProtocols() {
    if (!vaccineProtocolsCache) {
        vaccineProtocolsCache = await loadVaccineProtocols(); // Dùng hàm load đã có
    }
    return vaccineProtocolsCache;
}

/**
 * Hàm cốt lõi để tính toán và lấy Pet ID dựa trên Days Remaining
 * @param {Array} allPets - Danh sách tất cả thú cưng
 * @returns {Array<Object>} Danh sách các thú cưng đã được tính toán trạng thái tiếp theo
 */
async function calculatePetVaccinationStatus(allPets) {
    if (!allPets || allPets.length === 0) return [];
    
    const protocols = await getVaccineProtocols();
    const petsWithStatus = [];

    allPets.forEach(pet => {
        const vaccinations = pet.vaccinations?.filter(v => v.date) || [];
        if (vaccinations.length === 0) return;

        // 1. Sắp xếp và lấy mũi tiêm gần nhất
        vaccinations.sort((a, b) => new Date(b.date) - new Date(a.date));
        const latestVaccine = vaccinations[0]; 

        // 2. Tìm phác đồ tương ứng
        const petType = pet.type === 'Chó' ? 'Dog' : 'Cat';
        const matchingProtocol = protocols[petType]?.find(p => p.name === latestVaccine.vaccineName);

        if (matchingProtocol && matchingProtocol.nextDoseDays > 0) {
            const nextInfo = calculateNextVaccinationInfo(
                matchingProtocol.nextDoseDays,
                matchingProtocol.nextDoseName,
                latestVaccine.date
            );
            
            petsWithStatus.push({
                petId: pet.petId,
                daysRemaining: nextInfo.daysRemaining,
                // Có thể thêm nextDate nếu cần
            });
        }
    });

    return petsWithStatus;
}


// --- HÀM GẮN TAG ĐÃ SỬA ---

/**
 * Hàm kiểm tra và lấy danh sách thú cưng sắp đến ngày tiêm (trong vòng 30 ngày)
 */
async function getUpcomingVaccinations(allPets) {
    const petsStatus = await calculatePetVaccinationStatus(allPets);
    // Nhắc nhở sắp tới: 0 ngày (Hôm nay) đến 15 ngày
    const UPCOMING_THRESHOLD = 30; // Số ngày tối đa để nhắc sắp đến lịch tiêm
    
    const upcomingIds = petsStatus
        .filter(p => p.daysRemaining > 0 && p.daysRemaining <= UPCOMING_THRESHOLD)
        .map(p => p.petId);

    return new Set(upcomingIds);
}

/**
 * Hàm kiểm tra và lấy danh sách thú cưng quá hạn tiêm
 */
async function getOverdueVaccinations(allPets) {
    const petsStatus = await calculatePetVaccinationStatus(allPets);
    // Quá hạn: daysRemaining < 0
    
    // ⭐ LƯU Ý: Không cần giới hạn ngày quá hạn ở đây, tag Overdue nên hiển thị cho đến khi tiêm
    const overdueIds = petsStatus
        .filter(p => p.daysRemaining < 0)
        .map(p => p.petId);

    return new Set(overdueIds);
}

// Hàm này tìm kiếm 5 thú cưng được tiêm vaccine gần đây nhất
const getRecentlyVaccinatedPets = (pets) => {
    const recentlyVaccinated = pets.map(pet => {
        // ⭐ ĐÃ SỬA: Bỏ Object.values() và dùng cú pháp Optional Chaining ngắn gọn hơn ⭐
        const vaccinations = pet.vaccinations?.filter(v => v.date) || []; 
        
        if (vaccinations.length === 0) {
            return null;
        }

        const latestVaccination = vaccinations.sort((a, b) => new Date(b.date) - new Date(a.date))[0];

        return {
            ...pet,
            latestVaccinationDate: new Date(latestVaccination.date),
            // ⭐ SỬA TÊN TRƯỜNG: Tên vaccine được lưu là 'vaccineName' trong mảng đã xử lý
            latestVaccineName: latestVaccination.vaccineName
        };
    }).filter(pet => pet !== null);

    recentlyVaccinated.sort((a, b) => b.latestVaccinationDate - a.latestVaccinationDate);

    // Giữ nguyên logic trả về Set của 5 petId gần nhất
    return new Set(recentlyVaccinated.slice(0, 5).map(pet => pet.petId));
};



/**
 * Hàm kiểm tra và lấy danh sách Pet ID đã có lịch sử tiêm "Dừng tiêm vaccine".
 * Những pet này sẽ được gắn tag cảnh báo và không còn được nhắc nhở.
 * @param {Array} allPets - Danh sách tất cả thú cưng
 * @returns {Set} Set các petId cần gắn tag Dừng Tiêm
 */
function getStopReminderPets(allPets) {
    const stopReminderIds = new Set();
    
    allPets.forEach(pet => {
        const vaccinations = pet.vaccinations?.filter(v => v.date) || [];
        
        // Kiểm tra xem có mũi tiêm nào chứa tên "Dừng tiêm vaccine" không
        const hasStopReminder = vaccinations.some(v => 
            v.vaccineName && v.vaccineName.toLowerCase().includes('dừng tiêm vaccine')
        );

        if (hasStopReminder) {
            stopReminderIds.add(pet.petId);
        }
    });

    return stopReminderIds;
}


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
// xóa bỏ dòng code cũ:populateVaccineSelect(petspecies, editVaccineNameSelect);
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
    
// Hàm gọi bảng thanh toán hiện ra khi nhấn nút "Quản lý thanh toán"
if (managePaymentsBtn) {
    // ⭐ THÊM 'async' VÀO ĐÂY ⭐
    managePaymentsBtn.addEventListener('click', async () => { 
        
        // 1. Hiển thị Spinner VÀ mở Modal (để người dùng thấy spinner ngay lập tức)
        showLoadingSpinner();
        showModal('manage-payments-modal'); 
        
        try {
            // 2. Tải danh sách giá vaccine trước (QUAN TRỌNG)
            await loadVaccinePriceLists(); 
            
            // 3. Sau đó, tải và hiển thị dữ liệu thanh toán
            await fetchAndDisplayAllVaccinationsForPayment(); 
            
        } catch (error) {
            console.error("Lỗi khi tải dữ liệu thanh toán:", error);
            // Có thể thêm alert ở đây nếu cần thông báo lỗi cho người dùng
        } finally {
            // 5. ⭐ ẨN SPINNER SAU KHI TẤT CẢ TẢI DỮ LIỆU ĐÃ HOÀN TẤT ⭐
            hideLoadingSpinner();
        }
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
// xóa bỏ dòng code cũ:populateVaccineSelect(petspecies, vaccineNameSelect);
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


// ********************GẮN SỰ KIỆN NÚT XUẤT SANG WORD***********************
// ⭐ ĐOẠN CODE GẮN SỰ KIỆN NÚT XUẤT .doc (REMINDER MODAL) ⭐
const ReminderToWordBtn = document.getElementById('reminder-to-word-btn');
if (ReminderToWordBtn) {
    ReminderToWordBtn.addEventListener('click', () => {
        // GỌI HÀM XUẤT SANG WORD MỚI
        exportModalToWord('reminder-modal', 'DanhSachNhacLichTiem');
    });
}

// ********************GẮN SỰ KIỆN NÚT XUẤT SANG EXCEL**********************
// ⭐ ĐOẠN CODE GẮN SỰ KIỆN NÚT XUẤT .xls (PAYMENTS MODAL) .xls ⭐
const PaymentsToExelBtn = document.getElementById('payments-to-excel-btn');
if (PaymentsToExelBtn) {
    PaymentsToExelBtn.addEventListener('click', () => {
        // Gọi hàm xuất Excel .xls
        // Selector của bảng phải đúng. Ví dụ: '.detail-payment-list table'
        exportToNativeExcel('manage-payments-modal', 'BaoCaoThanhToan', '.detail-payment-list table');
    });
}
// *************************************************************************


/**
 * Hàm định dạng tiền tệ (ví dụ: 100000 -> 100.000 VNĐ).
 */
function formatCurrency(amount) {
    if (isNaN(amount)) return '0 VNĐ';
    // Đảm bảo số tiền không âm
    const finalAmount = Math.max(0, amount); 
    return finalAmount.toLocaleString('vi-VN') + ' VNĐ';
}


// ***************************************************
/**
 * Lấy đơn giá vaccine từ danh sách đã tải (dogVaccinesList hoặc catVaccinesList).
 * @param {string} species - Loại thú cưng ('chó' hoặc 'mèo').
 * @param {string} vaccineName - Tên vaccine.
 * @returns {number} Đơn giá (price) hoặc 0 nếu không tìm thấy.
 */
function getVaccinePrice(species, vaccineName) {
    const normalizedSpecies = species ? species.toLowerCase() : '';
    const normalizedName = vaccineName ? vaccineName.trim().toLowerCase() : '';
    let vaccineList = [];

    if (normalizedSpecies === 'chó') {
        vaccineList = dogVaccinesList; // Sử dụng biến global
    } else if (normalizedSpecies === 'mèo') {
        vaccineList = catVaccinesList; // Sử dụng biến global
    }

    const found = vaccineList.find(v => v.name && v.name.trim().toLowerCase() === normalizedName);
    return found ? parseFloat(found.price) || 0 : 0;
}

/**
 * Tính toán Thành tiền (Số tiền còn lại cần thu) dựa trên logic của người dùng.
 * @param {number} unitPrice - Đơn giá.
 * @param {string} status - Trạng thái thanh toán ('paid', 'advanced', 'in-debt').
 * @param {number} advanceAmount - Số tiền ứng trước.
 * @returns {number} Số tiền 'Thành tiền' theo logic của người dùng.
 */
function calculateTotalAmount(unitPrice, status, advanceAmount) {
    const normalizedStatus = status.toLowerCase();
    
    switch (normalizedStatus) {
        case 'paid': 
            // Yêu cầu: "thành tiền bằng số trong cột đơn giá"
            return unitPrice; 
        case 'advanced': 
            // Yêu cầu: "lấy đơn giá trừ cho số tiền ứng để ra số tiền còn nợ"
            return unitPrice - advanceAmount; 
        case 'in-debt': 
            // Yêu cầu: "còn nợ thì thành tiền bằng 0" (Logic này tuân thủ yêu cầu của bạn)
            return 0; 
        default:
            return 0;
    }
}


/**
 * Tính toán và cập nhật tổng số tiền đã thanh toán và còn nợ.
 * @param {Array<object>} records - Danh sách các bản ghi tiêm chủng đã được lọc.
 */
function updatePaymentTotals(records) {
    if (!totalPaidLabel || !totalOwedLabel || !records) return;

    let totalPaid = 0;
    let totalOwed = 0;

    records.forEach(record => {
        // Lấy đơn giá (giả định hàm này tồn tại)
        const unitPrice = getVaccinePrice(record.species, record.vaccineName) || 0; 
        
        // Lấy giá trị thanh toán/phụ thu
        const currentSurcharge = parseFloat(record.surchargeAmount) || 0;
        const currentPaid = parseFloat(record.paidAmount) || 0;
        
        // Tính toán
        const finalTotal = unitPrice + currentSurcharge;
        const owed = Math.max(0, finalTotal - currentPaid);

        totalPaid += currentPaid;
        totalOwed += owed;
    });

    // Cập nhật hiển thị (Giả định hàm formatCurrency() của bạn tồn tại)
    totalPaidLabel.textContent = `Tổng số tiền đã thanh toán: ${formatCurrency(totalPaid)} VNĐ`;
    totalOwedLabel.textContent = `Tổng số tiền còn nợ: ${formatCurrency(totalOwed)} VNĐ`;
}


// ***********************TOÀN BỘ LOGIC TÌM KIẾM TRONG MODAL QUẢN LÝ THANH TOÁN*******************************
// BƯỚC 1 - TRUY SUẤT TẤT CẢ CÁC MŨI TIÊM VÀ TÌNH TRẠNG THANH TOÁN TỪ FIRESTORE RỒI RENDER LÊN BẢNG
// Hàm hiển thị tình trạng thanh toán của từng mũi tiêm cho thú cưng
async function fetchAndDisplayAllVaccinationsForPayment() {
    const paymentsTableBody = document.getElementById('payments-table-body');
    if (!paymentsTableBody) return;
    
    // Đã thay đổi colspan thành 7 để khớp với bảng mới
    paymentsTableBody.innerHTML = '<tr><td colspan="7" class="text-left py-4 text-gray-500">Đang tải danh sách thanh toán...</td></tr>'; 
    
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
                        // Thêm trường species để lấy Đơn giá
                        species: petData.species, 
                        id: vaccineDoc.id, // đổi thành id
                        vaccineName: vaccineData.name, // đổi thành vaccineName
                        date: vaccineData.date, // đổi thành date
                        petId: petId,
                        ownerId: ownerId,
                        // ⭐ LẤY CÁC TRƯỜNG DỮ LIỆU THANH TOÁN MỚI ⭐
                        surchargeAmount: vaccineData.surchargeAmount || 0,
                        paidAmount: vaccineData.paidAmount || 0,
                        // CÁC TRƯỜNG paymentAmount và paymentStatus (cũ) ĐÃ ĐƯỢC BỎ
                    });
                });
            }
        }
        
        paymentsTableBody.innerHTML = '';
        if (allVaccinations.length === 0) {
            paymentsTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-gray-500">Chưa có mũi tiêm nào được ghi nhận.</td></tr>';
        } else {
            // Cập nhật biến global và gọi hàm render mới
            window.allPaymentRecords = allVaccinations;
              console.log('Dữ liệu đã tải cho thanh toán:', allVaccinations);

           displayFilteredPayments(allVaccinations);
         }

    } catch (e) {
        console.error("Lỗi khi tải danh sách thanh toán: ", e);
        paymentsTableBody.innerHTML = '<tr><td colspan="7" class="text-center py-4 text-red-500">Lỗi khi tải dữ liệu thanh toán.</td></tr>';
    }
}


        // totalPaidLabel.textContent = `Tổng số tiền đã thanh toán: ${totalPaid.toLocaleString('vi-VN')} VNĐ`;
        // totalOwedLabel.textContent = `Tổng số tiền còn nợ: ${totalOwed.toLocaleString('vi-VN')} VNĐ`;



// BƯỚC 2: TẠO HÀM LỌC CÁC HÀNG DỰA THEO GIÁ TRỊ TRONG Ô NHẬP LIỆU 
/**
 * Lọc các hàng trong bảng Thanh toán dựa trên từ khóa tìm kiếm.
 */

function filterPaymentRows() {
    // Đảm bảo các biến đã được khai báo và tồn tại
    if (!paymentSearchInput || !paymentsTableBody) return; 

    const searchTerm = paymentSearchInput.value.trim().toLowerCase();
    
    // Lấy tất cả các hàng có thuộc tính data-vaccine-id
    const rows = paymentsTableBody.querySelectorAll('tr[data-vaccine-id]'); 

    rows.forEach(row => {
        // Lấy nội dung của tất cả các ô (<td>) trong hàng, loại trừ input
        // Giả định bạn muốn tìm kiếm theo Tên Vaccine hoặc Tên Bác sĩ.
        const rowTextContent = Array.from(row.querySelectorAll('td'))
            // Loại bỏ các ô chứa input (chỉ lấy nội dung hiển thị tĩnh)
            .filter(cell => !cell.querySelector('input')) 
            .map(cell => cell.textContent || '')
            .join(' ')
            .toLowerCase();
        
        // Hoặc chỉ lọc theo cột Tên Vaccine (Giả định cột 1 là tên vaccine)
        // const vaccineName = row.cells[1].textContent.toLowerCase(); 

        if (rowTextContent.includes(searchTerm)) {
            row.style.display = ''; // Hiển thị hàng
        } else {
            row.style.display = 'none'; // Ẩn hàng
        }
    });
}






// BƯỚC 4 - HÀM LỌC CÁC DỮ LIỆU THÔ TRONG BẢN GHI (RECORD)
/**
 * Lọc danh sách bản ghi thanh toán theo tên thú cưng hoặc tên mũi tiêm.
 * ĐÃ SỬA: Sửa lỗi khoảng trắng (trim) và tên thuộc tính (vaccineName).
 */
function filterPaymentRecords(records, searchTerm) {
    /** console.log('Hàm lọc đang chạy'); */
    
    // ⭐ LOG QUAN TRỌNG ĐỂ CHẨN ĐOÁN LỖI ⭐
    /** console.log('1. Giá trị searchTerm thô:', searchTerm); */
    
    if (!records) {
        return []; // Trả về mảng rỗng nếu records null/undefined
    }
    
    // ⭐ FIX: Sử dụng trim() để loại bỏ khoảng trắng thừa ⭐
    const processedSearchTerm = (searchTerm || '').trim();
    
    /** console.log('2. Giá trị sau khi trim():', processedSearchTerm); */

    if (processedSearchTerm.length === 0) {
        /** console.log('3. THOÁT SỚM: Tìm kiếm rỗng.'); */
        return records;
    }

    /** console.log('Số lượng bản ghi đang lọc:', records.length); */
    
    const lowerCaseSearch = processedSearchTerm.toLowerCase();

    return records.filter(record => {
        /** console.log('Tên Thú Cưng:', record.petName, 'Tên Vaccine:', record.vaccineName); */
        
        // FIX: Đảm bảo kiểm tra đúng thuộc tính (vaccineName) và dùng trim()
        return (record.petName || '').trim().toLowerCase().includes(lowerCaseSearch) ||
               (record.vaccineName || '').trim().toLowerCase().includes(lowerCaseSearch)
    });
}


/**
 * Thiết lập các Event Listener (Đảm bảo gọi hàm này khi render bảng)
 */
function setupPaymentEventListeners() {
    const paymentsTableBody = document.getElementById('payments-table-body');
    // Xóa listener cũ trước
    paymentsTableBody.removeEventListener('input', handlePaymentChange); 
    // Thêm listener mới (sử dụng 'input' để tính toán ngay khi gõ)
    paymentsTableBody.addEventListener('input', handlePaymentChange);
}



// BƯỚC 5: LẮNG NGHE DỮ LIỆU NHẬP VÀO Ô TÌM KIẾM
// LOGIC LỌC TRONG MODAL THANH TOÁN
if (paymentSearchInput) {
    paymentSearchInput.addEventListener('input', () => {
        // Mỗi lần gõ chữ, hàm lọc sẽ được gọi
        filterPaymentRows();
    });
}






// BƯỚC 6: RENDER LẠI CÁC DỮ LIỆU ĐÃ LỌC ĐƯỢC
/**
 * Hàm gọi render ban đầu khi mở modal.
 * @param {Array<object>} paymentRecords - Danh sách các bản ghi tiêm chủng có kèm thông tin pet.
 */
function renderPaymentsTable(paymentRecords) {
    window.allPaymentRecords = paymentRecords; 
    displayFilteredPayments(paymentRecords); 
}

/**
 * Hàm hỗ trợ hiển thị dữ liệu đã lọc, sắp xếp và toàn bộ dữ liệu.
 * @param {Array<object>} records - Danh sách các bản ghi thanh toán GỐC.
 */
function displayFilteredPayments(records) {
    const paymentsTableBody = document.getElementById('payments-table-body');
    if (!paymentsTableBody) return;
    
    // ⭐ BUỘC TÌM LẠI PHẦN TỬ DOM TRONG NỘI BỘ HÀM BẰNG ID ⭐
    const searchInput = document.getElementById('payment-search-input');
    const searchTerm = searchInput ? searchInput.value : ''; // Đọc giá trị
    
    // Log để kiểm tra giá trị sau khi Listener gọi
    /** console.log('Hàm lọc đang chạy'); */
    /** console.log('1. Giá trị searchTerm thô:', searchTerm); */
    
    // 1. LỌC DỮ LIỆU: Sử dụng hàm lọc (filterPaymentRecords)
    const filteredRecords = filterPaymentRecords(records, searchTerm);

    paymentsTableBody.innerHTML = '';

    if (filteredRecords.length === 0) {
        paymentsTableBody.innerHTML = `
            <tr><td colspan="9" class="text-center py-4 text-gray-500">
                ${searchTerm ? `Không tìm thấy bản ghi nào cho từ khóa "${searchTerm}".` : `Chưa có mũi tiêm nào được ghi nhận.`}
            </td></tr>
        `;
        return;
    }

    // 2. SẮP XẾP THEO NGÀY TIÊM GIẢM DẦN (Mới nhất -> Cũ nhất)
    filteredRecords.sort((a, b) => {
        const dateA = a.date || '0000-00-00';
        const dateB = b.date || '0000-00-00';

        if (dateB > dateA) return 1;
        if (dateB < dateA) return -1;
        return 0;
    });

    // 3. RENDER DỮ LIỆU ĐÃ LỌC VÀ SẮP XẾP
    filteredRecords.forEach(record => {
        // ... (Giữ nguyên toàn bộ logic RENDER từng hàng <tr> của bạn ở đây) ...
        const petName = record.petName;
        const vaccineName = record.vaccineName;
        const species = record.species; 
        const vaccineId = record.id; 
        // ... (Tiếp tục logic tính toán và render HTML) ...

        const unitPrice = getVaccinePrice(species, vaccineName);
        const currentSurcharge = parseFloat(record.surchargeAmount) || 0;
        const currentPaid = parseFloat(record.paidAmount) || 0;
        const finalTotal = unitPrice + currentSurcharge;
        const initialOwed = Math.max(0, finalTotal - currentPaid);
        const vaccinationDate = record.date || 'N/A';
        const ownerId = record.ownerId;
        const petId = record.petId;
        
        const row = document.createElement('tr');
        // ... (Các thuộc tính data-attribute và innerHTML khác) ...
        row.classList.add('hover:bg-gray-50', 'cursor-pointer');
        row.setAttribute('data-vaccine-id', vaccineId);
        row.setAttribute('data-owner-id', ownerId); 
        row.setAttribute('data-pet-id', petId);     
        row.setAttribute('data-vaccine-id', record.id); 

        row.innerHTML = `
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${petName}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${vaccinationDate}</td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900">${vaccineName}</td>
            
            <td class="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900 unit-price" data-price="${unitPrice}">
                ${formatCurrency(unitPrice)}
            </td>
            
            <td class="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                <input type="number" min="0" 
                      class="surcharge-input p-1 border border-gray-300 rounded text-sm w-full text-right focus:border-blue-500 focus:ring-blue-500" 
                      value="${currentSurcharge}" 
                      data-vaccine-id="${vaccineId}">
            </td>

            <td class="px-3 py-2 whitespace-nowrap text-sm font-semibold text-right text-blue-700 total-amount" data-initial-amount="${finalTotal}">
                ${formatCurrency(finalTotal)}
            </td>
            
            <td class="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                <input type="number" min="0" 
                      class="paid-amount-input p-1 border border-gray-300 rounded text-sm w-full text-right focus:border-blue-500 focus:ring-blue-500" 
                      value="${currentPaid}" 
                      data-vaccine-id="${vaccineId}">
            </td>
            
            <td class="px-3 py-2 whitespace-nowrap text-sm text-right text-gray-900">
                <span class="owed-amount-display font-semibold text-red-600" data-vaccine-id="${vaccineId}">
                    ${formatCurrency(initialOwed)}
                </span>
            </td>
            <td class="px-3 py-2 whitespace-nowrap text-sm text-gray-900"></td>
        `;

        paymentsTableBody.appendChild(row);
    });
    
    // ⭐ BỔ SUNG: GỌI HÀM CẬP NHẬT TỔNG TIỀN SAU KHI LỌC ⭐
    updatePaymentTotals(filteredRecords); 

    setupPaymentEventListeners(); 
}


/**
 * Xử lý khi Phụ thu hoặc Đã thanh toán thay đổi.
 */
function handlePaymentChange(event) {
    const target = event.target;
    
    // Chỉ lắng nghe sự thay đổi trên Phụ thu hoặc Đã thanh toán input
    if (target.classList.contains('surcharge-input') || target.classList.contains('paid-amount-input')) {
        const row = target.closest('tr');
        const unitPriceCell = row.querySelector('.unit-price');
        const surchargeInput = row.querySelector('.surcharge-input');
        const paidInput = row.querySelector('.paid-amount-input');
        const totalAmountCell = row.querySelector('.total-amount');
        const owedDisplay = row.querySelector('.owed-amount-display');

        // Lấy các giá trị cơ bản
        const unitPrice = parseFloat(unitPriceCell.getAttribute('data-price')) || 0;
        
        let surchargeAmount = parseFloat(surchargeInput.value) || 0;
        let paidAmount = parseFloat(paidInput.value) || 0;
        
        // 1. Giới hạn số tiền nhập (không âm)
        surchargeAmount = Math.max(0, surchargeAmount);
        paidAmount = Math.max(0, paidAmount);

        // 2. Cập nhật input values (để reset nếu người dùng nhập số âm)
        surchargeInput.value = surchargeAmount;
        paidInput.value = paidAmount;
        
        // 3. Tính toán TỔNG THÀNH TIỀN MỚI
        const newTotalAmount = unitPrice + surchargeAmount;

        // 4. Tính toán CÒN NỢ mới
        const newOwedAmount = Math.max(0, newTotalAmount - paidAmount);

        // 5. Cập nhật hiển thị
        totalAmountCell.textContent = formatCurrency(newTotalAmount);
        owedDisplay.textContent = formatCurrency(newOwedAmount);
        
        // Cần cập nhật data-attribute của Thành tiền để giữ giá trị tính toán
        totalAmountCell.setAttribute('data-initial-amount', newTotalAmount);
        
        // ⭐ BƯỚC TIẾP THEO: GỌI HÀM LƯU DỮ LIỆU LÊN FIRESTORE ⭐
    }
}
// *************************HẾT LOGIC LỌC******************************************


// LOGIC LƯU TRẠNG THÁI THANH TOÁN VÀO FIRESTORE
    if (savePaymentsBtn) {
    savePaymentsBtn.addEventListener('click', async () => {
        // Selector mới sử dụng data-vaccine-id 
        const rows = paymentsTableBody.querySelectorAll('tr[data-vaccine-id]'); 
        if (rows.length === 0) {
            console.warn('Không có hàng nào để cập nhật.');
            alert('Không có mũi tiêm nào để lưu.');
            return;
        }
        
        // 1. Khởi tạo Batch Write để lưu nhiều bản ghi cùng lúc
        const batch = writeBatch(db); // Đảm bảo bạn đã import writeBatch từ firebase/firestore
        
        rows.forEach(row => {
            const ownerId = row.getAttribute('data-owner-id');
            const petId = row.getAttribute('data-pet-id');
            const vaccinationId = row.getAttribute('data-vaccine-id');
            
            // ⭐ LẤY GIÁ TRỊ TỪ INPUT MỚI ⭐
            const surchargeInput = row.querySelector('.surcharge-input');
            const paidInput = row.querySelector('.paid-amount-input');
            
            // Đảm bảo không lưu giá trị NaN (chuyển sang 0 nếu không hợp lệ)
            const surchargeAmount = parseFloat(surchargeInput.value) || 0;
            const paidAmount = parseFloat(paidInput.value) || 0;
            
            // Tham chiếu đến tài liệu tiêm chủng cần cập nhật
            const docRef = doc(db, `users/${currentUserId}/private/data/owners/${ownerId}/pets/${petId}/vaccinations`, vaccinationId);
            
            // Thêm thao tác cập nhật vào Batch
            batch.update(docRef, {
                // ⭐ LƯU CÁC TRƯỜNG DỮ LIỆU MỚI ⭐
                surchargeAmount: surchargeAmount, 
                paidAmount: paidAmount,       
            });
        });
        
        try {
            // 2. Commit Batch để thực hiện tất cả các cập nhật
            await batch.commit(); 
            
            console.log('Cập nhật trạng thái thanh toán thành công!');
            alert('Cập nhật trạng thái thanh toán thành công!');
            
            // Sau khi lưu, đóng modal
            closeModal('manage-payments-modal'); 
            
            // ⭐ GỢI Ý: Gọi hàm tải lại dữ liệu tổng thể nếu cần (ví dụ: dashboard) ⭐
            // fetchAndDisplayPetData(); // Nếu có hàm này
        } catch (error) {
            console.error("Lỗi khi cập nhật trạng thái thanh toán:", error);
            alert('Đã xảy ra lỗi khi lưu. Vui lòng thử lại.');
        }
    });
}
// ************************************************************
    
// ⭐ LOGIC MỞ MODAL NHẮC LỊCH TIÊM CHỦNG (Nút Check Reminder) ⭐
if (showUpcomingBtn) {
    showUpcomingBtn.addEventListener('click', async () => {
        // Sử dụng window.currentReminders đã được lưu trữ (tải từ lần đăng nhập)
        let reminders = window.currentReminders;
        if (!reminders || reminders.length === 0) {
            // Trường hợp dữ liệu chưa được tải lần đầu hoặc chưa có, tải lại
            reminders = await findUpcomingVaccinations();
        
            // ⭐ BỔ SUNG: LƯU VÀO window.currentReminders ngay sau khi tải ⭐
            window.currentReminders = reminders; 
        }
        
        // ⭐ VỊ TRÍ BỔ SUNG: THÊM LOGIC SẮP XẾP TẠI ĐÂY ⭐
        // Sắp xếp Tăng dần theo daysLeft: 
        // Số âm (Quá hạn) -> Số 0 (Hôm nay) -> Số dương (Sắp tới)
        reminders.sort((a, b) => a.daysLeft - b.daysLeft); 

        // ⭐ THAY THẾ bằng hàm hiển thị DẠNG BẢNG mới ⭐
        displayReminders(reminders); 
        
        if (reminderModal) {
            reminderModal.style.display = 'flex'; // Mở modal
        }
    });
}

// ⭐ LOGIC ĐÓNG MODAL NHẮC LỊCH TIÊM CHỦNG ⭐
if (closeReminderModalBtn) {
    closeReminderModalBtn.addEventListener('click', () => {
        if (reminderModal) {
            reminderModal.style.display = 'none';
        }
    });
}

// Logic đóng modal khi click ra ngoài
if (reminderModal) {
    reminderModal.addEventListener('click', (e) => {
        if (e.target === reminderModal) {
            reminderModal.style.display = 'none';
        }
    });
}

// ⭐ LOGIC TÌM KIẾM TRONG MODAL ⭐
if (reminderSearchInput) {
    reminderSearchInput.addEventListener('input', () => {
        const reminders = window.currentReminders || [];
        // Lệnh này tự động gọi filter và render lại bảng
        displayReminders(reminders); 
    });
}

// CODE MỚI CHO PHẦN QUẢN LÝ DANH SÁCH
// Bổ sung logic Mở/Đóng Modal Quản lý Danh sách
if (manageListsBtn) {
    manageListsBtn.addEventListener('click', () => {
        manageListsModal.style.display = 'flex';
    });
}

// ⭐ FIX: Đảm bảo Nút Đóng Modal (Nút X) hoạt động
if (closeManageListsModalBtn) {
    closeManageListsModalBtn.addEventListener('click', () => {
        manageListsModal.style.display = 'none'; // Thay 'hidden' bằng 'none'
    });
}

// Logic chuyển đổi Tab
if (manageListsTabs) {
    manageListsTabs.addEventListener('click', (e) => {
        const targetBtn = e.target.closest('button');
        if (!targetBtn) return;
        
        const targetTab = targetBtn.getAttribute('data-tab');

        // 1. Ẩn tất cả nội dung tab
        tabContents.forEach(content => {
            content.classList.add('hidden');
        });

        // 2. Hiển thị nội dung tab được chọn
        const activeContent = document.getElementById(`${targetTab}-content`);
        if (activeContent) {
            activeContent.classList.remove('hidden');
        }

        // 3. Cập nhật style cho nút tab
        tabButtons.forEach(btn => {
            btn.classList.remove('text-blue-600', 'border-blue-600', 'active-tab');
            btn.classList.add('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300');
        });
        
        targetBtn.classList.add('text-blue-600', 'border-blue-600', 'active-tab');
        targetBtn.classList.remove('border-transparent', 'hover:text-gray-600', 'hover:border-gray-300');
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

// Bổ sung hỗ trợ phím ESC để đóng cả hai khung (nút QR và nút Danh sách)
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        // Kiểm tra xem khung overlay có đang hiển thị không (Logic cũ)
        if (qrOverlay && qrOverlay.style.display === 'flex') {
             qrOverlay.style.display = 'none';
        }
        // Kiểm tra xem lightbox có đang hiển thị không (Logic cũ)
        if (lightbox && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
        // ⭐ FIX: Kiểm tra xem modal Quản lý Danh sách có đang hiển thị không
        if (manageListsModal && manageListsModal.style.display === 'flex') {
            manageListsModal.style.display = 'none'; // Thay 'hidden' bằng 'none'
        }
    }
});


// Bổ sung logic đóng modal bằng cách click ra ngoài
if (manageListsModal) {
    manageListsModal.addEventListener('click', (e) => {
        // Nếu click chính xác vào lớp overlay (không phải nội dung bên trong)
        if (e.target === manageListsModal) {
            manageListsModal.style.display = 'none'; // Thay 'hidden' bằng 'none'
        }
    });
}

// TOÀN BỘ LOGIC DỮ LIỆU CHO NÚT QUẢN LÝ DANH SÁCH
// Khai báo form DOM mới
const staffForm = document.getElementById('staff-form');
const dogVaccineForm = document.getElementById('dog-vaccine-form');
const catVaccineForm = document.getElementById('cat-vaccine-form');

/**
 * Hàm chung để lưu dữ liệu vào Firestore
 * @param {HTMLFormElement} formElement Form chứa dữ liệu
 * @param {FirestoreCollectionReference} collectionRef Tham chiếu đến collection cần lưu
 * @param {string} type Loại dữ liệu (để hiển thị thông báo)
 */
async function saveListData(formElement, collectionRef, type) {
    // Thu thập dữ liệu từ form
    const formData = new FormData(formElement);
    const data = Object.fromEntries(formData.entries());

    // Thu thập dữ liệu dựa trên id cụ thể của form
    let saveData = {};
    if (type === 'staff') {
        saveData = {
            name: document.getElementById('staff-name').value.trim(),
            position: document.getElementById('staff-position').value.trim(),
            phone: document.getElementById('staff-phone').value.trim(),
            address: document.getElementById('staff-address').value.trim(),
            dateHired: document.getElementById('staff-date-hired').value,
            createdAt: new Date(),
        };
    } else if (type === 'dog_vaccine' || type === 'cat_vaccine') {
        saveData = {
            name: document.getElementById(`${type === 'dog_vaccine' ? 'dog' : 'cat'}-vaccine-name`).value.trim(),
            company: document.getElementById(`${type === 'dog_vaccine' ? 'dog' : 'cat'}-vaccine-company`).value.trim(),
            price: parseFloat(document.getElementById(`${type === 'dog_vaccine' ? 'dog' : 'cat'}-vaccine-price`).value) || 0,
            nextDoseName: document.getElementById(`${type === 'dog_vaccine' ? 'dog' : 'cat'}-vaccine-next-name`).value.trim(),
            nextDoseDays: parseInt(document.getElementById(`${type === 'dog_vaccine' ? 'dog' : 'cat'}-vaccine-next-days`).value) || 0,
            type: type === 'dog_vaccine' ? 'Dog' : 'Cat',
            createdAt: new Date(),
        };
    }

// CODE DÙNG TỪ NGỮ THÔNG BÁO THÂN THIỆN
        const docId = document.getElementById(`${type === 'staff' ? 'staff' : (type === 'dog_vaccine' ? 'dog-vaccine' : 'cat-vaccine')}-id`).value;

    // ⭐ BƯỚC 1: TẠO ÁNH XẠ (MAP) DỊCH TỪ TYPE SANG TIẾNG VIỆT ⭐
    const typeMap = {
        'staff': 'Nhân viên',
        'dog_vaccine': 'Vắc xin Chó',
        'cat_vaccine': 'Vắc xin Mèo',
        // Thêm các loại type khác nếu cần
    };
    // Lấy tên tiếng Việt. Nếu không tìm thấy, dùng nguyên giá trị type.
    const friendlyType = typeMap[type] || type;


    try {  
        if (docId) {
            // Chế độ chỉnh sửa (UPDATE)
            const docRef = doc(collectionRef, docId);
            await updateDoc(docRef, saveData);
            // ⭐ Câu thông báo thân thiện ⭐
            alert(`Cập nhật ${friendlyType} thành công!`); 


        } else {
            // Chế độ thêm mới (CREATE)
            await addDoc(collectionRef, saveData);
            alert(`Thêm ${friendlyType} mới thành công!`);
        }
        
        // Gọi hàm reset form sau khi lưu thành công
        resetListForm(type);
        
    } catch (error) {
        console.error(`Lỗi khi lưu ${type}:`, error);
        alert(`Lỗi khi lưu ${friendlyType}. Vui lòng kiểm tra console.`);
    }
}

// Lắng nghe sự kiện Submit cho Form Nhân viên
if (staffForm) {
    staffForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveListData(staffForm, staffColRef, 'staff');
    });
}

// Lắng nghe sự kiện Submit cho Form Vaccine Chó
if (dogVaccineForm) {
    dogVaccineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveListData(dogVaccineForm, dogVaccineColRef, 'dog_vaccine');
    });
}

// Lắng nghe sự kiện Submit cho Form Vaccine Mèo
if (catVaccineForm) {
    catVaccineForm.addEventListener('submit', (e) => {
        e.preventDefault();
        saveListData(catVaccineForm, catVaccineColRef, 'cat_vaccine');
    });
}

// ************************************************************************************************************
// --- LOGIC HIỂN THỊ MODAL NHẮC LỊCH TIÊM (DẠNG BẢNG) ---

/**
 * Xử lý tìm kiếm (filter) danh sách nhắc nhở.
 */
function filterReminders(reminders, searchTerm) {
    if (!searchTerm || !reminders) return reminders;

    const lowerCaseSearch = searchTerm.toLowerCase();

    return reminders.filter(r => 
        // ⭐ ĐÃ SỬA: Thêm kiểm tra an toàn (r.property || '') ⭐
        (r.petName || '').toLowerCase().includes(lowerCaseSearch) ||
        (r.ownerName || '').toLowerCase().includes(lowerCaseSearch) ||
        (r.nextVaccine || '').toLowerCase().includes(lowerCaseSearch)
    );
}

/**
 * Hiển thị danh sách nhắc nhở lên Modal (Dạng Bảng).
 */
function displayReminders(reminders) {
    if (!reminderTableBody) return;

    reminderTableBody.innerHTML = '';
    const filteredReminders = filterReminders(reminders, reminderSearchInput ? reminderSearchInput.value : '');

    // Cập nhật tiêu đề modal
    const reminderListTitle = document.getElementById('reminder-list-title');
    if (reminderListTitle) {
        reminderListTitle.textContent = `Danh sách Nhắc lịch tiêm chủng (${filteredReminders.length}/${reminders.length})`;
    }

    if (filteredReminders.length === 0) {
        if (emptyReminderRow) emptyReminderRow.classList.remove('hidden');
    } else {
        if (emptyReminderRow) emptyReminderRow.classList.add('hidden');
        
        filteredReminders.forEach(reminder => {
            const daysLeftColor = reminder.daysLeft >= 7 ? 'text-green-600 font-bold' : (reminder.daysLeft >= 0 ? 'text-yellow-600 font-bold' : 'text-red-600 font-bold');
            
            const row = document.createElement('tr');
            row.className = 'hover:bg-gray-50 transition duration-150 cursor-pointer';
            row.setAttribute('data-pet-id', reminder.petId);
            row.setAttribute('data-owner-id', reminder.ownerId);

            row.innerHTML = `
                <td class="px-4 py-4 whitespace-nowrap">${reminder.petName}</td>
                <td class="px-4 py-4 whitespace-nowrap">${reminder.ownerName}</td>
                <td class="px-4 py-4 whitespace-nowrap">${reminder.nextVaccine}</td>
                <td class="px-4 py-4 whitespace-nowrap">${reminder.nextVaccineDate}</td>
                <td class="px-4 py-4 whitespace-nowrap">
                    <span class="${daysLeftColor}">
                        ${reminder.daysLeft > 0 ? `${reminder.daysLeft} ngày` : (reminder.daysLeft === 0 ? 'Hôm nay!' : `Quá hạn ${Math.abs(reminder.daysLeft)} ngày`)}
                    </span>
                </td>
            `;
            reminderTableBody.appendChild(row);
        });
        
        // Gắn sự kiện click vào từng hàng để xem chi tiết
        reminderTableBody.querySelectorAll('tr').forEach(row => {
            row.addEventListener('click', () => {
                const petId = row.getAttribute('data-pet-id');
                const ownerId = row.getAttribute('data-owner-id');
                if (reminderModal) reminderModal.style.display = 'none'; // Đóng modal (Giả định bạn dùng CSS display:none/flex)
                if (typeof showPetDetails === 'function') {
                    showPetDetails(petId, ownerId); // Gọi hàm xem chi tiết
                }
            });
        });
    }
}

// ⭐ BỔ SUNG: Lắng nghe sự kiện tìm kiếm
if (reminderSearchInput) {
    reminderSearchInput.addEventListener('input', () => {
        const reminders = window.currentReminders || [];
        displayReminders(reminders);
    });
}



/**
 * Xuất nội dung của một Modal sang tệp Word (.doc)
 * @param {string} modalId - ID của Modal cần xuất (ví dụ: 'manage-payments-modal').
 * @param {string} fileName - Tên file sẽ được tải xuống (ví dụ: 'BaoCaoThanhToan').
 */
function exportModalToWord(modalId, fileName) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Không tìm thấy Modal với ID: ${modalId}`);
        return;
    }

    // 1. Lấy nội dung của DIV chứa bảng dữ liệu
    // Chúng ta sẽ lấy toàn bộ nội dung của DIV bên trong Modal
    const content = modalElement.querySelector('.bg-white.rounded-2xl').innerHTML;
    
    // 2. Định nghĩa tên và tiêu đề cho tệp Word
    const title = fileName.replace(/([A-Z])/g, ' $1').trim();

    // 3. Tạo cấu trúc HTML đầy đủ cho tệp Word
    // Mime type application/msword sẽ khiến trình duyệt tải xuống dưới dạng tệp .doc
    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>${title}</title>
            <style>
                /* Thêm một số CSS cơ bản để đảm bảo Word hiển thị đúng */
                body { font-family: Tahoma, Arial, sans-serif; margin: 50px; }
                h1 { text-align: center; color: #333; }
                table { width: 100%; border-collapse: collapse; margin-top: 20px; }
                th, td { border: 1px solid #ddd; padding: 8px 12px; text-align: left; }
                th { background-color: #f2f2f2; }
                /* Loại bỏ các phần tử điều khiển (nút, input) khỏi bản xuất */
                button, input[type="text"] { display: none !important; }
            </style>
        </head>
        <body>
            <h1>${title}</h1>
            ${content}
        </body>
        </html>
    `;

    // 4. Tạo Blob và Link tải xuống
    const blob = new Blob([htmlContent], {
        type: 'application/msword;charset=utf-8'
    });

    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    
    // Thiết lập thuộc tính tải xuống
    downloadLink.href = url;
    downloadLink.download = `${fileName}.doc`; 

    // 5. Kích hoạt tải xuống và dọn dẹp
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
}


/**
 * Xuất dữ liệu bảng bên trong Modal sang tệp Excel (.xls) bằng cách sử dụng MIME Type của Excel.
 * @param {string} modalId - ID của Modal (ví dụ: 'manage-payments-modal').
 * @param {string} fileName - Tên file sẽ được tải xuống (ví dụ: 'BaoCaoThanhToan').
 * @param {string} tableSelector - Selector CSS của bảng cần xuất (ví dụ: '.detail-payment-list table').
 */
function exportToNativeExcel(modalId, fileName, tableSelector) {
    const modalElement = document.getElementById(modalId);
    
    if (!modalElement) {
        console.error(`Không tìm thấy Modal với ID: ${modalId}`);
        return;
    }

    // 1. Tìm bảng dữ liệu
    const table = modalElement.querySelector(tableSelector);
    if (!table) {
        console.error(`Không tìm thấy bảng với selector: ${tableSelector}`);
        return;
    }

    // 2. Lấy nội dung bảng
    // Clone bảng để không làm thay đổi DOM gốc
    const tableClone = table.cloneNode(true); 
    
    // Loại bỏ các cột/hàng không cần thiết cho báo cáo (ví dụ: cột chứa nút)
    // Nếu bạn có các cột chứa nút "Sửa" hoặc "Xóa", bạn cần thêm logic để ẩn chúng ở đây:
    // Ví dụ: tableClone.querySelectorAll('.action-column').forEach(el => el.remove());

    // Cần phải lấy giá trị từ input (Phụ thu, Đã thanh toán) thay vì placeholder text
    tableClone.querySelectorAll('input').forEach(input => {
        // Tạo một thẻ <span> chứa giá trị hiện tại và thay thế thẻ input
        const span = document.createElement('span');
        span.textContent = input.value;
        input.parentNode.replaceChild(span, input);
    });
    
    // Lấy chuỗi HTML của bảng đã dọn dẹp
    const tableHTML = tableClone.outerHTML;

    // 3. Tạo cấu trúc file HTML với MIME Type của Excel
    // Thiết lập mã hóa UTF-8 và style cơ bản cho Excel nhận dạng
    const template = `
        <html xmlns:o="urn:schemas-microsoft-com:office:office" 
              xmlns:x="urn:schemas-microsoft-com:office:excel" 
              xmlns="http://www.w3.org/TR/REC-html40">
        <head>
            <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
            <style>
                /* Thêm style cơ bản để Excel hiển thị đẹp hơn */
                table { border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 5px; }
            </style>
        </head>
        <body>
            <h1>Báo cáo Danh sách thanh toán</h1>
            ${tableHTML}
        </body>
        </html>
    `;
    
    // 4. Mã hóa chuỗi thành URI và tạo link tải xuống
    const uri = 'data:application/vnd.ms-excel;base64,';
    const base64 = (s) => window.btoa(unescape(encodeURIComponent(s)));
    
    const downloadLink = document.createElement('a');
    downloadLink.href = uri + base64(template);
    downloadLink.download = `${fileName}.xls`; 

    // 5. Kích hoạt tải xuống
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
}


// Hàm xác thực người dùng đã đăng nhập (ở cuối file)
setupAuthListeners(async (userId) => { 
    currentUserId = userId;
    initializeFirestoreReferences(userId);
    
    // ⭐ BƯỚC 1: Tải và Render Danh sách Thú Cưng ⭐
    await loadPetsFromFirebase(); 

    // ⭐ BƯỚC 2: Tải và Lưu Dữ Liệu Cần Thiết (KHÔNG điền Vaccine ở đây) ⭐
    try {
        // Tải và LƯU vào biến toàn cục (dogVaccinesList, catVaccinesList)
        dogVaccinesList = await fetchListItems('dog_vaccine');
        catVaccinesList = await fetchListItems('cat_vaccine');

        // Giữ các dòng log để xác nhận dữ liệu đã được tải
        console.log("Vaccine Chó đã tải:", dogVaccinesList);
        console.log("Vaccine Mèo đã tải:", catVaccinesList);
      
        // Tải danh sách bác sĩ (từ collection 'staff')
        const doctors = await fetchListItems('doctor');
        
        // ⭐ ĐÃ XÓA: KHÔNG CẦN LỌC/ĐIỀN VACCINE Ở ĐÂY NỮA ⭐
        // populateDropdown(vaccineNameSelect, allVaccines); // XÓA
        // populateDropdown(editVaccineNameSelect, allVaccines); // XÓA
        
        // --- LOGIC ĐIỀN DATALIST BÁC SĨ (Dùng biến toàn cục doctorAddInput/doctorEditInput) ---
        // Lưu ý: Đảm bảo doctorAddInput/doctorEditInput là biến LET toàn cục và đã được gán giá trị trong DOMContentLoaded
        
        // Tạo hoặc điền Datalist cho "Thêm mới"
        if (doctorAddInput) {
            let doctorDataListAdd = document.getElementById('doctor-list-add');
            if (!doctorDataListAdd) {
                 doctorDataListAdd = document.createElement('datalist');
                 doctorDataListAdd.id = 'doctor-list-add';
                 doctorAddInput.setAttribute('list', 'doctor-list-add');
                 document.body.appendChild(doctorDataListAdd);
            }
            populateDropdown(doctorDataListAdd, doctors);
        }

        // Tạo hoặc điền Datalist cho "Chỉnh sửa"
        if (doctorEditInput) {
            let doctorDataListEdit = document.getElementById('doctor-list-edit');
            if (!doctorDataListEdit) {
                 doctorDataListEdit = document.createElement('datalist');
                 doctorDataListEdit.id = 'doctor-list-edit';
                 doctorEditInput.setAttribute('list', 'doctor-list-edit');
                 document.body.appendChild(doctorDataListEdit);
            }
            populateDropdown(doctorDataListEdit, doctors);
        }

    } catch (e) {
        console.error("Lỗi khi tải dữ liệu dropdown/datalist:", e);
    }

    // ⭐ BƯỚC 3: Chạy Kiểm Tra Nhắc Nhở ⭐
    try {
        const reminders = await findUpcomingVaccinations(); 
        window.currentReminders = reminders; 
        
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
    } catch (e) {
        console.error("Lỗi khi tải nhắc nhở tiêm chủng lần đầu:", e);
    }

});

});
