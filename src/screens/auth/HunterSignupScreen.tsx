import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, ArrowRight, User } from 'lucide-react';
import { OTPInput } from '../../components/common/OTPInput';
import { useStore } from '../../store/useStore';

type Step = 'phone' | 'otp' | 'name';

export const HunterSignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signupHunter, addToast } = useStore();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handlePhoneSubmit = () => {
    const digits = phone.replace(/\D/g, '');
    if (digits.length < 10) {
      setError('Please enter a valid Nigerian phone number.');
      return;
    }
    setError('');
    setStep('otp');
  };

  const handleOtpComplete = (code: string) => {
    // Demo OTP is 123456
    if (code === '123456') {
      setError('');
      setStep('name');
    } else if (code.length === 6) {
      setError('Wrong code. Use 123456 for the demo.');
    }
  };

  const handleSignup = () => {
    if (!firstName.trim()) {
      setError('Please enter your first name.');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      signupHunter(phone, firstName.trim());
      addToast(`Welcome, ${firstName.trim()}!`, 'success');
      navigate('/');
    }, 600);
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-5 border-b border-line bg-surface sticky top-0 z-10">
        <button
          type="button"
          onClick={() => (step === 'phone' ? navigate('/welcome') : setStep(step === 'otp' ? 'phone' : 'otp'))}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-brand-50 text-ink-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-ink-900">Create account</h1>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-6 py-10">
        {/* Progress dots */}
        <div className="flex gap-2 mb-10">
          {(['phone', 'otp', 'name'] as Step[]).map((s) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                s === step ? 'bg-brand-700' : step === 'otp' && s === 'phone' || step === 'name' ? 'bg-brand-300' : 'bg-line'
              }`}
            />
          ))}
        </div>

        {step === 'phone' && (
          <>
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
                <Phone className="w-7 h-7 text-brand-700" />
              </div>
              <h2 className="text-2xl font-black text-ink-900 mb-2">Enter your phone</h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                We will send a one-time code to verify your number. No spam, ever.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-ink-700 mb-2">
                Phone number
              </label>
              <div className="flex items-center gap-2 border-2 border-line rounded-xl px-4 min-h-[56px] bg-surface focus-within:border-brand-700 transition-colors">
                <span className="text-base font-semibold text-ink-700 shrink-0">+234</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  placeholder="080 0000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="flex-1 bg-transparent text-base font-semibold text-ink-900 outline-none placeholder-ink-400"
                  autoFocus
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-900 font-medium mb-4">{error}</p>}
            <button
              type="button"
              onClick={handlePhoneSubmit}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              <span>Send code</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {step === 'otp' && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-black text-ink-900 mb-2">Check your phone</h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                Enter the 6-digit code sent to <strong>+234 {phone}</strong>.<br />
                For this demo, use <strong className="text-brand-700">123456</strong>.
              </p>
            </div>
            <div className="mb-6">
              <OTPInput
                length={6}
                value={otp}
                onChange={setOtp}
                onComplete={handleOtpComplete}
              />
            </div>
            {error && <p className="text-sm text-red-900 font-medium mb-4 text-center">{error}</p>}
            <button
              type="button"
              onClick={() => handleOtpComplete(otp)}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Verify
            </button>
            <button
              type="button"
              className="w-full mt-4 text-sm font-semibold text-ink-700 hover:text-ink-900 transition-colors"
            >
              Resend code
            </button>
          </>
        )}

        {step === 'name' && (
          <>
            <div className="mb-8">
              <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
                <User className="w-7 h-7 text-brand-700" />
              </div>
              <h2 className="text-2xl font-black text-ink-900 mb-2">What is your name?</h2>
              <p className="text-sm text-ink-700 leading-relaxed">
                Just your first name. This is how agents will address you.
              </p>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-ink-700 mb-2">First name</label>
              <input
                type="text"
                placeholder="e.g. Ada"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full border-2 border-line rounded-xl px-4 min-h-[56px] bg-surface text-base font-semibold text-ink-900 outline-none focus:border-brand-700 transition-colors placeholder-ink-400"
                autoFocus
              />
            </div>
            {error && <p className="text-sm text-red-900 font-medium mb-4">{error}</p>}
            <button
              type="button"
              onClick={handleSignup}
              disabled={loading}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600  text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors mt-2"
            >
              {loading ? 'Setting up...' : 'Get started'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
