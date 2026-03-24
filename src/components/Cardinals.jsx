"use client";

// Cardinals.jsx
// Displays the list of names + coordinates from the cases data.
// When a coordinate is clicked it calls onSelect(caseData) so the parent
// can move the 3D camera and open the CasePanel.

import { CASES } from "@/data/cases";

// Formats [lat, lng] as a readable string, e.g. "-29.91253, -71.2584"
function formatCoords([lat, lng]) {
  return `${lat}, ${lng}`;
}

// Groups the flat CASES array by the `group` field, preserving order.
// Returns an array of arrays, e.g. [[case1, case2], [case3], ...]
function groupCases(cases) {
  const result = [];
  let currentGroup = null;
  let currentBucket = [];

  for (const c of cases) {
    if (c.group !== currentGroup) {
      // Starting a new group — save the previous bucket and open a new one
      if (currentBucket.length > 0) result.push(currentBucket);
      currentGroup = c.group;
      currentBucket = [c];
    } else {
      currentBucket.push(c);
    }
  }

  // Don't forget the last bucket
  if (currentBucket.length > 0) result.push(currentBucket);

  return result;
}

// onSelect — called with the full case object when a coordinate is clicked.
// selectedId — id of the currently selected case, used to highlight it.
export default function Cardinals({ onSelect, selectedId }) {
  const groups = groupCases(CASES);

  return (
    <div className="cardinals">
      {groups.map((group, groupIndex) => (
        <div key={groupIndex} className="cardinals-group">
          {group.map((caseData) => (
            <div key={caseData.id} className="cardinals-entry">

              {/* Name — always shown as plain text */}
              <span
                className={`cardinals-name ${selectedId === caseData.id ? "is-selected" : ""}`}
              >
                {caseData.name}
              </span>

              {/* Coordinates — only shown when available, clicking selects this case */}
              {caseData.coords && (
                <button
                  type="button"
                  className={`cardinals-coords ${selectedId === caseData.id ? "is-selected" : ""}`}
                  onClick={() => onSelect(caseData)}
                  aria-label={`Ver caso de ${caseData.name}`}
                >
                  {formatCoords(caseData.coords)}
                </button>
              )}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
