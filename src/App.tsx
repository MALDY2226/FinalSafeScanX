import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { Shield, AlertTriangle, LogIn } from 'lucide-react';
import ScanForm from './components/ScanForm';
import ResultsChart from './components/ResultsChart';

// Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

function App() {
  const [user] = useAuthState(auth);
  const [scanResult, setScanResult] = useState<null | { clean: number; flagged: number }>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getRedirectResult(auth).then((result) => {
      if (result) {
        // User signed in via redirect
        console.log("Signed in via redirect");
      }
    }).catch((error) => {
      setError("Failed to sign in. Please try again.");
      console.error("Redirect sign-in error:", error);
    });
  }, []);

  const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Popup sign-in error:", error);
      // Fallback to redirect method
      await signInWithRedirect(auth, provider);
    }
  };

  const handleScan = async (input: string, isFile: boolean) => {
    setError(null);
    setScanResult(null);

    try {
      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input, isFile }),
      });

      if (!response.ok) {
        throw new Error('Scan failed. Please try again.');
      }

      const result = await response.json();
      setScanResult(result);

      // Log scan activity to Firebase
      if (user) {
        await addDoc(collection(db, 'scans'), {
          userId: user.uid,
          input: isFile ? 'File upload' : input,
          timestamp: new Date(),
          result: result,
        });
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <header className="mb-8 text-center">
        <h1 className="text-4xl font-bold text-blue-600 flex items-center justify-center">
          <Shield className="mr-2" /> SafeScanX
        </h1>
        <p className="text-gray-600 mt-2">Scan files and URLs for malware</p>
      </header>

      {user ? (
        <>
          <ScanForm onScan={handleScan} />
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded flex items-center">
              <AlertTriangle className="mr-2" /> {error}
            </div>
          )}
          {scanResult && <ResultsChart data={scanResult} />}
        </>
      ) : (
        <button
          onClick={signInWithGoogle}
          className="bg-white text-gray-700 font-semibold py-2 px-4 border border-gray-300 rounded shadow-sm hover:bg-gray-50 flex items-center"
        >
          <LogIn className="mr-2" /> Continue with Google
        </button>
      )}
    </div>
  );
}

export default App;