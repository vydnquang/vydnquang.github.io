// codeks/dataks.js

// Danh sách các nhóm kháng sinh và các kháng sinh thuộc nhóm đó
export const antibioticGroups = {
    'penicillins': [
        'penicillin g', 'propicillin', 'penicillin v', 'penicillin g procaine',
        'benzathine penicillin g', 'benethamine penicillin', 'penicillin m', 'oxacillin',
        'cloxacillin', 'dicloxacillin', 'methicillin', 'nafcillin',
        'flucloxacillin', 'ampicillin', 'amoxycillin', 'pivampicillin',
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
    'monobactams': [
        'aztreonam', 'tigemonam', 'carumonam', 'nocardicin a'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM monobactam
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
        'dalbavancin', 'ramoplanin', 'bleomycin', 'polymyxin b',
        'colistin', 'bacitracin', 'tyrothricin', 'surfactin',
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
    'phenicols': [
        'chloramphenicol', 'thiamphenicol', 'florfenicol', 'azidamfenicol'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM phenicols
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
        'sulopenem', 'thienamycin'
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
    'pleuromutilins': [
        'lefamulin', 'retapamulin', 'tiamulin', 'valnemulin', 'azamulin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM pleuromutilin
    ],
    'streptogramins': [
        'pristinamycin', 'quinupristin', 'dalfopristin', 'virginiamycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM Streptogramin
    ],
    'aminocoumarins': [
        'novobiocin', 'coumermycin a1', 'clorobiocin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM aminocoumarin
    ],
    'anti-tuberculosis_anti-leprosy': [
        'dapsone', 'promin', 'capreomycin', 'ethambutol', 'ethionamide', 'clofazimine', 'isoniazid'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM trị lao, trị phong
    ],
    'minerals': [
        'calcium', 'magnesium', 'iron', 'zinc'
    ],
    'other/new': [
        'fusidic acid', 'anthracimycin', 'anthramycin', 'lugdunin',
        'nitazoxanide (alinia)', 'halicin', 'mupirocin', 'platensimycin',
        'malacidin', 'trimethoprim', 'iclaprim', 'lariocidin',
        'zosurabalpin', 'cefepime-taniborbactam', 'darobactin', 'orlynvah',
        'cefepime-enmetazobactam', 'cresomycin'
    ]
    // ... Thêm các nhóm và kháng sinh khác của bạn vào đây
};

// Ánh xạ từng kháng sinh về nhóm của nó (để tra cứu nhanh)
// Sử dụng Map thay vì Object cho hiệu suất tốt hơn
export const antibioticToGroupMap = new Map();
for (const group in antibioticGroups) {
    antibioticGroups[group].forEach(antibiotic => {
        antibioticToGroupMap.set(antibiotic.toLowerCase(), group);
    });
}

// Quy tắc tương tác giữa các NHÓM kháng sinh
// Đây là phần CỰC KỲ QUAN TRỌNG. Bạn cần điền DỮ LIỆU CHÍNH XÁC từ các nguồn y khoa.
export const combinationRules = {
    // Các quy tắc đã có
    // Các quy tắc của nhóm penicillins
    'penicillins-aminoglycosides': 'synergistic', // Hiệp lực
    'penicillins-peptides': 'synergistic', // Hiệp lực
    'penicillins-quinolones': 'synergistic', // Hiệp lực
    'penicillins-tetracyclines': 'antagonistic', // Đối kháng
    'penicillins-phenicols': 'antagonistic', // Đối kháng
    'penicillins-macrolides': 'antagonistic', // Đối kháng
    'penicillins-lincosamides': 'antagonistic', // Đối kháng
    'penicillins-pleuromutilins': 'antagonistic', // Đối kháng
    'penicillins-sulfonamides': 'antagonistic', // Đối kháng
    'penicillins-trimethoprim': 'antagonistic', // Đối kháng

    // Các quy tắc của nhóm cephalosporins
    'cephalosporins-aminoglycosides': 'synergistic', // Hiệp lực, có tài liệu là 'additive'
    'cephalosporins-peptides': 'synergistic', // Hiệp lực, có tài liệu là 'additive'
    'cephalosporins-quinolones': 'synergistic', // Hiệp lực
    'cephalosporins-tetracyclines': 'antagonistic', // Đối kháng
    'cephalosporins-phenicols': 'antagonistic', // Đối kháng
    'cephalosporins-macrolides': 'antagonistic', // Đối kháng
    'cephalosporins-lincosamides': 'antagonistic', // Đối kháng
    'cephalosporins-pleuromutilins': 'antagonistic', // Đối kháng
    'cephalosporins-sulfonamides': 'antagonistic', // Đối kháng
    'cephalosporins-trimethoprim': 'antagonistic', // Đối kháng

    // Các quy tắc của nhóm monobactams
    'monobactams-aminoglycosides': 'synergistic', // Hiệp lực
    'monobactams-peptides': 'synergistic', // Hiệp lực
    'monobactams-quinolones': 'synergistic', // Hiệp lực
    'monobactams-tetracyclines': 'antagonistic', // Đối kháng
    'monobactams-phenicols': 'antagonistic', // Đối kháng
    'monobactams-macrolides': 'antagonistic', // Đối kháng
    'monobactams-lincosamides': 'antagonistic', // Đối kháng
    'monobactams-pleuromutilins': 'antagonistic', // Đối kháng
    'monobactams-sulfonamides': 'antagonistic', // Đối kháng
    'monobactams-trimethoprim': 'antagonistic', // Đối kháng
    
    // Các quy tắc của nhóm carbapenems
    'carbapenems-aminoglycosides': 'synergistic', // Hiệp lực
    'carbapenems-peptides': 'synergistic', // Hiệp lực
    'carbapenems-quinolones': 'synergistic', // Hiệp lực
    'carbapenems-tetracyclines': 'antagonistic', // Đối kháng
    'carbapenems-phenicols': 'antagonistic', // Đối kháng
    'carbapenems-macrolides': 'antagonistic', // Đối kháng
    'carbapenems-lincosamides': 'antagonistic', // Đối kháng
    'carbapenems-pleuromutilins': 'antagonistic', // Đối kháng
    'carbapenems-sulfonamides': 'antagonistic', // Đối kháng
    'carbapenems-trimethoprim': 'antagonistic', // Đối kháng

    // Các quy tắc của nhóm beta-lactamase
    'beta-lactamase-penicillins': 'additive',
    'beta-lactamase-cephalosporins': 'additive',

    // Các quy tắc của nhóm aminoglycosides
    'aminoglycosides-tetracyclines': 'synergistic', // Hiệp lực
    'aminoglycosides-phenicols': 'synergistic', // Hiệp lực
    'aminoglycosides-macrolides': 'synergistic', // Hiệp lực
    'aminoglycosides-lincosamides': 'synergistic', // Hiệp lực
    'aminoglycosides-pleuromutilins': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm peptid
    'peptides-tetracyclines': 'synergistic', // Hiệp lực
    'peptides-phenicols': 'synergistic', // Hiệp lực
    'peptides-macrolides': 'synergistic', // Hiệp lực
    'peptides-lincosamides': 'synergistic', // Hiệp lực
    'peptides-pleuromutilins': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm quinolon
    'quinolones-tetracyclines': 'synergistic', // Hiệp lực
    'quinolones-phenicols': 'synergistic', // Hiệp lực
    'quinolones-macrolides': 'synergistic', // Hiệp lực
    'quinolones-lincosamides': 'synergistic', // Hiệp lực
    'quinolones-pleuromutilins': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm tetracyclines
    'tetracyclines-sulfonamides': 'synergistic', // Hiệp lực
    'tetracyclines-trimethoprim': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm phenicols
    'phenicols-sulfonamides': 'synergistic', // Hiệp lực
    'phenicols-trimethoprim': 'synergistic', // Hiệp lực 

    // Các quy tắc của nhóm macrolides
    'macrolides-sulfonamides': 'synergistic', // Hiệp lực
    'macrolides-trimethoprim': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm lincosamides
    'lincosamides-sulfonamides': 'synergistic', // Hiệp lực
    'lincosamides-trimethoprim': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm pleuromutilins
    'pleuromutilins-sulfonamides': 'synergistic', // Hiệp lực
    'pleuromutilins-trimethoprim': 'synergistic', // Hiệp lực

    // Các quy tắc của các nhóm chưa phân loại
    'sulfonamides-trimethoprim': 'synergistic',
    'quinolones-aminoglycosides': 'synergistic', // Có tài liệu ghi hết sức thận trọng 'caution'
    'lincosamides-macrolides': 'antagonistic',
    'phenicols-macrolides': 'antagonistic',

    // --- CÁC QUY TẮC MỚI CẦN BỔ SUNG DỰA TRÊN CÁC NHÓM BẠN ĐÃ THÊM ---
    // Đây chỉ là VÍ DỤ. Bạn cần điền DỮ LIỆU CHÍNH XÁC TỪ NGUỒN Y TẾ.
    'beta-lactames-beta-lactamase': 'synergistic',
    'beta-lactames-metroimidazol': 'additive',
    'beta-lactames-quinolones': 'additive',
    'peptides-aminoglycosides': 'additive', // Có tài liệu ghi 'caution', hết sức thận trọng
    'peptides-quinolones': 'additive', // Đôi khi là 'caution' vì độc tính
    'macrolides-quinolones': 'additive',
    'sulfonamides-quinolones': 'additive',
    'phenicols-tetracyclines': 'caution', // Không khuyến cáo vì tác dụng phụ nghiêm trọng
    'macrolides-tetracyclines': 'caution', // Không khuyến cáo vì tác dụng phụ nghiêm trọng
    'lincosamides-tetracyclines': 'antagonistic', // Không khuyến cáo vì tác dụng đối kháng
    'pleuromutilins-tetracyclines': 'antagonistic', // Không khuyến cáo vì tác dụng đối kháng
    'pleuromutilins-phenicols': 'antagonistic', // Không khuyến cáo vì tác dụng đối kháng
    'lincosamides-phenicols': 'caution', // Không khuyến cáo, cân nhắc
    'lincosamides-pleuromutilins': 'caution', // Không khuyến cáo, cân nhắc
    'penicillins-cephalosporins': 'antagonistic', // Cẩn trọng
    'penicillins-carbapenems': 'antagonistic', // Cẩn trọng
    'penicillins-monobactams': 'antagonistic', // Cẩn trọng
    'cephalosporins-monobactams': 'antagonistic', // Cẩn trọng
    'cephalosporins-carbapenems': 'antagonistic', // Cẩn trọng
    'monobactams-carbapenems': 'antagonistic', // Cấm, gây dị ứng

    'nitroimidazoles-quinolones': 'synergistic',
    'nitrofurans-quinolones': 'additive',
    'phosphonics-aminoglycosides': 'synergistic',
    'ionophores-other/new': 'neutral',
    'pleuromutilins-macrolides': 'caution',
    'streptogramins-macrolides': 'caution',
    'aminocoumarins-rifamycins': 'synergistic',
    'anti-tuberculosis_anti-leprosy-quinolones': 'additive',
    'other/new-other/new': 'neutral',
    // ... bạn cần tiếp tục bổ sung các cặp nhóm khác cho đầy đủ

    // Lưu ý: Các tương tác cụ thể giữa 2 kháng sinh không theo nhóm cần được xử lý riêng trong kiemtraks.js
    // Ví dụ: clindamycin-erythromycin hay chloramphenicol-penicillins
    // Hiện tại bạn đã có logic đó cho ceftriaxone-calcium.
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
    return antibioticToGroupMap.get(antibioticName.toLowerCase()) || null;
}
