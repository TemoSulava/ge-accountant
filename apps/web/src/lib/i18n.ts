import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "../i18n/en.json";
import ka from "../i18n/ka.json";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    resources: {
      en: { translation: en },
      ka: { translation: ka }
    },
    lng: "ka",
    fallbackLng: "ka",
    interpolation: {
      escapeValue: false
    }
  });
}

export default i18n;
