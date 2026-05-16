interface FormatDurationProps {
    seconds: number;
    showText?: boolean;
}

export default function formatDuration({ seconds, showText = false }: FormatDurationProps): string {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
    
    let timeFormat = '';
    
    if (hours > 0) {
        timeFormat = `${hours}:${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
        if (showText) {
            timeFormat += ` (${hours} jam ${minutes} menit)`;
        }
    } else {
        timeFormat = `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
        if (showText) {
            timeFormat += ` (${minutes} menit)`;
        }
    }
    
    return timeFormat;
}