# 🚲 EcoTrack YDE - Gestion de Flotte

**EcoTrack YDE** est un prototype de tableau de bord pour la gestion d'une flotte de vélos électriques à **Yaoundé, Cameroun**. Ce projet a été réalisé dans le cadre d'un **exercice personnel** pour maîtriser l'architecture Full-Stack.

## 🚀 Fonctionnalités
- 📍 **Géolocalisation** : Visualisation en temps réel sur carte Leaflet.
- ⚡ **WebSockets** : Mise à jour du niveau de batterie sans rafraîchir la page.
- 📸 **Gestion Image** : Upload de photos réelles stockées sur serveur.
- 🔐 **Sécurité** : Accès protégé par Spring Security (Basic Auth).
- 🗄️ **Base de Données** : Persistance robuste avec PostgreSQL.

## 🛠️ Stack Technique
- **Frontend** : React + Vite, Tailwind CSS, Leaflet.
- **Backend** : Spring Boot, Spring Security, Hibernate.
- **Base de données** : PostgreSQL.
- **Communication** : Axios (REST) & Stomp (WebSockets).

## 🔧 Installation locale
1. **Base de données** : Créer une base nommée `ecotrack_db` dans h2.
2. **Backend** : 
   - Configurer les identifiants dans `src/main/resources/application.properties`.
   - Créer un dossier `uploads/` à la racine.
   - Lancer : `./mvnw spring-boot:run`.
3. **Frontend** : 
   - `npm install`
   - `npm run dev`

## 🌍 Déploiement
Le projet est configuré pour être déployable sur des plateformes comme **Heroku**, **Render** ou un **VPS** :
- Les images sont servies via un `ResourceHandler` Spring.
- La base de données est prête pour un environnement de production via h2.

## 📧 Contact
**Développeur** : [Ton Nom/Pseudo]
- **Projet** : Exercice personnel - EcoTrack YDE
- **Localisation** : Yaoundé, Cameroun 🇨🇲
- **WhatsApp** : +237 694 63 73 42

---
*Ce projet est une démonstration technique et ne doit pas être utilisé en production sans une configuration de sécurité avancée (JWT, SSL).*



