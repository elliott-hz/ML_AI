import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import FunctionPlotter, { ASPECT_RATIO_OPTIONS } from '../../../components/visualization/FunctionPlotter';
import DerivativePlotter from '../../../components/visualization/DerivativePlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';

const PageContainer = styled.div`
  padding: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  max-width: 1400px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const BackButton = styled.button`
  background: transparent;
  border: 2px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'} ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  cursor: pointer;
  font-size: 14px;
  transition: all 0.3s ease;
  &:hover {
    background: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
    border-color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  }
`;

const Title = styled.h1`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 28px;
  font-weight: 700;
`;

const Description = styled.p`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
`;

const ContentLayout = styled.div`
  display: flex;
  gap: ${({ theme }) => theme?.spacing?.lg || '1.5rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
  @media (max-width: 1200px) {
    flex-direction: column;
  }
`;

const PlotPanel = styled.div`
  flex: 1;
  min-width: 0;
`;

const ControlsPanel = styled.div`
  flex: 0 0 350px;
  min-width: 280px;
`;

const AngleDisplay = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.lg || '12px'};
  padding: ${({ theme }) => theme?.spacing?.md || '1rem'};
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
  text-align: center;
`;

const AngleValue = styled.span`
  color: ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  font-size: 24px;
  font-weight: 700;
`;

const RatioGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
`;

const RatioCard = styled.div`
  background: ${({ theme }) => theme?.colors?.cardBg || '#1e293b'};
  border: 1px solid ${({ theme }) => theme?.colors?.border || '#334155'};
  border-radius: ${({ theme }) => theme?.borderRadius?.md || '8px'};
  padding: ${({ theme }) => theme?.spacing?.sm || '0.5rem'};
  text-align: center;
  transition: border-color 0.3s ease;
`;

const RatioName = styled.div`
  color: ${({ theme }) => theme?.colors?.textSecondary || '#cbd5e1'};
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  margin-bottom: 2px;
`;

const RatioFormula = styled.div`
  color: ${({ theme }) => theme?.colors?.textTertiary || '#94a3b8'};
  font-size: 11px;
  margin-bottom: 2px;
`;

const RatioValue = styled.div`
  color: ${({ theme }) => theme?.colors?.secondary || '#06b6d4'};
  font-size: 20px;
  font-weight: 700;
  line-height: 1.3;
`;

const RatioInfinite = styled(RatioValue)`
  color: ${({ theme }) => theme?.colors?.error || '#ef4444'};
`;

const SectionTitle = styled.h2`
  color: ${({ theme }) => theme?.colors?.textPrimary || '#f8fafc'};
  font-size: 22px;
  font-weight: 600;
  margin-bottom: ${({ theme }) => theme?.spacing?.md || '1rem'};
  border-left: 4px solid ${({ theme }) => theme?.colors?.primary || '#6366f1'};
  padding-left: ${({ theme }) => theme?.spacing?.md || '1rem'};
`;

const CurveSection = styled.div`
  margin-bottom: ${({ theme }) => theme?.spacing?.xl || '2rem'};
`;

const formatVal = (v) => {
  if (!isFinite(v) || v === undefined || v === null) return null;
  const s = v.toFixed(4);
  return parseFloat(s).toString();
};

const isInfinite = (v) => !isFinite(v) || Math.abs(v) > 1e8;

/**
 * TrigonometricRatios - Interactive exploration of the 6 trig ratios
 * via a draggable right triangle and live curve plots.
 */
const TrigonometricRatios = () => {
  const navigate = useNavigate();

  const [params, setParams] = useState({ cx: 3, cy: 2 });
  const [commonParams, setCommonParams] = useState({
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const { cx, cy } = params;
  const theta = Math.atan2(cy, cx);
  const hyp = Math.sqrt(cx * cx + cy * cy);

  // ---- 6 trig ratios ----
  const sinVal = hyp > 0 ? cy / hyp : 0;
  const cosVal = hyp > 0 ? cx / hyp : 0;
  const tanVal = cx !== 0 ? cy / cx : Infinity;
  const cscVal = cy !== 0 ? hyp / cy : Infinity;
  const secVal = cx !== 0 ? hyp / cx : Infinity;
  const cotVal = cy !== 0 ? cx / cy : Infinity;

  const ratioData = [
    { name: 'sin', formula: 'opp/hyp', value: sinVal, color: '#6366f1' },
    { name: 'cos', formula: 'adj/hyp', value: cosVal, color: '#06b6d4' },
    { name: 'tan', formula: 'opp/adj', value: tanVal, color: '#f59e0b' },
    { name: 'csc', formula: 'hyp/opp', value: cscVal, color: '#10b981' },
    { name: 'sec', formula: 'hyp/adj', value: secVal, color: '#f97316' },
    { name: 'cot', formula: 'adj/opp', value: cotVal, color: '#ec4899' }
  ];

  // ---- parameter config ----
  const pointCConfig = [
    { name: 'cx', label: 'C.x', min: -5, max: 5, step: 0.01 },
    { name: 'cy', label: 'C.y', min: -5, max: 5, step: 0.01 }
  ];

  const commonConfig = [
    { name: 'plotStyle', label: 'Line Thickness', type: 'select', options: ['thin', 'medium', 'thick', 'extra-thick'] },
    { name: 'aspectRatio', label: 'Aspect Ratio', type: 'select', options: ['auto', '16:9', '4:3', '1:1'] },
    { name: 'legendPosition', label: 'Legend Position', type: 'select', options: ['top-right', 'top-left', 'bottom-left', 'bottom-right', 'None'] }
  ];

  // ========== Triangle Plot Traces ==========
  const triangleTraces = useMemo(() => {
    const traces = [];

    // --- Triangle edges A(0,0) → B(cx,0) → C(cx,cy) → A ---
    traces.push({
      x: [0, cx, cx, 0],
      y: [0, 0, cy, 0],
      mode: 'lines+markers',
      type: 'scatter',
      name: 'Triangle',
      line: { color: '#6366f1', width: 3 },
      marker: {
        size: [10, 10, 10, 1],
        color: ['#6366f1', '#6366f1', '#6366f1', 'rgba(0,0,0,0)'],
        symbol: 'circle'
      },
      hoverinfo: 'skip',
      showlegend: false
    });

    // --- Right angle indicator at B(cx, 0) ---
    const s = 0.2;
    const rx = cx - Math.sign(cx || 1) * s;
    const ry = cy !== 0 ? Math.sign(cy) * s : s;
    traces.push({
      x: [rx, cx, cx],
      y: [0, 0, ry],
      mode: 'lines',
      type: 'scatter',
      name: 'Right Angle',
      line: { color: '#94a3b8', width: 1.5 },
      hoverinfo: 'skip',
      showlegend: false
    });

    // --- Angle arc at A(0,0) from 0 to theta ---
    const arcRes = 40;
    const arcR = 0.35;
    const arcX = [];
    const arcY = [];
    for (let i = 0; i <= arcRes; i++) {
      const a = (theta / arcRes) * i;
      arcX.push(arcR * Math.cos(a));
      arcY.push(arcR * Math.sin(a));
    }
    traces.push({
      x: arcX,
      y: arcY,
      mode: 'lines',
      type: 'scatter',
      name: 'θ',
      line: { color: '#f59e0b', width: 2.5 },
      hoverinfo: 'skip',
      showlegend: false
    });

    // --- θ label at arc midpoint ---
    const midA = theta / 2;
    const labelR = 0.9;
    const thetaDeg = Math.abs(theta * 180 / Math.PI).toFixed(1);
    traces.push({
      x: [labelR * Math.cos(midA)],
      y: [labelR * Math.sin(midA)],
      mode: 'text',
      type: 'scatter',
      text: [`θ = ${thetaDeg}°`],
      textposition: 'middle center',
      textfont: { color: '#f59e0b', size: 15, family: 'serif, italic' },
      hoverinfo: 'skip',
      showlegend: false
    });

    // --- Point labels A, B, C ---
    const labelOff = 0.3;
    const labelData = [
      { x: 0, y: -labelOff, text: 'A(0,0)' },
      { x: cx, y: -labelOff, text: `B(${cx.toFixed(2)},0)` },
      { x: cx + (cx >= 0 ? 1 : -1) * labelOff, y: cy + (cy >= 0 ? 1 : -1) * labelOff, text: `C(${cx.toFixed(2)},${cy.toFixed(2)})` }
    ];
    traces.push({
      x: labelData.map(d => d.x),
      y: labelData.map(d => d.y),
      mode: 'text',
      type: 'scatter',
      text: labelData.map(d => d.text),
      textposition: 'middle center',
      textfont: { color: '#f8fafc', size: 12 },
      hoverinfo: 'skip',
      showlegend: false
    });

    // --- Side length labels (a, b, c) on the triangle ---
    const hyp = Math.sqrt(cx * cx + cy * cy);
    const aLen = Math.abs(cy);
    const bLen = Math.abs(cx);
    const cLen = hyp;

    // side a = BC (vertical): midpoint at (cx, cy/2), label to the right/left
    const aSideX = cx + (cx >= 0 ? 0.45 : -0.45);
    const aSideY = cy / 2;

    // side b = AB (horizontal): midpoint at (cx/2, 0), label above/below
    const bSideX = cx / 2;
    const bSideY = (cy >= 0 ? -0.45 : 0.45);

    // side c = AC (hypotenuse): midpoint at (cx/2, cy/2), label offset perpendicular
    const cSideX = cx / 2;
    const cSideY = cy / 2;
    // Perpendicular offset: rotate the hypotenuse vector 90° and normalize
    const perpScale = 0.45;
    const cPerpX = -cy / (hyp || 1) * perpScale;
    const cPerpY = cx / (hyp || 1) * perpScale;

    traces.push({
      x: [aSideX, bSideX, cSideX + cPerpX],
      y: [aSideY, bSideY, cSideY + cPerpY],
      mode: 'text',
      type: 'scatter',
      text: [`a = ${aLen.toFixed(3)}`, `b = ${bLen.toFixed(3)}`, `c = ${cLen.toFixed(3)}`],
      textposition: 'middle center',
      textfont: { color: '#94a3b8', size: 13 },
      hoverinfo: 'skip',
      showlegend: false
    });

    return traces;
  }, [cx, cy, theta]);

  // ========== Sampling helpers ==========
  const NUM_PTS = 2000;

  const sampleFunction = useMemo(() => {
    const xVals = [];
    for (let i = 0; i < NUM_PTS; i++) {
      xVals.push(-Math.PI + (2 * Math.PI * i) / (NUM_PTS - 1));
    }
    return xVals;
  }, []);

  const makeTrigTrace = (fn, name, color, dash = 'solid', xVals, thetaVal) => {
    const yVals = xVals.map(x => fn(x));
    const tol = 1e-10;
    const cleaned = yVals.map((v, i) => {
      if (!isFinite(v) || Math.abs(v) > 1e6) return NaN;
      // Check if near asymptote (derivative check: consecutive points jump)
      if (i > 0 && i < yVals.length - 1) {
        const prev = yVals[i - 1];
        const next = yVals[i + 1];
        if (isFinite(prev) && isFinite(next) && !isFinite(v)) return NaN;
        if (isFinite(prev) && isFinite(next) && Math.abs(prev) < 1e4 && Math.abs(next) < 1e4 && Math.abs(v) > 1e4) return NaN;
      }
      return v;
    });

    // Intersection value at theta
    const inter = fn(thetaVal);
    const interValid = isFinite(inter) && Math.abs(inter) < 1e6;

    return { xVals, yVals: cleaned, inter, interValid };
  };

  // ========== Sin/Cos Curves Traces ==========
  const sinCosTraces = useMemo(() => {
    const xVals = sampleFunction;
    const thetaVal = theta;
    const traces = [];

    // sin
    const sinData = makeTrigTrace(Math.sin, 'sin(θ)', '#6366f1', 'solid', xVals, thetaVal);
    traces.push({
      x: xVals, y: sinData.yVals,
      mode: 'lines', type: 'scatter',
      name: 'sin(θ)',
      line: { color: '#6366f1', width: 2 }
    });

    // cos
    const cosData = makeTrigTrace(Math.cos, 'cos(θ)', '#06b6d4', 'solid', xVals, thetaVal);
    traces.push({
      x: xVals, y: cosData.yVals,
      mode: 'lines', type: 'scatter',
      name: 'cos(θ)',
      line: { color: '#06b6d4', width: 2 }
    });

    // Vertical line at theta
    traces.push({
      x: [thetaVal, thetaVal], y: [-1.5, 1.5],
      mode: 'lines', type: 'scatter',
      name: `θ = ${(thetaVal * 180 / Math.PI).toFixed(1)}°`,
      line: { color: '#f59e0b', width: 2, dash: 'dash' }
    });

    // Intersection markers
    const markX = [];
    const markY = [];
    const markText = [];
    const markColors = [];

    if (sinData.interValid) {
      markX.push(thetaVal); markY.push(sinData.inter);
      markText.push(`sin = ${formatVal(sinData.inter)}`); markColors.push('#6366f1');
    } else {
      markX.push(thetaVal); markY.push(null);
    }

    if (cosData.interValid) {
      markX.push(thetaVal); markY.push(cosData.inter);
      markText.push(`cos = ${formatVal(cosData.inter)}`); markColors.push('#06b6d4');
    } else {
      markX.push(thetaVal); markY.push(null);
    }

    if (markX.length > 0) {
      traces.push({
        x: markX, y: markY,
        mode: 'markers+text',
        type: 'scatter',
        name: 'Values',
        marker: { size: 10, color: markColors, symbol: 'circle', line: { color: '#fff', width: 1 } },
        text: markText,
        textposition: 'top center',
        textfont: { size: 11, color: '#f8fafc' },
        hoverinfo: 'text'
      });
    }

    return traces;
  }, [theta, sampleFunction]);

  // ========== Tan/Cot/Sec/Csc Curves Traces ==========
  const tanGroupTraces = useMemo(() => {
    const xVals = sampleFunction;
    const thetaVal = theta;
    const traces = [];

    const configs = [
      { fn: (x) => Math.tan(x), name: 'tan(θ)', color: '#f59e0b' },
      { fn: (x) => 1 / Math.tan(x), name: 'cot(θ)', color: '#10b981' },
      { fn: (x) => 1 / Math.cos(x), name: 'sec(θ)', color: '#f97316' },
      { fn: (x) => 1 / Math.sin(x), name: 'csc(θ)', color: '#ec4899' }
    ];

    const allMarksX = [];
    const allMarksY = [];
    const allMarksText = [];
    const allMarksColors = [];

    configs.forEach(({ fn, name, color }) => {
      const data = makeTrigTrace(fn, name, color, 'solid', xVals, thetaVal);
      traces.push({
        x: xVals, y: data.yVals,
        mode: 'lines', type: 'scatter',
        name,
        line: { color, width: 2 }
      });

      if (data.interValid) {
        allMarksX.push(thetaVal);
        allMarksY.push(data.inter);
        allMarksText.push(`${name.replace('(θ)', '')} = ${formatVal(data.inter)}`);
        allMarksColors.push(color);
      }
    });

    // Vertical line
    traces.push({
      x: [thetaVal, thetaVal], y: [-5, 5],
      mode: 'lines', type: 'scatter',
      name: `θ = ${(thetaVal * 180 / Math.PI).toFixed(1)}°`,
      line: { color: '#f59e0b', width: 2, dash: 'dash' }
    });

    // Intersection markers
    if (allMarksX.length > 0) {
      traces.push({
        x: allMarksX, y: allMarksY,
        mode: 'markers+text',
        type: 'scatter',
        name: 'Values',
        marker: { size: 10, color: allMarksColors, symbol: 'circle', line: { color: '#fff', width: 1 } },
        text: allMarksText,
        textposition: 'top center',
        textfont: { size: 11, color: '#f8fafc' },
        hoverinfo: 'text'
      });
    }

    return traces;
  }, [theta, sampleFunction]);

  const thetaDeg = (theta * 180 / Math.PI).toFixed(1);

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate('/mathematics/1-fundamentals/basic-function')}>
          ← Basic Functions
        </BackButton>
        <Title>Trigonometric Ratios</Title>
      </Header>

      <Description>
        Drag point C in the plane to form different right triangles (with right angle at B).
        Watch how the six trigonometric ratios change in real time, and see them
        mapped onto their curves below.
      </Description>

      <ContentLayout>
        <PlotPanel>
          <FunctionPlotter
            data={triangleTraces}
            xRange={[-5, 5]}
            yRange={[-5, 5]}
            aspectRatio="1:1"
            title="Right Triangle — A(0,0), B(cx,0), C(cx,cy)"
            plotStyle={commonParams.plotStyle}
            showExportButton={false}
          />
        </PlotPanel>
        <ControlsPanel>
          <ParameterSection title="Point C">
            <ParameterControls parameters={params} onChange={setParams} config={pointCConfig} />
          </ParameterSection>

          <AngleDisplay>
            <div style={{ color: '#cbd5e1', fontSize: 14, marginBottom: 4 }}>∠A = θ</div>
            <AngleValue>{thetaDeg}°</AngleValue>
            <div style={{ color: '#94a3b8', fontSize: 13 }}>({(theta).toFixed(4)} rad)</div>
          </AngleDisplay>

          <ParameterSection title="Plot Style">
            <ParameterControls parameters={commonParams} onChange={setCommonParams} config={commonConfig} />
          </ParameterSection>

          <RatioGrid>
            {ratioData.map(({ name, formula, value, color }) => (
              <RatioCard key={name}>
                <RatioName style={{ color }}>{name}</RatioName>
                <RatioFormula>{formula}</RatioFormula>
                {isInfinite(value) ? (
                  <RatioInfinite>∞</RatioInfinite>
                ) : (
                  <RatioValue>{formatVal(value)}</RatioValue>
                )}
              </RatioCard>
            ))}
          </RatioGrid>
        </ControlsPanel>
      </ContentLayout>

      <CurveSection>
        <SectionTitle>sin(θ) &amp; cos(θ)</SectionTitle>
        <DerivativePlotter
          data={sinCosTraces}
          xRange={[-Math.PI, Math.PI]}
          yRange={[-1.5, 1.5]}
          xTickMode="pi"
          title="sin(θ) and cos(θ) curves"
          plotStyle={commonParams.plotStyle}
          aspectRatio={commonParams.aspectRatio}
          legendPosition={commonParams.legendPosition}
        />
      </CurveSection>

      <CurveSection>
        <SectionTitle>tan(θ), cot(θ), sec(θ) &amp; csc(θ)</SectionTitle>
        <DerivativePlotter
          data={tanGroupTraces}
          xRange={[-Math.PI, Math.PI]}
          yRange={[-5, 5]}
          xTickMode="pi"
          title="tan(θ), cot(θ), sec(θ) and csc(θ) curves"
          plotStyle={commonParams.plotStyle}
          aspectRatio={commonParams.aspectRatio}
          legendPosition={commonParams.legendPosition}
        />
      </CurveSection>
    </PageContainer>
  );
};

export default TrigonometricRatios;
