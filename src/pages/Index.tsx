
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// Массив возможных фраз капибары
const CAPYBARA_PHRASES = [
  "Что ты там пишешь, человек?",
  "Я капибара, я всё вижу!",
  "Так-так-так, интересно...",
  "Хм, дай подумать...",
  "Это звучит странно даже для меня!",
  "Я одобряю этот месседж!",
  "Напиши что-нибудь ещё!",
  "Ты точно уверен в том, что пишешь?",
  "Капибары рулят!",
  "Супер-капибара следит за тобой!",
];

const Index = () => {
  const [inputText, setInputText] = useState("");
  const [bubbles, setBubbles] = useState<{ id: number; text: string; position: { x: number; y: number } }[]>([]);
  const [lastBubbleTime, setLastBubbleTime] = useState(0);
  const [showScreamer, setShowScreamer] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Функция для создания пузырька с фразой
  const createBubble = () => {
    if (Date.now() - lastBubbleTime < 3000) return; // Ограничиваем частоту появления пузырьков
    
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;
    
    const x = Math.random() * (screenWidth * 0.7) + screenWidth * 0.15;
    const y = Math.random() * (screenHeight * 0.5) + screenHeight * 0.2;
    
    const randomPhrase = CAPYBARA_PHRASES[Math.floor(Math.random() * CAPYBARA_PHRASES.length)];
    
    setBubbles((prev) => [...prev, { 
      id: Date.now(), 
      text: randomPhrase,
      position: { x, y } 
    }]);
    
    setLastBubbleTime(Date.now());
  };
  
  // Удаление пузырька при клике
  const removeBubble = (id: number) => {
    setBubbles((prev) => prev.filter((bubble) => bubble.id !== id));
  };
  
  // Оценка "капибарности" введенного текста
  const evaluateCapybaraRating = (text: string) => {
    if (!text.trim()) return 0;
    
    const capybaraKeywords = ["капибара", "водосвинка", "вода", "плавать", "трава", "друг", "милый", "супер", "герой", "очки"];
    
    let rating = 0;
    const lowercaseText = text.toLowerCase();
    
    capybaraKeywords.forEach(keyword => {
      if (lowercaseText.includes(keyword)) {
        rating += 20;
      }
    });
    
    // Ограничиваем рейтинг до 100
    return Math.min(rating, 100);
  };
  
  // Обработка отправки формы
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!inputText.trim()) return;
    
    const rating = evaluateCapybaraRating(inputText);
    
    // Если рейтинг высокий - показываем скример
    if (rating >= 80) {
      setShowScreamer(true);
      setTimeout(() => {
        setShowScreamer(false);
      }, 1500);
    }
    
    setInputText("");
    if (inputRef.current) inputRef.current.focus();
  };
  
  // Случайное появление пузырьков
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% шанс появления пузырька
        createBubble();
      }
    }, 5000);
    
    return () => clearInterval(interval);
  }, [lastBubbleTime]);
  
  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-gradient-to-b from-blue-100 to-blue-200">
      {/* Капибара */}
      <div className="relative mb-10 transition-all duration-300 hover:scale-105">
        <img 
          src="https://cdn.poehali.dev/files/f3cf9d5a-8305-4fd4-92b3-56be99e26ffa.jpg" 
          alt="Супер-капибара" 
          className="rounded-xl shadow-lg w-72 md:w-96 border-4 border-yellow-300"
        />
        <div className="absolute bottom-0 left-0 bg-blue-600 px-4 py-1 rounded-br-xl rounded-tl-xl text-white font-bold text-sm md:text-base">
          Супер-Капибара
        </div>
      </div>
      
      {/* Форма ввода */}
      <div className="w-full max-w-md px-4">
        <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Напиши что-нибудь капибаре..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-white shadow-md"
          />
          <Button type="submit">Отправить</Button>
        </form>
        
        <div className="text-center text-sm text-gray-600 mt-2">
          Капибара читает твои мысли. Она ответит, когда захочет!
        </div>
      </div>
      
      {/* Пузырьки с фразами */}
      {bubbles.map((bubble) => (
        <div
          key={bubble.id}
          className="absolute p-3 bg-white rounded-xl shadow-lg max-w-xs animate-fade-in cursor-pointer"
          style={{
            left: `${bubble.position.x}px`,
            top: `${bubble.position.y}px`,
            transformOrigin: 'center',
            animation: 'pop-in 0.3s ease-out'
          }}
          onClick={() => removeBubble(bubble.id)}
        >
          <div className="text-sm font-medium">{bubble.text}</div>
          <div className="absolute w-4 h-4 bg-white transform rotate-45 -bottom-2 left-1/2 -ml-2"></div>
        </div>
      ))}
      
      {/* Скример */}
      {showScreamer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-pulse">
          <div className="relative">
            <img 
              src="https://cdn.poehali.dev/files/f3cf9d5a-8305-4fd4-92b3-56be99e26ffa.jpg" 
              alt="Капибара скример" 
              className="max-w-full max-h-full animate-bounce"
              style={{ transform: 'scale(1.5)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <h1 className="text-5xl font-extrabold text-red-500 drop-shadow-glow animate-pulse">
                КАПИБАРА ОДОБРЯЕТ!
              </h1>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Index;
