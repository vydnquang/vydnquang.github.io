// codeks/dataks.js

// Danh sách các nhóm kháng sinh và các kháng sinh thuộc nhóm đó
export const antibioticGroups = {
    'penicillins': [
        'penicillin g', 'propicillin', 'penicillin v', 'penicillin g procaine',
'benzathine penicillin g', 'benethamine penicillin', 'penicillin m', 'oxacillin',
'cloxacillin', 'dicloxacillin', 'methicillin', 'nafcillin',
'flucloxacillin', 'ampicillin', ''amoxycillin', 'pivampicillin',
'hetacillin', 'bacampicillin', 'metampicillin', 'talampicillin',
'epicillin', 'sulbenicillin', 'temocillin', 'carbenicilin',
'ticarcilin', 'carindacillin', 'mecillinam (amdinocillin)', 'mezlocillin',
'piperacillin', 'azlocillin', 'pivmecillinam', 'penicillin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM penicillin
    ],
    'cephalosporins': [
        'cephalexin (cefalexin)', 'cefalotin (cephalothin)', 'cefazolin', 'cefradine',
'cefadroxil', 'cefaloglycin', 'cefalonium', 'cephaloridin',
'cefatrizine', 'cefazaflur', 'cefacetrile', 'cefapirin',
'cefaclor', 'cefoxitine', 'cefamandole', 'cefonicid',
'cefuroxime', 'cefprozil', 'cefuzonam', 'ceforanide',
'cefotetan', 'cefmetazole', 'cefbuperazone', 'cefminox',
'ceftizoxime', 'ceftiofur', 'cefotaxime', 'ceftriaxone',
'cefoperazone', 'cefpiramide', 'cefcapene', 'cefdaloxime',
'cefdinir', 'cefditoren', 'cefetamet', 'cefixime',
'cefmenoxime', 'cefodizime', 'cefovecin', 'cefpimizole',
'cefpodoxime', 'cefteram', 'ceftibuten', 'ceftiolene',
'ceftazidime', 'latamoxef (moxalactam)', 'cefepime', 'cefclidin',
'cefiderocol', 'cefluprenam', 'cefoselis', 'cefozopran',
'cefpirome', 'cefquinome', 'flomoxef', 'ceftobiprole',
'ceftaroline (ceftaroline fosamil)', 'ceftolozane', 'cefazedone', 'cefroxadine',
'ceftezol', 'cefazoline', 'loracarbef', 'cefotiam',
'cefaparole', 'cefmatilen', 'cefsumide'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM cephalosporin
    ],
'beta-lactames': [
'thienamycin', 'aztreonam', 'tigemonam', 'carumonam', 'nocardicin a'
        // TẤT CẢ KHÁNG SINH KHÁC CỦA NHÓM beta-lactam
],
'beta-lactamase': [
'clavulanic acid', 'sulbactam', 'tazobactam', 'vaborbactam',
'enmetazobactam', 'relebactam', 'avibactam', 'taniborbactam',
'durlobactam', 'nacubactam', 'xeruborbactam', 'zidebactam'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM beta-lactamase
],
'peptides': [
'daptomycin', 'gramicidin', 'gramicidin s', 'teixobactin',
'vancomycin', 'oritavancin', 'telavancin', 'teicoplanin',
'dalbavancin', 'ramoplanin', 'bleomycin', 'polymycine a-b',
'colistin', 'bacitracin', 'tyrothricin', 'surfactin'
'amphomycin', 'tyrocidine'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM peptide
],
    'aminoglycosides': [
        'netilmicin', 'gentamicin', 'streptomycin', 'kanamycin',
'neomycin', 'tobramycin', 'amikacin', 'dibekacin',
'sisomicin', 'plazomicin', 'dihydrostreptomycin', 'paromomycin',
'framycetin', 'ribostamycin', 'arbekacin', 'bekanamycin',
'hygromycin b', 'apramycin', 'puromycin', 'nourseothricin',
'isepamicin', 'verdamicin', 'astromicin', 'spectinomycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM amino
    ],
    'tetracyclines': [
        'chlortetracycline', 'tetracycline', 'oxytetracycline', 'doxycycline',
'minocycline', 'lymecycline', 'demeclocycline', 'meclocycline',
'metacycline', 'rolitetracycline', 'tigecycline', 'eravacycline',
'sarecycline', 'glycylcycline', 'clomocycline', 'omadacycline',
'pipacycline', 'penimepicycline'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM tetracyclines
    ],
    'macrolides': [
        'pikromycin', 'erythromycin', 'boromycin', 'dirithromycin',
'flurithromycin', 'miocamycin', 'rokitamycin', 'josamycin',
'spiramycin', 'tylosin', 'clarithromycin', 'azithromycin',
'tulathromycin', 'tilmicosin', 'kitasamycin', 'midecamycin',
'oleandomycin', 'troleandomycin', 'roxithromycin', 'telithromycin',
'cethromycin', 'solithromycin', 'streptovaricin a-g', 'geldanamycin',
'macbecin', 'herbimycin', 'fidaxomicin', 'rifamycin sv',
'rifampicin', 'rifabutin', 'rifapentine', 'rifaximin',
'rifalazil', 'tildipirosin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM macrolides
    ],
    'lincosamides': [
        'lincomycin', 'clindamycin', 'pirlimycin', 'iboxamycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM lincosamides
    ],
    'phenicol': [
        'chloramphenicol', 'thiamphenicol', 'flophenicol', 'azidamfenicol'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM phenicol
    ],
    'quinolones': [
        'nalidixic acid', 'axit pipemidic', 'oxolinic acid', 'piromidic acid',
'flumequine', 'rosoxacin', 'norfloxacin', 'ofloxacin',
'ciprofloxacin', 'pefloxacin', 'fleroxacin', 'lomefloxacin',
'nadifloxacin', 'rufloxacin', 'enoxacin', 'levofloxacin',
'balofloxacin', 'grepafloxacin', 'pazufloxacin', 'sparfloxacin',
'temafloxacin', 'tosufloxacin', 'gatifloxacin', 'clinafloxacin',
'moxifloxacin', 'sitafloxacin', 'prulifloxacin', 'besifloxacin',
'delafloxacin', 'gemifloxacin', 'trovafloxacin', 'ozenoxacin',
'finafloxacin', 'garenoxacin', 'alatrofloxacin', 'valcofloxacin',
'gelmofloxacin', 'cinoxacin', 'nemonoxacin', 'pradofloxacin',
'enrofloxacin', 'danofloxacin', 'marbofloxacin', 'difloxacin',
'ibafloxacin', 'orbifloxacin', 'sarafloxacin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM quinolones
    ],
    'carbapenems': [
        'imipenem', 'meropenem', 'ertapenem', 'doripenem',
'biapenem', 'panipenem', 'faropenem', 'ritipenem',
'sulopenem'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM carbapenem
    ],
    'sulfonamides': [
        'sulfamethoxazole', 'sulfaguanidine', 'sulfadimidine', 'sulfamonomethoxine',
'sulfadimethoxine', 'sulfasalazine (salazosulfapyridine)', 'sulfafurazole (sulfisoxazole)', 'sulfamethizole',
'sulfanilamid', 'sulfonamidochrysoidine', 'sulfacetamid', 'sulfadiazine',
'sulfisomidine', 'sulfamoxole', 'sulfanitran', 'sulfamethoxypyridazine',
'sulfametoxydiazine', 'sulfadoxine', 'sulfametopyrazine (sulfalene)', 'mafenid',
'sulfaclozine (sulfachloropyrazine)', 'sulfachloropyridazine', 'cotrimoxazol'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM sulfonamid
    ],
    'oxazolidones': [
        'cycloserine', 'linezolid', 'posizolid', 'tedizolid (torezolid)',
'radezolid', 'eperezolid', 'ranbezolid', 'sutezolid'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM oxazolidone
    ],
    'nitroimidazoles': [
        'metronidazole', 'tinidazole', 'ornidazole', 'secnidazole',
'nimorazole', 'carnidazole', 'misonidazole', 'dimetridazol',
'ronidazole', 'ipronidazole', 'benznidazole', 'azomycin',
'fexinidazole'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM nitroimidazol
    ],
    'nitrofurans': [
        'difurazone', 'furazolidone', 'nifuroxazide', 'nifurquinazol',
'nifurtoinol', 'nifurzide', 'nitrofurazone', 'nitrofurantoin',
'furaltadone', 'furazidine', 'furylfuramide', 'nifuratel',
'nifurtimox'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM nitrofuran
    ],
    'phosphonics': [
        'fosfomycin', 'fosmidomycin', 'alafosfalin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM phosphonic
    ],
    'ionophores': [
        'salinomycin', 'monensin', 'lasalocid'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM ionophore
    ],
    'pleuromutilin': [
        'lefamulin', 'retapamulin', 'tiamulin', 'valnemulin', 'azamulin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM pleuromutilin
    ],
    'streptogramin': [
        'pristinamycin', 'quinupristin', 'dalfopristin', 'virginiamycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM Streptogramin
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
    'penicillins-aminoglycosides': 'synergistic', // Hiệp lực
    'penicillins-tetracyclines': 'antagonistic', // Đối kháng
    'clindamycin-erythromycin': 'antagonistic', // Tương tác cụ thể không theo nhóm rõ rệt
    'chloramphenicol-penicillins': 'antagonistic', // Tương tác cụ thể
    'trimethoprim-sulfonamides': 'synergistic',
    'cephalosporins-aminoglycosides': 'additive',  // Phụ gia
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
