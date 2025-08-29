// script.js (cập nhật toàn bộ nội dung file này)

// Global event listener - Chỉ gán một lần duy nhất khi trang tải
const resultsDiv = document.getElementById('results');

resultsDiv.addEventListener('click', function(event) {
    if (event.target.classList.contains('update-button')) {
        const updateForm = event.target.nextElementSibling;
        updateForm.style.display = 'block';
        event.target.style.display = 'none'; // Ẩn nút "Cập nhật"
    } else if (event.target.classList.contains('save-button')) {
        const newDate = event.target.previousElementSibling.value;
        if (newDate) {
            const updateButton = event.target.parentElement.previousElementSibling;
            const index = updateButton.dataset.index;
            const type = updateButton.dataset.type;

            updateData(index, type, newDate);
            processVaccineData(type);
        }
    }
});

document.getElementById('rabiesButton').addEventListener('click', () => {
    processVaccineData('ngày tiêm phòng dại');
});

document.getElementById('sevenInOneButton').addEventListener('click', () => {
    processVaccineData('ngày tiêm phòng vaccine 7 bệnh');
});

function processVaccineData(vaccineType) {
    resultsDiv.innerHTML = '<h2>Kết quả kiểm tra:</h2>';

    // Sử dụng dữ liệu từ biến csvData trong file data.js
    const rows = csvData.split('\n').map(row => row.trim()).filter(row => row);
    const headers = rows[0].split(',').map(header => header.trim().toLowerCase());
    const dataRows = rows.slice(1);

    if (dataRows.length === 0) {
        resultsDiv.innerHTML += '<p style="color:red; text-align:center;">Không có dữ liệu để kiểm tra.</p>';
        return;
    }

    const today = new Date();
    const oneYearInMs = 365 * 24 * 60 * 60 * 1000;
    const reminderMonths = 3;
    const reminderInMs = reminderMonths * 30.44 * 24 * 60 * 60 * 1000;

    const vaccineIndex = headers.indexOf(vaccineType);
    
    let allPetsInfo = []; 

    dataRows.forEach((row, index) => {
        const columns = row.split(',').map(col => col.trim());
        if (columns.length < headers.length) return;
        
        const lastVaccineDateStr = columns[vaccineIndex];
        const petName = columns[headers.indexOf('tên thú cưng')];
        const ownerName = columns[headers.indexOf('tên chủ')];
        const contact = columns[headers.indexOf('số điện thoại')];

        const lastVaccineDate = new Date(lastVaccineDateStr);
        const timeDiff = today.getTime() - lastVaccineDate.getTime();

        let message = '';
        let statusClass = '';
        let needsAttention = false;
        
        if (timeDiff > oneYearInMs) {
            const daysOverdue = Math.floor((timeDiff - oneYearInMs) / (1000 * 60 * 60 * 24));
            message = `Đã quá hạn tiêm nhắc lại ${daysOverdue} ngày.`;
            statusClass = 'overdue';
            needsAttention = true;
        } else if (timeDiff > oneYearInMs - reminderInMs) {
            const daysUntilDue = Math.floor((oneYearInMs - timeDiff) / (1000 * 60 * 60 * 24));
            message = `Sắp đến hạn tiêm nhắc lại trong ${daysUntilDue} ngày.`;
            statusClass = 'upcoming';
            needsAttention = true;
        } else {
            message = 'Lịch tiêm phòng hiện tại ổn.';
            statusClass = 'ok';
        }
        
        const petInfo = {
            petName: petName,
            ownerName: ownerName,
            contact: contact,
            message: message,
            statusClass: statusClass,
            needsAttention: needsAttention,
            index: index
        };
        allPetsInfo.push(petInfo);
    });

    allPetsInfo.sort((a, b) => (b.needsAttention - a.needsAttention));

    let hasAttentionResults = false;
    allPetsInfo.forEach(petInfo => {
        const petInfoDiv = document.createElement('div');
        petInfoDiv.className = `pet-info ${petInfo.statusClass}`;
        
        let iconHtml = '';
        if (petInfo.statusClass === 'ok') {
            iconHtml = '<span class="status-icon check">✅</span>';
        }
        
        // Thêm các nút liên hệ nếu trạng thái là "upcoming"
        let contactButtonsHtml = '';
        if (petInfo.statusClass === 'upcoming') {
            const cleanPhoneNumber = petInfo.contact.replace(/\s/g, '');
            contactButtonsHtml = `
                <a href="tel:${cleanPhoneNumber}" class="call-button">Gọi điện</a>
                <a href="https://zalo.me/${cleanPhoneNumber}" target="_blank" class="zalo-button">Chat Zalo</a>
            `;
        }

        petInfoDiv.innerHTML = `
            <div class="content">
                <strong>Tên thú cưng:</strong> ${petInfo.petName}<br>
                <strong>Tên chủ:</strong> ${petInfo.ownerName}<br>
                <strong>Số điện thoại:</strong> ${petInfo.contact}<br>
                <strong>Thông báo:</strong> ${petInfo.message}<br>
                <div class="update-section">
                    <button class="update-button" data-index="${petInfo.index}" data-type="${vaccineType}">Cập nhật</button>
                    <div class="update-form" style="display:none;">
                        <input type="date" class="new-date-input">
                        <button class="save-button">Lưu</button>
                    </div>
                    ${contactButtonsHtml}
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
        resultsDiv.innerHTML += '<p style="text-align:center;">Không có thú cưng nào cần tiêm nhắc lại trong danh sách này.</p>';
    }

    // Thêm nút tải xuống CSV
    const downloadButton = document.createElement('button');
    downloadButton.textContent = 'Tải xuống CSV đã cập nhật';
    downloadButton.style.marginTop = '20px';
    downloadButton.style.backgroundColor = '#28a745';
    downloadButton.style.color = '#fff';
    downloadButton.addEventListener('click', downloadUpdatedCSV);
    resultsDiv.appendChild(downloadButton);
}

// ... Giữ nguyên các hàm updateData và downloadUpdatedCSV ...