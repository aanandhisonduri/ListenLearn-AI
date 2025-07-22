'use client';

import React, { useState } from 'react';
import './LandingPage.css';


export default function Dashboard() {
  const [file, setFile] = useState<File | null>(null);
  const [transcription, setTranscription] = useState<string>('');
  const [summary, setSummary] = useState<string>('');
  const [highlights, setHighlights] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'highlights'>('summary');

  const [flashcardsData, setFlashcardsData] = useState<{ question: string, answer: string }[]>([]);
  const [showFlashcardModal, setShowFlashcardModal] = useState(false);
  const [flippedCards, setFlippedCards] = useState<boolean[]>([]);
  
  
  type Flashcard = {
    question: string;
    answer: string;
  };
  
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  
  

  

  const toggleFlip = (index: number) => {
    setFlippedCards(prev => {
      const newFlips = [...prev];
      newFlips[index] = !newFlips[index];
      return newFlips;
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) {
      setFile(e.target.files[0]);
      setTranscription('');
      setSummary('');
      setHighlights('');
      setError(null);
    }
  };

//   const handleUpload = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!file) return setError('Select an audio file first');
//     if (file.type !== 'audio/wav') return setError('Please upload a 16kHz WAV file');
//     setLoading(true);
//     setError(null);

//     try {
//       const form = new FormData();
//       form.append('file', file);
//       const res = await fetch('http://localhost:5001/transcribe', { method: 'POST', body: form });
//       if (!res.ok) throw new Error((await res.json()).error || 'Transcription failed');
//       const { text } = await res.json();
//       setTranscription(text);
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSummarizeAndHighlight = async () => {
//     if (!transcription) return setError('No transcript available.');
//     setLoading(true);
//     setError(null);
//     try {
//       const [summaryRes, highlightRes] = await Promise.all([
//         fetch('http://localhost:5001/summarize', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: transcription })
//         }),
//         fetch('http://localhost:5001/highlight', {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ text: transcription })
//         })
//       ]);

//       if (!summaryRes.ok || !highlightRes.ok) throw new Error('Summary or Highlight request failed');

//       const { summary } = await summaryRes.json();
//       const { highlights } = await highlightRes.json();

//       setSummary(summary);
//       setHighlights(highlights);
//       setShowModal(true);
//     } catch (e: any) {
//       setError(e.message);
//     } finally {
//       setLoading(false);
//     }
//   };
  
//   const handleFlashcards = async () => {
//     if (!transcription) return;
//     setLoading(true);
//     try {
//       const res = await fetch('http://localhost:5001/flashcards', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ text: transcription }),
//       });
  
//       const data = await res.json();
  
//       let parsed = [];
//       if (
//         data.flashcards.length === 1 &&
//         data.flashcards[0].answer &&
//         typeof data.flashcards[0].answer === 'string'
//       ) {
//         try {
//           const cleaned = data.flashcards[0].answer
//             .replace(/'/g, '"')                      // Replace single quotes
//             .replace(/,\s*}/g, '}')                  // Remove trailing commas in objects
//             .replace(/,\s*]/g, ']')                  // Remove trailing commas in arrays
//             .replace(/\n/g, '');                     // Remove newlines (optional cleanup)
  
//           parsed = JSON.parse(cleaned);
//         } catch (err) {
//           console.error('Flashcards JSON parse failed:', err);
//           // Fallback to display something instead of crashing
//           parsed = [
//             {
//               question: 'Error parsing flashcards',
//               answer: data.flashcards[0].answer,
//             },
//           ];
//         }
//       } else {
//         parsed = data.flashcards;
//       }
  
//       console.log('Parsed flashcards:', parsed);
//       setFlashcards(parsed);
// setShowFlashcardModal(true); // instead of setShowModal
//    // show modal
//     } catch (error) {
//       console.error('Flashcards error:', error);
//     } finally {
//       setLoading(false);
//     }
//   };
  
const BACKEND_URL = "https://listenlearn-ai-1.onrender.com";

const handleUpload = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!file) return setError('Select an audio file first');
  if (file.type !== 'audio/wav') return setError('Please upload a 16kHz WAV file');
  setLoading(true);
  setError(null);

  try {
    const form = new FormData();
    form.append('file', file);
    const res = await fetch(`${BACKEND_URL}/transcribe`, { method: 'POST', body: form });
    if (!res.ok) throw new Error((await res.json()).error || 'Transcription failed');
    const { text } = await res.json();
    setTranscription(text);
  } catch (e: any) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

const handleSummarizeAndHighlight = async () => {
  if (!transcription) return setError('No transcript available.');
  setLoading(true);
  setError(null);
  try {
    const [summaryRes, highlightRes] = await Promise.all([
      fetch(`${BACKEND_URL}/summarize`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription })
      }),
      fetch(`${BACKEND_URL}/highlight`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: transcription })
      })
    ]);

    if (!summaryRes.ok || !highlightRes.ok) throw new Error('Summary or Highlight request failed');

    const { summary } = await summaryRes.json();
    const { highlights } = await highlightRes.json();

    setSummary(summary);
    setHighlights(highlights);
    setShowModal(true);
  } catch (e: any) {
    setError(e.message);
  } finally {
    setLoading(false);
  }
};

const handleFlashcards = async () => {
  if (!transcription) return;
  setLoading(true);
  try {
    const res = await fetch(`${BACKEND_URL}/flashcards`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: transcription }),
    });

    const data = await res.json();

    let parsed = [];
    if (
      data.flashcards.length === 1 &&
      data.flashcards[0].answer &&
      typeof data.flashcards[0].answer === 'string'
    ) {
      try {
        const cleaned = data.flashcards[0].answer
          .replace(/'/g, '"')
          .replace(/,\s*}/g, '}')
          .replace(/,\s*]/g, ']')
          .replace(/\n/g, '');

        parsed = JSON.parse(cleaned);
      } catch (err) {
        console.error('Flashcards JSON parse failed:', err);
        parsed = [
          {
            question: 'Error parsing flashcards',
            answer: data.flashcards[0].answer,
          },
        ];
      }
    } else {
      parsed = data.flashcards;
    }

    setFlashcards(parsed);
    setShowFlashcardModal(true);
  } catch (error) {
    console.error('Flashcards error:', error);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="container-fluid p-15" style={{ paddingLeft: '3.5rem', paddingRight: '3.5rem' }}>

      <div className="row gx-4">
        <div className="col-lg-4 mb-4">
          <div className="glass-card p-4 rounded-4 shadow-lg sticky-top" style={{ top: '20px' }}>
            <h5 className="gradient-text mb-3">Upload Audio</h5>
            <form onSubmit={handleUpload}>
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  accept=".mp3,.wav"
                  onChange={handleFileChange}
                />
              </div>
             <div className="d-flex align-items-center gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 rounded-pill border-0"
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <span className="gradient-text fw-semibold">
                  {loading ? 'Uploading...' : 'Upload'}
                </span>
              </button>

              {loading && (
                <div
                  className="progress"
                  style={{
                    height: '10px',
                    width: '450px',
                    backgroundColor: '#e0e0e0',
                    borderRadius: '20px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    className="progress-bar progress-bar-striped progress-bar-animated"
                    role="progressbar"
                    style={{ width: '100%', backgroundColor: '#a44cc9' }}
                    aria-valuenow={100}
                    aria-valuemin={0}
                    aria-valuemax={100}
                  />
                </div>
              )}
            </div>


            </form>
          </div>

          <div className="glass-card p-4 rounded-4 shadow-lg mt-4">
            <h5 className="gradient-text mb-3">Quick Actions</h5>
            <div className="d-flex flex-column gap-3">
              <button
                className="px-4 py-2 rounded-pill border-0"
                onClick={handleSummarizeAndHighlight}
                disabled={loading || !transcription}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <span className="gradient-text fw-semibold">Open Summary / Highlights</span>
              </button>
              <button
                className="px-4 py-2 rounded-pill border-0"
                onClick={handleFlashcards}
                disabled={loading || !transcription}
                style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255, 255, 255, 0.3)',
                }}
              >
                <span className="gradient-text fw-semibold">Generate Flashcards</span>
              </button>

            </div>
          </div>
          

        </div>

        <div className="col-lg-8">
          <div className="glass-card p-4 rounded-4 shadow-lg mb-4">
            <h4 className="mb-3 gradient-text">
              <i className="bi bi-chat-dots me-2"></i>Transcript
            </h4>
            <div className="p-3 bg-light rounded overflow-auto" style={{ maxHeight: 500, whiteSpace: 'pre-wrap' }}>
              {transcription ? (
                <span style={{ color: '#410056' }}>{transcription}</span>
              ) : (
                <span style={{ color: '#410056', opacity: 0.6 }}>Transcript will appear here after upload.</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.7)' }}
          tabIndex={-1}
          role="dialog"
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" role="document">
            <div
              className="modal-content glass-card p-4 rounded-4 shadow-lg position-relative"
              style={{
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(12px)',
                background: 'rgba(255, 255, 255, 0.5)',
                color: '#410056',
              }}
            >
              {/* Close X Button */}
              <button
                type="button"
                className="btn-close position-absolute"
                style={{ top: '1rem', right: '1rem', filter: 'invert(1)' }}
                onClick={() => setShowModal(false)}
                aria-label="Close"
              ></button>

              {/* Header Title */}
              <div className="text-center mb-3">
                <h4
                  className="mb-0"
                  style={{
                    fontWeight: 600,
                    color: '#4c0e87', // dark purple
                  }}
                >
                  {activeTab === 'summary' ? 'Summary' : 'Highlights'}
                </h4>
              </div>


              {/* Tab Content */}
              <div
                className="p-4 rounded-4 overflow-auto "
                style={{
                  backgroundColor: 'rgba(255,255,255,0.8)',
                  maxHeight: '620px',
                  whiteSpace: 'pre-wrap',
                  fontSize: '1rem',
                  fontWeight: 500,
                  lineHeight: '1.6',
                  borderRadius: '1rem',
                  color: '#410056',
                  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.05)',
                }}
              >
                {activeTab === 'summary' ? (
                  summary ? (
                    <span >{ summary}</span>
                  ) : (
                    <span style={{ opacity: 0.6 }}>Summary will appear here.</span>
                  )
                ) : highlights ? (
                  <span>{highlights}</span>
                ) : (
                  <span style={{ opacity: 0.6 }}>Highlights will appear here.</span>
                )}
              </div>

              {/* Tab Controls with Dot Indicators */}
              <div className="d-flex justify-content-between align-items-center mt-4 px-2">
                {/* Left Tab Button */}
                <button
                  className="btn btn-outline-light btn-sm px-3"
                  disabled={activeTab === 'summary'}
                  onClick={() => setActiveTab('summary')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '2rem',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                >
                  ←
                </button>

                {/* Dot Indicators */}
                <div className="d-flex gap-2">
                  <div
                    className={`rounded-circle ${activeTab === 'summary' ? 'bg-light' : 'bg-secondary'}`}
                    style={{ width: '10px', height: '10px', transition: '0.3s' }}
                  />
                  <div
                    className={`rounded-circle ${activeTab === 'highlights' ? 'bg-light' : 'bg-secondary'}`}
                    style={{ width: '10px', height: '10px', transition: '0.3s' }}
                  />
                </div>

                {/* Right Tab Button */}
                <button
                  className="btn btn-outline-light btn-sm px-3"
                  disabled={activeTab === 'highlights'}
                  onClick={() => setActiveTab('highlights')}
                  style={{
                    backgroundColor: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '2rem',
                    color: '#fff',
                    fontWeight: 500,
                  }}
                >
                  →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
     
      {showFlashcardModal && (
        <div
          className="modal d-flex align-items-center justify-content-center"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.7)',
            zIndex: 1050,
            overflowY: 'auto',
            padding: '2rem',
          }}
        >
          <div className="container" style={{ position: 'relative' /* add relative here */ }}>
            {/* Close button placed absolutely relative to container */}
            <button
              type="button"
              className="btn-close position-absolute"
              style={{
                top: '-2rem',
                right: '-2rem',
                filter: 'invert(1)', // fix typo here
                zIndex: 1100,
              }}
              onClick={() => setShowFlashcardModal(false)}
              aria-label="Close"
            ></button>

            <div className="row row-cols-1 row-cols-md-3 gy-5 gx-5">
              {flashcards.map((card, index) => (
                <div className="col" key={index}>
                  <div className="flip-card">
                    <div className="flip-card-inner">
                      {/* Front side: Question */}
                      <div
                        className="flip-card-front p-4 rounded shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          height: '180px',
                          backgroundColor: '#380765',
                          color: 'white',
                        }}
                      >
                        <strong>{card.question}</strong>
                      </div>

                      {/* Back side: Answer */}
                      <div
                        className="flip-card-back p-4 rounded shadow-sm d-flex align-items-center justify-content-center"
                        style={{
                          height: '180px',
                          backgroundColor: 'white',
                          color: '#380765',
                        }}
                      >
                        <span>{card.answer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
