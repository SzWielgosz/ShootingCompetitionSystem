import React, { useState } from "react";
import FAQCSS from "../styles/FAQ.module.css";

export default function FAQ() {
  const faqData = [
    {
      id: 1,
      question: "Jak zarejestrować się na stronie?",
      answer:
        "W celu rejestracji na naszą stronę wybierz sekcję 'Zarejestruj się', wybierz interesującą cię rolę, wprowadź niezbędne informację a na koniec wciśnij przycisk 'Zarejestruj się'. Jeżeli wprowadzone dane będą prawidłowe, nastąpi zarejestrowanie użytkownika, które następnie można wykorzystać w celu zalogowania się do systemu",
    },
    {
      id: 2,
      question: "Jak mogę przeglądać kalendarz zawodów strzeleckich?",
      answer:
        'Przejdź do sekcji "Kalendarz", gdzie znajdziesz listę dostępnych zawodów. Możesz przeglądać zawody z zastosowaniem zaimplementowanych filtrow.',
    },
    {
      id: 3,
      question: "Jak mogę się zapisać na zawody strzeleckie?",
      answer:
        'Zaloguj się jako kandydat. Przejdź do sekcji "Kalendarz" i znajdź interesujące cię zawody. Następnie wejdź w szczegóły zawodów. Jeżeli będziesz zalogowany, a ilość miejsc nie została jeszcze zapełniona, to wyświetli się przycisk "Dołącz"',
    },
    {
      id: 4,
      question: "Czy mogę się wypisać z zawodów, na które się zapisałem?",
      answer:
        'Tak, możesz tego dokonać bezpośrednio po zapisie lub w zakładce "Moje zawody" po znalezieniu zawodów z listy tych, na które się zapisałeś. Możesz tam odwołać swoją rejestrację.',
    },
    {
      id: 5,
      question:
        "Czy istnieje możliwość dostosowania mojego profilu jako uczestnika/organizatora?",
      answer: 'Tak, w sekcji "Moj Profil" możesz dostosować swoje dane.',
    },
  ];

  const FAQItem = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleOpen = () => {
      setIsOpen(!isOpen);
    };

    return (
      <div className={FAQCSS.faqItem}>
        <div className={FAQCSS.question} onClick={toggleOpen}>
          <h3>{question}</h3>
        </div>
        <div className={`${FAQCSS.answer} ${isOpen ? FAQCSS.open : ""}`}>
          <p>{answer}</p>
        </div>
      </div>
    );
  };

  return (
    <div className={FAQCSS.container}>
      {faqData.map((item) => (
        <FAQItem key={item.id} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
