function timeAgo(isoString) {
    const date = new Date(isoString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000); // Get the difference in seconds
  
    const years = Math.floor(diffInSeconds / (60 * 60 * 24 * 365)); // Calculate years
    const months = Math.floor(diffInSeconds / (60 * 60 * 24 * 30)); // Calculate months
    const days = Math.floor(diffInSeconds / (60 * 60 * 24)); // Calculate days
    const hours = Math.floor(diffInSeconds / (60 * 60)); // Calculate hours
    const minutes = Math.floor(diffInSeconds / 60); // Calculate minutes
  
    if (diffInSeconds < 0) {
        // For future dates
        const futureDiffInSeconds = Math.abs(diffInSeconds);
        const futureYears = Math.floor(futureDiffInSeconds / (60 * 60 * 24 * 365));
        const futureMonths = Math.floor(futureDiffInSeconds / (60 * 60 * 24 * 30));
        const futureDays = Math.floor(futureDiffInSeconds / (60 * 60 * 24));
        const futureHours = Math.floor(futureDiffInSeconds / (60 * 60));
        const futureMinutes = Math.floor(futureDiffInSeconds / 60);
  
        if (futureYears > 0) {
            return futureYears === 1 ? "In 1 year" : `${futureYears} years`;
        } else if (futureMonths > 0) {
            return futureMonths === 1 ? "In 1 month" : `${futureMonths} months`;
        } else if (futureDays > 0) {
            return futureDays === 1 ? "In 1 day" : `${futureDays} days`;
        } else if (futureHours > 0) {
            return futureHours === 1 ? "In 1 hour" : `${futureHours} hours`;
        } else if (futureMinutes > 0) {
            return futureMinutes === 1 ? "In 1 minute" : `${futureMinutes} minutes`;
        } else {
            return "In the future"; // For less than a minute future difference
        }
    }
  
    if (years > 0) {
        return years === 1 ? "1 year ago" : `${years} years ago`;
    } else if (months > 0) {
        return months === 1 ? "1 month ago" : `${months} months ago`;
    } else if (days > 0) {
        return days === 1 ? "1 day ago" : `${days} days ago`;
    } else if (hours > 0) {
        return hours === 1 ? "1 hour ago" : `${hours} hours ago`;
    } else if (minutes > 0) {
        return minutes === 1 ? "1 minute ago" : `${minutes} minutes ago`;
    } else {
        return "Just now"; // If the difference is less than a minute
    }
  }

  
  export default timeAgo;