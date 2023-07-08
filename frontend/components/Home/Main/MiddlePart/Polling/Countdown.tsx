import * as React from 'react';
import CD from 'react-countdown';
interface ICountdownProps {
  datetime: Date;
}
const Time = ({ time, type }: { time: number; type: string }) => (
  <span className="flex flex-col items-center justify-center w-16    rounded-xl p-4 bg-black/80 text-white ">
    <span className="font-semibold text-sm">{time}</span>
    <span className="font-light text-[10px]">{type}</span>
  </span>
);
const renderer = ({ days, hours, minutes, seconds, completed }: any) => {
  if (completed) {
    // Render a completed state
    return <></>;
  } else {
    // Render a countdown
    return (
      <span className="flex gap-2 rounded-xl ">
        <Time time={days} type="DAYS" />
        <Time time={hours} type="HOURS" />
        <Time time={minutes} type="MINUTES" />
        <Time time={seconds} type="SECONDS" />
      </span>
    );
  }
};
const Countdown: React.FunctionComponent<ICountdownProps> = ({ datetime }) => {
  return <CD date={datetime} renderer={renderer} />;
};

export default Countdown;
