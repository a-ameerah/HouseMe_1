import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  Phone,
  User,
  Camera,
  CreditCard,
  FileText,
  Clock,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { OTPInput } from '../../components/common/OTPInput';
import { Stepper } from '../../components/common/Stepper';
import { useStore } from '../../store/useStore';

type Step = 'account_type' | 'phone' | 'otp' | 'profile' | 'identity' | 'mandate' | 'pending';

const steps = [
  { title: 'Account' },
  { title: 'Phone' },
  { title: 'Profile' },
  { title: 'Identity' },
  { title: 'Mandate' },
  { title: 'Review' },
];

const stepIndex: Record<Step, number> = {
  account_type: 0,
  phone: 1,
  otp: 1,
  profile: 2,
  identity: 3,
  mandate: 4,
  pending: 5,
};

export const AgentSignupScreen: React.FC = () => {
  const navigate = useNavigate();
  const { signupAgent, addToast } = useStore();

  const [step, setStep] = useState<Step>('account_type');
  const [accountType, setAccountType] = useState<'individual' | 'company'>('individual');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [agencyName, setAgencyName] = useState('');
  const [nin, setNin] = useState('');
  const [selfieConfirmed, setSelfieConfirmed] = useState(false);
  const [mandateConfirmed, setMandateConfirmed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const goBack = () => {
    const order: Step[] = ['account_type', 'phone', 'otp', 'profile', 'identity', 'mandate', 'pending'];
    const idx = order.indexOf(step);
    if (idx > 0) setStep(order[idx - 1]);
    else navigate('/welcome');
  };

  const handleOtpComplete = (code: string) => {
    if (code === '123456') {
      setError('');
      setStep('profile');
    } else if (code.length === 6) {
      setError('Wrong code. Use 123456 for the demo.');
    }
  };

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      signupAgent({
        phone,
        name: name.trim() || 'New Agent',
        businessName: agencyName.trim() || undefined,
      });
      addToast('Application submitted. Under review!', 'success');
      setStep('pending');
      setLoading(false);
    }, 800);
  };

  if (step === 'pending') {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center px-6 py-10">
        <div className="max-w-sm w-full text-center">
          <div className="w-20 h-20 rounded-full bg-brand-100 border-4 border-brand-700 flex items-center justify-center mx-auto mb-6">
            <Clock className="w-10 h-10 text-brand-700" />
          </div>
          <h2 className="text-2xl font-black text-ink-900 mb-3">Application received</h2>
          <p className="text-sm text-ink-700 leading-relaxed mb-6">
            Your application is <strong>under review</strong>. Our team will verify your NIN
            and authority mandate within 1-2 business days.
          </p>

          {/* Status tracker */}
          <div className="bg-surface border border-line rounded-xl p-5 mb-8 text-left">
            <p className="text-sm font-bold text-ink-900 mb-4">Application status</p>
            <div className="space-y-3">
              {[
                { label: 'Application submitted', done: true },
                { label: 'NIN verification', done: false, current: true },
                { label: 'Authority mandate review', done: false },
                { label: 'Account activated', done: false },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  {item.done ? (
                    <CheckCircle className="w-5 h-5 text-brand-700 shrink-0" />
                  ) : item.current ? (
                    <div className="w-5 h-5 rounded-full border-2 border-brand-700 flex items-center justify-center shrink-0">
                      <div className="w-2 h-2 rounded-full bg-brand-700 animate-pulse" />
                    </div>
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-line shrink-0" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      item.done || item.current ? 'text-ink-900' : 'text-ink-700'
                    }`}
                  >
                    {item.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold transition-colors"
            >
              Back to home
            </button>
            <button
              type="button"
              onClick={() => navigate('/login?role=agent')}
              className="w-full min-h-[48px] bg-surface border border-line text-ink-700 hover:bg-brand-50 rounded-xl text-sm font-semibold transition-colors"
            >
              Check application status
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-5 border-b border-line bg-surface sticky top-0 z-10">
        <button
          type="button"
          onClick={goBack}
          className="w-10 h-10 rounded-lg flex items-center justify-center hover:bg-brand-50 text-ink-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-lg font-bold text-ink-900">Agent registration</h1>
      </div>

      {/* Progress stepper */}
      <div className="px-5 pt-5 pb-2 bg-surface border-b border-line">
        <Stepper steps={steps} currentStep={stepIndex[step]} />
      </div>

      <div className="flex-1 flex flex-col max-w-sm mx-auto w-full px-6 py-8">

        {/* STEP: Account type */}
        {step === 'account_type' && (
          <>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Account type</h2>
            <p className="text-sm text-ink-700 mb-8">Are you registering as an individual or on behalf of a company?</p>
            <div className="flex flex-col gap-3 mb-8">
              {(['individual', 'company'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  className={`w-full min-h-[64px] rounded-xl border-2 px-5 text-left text-base font-semibold transition-colors flex items-center justify-between ${
                    accountType === type
                      ? 'border-brand-700 bg-brand-50 text-brand-700'
                      : 'border-line bg-surface text-ink-700 hover:border-brand-200'
                  }`}
                >
                  <span className="capitalize">{type}</span>
                  {accountType === type && <CheckCircle className="w-5 h-5 text-brand-700" />}
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* STEP: Phone */}
        {step === 'phone' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
              <Phone className="w-7 h-7 text-brand-700" />
            </div>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Your phone number</h2>
            <p className="text-sm text-ink-700 mb-8">We will verify this number before activating your account.</p>
            <div className="mb-4">
              <label className="block text-sm font-semibold text-ink-700 mb-2">Phone number</label>
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
              onClick={() => {
                if (phone.replace(/\D/g, '').length < 10) {
                  setError('Please enter a valid phone number.');
                  return;
                }
                setError('');
                setStep('otp');
              }}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Send code <ArrowRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* STEP: OTP */}
        {step === 'otp' && (
          <>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Verify phone</h2>
            <p className="text-sm text-ink-700 mb-8">
              Enter the 6-digit code sent to <strong>+234 {phone}</strong>.<br />
              Demo code: <strong className="text-brand-700">123456</strong>
            </p>
            <div className="mb-6">
              <OTPInput length={6} value={otp} onChange={setOtp} onComplete={handleOtpComplete} />
            </div>
            {error && <p className="text-sm text-red-900 font-medium mb-4 text-center">{error}</p>}
            <button
              type="button"
              onClick={() => handleOtpComplete(otp)}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold transition-colors"
            >
              Verify
            </button>
          </>
        )}

        {/* STEP: Profile */}
        {step === 'profile' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
              <User className="w-7 h-7 text-brand-700" />
            </div>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Your profile</h2>
            <p className="text-sm text-ink-700 mb-8">This is how property hunters will see you.</p>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Full name</label>
                <input
                  type="text"
                  placeholder="e.g. Mr Tunde Bello"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border-2 border-line rounded-xl px-4 min-h-[56px] bg-surface text-base font-semibold text-ink-900 outline-none focus:border-brand-700 transition-colors placeholder-ink-400"
                />
              </div>
              {accountType === 'company' && (
                <div>
                  <label className="block text-sm font-semibold text-ink-700 mb-2">Agency name</label>
                  <input
                    type="text"
                    placeholder="e.g. Bello Properties Ltd"
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    className="w-full border-2 border-line rounded-xl px-4 min-h-[56px] bg-surface text-base font-semibold text-ink-900 outline-none focus:border-brand-700 transition-colors placeholder-ink-400"
                  />
                </div>
              )}
              {/* Profile photo placeholder */}
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Profile photo</label>
                <button
                  type="button"
                  className="w-full min-h-[64px] border-2 border-dashed border-line rounded-xl flex items-center justify-center gap-3 text-sm font-semibold text-ink-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50 transition-colors"
                >
                  <Camera className="w-5 h-5" />
                  Upload profile photo (optional)
                </button>
              </div>
            </div>
            <button
              type="button"
              onClick={() => {
                if (!name.trim()) {
                  setError('Please enter your full name.');
                  return;
                }
                setError('');
                setStep('identity');
              }}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
            {error && <p className="text-sm text-red-900 font-medium mt-3">{error}</p>}
          </>
        )}

        {/* STEP: Identity */}
        {step === 'identity' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
              <CreditCard className="w-7 h-7 text-brand-700" />
            </div>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Verify your identity</h2>
            <p className="text-sm text-ink-700 mb-8 leading-relaxed">
              We use your NIN to confirm you are a real person. This is kept private and is never shown to hunters.
            </p>
            <div className="space-y-4 mb-8">
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">NIN (11 digits)</label>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Enter your NIN"
                  maxLength={11}
                  value={nin}
                  onChange={(e) => setNin(e.target.value.replace(/\D/g, ''))}
                  className="w-full border-2 border-line rounded-xl px-4 min-h-[56px] bg-surface text-base font-semibold text-ink-900 outline-none focus:border-brand-700 transition-colors placeholder-ink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-ink-700 mb-2">Selfie</label>
                <button
                  type="button"
                  onClick={() => setSelfieConfirmed(true)}
                  className={`w-full min-h-[64px] border-2 rounded-xl flex items-center justify-center gap-3 text-sm font-semibold transition-colors ${
                    selfieConfirmed
                      ? 'border-brand-700 bg-brand-50 text-brand-700'
                      : 'border-dashed border-line text-ink-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'
                  }`}
                >
                  {selfieConfirmed ? (
                    <>
                      <CheckCircle className="w-5 h-5" />
                      Selfie captured
                    </>
                  ) : (
                    <>
                      <Camera className="w-5 h-5" />
                      Take selfie (simulated)
                    </>
                  )}
                </button>
              </div>
            </div>
            <div className="flex items-start gap-2 p-4 bg-brand-50 border border-brand-100 rounded-xl mb-8">
              <AlertCircle className="w-4 h-4 text-brand-700 shrink-0 mt-0.5" />
              <p className="text-xs text-ink-700 leading-relaxed">
                Your NIN is encrypted and stored securely. It is only used for identity verification and is never shared.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                if (nin.length < 11) {
                  setError('Please enter your 11-digit NIN.');
                  return;
                }
                setError('');
                setStep('mandate');
              }}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600 text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              Continue <ArrowRight className="w-5 h-5" />
            </button>
            {error && <p className="text-sm text-red-900 font-medium mt-3">{error}</p>}
          </>
        )}

        {/* STEP: Mandate */}
        {step === 'mandate' && (
          <>
            <div className="w-14 h-14 rounded-2xl bg-brand-50 border border-brand-100 flex items-center justify-center mb-5">
              <FileText className="w-7 h-7 text-brand-700" />
            </div>
            <h2 className="text-2xl font-black text-ink-900 mb-2">Authority mandate</h2>
            <p className="text-sm text-ink-700 mb-8 leading-relaxed">
              Upload a signed mandate from the property owner authorising you to list their property on HouseMe.
            </p>
            <button
              type="button"
              onClick={() => setMandateConfirmed(true)}
              className={`w-full min-h-[80px] border-2 rounded-xl flex flex-col items-center justify-center gap-2 text-sm font-semibold transition-colors mb-8 ${
                mandateConfirmed
                  ? 'border-brand-700 bg-brand-50 text-brand-700'
                  : 'border-dashed border-line text-ink-700 hover:border-brand-300 hover:text-brand-700 hover:bg-brand-50'
              }`}
            >
              {mandateConfirmed ? (
                <>
                  <CheckCircle className="w-6 h-6" />
                  Mandate uploaded
                </>
              ) : (
                <>
                  <FileText className="w-6 h-6" />
                  Upload mandate PDF or photo
                  <span className="text-xs text-ink-700 font-medium">JPG, PNG, or PDF up to 5MB</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className="w-full min-h-[56px] bg-brand-700 hover:bg-brand-600  text-white rounded-xl text-base font-bold flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? 'Submitting...' : 'Submit for review'}
            </button>
            <p className="text-xs text-ink-700 text-center mt-4 leading-relaxed">
              You can submit without the mandate and upload it later. Your account will only be activated after all documents are verified.
            </p>
          </>
        )}
      </div>
    </div>
  );
};
