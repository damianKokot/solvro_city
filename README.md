# JakDojade in solvro_city

### Aplikacja solvro_city została stworzona na potrzeby rekrutacji koła naukowego Solvro.

## Ogólne informacje

Aplikacja JakDojade in solvro_city ma za zadanie obsłużenie backendu do "nawigacji". 

## Wymagania
### 1. Konfiguracja bazy danych: 
W projekcie posłużono się lokalną wersją mongodb. 
Jest ona dostępna pod adresem: https://www.mongodb.com/download-center . Wybrano opję server w wersji 4.2.0 . 
Po pobraniu i zainstalowaniu mognodb należy dodać nowy path do zmiennych systemowych (mongo => Lokalizacja folderu /bin w folderze instalacji mongodb), a następnie skonfigurowaniu bazy danych w dany sposób:
1. W projekcie tworzymy folder dla bazę danych
2. Otwieramy konsolę i wpisujemy polecenie 
	mongod --dbpath [Ścieżka do utworzonego folderu]
, a następnie
	mongo
, po czym
	use SolvroCityDB
. Baza danych będzie utworzona, ale nie będzie widoczna, dopóki nic do niej "nie wrzucimy".
### 2. Zainstalowany nodejs:
	Pliki można pobrać pod linkiem: https://nodejs.org/en/download/

## Obsługa
W aplikacji możemy skorzystać z kilku routów:

/setup
Route do uzupełniania bazy danych. 
Wymagane jest podanie w body: 
{
	url: "[Link do naszych danych o przystanka w solvro city]"
}

/login /register
Routy do logowania się i rejestracji. 
Wymagane jest podanie w body:
{
	login: [login użytkownika],
	password: [hasło użytkownika]
}
##### Logowanie stanowczo nie należy do zbyt zaawansowanych i z pewnością wymaga poprawy. Niestety można wysłać zapytanie /stops i /path bez zalogowania się.

/stops
Wypisuje listę wszystkich przystanków w solvro city

/path
Wypisuje przystanki i dystans jaki należy pokonać aby dotrzeć do celu
Wymagane jest dodanie do linku:
?source=[Nazwa przystanku startowego]&target=[Nazwa przystanku końcowego]

## Wykorzystane technologie
	1. Node.js
	2. Express
	3. mongoDB
	4. algorytm Dijkstry znajdowania najkrótszej ścieżki w grafie
	5. Użycie kolejki priorytetowej za pomocją Struktury kopca


