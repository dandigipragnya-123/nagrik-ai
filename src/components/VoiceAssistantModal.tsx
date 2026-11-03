import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  MicOff,
  Send,
  X,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Globe,
  CornerDownLeft,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { SupportedLanguage, CitizenProfile, ChatMessage } from '../types';
import { UI_TRANSLATIONS, SUPPORTED_LANGUAGES } from '../data/translations';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  citizen: CitizenProfile | null;
  activeDocumentSummary?: string;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  language,
  setLanguage,
  citizen,
  activeDocumentSummary,
}) => {
  const t = UI_TRANSLATIONS[language] || UI_TRANSLATIONS.en;

  const [inputQuery, setInputQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [loadingReply, setLoadingReply] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const recognitionRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested questions in current language
  const suggestedQuestions: Record<SupportedLanguage, string[]> = {
    en: [
      'How do I apply for Kisan Credit Card (KCC)?',
      'What happens if my Caste Certificate expires?',
      'How to link Aadhaar with Ration Card for free?',
      'Am I eligible for Ayushman Bharat ₹5 Lakh cover?',
    ],
    hi: [
      'किसान क्रेडिट कार्ड के लिए कैसे आवेदन करें?',
      'यदि जाति प्रमाण पत्र की वैधता समाप्त हो जाए तो क्या करें?',
      'राशन कार्ड में ई-केवाईसी कैसे पूरी करें?',
      'आयुष्मान भारत कार्ड बनवाने की प्रक्रिया क्या है?',
    ],
    kn: [
      'ಕಿಸಾನ್ ಕ್ರೆಡಿಟ್ ಕಾರ್ಡ್ ಪಡೆಯಲು ಬೇಕಾಗುವ ದಾಖಲೆಗಳು ಯಾವುವು?',
      'ಜಾತಿ ಮತ್ತು ಆದಾಯ ಪ್ರಮಾಣಪತ್ರ ನವೀಕರಣ ಮಾಡುವುದು ಹೇಗೆ?',
      'ಪಡಿತರ ಚೀಟಿಗೆ ಆಧಾರ್ ಲಿಂಕ್ ಮಾಡುವುದು ಹೇಗೆ?',
      'ಗೃಹಲಕ್ಷ್ಮಿ ಯೋಜನೆಯ ₹2,000 ಪಡೆಯುವುದು ಹೇಗೆ?',
    ],
    te: [
      'రైతు భరోసా పథకానికి ఎలా దరఖాస్తు చేసుకోవాలి?',
      'కుల ధృవీకరణ పత్రం గడువు ముగిస్తే ఏమి చేయాలి?',
      'రేషన్ కార్డులో ఈ-కేవైసీ ఎలా చేసుకోవాలి?',
      'ఆయుష్మాన్ భారత్ హెల్త్ కార్డు ఎలా పొందాలి?',
    ],
    ta: [
      'மகளிர் உரிமைத் தொகைக்கு விண்ணப்பிப்பது எப்படி?',
      'சாதிச் சான்றிதழ் புதுப்பிப்பது எப்படி?',
      'ரேஷன் கார்டில் பயோமெட்ரிக் பதிவு செய்வது எப்படி?',
      'கிசான் கிரெடிட் கார்டு பெறுவது எப்படி?',
    ],
    mr: [
      'नमो शेतकरी सन्मान निधी कसा मिळवावा?',
      'जात प्रमाणपत्र नूतनीकरण कसे करावे?',
      'रेशन कार्ड ई-केवायसी कसे करावे?',
      'आयुष्मान भारत कार्डसाठी कोण पात्र आहे?',
    ],
    bn: [
      'কৃষক বন্ধু প্রকল্পের সুবিধা কীভাবে পাব?',
      'জাতিগত শংসাপত্র নবায়ন করার নিয়ম কী?',
      'রেশন কার্ডে বায়োমেট্রিক ই-কেওয়াইসি কীভাবে করব?',
      'আয়ুষ্মান ভারত কার্ড পাওয়ার যোগ্যতা কী?',
    ],
  };

  const activeSuggestions = suggestedQuestions[language] || suggestedQuestions.en;

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;

      const langMap: Record<SupportedLanguage, string> = {
        en: 'en-IN',
        hi: 'hi-IN',
        kn: 'kn-IN',
        te: 'te-IN',
        ta: 'ta-IN',
        mr: 'mr-IN',
        bn: 'bn-IN',
      };
      recognition.lang = langMap[language] || 'en-IN';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputQuery(transcript);
        handleSendQuery(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      window.speechSynthesis.cancel();
    };
  }, [language]);

  // Welcome message when opened
  useEffect(() => {
    if (isOpen && messages.length === 0) {
      const greetingMap: Record<SupportedLanguage, string> = {
        en: `Namaste! I am your Nagrik Sahayak. You can ask me any question about government schemes, official notices, documents, or application procedures in your mother tongue. Press the mic to speak or type below!`,
        hi: `नमस्ते! मैं आपका नागरिक सहायक हूँ। आप मुझसे सरकारी योजनाओं, नोटिस, आवश्यक दस्तावेजों या आवेदन प्रक्रिया के बारे में अपनी मातृभाषा में कोई भी सवाल पूछ सकते हैं।`,
        kn: `ನಮಸ್ಕಾರ! ನಾನು ನಿಮ್ಮ ನಾಗರಿಕ ಸಹಾಯಕ. ಸರ್ಕಾರಿ ಯೋಜನೆಗಳು, ನೋಟಿಸ್‌ಗಳು, ದಾಖಲೆಗಳು ಅಥವಾ ಅರ್ಜಿ ಸಲ್ಲಿಕೆ ಕುರಿತು ಯಾವುದೇ ಪ್ರಶ್ನೆಯನ್ನು ಕನ್ನಡದಲ್ಲಿ ಕೇಳಬಹುದು.`,
        te: `నమస్కారం! నేను మీ నాగరిక్ సహాయక్. ప్రభుత్వ పథకాలు, నోటీసులు, దరఖాస్తు విధానం గురించి మీ మాతృభాషలో నన్ను అడగవచ్చు.`,
        ta: `வணக்கம்! நான் உங்கள் நாகரிக் உதவியாளர். அரசுத் திட்டங்கள், ஆவணங்கள், விண்ணப்ப முறை குறித்து உங்கள் தாய்மொழியில் கேட்கலாம்.`,
        mr: `नमस्कार! मी आपला नागरिक सहाय्यक आहे. शासकीय योजना आणि कागदपत्रांबद्दल आपल्या भाषेत कोणताही प्रश्न विचारा.`,
        bn: `নমস্কার! আমি আপনার নাগরিক সহায়ক। সরকারি প্রকল্প এবং নথি সংক্রান্ত যেকোনো প্রশ্ন বাংলায় জিজ্ঞেস করতে পারেন।`,
      };

      const initialMessage: ChatMessage = {
        id: 'msg-welcome',
        sender: 'assistant',
        text: greetingMap[language] || greetingMap.en,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages([initialMessage]);
    }
  }, [isOpen, language]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert('Voice speech recognition is not supported on this browser. Please type your query.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      recognitionRef.current.start();
    }
  };

  const handleSendQuery = async (queryText?: string) => {
    const textToSend = (queryText || inputQuery).trim();
    if (!textToSend || loadingReply) return;

    setInputQuery('');
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setLoadingReply(true);

    try {
      const response = await fetch('/api/citizen-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          language,
          citizenProfile: citizen,
          currentDocumentSummary: activeDocumentSummary,
        }),
      });

      const data = await response.json();
      if (data.success && data.reply) {
        const assistantMsg: ChatMessage = {
          id: `bot-${Date.now()}`,
          sender: 'assistant',
          text: data.reply,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };
        setMessages((prev) => [...prev, assistantMsg]);
        speakText(data.reply);
      } else {
        throw new Error(data.error || 'Could not fetch response');
      }
    } catch (err: any) {
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'assistant',
        text:
          language === 'hi'
            ? 'क्षमा करें, प्रतिक्रिया प्राप्त करने में समस्या हुई। कृपया पुनः प्रयास करें।'
            : 'Sorry, I encountered an issue. Please try again or rephrase your question.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoadingReply(false);
    }
  };

  const speakText = (text: string) => {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    // Clean markdown hashes/asterisks for cleaner voice audio
    const cleanText = text.replace(/[*#_`]/g, '');

    const utterance = new SpeechSynthesisUtterance(cleanText);
    const langMap: Record<SupportedLanguage, string> = {
      en: 'en-IN',
      hi: 'hi-IN',
      kn: 'kn-IN',
      te: 'te-IN',
      ta: 'ta-IN',
      mr: 'mr-IN',
      bn: 'bn-IN',
    };
    utterance.lang = langMap[language] || 'en-IN';
    utterance.rate = 1.0;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full h-[85vh] flex flex-col overflow-hidden border border-stone-200 animate-in fade-in zoom-in-95">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-4 sm:p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-white backdrop-blur-xs ring-2 ring-white/30">
              <Bot className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-base sm:text-lg tracking-tight">
                  {t.voiceAssistantTitle}
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              </div>
              <p className="text-xs text-orange-100 font-medium">
                {t.voiceAssistantSubtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isSpeaking && (
              <button
                onClick={stopSpeaking}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white transition-colors flex items-center space-x-1 text-xs font-semibold px-2"
                title="Stop Reading"
              >
                <VolumeX className="w-4 h-4" />
                <span className="hidden sm:inline">Stop</span>
              </button>
            )}

            <button
              onClick={() => {
                stopSpeaking();
                onClose();
              }}
              className="text-white/80 hover:text-white bg-black/10 hover:bg-black/20 p-1.5 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Language Strip */}
        <div className="bg-orange-50 px-4 py-2 border-b border-orange-200 flex items-center justify-between text-xs">
          <div className="flex items-center space-x-1.5 text-orange-950 font-bold">
            <Globe className="w-3.5 h-3.5 text-orange-600" />
            <span>Speaking & Listening In:</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {SUPPORTED_LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLanguage(lang.code);
                  stopSpeaking();
                }}
                className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all ${
                  language === lang.code
                    ? 'bg-orange-600 text-white shadow-2xs'
                    : 'bg-white text-slate-700 hover:bg-orange-100 border border-orange-200'
                }`}
              >
                {lang.nativeName}
              </button>
            ))}
          </div>
        </div>

        {/* Chat History Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-stone-50/50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-xs font-bold ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-orange-600 text-white'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] rounded-2xl p-3.5 text-xs sm:text-sm leading-relaxed shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : 'bg-white text-slate-800 border border-stone-200 rounded-tl-none font-medium'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div
                  className={`mt-1.5 flex items-center justify-between text-[10px] ${
                    msg.sender === 'user' ? 'text-blue-200' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => speakText(msg.text)}
                      className="hover:text-orange-600 flex items-center space-x-1 ml-3"
                      title="Read aloud"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Listen</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {loadingReply && (
            <div className="flex items-center space-x-2 text-xs text-orange-700 font-semibold p-2 bg-orange-50 rounded-xl w-fit">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Nagrik Sahayak is thinking in your language...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Suggested Quick Questions */}
        <div className="px-4 py-2 bg-white border-t border-stone-200">
          <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1 flex items-center space-x-1">
            <HelpCircle className="w-3 h-3 text-orange-500" />
            <span>Suggested Questions:</span>
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {activeSuggestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => handleSendQuery(q)}
                className="whitespace-nowrap px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-orange-50 hover:text-orange-900 border border-stone-200 text-[11px] font-medium text-slate-700 transition-colors"
              >
                {q}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar & Voice Controls */}
        <div className="p-3 bg-white border-t border-stone-200">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendQuery();
            }}
            className="flex items-center space-x-2"
          >
            {/* Big Mic Button */}
            <button
              type="button"
              onClick={toggleMic}
              className={`p-3 rounded-xl transition-all shadow-md active:scale-95 shrink-0 ${
                isListening
                  ? 'bg-red-600 text-white ring-4 ring-red-400/30 animate-pulse'
                  : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white'
              }`}
              title={isListening ? 'Stop Listening' : 'Speak Your Question'}
            >
              {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>

            {/* Query Input */}
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder={isListening ? t.listening : t.typePlaceholder}
              className="flex-1 px-3.5 py-2.5 text-xs sm:text-sm bg-stone-50 border border-stone-300 rounded-xl focus:bg-white focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
            />

            {/* Send Button */}
            <button
              type="submit"
              disabled={!inputQuery.trim() || loadingReply}
              className="p-2.5 rounded-xl bg-orange-600 hover:bg-orange-700 text-white disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 transition-all shrink-0"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
