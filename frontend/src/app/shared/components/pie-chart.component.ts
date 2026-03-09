import { Component, ChangeDetectionStrategy, input, effect, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface PieChartData {
  label: string;
  value: number;
  percentage: number;
  color: string;
}

@Component({
  selector: 'app-pie-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex items-center gap-6">
      <div class="relative">
        <canvas #chartCanvas width="180" height="180"></canvas>
      </div>
      <div class="space-y-3">
        @for (item of data(); track item.label) {
          <div class="flex items-center gap-2">
            <span class="w-3 h-3 rounded-full" [style.backgroundColor]="item.color"></span>
            <span class="text-sm">
              <span class="font-semibold">{{ item.percentage }}%</span>
              <span class="text-gray-500 ml-1">{{ item.label }}</span>
            </span>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
  `]
})
export class PieChartComponent {
  readonly data = input<PieChartData[]>([]);

  readonly chartCanvas = viewChild<ElementRef<HTMLCanvasElement>>('chartCanvas');

  private chart: Chart | null = null;

  constructor() {
    afterNextRender(() => {
      this.initChart();
    });

    effect(() => {
      const data = this.data();
      if (this.chart && data.length > 0) {
        this.updateChart();
      }
    });
  }

  private initChart(): void {
    const canvas = this.chartCanvas()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const data = this.data();
    const config: ChartConfiguration<'doughnut'> = {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color),
          borderWidth: 0,
          hoverOffset: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        cutout: '65%',
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || '';
                const value = context.parsed || 0;
                return `${label}: $${value.toLocaleString()}`;
              }
            }
          }
        }
      }
    };

    this.chart = new Chart(ctx, config);
  }

  private updateChart(): void {
    if (!this.chart) return;

    const data = this.data();
    this.chart.data.labels = data.map(d => d.label);
    this.chart.data.datasets[0].data = data.map(d => d.value);
    this.chart.data.datasets[0].backgroundColor = data.map(d => d.color);
    this.chart.update();
  }
}
