// TOÀN BỘ CODE CỦA FILE codeks/dataks.js

// Danh sách các nhóm kháng sinh và các kháng sinh thuộc nhóm đó
export const antibioticToGroupMap = new Map([ // hàm lấy tên nhóm của 1 kháng sinh trong nhóm //
        // TẤT CẢ KHÁNG SINH CỦA NHÓM penicillins - KS diệt khuẩn.
['penicillin-g', 'penicillins'], ['propicillin', 'penicillins'], ['penicillin-v', 'penicillins'],
['penicillin-g-procaine', 'penicillins'], ['benzathine-penicillin-g', 'penicillins'], ['benethamine-penicillin', 'penicillins'],
['penicillin-m', 'penicillins'], ['oxacillin', 'penicillins'], ['cloxacillin', 'penicillins'],
['dicloxacillin', 'penicillins'], ['methicillin', 'penicillins'], ['nafcillin', 'penicillins'],
['flucloxacillin', 'penicillins'], ['ampicillin', 'penicillins'], ['amoxycillin', 'penicillins'],
['pivampicillin', 'penicillins'], ['hetacillin', 'penicillins'], ['bacampicillin', 'penicillins'],
['metampicillin', 'penicillins'], ['talampicillin', 'penicillins'], ['epicillin', 'penicillins'],
['sulbenicillin', 'penicillins'], ['temocillin', 'penicillins'], ['carbenicilin', 'penicillins'],
['ticarcilin', 'penicillins'], ['carindacillin', 'penicillins'], ['mecillinam (amdinocillin)', 'penicillins'],
['mezlocillin', 'penicillins'], ['piperacillin', 'penicillins'], ['azlocillin', 'penicillins'],
['pivmecillinam', 'penicillins'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM cephalosporin - KS diệt khuẩn.
['cephalexin', 'cephalosporins'], ['cefalotin', 'cephalosporins'], ['cefazolin', 'cephalosporins'],
['cefradine', 'cephalosporins'], ['cefadroxil', 'cephalosporins'], ['cefaloglycin', 'cephalosporins'],
['cefalonium', 'cephalosporins'], ['cephaloridin', 'cephalosporins'], ['cefatrizine', 'cephalosporins'],
['cefazaflur', 'cephalosporins'], ['cefacetrile', 'cephalosporins'], ['cefapirin', 'cephalosporins'],
['cefaclor', 'cephalosporins'], ['cefoxitine', 'cephalosporins'], ['cefamandole', 'cephalosporins'],
['cefonicid', 'cephalosporins'], ['cefuroxime', 'cephalosporins'], ['cefprozil', 'cephalosporins'],
['cefuzonam', 'cephalosporins'], ['ceforanide', 'cephalosporins'], ['cefotetan', 'cephalosporins'],
['cefmetazole', 'cephalosporins'], ['cefbuperazone', 'cephalosporins'], ['cefminox', 'cephalosporins'],
['ceftizoxime', 'cephalosporins'], ['ceftiofur', 'cephalosporins'], ['cefotaxime', 'cephalosporins'],
['ceftriaxone', 'cephalosporins'], ['cefoperazone', 'cephalosporins'], ['cefpiramide', 'cephalosporins'],
['cefcapene', 'cephalosporins'], ['cefdaloxime', 'cephalosporins'], ['cefdinir', 'cephalosporins'],
['cefditoren', 'cephalosporins'], ['cefetamet', 'cephalosporins'], ['cefixime', 'cephalosporins'],
['cefmenoxime', 'cephalosporins'], ['cefodizime', 'cephalosporins'], ['cefovecin', 'cephalosporins'],
['cefpimizole', 'cephalosporins'], ['cefpodoxime', 'cephalosporins'], ['cefteram', 'cephalosporins'],
['ceftibuten', 'cephalosporins'], ['ceftiolene', 'cephalosporins'], ['ceftazidime', 'cephalosporins'],
['latamoxef', 'cephalosporins'], ['cefepime', 'cephalosporins'], ['cefclidin', 'cephalosporins'],
['cefiderocol', 'cephalosporins'], ['cefluprenam', 'cephalosporins'], ['cefoselis', 'cephalosporins'],
['cefozopran', 'cephalosporins'], ['cefpirome', 'cephalosporins'], ['cefquinome', 'cephalosporins'],
['flomoxef', 'cephalosporins'], ['ceftobiprole', 'cephalosporins'], ['ceftaroline', 'cephalosporins'],
['ceftolozane', 'cephalosporins'], ['cefazedone', 'cephalosporins'], ['cefroxadine', 'cephalosporins'],
['ceftezol', 'cephalosporins'], ['cefazoline', 'cephalosporins'], ['loracarbef', 'cephalosporins'],
['cefotiam', 'cephalosporins'], ['cefaparole', 'cephalosporins'], ['cefmatilen', 'cephalosporins'],
['cefsumide', 'cephalosporins'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM carbapenem - KS diệt khuẩn.
['imipenem', 'carbapenems'], ['meropenem', 'carbapenems'], ['ertapenem', 'carbapenems'],
['doripenem', 'carbapenems'], ['biapenem', 'carbapenems'], ['panipenem', 'carbapenems'],
['faropenem', 'carbapenems'], ['ritipenem', 'carbapenems'], ['sulopenem', 'carbapenems'],
['thienamycin', 'carbapenems'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM monobactam - KS diệt khuẩn.
['aztreonam', 'monobactams'], ['tigemonam', 'monobactams'], ['carumonam', 'monobactams'],
['nocardicin-a', 'monobactams'],

        // TẤT CẢ CÁC CHẤT CỦA NHÓM beta-lactamase
['clavulanic-acid', 'beta-lactamase'], ['sulbactam', 'beta-lactamase'], ['tazobactam', 'beta-lactamase'],
['vaborbactam', 'beta-lactamase'], ['enmetazobactam', 'beta-lactamase'], ['relebactam', 'beta-lactamase'],
['avibactam', 'beta-lactamase'], ['taniborbactam', 'beta-lactamase'], ['durlobactam', 'beta-lactamase'],
['nacubactam', 'beta-lactamase'], ['xeruborbactam', 'beta-lactamase'], ['zidebactam', 'beta-lactamase'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM peptide - KS diệt khuẩn.
['daptomycin', 'peptides'], ['gramicidin', 'peptides'], ['gramicidin-s', 'peptides'],
['teixobactin', 'peptides'], ['vancomycin', 'peptides'], ['oritavancin', 'peptides'],
['telavancin', 'peptides'], ['teicoplanin', 'peptides'], ['dalbavancin', 'peptides'],
['ramoplanin', 'peptides'], ['bleomycin', 'peptides'], ['polymyxin-b', 'peptides'],
['colistin', 'peptides'], ['bacitracin', 'peptides'], ['tyrothricin', 'peptides'],
['surfactin', 'peptides'], ['amphomycin', 'peptides'], ['tyrocidine', 'peptides'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM amino - KS diệt khuẩn.
['netilmicin', 'aminoglycosides'], ['gentamicin', 'aminoglycosides'], ['streptomycin', 'aminoglycosides'],
['kanamycin', 'aminoglycosides'], ['neomycin', 'aminoglycosides'], ['tobramycin', 'aminoglycosides'],
['amikacin', 'aminoglycosides'], ['dibekacin', 'aminoglycosides'], ['sisomicin', 'aminoglycosides'],
['plazomicin', 'aminoglycosides'], ['dihydrostreptomycin', 'aminoglycosides'], ['paromomycin', 'aminoglycosides'],
['framycetin', 'aminoglycosides'], ['ribostamycin', 'aminoglycosides'], ['arbekacin', 'aminoglycosides'],
['bekanamycin', 'aminoglycosides'], ['hygromycin-b', 'aminoglycosides'], ['apramycin', 'aminoglycosides'],
['puromycin', 'aminoglycosides'], ['nourseothricin', 'aminoglycosides'], ['isepamicin', 'aminoglycosides'],
['verdamicin', 'aminoglycosides'], ['astromicin', 'aminoglycosides'], ['spectinomycin', 'aminoglycosides'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM tetracyclines - KS kìm khuẩn.
['chlortetracycline', 'tetracyclines'], ['tetracycline', 'tetracyclines'], ['oxytetracycline', 'tetracyclines'],
['doxycycline', 'tetracyclines'], ['minocycline', 'tetracyclines'], ['lymecycline', 'tetracyclines'],
['demeclocycline', 'tetracyclines'], ['meclocycline', 'tetracyclines'], ['metacycline', 'tetracyclines'],
['rolitetracycline', 'tetracyclines'], ['tigecycline', 'tetracyclines'], ['eravacycline', 'tetracyclines'],
['sarecycline', 'tetracyclines'], ['glycylcycline', 'tetracyclines'], ['clomocycline', 'tetracyclines'],
['omadacycline', 'tetracyclines'], ['pipacycline', 'tetracyclines'], ['penimepicycline', 'tetracyclines'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM macrolides - KS kìm khuẩn.
['pikromycin', 'macrolides'], ['erythromycin', 'macrolides'], ['boromycin', 'macrolides'],
['dirithromycin', 'macrolides'], ['flurithromycin', 'macrolides'], ['miocamycin', 'macrolides'],
['rokitamycin', 'macrolides'], ['josamycin', 'macrolides'], ['spiramycin', 'macrolides'],
['tylosin', 'macrolides'], ['clarithromycin', 'macrolides'], ['azithromycin', 'macrolides'],
['tulathromycin', 'macrolides'], ['tilmicosin', 'macrolides'], ['kitasamycin', 'macrolides'],
['midecamycin', 'macrolides'], ['oleandomycin', 'macrolides'], ['troleandomycin', 'macrolides'],
['roxithromycin', 'macrolides'], ['telithromycin', 'macrolides'], ['cethromycin', 'macrolides'],
['solithromycin', 'macrolides'], ['streptovaricin a-g', 'macrolides'], ['geldanamycin', 'macrolides'],
['macbecin', 'macrolides'], ['herbimycin', 'macrolides'], ['fidaxomicin', 'macrolides'],
['rifamycin sv', 'macrolides'], ['rifampicin', 'macrolides'], ['rifabutin', 'macrolides'],
['rifapentine', 'macrolides'], ['rifaximin', 'macrolides'], ['rifalazil', 'macrolides'],
['tildipirosin', 'macrolides'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM lincosamides - KS kìm khuẩn.
['lincomycin', 'lincosamides'], ['clindamycin', 'lincosamides'], ['pirlimycin', 'lincosamides'],
['iboxamycin', 'lincosamides'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM phenicols - KS kìm khuẩn.
['chloramphenicol', 'phenicols'], ['thiamphenicol', 'phenicols'], ['florfenicol', 'phenicols'],
['azidamfenicol', 'phenicols'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM quinolones - KS diệt khuẩn.
['nalidixic-acid', 'quinolones'], ['pipemidic-acid', 'quinolones'], ['oxolinic-acid', 'quinolones'],
['piromidic-acid', 'quinolones'], ['flumequine', 'quinolones'], ['rosoxacin', 'quinolones'],
['norfloxacin', 'quinolones'], ['ofloxacin', 'quinolones'], ['ciprofloxacin', 'quinolones'],
['pefloxacin', 'quinolones'], ['fleroxacin', 'quinolones'], ['lomefloxacin', 'quinolones'],
['nadifloxacin', 'quinolones'], ['rufloxacin', 'quinolones'], ['enoxacin', 'quinolones'],
['levofloxacin', 'quinolones'], ['balofloxacin', 'quinolones'], ['grepafloxacin', 'quinolones'],
['pazufloxacin', 'quinolones'], ['sparfloxacin', 'quinolones'], ['temafloxacin', 'quinolones'],
['tosufloxacin', 'quinolones'], ['gatifloxacin', 'quinolones'], ['clinafloxacin', 'quinolones'],
['moxifloxacin', 'quinolones'], ['sitafloxacin', 'quinolones'], ['prulifloxacin', 'quinolones'],
['besifloxacin', 'quinolones'], ['delafloxacin', 'quinolones'], ['gemifloxacin', 'quinolones'],
['trovafloxacin', 'quinolones'], ['ozenoxacin', 'quinolones'], ['finafloxacin', 'quinolones'],
['garenoxacin', 'quinolones'], ['alatrofloxacin', 'quinolones'], ['valcofloxacin', 'quinolones'],
['gelmofloxacin', 'quinolones'], ['cinoxacin', 'quinolones'], ['nemonoxacin', 'quinolones'],
['pradofloxacin', 'quinolones'], ['enrofloxacin', 'quinolones'], ['danofloxacin', 'quinolones'],
['marbofloxacin', 'quinolones'], ['difloxacin', 'quinolones'], ['ibafloxacin', 'quinolones'],
['orbifloxacin', 'quinolones'], ['sarafloxacin', 'quinolones'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM sulfonamid - KS kìm khuẩn.
//Lưu ý: Cotrimoxazol-diệt khuẩn: Kết hợp của Sulfonamides ức chế enzyme dihydropteroate synthase (giai đoạn đầu của tổng hợp acid folic), trong khi diaminopyrimidine ức chế enzyme dihydrofolate reductase (giai đoạn sau)
['sulfamethoxazole', 'sulfonamides'], ['sulfaguanidine', 'sulfonamides'], ['sulfadimidine', 'sulfonamides'],
['sulfamonomethoxine', 'sulfonamides'], ['sulfadimethoxine', 'sulfonamides'], ['sulfasalazine', 'sulfonamides'],
['sulfafurazole', 'sulfonamides'], ['sulfamethizole', 'sulfonamides'], ['sulfanilamid', 'sulfonamides'],
['sulfonamidochrysoidine', 'sulfonamides'], ['sulfacetamid', 'sulfonamides'], ['sulfadiazine', 'sulfonamides'],
['sulfisomidine', 'sulfonamides'], ['sulfamoxole', 'sulfonamides'], ['sulfanitran', 'sulfonamides'],
['sulfamethoxypyridazine', 'sulfonamides'], ['sulfametoxydiazine', 'sulfonamides'], ['sulfadoxine', 'sulfonamides'],
['sulfametopyrazine', 'sulfonamides'], ['mafenid', 'sulfonamides'], ['sulfaclozine', 'sulfonamides'],
['sulfachloropyridazine', 'sulfonamides'], ['cotrimoxazol', 'sulfonamides'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM oxazolidone - KS kìm khuẩn.
// tedizolid còn có tên là torezolid
['cycloserine', 'oxazolidones'], ['linezolid', 'oxazolidones'], ['posizolid', 'oxazolidones'],
['tedizolid', 'oxazolidones'], ['radezolid', 'oxazolidones'], ['eperezolid', 'oxazolidones'],
['ranbezolid', 'oxazolidones'], ['sutezolid', 'oxazolidones'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM nitroimidazol - KS diệt khuẩn
['metronidazole', 'nitroimidazoles'], ['tinidazole', 'nitroimidazoles'], ['ornidazole', 'nitroimidazoles'],
['secnidazole', 'nitroimidazoles'], ['nimorazole', 'nitroimidazoles'], ['carnidazole', 'nitroimidazoles'],
['misonidazole', 'nitroimidazoles'], ['dimetridazol', 'nitroimidazoles'], ['ronidazole', 'nitroimidazoles'],
['ipronidazole', 'nitroimidazoles'], ['benznidazole', 'nitroimidazoles'], ['azomycin', 'nitroimidazoles'],
['fexinidazole', 'nitroimidazoles'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM nitrofuran (kìm khuẩn ở nồng độ thấp, diệt khuẩn ở nồng độ cao)
['difurazone', 'nitrofurans'], ['furazolidone', 'nitrofurans'], ['nifuroxazide', 'nitrofurans'],
['nifurquinazol', 'nitrofurans'], ['nifurtoinol', 'nitrofurans'], ['nifurzide', 'nitrofurans'],
['nitrofurazone', 'nitrofurans'], ['nitrofurantoin', 'nitrofurans'], ['furaltadone', 'nitrofurans'],
['furazidine', 'nitrofurans'], ['furylfuramide', 'nitrofurans'], ['nifuratel', 'nitrofurans'],
['nifurtimox', 'nitrofurans'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM phosphonic - KS diệt khuẩn.
['fosfomycin', 'phosphonics'], ['fosmidomycin', 'phosphonics'], ['alafosfalin', 'phosphonics'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM ionophore - KS diệt khuẩn.
['salinomycin', 'ionophores'], ['monensin', 'ionophores'], ['lasalocid', 'ionophores'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM pleuromutilin - KS kìm khuẩn.
['lefamulin', 'pleuromutilins'], ['retapamulin', 'pleuromutilins'], ['tiamulin', 'pleuromutilins'],
['valnemulin', 'pleuromutilins'], ['azamulin', 'pleuromutilins'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM Streptogramin
// Gồm 2 thành phần: Streptogramin A và Streptogramin B, đứng riêng thì kìm khuẩn, khi kết hợp lại thì diệt khuẩn
['pristinamycin', 'streptogramins'], ['quinupristin', 'streptogramins'], ['dalfopristin', 'streptogramins'],
['virginiamycin', 'streptogramins'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM aminocoumarin - KS kìm khuẩn.
['novobiocin', 'aminocoumarins'], ['coumermycin-a1', 'aminocoumarins'], ['clorobiocin', 'aminocoumarins'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM trị lao, trị phong
['dapsone', 'lao-phong'], ['promin', 'lao-phong'], ['capreomycin', 'lao-phong'],
['ethambutol', 'lao-phong'], ['ethionamide', 'lao-phong'], ['clofazimine', 'lao-phong'],
['isoniazid', 'lao-phong'],

        // CÁC KHOÁNG CHẤT PHỔ BIẾN
['calcium', 'minerals'], ['magnesium', 'minerals'], ['iron', 'minerals'],
['zinc', 'minerals'],

        // TẤT CẢ KHÁNG SINH CỦA NHÓM diamino - KS kìm khuẩn.
['trimethoprim', 'diaminopyrimidine'], ['pyrimethamine', 'diaminopyrimidine'], ['iclaprim', 'diaminopyrimidine'],

        // TẤT CẢ KHÁNG SINH MỚI RA ĐỜI HOẶC KHÔNG CÓ NHÓM CỤ THỂ
['fusidic-acid', 'other/new'], ['anthracimycin', 'other/new'], ['anthramycin', 'other/new'],
['lugdunin', 'other/new'], ['nitazoxanide', 'other/new'], ['halicin', 'other/new'],
['mupirocin', 'other/new'], ['platensimycin', 'other/new'], ['malacidin', 'other/new'],
['lariocidin', 'other/new'], ['zosurabalpin', 'other/new'], ['cefepime-taniborbactam', 'other/new'],
['darobactin', 'other/new'], ['orlynvah', 'other/new'], ['cefepime-enmetazobactam', 'other/new'],
['cresomycin', 'other/new']

]);

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

// Hàm lấy tên nhóm của một kháng sinh

// export function getAntibioticGroup(antibioticName) {
//    return antibioticToGroupMap.get(antibioticName.toLowerCase()) || null;
// }

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
export const combinationRules = {
    // Các tương tác giữa các thành viên beta-lactam với nhau (ức chế quá trình tổng hợp thành tế bào vi khuẩn bằng cách liên kết với các protein gắn penicillin (PBP))
    'penicillins-cephalosporins': 'competition', // Cạnh tranh vị trí gắn lên PBP, có thể gây dị ứng chéo nhưng không hẳn là đối kháng. Cẩn trọng
    'penicillins-carbapenems': 'competition', // Cạnh tranh vị trí gắn lên PBP (Carbapenems có phổ kháng khuẩn rộng nhất trong các beta-lactam, gram dương, gram âm và vi khuẩn kỵ khí)
    'penicillins-monobactams': 'competition', // Cạnh tranh vị trí gắn lên PBP
    'cephalosporins-monobactams': 'competition', // Cạnh tranh vị trí gắn lên PBP
    'cephalosporins-carbapenems': 'competition', // Cạnh tranh vị trí gắn lên PBP
    'monobactams-carbapenems': 'caution', // Cẩn thận, có thể gây dị ứng chéo nghiêm trọng, hai loại này vẫn là competition, cạnh tranh vị trí gắn lên PBP

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
// Cần xem xét lại 2 trường hợp dưới (cùng là nhóm diệt khuẩn)
    'peptides-aminoglycosides': 'additive', // Hiệp đồng mạnh mẽ (Có tài liệu ghi 'caution', hết sức thận trọng)
    'peptides-quinolones': 'additive', // Hiệp đồng hoặc cộng gộp (Đôi khi là 'caution' vì độc tính)

    // Các quy tắc của nhóm quinolon
    'quinolones-tetracyclines': 'synergistic', // Hiệp lực
    'quinolones-phenicols': 'synergistic', // Hiệp lực
    'quinolones-macrolides': 'synergistic', // Hiệp lực, có lúc lại ghi 'additive'
    'quinolones-lincosamides': 'synergistic', // Hiệp lực
    'quinolones-pleuromutilins': 'synergistic', // Hiệp lực
// Cầm kiểm tra 2 trường hợp sau
    'quinolones-sulfonamides': 'additive',
    'quinolones-aminoglycosides': 'synergistic', // Cùng là diệt khuẩn, tùy vào nồng độ có khi là cộng gộp, có khi hiệp đồng (Có lúc thận trọng 'caution')

    // Các quy tắc của nhóm tetracyclines
    'tetracyclines-sulfonamides': 'synergistic', // Hiệp lực
    'tetracyclines-diaminopyrimidine': 'synergistic', // Hiệp lực
// Cần xem xét 2 trường hợp dưới
    'tetracyclines-phenicols': 'caution', // Cộng gộp vì tetra gắn 30S, pheni gắn 50S ('caution' không khuyến cáo vì tác dụng phụ nghiêm trọng)
    'tetracyclines-macrolides': 'caution', // Cộng gộp (Không khuyến cáo vì tác dụng phụ nghiêm trọng)

    // Các quy tắc của nhóm phenicols
    'phenicols-sulfonamides': 'synergistic', // Hiệp lực
    'phenicols-diaminopyrimidine': 'synergistic', // Hiệp lực 

    // Các quy tắc của nhóm macrolides
    'macrolides-sulfonamides': 'synergistic', // Hiệp lực
    'macrolides-diaminopyrimidine': 'synergistic', // Hiệp lực
// Cần kiểm tra 2 trường hợp dưới
    'macrolides-lincosamides': 'competition', // Cạnh tranh 50S
    'macrolides-phenicols': 'competition', // Cạnh tranh 50S

    // Các quy tắc của nhóm lincosamides
    'lincosamides-sulfonamides': 'synergistic', // Hiệp lực
    'lincosamides-diaminopyrimidine': 'synergistic', // Hiệp lực
// Cần xem xét 2 trường hợp dưới
    'lincosamides-tetracyclines': 'caution', // Cộng gộp (Không khuyến cáo vì tăng tác dụng phụ)
    'lincosamides-phenicols': 'competition', // Cạnh tranh 50S, không khuyến cáo, cân nhắc

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
    'nitrofurans-quinolones': 'synergistic', // Hiệp đồng, do quinolones ức chế enzyme DNA gyrase, có tài liệu ghi 'additive'
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
    'pleuromutilins-tetracyclines': 'caution', // Cộng gộp-Additive, vì tetracyclines gắn vào tiểu đơn vị 30S, cũng có trường hợp gây tác dụng phụ
    'pleuromutilins-macrolides': 'competition', // Cạnh tranh vị trí gắn vào tiểu đơn vị 50S của ribosome
    'pleuromutilins-lincosamides': 'competition', // Cạnh tranh, không khuyến cáo, cùng gắn vào 50S
    'pleuromutilins-phenicols': 'competition', // Cạnh tranh 50S (Có trường hợp Cộng gộp hoặc Hiệp đồng, nhưng có trường hợp giảm hiệu quả của nhau. Cần cân nhắc)
    'pleuromutilins-streptogramins': 'competition', // Cạnh tranh 50S
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
    'streptogramins-macrolides': 'competition', // Cạnh tranh vị trí gắn 50S
    'streptogramins-lincosamides': 'competition', // Cạnh tranh vị trí gắn
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
    'aminocoumarins-macrolides': 'competition', // Cạnh tranh vị trí gắn 50S
    'aminocoumarins-lincosamides': 'competition', // Cạnh tranh vị trí gắn 50S
    'aminocoumarins-phenicols': 'synergistic', // Cộng gộp hoặc Hiệp đồng
    // 22.3 Với các kháng sinh khác
    'aminocoumarins-quinolones': 'synergistic', // Hiệp đồng mạnh mẽ, do quinolones ức chế enzyme DNA gyrase, nhưng ở 2 vị trí khác nhau
    'aminocoumarins-sulfonamides': 'synergistic', // Cộng gộp, do Sulfo ức chế tổng hợp acid folic
    'aminocoumarins-diaminopyrimidine': 'synergistic', // Cộng gộp, do diamino ức chế tổng hợp acid folic

    // Các quy tắc của các nhóm chưa mà chưa có tài liệu nói rõ là có hay không
    'phosphonics-aminoglycosides': 'synergistic',
    'ionophores-other/new': 'neutral',
    'pleuromutilins-macrolides': 'caution',
    'streptogramins-macrolides': 'caution',
    'aminocoumarins-rifamycins': 'synergistic',
    'anti-tuberculosis_anti-leprosy-quinolones': 'additive',
    'other/new-other/new': 'neutral',

    // CÁC TƯƠNG TÁC ĐẶC BIỆT
    // Lưu ý: Các tương tác cụ thể giữa 2 kháng sinh không theo nhóm cần được xử lý riêng trong kiemtraks.js
    // Ví dụ: clindamycin-erythromycin hay chloramphenicol-penicillins, ceftriaxone-calcium.
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
