# Game Price Tracker v2 (MERN)
Game Price Tracker v2 to druga wersja aplikacji do porównywania cen gier w różnych sklepach internetowych.
Projekt został przepisany w architekturze MERN (MongoDB, Express.js, React, Node.js) w celu porównania różnych technologii backendowych i frontendowych.

Aplikacja umożliwia wyszukiwanie gier, porównywanie cen, zarządzanie kontem użytkownika oraz przeglądanie historii wyszukiwań.


## Autor: Mateusz Bartosiewicz

---

# Technologie

## Frontend
- React
- React Router DOM
- CSS Modules
- Axios

## Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (autoryzacja)
- bcrypt (hashowanie haseł)
- Joi + joi-password-complexity (walidacja)

## Zewnętrzne API
- RAWG API — dane o grach
- CheapShark API — ceny gier

---

# Funkcjonalności
- Rejestracja i logowanie użytkownika
- Autoryzacja JWT
- Wyszukiwanie gier
- Porównywanie cen z różnych sklepów
- Historia wyszukiwań
- Zarządzanie kontem użytkownika
- Edycja danych użytkownika
- Zmiana hasła
- Usuwanie konta
- Lista użytkowników
- Integracja z zewnętrznymi API

--- 

# Struktura projektu
```
client/
server/
```
- client — frontend React
- server — backend Node.js + Express

---

# Uruchomienie projektu

## Backend
```
cd server
npm install
npm run dev
```
Utwórz plik .env w folderze server:
```
DB=mongodb://localhost/auth_react
JWTPRIVATEKEY=twoj_tajny_klucz
SALT=10
RAWG_KEY=twoj_klucz_api
```
## Frontend
```
cd client
npm install
npm start
```
API Endpoints

--- 

## Autoryzacja
POST /api/users
POST /api/auth

## Użytkownicy
GET /api/users
GET /api/users/me
PUT /api/users/me
DELETE /api/users/me
DELETE /api/users/:id

## Gry
GET /api/games/search?title=

# Historia
GET /api/history
DELETE /api/history
DELETE /api/history/:id
Wersje projektu

---

Projekt został wykonany w dwóch wersjach:

Game Price Tracker v1 — Spring Boot + React
Game Price Tracker v2 — MERN (MongoDB, Express, React, Node.js)

Celem było porównanie różnych technologii i architektur.

--- 

# Autor

Mateusz Bartosiewicz — 2025