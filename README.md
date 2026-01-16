# <img src="website-frontend/src/assets/icon.png" width="32" height="32" alt="FlavorFlick icon"> FlavorFlick - An AI Recipe App

### [flavorflick.ca](https://flavorflick.ca) |  **Swipe. Learn. Eat.** 

An AI-powered recipe discovery app that learns your category-specifiic unique taste preferences through swipes and delivers personalized meal recommendations.

![FastAPI](https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white)
![React Native](https://img.shields.io/badge/React_Native-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![SQLAlchemy](https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white)
![Pydantic](https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white)



## Core Features

* **5,593 Recipes** - Across 5 meal categories with full nutrition data and images
* **Implicit Feedback Learning** - Learns preferences from swipes 
* **Taste-Based Recommendation Engine** - Using Euclidean distance similarity in 5D taste vector space to recommend recipes
* **Category-Aware Learning** - Separate taste profiles per meal type
* **80/20 Exploration/Exploitation** - Balancing to prevent filter bubbles
* **Filtering** - Filter by diet type and meal type while scrolling
* **Tinder-Style Swipe Interface** - With physics-based animations


---

## Tech Stack

### Backend
- **FastAPI** + **Python** - 2 REST endpoints: `/recipes/feed` for recommendations, `/swipes/` for recording interactions
- **SQLAlchemy** - Async database queries, defines Recipe/User/Swipe models with relationships and cascade deletes
- **Pydantic** - Validates incoming swipe data and serializes recipe responses

### Database
- **PostgreSQL** - 3 tables: `recipes` (5,593 rows with JSONB taste profiles), `users` (device-based identification), `swipes` (stores like/dislike with taste profile snapshots)
- **Alembic** - Database migrations for schema changes

### Frontend
- **React Native** + **Expo** + **TypeScript** - 3 screens (Home, Liked, Settings)
- **PanResponder + Animated API** - Detects swipe gestures and animates card rotation/translation

### Infrastructure
- **AWS EC2** - Hosts FastAPI server at `api.flavorflick.ca`
- **Supabase** - Managed PostgreSQL with connection pooling
- **Cloudflare** - DNS routing, SSL certificates, CDN for images
- **Expo EAS** - Builds iOS/Android apps for distribution


---

### Architecture

```
┌──────────────────┐      HTTPS       ┌──────────────────┐      TCP        ┌──────────────────┐
│  React Native    │  ←───────────→   │  FastAPI         │  ←──────────→   │  PostgreSQL      │
│  App (Expo)      │                  │  (AWS EC2)       │                 │  (Supabase)      │
├──────────────────┤                  ├──────────────────┤                 ├──────────────────┤
│ • Swipe UI       │                  │ • /recipes/feed  │                 │ • recipes        │
│ • Context State  │                  │ • /swipes/       │                 │ • users          │
│ • Device ID      │                  │ • Rec Engine     │                 │ • swipes         │
└──────────────────┘                  └──────────────────┘                 └──────────────────┘
        ↑
        │ CDN
┌──────────────────┐
│   Cloudflare     │
│ • SSL/DNS        │
│ • Image Caching  │
└──────────────────┘
```

**Flow**: User swipes → Backend records interaction → Rebuilds taste profile from history → Returns similarity-sorted recommendations

---

## Recommendation Algorithm

Content-based filtering system that learns user taste preferences through swipe interactions.
- **5D Taste Vectors** - Recipes mapped to 5 taste categories
- **Euclidean Distance Scoring** - Produces 0-1 match scores for recipes
- **Category-Aware Profiles** - Seperate profiles for each mealtype
- **Sorted by Similarity** - Recipes returned in descending order by match score using SQL JOIN between recipes and user profiles
- **80/20 Exploration/Exploitation** - Balances personalization with discovery to prevent filter bubbles
- **Negative Feedback Overcorrection** - Dislikes weighted at 30% to prevent a few bad swipes from dominating


---

## Data

### Recipe Dataset
- **5,593 recipes** with pre-computed taste profiles, nutrition data, ingredients, and step-by-step instructions

### Swipes Table
- Table with all user swipes: user_id, recipe_id, direction
- **Foreign keys** to users and recipes tables with cascade deletes for referential integrity

### User Data
- **Device-based identification** - No authentication required, UUID generated on first launch
- **Category-specific profiles** rebuilt on each feed request from swipe history

---

## Frontend

- **Swipe Interface** - PanResponder + Animated API for gesture detection and physics-based card animations
- **State Management** - 3 React Context providers (Feed, Preferences, Liked) for global state
- **3 Screens** - Home (swipe cards), Liked (saved recipes grid), Settings (filters)


## Deployment

### Backend (AWS EC2)
- **Instance** - t3.micro running Ubuntu, hosts FastAPI via Uvicorn
- **Domain** - `api.flavorflick.ca` routed through Cloudflare

### Database (Supabase)
- **PostgreSQL 15** - Managed instance with automatic backups
- **Connection Pooling** - PgBouncer for efficient connection management with async SQLAlchemy
- **Migrations** - Alembic tracks schema changes with version control

### CDN & DNS (Cloudflare)
- **SSL/TLS** - Full strict encryption between client, Cloudflare, and origin
- **DNS** - A records for API, CNAME for main domain
- **Caching** - Static assets and recipe images cached at edge

---

## Project Structure

```
recipe-app/
├── backend/
│   └── app/
│       ├── main.py          # FastAPI entry point
│       ├── models.py        # SQLAlchemy ORM
│       ├── services/        # Recommendation engine
│       ├── routes/          # API endpoints
│       ├── crud/            # Database operations
│       └── schemas/         # Pydantic models
│
├── frontend/
│   └── src/
│       ├── screens/         # Home, Liked, Settings
│       ├── components/      # Reusable UI components
│       ├── context/         # React Context providers
│       └── api/             # API client
│
└── website-frontend/        # Marketing website (flavorflick.ca)
```
