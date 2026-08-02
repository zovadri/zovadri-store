"use client";

import React from "react";

export const btn: React.CSSProperties = {
  padding: "10px 18px",
  borderRadius: 10,
  border: "none",
  cursor: "pointer",
  fontFamily: "inherit",
  fontWeight: 700,
  fontSize: ".9rem",
  background: "#ffb703",
  color: "#12203a",
};

export const btnGreen: React.CSSProperties = { ...btn, background: "#22c55e", color: "white" };

export const btnOutline: React.CSSProperties = {
  ...btn,
  background: "white",
  border: "2px solid #e5e7eb",
  color: "#12203a",
};

export const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 8,
  border: "2px solid #e5e7eb",
  fontFamily: "inherit",
  fontSize: ".9rem",
  outline: "none",
  background: "white",
  color: "#1f2937",
};

export const card: React.CSSProperties = {
  background: "white",
  borderRadius: 12,
  boxShadow: "0 2px 12px rgba(0,0,0,.08)",
  padding: 16,
};

export const DemoShell: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div style={{ background: "linear-gradient(135deg,#12203a,#1c2f52)", borderRadius: 18, padding: 26 }}>
    <div
      style={{
        color: "white",
        fontWeight: 900,
        fontSize: "1.15rem",
        marginBottom: 16,
        display: "flex",
        gap: 10,
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      <span style={{ fontSize: "1.3rem" }}>⚡</span>
      {title}
      <span style={{ fontSize: ".68rem", background: "#22c55e", padding: "3px 12px", borderRadius: 999, color: "white", fontWeight: 800 }}>
        عرض حي — جربه
      </span>
    </div>
    {children}
  </div>
);

export const ChatBubble: React.FC<{ from: "bot" | "user"; text: string }> = ({ from, text }) => (
  <div style={{ display: "flex", justifyContent: from === "bot" ? "flex-start" : "flex-end", marginBottom: 10 }}>
    <div
      style={{
        maxWidth: "78%",
        background: from === "bot" ? "white" : "#d9fdd3",
        color: "#1f2937",
        padding: "10px 14px",
        borderRadius: 14,
        borderTopLeftRadius: from === "bot" ? 4 : 14,
        borderTopRightRadius: from === "bot" ? 14 : 4,
        fontSize: ".88rem",
        boxShadow: "0 1px 3px rgba(0,0,0,.08)",
        whiteSpace: "pre-line",
      }}
    >
      {text}
    </div>
  </div>
);

export const ChipRow: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{children}</div>
);
