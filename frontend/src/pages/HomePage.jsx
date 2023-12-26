import HomeCSS from "../styles/Home.module.css";

export default function HomePage() {
  return (
    <div className={HomeCSS.container}>
      <h1 className={HomeCSS.h1}>ZawodyStrzeleckie.pl</h1>

      <h2 className={HomeCSS.h2}>Nasza strona oferuje:</h2>
      <h3 className={HomeCSS.ol}>Przegląd kalendarza zawodów</h3>
      <p className={HomeCSS.p}>
        Sprawdź nasz aktualny kalendarz zawodów strzeleckich, aby być na bieżąco
        z nadchodzącymi eventami. Znajdziesz tu informacje o lokalnych i
        międzynarodowych zawodach
      </p>

      <h3 className={HomeCSS.ol}>Zapisy na zawody</h3>
      <p className={HomeCSS.p}>
        W prosty sposób zapisz się na interesujące Cię zawody. Dzięki
        intuicyjnemu interfejsowi, proces rejestracji jest szybki i wygodny.
        Doświadcz przyjemności rywalizacji na najwyższym poziomie!
      </p>

      <h3 className={HomeCSS.ol}>Tworzenie zawodów jako organizator</h3>
      <p className={HomeCSS.p}>
        Jesteś organizatorem? Na ZawodyStrzeleckie.pl masz możliwość łatwego
        tworzenia własnych zawodów. Zarządzaj nimi, przyciągaj uczestników i
        buduj społeczność strzelecką razem z nami.
      </p>

      <h3 className={HomeCSS.ol}>Zarządzanie stanem zawodów</h3>
      <p className={HomeCSS.p}>
        Monitoruj i aktualizuj informacje dotyczące przebiegu zawodów. Dzięki
        naszym narzędziom, efektywne zarządzanie stanem zawodów staje się łatwe
        i efektywne.
      </p>

      <h3 className={HomeCSS.ol}>Edycja profilu</h3>
      <p className={HomeCSS.p}>
        Dostosuj swój profil zgodnie z własnymi preferencjami. Dodawaj
        osiągnięcia, udostępniaj zdjęcia i dziel się swoją pasją z innymi
        członkami społeczności ZawodyStrzeleckie.pl.
      </p>

      <h3 className={HomeCSS.ol}>Rejestracja jako kandydat lub organizator</h3>
      <p className={HomeCSS.p}>
        Dołącz do społeczności ZawodyStrzeleckie.pl! Zarejestruj się jako
        kandydat, gotowy do udziału w zawodach, lub jako organizator, chcący
        tworzyć unikalne wydarzenia strzeleckie. Wybór należy do Ciebie!
      </p>

      <h3 className={HomeCSS.ol}>Logowanie</h3>
      <p className={HomeCSS.p}>
        Dostęp do pełnych funkcji ZawodyStrzeleckie.pl uzyskasz po zalogowaniu.
        Zaloguj się i wejdź do świata pasjonującej rywalizacji strzeleckiej!
      </p>
    </div>
  );
}
