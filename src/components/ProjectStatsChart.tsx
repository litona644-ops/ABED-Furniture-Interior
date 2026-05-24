import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'motion/react';
import { CheckCircle2, Clock, Trophy, ChevronRight, BarChart3, Star, ShieldCheck } from 'lucide-react';

interface ProjectStatsChartProps {
  successTarget?: number;
  pendingTarget?: number;
}

export default function ProjectStatsChart({ successTarget = 800, pendingTarget = 7 }: ProjectStatsChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  // once: false ensures that scroll leaving and entering triggers drawing again as requested
  const isInView = useInView(containerRef, { amount: 0.25, once: false });

  const [successCount, setSuccessCount] = useState(0);
  const [pendingCount, setPendingCount] = useState(0);

  // Hover states for the pie chart segments
  const [hoveredSegment, setHoveredSegment] = useState<'success' | 'pending' | null>(null);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const chartOuterRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (chartOuterRef.current) {
      const rect = chartOuterRef.current.getBoundingClientRect();
      setTooltipPos({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top - 12,
      });
    }
  };

  useEffect(() => {
    if (isInView) {
      // Counter animation
      let startS = 0;
      const endS = successTarget;
      const durationS = 1500; // ms
      const stepTimeS = Math.max(Math.floor(durationS / (endS || 1)), 2);
      
      const timerS = setInterval(() => {
        const step = Math.max(1, Math.ceil(endS / 60));
        startS += step;
        if (startS >= endS) {
          setSuccessCount(endS);
          clearInterval(timerS);
        } else {
          setSuccessCount(startS);
        }
      }, stepTimeS);

      let startP = 0;
      const endP = pendingTarget;
      const durationP = 1200; // ms
      const stepTimeP = Math.max(Math.floor(durationP / (endP || 1)), 40);

      const timerP = setInterval(() => {
        const step = Math.max(1, Math.ceil(endP / 10));
        startP += step;
        if (startP >= endP) {
          setPendingCount(endP);
          clearInterval(timerP);
        } else {
          setPendingCount(startP);
        }
      }, stepTimeP);

      return () => {
        clearInterval(timerS);
        clearInterval(timerP);
      };
    } else {
      // Reset count when not in view, as explicitly requested: "When the viewer goes back, the pie charts are off"
      setSuccessCount(0);
      setPendingCount(0);
    }
  }, [isInView, successTarget, pendingTarget]);

  // SVG circular calculations
  // Radius: 75, Circumference: 2 * Math.PI * 75 = ~471.24
  const strokeCircumference = 471.24;
  
  // Ratios out of total projects
  const total = successTarget + pendingTarget;
  const successPct = total > 0 ? successTarget / total : 0;
  const pendingPct = total > 0 ? pendingTarget / total : 0;

  // Let's allocate segments with a dynamic percentage calculation
  // But to preserve aesthetic contrast, let's make pending projects physically legible on the pie chart! 
  // If it's too pixel-thin, we won't see it nicely. We'll set a visual minimum of 6% arc for pending if indeed > 0.
  const visualPendingPct = pendingTarget > 0 ? Math.max(0.06, pendingPct) : 0;
  const visualSuccessPct = 1 - visualPendingPct;

  // Animated path calculation
  const successCircumferenceFraction = strokeCircumference * visualSuccessPct;
  const pendingCircumferenceFraction = strokeCircumference * visualPendingPct;

  // Calculate rotation angle (degree to start pending slice at)
  const rotationAngle = visualSuccessPct * 360;

  // Dashoffset calculation
  // strokeDashoffset is 0 when fully complete
  return (
    <div 
      id="projects" 
      ref={containerRef} 
      className="py-16 md:py-24 bg-gradient-to-b from-white to-[#faf9f4] px-4 md:px-8 border-b border-gray-100"
    >
      <div className="max-w-7xl mx-auto">
        
        {/* Elegant Section Title */}
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#d4a762] uppercase tracking-widest font-outfit">Our Handover Progress</span>
          <h3 className="text-3xl md:text-4xl font-extrabold tracking-tight text-[#2c1d07] mt-1.5 mb-3 font-serif uppercase">
            Our Projects & Status
          </h3>
          <div className="w-16 h-1 bg-[#d4a762] mx-auto rounded-full" />
          <p className="text-xs md:text-sm text-stone-500 font-medium tracking-wide mt-3.5 font-sans">
            অভিজ্ঞ কারিগরি দক্ষতা ও নিখুঁত ফিনিশিংয়ের মাধ্যমে সম্পন্ন হওয়া প্রজেক্ট পরিসংখ্যান
          </p>
        </div>

        {/* Dashboard Grid Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center mt-6">
          
          {/* LEFT: Premium Custom Interactive SVG Pie / Donut Chart */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center bg-white p-8 rounded-3xl border border-[#d4a762]/15 shadow-md relative min-h-[360px] overflow-hidden">
            
            {/* Subtle premium background vectors */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#faf7f0] rounded-full blur-3xl -z-10" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#fdf5eb] rounded-full blur-3xl -z-10" />

            <div 
              ref={chartOuterRef}
              onMouseMove={handleMouseMove}
              className="relative w-64 h-64 flex items-center justify-center rounded-full bg-white p-2 shadow-[0_0_35px_rgba(212,167,98,0.18)] border border-stone-50 select-none"
            >
              
              {/* Complex Circular Vector Visualizer with dynamic neon glow */}
              <svg className="w-full h-full -rotate-90 transform drop-shadow-[0_0_12px_rgba(16,185,129,0.12)]" viewBox="0 0 200 200">
                {/* Background Track circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="75"
                  className="stroke-stone-100 fill-transparent"
                  strokeWidth="16"
                />

                {/* SUCCESSFUL SEGMENT (Green) */}
                {isInView && (
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="75"
                    className="stroke-[#10b981] fill-transparent drop-shadow-[0_0_8px_rgba(16,185,129,0.35)] cursor-pointer transition-all duration-300"
                    strokeWidth={hoveredSegment === 'success' ? 24 : 16}
                    strokeLinecap="round"
                    strokeDasharray={strokeCircumference}
                    initial={{ strokeDashoffset: strokeCircumference }}
                    animate={{ strokeDashoffset: strokeCircumference - successCircumferenceFraction }}
                    style={{
                      opacity: hoveredSegment === null || hoveredSegment === 'success' ? 1 : 0.4,
                    }}
                    onMouseEnter={() => setHoveredSegment('success')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}

                {/* PENDING SEGMENT (Gray) */}
                {isInView && (
                  <motion.circle
                    cx="100"
                    cy="100"
                    r="75"
                    className="stroke-stone-400 fill-transparent drop-shadow-[0_0_5px_rgba(156,163,175,0.25)] cursor-pointer transition-all duration-300"
                    strokeWidth={hoveredSegment === 'pending' ? 24 : 16}
                    strokeLinecap="round"
                    strokeDasharray={strokeCircumference}
                    // Offset pending segment so it starts right at the gap after successful segment
                    initial={{ strokeDashoffset: strokeCircumference }}
                    animate={{ strokeDashoffset: strokeCircumference - pendingCircumferenceFraction }}
                    style={{ 
                      strokeDashoffset: strokeCircumference - pendingCircumferenceFraction,
                      opacity: hoveredSegment === null || hoveredSegment === 'pending' ? 1 : 0.4,
                    }}
                    onMouseEnter={() => setHoveredSegment('pending')}
                    onMouseLeave={() => setHoveredSegment(null)}
                    // Transform to start exactly where the green arc ends (success covers ~94%, which is ~338 degrees)
                    transform={`rotate(${rotationAngle} 100 100)`}
                    transition={{ duration: 1.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  />
                )}
              </svg>

              {/* Inside the chart: Golden details & BOTH Counters automatically displayed inside the pie chart */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
                <Trophy className="w-4.5 h-4.5 text-[#d4a762] mb-1 animate-pulse" />
                <div className="flex flex-col justify-center items-center gap-0.5">
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-2xl font-black font-outfit text-[#10b981] tracking-tight">
                      {successCount}+
                    </span>
                    <span className="text-[8.5px] font-black text-emerald-600 uppercase tracking-wider font-outfit">
                      Successful
                    </span>
                  </div>
                  
                  <div className="w-14 h-[1.5px] bg-stone-200/90 my-1" />
                  
                  <div className="flex flex-col items-center leading-none">
                    <span className="text-xl font-extrabold font-outfit text-stone-500 tracking-tight">
                      {pendingCount}
                    </span>
                    <span className="text-[8.5px] font-bold text-stone-400 uppercase tracking-wider font-outfit">
                      Pending
                    </span>
                  </div>
                </div>
              </div>

              {/* Interactive Hover Segment Tooltip */}
              <AnimatePresence>
                {hoveredSegment && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: -4 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    style={{
                      position: 'absolute',
                      left: `${tooltipPos.x}px`,
                      top: `${tooltipPos.y}px`,
                      transform: 'translate(-50%, -100%)',
                      pointerEvents: 'none',
                    }}
                    className="z-50 bg-[#1c1202] text-[#fffdec] px-3.5 py-2.5 rounded-xl shadow-2xl border border-[#d4a762]/45 flex items-center gap-2 text-[11px] font-sans font-bold whitespace-nowrap min-w-max backdrop-blur-md"
                  >
                    <span className={`w-2 h-2 rounded-full ${hoveredSegment === 'success' ? 'bg-[#10b981] shadow-[0_0_10px_#10b981]' : 'bg-amber-500 shadow-[0_0_10px_#f59e0b]'}`} />
                    <span className="font-outfit uppercase tracking-widest text-[9px] text-[#fdbf5e] font-extrabold">
                      {hoveredSegment === 'success' 
                        ? `Handover: ${successTarget} Completed` 
                        : `In Production: ${pendingTarget} Units`}
                    </span>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>

            {/* Quick legend directly placed under the representation */}
            <div className="flex gap-6 mt-6 justify-center">
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-[#10b981] rounded-full inline-block shadow-sm" />
                <span className="text-xs font-bold text-stone-700 font-outfit">Successful ({successCount}+)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 bg-stone-400 rounded-full inline-block shadow-sm" />
                <span className="text-xs font-bold text-stone-600 font-outfit">Pending ({pendingCount})</span>
              </div>
            </div>

          </div>

          {/* RIGHT: Sophisticated Bio & Technical Detail Cards */}
          <div className="lg:col-span-7 flex flex-col gap-5 justify-center">
            
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:border-[#d4a762]/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#10b981] flex items-center justify-center shrink-0 shadow-xs border border-emerald-100">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-[#2c1d07] font-sans">সফল প্রজেক্ট ডেলিভারি (Successful Handover)</h4>
                    <span className="text-xs font-black font-outfit bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full">{(successPct * 100).toFixed(1)}% Ratio</span>
                  </div>
                  <p className="text-xs md:text-sm text-stone-500 font-sans mt-1">
                    গত ১৫ বছরে দেশের বিভিন্ন প্রান্তে {successTarget}-এরও বেশি রাজকীয় ও আধুনিক কাঠের ফার্নিচার এবং ইন্টেরিয়র প্রজেক্ট ১০০% সন্তুষ্টির সাথে সময়মত সম্পন্ন করা হয়েছে।
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-2xl shadow-sm border border-stone-100 hover:border-[#d4a762]/30 transition-all duration-300">
              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                <div className="w-12 h-12 rounded-xl bg-stone-50 text-stone-500 flex items-center justify-center shrink-0 shadow-xs border border-stone-200">
                  <Clock className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-bold text-stone-700 font-sans">চলমান প্রজেক্ট (Pending/Active Work)</h4>
                    <span className="text-xs font-black font-outfit bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full">{pendingTarget} Active Projects</span>
                  </div>
                  <p className="text-xs md:text-sm text-stone-500 font-sans mt-1">
                    বর্তমানে মোট {pendingTarget}টি মেগা রাজকীয় কাঠ খোদাই এবং প্রিমিয়াম হোম ডিজাইন প্রজেক্ট আমাদের কারখানায় অত্যন্ত যত্নশীলভাবে নির্মিত হচ্ছে।
                  </p>
                </div>
              </div>
            </div>

            {/* Extra Quality Counter-Statement */}
            <div className="bg-gradient-to-r from-[#1c1202] to-[#2d1e05] text-[#fffdec] p-6 rounded-2xl shadow-md border border-[#d4a762]/20 relative overflow-hidden">
              <div className="absolute top-2 right-2 opacity-5">
                <BarChart3 className="w-32 h-32 text-white" />
              </div>
              <div className="flex items-center gap-3 mb-2">
                <ShieldCheck className="w-5 h-5 text-[#fdbf5e]" />
                <span className="text-xs font-extrabold text-[#fdbf5e] tracking-widest uppercase font-outfit">Superior Standard Certified</span>
              </div>
              <p className="text-xs sm:text-sm leading-relaxed text-stone-200 font-sans">
                আমাদের প্রতিটি প্রজেক্ট সম্পন্ন করার আগে গুণগত মানের ট্রিপল-লেয়ার চেকিং করা হয়। ক্লায়েন্টদের পূর্ণ সন্তুষ্টি নির্ধারণ করেই প্রতিটি অর্ডার সফলভাবে বুঝিয়ে দেওয়া আমাদের মূল লক্ষ্য।
              </p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
