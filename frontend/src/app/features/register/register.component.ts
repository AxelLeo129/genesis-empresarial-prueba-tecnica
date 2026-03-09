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
  template: `
    <div class="animate-fadeIn max-w-4xl mx-auto">
      <div class="card">
        <!-- Tabs -->
        <div class="border-b border-gray-200 mb-6">
          <nav class="flex gap-8">
            <button
              class="pb-3 px-1 border-b-2 font-medium text-sm transition-colors"
              [class.border-primary-500]="activeTab() === 'client'"
              [class.text-primary-500]="activeTab() === 'client'"
              [class.border-transparent]="activeTab() !== 'client'"
              [class.text-gray-500]="activeTab() !== 'client'"
              (click)="activeTab.set('client')"
            >
              Cliente
            </button>
          </nav>
        </div>

        <!-- Form -->
        <form [formGroup]="form" (ngSubmit)="onSubmit()">
          <div class="flex gap-8">
            <!-- Avatar section -->
            <div class="flex-shrink-0">
              <div class="relative">
                <img
                  [src]="avatarPreview()"
                  alt="Avatar"
                  class="w-24 h-24 rounded-full object-cover border-4 border-gray-100"
                />
                <button
                  type="button"
                  class="absolute bottom-0 right-0 w-8 h-8 bg-primary-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-primary-600 transition-colors"
                  (click)="triggerFileInput()"
                >
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"></path>
                  </svg>
                </button>
                <input
                  #fileInput
                  type="file"
                  accept="image/*"
                  class="hidden"
                  (change)="onFileSelected($event)"
                />
              </div>
            </div>

            <!-- Form fields -->
            <div class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- First Name -->
              <div>
                <label class="label">Nombres</label>
                <input
                  type="text"
                  formControlName="firstName"
                  class="input"
                  [class.input-error]="isFieldInvalid('firstName')"
                  placeholder="Juan"
                />
                @if (isFieldInvalid('firstName')) {
                  <p class="text-red-500 text-sm mt-1">Nombres es requerido</p>
                }
              </div>

              <!-- Last Name -->
              <div>
                <label class="label">Apellidos</label>
                <input
                  type="text"
                  formControlName="lastName"
                  class="input"
                  [class.input-error]="isFieldInvalid('lastName')"
                  placeholder="Perez"
                />
                @if (isFieldInvalid('lastName')) {
                  <p class="text-red-500 text-sm mt-1">Apellidos es requerido</p>
                }
              </div>

              <!-- Email -->
              <div>
                <label class="label">Correo</label>
                <input
                  type="email"
                  formControlName="email"
                  class="input"
                  [class.input-error]="isFieldInvalid('email')"
                  placeholder="correo@ejemplo.com"
                />
                @if (isFieldInvalid('email')) {
                  <p class="text-red-500 text-sm mt-1">
                    @if (form.get('email')?.errors?.['required']) {
                      Correo es requerido
                    } @else {
                      Formato de correo inválido
                    }
                  </p>
                }
              </div>

              <!-- DPI -->
              <div>
                <label class="label">DPI</label>
                <input
                  type="text"
                  formControlName="dpi"
                  class="input"
                  [class.input-error]="isFieldInvalid('dpi')"
                  placeholder="1234567890123"
                  maxlength="13"
                />
                @if (isFieldInvalid('dpi')) {
                  <p class="text-red-500 text-sm mt-1">
                    @if (form.get('dpi')?.errors?.['required']) {
                      DPI es requerido
                    } @else {
                      DPI debe tener 13 dígitos
                    }
                  </p>
                }
              </div>

              <!-- Birth Date -->
              <div>
                <label class="label">Fecha de Nacimiento</label>
                <input
                  type="date"
                  formControlName="birthDate"
                  class="input"
                />
              </div>

              <!-- Address -->
              <div>
                <label class="label">Dirección</label>
                <input
                  type="text"
                  formControlName="address"
                  class="input"
                  placeholder="Ciudad de Guatemala"
                />
              </div>

              <!-- Department -->
              <div>
                <label class="label">Departamento</label>
                <select
                  formControlName="department"
                  class="input"
                  (change)="onDepartmentChange()"
                >
                  <option value="">Seleccione un departamento</option>
                  @for (dept of departments; track dept.name) {
                    <option [value]="dept.name">{{ dept.name }}</option>
                  }
                </select>
              </div>

              <!-- Municipality -->
              <div>
                <label class="label">Municipio</label>
                <select
                  formControlName="municipality"
                  class="input"
                  [disabled]="!selectedDepartment()"
                >
                  <option value="">Seleccione un municipio</option>
                  @for (municipality of municipalities(); track municipality) {
                    <option [value]="municipality">{{ municipality }}</option>
                  }
                </select>
              </div>
            </div>
          </div>

          <!-- Submit button -->
          <div class="flex justify-end mt-8">
            <button
              type="submit"
              class="btn-primary px-8 py-3"
              [disabled]="isSubmitting()"
            >
              @if (isSubmitting()) {
                <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Guardando...
              } @else {
                Guardar
              }
            </button>
          </div>
        </form>

        <!-- Success message -->
        @if (showSuccess()) {
          <div class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3">
            <svg class="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-green-700">Cliente registrado exitosamente</p>
          </div>
        }

        <!-- Error message -->
        @if (errorMessage()) {
          <div class="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3">
            <svg class="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <p class="text-red-700">{{ errorMessage() }}</p>
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
