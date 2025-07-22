'use client';

import Link from 'next/link';
import './LandingPage.css'; // custom CSS

export default function LandingPage() {
  return (
    <section
      className="landing-page d-flex flex-row align-items-center justify-content-center px-4"
      style={{ minHeight: '100vh' }}
    >
      {/* Left: Image */}
      <div className="landing-image me-5">
        <img
          src="/ListenLearn.png"
          alt="Podcast Illustration"
          style={{ maxWidth: '600px', width: '100%', height: 'auto', borderRadius: '20px' }}
        />
      </div>

      {/* Right: Text content */}
      <div className="landing-text text-start">
        {/* Blobs */}
        <div className="blob pink"></div>
        <div className="blob yellow"></div>
        <div className="blob purple"></div>

        <h1 className="display-1 fw-bold gradient-text mb-4">ListenLearn</h1>
        <h2 className="h2 fw-semibold text-dark mb-3">Summarize Podcasts with AI</h2>
        <p className="lead text-secondary mb-4">
          Upload audio, get instant summaries and flashcards. Learn efficiently, listen deeply.
        </p>
        <Link href="/dashboard
        " className="btn btn-lg btn-glass">
          Get Started
        </Link>
      </div>
    </section>
  );
}
