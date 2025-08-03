// codeks/kiemtraks.js

// Import dữ liệu từ dataks.js
import { getAntibioticGroup, getCombinationRule, antibioticGroups, antibioticToGroupMap } from './dataks.js';

// Di chuyển khai báo allAntibiotics ra ngoài DOMContentLoaded
// để nó có thể được truy cập bởi setupAutocomplete và các hàm khác
// Lấy tất cả các kháng sinh từ các nhóm và chuyển về chữ thường để đồng bộ với data
const allAntibiotics = Array.from(antibioticToGroupMap.keys()).sort(); // Lấy trực tiếp từ Map.keys() để đảm bảo chỉ có các kháng sinh đã được map

document.addEventListener('DOMContentLoaded', () => {
    // Gắn sự kiện cho nút "Kiểm tra kết hợp"
    document.getElementById('checkCombinationBtn').addEventListener('click', checkCombination);

    const antibioticAInput = document.getElementById('antibioticA');
    const antibioticBInput = document.getElementById('antibioticB');
    const suggestionsA = document.getElementById('suggestionsA');
    const suggestionsB = document.getElementById('suggestionsB');

    // Thiết lập autocomplete cho từng ô nhập liệu
    setupAutocomplete(antibioticAInput, suggestionsA);
    setupAutocomplete(antibioticBInput, suggestionsB);

    // Đóng danh sách đề xuất khi click ra ngoài vùng autocomplete container
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            suggestionsA.style.display = 'none';
            suggestionsA.innerHTML = ''; // Xóa nội dung khi đóng
            suggestionsB.style.display = 'none';
            suggestionsB.innerHTML = ''; // Xóa nội dung khi đóng
        }
    });
});

function setupAutocomplete(inputElement, suggestionsListElement) {
    let currentFocus = -1; // Để theo dõi mục được chọn bằng phím mũi tên

    inputElement.addEventListener('input', function() {
        const inputValue = this.value.trim().toLowerCase();
        // Luôn đóng và làm rỗng danh sách hiện tại trước khi hiển thị mới
        suggestionsListElement.style.display = 'none';
        suggestionsListElement.innerHTML = '';

        if (!inputValue) {
            return false;
        }
        currentFocus = -1; // Reset focus khi có input mới

        // Lọc danh sách kháng sinh: bắt đầu bằng hoặc chứa chuỗi nhập vào
        const matchingAntibiotics = allAntibiotics.filter(antibiotic =>
            antibiotic.startsWith(inputValue) || antibiotic.includes(inputValue)
        );

        // Giới hạn số lượng đề xuất để tránh danh sách quá dài (ví dụ 10-15)
        const displayLimit = 15;
        const antibioticsToDisplay = matchingAntibiotics.slice(0, displayLimit);


        if (antibioticsToDisplay.length === 0) {
            return false;
        }

        antibioticsToDisplay.forEach(antibiotic => {
            const suggestionItem = document.createElement('div');
            // In đậm phần khớp với chuỗi tìm kiếm
            const matchIndex = antibiotic.indexOf(inputValue);
            if (matchIndex !== -1) {
                suggestionItem.innerHTML = antibiotic.substring(0, matchIndex) +
                                           "<strong>" + antibiotic.substring(matchIndex, matchIndex + inputValue.length) + "</strong>" +
                                           antibiotic.substring(matchIndex + inputValue.length);
            } else {
                // Trường hợp này lý thuyết không xảy ra nếu filter đúng, nhưng là fallback tốt
                suggestionItem.textContent = antibiotic;
            }

            suggestionItem.addEventListener('click', function() {
                inputElement.value = antibiotic; // Điền giá trị vào input
                suggestionsListElement.style.display = 'none'; // Đóng danh sách
                suggestionsListElement.innerHTML = ''; // Xóa nội dung
            });
            suggestionsListElement.appendChild(suggestionItem);
        });

        suggestionsListElement.style.display = 'block'; // Hiển thị danh sách đề xuất
    });

    // Xử lý bàn phím (mũi tên lên/xuống, Enter)
    inputElement.addEventListener('keydown', function(e) {
        let items = suggestionsListElement.getElementsByTagName('div');
        if (!items || items.length === 0) return false; // Không có đề xuất để điều hướng

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
                // Nếu không có mục nào được chọn nhưng Enter được nhấn,
                // kích hoạt nút kiểm tra
                document.getElementById('checkCombinationBtn').click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x); // Xóa active cũ
        if (currentFocus >= x.length) currentFocus = 0; // Vòng lặp xuống cuối
        if (currentFocus < 0) currentFocus = (x.length - 1); // Vòng lặp lên đầu
        x[currentFocus].classList.add("active");
        // Cuộn đến mục đang active để người dùng nhìn thấy
        x[currentFocus].scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("active");
        }
    }
}


// --- Hàm checkCombination: Logic kiểm tra và hiển thị kết quả ---
function checkCombination() {
    const antibioticA = document.getElementById('antibioticA').value.trim().toLowerCase();
    const antibioticB = document.getElementById('antibioticB').value.trim().toLowerCase();
    const resultBox = document.getElementById('result');
    const errorMessage = document.getElementById('errorMessage');

    // Reset trạng thái trước đó
    resultBox.textContent = 'Kết quả sẽ hiển thị ở đây';
    resultBox.className = 'result-box'; // Reset các lớp CSS (quan trọng để xóa các class màu)
    errorMessage.textContent = '';

    // Đóng tất cả các danh sách đề xuất khi nút được nhấn
    document.querySelectorAll('.suggestions-list').forEach(list => {
        list.style.display = 'none';
        list.innerHTML = '';
    });

    // --- 1. Kiểm tra nhập liệu trống ---
    if (!antibioticA || !antibioticB) {
        errorMessage.textContent = 'Vui lòng nhập cả hai tên kháng sinh.';
        return;
    }

    // --- 2. Kiểm tra nhập liệu giống nhau ---
    if (antibioticA === antibioticB) {
        errorMessage.textContent = 'Bạn đã nhập 2 tên kháng sinh giống nhau.';
        resultBox.textContent = 'Không cần phối hợp (kháng sinh đã trùng lặp).';
        resultBox.classList.add('neutral');
        return;
    }

    // --- 3. Xử lý các trường hợp tương tác đặc biệt (ƯU TIÊN CAO NHẤT, dựa trên TÊN kháng sinh cụ thể) ---
    // Sắp xếp để đảm bảo key nhất quán bất kể thứ tự nhập A và B
    const specificInteractionKey = [antibioticA, antibioticB].sort().join('-');
    let resultText = '';
    let resultClass = '';

    // Ví dụ về tương tác cụ thể: Ceftriaxone và Calcium
    if (specificInteractionKey === 'calcium-ceftriaxone') {
        resultText = 'ĐỐI KHÁNG NGHIÊM TRỌNG (Calcium và Ceftriaxone không được trộn lẫn trong cùng dịch truyền. Có thể gây kết tủa nguy hiểm tính mạng, đặc biệt ở trẻ sơ sinh.)';
        resultClass = 'antagonistic';
        resultBox.textContent = resultText;
        resultBox.classList.add(resultClass);
        return;
    }
    // Tương tác cụ thể: Clindamycin và Erythromycin
    if (specificInteractionKey === 'clindamycin-erythromycin') {
        resultText = 'ĐỐI KHÁNG (Clindamycin và Erythromycin có thể đối kháng do cùng vị trí tác động trên ribosome. KHÔNG NÊN PHỐI HỢP.)';
        resultClass = 'antagonistic';
        resultBox.textContent = resultText;
        resultBox.classList.add(resultClass);
        return;
    }
    // Tương tác cụ thể: Chloramphenicol và Penicillins (kiểm tra theo tên và nhóm)
    // Lưu ý: Đảm bảo "chloramphenicol" nằm trong nhóm "phenicols" trong dataks.js
    const isAChloramphenicol = antibioticA === 'chloramphenicol';
    const isBChloramphenicol = antibioticB === 'chloramphenicol';
    const isAPenicillinGroup = antibioticToGroupMap.get(antibioticA) === 'penicillins';
    const isBPenicillinGroup = antibioticToGroupMap.get(antibioticB) === 'penicillins';

    if ((isAChloramphenicol && isBPenicillinGroup) || (isBChloramphenicol && isAPenicillinGroup)) {
        resultText = 'ĐỐI KHÁNG (Chloramphenicol có thể cản trở tác dụng diệt khuẩn của Penicillins. KHÔNG NÊN PHỐI HỢP.)';
        resultClass = 'antagonistic';
        resultBox.textContent = resultText;
        resultBox.classList.add(resultClass);
        return;
    }
    // THÊM CÁC QUY TẮC CỤ THỂ KHÁC TẠI ĐÂY NẾU CẦN (ví dụ: Metronidazole-Alcohol, Sulfonamides-Methotrexate...)


    // --- 4. Kiểm tra nếu không tìm thấy thông tin cho một trong hai kháng sinh trong database ---
    // Lấy nhóm của từng kháng sinh từ Map
    const groupA = antibioticToGroupMap.get(antibioticA);
    const groupB = antibioticToGroupMap.get(antibioticB);

    if (!groupA || !groupB) {
        let missingAntibioticNames = [];
        if (!groupA) missingAntibioticNames.push(`"${antibioticA}"`);
        if (!groupB) missingAntibioticNames.push(`"${antibioticB}"`);

        errorMessage.textContent = `Không tìm thấy thông tin nhóm cho kháng sinh ${missingAntibioticNames.join(' và ')}. Có thể do bạn nhập sai tên hoặc dữ liệu của chúng tôi không có loại kháng sinh này.`;
        resultBox.textContent = 'Không xác định (Kháng sinh không có trong danh sách)';
        resultBox.classList.add('unknown');
        return;
    }

    // --- 5. Kiểm tra kháng sinh cùng nhóm (sau khi đã xử lý các trường hợp đặc biệt và xác định được nhóm) ---
    if (groupA === groupB) {
        errorMessage.textContent = 'Không nên phối hợp hai kháng sinh cùng nhóm, trừ khi có chỉ định đặc biệt từ bác sĩ. Việc phối hợp này có thể làm giảm hiệu quả điều trị, tăng nguy cơ kháng thuốc và tác dụng phụ.';
        resultBox.textContent = `CẢNH BÁO: KHÁNG SINH CÙNG NHÓM (${groupA})`;
        resultBox.classList.add('caution');
        return;
    }

    // --- 6. Áp dụng quy tắc kết hợp giữa các nhóm ---
    const rule = getCombinationRule(groupA, groupB); // Hàm này đã xử lý việc sắp xếp tên nhóm

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
            resultText = 'Không xác định (quy tắc chưa được định nghĩa trong cơ sở dữ liệu)';
            resultClass = 'unknown';
            break;
    }

    resultBox.textContent = resultText;
    resultBox.classList.add(resultClass);
}

