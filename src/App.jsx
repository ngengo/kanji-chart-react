import React from 'react';
import { useNavigate } from 'react-router-dom';

const kanjiData = [
  { char: "人", hiragana: "ひと", romaji: "hito", meaning: "Person" },
  { char: "女", hiragana: "おんな", romaji: "onna", meaning: "Woman" },
  { char: "男", hiragana: "おとこ", romaji: "otoko", meaning: "Man" },
  { char: "子", hiragana: "こ", romaji: "ko", meaning: "Child" },
  { char: "手", hiragana: "て", romaji: "te", meaning: "Hand" },
  { char: "目", hiragana: "め", romaji: "me", meaning: "Eye" },
  { char: "耳", hiragana: "みみ", romaji: "mimi", meaning: "Ear" },
  { char: "口", hiragana: "くち", romaji: "kuchi", meaning: "Mouth" },
  { char: "足", hiragana: "あし", romaji: "ashi", meaning: "Foot / Leg" },
  { char: "日", hiragana: "ひ", romaji: "hi", meaning: "Sun / Day" },
  { char: "月", hiragana: "つき", romaji: "tsuki", meaning: "Moon / Month" },
  { char: "年", hiragana: "とし", romaji: "toshi", meaning: "Year" },
  { char: "週", hiragana: "しゅう", romaji: "shuu", meaning: "Week" },
  { char: "火", hiragana: "ひ", romaji: "hi", meaning: "Fire" },
  { char: "水", hiragana: "みず", romaji: "mizu", meaning: "Water" },
  { char: "木", hiragana: "き", romaji: "ki", meaning: "Tree / Wood" },
  { char: "山", hiragana: "やま", romaji: "yama", meaning: "Mountain" },
  { char: "白", hiragana: "しろ", romaji: "shiro", meaning: "White" },
  { char: "父", hiragana: "ちち", romaji: "chichi", meaning: "Father" },
  { char: "母", hiragana: "はは", romaji: "haha", meaning: "Mother" },
];

function App() {
  const navigate = useNavigate();

  const handleCardClick = (kanjiChar) => {
    navigate(`/trace/${kanjiChar}`);
  };

  return (
    <div style={styles.app}>
      <h1>Kanji Chart</h1>
      <div style={styles.grid}>
        {kanjiData.map((kanji, index) => (
          <button
            key={index}
            style={styles.box}
            onClick={() => handleCardClick(kanji.char)}
            aria-label={`${kanji.char} - ${kanji.meaning}`}
          >
            <div style={styles.char}>{kanji.char}</div>
            <div style={styles.textRow}>
              <span style={styles.romaji}><i>{kanji.romaji}</i></span>
              <span style={styles.hiragana}>{kanji.hiragana}</span>
              <span style={styles.meaning}>{kanji.meaning}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  app: {
    fontFamily: 'sans-serif',
    textAlign: 'center',
    padding: '2rem',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)', // 5 columns fixed
    gap: '20px',
    width: 'min(900px, 90vw)',  // max width and responsive
    margin: '0 auto',           // horizontally center grid container
    justifyContent: 'center',   // center content inside grid container
  },
  box: {
    background: '#f9f9f9',
    border: '2px solid #ccc',
    borderRadius: '12px',
    cursor: 'pointer',
    transition: 'transform 0.2s',
    
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',

    height: '140px',
    width: '100%',             // fill grid cell width
    boxSizing: 'border-box',
    padding: '15px',

    textAlign: 'center',
    userSelect: 'none',
  },
  char: {
    fontSize: '56px',
    fontWeight: '900',
    lineHeight: 1,
    marginBottom: '8px',
    color: '#222',
    fontFamily: "'Noto Sans JP', 'Arial Unicode MS', sans-serif",  // <--- Add this here
    fontFeatureSettings: '"cjk-ideographic"', // Ensure CJK features are enabled
    textShadow: '1px 1px 2px rgba(0,0,0,0.1)',
    transition: 'transform 0.2s',
    '&:hover': {
      transform: 'scale(1.1)',
    },
    '&:active': {
      transform: 'scale(0.95)',
    },

  },
  textRow: {
    display: 'flex',
    justifyContent: 'space-around',
    gap: '10px',
    width: '100%',
    fontSize: '14px',
    color: '#444',
  },
  romaji: {
    fontStyle: 'italic',
    color: '#666',
  },
  hiragana: {
    fontWeight: '500',
  },
  meaning: {
    fontWeight: '700',
  },
};

export default App;
