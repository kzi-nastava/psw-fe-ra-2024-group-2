import { Component, ViewChild, ElementRef, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, registerables } from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';

interface RotationValue {
  minDegree: number;
  maxDegree: number;
  value: number;
}

@Component({
  selector: 'app-wheel-of-fortune',
  templateUrl: './wheel-of-fortune.component.html',
  styleUrls: ['./wheel-of-fortune.component.css']
})
export class WheelOfFortuneComponent implements OnInit {
  @ViewChild('wheel', { static: true }) wheelCanvas!: ElementRef<HTMLCanvasElement>;

  @Input() disabled: boolean = false;
  @Output() spinCompleted = new EventEmitter<string>();
  private chart!: Chart;
  spinResultMessage: string = 'Click On The Spin Button To Start';
  private currentRotation: number = 0;

  private rotationValues: RotationValue[] = [
    { minDegree: 0, maxDegree: 30, value: 2 },
    { minDegree: 31, maxDegree: 90, value: 1 },
    { minDegree: 91, maxDegree: 150, value: 6 },
    { minDegree: 151, maxDegree: 210, value: 5 },
    { minDegree: 211, maxDegree: 270, value: 4 },
    { minDegree: 271, maxDegree: 330, value: 3 },
    { minDegree: 331, maxDegree: 360, value: 2 },
  ];

  ngOnInit() {
    Chart.register(...registerables);
    this.initializeWheel();
  }

  private initializeWheel() {
    const ctx = this.wheelCanvas.nativeElement.getContext('2d');
    if (!ctx) return;
    console.log(ctx)


    const data = [16, 16, 16, 16, 16, 16];
    const pieColors = [
      "#14a7c4", "#007c94", "#14a7c4", 
      "#007c94", "#14a7c4", "#007c94"
    ];

    const config: ChartConfiguration = {
      type: 'pie',
      data: {
        labels: ['again', '15%', '5%', 'bad luck', '10%', '20%'],
        datasets: [{
          backgroundColor: pieColors,
          data: data
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          tooltip: { 
            enabled: false 
          },
          legend: { 
            position: 'top',
            display: false 
          },
          datalabels: {
            color: "#f87912",
            formatter: (value: any, context: any) => {
              const dataIndex = context.dataIndex;
              const labels = context.chart.data.labels;
              return labels && labels[dataIndex] 
                ? String(labels[dataIndex]) 
                : '';
            },
            font: { 
              size: 20,
              weight: 'bold'
            }
          }
        }
      },
      plugins: [ChartDataLabels]
    };

    this.chart = new Chart(ctx, config);
    //console.log(ctx);
    //console.log(this.chart.data);
  }

  spinWheel() {
    const spinButton = document.getElementById('spin-btn') as HTMLButtonElement;
    spinButton.disabled = true;
    this.spinResultMessage = 'Good Luck!';

    const randomDegree = Math.floor(Math.random() * 360); // Ciljani ugao gde se točak zaustavlja
    const totalSpins = 15; // Broj punih krugova
    const duration = 2000; // Ukupno trajanje animacije u milisekundama

    let absoluteRotation = 0; // Apsolutna rotacija koja se stalno povećava
    const startTime = performance.now(); // Početno vreme

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime; // Proteklo vreme
      const progress = Math.min(elapsed / duration, 1); // Normalizovan progres između 0 i 1
  
      // Funkcija za usporavanje (ease-out efekat)
      const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2);
  
      // Izračunavanje trenutne apsolutne rotacije
      const easedProgress = easeOutSine(progress);
      absoluteRotation = easedProgress * (totalSpins * 360 + randomDegree);
  
      // Postavljanje trenutne rotacije na chart
      (this.chart.options as any).rotation = absoluteRotation;
      this.chart.update();
  
      //console.log(`Absolute Rotation: ${absoluteRotation}`);
  
      // Provera da li je animacija završena
      if (progress < 1) {
          requestAnimationFrame(animate);
      } else {
          // Animacija završena
          const displayedRotation = absoluteRotation % 360; // Konačna rotacija u okviru [0, 360]
          this.valueGenerator(displayedRotation); // Generiši rezultat
          spinButton.disabled = false; // Omogući dugme
      }
  };
      // Pokretanje animacije
      requestAnimationFrame(animate);
  }

  private valueGenerator(angleValue: number) {
    const labels = ['again', '15%', '5%', 'bad luck', '10%', '20%'];
    for (let rotation of this.rotationValues) {
      if (angleValue >= rotation.minDegree && angleValue <= rotation.maxDegree) {
        //const resultValue = rotation.value;
        if(labels[rotation.value-1] === 'again') 
          this.spinResultMessage = 'You have another try'
        else
          this.spinResultMessage = '';
        this.spinCompleted.emit(labels[rotation.value-1]); // Emituj rezultat
        break;
      }
    }
  }
}