// Функция для определения страны пользователя
async function detectUserCountry() {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    return data.country;
  } catch (error) {
    console.error('Не удалось определить страну:', error);
    return null;
  }
}

// Объект соответствия стран и языков
const countryToLanguage = {
  'RU': 'ru',    // Россия - русский
  'ID': 'id',    // Индонезия - индонезийский
  'MY': 'ms',    // Малайзия - малайский
  'VN': 'vi',    // Вьетнам - вьетнамский
};

// Функция получения рекомендуемого языка
function getRecommendedLanguage(countryCode) {
  return countryToLanguage[countryCode] || 'en'; // По умолчанию английский
}

// Функция показа языкового предложения
async function showLanguageSuggestion() {
  // Проверяем, не было ли уже показано предложение
  if (localStorage.getItem('languageSuggestionShown')) {
    return;
  }

  const countryCode = await detectUserCountry();
  const recommendedLang = getRecommendedLanguage(countryCode);
  const currentLang = document.documentElement.lang || getBrowserLanguage() || 'en';

  // Если текущий язык уже соответствует рекомендуемому - не показываем
  if (currentLang === recommendedLang) {
    return;
  }

  // Создаем модальное окно
  const modalHtml = `
    <div class="language-modal">
      <div class="modal-content">
        <h3>${getTranslation('language_suggestion_title', currentLang)}</h3>
        <p>${getTranslation('language_suggestion_text', currentLang, recommendedLang)}</p>
        <div class="buttons">
          <button class="accept-btn">${getTranslation('yes_switch', currentLang)}</button>
          <button class="decline-btn">${getTranslation('no_thanks', currentLang)}</button>
        </div>
      </div>
    </div>
  `;

  // Добавляем модальное окно в DOM
  document.body.insertAdjacentHTML('beforeend', modalHtml);

  // Обработчики кнопок
  document.querySelector('.accept-btn').addEventListener('click', () => {
    window.location.href = `/${recommendedLang}/`;
    localStorage.setItem('languageSuggestionShown', 'true');
  });

  document.querySelector('.decline-btn').addEventListener('click', () => {
    document.querySelector('.language-modal').remove();
    localStorage.setItem('languageSuggestionShown', 'true');
  });

  // Запоминаем, что показали предложение
  localStorage.setItem('languageSuggestionShown', 'true');
}

// Функция для получения перевода (упрощенная версия)
function getTranslation(key, currentLang, recommendedLang) {
  const translations = {
    language_suggestion_title: {
      en: "Would you like to switch language?",
      ru: "Хотите перейти на русскую версию?",
      id: "Ingin beralih ke bahasa Indonesia?",
      ms: "Mahu bertukar ke bahasa Melayu?",
      vi: "Bạn có muốn chuyển sang tiếng Việt?"
    },
    language_suggestion_text: {
      en: `We recommend using the ${recommendedLang === 'ru' ? 'Russian' : recommendedLang === 'id' ? 'Indonesian' : recommendedLang === 'ms' ? 'Malay' : recommendedLang === 'vi' ? 'Vietnamese' : 'English'} version.`,
      ru: "Мы рекомендуем использовать русскоязычную версию сайта.",
      id: "Kami merekomendasikan versi bahasa Indonesia.",
      ms: "Kami mengesyorkan versi bahasa Melayu.",
      vi: "Chúng tôi đề nghị sử dụng phiên bản tiếng Việt."
    },
    yes_switch: {
      en: "Yes, switch",
      ru: "Да, перейти",
      id: "Ya, beralih",
      ms: "Ya, tukar",
      vi: "Có, chuyển đổi"
    },
    no_thanks: {
      en: "No, thanks",
      ru: "Нет, спасибо",
      id: "Tidak, terima kasih",
      ms: "Tidak, terima kasih",
      vi: "Không, cảm ơn"
    }
  };

  return translations[key][currentLang] || translations[key]['en'];
}

function getBrowserLanguage() {
  return navigator.language || navigator.userLanguage;
}

document.addEventListener('DOMContentLoaded', () => {
  // Проверяем, нужно ли показывать предложение
  // (например, только для новых посетителей или раз в сессию)
  if (!sessionStorage.getItem('languageChecked')) {
    showLanguageSuggestion();
    sessionStorage.setItem('languageChecked', 'true');
  }
});