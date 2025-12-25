import React from "react";

interface FormSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export const FormSection: React.FC<FormSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  children,
}) => {
  return (
    <div style={{ marginBottom: 16, borderBottom: "1px solid #e5e7eb", paddingBottom: 12 }}>
      <button
        type="button"
        onClick={onToggle}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: 16,
          fontWeight: 600,
          marginBottom: 8,
          color: "#1f2937",
          width: "100%",
          textAlign: "left",
          padding: 0,
        }}
      >
        {isExpanded ? "▼" : "▶"} {title}
      </button>
      {isExpanded && <div style={{ marginTop: 12 }}>{children}</div>}
    </div>
  );
};
