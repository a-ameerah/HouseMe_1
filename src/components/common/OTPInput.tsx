import React, { useRef, useState } from 'react';

interface OTPInputProps {
  length?: number;
  value: string;
  onChange: (value: string) => void;
  onComplete?: (code: string) => void;
  disabled?: boolean;
}

export const OTPInput: React.FC<OTPInputProps> = ({
  length = 6,
  value,
  onChange,
  onComplete,
  disabled = false,
}) => {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [digits, setDigits] = useState<string[]>(
    Array.from({ length }, (_, i) => value[i] || '')
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>, idx: number) => {
    const val = e.target.value.replace(/\D/g, '');
    const char = val.slice(-1);
    const newDigits = [...digits];
    newDigits[idx] = char;
    setDigits(newDigits);
    const code = newDigits.join('');
    onChange(code);

    if (char && idx < length - 1) {
      inputRefs.current[idx + 1]?.focus();
    }
    if (code.length === length && onComplete) {
      onComplete(code);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, idx: number) => {
    if (e.key === 'Backspace' && !digits[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!paste) return;
    const newDigits = Array.from({ length }, (_, i) => paste[i] || '');
    setDigits(newDigits);
    onChange(newDigits.join(''));
    if (paste.length === length && onComplete) {
      onComplete(paste);
    }
    inputRefs.current[Math.min(paste.length, length - 1)]?.focus();
  };

  return (
    <div className="flex items-center justify-center gap-2">
      {Array.from({ length }).map((_, idx) => (
        <input
          key={idx}
          ref={(el) => (inputRefs.current[idx] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[idx] || ''}
          onChange={(e) => handleChange(e, idx)}
          onKeyDown={(e) => handleKeyDown(e, idx)}
          onPaste={handlePaste}
          disabled={disabled}
          className={`${length === 4 ? 'w-16 h-16 text-[28px]' : 'w-11 h-13 min-h-[48px] text-lg'} text-center font-extrabold rounded-input border border-line bg-surface text-ink-900 focus:border-brand-600 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-all`}
        />
      ))}
    </div>
  );
};
