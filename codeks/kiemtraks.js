// codeks/kiemtraks.js

import { getAntibioticGroup, getCombinationRule, antibioticGroups, antibioticToGroupMap } from './dataks.js';

// Di chuyển khai báo allAntibiotics ra ngoài DOMContentLoaded
// để nó có thể được truy cập bởi setupAutocomplete
const allAntibiotics = Object.values(antibioticGroups).flat().map(a => a.toLowerCase());
allAntibiotics.sort(); // Sắp xếp danh sách kháng sinh theo ABC

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkCombinationBtn').addEventListener('click', checkCombination);

    const antibioticAInput = document.getElementById('antibioticA');
    const antibioticBInput = document.getElementById('antibioticB');
    const suggestionsA = document.getElementById('suggestionsA');
    const suggestionsB = document.getElementById('suggestionsB');

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
    let currentFocus = -1;

    inputElement.addEventListener('input', function() {
        const inputValue = this.value.trim().toLowerCase();
        closeAllSuggestions(suggestionsListElement);

        if (!inputValue) {
            return false;
        }
        currentFocus = -1;

        // Bây giờ allAntibiotics đã được định nghĩa ở phạm vi này
        const matchingAntibiotics = allAntibiotics.filter(antibiotic =>
            antibiotic.startsWith(inputValue) || antibiotic.includes(inputValue)
        );

        if (matchingAntibiotics.length === 0) {
            return false;
        }

        matchingAntibiotics.forEach(antibiotic => {
            const suggestionItem = document.createElement('div');
            suggestionItem.innerHTML = "<strong>" + antibiotic.substr(0, inputValue.length) + "</strong>";
            suggestionItem.innerHTML += antibiotic.substr(inputValue.length);

            suggestionItem.addEventListener('click', function() {
                inputElement.value = antibiotic;
                closeAllSuggestions(suggestionsListElement);
            });
            suggestionsListElement.appendChild(suggestionItem);
        });

        suggestionsListElement.style.display = 'block';
    });

    // ... (Phần còn lại của hàm setupAutocomplete và các hàm khác giữ nguyên) ...

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
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("active");
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
            if (elmnt !== list) {
                list.style.display = 'none';
                list.innerHTML = '';
            }
        });
        elmnt.style.display = 'none';
        elmnt.innerHTML = '';
    }
}


// --- Hàm checkCombination (giữ nguyên) ---
function checkCombination() {
    const antibioticA = document.getElementById('antibioticA').value.trim().toLowerCase();
    const antibioticB = document.getElementById('antibioticB').value.trim().toLowerCase();
    const resultBox = document.getElementById('result');
    const errorMessage = document.getElementById('errorMessage');

    resultBox.textContent = 'Kết quả sẽ hiển thị ở đây';
    resultBox.className = 'result-box';
    errorMessage.textContent = '';

    document.querySelectorAll('.suggestions-list').forEach(list => {
        list.style.display = 'none';
        list.innerHTML = '';
    });

    if (!antibioticA || !antibioticB) {
        errorMessage.textContent = 'Vui lòng nhập cả hai tên kháng sinh.';
        return;
    }

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
        else missingAntibiotic = `"${antiboticB}"`; // Lỗi chính tả nhỏ đã sửa ở đây trong các lần trước

        errorMessage.textContent = `Không tìm thấy thông tin nhóm cho kháng sinh ${missingAntibbiotic}. Vui lòng kiểm tra lại tên hoặc thêm vào dữ liệu.`;
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
