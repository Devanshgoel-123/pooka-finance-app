/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import React from 'react';
import './styles.scss';

interface TradingChartSkeletonProps {
  width?: string;
  height?: string;
  showControls?: boolean;
  showPriceLabels?: boolean;
}

export const TradingChartSkeleton: React.FC<TradingChartSkeletonProps> = ({
  showControls = true,
  showPriceLabels = true,
}) => {
  const seededRandom = (seed: number): number => {
    const x = Math.sin(seed) * 10000;
    return x - Math.floor(x);
  };

  const generateChartPath = () => {
    const points = [];
    const numPoints = 50;
    const chartWidth = 800;
    const chartHeight = 200;

    for (let i = 0; i < numPoints; i++) {
      const x = (i / (numPoints - 1)) * chartWidth;
      const y =
        chartHeight / 2 +
        Math.sin(i * 0.3) * 40 +
        seededRandom(i + 100) * 20 -
        10;
      points.push(`${x},${y}`);
    }

    return `M ${points.join(" L ")}`;
  };

  const generateCandlesticks = () => {
    const candlesticks = [];
    const numCandles = 25;
    const spacing = 32;

    for (let i = 0; i < numCandles; i++) {
      const x = i * spacing + 20;
      
      candlesticks.push(
        <g key={i} className="chartSkeleton__candlestick">
        </g>
      );
    }

    return candlesticks;
  };

  return (
    <div className="chartSkeleton">
      {showControls && (
        <div className="chartSkeleton__header">
          <div className="chartSkeleton__headerLeft">
            <div className="chartSkeleton__symbolPill"></div>
            <div className="chartSkeleton__pricePill"></div>
            <div className="chartSkeleton__changePill"></div>
          </div>
          <div className="chartSkeleton__headerRight">
            <div className="chartSkeleton__controlPill"></div>
            <div className="chartSkeleton__controlPill"></div>
          </div>
        </div>
      )}

      <div className="chartSkeleton__chartArea">
        {showPriceLabels && (
          <div className="chartSkeleton__priceLabels">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="chartSkeleton__priceLabel"></div>
            ))}
          </div>
        )}

        <div className="chartSkeleton__chartContainer">
          <svg
            className="chartSkeleton__svg"
            viewBox="0 0 800 240"
            preserveAspectRatio="none"
          >
            <defs>
              <pattern
                id="grid"
                width="40"
                height="24"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 40 0 L 0 0 0 24"
                  fill="none"
                  stroke="#2a2a2a"
                  strokeWidth="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />

            {[...Array(6)].map((_, i) => (
              <line
                key={i}
                x1="0"
                y1={i * 40 + 20}
                x2="800"
                y2={i * 40 + 20}
                className="chartSkeleton__gridLine"
              />
            ))}
            <g className="chartSkeleton__chartContent">
              {generateCandlesticks()}
              <path
                d={generateChartPath()}
                className="chartSkeleton__chartLine"
                fill="none"
              />
              {[...Array(25)].map((_, i) => (
                <rect
                  key={i}
                  x={i * 32 + 18}
                  y={200}
                  width={16}
                  height={seededRandom(i + 500) * 30 + 5}
                  className="chartSkeleton__volumeBar"
                />
              ))}
            </g>
          </svg>
        </div>
      </div>

      {showControls && (
        <div className="chartSkeleton__footer">
          <div className="chartSkeleton__footerLeft">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="chartSkeleton__indicatorPill"></div>
            ))}
          </div>
          <div className="chartSkeleton__footerRight">
            <div className="chartSkeleton__timeframePill"></div>
          </div>
        </div>
      )}
    </div>
  );
};
