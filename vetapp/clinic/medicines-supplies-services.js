import { db } from './firebase-config.js';
import { addDoc, onSnapshot, collection, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setupAuthListeners } from './auth-logic.js';

// Khai báo các phần tử DOM
const appContainer = document.getElementById('app-container');
const medicinesForm = document.getElementById('medicines-form');
const medicinesListDiv = document.getElementById('medicines-list');
const suppliesForm = document.getElementById('supplies-form');
const suppliesListDiv = document.getElementById('supplies-list');
const servicesForm = document.getElementById('services-form');
const servicesListDiv = document.getElementById('services-list');
const surgeriesForm = document.getElementById('surgeries-form');
const surgeriesListDiv = document.getElementById('surgeries-list');
const labtestsForm = document.getElementById('labtests-form');
const labtestsListDiv = document.getElementById('labtests-list');
const fasttestsForm = document.getElementById('fasttests-form');
const fasttestsListDiv = document.getElementById('fasttests-list');
const templatesForm = document.getElementById('templates-form');
const templatesListDiv = document.getElementById('templates-list');
const addTemplateItemBtn = document.getElementById('add-template-item');
const templatesItemsContainer = document.getElementById('templates-items-container');
const consultationsForm = document.getElementById('consultations-form');
const consultationsListDiv = document.getElementById('consultations-list');
const addConsultationItemBtn = document.getElementById('add-consultation-item');
const consultationsItemsContainer = document.getElementById('consultations-items-container');
const treatmentplanForm = document.getElementById('treatmentplan-form');
const treatmentplanItemsContainer = document.getElementById('treatmentplan-items-container');
const treatmentplansListDiv = document.getElementById('treatmentplans-list');
const addTreatmentplanBtn = document.getElementById('add-treatmentplan-item');
const drugItemsContainer = document.getElementById('drug-items-container');
const addDrugItemBtn = document.getElementById('add-drug-item');

let userId = null;
let allMedicines = [];

// =================== CÁC HÀM XỬ LÝ DỮ LIỆU CHÍNH =======================
function setupFirestoreListeners(currentUserId) {
    // Chỉ thiết lập các listeners khi đã có userId
    if (!currentUserId) return;
    userId = currentUserId;

    // Lắng nghe sự kiện thay đổi dữ liệu trong collection Thuốc
    onSnapshot(collection(db, `users/${userId}/private/data/medicines`), (snapshot) => {
        allMedicines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('medicines', allMedicines);
    });

    // Lắng nghe các collection khác
    onSnapshot(collection(db, `users/${userId}/private/data/supplies`), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('supplies', items);
    });

    onSnapshot(collection(db, `users/${userId}/private/data/services`), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('services', items);
    });

    onSnapshot(collection(db, `users/${userId}/private/data/surgeries`), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('surgeries', items);
    });
    
    onSnapshot(collection(db, `users/${userId}/private/data/labtests`), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('labtests', items);
    });
    
    onSnapshot(collection(db, `users/${userId}/private/data/fasttests`), (snapshot) => {
        const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('fasttests', items);
    });

    onSnapshot(collection(db, `users/${userId}/private/data/templates`), (snapshot) => {
        const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTemplates(templates);
    });

    onSnapshot(collection(db, `users/${userId}/private/data/consultations`), (snapshot) => {
        const consultations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderConsultations(consultations);
    });

    onSnapshot(collection(db, `users/${userId}/private/data/treatmentplans`), (snapshot) => {
        const plans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTreatmentPlans(plans);
    });
}

// Gọi hàm setupAuthListeners để bắt đầu kiểm tra trạng thái đăng nhập
setupAuthListeners(setupFirestoreListeners);

// ... (các hàm xử lý giao diện và logic khác không thay đổi)
// Hàm tạo giao diện card cho từng mục (item)
function createItemCard(docId, data, type) {
    const card = document.createElement('div');
    card.className = 'item-card p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center';
    
    let contentHtml = '';
    
    switch (type) {
        case 'medicines':
            contentHtml = `
                <div>
                    <h3 class="font-semibold text-blue-600">${data.name}</h3>
                    <p class="text-sm text-gray-600"><strong>Đơn vị:</strong> ${data.unit}</p>
                    <p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p>
                    <p class="text-sm text-gray-600"><strong>Cách dùng:</strong> ${data.usage || 'Chưa có'}</p>
                </div>
            `;
            break;
        case 'supplies':
            contentHtml = `
                <div>
                    <h3 class="font-semibold text-emerald-600">${data.name}</h3>
                    <p class="text-sm text-gray-600"><strong>Đơn vị:</strong> ${data.unit}</p>
                    <p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p>
                </div>
            `;
            break;
        case 'services':
            contentHtml = `
                <div>
                    <h3 class="font-semibold text-violet-600">${data.name}</h3>
                    <p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p>
                </div>
            `;
            break;
        case 'surgeries':
            contentHtml = `
                <div>
                    <h3 class="font-semibold text-orange-600">${data.name}</h3>
                    <p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p>
                </div>
            `;
            break;
        case 'labtests':
            contentHtml = `
                <div>
                    <h3 class="font-semibold text-red-600">${data.name}</h3>
                    <p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p>
                </div>
            `;
            break;
        case 'fasttests':
            contentHtml = `
                <div>
                    <h3 class="font-semibold text-amber-600">${data.name}</h3>
                    <p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p>
                    <p class="text-sm text-gray-600"><strong>Loại test nhanh:</strong> ${data['item-fasttests-type'] || 'Chưa có'}</p>
                </div>
            `;
            break;
    }

    const buttonHtml = `
        <div class="flex space-x-2">
            <button type="button" class="edit-btn text-blue-500 hover:text-blue-700 transition" data-id="${docId}" data-type="${type}">
                <i class="fas fa-edit"></i>
            </button>
            <button type="button" class="delete-btn text-red-500 hover:text-red-700 transition" data-id="${docId}" data-type="${type}">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;

    card.innerHTML = contentHtml + buttonHtml;
    return card;
}

// Hàm render danh sách mục
function renderItems(type, items) {
    const listDiv = document.getElementById(`${type}-list`);
    listDiv.innerHTML = '';
    if (items.length === 0) {
        listDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có dữ liệu nào được lưu.</p>';
        return;
    }
    items.forEach(item => {
        const itemCard = createItemCard(item.id, item, type);
        listDiv.appendChild(itemCard);
    });
}

// Hàm render danh sách toa thuốc mẫu (MỚI)
function renderTemplates(templates) {
    templatesListDiv.innerHTML = '';
    if (templates.length === 0) {
        templatesListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có toa thuốc mẫu nào được lưu.</p>';
        return;
    }
    templates.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card p-4 bg-gray-50 rounded-lg shadow-sm mb-2';
        card.innerHTML = `
            <h3 class="font-semibold text-lg text-blue-600">${template.name}</h3>
            <ul class="list-disc list-inside mt-2 text-sm text-gray-600">
                ${(template.medicines || []).map(item => `<li>${item.drugname} - ${item.drugdosage} ${item.drugdosageunit}</li>`).join('')}
            </ul>
            <div class="mt-2 text-sm text-gray-600">
                <p><strong>Liệu trình:</strong> ${template.regimen || 'Chưa có'} ${template.itemRegimenUnit || ''}</p>
                <p><strong>Lưu ý:</strong> ${template.note || 'Chưa có'}</p>
            </div>
            <div class="flex justify-end space-x-2 mt-4">
                <button type="button" class="edit-template-btn text-blue-500 hover:text-blue-700 transition" data-id="${template.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-template-btn text-red-500 hover:text-red-700 transition" data-id="${template.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        templatesListDiv.appendChild(card);
    });
}

// Hàm render danh sách tư vấn
function renderConsultations(consultations) {
    consultationsListDiv.innerHTML = '';
    if (consultations.length === 0) {
        consultationsListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có nhóm tư vấn nào được lưu.</p>';
        return;
    }
    consultations.forEach(consultation => {
        const card = document.createElement('div');
        card.className = 'consultation-card p-4 bg-gray-50 rounded-lg shadow-sm mb-2';
        card.innerHTML = `
            <h3 class="font-semibold text-lg text-blue-600">${consultation.name}</h3>
            <ul class="list-disc list-inside mt-2 text-sm text-gray-600">
                ${(consultation.items || []).map(item => `<li>${item.content}</li>`).join('')}
            </ul>
            <div class="flex justify-end space-x-2 mt-4">
                <button type="button" class="edit-consultation-btn text-blue-500 hover:text-blue-700 transition" data-id="${consultation.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-consultation-btn text-red-500 hover:text-red-700 transition" data-id="${consultation.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        consultationsListDiv.appendChild(card);
    });
}

//========================= LOGIC TOA THUỐC MẪU (BỔ SUNG) =========================//

// Hàm tạo option cho menu thả xuống từ danh sách thuốc
function createMedicineOptions(selectedId = null) {
    let optionsHtml = '<option value="">-- Chọn thuốc --</option>';
    allMedicines.forEach(med => {
        const isSelected = selectedId === med.id ? 'selected' : '';
        optionsHtml += `<option value="${med.id}" ${isSelected}>${med.name}</option>`;
    });
    return optionsHtml;
}

// Hàm thêm trường nhập liệu cho Toa thuốc mẫu
function addTemplateItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex space-x-2 mb-2 items-end';
    
    // Tạo menu thả xuống từ danh sách thuốc
    const select = document.createElement('select');
    select.className = 'template-item-select px-3 py-2 border rounded-md flex-1';
    select.innerHTML = createMedicineOptions(item ? item.drugId : null);
    select.addEventListener('change', (e) => {
        const selectedMedId = e.target.value;
        const selectedMed = allMedicines.find(med => med.id === selectedMedId);

        const dosageInput = itemDiv.querySelector('.template-item-dosage');
        const unitInput = itemDiv.querySelector('.template-item-unit');
        
        if (selectedMed) {
            dosageInput.value = selectedMed.itemDosage ?? '';
            unitInput.value = selectedMed.itemDosageUnit ?? '';
        } else {
            dosageInput.value = '';
            unitInput.value = '';
        }
    });

    const dosageInput = document.createElement('input');
    dosageInput.type = 'number';
    dosageInput.step = 'any';
    dosageInput.placeholder = 'Liều lượng cho 1kg';
    dosageInput.className = 'template-item-dosage px-3 py-2 border rounded-md w-50';
    dosageInput.value = item ? item.drugdosage : '';

    const unitInput = document.createElement('input');
    unitInput.type = 'text';
    unitInput.placeholder = 'Đơn vị liều lượng';
    unitInput.className = 'template-item-unit px-3 py-2 border rounded-md w-30';
    unitInput.readOnly = true;
    unitInput.value = item ? item.drugdosageunit : '';

    const removeBtn = document.createElement('button');
    removeBtn.type = 'button';
    removeBtn.className = 'remove-item-btn text-red-500 hover:text-red-700';
    removeBtn.innerHTML = '<i class="fas fa-times-circle"></i>';
    removeBtn.addEventListener('click', () => {
        itemDiv.remove();
    });

    itemDiv.appendChild(select);
    itemDiv.appendChild(dosageInput);
    itemDiv.appendChild(unitInput);
    itemDiv.appendChild(removeBtn);
    templatesItemsContainer.appendChild(itemDiv);
}

// Xử lý nút "Thêm" cho toa thuốc mẫu
addTemplateItemBtn.addEventListener('click', () => addTemplateItem());

// Chỉnh sửa Toa thuốc mẫu (MỚI)
document.addEventListener('click', async (e) => {
    if (e.target.closest('.edit-template-btn')) {
        const docId = e.target.closest('.edit-template-btn').dataset.id;
        const form = templatesForm;
        try {
            const docRef = doc(db, `users/${userId}/private/data/templates`, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector('#templates-docId').value = docId;
                form.querySelector('#templates-name').value = data.name;

                templatesForm.querySelector('#templates-regimen').value = data.regimen || '';
                templatesForm.querySelector('#templates-regimen-unit').value = data.itemRegimenUnit || '';
                templatesForm.querySelector('#templates-note').value = data.note || '';

                templatesItemsContainer.innerHTML = '';
                (data.medicines || []).forEach(item => {
                    addTemplateItem(item);
                });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa toa thuốc mẫu.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy toa thuốc mẫu: ", error);
        }
    }
});

// Hàm thêm trường nhập liệu cho Tư vấn & Dặn dò
function addConsultationItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex space-x-2 mb-2';
    itemDiv.innerHTML = `
        <input type="text" placeholder="Nội dung tư vấn/dặn dò" value="${item ? item.content : ''}" class="consultation-item-content px-3 py-2 border rounded-md flex-1">
        <button type="button" class="remove-item-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button>
    `;
    consultationsItemsContainer.appendChild(itemDiv);
    itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
        itemDiv.remove();
    });
}
// Xử lý nút "Thêm" cho nhóm tư vấn
addConsultationItemBtn.addEventListener('click', addConsultationItem);

//========================= LOGIC MỚI CHO KẾ HOẠCH ĐIỀU TRỊ =========================//
// Hàm tạo HTML cho một mục kế hoạch chi tiết mới
function createTreatmentplanItemHtml(item = null) {
    return `
    <div class="flex space-x-2 mb-2">
        <input type="text" placeholder="Kế hoạch chi tiết" value="${item?.content || ''}" class="treatmentplan-item-content px-3 py-2 border rounded-md flex-1">
        <button type="button" class="remove-item-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button>
    </div>
    `;
}

// Hàm thêm một mục kế hoạch chi tiết mới
function addTreatmentplanItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = createTreatmentplanItemHtml(item);
    treatmentplanItemsContainer.appendChild(itemDiv.firstElementChild);
}

// Xử lý nút "Thêm kế hoạch"
document.getElementById('add-treatmentplan-item').addEventListener('click', () => {
    addTreatmentplanItem();
});

// Lắng nghe sự kiện click trên container để xử lý nút xóa
document.getElementById('treatmentplan-items-container').addEventListener('click', (e) => {
    if (e.target.closest('.remove-item-btn')) {
        e.target.closest('.flex.space-x-2').remove();
    }
});

// Hàm tạo HTML cho một mục thuốc
function createDrugItemHtml(drug = null) {
    return `
    <div class="flex flex-wrap space-y-4 md:space-y-0 md:flex-row md:space-x-5 mb-2 items-end">
        <div class="w-full md:flex-1">
            <label class="block text-sm font-medium text-gray-700">Tên thuốc</label>
            <input type="text" placeholder="Tên thuốc" value="${drug?.name || ''}" class="drug-item-name px-3 py-2 border rounded-md w-full">
        </div>
        <div class="w-full md:flex-1 flex items-end space-x-2">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Liều dùng</label>
                <input type="number" step="any" placeholder="Liều dùng" value="${drug?.dosage || ''}" class="drug-item-dosage px-3 py-2 border rounded-md w-full">
            </div>
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Đơn vị liều</label>
                <select class="drug-item-unit px-3 py-2 border rounded-md w-full">
                    <option value="mg/kg" ${drug?.unit === 'mg/kg' ? 'selected' : ''}>mg/kg</option>
                    <option value="ml/kg" ${drug?.unit === 'ml/kg' ? 'selected' : ''}>ml/kg</option>
                </select>
            </div>
        </div>
        <div class="w-full md:flex-1">
            <label class="block text-sm font-medium text-gray-700">Cách dùng</label>
            <select class="drug-item-usage px-3 py-2 border rounded-md w-full">
                <option value="PO" ${drug?.usage === 'PO' ? 'selected' : ''}>PO</option>
                <option value="IV" ${drug?.usage === 'IV' ? 'selected' : ''}>IV</option>
                <option value="IV chậm" ${drug?.usage === 'IV chậm' ? 'selected' : ''}>IV chậm</option>
                <option value="IM" ${drug?.usage === 'IM' ? 'selected' : ''}>IM</option>
                <option value="SC" ${drug?.usage === 'SC' ? 'selected' : ''}>SC</option>
            </select>
        </div>
        <div class="w-full md:flex-1 flex items-end space-x-2">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Thời gian liều</label>
                <input type="number" placeholder="Thời gian của liều" value="${drug?.interval || ''}" class="drug-item-interval px-3 py-2 border rounded-md w-full">
            </div>
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Đơn vị</label>
                <select class="drug-item-interval-unit px-3 py-2 border rounded-md w-full">
                    <option value="giờ" ${drug?.intervalUnit === 'giờ' ? 'selected' : ''}>giờ</option>
                    <option value="phút" ${drug?.intervalUnit === 'phút' ? 'selected' : ''}>phút</option>
                    <option value="ngày" ${drug?.intervalUnit === 'ngày' ? 'selected' : ''}>ngày</option>
                </select>
            </div>
        </div>
        <div class="w-full md:flex-1 flex items-end space-x-2">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Thời gian dùng</label>
                <input type="number" placeholder="Thời gian dùng thuốc" value="${drug?.duration || ''}" class="drug-item-duration px-3 py-2 border rounded-md w-full">
            </div>
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Đơn vị</label>
                <select class="drug-item-duration-unit px-3 py-2 border rounded-md w-full">
                    <option value="ngày" ${drug?.durationUnit === 'ngày' ? 'selected' : ''}>ngày</option>
                    <option value="tuần" ${drug?.durationUnit === 'tuần' ? 'selected' : ''}>tuần</option>
                </select>
            </div>
        </div>
        <div class="w-full md:w-auto mt-2 md:mt-0">
            <button type="button" class="remove-item-btn text-red-500 hover:text-red-700">
                <i class="fas fa-times-circle"></i>
            </button>
        </div>
    </div>
    `;
}

// Hàm thêm một mục thuốc mới
function addDrugItem(drug = null) {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = createDrugItemHtml(drug);
    drugItemsContainer.appendChild(itemDiv.firstElementChild);
}

// Xử lý nút "Thêm thuốc"
addDrugItemBtn.addEventListener('click', () => {
    addDrugItem();
});

// Lắng nghe sự kiện click trên container để xử lý nút xóa
drugItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-item-btn')) {
        e.target.closest('.flex.flex-wrap').remove();
    }
});

// Hàm render danh sách kế hoạch điều trị
function renderTreatmentPlans(plans) {
    treatmentplansListDiv.innerHTML = '';
    if (plans.length === 0) {
        treatmentplansListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có kế hoạch điều trị nào được lưu.</p>';
        return;
    }
    plans.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'treatmentplan-card p-4 bg-gray-50 rounded-lg shadow-sm mb-2';
        // Tạo HTML cho danh sách kế hoạch chi tiết
        const itemsHtml = (plan.items || []).map(item => ` <li>${item.content}</li> `).join('');
        // Tạo HTML cho danh sách thuốc
        const drugsHtml = (plan.drugs || []).map(drug => ` <li>${drug.name}: Liều dùng ${drug.dosage} ${drug.unit}, ${drug.usage}, mỗi ${drug.interval} ${drug.intervalUnit} trong ${drug.duration} ${drug.durationUnit}</li> `).join('');
        card.innerHTML = `
            <h3 class="font-semibold text-lg text-blue-600">${plan.name}</h3>
            ${(plan.items && plan.items.length > 0) ? `
                <p class="font-semibold mt-2 text-sm text-gray-700">Kế hoạch chi tiết:</p>
                <ul class="list-disc list-inside mt-1 text-sm text-gray-600">
                    ${itemsHtml}
                </ul>
            ` : ''}
            ${(plan.drugs && plan.drugs.length > 0) ? `
                <p class="font-semibold mt-2 text-sm text-gray-700">Chi tiết dùng thuốc:</p>
                <ul class="list-disc list-inside mt-1 text-sm text-gray-600">
                    ${drugsHtml}
                </ul>
            ` : ''}
            ${plan.note ? `<p class="mt-2 text-sm text-gray-500"><strong>Lưu ý:</strong> ${plan.note}</p>` : ''}
            <div class="flex justify-end space-x-2 mt-4">
                <button type="button" class="edit-treatmentplan-btn text-blue-500 hover:text-blue-700 transition" data-id="${plan.id}">
                    <i class="fas fa-edit"></i>
                </button>
                <button type="button" class="delete-treatmentplan-btn text-red-500 hover:text-red-700 transition" data-id="${plan.id}">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        treatmentplansListDiv.appendChild(card);
    });
}

// Xử lý form để lưu dữ liệu vào Firestore cho mục: Kế hoạch điều trị
treatmentplanForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!userId) {
        alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước.");
        return;
    }
    const form = e.target;
    const docId = form.querySelector('#treatmentplan-docId').value;
    // Lấy thông tin chung
    const name = form.querySelector('#treatmentplan-name').value;
    const note = form.querySelector('#treatmentplan-note').value;
    // Lấy thông tin chi tiết các loại thuốc
    const drugItems = drugItemsContainer.querySelectorAll('.flex.flex-wrap');
    const drugs = [];
    drugItems.forEach(item => {
        const drug = {
            name: item.querySelector('.drug-item-name').value,
            dosage: parseFloat(item.querySelector('.drug-item-dosage').value) || 0,
            unit: item.querySelector('.drug-item-unit').value,
            usage: item.querySelector('.drug-item-usage').value,
            interval: parseFloat(item.querySelector('.drug-item-interval').value) || 0,
            intervalUnit: item.querySelector('.drug-item-interval-unit').value,
            duration: parseFloat(item.querySelector('.drug-item-duration').value) || 0,
            durationUnit: item.querySelector('.drug-item-duration-unit').value,
        };
        drugs.push(drug);
    });
    // BỔ SUNG: Lấy thông tin từ các mục kế hoạch chi tiết
    const treatmentplanItemElements = treatmentplanItemsContainer.querySelectorAll('.treatmentplan-item-content');
    const items = [];
    treatmentplanItemElements.forEach(element => {
        items.push({ content: element.value });
    });
    // Cập nhật đối tượng data để lưu cả hai mảng: drugs và items
    const data = { name, items, drugs, note };
    try {
        const collectionPath = `users/${userId}/private/data/treatmentplans`;
        if (docId) { // Cập nhật
            const docRef = doc(db, collectionPath, docId);
            await updateDoc(docRef, data);
            alert("Cập nhật kế hoạch điều trị thành công!");
        } else { // Thêm mới
            await addDoc(collection(db, collectionPath), data);
            alert("Lưu kế hoạch điều trị thành công!");
        }
        form.reset();
        form.querySelector('#treatmentplan-docId').value = '';
        drugItemsContainer.innerHTML = '';
        addDrugItem();
        // Xóa nội dung kế hoạch chi tiết sau khi lưu
        treatmentplanItemsContainer.innerHTML = '';
        addTreatmentplanItem();
        form.querySelector('.cancel-btn').classList.add('hidden');
    } catch (e) {
        console.error("Lỗi khi thêm/cập nhật kế hoạch điều trị: ", e);
        alert("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
    }
});
// Thêm logic chung để xử lý form submissions
const formHandlers = {
    'medicines-form': 'medicines',
    'supplies-form': 'supplies',
    'services-form': 'services',
    'surgeries-form': 'surgeries',
    'labtests-form': 'labtests',
    'fasttests-form': 'fasttests',
    'consultations-form': 'consultations',
    'templates-form': 'templates',
};

Object.entries(formHandlers).forEach(([formId, type]) => {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!userId) {
                alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước.");
                return;
            }
            const docId = form.querySelector(`input[id$="-docId"]`).value;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            // Xử lý các trường dữ liệu đặc biệt
            if (type === 'templates') {
                const medicines = [];
                const itemDivs = templatesItemsContainer.querySelectorAll('.flex.space-x-2');
                itemDivs.forEach(div => {
                    const select = div.querySelector('.template-item-select');
                    const dosageInput = div.querySelector('.template-item-dosage');
                    const unitInput = div.querySelector('.template-item-unit');
                    if (select && select.value) {
                        const selectedMed = allMedicines.find(med => med.id === select.value);
                        medicines.push({
                            drugId: select.value,
                            drugname: selectedMed ? selectedMed.name : '',
                            drugdosage: dosageInput.value,
                            drugdosageunit: unitInput.value
                        });
                    }
                });
                data.medicines = medicines;
            }

            if (type === 'consultations') {
                const items = [];
                const itemElements = consultationsItemsContainer.querySelectorAll('.consultation-item-content');
                itemElements.forEach(element => {
                    if (element.value) {
                        items.push({ content: element.value });
                    }
                });
                data.items = items;
            }

            try {
                const collectionPath = `users/${userId}/private/data/${type}`;
                if (docId) {
                    const docRef = doc(db, collectionPath, docId);
                    await updateDoc(docRef, data);
                    alert(`Cập nhật ${type} thành công!`);
                } else {
                    await addDoc(collection(db, collectionPath), data);
                    alert(`Lưu ${type} thành công!`);
                }
                form.reset();
                form.querySelector(`input[id$="-docId"]`).value = '';
                if (type === 'consultations') {
                    consultationsItemsContainer.innerHTML = '';
                    addConsultationItem();
                }
                if (type === 'templates') {
                    templatesItemsContainer.innerHTML = '';
                    addTemplateItem();
                }
                form.querySelector('.cancel-btn').classList.add('hidden');
            } catch (e) {
                console.error("Lỗi khi thêm/cập nhật dữ liệu: ", e);
                alert("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
            }
        });

        // Xử lý nút Hủy
        const cancelButton = form.querySelector('.cancel-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                form.reset();
                form.querySelector(`input[id$="-docId"]`).value = '';
                cancelButton.classList.add('hidden');
                if (type === 'templates') {
                    templatesItemsContainer.innerHTML = '';
                    addTemplateItem();
                }
                if (type === 'consultations') {
                    consultationsItemsContainer.innerHTML = '';
                    addConsultationItem();
                }
                if (type === 'treatmentplans') {
                    treatmentplanItemsContainer.innerHTML = '';
                    addTreatmentplanItem();
                    drugItemsContainer.innerHTML = '';
                    addDrugItem();
                }
                alert("Đã hủy bỏ chỉnh sửa.");
            });
        }
    }
});


// Thêm logic chung để xử lý các nút chỉnh sửa và xóa
document.addEventListener('click', async (e) => {
    if (!userId) {
        alert("Bạn chưa đăng nhập.");
        return;
    }

    // Chỉnh sửa các mục
    if (e.target.closest('.edit-btn')) {
        const btn = e.target.closest('.edit-btn');
        const docId = btn.dataset.id;
        const type = btn.dataset.type;
        const form = document.getElementById(`${type}-form`);
        try {
            const docRef = doc(db, `users/${userId}/private/data/${type}`, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector(`input[id$="-docId"]`).value = docId;
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert(`Đang chỉnh sửa ${type}.`);
            }
        } catch (error) {
            console.error(`Lỗi khi lấy dữ liệu ${type}: `, error);
        }
    }
    
    // Xóa các mục
    if (e.target.closest('.delete-btn')) {
        const btn = e.target.closest('.delete-btn');
        const docId = btn.dataset.id;
        const type = btn.dataset.type;
        if (confirm(`Bạn có chắc chắn muốn xóa ${type} này?`)) {
            try {
                await deleteDoc(doc(db, `users/${userId}/private/data/${type}`, docId));
                alert(`Xóa ${type} thành công!`);
            } catch (error) {
                console.error(`Lỗi khi xóa ${type}: `, error);
            }
        }
    }

    // Chỉnh sửa Kế hoạch điều trị
    if (e.target.closest('.edit-treatmentplan-btn')) {
        const docId = e.target.closest('.edit-treatmentplan-btn').dataset.id;
        const form = treatmentplanForm;
        try {
            const docRef = doc(db, `users/${userId}/private/data/treatmentplans`, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector('#treatmentplan-docId').value = docId;
                form.querySelector('#treatmentplan-name').value = data.name;
                form.querySelector('#treatmentplan-note').value = data.note || '';

                treatmentplanItemsContainer.innerHTML = '';
                (data.items || []).forEach(item => {
                    addTreatmentplanItem(item);
                });

                drugItemsContainer.innerHTML = '';
                (data.drugs || []).forEach(drug => {
                    addDrugItem(drug);
                });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa kế hoạch điều trị.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy kế hoạch điều trị: ", error);
        }
    }

    // Xóa Kế hoạch điều trị
    if (e.target.closest('.delete-treatmentplan-btn')) {
        const docId = e.target.closest('.delete-treatmentplan-btn').dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa kế hoạch điều trị này?")) {
            try {
                await deleteDoc(doc(db, `users/${userId}/private/data/treatmentplans`, docId));
                alert("Xóa kế hoạch điều trị thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa kế hoạch điều trị: ", error);
            }
        }
    }

    // Chỉnh sửa Nhóm tư vấn
    if (e.target.closest('.edit-consultation-btn')) {
        const docId = e.target.closest('.edit-consultation-btn').dataset.id;
        const form = consultationsForm;
        try {
            const docRef = doc(db, `users/${userId}/private/data/consultations`, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector('#consultations-docId').value = docId;
                form.querySelector('#consultations-name').value = data.name;
                consultationsItemsContainer.innerHTML = '';
                (data.items || []).forEach(item => {
                    addConsultationItem(item);
                });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa nhóm tư vấn.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy nhóm tư vấn: ", error);
        }
    }
    
    // Xóa Nhóm tư vấn
    if (e.target.closest('.delete-consultation-btn')) {
        const docId = e.target.closest('.delete-consultation-btn').dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa nhóm tư vấn này?")) {
            try {
                await deleteDoc(doc(db, `users/${userId}/private/data/consultations`, docId));
                alert("Xóa nhóm tư vấn thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa nhóm tư vấn: ", error);
            }
        }
    }
});

// Thêm logic xử lý các phần có thể thu gọn/mở rộng (collapsible sections)
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');

        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
    });
});