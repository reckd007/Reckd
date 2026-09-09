import React, { useState } from 'react';
import { Calculator, Plus, Trash2, RotateCcw, Equal, Check } from 'lucide-react';

interface CalculatorToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const CalculatorTools: React.FC<CalculatorToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  // 1. Percentage Calculator
  const [pctVal1, setPctVal1] = useState<number>(15);
  const [pctTotal1, setPctTotal1] = useState<number>(300);
  const pctResult1 = (pctVal1 * pctTotal1) / 100;

  const [pctVal2, setPctVal2] = useState<number>(45);
  const [pctTotal2, setPctTotal2] = useState<number>(200);
  const pctResult2 = pctTotal2 !== 0 ? (pctVal2 / pctTotal2) * 100 : 0;

  const [pctFrom, setPctFrom] = useState<number>(50);
  const [pctTo, setPctTo] = useState<number>(75);
  const pctChange = pctFrom !== 0 ? ((pctTo - pctFrom) / pctFrom) * 100 : 0;

  // 2. Age Calculator
  const [birthDate, setBirthDate] = useState<string>('1998-05-14');
  const calculateAge = () => {
    const birth = new Date(birthDate);
    const now = new Date();
    if (isNaN(birth.getTime())) return null;

    let years = now.getFullYear() - birth.getFullYear();
    let months = now.getMonth() - birth.getMonth();
    let days = now.getDate() - birth.getDate();

    if (days < 0) {
      months--;
      const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prevMonth.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    const diffTime = Math.abs(now.getTime() - birth.getTime());
    const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const totalHours = Math.floor(diffTime / (1000 * 60 * 60));

    // Next birthday
    let nextBday = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());
    if (nextBday < now) {
      nextBday = new Date(now.getFullYear() + 1, birth.getMonth(), birth.getDate());
    }
    const daysUntilNext = Math.ceil((nextBday.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    return { years, months, days, totalDays, totalHours, daysUntilNext };
  };
  const ageData = calculateAge();

  // 3. BMI Calculator
  const [bmiUnit, setBmiUnit] = useState<'metric' | 'imperial'>('metric');
  const [heightCm, setHeightCm] = useState<number>(175);
  const [weightKg, setWeightKg] = useState<number>(70);
  const [heightInches, setHeightInches] = useState<number>(69);
  const [weightLbs, setWeightLbs] = useState<number>(155);

  const calculateBMI = () => {
    let bmi = 0;
    if (bmiUnit === 'metric') {
      const hM = heightCm / 100;
      bmi = hM > 0 ? weightKg / (hM * hM) : 0;
    } else {
      bmi = heightInches > 0 ? (weightLbs * 703) / (heightInches * heightInches) : 0;
    }

    let category = 'Normal';
    let color = 'text-emerald-400';
    if (bmi < 18.5) {
      category = 'Underweight';
      color = 'text-sky-400';
    } else if (bmi < 25) {
      category = 'Normal weight';
      color = 'text-emerald-400';
    } else if (bmi < 30) {
      category = 'Overweight';
      color = 'text-amber-400';
    } else {
      category = 'Obese';
      color = 'text-rose-400';
    }
    return { bmi: parseFloat(bmi.toFixed(1)), category, color };
  };
  const bmiResults = calculateBMI();

  // 4. BMR Calculator
  const [bmrGender, setBmrGender] = useState<'male' | 'female'>('male');
  const [bmrAge, setBmrAge] = useState<number>(28);
  const [bmrHeight, setBmrHeight] = useState<number>(178);
  const [bmrWeight, setBmrWeight] = useState<number>(75);

  // Mifflin-St Jeor:
  // Male: 10*weight(kg) + 6.25*height(cm) - 5*age + 5
  // Female: 10*weight(kg) + 6.25*height(cm) - 5*age - 161
  const bmrScore = Math.round(
    10 * bmrWeight +
      6.25 * bmrHeight -
      5 * bmrAge +
      (bmrGender === 'male' ? 5 : -161)
  );

  // 5. Calorie Calculator
  const [activityFactor, setActivityFactor] = useState<number>(1.375);
  const maintenanceCalories = Math.round(bmrScore * activityFactor);
  const mildLoss = maintenanceCalories - 250;
  const weightLoss = maintenanceCalories - 500;
  const muscleGain = maintenanceCalories + 400;

  // 6. Scientific Calculator
  const [calcDisplay, setCalcDisplay] = useState<string>('0');
  const [calcMemory, setCalcMemory] = useState<string>('');

  const handleCalcInput = (val: string) => {
    if (val === 'C') {
      setCalcDisplay('0');
      setCalcMemory('');
      return;
    }
    if (val === 'DEL') {
      setCalcDisplay((prev) => (prev.length > 1 ? prev.slice(0, -1) : '0'));
      return;
    }
    if (val === '=') {
      try {
        // Safe evaluation
        const sanitized = calcDisplay
          .replace(/×/g, '*')
          .replace(/÷/g, '/')
          .replace(/π/g, 'Math.PI')
          .replace(/e/g, 'Math.E');
        const evalResult = Function(`'use strict'; return (${sanitized})`)();
        setCalcMemory(calcDisplay + ' =');
        setCalcDisplay(String(Number(evalResult.toFixed(8))));
      } catch (err) {
        setCalcDisplay('Error');
      }
      return;
    }
    if (['sin', 'cos', 'tan', 'log', 'ln', 'sqrt'].includes(val)) {
      try {
        const num = parseFloat(calcDisplay);
        let res = 0;
        if (val === 'sin') res = Math.sin((num * Math.PI) / 180);
        if (val === 'cos') res = Math.cos((num * Math.PI) / 180);
        if (val === 'tan') res = Math.tan((num * Math.PI) / 180);
        if (val === 'log') res = Math.log10(num);
        if (val === 'ln') res = Math.log(num);
        if (val === 'sqrt') res = Math.sqrt(num);
        setCalcMemory(`${val}(${num})`);
        setCalcDisplay(String(Number(res.toFixed(8))));
      } catch {
        setCalcDisplay('Error');
      }
      return;
    }

    setCalcDisplay((prev) => (prev === '0' || prev === 'Error' ? val : prev + val));
  };

  // 7. Fraction Calculator
  const [fN1, setFN1] = useState<number>(3);
  const [fD1, setFD1] = useState<number>(4);
  const [fOp, setFOp] = useState<'+' | '-' | '*' | '/'>('+');
  const [fN2, setFN2] = useState<number>(2);
  const [fD2, setFD2] = useState<number>(5);

  const gcd = (a: number, b: number): number => (!b ? a : gcd(b, a % b));

  const calculateFraction = () => {
    let num = 0;
    let den = 1;
    if (fOp === '+') {
      num = fN1 * fD2 + fN2 * fD1;
      den = fD1 * fD2;
    } else if (fOp === '-') {
      num = fN1 * fD2 - fN2 * fD1;
      den = fD1 * fD2;
    } else if (fOp === '*') {
      num = fN1 * fN2;
      den = fD1 * fD2;
    } else if (fOp === '/') {
      num = fN1 * fD2;
      den = fD1 * fN2;
    }

    const divisor = Math.abs(gcd(num, den)) || 1;
    const simpN = num / divisor;
    const simpD = den / divisor;
    const mixedWhole = Math.floor(Math.abs(simpN) / simpD) * (simpN < 0 ? -1 : 1);
    const mixedRem = Math.abs(simpN) % simpD;

    return { simpN, simpD, decimal: num / den, mixedWhole, mixedRem };
  };
  const fracResult = calculateFraction();

  // 8. Average Calculator
  const [avgInput, setAvgInput] = useState<string>('12, 18, 25, 30, 42, 50, 18, 95');
  const calculateAverage = () => {
    const nums = avgInput
      .split(/[\s,]+/)
      .map((n) => parseFloat(n))
      .filter((n) => !isNaN(n));
    if (!nums.length) return null;

    const count = nums.length;
    const sum = nums.reduce((a, b) => a + b, 0);
    const mean = sum / count;

    const sorted = [...nums].sort((a, b) => a - b);
    const median =
      count % 2 === 0
        ? (sorted[count / 2 - 1] + sorted[count / 2]) / 2
        : sorted[Math.floor(count / 2)];

    // Standard deviation
    const variance = nums.reduce((acc, n) => acc + Math.pow(n - mean, 2), 0) / count;
    const stdDev = Math.sqrt(variance);
    const min = sorted[0];
    const max = sorted[count - 1];

    return { count, sum, mean, median, stdDev, min, max, range: max - min };
  };
  const avgData = calculateAverage();

  // 9. Ratio Calculator
  const [ratioA, setRatioA] = useState<number>(4);
  const [ratioB, setRatioB] = useState<number>(10);
  const [ratioC, setRatioC] = useState<number>(16);
  // Solve A : B = C : X -> X = (B * C) / A
  const ratioX = ratioA !== 0 ? (ratioB * ratioC) / ratioA : 0;
  const ratioDivisor = Math.abs(gcd(ratioA, ratioB)) || 1;
  const simplifiedRatio = `${ratioA / ratioDivisor} : ${ratioB / ratioDivisor}`;

  // 10. GPA Calculator
  interface GpaCourse {
    id: string;
    name: string;
    grade: string;
    credits: number;
  }
  const gradePoints: Record<string, number> = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    D: 1.0,
    F: 0.0,
  };

  const [courses, setCourses] = useState<GpaCourse[]>([
    { id: '1', name: 'Computer Science 101', grade: 'A', credits: 4 },
    { id: '2', name: 'Calculus II', grade: 'B+', credits: 4 },
    { id: '3', name: 'Physics Mechanics', grade: 'A-', credits: 3 },
    { id: '4', name: 'Philosophy & Logic', grade: 'A', credits: 3 },
  ]);

  const addCourse = () => {
    setCourses([...courses, { id: Date.now().toString(), name: 'New Course', grade: 'A', credits: 3 }]);
  };

  const removeCourse = (id: string) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const totalQualityPoints = courses.reduce((acc, c) => acc + (gradePoints[c.grade] || 0) * c.credits, 0);
  const calculatedGPA = totalCredits > 0 ? (totalQualityPoints / totalCredits).toFixed(2) : '0.00';

  // 11. Binary Calculator
  const [bin1, setBin1] = useState<string>('1010');
  const [bin2, setBin2] = useState<string>('0101');
  const [binOp, setBinOp] = useState<'+' | '-' | '*' | 'AND' | 'OR' | 'XOR'>('+');

  const calculateBinary = () => {
    const n1 = parseInt(bin1, 2) || 0;
    const n2 = parseInt(bin2, 2) || 0;
    let res = 0;
    if (binOp === '+') res = n1 + n2;
    if (binOp === '-') res = Math.max(0, n1 - n2);
    if (binOp === '*') res = n1 * n2;
    if (binOp === 'AND') res = n1 & n2;
    if (binOp === 'OR') res = n1 | n2;
    if (binOp === 'XOR') res = n1 ^ n2;

    return {
      bin: res.toString(2),
      dec: res,
      hex: res.toString(16).toUpperCase(),
    };
  };
  const binResults = calculateBinary();

  // 12. Tip Calculator
  const [billAmount, setBillAmount] = useState<number>(85.5);
  const [tipPct, setTipPct] = useState<number>(18);
  const [splitCount, setSplitCount] = useState<number>(2);

  const tipTotal = (billAmount * tipPct) / 100;
  const billGrandTotal = billAmount + tipTotal;
  const billPerPerson = splitCount > 0 ? billGrandTotal / splitCount : billGrandTotal;
  const tipPerPerson = splitCount > 0 ? tipTotal / splitCount : tipTotal;

  // 13. Time Duration Calculator
  const [timeStart, setTimeStart] = useState<string>('09:15');
  const [timeEnd, setTimeEnd] = useState<string>('17:45');

  const calculateDuration = () => {
    const [h1, m1] = timeStart.split(':').map(Number);
    const [h2, m2] = timeEnd.split(':').map(Number);
    let mins1 = h1 * 60 + m1;
    let mins2 = h2 * 60 + m2;
    if (mins2 < mins1) mins2 += 24 * 60; // next day
    const diffMins = mins2 - mins1;
    const diffHours = Math.floor(diffMins / 60);
    const remMins = diffMins % 60;
    return { diffHours, remMins, totalMinutes: diffMins };
  };
  const durationData = calculateDuration();

  // 14. Date Difference Calculator
  const [date1, setDate1] = useState<string>('2026-01-01');
  const [date2, setDate2] = useState<string>('2026-12-31');

  const calculateDateDiff = () => {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) return null;

    const diffMs = Math.abs(d2.getTime() - d1.getTime());
    const totalDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(totalDays / 7);
    const remDays = totalDays % 7;
    return { totalDays, weeks, remDays };
  };
  const dateDiffData = calculateDateDiff();

  // 15. Working Days Calculator
  const [workStart, setWorkStart] = useState<string>('2026-09-01');
  const [workEnd, setWorkEnd] = useState<string>('2026-09-30');
  const [holidaysCount, setHolidaysCount] = useState<number>(1);

  const calculateWorkingDays = () => {
    const start = new Date(workStart);
    const end = new Date(workEnd);
    if (isNaN(start.getTime()) || isNaN(end.getTime()) || start > end) return null;

    let current = new Date(start);
    let workingDays = 0;
    let weekendDays = 0;

    while (current <= end) {
      const dayOfWeek = current.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        weekendDays++;
      } else {
        workingDays++;
      }
      current.setDate(current.getDate() + 1);
    }

    const netWorkingDays = Math.max(0, workingDays - holidaysCount);
    const totalCalendarDays = workingDays + weekendDays;
    return { netWorkingDays, workingDays, weekendDays, totalCalendarDays };
  };
  const workDaysData = calculateWorkingDays();

  return (
    <div className="space-y-6">
      {/* 1. PERCENTAGE CALCULATOR */}
      {toolId === 'percentage-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Percentage Multi-Calculator</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/40 space-y-3">
              <span className="text-xs font-semibold text-[#ff6b00]">What is X% of Y?</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pctVal1}
                  onChange={(e) => setPctVal1(Number(e.target.value))}
                  className={`w-20 px-3 py-1.5 rounded-lg border text-sm ${inputBg}`}
                />
                <span className="text-xs">% of</span>
                <input
                  type="number"
                  value={pctTotal1}
                  onChange={(e) => setPctTotal1(Number(e.target.value))}
                  className={`w-24 px-3 py-1.5 rounded-lg border text-sm ${inputBg}`}
                />
              </div>
              <div className="pt-2 text-2xl font-bold font-mono text-emerald-400">= {pctResult1.toFixed(2)}</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/40 space-y-3">
              <span className="text-xs font-semibold text-[#ff6b00]">X is what % of Y?</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pctVal2}
                  onChange={(e) => setPctVal2(Number(e.target.value))}
                  className={`w-20 px-3 py-1.5 rounded-lg border text-sm ${inputBg}`}
                />
                <span className="text-xs">of</span>
                <input
                  type="number"
                  value={pctTotal2}
                  onChange={(e) => setPctTotal2(Number(e.target.value))}
                  className={`w-24 px-3 py-1.5 rounded-lg border text-sm ${inputBg}`}
                />
              </div>
              <div className="pt-2 text-2xl font-bold font-mono text-emerald-400">= {pctResult2.toFixed(1)}%</div>
            </div>

            <div className="p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/40 space-y-3">
              <span className="text-xs font-semibold text-[#ff6b00]">% Change (From X to Y)</span>
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  value={pctFrom}
                  onChange={(e) => setPctFrom(Number(e.target.value))}
                  className={`w-20 px-3 py-1.5 rounded-lg border text-sm ${inputBg}`}
                />
                <span className="text-xs">to</span>
                <input
                  type="number"
                  value={pctTo}
                  onChange={(e) => setPctTo(Number(e.target.value))}
                  className={`w-20 px-3 py-1.5 rounded-lg border text-sm ${inputBg}`}
                />
              </div>
              <div className={`pt-2 text-2xl font-bold font-mono ${pctChange >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                {pctChange >= 0 ? `+${pctChange.toFixed(1)}%` : `${pctChange.toFixed(1)}%`}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. AGE CALCULATOR */}
      {toolId === 'age-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Precision Age & Longevity Counter</h3>
          <div className="max-w-md">
            <label className="text-xs font-medium text-zinc-400">Select Date of Birth</label>
            <input
              type="date"
              value={birthDate}
              onChange={(e) => setBirthDate(e.target.value)}
              className={`w-full mt-1 px-4 py-3 rounded-xl border text-base font-semibold ${inputBg}`}
            />
          </div>

          {ageData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Current Age</span>
                <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">
                  {ageData.years}y {ageData.months}m {ageData.days}d
                </p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Next Birthday In</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{ageData.daysUntilNext} Days</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Total Days Lived</span>
                <p className="text-2xl font-bold font-mono text-white mt-1">{ageData.totalDays.toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Total Hours</span>
                <p className="text-2xl font-bold font-mono text-zinc-300 mt-1">{ageData.totalHours.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. BMI CALCULATOR */}
      {toolId === 'bmi-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Body Mass Index (BMI)</h3>
            <div className="flex gap-2">
              <button
                onClick={() => setBmiUnit('metric')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  bmiUnit === 'metric' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Metric (cm/kg)
              </button>
              <button
                onClick={() => setBmiUnit('imperial')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  bmiUnit === 'imperial' ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Imperial (in/lbs)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {bmiUnit === 'metric' ? (
              <>
                <div>
                  <label className="text-xs font-medium text-zinc-400">Height (cm)</label>
                  <input
                    type="number"
                    value={heightCm}
                    onChange={(e) => setHeightCm(Number(e.target.value))}
                    className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400">Weight (kg)</label>
                  <input
                    type="number"
                    value={weightKg}
                    onChange={(e) => setWeightKg(Number(e.target.value))}
                    className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                  />
                </div>
              </>
            ) : (
              <>
                <div>
                  <label className="text-xs font-medium text-zinc-400">Height (Inches)</label>
                  <input
                    type="number"
                    value={heightInches}
                    onChange={(e) => setHeightInches(Number(e.target.value))}
                    className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium text-zinc-400">Weight (Pounds)</label>
                  <input
                    type="number"
                    value={weightLbs}
                    onChange={(e) => setWeightLbs(Number(e.target.value))}
                    className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
                  />
                </div>
              </>
            )}
          </div>

          <div className="p-5 rounded-xl bg-zinc-800/40 border border-zinc-700/50 mt-6 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-xs text-zinc-400">Your Calculated BMI</span>
              <p className="text-4xl font-black font-mono text-[#ff6b00] mt-1">{bmiResults.bmi}</p>
            </div>
            <div className="text-right">
              <span className="text-xs text-zinc-400">WHO Health Category</span>
              <p className={`text-2xl font-bold mt-1 ${bmiResults.color}`}>{bmiResults.category}</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. BMR & 5. CALORIE CALCULATOR */}
      {(toolId === 'bmr-calculator' || toolId === 'calorie-calculator') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">
            {toolId === 'bmr-calculator' ? 'Basal Metabolic Rate (BMR)' : 'Daily Calorie Needs & Targets'}
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Biological Sex</label>
              <select
                value={bmrGender}
                onChange={(e) => setBmrGender(e.target.value as any)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Age (Years)</label>
              <input
                type="number"
                value={bmrAge}
                onChange={(e) => setBmrAge(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Height (cm)</label>
              <input
                type="number"
                value={bmrHeight}
                onChange={(e) => setBmrHeight(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Weight (kg)</label>
              <input
                type="number"
                value={bmrWeight}
                onChange={(e) => setBmrWeight(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          {toolId === 'calorie-calculator' && (
            <div className="mt-4">
              <label className="text-xs font-medium text-zinc-400">Daily Physical Activity Level</label>
              <select
                value={activityFactor}
                onChange={(e) => setActivityFactor(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              >
                <option value={1.2}>Sedentary (Little or no exercise)</option>
                <option value={1.375}>Light Exercise (1-3 days/week)</option>
                <option value={1.55}>Moderate Exercise (3-5 days/week)</option>
                <option value={1.725}>Heavy Exercise (6-7 days/week)</option>
                <option value={1.9}>Athlete / Physical Job (2x per day)</option>
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">BMR (Mifflin-St Jeor)</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">{bmrScore} kcal</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Maintain Weight</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{maintenanceCalories} kcal</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Weight Loss (-0.5kg/wk)</span>
              <p className="text-2xl font-bold font-mono text-amber-400 mt-1">{weightLoss} kcal</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Muscle Gain (+0.4kg/wk)</span>
              <p className="text-2xl font-bold font-mono text-sky-400 mt-1">{muscleGain} kcal</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. SCIENTIFIC CALCULATOR */}
      {toolId === 'scientific-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg} max-w-lg mx-auto`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-bold font-display">Scientific Calculator</h3>
            <span className="text-xs text-zinc-400 font-mono">DEG</span>
          </div>

          <div className={`p-4 rounded-2xl border text-right mb-4 ${inputBg}`}>
            <div className="text-xs font-mono text-zinc-400 h-5">{calcMemory}</div>
            <div className="text-3xl font-black font-mono text-[#ff6b00] overflow-x-auto">{calcDisplay}</div>
          </div>

          <div className="grid grid-cols-5 gap-2 text-sm font-semibold">
            {['sin', 'cos', 'tan', 'log', 'ln'].map((fn) => (
              <button
                key={fn}
                onClick={() => handleCalcInput(fn)}
                className="py-2.5 rounded-xl bg-zinc-800/80 hover:bg-[#ff6b00]/20 hover:text-[#ff6b00] transition"
              >
                {fn}
              </button>
            ))}
            {['sqrt', '(', ')', '%', 'DEL'].map((op) => (
              <button
                key={op}
                onClick={() => handleCalcInput(op)}
                className="py-2.5 rounded-xl bg-zinc-800/80 hover:bg-[#ff6b00]/20 hover:text-[#ff6b00] transition"
              >
                {op}
              </button>
            ))}
            {['7', '8', '9', '÷', 'C'].map((b) => (
              <button
                key={b}
                onClick={() => handleCalcInput(b === '÷' ? '/' : b)}
                className={`py-3 rounded-xl transition ${
                  b === 'C'
                    ? 'bg-rose-500/20 text-rose-400 hover:bg-rose-500/30'
                    : b === '÷'
                    ? 'bg-[#ff6b00]/20 text-[#ff6b00]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {b}
              </button>
            ))}
            {['4', '5', '6', '×', 'π'].map((b) => (
              <button
                key={b}
                onClick={() => handleCalcInput(b === '×' ? '*' : b)}
                className={`py-3 rounded-xl transition ${
                  b === '×' ? 'bg-[#ff6b00]/20 text-[#ff6b00]' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {b}
              </button>
            ))}
            {['1', '2', '3', '-', 'e'].map((b) => (
              <button
                key={b}
                onClick={() => handleCalcInput(b)}
                className={`py-3 rounded-xl transition ${
                  b === '-' ? 'bg-[#ff6b00]/20 text-[#ff6b00]' : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {b}
              </button>
            ))}
            {['0', '.', '+', '='].map((b) => (
              <button
                key={b}
                onClick={() => handleCalcInput(b)}
                className={`py-3 rounded-xl transition ${
                  b === '='
                    ? 'col-span-2 bg-[#ff6b00] text-white hover:bg-[#e05e00] shadow-lg shadow-[#ff6b00]/20'
                    : b === '+'
                    ? 'bg-[#ff6b00]/20 text-[#ff6b00]'
                    : 'bg-zinc-800 hover:bg-zinc-700 text-white'
                }`}
              >
                {b}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* 7. FRACTION CALCULATOR */}
      {toolId === 'fraction-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Fraction Simplifier & Arithmetic</h3>
          <div className="flex flex-wrap items-center justify-center gap-4 py-4">
            {/* Fraction 1 */}
            <div className="flex flex-col w-20">
              <input
                type="number"
                value={fN1}
                onChange={(e) => setFN1(Number(e.target.value))}
                className={`px-2 py-1.5 rounded-t-lg border text-center font-bold ${inputBg}`}
              />
              <div className="h-0.5 bg-[#ff6b00] my-0.5" />
              <input
                type="number"
                value={fD1}
                onChange={(e) => setFD1(Number(e.target.value) || 1)}
                className={`px-2 py-1.5 rounded-b-lg border text-center font-bold ${inputBg}`}
              />
            </div>

            {/* Operator */}
            <select
              value={fOp}
              onChange={(e) => setFOp(e.target.value as any)}
              className={`px-3 py-2 rounded-xl border text-lg font-bold ${inputBg}`}
            >
              <option value="+">+</option>
              <option value="-">−</option>
              <option value="*">×</option>
              <option value="/">÷</option>
            </select>

            {/* Fraction 2 */}
            <div className="flex flex-col w-20">
              <input
                type="number"
                value={fN2}
                onChange={(e) => setFN2(Number(e.target.value))}
                className={`px-2 py-1.5 rounded-t-lg border text-center font-bold ${inputBg}`}
              />
              <div className="h-0.5 bg-[#ff6b00] my-0.5" />
              <input
                type="number"
                value={fD2}
                onChange={(e) => setFD2(Number(e.target.value) || 1)}
                className={`px-2 py-1.5 rounded-b-lg border text-center font-bold ${inputBg}`}
              />
            </div>

            <Equal className="w-6 h-6 text-zinc-400" />

            {/* Result */}
            <div className="p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/60 text-center min-w-[140px]">
              <span className="text-xs text-zinc-400">Simplified Fraction</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00]">
                {fracResult.simpN} / {fracResult.simpD}
              </p>
              <span className="text-xs text-zinc-400 mt-1 block">
                Decimal: {fracResult.decimal.toFixed(4)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* 8. AVERAGE CALCULATOR */}
      {toolId === 'average-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Statistical Average & Distribution</h3>
          <div>
            <label className="text-xs font-medium text-zinc-400">Input Data Set (Separated by commas or spaces)</label>
            <textarea
              rows={3}
              value={avgInput}
              onChange={(e) => setAvgInput(e.target.value)}
              className={`w-full mt-1 p-3 rounded-xl border font-mono text-sm ${inputBg}`}
            />
          </div>

          {avgData && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Mean (Average)</span>
                <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">{avgData.mean.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Median</span>
                <p className="text-2xl font-bold font-mono text-white mt-1">{avgData.median.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Std Deviation (σ)</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{avgData.stdDev.toFixed(2)}</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Sum (Count: {avgData.count})</span>
                <p className="text-2xl font-bold font-mono text-zinc-300 mt-1">{avgData.sum.toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 9. RATIO CALCULATOR */}
      {toolId === 'ratio-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Ratio Proportion Solver (A : B = C : X)</h3>
          <div className="flex flex-wrap items-center justify-center gap-3 py-4 text-xl font-bold font-mono">
            <input
              type="number"
              value={ratioA}
              onChange={(e) => setRatioA(Number(e.target.value))}
              className={`w-20 px-3 py-2 rounded-xl border text-center ${inputBg}`}
            />
            <span>:</span>
            <input
              type="number"
              value={ratioB}
              onChange={(e) => setRatioB(Number(e.target.value))}
              className={`w-20 px-3 py-2 rounded-xl border text-center ${inputBg}`}
            />
            <span className="text-[#ff6b00] px-2">=</span>
            <input
              type="number"
              value={ratioC}
              onChange={(e) => setRatioC(Number(e.target.value))}
              className={`w-20 px-3 py-2 rounded-xl border text-center ${inputBg}`}
            />
            <span>:</span>
            <div className="w-24 px-3 py-2 rounded-xl border border-[#ff6b00] bg-[#ff6b00]/10 text-center text-[#ff6b00]">
              {ratioX.toFixed(2)}
            </div>
          </div>

          <div className="mt-4 p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50 text-xs text-zinc-300 flex justify-between">
            <span>Simplified Ratio: <strong className="text-white font-mono">{simplifiedRatio}</strong></span>
            <span>Scaling Factor: <strong className="text-[#ff6b00] font-mono">{(ratioC / (ratioA || 1)).toFixed(2)}x</strong></span>
          </div>
        </div>
      )}

      {/* 10. GPA CALCULATOR */}
      {toolId === 'gpa-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Grade Point Average (GPA)</h3>
            <div className="text-right">
              <span className="text-xs text-zinc-400">Cumulative GPA</span>
              <p className="text-3xl font-black font-mono text-[#ff6b00]">{calculatedGPA}</p>
            </div>
          </div>

          <div className="space-y-2">
            {courses.map((c) => (
              <div key={c.id} className="flex items-center gap-3">
                <input
                  type="text"
                  value={c.name}
                  onChange={(e) =>
                    setCourses(courses.map((item) => (item.id === c.id ? { ...item, name: e.target.value } : item)))
                  }
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                />
                <select
                  value={c.grade}
                  onChange={(e) =>
                    setCourses(courses.map((item) => (item.id === c.id ? { ...item, grade: e.target.value } : item)))
                  }
                  className={`w-20 px-2 py-2 rounded-xl border text-xs font-bold ${inputBg}`}
                >
                  {Object.keys(gradePoints).map((g) => (
                    <option key={g} value={g}>{g}</option>
                  ))}
                </select>
                <input
                  type="number"
                  value={c.credits}
                  onChange={(e) =>
                    setCourses(
                      courses.map((item) => (item.id === c.id ? { ...item, credits: Number(e.target.value) } : item))
                    )
                  }
                  className={`w-16 px-2 py-2 rounded-xl border text-xs text-center ${inputBg}`}
                />
                <button
                  onClick={() => removeCourse(c.id)}
                  className="p-2 text-rose-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addCourse}
              className="flex items-center gap-1.5 text-xs text-[#ff6b00] font-semibold mt-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add Course
            </button>
          </div>
        </div>
      )}

      {/* 11. BINARY CALCULATOR */}
      {toolId === 'binary-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Binary & Bitwise Operations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Binary 1</label>
              <input
                type="text"
                value={bin1}
                onChange={(e) => setBin1(e.target.value.replace(/[^01]/g, ''))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border font-mono text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Bitwise Operator</label>
              <select
                value={binOp}
                onChange={(e) => setBinOp(e.target.value as any)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-bold ${inputBg}`}
              >
                <option value="+">ADD (+)</option>
                <option value="-">SUB (−)</option>
                <option value="*">MUL (×)</option>
                <option value="AND">Bitwise AND (&)</option>
                <option value="OR">Bitwise OR (|)</option>
                <option value="XOR">Bitwise XOR (^)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Binary 2</label>
              <input
                type="text"
                value={bin2}
                onChange={(e) => setBin2(e.target.value.replace(/[^01]/g, ''))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border font-mono text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Binary Result</span>
              <p className="text-xl font-bold font-mono text-[#ff6b00] mt-1">{binResults.bin}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Decimal (Base 10)</span>
              <p className="text-xl font-bold font-mono text-white mt-1">{binResults.dec}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Hexadecimal (0x)</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">0x{binResults.hex}</p>
            </div>
          </div>
        </div>
      )}

      {/* 12. TIP CALCULATOR */}
      {toolId === 'tip-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Tip & Bill Splitter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Bill Subtotal ($)</label>
              <input
                type="number"
                value={billAmount}
                onChange={(e) => setBillAmount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Tip Percentage (%)</label>
              <div className="flex gap-1.5 mt-1">
                {[15, 18, 20, 25].map((p) => (
                  <button
                    key={p}
                    onClick={() => setTipPct(p)}
                    className={`flex-1 py-2 rounded-lg text-xs font-bold border ${
                      tipPct === p ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Split Between People</label>
              <input
                type="number"
                min="1"
                value={splitCount}
                onChange={(e) => setSplitCount(Math.max(1, Number(e.target.value)))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Tip Per Person</span>
              <p className="text-xl font-bold font-mono text-[#ff6b00] mt-1">${tipPerPerson.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Per Person</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${billPerPerson.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Grand Total (Full Bill)</span>
              <p className="text-xl font-bold font-mono text-white mt-1">${billGrandTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 13. TIME DURATION */}
      {toolId === 'time-duration-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Time Duration Calculator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Start Time</label>
              <input
                type="time"
                value={timeStart}
                onChange={(e) => setTimeStart(e.target.value)}
                className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm font-semibold ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">End Time</label>
              <input
                type="time"
                value={timeEnd}
                onChange={(e) => setTimeEnd(e.target.value)}
                className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm font-semibold ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Elapsed Time</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">
                {durationData.diffHours} Hours {durationData.remMins} Minutes
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Minutes</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{durationData.totalMinutes} Mins</p>
            </div>
          </div>
        </div>
      )}

      {/* 14. DATE DIFFERENCE */}
      {toolId === 'date-difference-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Date Difference Span</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Start Date</label>
              <input
                type="date"
                value={date1}
                onChange={(e) => setDate1(e.target.value)}
                className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm font-semibold ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">End Date</label>
              <input
                type="date"
                value={date2}
                onChange={(e) => setDate2(e.target.value)}
                className={`w-full mt-1 px-4 py-3 rounded-xl border text-sm font-semibold ${inputBg}`}
              />
            </div>
          </div>

          {dateDiffData && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Total Days</span>
                <p className="text-3xl font-bold font-mono text-[#ff6b00] mt-1">{dateDiffData.totalDays} Days</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Weeks + Days</span>
                <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">
                  {dateDiffData.weeks} Weeks and {dateDiffData.remDays} Days
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 15. WORKING DAYS */}
      {toolId === 'working-days-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Working & Business Days</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Start Date</label>
              <input
                type="date"
                value={workStart}
                onChange={(e) => setWorkStart(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-semibold ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">End Date</label>
              <input
                type="date"
                value={workEnd}
                onChange={(e) => setWorkEnd(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm font-semibold ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Public Holidays Count</label>
              <input
                type="number"
                value={holidaysCount}
                onChange={(e) => setHolidaysCount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          {workDaysData && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Net Working Days</span>
                <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">{workDaysData.netWorkingDays} Days</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Weekend Days (Sat/Sun)</span>
                <p className="text-xl font-bold font-mono text-[#ff6b00] mt-1">{workDaysData.weekendDays} Days</p>
              </div>
              <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                <span className="text-xs text-zinc-400">Total Calendar Span</span>
                <p className="text-xl font-bold font-mono text-white mt-1">{workDaysData.totalCalendarDays} Days</p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
