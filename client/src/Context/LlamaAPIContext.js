import React, { createContext, useContext, useState } from "react";
import axios from "axios"; // Εισαγωγή της axios για τα αιτήματα
import { baseUrl } from "../Utils/servise.js"; // Υποθέτουμε ότι το baseUrl περιέχει το URL του backend

// Δημιουργία Context
const LlamaAPIContext = createContext();

// Παροχέας (Provider) του Context
export const LlamaAPIProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);

  // Λειτουργία που στέλνει το κείμενο στο backend
  const reqGroq = async (text) => {
    setLoading(true); // Έναρξη φόρτωσης
    setError(null); // Επαναφορά του error state πριν από το νέο αίτημα

    try {
      // Κάνουμε POST στο backend
      const res = await axios.post(`${baseUrl}/llamaReq/request`, { text });

      // Αν η απόκριση είναι επιτυχής, αποθηκεύουμε το JSON
      if (res.status === 200) {
        setResponse(res.data); // Αποθηκεύουμε την απόκριση
        return res.data; // Επιστρέφουμε την απόκριση για επιπλέον χρήση
      } else {
        throw new Error("Unexpected response status: " + res.status);
      }
    } catch (err) {
      // Αποθηκεύουμε το σφάλμα
      setError(err.message || "Something went wrong");
      console.error("Error in reqGroq:", err);
    } finally {
      setLoading(false); // Ολοκλήρωση φόρτωσης
    }
  };

  return (
    <LlamaAPIContext.Provider
      value={{
        loading,
        error,
        response,
        reqGroq, // Επιστρέφουμε τη λειτουργία reqGroq στο context
      }}
    >
      {children}
    </LlamaAPIContext.Provider>
  );
};

export const useLlamaAPI = () => useContext(LlamaAPIContext);