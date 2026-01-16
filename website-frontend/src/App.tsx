import './App.css'
import appIcon from './assets/icon.png'

const demoVideo = 'https://pub-3ce29bd0907b4d8faca7717476022259.r2.dev/usethis.mov'
import screen01 from './assets/01.png'
import screen02 from './assets/02.png'
import screen03 from './assets/03.png'
import screen04 from './assets/04.png'
import screen05 from './assets/05.png'
import brainIcon from './assets/brain.png'
import settingsIcon from './assets/settings.png'

function App() {
  const screens = [
    { src: screen01, alt: 'Recipe swipe screen' },
    { src: screen02, alt: 'Recipe details screen' },
    { src: screen03, alt: 'Discovery filters screen' },
    { src: screen04, alt: 'Saved recipes screen' },
    { src: screen05, alt: 'Meal plan screen' },
  ]
  const loopedScreens = [...screens, ...screens]

  return (
    <div className="app">
      {/* Gradient background layers */}
      <div className="gradient-bg">
        <div className="gradient-orb orb-1" />
        <div className="gradient-orb orb-2" />
        <div className="gradient-orb orb-3" />
        <div className="gradient-mesh" />
        <div className="grid-overlay" />
        <div className="noise-overlay" />
      </div>

      {/* Main content */}
      <main className="main">
        <div className="content">
          {/* Left side - Text */}
          <div className="text-section">
            <div className="hero-brand">
              <img src={appIcon} alt="FlavorFlick" className="hero-brand-icon" />
              <span className="hero-brand-name">FlavorFlick</span>
            </div>
            <p className="hero-subtitle">
              Discover your next favorite meal with Flavor Flick, an AI app that
              learns your tastes and delivers a custom feed of mouth-watering
              recipes..
            </p>
            <span className="eyebrow">Feature highlights</span>
            <div className="feature-grid">
              <div className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <img src={brainIcon} alt="" />
                </span>
                <div>
                  <h3>Smart Recommendations</h3>
                  <p>Learns from category swipes to match your tastes with new recipes.</p>
                </div>
              </div>
              <div className="feature-card">
                <span className="feature-icon feature-icon-heart" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                      d="M12 20.5s-7-4.5-7-9.2C5 7.3 6.9 5.5 9.4 5.5c1.5 0 2.8.7 3.6 1.9.8-1.2 2.1-1.9 3.6-1.9 2.5 0 4.4 1.8 4.4 5.8 0 4.7-7 9.2-7 9.2Z"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <h3>Liked Recipes</h3>
                  <p>Save favorites and filter them anytime you are ready to cook.</p>
                </div>
              </div>
              <div className="feature-card">
                <span className="feature-icon" aria-hidden="true">
                  <img src={settingsIcon} alt="" />
                </span>
                <div>
                  <h3>Filters</h3>
                  <p>Filter by meal type and diet to get the recipes you want.</p>
                </div>
              </div>
            </div>

            <div className="metrics">
              <div className="metric">
                <span className="metric-value metric-inline">
                  5,000+&nbsp;&nbsp;<span className="metric-muted">Recipes</span>
                </span>
              </div>
            </div>

            <div className="cta-buttons">
              <div className="btn-primary coming-soon">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                <span>Coming to the App Store soon</span>
              </div>
            </div>

          </div>

          {/* Right side - Phone with video */}
          <div className="phone-section">
            <div className="phone-wrapper">
              {/* Glow effects */}
              <div className="phone-glow" />
              <div className="phone-glow-accent" />
              {/* Phone outline */}
              <div className="phone-outline">
                {/* Video container */}
                <div className="video-container">
                  <video
                    src={demoVideo}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="phone-video"
                  />
                </div>

                {/* Home indicator */}
                <div className="home-indicator" />
              </div>
            </div>
          </div>
        </div>
      </main>

      <section className="screen-section">
        <h2 className="screen-title">App Preview</h2>
        <div className="screen-marquee" aria-label="FlavorFlick app screens">
          <div className="screen-loop">
            {loopedScreens.map((screen, index) => (
              <div className="screen-card" key={`${screen.src}-${index}`}>
                <div className="screen-card-frame">
                  <img src={screen.src} alt={screen.alt} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}

export default App
