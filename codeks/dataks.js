// codeks/dataks.js

// Danh sách các nhóm kháng sinh và các kháng sinh thuộc nhóm đó
export const antibioticGroups = {
    'penicillins': [
        'penicillin g', 'penicillin v', 'amoxicillin', 'ampicillin',
        'piperacillin', 'ticarcillin', 'oxacillin', 'nafcillin'
        // THÊM TẤT CẢ KHÁNG SINH CỦA BẠN VÀO ĐÂY, ĐẢM BẢO VIẾT THƯỜNG
    ],
    'cephalosporins': [
        'cephalexin', 'cefazolin', 'cefaclor', 'cefotaxime',
        'ceftriaxone', 'cefepime', 'ceftaroline'
    ],
    'aminoglycosides': [
        'gentamicin', 'tobramycin', 'amikacin', 'streptomycin', 'neomycin'
    ],
    'tetracyclines': [
        'tetracycline', 'doxycycline', 'minocycline', 'tigecycline'
    ],
    'macrolides': [
        'erythromycin', 'azithromycin', 'clarithromycin', 'fidaxomicin'
    ],
    'fluoroquinolones': [
        'ciprofloxacin', 'levofloxacin', 'moxifloxacin', 'ofloxacin'
    ],
    'carbapenems': [
        'imipenem', 'meropenem', 'ertapenem', 'doripenem'
    ],
    'glycopeptides': [
        'vancomycin', 'teicoplanin'
    ],
    'sulfonamides': [
        'sulfamethoxazole', 'sulfadiazine'
    ],
    'other': [
        'clindamycin', 'metronidazole', 'linezolid', 'daptomycin',
        'rifampin', 'chloramphenicol', 'fosfomycin', 'colistin', 'trimethoprim'
    ]
    // ... Thêm các nhóm và kháng sinh khác của bạn vào đây
};

// Ánh xạ từng kháng sinh về nhóm của nó (để tra cứu nhanh)
export const antibioticToGroupMap = {};
for (const group in antibioticGroups) {
    antibioticGroups[group].forEach(antibiotic => {
        antibioticToGroupMap[antibiotic.toLowerCase()] = group;
    });
}

// Quy tắc tương tác giữa các NHÓM kháng sinh
// Đây là phần CỰC KỲ QUAN TRỌNG. Bạn cần điền DỮ LIỆU CHÍNH XÁC từ các nguồn y khoa.
export const combinationRules = {
    // Ví dụ về các cặp tương tác
    'penicillins-aminoglycosides': 'synergistic',
    'penicillins-tetracyclines': 'antagonistic',
    'clindamycin-erythromycin': 'antagonistic', // Tương tác cụ thể không theo nhóm rõ rệt
    'chloramphenicol-penicillins': 'antagonistic', // Tương tác cụ thể
    'trimethoprim-sulfonamides': 'synergistic',
    'cephalosporins-aminoglycosides': 'additive',
    'carbapenems-glycopeptides': 'additive',
    // ... Thêm tất cả các quy tắc kết hợp nhóm kháng sinh của bạn
    // Đảm bảo tên nhóm được sắp xếp theo bảng chữ cái để khớp với logic getCombinationRule
    // Ví dụ: 'aminoglycosides-penicillins' thay vì 'penicillins-aminoglycosides'
    // (trong getCombinationRule đã có logic sắp xếp)
};

// Hàm giúp lấy quy tắc tương tác giữa hai nhóm
export function getCombinationRule(groupA, groupB) {
    if (!groupA || !groupB) return 'unknown';

    // Đảm bảo thứ tự nhóm để tra cứu nhất quán (VD: A-B và B-A đều tìm được)
    const sortedGroups = [groupA, groupB].sort();
    const key = `${sortedGroups[0]}-${sortedGroups[1]}`;

    // Trả về quy tắc nếu tìm thấy, nếu không mặc định là 'neutral'
    return combinationRules[key] || 'neutral';
}

// Hàm lấy nhóm của một kháng sinh
export function getAntibioticGroup(antibioticName) {
    return antibioticToGroupMap[antibioticName.toLowerCase()] || null;
}