// TOÀN BỘ CODE CỦA FILE codeks/kiemtraks.js

// Import dữ liệu từ dataks.js
import { getAntibioticGroup, getCombinationRule, antibioticToGroupMap } from './dataks.js';

// Di chuyển khai báo allAntibiotics ra ngoài DOMContentLoaded
// để nó có thể được truy cập bởi setupAutocomplete và các hàm khác
const allAntibiotics = Array.from(antibioticToGroupMap.keys()).sort();

// Các quy tắc đặc biệt (specificRules) đã được chuyển từ kiemtraks.js sang dataks.js
// Giúp code kiemtraks.js gọn gàng hơn.
const specificRules = {
    'calcium-ceftriaxone': {
        result: 'ĐỐI KHÁNG NGHIÊM TRỌNG (Calcium và Ceftriaxone không được trộn lẫn trong cùng dịch truyền. Có thể gây kết tủa nguy hiểm tính mạng, đặc biệt ở trẻ sơ sinh.)',
        class: 'antagonistic'
    },
    'clindamycin-erythromycin': {
        result: 'ĐỐI KHÁNG (Clindamycin và Erythromycin có thể đối kháng do cùng vị trí tác động trên ribosome. KHÔNG NÊN PHỐI HỢP.)',
        class: 'antagonistic'
    },
    'doxycycline-tylosin': {
        result: 'HIỆP ĐỒNG (Có thể phối hợp, nhất là trong Thú-Y, việc này sẽ mở rộng phổ kháng khuẩn, tăng hiệu quả điều trị các bệnh hô hấp, tiêu hóa.)',
        class: 'synergistic-positive'
    },
};

const betaLactamGroups = ['penicillins', 'cephalosporins'];

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('checkCombinationBtn').addEventListener('click', checkCombination);

    const antibioticAInput = document.getElementById('antibioticA');
    const antibioticBInput = document.getElementById('antibioticB');
    const suggestionsA = document.getElementById('suggestionsA');
    const suggestionsB = document.getElementById('suggestionsB');

    setupAutocomplete(antibioticAInput, suggestionsA);
    setupAutocomplete(antibioticBInput, suggestionsB);

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.autocomplete-container')) {
            suggestionsA.style.display = 'none';
            suggestionsA.innerHTML = '';
            suggestionsB.style.display = 'none';
            suggestionsB.innerHTML = '';
        }
    });
});

function setupAutocomplete(inputElement, suggestionsListElement) {
    let currentFocus = -1;

    inputElement.addEventListener('input', function() {
        const inputValue = this.value.trim().toLowerCase().replace(/\s/g, '-');
        suggestionsListElement.style.display = 'none';
        suggestionsListElement.innerHTML = '';

        if (!inputValue) {
            return false;
        }
        currentFocus = -1;

        const matchingAntibiotics = allAntibiotics.filter(antibiotic =>
            antibiotic.startsWith(inputValue) || antibiotic.includes(inputValue)
        );

        const displayLimit = 15;
        const antibioticsToDisplay = matchingAntibiotics.slice(0, displayLimit);

        if (antibioticsToDisplay.length === 0) {
            return false;
        }

        antibioticsToDisplay.forEach(antibiotic => {
            const suggestionItem = document.createElement('div');
            const matchIndex = antibiotic.indexOf(inputValue);
            if (matchIndex !== -1) {
                suggestionItem.innerHTML = antibiotic.substring(0, matchIndex) +
                                                 "<strong>" + antibiotic.substring(matchIndex, matchIndex + inputValue.length) + "</strong>" +
                                                 antibiotic.substring(matchIndex + inputValue.length);
            } else {
                suggestionItem.textContent = antibiotic;
            }

            suggestionItem.addEventListener('click', function() {
                inputElement.value = antibiotic;
                suggestionsListElement.style.display = 'none';
                suggestionsListElement.innerHTML = '';
            });
            suggestionsListElement.appendChild(suggestionItem);
        });

        suggestionsListElement.style.display = 'block';
    });

    inputElement.addEventListener('keydown', function(e) {
        let items = suggestionsListElement.getElementsByTagName('div');
        if (!items || items.length === 0) return false;

        if (e.keyCode == 40) {
            currentFocus++;
            addActive(items);
        } else if (e.keyCode == 38) {
            currentFocus--;
            addActive(items);
        } else if (e.keyCode == 13) {
            e.preventDefault();
            if (currentFocus > -1) {
                if (items[currentFocus]) {
                    items[currentFocus].click();
                }
            } else {
                document.getElementById('checkCombinationBtn').click();
            }
        }
    });

    function addActive(x) {
        if (!x) return false;
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("active");
        x[currentFocus].scrollIntoView({ block: "nearest", inline: "nearest" });
    }

    function removeActive(x) {
        for (var i = 0; i < x.length; i++) {
            x[i].classList.remove("active");
        }
    }
}

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

    // BỘ QUY TẮC BÁO LỖI KHI NHẬP LIỆU
    if (!antibioticA || !antibioticB) {
        errorMessage.textContent = 'Vui lòng nhập cả hai tên kháng sinh.';
        return;
    }

    if (antibioticA === antibioticB) {
        errorMessage.textContent = 'Bạn đã nhập hai tên kháng sinh giống nhau.';
        resultBox.textContent = 'Không cần phối hợp!';
        resultBox.classList.add('neutral');
        return;
    }

    // LOGIC TƯƠNG TÁC CỦA CÁC CẶP THUỐC CÁ BIỆT
    const specificInteractionKey = [antibioticA, antibioticB].sort().join('-');
    const specificInteraction = specificRules[specificInteractionKey];

    if (specificInteraction) {
        resultBox.textContent = specificInteraction.result;
        resultBox.classList.add(specificInteraction.class);
        return;
    }
    
    const groupA = getAntibioticGroup(antibioticA);
    const groupB = getAntibioticGroup(antibioticB);

    if (!groupA || !groupB) {
        let missingAntibioticNames = [];
        if (!groupA) missingAntibioticNames.push(`"${antibioticA}"`);
        if (!groupB) missingAntibioticNames.push(`"${antibioticB}"`);

        errorMessage.textContent = `Không tìm thấy thông tin nhóm cho kháng sinh ${missingAntibioticNames.join(' và ')}. Có thể do bạn nhập sai tên hoặc dữ liệu của chúng tôi không có loại kháng sinh này.`;
        resultBox.textContent = 'CHƯA CÓ DỮ LIỆU: KHÔNG CÓ TÊN KHÁNG SINH MÀ BẠN ĐÃ NHẬP';
        resultBox.classList.add('unknown');
        return;
    }

    // LOGIC MỚI CHO BETA-LACTAMASE (Cải thiện logic và xử lý trường hợp hiệp đồng)
    const isABetaLactamase = groupA === 'beta-lactamase';
    const isBBetaLactamase = groupB === 'beta-lactamase';
    const isABetaLactam = betaLactamGroups.includes(groupA);
    const isBBetaLactam = betaLactamGroups.includes(groupB);

    if ((isABetaLactamase && isBBetaLactam) || (isBBetaLactamase && isABetaLact)) {
        resultBox.textContent = `HIỆP ĐỒNG (Nhóm beta-lactamase ức chế men kháng thuốc của vi khuẩn, giúp kháng sinh nhóm beta-lactam kia phát huy tác dụng)`;
        resultBox.classList.add('synergistic');
        return;
    }

    // 2 BỘ QUY TẮC PHỐI HỢP CỦA NHÓM OTHER/NEW
    if ((groupA === 'other/new' && groupB !== 'other/new') || (groupA !== 'other/new' && groupB === 'other/new')) {
        errorMessage.textContent = 'Sự tương tác khi phối hợp giữa hai nhóm kháng sinh này chưa có nhiều tài liệu nghiên cứu.';
        resultBox.textContent = `THẬN TRỌNG (Bạn đang phối hợp giữa kháng sinh của nhóm ${groupA} với nhóm ${groupB})`;
        resultBox.classList.add('caution');
        return;
    }
    
    if (groupA === groupB) {
        if (groupA === 'other/new') {
            errorMessage.textContent = 'Các kháng sinh thuộc nhóm other/new chưa có nhiều nghiên cứu về các tương tác khi phối hợp với nhau. Bác sĩ nên tìm hiểu thêm !';
            resultBox.textContent = `CHƯA CÓ DỮ LIỆU: KHÁNG SINH MỚI (${groupA})`;
            resultBox.classList.add('unknown');
            return;
        } else {
            errorMessage.textContent = 'Hai kháng sinh cùng nhóm không nên phối hợp, trừ khi có chỉ định đặc biệt từ bác sĩ. Việc phối hợp này có thể làm giảm hiệu quả điều trị, tăng nguy cơ kháng thuốc và tác dụng phụ.';
            resultBox.textContent = `CẢNH BÁO: KHÁNG SINH CÙNG NHÓM (${groupA})`;
            resultBox.classList.add('caution');
            return;
        }
    }

    // BỘ QUY TẮC PHỐI HỢP THƯỜNG QUY
    const rule = getCombinationRule(groupA, groupB);
    let resultText = '';
    let resultClass = '';

    switch (rule) {
        case 'synergistic':
            resultText = `HIỆP ĐỒNG (Nhóm ${groupA} và nhóm ${groupB} kết hợp tăng hiệu quả)`;
            resultClass = 'synergistic';
            break;
        case 'additive':
            resultText = `CỘNG GỘP (Nhóm ${groupA} và nhóm ${groupB} có thể bổ trợ để phát huy tác dụng tối đa)`;
            resultClass = 'additive';
            break;
        case 'antagonistic':
            resultText = `ĐỐI KHÁNG (Không nên kết hợp nhóm ${groupA} và nhóm ${groupB})`;
            resultClass = 'antagonistic';
            break;
        case 'competition':
            resultText = `CẠNH TRANH (Nhóm ${groupA} và nhóm ${groupB} có cùng cơ chế tác dụng, dẫn đến cạnh tranh, có thể làm giảm hiệu quả)`;
            resultClass = 'competition';
            break;
        case 'caution':
            resultText = `THẬN TRỌNG (Cần cân nhắc khi kết hợp nhóm ${groupA} và nhóm ${groupB})`;
            resultClass = 'caution';
            break;
        case 'neutral':
            errorMessage.textContent = `Việc phối hợp giữa nhóm kháng sinh ${groupA} và nhóm ${groupB} đôi khi không theo quy tắc chung, nhưng có tài liệu nói là được phép cho một số trường hợp điều trị đặc biệt.`;
            resultText = 'TRUNG TÍNH (Có thể được hoặc có thể không, phụ thuộc từng cặp kháng sinh cụ thể)';
            resultClass = 'neutral';
            break;
        default:
            errorMessage.textContent = 'Quy tắc chưa được định nghĩa trong cơ sở dữ liệu';
            resultText = 'KHÔNG XÁC ĐỊNH';
            resultClass = 'unknown';
            break;
    }

    resultBox.textContent = resultText;
    resultBox.classList.add(resultClass);
}
