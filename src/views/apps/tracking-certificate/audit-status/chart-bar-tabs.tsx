"use client";

import { ChartBar } from "@/components/ui/chart-bar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MouseEvent,
  SetStateAction,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

interface ChartBarProps {
  sales: any[];
  standard: any[];
  lead_time: any[];
}

export default function ChartBarTabs({
  sales,
  standard,
  lead_time,
}: ChartBarProps) {
  //   const chartRef = useRef<any>(null);

  //   const [slot, setSlot] = useState<"sales" | "lead_time">("sales");

  //   useLayoutEffect(() => {
  //     if (!chartRef.current) return;

  //     let root = am5.Root.new("chartdiv");

  //     root.setThemes([am5themes_Animated.new(root)]);

  //     // Create chart
  //     // https://www.amcharts.com/docs/v5/charts/xy-chart/
  //     let chart = root.container.children.push(
  //       am5xy.XYChart.new(root, {
  //         panX: true,
  //         panY: true,
  //         wheelX: "panX",
  //         wheelY: "zoomX",
  //         pinchZoomX: true,
  //         paddingLeft: 0,
  //         paddingRight: 1,
  //       })
  //     );

  //     // Add cursor
  //     // https://www.amcharts.com/docs/v5/charts/xy-chart/cursor/
  //     let cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
  //     cursor.lineY.set("visible", false);

  //     // Create axes
  //     // https://www.amcharts.com/docs/v5/charts/xy-chart/axes/
  //     let xRenderer = am5xy.AxisRendererX.new(root, {
  //       minGridDistance: 30,
  //       minorGridEnabled: true,
  //     });

  //     xRenderer.labels.template.setAll({
  //       oversizedBehavior: "wrap",
  //       textAlign: "center",
  //       maxWidth: slot === "sales" ? 95 : 150,
  //     });

  //     let xAxis = chart.xAxes.push(
  //       am5xy.CategoryAxis.new(root, {
  //         maxDeviation: 0.3,
  //         categoryField:
  //           slot === "sales" ? "nama_sales_or_crr" : "nama_perusahaan",
  //         renderer: xRenderer,
  //         tooltip: am5.Tooltip.new(root, {}),
  //       })
  //     );

  //     let yRenderer = am5xy.AxisRendererY.new(root, {
  //       strokeOpacity: 0.1,
  //     });

  //     let yAxis = chart.yAxes.push(
  //       am5xy.ValueAxis.new(root, {
  //         maxDeviation: 0.3,
  //         renderer: yRenderer,
  //       })
  //     );

  //     // Create series
  //     // https://www.amcharts.com/docs/v5/charts/xy-chart/series/
  //     function makeSeries(name: string, fieldName: string, label?: string) {
  //       let series = chart.series.push(
  //         am5xy.ColumnSeries.new(root, {
  //           name,
  //           xAxis: xAxis,
  //           yAxis: yAxis,
  //           valueYField: fieldName,
  //           categoryXField:
  //             slot === "sales" ? "nama_sales_or_crr" : "nama_perusahaan",
  //           tooltip: am5.Tooltip.new(root, {
  //             labelText:
  //               slot === "sales" ? `Sales: {valueY}` : `Standar: {all_standar}`,
  //           }),
  //         })
  //       );

  //       series.columns.template.setAll({
  //         cornerRadiusTL: 5,
  //         cornerRadiusTR: 5,
  //         strokeOpacity: 0,
  //       });
  //       series.columns.template.adapters.add("fill", function (fill, target) {
  //         return chart.get("colors")?.getIndex(series.columns.indexOf(target));
  //       });

  //       series.columns.template.adapters.add("stroke", function (stroke, target) {
  //         return chart.get("colors")?.getIndex(series.columns.indexOf(target));
  //       });

  //       // Pre-zoom the chart
  //       if (slot === "lead_time") {
  //         series.events.once("datavalidated", () => {
  //           xAxis.zoomToIndexes(0, 4);
  //         });
  //       }

  //       series.data.setAll(slot === "sales" ? sales : lead_time);
  //       series.appear(1000);

  //       // Add Label bullet
  //       series.bullets.push(function () {
  //         return am5.Bullet.new(root, {
  //           locationY: 1,
  //           sprite: am5.Label.new(root, {
  //             text:
  //               slot === "sales"
  //                 ? "{valueYWorking.formatNumber('#.')}"
  //                 : `{valueYWorking.formatNumber('#.')} Hari\n(${label})`,
  //             fill: root.interfaceColors.get("alternativeText"),
  //             centerY: 0,
  //             centerX: am5.p50,
  //             populateText: true,
  //           }),
  //         });
  //       });

  //       // legend.data.push(series);
  //     }

  //     if (slot === "sales") {
  //       makeSeries("Sales", "value");
  //     } else {
  //       makeSeries("Lead Time All", "value_all", "All");
  //       makeSeries(
  //         "Lead Time Capa to Certificate",
  //         "value_capa_to_certificate",
  //         "Audit - \n Crtificate"
  //       );
  //     }

  //     // Add scrollbar
  //     chart.set(
  //       "scrollbarX",
  //       am5.Scrollbar.new(root, {
  //         orientation: "horizontal",
  //       })
  //     );

  //     xAxis.data.setAll(slot === "sales" ? sales : lead_time);

  //     // Make stuff animate on load
  //     chart.appear(1000, 100);

  //     chartRef.current = root;

  //     return () => {
  //       root.dispose();
  //     };
  //   }, [sales, lead_time, slot]);

  //   // Group Button
  //   const handleChange = (
  //     event: MouseEvent<HTMLElement>,
  //     newAlignment: SetStateAction<"sales" | "lead_time">
  //   ) => {
  //     if (newAlignment) setSlot(newAlignment);
  //   };

  return (
    <Tabs defaultValue="sales" className="w-full">
      <TabsList className="grid w-full grid-cols-3 mb-2">
        <TabsTrigger value="sales">Sales</TabsTrigger>
        <TabsTrigger value="standard">Standard</TabsTrigger>
        <TabsTrigger value="lead_time">Lead Time</TabsTrigger>
      </TabsList>

      <TabsContent value="sales">
        <div className="h-72">
          <ChartBar
            descriptionBarChart="Show data Sales"
            titleBarChart="Bar Chart - Sales"
          />
        </div>
      </TabsContent>

      <TabsContent value="standard">
        <div className="h-72">
          <ChartBar
            descriptionBarChart="Show data Standard"
            titleBarChart="Bar Chart - Standard"
          />
        </div>
      </TabsContent>

      <TabsContent value="lead_time">
        <div className="h-72">
          <ChartBar
            descriptionBarChart="Show data Lead Time"
            titleBarChart="Bar Chart - Lead Time"
          />
        </div>
      </TabsContent>
    </Tabs>
  );
}
