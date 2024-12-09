import React, { useState, useEffect, useRef  } from "react";
import "./chat.css";
import logo from '../../assets/images/logo.png';
import { useLlamaAPI } from "../../Context/LlamaAPIContext";

const Chat = () => {
  const [messages, setMessages] = useState([]); // Κρατάει όλα τα μηνύματα (χρήστη και API)
  const [currentMessage, setCurrentMessage] = useState(""); // Το μήνυμα που πληκτρολογεί ο χρήστης
  const { reqGroq, loading, error } = useLlamaAPI();
  const [animatedText, setAnimatedText] = useState(""); // Κείμενο που εμφανίζεται λέξη-λέξη

  const chatRef = useRef(null); // Αναφορά στο container της συνομιλίας

  // Αυτόματο scroll στο τέλος όταν προστίθενται νέα μηνύματα
  useEffect(() => {
    const chatElement = chatRef.current;
  
    if (!chatElement) return; // Βεβαιώσου ότι το στοιχείο υπάρχει πριν κάνεις οποιαδήποτε ενέργεια
  
    // Ελέγχει αν το scrollbar είναι ήδη στο τέλος
    const isAtBottom =
      chatElement.scrollHeight - chatElement.scrollTop === chatElement.clientHeight;
  
    // Κάνει scroll στο τέλος μόνο αν είναι στο κάτω μέρος
    if (!isAtBottom) {
      chatElement.scrollTop = chatElement.scrollHeight;
    }
  }, [messages, animatedText]);

  const handleSend = async () => {
    if (currentMessage.trim() === "") return;
  
    // Προσθήκη του μηνύματος του χρήστη στη συνομιλία
    setMessages((prevMessages) => [
      ...prevMessages,
      { text: currentMessage, isUser: true },
    ]);
  
    try {
      // Κλήση του reqGroq για λήψη απάντησης από το API
      const response = await reqGroq(currentMessage);

      // Έλεγχος και προσθήκη της απάντησης του API στη συνομιλία
      const apiResponse = response?.response || "No response from API.";
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: apiResponse, isUser: false },
      ]);
  
      // Ξεκινάει το animation, αν υπάρχει έγκυρη απάντηση
      if (apiResponse && apiResponse.trim() !== "No response from API.") {
        animateText(apiResponse);
      }
    } catch (err) {
      console.error("Error sending message:", err);
  
      // Προσθήκη μηνύματος λάθους στη συνομιλία
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: "Something went wrong. Please try again later.", isUser: false },
      ]);
    }
  
    setCurrentMessage("");
  };

  const animateText = (text) => {
    if (!text || typeof text !== "string") return; // Αποφυγή undefined ή μη συμβολοσειρών
    const words = text.split(" ");
    let index = 0;
    setAnimatedText(""); // Καθαρίζει το animatedText στην αρχή
  
    const interval = setInterval(() => {
      if (index < words.length) {
        setAnimatedText((prev) => prev + (index > 0 ? " " : "") + words[index]);
        index++;
      } else {
        clearInterval(interval); // Σταματάει όταν τελειώσουν οι λέξεις
      }
    }, 10);
  };

  const formatTextWithMarkdown = (text) => {

    if (!text || typeof text !== "string") return ""; 

    function escapeHTML(text) {
      return text.replace(/&/g, "&amp;")
                 .replace(/</g, "&lt;")
                 .replace(/>/g, "&gt;")
                 .replace(/"/g, "&quot;")
                 .replace(/'/g, "&#039;");
    }

    let codeBlockCounter = 0; // Μετρητής για μοναδικά IDs

    // Εντοπισμός τμημάτων με κώδικα που περικλείονται από ```
    text = text.replace(/```(\w+)?\n([\s\S]*?)```/g, (match, language, code) => {
    
    codeBlockCounter++;
    const codeId = `code-block-${codeBlockCounter}`; // Δημιουργία μοναδικού ID

    const escapedCode = escapeHTML(code.trim()); // Escape ειδικών χαρακτήρων για εμφάνιση
    const rawCode = code.trim(); // Το αρχικό, μη επεξεργασμένο κείμενο του κώδικα

    const langLabel = language
        ? `<div class="code-lang-container" style="display: flex; justify-content: space-between; align-items: center;">
              <span class="code-lang" style="text-align: left;">${language}</span>
              <button class="toCopy" style="text-align: right;" data-code-content="${encodeURIComponent(rawCode)}">Copy</button>
           </div>`
        : `<button class="toCopy" style="display: block; text-align: right;" data-code-content="${encodeURIComponent(rawCode)}">Copy</button>`;

    return `${langLabel}<pre class="code-block"><code id="${codeId}">${escapedCode}</code></pre>`;
    });
      // Εντοπισμός inline code blocks
      text = text.replace(/`([^`]+)`/g, (match, code) => `<code>${code}</code>`);

      // Αντικατάσταση έντονου και πλάγιου κειμένου
      text = text.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
      text = text.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
      text = text.replace(/\*(.+?)\*/g, "<em>$1</em>");
      text = text.replace(/_(.+?)_/g, "<em>$1</em>");

      // Συνδέσμοι [text](url)
      text = text.replace(/\$begin:math:display\$(.+?)\$end:math:display\$\$begin:math:text\$(https?:\/\/[^\s]+)\$end:math:text\$/g, '<a href="$2" target="_blank">$1</a>');

      // Λίστες με κουκκίδες
      text = text.replace(/^\s*[-*]\s+(.+)$/gm, "<li>$1</li>");
      text = text.replace(/(<li>.*?<\/li>)(?!<\/ul>)/g, "<ul>$1</ul>");
      
      // Αριθμημένες λίστες - Διατήρηση της αριθμητικής σειράς
      text = text.replace(/^(\d+)\.\s+(.+)$/gm, (match, num, content) => {
          return `<li value="${num}">${content}</li>`;
      });

      // Ομαδοποίηση αριθμημένων στοιχείων σε <ol>
      text = text.replace(/(<li value="\d+">.*?<\/li>)(?=(?!<li value="\d+">))/g, "<ol>$1</ol>");

      // Διαχωρισμός σε παραγράφους
      const paragraphs = text.split("\n\n").filter((para) => para.trim() !== "");

      // Προσθήκη event listeners για τα buttons "Copy"
      setTimeout(() => {
        const copyButtons = document.querySelectorAll(".toCopy");
        copyButtons.forEach((button) => {
          const originalText = button.textContent; // Αποθήκευση του αρχικού κειμένου του κουμπιού
          button.addEventListener("click", () => {
            const rawCodeContent = decodeURIComponent(button.getAttribute("data-code-content"));
            if (rawCodeContent) {
              // Αφαίρεση HTML ετικετών πριν την αντιγραφή
              const plainText = rawCodeContent.replace(/<\/?[^>]+(>|$)/g, ""); 
      
              navigator.clipboard.writeText(plainText) // Χρήση καθαρού κειμένου
                .then(() => {
                  button.textContent = "Copied!"; // Ενημέρωση κουμπιού
                  setTimeout(() => {
                    button.textContent = originalText; // Επαναφορά
                  }, 2000);
                })
                .catch((err) => {
                  console.error("Failed to copy text: ", err);
                });
            }
          });
        });
      }, 0);

     return paragraphs
      .map((para) => {
          if (
              !para.startsWith("<h") &&
              !para.startsWith("<ul") &&
              !para.startsWith("<ol") &&
              !para.startsWith("<pre") &&
              !para.startsWith("<div")
          ) {
              return `<p>${para}</p>`;
          }
          return para || ""; // Επιστροφή άδειου string αν το para είναι undefined
      })
      .filter((para) => para.trim() !== "") // Αφαίρεση κενών στοιχείων
      .join("") || ""; // Επιστροφή κενής συμβολοσειράς αν δεν υπάρχει κείμενο
    };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div className="Chatdiv">

        <div className="chat" ref={chatRef}>
          <br />

          {messages.length === 0 && (
            <div className="Opening">
              <img src={logo} alt="" className="kastoras" />
            </div>
          )}

          {messages.map((msg, index) => (
            <div
              key={index}
              className={msg.isUser ? "erwthsh" : "apantisi"}
            >
              {!msg.isUser && (
                <img src={logo} alt="" className="kastorasLogo" />
              )}
              {msg.isUser ? (
                <p>{msg.text || ""}</p> 
              ) : (
                <div
                  dangerouslySetInnerHTML={{
                    __html: formatTextWithMarkdown(
                      index === messages.length - 1 && animatedText 
                        ? animatedText.trim().replace(/undefined/g, "")
                        : (typeof msg.text === "string" ? msg.text : String(msg.text || "")).trim()
                    ),
                  }}
                />
              )}
            </div>
          ))}
          {loading && (
            <div className="apantisi">
              <img src={logo} alt="" className="kastorasLogo" />
              <p>Loading...</p>
            </div>
          )}
          {error && (
            <div className="apantisi">
              <img src={logo} alt="" className="kastorasLogo" />
              <p>Error: {error}</p>
            </div>
          )}
          <br />
          <br />
        </div>

        <div className="inputbox-container">

          <div className="input-wrapper">

            <input
              type="text"
              placeholder="Type your message..."
              className="input-field"
              value={currentMessage}
              onChange={(e) => setCurrentMessage(e.target.value)}
              onKeyDown={handleKeyPress}
            />
            <button className="send-button" onClick={handleSend} disabled={loading}>
              {loading ? "Sending..." : "Send"}
            </button>
            
          </div>
        </div>


    </div>
  );
};

export default Chat;