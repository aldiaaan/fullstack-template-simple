import { intervalToDuration } from "date-fns";
import { useEffect, useState } from "react";

type TimeAgoProps = {
  epochTimestamp: number;
  epochTimestampEnd?: number;
};

/**
 * A custom React hook that calculates the time elapsed and returns it as a formatted string.
 * If only `epochTimestamp` (start) is provided, it calculates the time since then, updating every second.
 * If `epochTimestampEnd` is also provided, it calculates the fixed duration between the two timestamps.
 * The format is `mm:ss` for durations less than an hour, and `hh:mm:ss` otherwise.
 *
 * @param {TimeAgoProps} props - The hook props.
 * @returns {string} The formatted elapsed time string.
 */
const useTimeAgo = (props: TimeAgoProps): string => {
  const { epochTimestamp, epochTimestampEnd } = props;
  const [elapsedTime, setElapsedTime] = useState("00:00");

  useEffect(() => {
    const calculateDuration = (): string => {
      if (!epochTimestamp) {
        return "Invalid Start Date";
      }

      // The epoch timestamp can be in seconds or milliseconds.
      // This handles both by checking its magnitude.
      const startDate = new Date(
        epochTimestamp * (String(epochTimestamp).length === 10 ? 1000 : 1)
      );

      // Determine the end date. Use the provided end timestamp or the current time as a fallback.
      const endDate = epochTimestampEnd
        ? new Date(
            epochTimestampEnd *
              (String(epochTimestampEnd).length === 10 ? 1000 : 1)
          )
        : new Date();

      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return "Invalid Date";
      }

      // Ensure start date is not in the future for live timers
      if (startDate > endDate) {
        return "00:00";
      }

      // Use date-fns to get the duration between the start and end dates.
      const duration = intervalToDuration({
        start: startDate,
        end: endDate,
      });

      const totalHours = (duration.days || 0) * 24 + (duration.hours || 0);

      // Pad each time unit with a leading zero if it's a single digit.
      const paddedMinutes = String(duration.minutes || 0).padStart(2, "0");
      const paddedSeconds = String(duration.seconds || 0).padStart(2, "0");

      // Conditionally format the output based on the duration
      if (totalHours > 0) {
        const paddedHours = String(totalHours).padStart(2, "0");
        return `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;
      } else {
        return `${paddedMinutes}:${paddedSeconds}`;
      }
    };

    // Update the time immediately on component mount.
    setElapsedTime(calculateDuration());

    let intervalId: NodeJS.Timeout | null = null;
    // If there's no end timestamp, we need to update the timer every second.
    if (!epochTimestampEnd) {
      intervalId = setInterval(() => {
        setElapsedTime(calculateDuration());
      }, 1000);
    }

    // Clean up the interval when the component unmounts or props change.
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [epochTimestamp, epochTimestampEnd]); // Rerun effect if timestamps change.

  return elapsedTime;
};

// --- Helper Components for Display ---

// You can use any hourglass icon you prefer. Here's a simple SVG as a placeholder.
const Hourglass = ({ className }: { className: string }) => (
  <svg
    className={className}
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
    />
  </svg>
);

/**
 * A display component that uses the useTimeAgo hook to render the styled output.
 */
export const TimeDisplay = (props: TimeAgoProps) => {
  const elapsedTime = useTimeAgo(props);
  return elapsedTime;
};
