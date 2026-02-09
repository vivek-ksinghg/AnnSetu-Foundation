

// import React, { useRef, useContext, useState } from "react";
// import { jsPDF } from "jspdf";
// import html2canvas from "html2canvas";
// import axios from "axios";
// import { assets } from "../assets/assets";
// import { AppContext } from "../context/Appcontext";

// function CertificateGenerator() {
//   const certRef = useRef();
//   const { donor, backendUrl, token } = useContext(AppContext);

//   const [isGenerated, setIsGenerated] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [certificateData, setCertificateData] = useState(null);
//   const [error, setError] = useState("");

//   const recipientName =
//     certificateData?.donorName || donor?.name || "Recipient Name";

//   // 🔹 Generate Certificate
//   const generateCertificate = async () => {
//     try {
//       setLoading(true);
//       setError("");

//       const res = await axios.post(
//         `${backendUrl}/api/certificates/generate`,
//         {},
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         },
//       );

//       setCertificateData(res.data.certificateData);
//       setIsGenerated(true);
//     } catch (err) {
//       setError(err.response?.data?.message || "Something went wrong");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // ✅ TOTAL FOOD + PACKETS CALCULATION (FIX)
//   const getTotalFoodSummary = () => {
//     let totalKg = 0;
//     let totalPackets = 0;

//     if (Array.isArray(certificateData?.foodSummary)) {
//       certificateData.foodSummary.forEach((item) => {
//         const unit = item.unit.toLowerCase();

//         if (unit.includes("kg")) {
//           totalKg += Number(item.quantity);
//         } else if (unit.includes("packet")) {
//           totalPackets += Number(item.quantity);
//         }
//       });
//     }

//     return { totalKg, totalPackets };
//   };

//   const { totalKg, totalPackets } = getTotalFoodSummary();

//   // 🔹 Download PDF
//   const downloadPDF = async () => {
//     const input = certRef.current;
//     if (!input) return;

//     const canvas = await html2canvas(input, {
//       scale: 2,
//       useCORS: true,
//     });

//     const imgData = canvas.toDataURL("image/png");

//     const pdf = new jsPDF("landscape", "mm", "a4");
//     const pdfWidth = pdf.internal.pageSize.getWidth();
//     const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

//     pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
//     pdf.save(`${recipientName}_Certificate.pdf`);
//   };

//   return (
//     <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6 mt-20">
//       {error && <p className="text-red-600 mb-4">{error}</p>}

//       {/* Generate Button */}
//       {!isGenerated && (
//         <button
//           onClick={generateCertificate}
//           disabled={loading}
//           className="bg-green-700 hover:bg-green-800 text-white py-4 px-10 rounded-full text-xl font-semibold shadow-lg"
//         >
//           {loading ? "Generating..." : "🎓 Generate Certificate"}
//         </button>
//       )}

//       {/* Certificate */}
//       {isGenerated && certificateData && (
//         <>
//           <div
//             ref={certRef}
//             style={{
//               width: "1123px",
//               height: "794px",
//               padding: "40px",
//               background:
//                 "linear-gradient(to bottom right, #f9fff9 0%, #e8f7e8 100%)",
//               border: "20px solid #4CAF50",
//               borderRadius: "20px",
//               position: "relative",
//               textAlign: "center",
//               fontFamily: "'Times New Roman', serif",
//             }}
//           >
//             {/* Logo */}
//             <img
//               src={assets.logo}
//               alt="NGO Logo"
//               style={{
//                 width: "120px",
//                 position: "absolute",
//                 top: "40px",
//                 left: "40px",
//               }}
//             />

//             <h1
//               style={{
//                 fontSize: "42px",
//                 color: "#2e7d32",
//                 fontWeight: "bold",
//               }}
//             >
//               Certificate of Appreciation
//             </h1>

//             <p style={{ fontSize: "20px", color: "#388e3c" }}>
//               Presented by <b>AnnSetu Foundation</b>
//             </p>

//             <p style={{ fontSize: "22px", marginTop: "40px" }}>
//               This is proudly presented to
//             </p>

//             <h2 style={{ fontSize: "36px", color: "#1b5e20" }}>
//               {recipientName}
//             </h2>

//             <p
//               style={{
//                 fontSize: "20px",
//                 maxWidth: "900px",
//                 margin: "40px auto",
//               }}
//             >
//               For generously contributing between{" "}
//               <b>{new Date(certificateData.fromDate).toDateString()}</b> and{" "}
//               <b>{new Date(certificateData.toDate).toDateString()}</b>.
             
//             </p>
// <p style={{fontSize:"20px"}}>In recognition of your generous contributions and heartfelt support.
// Your honest efforts have helped us create a positive change and touch many lives.
// We extend our deepest gratitude for your kindness and commitment

// </p>
//             {/* Individual Food List (UNCHANGED) */}
//             <div
//               style={{
//                 maxWidth: "900px",
//                 margin: "0 auto 25px auto",
//                 textAlign: "left",
//               }}
//             >
//               {/* ✅ TOTAL SUMMARY (FIXED PART) */}
//               <p
//                 style={{
//                   fontSize: "18px",
//                   color: "#1b5e20",
//                   fontWeight: "bold",

//                   marginTop: "16px",
//                 }}
//               >
//                 Total Donation Summary
//               </p>

//               <p style={{ fontSize: "18px", color: "#333" }}>
//                 {totalKg} Kg Food • {totalPackets} Packets • ₹
//                 {certificateData.totalMoney}
//               </p>
//             </div>

//             <div style={{ marginTop: "20px" }}>
//               <p>Date</p>
//               <b>{new Date(certificateData.toDate).toDateString()}</b>
//             </div>

//             <div
//               style={{
//                 position: "absolute",
//                 bottom: "60px",
//                 left: "0",
//                 right: "0",
//                 display: "flex",
//                 justifyContent: "space-around",
//               }}
//             >
//               <div style={{ textAlign: "center" }}>
//                 <p style={{ fontWeight: "bold" }}>President</p>

//                 <p style={{ marginBottom: "4px" }}>Yashasvi Tiwary</p>

//                 <div
//                   style={{
//                     width: "160px",
//                     borderBottom: "2px solid #000",
//                     margin: "0 auto",
//                   }}
//                 ></div>
//               </div>

//               <div style={{ textAlign: "center" }}>
//                 <p style={{ fontWeight: "bold" }}>Founder</p>

//                 <p style={{ marginBottom: "4px" }}>Vivek Kumar Singh</p>

//                 <div
//                   style={{
//                     width: "160px",
//                     borderBottom: "2px solid #000",
//                     margin: "0 auto",
//                   }}
//                 ></div>
//               </div>
//               <div style={{ textAlign: "center" }}>
//                 <p style={{ fontWeight: "bold" }}>Co-Founder</p>

//                 <p style={{ marginBottom: "4px" }}>Satyam Kumar Singh</p>

//                 <div
//                   style={{
//                     width: "160px",
//                     borderBottom: "2px solid #000",
//                     margin: "0 auto",
//                   }}
//                 ></div>
//               </div>
//             </div>
//           </div>

//           {/* Download Button */}
//           <button
//             onClick={downloadPDF}
//             className="mt-8 bg-green-700 hover:bg-green-800 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg"
//           >
//             📥 Download Certificate
//           </button>
//         </>
//       )}
//     </div>
//   );
// }

// export default CertificateGenerator;



import React, { useRef, useContext, useState, useMemo } from "react";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import axios from "axios";
import { assets } from "../assets/assets";
import { AppContext } from "../context/Appcontext";

function CertificateGenerator() {
  const certRef = useRef();
  const { donor, backendUrl, token } = useContext(AppContext);

  const [isGenerated, setIsGenerated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [error, setError] = useState("");

  const recipientName =
    certificateData?.donorName || donor?.name || "Recipient Name";

  // ✅ Certificate Number
  const certificateNumber = useMemo(() => {
    const str = Math.random().toString(36).substring(2, 6).toUpperCase();
    const num = Math.floor(100000 + Math.random() * 900000);
    return `ANN-${str}-${num}`;
  }, []);

  // 🔹 Generate Certificate
  const generateCertificate = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.post(
        `${backendUrl}/api/certificates/generate`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCertificateData(res.data.certificateData);
      setIsGenerated(true);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Total Food Calculation
  const getTotalFoodSummary = () => {
    let totalKg = 0;
    let totalPackets = 0;

    if (Array.isArray(certificateData?.foodSummary)) {
      certificateData.foodSummary.forEach((item) => {
        const unit = item.unit.toLowerCase();
        if (unit.includes("kg")) totalKg += Number(item.quantity);
        else if (unit.includes("packet")) totalPackets += Number(item.quantity);
      });
    }
    return { totalKg, totalPackets };
  };

  const { totalKg, totalPackets } = getTotalFoodSummary();
  const colors = useMemo(
    () => ({
      green700: "#15803d",
      green800: "#166534",
      green900: "#14532d",
      slate900: "#0f172a",
      slate700: "#334155",
      gray700: "#374151",
      black: "#000000",
    }),
    []
  );

  const downloadPDF = async () => {
    try {
      const element = certRef.current;
      if (!element) {
        setError("Certificate not ready");
        return;
      }

      setError("");

      const imgEls = Array.from(element.querySelectorAll("img"));
      await Promise.all(
        imgEls.map(
          (img) =>
            new Promise((resolve) => {
              if (img.complete) return resolve();
              img.onload = () => resolve();
              img.onerror = () => resolve();
            }),
        ),
      );

      const safeScale = Math.min(2, window.devicePixelRatio || 1);

      try {
        const canvas = await html2canvas(element, {
          useCORS: true,
          scale: safeScale,
          backgroundColor: "#ffffff",
          scrollX: 0,
          scrollY: -window.scrollY,
        });

        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF("landscape", "mm", "a4");
        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        const y = Math.max(0, (pageHeight - imgHeight) / 2);

        pdf.addImage(imgData, "PNG", 0, y, imgWidth, imgHeight);
        pdf.save(`${recipientName}_Certificate.pdf`);
        return;
      } catch (err) {
        try {
          const pdf = new jsPDF("landscape", "mm", "a4");
          const pageWidth = pdf.internal.pageSize.getWidth();
          await pdf.html(element, {
            x: 0,
            y: 0,
            width: pageWidth,
            windowWidth: element.scrollWidth,
            html2canvas: { useCORS: true, scale: 1 },
            autoPaging: "text",
          });
          pdf.save(`${recipientName}_Certificate.pdf`);
          return;
        } catch (err2) {
          setError(`Certificate download failed: ${err2?.message || err?.message || "Unknown error"}`);
        }
      }
    } catch (err) {
      setError(`Certificate download failed: ${err?.message || "Unknown error"}`);
    }
  };




  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center p-6 mt-20">
      {error && <p className="text-red-600 mb-4">{error}</p>}

      {!isGenerated && (
        <p className="mb-4 text-sm text-yellow-800 bg-yellow-100 border border-yellow-300 px-4 py-2 rounded-lg">
          ⚠️ Important: Once you generate the certificate, you must download it.
          Certificate data will be locked after generation.
        </p>
      )}

      {!isGenerated && (
        <button
          onClick={generateCertificate}
          disabled={loading}
          className="bg-green-700 hover:bg-green-800 text-white py-4 px-10 rounded-full text-xl font-semibold shadow-lg"
        >
          {loading ? "Generating..." : "🎓 Generate Certificate"}
        </button>
      )}

      {isGenerated && certificateData && (
        <>
          <div
            ref={certRef}
            className="relative"
            style={{
              width: "1123px",
              height: "794px",
              padding: "40px",
              background:
                "linear-gradient(to bottom right, #f9fff9 0%, #e8f7e8 100%)",
              border: "20px solid #4CAF50",
              borderRadius: "20px",
              textAlign: "center",
              fontFamily: "'Times New Roman', serif",
              color: colors.slate900,
            }}
          >
            {/* Date */}
       
            {/* Certificate No */}
            <div className="absolute top-6 right-6 text-sm">
              <p>Certificate No.</p>
              <b>{certificateNumber}</b>
            </div>

            {/* Logo */}
            <img
              src={assets.logo}
              alt="NGO Logo"
              crossOrigin="anonymous"
              className="absolute top-10 left-10 w-30"
            />

            <h1
              className="text-[42px] font-bold"
              style={{ color: colors.green800 }}
            >
              Certificate of Appreciation
            </h1>

            <p className="text-[20px]" style={{ color: colors.green700 }}>
              Presented by <b>AnnSetu Foundation</b>
            </p>

            <p className="text-[22px] mt-10">
              This is proudly presented to
            </p>

            <h2 className="text-[36px]" style={{ color: colors.green900 }}>
              {recipientName}
            </h2>

            <p className="text-[20px] max-w-225 mx-auto mt-8">
              For generously contributing between{" "}
              <b>{new Date(certificateData.fromDate).toDateString()}</b> and{" "}
              <b>{new Date(certificateData.toDate).toDateString()}</b>.
            </p>

            <p className="text-[20px] mt-6 px-10">
              In recognition of your generous contributions and heartfelt
              support. Your honest efforts have helped us create a positive
              change and touch many lives. We extend our deepest gratitude for
              your kindness and commitment.
            </p>

            {/* Summary */}
            <div className="mt-10 text-center">
              <p
                className="text-[20px] font-bold"
                style={{ color: colors.green800 }}
              >
                Total Donation Summary
              </p>
              <p className="text-[18px] mt-2">
                {totalKg} Kg Food • {totalPackets} Packets • ₹
                {certificateData.totalMoney}
              </p>
            </div>

                 <div className="absolute mt-5 left-6 text-sm text-left">
              <p className="text-center">Date</p>
              <b>{new Date(certificateData.toDate).toDateString()}</b>
            </div>


            {/* Signatures */}
            <div className="absolute bottom-14 left-0 right-0 flex justify-around">
              {[
                { role: "President", name: "Yashasvi Tiwary" },
                { role: "Founder", name: "Vivek Kumar Singh" },
                { role: "Co-Founder", name: "Satyam Kumar Singh" },
              ].map((item) => (
                <div key={item.role} className="text-center">
                  <p className="font-bold">{item.role}</p>
                  <p className="mb-1">{item.name}</p>
                  <div
                    className="w-40 border-b-2 mx-auto"
                    style={{ borderColor: colors.black }}
                  ></div>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={downloadPDF}
            className="mt-8 bg-green-700 hover:bg-green-800 text-white py-3 px-8 rounded-full text-lg font-semibold shadow-lg"
          >
            📥 Download Certificate
          </button>
        </>
      )}
    </div>
  );
}

export default CertificateGenerator;
