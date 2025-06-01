import { useParams, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";

const kanjiToFile = {
  人: "person",
  女: "woman",
  男: "man",
  子: "child",
  手: "hand",
  目: "eye",
  耳: "ear",
  口: "mouth",
  足: "foot",
  日: "day",
  月: "month",
  年: "year",
  週: "week",
  火: "fire",
  水: "water",
  木: "tree",
  山: "mountain",
  白: "white",
  父: "father",
  母: "mother",
};

// Stroke order instructions for each kanji
const kanjiStrokeOrders = {
  人: [
    "Draw the left diagonal stroke from top to bottom.",
    "Draw the right diagonal stroke crossing the first.",
  ],
  女: [
    "Draw the top horizontal stroke from left to right.",
    "Draw the left diagonal stroke starting near the middle.",
    "Draw the sweeping stroke on the right side.",
  ],
  男: [
    "Draw the left vertical stroke in the field radical.",
    "Draw the horizontal stroke inside the field.",
    "Complete the field radical strokes.",
    "Draw the right-side stroke.",
  ],
  子: [
    "Draw the horizontal stroke on top.",
    "Draw the vertical stroke through the center.",
    "Draw the sweeping stroke at the bottom.",
  ],
  手: [
    "Draw the top horizontal stroke.",
    "Draw the vertical stroke down through the center.",
    "Draw the left diagonal stroke.",
    "Draw the right diagonal stroke.",
    "Draw the final horizontal stroke at the bottom.",
  ],
  目: [
    "Draw the top horizontal stroke.",
    "Draw the left vertical stroke.",
    "Draw the inner horizontal strokes from top to bottom.",
    "Draw the right vertical stroke.",
    "Draw the bottom horizontal stroke.",
  ],
  耳: [
    "Draw the top horizontal stroke.",
    "Draw the left vertical stroke.",
    "Draw the inner strokes in order from top to bottom.",
    "Draw the bottom horizontal stroke.",
  ],
  口: [
    "Draw the left vertical stroke.",
    "Draw the top horizontal stroke.",
    "Draw the right vertical stroke.",
    "Draw the bottom horizontal stroke to close the box.",
  ],
  足: [
    "Draw the left vertical stroke.",
    "Draw the horizontal strokes inside.",
    "Draw the sweeping strokes on the right.",
  ],
  日: [
    "Draw the outer box starting from top horizontal.",
    "Draw the left vertical stroke.",
    "Draw the bottom horizontal stroke.",
    "Draw the right vertical stroke.",
    "Draw the inner horizontal stroke.",
  ],
  月: [
    "Draw the left vertical stroke with a hook.",
    "Draw the inner strokes from top to bottom.",
    "Draw the right vertical stroke.",
  ],
  年: [
    "Draw the top horizontal stroke.",
    "Draw the vertical stroke intersecting the horizontal.",
    "Draw the sweeping stroke at the bottom.",
    "Draw the final stroke on the right.",
  ],
  週: [
    "Draw the outer box radical strokes.",
    "Draw the inner strokes from top to bottom and left to right.",
  ],
  火: [
    "Draw the left diagonal stroke.",
    "Draw the right diagonal stroke.",
    "Draw the small left flick stroke near the middle.",
    "Draw the small right flick stroke near the middle.",
    "Draw the bottom vertical stroke.",
  ],
  水: [
    "Draw the left diagonal stroke from top to bottom.",
    "Draw the right diagonal stroke crossing the first.",
    "Draw the vertical stroke with a flick in the middle.",
    "Draw the short diagonal stroke on the right side.",
  ],
  木: [
    "Draw the horizontal stroke on top.",
    "Draw the vertical stroke through the center.",
    "Draw the left diagonal stroke.",
    "Draw the right diagonal stroke.",
  ],
  山: [
    "Draw the left vertical stroke.",
    "Draw the middle vertical stroke, taller than the first.",
    "Draw the right vertical stroke.",
    "Draw the base horizontal stroke.",
  ],
  白: [
    "Draw the top horizontal stroke.",
    "Draw the vertical stroke through the middle.",
    "Draw the left and right strokes forming the shape.",
    "Draw the bottom horizontal stroke.",
  ],
  父: [
    "Draw the top left diagonal stroke.",
    "Draw the top right diagonal stroke.",
    "Draw the vertical stroke through the center.",
    "Draw the sweeping strokes at the bottom.",
  ],
  母: [
    "Draw the top horizontal stroke.",
    "Draw the left vertical stroke.",
    "Draw the curved strokes on the right.",
    "Draw the bottom strokes.",
  ],
};

function TracingPage() {
  const { kanji } = useParams();
  const fileName = kanjiToFile[kanji];
  const svgPath = fileName ? `/kanji/${fileName}.svg` : null;

  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [feedback, setFeedback] = useState(null);

  // Load and animate SVG strokes
  useEffect(() => {
    if (!svgPath) return;

    fetch(svgPath)
      .then((res) => {
        if (!res.ok) throw new Error("SVG not found");
        return res.text();
      })
      .then((svgText) => {
        if (containerRef.current) {
          containerRef.current.innerHTML = svgText;
          const paths = containerRef.current.querySelectorAll("path");
          paths.forEach((path, i) => {
            const length = path.getTotalLength();
            path.style.stroke = "#d81b60";
            path.style.strokeWidth = "3px";
            path.style.fill = "none";
            path.style.strokeDasharray = length;
            path.style.strokeDashoffset = length;

            // Add the animation class
            path.classList.add("draw-path");

            // Set animation delay inline to stagger strokes
            path.style.animationDelay = `${i * 0.3}s`;
          });
        }
      })
      .catch(() => {
        if (containerRef.current) {
          containerRef.current.innerHTML = `<p style="color:red;">SVG not found for '${kanji}'</p>`;
        }
      });
  }, [svgPath, kanji]);

  // Canvas drawing logic
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let drawing = false;

    const getXY = (e) => {
      const rect = canvas.getBoundingClientRect();
      const x = (e.touches ? e.touches[0].clientX : e.clientX) - rect.left;
      const y = (e.touches ? e.touches[0].clientY : e.clientY) - rect.top;
      return { x, y };
    };

    const startDrawing = (e) => {
      e.preventDefault();
      drawing = true;
      const { x, y } = getXY(e);
      ctx.beginPath();
      ctx.moveTo(x, y);
    };

    const draw = (e) => {
      e.preventDefault();
      if (!drawing) return;
      const { x, y } = getXY(e);
      ctx.lineTo(x, y);
      ctx.strokeStyle = "rgba(0,0,0,0.7)";
      ctx.lineWidth = 4;
      ctx.lineCap = "round";
      ctx.stroke();
    };

    const stopDrawing = (e) => {
      e.preventDefault();
      if (!drawing) return;
      drawing = false;
      ctx.closePath();
      // Placeholder: simple feedback logic
      const isCorrect = Math.random() > 0.3;
      setFeedback(isCorrect ? "✅ Great job!" : "❌ Try again");
    };

    // Attach events
    canvas.addEventListener("mousedown", startDrawing);
    canvas.addEventListener("mousemove", draw);
    canvas.addEventListener("mouseup", stopDrawing);
    canvas.addEventListener("mouseleave", stopDrawing);
    canvas.addEventListener("touchstart", startDrawing, { passive: false });
    canvas.addEventListener("touchmove", draw, { passive: false });
    canvas.addEventListener("touchend", stopDrawing);

    // Cleanup
    return () => {
      canvas.removeEventListener("mousedown", startDrawing);
      canvas.removeEventListener("mousemove", draw);
      canvas.removeEventListener("mouseup", stopDrawing);
      canvas.removeEventListener("mouseleave", stopDrawing);
      canvas.removeEventListener("touchstart", startDrawing);
      canvas.removeEventListener("touchmove", draw);
      canvas.removeEventListener("touchend", stopDrawing);
    };
  }, [kanji]);

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setFeedback(null);
  };

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        padding: "2rem",
        gap: "2rem",
        justifyContent: "center",
      }}
    >
      {/* Info panel */}
      <div style={{ flex: "1 1 300px", maxWidth: 400 }}>
        <h2>Trace Kanji: {kanji}</h2>
        <p>
          <strong>Meaning:</strong>{" "}
          {fileName ? fileName.charAt(0).toUpperCase() + fileName.slice(1) : "Unknown"}
        </p>
        <p>
          <strong>Stroke Order:</strong>
        </p>
        <ol>
          {(kanjiStrokeOrders[kanji] || ["Stroke order data not available"]).map(
            (step, i) => (
              <li key={i}>{step}</li>
            )
          )}
        </ol>
        <p>
          <strong>Tips:</strong> Start strokes from top to bottom, left to right.
        </p>

        <Link to="/" style={{ textDecoration: "underline", color: "blue" }}>
          ← Back to Chart
        </Link>
      </div>

      {/* Kanji + canvas */}
      <div style={{ flex: "1 1 320px", textAlign: "center" }}>
        <div
          style={{
            position: "relative",
            width: 320,
            height: 320,
            margin: "auto",
          }}
        >
          <div
            ref={containerRef}
            style={{
              position: "absolute",
              width: "100%",
              height: "100%",
              opacity: 0.5,
              zIndex: 1,
            }}
          />
          <canvas
            ref={canvasRef}
            width={320}
            height={320}
            style={{
              border: "2px solid #d81b60",
              borderRadius: "12px",
              background: "#fffef2",
              position: "absolute",
              top: 0,
              left: 0,
              zIndex: 2,
              touchAction: "none",
            }}
          />
        </div>
        <div style={{ marginTop: "1rem" }}>
          <button onClick={clearCanvas} style={{ cursor: "pointer" }}>
            🧽 Clear
          </button>
          {feedback && (
            <div
              style={{
                marginTop: "1rem",
                fontSize: "1.2rem",
                color: feedback.startsWith("✅") ? "green" : "red",
              }}
            >
              {feedback}
            </div>
          )}
        </div>
      </div>

      <style>{`
        @keyframes draw {
          to {
            stroke-dashoffset: 0;
          }
        }
        .draw-path {
          animation: draw 0.8s ease forwards;
        }
      `}</style>
    </div>
  );
}

export default TracingPage;
