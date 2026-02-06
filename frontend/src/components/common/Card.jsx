

export default function Card({ title, children }) {
  return (
    <div
      style={{
        background: "#0F172A", // solid modern dark
        padding: "20px",
        borderRadius: "14px",
        color: "#E5E7EB",
        border: "1px solid rgba(255,255,255,0.06)",
        boxShadow: "0 8px 24px rgba(0,0,0,0.35)",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.boxShadow =
          "0 12px 28px rgba(0,0,0,0.45)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
        e.currentTarget.style.boxShadow =
          "0 8px 24px rgba(0,0,0,0.35)";
      }}
    >
      {title && (
        <h3
          style={{
            marginBottom: "12px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#F9FAFB",
            letterSpacing: "0.2px",
          }}
        >
          {title}
        </h3>
      )}
      {children}
    </div>
  );
}