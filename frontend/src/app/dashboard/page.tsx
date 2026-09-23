"use client";

import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export default function Dashboard() {
  const [username, setUsername] = useState('');
  const [pwd, setPwd] = useState('');
  const [auth, setAuth] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Mengirim Username & Password ke backend
      const authRes = await fetch(`${API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password: pwd })
      });
      
      if (authRes.ok) {
        // Setelah sukses login, baru ambil data analytics
        // Catatan: Jika backend mem-verifikasi menggunakan header Authorization atau session, 
        // request ini bisa disesuaikan nantinya. 
        const res = await fetch(`${API_URL}/api/analytics?username=${username}&pwd=${pwd}`);
        if (res.ok) {
          const json = await res.json();
          setData(json);
          setAuth(true);
        } else {
          alert('Failed to fetch analytics data');
        }
      } else {
        alert('Invalid Username or Password');
      }
    } catch (e) {
      console.error(e);
      alert('Connection error');
    }
    setLoading(false);
  };

  if (!auth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glassmorphism p-8 rounded-xl w-96 max-w-full">
          <h2 className="text-2xl font-bold mb-6 text-white text-center">Analytics Dashboard</h2>
          <input 
            type="text" 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white mb-4"
            placeholder="Enter Username"
          />
          <input 
            type="password" 
            value={pwd}
            onChange={(e) => setPwd(e.target.value)}
            className="w-full bg-blue-dark/20 border border-blue-main/30 rounded-lg px-4 py-3 text-white mb-4"
            placeholder="Enter Password"
          />
          <button 
            onClick={fetchAnalytics}
            className="w-full py-3 bg-blue-main hover:bg-blue-light text-white rounded-lg font-bold"
            disabled={loading}
          >
            {loading ? 'Authenticating...' : 'Login'}
          </button>
        </div>
      </div>
    );
  }

  const COLORS = ['#3B82F6', '#60A5FA', '#93C5FD'];

  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold font-space text-white mb-8">NFC/QR Tap Analytics</h1>
      
      {data && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glassmorphism p-6 rounded-xl">
            <p className="text-gray-400 text-sm mb-1">Total Taps</p>
            <h2 className="text-4xl font-bold text-white">{data.totalTaps}</h2>
          </div>

          <div className="glassmorphism p-6 rounded-xl md:col-span-2">
            <h3 className="text-lg font-bold text-white mb-4">Taps by Source</h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.sourceData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.sourceData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0E27', borderColor: '#3B82F6', color: 'white' }} 
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="glassmorphism p-6 rounded-xl md:col-span-3">
            <h3 className="text-lg font-bold text-white mb-4">Tap Activity (Over Time)</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.timeData}>
                  <XAxis dataKey="date" stroke="#93C5FD" />
                  <YAxis stroke="#93C5FD" allowDecimals={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0A0E27', borderColor: '#3B82F6', color: 'white' }} 
                  />
                  <Bar dataKey="taps" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
