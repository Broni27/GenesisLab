// Builds src/data/catalog.json from the price-list spreadsheets in scripts/source.
// Run: node scripts/build-catalog.mjs
import { createRequire } from 'node:module'
import { createHash } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const require = createRequire(import.meta.url)
const XLSX = require('xlsx')
const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..')

const USD = 1.7
const EUR = 1.85

const L = (az, ru, en) => ({ az, ru, en })

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
const CATEGORIES = [
  {
    id: 'reproductive-health', icon: 'heart-handshake', featured: true,
    name: L('Reproduktiv sağlamlıq', 'Репродуктивное здоровье', 'Reproductive health'),
    description: L(
      'Qadın və kişi reproduktiv sağlamlığı üçün genetik testlər: xromosom analizi, trombofiliya panelləri, spermanın genetik qiymətləndirilməsi və hamiləlikdən öncə cütlüklərin skrininqi. Bu testlər sonsuzluq, təkrarlanan düşüklər və ya ECO planlaşdırıldıqda səbəbləri aydınlaşdırmağa və növbəti addımları həkiminizlə birlikdə planlamağa kömək edir.',
      'Генетические исследования для женского и мужского репродуктивного здоровья: хромосомный анализ, панели тромбофилии, генетическая оценка спермы и скрининг пар перед беременностью. Эти тесты помогают выяснить причины бесплодия, повторных выкидышей или подготовиться к ЭКО и вместе с врачом спланировать дальнейшие шаги.',
      'Genetic tests for female and male reproductive health: chromosome analysis, thrombophilia panels, genetic assessment of sperm and preconception screening for couples. They help clarify causes of infertility or recurrent miscarriage, support IVF planning and help you and your doctor decide on next steps.'
    ),
  },
  {
    id: 'pregnancy', icon: 'baby', featured: true,
    name: L('Hamiləlik testləri', 'Тесты во время беременности', 'Pregnancy tests'),
    description: L(
      'Hamiləlik dövründə və ECO zamanı körpənin genetik sağlamlığını qiymətləndirən testlər: NIPT, prenatal və postnatal xromosom mikroarray, embrionların preimplantasiya testi (PGT). NIPT kimi skrininq testləri yalnız ananın qanı ilə aparılır və körpə üçün təhlükəsizdir; yüksək risk nəticəsi diaqnostik testlə təsdiqlənməlidir.',
      'Исследования, оценивающие генетическое здоровье ребёнка во время беременности и при ЭКО: НИПТ, пренатальный и постнатальный хромосомный микроматричный анализ, преимплантационное тестирование эмбрионов (ПГТ). Скрининговые тесты, такие как НИПТ, проводятся только по крови матери и безопасны для ребёнка; результат высокого риска требует подтверждения диагностическим тестом.',
      "Tests that assess a baby's genetic health during pregnancy and IVF: NIPT, prenatal and postnatal chromosomal microarray, and preimplantation genetic testing of embryos (PGT). Screening tests such as NIPT need only the mother's blood and are safe for the baby; a high-risk result should be confirmed with a diagnostic test."
    ),
  },
  {
    id: 'oncology', icon: 'microscope', featured: true,
    name: L('Onkogenetika', 'Онкогенетика', 'Oncology genetics'),
    description: L(
      'Xərçəngə irsi meylliliyin qiymətləndirilməsi və şiş toxumasının molekulyar analizi: irsi xərçəng panelləri, maye biopsiya, şişin genomik profili və qan xərçənglərinin molekulyar testləri. Nəticələr onkoloqunuza müalicəni fərdiləşdirməyə, ailə üzvləriniz üçün isə müayinə planı qurmağa kömək edə bilər.',
      'Оценка наследственной предрасположенности к раку и молекулярный анализ опухоли: панели наследственного рака, жидкостная биопсия, геномное профилирование опухоли и молекулярные тесты при онкогематологических заболеваниях. Результаты помогают онкологу подобрать персонализированное лечение, а родственникам — спланировать обследование.',
      'Assessment of inherited cancer risk and molecular analysis of tumours: hereditary cancer panels, liquid biopsy, tumour genomic profiling and molecular tests for blood cancers. Results can help your oncologist personalise treatment and help relatives plan appropriate screening.'
    ),
    subcategories: [
      { id: 'hereditary-onco-panel', name: L('İrsi xərçəng panelləri', 'Панели наследственного рака', 'Hereditary cancer panels') },
      { id: 'liquid-biopsy-ctdna', name: L('Maye biopsiya (ctDNT)', 'Жидкостная биопсия (цДНК)', 'Liquid biopsy (ctDNA)') },
      { id: 'solid-tumour-ffpe', name: L('Solid şişlər (FFPE)', 'Солидные опухоли (FFPE)', 'Solid tumours (FFPE)') },
      { id: 'onco-panel', name: L('Onkoloji panellər', 'Онкологические панели', 'Oncology panels') },
      { id: 'onko-single-genes', name: L('Tək gen testləri', 'Анализ отдельных генов', 'Single-gene tests') },
      { id: 'onko-real-time-pcr-tests', name: L('Real-time PZR testləri', 'Тесты ПЦР в реальном времени', 'Real-time PCR tests') },
      { id: 'hematological-malignancies', name: L('Qanın bədxassəli xəstəlikləri', 'Онкогематология', 'Hematological malignancies') },
    ],
  },
  {
    id: 'exome', icon: 'dna', featured: true,
    name: L('Ekzom sekvenləmə', 'Секвенирование экзома', 'Exome sequencing'),
    description: L(
      'Ekzom sekvenləmə təxminən 20 000 genin zülal kodlayan hissələrini bir testdə oxuyur – məlum xəstəlik törədən dəyişikliklərin əksəriyyəti məhz burada yerləşir. Simptomlar genetik səbəbə işarə etdikdə, lakin dəqiq diaqnoz qoyulmadıqda xüsusilə faydalıdır; ailə üzvlərinin birgə testi nəticənin şərhini yaxşılaşdırır.',
      'Секвенирование экзома за один тест прочитывает белок-кодирующие участки около 20 000 генов — именно здесь находится большинство известных причинных изменений. Особенно полезно, когда симптомы указывают на генетическую причину, но точный диагноз не установлен; совместное тестирование родственников улучшает интерпретацию результата.',
      'Exome sequencing reads the protein-coding parts of about 20,000 genes in a single test – where most known disease-causing changes are found. It is especially useful when symptoms point to a genetic cause but no clear diagnosis has been reached; testing family members together improves interpretation.'
    ),
  },
  {
    id: 'neurology', icon: 'brain', featured: true,
    name: L('Nevrologiya', 'Неврология', 'Neurology'),
    description: L(
      'Epilepsiya, inkişaf ləngiməsi, autizm spektri, əzələ və hərəkət pozğunluqları kimi sinir sistemi xəstəliklərinin genetik səbəblərini araşdıran panellər. Dəqiq genetik diaqnoz bəzən müalicə seçiminə təsir edir, uzun müayinə yolunu qısaldır və ailə üçün təkrarlanma riskini aydınlaşdırır.',
      'Панели для поиска генетических причин заболеваний нервной системы: эпилепсии, задержки развития, расстройств аутистического спектра, мышечных и двигательных нарушений. Точный генетический диагноз иногда влияет на выбор лечения, сокращает долгий путь обследований и помогает оценить риск повторения в семье.',
      'Panels that look for genetic causes of nervous system conditions such as epilepsy, developmental delay, autism spectrum disorders and muscle or movement disorders. A precise genetic diagnosis can sometimes influence treatment, shorten a long diagnostic journey and clarify the chance of recurrence in the family.'
    ),
  },
  {
    id: 'hla', icon: 'shield-check', featured: true,
    name: L('HLA testləri', 'HLA-тесты', 'HLA tests'),
    description: L(
      'HLA (insan leykosit antigenləri) immun sistemin "şəxsiyyət vəsiqəsi"dir. HLA tipləməsi sümük iliyi və orqan transplantasiyası üçün uyğun donorun seçilməsində, həmçinin HLA-B27 və HLA-B51 kimi bəzi immun xəstəliklərlə əlaqəli markerlərin yoxlanmasında istifadə olunur.',
      'HLA (антигены лейкоцитов человека) — это своеобразный «паспорт» иммунной системы. HLA-типирование используется для подбора совместимого донора при трансплантации костного мозга и органов, а также для выявления маркеров, связанных с некоторыми иммунными заболеваниями, например HLA-B27 и HLA-B51.',
      'HLA (human leukocyte antigens) act as the immune system\'s "ID card". HLA typing is used to find compatible donors for bone marrow and organ transplantation and to check markers linked to certain immune conditions, such as HLA-B27 and HLA-B51.'
    ),
  },
  {
    id: 'monogenic', icon: 'flask-conical', featured: false,
    name: L('Monogen xəstəliklər', 'Моногенные заболевания', 'Monogenic diseases'),
    description: L(
      'Bir genin dəyişikliyi ilə yaranan irsi xəstəliklər üçün testlər: daşıyıcılıq skrininqi, ailədə məlum mutasiyanın yoxlanması, SMA, Düşen əzələ distrofiyası, FMF və BRCA1/2 analizləri. Bu testlər diaqnozu təsdiqləməyə, sağlam daşıyıcıları müəyyən etməyə və ailə planlamasına kömək edir.',
      'Исследования наследственных заболеваний, вызванных изменением одного гена: скрининг носительства, проверка известной в семье мутации, анализы на СМА, миодистрофию Дюшенна, ССЛ (FMF) и BRCA1/2. Эти тесты помогают подтвердить диагноз, выявить здоровых носителей и спланировать семью.',
      'Tests for inherited conditions caused by a change in a single gene: carrier screening, testing for a mutation already known in the family, SMA, Duchenne muscular dystrophy, FMF and BRCA1/2 analysis. They help confirm a diagnosis, identify healthy carriers and support family planning.'
    ),
  },
  {
    id: 'kinship', icon: 'users', featured: false,
    name: L('Qohumluq testləri', 'Тесты на родство', 'Paternity & kinship'),
    description: L(
      'DNT əsasında atalığın və digər qohumluq əlaqələrinin (nənə-baba, bacı-qardaş və s.) yüksək dəqiqliklə təyini. Nümunə ağızdan ağrısız yaxma ilə götürülür; nəticələr tam məxfilik şəraitində təqdim olunur.',
      'Установление отцовства и других родственных связей (бабушки и дедушки, братья и сёстры и т. д.) по ДНК с высокой точностью. Образец берётся безболезненно — мазком с внутренней стороны щеки; результаты предоставляются конфиденциально.',
      'Highly accurate DNA testing of paternity and other family relationships (grandparents, siblings and more). Samples are collected painlessly with a cheek swab, and results are handled confidentially.'
    ),
  },
  {
    id: 'cardiology', icon: 'heart-pulse', featured: false,
    name: L('Kardiologiya', 'Кардиология', 'Cardiology'),
    description: L(
      'Kardiomiopatiyalar, ritm pozğunluqları, aorta xəstəlikləri və anadangəlmə ürək qüsurları üçün genetik panellər. İrsi səbəbin tapılması müalicəni və müşahidəni planlamağa, ailə üzvlərində riski erkən aşkarlamağa kömək edir.',
      'Генетические панели при кардиомиопатиях, нарушениях ритма, заболеваниях аорты и врождённых пороках сердца. Выявление наследственной причины помогает спланировать лечение и наблюдение, а также заранее оценить риск у родственников.',
      'Genetic panels for cardiomyopathies, heart rhythm disorders, aortic disease and congenital heart defects. Finding an inherited cause helps plan treatment and follow-up and allows early risk assessment in relatives.'
    ),
  },
  {
    id: 'dermatology', icon: 'scan-face', featured: false,
    name: L('Dermatologiya', 'Дерматология', 'Dermatology'),
    description: L(
      'Dəri, saç, dırnaq və piqmentasiyanın irsi xəstəlikləri üçün panellər: ixtioz, bulloz epidermoliz, albinizm, Elers-Danlos sindromu və s. Genetik diaqnoz simptomların səbəbini aydınlaşdırır və ailə planlamasına dəstək olur.',
      'Панели при наследственных заболеваниях кожи, волос, ногтей и пигментации: ихтиоз, буллёзный эпидермолиз, альбинизм, синдром Элерса–Данлоса и др. Генетический диагноз объясняет причину симптомов и помогает в планировании семьи.',
      'Panels for inherited conditions of the skin, hair, nails and pigmentation, such as ichthyosis, epidermolysis bullosa, albinism and Ehlers-Danlos syndrome. A genetic diagnosis explains the cause of symptoms and supports family planning.'
    ),
  },
  {
    id: 'ent', icon: 'ear', featured: false,
    name: L('Qulaq-burun-boğaz', 'Оториноларингология', 'Ear, nose & throat'),
    description: L(
      'İrsi eşitmə itkisi və onunla əlaqəli sindromlar (Usher, Pendred, Waardenburg, Alport və s.) üçün genetik panellər. Səbəbin bilinməsi eşitmə reabilitasiyasını planlamağa və göz, böyrək kimi digər orqanların vaxtında yoxlanmasına kömək edir.',
      'Генетические панели при наследственной тугоухости и связанных с ней синдромах (Ашера, Пендреда, Ваарденбурга, Альпорта и др.). Знание причины помогает спланировать реабилитацию слуха и своевременно обследовать другие органы — глаза, почки.',
      'Genetic panels for inherited hearing loss and related syndromes (Usher, Pendred, Waardenburg, Alport and others). Knowing the cause helps plan hearing rehabilitation and timely checks of other organs such as the eyes and kidneys.'
    ),
  },
  {
    id: 'endocrinology', icon: 'droplet', featured: false,
    name: L('Endokrinologiya', 'Эндокринология', 'Endocrinology'),
    description: L(
      'Monogen diabet (MODY), qalxanabənzər vəz, böyrəküstü vəz, lipid mübadiləsi, cinsi inkişaf və piylənmənin irsi formaları üçün panellər. Genetik nəticə bəzən müalicənin seçiminə birbaşa təsir edir.',
      'Панели при моногенном диабете (MODY), заболеваниях щитовидной железы и надпочечников, нарушениях липидного обмена, формирования пола и наследственных формах ожирения. Генетический результат иногда напрямую влияет на выбор лечения.',
      'Panels for monogenic diabetes (MODY), thyroid and adrenal conditions, lipid disorders, differences of sex development and inherited forms of obesity. A genetic result can sometimes directly influence the choice of treatment.'
    ),
  },
  {
    id: 'gastroenterology', icon: 'apple', featured: false,
    name: L('Qastroenterologiya', 'Гастроэнтерология', 'Gastroenterology'),
    description: L(
      'Qaraciyər, mədəaltı vəz və bağırsağın irsi xəstəlikləri üçün panellər: xolestaz, irsi pankreatit, anadangəlmə ishal, polikistoz qaraciyər və s. Erkən başlayan və ya səbəbi bilinməyən simptomlarda diaqnozu aydınlaşdırmağa kömək edir.',
      'Панели при наследственных заболеваниях печени, поджелудочной железы и кишечника: холестаз, наследственный панкреатит, врождённая диарея, поликистоз печени и др. Помогают уточнить диагноз при раннем начале или неясной причине симптомов.',
      'Panels for inherited liver, pancreas and bowel conditions such as cholestasis, hereditary pancreatitis, congenital diarrhea and polycystic liver disease. They help clarify the diagnosis when symptoms start early or have no clear cause.'
    ),
  },
  {
    id: 'hematology', icon: 'droplets', featured: false,
    name: L('Hematologiya', 'Гематология', 'Hematology'),
    description: L(
      'Anemiyalar, qanaxma və laxtalanma pozğunluqları, trombosit və neytrofil çatışmazlıqları, sümük iliyi çatışmazlığı sindromları üçün genetik panellər. Nəticə müalicənin və ailə üzvlərinin müayinəsinin planlanmasına kömək edir.',
      'Генетические панели при анемиях, нарушениях свёртываемости крови, дефиците тромбоцитов и нейтрофилов, синдромах костномозговой недостаточности. Результат помогает спланировать лечение и обследование родственников.',
      'Genetic panels for anemias, bleeding and clotting disorders, platelet and neutrophil deficiencies and bone marrow failure syndromes. Results help plan treatment and testing of family members.'
    ),
  },
  {
    id: 'hereditary-cancer', icon: 'scan-search', featured: false,
    name: L('İrsi xərçəng', 'Наследственный рак', 'Hereditary cancer'),
    description: L(
      'Döş, yumurtalıq, bağırsaq, mədəaltı vəz, böyrək və digər xərçəng növlərinə irsi meylliliyi araşdıran qan əsaslı panellər. Ailədə bir neçə xərçəng halı və ya erkən yaşda xərçəng olduqda tövsiyə oluna bilər; nəticə fərdi müayinə və profilaktika planı qurmağa kömək edir.',
      'Панели по крови для оценки наследственной предрасположенности к раку молочной железы, яичников, кишечника, поджелудочной железы, почки и другим видам рака. Могут быть рекомендованы при нескольких случаях рака в семье или раке в молодом возрасте; результат помогает составить индивидуальный план обследования и профилактики.',
      'Blood-based panels that assess inherited predisposition to breast, ovarian, bowel, pancreatic, kidney and other cancers. They may be recommended when several relatives have had cancer or cancer occurred at a young age; the result helps build a personal screening and prevention plan.'
    ),
  },
  {
    id: 'immunology', icon: 'shield', featured: false,
    name: L('İmmunologiya', 'Иммунология', 'Immunology'),
    description: L(
      'İlkin immun çatışmazlıqları, autoinflamator sindromlar, komplement sistemi pozğunluqları və HLH üçün genetik panellər. Tez-tez və ya ağır infeksiyalar, təkrarlanan qızdırma epizodları olduqda səbəbin tapılması düzgün müalicəyə yol açır.',
      'Генетические панели при первичных иммунодефицитах, аутовоспалительных синдромах, нарушениях системы комплемента и ГЛГ. При частых или тяжёлых инфекциях и повторяющихся эпизодах лихорадки поиск причины открывает путь к правильному лечению.',
      'Genetic panels for primary immunodeficiencies, autoinflammatory syndromes, complement disorders and HLH. When infections are frequent or severe, or fevers keep coming back, finding the cause opens the way to the right treatment.'
    ),
  },
  {
    id: 'malformations', icon: 'bone', featured: false,
    name: L('Malformasiyalar və skelet', 'Пороки развития и скелет', 'Malformations & skeletal'),
    description: L(
      'Anadangəlmə inkişaf qüsurları, skelet displaziyaları, boy pozğunluqları, kraniosinostoz, dodaq-damaq yarığı və digər quruluş fərqlilikləri üçün panellər. Adətən genetik həkim tərəfindən səbəbi aydınlaşdırmaq və ailə planlamasına dəstək üçün təyin olunur.',
      'Панели при врождённых пороках развития, скелетных дисплазиях, нарушениях роста, краниосиностозе, расщелине губы и нёба и других структурных особенностях. Обычно назначаются врачом-генетиком для уточнения причины и помощи в планировании семьи.',
      'Panels for birth differences, skeletal dysplasias, growth disorders, craniosynostosis, cleft lip/palate and other structural conditions. Usually ordered by a clinical geneticist to find the cause and support family planning.'
    ),
  },
  {
    id: 'metabolic', icon: 'flask-round', featured: false,
    name: L('Metabolik pozğunluqlar', 'Нарушения обмена веществ', 'Metabolic disorders'),
    description: L(
      'Maddələr mübadiləsinin irsi pozğunluqları üçün panellər: lizosomal xəstəliklər, karbamid dövrü, yağ turşularının oksidləşməsi, qlikogenozlar və s. Bir çox metabolik xəstəlikdə erkən diaqnoz pəhriz və ya xüsusi müalicə ilə vəziyyətə nəzarəti mümkün edir.',
      'Панели при наследственных нарушениях обмена веществ: лизосомные болезни, нарушения цикла мочевины, окисления жирных кислот, гликогенозы и др. При многих метаболических заболеваниях ранний диагноз позволяет контролировать состояние с помощью диеты или специального лечения.',
      'Panels for inherited metabolic disorders such as lysosomal diseases, urea cycle and fatty acid oxidation disorders and glycogen storage diseases. For many metabolic conditions, early diagnosis allows the condition to be managed with diet or specific treatment.'
    ),
  },
  {
    id: 'nephrology', icon: 'bean', featured: false,
    name: L('Nefrologiya', 'Нефрология', 'Nephrology'),
    description: L(
      'Böyrəyin irsi xəstəlikləri üçün panellər: kistoz böyrək xəstəlikləri, nefrotik sindrom, Alport sindromu, böyrək daşları və elektrolit pozğunluqları. Genetik diaqnoz müalicəni, transplantasiya planlamasını və qohum donorların qiymətləndirilməsini asanlaşdırır.',
      'Панели при наследственных заболеваниях почек: кистозные болезни почек, нефротический синдром, синдром Альпорта, мочекаменная болезнь и электролитные нарушения. Генетический диагноз облегчает выбор лечения, планирование трансплантации и оценку родственных доноров.',
      'Panels for inherited kidney conditions: cystic kidney disease, nephrotic syndrome, Alport syndrome, kidney stones and electrolyte disorders. A genetic diagnosis helps guide treatment, transplant planning and evaluation of related donors.'
    ),
  },
  {
    id: 'ophthalmology', icon: 'eye', featured: false,
    name: L('Oftalmologiya', 'Офтальмология', 'Ophthalmology'),
    description: L(
      'Retina distrofiyaları, piqmentli retinit, katarakta, qlaukoma və optik atrofiya kimi irsi göz xəstəlikləri üçün panellər. Dəqiq genetik diaqnoz proqnozu aydınlaşdırmağa və bəzi hallarda genə yönəlik müalicələrə uyğunluğu qiymətləndirməyə kömək edir.',
      'Панели при наследственных заболеваниях глаз: дистрофии сетчатки, пигментный ретинит, катаракта, глаукома, атрофия зрительного нерва. Точный генетический диагноз помогает уточнить прогноз и в ряде случаев оценить возможность генно-направленного лечения.',
      'Panels for inherited eye conditions such as retinal dystrophies, retinitis pigmentosa, cataract, glaucoma and optic atrophy. A precise genetic diagnosis helps clarify the outlook and, in some cases, eligibility for gene-targeted treatments.'
    ),
  },
  {
    id: 'pulmonology', icon: 'wind', featured: false,
    name: L('Pulmonologiya', 'Пульмонология', 'Pulmonology'),
    description: L(
      'Ağciyər və tənəffüs yollarının irsi xəstəlikləri üçün panellər: ilkin siliar diskineziya, bronxoektaziya, interstisial ağciyər xəstəlikləri, yenidoğulmuşlarda surfaktant pozğunluqları. Xroniki və ya erkən başlayan tənəffüs problemlərində səbəbi aydınlaşdırır.',
      'Панели при наследственных заболеваниях лёгких и дыхательных путей: первичная цилиарная дискинезия, бронхоэктазы, интерстициальные заболевания лёгких, нарушения сурфактанта у новорождённых. Помогают выяснить причину хронических или рано начавшихся проблем с дыханием.',
      'Panels for inherited lung and airway conditions: primary ciliary dyskinesia, bronchiectasis, interstitial lung disease and surfactant disorders in newborns. They help explain chronic or early-onset breathing problems.'
    ),
  },
  {
    id: 'mitochondrial', icon: 'zap', featured: false,
    name: L('Mitoxondrial xəstəliklər', 'Митохондриальные заболевания', 'Mitochondrial disorders'),
    description: L(
      'Mitoxondriyalar hüceyrələrin enerji mənbəyidir. Bu bölmədəki testlər əzələ, beyin, qaraciyər və ürək kimi çox enerji tələb edən orqanları təsir edən irsi mitoxondrial xəstəliklərin səbəbini araşdırır.',
      'Митохондрии — энергетические станции клеток. Исследования этого раздела ищут причины наследственных митохондриальных заболеваний, затрагивающих органы с высокой потребностью в энергии: мышцы, мозг, печень и сердце.',
      "Mitochondria are the cell's power plants. Tests in this section look for causes of inherited mitochondrial conditions that affect energy-hungry organs such as the muscles, brain, liver and heart."
    ),
  },
  {
    id: 'reproductive-genetics', icon: 'sprout', featured: false,
    name: L('Reproduktiv genetika', 'Репродуктивная генетика', 'Reproductive genetics'),
    description: L(
      'Sonsuzluq, erkən yumurtalıq çatışmazlığı, spermatogenez pozğunluqları və reproduktiv sistemin inkişaf fərqliliklərinin irsi səbəblərini araşdıran geniş genetik panel.',
      'Расширенная генетическая панель для поиска наследственных причин бесплодия, преждевременной недостаточности яичников, нарушений сперматогенеза и особенностей развития репродуктивной системы.',
      'A broad genetic panel that looks for inherited causes of infertility, premature ovarian insufficiency, sperm production problems and differences in reproductive system development.'
    ),
  },
]

// Normalized spreadsheet header -> category id. Headers mapped to null are
// mid-list labels ("GENLƏR", "GENETİK PANELLƏR") and do not start a category.
const HEADER_MAP = {
  GINEKOLOGIYA: 'reproductive-health',
  ANDROLOGIYA: 'reproductive-health',
  EKZOM: 'exome',
  MONOGENXESTELIKLER: 'monogenic',
  MONOGEN: 'monogenic',
  HAMILELIKTESTLER: 'pregnancy',
  HAMILELIKTESTLERI: 'pregnancy',
  QOHUMLUQ: 'kinship',
  QOHUMLUGUNTESTLER: 'kinship',
  QOHUMLUGUNTESTLERI: 'kinship',
  HLATESTLER: 'hla',
  GENETIKPANELLERKARDIOLOGIYA: 'cardiology',
  DERMATALOGIYA: 'dermatology',
  DERMATOLOGIYA: 'dermatology',
  QULAQBURUNBOGAZ: 'ent',
  ENDOKRINOLOGIYA: 'endocrinology',
  QASTROENTROLOGIYA: 'gastroenterology',
  QASTROENTEROLOGIYA: 'gastroenterology',
  HEMATOLOGIYA: 'hematology',
  IRSIXERCENG: 'hereditary-cancer',
  IMMUNOLOGIYA: 'immunology',
  MALFORMASIYALAR: 'malformations',
  METABOLIKPOZGUNLUQ: 'metabolic',
  NEFROLOGIYA: 'nephrology',
  NEVROLOGIYA: 'neurology',
  OFTOLMOLOGIYA: 'ophthalmology',
  OFTALMOLOGIYA: 'ophthalmology',
  PULMONOLOGIYA: 'pulmonology',
  MITOXONDRIALPOZGUNLUQ: 'mitochondrial',
  REPRODUKTIVGENETIKA: 'reproductive-genetics',
  GENETIKPANELLER: null,
  GENLER: null,
}

const normHeader = (s) =>
  s.toUpperCase()
    .replace(/İ|I/g, 'I').replace(/Ə/g, 'E').replace(/Ğ/g, 'G').replace(/Ş/g, 'S')
    .replace(/Ç/g, 'C').replace(/Ö/g, 'O').replace(/Ü/g, 'U')
    .replace(/[^A-Z]/g, '')

// ---------------------------------------------------------------------------
// Methods & sample types
// ---------------------------------------------------------------------------
const METHODS = {
  karyotype: L('Kariotipləmə (xromosom analizi)', 'Кариотипирование (хромосомный анализ)', 'Karyotyping (chromosome analysis)'),
  karyotype_pcr: L('Kariotipləmə + PZR', 'Кариотипирование + ПЦР', 'Karyotyping + PCR'),
  qfpcr_fish: L('QF-PZR / sürətli FISH', 'КФ-ПЦР / быстрый FISH', 'QF-PCR / rapid FISH'),
  pcr: L('PZR (polimeraz zəncirvari reaksiya)', 'ПЦР (полимеразная цепная реакция)', 'PCR (polymerase chain reaction)'),
  ngs: L('Yeni nəsil sekvenləmə (NGS)', 'Секвенирование нового поколения (NGS)', 'Next-generation sequencing (NGS)'),
  ngs_karyo: L('NGS + kariotipləmə', 'NGS + кариотипирование', 'NGS + karyotyping'),
  ngs_pcr_karyo: L('NGS + PZR + kariotipləmə', 'NGS + ПЦР + кариотипирование', 'NGS + PCR + karyotyping'),
  ngs_mixed: L('NGS və digər üsullar', 'NGS и другие методы', 'NGS and other methods'),
  seq: L('DNT sekvenləmə', 'Секвенирование ДНК', 'DNA sequencing'),
  mlpa: L('MLPA', 'MLPA', 'MLPA'),
  ngs_mlpa: L('NGS + MLPA', 'NGS + MLPA', 'NGS + MLPA'),
  fish: L('FISH (flüoressent in situ hibridizasiya)', 'FISH (флуоресцентная гибридизация in situ)', 'FISH (fluorescence in situ hybridization)'),
  tunel: L('TUNEL', 'TUNEL', 'TUNEL'),
  cnv: L('Xromosom mikroarray (CNV analizi)', 'Хромосомный микроматричный анализ (CNV)', 'Chromosomal microarray (CNV analysis)'),
  rtpcr: L('Real-time PZR', 'ПЦР в реальном времени', 'Real-time PCR'),
  rtpcr_ihc: L('Real-time PZR + immunohistokimya (İHK)', 'ПЦР в реальном времени + иммуногистохимия (ИГХ)', 'Real-time PCR + immunohistochemistry (IHC)'),
  ngs_ihc: L('NGS + immunohistokimya (İHK)', 'NGS + иммуногистохимия (ИГХ)', 'NGS + immunohistochemistry (IHC)'),
  ngs_hrd: L('NGS (HRD skoru)', 'NGS (оценка HRD)', 'NGS (HRD score)'),
  fragment: L('Fraqment analizi', 'Фрагментный анализ', 'Fragment analysis'),
  snapshot: L('SNaPshot genotipləmə', 'Генотипирование SNaPshot', 'SNaPshot genotyping'),
  methylation: L('Metilləşmə analizi (MS-MLPA)', 'Анализ метилирования (MS-MLPA)', 'Methylation analysis (MS-MLPA)'),
  strpcr: L('STR analizi (PZR)', 'STR-анализ (ПЦР)', 'STR analysis (PCR)'),
}

const METHOD_RAW = {
  'Kariotipləndirmə': 'karyotype',
  'Kariotipləndirmə.PZR': 'karyotype_pcr',
  'PZR': 'pcr',
  'NGS /kariotipləmə': 'ngs_karyo',
  'NGS': 'ngs',
  'NGS/PZR/ kariotip': 'ngs_pcr_karyo',
  'NGS/Sequence': 'ngs',
  'FİSH': 'fish',
  'Sequence': 'seq',
  'MLPA': 'mlpa',
  'CNV sequens': 'cnv',
}

const SAMPLES = {
  edta: {
    t: L('Venoz qan, EDTA-lı boru (bənövşəyi qapaq)', 'Венозная кровь, пробирка с ЭДТА (фиолетовая крышка)', 'Venous blood, EDTA tube (purple cap)'),
    s: L('Analiz üçün venadan EDTA-lı boruya (bənövşəyi qapaq) az miqdarda qan götürülür; adətən xüsusi hazırlıq tələb olunmur.',
      'Для исследования из вены берут небольшое количество крови в пробирку с ЭДТА (фиолетовая крышка); специальная подготовка обычно не требуется.',
      'Only a small blood sample from a vein is needed, collected in an EDTA tube (purple cap); no special preparation is usually required.'),
  },
  heparin: { t: L('Venoz qan, heparinli boru (yaşıl qapaq)', 'Венозная кровь, пробирка с гепарином (зелёная крышка)', 'Venous blood, heparin tube (green cap)') },
  edta_heparin: { t: L('Venoz qan: EDTA-lı və litium-heparinli borular', 'Венозная кровь: пробирки с ЭДТА и гепарином лития', 'Venous blood: EDTA and lithium-heparin tubes') },
  edta_each: { t: L('Hər bir şəxsdən venoz qan, EDTA-lı boru (5 ml)', 'Венозная кровь от каждого человека, пробирка с ЭДТА (5 мл)', 'Venous blood from each person, EDTA tube (5 ml)') },
  amnio20: { t: L('Amniotik maye, 20 ml (şprisdə)', 'Амниотическая жидкость, 20 мл (в шприце)', 'Amniotic fluid, 20 ml (in a syringe)') },
  amnio: { t: L('Amniotik maye', 'Амниотическая жидкость', 'Amniotic fluid') },
  amnio_fetal: { t: L('Amniotik maye və ya fetal qan', 'Амниотическая жидкость или кровь плода', 'Amniotic fluid or fetal blood') },
  am_edta_fetal: { t: L('EDTA-lı venoz qan; prenatal testdə amniotik maye və ya fetal qan', 'Венозная кровь с ЭДТА; при пренатальном тесте — амниотическая жидкость или кровь плода', 'EDTA venous blood; for prenatal testing, amniotic fluid or fetal blood') },
  miscarriage: { t: L('Düşük/evakuasiya materialı (xüsusi mühitdə)', 'Материал выкидыша/эвакуации (в специальной среде)', 'Miscarriage/evacuation tissue (in special transport medium)') },
  sperm: { t: L('Sperma, steril qabda (3 günlük cinsi pəhrizdən sonra)', 'Эякулят в стерильном контейнере (после 3 дней воздержания)', 'Semen in a sterile container (after 3 days of abstinence)') },
  paraffin: { t: L('Şiş toxuması, parafin blok', 'Ткань опухоли, парафиновый блок', 'Tumour tissue, paraffin block') },
  amnion_abort: { t: L('Amniotik maye və ya düşük materialı', 'Амниотическая жидкость или материал выкидыша', 'Amniotic fluid or pregnancy-loss tissue') },
  nipt: { t: L('Anadan venoz qan, xüsusi boru (10 ml), hamiləliyin 10-cu həftəsindən', 'Венозная кровь матери, специальная пробирка (10 мл), с 10-й недели беременности', "Mother's venous blood, special tube (10 ml), from week 10 of pregnancy") },
  nipt_paternity: { t: L('Anadan venoz qan, xüsusi boru (10 ml), hamiləliyin 9-cu həftəsindən; ehtimal olunan atadan nümunə', 'Венозная кровь матери, специальная пробирка (10 мл), с 9-й недели беременности; образец предполагаемого отца', "Mother's venous blood, special tube (10 ml), from week 9 of pregnancy; sample from the alleged father") },
  buccal: { t: L('Ağız boşluğundan yaxma (tüpürcək nümunəsi)', 'Мазок с внутренней стороны щеки (слюна)', 'Cheek swab (saliva sample)') },
  embryo: { t: L('Embrion biopsiyası (ECO klinikası tərəfindən)', 'Биопсия эмбриона (выполняется клиникой ЭКО)', 'Embryo biopsy (performed by the IVF clinic)') },
  streck: {
    t: L('Venoz qan, 2 ədəd Streck borusu', 'Венозная кровь, 2 пробирки Streck', 'Venous blood, 2 Streck tubes'),
    s: L('Yalnız qan nümunəsi lazımdır: venadan 2 xüsusi Streck borusuna qan götürülür.',
      'Нужен только образец крови: из вены берут кровь в 2 специальные пробирки Streck.',
      'Only a blood sample is needed: blood is drawn from a vein into two special Streck tubes.'),
  },
  ffpe: {
    t: L('Şiş toxuması, parafin blok (FFPE)', 'Ткань опухоли, парафиновый блок (FFPE)', 'Tumour tissue, paraffin block (FFPE)'),
    s: L('Analiz biopsiya və ya əməliyyat zamanı əvvəlcədən götürülmüş şiş toxuması (parafin blok, FFPE) üzərində aparılır, buna görə adətən yeni prosedur tələb olunmur.',
      'Исследование проводится на ткани опухоли, ранее полученной при биопсии или операции (парафиновый блок, FFPE), поэтому новая процедура обычно не нужна.',
      'It is performed on tumour tissue already removed during a biopsy or surgery (paraffin block, FFPE), so a new procedure is usually not needed.'),
  },
  ffpe_or_streck: {
    t: L('Şiş toxuması (FFPE) və ya venoz qan, 2 Streck borusu', 'Ткань опухоли (FFPE) или венозная кровь, 2 пробирки Streck', 'Tumour tissue (FFPE) or venous blood, 2 Streck tubes'),
    s: L('Şiş toxuması (parafin blok) və ya toxuma olmadıqda 2 Streck borusunda qan istifadə oluna bilər.',
      'Используется ткань опухоли (парафиновый блок), а при её отсутствии — кровь в 2 пробирках Streck.',
      'Tumour tissue (paraffin block) or, if tissue is not available, blood in two Streck tubes can be used.'),
  },
  ffpe_plus_blood: {
    t: L('Şiş toxuması (FFPE) + venoz qan (EDTA-lı boru)', 'Ткань опухоли (FFPE) + венозная кровь (пробирка с ЭДТА)', 'Tumour tissue (FFPE) + venous blood (EDTA tube)'),
    s: L('Həm şiş toxuması (parafin blok), həm də EDTA-lı boruda qan nümunəsi tələb olunur.',
      'Нужны и ткань опухоли (парафиновый блок), и образец крови в пробирке с ЭДТА.',
      'Both tumour tissue (paraffin block) and a blood sample in an EDTA tube are needed.'),
  },
  blood_or_ffpe: {
    t: L('Venoz qan (EDTA-lı boru) və ya şiş toxuması (FFPE)', 'Венозная кровь (пробирка с ЭДТА) или ткань опухоли (FFPE)', 'Venous blood (EDTA tube) or tumour tissue (FFPE)'),
    s: L('Klinik suala görə qan (EDTA-lı boru) və ya şiş toxuması (parafin blok) istifadə olunur.',
      'В зависимости от клинической задачи используется кровь (пробирка с ЭДТА) или ткань опухоли (парафиновый блок).',
      'Depending on the clinical question, a blood sample (EDTA tube) or tumour tissue (paraffin block) is used.'),
  },
  blood_bm: {
    t: L('Venoz qan (2 EDTA-lı boru) və ya sümük iliyi', 'Венозная кровь (2 пробирки с ЭДТА) или костный мозг', 'Venous blood (2 EDTA tubes) or bone marrow'),
    s: L('Analiz hematoloqun qərarı ilə venoz qan (2 EDTA-lı boru) və ya sümük iliyi nümunəsi üzərində aparılır.',
      'Исследование проводится на венозной крови (2 пробирки с ЭДТА) или образце костного мозга — по решению гематолога.',
      'It is done on venous blood (two EDTA tubes) or a bone marrow sample, as decided by your hematologist.'),
  },
}

function sampleFromRaw(raw) {
  if (!raw) return null
  const s = raw.toLowerCase()
  if (/hər bir fərd/.test(s)) return 'edta_each'
  if (/edta/.test(s) && /heparin/.test(s)) return 'edta_heparin'
  if (/^am \/ edta/.test(s)) return 'am_edta_fetal'
  if (/heparin/.test(s)) return 'heparin'
  if (/amniotik maye 20ml/.test(s)) return 'amnio20'
  if (/amniotik maye \/ fetal/.test(s)) return 'amnio_fetal'
  if (/^amniotik maye$/.test(s)) return 'amnio'
  if (/düşük/.test(s)) return 'miscarriage'
  if (/sperma/.test(s)) return 'sperm'
  if (/parafin/.test(s)) return 'paraffin'
  if (/amnion\. abort/.test(s)) return 'amnion_abort'
  if (/anadan xüsusi/.test(s)) return 'nipt_paternity'
  if (/xüsusi tüp/.test(s)) return 'nipt'
  if (/tüpürcək/.test(s)) return 'buccal'
  if (/edta/.test(s)) return 'edta'
  throw new Error(`Unknown TAM material: ${raw}`)
}

function sampleFromOnko(raw) {
  const s = raw.toLowerCase().replace(/\s+/g, ' ')
  if (/bone marrow/.test(s)) return 'blood_bm'
  if (/^ffpe \/ streck/.test(s)) return 'ffpe_or_streck'
  if (/^ffpe ?\+/.test(s)) return 'ffpe_plus_blood'
  if (/edta tube\) \/ ffpe/.test(s)) return 'blood_or_ffpe'
  if (/streck/.test(s)) return 'streck'
  if (/^ffpe$/.test(s)) return 'ffpe'
  if (/^peripheral blood \(edta tube\)$/.test(s)) return 'edta'
  throw new Error(`Unknown ONKO sample: ${raw}`)
}

// ---------------------------------------------------------------------------
// Gene lists
// ---------------------------------------------------------------------------
const GENE_FIXES = {
  ANK2BAG3: ['ANK2', 'BAG3'], PLNPPCS: ['PLN', 'PPCS'], TTRVCL: ['TTR', 'VCL'],
  LC22A5: ['SLC22A5'], SPRED0: ['SPRED1'], UBR0: ['UBR1'], TRAF3IP: ['TRAF3IP1'],
}

function parseGenes(raw) {
  let s = raw.replace(/RBC,\s*K1/g, 'RBCK1')
  const out = []
  for (let g of s.split(/[,\s]+/)) {
    g = g.trim()
    if (!g) continue
    for (const x of GENE_FIXES[g] || [g]) if (!out.includes(x)) out.push(x)
  }
  return out
}

const looksLikeGeneList = (s) => !!s && !METHOD_RAW[s] && /^[A-Z0-9-]+(\s*,\s*[A-Z0-9-]*)+/.test(s.trim())

const genesExplanation = (genes) => {
  const list = genes.join(', ')
  return L(`Tədqiq olunan genlər: ${list}.`, `Исследуемые гены: ${list}.`, `Genes analysed: ${list}.`)
}

// ---------------------------------------------------------------------------
// Localization helpers
// ---------------------------------------------------------------------------
function ruGenes(n) {
  const m10 = n % 10, m100 = n % 100
  if (m10 === 1 && m100 !== 11) return 'ген'
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return 'гена'
  return 'генов'
}

const countLabel = ({ n, plus }) => ({
  az: plus ? `${n}+ gen` : `${n} gen`,
  ru: plus ? `более ${n} ${ruGenes(n)}` : `${n} ${ruGenes(n)}`,
  en: plus ? `${n}+ genes` : `${n} genes`,
})

const withSuffix = (base, suffix) => {
  if (!suffix) return base
  return base.endsWith(')') ? `${base.slice(0, -1)}, ${suffix})` : `${base} (${suffix})`
}
const withCount = (name, count) => {
  const cl = countLabel(count)
  return { az: withSuffix(name.az, cl.az), ru: withSuffix(name.ru, cl.ru), en: withSuffix(name.en, cl.en) }
}

function countFromName(raw) {
  const m = raw.match(/(\d+)\s*(?:cox gen|gend[əe]n|gen)\s*(ç|c)?/i)
  if (!m) return null
  return { n: Number(m[1]), plus: /d[əe]n\s*(ç|c)ox|cox gen/i.test(raw) }
}

// "Why this test" sentence for templated gene panels, per category.
const CAT_WHY = {
  cardiology: L(
    'Siz və ya yaxın qohumunuzda ürək əzələsi xəstəliyi, ritm pozğunluğu, aortanın genişlənməsi və ya səbəbi bilinməyən qəfil ürək hadisəsi olduqda tövsiyə oluna bilər; nəticə müalicəni və ailə üzvlərinin müayinəsini planlamağa kömək edir.',
    'Может быть рекомендована, если у вас или близких родственников есть заболевание сердечной мышцы, нарушение ритма, расширение аорты или необъяснимое внезапное сердечное событие; результат помогает спланировать лечение и обследование семьи.',
    'It may be recommended if you or a close relative have a heart muscle disease, a rhythm disorder, an enlarged aorta or an unexplained sudden cardiac event; the result helps plan treatment and family screening.'),
  dermatology: L(
    'Dəri, saç, dırnaq və ya piqmentasiya ilə bağlı irsi xəstəlik şübhəsi olduqda diaqnozu təsdiqləməyə və ailə planlamasına kömək edir.',
    'Помогает подтвердить диагноз при подозрении на наследственное заболевание кожи, волос, ногтей или пигментации и спланировать семью.',
    'It helps confirm the diagnosis when an inherited skin, hair, nail or pigmentation condition is suspected, and supports family planning.'),
  ent: L(
    'Uşaqlarda və böyüklərdə eşitmə itkisinin, həmçinin onunla birgə rast gəlinən göz və ya böyrək əlamətlərinin səbəbini aydınlaşdırmaq üçün tövsiyə olunur.',
    'Рекомендуется детям и взрослым для выяснения причины снижения слуха и сопутствующих особенностей со стороны глаз или почек.',
    'It is recommended for children and adults to clarify the cause of hearing loss and any related eye or kidney features.'),
  endocrinology: L(
    'Hormonal, boy, cinsi yetişkənlik, qan şəkəri və ya lipid problemləri erkən başladıqda və ya ailədə təkrarlandıqda faydalıdır; nəticə bəzən müalicənin seçiminə təsir edir.',
    'Полезна, если гормональные нарушения, проблемы с ростом, половым созреванием, уровнем сахара или липидов начались рано или повторяются в семье; результат иногда влияет на выбор лечения.',
    'It is useful when hormonal, growth, puberty, blood sugar or lipid problems start early or run in the family; the result can sometimes influence treatment.'),
  gastroenterology: L(
    'Qaraciyər, mədəaltı vəz və ya bağırsaq problemləri erkən yaşda başladıqda və ya səbəbi aydın olmadıqda tövsiyə oluna bilər.',
    'Может быть рекомендована, если проблемы с печенью, поджелудочной железой или кишечником начались в раннем возрасте или их причина неясна.',
    'It may be recommended when liver, pancreas or bowel problems begin early in life or have no clear cause.'),
  hematology: L(
    'İrsi və ya erkən yaşda başlayan anemiya, qanaxma, laxtalanma problemləri və ya qan hüceyrələrinin azlığını izah etməyə kömək edir.',
    'Помогает объяснить анемию, кровоточивость, нарушения свёртывания или снижение числа клеток крови, если они наследственные или начались рано.',
    'It helps explain anemia, bleeding or clotting problems, or low blood cell counts that are inherited or begin early in life.'),
  'hereditary-cancer': L(
    'Şəxsi və ya ailə anamnezində irsi xərçəngə işarə edən hallar olduqda nəzərdə tutulub; nəticə həkiminizlə birlikdə fərdi müayinə və profilaktika planı qurmağa kömək edir.',
    'Предназначена для людей, у которых личная или семейная история указывает на наследственный рак; результат помогает вместе с врачом составить индивидуальный план обследований и профилактики.',
    'It is intended for people whose personal or family history suggests hereditary cancer; the result helps you and your doctor plan personalised screening and prevention.'),
  immunology: L(
    'Tez-tez və ya qeyri-adi infeksiyalar, təkrarlanan qızdırma və iltihab epizodları və ya qan hüceyrələrinin azlığı irsi immun xəstəliyə işarə etdikdə tövsiyə oluna bilər.',
    'Может быть рекомендована при частых или необычных инфекциях, повторяющихся эпизодах лихорадки и воспаления или снижении числа клеток крови, указывающих на наследственное иммунное заболевание.',
    'It may be recommended for frequent or unusual infections, recurrent fever and inflammation, or low blood counts that point to an inherited immune condition.'),
  malformations: L(
    'Adətən anadangəlmə inkişaf fərqlilikləri, skelet və ya boy xüsusiyyətləri olan uşaqlarda səbəbi tapmaq və ailə planlamasına dəstək üçün genetik həkim tərəfindən təyin olunur.',
    'Обычно назначается врачом-генетиком детям с врождёнными особенностями развития, скелета или роста, чтобы найти причину и помочь в планировании семьи.',
    'It is usually ordered by a geneticist for children with birth differences or skeletal or growth features, to find the cause and support family planning.'),
  metabolic: L(
    'Simptomlar və ya anormal biokimyəvi/yenidoğan skrininqi nəticələri irsi metabolik xəstəliyə işarə etdikdə diaqnozu aydınlaşdırır; erkən diaqnoz pəhriz və müalicəni istiqamətləndirə bilər.',
    'Уточняет диагноз, если симптомы или отклонения в биохимических анализах/неонатальном скрининге указывают на наследственное нарушение обмена; ранний диагноз может определить диету и лечение.',
    'It clarifies the diagnosis when symptoms or abnormal biochemical or newborn screening results suggest an inherited metabolic condition; early diagnosis can guide diet and treatment.'),
  nephrology: L(
    'Böyrək xəstəliyi, kistlər, daşlar və ya elektrolit pozğunluqları erkən başladıqda və ya ailədə təkrarlandıqda genetik səbəbi tapmağa kömək edir.',
    'Помогает найти генетическую причину заболевания почек, кист, камней или электролитных нарушений, особенно при раннем начале или семейных случаях.',
    'It helps find a genetic cause of kidney disease, cysts, stones or electrolyte imbalances, especially when they start early or run in the family.'),
  neurology: L(
    'Qıcolmalar, inkişaf ləngiməsi, hərəkət və ya əzələ problemləri kimi irsi səbəb şübhəsi olan nevroloji simptomlarda tövsiyə oluna bilər.',
    'Может быть рекомендована при судорогах, задержке развития, двигательных или мышечных нарушениях и других неврологических симптомах, если подозревается наследственная причина.',
    'It may be recommended for seizures, developmental delay, movement or muscle problems and other neurological symptoms when an inherited cause is suspected.'),
  ophthalmology: L(
    'İrsi görmə itkisinin və ya göz xəstəliyinin səbəbini aydınlaşdırmağa, müşahidəni planlamağa və bəzi hallarda xüsusi müalicələrə uyğunluğu qiymətləndirməyə kömək edir.',
    'Помогает выяснить причину наследственной потери зрения или заболевания глаз, спланировать наблюдение и в ряде случаев оценить возможность специального лечения.',
    'It helps clarify the cause of inherited vision loss or eye disease, plan follow-up and, in some cases, assess eligibility for specific treatments.'),
  pulmonology: L(
    'Xroniki və ya erkən başlayan tənəffüs və ağciyər problemlərində irsi səbəb şübhəsi olduqda tövsiyə oluna bilər.',
    'Может быть рекомендована при хронических или рано начавшихся проблемах с дыханием и лёгкими, если подозревается наследственная причина.',
    'It may be recommended for chronic or early-onset breathing and lung problems when an inherited cause is suspected.'),
  mitochondrial: L(
    'Əzələ, beyin, qaraciyər və ya ürək kimi çox enerji tələb edən orqanları əhatə edən simptomlar mitoxondrial xəstəliyə işarə etdikdə kömək edir.',
    'Помогает, если симптомы со стороны органов с высокой потребностью в энергии — мышц, мозга, печени или сердца — указывают на митохондриальное заболевание.',
    'It helps when symptoms affecting energy-demanding organs such as the muscles, brain, liver or heart suggest a mitochondrial condition.'),
  'reproductive-genetics': L(
    'Sonsuzluq, təkrarlanan hamiləlik itkisi və ya reproduktiv sistemin inkişaf fərqlilikləri zamanı irsi səbəb şübhəsi olduqda nəzərdən keçirilə bilər.',
    'Может быть рассмотрена при бесплодии, повторной потере беременности или особенностях развития репродуктивной системы, если подозревается наследственная причина.',
    'It may be considered for infertility, recurrent pregnancy loss or differences in reproductive system development when an inherited cause is suspected.'),
}

const COUNSEL = L(
  'Nəticələr həkiminiz və ya genetik məsləhətçi ilə birlikdə şərh edilməlidir.',
  'Результаты следует обсуждать с лечащим врачом или врачом-генетиком.',
  'Results should be interpreted together with your doctor or a genetic counselor.'
)

function panelDescription({ base, count, genes, wide, categoryId, sampleKey }) {
  const c = count || (genes ? { n: genes.length, plus: false } : null)
  const cl = c ? countLabel(c) : null
  const azN = c ? (c.plus ? `${c.n}-dən çox geni` : `${c.n} geni`) : 'genləri'
  const enN = c ? (c.plus ? `more than ${c.n} genes` : `${c.n} genes`) : 'genes'
  const what = wide
    ? { az: 'bu xəstəliklər qrupu ilə', ru: 'этой группой заболеваний', en: 'this group of conditions' }
    : { az: 'bu vəziyyətlə', ru: 'этим состоянием', en: 'this condition' }
  const why = CAT_WHY[categoryId]
  const smp = SAMPLES[sampleKey]?.s
  if (!why) throw new Error(`No CAT_WHY for ${categoryId}`)
  if (!smp) throw new Error(`No sample sentence for ${sampleKey}`)
  return {
    az: `«${base.az}» paneli ${what.az} əlaqəli ${azN} araşdırır. ${why.az} ${smp.az} ${COUNSEL.az}`,
    ru: `Панель «${base.ru}» исследует гены, связанные с ${what.ru}${cl ? ` (${cl.ru})` : ''}. ${why.ru} ${smp.ru} ${COUNSEL.ru}`,
    en: `The “${base.en}” panel examines ${enN} linked to ${what.en}. ${why.en} ${smp.en} ${COUNSEL.en}`,
  }
}

// ---------------------------------------------------------------------------
// TAM: gene-panel names [az, ru, en, flags?]; flag 'w' = comprehensive panel
// ---------------------------------------------------------------------------
const PANEL_NAMES = {
  70: ['Aorta xəstəlikləri', 'Заболевания аорты (аортопатии)', 'Aortic disease (aortopathy)'],
  71: ['Aritmiya', 'Аритмии', 'Arrhythmia'],
  72: ['Kardiomiopatiya', 'Кардиомиопатии', 'Cardiomyopathy'],
  73: ['Atrial fibrilyasiya', 'Фибрилляция предсердий', 'Atrial fibrillation'],
  74: ['Bruqada sindromu', 'Синдром Бругада', 'Brugada syndrome'],
  75: ['Katexolaminergik polimorf mədəcik taxikardiyası', 'Катехоламинергическая полиморфная желудочковая тахикардия', 'Catecholaminergic polymorphic ventricular tachycardia (CPVT)'],
  76: ['Kompleks kardiogenetika', 'Комплексная кардиогенетика', 'Comprehensive cardiogenetics'],
  77: ['Anadangəlmə struktur ürək xəstəlikləri', 'Врождённые структурные пороки сердца', 'Congenital structural heart disease'],
  78: ['Dilatasion kardiomiopatiya', 'Дилатационная кардиомиопатия', 'Dilated cardiomyopathy'],
  79: ['İrsi hemorragik telangiektaziya', 'Наследственная геморрагическая телеангиэктазия', 'Hereditary hemorrhagic telangiectasia'],
  80: ['Heterotaksiya və situs inversus', 'Гетеротаксия и situs inversus', 'Heterotaxy and situs inversus'],
  81: ['Hiperlipidemiya (əsas panel)', 'Гиперлипидемия (базовая панель)', 'Hyperlipidemia (core panel)'],
  82: ['Hipertrofik kardiomiopatiya', 'Гипертрофическая кардиомиопатия', 'Hypertrophic cardiomyopathy'],
  83: ['Sol mədəciyin kardiomiopatiyası', 'Кардиомиопатия левого желудочка', 'Left ventricular cardiomyopathy'],
  84: ['Liddl sindromu', 'Синдром Лиддла', 'Liddle syndrome'],
  85: ['Marfan sindromu', 'Синдром Марфана', 'Marfan syndrome'],
  86: ['Noonan sindromu', 'Синдром Нунан', 'Noonan syndrome'],
  87: ['Pulmonar arterial hipertenziya', 'Лёгочная артериальная гипертензия', 'Pulmonary arterial hypertension'],
  88: ['Uzun QT sindromu', 'Синдром удлинённого интервала QT', 'Long QT syndrome'],
  89: ['Qısa QT sindromu', 'Синдром укороченного интервала QT', 'Short QT syndrome'],
  90: ['İrsi ürək xəstəlikləri', 'Наследственные заболевания сердца', 'Hereditary heart diseases', 'w'],
  92: ['Adams-Oliver sindromu', 'Синдром Адамса–Оливера', 'Adams-Oliver syndrome'],
  93: ['Hermanski-Pudlak sindromu', 'Синдром Германского–Пудлака', 'Hermansky-Pudlak syndrome'],
  94: ['Albinizm', 'Альбинизм', 'Albinism'],
  95: ['İxtioz (balıqpulcuğu)', 'Ихтиоз', 'Ichthyosis'],
  96: ['Anadangəlmə diskeratoz', 'Врождённый дискератоз', 'Dyskeratosis congenita'],
  97: ['Cutis laxa', 'Cutis laxa (синдром вялой кожи)', 'Cutis laxa'],
  98: ['Ektodermal displaziya', 'Эктодермальная дисплазия', 'Ectodermal dysplasia'],
  99: ['Elers-Danlos sindromu', 'Синдром Элерса–Данлоса', 'Ehlers-Danlos syndrome'],
  100: ['Bulloz epidermoliz', 'Буллёзный эпидермолиз', 'Epidermolysis bullosa'],
  101: ['İrsi enteropatik akrodermatit', 'Наследственный энтеропатический акродерматит', 'Hereditary acrodermatitis enteropathica'],
  102: ['İrsi melanoma və dəri xərçəngi', 'Наследственная меланома и рак кожи', 'Hereditary melanoma and skin cancer'],
  103: ['Neyrofibromatoz', 'Нейрофиброматоз', 'Neurofibromatosis'],
  104: ['Progeriya və progeroid sindromlar', 'Прогерия и прогероидные синдромы', 'Progeria and progeroid syndromes'],
  105: ['Tuberoz skleroz', 'Туберозный склероз', 'Tuberous sclerosis complex'],
  106: ['Vaardenburq sindromu', 'Синдром Ваарденбурга', 'Waardenburg syndrome'],
  107: ['Kseroderma piqmentoza', 'Пигментная ксеродерма', 'Xeroderma pigmentosum'],
  108: ['Palmoplantar keratoderma', 'Ладонно-подошвенная кератодермия', 'Palmoplantar keratoderma'],
  109: ['Anadangəlmə paxionixiya', 'Врождённая пахионихия', 'Pachyonychia congenita'],
  111: ['Alport sindromu', 'Синдром Альпорта', 'Alport syndrome'],
  112: ['Kompleks eşitmə itkisi və karlıq', 'Комплексная панель: тугоухость и глухота', 'Comprehensive hearing loss and deafness'],
  113: ['Branxio-oto-renal (BOR) sindromu', 'Бранхио-ото-ренальный (BOR) синдром', 'Branchio-oto-renal (BOR) syndrome'],
  114: ['Qeyri-sindromik eşitmə itkisi', 'Несиндромальная тугоухость', 'Non-syndromic hearing loss'],
  115: ['Vaardenburq sindromu', 'Синдром Ваарденбурга', 'Waardenburg syndrome'],
  116: ['İrsi hemorragik telangiektaziya', 'Наследственная геморрагическая телеангиэктазия', 'Hereditary hemorrhagic telangiectasia'],
  117: ['Pendred sindromu', 'Синдром Пендреда', 'Pendred syndrome'],
  118: ['İrsi eşitmə zəifliyi', 'Наследственная тугоухость', 'Hereditary hearing loss', 'w'],
  120: ['Sindromik eşitmə itkisi', 'Синдромальная тугоухость', 'Syndromic hearing loss'],
  121: ['Stikler sindromu', 'Синдром Стиклера', 'Stickler syndrome'],
  122: ['Aşer sindromu', 'Синдром Ашера', 'Usher syndrome'],
  124: ['Anadangəlmə adrenal hiperplaziya', 'Врождённая гиперплазия коры надпочечников', 'Congenital adrenal hyperplasia'],
  125: ['Hiperlipidemiya', 'Гиперлипидемия', 'Hyperlipidemia'],
  126: ['Hipoqlikemiya, hiperinsulinizm və keton mübadiləsi pozğunluqları', 'Гипогликемия, гиперинсулинизм и нарушения обмена кетонов', 'Hypoglycemia, hyperinsulinism and ketone metabolism disorders'],
  127: ['Hipotireoz və tiroid hormonuna rezistentlik', 'Гипотиреоз и резистентность к тиреоидным гормонам', 'Hypothyroidism and thyroid hormone resistance'],
  128: ['MODY (gənclərdə yetkin tipli diabet)', 'MODY (диабет взрослого типа у молодых)', 'MODY (maturity-onset diabetes of the young)'],
  129: ['Erkən yumurtalıq çatışmazlığı', 'Преждевременная недостаточность яичников', 'Premature ovarian insufficiency'],
  130: ['Kompleks monogen diabet', 'Комплексная панель моногенного диабета', 'Comprehensive monogenic diabetes'],
  131: ['Qlükokortikoid çatışmazlığı', 'Недостаточность глюкокортикоидов', 'Glucocorticoid deficiency'],
  132: ['Hiperparatireoz', 'Гиперпаратиреоз', 'Hyperparathyroidism'],
  133: ['Hipomaqnezemiya', 'Гипомагниемия', 'Hypomagnesemia'],
  134: ['Kallmann sindromu', 'Синдром Каллмана', 'Kallmann syndrome'],
  135: ['Monogen piylənmə', 'Моногенное ожирение', 'Monogenic obesity'],
  136: ['Cinsi inkişaf pozğunluqları (DSD)', 'Нарушения формирования пола (DSD)', 'Differences of sex development (DSD)'],
  137: ['Qalxanabənzər vəzin irsi xəstəlikləri', 'Наследственные заболевания щитовидной железы', 'Hereditary thyroid diseases', 'w'],
  139: ['Xolestaz', 'Холестаз', 'Cholestasis'],
  140: ['Anadangəlmə qaraciyər fibrozu', 'Врождённый фиброз печени', 'Congenital hepatic fibrosis'],
  141: ['Polikistoz qaraciyər xəstəliyi', 'Поликистозная болезнь печени', 'Polycystic liver disease'],
  142: ['Anadangəlmə ishal', 'Врождённая диарея', 'Congenital diarrhea'],
  143: ['Mədə-bağırsaq atreziyası', 'Атрезии желудочно-кишечного тракта', 'Gastrointestinal atresia'],
  144: ['İrsi pankreatit', 'Наследственный панкреатит', 'Hereditary pancreatitis'],
  145: ['Mədə-bağırsaq traktının irsi xəstəlikləri', 'Наследственные заболевания желудочно-кишечного тракта', 'Hereditary gastrointestinal diseases', 'w'],
  147: ['Anemiya', 'Анемии', 'Anemia'],
  148: ['Sümük iliyi çatışmazlığı sindromları', 'Синдромы костномозговой недостаточности', 'Bone marrow failure syndromes'],
  149: ['Daymond-Blekfan anemiyası', 'Анемия Даймонда–Блекфана', 'Diamond-Blackfan anemia'],
  150: ['Fankoni anemiyası', 'Анемия Фанкони', 'Fanconi anemia'],
  151: ['İrsi leykemiya meylliliyi', 'Наследственная предрасположенность к лейкозу', 'Hereditary leukemia predisposition'],
  152: ['Kompleks hematologiya və irsi xərçəng', 'Комплексная гематология и наследственный рак', 'Comprehensive hematology and hereditary cancer'],
  153: ['Kompleks immun pozğunluqlar və sitopeniya', 'Комплексная панель: иммунные нарушения и цитопении', 'Comprehensive immune disorders and cytopenias'],
  154: ['Trombosit funksiyasının pozulması', 'Нарушения функции тромбоцитов', 'Platelet function disorders'],
  155: ['Trombositopeniya', 'Тромбоцитопения', 'Thrombocytopenia'],
  156: ['Qanaxma pozğunluqları / koaqulopatiya', 'Нарушения свёртываемости крови (коагулопатии)', 'Bleeding disorders / coagulopathy'],
  157: ['Laxtalanma faktorlarının çatışmazlığı', 'Дефицит факторов свёртывания', 'Coagulation factor deficiency'],
  158: ['Kompleks hematologiya', 'Комплексная гематология', 'Comprehensive hematology'],
  159: ['Anadangəlmə neytropeniya', 'Врождённая нейтропения', 'Congenital neutropenia'],
  160: ['Anadangəlmə diskeratoz', 'Врождённый дискератоз', 'Dyskeratosis congenita'],
  161: ['Hemofaqositar limfohistiositoz (HLH)', 'Гемофагоцитарный лимфогистиоцитоз (ГЛГ)', 'Hemophagocytic lymphohistiocytosis (HLH)'],
  162: ['Hermanski-Pudlak sindromu', 'Синдром Германского–Пудлака', 'Hermansky-Pudlak syndrome'],
  163: ['Eritrosit membranı pozğunluqları', 'Нарушения мембраны эритроцитов', 'Red blood cell membrane disorders'],
  164: ['Qanın irsi xəstəlikləri', 'Наследственные заболевания крови', 'Hereditary blood disorders', 'w'],
  166: ['Kompleks hematologiya və irsi xərçəng', 'Комплексная гематология и наследственный рак', 'Comprehensive hematology and hereditary cancer'],
  167: ['Yüksək riskli irsi xərçəng', 'Наследственный рак высокого риска', 'High-risk hereditary cancer'],
  168: ['İrsi endokrin xərçəng', 'Наследственные эндокринные опухоли', 'Hereditary endocrine cancer'],
  169: ['İrsi leykemiya meylliliyi', 'Наследственная предрасположенность к лейкозу', 'Hereditary leukemia predisposition'],
  170: ['İrsi melanoma və dəri xərçəngi', 'Наследственная меланома и рак кожи', 'Hereditary melanoma and skin cancer'],
  171: ['İrsi pankreas xərçəngi', 'Наследственный рак поджелудочной железы', 'Hereditary pancreatic cancer'],
  172: ['Neyrofibromatoz', 'Нейрофиброматоз', 'Neurofibromatosis'],
  173: ['Uşaqlıq dövrünün irsi xərçəngləri', 'Наследственная предрасположенность к детским онкологическим заболеваниям', 'Hereditary childhood cancer predisposition'],
  174: ['Kseroderma piqmentoza', 'Пигментная ксеродерма', 'Xeroderma pigmentosum'],
  175: ['Kompleks irsi xərçəng', 'Комплексная панель наследственного рака', 'Comprehensive hereditary cancer'],
  176: ['İrsi döş xərçəngi (yüksək risk genləri)', 'Наследственный рак молочной железы (гены высокого риска)', 'Hereditary breast cancer (high-risk genes)'],
  177: ['İrsi kolorektal xərçəng', 'Наследственный колоректальный рак', 'Hereditary colorectal cancer'],
  178: ['İrsi mədə-bağırsaq xərçəngi', 'Наследственный рак желудочно-кишечного тракта', 'Hereditary gastrointestinal cancer'],
  179: ['İrsi ağciyər xərçəngi', 'Наследственный рак лёгкого', 'Hereditary lung cancer'],
  180: ['İrsi pankreas xərçəngi (əsas panel)', 'Наследственный рак поджелудочной железы (базовая панель)', 'Hereditary pancreatic cancer (core panel)'],
  181: ['İrsi böyrək xərçəngi', 'Наследственный рак почки', 'Hereditary kidney cancer'],
  182: ['Tuberoz skleroz', 'Туберозный склероз', 'Tuberous sclerosis complex'],
  183: ['Fakomatozlar və irsi xərçəng', 'Факоматозы и наследственный рак', 'Phakomatoses and hereditary cancer', 'w'],
  185: ['Autoinflamator sindromlar', 'Аутовоспалительные синдромы', 'Autoinflammatory syndromes'],
  186: ['Xroniki qranulomatoz xəstəlik', 'Хроническая гранулематозная болезнь', 'Chronic granulomatous disease'],
  187: ['Kompleks immun pozğunluqlar və sitopeniya', 'Комплексная панель: иммунные нарушения и цитопении', 'Comprehensive immune disorders and cytopenias'],
  188: ['Anadangəlmə diskeratoz', 'Врождённый дискератоз', 'Dyskeratosis congenita'],
  189: ['İlkin immun çatışmazlığı (PİD) və ilkin siliar diskineziya', 'Первичные иммунодефициты (ПИД) и первичная цилиарная дискинезия', 'Primary immunodeficiency (PID) and primary ciliary dyskinesia'],
  190: ['Sümük iliyi çatışmazlığı sindromları', 'Синдромы костномозговой недостаточности', 'Bone marrow failure syndromes'],
  191: ['Komplement sistemi pozğunluqları', 'Нарушения системы комплемента', 'Complement system disorders'],
  192: ['Anadangəlmə neytropeniya', 'Врождённая нейтропения', 'Congenital neutropenia'],
  193: ['Hemofaqositar limfohistiositoz (HLH)', 'Гемофагоцитарный лимфогистиоцитоз (ГЛГ)', 'Hemophagocytic lymphohistiocytosis (HLH)'],
  194: ['İmmunitet pozuntuları', 'Нарушения иммунитета', 'Immune system disorders', 'w'],
  196: ['3-M sindromu / primordial cırtdanlıq', 'Синдром 3-M / примордиальный нанизм', '3-M syndrome / primordial dwarfism'],
  197: ['Braxidaktiliya / sindaktiliya', 'Брахидактилия / синдактилия', 'Brachydactyly / syndactyly'],
  198: ['Nöqtəvi xondrodisplaziya', 'Точечная хондродисплазия', 'Chondrodysplasia punctata'],
  199: ['Böyümə pozğunluqları və skelet displaziyaları (hərtərəfli)', 'Нарушения роста и скелетные дисплазии (комплексная)', 'Growth disorders and skeletal dysplasias (comprehensive)'],
  200: ['Skelet displaziyaları və pozğunluqları (hərtərəfli)', 'Скелетные дисплазии и нарушения (комплексная)', 'Skeletal dysplasias and disorders (comprehensive)'],
  201: ['Kraniosinostoz', 'Краниосиностоз', 'Craniosynostosis'],
  202: ['Üz disostozu və əlaqəli pozğunluqlar', 'Лицевые дизостозы и связанные нарушения', 'Facial dysostosis and related disorders'],
  203: ['Heterotaksiya və situs inversus', 'Гетеротаксия и situs inversus', 'Heterotaxy and situs inversus'],
  204: ['Holoprosensefaliya', 'Голопрозэнцефалия', 'Holoprosencephaly'],
  205: ['Limfangioma', 'Лимфангиома', 'Lymphangioma'],
  207: ['Limfatik malformasiyalar və əlaqəli pozğunluqlar', 'Лимфатические мальформации и связанные нарушения', 'Lymphatic malformations and related disorders'],
  208: ['Meyer-Qorlin sindromu', 'Синдром Мейера–Горлина', 'Meier-Gorlin syndrome'],
  209: ['Mikrosefaliya və pontoserebellyar hipoplaziya', 'Микроцефалия и понтоцеребеллярная гипоплазия', 'Microcephaly and pontocerebellar hypoplasia'],
  210: ['Polimikroqiriya', 'Полимикрогирия', 'Polymicrogyria'],
  211: ['Septo-optik displaziya', 'Септооптическая дисплазия', 'Septo-optic dysplasia'],
  212: ['Spondilometafizar / spondiloepi(meta)fizar displaziya', 'Спондилометафизарная / спондилоэпи(мета)физарная дисплазия', 'Spondylometaphyseal / spondyloepi(meta)physeal dysplasia'],
  213: ['Adams-Oliver sindromu', 'Синдром Адамса–Оливера', 'Adams-Oliver syndrome'],
  214: ['Artroqripoz', 'Артрогрипоз', 'Arthrogryposis'],
  215: ['Serebral kavernoz malformasiya', 'Церебральная кавернозная мальформация', 'Cerebral cavernous malformation'],
  216: ['Dodaq/damaq yarığı və əlaqəli sindromlar', 'Расщелина губы/нёба и связанные синдромы', 'Cleft lip/palate and related syndromes'],
  217: ['Boy qısalığı sindromları (kompleks)', 'Синдромы низкорослости (комплексная)', 'Short stature syndromes (comprehensive)'],
  218: ['Korneliya de Lanqe sindromu', 'Синдром Корнелии де Ланге', 'Cornelia de Lange syndrome'],
  219: ['Ekzostozlar və əlaqəli xəstəliklər', 'Экзостозы и связанные заболевания', 'Exostoses and related disorders'],
  220: ['Mədə-bağırsaq atreziyası', 'Атрезии желудочно-кишечного тракта', 'Gastrointestinal atresia'],
  221: ['Kabuki sindromu', 'Синдром Кабуки', 'Kabuki syndrome'],
  222: ['Lissensefaliya', 'Лиссэнцефалия', 'Lissencephaly'],
  223: ['Makrosefaliya / həddindən artıq böyümə sindromları', 'Макроцефалия / синдромы избыточного роста', 'Macrocephaly / overgrowth syndromes'],
  224: ['Metafizar displaziya', 'Метафизарная дисплазия', 'Metaphyseal dysplasia'],
  225: ['Mikromelik displaziya', 'Микромелическая дисплазия', 'Micromelic dysplasia'],
  226: ['Neyron miqrasiyası pozğunluqları', 'Нарушения миграции нейронов', 'Neuronal migration disorders'],
  227: ['Sekkel sindromu', 'Синдром Секкеля', 'Seckel syndrome'],
  228: ['Qısa qabırğa displaziyası', 'Дисплазия с короткими рёбрами', 'Short-rib dysplasia'],
  229: ['Osteopetroz və sıx sümük displaziyaları', 'Остеопетроз и склерозирующие костные дисплазии', 'Osteopetrosis and dense bone dysplasias'],
  230: ['Əsas skelet displaziyaları', 'Основные скелетные дисплазии', 'Core skeletal dysplasias'],
  231: ['Damar malformasiyaları', 'Сосудистые мальформации', 'Vascular malformations'],
  232: ['Mina və dentinin anadangəlmə anomaliyaları (amelogenesis / dentinogenesis imperfecta)', 'Несовершенный амелогенез и дентиногенез', 'Amelogenesis imperfecta and dentinogenesis imperfecta'],
  233: ['Osteogenesis imperfecta (sümük kövrəkliyi)', 'Несовершенный остеогенез', 'Osteogenesis imperfecta'],
  235: ['Aykardi-Qutyer sindromu', 'Синдром Айкарди–Гутьерес', 'Aicardi-Goutières syndrome'],
  236: ['Kreatin mübadiləsi çatışmazlığı', 'Нарушения обмена креатина', 'Creatine deficiency disorders'],
  237: ['Yağ turşularının oksidləşməsi pozğunluqları', 'Нарушения окисления жирных кислот', 'Fatty acid oxidation disorders'],
  238: ['İrsi hemoxromatoz', 'Наследственный гемохроматоз', 'Hereditary hemochromatosis'],
  239: ['Hiperammoniyemiya və karbamid dövrü pozğunluqları', 'Гипераммониемия и нарушения цикла мочевины', 'Hyperammonemia and urea cycle disorders'],
  240: ['Hipoqlikemiya, hiperinsulinizm və keton mübadiləsi pozğunluqları', 'Гипогликемия, гиперинсулинизм и нарушения обмена кетонов', 'Hypoglycemia, hyperinsulinism and ketone metabolism disorders'],
  241: ['Lizosomal pozğunluqlar və mukopolisaxaridozlar', 'Лизосомные болезни накопления и мукополисахаридозы', 'Lysosomal disorders and mucopolysaccharidoses'],
  242: ['Metabolik miopatiya və rabdomioliz', 'Метаболические миопатии и рабдомиолиз', 'Metabolic myopathy and rhabdomyolysis'],
  243: ['Monogen piylənmə', 'Моногенное ожирение', 'Monogenic obesity'],
  244: ['Qeyri-ketotik hiperqlisinemiya / qlisin ensefalopatiyası', 'Некетотическая гиперглицинемия / глициновая энцефалопатия', 'Non-ketotic hyperglycinemia / glycine encephalopathy'],
  245: ['Periodik iflic', 'Периодический паралич', 'Periodic paralysis'],
  246: ['Porfiriya', 'Порфирии', 'Porphyria'],
  247: ['Tirozinemiya', 'Тирозинемия', 'Tyrosinemia'],
  248: ['Koenzim Q10 çatışmazlığı', 'Дефицит коэнзима Q10', 'Coenzyme Q10 deficiency'],
  249: ['Anadangəlmə və ailəvi lipodistrofiya', 'Врождённая и семейная липодистрофия', 'Congenital and familial lipodystrophy'],
  250: ['Anadangəlmə mono- və disaxarid mübadiləsi pozğunluqları', 'Врождённые нарушения обмена моно- и дисахаридов', 'Congenital mono- and disaccharide disorders'],
  251: ['Sistinuriya', 'Цистинурия', 'Cystinuria'],
  252: ['Qlikogen depo xəstəlikləri', 'Гликогенозы (болезни накопления гликогена)', 'Glycogen storage diseases'],
  253: ['Homosistinuriya (əsas panel)', 'Гомоцистинурия (базовая панель)', 'Homocystinuria (core panel)'],
  254: ['Hiperfenilalaninemiya', 'Гиперфенилаланинемия', 'Hyperphenylalaninemia'],
  255: ['Hipomaqnezemiya', 'Гипомагниемия', 'Hypomagnesemia'],
  256: ['Metabolik qaraciyər xəstəlikləri', 'Метаболические заболевания печени', 'Metabolic liver disease'],
  257: ['Mitoxondrial DNT tükənməsi sindromu', 'Синдром истощения митохондриальной ДНК', 'Mitochondrial DNA depletion syndrome'],
  258: ['Nefrolitiaz (böyrək daşları)', 'Нефролитиаз (мочекаменная болезнь)', 'Nephrolithiasis (kidney stones)'],
  259: ['Üzvi asidemiya / asiduriya və kobalamin çatışmazlığı', 'Органические ацидемии/ацидурии и дефицит кобаламина', 'Organic acidemia/aciduria and cobalamin deficiency'],
  260: ['Peroksisomal pozğunluqlar', 'Пероксисомные заболевания', 'Peroxisomal disorders'],
  261: ['Purin və pirimidin mübadiləsi pozğunluqları', 'Нарушения обмена пуринов и пиримидинов', 'Purine and pyrimidine metabolism disorders'],
  262: ['İrsi maddələr mübadiləsi pozuntuları', 'Наследственные нарушения обмена веществ', 'Inherited metabolic disorders', 'w'],
  264: ['Alport sindromu', 'Синдром Альпорта', 'Alport syndrome'],
  265: ['Bartter sindromu', 'Синдром Барттера', 'Bartter syndrome'],
  266: ['Siliopatiyalar', 'Цилиопатии', 'Ciliopathies'],
  267: ['Şəkərsiz diabet', 'Несахарный диабет', 'Diabetes insipidus'],
  268: ['Hipomaqnezemiya', 'Гипомагниемия', 'Hypomagnesemia'],
  269: ['Jubert sindromu', 'Синдром Жубера', 'Joubert syndrome'],
  270: ['Mekkel sindromu', 'Синдром Меккеля', 'Meckel syndrome'],
  271: ['Nefrolitiaz (böyrək daşları)', 'Нефролитиаз (мочекаменная болезнь)', 'Nephrolithiasis (kidney stones)'],
  272: ['Psevdohipoaldosteronizm', 'Псевдогипоальдостеронизм', 'Pseudohypoaldosteronism'],
  273: ['Renal kanalcıq asidozu', 'Почечный канальцевый ацидоз', 'Renal tubular acidosis'],
  274: ['Nefrotik sindrom', 'Нефротический синдром', 'Nephrotic syndrome'],
  275: ['İlkin siliar diskineziya', 'Первичная цилиарная дискинезия', 'Primary ciliary dyskinesia'],
  276: ['Barde-Bidl sindromu', 'Синдром Барде–Бидля', 'Bardet-Biedl syndrome'],
  277: ['Branxio-oto-renal (BOR) sindromu', 'Бранхио-ото-ренальный (BOR) синдром', 'Branchio-oto-renal (BOR) syndrome'],
  278: ['Kistoz böyrək xəstəlikləri', 'Кистозные болезни почек', 'Cystic kidney disease'],
  279: ['Birincili hiperoksaluriya', 'Первичная гипероксалурия', 'Primary hyperoxaluria'],
  280: ['Böyrək malformasiyaları', 'Пороки развития почек', 'Kidney malformations'],
  281: ['Senior-Loken sindromu', 'Синдром Сениора–Локена', 'Senior-Løken syndrome'],
  282: ['İrsi böyrək xəstəlikləri', 'Наследственные заболевания почек', 'Hereditary kidney diseases', 'w'],
  284: ['Amiotrofik lateral skleroz (ALS)', 'Боковой амиотрофический склероз (БАС)', 'Amyotrophic lateral sclerosis (ALS)'],
  285: ['Serebral kavernoz malformasiya', 'Церебральная кавернозная мальформация', 'Cerebral cavernous malformation'],
  286: ['Koenzim Q10 çatışmazlığı', 'Дефицит коэнзима Q10', 'Coenzyme Q10 deficiency'],
  288: ['Anadangəlmə miastenik sindromlar', 'Врождённые миастенические синдромы', 'Congenital myasthenic syndromes'],
  289: ['Demensiya', 'Деменция', 'Dementia'],
  290: ['Emeri-Dreyfus əzələ distrofiyası', 'Мышечная дистрофия Эмери–Дрейфуса', 'Emery-Dreifuss muscular dystrophy'],
  291: ['Holoprosensefaliya', 'Голопрозэнцефалия', 'Holoprosencephaly'],
  292: ['Leykodistrofiya və leykoensefalopatiya', 'Лейкодистрофии и лейкоэнцефалопатии', 'Leukodystrophy and leukoencephalopathy'],
  293: ['Lissensefaliya', 'Лиссэнцефалия', 'Lissencephaly'],
  294: ['Metabolik epilepsiya', 'Метаболические эпилепсии', 'Metabolic epilepsy'],
  296: ['İrsi epilepsiyalar', 'Наследственные эпилепсии', 'Hereditary epilepsies', 'w'],
  297: ['Neyrodegenerativ xəstəliklər', 'Нейродегенеративные заболевания', 'Neurodegenerative diseases', 'w'],
  299: ['Uşaq serebral iflici', 'Детский церебральный паралич', 'Cerebral palsy', 'w'],
  300: ['Sinir-əzələ xəstəlikləri', 'Нервно-мышечные заболевания', 'Neuromuscular diseases', 'w'],
  301: ['Birləşdirici toxuma xəstəlikləri', 'Заболевания соединительной ткани', 'Connective tissue disorders', 'w'],
  304: ['Mikrosefaliya və pontoserebellyar hipoplaziya', 'Микроцефалия и понтоцеребеллярная гипоплазия', 'Microcephaly and pontocerebellar hypoplasia'],
  305: ['Neyronal seroid lipofussinoz (NCL) və proqressiv mioklonik epilepsiya', 'Нейрональный цероидный липофусциноз (НЦЛ) и прогрессирующая миоклоническая эпилепсия', 'Neuronal ceroid lipofuscinosis (NCL) and progressive myoclonic epilepsy'],
  306: ['Neyro-oftalmologiya', 'Нейроофтальмология', 'Neuro-ophthalmology'],
  307: ['Parkinson xəstəliyi', 'Болезнь Паркинсона', "Parkinson's disease"],
  308: ['Polimikroqiriya', 'Полимикрогирия', 'Polymicrogyria'],
  309: ['Septo-optik displaziya', 'Септооптическая дисплазия', 'Septo-optic dysplasia'],
  310: ['Onurğa əzələ atrofiyaları', 'Спинальные мышечные атрофии', 'Spinal muscular atrophies'],
  311: ['X-ə bağlı intellektual inkişaf pozuntusu', 'X-сцепленные нарушения интеллектуального развития', 'X-linked intellectual disability'],
  312: ['Ataksiya', 'Атаксии', 'Ataxia'],
  313: ['Uşaq epilepsiyası "Beyond" (Avropa və Yaxın Şərq üçün)', 'Детская эпилепсия «Beyond» (для Европы и Ближнего Востока)', 'Beyond childhood epilepsy (Europe and Middle East)'],
  314: ['Şarko-Mari-Tut nevropatiyası', 'Невропатия Шарко–Мари–Тута', 'Charcot-Marie-Tooth neuropathy'],
  315: ['Kollagen VI ilə əlaqəli xəstəliklər', 'Заболевания, связанные с коллагеном VI типа', 'Collagen VI-related disorders'],
  316: ['Əzələ distrofiyası / miopatiya (kompleks)', 'Мышечные дистрофии и миопатии (комплексная)', 'Muscular dystrophy / myopathy (comprehensive)'],
  317: ['Kreatin mübadiləsi çatışmazlığı', 'Нарушения обмена креатина', 'Creatine deficiency disorders'],
  318: ['Distoniya', 'Дистония', 'Dystonia'],
  319: ['Epileptik ensefalopatiya', 'Эпилептические энцефалопатии', 'Epileptic encephalopathy'],
  320: ['İdiopatik generalizə və fokal epilepsiya', 'Идиопатическая генерализованная и фокальная эпилепсия', 'Idiopathic generalized and focal epilepsy'],
  321: ['Qurşaq-ətraf (LGMD) və anadangəlmə əzələ distrofiyaları', 'Поясно-конечностные (LGMD) и врождённые мышечные дистрофии', 'Limb-girdle (LGMD) and congenital muscular dystrophies'],
  322: ['Makrosefaliya / həddindən artıq böyümə sindromları', 'Макроцефалия / синдромы избыточного роста', 'Macrocephaly / overgrowth syndromes'],
  323: ['Metabolik miopatiya və rabdomioliz', 'Метаболические миопатии и рабдомиолиз', 'Metabolic myopathy and rhabdomyolysis'],
  324: ['Miqren', 'Мигрень', 'Migraine'],
  325: ['Nemalin miopatiyası', 'Немалиновая миопатия', 'Nemaline myopathy'],
  326: ['Neyron miqrasiyası pozğunluqları', 'Нарушения миграции нейронов', 'Neuronal migration disorders'],
  327: ['Periodik iflic', 'Периодический паралич', 'Periodic paralysis'],
  328: ['Porfiriya', 'Порфирии', 'Porphyria'],
  329: ['İrsi spastik paraplegiya', 'Наследственная спастическая параплегия', 'Hereditary spastic paraplegia'],
  330: ['Tuberoz skleroz', 'Туберозный склероз', 'Tuberous sclerosis complex'],
  332: ['Axromatopsiya', 'Ахроматопсия', 'Achromatopsia'],
  333: ['Barde-Bidl sindromu', 'Синдром Барде–Бидля', 'Bardet-Biedl syndrome'],
  334: ['Kolbaçıq-çubuqcuq distrofiyası', 'Колбочко-палочковая дистрофия', 'Cone-rod dystrophy'],
  335: ['Buynuz qişa (korneal) distrofiyası', 'Дистрофии роговицы', 'Corneal dystrophy'],
  336: ['Ləkəli retina pozğunluqları', 'Пятнистые дистрофии сетчатки', 'Flecked retina disorders'],
  337: ['Jubert sindromu', 'Синдром Жубера', 'Joubert syndrome'],
  338: ['Makula distrofiyası', 'Макулярная дистрофия', 'Macular dystrophy'],
  339: ['My Retina Tracker proqramı', 'Программа My Retina Tracker', 'My Retina Tracker program'],
  340: ['Optik atrofiya', 'Атрофия зрительного нерва', 'Optic atrophy'],
  341: ['Piqmentli retinit', 'Пигментный ретинит', 'Retinitis pigmentosa'],
  342: ['Septo-optik displaziya', 'Септооптическая дисплазия', 'Septo-optic dysplasia'],
  343: ['Aşer sindromu', 'Синдром Ашера', 'Usher syndrome'],
  344: ['Albinizm', 'Альбинизм', 'Albinism'],
  345: ['Katarakta', 'Катаракта', 'Cataract'],
  346: ['Anadangəlmə stasionar gecə korluğu', 'Врождённая стационарная ночная слепота', 'Congenital stationary night blindness'],
  347: ['Büllurun ektopiyası (ectopia lentis)', 'Эктопия хрусталика', 'Ectopia lentis'],
  348: ['Qlaukoma', 'Глаукома', 'Glaucoma'],
  349: ['Leberin anadangəlmə amavrozu', 'Врождённый амавроз Лебера', 'Leber congenital amaurosis'],
  350: ['Mikroftalmiya, anoftalmiya və ön seqment disgeneziyası', 'Микрофтальмия, анофтальмия и дисгенезия переднего сегмента', 'Microphthalmia, anophthalmia and anterior segment dysgenesis'],
  351: ['Neyro-oftalmologiya', 'Нейроофтальмология', 'Neuro-ophthalmology'],
  352: ['Retina distrofiyası', 'Дистрофии сетчатки', 'Retinal dystrophy'],
  353: ['Senior-Loken sindromu', 'Синдром Сениора–Локена', 'Senior-Løken syndrome'],
  354: ['Vitreoretinopatiya', 'Витреоретинопатия', 'Vitreoretinopathy'],
  355: ['İrsi göz xəstəlikləri', 'Наследственные заболевания глаз', 'Hereditary eye diseases', 'w'],
  357: ['Bronxoektaziya', 'Бронхоэктазы', 'Bronchiectasis'],
  358: ['Hermanski-Pudlak sindromu', 'Синдром Германского–Пудлака', 'Hermansky-Pudlak syndrome'],
  359: ['Yenidoğulmuşların tənəffüs çatışmazlığı – surfaktant disfunksiyası', 'Дыхательная недостаточность новорождённых — дисфункция сурфактанта', 'Neonatal respiratory distress – surfactant dysfunction'],
  360: ['Kompleks pulmonologiya', 'Комплексная пульмонология', 'Comprehensive pulmonology'],
  361: ['Ağciyər arterial hipertenziyası', 'Лёгочная артериальная гипертензия', 'Pulmonary arterial hypertension'],
  362: ['Mərkəzi hipoventilyasiya və apnoe', 'Центральная гиповентиляция и апноэ', 'Central hypoventilation and apnea'],
  363: ['Kistoz ağciyər xəstəliyi', 'Кистозные заболевания лёгких', 'Cystic lung disease'],
  364: ['İnterstisial ağciyər xəstəliyi', 'Интерстициальные заболевания лёгких', 'Interstitial lung disease'],
  365: ['İlkin siliar diskineziya', 'Первичная цилиарная дискинезия', 'Primary ciliary dyskinesia'],
  367: ['Mitoxondrial DNT tükənməsi sindromu', 'Синдром истощения митохондриальной ДНК', 'Mitochondrial DNA depletion syndrome'],
  369: ['İrsi reproduktiv sistem pozuntuları', 'Наследственные нарушения репродуктивной системы', 'Hereditary reproductive disorders', 'w'],
}

// ---------------------------------------------------------------------------
// TAM: hand-written entries (reproductive, pregnancy, exome, monogenic,
// kinship, HLA, featured neurology). d = description; m/s override method/sample.
// ---------------------------------------------------------------------------
const EDTA_S = SAMPLES.edta.s
const hlaLocus = (row, locus, isLocus) => ({
  row,
  n: isLocus
    ? L(`${locus} lokusunun tipləməsi (NGS)`, `Типирование локуса ${locus} (NGS)`, `${locus} locus typing (NGS)`)
    : L(`${locus} tipləməsi (NGS)`, `Типирование ${locus} (NGS)`, `${locus} typing (NGS)`),
  d: L(
    `${locus} ${isLocus ? 'lokusunun' : 'qrupunun'} yüksək dəqiqlikli NGS tipləməsi. HLA tipləməsi əsasən sümük iliyi (kök hüceyrə) və ya orqan transplantasiyası üçün uyğun donorun seçilməsində, bəzən isə müəyyən immun xəstəliklərlə əlaqənin qiymətləndirilməsində istifadə olunur. ${EDTA_S.az}`,
    `Высокоточное типирование ${locus} методом NGS. HLA-типирование в основном применяется для подбора совместимого донора при трансплантации костного мозга (стволовых клеток) или органов, а иногда — для оценки связи с некоторыми иммунными заболеваниями. ${EDTA_S.ru}`,
    `High-resolution NGS typing of ${locus}. HLA typing is mainly used to find a compatible donor for bone marrow (stem cell) or organ transplantation, and sometimes to assess links with certain immune conditions. ${EDTA_S.en}`
  ),
  tags: ['hla-typing', 'transplant'],
})

const CUSTOM = [
  {
    row: 3, f: true,
    n: L('Amniotik mayedən xromosom analizi + ana hüceyrələri ilə kontaminasiyanın yoxlanması', 'Хромосомный анализ амниотической жидкости + исключение примеси материнских клеток', 'Amniotic fluid chromosome analysis + maternal cell contamination check'),
    d: L(
      'Amniotik mayedə körpənin xromosomları araşdırılır və onların sayında və ya quruluşunda dəyişikliklər, məsələn, Daun sindromu aşkarlanır. Əlavə yoxlama nəticənin anaya deyil, məhz körpəyə aid hüceyrələri əks etdirdiyini təsdiqləyir. Adətən skrininq testləri və ya USM yüksək risk göstərdikdə təyin olunur. Maye (təxminən 20 ml) amniosentez zamanı həkim tərəfindən götürülür.',
      'Исследуются хромосомы плода в амниотической жидкости, что позволяет выявить изменения их числа или структуры, например синдром Дауна. Дополнительная проверка подтверждает, что результат отражает клетки ребёнка, а не матери. Обычно назначается, если скрининг или УЗИ указывают на повышенный риск. Жидкость (около 20 мл) берёт врач во время амниоцентеза.',
      "The baby's chromosomes are examined in amniotic fluid to detect changes in their number or structure, such as Down syndrome. An additional check confirms that the result reflects the baby's cells and not the mother's. It is usually offered when screening tests or ultrasound suggest a higher risk. The fluid (about 20 ml) is collected by a doctor during amniocentesis."
    ),
    tags: ['prenatal', 'karyotype'],
  },
  {
    row: 4,
    n: L('Amniotik mayedən xromosom analizi + QF-PZR (13, 18, 21, X, Y)', 'Хромосомный анализ амниотической жидкости + КФ-ПЦР (13, 18, 21, X, Y)', 'Amniotic fluid chromosome analysis + QF-PCR (13, 18, 21, X, Y)'),
    d: L(
      'Amniotik mayenin tam xromosom analizi ən çox rast gəlinən xromosom anomaliyalarını (13, 18, 21, X və Y xromosomları) yoxlayan sürətli QF-PZR testi ilə birləşdirilir. QF-PZR bir neçə gün ərzində ilkin cavab verir, tam kariotip isə daha sonra hazır olur. Adətən anormal skrininq nəticəsi və ya USM tapıntısından sonra tövsiyə olunur. Nümunə amniosentez zamanı götürülən amniotik mayedir.',
      'Полный хромосомный анализ амниотической жидкости дополняется быстрым тестом КФ-ПЦР на самые частые хромосомные аномалии (хромосомы 13, 18, 21, X и Y). КФ-ПЦР даёт предварительный ответ за несколько дней, а полный кариотип готов позже. Обычно рекомендуется после отклонений в скрининге или на УЗИ. Материал — амниотическая жидкость, полученная при амниоцентезе.',
      'A full chromosome analysis of amniotic fluid combined with QF-PCR, a rapid test for the most common chromosome conditions (chromosomes 13, 18, 21, X and Y). QF-PCR gives a preliminary answer within a few days, while the full karyotype follows later. It is typically recommended after an abnormal screening result or ultrasound finding. The sample is amniotic fluid collected during amniocentesis.'
    ),
    tags: ['prenatal', 'karyotype', 'qf-pcr'],
  },
  {
    row: 5, f: true,
    n: L('Periferik qandan xromosom analizi (kariotip)', 'Хромосомный анализ периферической крови (кариотип)', 'Peripheral blood chromosome analysis (karyotype)'),
    d: L(
      'Bütün xromosomlar mikroskop altında araşdırılır və onların sayında və ya quruluşunda dəyişikliklər axtarılır. Sonsuzluq və ya təkrarlanan düşüklər olan cütlüklərə, inkişaf və boy problemləri olan şəxslərə, həmçinin ailəsində xromosom dəyişikliyi aşkarlanmış qohumlara tez-tez tövsiyə olunur. Venadan heparinli boruya (yaşıl qapaq) qan götürülür.',
      'Все хромосомы изучаются под микроскопом для поиска изменений их числа или структуры. Часто рекомендуется парам с бесплодием или повторными выкидышами, людям с нарушениями развития или роста, а также родственникам человека с выявленной хромосомной перестройкой. Кровь берут из вены в пробирку с гепарином (зелёная крышка).',
      'All chromosomes are examined under the microscope to look for changes in their number or structure. It is often recommended for couples with infertility or repeated miscarriages, people with developmental or growth concerns, and relatives of someone with a known chromosome rearrangement. Blood is taken from a vein into a heparin tube (green cap).'
    ),
    tags: ['karyotype', 'infertility'],
  },
  {
    row: 6,
    n: L('Düşük materialından xromosom analizi', 'Хромосомный анализ материала выкидыша', 'Chromosome analysis of miscarriage tissue'),
    d: L(
      'Düşükdən sonra hamiləlik toxumasının xromosomları araşdırılır ki, itkinin səbəbi xromosom dəyişikliyi olub-olmadığı müəyyən edilsin. Bu, cütlüyə və həkimə baş verənləri anlamağa və növbəti hamiləliyi planlamağa kömək edir. Toxuma prosedur zamanı həkim tərəfindən götürülür və xüsusi mühitdə göndərilir.',
      'После выкидыша исследуются хромосомы тканей беременности, чтобы понять, была ли причиной хромосомная аномалия. Это помогает паре и врачу понять произошедшее и спланировать следующую беременность. Материал берёт врач во время процедуры и отправляет в специальной среде.',
      'After a miscarriage, the chromosomes of the pregnancy tissue are analysed to find out whether a chromosome change was the likely cause. This helps the couple and their doctor understand the loss and plan a future pregnancy. The tissue is collected by the doctor during the procedure and sent in a special medium.'
    ),
    tags: ['miscarriage', 'karyotype'],
  },
  {
    row: 7,
    n: L('Düşük materialından xromosom analizi + STD8 (PZR)', 'Хромосомный анализ материала выкидыша + STD8 (ПЦР)', 'Chromosome analysis of miscarriage tissue + STD8 (PCR)'),
    d: L(
      'Düşük materialının xromosom analizi, itkinin mümkün infeksion səbəblərini yoxlamaq üçün PZR ilə STD8 infeksiya paneli ilə birləşdirilir. Bu yanaşma həm genetik, həm də infeksion səbəbləri eyni nümunədə qiymətləndirməyə imkan verir. Toxuma prosedur zamanı həkim tərəfindən götürülür və xüsusi mühitdə göndərilir.',
      'Хромосомный анализ материала выкидыша дополняется ПЦР-панелью инфекций STD8 для поиска возможных инфекционных причин. Такой подход позволяет на одном образце оценить как генетические, так и инфекционные причины. Материал берёт врач во время процедуры и отправляет в специальной среде.',
      'Chromosome analysis of miscarriage tissue combined with the STD8 PCR infection panel to look for possible infectious causes of the loss. This approach assesses both genetic and infectious causes on the same sample. The tissue is collected by the doctor during the procedure and sent in a special medium.'
    ),
    tags: ['miscarriage', 'karyotype', 'pcr'],
  },
  {
    row: 8, m: 'qfpcr_fish',
    n: L('QF-PZR / sürətli FISH (13, 18, 21, X, Y)', 'КФ-ПЦР / быстрый FISH (13, 18, 21, X, Y)', 'QF-PCR / rapid FISH (13, 18, 21, X, Y)'),
    d: L(
      'Ən çox rast gəlinən xromosom sayı dəyişikliklərini – 13, 18, 21 (Daun sindromu), X və Y xromosomlarını yoxlayan sürətli prenatal testdir. Nəticə adətən bir neçə gün ərzində hazır olur və gözləmə ilə bağlı narahatlığı azaldır. Həkim tərəfindən götürülən amniotik maye və ya fetal qan üzərində aparılır.',
      'Быстрый пренатальный тест на самые частые изменения числа хромосом — 13, 18, 21 (синдром Дауна), X и Y. Результат обычно готов за несколько дней, что сокращает тревожное ожидание. Проводится на амниотической жидкости или крови плода, полученных врачом.',
      'A rapid prenatal test for the most common changes in chromosome number – chromosomes 13, 18, 21 (Down syndrome), X and Y. Results are usually ready within a few days, shortening an anxious wait. It is performed on amniotic fluid or fetal blood collected by a doctor.'
    ),
    tags: ['prenatal', 'rapid'],
  },
  {
    row: 9, f: true,
    n: L('Trombofiliya paneli 1 (ən çox rast gəlinən mutasiyalar)', 'Панель тромбофилии 1 (наиболее частые мутации)', 'Thrombophilia panel 1 (most common variants)'),
    d: L(
      'Qanın laxtalanmaya meylini artıran ən çox rast gəlinən irsi dəyişiklikləri yoxlayır. Təkrarlanan hamiləlik itkisi, ECO-dan öncə, həmçinin sizdə və ya qohumlarınızda tromb (qan laxtası) olubsa tövsiyə oluna bilər. Nəticə həkimə profilaktik tədbirləri planlamağa kömək edir. Venadan EDTA-lı boruya (bənövşəyi qapaq) qan götürülür.',
      'Выявляет наиболее частые наследственные изменения, повышающие склонность к образованию тромбов. Может быть рекомендована при повторной потере беременности, перед ЭКО, а также если у вас или родственников были тромбозы. Результат помогает врачу спланировать профилактику. Кровь берут из вены в пробирку с ЭДТА (фиолетовая крышка).',
      'Checks for the most common inherited changes that increase the tendency to form blood clots. It may be recommended after recurrent pregnancy loss, before IVF, or if you or relatives have had a blood clot. The result helps your doctor plan preventive measures. Blood is taken from a vein into an EDTA tube (purple cap).'
    ),
    tags: ['thrombophilia', 'pcr'],
  },
  {
    row: 10,
    n: L('Trombofiliya paneli 2 (əlavə markerlər)', 'Панель тромбофилии 2 (дополнительные маркеры)', 'Thrombophilia panel 2 (additional markers)'),
    d: L(
      'Panel 1-ə daxil olmayan, laxtalanma ilə əlaqəli əlavə irsi markerləri araşdırır. Daha geniş qiymətləndirmə lazım olduqda və ya Panel 1 nəticəsindən sonra həkim tərəfindən təyin oluna bilər. Venadan EDTA-lı boruya (bənövşəyi qapaq) qan götürülür.',
      'Исследует дополнительные наследственные маркеры, связанные со свёртыванием крови, которые не входят в Панель 1. Может быть назначена врачом, когда нужна более широкая оценка или после результата Панели 1. Кровь берут из вены в пробирку с ЭДТА (фиолетовая крышка).',
      'Examines additional inherited markers related to blood clotting that are not included in Panel 1. Your doctor may order it when a broader assessment is needed or after a Panel 1 result. Blood is taken from a vein into an EDTA tube (purple cap).'
    ),
    tags: ['thrombophilia'],
  },
  {
    row: 11,
    n: L('Trombofiliya paneli 3 (Panel 1 + Panel 2)', 'Панель тромбофилии 3 (Панель 1 + Панель 2)', 'Thrombophilia panel 3 (Panel 1 + Panel 2)'),
    d: L(
      'Panel 1 və Panel 2-ni bir testdə birləşdirən ən geniş trombofiliya qiymətləndirməsidir. Təkrarlanan hamiləlik itkisi, uğursuz ECO cəhdləri və ya ailədə tromboz halları olduqda tam mənzərə əldə etmək üçün uyğundur. Venadan EDTA-lı boruya (bənövşəyi qapaq) qan götürülür.',
      'Наиболее полная оценка тромбофилии, объединяющая Панели 1 и 2 в одном тесте. Подходит для получения полной картины при повторной потере беременности, неудачных попытках ЭКО или семейных случаях тромбоза. Кровь берут из вены в пробирку с ЭДТА (фиолетовая крышка).',
      'The most complete thrombophilia assessment, combining Panels 1 and 2 in a single test. It gives a full picture after recurrent pregnancy loss, unsuccessful IVF attempts or a family history of blood clots. Blood is taken from a vein into an EDTA tube (purple cap).'
    ),
    tags: ['thrombophilia', 'pcr'],
  },
  {
    row: 12, f: true,
    n: L('Hamiləlikdən öncə cütlüyün genetik xəstəliklər skrininqi (xromosom analizi daxil)', 'Генетический скрининг пары перед беременностью (включая хромосомный анализ)', 'Preconception genetic screening for couples (including chromosome analysis)'),
    d: L(
      'Hər iki partnyor hamiləlikdən öncə irsi genetik xəstəliklərin daşıyıcılığına görə NGS ilə yoxlanılır, əlavə olaraq xromosom analizi aparılır. Sağlam insanlar heç bir əlamət olmadan daşıyıcı ola bilər; hər iki partnyor eyni gendə dəyişiklik daşıyırsa, uşaq üçün risk artır. Nəticələr cütlüyə həkimlə birlikdə hamiləliyi planlamağa kömək edir. Hər iki partnyordan venoz qan götürülür.',
      'Оба партнёра перед беременностью проверяются методом NGS на носительство наследственных заболеваний, дополнительно выполняется хромосомный анализ. Здоровые люди могут быть носителями без каких-либо симптомов; если оба партнёра несут изменения в одном и том же гене, риск для ребёнка возрастает. Результаты помогают паре вместе с врачом спланировать беременность. Кровь из вены берут у обоих партнёров.',
      'Both partners are screened before pregnancy with NGS for carrier status of inherited genetic diseases, plus a chromosome analysis. Healthy people can be carriers without any symptoms; if both partners carry a change in the same gene, the risk for their child increases. The results help the couple plan pregnancy together with their doctor. A blood sample is taken from both partners.'
    ),
    tags: ['preconception', 'carrier-screening', 'couples'],
  },
  {
    row: 13,
    n: L('Hamiləlikdən öncə cütlüyün genetik xəstəliklər skrininqi (2 nəfər)', 'Генетический скрининг пары перед беременностью (2 человека)', 'Preconception genetic screening for couples (2 people)'),
    d: L(
      'Hər iki partnyor hamiləlikdən öncə NGS ilə irsi genetik xəstəliklərin daşıyıcılığına görə yoxlanılır. Daşıyıcılar adətən sağlam olur, lakin hər iki partnyor eyni gendə dəyişiklik daşıyırsa, uşaq xəstəliyi irs ala bilər. Qohum nikahlarında və ya ailədə irsi xəstəlik olduqda xüsusilə tövsiyə olunur. Hər partnyordan EDTA-lı boruya 5 ml qan götürülür.',
      'Оба партнёра перед беременностью проверяются методом NGS на носительство наследственных заболеваний. Носители обычно здоровы, но если оба партнёра несут изменения в одном гене, ребёнок может унаследовать болезнь. Особенно рекомендуется при родственном браке или наследственных заболеваниях в семье. У каждого партнёра берут 5 мл крови в пробирку с ЭДТА.',
      'Both partners are screened before pregnancy with NGS for carrier status of inherited genetic diseases. Carriers are usually healthy, but if both partners carry a change in the same gene, a child could inherit the condition. It is especially recommended for related partners or families with a known inherited disease. 5 ml of blood is taken from each partner into an EDTA tube.'
    ),
    tags: ['preconception', 'carrier-screening', 'couples', 'ngs'],
  },
  {
    row: 14,
    n: L('Geniş panel: hamiləlikdən öncə cütlüyün genetik skrininqi, xromosom analizi, spermoqram, AZF lokusu və geniş tromboz paneli', 'Расширенная панель: генетический скрининг пары перед беременностью, хромосомный анализ, спермограмма, локусы AZF и расширенная панель тромбофилии', 'Extended panel: preconception couple screening, chromosome analysis, semen analysis, AZF loci and extended thrombophilia panel'),
    d: L(
      'Hamiləliyə hazırlaşan cütlüklər üçün ən əhatəli paketdir: irsi xəstəliklərin daşıyıcılıq skrininqi, xromosom analizi, spermoqram, kişi fertilliyi üçün AZF lokuslarının analizi və geniş trombofiliya paneli. Sonsuzluq, təkrarlanan düşüklər və ya ECO planlaşdırıldıqda bir neçə ayrı müayinəni bir paketdə birləşdirir. Hər iki partnyordan venoz qan (EDTA və heparinli borular), spermoqram üçün isə sperma nümunəsi götürülür.',
      'Самый полный пакет для пар, готовящихся к беременности: скрининг носительства наследственных заболеваний, хромосомный анализ, спермограмма, анализ локусов AZF для оценки мужской фертильности и расширенная панель тромбофилии. Объединяет несколько отдельных обследований при бесплодии, повторных выкидышах или подготовке к ЭКО. У обоих партнёров берут венозную кровь (пробирки с ЭДТА и гепарином), для спермограммы — образец эякулята.',
      'The most comprehensive package for couples planning a pregnancy: carrier screening for inherited diseases, chromosome analysis, semen analysis, AZF locus testing for male fertility and an extended thrombophilia panel. It brings several separate tests together for infertility, recurrent miscarriage or IVF planning. Venous blood (EDTA and heparin tubes) is taken from both partners, plus a semen sample for the semen analysis.'
    ),
    tags: ['preconception', 'carrier-screening', 'couples', 'package'],
  },
  {
    row: 15,
    n: L('ECO-dan öncə valideynlərin yoxlanması: MAR test, AZF lokusu + NIPT pulsuz', 'Обследование родителей перед ЭКО: MAR-тест, локусы AZF + НИПТ бесплатно', 'Pre-IVF parental screening: MAR test, AZF loci + complimentary NIPT'),
    d: L(
      'Süni mayalanmadan (ECO) öncə valideynlər üçün kompleks genetik paketdir: genetik skrininq, antisperm antitellərini yoxlayan MAR test və kişi fertilliyi üçün AZF lokuslarının analizi. Paketə sonrakı hamiləlik zamanı NIPT testi pulsuz daxildir (şərtləri laboratoriyadan dəqiqləşdirin). Hər partnyordan EDTA-lı boruya 5 ml qan, MAR test üçün isə sperma nümunəsi götürülür.',
      'Комплексный генетический пакет для родителей перед ЭКО: генетический скрининг, MAR-тест на антиспермальные антитела и анализ локусов AZF для оценки мужской фертильности. В пакет бесплатно включён НИПТ во время последующей беременности (условия уточняйте в лаборатории). У каждого партнёра берут 5 мл крови в пробирку с ЭДТА, для MAR-теста — образец эякулята.',
      'A comprehensive genetic package for parents before IVF: genetic screening, the MAR test for antisperm antibodies and AZF locus testing for male fertility. NIPT during the subsequent pregnancy is included free of charge (please check the terms with the lab). 5 ml of blood is taken from each partner into an EDTA tube, plus a semen sample for the MAR test.'
    ),
    tags: ['ivf', 'package', 'includes-free-nipt'],
  },
  {
    row: 17,
    n: L('Sperm FISH', 'FISH-анализ сперматозоидов', 'Sperm FISH'),
    d: L(
      'Spermatozoidlərdə xromosomların sayı yoxlanılır və anormal xromosom dəstinə malik hüceyrələrin payı müəyyən edilir. Kişi sonsuzluğu, təkrarlanan uğursuz ECO cəhdləri və ya təkrarlanan düşüklər zamanı faydalı ola bilər. 3 günlük cinsi pəhrizdən sonra steril qabda sperma nümunəsi təqdim olunur.',
      'Определяется число хромосом в сперматозоидах и доля клеток с аномальным хромосомным набором. Может быть полезен при мужском бесплодии, повторных неудачах ЭКО или повторных выкидышах. Эякулят сдаётся в стерильный контейнер после 3 дней полового воздержания.',
      'Counts chromosomes in sperm cells to find what proportion carry an abnormal number of chromosomes. It can be helpful for male infertility, repeated IVF failure or recurrent miscarriage. A semen sample is provided in a sterile container after 3 days of sexual abstinence.'
    ),
    tags: ['male-fertility', 'fish'],
  },
  {
    row: 18, m: 'tunel',
    n: L('Sperm DNT fraqmentasiyası testi (TUNEL)', 'Тест фрагментации ДНК сперматозоидов (TUNEL)', 'Sperm DNA fragmentation test (TUNEL)'),
    d: L(
      'Spermatozoidlərin DNT-sində qırılmaların (zədələnmənin) səviyyəsini ölçür. Yüksək fraqmentasiya mayalanma, embrion inkişafı və hamiləliyin davam etməsinə təsir edə bilər. Standart spermoqram normal olduqda belə açıqlanmayan sonsuzluq və ya təkrarlanan ECO uğursuzluqlarında tövsiyə olunur. 3 günlük cinsi pəhrizdən sonra steril qabda sperma nümunəsi təqdim olunur.',
      'Измеряет уровень повреждений (разрывов) ДНК в сперматозоидах. Высокая фрагментация может влиять на оплодотворение, развитие эмбриона и вынашивание беременности. Рекомендуется при необъяснимом бесплодии или повторных неудачах ЭКО, даже при нормальной спермограмме. Эякулят сдаётся в стерильный контейнер после 3 дней полового воздержания.',
      'Measures the level of breaks (damage) in sperm DNA. High fragmentation can affect fertilisation, embryo development and pregnancy. It is recommended for unexplained infertility or repeated IVF failure, even when a standard semen analysis is normal. A semen sample is provided in a sterile container after 3 days of sexual abstinence.'
    ),
    tags: ['male-fertility'],
  },
  {
    row: 19,
    n: L('Y xromosomu mikrodelesiyaları (SRY, AZFa, AZFb, AZFc)', 'Микроделеции Y-хромосомы (SRY, AZFa, AZFb, AZFc)', 'Y chromosome microdeletions (SRY, AZFa, AZFb, AZFc)'),
    d: L(
      'Y xromosomunun AZFa, AZFb, AZFc bölgələrində və SRY genində kiçik itkiləri (mikrodelesiyaları) axtarır – bu, spermatozoidlərin çox az olması və ya olmamasının tez-tez rast gəlinən genetik səbəbidir. Nəticə həkimə ən uyğun fertillik müalicəsini seçməyə kömək edir. Venadan EDTA-lı boruya (bənövşəyi qapaq) qan götürülür.',
      'Выявляет небольшие утраты (микроделеции) в регионах AZFa, AZFb, AZFc и гене SRY Y-хромосомы — частую генетическую причину очень низкого количества или отсутствия сперматозоидов. Результат помогает врачу выбрать наиболее подходящий метод лечения бесплодия. Кровь берут из вены в пробирку с ЭДТА (фиолетовая крышка).',
      'Looks for small missing pieces (microdeletions) in the AZFa, AZFb and AZFc regions and the SRY gene of the Y chromosome – a common genetic cause of very low or absent sperm count. The result helps your doctor choose the most suitable fertility treatment. Blood is taken from a vein into an EDTA tube (purple cap).'
    ),
    tags: ['male-fertility', 'pcr'],
  },
  {
    row: 21, f: true,
    n: L('Ekzom sekvenləmə (1 nəfər)', 'Секвенирование экзома (1 человек)', 'Exome sequencing (1 person)'),
    d: L(
      'Təxminən 20 000 genin zülal kodlayan hissəsi (ekzom) oxunur – məlum xəstəlik törədən dəyişikliklərin əksəriyyəti məhz burada yerləşir. Simptomlar genetik xəstəliyə işarə etdikdə, lakin daha dar testlərlə dəqiq diaqnoz qoyulmadıqda istifadə olunur. Test EDTA-lı qan, prenatal hallarda isə amniotik maye və ya fetal qan üzərində aparıla bilər. Nəticələr genetik məsləhətçi ilə birlikdə müzakirə edilməlidir.',
      'Прочитываются белок-кодирующие участки (экзом) около 20 000 генов — здесь находится большинство известных причинных изменений. Применяется, когда симптомы указывают на генетическое заболевание, но более узкие тесты не позволили поставить точный диагноз. Исследование проводится по крови с ЭДТА, а при пренатальной диагностике — по амниотической жидкости или крови плода. Результаты следует обсуждать с врачом-генетиком.',
      'Reads the protein-coding part (the exome) of about 20,000 genes, where most known disease-causing changes are found. It is used when symptoms point to a genetic condition but narrower tests have not reached a clear diagnosis. The test is done on EDTA blood, or prenatally on amniotic fluid or fetal blood. Results should be discussed with a genetic counselor.'
    ),
    tags: ['exome', 'ngs', 'wes'],
  },
  {
    row: 22,
    n: L('Ekzom sekvenləmə – 2 nəfər (eyni ailədən)', 'Секвенирование экзома — 2 человека (из одной семьи)', 'Exome sequencing – 2 people (same family)'),
    d: L(
      'Eyni ailənin iki üzvü, adətən pasiyent və valideynlərdən biri üçün ekzom sekvenləmə. Nəticələrin müqayisəsi tapılan dəyişikliyin irsi və ya yeni yaranmış olduğunu müəyyən etməyə kömək edir və şərhi daha etibarlı edir. Test EDTA-lı qan, prenatal hallarda isə amniotik maye və ya fetal qan üzərində aparılır.',
      'Секвенирование экзома для двух членов одной семьи, обычно пациента и одного из родителей. Сравнение результатов помогает понять, унаследовано ли найденное изменение или возникло впервые, и делает интерпретацию надёжнее. Исследование проводится по крови с ЭДТА, а при пренатальной диагностике — по амниотической жидкости или крови плода.',
      'Exome sequencing for two members of the same family, usually the patient and one parent. Comparing results helps show whether a genetic change was inherited or is new, making interpretation more reliable. The test is done on EDTA blood, or prenatally on amniotic fluid or fetal blood.'
    ),
    tags: ['exome', 'ngs', 'duo'],
  },
  {
    row: 23,
    n: L('Ekzom sekvenləmə – 3 nəfər (eyni ailədən)', 'Секвенирование экзома — 3 человека (из одной семьи)', 'Exome sequencing – 3 people (same family)'),
    d: L(
      'Pasiyent və hər iki valideyn üçün birgə ekzom sekvenləmə ("trio"). Bu yanaşma diaqnoz tapılma ehtimalını artırır və yeni yaranmış dəyişiklikləri irsi dəyişikliklərdən daha dəqiq ayırmağa imkan verir. Test EDTA-lı qan, prenatal hallarda isə amniotik maye və ya fetal qan üzərində aparılır.',
      'Совместное секвенирование экзома пациента и обоих родителей («трио»). Такой подход повышает вероятность найти диагноз и позволяет точнее отличить впервые возникшие изменения от унаследованных. Исследование проводится по крови с ЭДТА, а при пренатальной диагностике — по амниотической жидкости или крови плода.',
      'Exome sequencing of the patient together with both parents (a "trio"). This approach increases the chance of finding a diagnosis and more accurately separates new changes from inherited ones. The test is done on EDTA blood, or prenatally on amniotic fluid or fetal blood.'
    ),
    tags: ['exome', 'ngs', 'trio'],
  },
  {
    row: 25, f: true,
    n: L('Monogen xəstəliklərin daşıyıcılıq testi', 'Тест на носительство моногенных заболеваний', 'Carrier test for monogenic diseases'),
    d: L(
      'Sağlam insanın irsi (monogen) xəstəliklərlə əlaqəli genlərdə gizli dəyişiklik daşıyıb-daşımadığını yoxlayır. Daşıyıcılar adətən sağlam olur, lakin hər iki partnyor eyni gendə dəyişiklik daşıyırsa, uşaq xəstəliyi irs ala bilər. Hamiləlikdən öncə, xüsusilə qohum nikahlarında və ya ailədə irsi xəstəlik olduqda tövsiyə olunur. Venadan EDTA-lı boruya qan götürülür.',
      'Проверяет, является ли здоровый человек скрытым носителем изменений в генах, связанных с наследственными (моногенными) заболеваниями. Носители обычно здоровы, но если оба партнёра несут изменения в одном гене, ребёнок может унаследовать болезнь. Рекомендуется перед беременностью, особенно при родственном браке или наследственных заболеваниях в семье. Кровь берут из вены в пробирку с ЭДТА.',
      'Checks whether a healthy person carries a hidden change in genes linked to inherited (monogenic) diseases. Carriers are usually healthy, but if both partners carry a change in the same gene, a child could inherit the condition. It is recommended before pregnancy, especially for related partners or families with a known inherited disease. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['carrier-screening', 'ngs'],
  },
  {
    row: 26,
    n: L('Məlum mutasiyanın təyini (1–2 gen)', 'Выявление известной мутации (1–2 гена)', 'Known familial mutation testing (1–2 genes)'),
    d: L(
      'Ailədə artıq aşkarlanmış konkret genetik dəyişikliyin 1–2 gendə digər ailə üzvlərində yoxlanmasıdır. Ailə skrininqi, daşıyıcılığın təsdiqi və ya prenatal diaqnostika üçün istifadə olunur. Qohumun genetik nəticəsinin surəti tələb olunur. Nümunə EDTA-lı qan, prenatal testdə isə amniotik maye və ya fetal qandır.',
      'Проверка у членов семьи конкретного генетического изменения в 1–2 генах, уже выявленного у родственника. Используется для семейного скрининга, подтверждения носительства или пренатальной диагностики. Необходима копия генетического заключения родственника. Материал — кровь с ЭДТА, при пренатальном тесте — амниотическая жидкость или кровь плода.',
      'Tests family members for a specific genetic change in 1–2 genes that has already been found in a relative. It is used for family screening, carrier confirmation or prenatal diagnosis. A copy of the relative\'s genetic report is required. The sample is EDTA blood, or amniotic fluid or fetal blood for prenatal testing.'
    ),
    tags: ['familial-variant', 'sanger'],
  },
  {
    row: 27,
    n: L('Məlum mutasiyanın təyini (3–5 gen)', 'Выявление известной мутации (3–5 генов)', 'Known familial mutation testing (3–5 genes)'),
    d: L(
      'Ailədə artıq aşkarlanmış genetik dəyişikliklərin 3–5 gendə digər ailə üzvlərində yoxlanmasıdır. Ailə skrininqi, daşıyıcılığın təsdiqi və ya prenatal diaqnostika üçün istifadə olunur. Qohumun genetik nəticəsinin surəti tələb olunur. Nümunə EDTA-lı qan, prenatal testdə isə amniotik maye və ya fetal qandır.',
      'Проверка у членов семьи генетических изменений в 3–5 генах, уже выявленных у родственника. Используется для семейного скрининга, подтверждения носительства или пренатальной диагностики. Необходима копия генетического заключения родственника. Материал — кровь с ЭДТА, при пренатальном тесте — амниотическая жидкость или кровь плода.',
      'Tests family members for genetic changes in 3–5 genes already found in a relative. It is used for family screening, carrier confirmation or prenatal diagnosis. A copy of the relative\'s genetic report is required. The sample is EDTA blood, or amniotic fluid or fetal blood for prenatal testing.'
    ),
    tags: ['familial-variant', 'sanger'],
  },
  {
    row: 28, f: true,
    n: L('Spinal əzələ atrofiyası (SMA) – SMN1, SMN2, 5q13 (MLPA)', 'Спинальная мышечная атрофия (СМА) — SMN1, SMN2, 5q13 (MLPA)', 'Spinal muscular atrophy (SMA) – SMN1, SMN2, 5q13 (MLPA)'),
    d: L(
      'SMN1 və SMN2 genlərinin nüsxə sayını ölçərək spinal əzələ atrofiyasını (SMA) təsdiqləyir və ya sağlam daşıyıcıları müəyyən edir. SMA müalicəsi mövcud olan sinir-əzələ xəstəliyidir və erkən diaqnoz çox önəmlidir. SMN2 nüsxə sayı həkimə xəstəliyin gedişatını qiymətləndirməyə də kömək edir. Venadan EDTA-lı boruya qan götürülür.',
      'Измеряя число копий генов SMN1 и SMN2, тест подтверждает спинальную мышечную атрофию (СМА) или выявляет здоровых носителей. СМА — нервно-мышечное заболевание, для которого существует лечение, и ранняя диагностика очень важна. Число копий SMN2 также помогает врачу оценить течение болезни. Кровь берут из вены в пробирку с ЭДТА.',
      'By measuring the number of copies of the SMN1 and SMN2 genes, this test confirms spinal muscular atrophy (SMA) or identifies healthy carriers. SMA is a treatable neuromuscular condition, and early diagnosis matters. The SMN2 copy number also helps doctors estimate how the condition may progress. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['sma', 'mlpa', 'carrier-screening'],
  },
  {
    row: 29,
    n: L('Spinal əzələ atrofiyası (SMA) – SMN1, SMN2, 5q13 (PZR)', 'Спинальная мышечная атрофия (СМА) — SMN1, SMN2, 5q13 (ПЦР)', 'Spinal muscular atrophy (SMA) – SMN1, SMN2, 5q13 (PCR)'),
    d: L(
      'SMA-ya səbəb olan ən çox rast gəlinən SMN1 gen itkisini PZR ilə yoxlayır və əlamətləri olan pasiyentlərdə diaqnozu təsdiqləmək və ya istisna etmək üçün istifadə olunur. Daşıyıcılığın və SMN2 nüsxə sayının təyini üçün MLPA testi daha uyğundur. Venadan EDTA-lı boruya qan götürülür.',
      'С помощью ПЦР выявляет самую частую утрату гена SMN1, вызывающую СМА; применяется для подтверждения или исключения диагноза у пациентов с симптомами. Для выявления носительства и числа копий SMN2 больше подходит тест MLPA. Кровь берут из вены в пробирку с ЭДТА.',
      'Uses PCR to detect the most common SMN1 gene deletion that causes SMA, and is used to confirm or rule out the diagnosis in people with symptoms. For carrier testing and SMN2 copy number, the MLPA test is more suitable. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['sma', 'pcr'],
  },
  {
    row: 30,
    n: L('Düşen/Bekker əzələ distrofiyası – DMD geni (MLPA)', 'Мышечная дистрофия Дюшенна/Беккера — ген DMD (MLPA)', 'Duchenne/Becker muscular dystrophy – DMD gene (MLPA)'),
    d: L(
      'DMD genində böyük itki və ya artımları (delesiya/duplikasiya) axtarır – bu, Düşen və Bekker əzələ distrofiyasının ən çox rast gəlinən səbəbidir. Oğlan uşaqlarında diaqnozu təsdiqləmək və qadın qohumlarda daşıyıcılığı yoxlamaq üçün istifadə olunur. Venadan EDTA-lı boruya qan götürülür.',
      'Выявляет крупные утраты или удвоения (делеции/дупликации) в гене DMD — самую частую причину мышечной дистрофии Дюшенна и Беккера. Используется для подтверждения диагноза у мальчиков и проверки носительства у родственниц. Кровь берут из вены в пробирку с ЭДТА.',
      'Looks for large deletions or duplications in the DMD gene – the most common cause of Duchenne and Becker muscular dystrophy. It is used to confirm the diagnosis in boys and to check carrier status in female relatives. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['dmd', 'mlpa'],
  },
  {
    row: 31,
    n: L('Düşen/Bekker əzələ distrofiyası – DMD geni (NGS)', 'Мышечная дистрофия Дюшенна/Беккера — ген DMD (NGS)', 'Duchenne/Becker muscular dystrophy – DMD gene (NGS)'),
    d: L(
      'DMD geninin tam sekvenlənməsi MLPA ilə görünməyən kiçik dəyişiklikləri aşkarlayır. Adətən MLPA nəticəsi normal olduqda, lakin əlamətlər Düşen və ya Bekker əzələ distrofiyasına işarə etdikdə tövsiyə olunur. Venadan EDTA-lı boruya qan götürülür.',
      'Полное секвенирование гена DMD выявляет мелкие изменения, которые не видны при MLPA. Обычно рекомендуется, если результат MLPA нормальный, но симптомы указывают на мышечную дистрофию Дюшенна или Беккера. Кровь берут из вены в пробирку с ЭДТА.',
      'Full sequencing of the DMD gene detects small changes that MLPA cannot see. It is usually recommended when MLPA is normal but symptoms still suggest Duchenne or Becker muscular dystrophy. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['dmd', 'ngs'],
  },
  {
    row: 32, f: true,
    n: L('Ailəvi döş və yumurtalıq xərçəngi paneli (BRCA1, BRCA2) – 2 gen', 'Панель семейного рака молочной железы и яичников (BRCA1, BRCA2) — 2 гена', 'Familial breast and ovarian cancer panel (BRCA1, BRCA2) – 2 genes'),
    d: L(
      'Döş və yumurtalıq xərçəngi riskini əhəmiyyətli dərəcədə artıran BRCA1 və BRCA2 genlərində irsi dəyişiklikləri axtarır. Ailədə döş, yumurtalıq, prostat və ya mədəaltı vəz xərçəngi halları olduqda tövsiyə oluna bilər. Müsbət nəticə fərdi müayinə, profilaktika və bəzən müalicə seçimlərini planlamağa kömək edir. Venadan EDTA-lı boruya qan götürülür.',
      'Выявляет наследственные изменения в генах BRCA1 и BRCA2, которые значительно повышают риск рака молочной железы и яичников. Может быть рекомендована, если в семье были случаи рака молочной железы, яичников, простаты или поджелудочной железы. Положительный результат помогает спланировать индивидуальное обследование, профилактику, а иногда и лечение. Кровь берут из вены в пробирку с ЭДТА.',
      'Looks for inherited changes in the BRCA1 and BRCA2 genes, which significantly increase the risk of breast and ovarian cancer. It may be recommended when relatives have had breast, ovarian, prostate or pancreatic cancer. A positive result helps plan personalised screening, prevention and sometimes treatment. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['brca', 'hereditary-cancer', 'ngs'],
  },
  {
    row: 33,
    n: L('BRCA1, BRCA2 – şiş toxumasında bütün genin sekvens analizi', 'BRCA1, BRCA2 — полное секвенирование генов в ткани опухоли', 'BRCA1, BRCA2 – full-gene sequencing in tumour tissue'),
    d: L(
      'BRCA1 və BRCA2 genləri əvvəlcədən götürülmüş şiş toxumasında (parafin blok) tam sekvenlənir. Nəticə onkoloqa, məsələn, PARP inhibitorları kimi hədəfə yönəlmiş müalicənin uyğunluğunu qiymətləndirməyə kömək edə bilər. Şişdə tapılan dəyişikliyin irsi olub-olmadığını aydınlaşdırmaq üçün əlavə qan testi tələb oluna bilər.',
      'Гены BRCA1 и BRCA2 полностью секвенируются в ранее полученной ткани опухоли (парафиновый блок). Результат может помочь онкологу оценить целесообразность таргетной терапии, например ингибиторами PARP. Чтобы понять, является ли найденное в опухоли изменение наследственным, может потребоваться дополнительный анализ крови.',
      'The BRCA1 and BRCA2 genes are fully sequenced in previously collected tumour tissue (paraffin block). The result can help your oncologist assess whether targeted treatment, such as PARP inhibitors, may be suitable. An additional blood test may be needed to find out whether a change found in the tumour is inherited.'
    ),
    tags: ['brca', 'somatic', 'ngs'],
  },
  {
    row: 34,
    n: L('FMF – Ailəvi Aralıq dənizi qızdırması (MEFV), bütün genin sekvens analizi', 'ССЛ (FMF) — семейная средиземноморская лихорадка (MEFV), полное секвенирование гена', 'FMF – Familial Mediterranean fever (MEFV), full-gene sequencing'),
    d: L(
      'Ailəvi Aralıq dənizi qızdırmasına (FMF) səbəb olan MEFV geni tam oxunur. FMF qızdırma, qarın, sinə və ya oynaq ağrıları ilə müşayiət olunan təkrarlanan tutmalarla özünü göstərir və regionumuzda nisbətən tez-tez rast gəlinir. Tam sekvenləmə nadir mutasiyaları da aşkarlayır. Venadan EDTA-lı boruya qan götürülür.',
      'Полностью прочитывается ген MEFV, изменения в котором вызывают семейную средиземноморскую лихорадку (ССЛ, FMF). Заболевание проявляется повторяющимися приступами лихорадки с болями в животе, груди или суставах и относительно часто встречается в нашем регионе. Полное секвенирование выявляет и редкие мутации. Кровь берут из вены в пробирку с ЭДТА.',
      'The MEFV gene, which causes Familial Mediterranean fever (FMF), is fully sequenced. FMF causes recurrent episodes of fever with abdominal, chest or joint pain and is relatively common in our region. Full sequencing also detects rare mutations. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['fmf', 'ngs'],
  },
  {
    row: 35,
    n: L('FMF – MEFV, ən çox rast gəlinən 12 mutasiya', 'ССЛ (FMF) — MEFV, 12 наиболее частых мутаций', 'FMF – MEFV, 12 most common mutations'),
    d: L(
      'Ailəvi Aralıq dənizi qızdırmasının (FMF) ən çox rast gəlinən 12 MEFV mutasiyasını yoxlayır. Təkrarlanan qızdırma və qarın ağrısı epizodlarında diaqnozu təsdiqləmək üçün sürətli və əlçatan ilkin testdir; nəticə mənfi, lakin şübhə yüksək olduqda tam gen analizi tövsiyə oluna bilər. Venadan EDTA-lı boruya qan götürülür.',
      'Проверяет 12 наиболее частых мутаций гена MEFV при семейной средиземноморской лихорадке (ССЛ, FMF). Это быстрый и доступный первичный тест для подтверждения диагноза при повторяющихся эпизодах лихорадки и болей в животе; при отрицательном результате и сохраняющемся подозрении может быть рекомендовано полное секвенирование гена. Кровь берут из вены в пробирку с ЭДТА.',
      'Checks the 12 most common MEFV mutations in Familial Mediterranean fever (FMF). It is a quick, affordable first-line test to confirm the diagnosis in recurrent fever and abdominal pain; if negative but suspicion remains high, full-gene sequencing may be recommended. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['fmf'],
  },
  {
    row: 37,
    n: L('Xromosom mikroarray (ARRAY) – postnatal', 'Хромосомный микроматричный анализ (ARRAY) — постнатальный', 'Chromosomal microarray (ARRAY) – postnatal'),
    d: L(
      'Standart kariotipdə görünməyəcək qədər kiçik xromosom itkiləri və artımlarını (nüsxə sayı dəyişiklikləri, CNV) aşkarlayır. İnkişaf ləngiməsi, autizm spektri pozuntuları və ya anadangəlmə qüsurlar olan uşaqlarda tez-tez ilk sıra test kimi istifadə olunur. Venadan EDTA-lı boruya qan götürülür.',
      'Выявляет мелкие утраты и удвоения участков хромосом (вариации числа копий, CNV), которые слишком малы для стандартного кариотипа. Часто используется как тест первой линии у детей с задержкой развития, расстройствами аутистического спектра или врождёнными пороками. Кровь берут из вены в пробирку с ЭДТА.',
      'Detects tiny missing or extra pieces of chromosomes (copy-number variants, CNVs) that are too small to see on a standard karyotype. It is often a first-line test for children with developmental delay, autism spectrum disorders or birth defects. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['microarray', 'cnv', 'postnatal'],
  },
  {
    row: 38,
    n: L('Xromosom mikroarray (ARRAY) – prenatal', 'Хромосомный микроматричный анализ (ARRAY) — пренатальный', 'Chromosomal microarray (ARRAY) – prenatal'),
    d: L(
      'Hamiləlik zamanı körpənin xromosomlarında kiçik itki və artımları (CNV) yüksək dəqiqliklə araşdırır. USM-də inkişaf fərqlilikləri aşkarlandıqda tövsiyə oluna bilər; hamiləlik itkisindən sonra səbəbin aydınlaşdırılmasında da istifadə olunur. Nümunə amniotik maye və ya düşük materialıdır.',
      'С высокой точностью исследует мелкие утраты и удвоения (CNV) в хромосомах ребёнка во время беременности. Может быть рекомендован при выявлении особенностей развития на УЗИ; также используется для поиска причины потери беременности. Материал — амниотическая жидкость или материал выкидыша.',
      "Examines the baby's chromosomes during pregnancy for tiny missing or extra pieces (CNVs) with high resolution. It may be recommended when an ultrasound shows developmental differences, and is also used to find the cause of a pregnancy loss. The sample is amniotic fluid or pregnancy-loss tissue."
    ),
    tags: ['microarray', 'cnv', 'prenatal'],
  },
  {
    row: 39, f: true,
    n: L('NIPT (əsas panel) + cinsiyyət xromosomları', 'НИПТ (базовая панель) + половые хромосомы', 'NIPT (basic panel) + sex chromosomes'),
    d: L(
      'Qeyri-invaziv prenatal test ananın qanında dövr edən körpə DNT fraqmentlərini analiz edərək ən çox rast gəlinən xromosom anomaliyalarının (21, 18 və 13-cü trisomiyalar) və cinsiyyət xromosomu fərqliliklərinin riskini qiymətləndirir; körpənin cinsini də göstərə bilər. Körpə üçün tamamilə təhlükəsizdir və hamiləliyin 10-cu həftəsindən aparılır. Bu skrininq testidir: yüksək risk nəticəsi amniosentez kimi diaqnostik testlə təsdiqlənməlidir. Anadan xüsusi boruya 10 ml qan götürülür.',
      'Неинвазивный пренатальный тест анализирует фрагменты ДНК ребёнка, циркулирующие в крови матери, и оценивает риск самых частых хромосомных аномалий (трисомии 21, 18 и 13) и изменений половых хромосом; также может показать пол ребёнка. Тест полностью безопасен для ребёнка и проводится с 10-й недели беременности. Это скрининг: результат высокого риска нужно подтвердить диагностическим тестом, например амниоцентезом. У матери берут 10 мл крови в специальную пробирку.',
      "A non-invasive prenatal test that analyses the baby's DNA fragments circulating in the mother's blood to estimate the risk of the most common chromosome conditions (trisomies 21, 18 and 13) and sex chromosome differences; it can also reveal the baby's sex. It is completely safe for the baby and can be done from week 10 of pregnancy. It is a screening test: a high-risk result should be confirmed with a diagnostic test such as amniocentesis. 10 ml of blood is taken from the mother into a special tube."
    ),
    tags: ['nipt', 'prenatal', 'screening', 'non-invasive'],
  },
  {
    row: 40, f: true,
    n: L('NIPT – bütün xromosomlar + mikrodelesiyalar (geniş panel)', 'НИПТ — все хромосомы + микроделеции (расширенная панель)', 'NIPT – all chromosomes + microdeletions (extended panel)'),
    d: L(
      'Genişləndirilmiş qeyri-invaziv prenatal test bütün xromosomlarda say dəyişikliklərini və seçilmiş mikrodelesiya sindromlarını ananın qanı ilə qiymətləndirir. Körpə üçün təhlükəsizdir və hamiləliyin 10-cu həftəsindən aparılır. Daha geniş məlumat istəyən ailələr üçün uyğundur; yüksək risk nəticəsi diaqnostik testlə təsdiqlənməlidir. Anadan xüsusi boruya 10 ml qan götürülür.',
      'Расширенный неинвазивный пренатальный тест по крови матери оценивает изменения числа всех хромосом и отдельные микроделеционные синдромы. Безопасен для ребёнка и проводится с 10-й недели беременности. Подходит семьям, желающим получить более полную информацию; результат высокого риска нужно подтвердить диагностическим тестом. У матери берут 10 мл крови в специальную пробирку.',
      "An extended non-invasive prenatal test that uses the mother's blood to assess changes in the number of all chromosomes and selected microdeletion syndromes. It is safe for the baby and can be done from week 10 of pregnancy. It suits families who want broader information; a high-risk result should be confirmed with a diagnostic test. 10 ml of blood is taken from the mother into a special tube."
    ),
    tags: ['nipt', 'prenatal', 'screening', 'non-invasive'],
  },
  ...[[41, '1 embrion', '1 эмбрион', '1 embryo'], [42, '2–3 embrion', '2–3 эмбриона', '2–3 embryos'], [43, '4–8 embrion', '4–8 эмбрионов', '4–8 embryos']].map(([row, az, ru, en]) => ({
    row, s: 'embryo',
    n: L(`PGT – preimplantasiya genetik testi (${az})`, `ПГТ — преимплантационное генетическое тестирование (${ru})`, `PGT – preimplantation genetic testing (${en})`),
    d: L(
      `ECO zamanı yaradılmış embrionlardan götürülmüş bir neçə hüceyrə köçürülmədən öncə NGS ilə araşdırılır ki, xromosom anomaliyası olmayan embrionlar seçilsin. Bu, uğurlu hamiləlik şansını artırmağa və təkrarlanan itki riskini azaltmağa kömək edə bilər. Hüceyrələr ECO klinikası tərəfindən götürülür; qiymət test olunan embrionların sayından asılıdır (bu seçim: ${az}).`,
      `Несколько клеток эмбрионов, полученных при ЭКО, исследуются методом NGS до переноса, чтобы выбрать эмбрионы без хромосомных аномалий. Это может повысить шансы на успешную беременность и снизить риск повторной потери. Клетки получает клиника ЭКО; стоимость зависит от числа тестируемых эмбрионов (данный вариант: ${ru}).`,
      `A few cells from embryos created during IVF are tested with NGS before transfer to help select embryos without chromosome abnormalities. This can improve the chance of a successful pregnancy and reduce the risk of repeated loss. The cells are collected by the IVF clinic; the price depends on the number of embryos tested (this option: ${en}).`
    ),
    tags: ['pgt', 'ivf', 'ngs'],
  })),
  {
    row: 44, m: 'ngs',
    n: L('Hamiləlik dövründə atalığın təyini (9-cu həftədən)', 'Установление отцовства во время беременности (с 9-й недели)', 'Prenatal paternity test (from week 9)'),
    d: L(
      'Ananın qanında dövr edən körpə DNT-si ehtimal olunan atanın DNT-si ilə müqayisə edilərək bioloji atalıq hamiləlik dövründə müəyyən edilir. Test qeyri-invazivdir, körpə üçün heç bir risk yaratmır və hamiləliyin 9-cu həftəsindən aparıla bilər. Anadan xüsusi boruya 10 ml qan, ehtimal olunan atadan isə nümunə götürülür.',
      'Биологическое отцовство устанавливается во время беременности путём сравнения ДНК ребёнка, циркулирующей в крови матери, с ДНК предполагаемого отца. Тест неинвазивный, не несёт риска для ребёнка и может проводиться с 9-й недели беременности. У матери берут 10 мл крови в специальную пробирку, у предполагаемого отца — образец для анализа.',
      "Biological paternity is determined during pregnancy by comparing the baby's DNA circulating in the mother's blood with the alleged father's DNA. The test is non-invasive, poses no risk to the baby and can be done from week 9 of pregnancy. 10 ml of blood is taken from the mother into a special tube, and a sample is also collected from the alleged father."
    ),
    tags: ['paternity', 'prenatal', 'non-invasive'],
  },
  {
    row: 46, f: true, m: 'strpcr',
    n: L('Atalıq testi: valideynlər + uşaq', 'Тест на отцовство: оба родителя + ребёнок', 'Paternity test: both parents + child'),
    d: L(
      'Uşağın DNT-si hər iki valideynin DNT-si ilə müqayisə edilərək bioloji qohumluq çox yüksək dəqiqliklə təsdiqlənir və ya istisna olunur. Ananın nümunəsinin daxil edilməsi nəticəni daha da etibarlı edir. Nümunələr hər üç şəxsdən ağız boşluğundan ağrısız yaxma ilə götürülür.',
      'ДНК ребёнка сравнивается с ДНК обоих родителей, что позволяет с очень высокой точностью подтвердить или исключить биологическое родство. Включение образца матери делает результат ещё надёжнее. Образцы у всех троих берутся безболезненным мазком с внутренней стороны щеки.',
      "The child's DNA is compared with both parents' DNA to confirm or exclude biological relationships with very high accuracy. Including the mother's sample makes the result even more reliable. Samples are collected from all three people with a painless cheek swab."
    ),
    tags: ['paternity', 'dna-test'],
  },
  {
    row: 47, m: 'strpcr',
    n: L('Atalıq testi: bir valideyn + uşaq', 'Тест на отцовство: один родитель + ребёнок', 'Paternity test: one parent + child'),
    d: L(
      'Uşağın DNT-si ehtimal olunan ata və ya ananın DNT-si ilə müqayisə edilərək bioloji valideynlik müəyyən edilir. İkinci valideynin nümunəsi olmadan da yüksək dəqiqlik təmin olunur. Nümunələr ağız boşluğundan ağrısız yaxma ilə götürülür.',
      'ДНК ребёнка сравнивается с ДНК предполагаемого отца или матери для установления биологического родительства. Высокая точность достигается и без образца второго родителя. Образцы берутся безболезненным мазком с внутренней стороны щеки.',
      "The child's DNA is compared with the alleged father's or mother's DNA to establish biological parentage. High accuracy is achieved even without the other parent's sample. Samples are collected with a painless cheek swab."
    ),
    tags: ['paternity', 'dna-test'],
  },
  {
    row: 48, m: 'strpcr',
    n: L('Qohumluq testi: nənə və ya baba + uşaq', 'Тест на родство: бабушка или дедушка + ребёнок', 'Grandparentage test: grandparent + child'),
    d: L(
      'Ehtimal olunan valideyn test üçün əlçatan olmadıqda, uşağın DNT-si nənə və ya babanın DNT-si ilə müqayisə edilərək bioloji qohumluq qiymətləndirilir. Nümunələr ağız boşluğundan ağrısız yaxma ilə götürülür.',
      'Если предполагаемый родитель недоступен для теста, биологическое родство оценивается путём сравнения ДНК ребёнка с ДНК бабушки или дедушки. Образцы берутся безболезненным мазком с внутренней стороны щеки.',
      "When the alleged parent is not available for testing, biological relationship is assessed by comparing the child's DNA with a grandparent's DNA. Samples are collected with a painless cheek swab."
    ),
    tags: ['kinship', 'dna-test'],
  },
  {
    row: 49, m: 'strpcr',
    n: L('Qohumluğun təyini (bacı-qardaş və digər qohumlar)', 'Установление родства (братья, сёстры и другие родственники)', 'Kinship test (siblings and other relatives)'),
    d: L(
      'Bacı-qardaş, xala-bibi, əmi-dayı və digər qohumlar arasında bioloji qohumluq əlaqəsini DNT analizi ilə qiymətləndirir. Miras, sənədləşmə və ya ailə tarixçəsinin aydınlaşdırılması kimi hallarda istifadə oluna bilər. Nümunələr ağız boşluğundan ağrısız yaxma ilə götürülür.',
      'С помощью анализа ДНК оценивается биологическое родство между братьями и сёстрами, тётями, дядями и другими родственниками. Может использоваться при вопросах наследства, оформления документов или прояснения семейной истории. Образцы берутся безболезненным мазком с внутренней стороны щеки.',
      'Uses DNA analysis to assess biological relationships between siblings, aunts, uncles and other relatives. It can be used for inheritance or documentation matters, or to clarify family history. Samples are collected with a painless cheek swab.'
    ),
    tags: ['kinship', 'dna-test'],
  },
  {
    row: 51,
    n: L('HLA-B27', 'HLA-B27', 'HLA-B27'),
    d: L(
      'Ankilozlaşdırıcı spondilit (Bexterev xəstəliyi) və əlaqəli iltihabi oynaq və göz xəstəlikləri ilə əlaqəli HLA-B27 markerini yoxlayır. HLA-B27 daşıyan insanların çoxunda xəstəlik heç vaxt inkişaf etmir, buna görə nəticə simptomlarla birlikdə şərh olunur. Venadan EDTA-lı boruya qan götürülür.',
      'Выявляет маркер HLA-B27, связанный с анкилозирующим спондилитом (болезнью Бехтерева) и родственными воспалительными заболеваниями суставов и глаз. У большинства носителей HLA-B27 болезнь так и не развивается, поэтому результат оценивается вместе с симптомами. Кровь берут из вены в пробирку с ЭДТА.',
      'Checks for the HLA-B27 marker, which is associated with ankylosing spondylitis and related inflammatory joint and eye conditions. Most people with HLA-B27 never develop the disease, so the result is interpreted together with symptoms. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['hla', 'rheumatology'],
  },
  {
    row: 52,
    n: L('HLA-B51', 'HLA-B51', 'HLA-B51'),
    d: L(
      'Behçet xəstəliyi ilə əlaqəli HLA-B51 markerini yoxlayır. Təkrarlanan ağız və cinsi orqan yaraları, göz iltihabı kimi əlamətlər olduqda həkimə diaqnozu dəstəkləməyə kömək edə bilər; tək başına diaqnoz qoymur. Venadan EDTA-lı boruya qan götürülür.',
      'Выявляет маркер HLA-B51, связанный с болезнью Бехчета. При таких симптомах, как повторяющиеся язвы во рту и на половых органах или воспаление глаз, может помочь врачу подтвердить диагноз, но сам по себе диагноз не устанавливает. Кровь берут из вены в пробирку с ЭДТА.',
      "Checks for the HLA-B51 marker, which is associated with Behçet's disease. With symptoms such as recurrent mouth and genital ulcers or eye inflammation, it can support the doctor's diagnosis, but on its own it does not make a diagnosis. Blood is taken from a vein into an EDTA tube."
    ),
    tags: ['hla', 'rheumatology'],
  },
  {
    row: 53, f: true,
    n: L('HLA-A, B, C, DR, DQ lokusları (NGS)', 'Локусы HLA-A, B, C, DR, DQ (NGS)', 'HLA-A, B, C, DR, DQ loci (NGS)'),
    d: L(
      'Əsas HLA genlərinin (A, B, C, DR, DQ) NGS ilə yüksək dəqiqlikli tipləməsi. Sümük iliyi (kök hüceyrə) və ya orqan transplantasiyasında donor və resipiyentin uyğunluğunu qiymətləndirmək üçün əsas testdir; bəzi immun xəstəliklərlə əlaqəni araşdırmaqda da istifadə olunur. Venadan EDTA-lı boruya qan götürülür.',
      'Высокоточное типирование основных генов HLA (A, B, C, DR, DQ) методом NGS. Основной тест для оценки совместимости донора и реципиента при трансплантации костного мозга (стволовых клеток) или органов; также применяется для изучения связи с некоторыми иммунными заболеваниями. Кровь берут из вены в пробирку с ЭДТА.',
      'High-resolution NGS typing of the main HLA genes (A, B, C, DR, DQ). It is the key test for matching donors and recipients for bone marrow (stem cell) or organ transplantation, and is also used to study links with certain immune conditions. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['hla-typing', 'transplant', 'ngs'],
  },
  {
    row: 54,
    n: L('HLA-B qrupları (HLA-B5, B27, B51, B52, B57) – HLA-B geni (NGS)', 'Группы HLA-B (HLA-B5, B27, B51, B52, B57) — ген HLA-B (NGS)', 'HLA-B groups (HLA-B5, B27, B51, B52, B57) – HLA-B gene (NGS)'),
    d: L(
      'HLA-B genində klinik əhəmiyyətli qrupları bir testdə yoxlayır: B27 (spondiloartritlər), B5/B51 (Behçet xəstəliyi), B52 və B57 (bəzi dərmanlara, məsələn abakavirə qarşı həssaslıq riski ilə əlaqəli). Nəticə simptomlar və həkimin qiymətləndirməsi ilə birlikdə şərh olunur. Venadan EDTA-lı boruya qan götürülür.',
      'За один тест выявляет клинически значимые группы гена HLA-B: B27 (спондилоартриты), B5/B51 (болезнь Бехчета), B52 и B57 (связан с риском гиперчувствительности к некоторым лекарствам, например абакавиру). Результат оценивается вместе с симптомами и заключением врача. Кровь берут из вены в пробирку с ЭДТА.',
      "Checks clinically important HLA-B groups in one test: B27 (spondyloarthritis), B5/B51 (Behçet's disease), B52, and B57 (linked to hypersensitivity risk with certain medicines such as abacavir). The result is interpreted together with symptoms and the doctor's assessment. Blood is taken from a vein into an EDTA tube."
    ),
    tags: ['hla', 'ngs'],
  },
  hlaLocus(56, 'HLA-A'), hlaLocus(57, 'HLA-B'), hlaLocus(58, 'HLA-C'), hlaLocus(59, 'HLA-DR'), hlaLocus(60, 'HLA-DQ'),
  hlaLocus(61, 'HLA-DQA1', true), hlaLocus(62, 'HLA-DQB1', true), hlaLocus(63, 'HLA-DRB1', true), hlaLocus(64, 'HLA-DRB3', true),
  hlaLocus(65, 'HLA-DRB4', true), hlaLocus(66, 'HLA-DRB5', true), hlaLocus(67, 'HLA-DPA1, DPB1', true),
  {
    row: 68,
    n: L('Orqan donorluğu üçün HLA uyğunluğu (tam panel)', 'HLA-совместимость для донорства органов (полная панель)', 'HLA compatibility for organ donation (full panel)'),
    d: L(
      'Orqan transplantasiyasından öncə donor və resipiyentin HLA uyğunluğunu qiymətləndirmək üçün bütün əsas HLA lokuslarının NGS ilə tam tipləməsi. Nəticə transplantasiya komandasına ən uyğun donoru seçməyə kömək edir. Adətən həm donordan, həm resipiyentdən venoz qan (EDTA-lı boru) götürülür.',
      'Полное типирование всех основных локусов HLA методом NGS для оценки совместимости донора и реципиента перед трансплантацией органа. Результат помогает трансплантационной команде выбрать наиболее подходящего донора. Обычно венозную кровь (пробирка с ЭДТА) берут и у донора, и у реципиента.',
      'Complete NGS typing of all major HLA loci to assess donor–recipient compatibility before organ transplantation. The result helps the transplant team choose the most suitable donor. Venous blood (EDTA tube) is usually taken from both the donor and the recipient.'
    ),
    tags: ['hla-typing', 'transplant', 'ngs'],
  },
  {
    row: 287, f: true,
    n: L('Epilepsiya', 'Эпилепсия', 'Epilepsy'),
    d: L(
      'Epilepsiya ilə əlaqəli 583 geni NGS ilə eyni anda araşdıran geniş paneldir. Erkən yaşda başlayan, dərmanlara çətin cavab verən və ya inkişaf problemləri ilə müşayiət olunan qıcolmalarda tövsiyə oluna bilər. Genetik səbəbin tapılması bəzən dərman seçiminə birbaşa təsir edir və ailə üçün təkrarlanma riskini aydınlaşdırır. Venadan EDTA-lı boruya qan götürülür.',
      'Расширенная панель, которая методом NGS одновременно исследует 583 гена, связанных с эпилепсией. Может быть рекомендована при судорогах, начавшихся в раннем возрасте, плохо поддающихся лечению или сопровождающихся нарушениями развития. Выявление генетической причины иногда напрямую влияет на выбор препарата и помогает оценить риск повторения в семье. Кровь берут из вены в пробирку с ЭДТА.',
      'A broad panel that uses NGS to examine 583 epilepsy-related genes at once. It may be recommended for seizures that start early in life, respond poorly to medication or come with developmental problems. Finding a genetic cause can sometimes directly guide the choice of medication and clarify the chance of recurrence in the family. Blood is taken from a vein into an EDTA tube.'
    ),
    tags: ['epilepsy', 'ngs', 'gene-panel'],
  },
  {
    row: 295, f: true,
    n: L('Geniş nevroloji panel', 'Расширенная неврологическая панель', 'Comprehensive neurology panel'),
    d: L(
      'Sinir sistemi xəstəlikləri ilə əlaqəli 2000 geni bir testdə araşdıran ən geniş nevroloji paneldir. Simptomlar bir neçə xəstəlik qrupuna uyğun gəldikdə və ya əvvəlki testlər diaqnoz vermədikdə faydalıdır. Venadan EDTA-lı boruya qan götürülür. Nəticələr nevroloq və ya genetik məsləhətçi ilə birlikdə şərh edilməlidir.',
      'Самая широкая неврологическая панель: за один тест исследуются 2000 генов, связанных с заболеваниями нервной системы. Полезна, когда симптомы подходят под несколько групп заболеваний или предыдущие тесты не дали диагноза. Кровь берут из вены в пробирку с ЭДТА. Результаты следует обсуждать с неврологом или врачом-генетиком.',
      'The broadest neurology panel, examining 2,000 genes linked to nervous system conditions in a single test. It is useful when symptoms overlap several disease groups or earlier tests have not given a diagnosis. Blood is taken from a vein into an EDTA tube. Results should be interpreted with a neurologist or genetic counselor.'
    ),
    tags: ['neurology', 'ngs', 'gene-panel', 'comprehensive'],
  },
  {
    row: 298, f: true,
    n: L('İnkişaf ləngiməsi, əqli inkişaf geriliyi və autizm spektri pozuntuları', 'Задержка развития, нарушения интеллектуального развития и расстройства аутистического спектра', 'Developmental delay, intellectual disability and autism spectrum disorders'),
    d: L(
      'Uşaqlarda inkişaf ləngiməsi, əqli inkişaf geriliyi və autizm spektri pozuntuları ilə əlaqəli 229 geni araşdırır. Genetik səbəbin tapılması uşağın ehtiyaclarını daha yaxşı anlamağa, digər orqanların vaxtında müayinəsini planlamağa və ailə üçün təkrarlanma riskini qiymətləndirməyə kömək edir. Xromosom mikroarray ilə birlikdə və ya ondan sonra tövsiyə oluna bilər. Venadan EDTA-lı boruya qan götürülür.',
      'Исследует 229 генов, связанных с задержкой развития, нарушениями интеллектуального развития и расстройствами аутистического спектра у детей. Поиск генетической причины помогает лучше понять потребности ребёнка, своевременно обследовать другие органы и оценить риск повторения в семье. Может быть рекомендована вместе с хромосомным микроматричным анализом или после него. Кровь берут из вены в пробирку с ЭДТА.',
      "Examines 229 genes linked to developmental delay, intellectual disability and autism spectrum disorders in children. Finding a genetic cause helps families better understand their child's needs, plan timely checks of other organs and estimate the chance of recurrence. It may be recommended together with or after a chromosomal microarray. Blood is taken from a vein into an EDTA tube."
    ),
    tags: ['autism', 'developmental-delay', 'ngs', 'gene-panel'],
  },
]

// ---------------------------------------------------------------------------
// ONKO: entries by item number (#). x = explanation override, 'genes' uses col C.
// ---------------------------------------------------------------------------
const OT = {
  heredPanel: (focus) => L(
    `${focus.az} ilə əlaqəli genlərdə irsi (anadangəlmə) dəyişiklikləri NGS ilə araşdırır. Ailədə bu xərçəng növləri, erkən yaşda xərçəng və ya bir neçə xərçəng halı olduqda tövsiyə oluna bilər; nəticə müayinə, profilaktika və bəzən müalicə seçimlərini planlamağa kömək edir. ${EDTA_S.az}`,
    `Методом NGS исследует наследственные (врождённые) изменения в генах, связанных с ${focus.ru}. Может быть рекомендована при случаях этих видов рака в семье, раке в молодом возрасте или нескольких онкологических заболеваниях; результат помогает спланировать обследование, профилактику, а иногда и лечение. ${EDTA_S.ru}`,
    `Uses NGS to look for inherited (germline) changes in genes linked to ${focus.en}. It may be recommended when relatives have had these cancers, cancer occurred at a young age or there have been several cancers in the family; the result helps plan screening, prevention and sometimes treatment. ${EDTA_S.en}`
  ),
  somatic: (gene, use, sampleKey = 'ffpe') => L(
    `Şiş hüceyrələrində ${gene} ${gene.includes(',') ? 'genlərində' : 'genində'} dəyişiklikləri (mutasiyaları) axtarır. ${use.az} ${SAMPLES[sampleKey].s.az}`,
    `Выявляет изменения (мутации) ${gene.includes(',') ? 'в генах' : 'в гене'} ${gene} в клетках опухоли. ${use.ru} ${SAMPLES[sampleKey].s.ru}`,
    `Looks for changes (mutations) in the ${gene} ${gene.includes(',') ? 'genes' : 'gene'} in tumour cells. ${use.en} ${SAMPLES[sampleKey].s.en}`
  ),
  heme: (what, use) => L(
    `${what.az} ${use.az} ${SAMPLES.blood_bm.s.az}`,
    `${what.ru} ${use.ru} ${SAMPLES.blood_bm.s.ru}`,
    `${what.en} ${use.en} ${SAMPLES.blood_bm.s.en}`
  ),
}

const TARGETED = L(
  'Nəticə onkoloqa hədəfə yönəlmiş müalicənin uyğunluğunu qiymətləndirməyə kömək edir.',
  'Результат помогает онкологу оценить целесообразность таргетной терапии.',
  'The result helps your oncologist decide whether targeted treatment may be suitable.'
)
const LEUK_FOLLOW = L(
  'Nəticə diaqnozu dəqiqləşdirməyə, müalicəni seçməyə və müalicəyə cavabı izləməyə kömək edir.',
  'Результат помогает уточнить диагноз, выбрать лечение и контролировать ответ на терапию.',
  'The result helps refine the diagnosis, choose treatment and monitor response to therapy.'
)
const translocation = (tr, fusion, disease) => ({
  n: L(`${tr} ${fusion} translokasiyasının molekulyar analizi`, `Молекулярный анализ транслокации ${tr} ${fusion}`, `Molecular analysis of ${tr} ${fusion} translocation`),
  d: OT.heme(
    L(`Leykemiya hüceyrələrində ${fusion} birləşmə geninin (${tr}) olub-olmadığını yoxlayır; bu dəyişiklik ${disease.az} üçün xarakterikdir.`,
      `Определяет наличие гибридного гена ${fusion} (${tr}) в опухолевых клетках крови; это изменение характерно для ${disease.ru}.`,
      `Checks leukaemia cells for the ${fusion} fusion gene (${tr}), a change characteristic of ${disease.en}.`),
    LEUK_FOLLOW),
  m: 'rtpcr',
})

const ONKO = {
  1: { n: L('İrsi prostat xərçəngi paneli', 'Панель наследственного рака предстательной железы', 'Hereditary prostate cancer panel'), c: 12, d: OT.heredPanel(L('prostat xərçəngi', 'раком предстательной железы', 'prostate cancer')), m: 'ngs', x: 'genes' },
  2: { n: L('İrsi döş və yumurtalıq xərçəngi paneli', 'Панель наследственного рака молочной железы и яичников', 'Hereditary breast and ovarian cancer panel'), c: 25, f: true, d: OT.heredPanel(L('döş və yumurtalıq xərçəngi', 'раком молочной железы и яичников', 'breast and ovarian cancer')), m: 'ngs', x: 'genes' },
  3: { n: L('İrsi kolorektal (yoğun bağırsaq) xərçəngi paneli', 'Панель наследственного колоректального рака', 'Hereditary colorectal cancer panel'), c: 23, d: OT.heredPanel(L('yoğun bağırsaq (kolorektal) xərçəngi və Linç sindromu', 'колоректальным раком и синдромом Линча', 'colorectal cancer and Lynch syndrome')), m: 'ngs', x: 'genes' },
  4: { n: L('GenPRIME irsi xərçəng paneli', 'Панель наследственного рака GenPRIME', 'GenPRIME hereditary cancer panel'), c: 160, d: OT.heredPanel(L('müxtəlif irsi xərçəng sindromları', 'различными наследственными онкологическими синдромами', 'a wide range of hereditary cancer syndromes')), m: 'ngs' },
  5: { n: L('GenPLUS irsi xərçəng paneli', 'Панель наследственного рака GenPLUS', 'GenPLUS hereditary cancer panel'), c: 360, d: OT.heredPanel(L('irsi xərçəng meylliliyi (ən geniş seçim)', 'наследственной предрасположенностью к раку (самый широкий вариант)', 'hereditary cancer predisposition (our broadest option)')), m: 'ngs' },
  6: {
    n: L('Genliquid maye biopsiya – hərtərəfli genomik profil (441 gen)', 'Жидкостная биопсия Genliquid — комплексное геномное профилирование (441 ген)', 'Genliquid liquid biopsy – comprehensive genomic profiling (441 genes)'), f: true, m: 'ngs',
    d: L(
      'Qanda dövr edən şiş DNT-si (ctDNT) 441 gendə araşdırılır – toxuma biopsiyası mümkün olmadıqda və ya əlavə məlumat lazım olduqda şişin genetik profilini qeyri-invaziv şəkildə əldə etməyə imkan verir. Nəticə hədəfə yönəlmiş müalicə və immunoterapiya seçimlərinə, qalıq xəstəliyin izlənməsinə və mənşəyi bilinməyən şişlərin qiymətləndirilməsinə kömək edə bilər. Yalnız qan nümunəsi lazımdır: venadan 2 xüsusi Streck borusuna qan götürülür.',
      'Исследуется циркулирующая опухолевая ДНК (цДНК) в крови по 441 гену — это позволяет неинвазивно получить генетический профиль опухоли, когда тканевая биопсия невозможна или нужна дополнительная информация. Результат может помочь в выборе таргетной и иммунотерапии, мониторинге остаточной болезни и оценке опухолей невыясненной первичной локализации. Нужен только образец крови: из вены берут кровь в 2 специальные пробирки Streck.',
      'Circulating tumour DNA (ctDNA) in the blood is analysed across 441 genes, giving a non-invasive genetic profile of the tumour when a tissue biopsy is not possible or more information is needed. Results can help guide targeted therapy and immunotherapy, monitor residual disease and assess cancers of unknown primary. Only a blood sample is needed: blood is drawn from a vein into two special Streck tubes.'
    ),
    x: L('441 gen: qeyri-adi splaysinq, gen birləşmələri (füzyonlar), nüsxə sayı dəyişiklikləri (CNV), nöqtəvi mutasiyalar (SNV), kiçik insersiya/delesiyalar, şiş mutasiya yükü (TMB), mikrosatellit qeyri-sabitliyi (MSI); minimal qalıq xəstəlik (MRD) və mənşəyi bilinməyən şiş (CUP) üçün tətbiq oluna bilər.',
      '441 ген: аномальный сплайсинг, слияния генов (фьюжны), вариации числа копий (CNV), точечные мутации (SNV), небольшие вставки/делеции, мутационная нагрузка опухоли (TMB), микросателлитная нестабильность (MSI); применимо для мониторинга минимальной остаточной болезни (MRD) и при опухолях невыясненной первичной локализации (CUP).',
      '441 genes: unusual splicing, gene fusions, copy-number variants (CNV), point mutations (SNV), small insertions/deletions, tumour mutational burden (TMB), microsatellite instability (MSI); applicable to minimal residual disease (MRD) monitoring and cancer of unknown primary (CUP).'),
  },
  7: {
    n: L('Genliquid ctDNT pan-xərçəng paneli (OncoSELECT, 74 gen)', 'Пан-онкологическая панель цДНК Genliquid (OncoSELECT, 74 гена)', 'Genliquid ctDNA pan-cancer panel (OncoSELECT, 74 genes)'), m: 'ngs',
    d: L(
      'Qanda dövr edən şiş DNT-sində müalicə baxımından ən əhəmiyyətli 74 gen, həmçinin MSI, TERT promotoru və HRR genləri araşdırılır. Toxuma nümunəsi olmadıqda və ya müalicə zamanı şişin dəyişikliklərini izləmək lazım olduqda onkoloqa hədəfə yönəlmiş müalicəni seçməyə kömək edir. Yalnız qan nümunəsi lazımdır: venadan 2 xüsusi Streck borusuna qan götürülür.',
      'В циркулирующей опухолевой ДНК исследуются 74 наиболее значимых для лечения гена, а также MSI, промотор TERT и гены HRR. Помогает онкологу выбрать таргетную терапию, когда ткани нет или нужно отслеживать изменения опухоли во время лечения. Нужен только образец крови: из вены берут кровь в 2 специальные пробирки Streck.',
      'Circulating tumour DNA is analysed for 74 of the most treatment-relevant genes, plus MSI, the TERT promoter and HRR genes. It helps your oncologist choose targeted treatment when tissue is not available or when tumour changes need monitoring during therapy. Only a blood sample is needed: blood is drawn from a vein into two special Streck tubes.'
    ),
    x: L('74 gen, MSI, SNV, insersiya/delesiyalar, TERT promotoru, qeyri-adi splaysinq, füzyonlar, CNV və HRR genləri.',
      '74 гена, MSI, SNV, вставки/делеции, промотор TERT, аномальный сплайсинг, фьюжны, CNV и гены HRR.',
      '74 genes, MSI, SNVs, insertions/deletions, TERT promoter, unusual splicing, fusions, CNVs and HRR genes.'),
  },
  8: {
    n: L('Mikrosatellit qeyri-sabitliyi (MSI) analizi', 'Анализ микросателлитной нестабильности (MSI)', 'Microsatellite instability (MSI) analysis'), m: 'fragment',
    d: L(
      'Şiş toxumasını normal qan DNT-si ilə müqayisə edərək mikrosatellit qeyri-sabitliyini (MSI) müəyyən edir. MSI nəticəsi immunoterapiyaya cavab ehtimalını qiymətləndirməyə və Linç sindromu şübhəsini aydınlaşdırmağa kömək edir. Həm şiş toxuması (parafin blok), həm də EDTA-lı boruda qan nümunəsi tələb olunur.',
      'Сравнивая ДНК опухоли с нормальной ДНК крови, тест определяет микросателлитную нестабильность (MSI). Результат MSI помогает оценить вероятность ответа на иммунотерапию и прояснить подозрение на синдром Линча. Нужны и ткань опухоли (парафиновый блок), и образец крови в пробирке с ЭДТА.',
      'Compares tumour DNA with normal blood DNA to determine microsatellite instability (MSI). The MSI result helps estimate the likelihood of response to immunotherapy and clarifies any suspicion of Lynch syndrome. Both tumour tissue (paraffin block) and a blood sample in an EDTA tube are needed.'
    ),
    x: null,
  },
  9: {
    n: L('OncoHRD (BRCA1/2 + HRR genləri + GIS və HRD skoru)', 'OncoHRD (BRCA1/2 + гены HRR + GIS и оценка HRD)', 'OncoHRD (BRCA1/2 + HRR genes + GIS & HRD score)'), m: 'ngs_hrd',
    d: L(
      'Şişin homoloji rekombinasiya çatışmazlığını (HRD) qiymətləndirir: BRCA1/2 və digər HRR genlərini, həmçinin genomik qeyri-sabitlik skorunu (GIS) araşdırır. Nəticə yumurtalıq, döş, prostat və mədəaltı vəz xərçənglərində PARP inhibitorları kimi müalicələrin uyğunluğunu qiymətləndirməyə kömək edir. Şiş toxuması (parafin blok) və ya toxuma olmadıqda 2 Streck borusunda qan istifadə oluna bilər.',
      'Оценивает дефицит гомологичной рекомбинации (HRD) в опухоли: исследует BRCA1/2 и другие гены HRR, а также индекс геномной нестабильности (GIS). Результат помогает оценить целесообразность терапии, например ингибиторами PARP, при раке яичников, молочной железы, простаты и поджелудочной железы. Используется ткань опухоли (парафиновый блок), а при её отсутствии — кровь в 2 пробирках Streck.',
      'Assesses homologous recombination deficiency (HRD) in the tumour by analysing BRCA1/2 and other HRR genes together with a genomic instability score (GIS). The result helps assess whether treatments such as PARP inhibitors may be suitable in ovarian, breast, prostate and pancreatic cancers. Tumour tissue (paraffin block) or, if not available, blood in two Streck tubes can be used.'
    ),
    x: null,
  },
  10: {
    n: L('Ağciyər xərçəngi paneli (real-time PZR: EGFR, ALK, ROS1) + PD-L1 (İHK)', 'Панель рака лёгкого (ПЦР в реальном времени: EGFR, ALK, ROS1) + PD-L1 (ИГХ)', 'Lung cancer panel (real-time PCR: EGFR, ALK, ROS1) + PD-L1 (IHC)'), m: 'rtpcr_ihc',
    d: L(
      'Qeyri-kiçik hüceyrəli ağciyər xərçəngində müalicə seçimi üçün əsas markerləri bir testdə yoxlayır: EGFR mutasiyaları, ALK və ROS1 gen birləşmələri və immunoterapiya üçün PD-L1 ifadəsi. Nəticə onkoloqa hədəfə yönəlmiş müalicə və ya immunoterapiyanı seçməyə kömək edir. ' + SAMPLES.ffpe.s.az,
      'За один тест проверяет ключевые маркеры для выбора лечения при немелкоклеточном раке лёгкого: мутации EGFR, слияния генов ALK и ROS1 и экспрессию PD-L1 для иммунотерапии. Результат помогает онкологу выбрать таргетную терапию или иммунотерапию. ' + SAMPLES.ffpe.s.ru,
      'Checks the key markers for treatment choice in non-small cell lung cancer in one test: EGFR mutations, ALK and ROS1 gene fusions and PD-L1 expression for immunotherapy. The result helps your oncologist choose targeted therapy or immunotherapy. ' + SAMPLES.ffpe.s.en
    ),
    x: L('Hot-spot mutasiyalar / füzyonlar (EGFR, ALK, ROS1) + PD-L1 (İHK).', 'Горячие точки мутаций / фьюжны (EGFR, ALK, ROS1) + PD-L1 (ИГХ).', 'Hotspot mutations / fusions (EGFR, ALK, ROS1) + PD-L1 (IHC).'),
  },
  11: {
    n: L('GENONCO PLUS (OncoDEEP) – 638 DNT geni + 22 RNT füzyon geni', 'GENONCO PLUS (OncoDEEP) — 638 генов ДНК + 22 гена слияния РНК', 'GENONCO PLUS (OncoDEEP) – 638 DNA genes + 22 RNA fusion genes'), m: 'ngs',
    d: L(
      'Şiş toxumasının ən hərtərəfli genomik profilidir: 638 gen DNT səviyyəsində, 22 füzyon geni isə RNT səviyyəsində araşdırılır, həmçinin HRD skoru, MSI və TMB müəyyən edilir. Nəticə onkoloqa hədəfə yönəlmiş müalicə, immunoterapiya və klinik tədqiqat imkanlarını qiymətləndirməyə kömək edir. ' + SAMPLES.ffpe.s.az,
      'Наиболее полное геномное профилирование опухоли: 638 генов исследуются на уровне ДНК и 22 гена слияния — на уровне РНК, дополнительно определяются HRD, MSI и TMB. Результат помогает онкологу оценить возможности таргетной терапии, иммунотерапии и участия в клинических исследованиях. ' + SAMPLES.ffpe.s.ru,
      'The most comprehensive genomic profile of tumour tissue: 638 genes are analysed at DNA level and 22 fusion genes at RNA level, with HRD score, MSI and TMB. The result helps your oncologist assess options for targeted therapy, immunotherapy and clinical trials. ' + SAMPLES.ffpe.s.en
    ),
    x: L('638 DNT geni və 22 RNT füzyon geni: SNV, insersiya, delesiya, CNV, füzyonlar, qeyri-adi splaysinq, HRD skoru, MSI və TMB.',
      '638 генов ДНК и 22 гена слияния РНК: SNV, вставки, делеции, CNV, фьюжны, аномальный сплайсинг, оценка HRD, MSI и TMB.',
      '638 DNA genes and 22 RNA fusion genes: SNVs, insertions, deletions, CNVs, fusions, unusual splicing, HRD score, MSI and TMB.'),
  },
  12: {
    n: L('GENONCO PLUS + PD-L1 (İHK)', 'GENONCO PLUS + PD-L1 (ИГХ)', 'GENONCO PLUS + PD-L1 (IHC)'), f: true, m: 'ngs_ihc',
    d: L(
      'GENONCO PLUS (OncoDEEP) hərtərəfli genomik profili immunoterapiya üçün PD-L1 ifadəsinin immunohistokimyəvi qiymətləndirilməsi ilə birləşdirir. Bu, onkoloqa həm hədəfə yönəlmiş müalicə, həm də immunoterapiya imkanlarını bir analizlə görməyə imkan verir. ' + SAMPLES.ffpe.s.az,
      'Объединяет комплексное геномное профилирование GENONCO PLUS (OncoDEEP) с иммуногистохимической оценкой экспрессии PD-L1 для иммунотерапии. Это позволяет онкологу за одно исследование увидеть возможности и таргетной, и иммунотерапии. ' + SAMPLES.ffpe.s.ru,
      'Combines the GENONCO PLUS (OncoDEEP) comprehensive genomic profile with immunohistochemical PD-L1 testing for immunotherapy. This lets your oncologist see both targeted-therapy and immunotherapy options from a single analysis. ' + SAMPLES.ffpe.s.en
    ),
    x: L('638 DNT geni və 22 RNT füzyon geni (OncoDEEP) + PD-L1 (İHK).', '638 генов ДНК и 22 гена слияния РНК (OncoDEEP) + PD-L1 (ИГХ).', '638 DNA genes and 22 RNA fusion genes (OncoDEEP) + PD-L1 (IHC).'),
  },
  13: { n: L('BRCA1, BRCA2 – şiş toxumasında (somatik) analiz', 'BRCA1, BRCA2 — анализ в ткани опухоли (соматический)', 'BRCA1, BRCA2 – tumour (somatic) analysis'), m: 'ngs', d: OT.somatic('BRCA1, BRCA2', L('Nəticə yumurtalıq, döş, prostat və mədəaltı vəz xərçəngində PARP inhibitorları ilə müalicənin uyğunluğunu qiymətləndirməyə kömək edir.', 'Результат помогает оценить целесообразность лечения ингибиторами PARP при раке яичников, молочной железы, простаты и поджелудочной железы.', 'The result helps assess suitability for PARP inhibitor treatment in ovarian, breast, prostate and pancreatic cancer.')) },
  14: { n: L('BRCA1, BRCA2 – somatik + germinal analiz + MLPA', 'BRCA1, BRCA2 — соматический + герминальный анализ + MLPA', 'BRCA1, BRCA2 – somatic + germline analysis + MLPA'), m: 'ngs_mlpa',
    d: L(
      'BRCA1 və BRCA2 genləri həm şiş toxumasında, həm də qanda araşdırılır, MLPA ilə böyük gen itkiləri də yoxlanılır. Bu, dəyişikliyin yalnız şişdə olduğunu və ya irsi olduğunu müəyyən etməyə imkan verir – bu həm müalicə (PARP inhibitorları), həm də ailə üzvlərinin riski üçün önəmlidir. ' + SAMPLES.ffpe_plus_blood.s.az,
      'Гены BRCA1 и BRCA2 исследуются и в ткани опухоли, и в крови, дополнительно методом MLPA выявляются крупные делеции. Это позволяет понять, есть ли изменение только в опухоли или оно наследственное, — что важно и для лечения (ингибиторы PARP), и для оценки риска у родственников. ' + SAMPLES.ffpe_plus_blood.s.ru,
      'BRCA1 and BRCA2 are analysed in both tumour tissue and blood, with MLPA to detect large deletions. This shows whether a change is only in the tumour or inherited – important both for treatment (PARP inhibitors) and for relatives\' risk. ' + SAMPLES.ffpe_plus_blood.s.en
    ) },
  15: { n: L('Oncotype (klinik hesabat)', 'Oncotype (клиническое заключение)', 'Oncotype (clinical report)'), m: 'ngs',
    d: L(
      'Döş xərçənginin bəzi erkən mərhələli növlərində şiş toxumasında genlərin aktivliyini qiymətləndirən testdir. Nəticə xəstəliyin təkrarlanma riskini və kimyaterapiyanın əlavə fayda verib-vermədiyini qiymətləndirməyə kömək edir. ' + SAMPLES.ffpe.s.az,
      'Тест, оценивающий активность генов в ткани опухоли при некоторых типах рака молочной железы на ранней стадии. Результат помогает оценить риск рецидива и то, принесёт ли химиотерапия дополнительную пользу. ' + SAMPLES.ffpe.s.ru,
      'A test that measures gene activity in tumour tissue for certain types of early-stage breast cancer. The result helps estimate the risk of recurrence and whether chemotherapy is likely to add benefit. ' + SAMPLES.ffpe.s.en
    ) },
  16: { n: L('BRCA1, BRCA2 – germinal (irsi) analiz', 'BRCA1, BRCA2 — герминальный (наследственный) анализ', 'BRCA1, BRCA2 – germline (inherited) analysis'), f: true, m: 'ngs', d: OT.heredPanel(L('döş, yumurtalıq, prostat və mədəaltı vəz xərçəngi (BRCA1 və BRCA2)', 'раком молочной железы, яичников, простаты и поджелудочной железы (BRCA1 и BRCA2)', 'breast, ovarian, prostate and pancreatic cancer (BRCA1 and BRCA2)')) },
  17: { n: L('BRCA1, BRCA2 – MLPA (germinal)', 'BRCA1, BRCA2 — MLPA (герминальный)', 'BRCA1, BRCA2 – MLPA (germline)'), m: 'mlpa',
    d: L(
      'BRCA1 və BRCA2 genlərində sekvenləmə ilə görünməyən böyük itki və ya artımları (delesiya/duplikasiya) MLPA ilə yoxlayır. Adətən sekvens analizi normal olduqda, lakin ailə anamnezi irsi döş və ya yumurtalıq xərçənginə işarə etdikdə tövsiyə olunur. ' + EDTA_S.az,
      'Методом MLPA выявляет крупные утраты или удвоения (делеции/дупликации) в генах BRCA1 и BRCA2, которые не видны при секвенировании. Обычно рекомендуется, если секвенирование не выявило изменений, но семейная история указывает на наследственный рак молочной железы или яичников. ' + EDTA_S.ru,
      'Uses MLPA to detect large deletions or duplications in BRCA1 and BRCA2 that sequencing cannot see. It is usually recommended when sequencing is normal but family history still suggests hereditary breast or ovarian cancer. ' + EDTA_S.en
    ) },
  18: { n: L('BRCA1, BRCA2 – NGS + MLPA (germinal)', 'BRCA1, BRCA2 — NGS + MLPA (герминальный)', 'BRCA1, BRCA2 – NGS + MLPA (germline)'), m: 'ngs_mlpa',
    d: L(
      'BRCA1 və BRCA2 genlərinin ən tam irsi analizidir: NGS kiçik dəyişiklikləri, MLPA isə böyük itki və artımları aşkarlayır. Ailədə döş, yumurtalıq, prostat və ya mədəaltı vəz xərçəngi olduqda tövsiyə oluna bilər; nəticə müayinə, profilaktika və müalicəni planlamağa kömək edir. ' + EDTA_S.az,
      'Наиболее полный анализ наследственных изменений BRCA1 и BRCA2: NGS выявляет мелкие изменения, а MLPA — крупные делеции и дупликации. Может быть рекомендован при раке молочной железы, яичников, простаты или поджелудочной железы в семье; результат помогает спланировать обследование, профилактику и лечение. ' + EDTA_S.ru,
      'The most complete inherited analysis of BRCA1 and BRCA2: NGS detects small changes and MLPA detects large deletions and duplications. It may be recommended when relatives have had breast, ovarian, prostate or pancreatic cancer; the result helps plan screening, prevention and treatment. ' + EDTA_S.en
    ) },
  19: { n: L('KRAS, BRAF, NRAS (3 gen)', 'KRAS, BRAF, NRAS (3 гена)', 'KRAS, BRAF, NRAS (3 genes)'), m: 'ngs', d: OT.somatic('KRAS, BRAF, NRAS', L('Bu genlər xüsusilə kolorektal xərçəngdə anti-EGFR müalicəsinin seçimi üçün önəmlidir və melanoma, ağciyər xərçəngi kimi digər şişlərdə də hədəfə yönəlmiş müalicəyə təsir edə bilər.', 'Эти гены особенно важны для выбора анти-EGFR терапии при колоректальном раке и могут влиять на таргетное лечение при других опухолях, например меланоме и раке лёгкого.', 'These genes are especially important for choosing anti-EGFR therapy in colorectal cancer and can also influence targeted treatment in other tumours such as melanoma and lung cancer.')) },
  20: { n: L('KRAS (klinik hesabat)', 'KRAS (клиническое заключение)', 'KRAS (clinical report)'), m: 'ngs', d: OT.somatic('KRAS', L('Nəticə kolorektal, ağciyər və mədəaltı vəz xərçəngində müalicə seçimi üçün önəmlidir.', 'Результат важен для выбора лечения при колоректальном раке, раке лёгкого и поджелудочной железы.', 'The result matters for treatment choice in colorectal, lung and pancreatic cancer.')) },
  21: { n: L('NRAS (klinik hesabat)', 'NRAS (клиническое заключение)', 'NRAS (clinical report)'), m: 'ngs', d: OT.somatic('NRAS', L('Nəticə kolorektal xərçəng və melanomada müalicə seçimi üçün önəmlidir.', 'Результат важен для выбора лечения при колоректальном раке и меланоме.', 'The result matters for treatment choice in colorectal cancer and melanoma.')) },
  22: { n: L('BRAF (klinik hesabat)', 'BRAF (клиническое заключение)', 'BRAF (clinical report)'), m: 'ngs', d: OT.somatic('BRAF', L('BRAF dəyişiklikləri melanoma, kolorektal, ağciyər və qalxanabənzər vəz xərçənglərində hədəfə yönəlmiş müalicəyə təsir edə bilər.', 'Изменения BRAF могут влиять на таргетное лечение при меланоме, колоректальном раке, раке лёгкого и щитовидной железы.', 'BRAF changes can influence targeted treatment in melanoma and colorectal, lung and thyroid cancer.')) },
  23: { n: L('POLE (klinik hesabat)', 'POLE (клиническое заключение)', 'POLE (clinical report)'), m: 'ngs', d: OT.somatic('POLE', L('POLE dəyişiklikləri xüsusilə endometrium və kolorektal xərçəngdə proqnozun qiymətləndirilməsi və müalicənin planlanması üçün önəmlidir.', 'Изменения POLE особенно важны для оценки прогноза и планирования лечения при раке эндометрия и колоректальном раке.', 'POLE changes are especially important for prognosis and treatment planning in endometrial and colorectal cancer.')) },
  24: { n: L('CTNNB1 (klinik hesabat)', 'CTNNB1 (клиническое заключение)', 'CTNNB1 (clinical report)'), m: 'ngs', d: OT.somatic('CTNNB1', L('CTNNB1 dəyişiklikləri desmoid şişlər və endometrium xərçəngi kimi bəzi şişlərin diaqnozu və proqnozunun qiymətləndirilməsinə kömək edir.', 'Изменения CTNNB1 помогают в диагностике и оценке прогноза некоторых опухолей, например десмоидных опухолей и рака эндометрия.', 'CTNNB1 changes help with diagnosis and prognosis of certain tumours, such as desmoid tumours and endometrial cancer.')) },
  25: { n: L('DPYD – 5-FU (5-fluorourasil) toksikliyi', 'DPYD — токсичность 5-ФУ (5-фторурацила)', 'DPYD – 5-FU (5-fluorouracil) toxicity'), m: 'snapshot',
    d: L(
      'DPYD genində 5-fluorourasil və kapesitabin kimi kimyaterapiya dərmanlarının parçalanmasını zəiflədən variantları yoxlayır. Bu variantları daşıyan insanlarda ciddi yan təsirlər riski yüksəkdir, buna görə test müalicədən öncə dozanın təhlükəsiz seçilməsinə kömək edir. ' + EDTA_S.az,
      'Выявляет варианты гена DPYD, замедляющие расщепление химиопрепаратов, таких как 5-фторурацил и капецитабин. У носителей этих вариантов повышен риск серьёзных побочных эффектов, поэтому тест перед лечением помогает безопасно подобрать дозу. ' + EDTA_S.ru,
      'Checks the DPYD gene for variants that slow the breakdown of chemotherapy drugs such as 5-fluorouracil and capecitabine. People with these variants have a higher risk of serious side effects, so testing before treatment helps choose a safe dose. ' + EDTA_S.en
    ),
    x: L('DPYD geni: *2A (IVS14+1G>A), *3, *4, *5A, *7, *8, *9, *10, *12, *13, M166V, R886H, D949V allelləri (SNaPshot analizi).',
      'Ген DPYD: аллели *2A (IVS14+1G>A), *3, *4, *5A, *7, *8, *9, *10, *12, *13, M166V, R886H, D949V (анализ SNaPshot).',
      'DPYD gene: *2A (IVS14+1G>A), *3, *4, *5A, *7, *8, *9, *10, *12, *13, M166V, R886H, D949V alleles (SNaPshot analysis).'),
    tags: ['pharmacogenetics'] },
  26: { n: L('MLH1 promotor bölgəsinin metilləşmə analizi', 'Анализ метилирования промотора MLH1', 'MLH1 promoter methylation analysis'), m: 'methylation',
    d: L(
      'MLH1 geninin promotor bölgəsində metilləşməni yoxlayır. MMR çatışmazlığı olan kolorektal və endometrium şişlərində bu test dəyişikliyin irsi (Linç sindromu) və ya təsadüfi olduğunu ayırd etməyə kömək edir. ' + SAMPLES.blood_or_ffpe.s.az,
      'Определяет метилирование промоторной области гена MLH1. При колоректальных опухолях и опухолях эндометрия с дефицитом MMR тест помогает отличить наследственную причину (синдром Линча) от спорадической. ' + SAMPLES.blood_or_ffpe.s.ru,
      'Checks for methylation of the MLH1 gene promoter. In MMR-deficient colorectal and endometrial tumours, it helps distinguish an inherited cause (Lynch syndrome) from a sporadic one. ' + SAMPLES.blood_or_ffpe.s.en
    ) },
  27: { n: L('MGMT metilləşmə analizi (klinik hesabat)', 'Анализ метилирования MGMT (клиническое заключение)', 'MGMT methylation analysis (clinical report)'), m: 'methylation',
    d: L(
      'Beyin şişlərində (xüsusilə qlioblastoma) MGMT geninin metilləşməsini yoxlayır. Metilləşmə temozolomid kimyaterapiyasına daha yaxşı cavabla əlaqəlidir və müalicənin planlanmasına kömək edir. ' + SAMPLES.ffpe.s.az,
      'Определяет метилирование гена MGMT в опухолях головного мозга (особенно глиобластоме). Метилирование связано с лучшим ответом на химиотерапию темозоломидом и помогает в планировании лечения. ' + SAMPLES.ffpe.s.ru,
      'Checks MGMT gene methylation in brain tumours (especially glioblastoma). Methylation is associated with a better response to temozolomide chemotherapy and helps with treatment planning. ' + SAMPLES.ffpe.s.en
    ) },
  28: { n: L('TP53 (klinik hesabat)', 'TP53 (клиническое заключение)', 'TP53 (clinical report)'), m: 'ngs', d: OT.somatic('TP53', L('TP53 dəyişiklikləri bir çox şiş növündə, o cümlədən bəzi qan xərçənglərində proqnozun qiymətləndirilməsi və müalicənin seçimi üçün əhəmiyyətlidir.', 'Изменения TP53 важны для оценки прогноза и выбора лечения при многих видах опухолей.', 'TP53 changes are important for prognosis and treatment selection in many tumour types.')) },
  29: { n: L('EGFR – real-time PZR (şiş toxuması)', 'EGFR — ПЦР в реальном времени (ткань опухоли)', 'EGFR – real-time PCR (tumour tissue)'), m: 'rtpcr', x: 'variants', d: OT.somatic('EGFR', L('Qeyri-kiçik hüceyrəli ağciyər xərçəngində EGFR inhibitorları ilə müalicənin seçimi üçün əsas testdir.', 'Ключевой тест для выбора лечения ингибиторами EGFR при немелкоклеточном раке лёгкого.', 'A key test for choosing EGFR inhibitor treatment in non-small cell lung cancer.')) },
  30: { n: L('EGFR – real-time PZR (ctDNT, qan)', 'EGFR — ПЦР в реальном времени (цДНК, кровь)', 'EGFR – real-time PCR (ctDNA, blood)'), m: 'rtpcr', x: 'variants', d: OT.somatic('EGFR', L('Toxuma olmadıqda və ya müalicə zamanı müqavimət mutasiyasını (məsələn, T790M) izləmək üçün qanda dövr edən şiş DNT-si üzərində aparılır.', 'Проводится по циркулирующей опухолевой ДНК в крови, когда ткани нет или нужно отследить мутацию резистентности (например, T790M) во время лечения.', 'It is done on circulating tumour DNA in the blood when tissue is unavailable or to monitor resistance mutations (such as T790M) during treatment.'), 'streck') },
  31: { n: L('PIK3CA – real-time PZR', 'PIK3CA — ПЦР в реальном времени', 'PIK3CA – real-time PCR'), m: 'rtpcr', x: 'variants', d: OT.somatic('PIK3CA', L('Hormon reseptoru müsbət, HER2-mənfi döş xərçəngində PI3K inhibitorları ilə müalicənin uyğunluğunu qiymətləndirməyə kömək edir.', 'Помогает оценить целесообразность лечения ингибиторами PI3K при гормон-рецептор-положительном HER2-отрицательном раке молочной железы.', 'Helps assess suitability for PI3K inhibitor treatment in hormone-receptor-positive, HER2-negative breast cancer.')) },
  32: { n: L('EML4-ALK və ROS1 füzyonları – real-time PZR', 'Слияния EML4-ALK и ROS1 — ПЦР в реальном времени', 'EML4-ALK and ROS1 fusions – real-time PCR'), m: 'rtpcr',
    d: L(
      'Ağciyər xərçəngi toxumasında ALK və ROS1 gen birləşmələrini (füzyonlarını) axtarır. Bu dəyişikliklər aşkarlandıqda xüsusi hədəfə yönəlmiş dərmanlar çox effektiv ola bilər. ' + SAMPLES.ffpe.s.az,
      'Выявляет слияния генов ALK и ROS1 в ткани рака лёгкого. При обнаружении этих изменений специальные таргетные препараты могут быть очень эффективными. ' + SAMPLES.ffpe.s.ru,
      'Looks for ALK and ROS1 gene fusions in lung cancer tissue. When these changes are found, specific targeted medicines can be highly effective. ' + SAMPLES.ffpe.s.en
    ),
    x: L('EML4-ALK genin 12 füzyon variantı və ROS1 geninin 14 füzyon variantı.', '12 вариантов слияния EML4-ALK и 14 вариантов слияния гена ROS1.', '12 EML4-ALK fusion variants and 14 ROS1 fusion variants.') },
  33: { n: L('KRAS – real-time PZR (klinik hesabat)', 'KRAS — ПЦР в реальном времени (клиническое заключение)', 'KRAS – real-time PCR (clinical report)'), m: 'rtpcr', x: 'variants', d: OT.somatic('KRAS', L('Kolorektal xərçəngdə anti-EGFR müalicəsinin seçimi və ağciyər xərçəngində KRAS G12C inhibitorlarına uyğunluq üçün önəmlidir.', 'Важен для выбора анти-EGFR терапии при колоректальном раке и оценки возможности лечения ингибиторами KRAS G12C при раке лёгкого.', 'Important for choosing anti-EGFR therapy in colorectal cancer and for eligibility for KRAS G12C inhibitors in lung cancer.')) },
  34: { n: L('NRAS – real-time PZR (klinik hesabat)', 'NRAS — ПЦР в реальном времени (клиническое заключение)', 'NRAS – real-time PCR (clinical report)'), m: 'rtpcr', x: 'variants', d: OT.somatic('NRAS', L('Kolorektal xərçəng və melanomada müalicə seçimi üçün önəmlidir.', 'Важен для выбора лечения при колоректальном раке и меланоме.', 'Important for treatment choice in colorectal cancer and melanoma.')) },
  35: { n: L('JAK2 V617F – real-time PZR (klinik hesabat)', 'JAK2 V617F — ПЦР в реальном времени (клиническое заключение)', 'JAK2 V617F – real-time PCR (clinical report)'), m: 'rtpcr', x: 'variants',
    d: OT.heme(L('JAK2 genində V617F mutasiyasını yoxlayır – bu, həqiqi polisitemiya, essensial trombositemiya və mielofibroz kimi mieloproliferativ xəstəliklərin əsas markeridir.', 'Выявляет мутацию V617F гена JAK2 — основной маркер миелопролиферативных заболеваний, таких как истинная полицитемия, эссенциальная тромбоцитемия и миелофиброз.', 'Tests the JAK2 gene for the V617F mutation – the main marker of myeloproliferative neoplasms such as polycythaemia vera, essential thrombocythaemia and myelofibrosis.'), LEUK_FOLLOW) },
  36: { n: L('BCR-ABL – real-time PZR (skrininq: p210, p190, p230)', 'BCR-ABL — ПЦР в реальном времени (скрининг: p210, p190, p230)', 'BCR-ABL – real-time PCR (screening: p210, p190, p230)'), m: 'rtpcr',
    d: OT.heme(L('Filadelfiya xromosomu ilə əlaqəli BCR-ABL1 birləşmə geninin əsas variantlarını (p210, p190, p230) bir testdə yoxlayır. Bu dəyişiklik xroniki mieloid leykemiya və bəzi kəskin limfoblast leykemiyalar üçün xarakterikdir.', 'За один тест выявляет основные варианты гибридного гена BCR-ABL1 (p210, p190, p230), связанного с филадельфийской хромосомой. Это изменение характерно для хронического миелолейкоза и некоторых острых лимфобластных лейкозов.', 'Screens in one test for the main variants (p210, p190, p230) of the BCR-ABL1 fusion gene linked to the Philadelphia chromosome, a change typical of chronic myeloid leukaemia and some acute lymphoblastic leukaemias.'), LEUK_FOLLOW) },
  ...Object.fromEntries([[37, 'p210'], [38, 'p190'], [39, 'p230']].map(([k, p]) => [k, {
    n: L(`t(9;22)(q34;q11.2) BCR-ABL ${p}`, `t(9;22)(q34;q11.2) BCR-ABL ${p}`, `t(9;22)(q34;q11.2) BCR-ABL ${p}`), m: 'rtpcr',
    d: OT.heme(L(`BCR-ABL1 birləşmə geninin ${p} variantını yoxlayır (Filadelfiya xromosomu). Xroniki mieloid leykemiya və ya kəskin limfoblast leykemiya diaqnozunu təsdiqləmək və müalicə zamanı xəstəliyin səviyyəsini izləmək üçün istifadə olunur.`, `Выявляет вариант ${p} гибридного гена BCR-ABL1 (филадельфийская хромосома). Используется для подтверждения диагноза хронического миелолейкоза или острого лимфобластного лейкоза и контроля уровня болезни на фоне лечения.`, `Tests for the ${p} variant of the BCR-ABL1 fusion gene (Philadelphia chromosome). It is used to confirm chronic myeloid leukaemia or acute lymphoblastic leukaemia and to track disease levels during treatment.`), LEUK_FOLLOW),
  }])),
  40: { n: L('JAK2 ekzon 12 mutasiya analizi', 'Анализ мутаций экзона 12 гена JAK2', 'JAK2 exon 12 mutation analysis'), m: 'pcr',
    d: OT.heme(L('JAK2 geninin 12-ci ekzonunda mutasiyaları axtarır. V617F mutasiyası tapılmadıqda həqiqi polisitemiya şübhəsini aydınlaşdırmaq üçün tövsiyə olunur.', 'Выявляет мутации в экзоне 12 гена JAK2. Рекомендуется для уточнения подозрения на истинную полицитемию, если мутация V617F не обнаружена.', 'Looks for mutations in exon 12 of the JAK2 gene. It is recommended to clarify suspected polycythaemia vera when the V617F mutation has not been found.'), LEUK_FOLLOW) },
  41: { n: L('ABL1 gen mutasiya analizi (imatinibə rezistentlik)', 'Анализ мутаций гена ABL1 (резистентность к иматинибу)', 'ABL1 gene mutation analysis (imatinib resistance)'), m: 'seq',
    d: OT.heme(L('Xroniki mieloid leykemiyada BCR-ABL1 genində imatinib və digər tirozin kinaz inhibitorlarına rezistentlik yaradan mutasiyaları axtarır.', 'Выявляет мутации в гене BCR-ABL1, вызывающие резистентность к иматинибу и другим ингибиторам тирозинкиназ при хроническом миелолейкозе.', 'Looks for mutations in BCR-ABL1 that cause resistance to imatinib and other tyrosine kinase inhibitors in chronic myeloid leukaemia.'), L('Nəticə müalicəyə cavab zəiflədikdə həkimə daha uyğun dərmanı seçməyə kömək edir.', 'Результат помогает врачу подобрать более подходящий препарат при снижении ответа на лечение.', 'The result helps your doctor choose a more suitable medicine when response to treatment weakens.')) },
  42: { n: L('AML – real-time PZR: t(15;17), t(8;21), inv(16), t(9;22) (p190, p210)', 'ОМЛ — ПЦР в реальном времени: t(15;17), t(8;21), inv(16), t(9;22) (p190, p210)', 'AML – real-time PCR: t(15;17), t(8;21), inv(16), t(9;22) (p190, p210)'), m: 'rtpcr',
    d: OT.heme(L('Kəskin mieloid leykemiyada (AML) ən çox rast gəlinən və müalicə baxımından əhəmiyyətli gen birləşmələrini bir paneldə yoxlayır: PML-RARA, RUNX1-RUNX1T1, CBFB-MYH11 və BCR-ABL1.', 'За одну панель выявляет наиболее частые и важные для лечения слияния генов при остром миелоидном лейкозе (ОМЛ): PML-RARA, RUNX1-RUNX1T1, CBFB-MYH11 и BCR-ABL1.', 'Checks in one panel for the most common, treatment-relevant gene fusions in acute myeloid leukaemia (AML): PML-RARA, RUNX1-RUNX1T1, CBFB-MYH11 and BCR-ABL1.'), LEUK_FOLLOW) },
  43: { n: L('Trombopoetin reseptoru MPL W515A/L/K/R', 'Рецептор тромбопоэтина MPL W515A/L/K/R', 'Thrombopoietin receptor MPL W515A/L/K/R'), m: 'pcr',
    d: OT.heme(L('MPL genində W515 mutasiyalarını yoxlayır. JAK2 mutasiyası tapılmadıqda essensial trombositemiya və mielofibroz diaqnozunu dəstəkləyir.', 'Выявляет мутации W515 в гене MPL. Помогает подтвердить эссенциальную тромбоцитемию и миелофиброз, если мутация JAK2 не найдена.', 'Tests the MPL gene for W515 mutations. It supports a diagnosis of essential thrombocythaemia or myelofibrosis when no JAK2 mutation is found.'), LEUK_FOLLOW) },
  44: { n: L('NPM1 gen transkriptləri', 'Транскрипты гена NPM1', 'NPM1 gene transcripts'), m: 'rtpcr',
    d: OT.heme(L('Kəskin mieloid leykemiyada NPM1 geninin mutant transkriptlərini aşkarlayır. NPM1 proqnozun qiymətləndirilməsi və müalicədən sonra minimal qalıq xəstəliyin izlənməsi üçün mühüm markerdir.', 'Выявляет мутантные транскрипты гена NPM1 при остром миелоидном лейкозе. NPM1 — важный маркер для оценки прогноза и мониторинга минимальной остаточной болезни после лечения.', 'Detects mutant NPM1 transcripts in acute myeloid leukaemia. NPM1 is an important marker for prognosis and for monitoring minimal residual disease after treatment.'), LEUK_FOLLOW) },
  45: translocation('t(15;17)(q22;q21)', 'PML-RARA', L('kəskin promiyelositar leykemiya', 'острого промиелоцитарного лейкоза', 'acute promyelocytic leukaemia')),
  46: translocation('t(12;21)(p12;q22)', 'ETV6-RUNX1 (TEL-AML1)', L('uşaqlarda kəskin limfoblast leykemiya', 'острого лимфобластного лейкоза у детей', 'childhood acute lymphoblastic leukaemia')),
  47: translocation('t(4;11)', 'KMT2A-AFF1 (MLL-AF4)', L('kəskin limfoblast leykemiyanın bəzi formaları, xüsusilə körpələrdə', 'некоторых форм острого лимфобластного лейкоза, особенно у младенцев', 'some forms of acute lymphoblastic leukaemia, especially in infants')),
  48: translocation('inv(16)(p13;q22)', 'CBFB-MYH11', L('kəskin mieloid leykemiyanın bir növü', 'одного из вариантов острого миелоидного лейкоза', 'a subtype of acute myeloid leukaemia')),
}

// ---------------------------------------------------------------------------
// Build
// ---------------------------------------------------------------------------
function readRows(file) {
  const wb = XLSX.readFile(resolve(ROOT, 'scripts', 'source', file))
  const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { header: 'A', defval: null, raw: false, blankrows: true })
  return rows.map((r, i) => {
    const o = { row: i + 1 }
    for (const k of 'ABCDEFG') o[k] = r[k] == null ? '' : String(r[k]).replace(/\s+/g, ' ').trim()
    return o
  })
}

const slug = (s) => s.toLowerCase()
  .normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/ø/g, 'o')
  .replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 72).replace(/-+$/, '')
const shortHash = (s) => createHash('sha1').update(s).digest('hex').slice(0, 6)

const analyses = []
const customByRow = Object.fromEntries(CUSTOM.map((c) => [c.row, c]))

// TAM
{
  let categoryId = null
  for (const r of readRows('TAM HAZİR PANEL.xlsx')) {
    if (r.row === 1 || !r.B) continue
    const key = normHeader(r.B)
    if (key in HEADER_MAP) {
      if (HEADER_MAP[key]) categoryId = HEADER_MAP[key]
      continue
    }
    if (!categoryId) throw new Error(`Row ${r.row} before first category`)

    const price = r.C ? Number(r.C.replace(/[^\d.]/g, '')) : null
    const geneList = looksLikeGeneList(r.D) ? parseGenes(r.D) : null
    const custom = customByRow[r.row]
    const panel = PANEL_NAMES[r.row]
    if (!custom && !panel) throw new Error(`No translation for TAM row ${r.row}: ${r.B}`)

    const methodKey = custom?.m || (geneList ? 'ngs' : METHOD_RAW[r.D] || null)
    if (r.D && !geneList && !METHOD_RAW[r.D] && !custom?.m) throw new Error(`Unknown method row ${r.row}: ${r.D}`)
    const sampleKey = custom?.s || sampleFromRaw(r.E)

    let name, description, tags, featured
    if (custom) {
      name = custom.n
      description = custom.d
      tags = custom.tags || []
      featured = !!custom.f
      const count = countFromName(r.B)
      if (count && [287, 295, 298].includes(r.row)) name = withCount(name, count)
    } else {
      const [az, ru, en, flag] = panel
      const wide = flag === 'w'
      const base = { az, ru, en }
      const count = countFromName(r.B)
      const cl = count ? countLabel(count) : null
      const suffix = (lang) => [wide ? { az: 'geniş panel', ru: 'расширенная панель', en: 'comprehensive panel' }[lang] : null, cl?.[lang]].filter(Boolean).join(', ')
      name = Object.fromEntries(['az', 'ru', 'en'].map((l) => [l, withSuffix(base[l], suffix(l))]))
      description = panelDescription({ base, count, genes: geneList, wide, categoryId, sampleKey })
      tags = ['gene-panel', ...(methodKey === 'ngs' ? ['ngs'] : []), ...(wide || (count && count.n >= 200) ? ['comprehensive'] : [])]
      featured = false
    }

    analyses.push({
      _src: `tam:${r.row}`,
      categoryId,
      name,
      description,
      priceAzn: Number.isFinite(price) && price > 0 ? Math.round(price) : null,
      method: methodKey ? METHODS[methodKey] : null,
      sampleType: sampleKey ? SAMPLES[sampleKey].t : null,
      turnaround: null,
      explanation: geneList ? genesExplanation(geneList) : null,
      tags,
      featured,
    })
  }
}

// ONKO
function parsePrice(raw) {
  if (!raw) return null
  const m = raw.replace(/\s+/g, '').match(/^([\d.,]+)(USD|EUR|EVR|EURO)$/i)
  if (!m) throw new Error(`Unparseable ONKO price: ${raw}`)
  let num = m[1]
  if (/^\d{1,3}([.,]\d{3})+$/.test(num)) num = num.replace(/[.,]/g, '')
  else num = num.replace(',', '.')
  const rate = /USD/i.test(m[2]) ? USD : EUR
  return Math.round(Number(num) * rate)
}

const normTat = (s) => s ? s.toLowerCase().replace(/\s*-\s*/g, '-').replace(/\s+/g, ' ').trim() : null

{
  let section = null
  let pending = null
  const rows = readRows('0nko BMP.xlsx')
  for (const r of rows) {
    if (r.C === 'EXPLANATION') {
      section = slug(r.B)
      pending = null
      continue
    }
    if (!r.A && !r.B && !r.C && !r.D) continue
    if (!r.A && r.B && !r.D) {
      pending = r
      continue
    }
    const num = Number(r.A)
    const entry = ONKO[num]
    if (!entry) throw new Error(`No translation for ONKO item ${num}: ${r.B}`)
    const rawName = r.B || pending?.B || ''
    const rawSample = [pending?.G, r.G].filter(Boolean).join(' ').replace(/\s*\+\s*/, ' + ')
    pending = null
    const sampleKey = sampleFromOnko(rawSample)

    const name = entry.c ? withCount(entry.n, { n: entry.c, plus: false }) : entry.n

    let explanation = null
    if (entry.x === 'genes') {
      explanation = genesExplanation(parseGenes(r.C.replace(/^\(\s*NGS\s*\)\s*-\s*/, '')))
    } else if (entry.x === 'variants') {
      const v = r.C.replace(/\s+/g, ' ').replace(/,?\s+and\s+/g, ', ').replace(/,\s*/g, ', ').trim()
      explanation = L(`Aşkarlanan variantlar: ${v}.`, `Выявляемые варианты: ${v}.`, `Variants detected: ${v}.`)
    } else if (entry.x) {
      explanation = entry.x
    }

    analyses.push({
      _src: `onko:${num}:${rawName}`,
      categoryId: 'oncology',
      name,
      description: entry.d,
      priceAzn: parsePrice(r.D),
      method: METHODS[entry.m],
      sampleType: SAMPLES[sampleKey].t,
      turnaround: normTat(r.E),
      explanation,
      tags: [section, ...(entry.tags || []), ...(r.F && /WES\/CES/i.test(r.F) ? ['germline'] : [])],
      featured: !!entry.f,
    })
  }
}

// IDs
const used = new Set()
for (const a of analyses) {
  let id = slug(a.name.en)
  if (used.has(id)) id = `${id}-${shortHash(`${a.categoryId}:${a._src}`)}`
  if (used.has(id)) throw new Error(`Duplicate id ${id}`)
  used.add(id)
  a.id = id
}

// Validate
for (const a of analyses) {
  for (const f of ['name', 'description']) for (const l of ['az', 'ru', 'en']) {
    if (!a[f]?.[l]?.trim()) throw new Error(`${a.id}: missing ${f}.${l}`)
  }
}

const catOrder = ['reproductive-health', 'pregnancy', 'oncology', 'exome', 'neurology', 'hla']
const categories = CATEGORIES
  .map((c) => ({ ...c }))
  .sort((a, b) => {
    const ia = catOrder.indexOf(a.id), ib = catOrder.indexOf(b.id)
    return (ia < 0 ? 99 : ia) - (ib < 0 ? 99 : ib)
  })
  .map((c, i) => {
    const { id, name, description, icon, featured, subcategories } = c
    return { id, name, description, icon, order: i + 1, featured, ...(subcategories ? { subcategories } : {}) }
  })

const catalog = {
  meta: { currency: 'AZN', usdToAzn: USD, eurToAzn: EUR, version: 1 },
  categories,
  analyses: analyses.map(({ _src, ...a }) => ({
    id: a.id, categoryId: a.categoryId, name: a.name, description: a.description, priceAzn: a.priceAzn,
    method: a.method, sampleType: a.sampleType, turnaround: a.turnaround, explanation: a.explanation,
    tags: a.tags, featured: a.featured,
  })),
}

const unknownCats = catalog.analyses.filter((a) => !categories.some((c) => c.id === a.categoryId))
if (unknownCats.length) throw new Error(`Unknown categoryId: ${unknownCats.map((a) => a.id).join(', ')}`)

const out = resolve(ROOT, 'src', 'data', 'catalog.json')
mkdirSync(dirname(out), { recursive: true })
writeFileSync(out, JSON.stringify(catalog, null, 2) + '\n', 'utf8')

// Report
const byCat = {}
for (const a of catalog.analyses) byCat[a.categoryId] = (byCat[a.categoryId] || 0) + 1
const noPrice = catalog.analyses.filter((a) => a.priceAzn == null)
console.log(`Wrote ${out}`)
console.log(`categories: ${categories.length}`)
console.log(`analyses: ${catalog.analyses.length}`)
console.log(`analyses without price: ${noPrice.length}`)
for (const a of noPrice) console.log(`  - ${a.id} (${a.categoryId})`)
console.log('by categoryId:')
for (const c of categories) console.log(`  ${c.id}: ${byCat[c.id] || 0}`)
console.log(`featured analyses: ${catalog.analyses.filter((a) => a.featured).length}`)
