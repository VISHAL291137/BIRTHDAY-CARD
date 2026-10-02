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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Share2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Share Interactive Card</h2>
              <p className="text-xs text-slate-400">Recipient sees full card with music & candle blowing</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="mt-4 space-y-4">
          {/* Share Link Copy Box */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Unique Shareable Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-cyan-300 truncate focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`flex shrink-0 items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold transition-colors ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-cyan-600 hover:bg-cyan-500 text-white'
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
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-slate-950 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 mb-2">
              <QrCode className="h-4 w-4 text-amber-400" />
              <span>Scan QR Code to Open on Mobile</span>
            </div>
            <div className="p-3 bg-white rounded-xl shadow-md">
              <QRCodeSVG
                value={shareUrl}
                size={144}
                level="M"
                bgColor="#ffffff"
                fgColor="#090d16"
              />
            </div>
          </div>

          {/* Direct Social Share Buttons */}
          <div>
            <span className="block text-xs font-semibold text-slate-400 mb-2">
              Quick Share Options
            </span>
            <div className="grid grid-cols-2 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-emerald-600/20 border border-emerald-500/40 p-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-600/30 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>WhatsApp</span>
              </a>

              <a
                href={twitterUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 rounded-xl bg-sky-600/20 border border-sky-500/40 p-2.5 text-xs font-bold text-sky-300 hover:bg-sky-600/30 transition-colors"
              >
                <Send className="h-4 w-4" />
                <span>Twitter / X</span>
              </a>
            </div>
          </div>

          {/* Test Link Button */}
          <a
            href={shareUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-800 p-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 transition-colors border border-slate-700"
          >
            <ExternalLink className="h-4 w-4 text-cyan-400" />
            <span>Open Link in New Tab (Recipient Mode)</span>
          </a>
        </div>
      </div>
    </div>
  );
};
