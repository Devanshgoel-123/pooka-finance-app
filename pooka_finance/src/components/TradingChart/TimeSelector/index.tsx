"use client"
import React from 'react';
import './styles.scss';
import { usePerpStore } from '@/store/PerpStore';
import { TimeFrame } from '@/store/types/types';
import { useShallow } from 'zustand/react/shallow';


const TimeSelector: React.FC = () => {
  const {
    selectedTimeframe
  }=usePerpStore(useShallow((state)=>({
    selectedTimeframe: state.timeframe
  })))
  const timeframes: TimeFrame[] = [
    { label: '5m', value: 'minute' },
    { label: '30m', value: 'minute' },
    { label: '1H', value: 'hour' },
    { label: '1D', value: 'day' },
    { label: '3D', value: 'day' },
    { label: '7D', value: 'week' },
    { label: '30D', value: 'month' },
    { label: '90D', value: 'quarter' },
  ];

  const handleTimeframeChange = (timeframe: TimeFrame) => {
    usePerpStore.getState().setTimeFrame(timeframe);
  };

  return (
    <div className="time-selector">
      <div className="time-selector__header">
        <h3 className="time-selector__title">Timeframe</h3>
        <div className="time-selector__current">
          Current: <span className="time-selector__current-value">{selectedTimeframe.label}</span>
        </div>
      </div>
      
      <div className="time-selector__container">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.label}
                onClick={() => handleTimeframeChange(timeframe)}
                className={`time-selector__timeframe ${
                  selectedTimeframe.label === timeframe.label
                    ? 'time-selector__timeframe--active' 
                    : ''
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
    </div>
  );
};

export default TimeSelector;