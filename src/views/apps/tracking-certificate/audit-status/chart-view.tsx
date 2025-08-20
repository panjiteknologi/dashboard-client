import { AllProject } from "@/types/Project";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import isoWeek from "dayjs/plugin/isoWeek";
import CardAnalytic from "./card-analytic";
import { ChartPie } from "@/components/ui/chart-pie";
import ChartBarTabs from "./chart-bar-tabs";

dayjs.extend(isBetween);
dayjs.extend(isoWeek);

export type DataAnalytics = {
  countAuditThisWeek: number;
  countAuditLastWeek: number;
  gap: number;
};

interface ChartViewProps {
  data: AllProject[];
}

const ChartView = ({ data }: ChartViewProps) => {
  const current = data;

  const startOfThisWeek = dayjs().startOf("isoWeek");
  const startOfLastWeek = startOfThisWeek.subtract(1, "week");
  const endOfLastWeek = startOfThisWeek.subtract(1, "day");

  const totalProjects: AllProject[] = data;
  const dataRunning: number = data?.filter(
    (item) => item.lead_time_project_finish_for_chart === 0
  ).length;
  const dataDone: number = data?.filter(
    (item) => Number(item.lead_time_project_finish_for_chart) > 0
  ).length;
  const totalInitialAudit: AllProject[] = data?.filter(
    (item) => item.tahapan === 1
  );
  const totalSurveillanceI: AllProject[] = data?.filter(
    (item) => item.tahapan === 2
  );
  const totalSurveillanceII: AllProject[] = data?.filter(
    (item) => item.tahapan === 3
  );
  const totalSurveillanceIII: AllProject[] = data?.filter(
    (item) => item.tahapan === 4
  );
  const totalSurveillanceIV: AllProject[] = data?.filter(
    (item) => item.tahapan === 5
  );
  const totalSurveillanceV: AllProject[] = data?.filter(
    (item) => item.tahapan === 6
  );
  const totalRC: AllProject[] = data?.filter((item) => item.tahapan === 7);
  const totalSpecial: AllProject[] = data?.filter((item) => item.tahapan === 8);

  function getThisWeek(dates: Date[]) {
    return dates.filter((date) => {
      const parsedDate = dayjs(date);
      return parsedDate.isBetween(
        startOfThisWeek,
        startOfThisWeek.add(6, "day"),
        null,
        "[]"
      );
    });
  }

  function getLastWeek(dates: Date[]) {
    return dates.filter((date) => {
      const parsedDate = dayjs(date);
      return parsedDate.isBetween(startOfLastWeek, endOfLastWeek, null, "[]");
    });
  }

  const dataCardAnalytics = (dates: AllProject[]): DataAnalytics => {
    const listDate = dates?.map((item) => item.aplication_form);

    const countAuditThisWeek = getThisWeek(listDate).length;
    const countAuditLastWeek = getLastWeek(listDate).length;

    const gap = countAuditThisWeek - countAuditLastWeek;

    return {
      countAuditThisWeek,
      countAuditLastWeek,
      gap,
    };
  };

  const salesNameWithTotal = current.reduce(
    (acc: AllProject[], curr: AllProject) => {
      const existing = acc.find(
        (item) => item?.sales_person === curr.sales_person
      );

      if (existing) {
        if (existing.value !== undefined) {
          existing.value += 1;
        }
      } else {
        acc.push({ sales_person: curr.sales_person, value: 1 });
      }

      return acc;
    },
    []
  );

  const salesNameWitheLeadTime = current
    .map(
      ({
        nama_perusahaan,
        lead_time_project_finish_for_chart,
        lead_time_project_audit_sertifikat,
        standar,
      }) => {
        const all_standar = standar
          ?.map((item) => item.nama_standar)
          .join(", ");
        return {
          nama_perusahaan,
          value_all: lead_time_project_finish_for_chart,
          value_capa_to_certificate: lead_time_project_audit_sertifikat,
          all_standar,
        };
      }
    )
    .sort((a, b) => Number(b.value_all) - Number(a.value_all));

  const acreditationWithTotal = current.reduce(
    (acc: AllProject[], curr: AllProject) => {
      const existing = acc.find((item) => {
        item?.accreditation?.[0] === curr.accreditation?.[0];
      });

      if (existing) {
        if (existing.value !== undefined) {
          existing.value += 1;
        }
      } else {
        acc.push({ accreditation: curr.accreditation, value: 1 });
      }

      return acc;
    },
    []
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="pb-2 text-md font-bold text-blue-900">Analytics</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2 mt-4">
          <CardAnalytic
            title="Total Seluruh Audit"
            count={totalProjects.length}
            data={dataCardAnalytics(totalProjects)}
            dataRunning={dataRunning}
            dataDone={dataDone}
            moreData
          />
          <CardAnalytic
            title="Total Initial Audit"
            count={totalInitialAudit.length}
            data={dataCardAnalytics(totalInitialAudit)}
          />
          <CardAnalytic
            title="Total Surveillance I"
            count={totalSurveillanceI.length}
            data={dataCardAnalytics(totalSurveillanceI)}
          />
          <CardAnalytic
            title="Total Surveillance II"
            count={totalSurveillanceII.length}
            data={dataCardAnalytics(totalSurveillanceII)}
          />
          <CardAnalytic
            title="Total Surveillance III"
            count={totalSurveillanceIII.length}
            data={dataCardAnalytics(totalSurveillanceIII)}
          />
          <CardAnalytic
            title="Total Surveillance IV"
            count={totalSurveillanceIV.length}
            data={dataCardAnalytics(totalSurveillanceIV)}
          />
          <CardAnalytic
            title="Total Surveillance V"
            count={totalSurveillanceV.length}
            data={dataCardAnalytics(totalSurveillanceV)}
          />
          <CardAnalytic
            title="Total RC"
            count={totalRC.length}
            data={dataCardAnalytics(totalRC)}
          />
          <CardAnalytic
            title="Total Special"
            count={totalSpecial.length}
            data={dataCardAnalytics(totalSpecial)}
          />
        </div>
      </div>

      <div>
        <h2 className="pb-2 text-md font-bold text-blue-900">Chart</h2>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 mt-4">
          <div className="md:col-span-4 lg:col-span-5">
            <ChartBarTabs
              sales={salesNameWithTotal}
              lead_time={salesNameWitheLeadTime}
              //   standard={}
            />
          </div>
          <div className="md:col-span-3 lg:col-span-2">
            <ChartPie
              titlePieChart="Acreditation"
              //  data={acreditationWithTotal}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChartView;
