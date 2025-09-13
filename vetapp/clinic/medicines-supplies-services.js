//======================================================================
//                        1. KHAI BÁO CHUNG
//======================================================================
import { db } from './firebase-config.js';
import { addDoc, onSnapshot, collection, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { setupAuthListeners } from './auth-logic.js';

// Khai báo các phần tử DOM
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

//======================================================================
//                 2. HÀM CHUNG & XỬ LÝ DỮ LIỆU FIREBASE
//======================================================================

/**
 * Hàm chờ danh sách thuốc được nạp đầy đủ.
 * @returns {Promise<void>}
 */
const waitForMedicines = () => {
    return new Promise(resolve => {
        const check = () => {
            if (allMedicines.length > 0) {
                resolve();
            } else {
                setTimeout(check, 50);
            }
        };
        check();
    });
};

/**
 * Thiết lập các listeners để lắng nghe dữ liệu từ Firestore.
 * @param {string} currentUserId
 */
function setupFirestoreListeners(currentUserId) {
    if (!currentUserId) return;
    userId = currentUserId;

    // Lắng nghe sự kiện thay đổi dữ liệu trong collection Thuốc
    onSnapshot(collection(db, `users/${userId}/private/data/medicines`), (snapshot) => {
        allMedicines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        console.log("Danh sách thuốc đã được cập nhật:", allMedicines);
        renderItems('medicines', allMedicines);
    });

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
setupAuthListeners(setupFirestoreListeners);

/**
 * Hàm tạo giao diện card cho từng mục (Thuốc, Vật tư, Dịch vụ...).
 * @param {string} docId
 * @param {object} data
 * @param {string} type
 * @returns {HTMLElement}
 */
function createItemCard(docId, data, type) {
    const card = document.createElement('div');
    card.className = 'item-card p-4 bg-gray-50 rounded-lg shadow-sm flex justify-between items-center';
    
    let contentHtml = '';
    switch (type) {
        case 'medicines':
            contentHtml = `<div><h3 class="font-semibold text-blue-600">${data.name}</h3><p class="text-sm text-gray-600"><strong>Loại:</strong> ${data.type || 'Chưa có'}</p><p class="text-sm text-gray-600"><strong>Đơn vị:</strong> ${data.unit}</p><p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p><p class="text-sm text-gray-600"><strong>Cách dùng:</strong> ${data.usage || 'Chưa có'}</p></div>`;
            break;
        case 'supplies':
            contentHtml = `<div><h3 class="font-semibold text-emerald-600">${data.name}</h3><p class="text-sm text-gray-600"><strong>Đơn vị:</strong> ${data.unit}</p><p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p></div>`;
            break;
        case 'services':
            contentHtml = `<div><h3 class="font-semibold text-violet-600">${data.name}</h3><p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p></div>`;
            break;
        case 'surgeries':
            contentHtml = `<div><h3 class="font-semibold text-orange-600">${data.name}</h3><p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p></div>`;
            break;
        case 'labtests':
            contentHtml = `<div><h3 class="font-semibold text-red-600">${data.name}</h3><p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p></div>`;
            break;
        case 'fasttests':
            contentHtml = `<div><h3 class="font-semibold text-amber-600">${data.name}</h3><p class="text-sm text-gray-600"><strong>Giá:</strong> ${data.price.toLocaleString()} VND</p><p class="text-sm text-gray-600"><strong>Loại test nhanh:</strong> ${data['item-fasttests-type'] || 'Chưa có'}</p></div>`;
            break;
    }
    const buttonHtml = `<div class="flex space-x-2"><button type="button" class="edit-btn text-blue-500 hover:text-blue-700 transition" data-id="${docId}" data-type="${type}"><i class="fas fa-edit"></i></button><button type="button" class="delete-btn text-red-500 hover:text-red-700 transition" data-id="${docId}" data-type="${type}"><i class="fas fa-trash-alt"></i></button></div>`;
    card.innerHTML = contentHtml + buttonHtml;
    return card;
}

/**
 * Hàm render danh sách mục vào giao diện.
 * @param {string} type
 * @param {Array<object>} items
 */
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

//======================================================================
//                3. QUẢN LÝ THUỐC & VẬT TƯ Y TẾ
//======================================================================

// Đã tích hợp vào phần "Xử lý sự kiện chung" ở cuối file để giảm code lặp lại.

//======================================================================
//              4. QUẢN LÝ DỊCH VỤ & PHẪU THUẬT
//======================================================================

// Đã tích hợp vào phần "Xử lý sự kiện chung" ở cuối file để giảm code lặp lại.

//======================================================================
//                    5. QUẢN LÝ XÉT NGHIỆM
//======================================================================

// Đã tích hợp vào phần "Xử lý sự kiện chung" ở cuối file để giảm code lặp lại.

//======================================================================
//                  6. QUẢN LÝ TOA THUỐC MẪU
//======================================================================

/**
 * Hàm tạo option cho menu thả xuống từ danh sách thuốc.
 * @param {string|null} selectedId
 * @returns {string}
 */
function createMedicineOptions(selectedId = null) {
    let optionsHtml = '<option value="">-- Chọn thuốc --</option>';
    allMedicines.forEach(med => {
        const isSelected = selectedId === med.id ? 'selected' : '';
        optionsHtml += `<option value="${med.id}" ${isSelected}>${med.name}</option>`;
    });
    return optionsHtml;
}

/**
 * Hàm thêm trường nhập liệu cho Toa thuốc mẫu.
 * @param {object|null} item
 */
function addTemplateItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex space-x-2 mb-2 items-end';
    const select = document.createElement('select');
    select.className = 'template-item-select px-3 py-2 border rounded-md flex-1';
    // Chọn tên item.drugId để khớp với dữ liệu từ Firestore
    select.innerHTML = createMedicineOptions(item ? item.drugId : null);
    
    select.addEventListener('change', (e) => {
        const selectedMed = allMedicines.find(med => med.id === e.target.value);
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
    removeBtn.addEventListener('click', () => { itemDiv.remove(); });

    itemDiv.appendChild(select);
    itemDiv.appendChild(dosageInput);
    itemDiv.appendChild(unitInput);
    itemDiv.appendChild(removeBtn);
    templatesItemsContainer.appendChild(itemDiv);
}

/**
 * Render danh sách toa thuốc mẫu.
 * @param {Array<object>} templates
 */
function renderTemplates(templates) {
    templatesListDiv.innerHTML = '';
    if (templates.length === 0) {
        templatesListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có toa thuốc mẫu nào được lưu.</p>';
        return;
    }
    templates.forEach(template => {
        const card = document.createElement('div');
        card.className = 'template-card p-4 bg-gray-50 rounded-lg shadow-sm mb-2';
        card.innerHTML = `<h3 class="font-semibold text-lg text-blue-600">${template.name}</h3><ul class="list-disc list-inside mt-2 text-sm text-gray-600">${(template.medicines || []).map(item => `<li>${item.drugname} - ${item.drugdosage} ${item.drugdosageunit}</li>`).join('')}</ul><div class="mt-2 text-sm text-gray-600"><p><strong>Liệu trình:</strong> ${template.regimen || 'Chưa có'} ${template.itemRegimenUnit || ''}</p><p><strong>Lưu ý:</strong> ${template.note || 'Chưa có'}</p></div><div class="flex justify-end space-x-2 mt-4"><button type="button" class="edit-template-btn text-blue-500 hover:text-blue-700 transition" data-id="${template.id}"><i class="fas fa-edit"></i></button><button type="button" class="delete-template-btn text-red-500 hover:text-red-700 transition" data-id="${template.id}"><i class="fas fa-trash-alt"></i></button></div>`;
        templatesListDiv.appendChild(card);
    });
}

addTemplateItemBtn.addEventListener('click', () => addTemplateItem());

//======================================================================
//                7. QUẢN LÝ KẾ HOẠCH ĐIỀU TRỊ
//======================================================================

/**
 * Hàm tạo HTML cho một mục kế hoạch chi tiết mới.
 * @param {object|null} item
 * @returns {string}
 */
function createTreatmentplanItemHtml(item = null) {
    return `<div class="flex space-x-2 mb-2"><input type="text" placeholder="Kế hoạch chi tiết" value="${item?.content || ''}" class="treatmentplan-item-content px-3 py-2 border rounded-md flex-1"><button type="button" class="remove-item-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button></div>`;
}

/**
 * Hàm thêm một mục kế hoạch chi tiết mới.
 * @param {object|null} item
 */
function addTreatmentplanItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.innerHTML = createTreatmentplanItemHtml(item);
    treatmentplanItemsContainer.appendChild(itemDiv.firstElementChild);
}

/**
 * Hàm tạo HTML cho một mục thuốc trong kế hoạch điều trị.
 * @param {object|null} drug
 * @returns {HTMLElement}
 */
function createDrugItemHtml(drug = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex flex-wrap space-y-4 md:space-y-0 md:flex-row md:space-x-5 mb-2 items-end';
    const nameDiv = document.createElement('div');
    nameDiv.className = 'w-full md:flex-1';
    nameDiv.innerHTML = `<label class="block text-sm font-medium text-gray-700">Tên thuốc</label>`;
    const select = document.createElement('select');
    select.className = 'drug-item-select px-3 py-2 border rounded-md w-full';
    // Đã sửa code để cả drug.drugId và drug.id từ Firestore đều được đọc đúng tên thuốc
    const selectedId = drug?.id || drug?.drugId;
    select.innerHTML = createMedicineOptions(selectedId);
    nameDiv.appendChild(select);

    const dosageDiv = document.createElement('div');
    dosageDiv.className = 'w-full md:flex-1 flex items-end space-x-2';
    dosageDiv.innerHTML = `<div class="flex-1"><label class="block text-sm font-medium text-gray-700">Liều dùng</label><input type="number" step="any" placeholder="Liều dùng" value="${drug?.dosage || ''}" class="drug-item-dosage px-3 py-2 border rounded-md w-full"></div><div class="flex-1"><label class="block text-sm font-medium text-gray-700">Đơn vị liều</label><select class="drug-item-unit px-3 py-2 border rounded-md w-full"><option value="mg/kg" ${drug?.unit === 'mg/kg' ? 'selected' : ''}>mg/kg</option><option value="ml/kg" ${drug?.unit === 'ml/kg' ? 'selected' : ''}>ml/kg</option><option value="viên/kg" ${drug?.unit === 'viên/kg' ? 'selected' : ''}>viên/kg</option></select></div>`;

    const usageDiv = document.createElement('div');
    usageDiv.className = 'w-full md:flex-1';
    usageDiv.innerHTML = `<label class="block text-sm font-medium text-gray-700">Cách dùng</label><select class="drug-item-usage px-3 py-2 border rounded-md w-full"><option value="PO" ${drug?.usage === 'PO' ? 'selected' : ''}>PO</option><option value="IV" ${drug?.usage === 'IV' ? 'selected' : ''}>IV</option><option value="IV chậm" ${drug?.usage === 'IV chậm' ? 'selected' : ''}>IV chậm</option><option value="IM" ${drug?.usage === 'IM' ? 'selected' : ''}>IM</option><option value="SC" ${drug?.usage === 'SC' ? 'selected' : ''}>SC</option></select>`;

    const intervalDiv = document.createElement('div');
    intervalDiv.className = 'w-full md:flex-1 flex items-end space-x-2';
    intervalDiv.innerHTML = `<div class="flex-1"><label class="block text-sm font-medium text-gray-700">Thời gian liều</label><input type="number" placeholder="Thời gian của liều" value="${drug?.interval || ''}" class="drug-item-interval px-3 py-2 border rounded-md w-full"></div><div class="flex-1"><label class="block text-sm font-medium text-gray-700">Đơn vị</label><select class="drug-item-interval-unit px-3 py-2 border rounded-md w-full"><option value="giờ" ${drug?.intervalUnit === 'giờ' ? 'selected' : ''}>giờ</option><option value="phút" ${drug?.intervalUnit === 'phút' ? 'selected' : ''}>phút</option><option value="ngày" ${drug?.intervalUnit === 'ngày' ? 'selected' : ''}>ngày</option></select></div>`;

    const durationDiv = document.createElement('div');
    durationDiv.className = 'w-full md:flex-1 flex items-end space-x-2';
    durationDiv.innerHTML = `<div class="flex-1"><label class="block text-sm font-medium text-gray-700">Thời gian dùng</label><input type="number" placeholder="Thời gian dùng thuốc" value="${drug?.duration || ''}" class="drug-item-duration px-3 py-2 border rounded-md w-full"></div><div class="flex-1"><label class="block text-sm font-medium text-gray-700">Đơn vị</label><select class="drug-item-duration-unit px-3 py-2 border rounded-md w-full"><option value="ngày" ${drug?.durationUnit === 'ngày' ? 'selected' : ''}>ngày</option><option value="lần" ${drug?.durationUnit === 'lần' ? 'selected' : ''}>lần</option><option value="tuần" ${drug?.durationUnit === 'tuần' ? 'selected' : ''}>tuần</option></select></div>`;

    const removeBtnDiv = document.createElement('div');
    removeBtnDiv.className = 'w-full md:w-auto mt-2 md:mt-0';
    removeBtnDiv.innerHTML = `<button type="button" class="remove-item-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button>`;
    
    select.addEventListener('change', (e) => {
        const selectedMed = allMedicines.find(med => med.id === e.target.value);
        const dosageInput = itemDiv.querySelector('.drug-item-dosage');
        const unitInput = itemDiv.querySelector('.drug-item-unit');
        if (selectedMed) {
            dosageInput.value = selectedMed.itemDosage ?? '';
            unitInput.value = selectedMed.itemDosageUnit ?? '';
        } else {
            dosageInput.value = '';
            unitInput.value = '';
        }
    });

    itemDiv.appendChild(nameDiv);
    itemDiv.appendChild(dosageDiv);
    itemDiv.appendChild(usageDiv);
    itemDiv.appendChild(intervalDiv);
    itemDiv.appendChild(durationDiv);
    itemDiv.appendChild(removeBtnDiv);
    return itemDiv;
}

/**
 * Hàm thêm một mục thuốc mới vào kế hoạch điều trị.
 * @param {object|null} drug
 */
function addDrugItem(drug = null) {
    const itemDiv = createDrugItemHtml(drug);
    drugItemsContainer.appendChild(itemDiv);
}

/**
 * Render danh sách kế hoạch điều trị.
 * @param {Array<object>} plans
 */
function renderTreatmentPlans(plans) {
    treatmentplansListDiv.innerHTML = '';
    if (plans.length === 0) {
        treatmentplansListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có kế hoạch điều trị nào được lưu.</p>';
        return;
    }
    plans.forEach(plan => {
        const card = document.createElement('div');
        card.className = 'treatmentplan-card p-4 bg-gray-50 rounded-lg shadow-sm mb-2';
        const itemsHtml = (plan.items || []).map(item => ` <li>${item.content}</li> `).join('');
        const drugsHtml = (plan.drugs || []).map(drug => ` <li>${drug.name}: Liều dùng ${drug.dosage} ${drug.unit}, ${drug.usage}, mỗi ${drug.interval} ${drug.intervalUnit} trong ${drug.duration} ${drug.durationUnit}</li> `).join('');
        card.innerHTML = `<h3 class="font-semibold text-lg text-blue-600">${plan.name}</h3>${(plan.items && plan.items.length > 0) ? `<p class="font-semibold mt-2 text-sm text-gray-700">Kế hoạch chi tiết:</p><ul class="list-disc list-inside mt-1 text-sm text-gray-600">${itemsHtml}</ul>` : ''}${(plan.drugs && plan.drugs.length > 0) ? `<p class="font-semibold mt-2 text-sm text-gray-700">Chi tiết dùng thuốc:</p><ul class="list-disc list-inside mt-1 text-sm text-gray-600">${drugsHtml}</ul>` : ''}${plan.note ? `<p class="mt-2 text-sm text-gray-500"><strong>Lưu ý:</strong> ${plan.note}</p>` : ''}<div class="flex justify-end space-x-2 mt-4"><button type="button" class="edit-treatmentplan-btn text-blue-500 hover:text-blue-700 transition" data-id="${plan.id}"><i class="fas fa-edit"></i></button><button type="button" class="delete-treatmentplan-btn text-red-500 hover:text-red-700 transition" data-id="${plan.id}"><i class="fas fa-trash-alt"></i></button></div>`;
        treatmentplansListDiv.appendChild(card);
    });
}
document.getElementById('add-treatmentplan-item').addEventListener('click', () => { addTreatmentplanItem(); });
document.getElementById('treatmentplan-items-container').addEventListener('click', (e) => {
    if (e.target.closest('.remove-item-btn')) { e.target.closest('.flex.space-x-2').remove(); }
});
addDrugItemBtn.addEventListener('click', () => { addDrugItem(); });
drugItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-item-btn')) { e.target.closest('.flex.flex-wrap').remove(); }
});

//======================================================================
//                  8. QUẢN LÝ NHÓM TƯ VẤN
//======================================================================

/**
 * Hàm thêm trường nhập liệu cho Tư vấn & Dặn dò.
 * @param {object|null} item
 */
function addConsultationItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex space-x-2 mb-2';
    itemDiv.innerHTML = `<input type="text" placeholder="Nội dung tư vấn/dặn dò" value="${item ? item.content : ''}" class="consultation-item-content px-3 py-2 border rounded-md flex-1"><button type="button" class="remove-item-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button>`;
    consultationsItemsContainer.appendChild(itemDiv);
    itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => { itemDiv.remove(); });
}

/**
 * Render danh sách nhóm tư vấn.
 * @param {Array<object>} consultations
 */
function renderConsultations(consultations) {
    consultationsListDiv.innerHTML = '';
    if (consultations.length === 0) {
        consultationsListDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có nhóm tư vấn nào được lưu.</p>';
        return;
    }
    consultations.forEach(consultation => {
        const card = document.createElement('div');
        card.className = 'consultation-card p-4 bg-gray-50 rounded-lg shadow-sm mb-2';
        card.innerHTML = `<h3 class="font-semibold text-lg text-blue-600">${consultation.name}</h3><ul class="list-disc list-inside mt-2 text-sm text-gray-600">${(consultation.items || []).map(item => `<li>${item.content}</li>`).join('')}</ul><div class="flex justify-end space-x-2 mt-4"><button type="button" class="edit-consultation-btn text-blue-500 hover:text-blue-700 transition" data-id="${consultation.id}"><i class="fas fa-edit"></i></button><button type="button" class="delete-consultation-btn text-red-500 hover:text-red-700 transition" data-id="${consultation.id}"><i class="fas fa-trash-alt"></i></button></div>`;
        consultationsListDiv.appendChild(card);
    });
}
addConsultationItemBtn.addEventListener('click', addConsultationItem);

//======================================================================
//                    9. XỬ LÝ SỰ KIỆN CHUNG
//======================================================================

// Lắng nghe sự kiện submit form chung cho tất cả các loại danh mục
const formHandlers = {
    'medicines-form': 'medicines', 'supplies-form': 'supplies', 'services-form': 'services',
    'surgeries-form': 'surgeries', 'labtests-form': 'labtests', 'fasttests-form': 'fasttests',
    'consultations-form': 'consultations', 'templates-form': 'templates', 'treatmentplan-form': 'treatmentplans'
};

Object.entries(formHandlers).forEach(([formId, type]) => {
    const form = document.getElementById(formId);
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            if (!userId) { alert("Bạn chưa đăng nhập. Vui lòng đăng nhập trước."); return; }
            const docId = form.querySelector(`input[id$="-docId"]`).value;
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

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
                    if (element.value) { items.push({ content: element.value }); }
                });
                data.items = items;
            }

            if (type === 'treatmentplans') {
                const drugItems = drugItemsContainer.querySelectorAll('.flex.flex-wrap');
                const drugs = [];
                drugItems.forEach(item => {
                    const selectElement = item.querySelector('.drug-item-select');
                    if (selectElement && selectElement.value) {
                        drugs.push({
                            drugId: selectElement.value,
                            name: selectElement.options[selectElement.selectedIndex].text,
                            dosage: parseFloat(item.querySelector('.drug-item-dosage').value) || 0,
                            unit: item.querySelector('.drug-item-unit').value,
                            usage: item.querySelector('.drug-item-usage').value,
                            interval: parseFloat(item.querySelector('.drug-item-interval').value) || 0,
                            intervalUnit: item.querySelector('.drug-item-interval-unit').value,
                            duration: parseFloat(item.querySelector('.drug-item-duration').value) || 0,
                            durationUnit: item.querySelector('.drug-item-duration-unit').value,
                        });
                    }
                });
                const treatmentplanItemElements = treatmentplanItemsContainer.querySelectorAll('.treatmentplan-item-content');
                const items = [];
                treatmentplanItemElements.forEach(element => {
                    if (element.value) { items.push({ content: element.value }); }
                });
                data.drugs = drugs;
                data.items = items;
            }
            
            try {
                const collectionPath = `users/${userId}/private/data/${type}`;
                if (docId) { await updateDoc(doc(db, collectionPath, docId), data); alert(`Cập nhật thành công!`); }
                else { await addDoc(collection(db, collectionPath), data); alert(`Lưu thành công!`); }
                
                form.reset();
                form.querySelector(`input[id$="-docId"]`).value = '';
                form.querySelector('.cancel-btn').classList.add('hidden');
                
                // Reset các container đặc biệt
                if (type === 'consultations') { consultationsItemsContainer.innerHTML = ''; addConsultationItem(); }
                if (type === 'templates') { templatesItemsContainer.innerHTML = ''; addTemplateItem(); }
                if (type === 'treatmentplans') { treatmentplanItemsContainer.innerHTML = ''; addTreatmentplanItem(); drugItemsContainer.innerHTML = ''; addDrugItem(); }
                
            } catch (e) {
                console.error("Lỗi khi thêm/cập nhật dữ liệu: ", e);
                alert("Lỗi khi lưu dữ liệu. Vui lòng thử lại.");
            }
        });

        const cancelButton = form.querySelector('.cancel-btn');
        if (cancelButton) {
            cancelButton.addEventListener('click', () => {
                form.reset();
                form.querySelector(`input[id$="-docId"]`).value = '';
                cancelButton.classList.add('hidden');
                if (type === 'templates') { templatesItemsContainer.innerHTML = ''; addTemplateItem(); }
                if (type === 'consultations') { consultationsItemsContainer.innerHTML = ''; addConsultationItem(); }
                if (type === 'treatmentplans') { treatmentplanItemsContainer.innerHTML = ''; addTreatmentplanItem(); drugItemsContainer.innerHTML = ''; addDrugItem(); }
                alert("Đã hủy bỏ chỉnh sửa.");
            });
        }
    }
});

// Lắng nghe sự kiện click chung cho tất cả các nút chỉnh sửa và xóa
document.addEventListener('click', async (e) => {
    if (!userId) { alert("Bạn chưa đăng nhập."); return; }

    // Xử lý nút Chỉnh sửa
    const editBtn = e.target.closest('.edit-btn');
    const editTemplateBtn = e.target.closest('.edit-template-btn');
    const editTreatmentplanBtn = e.target.closest('.edit-treatmentplan-btn');
    const editConsultationBtn = e.target.closest('.edit-consultation-btn');

    if (editBtn) {
        const docId = editBtn.dataset.id;
        const type = editBtn.dataset.type;
        const form = document.getElementById(`${type}-form`);
        const header = document.getElementById(`${type}-section`).querySelector('.collapsible-header');

        // Mở rộng phần có thể thu gọn
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');
        content.classList.add('expanded');
        icon.classList.add('expanded');

        // Cuộn trang lên tiêu đề form
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });

        try {
            const docSnap = await getDoc(doc(db, `users/${userId}/private/data/${type}`, docId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector(`input[id$="-docId"]`).value = docId;
                Object.keys(data).forEach(key => {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) { input.value = data[key]; }
                });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert(`Đang chỉnh sửa ${type}.`);
            }
        } catch (error) { console.error(`Lỗi khi lấy dữ liệu ${type}: `, error); }
    } else if (editTemplateBtn) {
        const docId = editTemplateBtn.dataset.id;
        const form = templatesForm;
        const header = document.getElementById('templates-section').querySelector('.collapsible-header');

        // Mở rộng phần có thể thu gọn
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');
        content.classList.add('expanded');
        icon.classList.add('expanded');

        // Cuộn trang lên tiêu đề form
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        try {
            await waitForMedicines();
            const docSnap = await getDoc(doc(db, `users/${userId}/private/data/templates`, docId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector('#templates-docId').value = docId;
                form.querySelector('#templates-name').value = data.name;
                form.querySelector('#templates-regimen').value = data.regimen || '';
                form.querySelector('#templates-regimen-unit').value = data.itemRegimenUnit || '';
                form.querySelector('#templates-note').value = data.note || '';
                templatesItemsContainer.innerHTML = '';
                (data.medicines || []).forEach(item => { addTemplateItem(item); });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa toa thuốc mẫu.");
            }
        } catch (error) { console.error("Lỗi khi lấy toa thuốc mẫu: ", error); }
    } else if (editTreatmentplanBtn) {
        const docId = editTreatmentplanBtn.dataset.id;
        const form = treatmentplanForm;
        const header = document.getElementById('treatmentplans-section').querySelector('.collapsible-header');

        // Mở rộng phần có thể thu gọn
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');
        content.classList.add('expanded');
        icon.classList.add('expanded');

        // Cuộn trang lên tiêu đề form
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        try {
            await waitForMedicines();
            const docSnap = await getDoc(doc(db, `users/${userId}/private/data/treatmentplans`, docId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector('#treatmentplan-docId').value = docId;
                form.querySelector('#treatmentplan-name').value = data.name;
                form.querySelector('#treatmentplan-note').value = data.note || '';
                treatmentplanItemsContainer.innerHTML = '';
                (data.items || []).forEach(item => { addTreatmentplanItem(item); });
                drugItemsContainer.innerHTML = '';
                (data.drugs || []).forEach(drug => { addDrugItem(drug); });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa kế hoạch điều trị.");
            }
        } catch (error) { console.error("Lỗi khi lấy kế hoạch điều trị: ", error); }
    } else if (editConsultationBtn) {
        const docId = editConsultationBtn.dataset.id;
        const form = consultationsForm;
        const header = document.getElementById('consultations-section').querySelector('.collapsible-header');

        // Mở rộng phần có thể thu gọn
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');
        content.classList.add('expanded');
        icon.classList.add('expanded');

        // Cuộn trang lên tiêu đề form
        header.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        try {
            const docSnap = await getDoc(doc(db, `users/${userId}/private/data/consultations`, docId));
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector('#consultations-docId').value = docId;
                form.querySelector('#consultations-name').value = data.name;
                consultationsItemsContainer.innerHTML = '';
                (data.items || []).forEach(item => { addConsultationItem(item); });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa nhóm tư vấn.");
            }
        } catch (error) { console.error("Lỗi khi lấy nhóm tư vấn: ", error); }
    }

    // Xử lý nút Xóa
    const deleteBtn = e.target.closest('.delete-btn');
    const deleteTemplateBtn = e.target.closest('.delete-template-btn');
    const deleteTreatmentplanBtn = e.target.closest('.delete-treatmentplan-btn');
    const deleteConsultationBtn = e.target.closest('.delete-consultation-btn');
    const deleteMap = {
        '.delete-btn': { type: e.target.closest('.delete-btn')?.dataset.type, path: docId => `users/${userId}/private/data/${e.target.closest('.delete-btn').dataset.type}` },
        '.delete-template-btn': { type: 'toa thuốc mẫu', path: docId => `users/${userId}/private/data/templates` },
        '.delete-treatmentplan-btn': { type: 'kế hoạch điều trị', path: docId => `users/${userId}/private/data/treatmentplans` },
        '.delete-consultation-btn': { type: 'nhóm tư vấn', path: docId => `users/${userId}/private/data/consultations` },
    };
    for (const [selector, { type, path }] of Object.entries(deleteMap)) {
        if (e.target.closest(selector)) {
            const docId = e.target.closest(selector).dataset.id;
            if (confirm(`Bạn có chắc chắn muốn xóa ${type} này?`)) {
                try {
                    await deleteDoc(doc(db, path(docId), docId));
                    alert(`Xóa ${type} thành công!`);
                } catch (error) { console.error(`Lỗi khi xóa ${type}: `, error); }
            }
            break;
        }
    }
});
// Xử lý các phần có thể thu gọn/mở rộng (collapsible sections)
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');
        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
    });
});

// Tự động mở rộng và cuộn đến phần khi có anchor link trên URL
window.addEventListener('DOMContentLoaded', () => {
    const hash = window.location.hash;
    if (hash) {
        const targetSection = document.querySelector(hash);
        if (targetSection) {
            const header = targetSection.querySelector('.collapsible-header');
            if (header) {
                const content = header.nextElementSibling;
                const icon = header.querySelector('.collapsible-icon');

                // Mở rộng phần
                content.classList.add('expanded');
                icon.classList.add('expanded');
                
                // Cuộn trang đến đầu tiêu đề
                // Dùng setTimeout để đảm bảo việc mở rộng đã hoàn tất trước khi cuộn
                setTimeout(() => {
                    const headerPosition = header.getBoundingClientRect().top + window.pageYOffset;
                    window.scrollTo({
                        top: headerPosition,
                        behavior: 'smooth'
                    });
                }, 300); // Có thể điều chỉnh thời gian delay này nếu cần
            }
        }
    }
});