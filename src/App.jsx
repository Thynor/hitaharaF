import React, { useEffect, useState } from "react";
import ProfileSetup from "./components/ProfileSetup.jsx";
import Scanner from "./components/Scanner.jsx";
import ResultPanel from "./components/ResultPanel.jsx";
import { fetchAllergenCatalog, scanLabel } from "./api.js";

const STORAGE_KEY = "allergen-scanner:profile";

function loadStoredProfile() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [catalog, setCatalog] = useState(null);
  const [catalogError, setCatalogError] = useState(null);
  const [selected, setSelected] = useState(loadStoredProfile());
  const [view, setView] = useState(selected.length ? "scan" : "profile");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchAllergenCatalog()
      .then(setCatalog)
      .catch((e) => setCatalogError(e.message));
  }, []);

  function toggleAllergen(key) {
    setSelected((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key]
    );
  }

  function saveProfileAndContinue() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(selected));
    setView("scan");
  }

  async function handleScan(file) {
    setIsLoading(true);
    setError(null);
    try {
      const res = await scanLabel(file, selected);
      setResult(res);
      setView("result");
    } catch (e) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
  }

  const steps = ["profile", "scan", "result"];
  const activeStepIndex = steps.indexOf(view);

  return (
    <div className="app-shell">
      <header className="masthead">
        <div className="wordmark">
          Label<span>.</span>
        </div>
        <div className="tagline">Personal Allergen Scanner</div>
      </header>

      <div className="step-row">
        <span className={`step${activeStepIndex >= 0 ? " active" : ""}`}>
          01 · Profile
        </span>
        <span className={`step${activeStepIndex >= 1 ? " active" : ""}`}>
          02 · Scan
        </span>
        <span className={`step${activeStepIndex >= 2 ? " active" : ""}`}>
          03 · Result
        </span>
      </div>

      {catalogError && (
        <div className="error-box">
          Couldn't reach the backend ({catalogError}). Make sure the API
          server is running on port 8000.
        </div>
      )}

      {!catalog && !catalogError && <p>Loading allergen catalog…</p>}

      {catalog && view === "profile" && (
        <ProfileSetup
          catalog={catalog}
          selected={selected}
          onToggle={toggleAllergen}
          onContinue={saveProfileAndContinue}
        />
      )}

      {catalog && view === "scan" && (
        <Scanner
          onScan={handleScan}
          isLoading={isLoading}
          error={error}
          onEditProfile={() => setView("profile")}
        />
      )}

      {view === "result" && result && (
        <ResultPanel
          result={result}
          onScanAnother={() => {
            setResult(null);
            setView("scan");
          }}
        />
      )}
    </div>
  );
}
