import React, { useState, useEffect } from 'react';
import { RefreshCw, ArrowRightLeft, DollarSign, Download, Plus, Trash2, Printer } from 'lucide-react';
import { jsPDF } from 'jspdf';

interface FinanceToolProps {
  toolId: string;
  theme: 'dark' | 'light';
}

// Fallback rates if API is momentarily unreachable
const FALLBACK_RATES: Record<string, number> = {
  USD: 1.0,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 154.2,
  CAD: 1.36,
  AUD: 1.52,
  CHF: 0.91,
  CNY: 7.24,
  INR: 83.5,
  SGD: 1.35,
  AED: 3.67,
  HKD: 7.82,
  NZD: 1.66,
  KRW: 1375.0,
  BRL: 5.15,
  MXN: 16.9,
};

export const FinanceTools: React.FC<FinanceToolProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  // --- 1. Currency Converter State ---
  const [rates, setRates] = useState<Record<string, number>>(FALLBACK_RATES);
  const [baseCurrency, setBaseCurrency] = useState<string>('USD');
  const [targetCurrency, setTargetCurrency] = useState<string>('EUR');
  const [amount, setAmount] = useState<number>(100);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [nextRefreshSec, setNextRefreshSec] = useState<number>(60);
  const [isFetchingRates, setIsFetchingRates] = useState<boolean>(false);

  const fetchRates = async () => {
    setIsFetchingRates(true);
    try {
      const res = await fetch('https://open.er-api.com/v6/latest/USD');
      if (res.ok) {
        const data = await res.json();
        if (data.rates) {
          setRates(data.rates);
          setLastUpdated(new Date());
          setNextRefreshSec(60);
        }
      }
    } catch (e) {
      console.warn('Using offline fallback rates:', e);
    } finally {
      setIsFetchingRates(false);
    }
  };

  useEffect(() => {
    if (toolId === 'currency-converter') {
      fetchRates();
      const interval = setInterval(() => {
        setNextRefreshSec((prev) => {
          if (prev <= 1) {
            fetchRates();
            return 60;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [toolId]);

  // Convert
  const baseRate = rates[baseCurrency] || 1;
  const targetRate = rates[targetCurrency] || 1;
  const convertedAmount = (amount / baseRate) * targetRate;
  const unitRate = targetRate / baseRate;

  // --- 2. EMI Calculator State ---
  const [emiPrincipal, setEmiPrincipal] = useState<number>(50000);
  const [emiRate, setEmiRate] = useState<number>(8.5);
  const [emiTenureYears, setEmiTenureYears] = useState<number>(5);

  const calculateEMI = () => {
    const r = emiRate / 12 / 100;
    const n = emiTenureYears * 12;
    if (r === 0) return { emi: emiPrincipal / n, totalInterest: 0, totalPayment: emiPrincipal };
    const emi = (emiPrincipal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const totalPayment = emi * n;
    const totalInterest = totalPayment - emiPrincipal;
    return { emi, totalInterest, totalPayment };
  };
  const emiResults = calculateEMI();

  // --- 3. Loan Calculator ---
  const [loanAmount, setLoanAmount] = useState<number>(25000);
  const [loanRate, setLoanRate] = useState<number>(7.2);
  const [loanMonths, setLoanMonths] = useState<number>(36);
  const [extraPayment, setExtraPayment] = useState<number>(50);

  const calculateLoan = () => {
    const r = loanRate / 12 / 100;
    const standardMonthly = (loanAmount * r * Math.pow(1 + r, loanMonths)) / (Math.pow(1 + r, loanMonths) - 1);
    const standardTotal = standardMonthly * loanMonths;
    const standardInterest = standardTotal - loanAmount;

    // With extra payment
    let balance = loanAmount;
    let actualMonths = 0;
    let actualInterest = 0;
    const totalMonthly = standardMonthly + extraPayment;

    while (balance > 0 && actualMonths < 600) {
      const interestForMonth = balance * r;
      actualInterest += interestForMonth;
      const principalPaid = totalMonthly - interestForMonth;
      balance -= principalPaid;
      actualMonths++;
    }

    const interestSaved = Math.max(0, standardInterest - actualInterest);
    const monthsSaved = Math.max(0, loanMonths - actualMonths);
    return { standardMonthly, standardInterest, actualMonths, interestSaved, monthsSaved };
  };
  const loanResults = calculateLoan();

  // --- 4. Mortgage Calculator ---
  const [homePrice, setHomePrice] = useState<number>(400000);
  const [downPaymentPct, setDownPaymentPct] = useState<number>(20);
  const [mortgageRate, setMortgageRate] = useState<number>(6.5);
  const [mortgageYears, setMortgageYears] = useState<number>(30);
  const [propertyTaxAnnual, setPropertyTaxAnnual] = useState<number>(4800);
  const [insuranceAnnual, setInsuranceAnnual] = useState<number>(1400);

  const calculateMortgage = () => {
    const loan = homePrice * (1 - downPaymentPct / 100);
    const r = mortgageRate / 12 / 100;
    const n = mortgageYears * 12;
    const pi = (loan * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    const taxMonthly = propertyTaxAnnual / 12;
    const insMonthly = insuranceAnnual / 12;
    const totalMonthly = pi + taxMonthly + insMonthly;
    return { loan, pi, taxMonthly, insMonthly, totalMonthly };
  };
  const mortgageResults = calculateMortgage();

  // --- 5. Compound Interest ---
  const [ciPrincipal, setCiPrincipal] = useState<number>(10000);
  const [ciMonthlyContrib, setCiMonthlyContrib] = useState<number>(300);
  const [ciRate, setCiRate] = useState<number>(8);
  const [ciYears, setCiYears] = useState<number>(10);
  const [ciFreq, setCiFreq] = useState<number>(12); // monthly

  const calculateCI = () => {
    const r = ciRate / 100;
    const n = ciFreq;
    const t = ciYears;
    // FV = P*(1+r/n)^(nt) + PMT * [((1+r/n)^(nt) - 1) / (r/n)] (if monthly)
    const futureValPrincipal = ciPrincipal * Math.pow(1 + r / n, n * t);
    const ratePerPeriod = r / 12;
    const periods = t * 12;
    const futureValContrib =
      ratePerPeriod > 0
        ? ciMonthlyContrib * ((Math.pow(1 + ratePerPeriod, periods) - 1) / ratePerPeriod)
        : ciMonthlyContrib * periods;
    const totalFV = futureValPrincipal + futureValContrib;
    const totalInvested = ciPrincipal + ciMonthlyContrib * periods;
    const totalInterest = Math.max(0, totalFV - totalInvested);
    return { totalFV, totalInvested, totalInterest };
  };
  const ciResults = calculateCI();

  // --- 6. Simple Interest ---
  const [siPrincipal, setSiPrincipal] = useState<number>(5000);
  const [siRate, setSiRate] = useState<number>(5.5);
  const [siTime, setSiTime] = useState<number>(3);
  const siInterest = (siPrincipal * siRate * siTime) / 100;
  const siTotal = siPrincipal + siInterest;

  // --- 7. GST Calculator ---
  const [gstAmount, setGstAmount] = useState<number>(1000);
  const [gstRate, setGstRate] = useState<number>(18);
  const [gstType, setGstType] = useState<'exclusive' | 'inclusive'>('exclusive');

  const gstValue =
    gstType === 'exclusive'
      ? (gstAmount * gstRate) / 100
      : gstAmount - gstAmount / (1 + gstRate / 100);
  const gstFinalTotal = gstType === 'exclusive' ? gstAmount + gstValue : gstAmount;
  const gstNetBefore = gstType === 'exclusive' ? gstAmount : gstAmount - gstValue;

  // --- 8. VAT Calculator ---
  const [vatAmount, setVatAmount] = useState<number>(250);
  const [vatRate, setVatRate] = useState<number>(20);
  const [vatMode, setVatMode] = useState<'add' | 'remove'>('add');
  const vatCalculated =
    vatMode === 'add'
      ? (vatAmount * vatRate) / 100
      : vatAmount - vatAmount / (1 + vatRate / 100);
  const vatGross = vatMode === 'add' ? vatAmount + vatCalculated : vatAmount;

  // --- 9. Sales Tax ---
  const [salesSubtotal, setSalesSubtotal] = useState<number>(150);
  const [stateTaxRate, setStateTaxRate] = useState<number>(6.5);
  const [localTaxRate, setLocalTaxRate] = useState<number>(2.0);
  const totalSalesTaxRate = stateTaxRate + localTaxRate;
  const salesTaxValue = (salesSubtotal * totalSalesTaxRate) / 100;
  const salesTaxTotal = salesSubtotal + salesTaxValue;

  // --- 10. Discount Calculator ---
  const [originalPrice, setOriginalPrice] = useState<number>(120);
  const [discountPercent, setDiscountPercent] = useState<number>(25);
  const [additionalDiscount, setAdditionalDiscount] = useState<number>(10);
  const firstDiscount = (originalPrice * discountPercent) / 100;
  const priceAfterFirst = originalPrice - firstDiscount;
  const secondDiscount = (priceAfterFirst * additionalDiscount) / 100;
  const finalDiscountPrice = priceAfterFirst - secondDiscount;
  const totalDiscountSavings = originalPrice - finalDiscountPrice;

  // --- 11. Profit Margin Calculator ---
  const [costPrice, setCostPrice] = useState<number>(45);
  const [sellingPrice, setSellingPrice] = useState<number>(85);
  const grossProfit = sellingPrice - costPrice;
  const profitMarginPct = sellingPrice > 0 ? (grossProfit / sellingPrice) * 100 : 0;
  const markupPct = costPrice > 0 ? (grossProfit / costPrice) * 100 : 0;

  // --- 12. ROI Calculator ---
  const [roiInvested, setRoiInvested] = useState<number>(10000);
  const [roiReturned, setRoiReturned] = useState<number>(14500);
  const [roiYears, setRoiYears] = useState<number>(3);
  const netProfitROI = roiReturned - roiInvested;
  const totalROI = roiInvested > 0 ? (netProfitROI / roiInvested) * 100 : 0;
  const annualizedROI =
    roiYears > 0 && roiInvested > 0
      ? (Math.pow(roiReturned / roiInvested, 1 / roiYears) - 1) * 100
      : 0;

  // --- 13. Break-Even Calculator ---
  const [fixedCosts, setFixedCosts] = useState<number>(15000);
  const [varCostPerUnit, setVarCostPerUnit] = useState<number>(12);
  const [pricePerUnit, setPricePerUnit] = useState<number>(30);
  const contributionMargin = pricePerUnit - varCostPerUnit;
  const breakEvenUnits = contributionMargin > 0 ? Math.ceil(fixedCosts / contributionMargin) : 0;
  const breakEvenRevenue = breakEvenUnits * pricePerUnit;

  // --- 14. Invoice Generator ---
  interface InvoiceItem {
    id: string;
    description: string;
    quantity: number;
    rate: number;
  }
  const [companyName, setCompanyName] = useState<string>('Reckd Digital Labs');
  const [clientName, setClientName] = useState<string>('Acme Corporation');
  const [invoiceNumber, setInvoiceNumber] = useState<string>('INV-2026-0042');
  const [invoiceDate, setInvoiceDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [invoiceTaxRate, setInvoiceTaxRate] = useState<number>(10);
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([
    { id: '1', description: 'UI/UX Design & Brand Strategy', quantity: 1, rate: 2400 },
    { id: '2', description: 'Full-Stack Web App Development', quantity: 1, rate: 4500 },
    { id: '3', description: 'Performance & Security Audit', quantity: 1, rate: 850 },
  ]);

  const addInvoiceItem = () => {
    setInvoiceItems([
      ...invoiceItems,
      { id: Date.now().toString(), description: 'New Line Item', quantity: 1, rate: 100 },
    ]);
  };

  const removeInvoiceItem = (id: string) => {
    setInvoiceItems(invoiceItems.filter((i) => i.id !== id));
  };

  const updateInvoiceItem = (id: string, field: keyof InvoiceItem, val: any) => {
    setInvoiceItems(
      invoiceItems.map((item) => (item.id === id ? { ...item, [field]: val } : item))
    );
  };

  const invoiceSubtotal = invoiceItems.reduce((acc, i) => acc + i.quantity * i.rate, 0);
  const invoiceTax = (invoiceSubtotal * invoiceTaxRate) / 100;
  const invoiceGrandTotal = invoiceSubtotal + invoiceTax;

  const downloadInvoicePDF = () => {
    const doc = new jsPDF();
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(22);
    doc.setTextColor(255, 107, 0);
    doc.text('INVOICE', 20, 25);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Invoice #: ${invoiceNumber}`, 140, 20);
    doc.text(`Date: ${invoiceDate}`, 140, 26);

    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 30, 30);
    doc.text('FROM:', 20, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(companyName, 20, 48);

    doc.setFont('helvetica', 'bold');
    doc.text('BILL TO:', 120, 42);
    doc.setFont('helvetica', 'normal');
    doc.text(clientName, 120, 48);

    // Table Header
    let y = 65;
    doc.setFillColor(245, 245, 245);
    doc.rect(20, y, 170, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.text('DESCRIPTION', 24, y + 5.5);
    doc.text('QTY', 115, y + 5.5);
    doc.text('UNIT ($)', 140, y + 5.5);
    doc.text('TOTAL ($)', 170, y + 5.5);

    y += 12;
    doc.setFont('helvetica', 'normal');
    invoiceItems.forEach((item) => {
      doc.text(item.description, 24, y);
      doc.text(item.quantity.toString(), 118, y);
      doc.text(item.rate.toFixed(2), 142, y);
      doc.text((item.quantity * item.rate).toFixed(2), 172, y);
      y += 8;
    });

    // Totals
    y += 8;
    doc.line(110, y, 190, y);
    y += 8;
    doc.text('Subtotal:', 125, y);
    doc.text(`$${invoiceSubtotal.toFixed(2)}`, 172, y);
    y += 7;
    doc.text(`Tax (${invoiceTaxRate}%):`, 125, y);
    doc.text(`$${invoiceTax.toFixed(2)}`, 172, y);
    y += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text('Grand Total:', 125, y);
    doc.setTextColor(255, 107, 0);
    doc.text(`$${invoiceGrandTotal.toFixed(2)}`, 172, y);

    doc.save(`${invoiceNumber}.pdf`);
  };

  // --- 15. Salary Calculator ---
  const [salaryAmount, setSalaryAmount] = useState<number>(85000);
  const [salaryPeriod, setSalaryPeriod] = useState<'year' | 'month' | 'hour'>('year');
  const [hoursPerWeek, setHoursPerWeek] = useState<number>(40);
  const [taxWithholdingPct, setTaxWithholdingPct] = useState<number>(22);

  const calculateSalary = () => {
    let annualGross = salaryAmount;
    if (salaryPeriod === 'month') annualGross = salaryAmount * 12;
    if (salaryPeriod === 'hour') annualGross = salaryAmount * hoursPerWeek * 52;

    const annualNet = annualGross * (1 - taxWithholdingPct / 100);
    return {
      annualGross,
      annualNet,
      monthlyGross: annualGross / 12,
      monthlyNet: annualNet / 12,
      biweeklyNet: annualNet / 26,
      weeklyNet: annualNet / 52,
      hourlyGross: annualGross / (hoursPerWeek * 52),
      hourlyNet: annualNet / (hoursPerWeek * 52),
    };
  };
  const salaryResults = calculateSalary();

  return (
    <div className="space-y-6">
      {/* 1. CURRENCY CONVERTER */}
      {toolId === 'currency-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg} transition-all`}>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-4 border-b border-zinc-800/40">
            <div>
              <h3 className="text-xl font-bold font-display flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Real-Time Forex Converter
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Updated: {lastUpdated.toLocaleTimeString()} • Auto-refreshing in{' '}
                <span className="text-[#ff6b00] font-mono font-semibold">{nextRefreshSec}s</span>
              </p>
            </div>
            <button
              onClick={fetchRates}
              disabled={isFetchingRates}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[#ff6b00]/15 text-[#ff6b00] hover:bg-[#ff6b00]/25 transition border border-[#ff6b00]/30"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isFetchingRates ? 'animate-spin' : ''}`} />
              Refresh Rates
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center">
            {/* Amount & From */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-medium text-zinc-400">Amount</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(Math.max(0, Number(e.target.value)))}
                className={`w-full px-4 py-3 rounded-xl border text-lg font-mono outline-none ${inputBg}`}
              />
              <div className="pt-2">
                <label className="text-xs font-medium text-zinc-400">From Currency</label>
                <select
                  value={baseCurrency}
                  onChange={(e) => setBaseCurrency(e.target.value)}
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm outline-none font-semibold ${inputBg}`}
                >
                  {Object.keys(rates).sort().map((c) => (
                    <option key={c} value={c} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Swap button */}
            <div className="md:col-span-1 flex justify-center pt-6">
              <button
                onClick={() => {
                  setBaseCurrency(targetCurrency);
                  setTargetCurrency(baseCurrency);
                }}
                title="Swap Currencies"
                className="p-3 rounded-full bg-[#ff6b00] text-white hover:scale-105 active:scale-95 transition shadow-lg shadow-[#ff6b00]/20"
              >
                <ArrowRightLeft className="w-5 h-5" />
              </button>
            </div>

            {/* Converted & To */}
            <div className="md:col-span-3 space-y-2">
              <label className="text-xs font-medium text-zinc-400">Converted Value</label>
              <div className={`w-full px-4 py-3 rounded-xl border text-xl font-bold font-mono text-[#ff6b00] flex items-center ${inputBg}`}>
                {convertedAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
              </div>
              <div className="pt-2">
                <label className="text-xs font-medium text-zinc-400">To Currency</label>
                <select
                  value={targetCurrency}
                  onChange={(e) => setTargetCurrency(e.target.value)}
                  className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm outline-none font-semibold ${inputBg}`}
                >
                  {Object.keys(rates).sort().map((c) => (
                    <option key={c} value={c} className={isDark ? 'bg-zinc-900 text-white' : 'bg-white text-zinc-900'}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-[#ff6b00]/10 border border-[#ff6b00]/20 flex flex-wrap items-center justify-between text-xs text-zinc-300">
            <span>
              1 {baseCurrency} = <strong className="text-white font-mono">{unitRate.toFixed(4)}</strong> {targetCurrency}
            </span>
            <span>
              1 {targetCurrency} = <strong className="text-white font-mono">{(1 / unitRate).toFixed(4)}</strong> {baseCurrency}
            </span>
          </div>
        </div>
      )}

      {/* 2. EMI CALCULATOR */}
      {toolId === 'emi-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Equated Monthly Installment (EMI)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Principal Loan Amount ($)</label>
              <input
                type="number"
                value={emiPrincipal}
                onChange={(e) => setEmiPrincipal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={emiRate}
                onChange={(e) => setEmiRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Tenure (Years)</label>
              <input
                type="number"
                value={emiTenureYears}
                onChange={(e) => setEmiTenureYears(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Monthly EMI</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">${emiResults.emi.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Interest Payable</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">${emiResults.totalInterest.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Amount (Principal + Interest)</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${emiResults.totalPayment.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 3. LOAN CALCULATOR */}
      {toolId === 'loan-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Loan Payoff & Extra Payments</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Loan Balance ($)</label>
              <input
                type="number"
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={loanRate}
                onChange={(e) => setLoanRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Term (Months)</label>
              <input
                type="number"
                value={loanMonths}
                onChange={(e) => setLoanMonths(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Extra Monthly Pay ($)</label>
              <input
                type="number"
                value={extraPayment}
                onChange={(e) => setExtraPayment(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Standard Payment</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">${loanResults.standardMonthly.toFixed(2)}/mo</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Interest Saved With Extra</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">${loanResults.interestSaved.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Time Saved</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{loanResults.monthsSaved} Months</p>
            </div>
          </div>
        </div>
      )}

      {/* 4. MORTGAGE CALCULATOR */}
      {toolId === 'mortgage-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Mortgage & Property Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Home Purchase Price ($)</label>
              <input
                type="number"
                value={homePrice}
                onChange={(e) => setHomePrice(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Down Payment (%)</label>
              <input
                type="number"
                value={downPaymentPct}
                onChange={(e) => setDownPaymentPct(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={mortgageRate}
                onChange={(e) => setMortgageRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Term (Years)</label>
              <input
                type="number"
                value={mortgageYears}
                onChange={(e) => setMortgageYears(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Annual Property Tax ($)</label>
              <input
                type="number"
                value={propertyTaxAnnual}
                onChange={(e) => setPropertyTaxAnnual(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Annual Home Insurance ($)</label>
              <input
                type="number"
                value={insuranceAnnual}
                onChange={(e) => setInsuranceAnnual(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Monthly Payment</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">${mortgageResults.totalMonthly.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Principal & Interest</span>
              <p className="text-xl font-bold font-mono text-white mt-1">${mortgageResults.pi.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Property Tax / Mo</span>
              <p className="text-xl font-bold font-mono text-zinc-300 mt-1">${mortgageResults.taxMonthly.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Insurance / Mo</span>
              <p className="text-xl font-bold font-mono text-zinc-300 mt-1">${mortgageResults.insMonthly.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 5. COMPOUND INTEREST */}
      {toolId === 'compound-interest-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Compound Interest Growth</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Initial Principal ($)</label>
              <input
                type="number"
                value={ciPrincipal}
                onChange={(e) => setCiPrincipal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Monthly Contribution ($)</label>
              <input
                type="number"
                value={ciMonthlyContrib}
                onChange={(e) => setCiMonthlyContrib(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Annual Return Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={ciRate}
                onChange={(e) => setCiRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Investment Period (Years)</label>
              <input
                type="number"
                value={ciYears}
                onChange={(e) => setCiYears(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Future Balance</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">${ciResults.totalFV.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Invested</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">${ciResults.totalInvested.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Compound Interest</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${ciResults.totalInterest.toLocaleString(undefined, { maximumFractionDigits: 2 })}</p>
            </div>
          </div>
        </div>
      )}

      {/* 6. SIMPLE INTEREST */}
      {toolId === 'simple-interest-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Simple Interest Calculator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Principal ($)</label>
              <input
                type="number"
                value={siPrincipal}
                onChange={(e) => setSiPrincipal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Annual Interest Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={siRate}
                onChange={(e) => setSiRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Time (Years)</label>
              <input
                type="number"
                step="0.5"
                value={siTime}
                onChange={(e) => setSiTime(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Simple Interest Earned</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">${siInterest.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Accumulated Amount</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${siTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 7. GST CALCULATOR */}
      {toolId === 'gst-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">GST (Goods & Services Tax)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Base Amount ($)</label>
              <input
                type="number"
                value={gstAmount}
                onChange={(e) => setGstAmount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">GST Slab (%)</label>
              <select
                value={gstRate}
                onChange={(e) => setGstRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              >
                <option value={3}>3% (Gold & Precious Stones)</option>
                <option value={5}>5% (Essential Commodities)</option>
                <option value={12}>12% (Standard Items)</option>
                <option value={18}>18% (Standard Services & Goods)</option>
                <option value={28}>28% (Luxury & Sin Items)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Calculation Type</label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setGstType('exclusive')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    gstType === 'exclusive' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'
                  }`}
                >
                  Exclusive (+GST)
                </button>
                <button
                  type="button"
                  onClick={() => setGstType('inclusive')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    gstType === 'inclusive' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'
                  }`}
                >
                  Inclusive (-GST)
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Net Amount</span>
              <p className="text-xl font-bold font-mono text-white mt-1">${gstNetBefore.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">GST Amount ({gstRate}%)</span>
              <p className="text-xl font-bold font-mono text-[#ff6b00] mt-1">${gstValue.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Gross Total</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">${gstFinalTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 8. VAT CALCULATOR */}
      {toolId === 'vat-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Value Added Tax (VAT)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Amount ($)</label>
              <input
                type="number"
                value={vatAmount}
                onChange={(e) => setVatAmount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">VAT Rate (%)</label>
              <input
                type="number"
                value={vatRate}
                onChange={(e) => setVatRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Action</label>
              <div className="flex gap-2 mt-1">
                <button
                  type="button"
                  onClick={() => setVatMode('add')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    vatMode === 'add' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'
                  }`}
                >
                  Add VAT
                </button>
                <button
                  type="button"
                  onClick={() => setVatMode('remove')}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border ${
                    vatMode === 'remove' ? 'bg-[#ff6b00] text-white border-[#ff6b00]' : 'border-zinc-700 text-zinc-400'
                  }`}
                >
                  Extract VAT
                </button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">VAT Tax ({vatRate}%)</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">${vatCalculated.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">{vatMode === 'add' ? 'Gross Total' : 'Net Before Tax'}</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${vatGross.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 9. SALES TAX */}
      {toolId === 'sales-tax-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Sales Tax Breakdown</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Purchase Subtotal ($)</label>
              <input
                type="number"
                value={salesSubtotal}
                onChange={(e) => setSalesSubtotal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">State Tax Rate (%)</label>
              <input
                type="number"
                step="0.1"
                value={stateTaxRate}
                onChange={(e) => setStateTaxRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">City / Local Tax (%)</label>
              <input
                type="number"
                step="0.1"
                value={localTaxRate}
                onChange={(e) => setLocalTaxRate(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Combined Tax Rate</span>
              <p className="text-xl font-bold font-mono text-white mt-1">{totalSalesTaxRate.toFixed(2)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total Tax Added</span>
              <p className="text-xl font-bold font-mono text-[#ff6b00] mt-1">${salesTaxValue.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Final Register Total</span>
              <p className="text-xl font-bold font-mono text-emerald-400 mt-1">${salesTaxTotal.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 10. DISCOUNT CALCULATOR */}
      {toolId === 'discount-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Discount & Double Savings</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Original Price ($)</label>
              <input
                type="number"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Primary Discount (%)</label>
              <input
                type="number"
                value={discountPercent}
                onChange={(e) => setDiscountPercent(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Extra Coupon Discount (%)</label>
              <input
                type="number"
                value={additionalDiscount}
                onChange={(e) => setAdditionalDiscount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Final Discounted Price</span>
              <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">${finalDiscountPrice.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">You Save In Total</span>
              <p className="text-3xl font-bold font-mono text-[#ff6b00] mt-1">${totalDiscountSavings.toFixed(2)}</p>
            </div>
          </div>
        </div>
      )}

      {/* 11. PROFIT MARGIN */}
      {toolId === 'profit-margin-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Profit Margin & Markup</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Cost of Goods / Item ($)</label>
              <input
                type="number"
                value={costPrice}
                onChange={(e) => setCostPrice(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Revenue / Selling Price ($)</label>
              <input
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Gross Profit</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${grossProfit.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Gross Margin</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">{profitMarginPct.toFixed(1)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Markup Percentage</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">{markupPct.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      )}

      {/* 12. ROI CALCULATOR */}
      {toolId === 'roi-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Return on Investment (ROI)</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Initial Investment ($)</label>
              <input
                type="number"
                value={roiInvested}
                onChange={(e) => setRoiInvested(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Final Returned Value ($)</label>
              <input
                type="number"
                value={roiReturned}
                onChange={(e) => setRoiReturned(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Holding Period (Years)</label>
              <input
                type="number"
                value={roiYears}
                onChange={(e) => setRoiYears(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Net Profit</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">${netProfitROI.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Total ROI</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">{totalROI.toFixed(2)}%</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Annualized ROI</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">{annualizedROI.toFixed(2)}%/yr</p>
            </div>
          </div>
        </div>
      )}

      {/* 13. BREAK-EVEN */}
      {toolId === 'break-even-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Break-Even Point</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Total Fixed Overhead ($)</label>
              <input
                type="number"
                value={fixedCosts}
                onChange={(e) => setFixedCosts(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Variable Cost / Unit ($)</label>
              <input
                type="number"
                value={varCostPerUnit}
                onChange={(e) => setVarCostPerUnit(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Sale Price / Unit ($)</label>
              <input
                type="number"
                value={pricePerUnit}
                onChange={(e) => setPricePerUnit(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Break-Even Units Required</span>
              <p className="text-3xl font-bold font-mono text-[#ff6b00] mt-1">{breakEvenUnits} Units</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Break-Even Gross Revenue</span>
              <p className="text-3xl font-bold font-mono text-emerald-400 mt-1">${breakEvenRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* 14. INVOICE GENERATOR */}
      {toolId === 'invoice-generator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Invoice Generator & PDF Export</h3>
            <button
              onClick={downloadInvoicePDF}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#ff6b00] text-white font-medium hover:bg-[#ff6b00]/90 transition shadow-lg shadow-[#ff6b00]/20 text-xs"
            >
              <Download className="w-4 h-4" /> Download PDF
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Your Business Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Bill To (Client)</label>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Invoice #</label>
              <input
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Tax Rate (%)</label>
              <input
                type="number"
                value={invoiceTaxRate}
                onChange={(e) => setInvoiceTaxRate(Number(e.target.value))}
                className={`w-full mt-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
              />
            </div>
          </div>

          <div className="space-y-2 mt-4">
            <div className="text-xs font-semibold text-zinc-400 uppercase tracking-wider flex justify-between px-2">
              <span>Item Description</span>
              <span className="w-24 text-right">Qty & Price</span>
            </div>
            {invoiceItems.map((item) => (
              <div key={item.id} className="flex items-center gap-2">
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateInvoiceItem(item.id, 'description', e.target.value)}
                  className={`flex-1 px-3 py-2 rounded-xl border text-xs ${inputBg}`}
                />
                <input
                  type="number"
                  value={item.quantity}
                  onChange={(e) => updateInvoiceItem(item.id, 'quantity', Number(e.target.value))}
                  className={`w-16 px-2 py-2 rounded-xl border text-xs text-center ${inputBg}`}
                />
                <input
                  type="number"
                  value={item.rate}
                  onChange={(e) => updateInvoiceItem(item.id, 'rate', Number(e.target.value))}
                  className={`w-24 px-2 py-2 rounded-xl border text-xs text-right ${inputBg}`}
                />
                <button
                  onClick={() => removeInvoiceItem(item.id)}
                  className="p-2 text-rose-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
            <button
              onClick={addInvoiceItem}
              className="flex items-center gap-2 text-xs text-[#ff6b00] hover:text-[#ff6b00]/80 font-semibold mt-2"
            >
              <Plus className="w-3.5 h-3.5" /> Add Line Item
            </button>
          </div>

          <div className="flex justify-end mt-6">
            <div className="w-64 space-y-1 text-xs">
              <div className="flex justify-between text-zinc-400">
                <span>Subtotal</span>
                <span className="font-mono">${invoiceSubtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Tax ({invoiceTaxRate}%)</span>
                <span className="font-mono">${invoiceTax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#ff6b00] pt-2 border-t border-zinc-800">
                <span>Grand Total</span>
                <span className="font-mono">${invoiceGrandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 15. SALARY CALCULATOR */}
      {toolId === 'salary-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Salary to Hourly & Take-Home Pay</h3>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="text-xs font-medium text-zinc-400">Base Salary Amount ($)</label>
              <input
                type="number"
                value={salaryAmount}
                onChange={(e) => setSalaryAmount(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Pay Frequency</label>
              <select
                value={salaryPeriod}
                onChange={(e) => setSalaryPeriod(e.target.value as any)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="year">Per Year</option>
                <option value="month">Per Month</option>
                <option value="hour">Per Hour</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Hours / Week</label>
              <input
                type="number"
                value={hoursPerWeek}
                onChange={(e) => setHoursPerWeek(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Tax Withholding Est. (%)</label>
              <input
                type="number"
                value={taxWithholdingPct}
                onChange={(e) => setTaxWithholdingPct(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Hourly (Gross / Net)</span>
              <p className="text-lg font-bold font-mono text-white mt-1">
                ${salaryResults.hourlyGross.toFixed(2)} / <span className="text-emerald-400">${salaryResults.hourlyNet.toFixed(2)}</span>
              </p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Weekly Take-Home</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-1">${salaryResults.weeklyNet.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Monthly Net Pay</span>
              <p className="text-lg font-bold font-mono text-[#ff6b00] mt-1">${salaryResults.monthlyNet.toFixed(2)}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Annual Net Take-Home</span>
              <p className="text-lg font-bold font-mono text-emerald-400 mt-1">${salaryResults.annualNet.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
