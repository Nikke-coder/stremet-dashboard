import { useState, useEffect } from 'react'
import { supabase, CLIENT } from './supabase.js'
import {
  ComposedChart, BarChart, Bar, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, ReferenceLine
} from 'recharts'

// ─── AUTH ────────────────────────────────────────────────────────────────────
const PASSWORD   = 'kloGheT195@'
const SESSION_KEY = 'stremet_auth'
const ACCENT      = '#818cf8'

// ─── DATA ────────────────────────────────────────────────────────────────────
const MONTHS = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC']

const SEED_DATA = {
  2024: {
    revenue:         [991888,848759,800029,967133,899611,1021817,626056,1171404,983475,1062036,908388,619096],
    stockChange:     [0,-151607,65381,97162,106241,120595,100961,-68269,133764,-324227,-70441,69116],
    rawMaterials:    [-325316,-79126,-472435,-243730,-424234,-460412,-304932,-355765,-412619,-442769,-353334,-466982],
    varStaff:        [-125156,-121221,-98525,-167762,-130749,-106235,-69111,-116800,-165546,-256947,-180160,-276236],
    grossProfit:     [-541416,-496804,-294450,-652803,-450869,-575765,-352975,-630570,-539074,-38093,-304454,55006],
    otherIncome:     [3266,3266,3266,6977,17067,3266,3266,4628,4050,3266,4017,3266],
    staff:           [-168670,-124917,-139205,-157277,-132233,-169304,-138080,-144363,-79617,-125671,-95166,-109581],
    otherOpex:       [-144653,-136005,-148149,-151562,-155340,-170188,-187908,-156329,-143117,-196174,-186731,-219793],
    optionalStaff:   [-14807,-7469,-6396,-6781,-5854,-19085,-7091,-2512,-20115,-4506,-16896,-32987],
    premises:        [-69894,-71970,-71960,-68607,-69986,-68949,-68969,-70698,-69549,-68186,-69116,-70088],
    vehicle:         [-2344,-195,-402,-201,-181,-768,-1928,-125,-420,0,-286,-844],
    itSoftware:      [-10360,-7938,-7291,-6924,-38453,-7656,-14449,-30232,-12522,-37660,-10363,-10615],
    machinery:       [-3482,-22052,-18502,-39616,-12886,-14626,-36310,-6843,-22894,-28185,-52393,-30856],
    travel:          [-3131,-2482,-1865,-1772,-4388,-94,-6235,-1162,-1667,-1807,-4005,-3626],
    selling:         [-6025,-6460,-10088,-11698,-11094,-13244,-14659,-28435,-6754,-12524,-15742,-14118],
    marketing:       [-550,-126,-315,-1500,-784,-1000,-6957,-2200,0,-4644,0,-1246],
    outsourcedAdmin: [-19959,-13592,-23377,-13042,-9520,-13177,-22442,-11403,-6115,-8400,-12617,-10675],
    otherAdmin:      [-13551,-3722,-3453,-1421,-2195,-1506,-8869,-2719,-2283,-30685,-2929,-3893],
    ebitda:          [-231359,-239149,-10363,-350941,-180362,-239539,-30253,-334505,-320389,280487,-26574,381114],
    depreciation:    [-32056,-32056,-32056,-37712,-37712,-37712,-37712,-38494,-38494,-38494,-39764,-194668],
    ebit:            [-199303,-207093,21694,-313229,-142650,-201827,7459,-296012,-281895,318981,13190,575782],
    financialInc:    [4024,7450,3288,3205,6848,2894,2746,8787,4361,3734,6030,-7951],
    profitBTax:      [-195279,-199642,24981,-310024,-135802,-198934,10205,-287224,-277535,322714,19221,567831],
    taxes:           [-7843,-7843,-7843,-7843,-7843,-7843,-7843,-7834,-30064,-30064,-27321,16202],
    netProfit:       [187435,191799,-32825,302181,127959,191090,-18048,279390,247471,-352778,-46541,-551630],
    totalAssets:     [4953920,5214528,5269138,5466389,5549987,5546233,5022787,5849111,5961555,5762513,5672875,4813465],
    nonCurrentAssets:[1626265,1594209,1562153,1548913,1511201,1473488,1437796,2067335,2038592,2000098,1970920,1782772],
    currentAssets:   [3327656,3620319,3706985,3917476,4038787,4072745,3584991,3781776,3922963,3762416,3701956,3030693],
    inventory:       [1276329,1391566,1388071,1607699,1719824,1689462,1796461,1790559,1775936,1451688,1448531,1377943],
    shortDebtors:    [1377102,1635302,1588584,1679858,1645623,1740719,1372620,1740659,2055898,2105216,1707492,1226836],
    cash:            [585225,504450,641330,510919,554340,523564,296910,131558,-27871,86511,426933,306915],
    equity:          [1679361,1871160,1838335,2140516,2268475,2459565,2441517,2720907,2718407,2365629,2319087,1767457],
    longCreditors:   [1263587,1177533,1141479,1105425,1019371,983318,947264,1261210,1225156,1189102,1103049,1100733],
    shortCreditors:  [2010973,2165835,2289324,2220448,2262141,2103350,1634006,1866994,2017992,2207782,2250740,1945274],
    tradeCreditors:  [1018232,1092845,1274232,1114264,1113013,1259154,964705,1146942,922853,1088567,1228582,891281],
    loans:           [600000,600000,600000,600000,600000,600000,600000,1000000,1000000,1000000,1000000,763253],
  },
  2025: {
    revenue:         [1221376,1318476,1265615,1094105,1209966,1209825,1104377,1114144,1072649,1055784,878274,797849],
    stockChange:     [-142298,70690,17167,36917,-24334,-66761,146273,-102840,-39061,67326,-68783,-40737],
    rawMaterials:    [-237739,-649974,-541596,-471916,-500601,-575102,-368989,-353392,-410499,-403315,-343477,-311398],
    varStaff:        [-114001,-160870,-178677,-307430,-193647,-220847,-131863,-139263,-176166,-275246,-194730,-361716],
    grossProfit:     [-727338,-578323,-562509,-351677,-491385,-347115,-749798,-518650,-446923,-444548,-271284,-83998],
    otherIncome:     [3309,4812,3309,4812,4577,3709,5220,4670,115608,3309,4411,3242],
    staff:           [-216261,-94950,-110372,-205492,-138725,-181200,-135374,-147310,-140458,-143891,-130070,-172686],
    otherOpex:       [-220299,-112205,-205165,-156054,-125008,-207075,-155299,-210218,-167302,-147014,-202743,-177619],
    optionalStaff:   [-4372,9422,-7418,-11403,-10114,-50923,-2007,-13505,-15542,-6547,-26677,-28039],
    premises:        [-69668,-68188,-68409,-70057,-69761,-69919,-67872,-70497,-69328,-72145,-85428,-70757],
    vehicle:         [-2174,18830,-426,-252,-627,-464,-1955,-612,-229,-261,-600,-299],
    itSoftware:      [-7367,-9979,-30632,-15461,-12992,-24645,-22356,-19842,-13734,-21573,-19459,-35619],
    machinery:       [-66777,-15006,-36925,-37498,-15017,-28803,-35231,-67088,-29926,-24953,-45348,-20240],
    travel:          [-3471,-7668,-2827,-2097,-2699,-121,-2626,-870,-8432,-1837,-2588,-1357],
    selling:         [-22027,-13812,-6266,-8710,-7406,-12077,-9855,-13671,-6163,-9580,-15578,-10230],
    marketing:       [-3,-3283,-380,-1010,-1380,-2413,-1137,-2894,-15786,-2003,-380,-1960],
    outsourcedAdmin: [-26439,-19691,-22058,-4959,-3644,-16544,-2557,-21417,-10704,-2669,-3259,-3233],
    otherAdmin:      [-12526,-2937,-29824,-2585,-1312,-1307,-9704,200,-2420,-3258,-3330,-3616],
    ebitda:          [-294087,-375979,-250281,5057,-232230,37452,-464345,-165792,-254772,-156953,57118,263065],
    depreciation:    [-25683,-33683,-34781,-34831,-50044,-50711,-50711,-50916,-28730,-28730,-27403,-75386],
    ebit:            [-268404,-342295,-215499,39889,-182186,88162,-413634,-114876,-226043,-128223,84522,338452],
    financialInc:    [3511,6529,3978,3516,4696,6381,2991,5019,6786,3492,5332,-623],
    profitBTax:      [-264893,-335766,-211521,43404,-177490,94543,-410643,-109857,-219256,-124731,89854,337829],
    taxes:           [-1720,-1720,-1720,-1720,-1720,-1720,-1720,-18335,-18335,-18335,-123412,-71837],
    netProfit:       [263173,334046,209801,-45124,175770,-96263,408923,91522,200921,106396,-213266,-409666],
    totalAssets:     [5245567,5789250,5797983,5801838,6001709,5638049,5479006,5687868,5874011,5932694,5696978,5618089],
    nonCurrentAssets:[1757088,1723405,1739312,1706886,1695842,1677131,1626421,1585350,1573282,1544553,1524533,1829099],
    currentAssets:   [3488478,4065844,4058671,4094952,4305867,3960918,3852586,4102518,4300728,4388141,4172445,3788990],
    inventory:       [1468893,1502046,1410885,1467324,1418167,1320136,1431512,1363799,1393122,1404292,1310195,1376513],
    shortDebtors:    [1667698,2372442,2482295,2232280,2200370,2317683,2184654,1997253,2203066,1943683,1847771,1337232],
    cash:            [232888,72357,46491,276348,568331,204099,117419,622465,585540,921166,895479,956244],
    equity:          [2030631,2364677,2574478,2529353,2705124,2308716,2717639,2809161,3010082,3116478,2903212,2493546],
    longCreditors:   [1064680,978626,942572,906518,820464,784411,759925,685440,654836,624233,543629,931129],
    shortCreditors:  [2150257,2445947,2280933,2365966,2476121,2544922,2001442,2193267,2209092,2191984,2250137,2193414],
    tradeCreditors:  [1048760,1263872,1078948,1060536,1162690,1218997,842409,1084937,1142497,1089247,1175593,1023314],
    loans:           [763253,763253,763253,763253,763253,763253,763253,763253,763253,763253,763253,498193],
  },
  2026: {
    revenue:[],rawMaterials:[],varStaff:[],staff:[],otherOpex:[],depreciation:[],ebit:[],
    netProfit:[],totalAssets:[],currentAssets:[],inventory:[],cash:[],equity:[],
    longCreditors:[],shortCreditors:[],loans:[]
  }
}

const DEADLINES = [
  {month:'JAN',deadline:'16 Feb 2026',apClose:'11 Feb',invoicing:'6 Feb'},
  {month:'FEB',deadline:'16 Mar 2026',apClose:'11 Mar',invoicing:'6 Mar'},
  {month:'MAR',deadline:'15 Apr 2026',apClose:'10 Apr',invoicing:'5 Apr'},
  {month:'APR',deadline:'15 May 2026',apClose:'10 May',invoicing:'5 May'},
  {month:'MAY',deadline:'15 Jun 2026',apClose:'10 Jun',invoicing:'5 Jun'},
  {month:'JUN',deadline:'7 Aug 2026', apClose:'2 Aug', invoicing:'28 Jul'},
  {month:'JUL',deadline:'17 Aug 2026',apClose:'12 Aug',invoicing:'7 Aug'},
  {month:'AUG',deadline:'15 Sep 2026',apClose:'10 Sep',invoicing:'5 Sep'},
  {month:'SEP',deadline:'15 Oct 2026',apClose:'10 Oct',invoicing:'5 Oct'},
  {month:'OCT',deadline:'16 Nov 2026',apClose:'11 Nov',invoicing:'6 Nov'},
  {month:'NOV',deadline:'15 Dec 2026',apClose:'10 Dec',invoicing:'5 Dec'},
  {month:'DEC',deadline:'15 Jan 2027',apClose:'10 Jan',invoicing:'5 Jan'},
]

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const sum  = arr => (arr||[]).reduce((a,b) => a + (b||0), 0)
const fmt  = (n, short=false) => {
  if (n === null || n === undefined || isNaN(n)) return '–'
  const abs = Math.abs(n)
  if (short && abs >= 1000000) return (n/1000000).toFixed(2) + 'M'
  if (short && abs >= 1000)    return (n/1000).toFixed(0) + 'k'
  return new Intl.NumberFormat('fi-FI', { style:'currency', currency:'EUR', maximumFractionDigits:0 }).format(n)
}
const pct = n => (n === null || isNaN(n)) ? '–' : (n*100).toFixed(1) + '%'

// ─── UI ATOMS ─────────────────────────────────────────────────────────────────
const KPI = ({ label, value, sub, color=ACCENT }) => (
  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 18px', position:'relative', overflow:'hidden' }}>
    <div style={{ position:'absolute', top:0, left:0, right:0, height:2, background:color }} />
    <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.12em', color:'#475569', textTransform:'uppercase', marginBottom:6 }}>{label}</div>
    <div style={{ fontSize:20, fontWeight:700, color:'#f1f5f9', fontFamily:'monospace' }}>{value}</div>
    {sub && <div style={{ fontSize:11, color:'#475569', marginTop:3 }}>{sub}</div>}
  </div>
)

const ST = ({ children, mt=28 }) => (
  <div style={{ fontSize:10, fontWeight:700, letterSpacing:'0.14em', textTransform:'uppercase', color:'#334155', marginBottom:12, marginTop:mt, paddingBottom:6, borderBottom:'1px solid rgba(255,255,255,0.05)' }}>{children}</div>
)

const YearBtn = ({ year, active, onClick }) => (
  <button onClick={onClick} style={{ padding:'4px 14px', borderRadius:16, border:'none', cursor:'pointer', background:active ? ACCENT : 'rgba(255,255,255,0.05)', color:active ? '#080b12' : '#64748b', fontWeight:700, fontSize:12, transition:'all 0.12s', fontFamily:'inherit' }}>{year}</button>
)

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background:'#1e293b', border:'1px solid rgba(255,255,255,0.1)', borderRadius:8, padding:'10px 14px', fontSize:11 }}>
      <div style={{ color:'#64748b', marginBottom:5, fontWeight:700 }}>{label}</div>
      {payload.map(p => <div key={p.dataKey} style={{ color:p.color||p.fill, marginBottom:2 }}>{p.name}: <strong>{fmt(p.value, true)}</strong></div>)}
    </div>
  )
}

const NoBudget = () => (
  <div style={{ background:'rgba(255,255,255,0.03)', border:'1px dashed rgba(255,255,255,0.08)', borderRadius:12, padding:40, textAlign:'center', color:'#334155' }}>
    <div style={{ fontSize:36, marginBottom:12 }}>📋</div>
    <div style={{ fontSize:15, fontWeight:600, color:'#64748b', marginBottom:8 }}>2026 Budget Not Yet Entered</div>
    <div style={{ fontSize:13 }}>Enter budget figures in the Excel BUD sheet to populate this view.</div>
  </div>
)

// ─── P&L VIEW ─────────────────────────────────────────────────────────────────
function PLView({ data }) {
  const [yr, setYr] = useState(2025)
  const d = data[yr] || SEED_DATA[yr] || {}
  const has = yr !== 2026 && sum(d.revenue||[]) !== 0

  const tRev   = sum(d.revenue)
  const tEbit  = sum(d.ebit)
  const tEbitda= sum(d.ebitda)
  const tNet   = sum(d.netProfit)
  const tMat   = sum(d.rawMaterials)
  const grossPct = tRev !== 0 ? (tRev + tMat + sum(d.varStaff||[]) + sum(d.stockChange||[])) / tRev : 0
  const netPct   = tRev !== 0 ? tNet / tRev : 0

  const prevD    = data[yr-1] || SEED_DATA[yr-1] || {}
  const prevRev  = sum(prevD.revenue||[])
  const revGrowth= prevRev !== 0 ? ((tRev - prevRev) / Math.abs(prevRev)) * 100 : null

  const chartData = MONTHS.map((m,i) => ({
    month: m,
    Revenue:       (d.revenue||[])[i]||0,
    EBITDA:        (d.ebitda||[])[i]||0,
    EBIT:          (d.ebit||[])[i]||0,
    'Net Profit':  (d.netProfit||[])[i]||0,
  }))

  const costData = MONTHS.map((m,i) => ({
    month: m,
    'Raw Materials': Math.abs((d.rawMaterials||[])[i]||0),
    'Staff':         Math.abs(((d.staff||[])[i]||0) + ((d.varStaff||[])[i]||0)),
    'Premises':      Math.abs((d.premises||[])[i]||0),
    'Other':         Math.abs((d.otherOpex||[])[i]||0),
  }))

  const plLines = [
    { l:'Revenue',                     v:tRev,                          c:ACCENT },
    { l:'Stock Change',                v:sum(d.stockChange||[]),        c:'#64748b' },
    { l:'Raw Materials & Ext. Serv.',  v:tMat,                          c:'#f87171' },
    { l:'Variable Staff',              v:sum(d.varStaff||[]),           c:'#f87171' },
    { l:'Gross Profit',                v:sum(d.grossProfit||[]),        c:sum(d.grossProfit||[])>=0?'#34d399':'#f87171', b:true },
    { l:'Other Operating Income',      v:sum(d.otherIncome||[]),        c:'#64748b' },
    { l:'Staff Expenses',              v:sum(d.staff||[]),              c:'#f87171' },
    { l:'Other OPEX',                  v:sum(d.otherOpex||[]),          c:'#f87171' },
    { l:'Optional Staff',              v:sum(d.optionalStaff||[]),      c:'#f87171' },
    { l:'Premises',                    v:sum(d.premises||[]),           c:'#f87171' },
    { l:'IT & Software',               v:sum(d.itSoftware||[]),         c:'#f87171' },
    { l:'Machinery',                   v:sum(d.machinery||[]),          c:'#f87171' },
    { l:'Travel',                      v:sum(d.travel||[]),             c:'#f87171' },
    { l:'Selling',                     v:sum(d.selling||[]),            c:'#f87171' },
    { l:'Marketing',                   v:sum(d.marketing||[]),          c:'#f87171' },
    { l:'Outsourced Admin',            v:sum(d.outsourcedAdmin||[]),    c:'#f87171' },
    { l:'Other Admin',                 v:sum(d.otherAdmin||[]),         c:'#f87171' },
    { l:'EBITDA',                      v:tEbitda,                       c:tEbitda>=0?'#34d399':'#f87171', b:true },
    { l:'Depreciation',                v:sum(d.depreciation||[]),       c:'#64748b' },
    { l:'EBIT',                        v:tEbit,                         c:tEbit>=0?'#34d399':'#f87171', b:true },
    { l:'Financial Items',             v:sum(d.financialInc||[]),       c:'#64748b' },
    { l:'Profit Before Tax',           v:sum(d.profitBTax||[]),         c:sum(d.profitBTax||[])>=0?'#34d399':'#f87171', b:true },
    { l:'Income Taxes',                v:sum(d.taxes||[]),              c:'#64748b' },
    { l:'Net Profit',                  v:tNet,                          c:tNet>=0?'#34d399':'#f87171', b:true },
  ]

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, alignItems:'center' }}>
        {[2024,2025,2026].map(y => <YearBtn key={y} year={y} active={yr===y} onClick={()=>setYr(y)}/>)}
        {revGrowth !== null && yr === 2025 && (
          <span style={{ fontSize:11, color:revGrowth>=0?'#34d399':'#f87171', marginLeft:4 }}>
            {revGrowth>=0?'▲':'▼'} {Math.abs(revGrowth).toFixed(1)}% vs 2024
          </span>
        )}
      </div>

      {yr === 2026 ? <NoBudget/> : !has ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#334155' }}>No data for {yr}</div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:10, marginBottom:22 }}>
            <KPI label="Revenue"    value={fmt(tRev,true)}    color={ACCENT}/>
            <KPI label="Gross %"    value={pct(grossPct)}     color={grossPct>=0?'#34d399':'#f87171'}/>
            <KPI label="EBITDA"     value={fmt(tEbitda,true)} color={tEbitda>=0?'#34d399':'#f87171'}/>
            <KPI label="EBIT"       value={fmt(tEbit,true)}   color={tEbit>=0?'#34d399':'#f87171'}/>
            <KPI label="Net Profit" value={fmt(tNet,true)}    color={tNet>=0?'#34d399':'#f87171'} sub={pct(netPct)+' margin'}/>
          </div>

          <ST>Monthly Revenue & Profitability — {yr}</ST>
          <div style={{ height:230, marginBottom:22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={chartData} margin={{top:0,right:0,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="month" tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>fmt(v,true)} tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{fontSize:11,color:'#475569'}}/>
                <Bar dataKey="Revenue" fill={ACCENT} opacity={0.7} radius={[2,2,0,0]}/>
                <Line type="monotone" dataKey="EBITDA"     stroke="#f59e0b" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="EBIT"       stroke="#34d399" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="Net Profit" stroke="#f87171" strokeWidth={2} dot={false} strokeDasharray="4 3"/>
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)"/>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <ST>Cost Structure — {yr}</ST>
          <div style={{ height:200, marginBottom:22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={costData} margin={{top:0,right:0,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="month" tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>fmt(v,true)} tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{fontSize:11,color:'#475569'}}/>
                <Bar dataKey="Raw Materials" fill="#f87171" opacity={0.85} stackId="c"/>
                <Bar dataKey="Staff"         fill={ACCENT}  opacity={0.85} stackId="c"/>
                <Bar dataKey="Premises"      fill="#f59e0b" opacity={0.85} stackId="c"/>
                <Bar dataKey="Other"         fill="#64748b" opacity={0.85} stackId="c" radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ST>2024 vs 2025 Revenue Trend</ST>
          <div style={{ height:180, marginBottom:22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHS.map((m,i)=>({ month:m, '2024':(SEED_DATA[2024].revenue||[])[i], '2025':(SEED_DATA[2025].revenue||[])[i] }))} margin={{top:0,right:0,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="month" tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>fmt(v,true)} tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{fontSize:11,color:'#475569'}}/>
                <Line type="monotone" dataKey="2024" stroke="#475569" strokeWidth={2} dot={false} strokeDasharray="4 3"/>
                <Line type="monotone" dataKey="2025" stroke={ACCENT}  strokeWidth={2} dot={false}/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <ST>Full P&L — {yr} Annual</ST>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:6, marginBottom:22 }}>
            {plLines.map(({ l, v, c, b }) => (
              <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'7px 12px', background:b?'rgba(255,255,255,0.04)':'transparent', borderRadius:6, border:b?'1px solid rgba(255,255,255,0.07)':'none' }}>
                <span style={{ fontSize:12, color:b?'#e2e8f0':'#64748b', fontWeight:b?700:400 }}>{l}</span>
                <span style={{ fontSize:12, color:c, fontWeight:b?700:400, fontFamily:'monospace' }}>{fmt(v,true)}</span>
              </div>
            ))}
          </div>

          <ST>Monthly P&L Table — {yr}</ST>
          <div style={{ overflowX:'auto' }}>
            <table style={{ width:'100%', fontSize:11, fontFamily:'monospace' }}>
              <thead>
                <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
                  <th style={{ textAlign:'left', padding:'7px 10px', color:'#475569', minWidth:160 }}>Line</th>
                  {MONTHS.map(m => <th key={m} style={{ textAlign:'right', padding:'7px 5px', color:'#475569', minWidth:60 }}>{m}</th>)}
                  <th style={{ textAlign:'right', padding:'7px 10px', color:'#475569' }}>TOTAL</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { l:'Revenue',        a:d.revenue,      c:'#e2e8f0' },
                  { l:'Raw Materials',  a:d.rawMaterials, c:'#94a3b8' },
                  { l:'Variable Staff', a:d.varStaff,     c:'#94a3b8' },
                  { l:'Gross Profit',   a:d.grossProfit,  c:null, b:true },
                  { l:'Staff Expenses', a:d.staff,        c:'#94a3b8' },
                  { l:'Other OPEX',     a:d.otherOpex,    c:'#94a3b8' },
                  { l:'Depreciation',   a:d.depreciation, c:'#64748b' },
                  { l:'EBIT',           a:d.ebit,         c:null, b:true },
                  { l:'Net Profit',     a:d.netProfit,    c:null, b:true },
                ].map(({ l, a, c, b }) => {
                  const tot = sum(a||[])
                  const isDyn = c === null
                  const clr = isDyn ? (tot>=0?'#34d399':'#f87171') : c
                  return (
                    <tr key={l} style={{ borderBottom:'1px solid rgba(255,255,255,0.03)', background:b?'rgba(255,255,255,0.02)':'transparent' }}>
                      <td style={{ padding:'5px 10px', color:clr, fontWeight:b?700:400 }}>{l}</td>
                      {(a||[]).map((v,i) => {
                        const vc = isDyn ? (v>=0?'#34d399':'#f87171') : c
                        return <td key={i} style={{ textAlign:'right', padding:'5px 5px', color:vc, fontWeight:b?700:400 }}>{v!==0?fmt(v,true):'–'}</td>
                      })}
                      <td style={{ textAlign:'right', padding:'5px 10px', color:isDyn?(tot>=0?'#34d399':'#f87171'):c, fontWeight:700 }}>{fmt(tot,true)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  )
}

// ─── BALANCE SHEET VIEW ───────────────────────────────────────────────────────
function BSView({ data }) {
  const [yr, setYr] = useState(2025)
  const d = data[yr] || SEED_DATA[yr] || {}
  const has = yr !== 2026 && sum(d.totalAssets||[]) !== 0
  const li = 11

  const lastA  = d.totalAssets?.[li]||0
  const lastE  = d.equity?.[li]||0
  const lastC  = d.cash?.[li]||0
  const lastI  = d.inventory?.[li]||0
  const lastNC = d.nonCurrentAssets?.[li]||0
  const lastCur= d.currentAssets?.[li]||0
  const lastSC = d.shortCreditors?.[li]||0
  const lastLC = d.longCreditors?.[li]||0
  const lastL  = d.loans?.[li]||0
  const lastTC = d.tradeCreditors?.[li]||0
  const lastD  = d.shortDebtors?.[li]||0
  const eqRatio  = lastA !== 0 ? lastE / lastA : 0
  const curRatio = lastSC !== 0 ? lastCur / lastSC : 0

  return (
    <div>
      <div style={{ display:'flex', gap:8, marginBottom:20, alignItems:'center' }}>
        {[2024,2025,2026].map(y => <YearBtn key={y} year={y} active={yr===y} onClick={()=>setYr(y)}/>)}
        {has && <span style={{ fontSize:11, color:'#334155', marginLeft:4 }}>Latest: {MONTHS[li]}</span>}
      </div>

      {yr === 2026 ? <NoBudget/> : !has ? (
        <div style={{ textAlign:'center', padding:'60px 0', color:'#334155' }}>No data for {yr}</div>
      ) : (
        <>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(6,1fr)', gap:10, marginBottom:22 }}>
            <KPI label="Total Assets"  value={fmt(lastA,true)}              color={ACCENT}/>
            <KPI label="Equity"        value={fmt(lastE,true)}              color="#34d399"/>
            <KPI label="Equity Ratio"  value={pct(eqRatio)}                 color="#34d399"/>
            <KPI label="Cash"          value={fmt(lastC,true)}              color="#f59e0b"/>
            <KPI label="Inventory"     value={fmt(lastI,true)}              color="#94a3b8"/>
            <KPI label="Current Ratio" value={curRatio.toFixed(2)+'x'}      color={curRatio>=1?'#34d399':'#f87171'}/>
          </div>

          <ST>Total Assets — {yr}</ST>
          <div style={{ height:200, marginBottom:22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MONTHS.map((m,i)=>({ month:m, 'Current Assets':(d.currentAssets||[])[i]||0, 'Non-Current':(d.nonCurrentAssets||[])[i]||0 }))} margin={{top:0,right:0,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="month" tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>fmt(v,true)} tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{fontSize:11,color:'#475569'}}/>
                <Bar dataKey="Current Assets" fill={ACCENT}  opacity={0.8} stackId="a"/>
                <Bar dataKey="Non-Current"    fill="#334155" opacity={0.9} stackId="a" radius={[2,2,0,0]}/>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <ST>Working Capital — {yr}</ST>
          <div style={{ height:200, marginBottom:22 }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={MONTHS.map((m,i)=>({ month:m, Cash:(d.cash||[])[i]||0, Inventory:(d.inventory||[])[i]||0, 'Trade Debtors':(d.shortDebtors||[])[i]||0 }))} margin={{top:0,right:0,left:0,bottom:0}}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)"/>
                <XAxis dataKey="month" tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <YAxis tickFormatter={v=>fmt(v,true)} tick={{fill:'#475569',fontSize:11}} axisLine={false} tickLine={false}/>
                <Tooltip content={<CustomTooltip/>}/>
                <Legend wrapperStyle={{fontSize:11,color:'#475569'}}/>
                <Line type="monotone" dataKey="Cash"          stroke="#f59e0b" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="Inventory"     stroke="#94a3b8" strokeWidth={2} dot={false}/>
                <Line type="monotone" dataKey="Trade Debtors" stroke={ACCENT}  strokeWidth={2} dot={false}/>
                <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)"/>
              </LineChart>
            </ResponsiveContainer>
          </div>

          <ST>Balance Sheet Summary — {yr} Dec</ST>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'#475569', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Assets</div>
              {[
                { l:'Non-Current Assets',   v:lastNC },
                { l:'Current Assets',       v:lastCur },
                { l:'  Inventory',          v:lastI,  indent:true },
                { l:'  Trade Debtors',      v:lastD,  indent:true },
                { l:'  Cash',               v:lastC,  indent:true },
                { l:'TOTAL ASSETS',         v:lastA,  b:true },
              ].map(({ l, v, b, indent }) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 10px', background:b?'rgba(255,255,255,0.04)':'transparent', borderRadius:4, marginBottom:2 }}>
                  <span style={{ fontSize:11, color:indent?'#475569':'#94a3b8', fontWeight:b?700:400, paddingLeft:indent?12:0 }}>{l}</span>
                  <span style={{ fontSize:11, color:b?'#f1f5f9':'#64748b', fontFamily:'monospace', fontWeight:b?700:400 }}>{fmt(v,true)}</span>
                </div>
              ))}
            </div>
            <div>
              <div style={{ fontSize:11, fontWeight:700, color:'#475569', marginBottom:8, textTransform:'uppercase', letterSpacing:'0.1em' }}>Equity & Liabilities</div>
              {[
                { l:'Equity',               v:lastE,  color:'#34d399' },
                { l:'Long-term Creditors',  v:lastLC },
                { l:'  Bank Loans',         v:lastL,  indent:true },
                { l:'Short-term Creditors', v:lastSC },
                { l:'  Trade Creditors',    v:lastTC, indent:true },
                { l:'TOTAL E&L',            v:lastA,  b:true },
              ].map(({ l, v, b, indent, color }) => (
                <div key={l} style={{ display:'flex', justifyContent:'space-between', padding:'5px 10px', background:b?'rgba(255,255,255,0.04)':'transparent', borderRadius:4, marginBottom:2 }}>
                  <span style={{ fontSize:11, color:indent?'#475569':'#94a3b8', fontWeight:b?700:400, paddingLeft:indent?12:0 }}>{l}</span>
                  <span style={{ fontSize:11, color:color||(b?'#f1f5f9':'#64748b'), fontFamily:'monospace', fontWeight:b?700:400 }}>{fmt(v,true)}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// ─── DEADLINES VIEW ───────────────────────────────────────────────────────────
function DeadlinesView() {
  const today = new Date()
  return (
    <div>
      <ST mt={0}>Reporting Deadlines 2026</ST>
      <div style={{ overflowX:'auto', marginBottom:24 }}>
        <table style={{ width:'100%', fontSize:12 }}>
          <thead>
            <tr style={{ borderBottom:'1px solid rgba(255,255,255,0.08)' }}>
              {['Month','Deadline @ 2pm','AP Closed','Invoicing Done'].map(h =>
                <th key={h} style={{ textAlign:'left', padding:'8px 12px', color:'#475569', fontWeight:700 }}>{h}</th>
              )}
            </tr>
          </thead>
          <tbody>
            {DEADLINES.map((d, i) => {
              const dl = new Date(d.deadline)
              const ip = dl < today
              const is = !ip && (dl - today) < 14*24*3600*1000
              const sc = ip ? '#334155' : is ? '#f59e0b' : '#34d399'
              return (
                <tr key={i} style={{ borderBottom:'1px solid rgba(255,255,255,0.04)', opacity:ip?0.5:1 }}>
                  <td style={{ padding:'9px 12px', fontWeight:700, color:'#f1f5f9' }}>{d.month}</td>
                  <td style={{ padding:'9px 12px' }}>
                    <span style={{ color:sc, fontWeight:600 }}>{d.deadline}</span>
                    <span style={{ fontSize:10, marginLeft:6, color:sc, background:`${sc}20`, padding:'1px 6px', borderRadius:8 }}>{ip?'DONE':is?'SOON':'OPEN'}</span>
                  </td>
                  <td style={{ padding:'9px 12px', color:'#475569', fontSize:11 }}>{d.apClose}</td>
                  <td style={{ padding:'9px 12px', color:'#475569', fontSize:11 }}>{d.invoicing}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <ST>Closing Process Reminders</ST>
      <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(240px,1fr))', gap:10 }}>
        {[
          { e:'📦', t:'AP Closed',           d:'5 days before deadline' },
          { e:'🧾', t:'Receipts & Clearing', d:'Same day as AP close' },
          { e:'🏭', t:'Inventory & WIP',     d:'2 days before deadline' },
          { e:'📊', t:'Accruals Submitted',  d:'Same day as AP close' },
          { e:'💳', t:'Sales Invoicing',     d:'10 days before deadline' },
          { e:'📋', t:'No July Board Mtg',   d:'Jun & Jul combined in Aug' },
        ].map(({ e, t, d }) => (
          <div key={t} style={{ background:'rgba(255,255,255,0.03)', border:'1px solid rgba(255,255,255,0.07)', borderRadius:10, padding:'14px 16px', display:'flex', gap:12, alignItems:'flex-start' }}>
            <span style={{ fontSize:20 }}>{e}</span>
            <div>
              <div style={{ fontSize:12, fontWeight:700, color:'#94a3b8', marginBottom:3 }}>{t}</div>
              <div style={{ fontSize:11, color:'#475569' }}>{d}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── LOGIN ────────────────────────────────────────────────────────────────────
function Login({ onSuccess }) {
  const [pw, setPw]   = useState('')
  const [err, setErr] = useState(false)
  const attempt = () => {
    if (pw === PASSWORD) { sessionStorage.setItem(SESSION_KEY, '1'); onSuccess() }
    else { setErr(true); setTimeout(() => setErr(false), 1500) }
  }
  return (
    <div style={{ minHeight:'100vh', background:'#080b12', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:"'DM Mono','Courier New',monospace" }}>
      <div style={{ width:340, textAlign:'center' }}>
        <div style={{ fontSize:11, letterSpacing:'0.3em', color:'#334155', marginBottom:12, textTransform:'uppercase' }}>Board Dashboard</div>
        <div style={{ fontSize:32, fontWeight:800, letterSpacing:'-0.03em', color:'#f1f5f9', marginBottom:4 }}>Stremet</div>
        <div style={{ width:40, height:2, background:ACCENT, margin:'0 auto 32px' }}/>
        <input
          type="password" placeholder="Enter password" value={pw}
          onChange={e => setPw(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && attempt()}
          style={{ width:'100%', padding:'13px 16px', background:'rgba(255,255,255,0.04)', border:`1px solid ${err?'#f87171':'rgba(255,255,255,0.1)'}`, borderRadius:8, color:'#f1f5f9', fontSize:14, outline:'none', fontFamily:'inherit', marginBottom:10 }}
          autoFocus
        />
        <button onClick={attempt} style={{ width:'100%', padding:'13px', background:ACCENT, border:'none', borderRadius:8, color:'#080b12', fontWeight:800, fontSize:14, cursor:'pointer', fontFamily:'inherit' }}>ENTER</button>
        {err && <div style={{ marginTop:10, color:'#f87171', fontSize:13 }}>Incorrect password</div>}
      </div>
    </div>
  )
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
const TABS = [
  { id:'pl',        label:'P & L' },
  { id:'bs',        label:'Balance Sheet' },
  { id:'deadlines', label:'Deadlines' },
]

export default function App() {
  const [authed,   setAuthed]   = useState(!!sessionStorage.getItem(SESSION_KEY))
  const [tab,      setTab]      = useState('pl')
  const [dbStatus, setDbStatus] = useState('idle')
  const [liveData, setLiveData] = useState(null)

  useEffect(() => { if (authed) loadFromSupabase() }, [authed])

  const loadFromSupabase = async () => {
    if (!supabase) { setDbStatus('offline'); return }
    setDbStatus('loading')
    try {
      const { data, error } = await supabase.from('dashboard_pnl').select('*').eq('client', CLIENT)
      if (error) throw error
      if (!data || data.length === 0) { setDbStatus('ok'); await seedDatabase(); return }
      const structured = {}
      data.forEach(row => {
        if (!structured[row.year]) structured[row.year] = {}
        if (!structured[row.year][row.line_item]) structured[row.year][row.line_item] = Array(12).fill(0)
        structured[row.year][row.line_item][row.month_index] = row.value
      })
      setLiveData(structured)
      setDbStatus('ok')
    } catch (e) { console.error(e); setDbStatus('error') }
  }

  const seedDatabase = async () => {
    if (!supabase) return
    const rows = []
    Object.entries(SEED_DATA).forEach(([year, yd]) => {
      Object.entries(yd).forEach(([line_item, arr]) => {
        ;(arr||[]).forEach((value, month_index) => {
          if (value !== 0 && value !== null && value !== undefined)
            rows.push({ client: CLIENT, entity: '', year: parseInt(year), line_item, month_index, value })
        })
      })
    })
    if (rows.length > 0) {
      const { error } = await supabase.from('dashboard_pnl').upsert(rows, { onConflict:'client,entity,year,line_item,month_index' })
      if (!error) await loadFromSupabase()
    }
  }

  const data = liveData || SEED_DATA

  if (!authed) return <Login onSuccess={() => setAuthed(true)}/>

  return (
    <div style={{ minHeight:'100vh', background:'#080b12', color:'#e2e8f0', fontFamily:"'DM Mono','Courier New',monospace" }}>
      <header style={{ borderBottom:'1px solid rgba(255,255,255,0.05)', padding:'0 28px', display:'flex', alignItems:'center', justifyContent:'space-between', height:52, position:'sticky', top:0, zIndex:100, background:'rgba(8,11,18,0.97)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ fontSize:16, fontWeight:800, letterSpacing:'-0.02em', color:'#f1f5f9' }}>Stremet</div>
          <div style={{ width:1, height:16, background:'rgba(255,255,255,0.08)' }}/>
          <div style={{ fontSize:11, color:'#334155', letterSpacing:'0.05em' }}>Board Dashboard</div>
        </div>
        <nav style={{ display:'flex', gap:2 }}>
          {TABS.map(t => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding:'5px 14px', borderRadius:6, border:'none', cursor:'pointer', background:tab===t.id?`${ACCENT}20`:'transparent', color:tab===t.id?ACCENT:'#475569', fontWeight:tab===t.id?700:400, fontSize:12, fontFamily:'inherit', transition:'all 0.12s' }}>{t.label}</button>
          ))}
        </nav>
        <div style={{ display:'flex', alignItems:'center', gap:6, fontSize:11, color:'#334155' }}>
          <span style={{ width:6, height:6, borderRadius:'50%', background:dbStatus==='ok'?'#34d399':dbStatus==='loading'?'#f59e0b':dbStatus==='offline'?'#475569':'#f87171', display:'inline-block' }}/>
          {dbStatus==='ok'?'Supabase':dbStatus==='loading'?'Syncing…':dbStatus==='offline'?'Offline':'Error'}
        </div>
      </header>

      <main style={{ padding:'24px 28px', maxWidth:1400, margin:'0 auto' }}>
        <h1 style={{ fontSize:18, fontWeight:800, color:'#f1f5f9', marginBottom:22, letterSpacing:'-0.02em' }}>
          {TABS.find(t => t.id === tab)?.label}
          <span style={{ fontSize:12, color:'#334155', fontWeight:400, marginLeft:10 }}>ACT data · 2024–2026</span>
        </h1>
        {tab === 'pl'        && <PLView data={data}/>}
        {tab === 'bs'        && <BSView data={data}/>}
        {tab === 'deadlines' && <DeadlinesView/>}
      </main>

      <div style={{ textAlign:'center', padding:'18px', borderTop:'1px solid rgba(255,255,255,0.04)', fontSize:11, color:'#1e293b' }}>
        Stremet · Board Dashboard · Confidential · {new Date().getFullYear()}
      </div>
    </div>
  )
}
