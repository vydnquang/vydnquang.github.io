// codeks/kiemtraks.js

// Import dữ liệu từ dataks.js (nằm cùng thư mục)
import { getAntibioticGroup, getCombinationRule, antibioticGroups, antibioticToGroupMap } from './dataks.js';

document.addEventListener('DOMContentLoaded', () => {
    // Gắn sự kiện cho nút "Kiểm tra kết hợp"
    document.getElementById('checkCombinationBtn').addEventListener('click', checkCombination);

    // Gắn sự kiện cho input để gợi ý tên kháng sinh (tùy chọn)
    const antibioticAInput = document.getElementById('antibioticA');
    const antibioticBInput = document.getElementById('antibioticB');

    const allAntibiotics = Object.values(antibioticGroups).flat().map(a => a.toLowerCase());

    function setupAutocomplete(inputElement) {
        inputElement.addEventListener('input', () => {
            const inputValue = inputElement.value.toLowerCase();
            const matchedAntibiotic = allAntibiotics.find(a => a.startsWith(inputValue));
            // Bạn có thể triển khai logic hiển thị gợi ý tại đây
            // console.log(`Gợi ý cho ${inputValue}: ${matchedAntibiotic}`);
        });
    }
    setupAutocomplete(antibioticAInput);
    setupAutocomplete(antibioticBInput);
});

function checkCombination() {
    const antibioticA = document.getElementById('antibioticA').value.trim().toLowerCase();
    const antibioticB = document.getElementById('antibioticB').value.trim().toLowerCase();
    const resultBox = document.getElementById('result');
    const errorMessage = document.getElementById('errorMessage');

    // Reset trạng thái trước đó
    resultBox.textContent = 'Kết quả sẽ hiển thị ở đây';
    resultBox.className = 'result-box'; // Reset các lớp CSS
    errorMessage.textContent = '';

    if (!antibioticA || !antibioticB) {
        errorMessage.textContent = 'Vui lòng nhập cả hai tên kháng sinh.';
        return;
    }

    // Lấy nhóm của từng kháng sinh (Đã sửa lỗi chính tả tại đây)
const groupA = getAntibioticGroup(antibioticA); // Đúng: 'antibioticA'
    const groupB = getAntibioticGroup(antibioticB); // Đúng: 'antibioticB'

    let resultText = '';
    let resultClass = '';

    // Xử lý các trường hợp đặc biệt trước (ví dụ: tương tác giữa Ceftriaxone và Calcium)
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
        resultClass = 'unknown'; // Kết quả không xác định vì thiếu dữ liệu
        resultBox.classList.add(resultClass);
        resultBox.textContent = 'Không xác định (thiếu dữ liệu)';
        return;
    }

    // Lấy quy tắc kết hợp giữa hai nhóm
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