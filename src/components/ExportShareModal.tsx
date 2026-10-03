import React, { useState } from 'react';
import { Share2, Copy, Check, QrCode, X, ExternalLink, MessageCircle, Send } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

interface ExportShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
  recipientName: string;
}

export const ExportShareModal: React.FC<ExportShareModalProps> = ({
  isOpen,
  onClose,
  shareUrl,
  recipientName,
}) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(
    `🎉 I made an interactive birthday card for ${recipientName || 'you'}! Open it here: ${shareUrl}`
  )}`;

  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `🎉 Check out this interactive birthday card created for ${recipientName || 'a friend'}!`
  )}&url=${encodeURIComponent(shareUrl)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border-2 border-[#f3a2b5]/40 bg-[#fff9f9] p-6 shadow-2xl text-slate-800">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#f3a2b5]/30">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#f3a2b5]/25 text-[#e9829b] border border-[#f3a2b5]/50">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">Share Interactive Card</h2>
              <p className="text-xs text-slate-500">Recipient sees full card with music & candle blowing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-[#f3a2b5]/20 hover:text-slate-700 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Share Link Copy Box */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Unique Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-white px-3 py-2 text-xs text-slate-800 truncate focus:outline-none focus:border-[#e9829b]"
              />
              <button
                onClick={handleCopyLink}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-all shadow-xs ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] hover:opacity-95 text-white'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* QR Code Section */}
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-white border border-[#f3a2b5]/30 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 mb-2">
              <QrCode className="h-4 w-4 text-[#e9829b]" />
              <span>Scan QR Code to Open on Mobile</span>
            </div>
            <div className="p-3 bg-[#fff9f9] rounded-xl shadow-xs border border-[#f3a2b5]/30">
              <QRCodeSVG
                value={shareUrl}
                size={144}
                level="M"
                bgColor="#fff9f9"
                fgColor="#1e293b"
              />
            </div>
          </div>

          {/* Direct Social Share Buttons */}
          <div>
            <span className="block text-xs font-bold text-slate-700 mb-2">
              Quick Share Options
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 border border-emerald-300 p-2.5 text-xs font-bold text-emerald-800 hover:bg-emerald-100 transition-colors shadow-2xs"
              >
                <MessageCircle className="h-4 w-4 text-emerald-600" />
                <span>WhatsApp</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-[#f3a2b5]/20 border border-[#f3a2b5]/50 p-2.5 text-xs font-bold text-[#e9829b] hover:bg-[#f3a2b5]/30 transition-colors shadow-2xs"
              >
                <Send className="h-4 w-4 text-[#e9829b]" />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>

          {/* Test Link Button */}
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-white p-2.5 text-xs font-bold text-slate-700 hover:bg-[#fff9f9] hover:text-[#e9829b] transition-colors border border-[#f3a2b5]/40 shadow-2xs"
          >
            <ExternalLink className="h-4 w-4 text-[#e9829b]" />
            <span>Open Link in New Tab (Recipient Mode)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
