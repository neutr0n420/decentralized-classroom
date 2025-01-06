import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export function dateTimeToNumeric(dateString: string): number | null {
  // Handle empty or invalid input
  if (!dateString) {
    return null;
  }

  try {
    // Handle ISO date string format (2025-01-06T05:50:00.000Z)
    const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/;
    if (isoRegex.test(dateString)) {
      const parsedDate = new Date(dateString);
      return parsedDate.getTime();
    }

    // Try parsing the direct string first
    let parsedDate = new Date(dateString);

    // Check if the date is valid
    if (isNaN(parsedDate.getTime())) {
      // Try parsing common formats
      const formats = [
        // MM/DD/YYYY hh:mm aa
        {
          regex: /^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})\s+(AM|PM)$/i,
          parser: (matches: RegExpMatchArray) => {
            const [, month, day, year, hours, minutes, ampm] = matches;
            let hour = parseInt(hours);

            // Convert to 24-hour format
            if (ampm.toLowerCase() === 'pm' && hour < 12) {
              hour += 12;
            } else if (ampm.toLowerCase() === 'am' && hour === 12) {
              hour = 0;
            }

            return new Date(
              parseInt(year),
              parseInt(month) - 1, // Months are 0-based
              parseInt(day),
              hour,
              parseInt(minutes)
            );
          }
        },
        // YYYY-MM-DD HH:mm
        {
          regex: /^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})$/,
          parser: (matches: RegExpMatchArray) => {
            const [, year, month, day, hours, minutes] = matches;
            return new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              parseInt(hours),
              parseInt(minutes)
            );
          }
        },
        // MM-DD-YYYY HH:mm
        {
          regex: /^(\d{2})-(\d{2})-(\d{4})\s+(\d{2}):(\d{2})$/,
          parser: (matches: RegExpMatchArray) => {
            const [, month, day, year, hours, minutes] = matches;
            return new Date(
              parseInt(year),
              parseInt(month) - 1,
              parseInt(day),
              parseInt(hours),
              parseInt(minutes)
            );
          }
        }
      ];

      // Try each format
      for (const format of formats) {
        const matches = dateString.match(format.regex);
        if (matches) {
          parsedDate = format.parser(matches);
          break;
        }
      }

      // If still invalid after trying all formats
      if (isNaN(parsedDate.getTime())) {
        return null;
      }
    }

    return parsedDate.getTime();
  } catch (error) {
    console.error('Error parsing date:', error);
    return null;
  }
}