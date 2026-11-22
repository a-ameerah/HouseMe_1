import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Phone, CheckCircle, Clock } from 'lucide-react';
import { OTPInput } from '../../components/common/OTPInput';
import { useStore } from '../../store/useStore';
import { Role } from '../../data/types';

type Step = 'phone' | 'otp';

export const LoginScreen: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { login, addToast } = useStore();
  const [step, setStep] = useState<Step>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Pre-fill for quick demo shortcuts
  const quickLogins = [
    { label: 'Ada (Hunter)', phone: '08011111111', role: 'hunter' as Role },
    { label: 'Mr Tunde (Agent)', phone: '08022222222', role: 'agent' as Role },
    { label: 'Admin', phone: '08099999999', role: 'admin' as Role },
  ];

  const handleQuickLogin = (item: typeof quickLogins[0]) => {
    setLoading(true);
    setTimeout(() => {
      login(item.phone, item.role);
      addToast(`Logged in as ${item.label}.`, 'success');
      if (item.role === 'agent') navigate('/agent-dashboard');
      else if (item.role === 'admin') navigate('/admin');
      else navigate('/');
    }, 500);
  };

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
    if (code === '123456') {
      setError('');
      setLoading(true);
      const intendedRole = (searchParams.get('role') as Role) || 'hunter';
      setTimeout(() => {
        const success = login(phone, intendedRole);
        if (success) {
          addToast('Welcome back!', 'success');
          if (intendedRole === 'agent') navigate('/agent-dashboard');
          else if (intendedRole === 'admin') navigate('/admin');
          else navigate('/');
        } else {
          setError('Account not found. Please sign up first.');
          setLoading(false);
        }
      }, 500);
    } else if (code.length === 6) {
      setError('Wrong code. Use 123456 for this demo.');
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-5 border-b border-line bg-surface sticky top-0 z-10">
        <button
          type="button"
          onClick={() => (step === 'phone' ? navigate('/welcome') : setStep('phone'))}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-brand-50 text-ink-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-ink-900">Log in</h1>
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-6 py-10">
        {step === 'phone' && (
          <>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Welcome back</h2>
            <p className="text-sm text-ink-700 mb-8 leading-relaxed">
              Enter your phone number to receive a login code.
            </p>

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
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors mb-8"
            >
              <span>Send code</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            {/* Demo shortcuts */}
            <div className="border-t border-line pt-6">
              <p className="text-xs font-bold uppercase tracking-wider text-ink-700 mb-3">
                Quick demo logins
              </p>
              <div className="flex flex-col gap-2">
                {quickLogins.map((item) => (
                  <button
                    key={item.label}
                    type="button"
                    onClick={() => handleQuickLogin(item)}
                    disabled={loading}
                    className="w-full min-h-[48px] bg-surface border border-line rounded-xl px-4 text-sm font-semibold text-ink-700 hover:bg-brand-50 hover:border-brand-200 hover:text-brand-700 transition-colors flex items-center justify-between"
                  >
                    <span>{item.label}</span>
                    <ArrowRight className="w-4 h-4 text-ink-700" />
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {step === 'otp' && (
          <>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Enter your code</h2>
            <p className="text-sm text-ink-700 mb-8 leading-relaxed">
              Sent to <strong>+234 {phone}</strong>. For this demo, use{' '}
              <strong className="text-brand-700">123456</strong>.
            </p>
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
              disabled={loading}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600  text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Logging in...' : 'Verify and log in'}
            </button>
          </>
        )}
      </div>
    </div>
  );
};
