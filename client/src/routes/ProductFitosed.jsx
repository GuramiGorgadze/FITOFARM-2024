import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useLoader } from '../context/LoaderContext';
import { ProductAnnotation, Disclaimer, RatingBadge, RatingsPanel } from '../components';
import useMetaDescription from '../hooks/useMetaDescription';
import useDocumentTitle from '../hooks/useDocumentTitle';
import useProductSchema from '../hooks/useProductSchema';
import useProductRatingSummary from '../hooks/useProductRatingSummary';

// Pharmacy logos: drop the files in this folder (adjust the path / extension if yours differ)
import aversiLogo from '../assets/pharmacies/aversi.png';
import pspLogo from '../assets/pharmacies/psp.png';
import gpcLogo from '../assets/pharmacies/gpc.png';
import pharmadepotLogo from '../assets/pharmacies/pharmadepot.png';

const SUPPORTED_LANGS = ['ka', 'en', 'ru', 'de'];

function resolveLang(lng) {
  if (!lng) return 'ka';
  const short = lng.split('-')[0];
  return SUPPORTED_LANGS.includes(short) ? short : 'ka';
}

const PHARMACIES = [
  {
    id: 'aversi',
    name: 'Aversi',
    logo: aversiLogo,
    url: 'https://www.aversi.ge/ka/aversi/act/drugDet/?MatID=144463',
  },
  {
    id: 'psp',
    name: 'PSP',
    logo: pspLogo,
    url: 'https://psp.ge/მედიკამენტები/ნევროლოგია/დამამშვიდებელი-წამალი/ფიტოსედი-phytosed-25მლ.html',
  },
  {
    id: 'gpc',
    name: 'GPC',
    logo: gpcLogo,
    url: 'https://gpc.ge/ka/details/food-supplements/neurology-and-psych/fitosedi-wveTebi-oraluri-25ml-1?product=64275',
  },
  {
    id: 'pharmadepot',
    name: 'PharmaDepot',
    logo: pharmadepotLogo,
    url: 'https://pharmadepot.ge/ka/details/food-supplements/neurology-and-psych/fitosedi-wveTebi-oraluri-25ml-1?product=209675',
  },
];

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
  handle: 'fitosed-25ml',
  title: {
    ka: 'ფიტოსედი 25 მლ',
    en: 'Fitosed 25 ml',
    ru: 'Фитосед 25 мл',
    de: 'Fitosed 25 ml',
  },
  brandName: {
    ka: { primary: 'ფიტოსედი', secondary: 'FITOSEDUM' },
    en: { primary: 'PHYTOSED', secondary: 'PHYTOSED®' },
    ru: { primary: 'ФИТОСЕД', secondary: 'PHYTOSED®' },
    de: { primary: 'PHYTOSED', secondary: 'PHYTOSED®' },
  },
  characteristics: {
    pharmacologicalGroup: {
      ka: 'მცენარეული წარმოშობის სედატიური და სპაზმოლიდური საშუალება.',
      en: 'Sedative and antispasmodic agent of plant origin.',
      ru: 'седативное и спазмолитическое средство растительного происхождения.',
      de: 'Sedatives und krampflösendes Mittel pflanzlichen Ursprungs.',
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
      ka: 'III ჯგუფი ურეცეპტო',
      en: 'Group III, over-the-counter',
      ru: 'III группа, безрецептурный отпуск',
      de: 'Gruppe III, rezeptfrei',
    },
    status: {
      ka: 'შეიძინეთ: PSP, ავერსი, GPC, ფარმადეპო',
      en: 'Available at: PSP, Aversi, GPC, Pharmadepot',
      ru: 'Можно приобрести в аптеках PSP, Aversi, GPC, Pharmadepot.',
      de: 'Erhältlich bei: PSP, Aversi, GPC, Pharmadepot',
    },
    activeSubstance: {
      ka: ['კატაბალახა', 'შავბალახა', 'კუნელი', 'პიტნა'],
      en: ['Valerian', 'Motherwort', 'Hawthorn', 'Mint'],
      ru: ['валериана', 'пустырник', 'боярышник', 'мята'],
      de: ['Baldrian', 'Herzgespann', 'Weißdorn', 'Minze'],
    },
    dosage: {
      ka: '25მლ',
      en: '25 ml',
      ru: '25 мл',
      de: '25 ml',
    },
  },
  shortDescription: {
    ka: 'ჩვენება: შიგნით მისაღები წვეთები: ნევროზი, უძილობა, შაკიკი, კლიმაქტერული ნევროზი, კუჭ-ნაწლავის ტრაქტის სპაზმები. ამშვიდებს ნერვულ სისტემას.',
    en: 'Indication: Oral drops. Used for neurosis, insomnia, migraine, climacteric neurosis, and gastrointestinal spasms. Calms the nervous system.',
    ru: 'Показания: капли для приёма внутрь. Применяются при неврозе, бессоннице, мигрени, климактерическом неврозе и желудочно-кишечных спазмах. Успокаивает нервную систему.',
    de: 'Anwendungsgebiet: Tropfen zur oralen Einnahme. Angewendet bei Neurosen, Schlaflosigkeit, Migräne, klimakterischer Neurose und gastrointestinalen Spasmen. Beruhigt das Nervensystem.',
  },
  fullAnnotation: {
    ka: {
      form: 'შიგნით მისაღები წვეთები',
      lead: 'ინიშნება კომპლექსურ თერაპიაში, როგორც დამხმარე საშუალება.',
      sections: [
        {
          title: 'შემადგენლობა',
          list: [
            'კატაბალახას ნაყენი 10 მლ',
            'შავბალახას ნაყენი 8 მლ',
            'კუნელის ნაყენი 5 მლ',
            'პიტნის ნაყენი 2 მლ',
          ],
        },
        {
          title: 'აღწერილობა',
          text: 'მომწვანო-მოყავისფრო გამჭირვალე სითხე, დამახასიათებელი სუნით და პიტნის გემოთი. დასაშვებია მცირეოდენი ნალექი.',
        },
        {
          title: 'ფარმაკოლოგიური ჯგუფი',
          text: 'მცენარეული წარმოშობის სედატიური და სპაზმოლიდური საშუალება.',
        },
        {
          title: 'ინიშნება კომპლექსური თერაპიისას',
          text: 'გულის ნევროზი, ვეგეტონევროზი, ნერვული აღგზნებადობა, შაკიკი, ნერვული დაძაბულობით გამოწვეული თავის ტკივილი, კლიმაქტერული ნევროზი, კუჭ-ნაწლავის ტრაქტის სპაზმები.',
        },
        {
          title: 'მიღების წესი და დოზირება',
          text: 'პერორალურად.\nმოზრდილები: 20 წვეთი ერთ მიღებაზე, 2-3-ჯერ დღეში. აუცილებლობის შემთხვევაში დოზა შეიძლება გაიზარდოს 30 წვეთამდე.',
        },
        {
          title: 'უკუჩვენება',
          text: 'მომატებული მგრძნობელობა მასში შემავალი კომპონენტების მიმართ.',
        },
        {
          title: 'გვერდითი მოვლენები',
          text: 'შესაძლებელია ალერგიული რეაქციები.',
        },
        {
          title: 'ურთიერთქმედება სხვა სამკურნალო საშუალებებთან',
          text: 'ფიტოსედის ჰიპერტენზიულ პრეპარატებთან ერთდროული მიღებისას შესაძლებელია ჰიპერტენზიული ეფექტის გაძლიერება.',
        },
        {
          title: 'ჭარბი დოზირება',
          text: 'შესაძლებელია ძილიანობა, თავბრუსხვევა, არტერიული ჰიპოტენზია.',
        },
        {
          title: 'ავტოსატრანსპორტო საშუალებების და მექანიზმების მართვა',
          text: 'ნაყენის გამოყენებისას აუცილებელია სიფრთხილის დაცვა ავტოსატრანსპორტო საშუალებების მართვის და მოძრავ მექანიზმებთან მუშაობის დროს.',
        },
        {
          title: 'გამოშვების ფორმა',
          list: [
            'პირველადი შეფუთვა: 25 მლ მუქ ნარინჯისფერ პეტ-ის ფლაკონში',
            'მეორეული შეფუთვა: 1 ფლაკონი გამოყენების ინსტრუქციასთან ერთად',
          ],
        },
        {
          title: 'შენახვის პირობები',
          text: 'სინათლისაგან დაცულ და ბავშვებისათვის მიუწვდომელ ადგილას, არაუმეტეს 25°C ტემპერატურაზე.',
        },
        {
          title: 'ვარგისიანობის ვადა',
          text: '5 წელი. აკრძალულია გამოყენება შეფუთვაზე აღნიშნული ვადის გასვლის შემდეგ.',
        },
        {
          title: 'აფთიაქიდან გაცემის წესი',
          text: 'ფარმაცევტული პროდუქციის ჯგუფი III. გაიცემა რეცეპტის გარეშე.',
        },
        {
          title: 'მწარმოებელი',
          text: 'შპს „ფიტოფარმ 2024“\nwww.fitofarm2024.ge\nტელ: +995 599 14 21 18, +995 598 16 47 45\nელ. ფოსტა: info@fitofarm2024.ge\nსაქართველო, ქ. თბილისი, წერეთლის 142',
        },
      ],
    },
    en: {
      category: 'Auxiliary Therapeutic Agent',
      form: 'Oral drops',
      lead: 'Prescribed as an adjunct in combination therapy',
      sections: [
        {
          title: 'Composition',
          list: [
            'Valerian tincture — 10 ml',
            'Motherwort tincture — 8 ml',
            'Hawthorn tincture — 5 ml',
            'Mint tincture — 2 ml',
          ],
        },
        {
          title: 'Description',
          text: 'A clear, greenish-brown liquid with a characteristic scent and taste of mint. A slight sediment is permissible.',
        },
        {
          title: 'Pharmacological group',
          text: 'Sedative and antispasmodic agent of plant origin.',
        },
        {
          title: 'Indications (as adjunct in combination therapy)',
          text: 'Cardiac neurosis, vegetative neurosis, nervous agitation, migraine, headache caused by nervous tension, climacteric neurosis, gastrointestinal spasms.',
        },
        {
          title: 'Method of administration and dosage',
          text: 'Oral use.\nAdults: 20 drops per dose, 2–3 times daily. If necessary, the dose may be increased to 30 drops.',
        },
        {
          title: 'Contraindications',
          text: 'Hypersensitivity to the components.',
        },
        {
          title: 'Side effects',
          text: 'Allergic reactions may occur.',
        },
        {
          title: 'Interaction with other medicinal products',
          text: 'Concurrent use of Phytosed with antihypertensive/hypertensive-affecting drugs may enhance the hypertensive effect.',
        },
        {
          title: 'Overdose',
          text: 'May cause drowsiness, dizziness, and arterial hypotension.',
        },
        {
          title: 'Effects on driving and operating machinery',
          text: 'Caution should be exercised when driving vehicles or operating moving machinery while taking this medication.',
        },
        {
          title: 'Form of release',
          list: [
            'Primary packaging: 25 ml glass or PET bottles of dark orange colour.',
            'Secondary packaging: 1 bottle together with instructions for use, in a cardboard box.',
          ],
        },
        {
          title: 'Storage conditions',
          text: 'Store protected from light, out of reach of children, at a temperature not exceeding 25°C.',
        },
        {
          title: 'Shelf life',
          text: '3 years. Do not use after the expiration date indicated on the packaging.',
        },
        {
          title: 'Pharmacy dispensing rules',
          text: 'Pharmaceutical product group III, dispensed without a prescription.',
        },
        {
          title: 'Manufacturer',
          text: 'FITOFARM-2024 LLC\nwww.fitofarm2024.ge\nTel.: +995 599 14 21 18, +995 598 16 47 45\nE-mail: info@fitofarm2024.ge\nGeorgia, Tbilisi, Tsereteli Ave. 142',
        },
      ],
    },
    de: {
      category: 'Ergänzendes Heilmittel',
      form: 'Tropfen zur oralen Einnahme',
      lead: 'Verordnet als unterstützendes Mittel im Rahmen einer Kombinationstherapie',
      sections: [
        {
          title: 'Zusammensetzung',
          list: [
            'Baldriantinktur — 10 ml',
            'Herzgespanntinktur — 8 ml',
            'Weißdorntinktur — 5 ml',
            'Minztinktur — 2 ml',
          ],
        },
        {
          title: 'Beschreibung',
          text: 'Klare Flüssigkeit von grünlich-bräunlicher Farbe mit charakteristischem Geruch und Minzgeschmack. Ein geringfügiger Bodensatz ist zulässig.',
        },
        {
          title: 'Pharmakologische Gruppe',
          text: 'Sedatives und krampflösendes Mittel pflanzlichen Ursprungs.',
        },
        {
          title:
            'Anwendungsgebiete (als unterstützendes Mittel im Rahmen einer Kombinationstherapie)',
          text: 'Herzneurose, vegetative Neurose, nervöse Erregung, Migräne, durch nervöse Anspannung verursachte Kopfschmerzen, klimakterische Neurose, gastrointestinale Spasmen.',
        },
        {
          title: 'Anwendung und Dosierung',
          text: 'Zum Einnehmen.\nErwachsene: 20 Tropfen pro Einnahme, 2–3 Mal täglich. Bei Bedarf kann die Dosis auf 30 Tropfen erhöht werden.',
        },
        {
          title: 'Gegenanzeigen',
          text: 'Überempfindlichkeit gegenüber den enthaltenen Bestandteilen.',
        },
        {
          title: 'Nebenwirkungen',
          text: 'Allergische Reaktionen sind möglich.',
        },
        {
          title: 'Wechselwirkungen mit anderen Arzneimitteln',
          text: 'Bei gleichzeitiger Einnahme von Phytosed mit blutdrucksteigernden (hypertensiven) Arzneimitteln kann deren blutdrucksteigernde Wirkung verstärkt werden.',
        },
        {
          title: 'Überdosierung',
          text: 'Schläfrigkeit, Schwindel und arterielle Hypotonie sind möglich.',
        },
        {
          title: 'Verkehrstüchtigkeit und Bedienen von Maschinen',
          text: 'Bei der Einnahme des Präparats ist beim Führen von Fahrzeugen und beim Bedienen von beweglichen Maschinen Vorsicht geboten.',
        },
        {
          title: 'Darreichungsform',
          list: [
            'Primärverpackung: 25 ml Flaschen aus dunkelorangefarbenem Glas oder PET.',
            'Sekundärverpackung: 1 Flasche zusammen mit der Gebrauchsanweisung in einer Kartonschachtel.',
          ],
        },
        {
          title: 'Lagerungsbedingungen',
          text: 'Vor Licht geschützt und für Kinder unzugänglich bei einer Temperatur von nicht mehr als 25°C aufbewahren.',
        },
        {
          title: 'Haltbarkeit',
          text: '3 Jahre. Nach Ablauf des auf der Verpackung angegebenen Datums darf das Produkt nicht mehr verwendet werden.',
        },
        {
          title: 'Abgaberegelung in Apotheken',
          text: 'Pharmazeutische Produktgruppe III, rezeptfrei erhältlich.',
        },
        {
          title: 'Hersteller',
          text: 'FITOFARM-2024 LLC\nwww.fitofarm2024.ge\nTel.: +995 599 14 21 18, +995 598 16 47 45\nE-Mail: info@fitofarm2024.ge\nGeorgien, Tbilisi, Tsereteli-Allee 142',
        },
      ],
    },
    ru: {
      category: 'Биологически активная добавка «НАСТОЙКА "4 ТРАВ" УСПОКОИТЕЛЬНАЯ»',
      form: 'Капли для приёма внутрь',
      lead: 'Рекомендуется в качестве биологически активной добавки — источника дубильных веществ (танинов) и гидроксикоричных кислот.',
      sections: [
        {
          title: 'Форма выпуска и объём',
          text: 'Жидкость в ПЭТ флаконе по 0,25 мл. Принимается по 25 капель с водой.',
        },
        {
          title: 'Состав',
          text: 'Валериана лекарственная (корневища с корнями), пустырник пятилопастный (трава), боярышник чёрный и красный (плоды), мята перечная (листья), сорбиновая кислота (консервант), вода питьевая.',
        },
        {
          title: 'Настойка «Успокоительная»: состав трав',
          list: [
            'Валериана лекарственная — 10 мл',
            'Пустырник пятилопастный — 8 мл',
            'Боярышник чёрный и красный — 5 мл',
            'Мята перечная — 2 мл',
          ],
        },
        {
          title: 'Рекомендации по применению',
          text: 'Взрослым — 3 раза в день во время еды, добавляя в воду или чай. Продолжительность приёма — 1 месяц. Перед приёмом рекомендуется проконсультироваться с врачом. Не является лекарственным средством.',
        },
        {
          title: 'Противопоказания',
          text: 'Индивидуальная непереносимость компонентов продукта, беременность, кормление грудью. С осторожностью применять при управлении транспортным средством и работе с машинами и оборудованием.',
        },
        {
          title: 'Содержание биологически активных веществ в суточной дозе (75 капель)',
          table: {
            columns: [
              'Биологически активные компоненты',
              'Содержание в суточной дозе (75 капель)',
              '% от адекватного уровня потребления¹',
            ],
            rows: [
              ['Дубильные вещества (в пересчете на танин)', '130 мг', '40'],
              ['Гидроксикоричные кислоты', '200', '95 ❄'],
            ],
            footnotes: [
              '¹ — согласно «Единым санитарно-эпидемиологическим и гигиеническим требованиям к товарам, подлежащим санитарно-эпидемиологическому надзору (контролю)» (Глава II, Раздел I, Приложение 5).',
              '❄ — не превышает верхний допустимый уровень потребления.',
            ],
          },
        },
        {
          title: 'Пищевая и энергетическая ценность',
          text: 'Пищевая и энергетическая ценность в суточной дозировке БАД не превышает 2% от средней суточной потребности человека в белках, жирах, углеводах и энергии.',
        },
        {
          title: 'Условия хранения',
          text: 'Хранить в сухом, защищённом от попадания прямых солнечных лучей и недоступном для детей месте при температуре не выше 25°C.',
        },
        {
          title: 'Срок годности',
          text: '2 года.',
        },
        {
          title: 'Реализация',
          text: 'Места реализации определяются национальным законодательством государств-членов Евразийского экономического союза.',
        },
        {
          title: 'Производитель',
          text: 'ООО «ФИТОФАРМ-2024»\nwww.fitofarm2024.ge\nТел.: +995 599 14 21 18, +995 598 16 47 45\nEmail: info@fitofarm2024.ge\nГрузия, г. Тбилиси, пр. Церетели, 142',
        },
      ],
    },
  },
  images: ['https://res.cloudinary.com/dw30o1zbo/image/upload/v1788246533/home.webp'],
};

function ProductFitosed() {
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
          <ul className="product-single__pharmacies">
            {PHARMACIES.map(({ id, name, logo, url }) => (
              <li
                className="product-single__pharmacy-item"
                key={id}
              >
                <a
                  className="product-single__pharmacy"
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <span className="product-single__pharmacy-logo-wrap">
                    <img
                      className="product-single__pharmacy-logo"
                      src={logo}
                      alt=""
                      loading="lazy"
                    />
                  </span>
                  <span className="product-single__pharmacy-name">{name}</span>
                  <span className="product-single__sr-only">
                    {t('productSingle.opensInNewTab', {
                      defaultValue: '(იხსნება ახალ ჩანართში)',
                    })}
                  </span>
                </a>
              </li>
            ))}
          </ul>

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

export default ProductFitosed;