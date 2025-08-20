import React from "react";
import { Button } from "./button";
import Image from "next/image";

function WhatsappButton() {
  const message = encodeURIComponent("Halo Tasya...");

  return (
    <Button
      variant="default"
      size="icon"
      className="fixed bottom-4 right-4 z-50 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg w-12 h-12"
      asChild
    >
      <a
        href={`https://wa.me/6285283237418?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat via WhatsApp"
      >
        <Image
          src="/images/wa-logo.png"
          width={30}
          height={30}
          priority
          alt="TSI Logo"
        />
        {/* <MessageCircle className="w-6 h-6" /> */}
      </a>
    </Button>
  );
}

export default WhatsappButton;
