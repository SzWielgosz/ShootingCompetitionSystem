import React, { useState } from "react";

export default function FAQ() {
  const faqData = [
    {
      id: 1,
      question: "Jak zarejestrować się na stronie?",
      answer:
        "W celu rejestracji na naszą stronę wybierz sekcję Zarejestruj się, wybierz interesującą cię rolę, wprowadź niezbędne informację a na koniec wciśnij przycisk Zarejestruj. Jeżeli wprowadzone dane będą prawidłowe, nastąpi zarejestrowanie użytkownika, które następnie można wykorzystać w czelu zalogowania się do systemu",
    },
    {
      id: 2,
      question: "Jak mogę przeglądać kalendarz zawodów strzeleckich?",
      answer:
        'Po zalogowaniu, przejdź do sekcji "Kalendarz zawodów", gdzie znajdziesz listę dostępnych zawodów. Możesz przeglądać zawody według daty i lokalizacji.',
    },
    {
      id: 3,
      question: "Jak mogę się zapisać na zawody strzeleckie?",
      answer:
        'Po znalezieniu interesującego cię zawodu w kalendarzu, kliknij na niego, a następnie wybierz opcję "Zapisz się". Upewnij się, że jesteś zalogowany jako uczestnik.',
    },
    {
      id: 4,
      question: "Czy mogę się wypisać z zawodów, na które się zapisałem?",
      answer:
        'Tak, w zakładce "Moje zawody" znajdziesz listę zawodów, na które się zapisałeś. Możesz tam odwołać swoją rejestrację.',
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
      <div key={question}>
        <div onClick={toggleOpen} style={{ cursor: "pointer" }}>
          <h3>{question}</h3>
        </div>
        {isOpen && <p>{answer}</p>}
      </div>
    );
  };

  return (
    <div>
      {faqData.map((item) => (
        <FAQItem key={item.id} question={item.question} answer={item.answer} />
      ))}
    </div>
  );
}
