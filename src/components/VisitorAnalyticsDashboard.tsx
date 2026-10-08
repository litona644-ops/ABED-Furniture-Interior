import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Activity, 
  Eye, 
  Globe, 
  Smartphone, 
  Monitor, 
  Tablet, 
  Calendar, 
  TrendingUp, 
  Search, 
  Filter, 
  RefreshCw, 
  ShieldAlert, 
  ArrowUpRight, 
  Check, 
  Copy, 
  Clock, 
  Compass, 
  Radio, 
  FileText, 
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Download
} from 'lucide-react';
import { VisitorRecord, VisitorStats } from '../types';
import { 
  fetchVisitorAnalyticsRecords, 
  calculateVisitorStats, 
  calculateTrendChartData, 
  detectSuspiciousActivity, 
  SuspiciousActivityItem 
} from '../lib/analytics';

export const VisitorAnalyticsDashboard: React.FC = () => {
  const [records, setRecords] = useState<VisitorRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [timeframe, setTimeframe] = useState<'today' | '7days' | '30days'>('7days');
  const [searchQuery, setSearchQuery] = useState('');
  const [deviceFilter, setDeviceFilter] = useState<'all' | 'desktop' | 'mobile' | 'tablet'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  // Load records on mount
  const loadData = async (isManualRefresh = false) => {
    if (isManualRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const data = await fetchVisitorAnalyticsRecords();
      setRecords(data);
    } catch (err) {
      console.error('Failed to load visitor analytics:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
    // Auto refresh every 45 seconds for live monitor feel
    const interval = setInterval(() => loadData(false), 45000);
    return () => clearInterval(interval);
  }, []);

  // Summary Metrics
  const stats: VisitorStats = useMemo(() => calculateVisitorStats(records), [records]);

  // Trend Chart Data
  const chartData = useMemo(() => calculateTrendChartData(records, timeframe), [records, timeframe]);
  const maxVisitorsInChart = useMemo(() => Math.max(...chartData.map(d => d.visitors), 10), [chartData]);

  // Suspicious Activity
  const suspiciousList: SuspiciousActivityItem[] = useMemo(() => detectSuspiciousActivity(records), [records]);

  // Device Breakdown
  const deviceCounts = useMemo(() => {
    const counts = { desktop: 0, mobile: 0, tablet: 0 };
    records.forEach(r => {
      if (r.device === 'desktop') counts.desktop++;
      else if (r.device === 'mobile') counts.mobile++;
      else if (r.device === 'tablet') counts.tablet++;
    });
    const total = records.length || 1;
    return {
      desktop: Math.round((counts.desktop / total) * 100),
      mobile: Math.round((counts.mobile / total) * 100),
      tablet: Math.round((counts.tablet / total) * 100),
      rawDesktop: counts.desktop,
      rawMobile: counts.mobile,
      rawTablet: counts.tablet,
    };
  }, [records]);

  // Filtered and Paginated Table Records
  const filteredRecords = useMemo(() => {
    return records.filter(r => {
      // Device filter
      if (deviceFilter !== 'all' && r.device !== deviceFilter) return false;

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesIp = r.ip.toLowerCase().includes(q);
        const matchesCountry = r.country.toLowerCase().includes(q);
        const matchesCity = (r.city || '').toLowerCase().includes(q);
        const matchesPage = r.visitedPage.toLowerCase().includes(q);
        const matchesBrowser = r.browser.toLowerCase().includes(q);
        const matchesOs = r.os.toLowerCase().includes(q);
        const matchesReferrer = r.referrer.toLowerCase().includes(q);
        return matchesIp || matchesCountry || matchesCity || matchesPage || matchesBrowser || matchesOs || matchesReferrer;
      }
      return true;
    });
  }, [records, deviceFilter, searchQuery]);

  const totalPages = Math.ceil(filteredRecords.length / pageSize) || 1;
  const paginatedRecords = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredRecords.slice(start, start + pageSize);
  }, [filteredRecords, currentPage, pageSize]);

  const handleCopyIp = (ip: string) => {
    navigator.clipboard.writeText(ip);
    setCopiedIp(ip);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleExportCSV = () => {
    const headers = ['ID', 'IP Address', 'Country', 'City', 'Device', 'Browser', 'OS', 'Visited Page', 'Referrer', 'Date Time'];
    const rows = filteredRecords.map(r => [
      r.id,
      r.ip,
      r.country,
      r.city || '',
      r.device,
      r.browser,
      r.os,
      `"${r.visitedPage}"`,
      `"${r.referrer}"`,
      new Date(r.timestamp).toISOString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `visitor_analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8 text-left font-sans text-stone-100">
      
      {/* ========================================================
          1. HEADER: VISITOR OVERVIEW & CONTROLS
          ======================================================== */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-5">
        <div>
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10.5px] font-mono uppercase tracking-wider mb-2">
            <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
            <span>১০০% রিয়েল ভিজিটর লাইভ ট্র্যাকিং (Real Live Data — No Fake News)</span>
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <span>Visitor Analytics Dashboard</span>
          </h2>
          <p className="text-xs text-stone-400 mt-0.5">
            বাস্তবে ওয়েবসাইট ভিজিট করা ক্লায়েন্টদের আসল IP, ডিভাইস ও পেইজ ভিউয়ের প্রত্যক্ষ প্রমাণ।
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <button
            type="button"
            onClick={() => loadData(true)}
            disabled={refreshing || loading}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-xs font-bold text-stone-300 hover:text-white transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-[#d4a762] ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'আপডেট হচ্ছে...' : 'Refresh'}</span>
          </button>

          <button
            type="button"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#d4a762]/20 to-[#b88e4f]/20 hover:from-[#d4a762]/30 hover:to-[#b88e4f]/30 border border-[#d4a762]/40 text-xs font-bold text-[#f5d799] transition-all cursor-pointer shadow-xs"
            title="CSV ফাইল হিসেবে ডাউনলোড করুন"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* ========================================================
          2. MAIN STATISTICS CARDS
          ======================================================== */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        
        {/* Total Visitors */}
        <div className="relative p-5 rounded-2xl bg-[#080808] border border-white/[0.08] shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[10.5px]">Total Visitors</span>
            <div className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.06] text-[#d4a762]">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-white font-mono">{stats.totalVisitors}</span>
            <p className="text-[11px] text-stone-400 mt-1">আসল সর্বমোট ভিজিট</p>
          </div>
        </div>

        {/* Today's Visitors */}
        <div className="relative p-5 rounded-2xl bg-[#080808] border border-white/[0.08] shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[10.5px]">Today's Visitors</span>
            <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-400 font-mono">{stats.todayVisitors}</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">আজকের আসল ভিজিটর</p>
          </div>
        </div>

        {/* Online Visitors (Live) */}
        <div className="relative p-5 rounded-2xl bg-[#080808] border border-white/[0.08] shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[10.5px]">Online Visitors</span>
            <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping shrink-0" />
              <span className="text-3xl font-black text-emerald-400 font-mono">{stats.onlineVisitors}</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-1">বর্তমানে সক্রিয় (১৫ মিনিটে)</p>
          </div>
        </div>

        {/* Unique Visitors */}
        <div className="relative p-5 rounded-2xl bg-[#080808] border border-white/[0.08] shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[10.5px]">Unique Visitors</span>
            <div className="p-2 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
              <Globe className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-sky-400 font-mono">{stats.uniqueVisitors}</span>
            <p className="text-[11px] text-stone-400 mt-1">স্বতন্ত্র আইপি অডিয়েন্স</p>
          </div>
        </div>

        {/* Total Page Views */}
        <div className="relative p-5 rounded-2xl bg-[#080808] border border-white/[0.08] shadow-lg flex flex-col justify-between overflow-hidden">
          <div className="flex items-center justify-between text-stone-400 text-xs mb-3">
            <span className="font-mono font-bold uppercase tracking-wider text-[10.5px]">Total Page Views</span>
            <div className="p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
              <Eye className="w-4 h-4" />
            </div>
          </div>
          <div>
            <span className="text-3xl font-black text-purple-300 font-mono">{stats.totalPageViews}</span>
            <p className="text-[11px] text-stone-400 mt-1">মোট পেইজ ভিউ রেকর্ড</p>
          </div>
        </div>

      </div>

      {/* ========================================================
          3. VISITOR TREND CHART (Interactive Graph)
          ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#080808] border border-white/[0.08] shadow-2xl space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-[#d4a762]" />
              <h3 className="text-base font-bold text-white font-serif">
                Visitor Traffic Trend (ভিজিটর গ্রাফ)
              </h3>
            </div>
            <p className="text-xs text-stone-400">
              নির্দিষ্ট সময়সীমার মধ্যে ওয়েবসাইটে আসা ভিজিটরের ওঠানামার চিত্র।
            </p>
          </div>

          {/* Timeframe Filter Buttons */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08]">
            <button
              type="button"
              onClick={() => setTimeframe('today')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === 'today'
                  ? 'bg-[#d4a762] text-black font-black shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              আজ (Today)
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('7days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === '7days'
                  ? 'bg-[#d4a762] text-black font-black shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              গত ৭ দিন (7 Days)
            </button>
            <button
              type="button"
              onClick={() => setTimeframe('30days')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                timeframe === '30days'
                  ? 'bg-[#d4a762] text-black font-black shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              গত ৩০ দিন (30 Days)
            </button>
          </div>
        </div>

        {/* Visual Bar Chart */}
        <div className="pt-4">
          <div className="h-56 w-full flex items-end gap-2 sm:gap-3 px-2 border-b border-white/[0.08] pb-2 relative">
            
            {/* Background Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
              <div className="w-full border-b border-dashed border-white/40" />
              <div className="w-full border-b border-dashed border-white/40" />
              <div className="w-full border-b border-dashed border-white/40" />
            </div>

            {chartData.map((item, idx) => {
              const heightPercent = Math.max(12, Math.round((item.visitors / maxVisitorsInChart) * 100));
              return (
                <div 
                  key={idx} 
                  className="flex-1 flex flex-col items-center h-full justify-end group relative z-10"
                >
                  {/* Tooltip on Hover */}
                  <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-stone-900 border border-[#d4a762]/50 text-white text-[11px] px-2.5 py-1.5 rounded-lg shadow-xl pointer-events-none whitespace-nowrap z-20 font-mono">
                    <span className="font-bold text-[#f5d799]">{item.visitors} Visitors</span>
                    <span className="text-stone-400 block text-[9.5px]">{item.pageViews} Page Views</span>
                  </div>

                  {/* The Bar */}
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${heightPercent}%` }}
                    transition={{ duration: 0.5, delay: idx * 0.03 }}
                    className="w-full max-w-[34px] rounded-t-lg bg-gradient-to-t from-[#8c6023] via-[#b88e4f] to-[#f5d799] group-hover:brightness-125 transition-all relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>

                  {/* Value Above Bar on Desktop */}
                  <span className="text-[10px] font-mono text-stone-400 mt-2 hidden sm:block">
                    {item.visitors}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Labels Row */}
          <div className="flex justify-between items-center gap-1 text-[10px] font-mono text-stone-400 mt-2 px-2 overflow-x-auto">
            {chartData.map((item, idx) => (
              <span key={idx} className="flex-1 text-center truncate">
                {item.label}
              </span>
            ))}
          </div>
        </div>

        {/* Devices & Channels Breakdown Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-white/[0.08]">
          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <Smartphone className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-mono block">Mobile Traffic</span>
              <span className="text-base font-black text-white font-mono">{deviceCounts.mobile}% ({deviceCounts.rawMobile})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <Monitor className="w-5 h-5 text-sky-400 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-mono block">Desktop Traffic</span>
              <span className="text-base font-black text-white font-mono">{deviceCounts.desktop}% ({deviceCounts.rawDesktop})</span>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-2xl bg-white/[0.02] border border-white/[0.05]">
            <Tablet className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <span className="text-[11px] text-stone-400 uppercase font-mono block">Tablet Traffic</span>
              <span className="text-base font-black text-white font-mono">{deviceCounts.tablet}% ({deviceCounts.rawTablet})</span>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. VISITOR DETAILS TABLE
          ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#080808] border border-white/[0.08] shadow-2xl space-y-5">
        
        {/* Table Header and Controls */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#d4a762]" />
              <span>Recent Visitors Log (ভিজিটরদের বিস্তারিত তালিকা)</span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              মোট {filteredRecords.length} টি ভিজিটর সেশন পাওয়া গেছে।
            </p>
          </div>

          {/* Search & Filters */}
          <div className="flex items-center gap-3 flex-wrap w-full md:w-auto">
            {/* Search Input */}
            <div className="relative flex-1 sm:w-64">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="IP, Country, Page বা Browser খুঁজুন..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full bg-[#020202] border border-white/[0.1] rounded-xl pl-9 pr-4 py-2 text-xs text-white placeholder:text-stone-500 focus:outline-none focus:border-[#d4a762]"
              />
            </div>

            {/* Device Filter */}
            <div className="flex items-center gap-1 p-1 rounded-xl bg-white/[0.04] border border-white/[0.08] text-xs">
              {(['all', 'desktop', 'mobile', 'tablet'] as const).map(dev => (
                <button
                  key={dev}
                  type="button"
                  onClick={() => {
                    setDeviceFilter(dev);
                    setCurrentPage(1);
                  }}
                  className={`px-2.5 py-1 rounded-lg font-bold capitalize transition-all cursor-pointer ${
                    deviceFilter === dev 
                      ? 'bg-white text-black font-black shadow-xs' 
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {dev}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The Table */}
        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-stone-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Date & Time</th>
                <th className="py-3 px-4">IP Address (Secure)</th>
                <th className="py-3 px-4">Country & Location</th>
                <th className="py-3 px-4">Device</th>
                <th className="py-3 px-4">Browser & OS</th>
                <th className="py-3 px-4">Visited Page</th>
                <th className="py-3 px-4">Referrer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-stone-300">
              {paginatedRecords.length > 0 ? (
                paginatedRecords.map((r) => {
                  const isCopied = copiedIp === r.ip;
                  return (
                    <tr key={r.id} className="hover:bg-white/[0.02] transition-colors">
                      {/* Date & Time */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono text-stone-300">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-500" />
                          <span>{new Date(r.timestamp).toLocaleDateString('bn-BD', { day: '2-digit', month: 'short' })}</span>
                          <span className="text-stone-500">{new Date(r.timestamp).toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </td>

                      {/* IP Address with Copy */}
                      <td className="py-3.5 px-4 whitespace-nowrap font-mono">
                        <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded-lg bg-black border border-white/[0.08] text-[#f5d799]">
                          <span className="font-bold">{r.ip}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyIp(r.ip)}
                            className="text-stone-400 hover:text-white transition-colors cursor-pointer"
                            title="আইপি কপি করুন"
                          >
                            {isCopied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          </button>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Compass className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                          <span className="font-bold text-white">{r.city || 'Dhaka'}</span>
                          <span className="text-stone-500">, {r.country || 'Bangladesh'}</span>
                        </div>
                      </td>

                      {/* Device */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px] capitalize">
                          {r.device === 'mobile' && <Smartphone className="w-3 h-3 text-emerald-400" />}
                          {r.device === 'desktop' && <Monitor className="w-3 h-3 text-sky-400" />}
                          {r.device === 'tablet' && <Tablet className="w-3 h-3 text-amber-400" />}
                          <span>{r.device}</span>
                        </div>
                      </td>

                      {/* Browser & OS */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div>
                          <span className="text-white font-medium">{r.browser}</span>
                          <span className="text-stone-500 text-[10.5px] block font-mono">{r.os}</span>
                        </div>
                      </td>

                      {/* Visited Page */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="px-2 py-1 rounded bg-white/[0.04] border border-white/[0.06] font-mono text-[11px] text-[#f5d799]">
                          {r.visitedPage}
                        </span>
                      </td>

                      {/* Referrer */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-stone-400 text-[11px]">
                        <span className="truncate max-w-[130px] block" title={r.referrer}>
                          {r.referrer}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-stone-500">
                    কোনো ভিজিটর রেকর্ড খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-stone-400">
          <div>
            <span>পৃষ্ঠা <strong>{currentPage}</strong> এর <strong>{totalPages}</strong> (মোট {filteredRecords.length} টি রেকর্ড)</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] disabled:opacity-40 transition-colors cursor-pointer text-white"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <span className="font-mono px-3 py-1 bg-black rounded-lg border border-white/[0.08] text-white">
              {currentPage} / {totalPages}
            </span>

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
              className="p-2 rounded-xl bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] disabled:opacity-40 transition-colors cursor-pointer text-white"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>

      {/* ========================================================
          5. SUSPICIOUS ACTIVITY SECTION
          ======================================================== */}
      <div className="p-6 rounded-3xl bg-[#080808] border border-amber-500/20 shadow-2xl space-y-4">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <ShieldAlert className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white font-serif flex items-center gap-2">
              <span>Suspicious Activity & Security Monitoring</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold uppercase">
                Monitoring Only
              </span>
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              স্বল্প সময়ে অতিরিক্ত রিকোয়েস্ট পাঠানো বা অস্বাভাবিক ট্রাফিকের আইপি নজরদারি তালিকা।
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#111111] text-stone-400 uppercase font-mono text-[10px] tracking-wider border-b border-white/[0.08]">
              <tr>
                <th className="py-3 px-4">Flagged IP</th>
                <th className="py-3 px-4">Total Hits</th>
                <th className="py-3 px-4">Observed Time Range</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Warning Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] font-medium text-stone-300">
              {suspiciousList.map((item, idx) => (
                <tr key={idx} className="hover:bg-amber-500/[0.02] transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-300">
                    {item.ip}
                  </td>
                  <td className="py-3.5 px-4 font-mono font-bold text-white">
                    <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      {item.count} Requests
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-stone-400 font-mono text-[11px]">
                    {item.timeRange}
                  </td>
                  <td className="py-3.5 px-4 font-mono text-stone-400">
                    {item.lastSeen}
                  </td>
                  <td className="py-3.5 px-4 text-stone-300">
                    {item.location}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="inline-flex items-center gap-1.5 text-amber-300 bg-amber-500/10 border border-amber-500/30 px-2.5 py-1 rounded-full text-[10.5px] font-bold">
                      <AlertTriangle className="w-3 h-3 text-amber-400 shrink-0" />
                      <span>{item.reason}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-3.5 rounded-2xl bg-black border border-white/[0.06] text-[11px] text-stone-400 leading-relaxed">
          <strong className="text-white">নিরাপত্তা নির্দেশনা:</strong> আপনার অনুরোধ অনুযায়ী কোনো IP স্বয়ংক্রিয়ভাবে ব্লক করা হয়নি। এই সেকশনটি শুধুমাত্র সম্ভাব্য ব্রুট-ফোর্স বা স্ক্র্যাপিং পর্যবেক্ষণের জন্য সাজানো হয়েছে।
        </div>
      </div>

    </div>
  );
};

export default VisitorAnalyticsDashboard;
