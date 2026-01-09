import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import {
  productStatusData,
  revenueByDay,
  revenueLastYearByMonth,
  revenueThisYearByMonth,
  topCustomers,
  todayOrdersTrend,
  todayProductsTrend,
  todayRevenueTrend,
  todayVisitorsTrend,
} from '../data/charts-data.js';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, CanvasJSAngularChartsModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements AfterViewInit {
  @ViewChild('brandOrange', { static: true }) brandOrange!: ElementRef<HTMLSpanElement>;
  @ViewChild('brandSlate', { static: true }) brandSlate!: ElementRef<HTMLSpanElement>;
  @ViewChild('brandRed', { static: true }) brandRed!: ElementRef<HTMLSpanElement>;

  miniCards: Array<{ title: string; value: string; delta: string; options: any }> = [];

  revenueComparisonOptions: any;
  productStatusOptions: any;
  topCustomersOptions: any;

  constructor() {
    // Initialized in ngAfterViewInit using Tailwind-derived colors.
    this.revenueComparisonOptions = {};
    this.productStatusOptions = {};
    this.topCustomersOptions = {};
  }

  ngAfterViewInit(): void {
    const orange = getComputedStyle(this.brandOrange.nativeElement).color;
    const slate = getComputedStyle(this.brandSlate.nativeElement).color;
    const red = getComputedStyle(this.brandRed.nativeElement).color;

    this.revenueComparisonOptions = this.buildRevenueComparisonOptions(orange, slate);
    this.productStatusOptions = this.buildProductStatusOptions(orange, slate, red);
    this.topCustomersOptions = this.buildTopCustomersOptions(orange);
    this.miniCards = this.buildMiniCards(orange, slate);
  }

  private buildMiniCards(brandColor: string, secondaryColor: string) {
    const orangeLine = this.toRgba(brandColor, 1);
    const orangeFill = this.toRgba(brandColor, 0.25);
    const slateLine = this.toRgba(secondaryColor, 0.8);
    const slateFill = this.toRgba(secondaryColor, 0.18);

    return [
      {
        title: 'Today revenue',
        value: 'D2,000',
        delta: '+15% from yesterday',
        options: this.buildSparklineOptions(todayRevenueTrend, orangeLine, orangeFill),
      },
      {
        title: 'Today orders',
        value: '200',
        delta: '+9% from yesterday',
        options: this.buildSparklineOptions(todayOrdersTrend, orangeLine, orangeFill),
      },
      {
        title: 'Today products',
        value: '50',
        delta: '+5% from yesterday',
        options: this.buildSparklineOptions(todayProductsTrend, orangeLine, orangeFill),
      },
      {
        title: 'Today visitors',
        value: '2,000',
        delta: '+20% from yesterday',
        options: this.buildSparklineOptions(todayVisitorsTrend, slateLine, slateFill),
      },
    ];
  }

  private buildSparklineOptions(
    source: Array<{ hour: string; value: number }>,
    lineColor: string,
    fillColor: string,
  ) {
    const axisLabelColor = this.toRgba(lineColor, 0.65);

    return {
      animationEnabled: true,
      theme: 'dark2',
      backgroundColor: 'transparent',
      toolTip: { enabled: false },
      axisX: {
        interval: 2,
        labelFontSize: 10,
        labelFontColor: axisLabelColor,
        tickLength: 0,
        lineThickness: 0,
        gridThickness: 0,
      },
      axisY: {
        labelFontSize: 0,
        tickLength: 0,
        lineThickness: 0,
        gridThickness: 0,
        includeZero: false,
      },
      data: [
        {
          type: 'splineArea',
          markerSize: 0,
          lineThickness: 2,
          color: fillColor,
          lineColor,
          dataPoints: source.map((d) => ({ label: d.hour, y: d.value })),
        },
      ],
    };
  }

  private buildRevenueComparisonOptions(primary: string, secondary: string) {
    const primaryLine = this.toRgba(primary, 1);
    const secondaryLine = this.toRgba(secondary, 0.7);

    return {
      animationEnabled: true,
      theme: 'dark2',
      backgroundColor: 'transparent',
      legend: {
        fontColor: secondaryLine,
        verticalAlign: 'top',
        horizontalAlign: 'right',
      },
      axisY: {
        prefix: '₦',
        gridThickness: 0.5,
      },
      axisX: {
        interval: 1,
      },
      data: [
        {
          type: 'spline',
          showInLegend: true,
          legendText: 'This year',
          lineThickness: 2,
          color: primaryLine,
          markerSize: 5,
          dataPoints: revenueThisYearByMonth.map((d, i) => ({ x: i + 1, y: d.value, label: d.month })),
        },
        {
          type: 'spline',
          showInLegend: true,
          legendText: 'Last year',
          lineThickness: 2,
          color: secondaryLine,
          lineDashType: 'dash',
          markerSize: 5,
          dataPoints: revenueLastYearByMonth.map((d, i) => ({ x: i + 1, y: d.value, label: d.month })),
        },
      ],
    };
  }

  private buildProductStatusOptions(primary: string, secondary: string, danger: string) {
    const deliveredFill = this.toRgba(primary, 0.9);
    const pendingFill = this.toRgba(secondary, 0.55);
    const canceledFill = this.toRgba(danger, 0.75);
    const legendColor = this.toRgba(secondary, 0.55);

    return {
      animationEnabled: true,
      theme: 'dark2',
      backgroundColor: 'transparent',
      legend: {
        fontColor: legendColor,
        verticalAlign: 'bottom',
        horizontalAlign: 'center',
      },
      data: [
        {
          type: 'doughnut',
          startAngle: 270,
          innerRadius: '65%',
          showInLegend: true,
          legendMarkerType: 'circle',
          indexLabelFontColor: legendColor,
          dataPoints: productStatusData.map((d) => ({
            y: d.count,
            label: d.status,
            name: d.status,
            color:
              d.status === 'Delivered'
                ? deliveredFill
                : d.status === 'Pending'
                  ? pendingFill
                  : canceledFill,
          })),
        },
      ],
    };
  }

  private buildTopCustomersOptions(primary: string) {
    const barColor = this.toRgba(primary, 0.8);
    const axisColor = this.toRgba(primary, 0.55);

    return {
      animationEnabled: true,
      theme: 'dark2',
      backgroundColor: 'transparent',
      axisY: {
        gridThickness: 0.5,
        labelFontColor: axisColor,
        prefix: '₦',
      },
      axisX: {
        labelFontColor: axisColor,
        labelAngle: -35,
        interval: 1,
      },
      data: [
        {
          type: 'column',
          color: barColor,
          dataPoints: topCustomers.map((d) => ({ label: d.name, y: d.totalSpent })),
        },
      ],
    };
  }

  private toRgba(color: string, alpha: number): string {
    const trimmed = color.trim();
    if (trimmed.startsWith('rgba(')) {
      const inside = trimmed.slice(5, -1);
      const parts = inside.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      }
    }
    if (trimmed.startsWith('rgb(')) {
      const inside = trimmed.slice(4, -1);
      const parts = inside.split(',').map((p) => p.trim());
      if (parts.length >= 3) {
        return `rgba(${parts[0]}, ${parts[1]}, ${parts[2]}, ${alpha})`;
      }
    }
    return trimmed;
  }
}
