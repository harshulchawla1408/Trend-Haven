import { useState, useRef, useEffect } from 'react';
import { FaRobot, FaTimes, FaPaperPlane } from 'react-icons/fa';
import './Chatbot.css';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "Hello! I'm your style assistant. How can I help you with your fashion choices today?", 
      sender: 'bot' 
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getBotResponse = (userInput) => {
    const input = userInput.toLowerCase();
    
    // Predefined responses for common fashion queries
    if (input.includes('hello') || input.includes('hi') || input.includes('hey')) {
      return "Hello! I'm your style assistant. How can I help you with fashion today?";
    } else if (input.includes('dress') || input.includes('outfit')) {
      return "For a stylish look, try pairing a solid-colored blouse with high-waisted trousers. Add some accessories to complete the look!";
    } else if (input.includes('shirt') || input.includes('top')) {
      return "A classic white shirt is a versatile piece that can be dressed up or down. Try it with jeans for a casual look or with a blazer for a more formal appearance.";
    } else if (input.includes('jeans') || input.includes('pants')) {
      return "High-waisted jeans are trending this season. They go well with cropped tops or tucked-in shirts for a flattering silhouette.";
    } else if (input.includes('shoes') || input.includes('footwear')) {
      return "White sneakers are a great choice for a casual yet stylish look. For formal occasions, consider classic black leather shoes or elegant heels.";
    } else if (input.includes('accessor')) {
      return "Minimalist jewelry like delicate necklaces and hoop earrings are in style. A statement watch can also elevate your look.";
    } else if (input.includes('color') || input.includes('colour')) {
      return "Neutral colors like beige, white, and black are timeless. For a pop of color, try emerald green or burgundy this season.";
    } else if (input.includes('trend') || input.includes('fashion')) {
      return "Current trends include oversized blazers, wide-leg pants, and chunky sneakers. Sustainable fashion is also a big focus this year.";
    } else if (input.includes('thank')) {
      return "You're welcome! Let me know if you need any more fashion advice.";
    } else {
      return "I'm here to help with fashion advice! You can ask me about outfits, trends, styling tips, or anything related to fashion.";
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Add user message
    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:9000/api/gemini-chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: input })
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();
      setMessages(prev => [...prev, { text: data.reply, sender: 'bot' }]);
    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, { 
        text: "I'm having trouble connecting to the fashion assistant. Please try again later.", 
        sender: 'bot' 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleChat = () => {
    if (isOpen) {
      // Reset chat when closing
      setMessages([
        { 
          text: "Hello! I'm your style assistant. How can I help you with your fashion choices today?", 
          sender: 'bot' 
        }
      ]);
    }
    setIsOpen(!isOpen);
  };

  return (
    <>
      <button 
        className={`chatbot-button ${isOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
        aria-label="Chat with style assistant"
      >
        <FaRobot className="chatbot-icon" />
      </button>

      {isOpen && (
        <div className="chatbot-container">
          <div className="chatbot-header">
            <h3>Style Assistant</h3>
            <button className="close-button" onClick={toggleChat}>
              <FaTimes />
            </button>
          </div>
          
          <div className="chatbot-messages">
            {messages.map((msg, index) => (
              <div key={index} className={`message ${msg.sender}`}>
                <div className="message-content">
                  {msg.text.split('\n').map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="message bot">
                <div className="message-content">
                  <div className="typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSendMessage} className="chatbot-input">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me about styling advice..."
              disabled={isLoading}
            />
            <button type="submit" disabled={isLoading || !input.trim()}>
              <FaPaperPlane />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;
