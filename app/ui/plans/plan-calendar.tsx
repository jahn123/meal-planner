export default function PlanCalendar() {
  function generateWeeks() {
    const today = new Date();
    const currDayOfWeek = today.getDay();    
    const weeks = [];

    for (let week = 0; week < 4; ++week) {
      const referenceDay = new Date();
      referenceDay.setDate(today.getDate() + 7 * week);

      weeks.push({
        start: new Date(referenceDay.getTime() - (currDayOfWeek * 24 * 60 * 60 * 1000)),
        end: new Date(referenceDay.getTime() + (6 - currDayOfWeek) * 24 * 60 * 60 * 1000)
      });
    }

    return weeks;
  }

  const weeks = generateWeeks();

  return (
    <div className="flex justify-center">
      {weeks.map((week, index) => {
        const startDate = week.start?.toDateString();
        const endDate = week.end?.toDateString();
        return (
          <button
            key={index}
            type="button"
          >
            <div className="p-2 hover:bg-gray-300">
              <div>{startDate.slice(0, startDate.length - 5)}</div>
              <div>-</div>
              <div>{endDate.slice(0, endDate.length - 5)}</div>
            </div>
          </button>
        );
      })}
    </div>
  );
}