import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { ProductAnnotation, Disclaimer, RatingBadge, RatingsPanel } from '../components';
import useMetaDescription from '../hooks/useMetaDescription';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useProductSchema from '../hooks/useProductSchema';
import useProductRatingSummary from '../hooks/useProductRatingSummary';

const SUPPORTED_LANGS = ['ka', 'en', 'ru', 'de'];

function resolveLang(lng) {
  if (!lng) return 'ka';
  const short = lng.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'ka';
}

// Diabetol-1 has no pharmacy product links yet, so buyers are pointed to our offices instead.
// Address text comes from i18n (info.office1Address), same as the footer.
const OFFICE = {
  addressKey: 'info.office1Address',
  url: 'https://maps.app.goo.gl/JRX2r2tAQVmSMSjY7',
};

const BUY_LABEL = {
  ka: 'შეიძინეთ:',
  en: 'Buy at:',
  ru: 'Купить:',
  de: 'Erhältlich bei:',
};

const MAP_CTA = {
  ka: 'რუკაზე ნახვა',
  en: 'View on map',
  ru: 'Посмотреть на карте',
  de: 'Auf der Karte ansehen',
};

const NEW_TAB = {
  ka: '(იხსნება ახალ ჩანართში)',
  en: '(opens in a new tab)',
  ru: '(откроется в новой вкладке)',
  de: '(öffnet in neuem Tab)',
};

const SPEC_ROWS = [
  {
    key: 'pharmacologicalGroup',
    label: {
      ka: 'ფარმაკოლოგიური ჯგუფი',
      en: 'Pharmacological group',
      ru: 'Фармакологическая группа',
      de: 'Pharmakologische Gruppe',
    },
  },
  {
    key: 'manufacturerCountry',
    label: {
      ka: 'მწარმოებელი ქვეყანა',
      en: 'Country of manufacture',
      ru: 'Страна производитель',
      de: 'Herstellungsland',
    },
  },
  {
    key: 'manufacturer',
    label: { ka: 'მწარმოებელი', en: 'Manufacturer', ru: 'Производитель', de: 'Hersteller' },
  },
  {
    key: 'dispensingForm',
    label: { ka: 'გაცემის ფორმა', en: 'Dispensing form', ru: 'Форма отпуска', de: 'Abgabeform' },
  },
  { key: 'status', label: { ka: 'სტატუსი', en: 'Status', ru: 'Статус', de: 'Status' } },
  {
    key: 'activeSubstance',
    label: {
      ka: 'აქტიური ნივთიერება',
      en: 'Active substance',
      ru: 'Активное вещество',
      de: 'Wirkstoff',
    },
  },
  { key: 'dosage', label: { ka: 'დოზირება', en: 'Dosage', ru: 'Дозировка', de: 'Dosierung' } },
];

// Static product data (same shape the API returns, so useProductSchema / ProductAnnotation keep working)
const PRODUCT = {
  handle: 'diabetol-1',
  title: {
    ka: 'დიაბეტოლ-1',
    en: 'Diabetol-1',
    ru: 'Диабетол-1',
    de: 'Diabetol-1',
  },
  brandName: {
    ka: { primary: 'დიაბეტოლ-1', secondary: '' },
    en: { primary: 'DIABETOL-1', secondary: '' },
    ru: { primary: 'ДИАБЕТОЛ-1', secondary: '' },
    de: { primary: 'DIABETOL-1', secondary: '' },
  },
  characteristics: {
    pharmacologicalGroup: {
      ka: 'ბიოლოგიურად აქტიური დანამატი - ნატურალური მცენარეების ნაყენი.',
      en: 'Dietary supplement – a tincture of natural plants.',
      ru: 'Биологически активная добавка — настойка натуральных растений.',
      de: 'Nahrungsergänzungsmittel – Tinktur aus natürlichen Pflanzen.',
    },
    manufacturerCountry: {
      ka: 'საქართველო',
      en: 'Georgia',
      ru: 'Грузия',
      de: 'Georgien',
    },
    manufacturer: {
      ka: 'შპს ფიტოფარმ-2024',
      en: 'FITOFARM-2024 LLC',
      ru: 'ООО «ФИТОФАРМ-2024»',
      de: 'FITOFARM-2024 LLC',
    },
    dispensingForm: {
      ka: '',
      en: '',
      ru: '',
      de: '',
    },
    status: {
      ka: 'შეიძინეთ: PSP, ავერსი, GPC, ფარმადეპო',
      en: 'Available at: PSP, Aversi, GPC, Pharmadepot',
      ru: 'Можно приобрести в аптеках PSP, Aversi, GPC, Pharmadepot.',
      de: 'Erhältlich bei: PSP, Aversi, GPC, Pharmadepot',
    },
    activeSubstance: {
      ka: ['დარიჩინი', 'დაფნა', 'ჭინჭარი', 'ლურჯი მოცვი'],
      en: ['Cinnamon', 'Bay leaf', 'Nettle', 'Blueberry'],
      ru: ['корица', 'лавровый лист', 'крапива', 'голубика'],
      de: ['Zimt', 'Lorbeerblatt', 'Brennnessel', 'Heidelbeere'],
    },
    dosage: {
      ka: '25 მლ, 50 მლ, 100 მლ, 200 მლ',
      en: '25 ml, 50 ml, 100 ml, 200 ml',
      ru: '25 мл, 50 мл, 100 мл, 200 мл',
      de: '25 ml, 50 ml, 100 ml, 200 ml',
    },
  },
  shortDescription: {
    ka: 'ბიოლოგიურად აქტიური დანამატი - ნატურალური მცენარეების ნაყენი. შეიცავს ვიტამინებს და მიკროელემენტებს, არეგულირებს გლუკოზის დონეს და ხელს უწყობს ნივთიერებათა ცვლას შაქრიანი დიაბეტის დროს.',
    en: 'Dietary supplement – a tincture of natural plants. Contains vitamins and trace elements, regulates glucose levels and supports metabolism in diabetes mellitus.',
    ru: 'Биологически активная добавка — настойка натуральных растений. Содержит витамины и микроэлементы, регулирует уровень глюкозы и способствует обмену веществ при сахарном диабете.',
    de: 'Nahrungsergänzungsmittel – Tinktur aus natürlichen Pflanzen. Enthält Vitamine und Spurenelemente, reguliert den Glukosespiegel und unterstützt den Stoffwechsel bei Diabetes mellitus.',
  },
  fullAnnotation: {
    ka: {
      category: '',
      form: 'შიგნით მისაღები წვეთები',
      lead: 'ბიოლოგიურად აქტიური დანამატი - ნატურალური მცენარეების ნაყენი.',
      sections: [
        {
          title: 'აღწერილობა',
          text: 'დიაბეტოლ-1 შეიცავს ვიტამინებს, რომლებიც არეგულირებენ ორგანიზმში ნივთიერებათა ცვლას.\nადამიანებს, რომლებსაც შაქრიანი დიაბეტი აწუხებთ ხშირად უძლიერებათ ორგანიზმში ვიტამინების მოთხოვნილება, რაც ვიტამინების ხშირი მოხმარებითაა განპირობებული. ამის მიზეზი შეიძლება იყოს სტრესი, ინფექცია, ნერვული და ფსიქიკური დატვირთვა. ვიტამინების დეფიციტმა შეიძლება ორგანიზმის შესუსტება გამოიწვიოს და უფრო გაართულოს დიაბეტის მდგომარეობა.\nშესაბამისად, დიაბეტოლ-1-ის მიღება, შაქრიანი დიაბეტის დროს, მედიკამენტების მიღებასთან და დიეტასთან ერთად, განაპირობებს ორგანიზმის ვიტამინებით მომარაგებასაც.',
        },
        {
          title: 'შემადგენლობა',
          list: [
            'დარიჩინი - 10 მლ',
            'დაფნა - 8 მლ',
            'ჭინჭარი - 4 მლ',
            'ლურჯი მოცვი - 3 მლ',
            'ვიტამინი C',
            'ვიტამინი D3',
            'ვიტამინი E',
            'ვიტამინი B-1 თიამინი',
            'ვიტამინი B-2',
            'ვიტამინი B-3 ნიაცინი',
            'ვიტამინი B-6',
            'ვიტამინი B-12',
            'ფოლიუმის მჟავა',
            'ბიოტინი',
            'მაგნიუმი',
            'თუთია',
            'სელენი',
            'ქრომი',
            'კვებითი დანამატი E-200',
          ],
        },
        {
          title: 'ვიტამინებისა და მიკროელემენტების მოქმედება',
          list: [
            'ვიტამინები E, C, B1, B2, B6 და ფოლიუმის მჟავა ხელს უწყობს ორგანიზმში ფიზიოლოგიური ფუნქციებისა და მეტაბოლიზმის უმნიშვნელოვანესი პროცესების დარეგულირებას.',
            'თუთია ხელს უწყობს კუჭქვეშა ჯირკვლის ჯანსაღ ფუნქციონირებასა და ინსულინის გამოყოფას. ასტიმულირებს ბუნებრივ დამცავ პროცესებს ორგანიზმში.',
            'ქრომი არეგულირებს გლუკოზის დონესა და ენერგეტიკულ ცვლას. წარმოადგენს "გლუკოზის ტოლერანტობის ფაქტორის" აქტიურ კომპონენტს, რომელიც ააქტიურებს ინსულინის მოქმედებას. აქვს ანტიოქსიდანტური მოქმედება. უნარჩუნებს სისხლძარღვების ჯანმრთელობას. გარდა ამისა, ქრომი ამცირებს ტკბილის მოთხოვნილებას ორგანიზმში, რაც ეხმარება შაქრიანი დიაბეტის მქონეთ ადვილად დაიცვან დიეტა.',
          ],
        },
        {
          title: 'პრეპარატის ფარმაკოლოგიური თვისებები',
          text: 'სულ რაღაც 35 წვეთი აკმაყოფილებს ორგანიზმში ვიტამინებისა და მიკროელემენტების ყოველდღიურ ფიზიოლოგიურ მოთხოვნილებას, განსაკუთრებით შაქრიანი დიაბეტის დროს.',
          list: [
            'არეგულირებს სისხლში შაქრის შემცველობას.',
            'ხელს უწყობს ორგანიზმში ნივთიერებათა ცვლას.',
            'ავსებს მიკროელემენტების დეფიციტს.',
            'ხელს უწყობს ორგანიზმში ფიზიოლოგიური ფუნქციებისა და მეტაბოლიზმის უმნიშვნელოვანესი პროცესების დარეგულირებას.',
            'არეგულირებს გლუკოზის დონეს.',
            'ააქტიურებს ინსულინის მოქმედებას.',
            'აქვს ანტიოქსიდანტური მოქმედება.',
            'უნარჩუნებს სისხლძარღვების ჯანმრთელობას.',
            'ამცირებს ტკბილის მოთხოვნილებას.',
            'ეხმარება ორგანიზმს ნახშირწყლების ცვლაში.',
            'ხელს უწყობს გაცხიმოვნებული ღვიძლის უჯრედების აღდგენას.',
            'აუმჯობესებს ნაღვლის ბუშტის ფუნქციონირებას.',
          ],
        },
        {
          title: 'დოზირება',
          text: 'დიაბეტოლ-1-ის მიღება ზრდასრულებისთვის არის დასაშვები და მისი გამოყენება არის რეკომენდებული ბავშვებშიც.\nპაციენტებს შეუძლიათ პრეპარატის გამოყენება მონოთერაპიის სახით და დიაბეტის საწინააღმდეგო სხვა პერორალურ მედიკამენტებთან კომბინაციაში. ზრდასრულებში დიაბეტოლ-1-ის საწყისი დოზა 35 წვეთს შეადგენს, დღე-ღამეში ორჯერ - დილით უზმოზე და ძილის წინ მისაღებად.\nმკურნალობის დაწყებიდან დაახლოებით 10-15 დღის შემდეგ დოზის კორექტირება შესაძლებელია. სისხლში გლუკოზის დონის გაზომვის შედეგების მიხედვით უნდა მოხდეს დოზის თანდათანობით გაზრდა.\nგასათვალისწინებელია, რომ დიაბეტოლ-1-ის მაქსიმალური რეკომენდებული დოზა დღე-ღამეში 2 დოზას, შესაბამისად, ის 70 წვეთს შეადგენს.',
        },
        {
          title: 'მიღების წესი',
          text: 'დიაბეტოლ-1 მიიღება დილით უზმოზე და საღამოს ძილის წინ 35 წვეთი წყალში გახსნით.\nდიაბეტოლ-1-ის მიღების დაწყებისას არ არის საჭირო დიაბეტის საწინააღმდეგო სხვა პერორალური საშუალების მიღების შეწყვეტა.\nრაც შეეხება დიაბეტოლ-1-ის ინსულინთან კომბინაციაში გამოყენებას, მისი საწყისი სადღეღამისო დოზა შეადგენს 35 წვეთის დოზირებით. ინსულინის დოზის კორექტირება კი სისხლში გლუკოზის დონის გაზომვის შედეგების მიხედვით უნდა მოხდეს.\nხანდაზმულ პაციენტებში, რომელსაც შესაძლოა თირკმელების ფუნქცია დაქვეითებული ჰქონდეთ, დიაბეტოლ-1-ის დოზის კორექტირება თირკმელების ფუნქციის მაჩვენებლების საფუძველზე უნდა მოხდეს. გარდა ამისა, თირკმელების ფუნქციის მაჩვენებლები რეგულარულად უნდა გაკონტროლდეს.\nშაქრიანი დიაბეტის დროს რეკომენდებულია დიაბეტოლ-1-ის რეგულარული მიღება.',
        },
        {
          title: 'უკუჩვენება',
          text: 'ცალკეული კომპონენტების ინდივიდუალური აუტანლობა. ფეხმძიმობის და ლაქტაციის დროს, გამოყენებამდე მიმართეთ ექიმს კონსულტაციისთვის.',
        },
        {
          title: 'დარიჩინის სასარგებლო თვისებები',
          list: [
            'დარიჩინი საკმაოდ სერიოზული სამკურნალო საშუალებაა, მაგალითად ის ხელს უწყობს წონის კლებას - დიეტის დროს. 4-5 კვირაში დარიჩინი 15-20%-ით ამცირებს სისხლში შაქრის დონეს;',
            'დარიჩინში შემავალი საკვები ბოჭკო (ცელულოზა) და კალიუმები ხელს უწყობენ ორგანიზმიდან მავნე ნივთიერებების გამოდევნას;',
            'დარიჩინი საუკეთესო საშუალებაა დიარეით (ფაღარათით) და ყაბზობით (შეკრულობით) გამოწვეული პრობლემებისთვის, რადგანაც ის აწესრიგებს საჭმლის მომნელებელ სისტემას;',
            'დარიჩინის რეგულარული გამოყენება ამცირებს ინსულტისა და ინფარქტის რისკს, ის დადებითად მოქმედებს გულის კუნთის მუშაობაზე, დაბლა წევს „ცუდი“ ქოლესტერინის დონეს;',
            'დარიჩინი ხსნის კანის გაღიზიანებას, ამიტომაც მას ხშირად ურევენ სახლის პირობებში დამზადებულ სახის კრემებში;',
            'დარიჩინის სპეციფიკური არომატი ტვინის მუშაობის სტიმულირებას ახდენს და აუმჯობესებს გუნება-განწყობას.',
          ],
        },
        {
          title: 'დაფნის სასარგებლო თვისებები',
          list: [
            'დაფნის (Laurus Nobilis L) ფოთოლი შეიცავს A, C, B და PP ვიტამინებს, სელენს და მანგანუმს, მაგნიუმს და ფოსფორს, კალიუმს, კალციუმს, სპილენძს და ბევრ სხვა მინერალს. გარდა ამისა, შეიცავს ტანინებს, ეთერზეთებს და ორგანულ მჟავებს მათ შორის ძმარმჟავა, ჭიანჭველმჟავა, ბუტირის მჟავა, ლაურინის მჟავა და ამინოკაპრონის მჟავა.',
            'დაფნაში შემავალი ყველა ეს ორგანული მჟავა ბუნებრივი ანტიოქსიდანტია. ორგანიზმში არსებული ანტიოქსიდანტები ხელს უწყობენ დაბერების პროცესისა და ნაადრევი დაბერების გამომწვევი ჟანგვითი რეაქციების შენელებას. მათი ანტიოქსიდანტური თვისებების გამო, საკვებ მჟავებს აქვთ ანთების საწინააღმდეგო და სიცხის დამწევი თვისებები, ზოგიერთ მათგანს კი შეუძლია სისხლის შედედების შემცირებაც კი.',
            'ვიტამინები: მცენარეების დიდი უმრავლესობის მსგავსად, დაფნის ფოთოლი შეიცავს რამდენიმე B ვიტამინს (B1, B2, B3, B6, B9) და C ვიტამინს. C ვიტამინი პასუხისმგებელია იმუნიტეტის შენარჩუნებაზე და ხელს უწყობს სისხლში შაქრის დონის შემცირებას.',
            'მინერალები: დაფნის ფოთოლი შეიცავს გულისა და სისხლძარღვების ჯანმრთელობისთვის აუცილებელ მიკროელემენტებს – კალციუმს, მაგნიუმს და კალიუმს – ასევე ცენტრალური ნერვული სისტემის ნორმალური ფუნქციონირებისთვის აუცილებელ მინერალებს – რკინას, ფოსფორს, ნატრიუმს, სპილენძს, სელენს და თუთიას.',
            'დაფნის ფოთლები შეიცავს ომეგა-3 ცხიმოვან მჟავებს, ასევე A და B2 ვიტამინებს, რომლებიც წარმოუდგენლად სასარგებლოა კანისთვის და ცნობილია, როგორც „სილამაზის ვიტამინი“. ფოთლების ნაყენი შეიძლება გამოყენებულ იქნას სახის კომპრესებით, სიწითლისა და აკნეს სამკურნალოდ. ვიტამინი B9 ასევე მნიშვნელოვანია ქალის ორგანიზმისთვის, განსაკუთრებით ორსულობის დროს. ეს ვიტამინი ხელს უწყობს ნაყოფის სრულ და დროულ განვითარებას, ხელს უწყობს ორსულობის შეუფერხებლად მიმდინარეობას და ხელს უწყობს ემოციური და ჰორმონალური ბალანსის ნორმალიზებას მშობიარობამდე და მის შემდეგ.',
          ],
        },
        {
          title: 'რა მდგომარეობების დროს არის დაფნის ფოთოლი სასარგებლო?',
          list: [
            'კუჭ-ნაწლავის დაავადებები: დაფნის ფოთოლი ხელს უწყობს საჭმლის მონელების გაუმჯობესებას, ანთების ჩაქრობას და მეტეორიზმისა და გულძმარვის შემცირებას. ნატურალური სანელებლების რეგულარული მოხმარება ამცირებს კუჭ-ნაწლავის ანთებით დაავადებებთან დაკავშირებული სიმპტომების სიმძიმეს.',
            'დიაბეტი: სამეცნიერო კვლევები აჩვენებს, რომ დაფნის ფოთოლი, სამზარეულოში რეგულარული გამოყენებისას, ხელს უწყობს სისხლში შაქრის დონის ნორმალიზებას და ინსულინის მგრძნობელობის გაუმჯობესებას.',
          ],
        },
        {
          title: 'ჭინჭარის სასარგებლო თვისებები',
          text: 'ჭინჭარი მრავალმხრივი ფარმაკოლოგიური მოქმედებით გამოირჩევა:',
          list: [
            'ჰიპოგლიკემიური: ხელს უწყობს სისხლში შაქრის დონის რეგულირებას.',
            'ანთების საწინააღმდეგო: ამცირებს ანთებით პროცესებს ორგანიზმში, განსაკუთრებით ეფექტურია სახსრებისა და შარდ-სასქესო სისტემის ანთებების დროს.',
            'შარდმდენი: ხელს უწყობს ორგანიზმიდან ჭარბი სითხისა და ტოქსინების გამოდევნას, სასარგებლოა შეშუპებების, თირკმელების და შარდგამომყოფი გზების პრობლემების დროს.',
            'სისხლმბადი: მაღალი რკინისა და ქლოროფილის შემცველობის გამო, ხელს უწყობს ჰემოგლობინის დონის მატებას და გამოიყენება ანემიის სამკურნალოდ.',
            'სისხლდენის შემაჩერებელი (ჰემოსტატიკური): K ვიტამინისა და მთვრიმლავი ნივთიერებების გამო აჩქარებს სისხლის შედედებას, გამოიყენება საშვილოსნოს, ცხვირისა და კუჭ-ნაწლავის სისხლდენების დროს.',
            'ანტიოქსიდანტური: ფლავონოიდებისა და ვიტამინების წყალობით იცავს უჯრედებს თავისუფალი რადიკალების მავნე ზემოქმედებისგან.',
            'ანტირევმატული: ამცირებს ტკივილს და ანთებას სახსრების დაავადებების დროს.',
            'იმუნომოდულატორული: აძლიერებს იმუნურ სისტემას და ეხმარება ორგანიზმს ინფექციებთან ბრძოლაში.',
            'კოსმეტიკური: აუმჯობესებს კანისა და თმის მდგომარეობას, ამაგრებს თმის ძირებს და ხელს უშლის თმის ცვენას.',
          ],
        },
        {
          title: 'ლურჯი მოცვის სასარგებლო თვისებები',
          list: [
            'ლურჯ მოცვს აქვს ანტიოქსიდანტური, ანტისეპტიკური, ჰემოსტატიკური (სისხლდენის შემაჩერებელი), ანტიდიაბეტური თვისებები. მას აქტიურად იყენებენ ფიტოთერაპიაში. მცენარეულ სამკურნალო საშუალებათა კომიტეტის (EMA-ს – ევროპის მედიკამენტების სააგენტოს – სპეციალიზებული ორგანო) მიერ ნებადართულია მცენარეულ წამლებში მოცვის გამოყენება. რამდენიმე კვლევამ დაადასტურა, რომ მოცვის რეგულარულ მიღებას შეუძლია, შეამციროს დიაბეტის განვითარების რისკი.',
            'მაგალითად, ფინელი მკვლევრები წერენ, რომ ანტოციანების მაღალი შემცველობის წყალობით მოცვი დადებით გავლენას ახდენს სისხლში შაქრის დონესა და ინსულინის სეკრეციაზე.',
            'დიაბეტით დაავადებულები ხშირად უარს ამბობენ ფრუქტოზით მდიდარ ხილსა და კენკრაზე. შვიდწლიანი კვლევის შედეგად მეცნიერებმა დაასკვნეს, რომ ეს შეცდომაა – მას, ვინც ზომიერად ჭამს ახალ ხილს, ნაკლებად ემუქრება დიაბეტით განპირობებული მეორეული დაავადებები.',
          ],
        },
        {
          title: 'გამოშვების ფორმა',
          list: [
            'პირველადი შეფუთვა: 200 მლ, 100 მლ, 50 მლ, 25 მლ, მუქ ნარინჯისფერ პეტ-ის ფლაკონში',
            'მეორეული შეფუთვა: 1 ფლაკონი, გამოყენების ინსტრუქცია და მუყაოს ყუთი',
          ],
        },
        {
          title: 'შენახვის პირობები',
          text: 'სინათლისაგან დაცულ და ბავშვებისათვის მიუწვდომელ ადგილას, არაუმეტეს 25°C ტემპერატურაზე.',
        },
        {
          title: 'ვარგისიანობის ვადა',
          text: '2 წელი. აკრძალულია გამოყენება შეფუთვაზე აღნიშნული ვადის გასვლის შემდეგ.',
        },
        {
          title: 'მწარმოებელი',
          text: 'შპს „ფიტოფარმ 2024“\nwww.fitofarm2024.ge\nტელ: +995 599 14 21 18, +995 598 16 47 45\nელ. ფოსტა: info@fitofarm2024.ge\nსაქართველო, ქ. თბილისი, წერეთლის 142',
        },
      ],
    },
    en: {
      category: '',
      form: 'Oral drops',
      lead: 'Dietary supplement – a tincture of natural plants.',
      sections: [
        {
          title: 'Description',
          text: 'Diabetol-1 contains vitamins that regulate metabolism in the body.\nPeople with diabetes mellitus often have an increased need for vitamins, which is due to frequent vitamin consumption. The cause may be stress, infection, or nervous and psychological strain. A vitamin deficiency can weaken the body and further complicate the course of diabetes.\nAccordingly, taking Diabetol-1 in diabetes mellitus, together with medication and diet, also ensures that the body is supplied with vitamins.',
        },
        {
          title: 'Composition',
          list: [
            'Cinnamon — 10 ml',
            'Bay leaf — 8 ml',
            'Nettle — 4 ml',
            'Blueberry — 3 ml',
            'Vitamin C',
            'Vitamin D3',
            'Vitamin E',
            'Vitamin B-1 (thiamine)',
            'Vitamin B-2',
            'Vitamin B-3 (niacin)',
            'Vitamin B-6',
            'Vitamin B-12',
            'Folic acid',
            'Biotin',
            'Magnesium',
            'Zinc',
            'Selenium',
            'Chromium',
            'Food additive E-200',
          ],
        },
        {
          title: 'Action of vitamins and trace elements',
          list: [
            'Vitamins E, C, B1, B2, B6 and folic acid help regulate the most important physiological functions and metabolic processes in the body.',
            "Zinc supports healthy functioning of the pancreas and the release of insulin. It stimulates the body's natural defence processes.",
            'Chromium regulates glucose levels and energy metabolism. It is an active component of the “glucose tolerance factor”, which enhances the action of insulin. It has an antioxidant effect. It helps maintain the health of blood vessels. In addition, chromium reduces the craving for sweets, which helps people with diabetes mellitus stick to their diet more easily.',
          ],
        },
        {
          title: 'Pharmacological properties',
          text: "Just 35 drops cover the body's daily physiological need for vitamins and trace elements, especially in diabetes mellitus.",
          list: [
            'Regulates blood sugar levels.',
            'Supports metabolism in the body.',
            'Replenishes trace element deficiencies.',
            'Helps regulate the most important physiological functions and metabolic processes in the body.',
            'Regulates glucose levels.',
            'Enhances the action of insulin.',
            'Has an antioxidant effect.',
            'Helps maintain the health of blood vessels.',
            'Reduces the craving for sweets.',
            'Helps the body with carbohydrate metabolism.',
            'Helps restore the cells of a fatty liver.',
            'Improves gallbladder function.',
          ],
        },
        {
          title: 'Dosage',
          text: 'Diabetol-1 is permitted for adults, and its use in children is also recommended.\nPatients may use the product as monotherapy or in combination with other oral antidiabetic medicines. The initial dose of Diabetol-1 in adults is 35 drops, twice a day – in the morning on an empty stomach and before bedtime.\nThe dose may be adjusted approximately 10–15 days after the start of treatment. The dose should be increased gradually, based on the results of blood glucose measurements.\nPlease note that the maximum recommended dose of Diabetol-1 is 2 doses per day, i.e. 70 drops.',
        },
        {
          title: 'Method of administration',
          text: 'Diabetol-1 is taken in the morning on an empty stomach and in the evening before bedtime, 35 drops dissolved in water.\nWhen starting Diabetol-1, it is not necessary to stop taking other oral antidiabetic agents.\nAs for the use of Diabetol-1 in combination with insulin, the initial daily dose is 35 drops. The insulin dose should be adjusted based on the results of blood glucose measurements.\nIn elderly patients, who may have reduced kidney function, the dose of Diabetol-1 should be adjusted based on kidney function indicators. In addition, kidney function indicators should be monitored regularly.\nRegular use of Diabetol-1 is recommended in diabetes mellitus.',
        },
        {
          title: 'Contraindications',
          text: 'Individual intolerance to individual components. During pregnancy and lactation, consult a doctor before use.',
        },
        {
          title: 'Beneficial properties of cinnamon',
          list: [
            'Cinnamon is quite a serious medicinal remedy; for example, it helps with weight loss during a diet. Within 4–5 weeks, cinnamon lowers blood sugar levels by 15–20%;',
            'The dietary fibre (cellulose) and potassium contained in cinnamon help eliminate harmful substances from the body;',
            'Cinnamon is an excellent remedy for problems caused by diarrhoea and constipation, as it regulates the digestive system;',
            'Regular use of cinnamon reduces the risk of stroke and heart attack, has a positive effect on the work of the heart muscle, and lowers the level of “bad” cholesterol;',
            'Cinnamon relieves skin irritation, which is why it is often added to homemade face creams;',
            'The specific aroma of cinnamon stimulates brain activity and improves mood.',
          ],
        },
        {
          title: 'Beneficial properties of bay leaf',
          list: [
            'The bay leaf (Laurus nobilis L.) contains vitamins A, C, B and PP, selenium and manganese, magnesium and phosphorus, potassium, calcium, copper and many other minerals. It also contains tannins, essential oils and organic acids, including acetic, formic, butyric, lauric and aminocaproic acid.',
            'All of these organic acids in bay leaf are natural antioxidants. Antioxidants in the body help slow the ageing process and the oxidative reactions that cause premature ageing. Thanks to their antioxidant properties, dietary acids have anti-inflammatory and fever-reducing effects, and some of them can even reduce blood clotting.',
            'Vitamins: like the vast majority of plants, the bay leaf contains several B vitamins (B1, B2, B3, B6, B9) and vitamin C. Vitamin C is responsible for maintaining immunity and helps lower blood sugar levels.',
            'Minerals: the bay leaf contains trace elements essential for heart and vascular health – calcium, magnesium and potassium – as well as minerals essential for the normal functioning of the central nervous system – iron, phosphorus, sodium, copper, selenium and zinc.',
            'Bay leaves contain omega-3 fatty acids, as well as vitamins A and B2, which are extremely beneficial for the skin and are known as the “beauty vitamins”. An infusion of the leaves can be used in facial compresses to treat redness and acne. Vitamin B9 is also important for the female body, especially during pregnancy. This vitamin supports the full and timely development of the foetus, helps pregnancy proceed smoothly, and helps normalise emotional and hormonal balance before and after childbirth.',
          ],
        },
        {
          title: 'In which conditions is the bay leaf beneficial?',
          list: [
            'Gastrointestinal diseases: the bay leaf helps improve digestion, relieve inflammation, and reduce bloating and heartburn. Regular consumption of natural spices reduces the severity of symptoms associated with inflammatory diseases of the gastrointestinal tract.',
            'Diabetes: scientific studies show that the bay leaf, when used regularly in cooking, helps normalise blood sugar levels and improve insulin sensitivity.',
          ],
        },
        {
          title: 'Beneficial properties of nettle',
          text: 'Nettle is distinguished by its versatile pharmacological action:',
          list: [
            'Hypoglycaemic: helps regulate blood sugar levels.',
            'Anti-inflammatory: reduces inflammatory processes in the body; especially effective in inflammation of the joints and the genitourinary system.',
            'Diuretic: helps eliminate excess fluid and toxins from the body; useful for oedema and for problems of the kidneys and urinary tract.',
            'Blood-forming: thanks to its high iron and chlorophyll content, it helps raise haemoglobin levels and is used to treat anaemia.',
            'Haemostatic (stops bleeding): thanks to vitamin K and tannins, it accelerates blood clotting and is used for uterine, nasal and gastrointestinal bleeding.',
            'Antioxidant: thanks to flavonoids and vitamins, it protects cells from the harmful effects of free radicals.',
            'Antirheumatic: reduces pain and inflammation in joint diseases.',
            'Immunomodulatory: strengthens the immune system and helps the body fight infections.',
            'Cosmetic: improves the condition of the skin and hair, strengthens the hair roots and helps prevent hair loss.',
          ],
        },
        {
          title: 'Beneficial properties of blueberry',
          list: [
            'Blueberry has antioxidant, antiseptic, haemostatic (stops bleeding) and antidiabetic properties. It is actively used in phytotherapy. The use of blueberry in herbal medicines is permitted by the Committee on Herbal Medicinal Products (a specialised body of the EMA – the European Medicines Agency). Several studies have confirmed that regular consumption of blueberry can reduce the risk of developing diabetes.',
            'For example, Finnish researchers write that, thanks to its high anthocyanin content, blueberry has a positive effect on blood sugar levels and insulin secretion.',
            'People with diabetes often avoid fruit and berries rich in fructose. After a seven-year study, scientists concluded that this is a mistake – those who eat fresh fruit in moderation are at lower risk of secondary diseases caused by diabetes.',
          ],
        },
        {
          title: 'Form of release',
          list: [
            'Primary packaging: 200 ml, 100 ml, 50 ml, 25 ml, in dark orange PET bottles',
            'Secondary packaging: 1 bottle, instructions for use and a cardboard box',
          ],
        },
        {
          title: 'Storage conditions',
          text: 'Store protected from light, out of reach of children, at a temperature not exceeding 25°C.',
        },
        {
          title: 'Shelf life',
          text: '2 years. Do not use after the expiration date indicated on the packaging.',
        },
        {
          title: 'Manufacturer',
          text: 'FITOFARM-2024 LLC\nwww.fitofarm2024.ge\nTel.: +995 599 14 21 18, +995 598 16 47 45\nE-mail: info@fitofarm2024.ge\nGeorgia, Tbilisi, Tsereteli Ave. 142',
        },
      ],
    },
    ru: {
      category: '',
      form: 'Капли для приёма внутрь',
      lead: 'Биологически активная добавка — настойка натуральных растений.',
      sections: [
        {
          title: 'Описание',
          text: 'Диабетол-1 содержит витамины, регулирующие обмен веществ в организме.\nЛюди, страдающие сахарным диабетом, часто испытывают повышенную потребность в витаминах, что обусловлено их частым расходом. Причиной могут быть стресс, инфекция, нервные и психические нагрузки. Дефицит витаминов может привести к ослаблению организма и ещё больше осложнить течение диабета.\nСоответственно, приём Диабетола-1 при сахарном диабете, наряду с приёмом лекарственных препаратов и соблюдением диеты, обеспечивает также снабжение организма витаминами.',
        },
        {
          title: 'Состав',
          list: [
            'Корица — 10 мл',
            'Лавровый лист — 8 мл',
            'Крапива — 4 мл',
            'Голубика — 3 мл',
            'Витамин C',
            'Витамин D3',
            'Витамин E',
            'Витамин B-1 (тиамин)',
            'Витамин B-2',
            'Витамин B-3 (ниацин)',
            'Витамин B-6',
            'Витамин B-12',
            'Фолиевая кислота',
            'Биотин',
            'Магний',
            'Цинк',
            'Селен',
            'Хром',
            'Пищевая добавка E-200',
          ],
        },
        {
          title: 'Действие витаминов и микроэлементов',
          list: [
            'Витамины E, C, B1, B2, B6 и фолиевая кислота способствуют регулированию важнейших физиологических функций и процессов метаболизма в организме.',
            'Цинк способствует здоровому функционированию поджелудочной железы и выработке инсулина. Стимулирует естественные защитные процессы в организме.',
            'Хром регулирует уровень глюкозы и энергетический обмен. Является активным компонентом «фактора толерантности к глюкозе», который усиливает действие инсулина. Обладает антиоксидантным действием. Поддерживает здоровье сосудов. Кроме того, хром снижает тягу к сладкому, что помогает людям с сахарным диабетом легче соблюдать диету.',
          ],
        },
        {
          title: 'Фармакологические свойства препарата',
          text: 'Всего 35 капель удовлетворяют ежедневную физиологическую потребность организма в витаминах и микроэлементах, особенно при сахарном диабете.',
          list: [
            'Регулирует содержание сахара в крови.',
            'Способствует обмену веществ в организме.',
            'Восполняет дефицит микроэлементов.',
            'Способствует регулированию важнейших физиологических функций и процессов метаболизма в организме.',
            'Регулирует уровень глюкозы.',
            'Усиливает действие инсулина.',
            'Обладает антиоксидантным действием.',
            'Поддерживает здоровье сосудов.',
            'Снижает тягу к сладкому.',
            'Помогает организму в обмене углеводов.',
            'Способствует восстановлению клеток при жировой болезни печени.',
            'Улучшает функцию желчного пузыря.',
          ],
        },
        {
          title: 'Дозировка',
          text: 'Приём Диабетола-1 допустим для взрослых, а его применение рекомендуется и детям.\nПациенты могут применять препарат в виде монотерапии, а также в сочетании с другими пероральными противодиабетическими препаратами. Начальная доза Диабетола-1 для взрослых составляет 35 капель два раза в сутки — утром натощак и перед сном.\nПримерно через 10–15 дней после начала лечения возможна коррекция дозы. Дозу следует увеличивать постепенно, ориентируясь на результаты измерения уровня глюкозы в крови.\nСледует учитывать, что максимальная рекомендуемая доза Диабетола-1 составляет 2 приёма в сутки, то есть 70 капель.',
        },
        {
          title: 'Способ применения',
          text: 'Диабетол-1 принимают утром натощак и вечером перед сном по 35 капель, растворив в воде.\nПри начале приёма Диабетола-1 прекращать приём других пероральных противодиабетических средств не требуется.\nЧто касается применения Диабетола-1 в комбинации с инсулином, его начальная суточная доза составляет 35 капель. Коррекцию дозы инсулина следует проводить по результатам измерения уровня глюкозы в крови.\nУ пожилых пациентов, у которых может быть снижена функция почек, коррекцию дозы Диабетола-1 следует проводить на основании показателей функции почек. Кроме того, показатели функции почек необходимо регулярно контролировать.\nПри сахарном диабете рекомендуется регулярный приём Диабетола-1.',
        },
        {
          title: 'Противопоказания',
          text: 'Индивидуальная непереносимость отдельных компонентов. При беременности и лактации перед применением проконсультируйтесь с врачом.',
        },
        {
          title: 'Полезные свойства корицы',
          list: [
            'Корица — довольно серьёзное лечебное средство, например, она способствует снижению веса при соблюдении диеты. За 4–5 недель корица снижает уровень сахара в крови на 15–20%;',
            'Содержащиеся в корице пищевые волокна (целлюлоза) и калий способствуют выведению вредных веществ из организма;',
            'Корица — отличное средство при проблемах, вызванных диареей (поносом) и запором, поскольку она нормализует работу пищеварительной системы;',
            'Регулярное употребление корицы снижает риск инсульта и инфаркта, положительно влияет на работу сердечной мышцы, снижает уровень «плохого» холестерина;',
            'Корица снимает раздражение кожи, поэтому её часто добавляют в кремы для лица домашнего приготовления;',
            'Специфический аромат корицы стимулирует работу мозга и улучшает настроение.',
          ],
        },
        {
          title: 'Полезные свойства лаврового листа',
          list: [
            'Лавровый лист (Laurus nobilis L.) содержит витамины A, C, B и PP, селен и марганец, магний и фосфор, калий, кальций, медь и многие другие минералы. Кроме того, он содержит дубильные вещества, эфирные масла и органические кислоты, в том числе уксусную, муравьиную, масляную, лауриновую и аминокапроновую.',
            'Все эти органические кислоты, входящие в состав лавра, являются природными антиоксидантами. Антиоксиданты в организме способствуют замедлению процесса старения и окислительных реакций, вызывающих преждевременное старение. Благодаря антиоксидантным свойствам пищевые кислоты обладают противовоспалительным и жаропонижающим действием, а некоторые из них могут даже снижать свёртываемость крови.',
            'Витамины: как и подавляющее большинство растений, лавровый лист содержит несколько витаминов группы B (B1, B2, B3, B6, B9) и витамин C. Витамин C отвечает за поддержание иммунитета и способствует снижению уровня сахара в крови.',
            'Минералы: лавровый лист содержит микроэлементы, необходимые для здоровья сердца и сосудов, — кальций, магний и калий, — а также минералы, необходимые для нормального функционирования центральной нервной системы, — железо, фосфор, натрий, медь, селен и цинк.',
            'Лавровые листья содержат омега-3 жирные кислоты, а также витамины A и B2, которые чрезвычайно полезны для кожи и известны как «витамины красоты». Настой листьев можно использовать в виде компрессов для лица для лечения покраснений и акне. Витамин B9 также важен для женского организма, особенно во время беременности. Этот витамин способствует полноценному и своевременному развитию плода, благоприятному течению беременности и нормализации эмоционального и гормонального баланса до и после родов.',
          ],
        },
        {
          title: 'При каких состояниях полезен лавровый лист?',
          list: [
            'Заболевания желудочно-кишечного тракта: лавровый лист способствует улучшению пищеварения, уменьшению воспаления, а также снижению вздутия живота и изжоги. Регулярное употребление натуральных специй уменьшает выраженность симптомов, связанных с воспалительными заболеваниями желудочно-кишечного тракта.',
            'Диабет: научные исследования показывают, что лавровый лист при регулярном использовании в кулинарии способствует нормализации уровня сахара в крови и повышению чувствительности к инсулину.',
          ],
        },
        {
          title: 'Полезные свойства крапивы',
          text: 'Крапива отличается многосторонним фармакологическим действием:',
          list: [
            'Гипогликемическое: способствует регулированию уровня сахара в крови.',
            'Противовоспалительное: уменьшает воспалительные процессы в организме, особенно эффективно при воспалении суставов и мочеполовой системы.',
            'Мочегонное: способствует выведению из организма избытка жидкости и токсинов, полезно при отёках, проблемах с почками и мочевыводящими путями.',
            'Кроветворное: благодаря высокому содержанию железа и хлорофилла способствует повышению уровня гемоглобина и применяется для лечения анемии.',
            'Кровоостанавливающее (гемостатическое): благодаря витамину K и дубильным веществам ускоряет свёртывание крови, применяется при маточных, носовых и желудочно-кишечных кровотечениях.',
            'Антиоксидантное: благодаря флавоноидам и витаминам защищает клетки от вредного воздействия свободных радикалов.',
            'Антиревматическое: уменьшает боль и воспаление при заболеваниях суставов.',
            'Иммуномодулирующее: укрепляет иммунную систему и помогает организму бороться с инфекциями.',
            'Косметическое: улучшает состояние кожи и волос, укрепляет корни волос и препятствует выпадению волос.',
          ],
        },
        {
          title: 'Полезные свойства голубики',
          list: [
            'Голубика обладает антиоксидантными, антисептическими, гемостатическими (кровоостанавливающими) и антидиабетическими свойствами. Её активно применяют в фитотерапии. Использование голубики в растительных лекарственных средствах разрешено Комитетом по лекарственным средствам растительного происхождения (специализированным органом EMA — Европейского агентства по лекарственным средствам). Несколько исследований подтвердили, что регулярное употребление голубики может снизить риск развития диабета.',
            'Например, финские исследователи пишут, что благодаря высокому содержанию антоцианов голубика положительно влияет на уровень сахара в крови и секрецию инсулина.',
            'Люди с диабетом часто отказываются от фруктов и ягод, богатых фруктозой. По результатам семилетнего исследования учёные пришли к выводу, что это ошибка: тем, кто умеренно употребляет свежие фрукты, меньше угрожают вторичные заболевания, обусловленные диабетом.',
          ],
        },
        {
          title: 'Форма выпуска',
          list: [
            'Первичная упаковка: 200 мл, 100 мл, 50 мл, 25 мл, в тёмно-оранжевых ПЭТ-флаконах',
            'Вторичная упаковка: 1 флакон, инструкция по применению и картонная коробка',
          ],
        },
        {
          title: 'Условия хранения',
          text: 'Хранить в защищённом от света и недоступном для детей месте при температуре не выше 25°C.',
        },
        {
          title: 'Срок годности',
          text: '2 года. Запрещается использование по истечении срока годности, указанного на упаковке.',
        },
        {
          title: 'Производитель',
          text: 'ООО «ФИТОФАРМ-2024»\nwww.fitofarm2024.ge\nТел.: +995 599 14 21 18, +995 598 16 47 45\nEmail: info@fitofarm2024.ge\nГрузия, г. Тбилиси, пр. Церетели, 142',
        },
      ],
    },
    de: {
      category: '',
      form: 'Tropfen zur oralen Einnahme',
      lead: 'Nahrungsergänzungsmittel – Tinktur aus natürlichen Pflanzen.',
      sections: [
        {
          title: 'Beschreibung',
          text: 'Diabetol-1 enthält Vitamine, die den Stoffwechsel im Körper regulieren.\nMenschen mit Diabetes mellitus haben häufig einen erhöhten Vitaminbedarf, der durch den häufigen Vitaminverbrauch bedingt ist. Ursache können Stress, Infektionen sowie nervliche und psychische Belastungen sein. Ein Vitaminmangel kann den Körper schwächen und den Verlauf des Diabetes zusätzlich erschweren.\nDementsprechend sorgt die Einnahme von Diabetol-1 bei Diabetes mellitus, zusammen mit der Einnahme von Medikamenten und einer Diät, auch für die Versorgung des Körpers mit Vitaminen.',
        },
        {
          title: 'Zusammensetzung',
          list: [
            'Zimt — 10 ml',
            'Lorbeerblatt — 8 ml',
            'Brennnessel — 4 ml',
            'Heidelbeere — 3 ml',
            'Vitamin C',
            'Vitamin D3',
            'Vitamin E',
            'Vitamin B-1 (Thiamin)',
            'Vitamin B-2',
            'Vitamin B-3 (Niacin)',
            'Vitamin B-6',
            'Vitamin B-12',
            'Folsäure',
            'Biotin',
            'Magnesium',
            'Zink',
            'Selen',
            'Chrom',
            'Lebensmittelzusatzstoff E 200',
          ],
        },
        {
          title: 'Wirkung der Vitamine und Spurenelemente',
          list: [
            'Die Vitamine E, C, B1, B2, B6 und Folsäure tragen zur Regulierung der wichtigsten physiologischen Funktionen und Stoffwechselprozesse im Körper bei.',
            'Zink unterstützt die gesunde Funktion der Bauchspeicheldrüse und die Freisetzung von Insulin. Es stimuliert die natürlichen Abwehrprozesse im Körper.',
            'Chrom reguliert den Glukosespiegel und den Energiestoffwechsel. Es ist ein aktiver Bestandteil des „Glukosetoleranzfaktors“, der die Wirkung von Insulin verstärkt. Es wirkt antioxidativ. Es erhält die Gesundheit der Blutgefäße. Darüber hinaus verringert Chrom das Verlangen nach Süßem, was Menschen mit Diabetes mellitus hilft, ihre Diät leichter einzuhalten.',
          ],
        },
        {
          title: 'Pharmakologische Eigenschaften des Präparats',
          text: 'Bereits 35 Tropfen decken den täglichen physiologischen Bedarf des Körpers an Vitaminen und Spurenelementen, insbesondere bei Diabetes mellitus.',
          list: [
            'Reguliert den Blutzuckerspiegel.',
            'Unterstützt den Stoffwechsel im Körper.',
            'Gleicht einen Mangel an Spurenelementen aus.',
            'Trägt zur Regulierung der wichtigsten physiologischen Funktionen und Stoffwechselprozesse im Körper bei.',
            'Reguliert den Glukosespiegel.',
            'Verstärkt die Wirkung von Insulin.',
            'Wirkt antioxidativ.',
            'Erhält die Gesundheit der Blutgefäße.',
            'Verringert das Verlangen nach Süßem.',
            'Unterstützt den Körper beim Kohlenhydratstoffwechsel.',
            'Unterstützt die Regeneration der Zellen bei einer Fettleber.',
            'Verbessert die Funktion der Gallenblase.',
          ],
        },
        {
          title: 'Dosierung',
          text: 'Die Einnahme von Diabetol-1 ist für Erwachsene zulässig, und seine Anwendung wird auch bei Kindern empfohlen.\nPatienten können das Präparat als Monotherapie oder in Kombination mit anderen oralen Antidiabetika anwenden. Die Anfangsdosis von Diabetol-1 beträgt bei Erwachsenen 35 Tropfen, zweimal täglich – morgens auf nüchternen Magen und vor dem Schlafengehen.\nEtwa 10–15 Tage nach Beginn der Behandlung kann die Dosis angepasst werden. Die Dosis sollte anhand der Ergebnisse der Blutzuckermessungen schrittweise erhöht werden.\nBitte beachten Sie, dass die empfohlene Höchstdosis von Diabetol-1 2 Einzeldosen pro Tag beträgt, das heißt 70 Tropfen.',
        },
        {
          title: 'Anwendung',
          text: 'Diabetol-1 wird morgens auf nüchternen Magen und abends vor dem Schlafengehen eingenommen, 35 Tropfen in Wasser aufgelöst.\nBei Beginn der Einnahme von Diabetol-1 ist es nicht erforderlich, die Einnahme anderer oraler Antidiabetika abzusetzen.\nBei der Anwendung von Diabetol-1 in Kombination mit Insulin beträgt die tägliche Anfangsdosis 35 Tropfen. Die Insulindosis sollte anhand der Ergebnisse der Blutzuckermessungen angepasst werden.\nBei älteren Patienten, deren Nierenfunktion eingeschränkt sein kann, sollte die Dosis von Diabetol-1 anhand der Nierenfunktionswerte angepasst werden. Darüber hinaus sollten die Nierenfunktionswerte regelmäßig kontrolliert werden.\nBei Diabetes mellitus wird die regelmäßige Einnahme von Diabetol-1 empfohlen.',
        },
        {
          title: 'Gegenanzeigen',
          text: 'Individuelle Unverträglichkeit gegenüber einzelnen Bestandteilen. Während der Schwangerschaft und Stillzeit sollte vor der Anwendung ein Arzt konsultiert werden.',
        },
        {
          title: 'Nützliche Eigenschaften von Zimt',
          list: [
            'Zimt ist ein recht ernstzunehmendes Heilmittel; so unterstützt er beispielsweise die Gewichtsabnahme während einer Diät. Innerhalb von 4–5 Wochen senkt Zimt den Blutzuckerspiegel um 15–20 %;',
            'Die in Zimt enthaltenen Ballaststoffe (Zellulose) und das Kalium unterstützen die Ausscheidung schädlicher Stoffe aus dem Körper;',
            'Zimt ist ein ausgezeichnetes Mittel bei Beschwerden durch Durchfall und Verstopfung, da er das Verdauungssystem reguliert;',
            'Die regelmäßige Anwendung von Zimt senkt das Risiko für Schlaganfall und Herzinfarkt, wirkt sich positiv auf die Arbeit des Herzmuskels aus und senkt den Spiegel des „schlechten“ Cholesterins;',
            'Zimt lindert Hautreizungen, weshalb er häufig selbstgemachten Gesichtscremes beigemischt wird;',
            'Das spezifische Aroma von Zimt regt die Gehirnaktivität an und verbessert die Stimmung.',
          ],
        },
        {
          title: 'Nützliche Eigenschaften von Lorbeer',
          list: [
            'Das Lorbeerblatt (Laurus nobilis L.) enthält die Vitamine A, C, B und PP, Selen und Mangan, Magnesium und Phosphor, Kalium, Kalzium, Kupfer und viele weitere Mineralstoffe. Außerdem enthält es Gerbstoffe, ätherische Öle und organische Säuren, darunter Essigsäure, Ameisensäure, Buttersäure, Laurinsäure und Aminocapronsäure.',
            'Alle diese im Lorbeer enthaltenen organischen Säuren sind natürliche Antioxidantien. Antioxidantien im Körper tragen dazu bei, den Alterungsprozess und die oxidativen Reaktionen, die eine vorzeitige Alterung verursachen, zu verlangsamen. Aufgrund ihrer antioxidativen Eigenschaften wirken Nahrungssäuren entzündungshemmend und fiebersenkend, und einige von ihnen können sogar die Blutgerinnung verringern.',
            'Vitamine: Wie die große Mehrheit der Pflanzen enthält das Lorbeerblatt mehrere B-Vitamine (B1, B2, B3, B6, B9) und Vitamin C. Vitamin C ist für die Aufrechterhaltung der Immunabwehr verantwortlich und trägt zur Senkung des Blutzuckerspiegels bei.',
            'Mineralstoffe: Das Lorbeerblatt enthält Spurenelemente, die für die Gesundheit von Herz und Gefäßen unerlässlich sind – Kalzium, Magnesium und Kalium – sowie Mineralstoffe, die für die normale Funktion des zentralen Nervensystems unerlässlich sind – Eisen, Phosphor, Natrium, Kupfer, Selen und Zink.',
            'Lorbeerblätter enthalten Omega-3-Fettsäuren sowie die Vitamine A und B2, die für die Haut außerordentlich nützlich sind und als „Schönheitsvitamine“ bekannt sind. Ein Aufguss der Blätter kann in Form von Gesichtskompressen zur Behandlung von Rötungen und Akne verwendet werden. Vitamin B9 ist auch für den weiblichen Körper wichtig, insbesondere während der Schwangerschaft. Dieses Vitamin fördert die vollständige und rechtzeitige Entwicklung des Fötus, trägt zu einem reibungslosen Schwangerschaftsverlauf bei und unterstützt die Normalisierung des emotionalen und hormonellen Gleichgewichts vor und nach der Geburt.',
          ],
        },
        {
          title: 'Bei welchen Beschwerden ist das Lorbeerblatt hilfreich?',
          list: [
            'Erkrankungen des Magen-Darm-Trakts: Das Lorbeerblatt unterstützt die Verbesserung der Verdauung, das Abklingen von Entzündungen sowie die Linderung von Blähungen und Sodbrennen. Der regelmäßige Verzehr natürlicher Gewürze verringert die Schwere der Symptome bei entzündlichen Erkrankungen des Magen-Darm-Trakts.',
            'Diabetes: Wissenschaftliche Studien zeigen, dass das Lorbeerblatt bei regelmäßiger Verwendung in der Küche zur Normalisierung des Blutzuckerspiegels und zur Verbesserung der Insulinempfindlichkeit beiträgt.',
          ],
        },
        {
          title: 'Nützliche Eigenschaften der Brennnessel',
          text: 'Die Brennnessel zeichnet sich durch eine vielseitige pharmakologische Wirkung aus:',
          list: [
            'Hypoglykämisch: unterstützt die Regulierung des Blutzuckerspiegels.',
            'Entzündungshemmend: verringert Entzündungsprozesse im Körper, besonders wirksam bei Entzündungen der Gelenke und des Urogenitalsystems.',
            'Harntreibend: unterstützt die Ausscheidung überschüssiger Flüssigkeit und von Giftstoffen aus dem Körper, nützlich bei Ödemen sowie bei Problemen der Nieren und der Harnwege.',
            'Blutbildend: dank des hohen Gehalts an Eisen und Chlorophyll trägt sie zur Erhöhung des Hämoglobinspiegels bei und wird zur Behandlung von Blutarmut eingesetzt.',
            'Blutstillend (hämostatisch): dank Vitamin K und Gerbstoffen beschleunigt sie die Blutgerinnung und wird bei Gebärmutter-, Nasen- und Magen-Darm-Blutungen eingesetzt.',
            'Antioxidativ: dank Flavonoiden und Vitaminen schützt sie die Zellen vor den schädlichen Auswirkungen freier Radikale.',
            'Antirheumatisch: verringert Schmerzen und Entzündungen bei Gelenkerkrankungen.',
            'Immunmodulierend: stärkt das Immunsystem und hilft dem Körper bei der Abwehr von Infektionen.',
            'Kosmetisch: verbessert den Zustand von Haut und Haaren, stärkt die Haarwurzeln und beugt Haarausfall vor.',
          ],
        },
        {
          title: 'Nützliche Eigenschaften der Heidelbeere',
          list: [
            'Die Heidelbeere wirkt antioxidativ, antiseptisch, hämostatisch (blutstillend) und antidiabetisch. Sie wird in der Phytotherapie aktiv eingesetzt. Die Verwendung der Heidelbeere in pflanzlichen Arzneimitteln ist vom Ausschuss für pflanzliche Arzneimittel (einem Fachgremium der EMA – der Europäischen Arzneimittel-Agentur) zugelassen. Mehrere Studien haben bestätigt, dass der regelmäßige Verzehr von Heidelbeeren das Risiko, an Diabetes zu erkranken, senken kann.',
            'So schreiben beispielsweise finnische Forscher, dass die Heidelbeere dank ihres hohen Anthocyangehalts den Blutzuckerspiegel und die Insulinsekretion positiv beeinflusst.',
            'Menschen mit Diabetes verzichten häufig auf fruktosereiches Obst und Beeren. Nach einer siebenjährigen Studie kamen Wissenschaftler zu dem Schluss, dass dies ein Fehler ist – wer in Maßen frisches Obst isst, ist weniger durch diabetesbedingte Folgeerkrankungen gefährdet.',
          ],
        },
        {
          title: 'Darreichungsform',
          list: [
            'Primärverpackung: 200 ml, 100 ml, 50 ml, 25 ml, in dunkelorangefarbenen PET-Flaschen',
            'Sekundärverpackung: 1 Flasche, Gebrauchsanweisung und Pappschachtel',
          ],
        },
        {
          title: 'Lagerungsbedingungen',
          text: 'Vor Licht geschützt und für Kinder unzugänglich bei einer Temperatur von nicht mehr als 25°C aufbewahren.',
        },
        {
          title: 'Haltbarkeit',
          text: '2 Jahre. Nach Ablauf des auf der Verpackung angegebenen Datums darf das Produkt nicht mehr verwendet werden.',
        },
        {
          title: 'Hersteller',
          text: 'FITOFARM-2024 LLC\nwww.fitofarm2024.ge\nTel.: +995 599 14 21 18, +995 598 16 47 45\nE-Mail: info@fitofarm2024.ge\nGeorgien, Tbilisi, Tsereteli-Allee 142',
        },
      ],
    },
  },
  images: [],
};

function ProductDiabetol() {
  const { t, i18n } = useTranslation();
  const lang = resolveLang(i18n.language);

  const { useFakeLoader } = useLoader();
  useEffect(() => useFakeLoader(), []);

  const product = PRODUCT;
  const handle = product.handle;

  useDocumentTitle(
    product.title?.[lang] ? `${product.title[lang]} — ${t('seo.productSingle')}` : undefined
  );
  useMetaDescription(product.shortDescription?.[lang]);
  const [ratingSummary, refreshRatingSummary] = useProductRatingSummary(handle);
  useProductSchema(product, lang, ratingSummary);

  const {
    title,
    brandName,
    characteristics = {},
    shortDescription,
    fullAnnotation = {},
    images = [],
  } = product;
  const annotationForLang = fullAnnotation[lang];

  const annotationData = annotationForLang?.sections
    ? {
        name: brandName?.[lang]?.primary,
        nameLatin: brandName?.[lang]?.secondary,
        category: annotationForLang.category,
        form: annotationForLang.form,
        lead: annotationForLang.lead,
        sections: annotationForLang.sections,
      }
    : null;

  return (
    <>
      <div className="product-single">
        <div className="product-single__gallery">
          {images[0] && (
            <img
              className="product-single__image"
              src={images[0]}
              alt={title?.[lang]}
              loading="lazy"
            />
          )}
        </div>

        <div className="product-single__info">
          <h3 className="product-single__title">{title?.[lang]}</h3>

          <RatingBadge
            summary={ratingSummary}
            href="#ratings"
            variant="product"
          />

          <h4 className="product-single__section-title">{t('productSingle.characteristics')}</h4>

          <table className="product-single__specs">
            <tbody>
              {SPEC_ROWS.map(({ key, label }) => {
                if (key === 'status') {
                  return (
                    <tr
                      className="product-single__specs-row product-single__specs-row--status"
                      key={key}
                    >
                      <th className="product-single__specs-label">{label[lang]}</th>
                      <td className="product-single__specs-value">
                        {BUY_LABEL[lang]}{' '}
                        <a
                          className="product-single__specs-link"
                          href={OFFICE.url}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {t(OFFICE.addressKey)}
                        </a>
                      </td>
                    </tr>
                  );
                }
                const raw = characteristics[key];
                if (!raw) return null;
                const value = Array.isArray(raw[lang]) ? raw[lang].join(', ') : raw[lang];
                if (!value) return null;
                const rowClass =
                  key === 'status'
                    ? 'product-single__specs-row product-single__specs-row--status'
                    : 'product-single__specs-row';
                return (
                  <tr
                    className={rowClass}
                    key={key}
                  >
                    <th className="product-single__specs-label">{label[lang]}</th>
                    <td className="product-single__specs-value">{value}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <h4 className="product-single__section-title">{t('productSingle.shortDesc')}</h4>
          <h5 className="product-single__description">{shortDescription?.[lang]}</h5>

          <h4 className="product-single__section-title">
            {t('productSingle.buyHere', { defaultValue: 'შეიძინეთ აქ:' })}
          </h4>
          <div className="product-single__map">
            <div className="product-single__map-frame">
              <span
                className="product-single__map-bg"
                aria-hidden="true"
              />
              <a
                className="product-single__map-card"
                href={OFFICE.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <span
                  className="product-single__map-pin"
                  aria-hidden="true"
                >
                  <i className="bi bi-geo-alt-fill" />
                </span>
                <span className="product-single__map-cta">{MAP_CTA[lang]}</span>
                <i
                  className="bi bi-arrow-up-right product-single__map-arrow"
                  aria-hidden="true"
                />
                <span className="product-single__sr-only">{NEW_TAB[lang]}</span>
              </a>
            </div>
            <p className="product-single__map-address">{t(OFFICE.addressKey)}</p>
          </div>

          {annotationData && (
            <a
              className="product-single__link"
              href="#full-anotation"
            >
              {t('productSingle.fullAnnotation')}
            </a>
          )}
        </div>
      </div>

      {annotationData && <ProductAnnotation data={annotationData} />}

      <Disclaimer />

      <section
        className="product-ratings"
        id="ratings"
      >
        <div className="product-ratings__head">
          <h2>{t('ratings.productSectionTitle')}</h2>
        </div>
        <RatingsPanel
          productHandle={handle}
          summary={ratingSummary}
          onCreated={refreshRatingSummary}
        />
      </section>
    </>
  );
}

export default ProductDiabetol;