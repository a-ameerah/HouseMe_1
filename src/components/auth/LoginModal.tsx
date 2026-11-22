import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Smartphone, Shield, ArrowRight, RefreshCw, CheckCircle2 } from 'lucide-react';
import { Modal } from '../common/Modal';
import { Button } from '../common/Button';
import { OTPInput } from '../common/OTPInput';
import { useStore } from '../../store/useStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  title?: string;
  subtitle?: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  title = 'Verify your phone number',
  subtitle = 'Login is required to save, review, chat, or book viewings.',
}) => {
  const { addToast } = useStore();
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('0802 345 6789');
  const [otp, setOtp] = useState('');
  const [resendTimer, setResendTimer] = useState(30);
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSendCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone || phone.length < 8) {
      addToast('Please enter a valid Nigerian phone number', 'error');
      return;
    }
    setStep('otp');
    addToast('Demo code sent! Use: 123456', 'info');
  };

  const handleVerifyOtp = (codeToTest = otp) => {
    if (codeToTest.trim() === '123456') {
      setIsVerifying(true);
      setTimeout(() => {
        setIsVerifying(false);
        addToast('Phone verified successfully!', 'success');
        onSuccess?.();
        onClose();
        setStep('phone');
      }, 600);
    } else {
      addToast('Incorrect code. Use demo code: 123456', 'error');
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={step === 'phone' ? title : 'Enter 6-digit code'}>
      {step === 'phone' ? (
        <form onSubmit={handleSendCode} className="space-y-4">
          <p className="text-xs text-ink-700 leading-relaxed">{subtitle}</p>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-ink-900">Phone Number</label>
            <div className="flex items-center rounded-input border border-line bg-surface px-3 py-2 focus-within:border-brand-600 focus-within:ring-2 focus-within:ring-brand-500/20">
              <span className="text-xs font-bold text-brand-900 border-r border-line pr-2.5 mr-2.5">
                🇳🇬 +234
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="080 0000 0000"
                className="w-full text-sm font-semibold bg-transparent focus:outline-none text-ink-900"
              />
            </div>
            <span className="text-[11px] text-ink-700">
              Any number works. A simulated SMS code will be generated.
            </span>
          </div>

          <Button type="submit" variant="primary" className="w-full" icon={<ArrowRight className="w-4 h-4" />}>
            Send verification code
          </Button>

          <div className="flex items-center justify-center gap-1.5 text-[11px] text-ink-700 pt-2">
            <Shield className="w-3.5 h-3.5 text-brand-700" />
            <span>We never share your phone number with agents pre-booking</span>
          </div>
        </form>
      ) : (
        <div className="space-y-5 text-center">
          <p className="text-xs text-ink-700">
            Enter the 6-digit verification code sent to <strong className="text-ink-900">{phone}</strong>.
          </p>

          <div className="p-2.5 rounded-xl bg-brand-50 border border-brand-100 text-xs text-brand-900 font-semibold inline-block">
            Demo Code: <span className="font-mono text-base tracking-widest text-brand-700">123456</span>
          </div>

          <OTPInput
            length={6}
            value={otp}
            onChange={setOtp}
            onComplete={(code) => handleVerifyOtp(code)}
          />

          <Button
            variant="primary"
            className="w-full"
            loading={isVerifying}
            onClick={() => handleVerifyOtp()}
          >
            Verify & Continue
          </Button>

          <div className="flex items-center justify-center gap-2 text-xs text-ink-700">
            <span>Didn’t get code?</span>
            <button
              type="button"
              onClick={() => addToast('Code re-sent: 123456', 'info')}
              className="text-brand-700 font-bold hover:underline"
            >
              Resend ({resendTimer}s)
            </button>
          </div>
        </div>
      )}
    </Modal>
  );
};
