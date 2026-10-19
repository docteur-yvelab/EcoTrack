# EcoTrack 🇨🇲

**Système de gestion de flotte de vélos électriques à Yaoundé** — Application full-stack pour le suivi temps réel, la géolocalisation et la maintenance de vélos en libre-service.

---

## 📋 Vue d'ensemble

EcoTrack est une plateforme de gestion de flotte de vélos électriques conçue pour le contexte urbain de Yaoundé (Cameroun). Elle permet aux opérateurs de visualiser la flotte sur une carte interactive, surveiller les niveaux de batterie, ajouter/supprimer des vélos, et uploader des photos — le tout avec des mises à jour temps réel via WebSocket.

---

## 🏗️ Architecture

```
EcoTrack/
├── backend/                 # Spring Boot 4.0 (Java 21)
│   └── EcoTrack/
│       ├── src/main/java/Yve/EcoTrack/
│       │   ├── config/      # Web, Security, WebSocket
│       │   ├── controller/  # REST API (BikeController)
│       │   ├── model/       # Entités JPA (Bike, BikeStatus)
│       │   ├── repository/  # Spring Data JPA
│       │   └── data/        # Initialisation données test
│       └── src/main/resources/
│           └── application.properties
└── frontend/                # React 19 + Vite + Tailwind CSS 4
    ├── src/
    │   ├── components/
    │   │   ├── BikeMap.jsx  # Composant principal (carte + UI)
    │   │   ├── Footer.jsx   # Barre de statut + contacts
    │   │   └── Marker.jsx   # (Réservé)
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    └── package.json
```

---

## 🛠️ Stack Technique

| Couche | Technologies |
|--------|--------------|
| **Backend** | Spring Boot 4.0.1, Java 21, Spring Data JPA, Spring Web MVC, Spring WebSocket (STOMP/SockJS), Spring Security, H2 Database (dev), PostgreSQL (prod), Lombok |
| **Frontend** | React 19, Vite 7, Tailwind CSS 4, Leaflet + React-Leaflet, Axios, Lucide React, SockJS Client, STOMPJS |
| **Build/Deploy** | Maven (backend), npm/Vite (frontend) |

---

## ✨ Fonctionnalités

### Backend (API REST + WebSocket)

- **CRUD Vélos** : `GET/POST/PUT/DELETE /api/bikes`
- **Mise à jour batterie** : `PUT /api/bikes/{id}/battery` → diffusion temps réel via `/topic/bikes`
- **Upload d'images** : `POST /api/bikes/upload` (multipart, max 10MB) → servi statiquement sous `/uploads/**`
- **WebSocket STOMP** : Endpoint `/ws-ecotrack` (SockJS) — topics `/topic/bikes` et `/topic/bikes/delete`
- **Sécurité** : Basic Auth (utilisateur `yve` / `ecotrack237`), CORS configuré pour `localhost:5173`
- **Console H2** : Accessible sur `/h2-console` (dev)
- **Données de démo** : 20 vélos générés au démarrage autour de Yaoundé (Bastos, Tsinga, Mvan)

### Frontend (React + Leaflet)

- **Carte interactive** : OpenStreetMap (style Humanitarian) centrée sur Yaoundé (3.848, 11.502)
- **Marqueurs dynamiques** : Vert (batterie ≥ 20%), Rouge (batterie < 20%)
- **Popups riches** : Photo, modèle, numéro de série, barre de batterie, bouton suppression
- **Sidebar** : Liste filtrable (tous / batteries faibles), centrage sur clic
- **Modal d'ajout** : Formulaire complet + **drag & drop upload d'image** (aperçu nom de fichier)
- **Footer** : Stats flotte, alertes batterie, liens contact (téléphone, GitHub), utilisateur connecté
- **Auth HTTP Basic** : Header `Authorization` injecté globalement via Axios

---

## 🚀 Démarrage Rapide

### Prérequis

- **Java 21+** (JDK)
- **Maven 3.9+** (ou `./mvnw` wrapper)
- **Node.js 18+** et **npm**
- (Optionnel) **PostgreSQL** pour la production

### 1. Backend

```bash
cd backend/EcoTrack
./mvnw spring-boot:run
```

- API : http://localhost:8081/api/bikes
- WebSocket : ws://localhost:8081/ws-ecotrack
- H2 Console : http://localhost:8081/h2-console (JDBC: `jdbc:h2:mem:ecotrackdb`, user: `sa`, pas de mot de passe)
- Auth : `yve` / `ecotrack237`

### 2. Frontend

```bash
cd frontend
npm install
npm run dev
```

- App : http://localhost:5173

---

## 📡 API Reference

### Base URL
```
http://localhost:8081/api/bikes
```

### Authentification
Tous les endpoints (sauf `/uploads/**`) requièrent **Basic Auth** :
```
Authorization: Basic eXZlOmVjb3RyYWNrMjM3  # base64("yve:ecotrack237")
```

### Endpoints

| Méthode | Endpoint | Description |
|---------|----------|-------------|
| `GET` | `/` | Liste tous les vélos |
| `POST` | `/` | Crée un vélo (JSON body) |
| `PUT` | `/{id}/battery` | Met à jour la batterie (body: `int`) → push WebSocket |
| `DELETE` | `/{id}` | Supprime un vélo → push WebSocket |
| `POST` | `/upload` | Upload image (multipart `file`) → retourne URL complète |

### Exemple Bike (JSON)
```json
{
  "serialNumber": "YDE-1025",
  "model": "Yéti-Bike",
  "batteryLevel": 85,
  "latitude": 3.8480,
  "longitude": 11.5021,
  "status": "AVAILABLE",
  "imageUrl": "http://localhost:8081/uploads/1766405513853_photo.jpg"
}
```

### Statuts (`BikeStatus`)
- `AVAILABLE` — Disponible à la location
- `IN_USE` — En cours d'utilisation
- `MAINTENANCE` — En maintenance

---

## 🔌 WebSocket (Temps Réel)

### Connexion
```
ws://localhost:8081/ws-ecotrack  (SockJS)
```

### Abonnements (Client → `/topic/...`)

| Topic | Payload | Déclencheur |
|-------|---------|-------------|
| `/topic/bikes` | Objet `Bike` complet | Mise à jour batterie (`PUT /battery`) |
| `/topic/bikes/delete` | `Long` (ID) | Suppression (`DELETE /{id}`) |

### Exemple Client (JS)
```js
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const client = new Client({
  webSocketFactory: () => new SockJS('http://localhost:8081/ws-ecotrack'),
  onConnect: () => {
    client.subscribe('/topic/bikes', (msg) => {
      const bike = JSON.parse(msg.body);
      console.log('🔋 Batterie mise à jour :', bike);
    });
    client.subscribe('/topic/bikes/delete', (msg) => {
      const id = JSON.parse(msg.body);
      console.log('🗑️ Vélo supprimé :', id);
    });
  }
});
client.activate();
```

---

## 🗄️ Base de Données

### Schéma (H2 / PostgreSQL)
```sql
CREATE TABLE bikes (
    id BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    serial_number VARCHAR(255) UNIQUE NOT NULL,
    model VARCHAR(255),
    battery_level INT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    image_url VARCHAR(500),
    status VARCHAR(20) CHECK (status IN ('AVAILABLE','IN_USE','MAINTENANCE'))
);
```

### Migration Prod (PostgreSQL)
Dans `application.properties` (ou `application-prod.properties`) :
```properties
spring.datasource.url=jdbc:postgresql://host:5432/ecotrack
spring.datasource.username=postgres
spring.datasource.password=***
spring.jpa.database-platform=org.hibernate.dialect.PostgreSQLDialect
spring.jpa.hibernate.ddl-auto=update
```

---

## 🔐 Sécurité

- **Basic Auth** statique en mémoire (`InMemoryUserDetailsManager`)
- **CSRF désactivé** (API stateless)
- **CORS** : `http://localhost:5173` uniquement (dev)
- **Ressources publiques** : `/uploads/**` accessible sans auth
- **Mots de passe** : Encodés via `User.withDefaultPasswordEncoder()` (BCrypt)

> ⚠️ **Production** : Remplacer par JWT/OAuth2, configurer CORS strict, activer HTTPS, utiliser secrets manager.

---

## 📁 Structure des Dossiers (Détail)

### Backend
```
src/main/java/Yve/EcoTrack/
├── EcoTrackApplication.java          # Point d'entrée Spring Boot
├── config/
│   ├── WebConfig.java                # Ressources statiques /uploads/**
│   ├── SecurityConfig.java           # Basic Auth, CORS, CSRF off
│   └── WebSocketConfig.java          # STOMP /ws-ecotrack, /topic, /app
├── controller/
│   └── BikeController.java           # REST + Upload + WebSocket push
├── model/
│   ├── Bike.java                     # Entité JPA + Lombok
│   └── BikeStatus.java               # Enum AVAILABLE/IN_USE/MAINTENANCE
├── repository/
│   └── BikeRepository.java           # JpaRepository<Bike, Long>
└── data/
    └── DataInitializer.java          # CommandLineRunner → 20 vélos Yaoundé
```

### Frontend
```
src/
├── components/
│   ├── BikeMap.jsx     # 700+ lignes : Carte, Sidebar, Modal, Upload, WebSocket-ready
│   ├── Footer.jsx      # Stats, contacts, user, copyright
│   └── Marker.jsx      # (Vide - réservé)
├── App.jsx             # Root : <BikeMap />
├── main.jsx            # Bootstrap React 19
└── index.css           # Tailwind CSS 4 import
```

---

## 🧪 Tests

### Backend
```bash
cd backend/EcoTrack
./mvnw test
```
- `EcoTrackApplicationTests.java` : Test de chargement de contexte Spring

### Frontend
```bash
cd frontend
npm run lint        # ESLint (React Hooks, Refresh)
# Pas de tests unitaires configurés (Vitest/Jest non installés)
```

---

## 📦 Build Production

### Backend (JAR)
```bash
cd backend/EcoTrack
./mvnw clean package -DskipTests
# → target/EcoTrack-0.0.1-SNAPSHOT.jar
java -jar target/EcoTrack-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

### Frontend (Static)
```bash
cd frontend
npm run build
# → dist/ (servir via Nginx, Apache, ou Spring Boot static resources)
```

### Docker (Exemple)
```dockerfile
# Backend
FROM eclipse-temurin:21-jre
COPY target/EcoTrack-*.jar app.jar
EXPOSE 8081
ENTRYPOINT ["java","-jar","/app.jar"]

# Frontend (multi-stage)
FROM node:20-alpine AS build
WORKDIR /app
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## 🌍 Contexte & Localisation

- **Ville cible** : Yaoundé, Cameroun (coordonnées par défaut : 3.8480° N, 11.5021° E)
- **Quartiers couverts** (données test) : Bastos, Tsinga, Mvan
- **Langue UI** : Français
- **Fuseau horaire** : WAT (UTC+1)

---

## 🤝 Contribution

1. Fork le repo
2. Crée une branche : `git checkout -b feature/ma-fonctionnalite`
3. Commit : `git commit -m "feat: description claire"`
4. Push : `git push origin feature/ma-fonctionnalite`
5. Ouvre une Pull Request

### Conventions
- **Commits** : Conventional Commits (`feat:`, `fix:`, `refactor:`, `docs:`)
- **Code** : Lombok (backend), ESLint + Prettier (frontend)
- **Branches** : `main` (stable), `develop` (intégration), `feature/*`, `hotfix/*`

---

## 📄 Licence

Projet personnel — **Yve Thiakou** (@docteur-yvelab sur GitHub)

---

## 📞 Contact & Liens

- **GitHub** : [github.com/docteur-yvelab](https://github.com/docteur-yvelab)
- **Téléphone** : +237 6 94 63 73 42
- **Email** : (à ajouter)

---

> **EcoTrack YDE** — *Pour une mobilité verte et connectée à Yaoundé* 🚲🇨🇲