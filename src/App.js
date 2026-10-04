import { useEffect, useState } from "react";
import "./App.css";
import { alphabet, codeNum } from "./cipherData";

const translations = {
  uk: {
    title: "Шифрування тексту",
    subtitle:
      "Зашифруйте або розшифруйте текст за допомогою власного алгоритму.",
    language: "Мова",
    inputLabel: "Вхідний текст",
    inputPlaceholder: "Введіть або вставте текст...",
    encrypt: "Зашифрувати",
    decrypt: "Розшифрувати",
    paste: "Вставити",
    copy: "Копіювати",
    resultLabel: "Результат",
    outputPlaceholder: "Результат з’явиться тут...",
    copied: "Результат скопійовано.",
    pasted: "Текст вставлено.",
    copyError: "Не вдалося скопіювати текст.",
    pasteError: "Не вдалося прочитати буфер обміну.",
  },

  ru: {
    title: "Шифрование текста",
    subtitle:
      "Зашифруйте или расшифруйте текст с помощью собственного алгоритма.",
    language: "Язык",
    inputLabel: "Исходный текст",
    inputPlaceholder: "Введите или вставьте текст...",
    encrypt: "Зашифровать",
    decrypt: "Расшифровать",
    paste: "Вставить",
    copy: "Копировать",
    resultLabel: "Результат",
    outputPlaceholder: "Результат появится здесь...",
    copied: "Результат скопирован.",
    pasted: "Текст вставлен.",
    copyError: "Не удалось скопировать текст.",
    pasteError: "Не удалось прочитать буфер обмена.",
  },

  en: {
    title: "Text Encryption",
    subtitle: "Encrypt or decrypt text using a custom encryption algorithm.",
    language: "Language",
    inputLabel: "Input text",
    inputPlaceholder: "Enter or paste text...",
    encrypt: "Encrypt",
    decrypt: "Decrypt",
    paste: "Paste",
    copy: "Copy",
    resultLabel: "Result",
    outputPlaceholder: "The result will appear here...",
    copied: "Result copied.",
    pasted: "Text pasted.",
    copyError: "Unable to copy the text.",
    pasteError: "Unable to read the clipboard.",
  },

  de: {
    title: "Textverschlüsselung",
    subtitle:
      "Text mit einem eigenen Algorithmus verschlüsseln oder entschlüsseln.",
    language: "Sprache",
    inputLabel: "Eingabetext",
    inputPlaceholder: "Text eingeben oder einfügen...",
    encrypt: "Verschlüsseln",
    decrypt: "Entschlüsseln",
    paste: "Einfügen",
    copy: "Kopieren",
    resultLabel: "Ergebnis",
    outputPlaceholder: "Das Ergebnis erscheint hier...",
    copied: "Ergebnis kopiert.",
    pasted: "Text eingefügt.",
    copyError: "Text konnte nicht kopiert werden.",
    pasteError: "Zwischenablage konnte nicht gelesen werden.",
  },
};

const languageNames = {
  uk: "UA",
  ru: "RU",
  en: "EN",
  de: "DE",
};

function getShift(position) {
  if (codeNum.length === 0) {
    return 0;
  }

  return Number(codeNum[position % codeNum.length]) || 0;
}

function encryptCharacter(character, position) {
  const currentIndex = alphabet.indexOf(character);

  if (currentIndex === -1) {
    return character;
  }

  const shift = getShift(position);
  const newIndex = (currentIndex + shift) % alphabet.length;

  return alphabet[newIndex];
}

function decryptCharacter(character, position) {
  const currentIndex = alphabet.indexOf(character);

  if (currentIndex === -1) {
    return character;
  }

  const shift = getShift(position);

  const newIndex = (currentIndex - shift + alphabet.length) % alphabet.length;

  return alphabet[newIndex];
}

function encryptText(text) {
  return Array.from(text)
    .map((character, index) => encryptCharacter(character, index))
    .join("");
}

function decryptText(text) {
  return Array.from(text)
    .map((character, index) => decryptCharacter(character, index))
    .join("");
}
const getInitialLanguage = () => {
  const savedLanguage = localStorage.getItem("language");

  if (savedLanguage) {
    return savedLanguage;
  }

  const browserLanguage = navigator.language.split("-")[0].toLowerCase();

  const supportedLanguages = ["uk", "ru", "en", "de"];

  return supportedLanguages.includes(browserLanguage) ? browserLanguage : "en";
};
function App() {
  const [inputText, setInputText] = useState("");
  const [outputText, setOutputText] = useState("");

  const [language, setLanguage] = useState(getInitialLanguage);

  const [message, setMessage] = useState("");

  const t = translations[language];

  useEffect(() => {
    localStorage.setItem("language", language);
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    if (!message) {
      return;
    }

    const timer = setTimeout(() => {
      setMessage("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [message]);

  const handleEncryptClick = () => {
    setOutputText(encryptText(inputText));
    setMessage("");
  };

  const handleDecryptClick = () => {
    setOutputText(decryptText(inputText));
    setMessage("");
  };

  const handlePasteClick = async () => {
    try {
      const text = await navigator.clipboard.readText();

      setInputText(text);
      setMessage(t.pasted);
    } catch (error) {
      console.error(error);
      setMessage(t.pasteError);
    }
  };

  const handleCopyClick = async () => {
    if (!outputText) {
      return;
    }

    try {
      await navigator.clipboard.writeText(outputText);
      setMessage(t.copied);
    } catch (error) {
      console.error(error);
      setMessage(t.copyError);
    }
  };

  return (
    <main className="app-shell">
      <section className="app-card">
        <header className="app-header">
          <div className="heading">
            <span className="eyebrow">TEXT ENCRYPTION</span>

            <h1>{t.title}</h1>

            <p>{t.subtitle}</p>
          </div>

          <div className="language-area">
            <span className="language-title">{t.language}</span>

            <div
              className="language-switcher"
              role="group"
              aria-label={t.language}
            >
              {Object.keys(languageNames).map((languageCode) => (
                <button
                  key={languageCode}
                  type="button"
                  className={`language-button ${
                    language === languageCode ? "active" : ""
                  }`}
                  onClick={() => setLanguage(languageCode)}
                  aria-pressed={language === languageCode}
                >
                  {languageNames[languageCode]}
                </button>
              ))}
            </div>
          </div>
        </header>

        <div className="workspace">
          <div className="text-block">
            <label htmlFor="input">{t.inputLabel}</label>

            <textarea
              id="input"
              value={inputText}
              onChange={(event) => setInputText(event.target.value)}
              placeholder={t.inputPlaceholder}
              spellCheck="false"
            />
          </div>

          <div className="action-bar">
            <div className="main-actions">
              <button
                type="button"
                className="primary-button"
                onClick={handleEncryptClick}
              >
                {t.encrypt}
              </button>

              <button
                type="button"
                className="primary-button"
                onClick={handleDecryptClick}
              >
                {t.decrypt}
              </button>
            </div>

            <div className="secondary-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={handlePasteClick}
              >
                {t.paste}
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={handleCopyClick}
                disabled={!outputText}
              >
                {t.copy}
              </button>
            </div>
          </div>

          <div className="text-block">
            <label htmlFor="output">{t.resultLabel}</label>

            <textarea
              id="output"
              value={outputText}
              placeholder={t.outputPlaceholder}
              readOnly
              spellCheck="false"
            />
          </div>

          <div
            className={`status-message ${message ? "visible" : ""}`}
            aria-live="polite"
          >
            {message}
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
