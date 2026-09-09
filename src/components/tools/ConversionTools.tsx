import React, { useState, useEffect } from 'react';
import { ArrowRightLeft, Globe, Clock } from 'lucide-react';

interface ConversionToolsProps {
  toolId: string;
  theme: 'dark' | 'light';
}

export const ConversionTools: React.FC<ConversionToolsProps> = ({ toolId, theme }) => {
  const isDark = theme === 'dark';
  const cardBg = isDark ? 'bg-zinc-900/70 border-zinc-800 text-white' : 'bg-white/80 border-zinc-200 text-zinc-900';
  const inputBg = isDark ? 'bg-zinc-950/80 border-zinc-800 text-white focus:border-[#ff6b00]' : 'bg-zinc-50 border-zinc-300 text-zinc-900 focus:border-[#ff6b00]';

  // 1 & 2. Length Conversion
  const lengthRatios: Record<string, number> = {
    m: 1,
    km: 1000,
    cm: 0.01,
    mm: 0.001,
    in: 0.0254,
    ft: 0.3048,
    yd: 0.9144,
    mi: 1609.344,
    nmi: 1852,
  };
  const [lenVal, setLenVal] = useState<number>(100);
  const [lenFrom, setLenFrom] = useState<string>('m');
  const [lenTo, setLenTo] = useState<string>('ft');
  const lenResult = (lenVal * lengthRatios[lenFrom]) / lengthRatios[lenTo];

  // 3. Weight Conversion
  const weightRatios: Record<string, number> = {
    kg: 1,
    g: 0.001,
    mg: 0.000001,
    lb: 0.45359237,
    oz: 0.0283495,
    stone: 6.35029,
    ton: 1000,
  };
  const [weightVal, setWeightVal] = useState<number>(75);
  const [weightFrom, setWeightFrom] = useState<string>('kg');
  const [weightTo, setWeightTo] = useState<string>('lb');
  const weightResult = (weightVal * weightRatios[weightFrom]) / weightRatios[weightTo];

  // 4. Temperature Conversion
  const [tempVal, setTempVal] = useState<number>(25);
  const [tempFrom, setTempFrom] = useState<'C' | 'F' | 'K' | 'R'>('C');
  const [tempTo, setTempTo] = useState<'C' | 'F' | 'K' | 'R'>('F');

  const convertTemp = () => {
    let kelvin = 0;
    if (tempFrom === 'C') kelvin = tempVal + 273.15;
    if (tempFrom === 'F') kelvin = ((tempVal - 32) * 5) / 9 + 273.15;
    if (tempFrom === 'K') kelvin = tempVal;
    if (tempFrom === 'R') kelvin = (tempVal * 5) / 9;

    if (tempTo === 'C') return kelvin - 273.15;
    if (tempTo === 'F') return ((kelvin - 273.15) * 9) / 5 + 32;
    if (tempTo === 'K') return kelvin;
    if (tempTo === 'R') return (kelvin * 9) / 5;
    return 0;
  };
  const tempResult = convertTemp();

  // 5. Area Conversion
  const areaRatios: Record<string, number> = {
    sqm: 1,
    sqft: 0.092903,
    sqyd: 0.836127,
    acre: 4046.86,
    hectare: 10000,
    sqkm: 1000000,
    sqmi: 2589988.11,
  };
  const [areaVal, setAreaVal] = useState<number>(1000);
  const [areaFrom, setAreaFrom] = useState<string>('sqft');
  const [areaTo, setAreaTo] = useState<string>('sqm');
  const areaResult = (areaVal * areaRatios[areaFrom]) / areaRatios[areaTo];

  // 6. Volume Conversion
  const volRatios: Record<string, number> = {
    l: 1,
    ml: 0.001,
    gal: 3.78541,
    floz: 0.0295735,
    m3: 1000,
    cup: 0.236588,
    pt: 0.473176,
  };
  const [volVal, setVolVal] = useState<number>(5);
  const [volFrom, setVolFrom] = useState<string>('gal');
  const [volTo, setVolTo] = useState<string>('l');
  const volResult = (volVal * volRatios[volFrom]) / volRatios[volTo];

  // 7. Speed Conversion
  const speedRatios: Record<string, number> = {
    kmh: 1,
    mph: 1.60934,
    ms: 3.6,
    knot: 1.852,
    mach: 1225.044,
  };
  const [speedVal, setSpeedVal] = useState<number>(100);
  const [speedFrom, setSpeedFrom] = useState<string>('kmh');
  const [speedTo, setSpeedTo] = useState<string>('mph');
  const speedResult = (speedVal * speedRatios[speedFrom]) / speedRatios[speedTo];

  // 8. Fuel Economy
  const [fuelVal, setFuelVal] = useState<number>(30);
  const [fuelFrom, setFuelFrom] = useState<'mpg_us' | 'mpg_uk' | 'l_100km' | 'km_l'>('mpg_us');
  const [fuelTo, setFuelTo] = useState<'mpg_us' | 'mpg_uk' | 'l_100km' | 'km_l'>('l_100km');

  const convertFuel = () => {
    // Convert all to km/L first
    let kml = 0;
    if (fuelFrom === 'km_l') kml = fuelVal;
    if (fuelFrom === 'mpg_us') kml = fuelVal * 0.425144;
    if (fuelFrom === 'mpg_uk') kml = fuelVal * 0.354006;
    if (fuelFrom === 'l_100km') kml = fuelVal > 0 ? 100 / fuelVal : 0;

    if (fuelTo === 'km_l') return kml;
    if (fuelTo === 'mpg_us') return kml / 0.425144;
    if (fuelTo === 'mpg_uk') return kml / 0.354006;
    if (fuelTo === 'l_100km') return kml > 0 ? 100 / kml : 0;
    return 0;
  };
  const fuelResult = convertFuel();

  // 9. Pressure Conversion
  const pressRatios: Record<string, number> = {
    pa: 1,
    kpa: 1000,
    bar: 100000,
    psi: 6894.76,
    atm: 101325,
    mmhg: 133.322,
  };
  const [pressVal, setPressVal] = useState<number>(32);
  const [pressFrom, setPressFrom] = useState<string>('psi');
  const [pressTo, setPressTo] = useState<string>('bar');
  const pressResult = (pressVal * pressRatios[pressFrom]) / pressRatios[pressTo];

  // 10. Energy Conversion
  const energyRatios: Record<string, number> = {
    j: 1,
    kj: 1000,
    cal: 4.184,
    kcal: 4184,
    wh: 3600,
    kwh: 3600000,
    btu: 1055.06,
  };
  const [energyVal, setEnergyVal] = useState<number>(500);
  const [energyFrom, setEnergyFrom] = useState<string>('kcal');
  const [energyTo, setEnergyTo] = useState<string>('kj');
  const energyResult = (energyVal * energyRatios[energyFrom]) / energyRatios[energyTo];

  // 11. Data Storage Conversion
  const [dataVal, setDataVal] = useState<number>(64);
  const [dataFrom, setDataFrom] = useState<string>('gb');
  const [dataTo, setDataTo] = useState<string>('mb');
  const [isBinaryStandard, setIsBinaryStandard] = useState<boolean>(true); // 1024 vs 1000

  const baseMultiplier = isBinaryStandard ? 1024 : 1000;
  const dataUnitsOrder = ['b', 'B', 'kb', 'mb', 'gb', 'tb', 'pb'];
  const getUnitPower = (u: string) => {
    if (u === 'b') return -1;
    if (u === 'B') return 0;
    if (u === 'kb') return 1;
    if (u === 'mb') return 2;
    if (u === 'gb') return 3;
    if (u === 'tb') return 4;
    if (u === 'pb') return 5;
    return 0;
  };

  const convertDataStorage = () => {
    const p1 = getUnitPower(dataFrom);
    const p2 = getUnitPower(dataTo);
    // Convert to Bytes first
    let bytes = p1 === -1 ? dataVal / 8 : dataVal * Math.pow(baseMultiplier, p1);
    // Convert to target
    if (p2 === -1) return bytes * 8;
    return bytes / Math.pow(baseMultiplier, p2);
  };
  const dataResult = convertDataStorage();

  // 12. Time Zone Converter & World Clocks
  const [currentTime, setCurrentTime] = useState<Date>(new Date());
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timezones = [
    { city: 'London', tz: 'Europe/London', label: 'GMT/BST' },
    { city: 'New York', tz: 'America/New_York', label: 'EDT/EST' },
    { city: 'San Francisco', tz: 'America/Los_Angeles', label: 'PDT/PST' },
    { city: 'Berlin / Paris', tz: 'Europe/Berlin', label: 'CEST/CET' },
    { city: 'Dubai', tz: 'Asia/Dubai', label: 'GST (UTC+4)' },
    { city: 'New Delhi', tz: 'Asia/Kolkata', label: 'IST (UTC+5:30)' },
    { city: 'Tokyo', tz: 'Asia/Tokyo', label: 'JST (UTC+9)' },
    { city: 'Sydney', tz: 'Australia/Sydney', label: 'AEST (UTC+10)' },
  ];

  // 13. Currency Exchange Matrix
  const [exchangeAmt, setExchangeAmt] = useState<number>(1000);
  const [exchangeBase, setExchangeBase] = useState<string>('USD');
  const [exchangeSpreadPct, setExchangeSpreadPct] = useState<number>(1.5);
  const matrixCurrencies = ['EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'INR'];
  const dummyMatrixRates: Record<string, number> = {
    EUR: 0.92,
    GBP: 0.79,
    JPY: 154.5,
    CAD: 1.36,
    AUD: 1.52,
    CHF: 0.91,
    INR: 83.4,
  };

  // 14. Shoe Size Converter
  const [shoeGender, setShoeGender] = useState<'men' | 'women' | 'kids'>('men');
  const [shoeUs, setShoeUs] = useState<number>(9.5);
  const shoeTableMen = [
    { us: 8.0, uk: 7.5, eu: 41, cm: 26.0 },
    { us: 8.5, uk: 8.0, eu: 42, cm: 26.5 },
    { us: 9.0, uk: 8.5, eu: 42.5, cm: 27.0 },
    { us: 9.5, uk: 9.0, eu: 43, cm: 27.5 },
    { us: 10.0, uk: 9.5, eu: 44, cm: 28.0 },
    { us: 10.5, uk: 10.0, eu: 44.5, cm: 28.5 },
    { us: 11.0, uk: 10.5, eu: 45, cm: 29.0 },
    { us: 12.0, uk: 11.5, eu: 46, cm: 30.0 },
  ];
  const matchedShoe =
    shoeTableMen.find((s) => s.us === shoeUs) || {
      us: shoeUs,
      uk: shoeUs - 0.5,
      eu: Math.round(shoeUs * 1.25 + 31),
      cm: (shoeUs * 0.8 + 19.8).toFixed(1),
    };

  // 15. Clothing Size Converter
  const [clothingType, setClothingType] = useState<'mens_shirts' | 'womens_dresses' | 'suits'>('mens_shirts');
  const clothingSizes = [
    { label: 'XS', us: '34', uk: '34', eu: '44' },
    { label: 'S', us: '36', uk: '36', eu: '46' },
    { label: 'M', us: '38 - 40', uk: '38 - 40', eu: '48 - 50' },
    { label: 'L', us: '42 - 44', uk: '42 - 44', eu: '52 - 54' },
    { label: 'XL', us: '46 - 48', uk: '46 - 48', eu: '56 - 58' },
    { label: 'XXL', us: '50', uk: '50', eu: '60' },
  ];

  return (
    <div className="space-y-6">
      {/* 1 & 2. LENGTH CONVERTER / UNIVERSAL */}
      {(toolId === 'unit-converter' || toolId === 'length-converter') && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Length & Distance Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Value</label>
              <input
                type="number"
                value={lenVal}
                onChange={(e) => setLenVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={lenFrom}
                onChange={(e) => setLenFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="m">Meters (m)</option>
                <option value="km">Kilometers (km)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
                <option value="yd">Yards (yd)</option>
                <option value="mi">Miles (mi)</option>
                <option value="nmi">Nautical Miles (nmi)</option>
              </select>
            </div>

            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setLenFrom(lenTo);
                  setLenTo(lenFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Converted Output</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {lenResult.toLocaleString(undefined, { maximumFractionDigits: 6 })}
              </div>
              <select
                value={lenTo}
                onChange={(e) => setLenTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="m">Meters (m)</option>
                <option value="km">Kilometers (km)</option>
                <option value="cm">Centimeters (cm)</option>
                <option value="mm">Millimeters (mm)</option>
                <option value="ft">Feet (ft)</option>
                <option value="in">Inches (in)</option>
                <option value="yd">Yards (yd)</option>
                <option value="mi">Miles (mi)</option>
                <option value="nmi">Nautical Miles (nmi)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 3. WEIGHT CONVERTER */}
      {toolId === 'weight-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Weight & Mass Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Value</label>
              <input
                type="number"
                value={weightVal}
                onChange={(e) => setWeightVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={weightFrom}
                onChange={(e) => setWeightFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="lb">Pounds (lb)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="stone">Stone</option>
                <option value="ton">Metric Tons (t)</option>
              </select>
            </div>

            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setWeightFrom(weightTo);
                  setWeightTo(weightFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Converted Weight</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {weightResult.toLocaleString(undefined, { maximumFractionDigits: 5 })}
              </div>
              <select
                value={weightTo}
                onChange={(e) => setWeightTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="kg">Kilograms (kg)</option>
                <option value="g">Grams (g)</option>
                <option value="mg">Milligrams (mg)</option>
                <option value="lb">Pounds (lb)</option>
                <option value="oz">Ounces (oz)</option>
                <option value="stone">Stone</option>
                <option value="ton">Metric Tons (t)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 4. TEMPERATURE CONVERTER */}
      {toolId === 'temperature-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Temperature Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Temperature</label>
              <input
                type="number"
                value={tempVal}
                onChange={(e) => setTempVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={tempFrom}
                onChange={(e) => setTempFrom(e.target.value as any)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
                <option value="R">Rankine (°R)</option>
              </select>
            </div>

            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setTempFrom(tempTo);
                  setTempTo(tempFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Equivalent</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {tempResult.toFixed(2)} °{tempTo}
              </div>
              <select
                value={tempTo}
                onChange={(e) => setTempTo(e.target.value as any)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="C">Celsius (°C)</option>
                <option value="F">Fahrenheit (°F)</option>
                <option value="K">Kelvin (K)</option>
                <option value="R">Rankine (°R)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 5. AREA CONVERTER */}
      {toolId === 'area-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Area & Land Surface Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Area</label>
              <input
                type="number"
                value={areaVal}
                onChange={(e) => setAreaVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={areaFrom}
                onChange={(e) => setAreaFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="sqm">Square Meters (m²)</option>
                <option value="sqft">Square Feet (ft²)</option>
                <option value="acre">Acres</option>
                <option value="hectare">Hectares</option>
                <option value="sqkm">Square Kilometers (km²)</option>
                <option value="sqmi">Square Miles (mi²)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setAreaFrom(areaTo);
                  setAreaTo(areaFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Equivalent Area</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {areaResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <select
                value={areaTo}
                onChange={(e) => setAreaTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="sqm">Square Meters (m²)</option>
                <option value="sqft">Square Feet (ft²)</option>
                <option value="acre">Acres</option>
                <option value="hectare">Hectares</option>
                <option value="sqkm">Square Kilometers (km²)</option>
                <option value="sqmi">Square Miles (mi²)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 6. VOLUME CONVERTER */}
      {toolId === 'volume-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Volume & Liquid Capacity</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Volume</label>
              <input
                type="number"
                value={volVal}
                onChange={(e) => setVolVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={volFrom}
                onChange={(e) => setVolFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="gal">Gallons (US)</option>
                <option value="l">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="floz">Fluid Ounces (fl oz)</option>
                <option value="cup">Cups</option>
                <option value="pt">Pints (US)</option>
                <option value="m3">Cubic Meters (m³)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setVolFrom(volTo);
                  setVolTo(volFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Converted Volume</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {volResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <select
                value={volTo}
                onChange={(e) => setVolTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="gal">Gallons (US)</option>
                <option value="l">Liters (L)</option>
                <option value="ml">Milliliters (ml)</option>
                <option value="floz">Fluid Ounces (fl oz)</option>
                <option value="cup">Cups</option>
                <option value="pt">Pints (US)</option>
                <option value="m3">Cubic Meters (m³)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 7. SPEED CONVERTER */}
      {toolId === 'speed-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Speed & Velocity Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Speed</label>
              <input
                type="number"
                value={speedVal}
                onChange={(e) => setSpeedVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={speedFrom}
                onChange={(e) => setSpeedFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="kmh">Kilometers / Hour (km/h)</option>
                <option value="mph">Miles / Hour (mph)</option>
                <option value="ms">Meters / Second (m/s)</option>
                <option value="knot">Knots (kn)</option>
                <option value="mach">Mach (at Sea Level)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setSpeedFrom(speedTo);
                  setSpeedTo(speedFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Equivalent Velocity</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {speedResult.toFixed(2)}
              </div>
              <select
                value={speedTo}
                onChange={(e) => setSpeedTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="kmh">Kilometers / Hour (km/h)</option>
                <option value="mph">Miles / Hour (mph)</option>
                <option value="ms">Meters / Second (m/s)</option>
                <option value="knot">Knots (kn)</option>
                <option value="mach">Mach (at Sea Level)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 8. FUEL ECONOMY */}
      {toolId === 'fuel-economy-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Fuel Economy & Consumption</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Value</label>
              <input
                type="number"
                value={fuelVal}
                onChange={(e) => setFuelVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={fuelFrom}
                onChange={(e) => setFuelFrom(e.target.value as any)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="mpg_us">Miles per Gallon (US MPG)</option>
                <option value="mpg_uk">Miles per Gallon (UK MPG)</option>
                <option value="l_100km">Liters per 100km (L/100km)</option>
                <option value="km_l">Kilometers per Liter (km/L)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setFuelFrom(fuelTo);
                  setFuelTo(fuelFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Equivalent Efficiency</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {fuelResult.toFixed(2)}
              </div>
              <select
                value={fuelTo}
                onChange={(e) => setFuelTo(e.target.value as any)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="mpg_us">Miles per Gallon (US MPG)</option>
                <option value="mpg_uk">Miles per Gallon (UK MPG)</option>
                <option value="l_100km">Liters per 100km (L/100km)</option>
                <option value="km_l">Kilometers per Liter (km/L)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 9. PRESSURE CONVERTER */}
      {toolId === 'pressure-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Pressure Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Pressure Value</label>
              <input
                type="number"
                value={pressVal}
                onChange={(e) => setPressVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={pressFrom}
                onChange={(e) => setPressFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="psi">PSI (Pound-force / sq in)</option>
                <option value="bar">Bar</option>
                <option value="kpa">Kilopascals (kPa)</option>
                <option value="atm">Standard Atmosphere (atm)</option>
                <option value="mmhg">Torr / mmHg</option>
                <option value="pa">Pascals (Pa)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setPressFrom(pressTo);
                  setPressTo(pressFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Converted Output</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {pressResult.toFixed(4)}
              </div>
              <select
                value={pressTo}
                onChange={(e) => setPressTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="psi">PSI (Pound-force / sq in)</option>
                <option value="bar">Bar</option>
                <option value="kpa">Kilopascals (kPa)</option>
                <option value="atm">Standard Atmosphere (atm)</option>
                <option value="mmhg">Torr / mmHg</option>
                <option value="pa">Pascals (Pa)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 10. ENERGY CONVERTER */}
      {toolId === 'energy-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Energy & Work Converter</h3>
          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Energy Value</label>
              <input
                type="number"
                value={energyVal}
                onChange={(e) => setEnergyVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={energyFrom}
                onChange={(e) => setEnergyFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="kcal">Kilocalories (kcal / Food Cal)</option>
                <option value="kj">Kilojoules (kJ)</option>
                <option value="j">Joules (J)</option>
                <option value="kwh">Kilowatt-hours (kWh)</option>
                <option value="btu">British Thermal Units (BTU)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setEnergyFrom(energyTo);
                  setEnergyTo(energyFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Converted Output</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {energyResult.toLocaleString(undefined, { maximumFractionDigits: 3 })}
              </div>
              <select
                value={energyTo}
                onChange={(e) => setEnergyTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="kcal">Kilocalories (kcal / Food Cal)</option>
                <option value="kj">Kilojoules (kJ)</option>
                <option value="j">Joules (J)</option>
                <option value="kwh">Kilowatt-hours (kWh)</option>
                <option value="btu">British Thermal Units (BTU)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 11. DATA STORAGE CONVERTER */}
      {toolId === 'data-storage-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">Data Storage Units</h3>
            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsBinaryStandard(true)}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  isBinaryStandard ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Binary (1024)
              </button>
              <button
                onClick={() => setIsBinaryStandard(false)}
                className={`px-3 py-1.5 rounded-lg font-semibold ${
                  !isBinaryStandard ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Decimal (1000)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-7 gap-4 items-center">
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Storage Size</label>
              <input
                type="number"
                value={dataVal}
                onChange={(e) => setDataVal(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-base font-mono ${inputBg}`}
              />
              <select
                value={dataFrom}
                onChange={(e) => setDataFrom(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="b">Bits (b)</option>
                <option value="B">Bytes (B)</option>
                <option value="kb">Kilobytes (KB / KiB)</option>
                <option value="mb">Megabytes (MB / MiB)</option>
                <option value="gb">Gigabytes (GB / GiB)</option>
                <option value="tb">Terabytes (TB / TiB)</option>
                <option value="pb">Petabytes (PB / PiB)</option>
              </select>
            </div>
            <div className="sm:col-span-1 flex justify-center pt-5">
              <button
                onClick={() => {
                  setDataFrom(dataTo);
                  setDataTo(dataFrom);
                }}
                className="p-2.5 rounded-full bg-[#ff6b00] text-white hover:scale-105 transition"
              >
                <ArrowRightLeft className="w-4 h-4" />
              </button>
            </div>
            <div className="sm:col-span-3">
              <label className="text-xs font-medium text-zinc-400">Converted Capacity</label>
              <div className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-lg font-bold font-mono text-[#ff6b00] ${inputBg}`}>
                {dataResult.toLocaleString(undefined, { maximumFractionDigits: 4 })}
              </div>
              <select
                value={dataTo}
                onChange={(e) => setDataTo(e.target.value)}
                className={`w-full mt-2 px-3 py-2 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="b">Bits (b)</option>
                <option value="B">Bytes (B)</option>
                <option value="kb">Kilobytes (KB / KiB)</option>
                <option value="mb">Megabytes (MB / MiB)</option>
                <option value="gb">Gigabytes (GB / GiB)</option>
                <option value="tb">Terabytes (TB / TiB)</option>
                <option value="pb">Petabytes (PB / PiB)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 12. TIME ZONE CONVERTER */}
      {toolId === 'time-zone-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display flex items-center gap-2">
              <Globe className="w-5 h-5 text-[#ff6b00]" />
              Live Global Time Zones & Clocks
            </h3>
            <span className="text-xs font-mono text-zinc-400">
              UTC: {currentTime.toUTCString().slice(17, 25)}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {timezones.map((tz) => {
              const timeStr = currentTime.toLocaleTimeString('en-US', {
                timeZone: tz.tz,
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
                hour12: true,
              });
              const dateStr = currentTime.toLocaleDateString('en-US', {
                timeZone: tz.tz,
                weekday: 'short',
                month: 'short',
                day: 'numeric',
              });

              return (
                <div key={tz.city} className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
                  <div className="flex items-center justify-between text-xs text-zinc-400">
                    <span className="font-semibold text-white">{tz.city}</span>
                    <span>{tz.label}</span>
                  </div>
                  <p className="text-2xl font-black font-mono text-[#ff6b00] mt-2">{timeStr}</p>
                  <span className="text-xs text-zinc-400 mt-1 block">{dateStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 13. CURRENCY EXCHANGE CALCULATOR */}
      {toolId === 'currency-exchange-calculator' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Cross-Currency Matrix & Spread Estimator</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div>
              <label className="text-xs font-medium text-zinc-400">Base Amount</label>
              <input
                type="number"
                value={exchangeAmt}
                onChange={(e) => setExchangeAmt(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Base Currency</label>
              <select
                value={exchangeBase}
                onChange={(e) => setExchangeBase(e.target.value)}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              >
                <option value="USD">USD ($)</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-medium text-zinc-400">Bank / Broker Spread Margin (%)</label>
              <input
                type="number"
                step="0.1"
                value={exchangeSpreadPct}
                onChange={(e) => setExchangeSpreadPct(Number(e.target.value))}
                className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-2.5">Currency</th>
                  <th>Market Rate</th>
                  <th>Interbank Value</th>
                  <th>After Spread (-{exchangeSpreadPct}%)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40">
                {matrixCurrencies.map((c) => {
                  const rate = dummyMatrixRates[c];
                  const interbankVal = exchangeAmt * rate;
                  const afterSpreadVal = interbankVal * (1 - exchangeSpreadPct / 100);
                  return (
                    <tr key={c}>
                      <td className="py-3 font-bold text-white">{c}</td>
                      <td className="font-mono text-zinc-300">1 USD = {rate}</td>
                      <td className="font-mono text-emerald-400 font-semibold">{interbankVal.toFixed(2)} {c}</td>
                      <td className="font-mono text-[#ff6b00] font-bold">{afterSpreadVal.toFixed(2)} {c}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 14. SHOE SIZE CONVERTER */}
      {toolId === 'shoe-size-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold font-display">International Shoe Size Converter</h3>
            <div className="flex gap-2">
              {(['men', 'women', 'kids'] as const).map((g) => (
                <button
                  key={g}
                  onClick={() => setShoeGender(g)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold capitalize ${
                    shoeGender === g ? 'bg-[#ff6b00] text-white' : 'bg-zinc-800 text-zinc-400'
                  }`}
                >
                  {g}
                </button>
              ))}
            </div>
          </div>

          <div className="max-w-xs mb-6">
            <label className="text-xs font-medium text-zinc-400">Select US Size</label>
            <input
              type="number"
              step="0.5"
              value={shoeUs}
              onChange={(e) => setShoeUs(Number(e.target.value))}
              className={`w-full mt-1 px-4 py-2.5 rounded-xl border text-sm ${inputBg}`}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">US Size</span>
              <p className="text-2xl font-bold font-mono text-white mt-1">{matchedShoe.us}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">UK Size</span>
              <p className="text-2xl font-bold font-mono text-[#ff6b00] mt-1">{matchedShoe.uk}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">EU Size</span>
              <p className="text-2xl font-bold font-mono text-emerald-400 mt-1">{matchedShoe.eu}</p>
            </div>
            <div className="p-4 rounded-xl bg-zinc-800/40 border border-zinc-700/50">
              <span className="text-xs text-zinc-400">Foot Length (CM)</span>
              <p className="text-2xl font-bold font-mono text-zinc-300 mt-1">{matchedShoe.cm} cm</p>
            </div>
          </div>
        </div>
      )}

      {/* 15. CLOTHING SIZE CONVERTER */}
      {toolId === 'clothing-size-converter' && (
        <div className={`p-6 rounded-2xl border ${cardBg}`}>
          <h3 className="text-xl font-bold font-display mb-4">Clothing & Apparel Size Matrix</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-zinc-800 text-zinc-400">
                  <th className="py-2.5">Standard Label</th>
                  <th>US / UK Chest Size</th>
                  <th>European (EU) Size</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/40 font-mono">
                {clothingSizes.map((sz) => (
                  <tr key={sz.label}>
                    <td className="py-3 font-bold text-[#ff6b00] font-display text-sm">{sz.label}</td>
                    <td className="text-white">{sz.us} in</td>
                    <td className="text-zinc-300">{sz.eu}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
