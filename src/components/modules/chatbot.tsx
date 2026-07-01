"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

// AI Chatbot Component / ഉപഭോക്താക്കളെ സഹായിക്കാനുള്ള AI ചാറ്റ്ബോട്ട്
export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    // Fixed container at the bottom right / സ്ക്രീനിന്റെ താഴെ വലതുഭാഗത്തായി ഇത് നിൽക്കും
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      
      {/* Chat Window / ചാറ്റ് വിൻഡോ */}
      {isOpen && (
        <div className="w-80 h-96 bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 flex flex-col overflow-hidden mb-4 transition-all duration-300">
          <div className="p-4 bg-blue-600 text-white font-bold flex justify-between">
            <span>Zenex Support (സഹായം)</span>
            <button onClick={() => setIsOpen(false)} className="hover:text-zinc-200">✕</button>
          </div>
          
          <div className="flex-1 p-4 overflow-y-auto text-sm text-zinc-600 dark:text-zinc-400">
            {/* Greeting Message / സ്വാഗത സന്ദേശം */}
            <div className="bg-zinc-100 dark:bg-zinc-800 p-3 rounded-xl rounded-tl-none w-fit max-w-[80%]">
              Hello! How can we help you today with your security or electrical needs?
              <br/><br/>
              നമസ്കാരം! നിങ്ങൾക്ക് ആവശ്യമായ സി.സി.ടി.വി, ഇലക്ട്രിക്കൽ സേവനങ്ങളെക്കുറിച്ച് ചോദിക്കാവുന്നതാണ്.
            </div>
          </div>
          
          <div className="p-3 border-t border-zinc-200 dark:border-zinc-800 flex gap-2">
            <Input placeholder="Type message..." className="flex-1 bg-zinc-100 dark:bg-black" />
            <Button className="bg-blue-600">Send</Button>
          </div>
        </div>
      )}

      {/* Floating Action Button / ചാറ്റ് തുറക്കാനുള്ള ബട്ടൺ */}
      <Button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-14 h-14 rounded-full shadow-xl bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center text-2xl transition-transform hover:scale-110"
      >
        {isOpen ? "✕" : "💬"}
      </Button>
    </div>
  );
}
