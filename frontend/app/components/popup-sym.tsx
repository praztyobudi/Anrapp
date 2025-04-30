import React, { useEffect, useRef, useState } from 'react';
import { Lightbulb, AlertTriangle, MessageSquareQuote } from 'lucide-react';
import Link from 'next/link';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CardButtonProps {
  icon: React.ReactNode;
  label: string;
  path: string;
  bgColor?: string;
}

const Popup: React.FC<PopupProps> = ({ isOpen, onClose }) => {
  const popupRef = useRef<HTMLDivElement>(null);
  const [showAnimation, setShowAnimation] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShowAnimation(true);
    } else {
      setTimeout(() => setShowAnimation(false), 300);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (popupRef.current && !popupRef.current.contains(event.target as Node)) {
        onClose();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen && !showAnimation) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
    >
      <div
        ref={popupRef}
        className={`bg-white p-8 rounded-xl shadow-2xl transform transition-all duration-300 w-[90%] max-w-2xl ${showAnimation ? 'scale-100' : 'scale-95'}`}
      >
        <h2 className="text-2xl font-semibold mb-6 text-center">Apa yang anda pikirkan?</h2>

        <div className="flex flex-col sm:flex-row justify-center items-center gap-6">
          <CardButton path='../dashboard/speakyourmind/ide' icon={<Lightbulb className="w-8 h-8" />} label="Ide" />
          <CardButton path='../dashboard/speakyourmind/kritiksaran' icon={<MessageSquareQuote className="w-8 h-8" />} label="Kritik & Saran" />
          <CardButton path='../dashboard/speakyourmind/fraud' icon={<AlertTriangle className="w-8 h-8" color='red' />} label="Fraud" bgColor='bg-red-100' />
        </div>
      </div>
    </div>
  );

};

const CardButton: React.FC<CardButtonProps> = ({ path, icon, label, bgColor="bg-green-100" }) => {
  return (
    <Link href={path} className="no-underline">
      <div className="w-40 h-40 flex flex-col justify-center items-center border rounded-lg hover:shadow-lg transition-all duration-300 cursor-pointer">
        {/* <div className="bg-green-100 p-3 rounded-full text-anr transition-transform hover:scale-110"> */}
        <div className={`${bgColor} p-3 rounded-full text-anr transition-transform hover:scale-110`}>
          {icon}
        </div>
        <span className="text-gray-600 mt-3 text-center text-lg font-semibold">{label}</span>
      </div>
    </Link>
  );
};
export default Popup;
