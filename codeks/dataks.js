// TOÀN BỘ CODE CỦA FILE codeks/dataks.js

// Danh sách nhóm kháng sinh và các kháng sinh thuộc nhóm đó
export const antibioticGroups = {
    'penicillins': [
        'penicillin-g', 'propicillin', 'penicillin-v', 'penicillin-g-procaine',
        'benzathine-penicillin-g', 'benethamine-penicillin', 'penicillin-m', 'oxacillin',
        'cloxacillin', 'dicloxacillin', 'methicillin', 'nafcillin',
        'flucloxacillin', 'ampicillin', 'amoxycillin', 'pivampicillin',
        'hetacillin', 'bacampicillin', 'metampicillin', 'talampicillin',
        'epicillin', 'sulbenicillin', 'temocillin', 'carbenicilin',
        'ticarcilin', 'carindacillin', 'mecillinam', 'amdinocillin',
        'mezlocillin', 'piperacillin', 'azlocillin', 'pivmecillinam'
    ],
    'cephalosporins': [
        'cephalexin', 'cefalotin', 'cefazolin', 'cefradine', 'cefadroxil', 'cefaloglycin',
        'cefalonium', 'cephaloridin', 'cefatrizine', 'cefazaflur', 'cefacetrile',
        'cefapirin', 'cefaclor', 'cefoxitine', 'cefamandole', 'cefonicid', 'cefuroxime',
        'cefprozil', 'cefuzonam', 'ceforanide', 'cefotetan', 'cefmetazole',
        'cefbuperazone', 'cefminox', 'ceftizoxime', 'ceftiofur', 'cefotaxime',
        'ceftriaxone', 'cefoperazone', 'cefpiramide', 'cefcapene', 'cefdaloxime',
        'cefdinir', 'cefditoren', 'cefetamet', 'cefixime', 'cefmenoxime', 'cefodizime',
        'cefovecin', 'cefpimizole', 'cefpodoxime', 'cefteram', 'ceftibuten',
        'ceftiolene', 'ceftazidime', 'latamoxef', 'cefepime', 'cefclidin',
        'cefiderocol', 'cefluprenam', 'cefoselis', 'cefozopran', 'cefpirome',
        'cefquinome', 'flomoxef', 'ceftobiprole', 'ceftaroline', 'ceftolozane',
        'cefazedone', 'cefroxadine', 'ceftezol', 'cefazoline', 'loracarbef',
        'cefotiam', 'cefaparole', 'cefmatilen', 'cefsumide'
    ],
    'carbapenems': [
        'imipenem', 'meropenem', 'ertapenem', 'doripenem', 'biapenem',
        'panipenem', 'faropenem', 'ritipenem', 'sulopenem', 'thienamycin'
    ],
    'monobactams': [
        'aztreonam', 'tigemonam', 'carumonam', 'nocardicin-a'
    ],
    'beta-lactamase': [
        'clavulanic-acid', 'sulbactam', 'tazobactam', 'vaborbactam',
        'enmetazobactam', 'relebactam', 'avibactam', 'taniborbactam',
        'durlobactam', 'nacubactam', 'xeruborbactam', 'zidebactam'
    ],
    'peptides': [
        'daptomycin', 'gramicidin', 'gramicidin-s', 'teixobactin',
        'vancomycin', 'oritavancin', 'telavancin', 'teicoplanin',
        'dalbavancin', 'ramoplanin', 'bleomycin', 'polymyxin-b',
        'colistin', 'bacitracin', 'tyrothricin', 'surfactin',
        'amphomycin', 'tyrocidine'
    ],
    'aminoglycosides': [
        'netilmicin', 'gentamicin', 'streptomycin', 'kanamycin',
        'neomycin', 'tobramycin', 'amikacin', 'dibekacin', 'sisomicin',
        'plazomicin', 'dihydrostreptomycin', 'paromomycin', 'framycetin',
        'ribostamycin', 'arbekacin', 'bekanamycin', 'hygromycin-b',
        'apramycin', 'puromycin', 'nourseothricin', 'isepamicin',
        'verdamicin', 'astromicin', 'spectinomycin'
    ],
    'tetracyclines': [
        'chlortetracycline', 'tetracycline', 'oxytetracycline', 'doxycycline',
        'minocycline', 'lymecycline', 'demeclocycline', 'meclocycline',
        'metacycline', 'rolitetracycline', 'tigecycline', 'eravacycline',
        'sarecycline', 'glycylcycline', 'clomocycline', 'omadacycline',
        'pipacycline', 'penimepicycline'
    ],
    'macrolides': [
        'pikromycin', 'erythromycin', 'boromycin', 'dirithromycin',
        'flurithromycin', 'miocamycin', 'rokitamycin', 'josamycin',
        'spiramycin', 'tylosin', 'clarithromycin', 'azithromycin',
        'tulathromycin', 'tilmicosin', 'kitasamycin', 'midecamycin',
        'oleandomycin', 'troleandomycin', 'roxithromycin',
        'telithromycin', 'cethromycin', 'solithromycin',
        'streptovaricin-a-g', 'geldanamycin', 'macbecin',
        'herbimycin', 'fidaxomicin', 'rifamycin-sv', 'rifampicin',
        'rifabutin', 'rifapentine', 'rifaximin', 'rifalazil',
        'tildipirosin'
    ],
    'lincosamides': [
        'lincomycin', 'clindamycin', 'pirlimycin', 'iboxamycin'
    ],
    'phenicols': [
        'chloramphenicol', 'thiamphenicol', 'florfenicol', 'azidamfenicol'
    ],
    'quinolones': [
        'nalidixic-acid', 'pipemidic-acid', 'oxolinic-acid', 'piromidic-acid',
        'flumequine', 'rosoxacin', 'norfloxacin', 'ofloxacin',
        'ciprofloxacin', 'pefloxacin', 'fleroxacin', 'lomefloxacin',
        'nadifloxacin', 'rufloxacin', 'enoxacin', 'levofloxacin',
        'balofloxacin', 'grepafloxacin', 'pazufloxacin',
        'sparfloxacin', 'temafloxacin', 'tosufloxacin',
        'gatifloxacin', 'clinafloxacin', 'moxifloxacin',
        'sitafloxacin', 'prulifloxacin', 'besifloxacin',
        'delafloxacin', 'gemifloxacin', 'trovafloxacin',
        'ozenoxacin', 'finafloxacin', 'garenoxacin',
        'alatrofloxacin', 'valcofloxacin', 'gelmofloxacin',
        'cinoxacin', 'nemonoxacin', 'pradofloxacin',
        'enrofloxacin', 'danofloxacin', 'marbofloxacin',
        'difloxacin', 'ibafloxacin', 'orbifloxacin',
        'sarafloxacin'
    ],
    'sulfonamides': [
        'sulfamethoxazole', 'sulfaguanidine', 'sulfadimidine',
        'sulfamonomethoxine', 'sulfadimethoxine', 'sulfasalazine',
        'sulfafurazole', 'sulfamethizole', 'sulfanilamid',
        'sulfonamidochrysoidine', 'sulfacetamid', 'sulfadiazine',
        'sulfisomidine', 'sulfamoxole', 'sulfanitran',
        'sulfamethoxypyridazine', 'sulfametoxydiazine', 'sulfadoxine',
        'sulfametopyrazine', 'mafenid', 'sulfaclozine',
        'sulfachloropyridazine', 'cotrimoxazol'
    ],
    'oxazolidones': [
        'cycloserine', 'linezolid', 'posizolid', 'tedizolid',
        'torezolid', // Thêm tên thay thế cho dễ tra cứu
        'radezolid', 'eperezolid', 'ranbezolid', 'sutezolid'
    ],
    'nitroimidazoles': [
        'metronidazole', 'tinidazole', 'ornidazole', 'secnidazole',
        'nimorazole', 'carnidazole', 'misonidazole', 'dimetridazol',
        'ronidazole', 'ipronidazole', 'benznidazole', 'azomycin',
        'fexinidazole'
    ],
    'nitrofurans': [
        'difurazone', 'furazolidone', 'nifuroxazide',
        'nifurquinazol', 'nifurtoinol', 'nifurzide',
        'nitrofurazone', 'nitrofurantoin', 'furaltadone',
        'furazidine', 'furylfuramide', 'nifuratel',
        'nifurtimox'
    ],
    'phosphonics': [
        'fosfomycin', 'fosmidomycin', 'alafosfalin'
    ],
    'ionophores': [
        'salinomycin', 'monensin', 'lasalocid'
    ],
    'pleuromutilins': [
        'lefamulin', 'retapamulin', 'tiamulin', 'valnemulin',
        'azamulin'
    ],
    'streptogramins': [
        'pristinamycin', 'quinupristin', 'dalfopristin',
        'virginiamycin'
    ],
    'aminocoumarins': [
        'novobiocin', 'coumermycin-a1', 'clorobiocin'
    ],
    'lao-phong': [
        'dapsone', 'promin', 'capreomycin', 'ethambutol',
        'ethionamide', 'clofazimine', 'isoniazid'
    ],
    'minerals': [
        'calcium', 'magnesium', 'iron', 'zinc'
    ],
    'diaminopyrimidine': [
        'trimethoprim', 'pyrimethamine', 'iclaprim'
    ],
    'other/new': [
        'fusidic-acid', 'anthracimycin', 'anthramycin',
        'lugdunin', 'nitazoxanide', 'halicin',
        'mupirocin', 'platensimycin', 'malacidin',
        'lariocidin', 'zosurabalpin', 'cefepime-taniborbactam',
        'darobactin', 'orlynvah', 'cefepime-enmetazobactam',
        'cresomycin'
    ]
};

// Ánh xạ từng kháng sinh về nhóm của nó (để tra cứu nhanh)
export const antibioticToGroupMap = new Map();
for (const group in antibioticGroups) {
    if (Object.prototype.hasOwnProperty.call(antibioticGroups, group)) {
        antibioticGroups[group].forEach(antibiotic => {
            antibioticToGroupMap.set(antibiotic.toLowerCase(), group);
        });
    }
}

// Hàm lấy tên nhóm của một kháng sinh
export function getAntibioticGroup(antibioticName) {
    if (!antibioticName) return null;
    return antibioticToGroupMap.get(antibioticName.trim().toLowerCase());
}

// GIẢI THÍCH MỘT SỐ TỪ CHUYÊN NGÀNH
// Hiệp đồng (Synergistic): Hai loại kháng sinh hoạt động tốt hơn khi kết hợp so với khi dùng riêng lẻ (1+1=3)
// Đối kháng (Antagonistic): Hai loại kháng sinh làm giảm hiệu quả của nhau khi kết hợp.
// Cộng gộp (Additive): Hai loại kháng sinh có tác dụng cộng lại khi kết hợp. Ví dụ, Beta-lactamase và Penicillins.
// Thận trọng (Caution): Cần cân nhắc kỹ khi kết hợp vì có thể có tác dụng phụ nghiêm trọng hoặc tương tác không mong muốn.
// Cạnh tranh (Competition): Hai loại kháng sinh có cơ chế tác dụng tương tự, thường cùng gắn vào một vị trí (ví dụ, PBP trên thành tế bào vi khuẩn), dẫn đến cạnh tranh và có thể làm giảm hiệu quả của nhau.

// Quy tắc tương tác giữa các NHÓM kháng sinh
// Đây là phần CỰC KỲ QUAN TRỌNG. Bạn cần điền DỮ LIỆU CHÍNH XÁC từ các nguồn y khoa.
// Cách viết các cặp tương tác phải theo thức tự ABC, tức là các chữ cái đầu của tên 2 nhóm KS phải sắp theo ABC
export const combinationRules = {
    // Các tương tác giữa các thành viên beta-lactam với nhau (ức chế quá trình tổng hợp thành tế bào vi khuẩn bằng cách liên kết với các protein gắn penicillin (PBP))

    'cephalosporins-penicillins': 'competition', // Cạnh tranh vị trí gắn lên PBP, có thể gây dị ứng chéo nhưng không hẳn là đối kháng. Cẩn trọng
    'carbapenems-penicillins': 'competition', // Cạnh tranh vị trí gắn lên PBP (Carbapenems có phổ kháng khuẩn rộng nhất trong các beta-lactam, gram dương, gram âm và vi khuẩn kỵ khí)
    'monobactams-penicillins': 'competition', // Cạnh tranh vị trí gắn lên PBP
    'cephalosporins-monobactams': 'competition', // Cạnh tranh vị trí gắn lên PBP
    'carbapenems-cephalosporins': 'competition', // Cạnh tranh vị trí gắn lên PBP
    'carbapenems-monobactams': 'caution', // Cẩn thận, có thể gây dị ứng chéo nghiêm trọng, hai loại này vẫn là competition, cạnh tranh vị trí gắn lên PBP

    // Các quy tắc của nhóm penicillins
    'aminoglycosides-penicillins': 'synergistic', // Hiệp lực hay Hiệp đồng đều ok, trong kết quả sẽ hiện ra chữ HIỆP ĐỒNG
    'penicillins-peptides': 'synergistic', // Hiệp lực
    'penicillins-quinolones': 'synergistic', // Hiệp lực
    'penicillins-tetracyclines': 'antagonistic', // Đối kháng
    'penicillins-phenicols': 'antagonistic', // Đối kháng
    'macrolides-penicillins': 'antagonistic', // Đối kháng
    'lincosamides-penicillins': 'antagonistic', // Đối kháng
    'pleuromutilins-penicillins': 'antagonistic', // Đối kháng
    'penicillins-sulfonamides': 'antagonistic', // Đối kháng
    'diaminopyrimidine-penicillins': 'antagonistic', // Đối kháng

    // Các quy tắc của nhóm cephalosporins
    'aminoglycosides-cephalosporins': 'synergistic', // Hiệp lực, có tài liệu là 'additive'
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
    'aminoglycosides-monobactams': 'synergistic', // Hiệp lực
    'monobactams-peptides': 'synergistic', // Hiệp lực
    'monobactams-quinolones': 'synergistic', // Hiệp lực
    'monobactams-tetracyclines': 'antagonistic', // Đối kháng
    'monobactams-phenicols': 'antagonistic', // Đối kháng
    'macrolides-monobactams': 'antagonistic', // Đối kháng
    'lincosamides-monobactams': 'antagonistic', // Đối kháng
    'monobactams-pleuromutilins': 'antagonistic', // Đối kháng
    'monobactams-sulfonamides': 'antagonistic', // Đối kháng
    'diaminopyrimidine-monobactams': 'antagonistic', // Đối kháng
    
    // Các quy tắc của nhóm carbapenems
    'aminoglycosides-carbapenems': 'synergistic', // Hiệp lực
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
    'macrolides-peptides': 'synergistic', // Hiệp lực
    'lincosamides-peptides': 'synergistic', // Hiệp lực
    'peptides-pleuromutilins': 'synergistic', // Hiệp lực
// Cần xem xét lại 2 trường hợp dưới (cùng là nhóm diệt khuẩn)
    'aminoglycosides-peptides': 'additive', // Hiệp đồng mạnh mẽ (Có tài liệu ghi 'caution', hết sức thận trọng)
    'peptides-quinolones': 'additive', // Hiệp đồng hoặc cộng gộp (Đôi khi là 'caution' vì độc tính)

    // Các quy tắc của nhóm quinolon
    'quinolones-tetracyclines': 'synergistic', // Hiệp lực
    'phenicols-quinolones': 'synergistic', // Hiệp lực
    'macrolides-quinolones': 'synergistic', // Hiệp lực, có lúc lại ghi 'additive'
    'lincosamides-quinolones': 'synergistic', // Hiệp lực
    'pleuromutilins-quinolones': 'synergistic', // Hiệp lực
// Cầm kiểm tra 2 trường hợp sau
    'quinolones-sulfonamides': 'additive',
    'aminoglycosides-quinolones': 'synergistic', // Cùng là diệt khuẩn, tùy vào nồng độ có khi là cộng gộp, có khi hiệp đồng (Có lúc thận trọng 'caution')

    // Các quy tắc của nhóm tetracyclines
    'sulfonamides-tetracyclines': 'synergistic', // Hiệp lực
    'diaminopyrimidine-tetracyclines': 'synergistic', // Hiệp lực
// Cần xem xét 2 trường hợp dưới
    'phenicols-tetracyclines': 'caution', // Cộng gộp vì tetra gắn 30S, pheni gắn 50S ('caution' không khuyến cáo vì tác dụng phụ nghiêm trọng)
    'macrolides-tetracyclines': 'caution', // Cộng gộp (Không khuyến cáo vì tác dụng phụ nghiêm trọng)

    // Các quy tắc của nhóm phenicols
    'phenicols-sulfonamides': 'synergistic', // Hiệp lực
    'diaminopyrimidine-phenicols': 'synergistic', // Hiệp lực 

    // Các quy tắc của nhóm macrolides
    'macrolides-sulfonamides': 'synergistic', // Hiệp lực
    'diaminopyrimidine-macrolides': 'synergistic', // Hiệp lực
// Cần kiểm tra 2 trường hợp dưới
    'lincosamides-macrolides': 'competition', // Cạnh tranh 50S
    'macrolides-phenicols': 'competition', // Cạnh tranh 50S

    // Các quy tắc của nhóm lincosamides
    'lincosamides-sulfonamides': 'synergistic', // Hiệp lực
    'diaminopyrimidine-lincosamides': 'synergistic', // Hiệp lực
// Cần xem xét 2 trường hợp dưới
    'lincosamides-tetracyclines': 'caution', // Cộng gộp (Không khuyến cáo vì tăng tác dụng phụ)
    'lincosamides-phenicols': 'competition', // Cạnh tranh 50S, không khuyến cáo, cân nhắc

    // Các quy tắc của nhóm pleuromutilins
    'pleuromutilins-sulfonamides': 'synergistic', // Hiệp lực
    'diaminopyrimidine-pleuromutilins': 'synergistic', // Hiệp lực

    // Các quy tắc của nhóm diaminopyrimidine (ức chế enzyme dihydrofolate reductase, một enzyme quan trọng trong con đường tổng hợp acid folic của vi khuẩn)
    'diaminopyrimidine-pleuromutilins': 'synergistic', // Cộng gộp
    'diaminopyrimidine-tetracyclines': 'synergistic', // Cộng gộp
    'diaminopyrimidine-phenicols': 'synergistic', // Cộng gộp
    'diaminopyrimidine-macrolides': 'synergistic', // Cộng gộp
    'diaminopyrimidine-lincosamides': 'synergistic', // Cộng gộp
    'diaminopyrimidine-penicillins': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'cephalosporins-diaminopyrimidine': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'carbapenems-diaminopyrimidine': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'diaminopyrimidine-monobactams': 'antagonistic', // Có tài liệu ghi là Hiệp đồng hoặc cộng gộp
    'diaminopyrimidine-sulfonamides': 'synergistic', // Hiệp đồng mạnh mẽ
    'diaminopyrimidine-peptides': 'synergistic', // Cộng gộp
    'aminoglycosides-diaminopyrimidine': 'synergistic', // Cộng gộp
    'diaminopyrimidine-quinolones': 'synergistic', // Hiệp đồng

    // XV. Các quy tắc của nhóm oxazolidones
    // 15.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 15.1.1 Với thành viên của beta-lactam
    'oxazolidones-penicillins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'cephalosporins-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'monobactams-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'carbapenems-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp
    // 15.1.2 Với thành viên của peptides
    'oxazolidones-peptides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    // 15.1.3 Với thành viên của phosphonics
    'oxazolidones-phosphonics': 'synergistic', // Hiệp đồng
    // 15.2 Với các kháng sinh ức chế tổng hợp protein khác, lưu ý một vài trường hợp sẽ cạnh tranh vị trí tác động, dẫn đến chồng chéo, đối kháng
    'aminoglycosides-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-tetracyclines': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'macrolides-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'lincosamides-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-phenicols': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'oxazolidones-streptogramins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'aminocoumarins-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp, do nhóm này ức chế DNA gyrase
    // 15.3 Với các kháng sinh khác
    'oxazolidones-quinolones': 'synergistic', // Hiệp đồng hoặc cộng gộp, do quino ức chế DNA
    'oxazolidones-sulfonamides': 'synergistic', // Hiệp đồng hoặc cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-oxazolidones': 'synergistic', // Hiệp đồng hoặc cộng gộp, do diamino ức chế tổng hợp acid folic
    'nitroimidazoles-oxazolidones': 'synergistic', // Cộng gộp, do nitroimi sản sinh chất có hại cho tế bào vi khuẩn
    'nitrofurans-oxazolidones': 'synergistic', // Cộng gộp, do nitrofu sản sinh chất có hại cho tế bào vi khuẩn
    'ionophores-oxazolidones': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn
    'oxazolidones-pleuromutilins': 'caution', // Có thể cộng gộp, cũng có thể đối kháng, do cùng cạnh tranh gắn vào tiểu đơn vị 50S của ribosome.

    // XVI. Các quy tắc của nhóm nitroimidazoles
    // 16.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 16.1.1 Với thành viên của beta-lactam
    'nitroimidazoles-penicillins': 'synergistic', // Cộng gộp
    'cephalosporins-nitroimidazoles': 'synergistic', // Cộng gộp
    'monobactams-nitroimidazoles': 'synergistic', // Cộng gộp
    'carbapenems-nitroimidazoles': 'synergistic', // Cộng gộp
    // 16.1.2 Với thành viên của peptides
    'nitroimidazoles-peptides': 'synergistic', // Hiệp đồng hoặc cộng gộp
    // 16.1.3 Với thành viên của phosphonics
    'nitroimidazoles-phosphonics': 'synergistic', // Cộng gộp
    // 16.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminoglycosides-nitroimidazoles': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-tetracyclines': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'macrolides-nitroimidazoles': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'lincosamides-nitroimidazoles': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-phenicols': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-pleuromutilins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitroimidazoles-streptogramins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'aminocoumarins-nitroimidazoles': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 16.3 Với các kháng sinh khác
    'nitroimidazoles-quinolones': 'synergistic', // Hiệp đồng, do quino ức chế DNA
    'nitroimidazoles-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-nitroimidazoles': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic
    'nitrofurans-nitroimidazoles': 'synergistic', // Cộng gộp, do nitrofu sản sinh chất có hại cho tế bào vi khuẩn
    'ionophores-nitroimidazoles': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn

    // XVII. Các quy tắc của nhóm nitrofurans (chủ yếu trị tiết niệu, ít toàn thân)
    // 17.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 17.1.1 Với thành viên của beta-lactam
    'nitrofurans-penicillins': 'synergistic', // Cộng gộp
    'cephalosporins-nitrofurans': 'synergistic', // Cộng gộp
    'monobactams-nitrofurans': 'synergistic', // Cộng gộp
    'carbapenems-nitrofurans': 'synergistic', // Cộng gộp
    // 17.1.2 Với thành viên của peptides
    'nitrofurans-peptides': 'synergistic', // Cộng gộp
    // 17.1.3 Với thành viên của phosphonics
    'nitrofurans-phosphonics': 'synergistic', // Cộng gộp
    // 17.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminoglycosides-nitrofurans': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-tetracyclines': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'macrolides-nitrofurans': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'lincosamides-nitrofurans': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-phenicols': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-pleuromutilins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'nitrofurans-streptogramins': 'synergistic', // Hiệp đồng hoặc cộng gộp
    'aminocoumarins-nitrofurans': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 17.3 Với các kháng sinh khác
    'nitrofurans-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, có tài liệu ghi 'additive'
    'nitrofurans-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-nitrofurans': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic
    'ionophores-nitrofurans': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn

    // XVIII. Các quy tắc của nhóm phosphonics
    // 18.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 18.1.1 Với thành viên của beta-lactam (để trị các nhiễm trùng đa kháng MRSA, VRE)
    'penicillins-phosphonics': 'synergistic', // Hiệp đồng
    'cephalosporins-phosphonics': 'synergistic', // Hiệp đồng
    'monobactams-phosphonics': 'synergistic', // Hiệp đồng
    'carbapenems-phosphonics': 'synergistic', // Hiệp đồng
    // 18.1.2 Với thành viên của peptides
    'peptides-phosphonics': 'synergistic', // Hiệp đồng mạnh mẽ
    // 18.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminoglycosides-phosphonics': 'synergistic', // Hiệp đồng, tạo điều kiện cho aminoglycosides xâm nhập vào tế bào vi khuẩn dễ dàng hơn bằng cách làm suy yếu thành tế bào
    'phosphonics-tetracyclines': 'synergistic', // Cộng gộp-Additive
    'macrolides-phosphonics': 'synergistic', // Cộng gộp
    'lincosamides-phosphonics': 'synergistic', // Cộng gộp
    'phenicols-phosphonics': 'synergistic', // Cộng gộp
    'phosphonics-pleuromutilins': 'synergistic', // Cộng gộp
    'phosphonics-streptogramins': 'synergistic', // Cộng gộp
    'aminocoumarins-phosphonics': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 18.3 Với các kháng sinh khác
    'phosphonics-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'phosphonics-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-phosphonics': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic
    'ionophores-phosphonics': 'synergistic', // Cộng gộp, do iono làm thay đổi gradient ion màng tế bào vi khuẩn

    // XIX. Các quy tắc của nhóm ionophores
    // 19.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 19.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'ionophores-penicillins': 'synergistic', // Cộng gộp
    'cephalosporins-ionophores': 'synergistic', // Cộng gộp
    'ionophores-monobactams': 'synergistic', // Cộng gộp
    'carbapenems-ionophores': 'synergistic', // Cộng gộp
    // 19.1.2 Với thành viên của peptides
    'ionophores-peptides': 'synergistic', // Cộng gộp
    // 19.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminoglycosides-ionophores': 'synergistic', // Hiệp đồng, tạo điều kiện cho aminoglycosides xâm nhập vào tế bào vi khuẩn dễ dàng hơn bằng cách làm suy yếu thành tế bào
    'ionophores-tetracyclines': 'synergistic', // Cộng gộp-Additive
    'ionophores-macrolides': 'synergistic', // Cộng gộp
    'ionophores-lincosamides': 'synergistic', // Cộng gộp
    'ionophores-phenicols': 'synergistic', // Cộng gộp
    'ionophores-pleuromutilins': 'synergistic', // Cộng gộp
    'ionophores-streptogramins': 'synergistic', // Cộng gộp
    'aminocoumarins-ionophores': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 19.3 Với các kháng sinh khác
    'ionophores-quinolones': 'synergistic', // Cộng gộp hoặc Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'ionophores-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-ionophores': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // XX. Các quy tắc của nhóm pleuromutilins (ức chế tổng hợp protein bằng cách gắn vào tiểu đơn vị 50S của ribosome vi khuẩn, tại vị trí peptidyl transferase)
    // 20.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 20.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'penicillins-pleuromutilins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'cephalosporins-pleuromutilins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'monobactams-pleuromutilins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'carbapenems-pleuromutilins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 20.1.2 Với thành viên của peptides
    'peptides-pleuromutilins': 'synergistic', // Cộng gộp
    // 20.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminoglycosides-pleuromutilins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'pleuromutilins-tetracyclines': 'caution', // Cộng gộp-Additive, vì tetracyclines gắn vào tiểu đơn vị 30S, cũng có trường hợp gây tác dụng phụ
    'macrolides-pleuromutilins': 'competition', // Cạnh tranh vị trí gắn vào tiểu đơn vị 50S của ribosome
    'lincosamides-pleuromutilins': 'competition', // Cạnh tranh, không khuyến cáo, cùng gắn vào 50S
    'phenicols-pleuromutilins': 'competition', // Cạnh tranh 50S (Có trường hợp Cộng gộp hoặc Hiệp đồng, nhưng có trường hợp giảm hiệu quả của nhau. Cần cân nhắc)
    'pleuromutilins-streptogramins': 'competition', // Cạnh tranh 50S
    'aminocoumarins-pleuromutilins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 20.3 Với các kháng sinh khác
    'pleuromutilins-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'pleuromutilins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-pleuromutilins': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // XXI. Các quy tắc của nhóm streptogramins (Phức hợp 2 thành phần (Streptogramin A và Streptogramin B) hiệp đồng trên tiểu đơn vị 50S của ribosome, ức chế tổng hợp protein của vi khuẩn)
    // 21.1 Với các kháng sinh ức chế tổng hợp thành tế bào vi khuẩn
    // 21.1.1 Với thành viên của beta-lactam (hoạt động độc lập, kết hợp có thể tăng hiệu quả)
    'penicillins-streptogramins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'cephalosporins-streptogramins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'monobactams-streptogramins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'carbapenems-streptogramins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 21.1.2 Với thành viên của peptides
    'peptides-streptogramins': 'synergistic', // Cộng gộp
    // 21.2 Với các kháng sinh ức chế tổng hợp protein khác
    'aminoglycosides-streptogramins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'streptogramins-tetracyclines': 'synergistic', // Cộng gộp-Additive hoặc Hiệp đồng, vì tetracyclines gắn vào tiểu đơn vị 30S
    'macrolides-streptogramins': 'competition', // Cạnh tranh vị trí gắn 50S
    'lincosamides-streptogramins': 'competition', // Cạnh tranh vị trí gắn
    'phenicols-streptogramins': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    'aminocoumarins-streptogramins': 'synergistic', // Cộng gộp, do nhóm này ức chế DNA gyrase
    // 21.3 Với các kháng sinh khác
    'quinolones-streptogramins': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, mở rộng phổ
    'streptogramins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'diaminopyrimidine-streptogramins': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

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
    'aminocoumarins-macrolides': 'competition', // Cạnh tranh vị trí gắn 50S
    'aminocoumarins-lincosamides': 'competition', // Cạnh tranh vị trí gắn 50S
    'aminocoumarins-phenicols': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 22.3 Với các kháng sinh khác
    'aminocoumarins-quinolones': 'synergistic', // Hiệp đồng mạnh mẽ, do quinolones ức chế enzyme DNA gyrase, nhưng ở 2 vị trí khác nhau
    'aminocoumarins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'aminocoumarins-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // Các quy tắc của các nhóm chưa mà chưa có tài liệu nói rõ là có hay không
    'aminoglycosides-phosphonics': 'synergistic',
    'ionophores-other/new': 'neutral',
    'macrolides-pleuromutilins': 'caution',
    'macrolides-streptogramins': 'caution',
    'aminocoumarins-rifamycins': 'synergistic', // Cộng gộp hoặc hiệp đồng, hiện tại không có nhóm rifamycins ở đầu vào
    'lao-phong-quinolones': 'additive',
    'other/new-other/new': 'neutral',

    // CÁC TƯƠNG TÁC ĐẶC BIỆT
    // Lưu ý: Các tương tác cụ thể giữa 2 kháng sinh không theo nhóm cần được xử lý riêng trong kiemtraks.js
    // Ví dụ: clindamycin-erythromycin hay chloramphenicol-penicillins, ceftriaxone-calcium.
};

// Hàm giúp lấy quy tắc tương tác giữa hai nhóm
export function getCombinationRule(groupA, groupB) {
    if (!groupA || !groupB) return 'unknown';
    const sortedGroups = [groupA, groupB].sort();
    const key = `${sortedGroups[0]}-${sortedGroups[1]}`;
    return combinationRules[key] || 'neutral';
}
