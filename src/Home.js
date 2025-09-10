// src/App.js
import React, { useState } from "react";
import { Link } from "react-router-dom";
import benefitsData from "./benefits.json";
import "./App.css";

export default function App() {
  const [country, setCountry] = useState("");
  const [answers, setAnswers] = useState({
    age: "",
    employment: "",
    income: ""
  });
  const [results, setResults] = useState([]);
  const [submitted, setSubmitted] = useState(false);

  const handleChange = (field, value) => {
    setAnswers((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!country) {
      alert("Please select a country first.");
      return;
    }
    const countryBenefits = benefitsData[country] || [];
    const matched = countryBenefits.filter((b) => {
      const crit = b.criteria || {};
      // every criterion must match (if criterion exists)
      return Object.keys(crit).every((key) => {
        const req = crit[key];
        if (!req || req.length === 0) return true;
        const userVal = answers[key] || "";
        return req.includes(userVal);
      });
    });

    setResults(matched);
    setSubmitted(true);
  };

  const resetForm = () => {
    setCountry("");
    setAnswers({ age: "", employment: "", income: "" });
    setResults([]);
    setSubmitted(false);
  };

  return (
    <div className="app">
      <h1>🌍 Benefit Buddy</h1>

      {!submitted ? (
        <div className="form">
          <label>
            Select Country:
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option value="">--Choose--</option>
              <option value="us">🇺🇸 USA</option>
              <option value="uk">🇬🇧 UK</option>
              <option value="india">🇮🇳 India</option>
            </select>
          </label>

          <p style={{ fontSize: "0.9rem", color: "#666" }}>
            Select a country to enable the questions below.
          </p>

          <label>
            Age Group:
            <select
              value={answers.age}
              onChange={(e) => handleChange("age", e.target.value)}
              disabled={!country}
            >
              <option value="">--Choose--</option>
              <option value="student">Student</option>
              <option value="adult">Adult</option>
              <option value="senior">Senior</option>
            </select>
          </label>

          <label>
            Employment:
            <select
              value={answers.employment}
              onChange={(e) => handleChange("employment", e.target.value)}
              disabled={!country}
            >
              <option value="">--Choose--</option>
              <option value="employed">Employed</option>
              <option value="unemployed">Unemployed</option>
              <option value="self">Self-employed</option>
            </select>
          </label>

          <label>
            Income Level:
            <select
              value={answers.income}
              onChange={(e) => handleChange("income", e.target.value)}
              disabled={!country}
            >
              <option value="">--Choose--</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </label>

          <div style={{ marginTop: 12 }}>
            <button onClick={handleSubmit} disabled={!country}>
              Find Benefits
            </button>
            {" "}
            <Link to="/game">
              <button>🎮 Start Financial Planning</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="results">
          <h2>🎉 Eligible Benefits</h2>

          {results.length ? (
            results.map((b, i) => (
              <div key={i} className="card">
                <h3>{b.name}</h3>
                <p>{b.description}</p>
                <p style={{ fontSize: "0.9rem", color: "#333" }}>
                  <strong>Category:</strong> {b.category || "General"}
                </p>
                <a href={b.link} target="_blank" rel="noreferrer">
                  Apply Here
                </a>
              </div>
            ))
          ) : (
            <p>❌ No matching benefits found. Try adjusting your answers.</p>
          )}

          <div style={{ marginTop: 12 }}>
            <button onClick={resetForm}>🔙 Start Over</button>
            {" "}
            <Link to="/game">
              <button>🎮 Start Financial Planning</button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
