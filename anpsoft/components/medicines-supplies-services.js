//======================================================================
//                        1. KHAI BÁO CHUNG
//======================================================================
import { db } from './firebase-config.js';
import { addDoc, onSnapshot, collection, doc, getDoc, updateDoc, deleteDoc, orderBy, query } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
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
const consultationsItemsContainer = document.getElementById('consultations-items-container');
const addConsultationItemBtn = document.getElementById('add-consultation-item');
const treatmentplanForm = document.getElementById('treatmentplan-form');
const treatmentplanListDiv = document.getElementById('treatmentplans-list');
const treatmentplanItemsContainer = document.getElementById('treatmentplan-items-container');
const addTreatmentplanBtn = document.getElementById('add-treatmentplan-item');
const drugItemsContainer = document.getElementById('drug-items-container');
const addDrugItemBtn = document.getElementById('add-drug-item');

let userId = null;
let listeners = [];
let allMedicines = [];

//======================================================================
//                        2. HÀM TẠO GIAO DIỆN
//======================================================================

function createItemCard(item, type) {
    const div = document.createElement('div');
    div.classList.add('item-card', 'p-4', 'bg-white', 'rounded-md', 'shadow', 'flex', 'flex-col', 'space-y-2');
    div.style.borderLeft = '4px solid #4ade80';

    const header = document.createElement('div');
    header.classList.add('flex', 'justify-between', 'items-center', 'mb-2');

    const nameSpan = document.createElement('span');
    nameSpan.classList.add('font-semibold', 'text-gray-800');
    nameSpan.textContent = item.name;

    const actionDiv = document.createElement('div');
    actionDiv.classList.add('flex', 'space-x-2');

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-btn', 'text-blue-600', 'hover:text-blue-800', 'transition');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.dataset.id = item.id;
    editBtn.dataset.type = type;

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn', 'text-red-600', 'hover:text-red-800', 'transition');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.dataset.id = item.id;
    deleteBtn.dataset.type = type;

    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);
    header.appendChild(nameSpan);
    header.appendChild(actionDiv);
    div.appendChild(header);

    const detailsDiv = document.createElement('div');
    detailsDiv.classList.add('text-sm', 'text-gray-600');
    
    if (item.unit) detailsDiv.innerHTML += `<p><strong>Đơn vị:</strong> ${item.unit}</p>`;
    if (item.itemUnit) detailsDiv.innerHTML += `<p><strong>Đơn vị:</strong> ${item.itemUnit}</p>`; 
    if (item.price) detailsDiv.innerHTML += `<p><strong>Giá:</strong> ${item.price}</p>`;
    if (item.type) detailsDiv.innerHTML += `<p><strong>Phân loại:</strong> ${item.type}</p>`;
    if (item.itemDosage && item.itemDosageUnit) detailsDiv.innerHTML += `<p><strong>Liều lượng:</strong> ${item.itemDosage} ${item.itemDosageUnit}</p>`;
    if (item.usage) detailsDiv.innerHTML += `<p><strong>Cách sử dụng:</strong> ${item.usage}</p>`;
    if (item.itemDescription) detailsDiv.innerHTML += `<p><strong>Mô tả:</strong> ${item.itemDescription}</p>`;
    if (item.note) detailsDiv.innerHTML += `<p><strong>Ghi chú:</strong> ${item.note}</p>`;
    if (item.itemFasttestsType) detailsDiv.innerHTML += `<p><strong>Loại test nhanh:</strong> ${item.itemFasttestsType}</p>`;

    div.appendChild(detailsDiv);

    return div;
}

function createTemplateCard(item) {
    const div = document.createElement('div');
    div.classList.add('item-card', 'p-4', 'bg-white', 'rounded-md', 'shadow', 'flex', 'flex-col', 'space-y-2');
    div.style.borderLeft = '4px solid #f97316';
    const header = document.createElement('div');
    header.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('font-semibold', 'text-gray-800');
    nameSpan.textContent = item.name;
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('flex', 'space-x-2');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-template-btn', 'text-blue-600', 'hover:text-blue-800', 'transition');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.dataset.id = item.id;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-template-btn', 'text-red-600', 'hover:text-red-800', 'transition');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.dataset.id = item.id;
    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);
    header.appendChild(nameSpan);
    header.appendChild(actionDiv);
    div.appendChild(header);
    if (item.medicines && item.medicines.length > 0) {
        const medicinesList = document.createElement('ul');
        medicinesList.classList.add('list-disc', 'list-inside', 'text-sm', 'text-gray-600', 'pl-4');
        item.medicines.forEach(med => {
            const li = document.createElement('li');
            li.textContent = `${med.drugname} - ${med.drugdosage} ${med.drugdosageunit}`;
            medicinesList.appendChild(li);
        });
        div.appendChild(medicinesList);
    }
    if (item.regimen) {
        const regimenP = document.createElement('p');
        regimenP.classList.add('text-sm', 'text-gray-600');
        regimenP.innerHTML = `<strong>Liệu trình:</strong> ${item.regimen} ${item.itemRegimenUnit || ''}`;
        div.appendChild(regimenP);
    }
    if (item.note) {
        const noteP = document.createElement('p');
        noteP.classList.add('text-sm', 'text-gray-600');
        noteP.innerHTML = `<strong>Lưu ý:</strong> ${item.note}`;
        div.appendChild(noteP);
    }
    return div;
}

function createConsultationCard(item) {
    const div = document.createElement('div');
    div.classList.add('item-card', 'p-4', 'bg-white', 'rounded-md', 'shadow', 'flex', 'flex-col', 'space-y-2');
    div.style.borderLeft = '4px solid #10b981';
    const header = document.createElement('div');
    header.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('font-semibold', 'text-gray-800');
    nameSpan.textContent = item.name;
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('flex', 'space-x-2');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-consultation-btn', 'text-blue-600', 'hover:text-blue-800', 'transition');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.dataset.id = item.id;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-consultation-btn', 'text-red-600', 'hover:text-red-800', 'transition');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.dataset.id = item.id;
    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);
    header.appendChild(nameSpan);
    header.appendChild(actionDiv);
    div.appendChild(header);
    if (item.items && item.items.length > 0) {
        const itemsList = document.createElement('ul');
        itemsList.classList.add('list-disc', 'list-inside', 'text-sm', 'text-gray-600', 'pl-4');
        item.items.forEach(itemContent => {
            const li = document.createElement('li');
            li.textContent = itemContent.content;
            itemsList.appendChild(li);
        });
        div.appendChild(itemsList);
    }
    return div;
}

function createTreatmentplanCard(item) {
    const div = document.createElement('div');
    div.classList.add('item-card', 'p-4', 'bg-white', 'rounded-md', 'shadow', 'flex', 'flex-col', 'space-y-2');
    div.style.borderLeft = '4px solid #facc15';
    const header = document.createElement('div');
    header.classList.add('flex', 'justify-between', 'items-center', 'mb-2');
    const nameSpan = document.createElement('span');
    nameSpan.classList.add('font-semibold', 'text-gray-800');
    nameSpan.textContent = item.name;
    const actionDiv = document.createElement('div');
    actionDiv.classList.add('flex', 'space-x-2');
    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-treatmentplan-btn', 'text-blue-600', 'hover:text-blue-800', 'transition');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    editBtn.dataset.id = item.id;
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-treatmentplan-btn', 'text-red-600', 'hover:text-red-800', 'transition');
    deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
    deleteBtn.dataset.id = item.id;
    actionDiv.appendChild(editBtn);
    actionDiv.appendChild(deleteBtn);
    header.appendChild(nameSpan);
    header.appendChild(actionDiv);
    div.appendChild(header);
    if (item.items && item.items.length > 0) {
        const itemsHeader = document.createElement('p');
        itemsHeader.classList.add('font-semibold', 'text-gray-800', 'mt-2');
        itemsHeader.textContent = 'Kế hoạch chi tiết:';
        div.appendChild(itemsHeader);
        const itemsList = document.createElement('ul');
        itemsList.classList.add('list-disc', 'list-inside', 'text-sm', 'text-gray-600', 'pl-4');
        item.items.forEach(itemContent => {
            const li = document.createElement('li');
            li.textContent = itemContent.content;
            itemsList.appendChild(li);
        });
        div.appendChild(itemsList);
    }
    if (item.drugs && item.drugs.length > 0) {
        const drugsHeader = document.createElement('p');
        drugsHeader.classList.add('font-semibold', 'text-gray-800', 'mt-2');
        drugsHeader.textContent = 'Chi tiết dùng thuốc:';
        div.appendChild(drugsHeader);
        const drugsList = document.createElement('ul');
        drugsList.classList.add('list-disc', 'list-inside', 'text-sm', 'text-gray-600', 'pl-4');
        item.drugs.forEach(drug => {
            const li = document.createElement('li');
            let detailText = '';
            if (drug.dosage) {
                detailText += `Liều dùng ${drug.dosage} ${drug.unit}`;
            }
            if (drug.usage) {
                detailText += `, ${drug.usage}`;
            }
            if (drug.interval) {
                detailText += `, mỗi ${drug.interval} ${drug.intervalUnit}`;
            }
            if (drug.duration) {
                detailText += ` trong ${drug.duration} ${drug.durationUnit}`;
            }
            li.textContent = `${drug.name}: ${detailText.startsWith(', ') ? detailText.substring(2) : detailText}`;
            drugsList.appendChild(li);
        });
        div.appendChild(drugsList);
    }
    if (item.note) {
        const noteP = document.createElement('p');
        noteP.classList.add('text-sm', 'text-gray-600', 'mt-2');
        noteP.innerHTML = `<strong>Lưu ý:</strong> ${item.note}`;
        div.appendChild(noteP);
    }
    return div;
}

function addTemplateItem(item = {}) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('flex', 'space-x-2', 'mb-2', 'items-end');
    itemDiv.innerHTML = `
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Tên thuốc</label>
            <select name="drug-id" class="template-item-select mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm">
                <option value="">Chọn thuốc...</option>
            </select>
        </div>
        <div class="w-1/4">
            <label class="block text-sm font-medium text-gray-700">Liều lượng</label>
            <input type="text" name="drug-dosage" step="any" class="template-item-dosage mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Liều lượng">
        </div>
        <div class="w-1/4">
            <label class="block text-sm font-medium text-gray-700">Đơn vị</label>
            <input type="text" name="drug-dosage-unit" class="template-item-unit mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Đơn vị">
        </div>
        <button type="button" class="remove-item-btn text-red-600 hover:text-red-800 transition"><i class="fas fa-minus-circle"></i></button>
    `;

    const select = itemDiv.querySelector('.template-item-select');
    const dosageInput = itemDiv.querySelector('.template-item-dosage');
    const unitInput = itemDiv.querySelector('.template-item-unit');

    allMedicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med.id;
        option.textContent = med.name;
        select.appendChild(option);
    });

    if (item.id) select.value = item.id;
    if (item.drugdosage) dosageInput.value = item.drugdosage;
    if (item.drugdosageunit) unitInput.value = item.drugdosageunit;

    // Thêm listener để tự động điền liều dùng và đơn vị khi chọn thuốc
    select.addEventListener('change', (e) => {
        const selectedMedId = e.target.value;
        const selectedMed = allMedicines.find(med => med.id === selectedMedId);
        if (selectedMed) {
            dosageInput.value = selectedMed.itemDosage || '';
            unitInput.value = selectedMed.itemDosageUnit || '';
        } else {
            // Xóa dữ liệu nếu không có thuốc nào được chọn
            dosageInput.value = '';
            unitInput.value = '';
        }
    });
    
    itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
        itemDiv.remove();
    });

    templatesItemsContainer.appendChild(itemDiv);
}

function addConsultationItem(item = {}) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('flex', 'space-x-2', 'mb-2', 'items-end');
    itemDiv.innerHTML = `
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Nội dung</label>
            <input type="text" name="itemContent" class="consultation-item-content mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Nội dung">
        </div>
        <button type="button" class="remove-item-btn text-red-600 hover:text-red-800 transition"><i class="fas fa-minus-circle"></i></button>
    `;
    const contentInput = itemDiv.querySelector('.consultation-item-content');
    if (item.content) {
        contentInput.value = item.content;
    }
    itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
        itemDiv.remove();
    });
    consultationsItemsContainer.appendChild(itemDiv);
}

function addTreatmentplanItem(item = {}) {
    const itemDiv = document.createElement('div');
    itemDiv.classList.add('flex', 'space-x-2', 'mb-2', 'items-end');
    itemDiv.innerHTML = `
        <div class="flex-1">
            <label class="block text-sm font-medium text-gray-700">Nội dung kế hoạch</label>
            <input type="text" name="itemContent" class="treatmentplan-item-content mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Nội dung kế hoạch">
        </div>
        <button type="button" class="remove-item-btn text-red-600 hover:text-red-800 transition"><i class="fas fa-minus-circle"></i></button>
    `;
    const contentInput = itemDiv.querySelector('.treatmentplan-item-content');
    if (item.content) {
        contentInput.value = item.content;
    }
    itemDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
        itemDiv.remove();
    });
    treatmentplanItemsContainer.appendChild(itemDiv);
}

function addDrugItem(drug = {}) {
    const drugDiv = document.createElement('div');
    drugDiv.classList.add('flex', 'flex-wrap', 'space-x-2', 'mb-2', 'items-end');
    drugDiv.innerHTML = `
        <div class="w-1/3 mb-2">
            <label class="block text-sm font-medium text-gray-700">Tên thuốc</label>
            <select name="drug-id" class="drug-item-select mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm">
                <option value="">Chọn thuốc...</option>
            </select>
        </div>
        <div class="w-1/4 mb-2">
            <label class="block text-sm font-medium text-gray-700">Liều lượng</label>
            <input type="number" name="drug-dosage" step="any" class="drug-item-dosage mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Liều lượng">
        </div>
        <div class="w-1/4 mb-2">
            <label class="block text-sm font-medium text-gray-700">Đơn vị</label>
            <input type="text" name="drug-unit" class="drug-item-unit mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Đơn vị">
        </div>
        <div class="w-1/3 mb-2">
            <label class="block text-sm font-medium text-gray-700">Cách dùng</label>
            <input type="text" name="drug-usage" class="drug-item-usage mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Cách dùng">
        </div>
        <div class="w-1/4 mb-2">
            <label class="block text-sm font-medium text-gray-700">Khoảng cách liều</label>
            <input type="number" name="drug-interval" class="drug-item-interval mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Khoảng cách">
        </div>
        <div class="w-1/4 mb-2">
            <label class="block text-sm font-medium text-gray-700">Đơn vị</label>
            <select name="drug-interval-unit" class="drug-item-interval-unit mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="">Đơn vị khoảng cách...</option><option value="giờ">giờ</option><option value="phút">phút</option><option value="ngày">ngày</option></select>
        </div>
        <div class="w-1/4 mb-2">
            <label class="block text-sm font-medium text-gray-700">Liệu trình</label>
            <input type="number" name="drug-duration" class="drug-item-duration mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm" placeholder="Thời gian">
        </div>
        <div class="w-1/4 mb-2">
            <label class="block text-sm font-medium text-gray-700">Đơn vị</label>
            <select name="drug-duration-unit" class="drug-item-duration-unit mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm"><option value="">Đơn vị liệu trình...</option><option value="ngày">ngày</option><option value="lần">lần</option><option value="tuần">tuần</option></select>
        </div>
        <button type="button" class="remove-item-btn text-red-600 hover:text-red-800 transition"><i class="fas fa-minus-circle"></i></button>
    `;
    const select = drugDiv.querySelector('.drug-item-select');
    const dosageInput = drugDiv.querySelector('.drug-item-dosage');
    const unitInput = drugDiv.querySelector('.drug-item-unit');
    const usageInput = drugDiv.querySelector('.drug-item-usage');
    const intervalInput = drugDiv.querySelector('.drug-item-interval');
    const intervalUnitInput = drugDiv.querySelector('.drug-item-interval-unit');
    const durationInput = drugDiv.querySelector('.drug-item-duration');
    const durationUnitInput = drugDiv.querySelector('.drug-item-duration-unit');

    allMedicines.forEach(med => {
        const option = document.createElement('option');
        option.value = med.id;
        option.textContent = med.name;
        select.appendChild(option);
    });

    if (drug.drugId) select.value = drug.drugId;
    if (drug.dosage) dosageInput.value = drug.dosage;
    if (drug.unit) unitInput.value = drug.unit;
    if (drug.usage) usageInput.value = drug.usage;
    if (drug.interval) intervalInput.value = drug.interval;
    if (drug.intervalUnit) intervalUnitInput.value = drug.intervalUnit;
    if (drug.duration) durationInput.value = drug.duration;
    if (drug.durationUnit) durationUnitInput.value = drug.durationUnit;

    // Listener để tự động điền liều dùng và đơn vị khi chọn thuốc
    select.addEventListener('change', (e) => {
        const selectedMedId = e.target.value;
        const selectedMed = allMedicines.find(med => med.id === selectedMedId);
        if (selectedMed) {
            dosageInput.value = selectedMed.itemDosage || '';
            unitInput.value = selectedMed.itemDosageUnit || '';
            usageInput.value = selectedMed.usage || '';
        } else {
            // Xóa dữ liệu nếu không có thuốc nào được chọn
            dosageInput.value = '';
            unitInput.value = '';
            usageInput.value = '';
        }
    });

    drugDiv.querySelector('.remove-item-btn').addEventListener('click', () => {
        drugDiv.remove();
    });

    drugItemsContainer.appendChild(drugDiv);
}

function waitForMedicines() {
    return new Promise(resolve => {
        if (allMedicines.length > 0) {
            resolve();
        } else {
            const checkMedicines = setInterval(() => {
                if (allMedicines.length > 0) {
                    clearInterval(checkMedicines);
                    resolve();
                }
            }, 100);
        }
    });
}


//======================================================================
//                4. HÀM LẮNG NGHE DỮ LIỆU TỪ FIRESTORE
//======================================================================

function listenForData(type) {
    const listDiv = document.getElementById(`${type}-list`);
    const collectionPath = `users/${userId}/private/data/${type}`;
    const unsubscribe = onSnapshot(query(collection(db, collectionPath), orderBy('name')), (snapshot) => {
        let items = [];
        snapshot.forEach(doc => {
            items.push({ id: doc.id, ...doc.data() });
        });
        listDiv.innerHTML = '';
        if (items.length > 0) {
            items.forEach(item => {
                let card;
                switch (type) {
                    case 'medicines':
                    case 'supplies':
                    case 'services':
                    case 'surgeries':
                    case 'labtests':
                    case 'fasttests':
                        card = createItemCard(item, type);
                        break;
                    case 'templates':
                        card = createTemplateCard(item);
                        break;
                    case 'consultations':
                        card = createConsultationCard(item);
                        break;
                    case 'treatmentplans':
                        card = createTreatmentplanCard(item);
                        break;
                    default:
                        break;
                }
                if (card) listDiv.appendChild(card);
            });
        } else {
            listDiv.innerHTML = '<p class="text-gray-500 text-center">Chưa có dữ liệu.</p>';
        }
    }, (error) => {
        console.error("Lỗi khi lấy dữ liệu:", error);
    });
    listeners.push(unsubscribe);
}

function listenForMedicines() {
    const medicinesRef = collection(db, `users/${userId}/private/data/medicines`);
    const unsubscribe = onSnapshot(query(medicinesRef, orderBy('name')), (snapshot) => {
        allMedicines = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }, (error) => {
        console.error("Lỗi khi lấy dữ liệu thuốc:", error);
    });
    listeners.push(unsubscribe);
}


//======================================================================
//                9. XỬ LÝ SỰ KIỆN CHUNG
//======================================================================

const formHandlers = {
    'medicines-form': 'medicines', 'supplies-form': 'supplies', 'services-form': 'services',
    'surgeries-form': 'surgeries', 'labtests-form': 'labtests', 'fasttests-form': 'fasttests',
    'consultations-form': 'consultations', 'templates-form': 'templates', 'treatmentplan-form': 'treatmentplans'
};

function setupEventListeners() {
    addTemplateItemBtn.addEventListener('click', () => {
        addTemplateItem();
    });
    addConsultationItemBtn.addEventListener('click', () => {
        addConsultationItem();
    });
    addTreatmentplanBtn.addEventListener('click', () => {
        addTreatmentplanItem();
    });
    addDrugItemBtn.addEventListener('click', async () => {
        await waitForMedicines();
        addDrugItem();
    });

    document.addEventListener('click', async (e) => {
        if (!userId) { return; }
        const editBtn = e.target.closest('.edit-btn');
        const editTemplateBtn = e.target.closest('.edit-template-btn');
        const editTreatmentplanBtn = e.target.closest('.edit-treatmentplan-btn');
        const editConsultationBtn = e.target.closest('.edit-consultation-btn');
        if (editBtn) {
            const docId = editBtn.dataset.id;
            const type = editBtn.dataset.type;
            const form = document.getElementById(`${type}-form`);
            const header = document.getElementById(`${type}-section`).querySelector('.collapsible-header');
            const content = header.nextElementSibling;
            const icon = header.querySelector('.collapsible-icon');
            content.classList.add('expanded');
            icon.classList.add('expanded');
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
            const content = header.nextElementSibling;
            const icon = header.querySelector('.collapsible-icon');
            content.classList.add('expanded');
            icon.classList.add('expanded');
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
            const content = header.nextElementSibling;
            const icon = header.querySelector('.collapsible-icon');
            content.classList.add('expanded');
            icon.classList.add('expanded');
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
            const content = header.nextElementSibling;
            const icon = header.querySelector('.collapsible-icon');
            content.classList.add('expanded');
            icon.classList.add('expanded');
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

    Object.entries(formHandlers).forEach(([formId, type]) => {
        const form = document.getElementById(formId);
        if (form) {
            form.addEventListener('submit', async (e) => {
                e.preventDefault();
                if (!userId) { return; }
                const docId = form.querySelector(`input[id$="-docId"]`).value;
                let data = {};
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
                                id: select.value,
                                drugname: selectedMed ? selectedMed.name : '',
                                drugdosage: dosageInput.value,
                                drugdosageunit: unitInput.value
                            });
                        }
                    });
                    data = {
                        name: form.querySelector('#templates-name').value,
                        regimen: form.querySelector('#templates-regimen').value,
                        itemRegimenUnit: form.querySelector('#templates-regimen-unit').value,
                        note: form.querySelector('#templates-note').value,
                        medicines: medicines
                    };
                } else if (type === 'consultations') {
                    const items = [];
                    const itemElements = consultationsItemsContainer.querySelectorAll('.consultation-item-content');
                    itemElements.forEach(element => {
                        if (element.value) { items.push({ content: element.value }); }
                    });
                    data = {
                        name: form.querySelector('#consultations-name').value,
                        items: items
                    };
                } else if (type === 'treatmentplans') {
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
                    data = {
                        name: form.querySelector('#treatmentplan-name').value,
                        note: form.querySelector('#treatmentplan-note').value,
                        drugs: drugs,
                        items: items
                    };
                } else {
                    const formData = new FormData(form);
                    data = Object.fromEntries(formData.entries());
                }
                
                try {
                    const collectionPath = `users/${userId}/private/data/${type}`;
                    if (docId) { await updateDoc(doc(db, collectionPath, docId), data); alert(`Cập nhật thành công!`); }
                    else { await addDoc(collection(db, collectionPath), data); alert(`Lưu thành công!`); }
                    form.reset();
                    form.querySelector(`input[id$="-docId"]`).value = '';
                    form.querySelector('.cancel-btn').classList.add('hidden');
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
                    content.classList.add('expanded');
                    icon.classList.add('expanded');
                    setTimeout(() => {
                        const headerPosition = header.getBoundingClientRect().top + window.pageYOffset;
                        window.scrollTo({
                            top: headerPosition,
                            behavior: 'smooth'
                        });
                    }, 900); // Thời gian đủ dài để trang tải hết các phần và cuộn đến phần tiêu đề
                }
            }
        }
    });
}

//======================================================================
//                10. LOGIC XÁC THỰC
//======================================================================

const onUserLoggedIn = (uid) => {
    userId = uid;
    console.log("User logged in with ID:", userId);
    listeners.forEach(unsubscribe => unsubscribe());
    listeners = [];
    listenForData('medicines');
    listenForData('supplies');
    listenForData('services');
    listenForData('surgeries');
    listenForData('labtests');
    listenForData('fasttests');
    listenForData('consultations');
    listenForData('templates');
    listenForData('treatmentplans');
    listenForMedicines(); 
};

const onUserLoggedOut = () => {
    userId = null;
    console.log("User is not logged in.");
    listeners.forEach(unsubscribe => unsubscribe());
    listeners = [];
    const allListDivs = document.querySelectorAll('.list-container');
    allListDivs.forEach(div => {
        div.innerHTML = '<p class="text-gray-500 text-center">Vui lòng đăng nhập để xem danh sách.</p>';
    });
};

setupAuthListeners(onUserLoggedIn, onUserLoggedOut);
setupEventListeners();