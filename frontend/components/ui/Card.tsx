import { cardData, scheduleCardData } from "@/types/card";
import { FaStar } from "react-icons/fa";

type CardProp = {
  data: cardData;
};

export function CourseCard({ data }: CardProp) {
  return (
    <div className="w-full h-40 bg-white rounded-2xl p-3 flex flex-col md:flex-row gap-3">
      {/* image */}
      <div className="md:min-w-40 min-w-full bg-zinc-800 rounded-xl"></div>
      {/* info */}
      <div className="w-full flex flex-col gap-6 text-xs font-medium">
        <div>
          <div className="flex items-center justify-between w-full">
            <h1 className="font-semibold text-lg capitalize">
              {data.subjectName} Lecture
            </h1>
            <div className="flex items-center gap-1">
              <div>
                <FaStar />
              </div>
              <h5 className="font-semibold text-sm">{data.rating}</h5>
            </div>
          </div>
          <h5 className="text-xs ">{data.descripton}</h5>
        </div>
        <div>
          <button className="bg-zinc-100 px-5 py-1 capitalize">
            {data.language}
          </button>
          <div className="flex items-center justify-between">
            <div className="text-zinc-400">
              Start:<span className="text-black capitalize">{data.date}</span>
            </div>
            <button className="px-6 py-2 bg-indigo-600 text-white rounded-full">
              View More
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

type ScheduleCard ={
  data: scheduleCardData
}

export function ScheduleCard({data}: ScheduleCard) {
  return (
    <div className="h-fit flex items-center justify-between bg-white p-6 rounded-xl capitalize">
      <div className="flex items-center gap-4 relative">
        <div className="text-xl">{data.date > 9 ? "" : 0 }{data.date}</div>
        <div className="w-px self-stretch bg-zinc-200"></div>
        <h4>{data.subject}</h4>
      </div>
      <div>
        <h4>{data.startTime} - {data.endTime} PM</h4>
      </div>
    </div>
  );
}
