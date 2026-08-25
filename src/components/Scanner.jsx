import React, { useRef, useState } from "react";

export default function Scanner({ onScan, isLoading, error, onEditProfile }) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [file, setFile] = useState(null);

  function handleFile(f) {
    if (!f) return;
    setFile(f);
    setPreviewUrl(URL.createObjectURL(f));
  }

  function handleDrop(e) {
    e.preventDefault();
    const f = e.dataTransfer.files?.[0];
    handleFile(f);
  }

  return (
    <section>
      <div className="hero">
        <h1>Scan a label.</h1>
        <p>
          Photograph the ingredients panel of any packaged food. We'll read
          it and check it against your profile in a few seconds.
        </p>
      </div>

      {error && <div className="error-box">{error}</div>}

      {previewUrl ? (
        <div className="preview-wrap">
          <img src={previewUrl} alt="Selected food label" />
          {isLoading && <div className="scan-line" />}
        </div>
      ) : (
        <div
          className="dropzone"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <p className="dz-title">Tap to photograph or upload a label</p>
          <p>JPG or PNG · close-up, well-lit shots read best</p>
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        hidden
        onChange={(e) => handleFile(e.target.files?.[0])}
      />

      {isLoading && (
        <p className="processing-note">Reading ingredients &amp; checking your profile…</p>
      )}

      <div className="btn-row">
        <button
          className="btn"
          disabled={!file || isLoading}
          onClick={() => onScan(file)}
        >
          {isLoading ? "Scanning…" : "Scan this label"}
        </button>
        {previewUrl && !isLoading && (
          <button
            className="btn btn-ghost"
            onClick={() => {
              setFile(null);
              setPreviewUrl(null);
            }}
          >
            Choose a different photo
          </button>
        )}
        <button className="btn btn-ghost" onClick={onEditProfile}>
          Edit allergy profile
        </button>
      </div>
    </section>
  );
}
