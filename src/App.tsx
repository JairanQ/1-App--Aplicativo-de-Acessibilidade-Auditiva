import React, { useState, useEffect } from 'react';

const App: React.FC = () => {
  const [text, setText] = useState<string>('Clique no botão e fale para transcrever');
  const [listening, setListening] = useState<boolean>(false);
  const [userText, setUserText] = useState<string>('');
  const [history, setHistory] = useState<string[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.key === 'r') startRecognition();
      if (event.key === 's') speakText();
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    new (window as any).VLibras.Widget();
  }, []);

  const startRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      alert('Seu navegador não suporta reconhecimento de voz.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';

    recognition.onstart = () => {
      setListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setText(transcript);
      setHistory((prev) => [...prev, transcript]);
    };

    recognition.onerror = () => {
      alert('Erro no reconhecimento de voz.');
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(userText);
      utterance.lang = 'pt-BR';
      speechSynthesis.speak(utterance);
    } else {
      alert('Seu navegador não suporta síntese de voz.');
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold mb-6 text-red-600">Aplicativo de Inclusão para Surdos</h1>

      <div className="bg-[#222222] p-6 rounded-xl shadow-lg w-4/5 max-w-lg text-center">
        <p className="text-lg mb-4 text-gray-300">{text}</p>
        <button 
          onClick={startRecognition} 
          disabled={listening} 
          className={`w-full py-3 text-lg font-semibold rounded-lg shadow-md transition duration-300 
            ${listening ? 'bg-gray-700' : 'bg-[#E50914] hover:bg-red-700'}`}
        >
          {listening ? '🎙️ Ouvindo...' : '🎤 Iniciar Transcrição'}
        </button>
      </div>

      <hr className="my-6 border-t border-gray-600 w-4/5"/>

      <div className="bg-[#222222] p-6 rounded-xl shadow-lg w-4/5 max-w-lg text-center">
        <h2 className="text-xl font-semibold text-red-500">Digite sua resposta:</h2>
        <input
          type="text"
          value={userText}
          onChange={(e) => setUserText(e.target.value)}
          placeholder="Digite algo para o app falar"
          className="mt-4 p-3 w-full border border-gray-700 rounded-lg text-lg text-black focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button 
          onClick={speakText} 
          className="w-full py-3 mt-4 bg-[#E50914] text-lg font-semibold rounded-lg shadow-md hover:bg-red-700 transition duration-300"
        >
          🔊 Falar
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-6 text-white">📜 Histórico de Transcrições</h2>
      <ul className="w-4/5 max-w-lg mt-4 text-lg text-gray-300 bg-[#222222] p-4 rounded-xl shadow-lg">
        {history.map((item, index) => (
          <li key={index} className="border-b border-gray-600 py-2">{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
