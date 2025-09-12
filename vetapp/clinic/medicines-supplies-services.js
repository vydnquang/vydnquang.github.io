import { db, auth } from './firebase-config.js';
import { addDoc, onSnapshot, collection, doc, getDoc, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

// mới thêm
const treatmentplanForm = document.getElementById('treatmentplan-form');
const treatmentplanItemsContainer = document.getElementById('treatmentplan-items-container');
const treatmentplansListDiv = document.getElementById('treatmentplans-list');
const addTreatmentplanBtn = document.getElementById('add-treatmentplan-item');
const drugItemsContainer = document.getElementById('drug-items-container');
const addDrugItemBtn = document.getElementById('add-drug-item');

let userId = null;
let allMedicines = []; // Lưu trữ danh sách thuốc để sử dụng

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
    
    // Nếu có thuốc được chọn nhưng chưa có danh sách đầy đủ, thêm thuốc đó vào
    if (selectedId && !allMedicines.find(med => med.id === selectedId)) {
        const selectedMed = allMedicines.find(med => med.id === selectedId);
        optionsHtml += `<option value="${selectedId}" selected>${selectedMed ? selectedMed.name : 'Đang tải...'}</option>`;
    }
    
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
    select.innerHTML = createMedicineOptions(item ? item.id : null);
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

// Hàm thêm trường nhập liệu cho Tư vấn & Dặn dò
function addConsultationItem(item = null) {
    const itemDiv = document.createElement('div');
    itemDiv.className = 'flex space-x-2 mb-2';
    itemDiv.innerHTML = `
        <input type="text" placeholder="Nội dung tư vấn/dặn dò" value="${item ? item.content : ''}" class="consultation-item-content px-3 py-2 border rounded-md flex-1">
        <button type="button" class="remove-item-btn text-red-500 hover:text-red-700"><i class="fas fa-times-circle"></i></button>
    `;
    consultationsItemsContainer.appendChild(itemDiv.firstElementChild);
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
    // Tìm thông tin thuốc từ danh sách allMedicines để lấy itemDosage và itemDosageUnit
    const selectedMed = drug ? allMedicines.find(med => med.id === drug.id) : null;
    const dosage = drug?.dosage || selectedMed?.itemDosage || '';
    const unit = drug?.unit || selectedMed?.itemDosageUnit || '';
    const selectedName = drug ? drug.name : '';

    let optionsHtml = '<option value="">-- Chọn thuốc --</option>';
    if (drug && !allMedicines.some(m => m.id === drug.id)) {
        optionsHtml += `<option value="${drug.id}" selected>${drug.name}</option>`;
    }
    allMedicines.forEach(med => {
        const isSelected = (drug?.id === med.id) ? 'selected' : '';
        optionsHtml += `<option value="${med.id}" ${isSelected}>${med.name}</option>`;
    });

    return `
    <div class="flex flex-wrap space-y-4 md:space-y-0 md:flex-row md:space-x-5 mb-2 items-end drug-item-group">
        <div class="w-full md:flex-1">
            <label class="block text-sm font-medium text-gray-700">Tên thuốc</label>
            <select class="drug-item-name px-3 py-2 border rounded-md w-full">
                ${optionsHtml}
            </select>
        </div>
        <div class="w-full md:flex-1 flex items-end space-x-2">
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Liều dùng</label>
                <input type="number" step="any" placeholder="Liều dùng" value="${dosage}" class="drug-item-dosage px-3 py-2 border rounded-md w-full">
            </div>
            <div class="flex-1">
                <label class="block text-sm font-medium text-gray-700">Đơn vị liều</label>
                <select class="drug-item-unit px-3 py-2 border rounded-md w-full">
                    <option value="mg/kg" ${unit === 'mg/kg' ? 'selected' : ''}>mg/kg</option>
                    <option value="ml/kg" ${unit === 'ml/kg' ? 'selected' : ''}>ml/kg</option>
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
    const itemContainer = document.createElement('div');
    itemContainer.innerHTML = createDrugItemHtml(drug);
    drugItemsContainer.appendChild(itemContainer.firstElementChild);
}

// Xử lý nút "Thêm thuốc"
addDrugItemBtn.addEventListener('click', () => {
    addDrugItem();
});

// THAY ĐỔI: Sử dụng event delegation cho cả 2 chức năng auto-fill và xóa
drugItemsContainer.addEventListener('change', (e) => {
    if (e.target.matches('.drug-item-name')) {
        const selectedMedId = e.target.value;
        const selectedMed = allMedicines.find(med => med.id === selectedMedId);
        const drugItemGroup = e.target.closest('.drug-item-group');
        const dosageInput = drugItemGroup.querySelector('.drug-item-dosage');
        const unitSelect = drugItemGroup.querySelector('.drug-item-unit');
        
        if (selectedMed) {
            dosageInput.value = selectedMed.itemDosage ?? '';
            unitSelect.value = selectedMed.itemDosageUnit ?? '';
        } else {
            dosageInput.value = '';
            unitSelect.value = '';
        }
    }
});

drugItemsContainer.addEventListener('click', (e) => {
    if (e.target.closest('.remove-item-btn')) {
        e.target.closest('.drug-item-group').remove();
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
        const itemsHtml = (plan.items || []).map(item => `
            <li>${item.content}</li>
        `).join('');

        // Tạo HTML cho danh sách thuốc
        const drugsHtml = (plan.drugs || []).map(drug => `
            <li>${drug.name}: Liều dùng ${drug.dosage} ${drug.unit}, ${drug.usage}, mỗi ${drug.interval} ${drug.intervalUnit} trong ${drug.duration} ${drug.durationUnit}</li>
        `).join('');

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
    const drugItems = drugItemsContainer.querySelectorAll('.drug-item-group');
    const drugs = [];
    drugItems.forEach(item => {
        const selectedMedId = item.querySelector('.drug-item-name').value;
        const selectedMedName = item.querySelector('.drug-item-name option:checked').textContent;
        
        if (selectedMedId) {
            const drug = {
                id: selectedMedId,
                name: selectedMedName,
                dosage: parseFloat(item.querySelector('.drug-item-dosage').value) || 0,
                unit: item.querySelector('.drug-item-unit').value,
                usage: item.querySelector('.drug-item-usage').value,
                interval: parseFloat(item.querySelector('.drug-item-interval').value) || 0,
                intervalUnit: item.querySelector('.drug-item-interval-unit').value,
                duration: parseFloat(item.querySelector('.drug-item-duration').value) || 0,
                durationUnit: item.querySelector('.drug-item-duration-unit').value,
            };
            drugs.push(drug);
        }
    });

    // BỔ SUNG: Lấy thông tin từ các mục kế hoạch chi tiết
    const treatmentplanItemsContainer = document.getElementById('treatmentplan-items-container');
    const treatmentplanItemElements = treatmentplanItemsContainer.querySelectorAll('.treatmentplan-item-content');
    const items = [];
    treatmentplanItemElements.forEach(element => {
        items.push({
            content: element.value
        });
    });

    // Cập nhật đối tượng data để lưu cả hai mảng: drugs và items
    const data = { name, items, drugs, note };

    try {
        const collectionPath = `users/${userId}/private/data/treatmentplans`;
        if (docId) {
            // Cập nhật
            const docRef = doc(db, collectionPath, docId);
            await updateDoc(docRef, data);
            alert("Cập nhật kế hoạch điều trị thành công!");
        } else {
            // Thêm mới
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
        console.error("Lỗi khi lưu dữ liệu: ", e);
        alert("Đã xảy ra lỗi khi lưu dữ liệu.");
    }
});

// Xử lý khi nhấn nút Hủy trên form Kế hoạch điều trị
document.querySelector('#treatmentplan-form .cancel-btn').addEventListener('click', () => {
    treatmentplanForm.reset();
    treatmentplanForm.querySelector('#treatmentplan-docId').value = '';
    drugItemsContainer.innerHTML = '';
    addDrugItem();
    // Bổ sung để xóa các trường trong "Kế hoạch chi tiết"
    treatmentplanItemsContainer.innerHTML = '';
    addTreatmentplanItem();
    treatmentplanForm.querySelector('.cancel-btn').classList.add('hidden');
});

//========================= KẾT THÚC LOGIC MỚI =========================//

// Hàm xử lý khi submit form
async function handleFormSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const type = form.id.replace('-form', '');
    const docId = form.querySelector(`#${type}-docId`).value;
    const data = {};
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (input.name && input.name !== '') {
            data[input.name] = input.type === 'number' ? Number(input.value) : input.value;
        }
    });

    if (!userId) {
        console.error("User not logged in. Cannot save data.");
        return;
    }

    try {
        const collectionPath = `users/${userId}/private/data/${type}`;
        if (docId) {
            // Cập nhật
            const docRef = doc(db, collectionPath, docId);
            await updateDoc(docRef, data);
            alert("Cập nhật thành công!");
        } else {
            // Thêm mới
            await addDoc(collection(db, collectionPath), data);
            alert("Lưu thành công!");
        }
        form.reset();
        form.querySelector(`#${type}-docId`).value = '';
        form.querySelector('.cancel-btn').classList.add('hidden');
    } catch (e) {
        console.error("Lỗi khi lưu dữ liệu: ", e);
        alert("Đã xảy ra lỗi khi lưu dữ liệu.");
    }
}

// Hàm xử lý khi nhấn nút Hủy
function handleCancel(form) {
    form.reset();
    const type = form.id.replace('-form', '');
    form.querySelector(`#${type}-docId`).value = '';
    form.querySelector('.cancel-btn').classList.add('hidden');
    
    // Xử lý riêng cho Toa thuốc mẫu và Tư vấn
    if (type === 'templates') {
        templatesItemsContainer.innerHTML = '';
        addTemplateItem();
    }
    if (type === 'consultations') {
        consultationsItemsContainer.innerHTML = '';
        addConsultationItem();
    }
}

// Lắng nghe trạng thái đăng nhập
onAuthStateChanged(auth, (user) => {
    if (user) {
        userId = user.uid;
        console.log("User logged in with ID:", userId);
        setupFirestoreListeners();
    } else {
        userId = null;
        console.log("User is not logged in.");
    }
});

// Lắng nghe dữ liệu từ Firestore
function setupFirestoreListeners() {
    if (!userId) {
        console.warn("User ID not available. Firestore listeners will not be set up.");
        return;
    }
    
    // Thuốc
    onSnapshot(collection(db, `users/${userId}/private/data/medicines`), (snapshot) => {
        allMedicines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('medicines', allMedicines);
    });
    
    // Vật tư
    onSnapshot(collection(db, `users/${userId}/private/data/supplies`), (snapshot) => {
        const supplies = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('supplies', supplies);
    });
    
    // Dịch vụ
    onSnapshot(collection(db, `users/${userId}/private/data/services`), (snapshot) => {
        const services = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('services', services);
    });

    // Phẫu thuật
    onSnapshot(collection(db, `users/${userId}/private/data/surgeries`), (snapshot) => {
        const surgeries = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('surgeries', surgeries);
    });

    // Xét nghiệm & Chẩn đoán
    onSnapshot(collection(db, `users/${userId}/private/data/labtests`), (snapshot) => {
        const labtests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('labtests', labtests);
    });

    // Test nhanh
    onSnapshot(collection(db, `users/${userId}/private/data/fasttests`), (snapshot) => {
        const fasttests = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderItems('fasttests', fasttests);
    });
    
    // Toa thuốc mẫu
    onSnapshot(collection(db, `users/${userId}/private/data/templates`), (snapshot) => {
        const templates = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTemplates(templates);
    });

    // Tư vấn & Dặn dò
    onSnapshot(collection(db, `users/${userId}/private/data/consultations`), (snapshot) => {
        const consultations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderConsultations(consultations);
    });
    // Kế hoạch điều trị
    onSnapshot(collection(db, `users/${userId}/private/data/treatmentplans`), (snapshot) => {
        const treatmentplans = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        renderTreatmentPlans(treatmentplans);
    });
}

// Xử lý form để lưu dữ liệu vào Firestore cho mục: Toa thuốc mẫu (MỚI)
templatesForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const docId = document.getElementById('templates-docId').value;
    const name = document.getElementById('templates-name').value;
    
    // Lấy giá trị của các trường mới
    const regimen = document.getElementById('templates-regimen').value;
    const itemRegimenUnit = document.getElementById('templates-regimen-unit').value;
    const note = document.getElementById('templates-note').value;
    
    const medicines = [];
    templatesItemsContainer.querySelectorAll('.flex.space-x-2.mb-2').forEach(itemDiv => {
        const selectedMedId = itemDiv.querySelector('.template-item-select').value;
        const selectedMed = allMedicines.find(med => med.id === selectedMedId);

        if (selectedMed) {
            const item = { // Đã sửa tên trường để nhất quán
                id: selectedMed.id,
                drugname: selectedMed.name,
                drugdosage: itemDiv.querySelector('.template-item-dosage').value,
                drugdosageunit: itemDiv.querySelector('.template-item-unit').value
            };
            medicines.push(item);
        }
    });

    if (!userId) {
        console.error("User not logged in. Cannot save data.");
        return;
    }

    try {
        const templateData = {
            name,
            medicines,
            regimen,
            itemRegimenUnit,
            note
        };

        if (docId) {
            await updateDoc(doc(db, `users/${userId}/private/data/templates`, docId), templateData);
            alert("Cập nhật toa thuốc mẫu thành công!");
        } else {
            await addDoc(collection(db, `users/${userId}/private/data/templates`), templateData);
            alert("Lưu toa thuốc mẫu thành công!");
        }
        templatesForm.reset();
        templatesItemsContainer.innerHTML = '';
        addTemplateItem();
        templatesForm.querySelector('.cancel-btn').classList.add('hidden');
    } catch (e) {
        console.error("Lỗi khi lưu toa thuốc mẫu: ", e);
        alert("Đã xảy ra lỗi khi lưu toa thuốc mẫu.");
    }
});

// Xử lý form để lưu dữ liệu vào Firestore cho mục: Nhóm tư vấn
consultationsForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const docId = document.getElementById('consultations-docId').value;
    const name = document.getElementById('consultations-name').value;
    const items = [];
    consultationsItemsContainer.querySelectorAll('.flex.space-x-2.mb-2').forEach(itemDiv => {
        const item = {
            content: itemDiv.querySelector('.consultation-item-content').value
        };
        if (item.content) {
            items.push(item);
        }
    });

    if (!userId) {
        console.error("User not logged in. Cannot save data.");
        return;
    }

    try {
        if (docId) {
            await updateDoc(doc(db, `users/${userId}/private/data/consultations`, docId), { name, items });
            alert("Cập nhật nhóm tư vấn thành công!");
        } else {
            await addDoc(collection(db, `users/${userId}/private/data/consultations`), { name, items });
            alert("Lưu nhóm tư vấn thành công!");
        }
        consultationsForm.reset();
        consultationsItemsContainer.innerHTML = '';
        addConsultationItem();
        consultationsForm.querySelector('.cancel-btn').classList.add('hidden');
    } catch (e) {
        console.error("Lỗi khi lưu nhóm tư vấn: ", e);
        alert("Đã xảy ra lỗi khi lưu nhóm tư vấn.");
    }
});

//===============LOGIC CHỈNH SỬA, XÓA====================//
// Gán sự kiện submit và cancel cho các form
medicinesForm.addEventListener('submit', handleFormSubmit);
suppliesForm.addEventListener('submit', handleFormSubmit);
servicesForm.addEventListener('submit', handleFormSubmit);
surgeriesForm.addEventListener('submit', handleFormSubmit);
labtestsForm.addEventListener('submit', handleFormSubmit);
fasttestsForm.addEventListener('submit', handleFormSubmit);

// Các nút hủy (hàm reset tất cả form nhập liệu)
const cancelBtns = document.querySelectorAll('.cancel-btn');
document.querySelectorAll('.cancel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const form = e.target.closest('form');
        if (form) {
            handleCancel(form);
        }
    });
});

// Xử lý sự kiện click trên các nút chỉnh sửa/xóa
document.addEventListener('click', async (e) => {
    // Xử lý chỉnh sửa cho các danh mục
    if (e.target.closest('.edit-btn')) {
        const button = e.target.closest('.edit-btn');
        const docId = button.dataset.id;
        const type = button.dataset.type;
        const form = document.getElementById(`${type}-form`);
        const collectionPath = `users/${userId}/private/data/${type}`;
        
        try {
            const docRef = doc(db, collectionPath, docId);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                form.querySelector(`#${type}-docId`).value = docId;
                for (const key in data) {
                    const input = form.querySelector(`[name="${key}"]`);
                    if (input) {
                        input.value = data[key];
                    }
                }
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert(`Đang chỉnh sửa mục ${type}.`);
            } else {
                alert("Không tìm thấy mục để chỉnh sửa.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu để chỉnh sửa: ", error);
            alert("Lỗi khi lấy dữ liệu.");
        }
    }
    // Xử lý xóa
    if (e.target.closest('.delete-btn')) {
        const button = e.target.closest('.delete-btn');
        const docId = button.dataset.id;
        const type = button.dataset.type;
        if (confirm("Bạn có chắc chắn muốn xóa mục này?")) {
            try {
                await deleteDoc(doc(db, `users/${userId}/private/data/${type}`, docId));
                alert("Xóa thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa dữ liệu: ", error);
                alert("Lỗi khi xóa dữ liệu.");
            }
        }
    }

    // Chỉnh sửa Toa thuốc mẫu (MỚI)
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

                // NẠP DỮ LIỆU CHO CÁC TRƯỜNG MỚI
                templatesForm.querySelector('#templates-regimen').value = data.regimen || '';
                templatesForm.querySelector('#templates-regimen-unit').value = data.itemRegimenUnit || '';
                templatesForm.querySelector('#templates-note').value = data.note || '';

                templatesItemsContainer.innerHTML = '';
                (data.medicines || []).forEach(item => {
                    addTemplateItem(item); // Thêm hàng mới với dữ liệu đã có
                });
                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa toa thuốc mẫu.");
            }
        } catch (error) {
            console.error("Lỗi khi lấy toa thuốc mẫu: ", error);
        }
    }

    // Xóa Toa thuốc mẫu
    if (e.target.closest('.delete-template-btn')) {
        const docId = e.target.closest('.delete-template-btn').dataset.id;
        if (confirm("Bạn có chắc chắn muốn xóa toa thuốc mẫu này?")) {
            try {
                await deleteDoc(doc(db, `users/${userId}/private/data/templates`, docId));
                alert("Xóa toa thuốc mẫu thành công!");
            } catch (error) {
                console.error("Lỗi khi xóa toa thuốc mẫu: ", error);
            }
        }
    }

    // Chỉnh sửa Tư vấn & Dặn dò
    if (e.target.closest('.edit-consultation-btn')) {
        const docId = e.target.closest('.edit-consultation-btn').dataset.id;
        const form = consultationsForm;
        try {
            const docSnap = await getDoc(doc(db, `users/${userId}/private/data/consultations`, docId));
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
        } catch (error) { console.error("Lỗi khi lấy nhóm tư vấn: ", error); }
    }

    // Xóa Tư vấn & Dặn dò
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
    
    // =============PHẦN MỚI: DÀNH CHO PLAN==================
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

                // BỔ SUNG: NẠP DỮ LIỆU CHO CÁC MỤC KẾ HOẠCH CHI TIẾT
                treatmentplanItemsContainer.innerHTML = '';
                (data.items || []).forEach(item => {
                    addTreatmentplanItem(item);
                });

                // TIẾP TỤC VỚI PHẦN DÙNG THUỐC ĐÃ CÓ
                drugItemsContainer.innerHTML = '';
                (data.drugs || []).forEach(drug => {
                    addDrugItem(drug);
                });

                form.querySelector('.cancel-btn').classList.remove('hidden');
                alert("Đang chỉnh sửa kế hoạch điều trị.");
            }
        } catch (error) { console.error("Lỗi khi lấy kế hoạch điều trị: ", error); }
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
});
//===============HẾT LOGIC CHỈNH SỬA, XÓA==========================//

// Thêm logic xử lý các phần có thể thu gọn/mở rộng (collapsible sections)
document.querySelectorAll('.collapsible-header').forEach(header => {
    header.addEventListener('click', () => {
        const content = header.nextElementSibling;
        const icon = header.querySelector('.collapsible-icon');

        content.classList.toggle('expanded');
        icon.classList.toggle('expanded');
    });
});