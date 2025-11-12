import { StudentRecord } from "@/lib/api/students"

type Props = {
  summary: StudentRecord
}

export default function DistanceSection({ summary }: Props) {
  return (
    <div className="flex flex-col">
      <div className="flex w-[920px] p-2">
        {Array.isArray(summary.technology_gadgets) &&
          summary.technology_gadgets.length > 0 && (
            <div className="mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Technology Gadgets
              </span>
              <ul className="list-disc pl-5 text-sm tracking-wide">
                {summary.technology_gadgets
                  .filter((gadget) => gadget !== "Others")
                  .map((gadget, index) => (
                    <li key={index}>{gadget}</li>
                  ))}
                {summary.technology_gadgets.includes("Others") &&
                  summary.technology_gadgets_other && (
                    <li>{summary.technology_gadgets_other}</li>
                  )}
              </ul>
            </div>
          )}
        {Array.isArray(summary.internet_connectivity_means) &&
          summary.internet_connectivity_means.length > 0 && (
            <div className="mb-5 flex w-[300px] flex-col">
              <span className="text-main2 mb-2 text-[12px] tracking-wide">
                Internet Connectivity
              </span>
              <ul className="list-disc pl-5 text-sm tracking-wide">
                {summary.internet_connectivity_means
                  .filter((internet) => internet !== "Others")
                  .map((internet, index) => (
                    <li key={index}>{internet}</li>
                  ))}
                {summary.internet_connectivity_means.includes("Others") &&
                  summary.internet_connectivity_other && (
                    <li>{summary.internet_connectivity_other}</li>
                  )}
              </ul>
            </div>
          )}
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Learning Space
          </span>
          <span className="mr-9 text-sm tracking-wide break-words whitespace-pre-wrap">
            {summary.learning_space_description}
          </span>
        </div>
      </div>
      {/*next row*/}
      <div className="flex w-[920px] p-2">
        <div className="flex- mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Internet Access and Resources
          </span>
          <span className="text-sm tracking-wide">
            {summary.internet_access}
          </span>
        </div>
        <div className="mb-5 flex w-[300px] flex-col">
          <span className="text-main2 mb-2 text-[12px] tracking-wide">
            Distance Learning Readiness
          </span>
          <span className="text-sm tracking-wide">
            {summary.distance_learning_readiness}
          </span>
        </div>
      </div>
    </div>
  )
}
