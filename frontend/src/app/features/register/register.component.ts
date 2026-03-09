import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ClientService } from '../../core/services';

interface Department {
  name: string;
  municipalities: string[];
}

@Component({
  selector: 'app-register',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {
  private readonly fb = inject(FormBuilder);
  private readonly clientService = inject(ClientService);
  private readonly router = inject(Router);

  readonly activeTab = signal<'client'>('client');
  readonly isSubmitting = signal(false);
  readonly showSuccess = signal(false);
  readonly errorMessage = signal<string | null>(null);
  readonly avatarPreview = signal('https://randomuser.me/api/portraits/women/44.jpg');
  readonly selectedDepartment = signal<string | null>(null);
  readonly municipalities = signal<string[]>([]);

  readonly departments: Department[] = [
    { name: 'Guatemala', municipalities: ['Guatemala', 'Mixco', 'Villa Nueva', 'Petapa', 'San Miguel Petapa', 'Chinautla', 'San Juan Sacatepéquez', 'San Pedro Sacatepéquez', 'Fraijanes', 'Amatitlán', 'Villa Canales', 'Palencia', 'San José Pinula', 'Santa Catarina Pinula', 'San Raymundo', 'Chuarrancho', 'San Pedro Ayampuc'] },
    { name: 'Sacatepéquez', municipalities: ['Antigua Guatemala', 'Ciudad Vieja', 'Jocotenango', 'Magdalena Milpas Altas', 'Pastores', 'San Antonio Aguas Calientes', 'San Bartolomé Milpas Altas', 'San Lucas Sacatepéquez', 'San Miguel Dueñas', 'Santa Catarina Barahona', 'Santa Lucía Milpas Altas', 'Santa María de Jesús', 'Santiago Sacatepéquez', 'Santo Domingo Xenacoj', 'Sumpango', 'Alotenango'] },
    { name: 'Escuintla', municipalities: ['Escuintla', 'Guanagazapa', 'Iztapa', 'La Democracia', 'La Gomera', 'Masagua', 'Nueva Concepción', 'Palín', 'San José', 'San Vicente Pacaya', 'Santa Lucía Cotzumalguapa', 'Siquinalá', 'Tiquisate'] },
    { name: 'Quetzaltenango', municipalities: ['Quetzaltenango', 'Almolonga', 'Cabricán', 'Cajolá', 'Cantel', 'Coatepeque', 'Colomba', 'Concepción Chiquirichapa', 'El Palmar', 'Flores Costa Cuca', 'Génova', 'Huitán', 'La Esperanza', 'Olintepeque', 'Palestina de Los Altos', 'Salcajá', 'San Carlos Sija', 'San Francisco La Unión', 'San Juan Ostuncalco', 'San Martín Sacatepéquez', 'San Mateo', 'San Miguel Sigüilá', 'Sibilia', 'Zunil'] },
    { name: 'Petén', municipalities: ['Flores', 'San José', 'San Benito', 'San Andrés', 'La Libertad', 'San Francisco', 'Santa Ana', 'Dolores', 'San Luis', 'Sayaxché', 'Melchor de Mencos', 'Poptún', 'Las Cruces', 'El Chal'] }
  ];

  readonly form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    dpi: ['', [Validators.required, Validators.pattern(/^\d{13}$/)]],
    birthDate: [''],
    address: [''],
    department: [''],
    municipality: ['']
  });

  isFieldInvalid(fieldName: string): boolean {
    const field = this.form.get(fieldName);
    return !!(field && field.invalid && (field.dirty || field.touched));
  }

  onDepartmentChange(): void {
    const deptName = this.form.get('department')?.value;
    this.selectedDepartment.set(deptName);

    if (deptName) {
      const dept = this.departments.find(d => d.name === deptName);
      this.municipalities.set(dept?.municipalities || []);
    } else {
      this.municipalities.set([]);
    }

    this.form.get('municipality')?.setValue('');
  }

  triggerFileInput(): void {
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        this.avatarPreview.set(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.showSuccess.set(false);
    this.errorMessage.set(null);

    const formData = {
      ...this.form.value,
      avatarUrl: this.avatarPreview()
    };

    this.clientService.create(formData).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.showSuccess.set(true);
        this.form.reset();

        // Navigate to accounts after 2 seconds
        setTimeout(() => {
          this.router.navigate(['/cuentas']);
        }, 2000);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.errorMessage.set(err.message || 'Error al registrar cliente');
      }
    });
  }
}
