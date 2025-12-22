# Recipe Recommendation App
A mobile application that helps users discover recipes perfectly tailored to their taste preferences. Unlike traditional recipe apps, it learns that you might love sweet desserts but prefer spicy dinners, adapting recommendations for each meal category independently.

**Core Features**
* **Tinder-Style Swipe Interface** - Swipe right to like, left to dislike
* **Smart Recommendations** - AI learns your unique taste preferences per category
* **7D Taste Profiling** - Analyzes recipes across 7 taste dimensions
* **Adaptive Learning** - Recent preferences weighted more heavily
* **Category-Aware** - Separate taste profiles for breakfast, lunch, dinner, dessert, and snacks
* **Personalized Feed** - Each user gets unique recipe recommendations
* **Detailed Recipe View** - Ingredients, instructions, nutrition, equipment, and taste profiles

## Tech Stack
### Frontend
* Javascript
* React Native
* Expo
### Backend
* Python
* FastAPI
* Pydantic
* SQLAlchemy
* Alembic
### Database
* PostgreSQL

## Architecture Overview
```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                        │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │ Swipe Screen │  │ Detail Screen│  │  Device ID      │    │
│  │  (Deck UI)   │  │ (Full Recipe)│  │   Management    │    │
│  └──────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │          Recommendation Engine                         │ │
│  │  • Category-Aware Content-Based Filtering              │ │
│  │  • 7D Euclidean Distance Similarity                    │ │
│  │  • Exponential Moving Average (Time Decay)             │ │
│  │  • Hybrid Profile Management                           │ │
│  └────────────────────────────────────────────────────────┘ │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │  API Routes  │  │  CRUD Ops    │  │   Validation    │    │
│  │  (/recipes)  │  │  (Database)  │  │   (Pydantic)    │    │
│  │  (/swipes)   │  │              │  │                 │    │
│  └──────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│  ┌──────────────┐  ┌──────────────┐  ┌─────────────────┐    │
│  │   Recipes    │  │    Swipes    │  │   User Profiles │    │
│  │  (5000+)     │  │  (History)   │  │  (Per Category) │    │
│  └──────────────┘  └──────────────┘  └─────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```
