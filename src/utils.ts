export function subtractYears(dateString: string, yearsToSubtract: number) {
    const [day, month, year] = dateString.split("/").map(Number);
    const originalDate = new Date(year, month - 1, day);
    const newYear = year - yearsToSubtract;
    const newDate = new Date(newYear, month - 1, day);

    const formattedDay = String(newDate.getDate()).padStart(2, "0");
    const formattedMonth = String(newDate.getMonth() + 1).padStart(2, "0");
    const formattedYear = newDate.getFullYear();

    return `${formattedDay}/${formattedMonth}/${formattedYear}`;
}

export function getCurrentDate() {
    const currentDate = new Date();

    const day = String(currentDate.getDate()).padStart(2, "0");
    const month = String(currentDate.getMonth() + 1).padStart(2, "0"); // Month is zero-based
    const year = currentDate.getFullYear();

    return `${day}/${month}/${year}`;
}
