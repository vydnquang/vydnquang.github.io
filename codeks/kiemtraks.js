// TOÀN BỘ CODE CỦA FILE codeks/kiemtraks.js đã được chỉnh sửa

// Import dữ liệu từ dataks.js
// Sửa đường dẫn tương đối thành tuyệt đối để tránh lỗi
import { getAntibioticGroup, getCombinationRule, antibioticToGroupMap } from 'https://vydnquang.github.io/codeks/dataks.js';

// Di chuyển khai báo allAntibiotics ra ngoài DOMContentLoaded
const allAntibiotics = Array.from(antibioticToGroupMap.keys()).sort();

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
    'chloramphenicol-penicillins': {
        result: 'ĐỐI KHÁNG (Chloramphenicol có thể cản trở tác dụng diệt khuẩn của penicillin do ngăn cản tổng hợp peptidoglycan, khiến vi khuẩn vẫn ở trạng thái tĩnh. KHÔNG NÊN PHỐI HỢP.)',
        class: 'antagonistic'
    },
    'chloramphenicol-cephalosporins': {
        result: 'ĐỐI KHÁNG (Chloramphenicol có thể cản trở tác dụng diệt khuẩn của cephalosporin do ngăn cản tổng hợp peptidoglycan, khiến vi khuẩn vẫn ở trạng thái tĩnh. KHÔNG NÊN PHỐI HỢP.)',
        class: 'antagonistic'
    },
    'macrolides-chloramphenicol': {
        result: 'ĐỐI KHÁNG (Cả hai đều tác động lên tiểu đơn vị 50S của ribosome, cạnh tranh nhau và làm giảm hiệu quả. KHÔNG NÊN PHỐI HỢP.)',
        class: 'antagonistic'
    },
    'fluoroquinolones-macrolides': {
        result: 'CỘNG GỘP (Nhóm Fluoroquinolones và Macrolides có thể kết hợp với nhau do có cơ chế tác động khác nhau, nhưng đều nhắm vào nhân của tế bào vi khuẩn)',
        class: 'additive'
    },
    'fluoroquinolones-tetracyclines': {
        result: 'CỘNG GỘP (Nhóm Fluoroquinolones và Tetracyclines có thể kết hợp với nhau do có cơ chế tác động khác nhau, nhưng đều nhắm vào nhân của tế bào vi khuẩn)',
        class: 'additive'
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Lấy các phần tử DOM
    const antibioticAInput = document.getElementById('antibioticA');
    const antibioticBInput = document.getElementById('antibioticB');
    const suggestionsA = document.getElementById('suggestionsA');
    const suggestionsB = document.getElementById('suggestionsB');
    const checkBtn = document.getElementById('checkCombinationBtn');
    const resultBox = document.getElementById('result');
    const errorMessage = document.getElementById('errorMessage');

    // Hàm hiển thị gợi ý
    const showSuggestions = (input, suggestionsBox, currentAntibiotic) => {
        const value = input.value.toLowerCase();
        suggestionsBox.innerHTML = '';
        if (value.length === 0) {
            suggestionsBox.style.display = 'none';
            return;
        }

        const filtered = allAntibiotics.filter(antibiotic => 
            antibiotic.toLowerCase().includes(value)
        );

        if (filtered.length > 0) {
            filtered.forEach(antibiotic => {
                const suggestionItem = document.createElement('div');
                suggestionItem.textContent = antibiotic;
                suggestionItem.addEventListener('click', () => {
                    input.value = antibiotic;
                    suggestionsBox.style.display = 'none';
                    if (input.id === 'antibioticA') {
                        currentAntibiotic.A = antibiotic;
                    } else {
                        currentAntibiotic.B = antibiotic;
                    }
                });
                suggestionsBox.appendChild(suggestionItem);
            });
            suggestionsBox.style.display = 'block';
        } else {
            suggestionsBox.style.display = 'none';
        }
    };

    // Hàm xử lý khi người dùng nhập liệu
    antibioticAInput.addEventListener('input', () => {
        showSuggestions(antibioticAInput, suggestionsA, { A: '', B: antibioticBInput.value });
    });

    antibioticBInput.addEventListener('input', () => {
        showSuggestions(antibioticBInput, suggestionsB, { A: antibioticAInput.value, B: '' });
    });

    // Xử lý khi nhấn nút kiểm tra
    checkBtn.addEventListener('click', () => {
        const antibioticA = antibioticAInput.value.toLowerCase();
        const antibioticB = antibioticBInput.value.toLowerCase();
        
        errorMessage.textContent = '';
        resultBox.textContent = 'Kết quả sẽ hiển thị ở đây';
        resultBox.className = 'result-box';

        if (!antibioticA || !antibioticB) {
            errorMessage.textContent = 'Vui lòng nhập tên của cả hai loại kháng sinh.';
            return;
        }

        const ruleKey = [antibioticA, antibioticB].sort().join('-');
        
        // Kiểm tra quy tắc đặc biệt trước
        if (specificRules[ruleKey]) {
            resultBox.textContent = specificRules[ruleKey].result;
            resultBox.className = `result-box ${specificRules[ruleKey].class}`;
            return;
        }

        // Lấy nhóm kháng sinh
        const groupA = getAntibioticGroup(antibioticA);
        const groupB = getAntibioticGroup(antibioticB);

        if (!groupA || !groupB) {
            errorMessage.textContent = 'Một trong hai loại kháng sinh hoặc cả hai không được tìm thấy trong cơ sở dữ liệu.';
            resultBox.textContent = 'KHÔNG XÁC ĐỊNH';
            resultBox.className = 'result-box unknown';
            return;
        }

        // Lấy quy tắc tương tác
        const interactionRule = getCombinationRule(groupA, groupB);

        // Hiển thị kết quả
        let resultText, resultClass;
        switch (interactionRule) {
            case 'synergistic':
                resultText = `HIỆP ĐỒNG (Nhóm ${groupA} và nhóm ${groupB} tác dụng hiệp đồng)`;
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
        }
        resultBox.textContent = resultText;
        resultBox.className = `result-box ${resultClass}`;
    });

    // Ẩn gợi ý khi click ra ngoài
    document.addEventListener('click', (event) => {
        if (!event.target.closest('.autocomplete-container')) {
            suggestionsA.style.display = 'none';
            suggestionsB.style.display = 'none';
        }
    });
});

export { allAntibiotics };

