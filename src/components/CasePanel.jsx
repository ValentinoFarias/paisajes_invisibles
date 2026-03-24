// CasePanel.jsx
// Shown in PaisajesPage when a cardinal coordinate is clicked.
// Displays a short summary of where and how the victim died.
// Receives the full case object as `selectedCase`, or null when nothing is selected.

export default function CasePanel({ selectedCase }) {
  // Nothing selected yet — show a neutral placeholder
  if (!selectedCase) {
    return (
      <div className="case-panel case-panel--empty">
        <p className="case-panel-hint">
          Selecciona un punto cardinal para ver el caso.
        </p>
      </div>
    );
  }

  return (
    <div className="case-panel">
      {/* Victim name as the panel heading */}
      <h2 className="case-panel-name">{selectedCase.name}</h2>

      {/* Where they were found / location context */}
      {selectedCase.locationText ? (
        <p className="case-panel-location">{selectedCase.locationText}</p>
      ) : (
        <p className="case-panel-location case-panel-placeholder">
          Información de ubicación por agregar.
        </p>
      )}

      {/* Short account of how they died */}
      {selectedCase.deathSummary ? (
        <p className="case-panel-summary">{selectedCase.deathSummary}</p>
      ) : (
        <p className="case-panel-summary case-panel-placeholder">
          Descripción del caso por agregar.
        </p>
      )}

      {/* Coordinates for reference */}
      {selectedCase.coords && (
        <p className="case-panel-coords">
          {selectedCase.coords[0]}, {selectedCase.coords[1]}
        </p>
      )}
    </div>
  );
}
