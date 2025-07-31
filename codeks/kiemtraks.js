// codeks/kiemtraks.js

import { getAntibioticGroup, getCombinationRule, antibioticGroups, antibioticToGroupMap } from './dataks.js';

document.addEventListener('DOMContentLoaded', () => {
    // Gắn sự kiện cho nút "Kiểm tra kết hợp"
    document.getElementById('checkCombinationBtn').addEventListener('click', checkCombination);

    const antibioticAInput = document.getElementById('antibioticA');
    const antibioticBInput = document.getElementById('antibioticB');
    const suggestionsA = document.getElementById('suggestionsA');
    const suggestionsB = document.getElementById('suggestionsB');

    // Lấy tất cả tên kháng sinh và chuyển về chữ thường để tìm kiếm
    const allAntibiotics = Object.values(antibioticGroups).flat().map(a => a.toLowerCase());
    // Sắp xếp danh sách kháng sinh theo ABC để hiển thị đẹp hơn
    allAntibiotics.sort();

    // Thiết lập autocomplete cho từng ô nhập liệu
    setupAutocomplete(antibioticAInput, suggestionsA);
    setupAutocomplete(antibioticBInput, suggestionsB);

    // Đóng danh sách đề xuất khi click ra ngoài
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            suggestionsA.style.display = 'none';
            suggestionsB.style.display = 'none';
        }
    });
});

function setupAutocomplete(inputElement, suggestionsListElement) {
    let currentFocus = -1; // Để theo dõi mục được chọn bằng phím mũi tên

    inputElement.addEventListener('input', function() {
        const inputValue = this.value.trim().toLowerCase();
        closeAllSuggestions(suggestionsListElement); // Đóng danh sách cũ trước

        if (!inputValue) {
            return false;
        }
        currentFocus = -1; // Reset focus khi có input mới

        const matchingAntibiotics = allAntibiotics.filter(antibiotic =>
            antibiotic.startsWith(inputValue) || antibiotic.includes(inputValue) // Có thể tìm theo bắt đầu hoặc chứa chuỗi
        );

        if (matchingAntibiotics.length === 0) {
            return false;
        }

        matchingAntibiotics.forEach(antibiotic => {
            const suggestionItem = document.createElement('div');
            suggestionItem.innerHTML = "<strong>" + antibiotic.substr(0, inputValue.length) + "</strong>";
            suggestionItem.innerHTML += antibiotic.substr(inputValue.length);
            // suggestionItem.innerHTML += "<input type='hidden' value='" + antibiotic + "'>"; // Thêm input ẩn để dễ lấy giá trị

            suggestionItem.addEventListener('click', function() {
                inputElement.value = antibiotic;
                closeAllSuggestions(suggestionsListElement);
            });
            suggestionsListElement.appendChild(suggestionItem);
        });

        suggestionsListElement.style.display = 'block'; // Hiển thị danh sách đề xuất
    });

    // Xử lý bàn phím (mũi tên lên/xuống, Enter)
    inputElement.addEventListener('keydown', function(e) {
        let items = suggestionsListElement.getElementsByTagName('div');
        if (e.keyCode == 40) { // Mũi tên xuống
            currentFocus++;
            addActive(items);
        } else if (e.keyCode == 38) { // Mũi tên lên
            currentFocus--;
            addActive(items);
        } else if (e.keyCode == 13) { // Enter
            e.preventDefault(); // Ngăn submit form (nếu có)
            if (currentFocus > -1) {
                if (items[currentFocus]) {
                    items[currentFocus].click(); // Giả lập click vào mục đang active
                }
            } else {
                // Nếu không có mục nào được chọn, cứ để hàm checkCombination chạy
                // document.getElementById('checkCombinationBtn').click(); // Có thể kích hoạt nút kiểm tra
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x); // Xóa active cũ
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("active");
        // Cuộn đến mục đang active (tùy chọn)
        x[currentFocus].scrollIntoView({ block: "nearest" });
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("active");
        }
    }

    function closeAllSuggestions(elmnt) {
        const lists = document.querySelectorAll('.suggestions-list');
        lists.forEach(list => {
            if (elmnt !== list) { // Đóng tất cả trừ danh sách hiện tại (nếu có nhiều)
                list.style.display = 'none';
                list.innerHTML = '';
            }
        });
        // Luôn đóng và làm rỗng danh sách hiện tại
        elmnt.style.display = 'none';
        elmnt.innerHTML = '';
    }
}


// --- Hàm checkCombination (giữ nguyên hoặc cập nhật nếu có thay đổi) ---
function checkCombination() {
    const antibioticA = document.getElementById('antibioticA').value.trim().toLowerCase();
    const antibioticB = document.getElementById('antibioticB').value.trim().toLowerCase();
    const resultBox = document.getElementById('result');
    const errorMessage = document.getElementById('errorMessage');

    // Reset trạng thái trước đó
    resultBox.textContent = 'Kết quả sẽ hiển thị ở đây';
    resultBox.className = 'result-box'; // Reset các lớp CSS
    errorMessage.textContent = '';

    // Đóng tất cả các danh sách đề xuất khi nút được nhấn
    document.querySelectorAll('.suggestions-list').forEach(list => {
        list.style.display = 'none';
        list.innerHTML = '';
    });

    if (!antibioticA || !antibioticB) {
        errorMessage.textContent = 'Vui lòng nhập cả hai tên kháng sinh.';
        return;
    }

    // ĐÃ SỬA LỖI CHÍNH TẢ TẠI ĐÂY
    const groupA = getAntibioticGroup(antibioticA);
    const groupB = getAntibioticGroup(antibioticB);

    let resultText = '';
    let resultClass = '';

    const specificInteractionKey = [antibioticA, antibioticB].sort().join('-');
    if (specificInteractionKey === 'ceftriaxone-calcium') {
        resultText = 'ĐỐI KHÁNG (Ceftriaxone và Calcium không được trộn lẫn trong cùng dịch truyền)';
        resultClass = 'antagonistic';
        resultBox.textContent = resultText;
        resultBox.classList.add(resultClass);
        return;
    }

    if (!groupA || !groupB) {
        let missingAntibiotic = '';
        if (!groupA && !groupB) missingAntibiotic = `"${antibioticA}" và "${antibioticB}"`;
        else if (!groupA) missingAntibiotic = `"${antibioticA}"`;
        else missingAntibiotic = `"${antibioticB}"`;

        errorMessage.textContent = `Không tìm thấy thông tin nhóm cho kháng sinh ${missingAntibiotic}. Vui lòng kiểm tra lại tên hoặc thêm vào dữ liệu.`;
        resultClass = 'unknown';
        resultBox.classList.add(resultClass);
        resultBox.textContent = 'Không xác định (thiếu dữ liệu)';
        return;
    }

    const rule = getCombinationRule(groupA, groupB);

    switch (rule) {
        case 'synergistic':
            resultText = `HIỆP ĐỒNG (Nhóm ${groupA} và nhóm ${groupB} kết hợp tăng hiệu quả)`;
            resultClass = 'synergistic-positive';
            break;
        case 'additive':
            resultText = `HIỆP LỰC (Nhóm ${groupA} và nhóm ${groupB} có thể bổ trợ)`;
            resultClass = 'additive-positive';
            break;
        case 'antagonistic':
            resultText = `ĐỐI KHÁNG (Không nên kết hợp nhóm ${groupA} và nhóm ${groupB})`;
            resultClass = 'antagonistic';
            break;
        case 'caution':
            resultText = `THẬN TRỌNG (Cần cân nhắc khi kết hợp nhóm ${groupA} và nhóm ${groupB})`;
            resultClass = 'caution';
            break;
        case 'neutral':
            resultText = `TRUNG TÍNH (Nhóm ${groupA} và nhóm ${groupB} không có tương tác đáng kể được biết)`;
            resultClass = 'neutral';
            break;
        default:
            resultText = 'Không xác định (quy tắc chưa được định nghĩa)';
            resultClass = 'unknown';
            break;
    }

    resultBox.textContent = resultText;
    resultBox.classList.add(resultClass);
}
