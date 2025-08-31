// Global event listener - Chỉ gán một lần duy nhất khi trang tải
const resultsDiv = document.getElementById('results');
const totalPetsCountElement = document.getElementById('total-pets-count');

resultsDiv.addEventListener('click', function(event) {
    if (event.target.classList.contains('update-button')) {
        const updateSection = event.target.closest('.update-section');
        const updateForm = updateSection.querySelector('.update-form');
        
        updateForm.classList.remove('hidden'); // Hiển thị form
        
        const buttonGroup = event.target.closest('.button-group-row');
        buttonGroup.classList.add('hidden'); // Ẩn nhóm nút
        
    } else if (event.target.classList.contains('save-button')) {
        const newDate = event.target.previousElementSibling.value;
        if (newDate) {
            const updateSection = event.target.closest('.update-section');
            const updateButton = updateSection.querySelector('.update-button');

            const index = updateButton.dataset.index;
            const type = updateButton.dataset.type;

            updateData(index, type, newDate);
            processVaccineData(type); // Gọi lại để cập nhật hiển thị
        }
    } else if (event.target.classList.contains('cancel-button')) {
        const updateSection = event.target.closest('.update-section');
        const updateForm = updateSection.querySelector('.update-form');
        const buttonGroup = updateSection.querySelector('.button-group-row');
        
        updateForm.classList.add('hidden'); // Ẩn form nhập liệu
        buttonGroup.classList.remove('hidden'); // Hiển thị lại nhóm nút ban đầu
    }
});

document.getElementById('rabiesButton').addEventListener('click', () => {
    processVaccineData('ngày tiêm phòng dại', 'all'); // 'all' để hiển thị cả chó và mèo
});

document.getElementById('sevenInOneButton').addEventListener('click', () => {
    processVaccineData('ngày tiêm phòng vaccine 7 bệnh', 'dog');
});

document.getElementById('fourInOneButton').addEventListener('click', () => {
    processVaccineData('ngày tiêm phòng vaccine 4 bệnh', 'cat');
});

function countTotalPets() {
    if (typeof csvData !== 'undefined') {
        const rows = csvData.split('\n').map(row => row.trim()).filter(row => row);
        const dataRows = rows.slice(1);
        totalPetsCountElement.textContent = `Cập nhật mới nhất: có ${dataRows.length} thú cưng trong danh sách.`;
    }
}

function processVaccineData(vaccineType, speciesFilter) {
    let headerText = '';
    if (vaccineType === 'ngày tiêm phòng dại') {
        headerText = 'Kết quả Tiêm phòng Dại cho Cún & Mèo';
    } else if (vaccineType === 'ngày tiêm phòng vaccine 7 bệnh') {
        headerText = 'Kết quả Tiêm phòng 7 bệnh cho Cún';
    } else if (vaccineType === 'ngày tiêm phòng vaccine 4 bệnh') {
        headerText = 'Kết quả Tiêm phòng 4 bệnh cho Mèo';
    }

    resultsDiv.innerHTML = `<h2 class="text-blue-500 text-center text-xl font-bold">${headerText}</h2>`;

    const rows = csvData.split('\n').map(row => row.trim()).filter(row => row);
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
        resultsDiv.innerHTML += '<p class="text-red-500 text-center">Không có dữ liệu để kiểm tra.</p>';
        return;
    }

    const today = new Date();
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    const reminderMonths = 3;
    const reminderInMs = reminderMonths * 30.44 * 24 * 60 * 60 * 1000;

    const vaccineIndex = headers.indexOf(vaccineType);
    const speciesIndex = headers.indexOf('loại vật nuôi');

    let allPetsInfo = [];

    dataRows.forEach((row, index) => {
        const columns = row.split(',').map(col => col.trim());
        if (columns.length < headers.length) return;

        const species = columns[speciesIndex].toLowerCase();
        
        // Bỏ qua nếu không đúng loại vật nuôi được lọc
        if (speciesFilter === 'dog' && species !== 'chó') {
            return;
        }
        if (speciesFilter === 'cat' && species !== 'mèo') {
            return;
        }

        const lastVaccineDateStr = columns[vaccineIndex];
        
        if (!lastVaccineDateStr) {
            // Nếu không có dữ liệu vaccine cho loại này, bỏ qua thú cưng này
            return;
        }

        const petName = columns[headers.indexOf('tên thú cưng')];
        const ownerName = columns[headers.indexOf('tên chủ')];
        const contact = columns[headers.indexOf('số điện thoại')];

        const lastVaccineDate = new Date(lastVaccineDateStr);
        const timeDiff = today.getTime() - lastVaccineDate.getTime();

        let message = '';
        let statusColorClass = '';
        let needsAttention = false;
        
        if (timeDiff > oneYearInMs) {
            const daysOverdue = Math.floor((timeDiff - oneYearInMs) / (1000 * 60 * 60 * 24));
            message = `Đã quá hạn tiêm nhắc lại ${daysOverdue} ngày.`;
            statusColorClass = 'border-red-500 bg-red-100';
            needsAttention = true;
        } else if (timeDiff > oneYearInMs - reminderInMs) {
            const daysUntilDue = Math.floor((oneYearInMs - timeDiff) / (1000 * 60 * 60 * 24));
            message = `Sắp đến hạn tiêm nhắc lại trong ${daysUntilDue} ngày.`;
            statusColorClass = 'border-yellow-500 bg-yellow-100';
            needsAttention = true;
        } else {
            message = 'Đã tiêm đúng lịch.';
            statusColorClass = 'border-green-500 bg-green-100';
        }
        
        const petInfo = {
            petName: petName,
            ownerName: ownerName,
            contact: contact,
            message: message,
            statusColorClass: statusColorClass,
            needsAttention: needsAttention,
            index: index,
            species: species // Thêm loại vật nuôi vào petInfo
        };
        allPetsInfo.push(petInfo);
    });

    allPetsInfo.sort((a, b) => (b.needsAttention - a.needsAttention));

    let hasAttentionResults = false;
    allPetsInfo.forEach(petInfo => {
        const petInfoDiv = document.createElement('div');
        petInfoDiv.className = `p-4 mb-4 border rounded-md flex justify-between items-start relative transition-colors ${petInfo.statusColorClass}`;
        
        let iconHtml = '';
        // Icon xác nhận cập nhật
        if (petInfo.index == updatedIndex && petInfo.statusColorClass === 'border-green-500 bg-green-100') {
             // Thêm thuộc tính title để hiện chú thích khi trỏ chuột vào
             iconHtml = '<span class="absolute top-4 right-4 text-green-500 text-3xl" title="Vừa cập nhật ngày tiêm vaccine"><i class="ti ti-calendar-check"></i></span>';
        }
        
        // Icon loài vật nuôi
        let speciesIconHtml = '';
        if (petInfo.species === 'chó') {
            speciesIconHtml = '<i class="fa-solid fa-dog text-3xl mr-2 text-[#ff9900]"></i>'; // Icon chó
        } else if (petInfo.species === 'mèo') {
            speciesIconHtml = '<i class="fa-solid fa-cat text-3xl mr-2 text-[#4548ff]"></i>'; // Icon mèo
        }


        let contactButtonsHtml = '';
        if (petInfo.statusColorClass.includes('border-yellow-500') || petInfo.statusColorClass.includes('border-red-500')) {
            const cleanPhoneNumber = petInfo.contact.replace(/\s/g, '');
            // Các nút con sẽ tự động co giãn trong Flexbox
            contactButtonsHtml = `
                <a href="tel:${cleanPhoneNumber}" class="flex items-center justify-center p-2 text-sm rounded-md cursor-pointer border-none text-white transition-colors bg-[#ff9429] hover:bg-[#fa6000] flex-1">Gọi điện</a>
                <a href="https://zalo.me/${cleanPhoneNumber}" target="_blank" class="flex items-center justify-center p-2 text-sm rounded-md cursor-pointer border-none text-white transition-colors bg-[#0088cc] hover:bg-[#006699] flex-1">Chat Zalo</a>
            `;
        }
        
        // Cấu trúc mới với các class Tailwind
        petInfoDiv.innerHTML = `
            <div class="flex-grow">
                <div class="flex items-center mb-2">
                    ${speciesIconHtml} 
                    <strong class="text-lg">${petInfo.petName}</strong>
                </div>
                <strong>Tên chủ:</strong> ${petInfo.ownerName}<br>
                <strong>Số điện thoại:</strong> ${petInfo.contact}<br>
                <strong>Tình trạng tiêm phòng:</strong> ${petInfo.message}<br>
                <div class="mt-4 update-section">
                    <div class="flex flex-col sm:flex-row gap-2 button-group-row">
                        <button class="flex items-center justify-center p-2 text-sm rounded-md cursor-pointer border-none text-white transition-colors bg-[#ff6363] hover:bg-[#d62222] update-button" data-index="${petInfo.index}" data-type="${vaccineType}">Cập nhật lại ngày tiêm</button>
                        <div class="flex flex-1 gap-2">
                            ${contactButtonsHtml}
                        </div>
                    </div>
                    <div class="mt-2 flex gap-2 hidden update-form">
                        <input type="date" class="p-2 text-sm border border-[#ccc] rounded-md flex-grow">
                        <button class="flex items-center justify-center p-2 text-sm rounded-md cursor-pointer border-none text-white transition-colors bg-[#28a745] hover:bg-[#218838] save-button">Lưu</button>
                        <button class="flex items-center justify-center p-2 text-sm rounded-md cursor-pointer border-none text-white transition-colors bg-[#6c757d] hover:bg-[#5a6268] cancel-button">Hủy</button>
                    </div>
                </div>
            </div>
            ${iconHtml}
        `;
        resultsDiv.appendChild(petInfoDiv);
        if (petInfo.needsAttention) {
            hasAttentionResults = true;
        }
    });

    if (!hasAttentionResults) {
        resultsDiv.innerHTML += '<p class="text-center">Không có thú cưng nào cần tiêm nhắc lại trong danh sách này.</p>';
    }

    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Tải file CSV vừa cập nhật';
    downloadButton.className = 'w-full mt-5 py-2 px-4 text-white bg-green-600 hover:bg-green-700 rounded-md cursor-pointer';
    downloadButton.addEventListener('click', downloadUpdatedCSV);
    resultsDiv.appendChild(downloadButton);
}

let updatedIndex = null;

function updateData(index, type, newDate) {
    let rows = csvData.split('\n');
    let headers = rows[0].split(',').map(h => h.trim().toLowerCase());
    let columns = rows[parseInt(index) + 1].split(',').map(col => col.trim());

    const vaccineIndex = headers.indexOf(type);
    columns[vaccineIndex] = newDate;

    rows[parseInt(index) + 1] = columns.join(',');
    csvData = rows.join('\n');
    
    updatedIndex = index;
}

function downloadUpdatedCSV() {
    const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "data_updated.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

window.onload = countTotalPets;