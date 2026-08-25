import React from "react";

export default function ProfileSetup({ catalog, selected, onToggle, onContinue }) {
  const entries = Object.entries(catalog);

  return (
    <section>
      <div className="hero">
        <h1>What should we watch for on your label?</h1>
        <p>
          Select every allergen or additive you avoid. Each scan is checked
          against this list — nothing is stored on a server, it stays on
          your device.
        </p>
      </div>

      <div className="allergen-grid">
        {entries.map(([key, info]) => {
          const isSelected = selected.includes(key);
          return (
            <div
              key={key}
              className={`allergen-chip${isSelected ? " selected" : ""}`}
              onClick={() => onToggle(key)}
              role="checkbox"
              aria-checked={isSelected}
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onToggle(key);
              }}
            >
              <span>{info.label}</span>
              <span className="severity-tag">{info.severity}</span>
            </div>
          );
        })}
      </div>

      <div className="btn-row">
        <button
          className="btn"
          onClick={onContinue}
          disabled={selected.length === 0}
        >
          Save profile &amp; continue
        </button>
      </div>
    </section>
  );
}
