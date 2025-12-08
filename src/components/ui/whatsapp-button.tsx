"use client";

import React, { useState } from "react";
import { Button } from "./button";
import { MessageCircle, X, Send } from "lucide-react";

function WhatsappButton() {
  const [isExpanded, setIsExpanded] = useState(false);
  const message = encodeURIComponent("Halo Tasya, saya butuh bantuan...");

  const handleChatClick = () => {
    window.open(`https://wa.me/6285283237418?text=${message}`, '_blank');
    setIsExpanded(false);
  };

  return (
    <div className="fixed right-0 top-1/2 transform -translate-y-1/2 z-50">
      {/* Expanded Chat Box */}
      {isExpanded && (
        <div className="fixed right-16 top-1/2 transform -translate-y-1/2 bg-white rounded-lg shadow-2xl border border-gray-200 p-4 min-w-[280px] animate-in slide-in-from-right-5 duration-300">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center">
                <MessageCircle className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900 text-sm">Chat dengan Tasia</h3>
                <p className="text-xs text-gray-500">Typically replies instantly</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full hover:bg-gray-100"
              onClick={() => setIsExpanded(false)}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </div>

          <div className="bg-gray-50 rounded-lg p-3 mb-3">
            <p className="text-sm text-gray-700 mb-2">Halo! Ada yang bisa saya bantu?</p>
            <p className="text-xs text-gray-500">Klik tombol di bawah untuk memulai chat WhatsApp</p>
          </div>

          <Button
            onClick={handleChatClick}
            className="w-full bg-green-500 hover:bg-green-600 text-white rounded-lg flex items-center gap-2"
          >
            <Send className="h-4 w-4" />
            <span className="text-sm font-medium">Start Chat</span>
          </Button>
        </div>
      )}

      {/* Vertical Text Button */}
      <div
        className="fixed right-0 top-1/2 transform -translate-y-1/2 bg-white hover:bg-gray-50 text-green-600 px-2 py-4 rounded-l-lg shadow-lg transition-all duration-300 hover:shadow-xl cursor-pointer group border border-gray-200"
        onClick={() => {
          if (isExpanded) {
            handleChatClick();
          } else {
            setIsExpanded(true);
          }
        }}
      >
        {/* Rotated Text */}
        <div className="text-xs font-semibold" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
          Tasia
        </div>

        {/* Subtle indicator */}
        <div className="absolute -left-2 top-1/2 transform -translate-y-1/2 w-1 h-6 bg-green-500 rounded-l-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      </div>
  );
}

export default WhatsappButton;
