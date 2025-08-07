// TOÀN BỘ CODE CỦA FILE codeks/dataks.js

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
        // TẤT CẢ KHÁNG SINH CỦA NHÓM penicillin - KS diệt khuẩn.
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
        // TẤT CẢ KHÁNG SINH CỦA NHÓM cephalosporin - KS diệt khuẩn.
    ],
    'monobactams': [
        'aztreonam', 'tigemonam', 'carumonam', 'nocardicin a'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM monobactam - KS diệt khuẩn.
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
        // TẤT CẢ KHÁNG SINH CỦA NHÓM peptide - KS diệt khuẩn.
    ],
    'aminoglycosides': [
        'netilmicin', 'gentamicin', 'streptomycin', 'kanamycin',
        'neomycin', 'tobramycin', 'amikacin', 'dibekacin',
        'sisomicin', 'plazomicin', 'dihydrostreptomycin', 'paromomycin',
        'framycetin', 'ribostamycin', 'arbekacin', 'bekanamycin',
        'hygromycin b', 'apramycin', 'puromycin', 'nourseothricin',
        'isepamicin', 'verdamicin', 'astromicin', 'spectinomycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM amino - KS diệt khuẩn.
    ],
    'tetracyclines': [
        'chlortetracycline', 'tetracycline', 'oxytetracycline', 'doxycycline',
        'minocycline', 'lymecycline', 'demeclocycline', 'meclocycline',
        'metacycline', 'rolitetracycline', 'tigecycline', 'eravacycline',
        'sarecycline', 'glycylcycline', 'clomocycline', 'omadacycline',
        'pipacycline', 'penimepicycline'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM tetracyclines - KS kìm khuẩn.
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
        // TẤT CẢ KHÁNG SINH CỦA NHÓM macrolides - KS kìm khuẩn.
    ],
    'lincosamides': [
        'lincomycin', 'clindamycin', 'pirlimycin', 'iboxamycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM lincosamides - KS kìm khuẩn.
    ],
    'phenicols': [
        'chloramphenicol', 'thiamphenicol', 'florfenicol', 'azidamfenicol'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM phenicols - KS kìm khuẩn.
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
        // TẤT CẢ KHÁNG SINH CỦA NHÓM quinolones - KS diệt khuẩn.
    ],
    'carbapenems': [
        'imipenem', 'meropenem', 'ertapenem', 'doripenem',
        'biapenem', 'panipenem', 'faropenem', 'ritipenem',
        'sulopenem', 'thienamycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM carbapenem - KS diệt khuẩn.
    ],
    'sulfonamides': [
        'sulfamethoxazole', 'sulfaguanidine', 'sulfadimidine', 'sulfamonomethoxine',
        'sulfadimethoxine', 'sulfasalazine (salazosulfapyridine)', 'sulfafurazole (sulfisoxazole)', 'sulfamethizole',
        'sulfanilamid', 'sulfonamidochrysoidine', 'sulfacetamid', 'sulfadiazine',
        'sulfisomidine', 'sulfamoxole', 'sulfanitran', 'sulfamethoxypyridazine',
        'sulfametoxydiazine', 'sulfadoxine', 'sulfametopyrazine (sulfalene)', 'mafenid',
        'sulfaclozine (sulfachloropyrazine)', 'sulfachloropyridazine', 'cotrimoxazol' //Sulfonamides ức chế enzyme dihydropteroate synthase (giai đoạn đầu của tổng hợp acid folic), trong khi diaminopyrimidine ức chế enzyme dihydrofolate reductase (giai đoạn sau)
        // TẤT CẢ KHÁNG SINH CỦA NHÓM sulfonamid - KS kìm khuẩn.
    ],
    'oxazolidones': [
        'cycloserine', 'linezolid', 'posizolid', 'tedizolid (torezolid)',
        'radezolid', 'eperezolid', 'ranbezolid', 'sutezolid'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM oxazolidone - KS kìm khuẩn.
    ],
    'nitroimidazoles': [
        'metronidazole', 'tinidazole', 'ornidazole', 'secnidazole',
        'nimorazole', 'carnidazole', 'misonidazole', 'dimetridazol',
        'ronidazole', 'ipronidazole', 'benznidazole', 'azomycin',
        'fexinidazole'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM nitroimidazol - KS diệt khuẩn
    ],
    'nitrofurans': [
        'difurazone', 'furazolidone', 'nifuroxazide', 'nifurquinazol',
        'nifurtoinol', 'nifurzide', 'nitrofurazone', 'nitrofurantoin',
        'furaltadone', 'furazidine', 'furylfuramide', 'nifuratel',
        'nifurtimox'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM nitrofuran (kìm khuẩn ở nồng độ thấp, diệt khuẩn ở nồng độ cao)
    ],
    'phosphonics': [
        'fosfomycin', 'fosmidomycin', 'alafosfalin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM phosphonic - KS diệt khuẩn.
    ],
    'ionophores': [
        'salinomycin', 'monensin', 'lasalocid'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM ionophore - KS diệt khuẩn.
    ],
    'pleuromutilins': [
        'lefamulin', 'retapamulin', 'tiamulin', 'valnemulin', 'azamulin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM pleuromutilin - KS kìm khuẩn.
    ],
    'streptogramins': [
        'pristinamycin', 'quinupristin', 'dalfopristin', 'virginiamycin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM Streptogramin (Gồm 2 thành phần: Streptogramin A và Streptogramin B, đứng riêng thì kìm khuẩn, khi kết hợp lại thì diệt khuẩn)
    ],
    'aminocoumarins': [
        'novobiocin', 'coumermycin a1', 'clorobiocin'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM aminocoumarin - KS kìm khuẩn.
    ],
    'anti-tuberculosis_anti-leprosy': [
        'dapsone', 'promin', 'capreomycin', 'ethambutol', 'ethionamide', 'clofazimine', 'isoniazid'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM trị lao, trị phong
    ],
    'minerals': [
        'calcium', 'magnesium', 'iron', 'zinc'
    ],
    'diaminopyrimidine': [
        'trimethoprim', 'pyrimethamine', 'iclaprim'
        // TẤT CẢ KHÁNG SINH CỦA NHÓM diamino - KS kìm khuẩn.
    ],
    'other/new': [
        'fusidic acid', 'anthracimycin', 'anthramycin', 'lugdunin',
        'nitazoxanide (alinia)', 'halicin', 'mupirocin', 'platensimycin',
        'malacidin', 'lariocidin',
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
    // Xử lý các trường hợp trong ngoặc đơn
    const match = antibiotic.match(/\((.*?)\)/);
    if (match && match[1]) {
        antibioticToGroupMap.set(match[1].toLowerCase(), group);
    }
});
}

// Hàm lấy nhóm của một kháng sinh
export function getAntibioticGroup(antibioticName) {
    return antibioticToGroupMap.get(antibioticName.toLowerCase()) || null;
}

// Quy tắc tương tác giữa các NHÓM kháng sinh
// Đây là phần CỰC KỲ QUAN TRỌNG. Bạn cần điền DỮ LIỆU CHÍNH XÁC từ các nguồn y khoa.
export const combinationRules = {

    // Các quy tắc của nhóm penicillins
    'penicillins-aminoglycosides': 'synergistic', // Hiệp lực hay Hiệp đồng đều ok, trong kết quả sẽ hiện ra chữ HIỆP ĐỒNG
    'penicillins-peptides': 'synergistic', // Hiệp lực
    'penicillins-quinolones': 'synergistic', // Hiệp lực
    'penicillins-tetracyclines': 'antagonistic', // Đối kháng
    'penicillins-phenicols': 'antagonistic', // Đối kháng
    'penicillins-macrolides': 'antagonistic', // Đối kháng
    'penicillins-lincosamides': 'antagonistic', // Đối kháng
    'penicillins-pleuromutilins': 'antagonistic', // Đối kháng
    'penicillins-sulfonamides': 'antagonistic', // Đối kháng
    'penicillins-diaminopyrimidine': 'antagonistic', // Đối kháng

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
    'cephalosporins-diaminopyrimidine': 'antagonistic', // Đối kháng

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
    'monobactams-diaminopyrimidine': 'antagonistic', // Đối kháng
    
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
    'carbapenems-diaminopyrimidine': 'antagonistic', // Đối kháng

    // Các quy tắc của nhóm beta-lactamase
    'beta-lactamase-penicillins': 'additive', // Phụ gia, ý nói là 2 chất này bổ trợ cho nhau, không có beta-lactamase thì peni không phát huy tác dụng
    'beta-lactamase-cephalosporins': 'additive', // Trong kết quả hiện ra chữ HIỆP LỰC

    // Các quy tắc của nhóm aminoglycosides
    'aminoglycosides-tetracyclines': 'synergistic', // Hiệp lực. Tài liệu mới lại nói là đối kháng
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
    'tetracyclines-diaminopyrimidine': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm phenicols
    'phenicols-sulfonamides': 'synergistic', // Hiệp lực
    'phenicols-diaminopyrimidine': 'synergistic', // Hiệp lực 

    // Các quy tắc của nhóm macrolides
    'macrolides-sulfonamides': 'synergistic', // Hiệp lực
    'macrolides-diaminopyrimidine': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm lincosamides
    'lincosamides-sulfonamides': 'synergistic', // Hiệp lực
    'lincosamides-diaminopyrimidine': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm pleuromutilins
    'pleuromutilins-sulfonamides': 'synergistic', // Hiệp lực
    'pleuromutilins-diaminopyrimidine': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm diaminopyrimidine (ức chế enzyme dihydrofolate reductase, một enzyme quan trọng trong con đường tổng hợp acid folic của vi khuẩn)
    'diaminopyrimidine-pleuromutilins': 'synergistic', // Cộng gộp
    'diaminopyrimidine-tetracyclines': 'synergistic', // Cộng gộp
    'diaminopyrimidine-phenicols': 'synergistic', // Cộng gộp
    'diaminopyrimidine-macrolides': 'synergistic', // Cộng gộp
    'diaminopyrimidine-lincosamides': 'synergistic', // Cộng gộp
    'diaminopyrimidine-penicillins': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'diaminopyrimidine-cephalosporins': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'diaminopyrimidine-carbapenems': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'diaminopyrimidine-monobactams': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'diaminopyrimidine-sulfonamides': 'synergistic', // Hiệp đồng mạnh mẽ
    'diaminopyrimidine-peptides': 'synergistic', // Cộng gộp
    'diaminopyrimidine-aminoglycosides': 'synergistic', // Cộng gộp
    'diaminopyrimidine-quinolones': 'synergistic', // Hiệp đồng

    // XV. Các quy tắc của nhóm oxazolidones
    // 15.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 15.1.1 Với thành viên của beta-lactam
    'oxazolidones-penicillins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-cephalosporins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-monobactams': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-carbapenems': 'synergistic', // Hiệp đồng hoặc cộng gộp
    // 15.1.2 Với thành viên của peptides
    'oxazolidones-peptides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    // 15.1.3 Với thành viên của phosphonics
    'oxazolidones-phosphonics': 'synergistic', // Hiệp đồng
    // 15.2 Với các kháng sinh ức chế tổng hợp protein khác, lưu ý một vài trường hợp sẽ cạnh tranh vị trí tác động, dẫn đến chồng chéo, đối kháng
    'oxazolidones-aminoglycosides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-tetracyclines': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-macrolides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-lincosamides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-phenicols': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-streptogramins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-aminocoumarins': 'synergistic', // Hiệp đồng hoặc cộng gộp, do nhóm này ức chế DNA gyrase
    // 15.3 Với các kháng sinh khác
    'oxazolidones-quinolones': 'synergistic', // Hiệp đồng hoặc cộng gộp, do quino ức chế DNA
    'oxazolidones-sulfonamides': 'synergistic', // Hiệp đồng hoặc cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'oxazolidones-diaminopyrimidine': 'synergistic', // Hiệp đồng hoặc cộng gộp, do diamino ức chế tổng hợp acid folic
    'oxazolidones-nitroimidazoles': 'synergistic', // Cộng gộp, do nitroimi sản sinh chất có hại cho tế bào vi khuẩn
    'oxazolidones-nitrofurans': 'synergistic', // Cộng gộp, do nitrofu sản sinh chất có hại cho tế bào vi khuẩn
    'oxazolidones-ionophores': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn
    'oxazolidones-pleuromutilins': 'caution', // Có thể cộng gộp, cũng có thể đối kháng, do cùng cạnh tranh gắn vào tiểu đơn vị 50S của ribosome.

    // XVI. Các quy tắc của nhóm nitroimidazoles
    // 16.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 16.1.1 Với thành viên của beta-lactam
    'nitroimidazoles-penicillins': 'synergistic', // Cộng gộp
    'nitroimidazoles-cephalosporins': 'synergistic', // Cộng gộp
    'nitroimidazoles-monobactams': 'synergistic', // Cộng gộp
    'nitroimidazoles-carbapenems': 'synergistic', // Cộng gộp
    // 16.1.2 Với thành viên của peptides
    'nitroimidazoles-peptides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    // 16.1.3 Với thành viên của phosphonics
    'nitroimidazoles-phosphonics': 'synergistic', // Cộng gộp
    // 16.2 Với các kháng sinh ức chế tổng hợp protein khác
    'nitroimidazoles-aminoglycosides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-tetracyclines': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-macrolides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-lincosamides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-phenicols': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-pleuromutilins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-streptogramins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-aminocoumarins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 16.3 Với các kháng sinh khác
    'nitroimidazoles-quinolones': 'synergistic', // Hiệp đồng, do quino ức chế DNA
    'nitroimidazoles-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'nitroimidazoles-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic
    'nitroimidazoles-nitrofurans': 'synergistic', // Cộng gộp, do nitrofu sản sinh chất có hại cho tế bào vi khuẩn
    'nitroimidazoles-ionophores': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn

    // XVII. Các quy tắc của nhóm nitrofurans (chủ yếu trị tiết niệu, ít toàn thân)
    // 17.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 17.1.1 Với thành viên của beta-lactam
    'nitrofurans-penicillins': 'synergistic', // Cộng gộp
    'nitrofurans-cephalosporins': 'synergistic', // Cộng gộp
    'nitrofurans-monobactams': 'synergistic', // Cộng gộp
    'nitrofurans-carbapenems': 'synergistic', // Cộng gộp
    // 17.1.2 Với thành viên của peptides
    'nitrofurans-peptides': 'synergistic', // Cộng gộp
    // 17.1.3 Với thành viên của phosphonics
    'nitrofurans-phosphonics': 'synergistic', // Cộng gộp
    // 17.2 Với các kháng sinh ức chế tổng hợp protein khác
    'nitrofurans-aminoglycosides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-tetracyclines': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-macrolides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-lincosamides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-phenicols': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-pleuromutilins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-streptogramins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-aminocoumarins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 17.3 Với các kháng sinh khác
    'nitrofurans-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase
    'nitrofurans-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'nitrofurans-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic
    'nitrofurans-ionophores': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn

    // XVIII. Các quy tắc của nhóm phosphonics
    // 18.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 18.1.1 Với thành viên của beta-lactam (để trị các nhiễm trùng đa kháng MRSA, VRE)
    'phosphonics-penicillins': 'synergistic', // Hiệp đồng
    'phosphonics-cephalosporins': 'synergistic', // Hiệp đồng
    'phosphonics-monobactams': 'synergistic', // Hiệp đồng
    'phosphonics-carbapenems': 'synergistic', // Hiệp đồng
    // 18.1.2 Với thành viên của peptides
    'phosphonics-peptides': 'synergistic', // Hiệp đồng mạnh mẽ
    // 18.2 Với các kháng sinh ức chế tổng hợp protein khác
    'phosphonics-aminoglycosides': 'synergistic', // Hiệp đồng, tạo điều kiện cho aminoglycosides xâm nhập vào tế bào vi khuẩn dễ dàng hơn bằng cách làm suy yếu thành tế bào
    'phosphonics-tetracyclines': 'synergistic', // Cộng gộp-Additive
    'phosphonics-macrolides': 'synergistic', // Cộng gộp
    'phosphonics-lincosamides': 'synergistic', // Cộng gộp
    'phosphonics-phenicols': 'synergistic', // Cộng gộp
    'phosphonics-pleuromutilins': 'synergistic', // Cộng gộp
    'phosphonics-streptogramins': 'synergistic', // Cộng gộp
    'phosphonics-aminocoumarins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 18.3 Với các kháng sinh khác
    'phosphonics-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'phosphonics-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'phosphonics-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic
    'phosphonics-ionophores': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn

    // XIX. Các quy tắc của nhóm ionophores
    // 19.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 19.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'ionophores-penicillins': 'synergistic', // Cộng gộp
    'ionophores-cephalosporins': 'synergistic', // Cộng gộp
    'ionophores-monobactams': 'synergistic', // Cộng gộp
    'ionophores-carbapenems': 'synergistic', // Cộng gộp
    // 19.1.2 Với thành viên của peptides
    'ionophores-peptides': 'synergistic', // Cộng gộp
    // 19.2 Với các kháng sinh ức chế tổng hợp protein khác
    'ionophores-aminoglycosides': 'synergistic', // Hiệp đồng, tạo điều kiện cho aminoglycosides xâm nhập vào tế bào vi khuẩn dễ dàng hơn bằng cách làm suy yếu thành tế bào
    'ionophores-tetracyclines': 'synergistic', // Cộng gộp-Additive
    'ionophores-macrolides': 'synergistic', // Cộng gộp
    'ionophores-lincosamides': 'synergistic', // Cộng gộp
    'ionophores-phenicols': 'synergistic', // Cộng gộp
    'ionophores-pleuromutilins': 'synergistic', // Cộng gộp
    'ionophores-streptogramins': 'synergistic', // Cộng gộp
    'ionophores-aminocoumarins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 19.3 Với các kháng sinh khác
    'ionophores-quinolones': 'synergistic', // Cộng gộp hoặc Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'ionophores-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'ionophores-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // XX. Các quy tắc của nhóm pleuromutilins (ức chế tổng hợp protein bằng cách gắn vào tiểu đơn vị 50S của ribosome vi khuẩn, tại vị trí peptidyl transferase)
    // 20.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 20.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'pleuromutilins-penicillins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'pleuromutilins-cephalosporins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'pleuromutilins-monobactams': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'pleuromutilins-carbapenems': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 20.1.2 Với thành viên của peptides
    'pleuromutilins-peptides': 'synergistic', // Cộng gộp
    // 20.2 Với các kháng sinh ức chế tổng hợp protein khác
    'pleuromutilins-aminoglycosides': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'pleuromutilins-tetracyclines': 'synergistic', // Cộng gộp-Additive, vì tetracyclines gắn vào tiểu đơn vị 30S
    'pleuromutilins-macrolides': 'antagonistic', // Đối kháng, do cạnh tranh vị trí gắn
    'pleuromutilins-lincosamides': 'antagonistic', // Đối kháng
    'pleuromutilins-phenicols': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'pleuromutilins-streptogramins': 'antagonistic', // Đối kháng
    'pleuromutilins-aminocoumarins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 20.3 Với các kháng sinh khác
    'pleuromutilins-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'pleuromutilins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'pleuromutilins-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // XXI. Các quy tắc của nhóm streptogramins (Phức hợp 2 thành phần (Streptogramin A và Streptogramin B) hiệp đồng trên tiểu đơn vị 50S của ribosome, ức chế tổng hợp protein của vi khuẩn)
    // 21.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 21.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'streptogramins-penicillins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'streptogramins-cephalosporins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'streptogramins-monobactams': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'streptogramins-carbapenems': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 21.1.2 Với thành viên của peptides
    'streptogramins-peptides': 'synergistic', // Cộng gộp
    // 21.2 Với các kháng sinh ức chế tổng hợp protein khác
    'streptogramins-aminoglycosides': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'streptogramins-tetracyclines': 'synergistic', // Cộng gộp-Additive hoặc Hiệp đồng, vì tetracyclines gắn vào tiểu đơn vị 30S
    'streptogramins-macrolides': 'antagonistic', // Đối kháng, do cạnh tranh vị trí gắn
    'streptogramins-lincosamides': 'antagonistic', // Đối kháng, cạnh tranh vị trí gắn
    'streptogramins-phenicols': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'streptogramins-aminocoumarins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 21.3 Với các kháng sinh khác
    'streptogramins-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'streptogramins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'streptogramins-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // XXII. Các quy tắc của nhóm aminocoumarins (ức chế enzyme DNA gyrase và DNA topoisomerase IV, tuy nhiên chú ý độc tính trên gan, thận, nên dùng cho thú y)
    // 22.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 22.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'aminocoumarins-penicillins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'aminocoumarins-cephalosporins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'aminocoumarins-monobactams': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'aminocoumarins-carbapenems': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 22.1.2 Với thành viên của peptides
    'aminocoumarins-peptides': 'synergistic', // Cộng gộp
    // 22.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminocoumarins-aminoglycosides': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'aminocoumarins-tetracyclines': 'synergistic', // Cộng gộp-Additive hoặc Hiệp đồng, vì tetracyclines gắn vào tiểu đơn vị 30S
    'aminocoumarins-macrolides': 'antagonistic', // Đối kháng, do cạnh tranh vị trí gắn
    'aminocoumarins-lincosamides': 'antagonistic', // Đối kháng, cạnh tranh vị trí gắn
    'aminocoumarins-phenicols': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 22.3 Với các kháng sinh khác
    'aminocoumarins-quinolones': 'synergistic', // Hiệp đồng mạnh mẽ, do quinolones ức chế enzyme DNA gyrase, nhưng ở 2 vị trí khác nhau
    'aminocoumarins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'aminocoumarins-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // Các quy tắc của các nhóm chưa mà chưa có tài liệu nói rõ là có hay không
    'quinolones-aminoglycosides': 'synergistic', // Có tài liệu ghi hết sức thận trọng 'caution'
    'lincosamides-macrolides': 'antagonistic',
    'phenicols-macrolides': 'antagonistic',

    // --- CÁC QUY TẮC MỚI CẦN BỔ SUNG DỰA TRÊN CÁC NHÓM BẠN ĐÃ THÊM ---
    // Đây chỉ là VÍ DỤ. Bạn cần điền DỮ LIỆU CHÍNH XÁC TỪ NGUỒN Y TẾ.
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
