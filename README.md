# AI Recipe Recommendation App

A full-stack mobile application featuring a custom-built **content-based filtering recommendation engine** that learns individual taste preferences through implicit feedback. The system models user preferences in a 5-dimensional taste vector space, maintaining separate learned profiles per meal category to deliver hyper-personalized recipe suggestions.

## Core Features

* **Intelligent Recommendation Engine** - Content-based filtering with Euclidean distance similarity scoring in 5D taste space
* **Category-Aware Learning** - Separate taste profiles for breakfast, lunch, dinner, dessert, and drinks
* **Exploration/Exploitation Balancing** - 80/20 hybrid selection prevents filter bubbles while maximizing relevance
* **Implicit Feedback Learning** - System learns from swipe behavior without explicit ratings
* **Tinder-Style Interface** - Gesture-driven card deck with physics-based animations

## Tech Stack

### Backend (Python)
* **FastAPI** - Async REST API with automatic OpenAPI docs
* **SQLAlchemy 2.x** - Async ORM with declarative models
* **PostgreSQL** - JSONB columns for flexible taste vector storage
* **Pydantic** - Request/response validation
* **Alembic** - Database migrations

### Frontend (TypeScript)
* **React Native** + **Expo**
* **React Navigation** - Bottom tab navigation
* **Animated API & PanResponder** - Custom gesture recognition

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     React Native App                        │
│         Swipe Interface → REST API Calls → State            │
└─────────────────────────────────────────────────────────────┘
                           ↕ REST API
┌─────────────────────────────────────────────────────────────┐
│                      FastAPI Backend                        │
│  ┌────────────────────────────────────────────────────────┐ │
│  │              Recommendation Engine                     │ │
│  │                                                        │ │
│  │  User Profiles    →   Similarity    →   Balanced       │ │
│  │  (Per Category)       Scoring           Selection      │ │
│  │                                                        │ │
│  │  • 5D Taste Vectors                                    │ │
│  │  • Euclidean Distance Similarity                       │ │
│  │  • Dislike-Weighted Profile Adjustment                 │ │
│  │  • Exploration vs Exploitation (80/20)                 │ │
│  │  • Cross-Category Load Balancing                       │ │
│  └────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
                           ↕
┌─────────────────────────────────────────────────────────────┐
│                   PostgreSQL Database                       │
│       Recipes (5000+)  •  Swipes  •  User Profiles          │
└─────────────────────────────────────────────────────────────┘
```

## Recommendation Algorithm

### 5-Dimensional Taste Vector Space

Each recipe is represented as a point in 5D space with dimensions: **sweetness**, **saltiness**, **spiciness**, **fattiness**, and **bitterness** (each scored 0-100). User preferences are learned as vectors in this same space, enabling mathematical similarity comparisons.

### Euclidean Distance Similarity

Recipes are scored against user profiles using inverse Euclidean distance, producing a 0-1 similarity score where closer vectors yield higher scores:

```python
distance = sqrt(sum((recipe[dim] - profile[dim])² for dim in DIMENSIONS))
similarity = 1 / (1 + distance)
```

### Category-Aware Profile Learning

The system maintains **separate taste profiles per meal category** (breakfast, lunch, dinner, dessert, drinks). A user who likes sweet breakfasts but spicy dinners gets appropriate recommendations for each—the algorithm recognizes these as distinct preference contexts.

### Dislike-Weighted Adjustment

Negative feedback refines profiles at 30% weight to avoid over-correction. If a user dislikes salty recipes, the system nudges their profile away from saltiness without completely overriding their liked preferences.

### Exploration vs Exploitation

The engine uses an **80/20 split**: 80% top-scored recipes (exploitation) and 20% random sampling (exploration). This prevents filter bubbles and addresses cold-start by ensuring users discover recipes outside established preferences.

## Data Flow

```
1. User swipes right/left on recipe
              ↓
2. Swipe recorded with taste_profile snapshot
              ↓
3. Next feed request triggers profile recalculation
              ↓
4. Group swipes by category → Calculate averages → Apply dislike weights
              ↓
5. Score all unseen recipes against category-specific profiles
              ↓
6. Select via exploitation/exploration split → Shuffle → Return
```

## Key Technical Decisions

| Decision | Rationale |
|----------|-----------|
| 5D taste vectors | Captures essential flavor dimensions without overfitting |
| Category-specific profiles | Users have genuinely different preferences per meal type |
| JSONB storage | Flexible schema for taste profiles without migrations |
| Inverse distance similarity | Simple, interpretable scoring that degrades gracefully |
| 80/20 exploit/explore | Industry-standard balance for recommendation diversity |
| Snapshot taste profiles | Historical accuracy for profile calculation |

## Project Structure

```
recipe-app/
├── backend/
│   └── app/
│       ├── services/
│       │   ├── recommendations.py  # Main recommendation orchestration
│       │   ├── scoring.py          # Euclidean similarity calculations
│       │   └── user_profiles.py    # Category-aware profile learning
│       ├── routes/                 # API endpoints
│       ├── crud/                   # Database operations
│       └── models.py               # SQLAlchemy ORM
│
└── frontend/
    └── src/
        ├── screens/                # Home, Liked, Settings
        ├── components/             # SwipeableCard, RecipeCard
        └── context/                # Preferences state management
```
