import { log } from "console";

export function formattedDate(date: string | Date): string {
    const parsedDate = typeof date === 'string' ? new Date(date) : date;
  
    const day = parsedDate.getDate().toString().padStart(2, '0');
    const month = (parsedDate.getMonth() + 1).toString().padStart(2, '0');
    const year = parsedDate.getFullYear().toString().slice(-2);
  
    return `${day}/${month}/${year}`;
  }
  