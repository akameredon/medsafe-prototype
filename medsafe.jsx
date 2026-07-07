import React, { useState } from "react";
import { AlertTriangle, Plus, X, ShieldCheck, Clock, Volume2, ChevronRight, FileText } from "lucide-react";

// --- Illustrative sample data only. Not a real medical database. ---
// In production this would be backed by a licensed interaction database (e.g. First Databank, Micromedex).
const KNOWN_DRUGS = [
  "Warfarin", "Aspirin", "Metformin", "Lisinopril", "Ibuprofen",
  "Atorvastatin", "Levothyroxine", "Amlodipine", "Omeprazole", "Metoprolol",
  "Furosemide", "Prednisone", "Insulin", "Sertraline", "Clopidogrel",
];

const SAMPLE_INTERACTIONS = [
  { pair: ["Warfarin", "Aspirin"], severity: "high", note: "Combined use raises bleeding risk. Flag for prescriber review before continuing both." },
  { pair: ["Warfarin", "Ibuprofen"], severity: "high", note: "NSAIDs can increase bleeding risk when taken with blood thinners." },
  { pair: ["Lisinopril", "Furosemide"], severity: "medium", note: "Combined use can lower blood pressure or affect kidney function — monitor closely." },
  { pair: ["Metformin", "Furosemide"], severity: "low", note: "Diuretics can occasionally affect blood sugar control." },
  { pair: ["Sertraline", "Aspirin"], severity: "medium", note: "May slightly increase bleeding risk; not usually dangerous but worth flagging." },
  { pair: ["Clopidogrel", "Omeprazole"], severity: "medium", note: "Omeprazole may reduce how well clopidogrel works." },
];

const SEVERITY_STYLES = {
  high: { bg: "#FDEDEB", border: "#E4574C", text: "#8A2A22", label: "High priority" },
  medium: { bg: "#FDF3E3", border: "#D9922C", text: "#7A5417", label: "Worth reviewing" },
  low: { bg: "#EAF3EC", border: "#4E9A6E", text: "#2C5A40", label: "Minor note" },
};

function findInteractions(list) {
  const found = [];
  for (let i = 0; i < list.length; i++) {
    for (let j = i + 1; j < list.length; j++) {
      const match = SAMPLE_INTERACTIONS.find(
        (x) =>
          (x.pair[0] === list[i] && x.pair[1] === list[j]) ||
          (x.pair[0] === list[j] && x.pair[1] === list[i])
      );
      if (match) found.push(match);
    }
  }
  return found;
}

export default function MedSafeDemo() {
  const [meds, setMeds] = useState(["Warfarin", "Ibuprofen"]);
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [screen, setScreen] = useState("check"); // check | reminders | about

  const handleInput = (val) => {
    setInput(val);
    if (val.length > 0) {
      setSuggestions(
        KNOWN_DRUGS.filter(
          (d) => d.toLowerCase().includes(val.toLowerCase()) && !meds.includes(d)
        ).slice(0, 5)
      );
    } else {
      setSuggestions([]);
    }
  };

  const addMed = (name) => {
    if (!name || meds.includes(name)) return;
    setMeds([...meds, name]);
    setInput("");
    setSuggestions([]);
  };

  const removeMed = (name) => setMeds(meds.filter((m) => m !== name));

  const interactions = findInteractions(meds);

  return (
    <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: "#F7F5F0", minHeight: "100%", padding: "0" }}>
      {/* Header */}
      <div style={{ background: "#1F3D3A", padding: "28px 24px 24px", color: "#F7F5F0" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <ShieldCheck size={26} color="#8FCB9B" />
          <div>
            <div style={{ fontSize: 19, fontWeight: 700, letterSpacing: -0.3 }}>MedSafe</div>
            <div style={{ fontSize: 12.5, color: "#B9CFC7", marginTop: 1 }}>
              Home medication safety check — prototype
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", background: "#1F3D3A", padding: "0 24px" }}>
        {[
          { id: "check", label: "Check meds" },
          { id: "reminders", label: "Reminders" },
          { id: "about", label: "About this demo" },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setScreen(t.id)}
            style={{
              background: "none",
              border: "none",
              color: screen === t.id ? "#F7F5F0" : "#8FA69E",
              borderBottom: screen === t.id ? "2px solid #8FCB9B" : "2px solid transparent",
              padding: "10px 14px 12px",
              fontSize: 13.5,
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div style={{ padding: "22px 20px 40px", maxWidth: 560, margin: "0 auto" }}>
        {screen === "check" && (
          <>
            {/* Add medication */}
            <div style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D3A", marginBottom: 10 }}>
                Add a medication
              </div>
              <div style={{ position: "relative" }}>
                <input
                  value={input}
                  onChange={(e) => handleInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && addMed(input)}
                  placeholder="Type a medication name…"
                  style={{
                    width: "100%",
                    border: "1px solid #DDD8CC",
                    borderRadius: 10,
                    padding: "11px 14px",
                    fontSize: 14.5,
                    outline: "none",
                    boxSizing: "border-box",
                  }}
                />
                {suggestions.length > 0 && (
                  <div style={{ position: "absolute", top: "110%", left: 0, right: 0, background: "#fff", border: "1px solid #E5E1D5", borderRadius: 10, zIndex: 10, overflow: "hidden", boxShadow: "0 6px 18px rgba(0,0,0,0.08)" }}>
                    {suggestions.map((s) => (
                      <div
                        key={s}
                        onClick={() => addMed(s)}
                        style={{ padding: "10px 14px", fontSize: 14, cursor: "pointer", borderBottom: "1px solid #F0EDE3" }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {s}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 14 }}>
                {meds.map((m) => (
                  <div
                    key={m}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: "#EEF0E5",
                      color: "#1F3D3A",
                      borderRadius: 20,
                      padding: "6px 8px 6px 12px",
                      fontSize: 13.5,
                      fontWeight: 600,
                    }}
                  >
                    {m}
                    <X size={14} style={{ cursor: "pointer" }} onClick={() => removeMed(m)} />
                  </div>
                ))}
                {meds.length === 0 && (
                  <div style={{ fontSize: 13, color: "#9A9585" }}>No medications added yet.</div>
                )}
              </div>
            </div>

            {/* Results */}
            <div style={{ marginTop: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D3A", marginBottom: 10 }}>
                {interactions.length > 0
                  ? `${interactions.length} thing${interactions.length > 1 ? "s" : ""} to review`
                  : meds.length >= 2
                  ? "No known conflicts found"
                  : "Add two or more medications to check"}
              </div>

              {interactions.map((it, i) => {
                const s = SEVERITY_STYLES[it.severity];
                return (
                  <div
                    key={i}
                    style={{
                      background: s.bg,
                      border: `1px solid ${s.border}33`,
                      borderLeft: `4px solid ${s.border}`,
                      borderRadius: 10,
                      padding: "14px 16px",
                      marginBottom: 10,
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <AlertTriangle size={15} color={s.border} />
                      <span style={{ fontSize: 12.5, fontWeight: 700, color: s.text }}>{s.label}</span>
                    </div>
                    <div style={{ fontSize: 13.5, color: "#3A362C", fontWeight: 600, marginBottom: 3 }}>
                      {it.pair[0]} + {it.pair[1]}
                    </div>
                    <div style={{ fontSize: 13, color: "#5C574A", lineHeight: 1.5 }}>{it.note}</div>
                  </div>
                );
              })}

              {meds.length >= 2 && interactions.length === 0 && (
                <div style={{ background: "#fff", borderRadius: 10, padding: 16, fontSize: 13.5, color: "#5C574A" }}>
                  Nothing in this combination matches our sample interaction list. This prototype checks a small
                  illustrative dataset — a production version would connect to a licensed clinical database.
                </div>
              )}
            </div>
          </>
        )}

        {screen === "reminders" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D3A", marginBottom: 12 }}>
              Today's reminders
            </div>
            {meds.length === 0 && (
              <div style={{ fontSize: 13.5, color: "#9A9585" }}>Add medications on the Check tab to see reminders here.</div>
            )}
            {meds.map((m, i) => (
              <div key={m} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: i < meds.length - 1 ? "1px solid #F0EDE3" : "none" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <Clock size={16} color="#1F3D3A" />
                  <div>
                    <div style={{ fontSize: 13.5, fontWeight: 600, color: "#1F3D3A" }}>{m}</div>
                    <div style={{ fontSize: 12, color: "#9A9585" }}>8:00 AM · 1 tablet</div>
                  </div>
                </div>
                <Volume2 size={16} color="#8FA69E" style={{ cursor: "pointer" }} />
              </div>
            ))}
            <div style={{ fontSize: 11.5, color: "#9A9585", marginTop: 14, lineHeight: 1.5 }}>
              In production: voice playback in the caregiver's language, SMS fallback for phones without data,
              and a caregiver dashboard for missed doses.
            </div>
          </div>
        )}

        {screen === "about" && (
          <div style={{ background: "#fff", borderRadius: 14, padding: 20, boxShadow: "0 1px 3px rgba(0,0,0,0.06)" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <FileText size={17} color="#1F3D3A" />
              <div style={{ fontSize: 14, fontWeight: 700, color: "#1F3D3A" }}>What this prototype shows</div>
            </div>
            <div style={{ fontSize: 13.5, color: "#3A362C", lineHeight: 1.7 }}>
              This is a clickable demo of a home medication-safety tool aimed at caregivers and patients managing
              multiple prescriptions, especially in low-connectivity or low-literacy settings.
              <br /><br />
              <strong>What's real:</strong> the interaction-checking flow, the reminder screen, and the interface
              are fully working.
              <br /><br />
              <strong>What's illustrative:</strong> the drug interaction data is a small sample list for demo
              purposes only — not a certified medical database. A funded version would license a real clinical
              interaction database and involve a pharmacist or physician in validation before any real-world use.
              <br /><br />
              <strong>Why it's fundable:</strong> medication errors are a large, well-documented cause of
              preventable hospitalizations, and most existing tools assume constant internet access and English
              literacy — this doesn't.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
