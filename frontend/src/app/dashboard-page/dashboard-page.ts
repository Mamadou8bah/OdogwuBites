import { Component, OnInit, ChangeDetectorRef, HostListener, ElementRef, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxChartsModule, Color, ScaleType } from '@swimlane/ngx-charts';
import { DashboardService } from '../service/dashboard.service';
import { curveMonotoneX } from 'd3-shape';

const COLORS = {
  primary: 'rgba(251, 146, 60, 1)',
  primaryFaint: 'rgba(251, 146, 60, 0.2)',
  secondary: 'rgba(203, 213, 225, 1)',
  secondaryFaint: 'rgba(203, 213, 225, 0.1)',
  warn: 'rgba(250, 204, 21, 1)',
  danger: 'rgba(248, 113, 113, 1)',
  grid: 'rgba(255, 255, 255, 0.05)'
};

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  imports: [CommonModule, NgxChartsModule],
  templateUrl: './dashboard-page.html',
  styleUrl: './dashboard-page.css',
})
export class DashboardPage implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('revenueContainer') revenueContainer?: ElementRef<HTMLElement>;
  @ViewChild('pieContainer') pieContainer?: ElementRef<HTMLElement>;
  @ViewChild('barContainer') barContainer?: ElementRef<HTMLElement>;

  private resizeObserver?: ResizeObserver;
  miniCards: Array<{
    title: string;
    value: string | number;
    delta: string;
    results: any[];
    scheme: Color;
  }> = [];

  revenueComparisonResults: any[] = [];
  productStatusResults: any[] = [];
  topCustomersResults: any[] = [];

  readonly curve = curveMonotoneX;

  readonly schemePrimary: Color = {
    name: 'odogwuPrimary',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [COLORS.primary]
  };

  readonly schemeComparison: Color = {
    name: 'odogwuComparison',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [COLORS.primary, COLORS.secondary]
  };

  readonly schemeStatus: Color = {
    name: 'odogwuStatus',
    selectable: true,
    group: ScaleType.Ordinal,
    domain: [COLORS.primary, COLORS.secondary, COLORS.warn, COLORS.danger]
  };

  // Ensure specific statuses always keep consistent colors.
  readonly statusColors = [
    { name: 'Delivered', value: COLORS.primary },
    { name: 'Pending', value: COLORS.secondary },
    { name: 'Accepted', value: COLORS.warn },
    { name: 'Cancelled', value: COLORS.danger },
  ];

  sparkView: [number, number] = [240, 84];
  revenueView: [number, number] = [900, 360];
  pieView: [number, number] = [360, 260];
  barView: [number, number] = [900, 260];

  wrapTicks = false;
  maxXAxisTickLength = 14;
  maxYAxisTickLength = 10;

  stats: any = {
    todayRevenue: 0, todayOrders: 0, todayUsers: 0, totalProducts: 0,
    trends: { revenue: [], orders: [], products: [], users: [] },
    revenueComparison: { thisYear: [], lastYear: [] },
    statusDistribution: [],
    topCustomers: []
  };

  constructor(private dashboardService: DashboardService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.dashboardService.getStats().subscribe({
      next: (data) => {
        this.stats = data;
        this.setViews();
        this.renderCharts();
        this.cdr.detectChanges();
      }
    });
  }

  ngAfterViewInit(): void {
    if (typeof ResizeObserver === 'undefined') {
      // Fallback to window sizing only.
      this.setViews();
      return;
    }

    this.resizeObserver = new ResizeObserver(() => this.setViews());
    if (this.revenueContainer?.nativeElement) this.resizeObserver.observe(this.revenueContainer.nativeElement);
    if (this.pieContainer?.nativeElement) this.resizeObserver.observe(this.pieContainer.nativeElement);
    if (this.barContainer?.nativeElement) this.resizeObserver.observe(this.barContainer.nativeElement);

    // Initial pass once DOM is measured.
    this.setViews();
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  @HostListener('window:resize')
  onResize(): void {
    this.setViews();
  }

  private renderCharts(): void {
    this.miniCards = [
      {
        title: 'Today revenue',
        value: `D${Number(this.stats.todayRevenue || 0).toLocaleString()}`,
        delta: 'In Dalasi',
        results: this.sparkSeries(this.stats.trends?.revenue || [], 'Revenue'),
        scheme: this.schemePrimary
      },
      {
        title: 'Today orders',
        value: Number(this.stats.todayOrders || 0),
        delta: 'Completed & Pending',
        results: this.sparkSeries(this.stats.trends?.orders || [], 'Orders'),
        scheme: this.schemePrimary
      },
      {
        title: 'Total products',
        value: Number(this.stats.totalProducts || 0),
        delta: 'Active Menu Items',
        results: this.sparkSeries(this.stats.trends?.products || [], 'Products'),
        scheme: this.schemePrimary
      },
      {
        title: 'Today visitors',
        value: Number(this.stats.todayUsers || 0),
        delta: 'New Registrations',
        results: this.sparkSeries(this.stats.trends?.users || [], 'Visitors'),
        scheme: {
          name: 'odogwuSecondary',
          selectable: true,
          group: ScaleType.Ordinal,
          domain: [COLORS.secondary]
        }
      },
    ];

    this.revenueComparisonResults = [
      {
        name: 'This Year',
        series: (this.stats.revenueComparison?.thisYear || []).map((d: any) => ({
          name: d.month,
          value: Number(d.value || 0)
        }))
      },
      {
        name: 'Last Year',
        series: (this.stats.revenueComparison?.lastYear || []).map((d: any) => ({
          name: d.month,
          value: Number(d.value || 0)
        }))
      }
    ];

    this.productStatusResults = (this.stats.statusDistribution || []).map((d: any) => ({
      name: d.status,
      value: Number(d.count || 0)
    }));

    this.topCustomersResults = (this.stats.topCustomers || []).map((d: any) => ({
      name: d.name,
      value: Number(d.totalSpent || 0)
    }));
  }

  currencyTick = (value: number): string => `D${Number(value || 0).toLocaleString()}`;

  countTick = (value: number): string => `${Number(value || 0).toLocaleString()}`;

  tooltipCurrency = (value: unknown): string => `D${Number(value || 0).toLocaleString()}`;

  tooltipCount = (value: unknown): string => `${Number(value || 0).toLocaleString()}`;

  statusTooltipText = (data: any): string => {
    const status = data?.name ?? 'Status';
    const count = this.tooltipCount(data?.value);
    return `${status}: ${count}`;
  };

  private sparkSeries(data: any[], name: string): any[] {
    return [
      {
        name,
        series: (Array.isArray(data) ? data : []).map((d: any, idx: number) => ({
          name: d.hour ?? d.name ?? String(idx),
          value: Number(d.value || 0)
        }))
      }
    ];
  }

  private setViews(): void {
    const w = window.innerWidth || 1200;
    // Account for sidebar on md+ and padding.
    const content = w < 768 ? w - 32 : w - 256 - 64;
    const safe = Math.max(320, content);

    // Mini cards are full-width on mobile, half-width on md, quarter on xl.
    // Keep sparkline compact but scale down on small screens.
    const sparkWidth = Math.max(200, Math.min(280, safe - 80));
    const revenueHeight = w < 480 ? 280 : 360;
    const barHeight = w < 480 ? 300 : 260;
    const pieHeight = 260;

    const isMobile = w < 640;
    this.wrapTicks = isMobile;
    this.maxXAxisTickLength = isMobile ? 10 : 16;
    this.maxYAxisTickLength = isMobile ? 10 : 12;

    this.sparkView = [sparkWidth, 84];

    const revenueW = this.revenueContainer?.nativeElement?.clientWidth;
    const pieW = this.pieContainer?.nativeElement?.clientWidth;
    const barW = this.barContainer?.nativeElement?.clientWidth;

    const revenueWidth = Math.max(320, Math.min(1100, (revenueW ?? (safe - 40)) - 8));
    const pieWidth = Math.max(240, Math.min(520, (pieW ?? (safe - 40)) - 8));
    const barWidth = Math.max(320, Math.min(1100, (barW ?? (safe - 40)) - 8));

    this.revenueView = [revenueWidth, revenueHeight];
    this.pieView = [pieWidth, pieHeight];
    this.barView = [barWidth, barHeight];
  }
}