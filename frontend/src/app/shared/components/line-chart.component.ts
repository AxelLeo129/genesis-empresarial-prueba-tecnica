import { Component, ChangeDetectionStrategy, input, effect, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface LineChartData {
  label: string;
  value: number;
}

@Component({
  selector: 'app-line-chart',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="chart-container">
      <canvas #chartCanvas></canvas>
    </div>
  `,
  styles: [`
    :host {
      display: block;
    }
    .chart-container {
      position: relative;
      height: 200px;
    }
  `]
})
export class LineChartComponent {
  readonly data = input<LineChartData[]>([]);
  readonly color = input<string>('#3B5BDB');
  readonly fillColor = input<string>('rgba(59, 91, 219, 0.1)');
  readonly showArea = input<boolean>(true);

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
    const config: ChartConfiguration = {
      type: 'line',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          borderColor: this.color(),
          backgroundColor: this.fillColor(),
          fill: this.showArea(),
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: this.color(),
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 4,
          pointHoverRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return `$${(context.parsed.y ?? 0).toLocaleString()}`;
              }
            }
          }
        },
        scales: {
          x: {
            grid: {
              display: false
            },
            ticks: {
              font: {
                size: 11
              }
            }
          },
          y: {
            beginAtZero: true,
            grid: {
              color: '#f0f0f0'
            },
            ticks: {
              font: {
                size: 11
              },
              callback: (value) => `$${value}`
            }
          }
        },
        interaction: {
          intersect: false,
          mode: 'index'
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
    this.chart.update();
  }
}
