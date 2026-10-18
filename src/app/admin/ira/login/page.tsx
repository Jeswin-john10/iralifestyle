'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();
      if (data.success) {
        localStorage.setItem('ira_admin_logged_in', 'true');
        router.push('/admin/ira');
      } else {
        setError(data.error || 'Invalid administrator credentials');
      }
    } catch {
      setError('Unable to authenticate with server');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-[85vh] bg-[#FAF7F2] flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full bg-white p-8 sm:p-10 rounded-xs border border-[#EDE5D8] shadow-xl">
        {/* Monogram */}
        <div className="text-center mb-8">
          <div className="relative w-16 h-16 mx-auto mb-3">
            <Image
              src="/images/ira-logo.png"
              alt="IRA Lifestyle"
              fill
              className="object-contain"
            />
          </div>
          <span className="text-[10px] tracking-[0.3em] font-semibold text-[#8F867C] uppercase block">
            ADMINISTRATOR PORTAL
          </span>
          <h1
            style={{ fontFamily: 'var(--font-serif)' }}
            className="text-3xl text-[#231F1C] font-normal mt-1"
          >
            IRA Lifestyle Control
          </h1>
          <p className="text-xs text-[#8F867C] mt-1 font-light">
            Secure catalogue &amp; Cloudflare / MongoDB management
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-[#FDF0ED] border border-[#F3C4B6] text-[#A82A10] text-xs rounded-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
              Admin Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F867C]">
                <User className="w-4 h-4" />
              </div>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter admin username"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-[#4A423A] mb-1.5">
              Admin Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#8F867C]">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full pl-10 pr-4 py-3 bg-[#FAF7F2] border border-[#EDE5D8] rounded-xs text-xs text-[#231F1C] focus:outline-none focus:border-[#B68D56]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="gold-btn w-full py-3.5 text-xs tracking-[0.2em] uppercase rounded-xs font-semibold flex items-center justify-center space-x-2 shadow-sm"
          >
            <span>{loading ? 'AUTHENTICATING...' : 'ENTER DASHBOARD'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#EDE5D8] text-center text-[11px] text-[#8F867C] flex items-center justify-center space-x-1.5">
          <ShieldCheck className="w-4 h-4 text-[#B68D56]" />
          <span>Default credentials loaded: admin / admin</span>
        </div>
      </div>
    </div>
  );
}
