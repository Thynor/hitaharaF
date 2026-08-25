import React from "react";

const VERDICT_COPY = {
  unsafe: "Not safe for your profile",
  caution: "Proceed with caution",
  safe: "Looks safe for your profile",
};

export default function ResultPanel({ result, onScanAnother }) {
  const { verdict, summary, ingredients } = result;

  return (
    <section>
      <div className={`verdict-banner ${verdict}`}>
        <span className="verdict-mark">{VERDICT_COPY[verdict]}</span>
        <span className="verdict-copy">{summary}</span>
      </div>

      <div className="label-panel">
        <div className="panel-title">Ingredients Read</div>
        <div className="panel-subrule">
          {ingredients.length} item{ingredients.length === 1 ? "" : "s"} detected
        </div>

        <ul className="ingredient-list">
          {ingredients.map((ing, i) => (
            <li className="ingredient-row" key={i}>
              <span className="ing-text">{ing.text}</span>
              {ing.matched_label && (
                <span className={`ing-note ${ing.status}`}>
                  {ing.matched_label}
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>

      <div className="btn-row">
        <button className="btn" onClick={onScanAnother}>
          Scan another label
        </button>
      </div>

      <p className="footnote">
        This tool reads packaging text with OCR and matches it against a
        known ingredient list — it can miss unclear print or unlisted trade
        names. When in doubt, check the physical packaging or contact the
        manufacturer directly.
      </p>
    </section>
  );
}
