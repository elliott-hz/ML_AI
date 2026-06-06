// UI Pattern: StandardSinglePlot — single plot with controls panel (ParameterControls + ParameterSection) and content layout
import React, { useState, useCallback } from 'react';
import LimitPlotter from '../../../components/visualization/LimitPlotter';
import ParameterControls from '../../../components/visualization/ParameterControls';
import ParameterSection from '../../../components/visualization/ParameterSection';
import BackButton from '../../../components/layout/BackButton';
import {
  PageContainer, Header, SectionTitle, SectionDescription,
  ContentLayout, ControlsPanel, PlotPanel,
  FormulaBox, Formula
} from '../../../components/common/LayoutStyled';
import { commonParamsConfig } from '../../../constants/continuityConfig';

/**
 * Removable Discontinuity — f(x) not defined at x₀
 * f(x) = (x² - a²)/(x - a), undefined at x = a, limit = 2a
 */
const DiscontinuityUndefined = () => {
  const [params, setParams] = useState({
    a: 1.0,
    xRange: [-3, 3],
    plotStyle: 'medium',
    aspectRatio: 'auto',
    legendPosition: 'top-right'
  });

  const generateData = useCallback(() => {
    const a = params.a;
    const [xMin, xMax] = params.xRange;
    const numPoints = 200;
    const holeX = a;
    const holeY = 2 * a;

    let minY = Infinity;
    let maxY = -Infinity;

    for (let i = 0; i <= numPoints; i++) {
      const x = xMin + ((xMax - xMin) * i) / numPoints;
      if (Math.abs(x - holeX) > 0.02) {
        const y = (x * x - a * a) / (x - a);
        if (y < minY) minY = y;
        if (y > maxY) maxY = y;
      }
    }
    const padding = Math.max((maxY - minY) * 0.1, 0.5);
    const auxYMin = minY - padding;
    const auxYMax = maxY + padding;

    const traces = [];

    // Left branch: x < a
    if (xMin < holeX) {
      const leftX = [];
      const leftY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = xMin + ((holeX - xMin) * i) / (numPoints / 2);
        if (Math.abs(x - holeX) > 0.02) {
          leftX.push(x);
          leftY.push((x * x - a * a) / (x - a));
        }
      }
      if (leftX.length > 0) {
        traces.push({
          x: leftX, y: leftY, type: 'scatter', mode: 'lines',
          name: `f(x) = (x²-${(a*a).toFixed(1)})/(x-${a.toFixed(1)}) (x < x₀)`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // Right branch: x > a
    if (xMax > holeX) {
      const rightX = [];
      const rightY = [];
      for (let i = 0; i <= numPoints / 2; i++) {
        const x = holeX + ((xMax - holeX) * i) / (numPoints / 2);
        if (Math.abs(x - holeX) > 0.02) {
          rightX.push(x);
          rightY.push((x * x - a * a) / (x - a));
        }
      }
      if (rightX.length > 0) {
        traces.push({
          x: rightX, y: rightY, type: 'scatter', mode: 'lines',
          name: `f(x) = (x²-${(a*a).toFixed(1)})/(x-${a.toFixed(1)}) (x > x₀)`,
          line: { color: '#6366f1', width: 2.5 }
        });
      }
    }

    // Vertical auxiliary line at x = a
    traces.push({
      x: [holeX, holeX],
      y: [auxYMin, auxYMax],
      type: 'scatter', mode: 'lines',
      name: `x=${holeX.toFixed(1)}`,
      line: { color: '#ffd700', width: 2, dash: 'dash' }
    });

    // Horizontal auxiliary line at y = 2a (the limit value)
    traces.push({
      x: [xMin, xMax],
      y: [holeY, holeY],
      type: 'scatter', mode: 'lines',
      name: `lim: ${holeY.toFixed(1)}`,
      line: { color: '#ffd700', width: 2, dash: 'dash' }
    });

    // Hollow circle at the hole (a, 2a)
    traces.push({
      x: [holeX], y: [holeY],
      type: 'scatter', mode: 'markers+text',
      name: 'Hole',
      marker: {
        size: 12, color: '#ef4444',
        symbol: 'circle-open',
        line: { color: '#ef4444', width: 2 }
      },
      text: [`f(${holeX.toFixed(1)}) undefined`],
      textposition: 'top center',
      textfont: { size: 12, color: '#ef4444' }
    });

    return traces;
  }, [params]);

  const coefficientConfig = [
    { name: 'a', label: 'a (hole at x=a)', min: -2.0, max: 2.0, step: 0.1 }
  ];

  return (
    <PageContainer>
      <Header>
        <BackButton to="/mathematics/1-fundamentals/continuity">
           Back to Continuity
        </BackButton>
        <SectionTitle>Discontinuity: f(x) Not Defined at x₀</SectionTitle>
      </Header>

      <SectionDescription>
        The function is not defined at x₀ = a. The limit exists as x approaches a,
        but f(a) does not exist — this is called a <strong>removable discontinuity</strong>.
      </SectionDescription>

      <FormulaBox>
        <Formula>
          f(x) = (x² - a²) / (x - a)<br/><br/>
          Simplifies to: f(x) = x + a, &nbsp;&nbsp;x ≠ a<br/>
          lim(x→a) f(x) = 2a<br/><br/>
          f(a) is <strong>undefined</strong> ✗
        </Formula>
      </FormulaBox>

      <ContentLayout>
        <ControlsPanel>
          <ParameterSection title="Parameter">
            <ParameterControls parameters={params} onChange={setParams} config={coefficientConfig} />
          </ParameterSection>
          <ParameterSection title="General Settings">
            <ParameterControls parameters={params} onChange={setParams} config={commonParamsConfig} />
          </ParameterSection>
        </ControlsPanel>

        <PlotPanel>
          <LimitPlotter
            data={generateData()}
            xRange={params.xRange}
            title={`Removable Discontinuity at x = ${params.a.toFixed(1)}`}
            plotStyle={params.plotStyle}
            aspectRatio={params.aspectRatio}
            legendPosition={params.legendPosition}
          />
        </PlotPanel>
      </ContentLayout>
    </PageContainer>
  );
};

export default DiscontinuityUndefined;
