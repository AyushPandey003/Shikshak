import { ImageResponse } from "next/og";

export const runtime = "edge";

export const alt = "Teacher Portal | Shikshak";
export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default async function Image() {
  const logoData = await fetch(new URL('../../public/logo.png', import.meta.url)).then(
    (res) => res.arrayBuffer()
  );

  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "row",
          backgroundColor: "#FDF4FF", // Fuchsia 50 base
          fontFamily: 'sans-serif',
          overflow: "hidden",
        }}
      >
        {/* Left Panel: Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            width: "60%",
            height: "100%",
            padding: "80px",
            backgroundColor: "white",
            position: "relative",
          }}
        >
          {/* Subtle Grid Pattern */}
           <div style={{
              position: 'absolute',
              top: 0, left: 0, right: 0, bottom: 0,
              backgroundImage: 'linear-gradient(#F0ABFC 1px, transparent 1px), linear-gradient(90deg, #F0ABFC 1px, transparent 1px)',
              backgroundSize: '40px 40px',
              opacity: 0.3,
              display: 'flex',
          }}></div>

            {/* Branding with Logo */}
            <div
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: 40,
            }}
          >
             <img src={logoData as any} width="50" height="50" style={{ marginRight: 15 }} />
             <div
               style={{
                 fontSize: 32,
                 fontWeight: 800,
                 color: "#0F172A", // Slate 900
                 letterSpacing: "-1px",
                 display: 'flex',
               }}
             >
               Shikshak
             </div>
          </div>

          <div
            style={{
              fontSize: 24,
              fontWeight: 700,
              color: "#C026D3", // Fuchsia 600
              marginBottom: 20,
              textTransform: "uppercase",
              letterSpacing: "2px",
              display: "flex",
              alignItems: "center",
            }}
          >
             <div style={{ width: 40, height: 4, background: "#C026D3", marginRight: 15, display: 'flex' }}></div>
             Teacher Portal
          </div>
          <div
            style={{
              fontSize: 64,
              fontWeight: 900,
              color: "#0F172A",
              lineHeight: 1.1,
              letterSpacing: "-2px",
              marginBottom: 30,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Manage Your</span>
            <span>Classroom</span>
          </div>
          <div
            style={{
              fontSize: 28,
              color: "#64748B",
              fontWeight: 400,
              lineHeight: 1.5,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <span>Create courses, track students,</span>
            <span>and inspire learning.</span>
          </div>
        </div>

        {/* Right Panel: Visual Element */}
        <div
          style={{
            display: "flex",
            width: "40%",
            height: "100%",
            backgroundColor: "#D946EF", // Fuchsia 500
            position: "relative",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
          }}
        >
             {/* Circular Patterns */}
             <div style={{
                 position: 'absolute',
                 width: 500, height: 500,
                 borderRadius: '50%',
                 border: '2px solid rgba(255,255,255,0.2)',
                 top: '50%', left: '50%',
                 transform: 'translate(-50%, -50%)',
                 display: 'flex',
             }}></div>
              <div style={{
                 position: 'absolute',
                 width: 350, height: 350,
                 borderRadius: '50%',
                 border: '2px solid rgba(255,255,255,0.2)',
                 top: '50%', left: '50%',
                 transform: 'translate(-50%, -50%)',
                 display: 'flex',
             }}></div>

             <div
            style={{
              fontSize: 120,
              filter: "drop-shadow(0 20px 30px rgba(0,0,0,0.1))",
              transform: "rotate(-5deg)",
              display: 'flex',
            }}
          >
            👩‍🏫
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
