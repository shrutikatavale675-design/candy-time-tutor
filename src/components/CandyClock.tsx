import React, { useState, useRef } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { toast } from 'sonner';
// import cupcakeHour from '../assets/cupcake-hour.png';
// import lollipopMinute from '../assets/lollipop-minute.png';

interface ClockHandPosition {
  hour: number;
  minute: number;
}

export const CandyClock = () => {
  const [handPosition, setHandPosition] = useState<ClockHandPosition>({ hour: 12, minute: 0 });
  const [targetTime, setTargetTime] = useState<ClockHandPosition>({ hour: 3, minute: 0 });
  const [isDragging, setIsDragging] = useState<'hour' | 'minute' | null>(null);
  const clockRef = useRef<HTMLDivElement>(null);

  const handleMouseDown = (hand: 'hour' | 'minute') => {
    setIsDragging(hand);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !clockRef.current) return;

    const rect = clockRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const angle = Math.atan2(e.clientY - centerY, e.clientX - centerX);
    let degrees = (angle * 180) / Math.PI + 90;
    if (degrees < 0) degrees += 360;

    if (isDragging === 'hour') {
      const hour = Math.round(degrees / 30) % 12;
      setHandPosition(prev => ({ ...prev, hour: hour === 0 ? 12 : hour }));
    } else {
      const minute = Math.round(degrees / 6) * 5;
      setHandPosition(prev => ({ ...prev, minute: minute % 60 }));
    }
  };

  const handleMouseUp = () => {
    setIsDragging(null);
  };

  const checkAnswer = () => {
    if (handPosition.hour === targetTime.hour && handPosition.minute === targetTime.minute) {
      toast.success("🎉 Perfect! You set the clock correctly!", {
        description: "Here's a sparkly star for you! ⭐",
      });
      // Generate new target time
      setTargetTime({
        hour: Math.floor(Math.random() * 12) + 1,
        minute: Math.floor(Math.random() * 12) * 5
      });
    } else {
      toast.error("Try again! 🍭", {
        description: "Look at the target time and move the cupcake hands!",
      });
    }
  };

  const hourRotation = (handPosition.hour % 12) * 30 - 90;
  const minuteRotation = handPosition.minute * 6 - 90;

  const formatTime = (time: ClockHandPosition) => {
    const hourStr = time.hour.toString();
    const minuteStr = time.minute.toString().padStart(2, '0');
    return `${hourStr}:${minuteStr}`;
  };

  return (
    <Card className="candy-card max-w-lg mx-auto">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-primary mb-2">🧁 Candy Clock 🍭</h2>
        <p className="text-lg text-muted-foreground">
          Set the time to: <span className="font-bold text-primary text-xl">{formatTime(targetTime)}</span>
        </p>
      </div>

      <div 
        ref={clockRef}
        className="relative w-80 h-80 mx-auto mb-6 bg-gradient-to-br from-white to-muted rounded-full border-8 border-primary/20 shadow-candy"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* Clock numbers */}
        {[...Array(12)].map((_, i) => {
          const number = i + 1;
          const angle = (number * 30 - 90) * (Math.PI / 180);
          const x = Math.cos(angle) * 120 + 160;
          const y = Math.sin(angle) * 120 + 160;
          
          return (
            <div
              key={number}
              className="absolute text-2xl font-bold text-primary transform -translate-x-1/2 -translate-y-1/2"
              style={{ left: x, top: y }}
            >
              {number}
            </div>
          );
        })}

        {/* Center dot */}
        <div className="absolute top-1/2 left-1/2 w-4 h-4 bg-primary rounded-full transform -translate-x-1/2 -translate-y-1/2 z-10" />

        {/* Hour hand (cupcake) */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom cursor-grab active:cursor-grabbing z-20"
          style={{
            width: '4px',
            height: '80px',
            marginTop: '-80px',
            marginLeft: '-2px',
            transform: `rotate(${hourRotation}deg)`,
          }}
          onMouseDown={() => handleMouseDown('hour')}
        >
          <div className="w-8 h-8 -ml-4 -mt-2 bg-primary rounded-full flex items-center justify-center animate-float">
            <span className="text-lg">🧁</span>
          </div>
          <div className="w-1 h-full bg-primary mx-auto" />
        </div>

        {/* Minute hand (lollipop) */}
        <div
          className="absolute top-1/2 left-1/2 origin-bottom cursor-grab active:cursor-grabbing z-20"
          style={{
            width: '2px',
            height: '100px',
            marginTop: '-100px',
            marginLeft: '-1px',
            transform: `rotate(${minuteRotation}deg)`,
          }}
          onMouseDown={() => handleMouseDown('minute')}
        >
          <div className="w-6 h-6 -ml-3 -mt-1 bg-secondary rounded-full flex items-center justify-center animate-float">
            <span className="text-sm">🍭</span>
          </div>
          <div className="w-0.5 h-full bg-secondary mx-auto" />
        </div>
      </div>

      <div className="text-center space-y-4">
        <div className="text-xl font-semibold text-foreground">
          Current time: <span className="text-primary">{formatTime(handPosition)}</span>
        </div>
        
        <Button 
          onClick={checkAnswer}
          className="candy-button text-xl px-8 py-4"
        >
          Check Time! 🎯
        </Button>
        
        <p className="text-sm text-muted-foreground">
          Drag the cupcake (hour) and lollipop (minute) hands to set the time!
        </p>
      </div>
    </Card>
  );
};