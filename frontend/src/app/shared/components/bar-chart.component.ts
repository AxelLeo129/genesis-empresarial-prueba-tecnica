import { Component, ChangeDetectionStrategy, input, effect, ElementRef, viewChild, afterNextRender } from '@angular/core';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

export interface BarChartData {
  label: string;
  value1: number;
  value2?: number;
}

@Component({
  selector: 'app-bar-chart',
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
      height: 250px;
    }
  `]
})
export class BarChartComponent {
  readonly data = input<BarChartData[]>([]);
  readonly label1 = input<string>('Deposito');
  readonly label2 = input<string>('Retiro');
  readonly color1 = input<string>('#20C997');
  readonly color2 = input<string>('#5C7CFA');
  readonly showLegend = input<boolean>(true);

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
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          {
            label: this.label1(),
            data: data.map(d => d.value1),
            backgroundColor: this.color1(),
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          },
          {
            label: this.label2(),
            data: data.map(d => d.value2 ?? 0),
            backgroundColor: this.color2(),
            borderRadius: 6,
            barPercentage: 0.6,
            categoryPercentage: 0.7
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: this.showLegend(),
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 20,
              font: {
                size: 12
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
    this.chart.data.datasets[0].data = data.map(d => d.value1);
    this.chart.data.datasets[1].data = data.map(d => d.value2 ?? 0);
    this.chart.update();
  }
}
