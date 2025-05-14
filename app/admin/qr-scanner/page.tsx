"use client";

import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";

type ScannedResultType = {
  name: string;
  profileImage: string;
  isMemberActive: boolean;
};
const QRScannerPage = () => {
  const [scannedQRId, setScannedQRId] = useState<string | null>("");
  const [scannedResult, setScannedResult] =
    useState<ScannedResultType | null>();
  const [statusMessage, setStatusMessage] = useState<string | null>();
  const scannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const html5QrCode = new Html5Qrcode("reader");
    const config = { fps: 10, qrbox: 250 };

    html5QrCode
      .start(
        { facingMode: "environment" }, // back camera
        config,
        (decodedText) => {
          console.log("Scanned userId:", decodedText);
          setScannedQRId(decodedText);
        },
        (error) => {
          // optional: console.log('Scan error:', error);
        }
      )
      .catch((err) => {
        console.error("QR Scanner failed to start", err);
      });

    return () => {
      html5QrCode.stop().catch(console.error);
    };
  }, []);

  //Api call to check-in
  useEffect(() => {
    async function checkInUser() {
      try {
        const res = await fetch("/api/admin/check-in", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: scannedQRId }),
        });
        const data = await res.json();
        if (res.ok) {
          setStatusMessage(data.message || "Check-in succesful!");
        } else {
          setStatusMessage(data.message || "Check-in failed");
        }
      } catch (error) {
        console.error("Error checking in", error);
        setStatusMessage("An error occurred");
      }
    }

    setTimeout(() => {
      setStatusMessage(null);
    }, 5000);
    checkInUser();
  }, [scannedQRId]);
  setTimeout(() => {
    setScannedQRId("");
  }, 5000);
  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Escanear QR de miembro</h1>
      <p>{`Usuario escaneado ${scannedQRId}`}</p>
      {statusMessage && <p>Status: {statusMessage}</p>}
      <div
        id="reader"
        className="w-full max-w-md mx-auto"
        ref={scannerRef}
      ></div>
    </div>
  );
};

export default QRScannerPage;
