import { provideHttpClientTesting } from '@angular/common/http/testing';
import { CUSTOM_ELEMENTS_SCHEMA, importProvidersFrom } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { MenuController } from '@ionic/angular';
import { provideIonicAngular } from '@ionic/angular/standalone';
import { IonicStorageModule } from '@ionic/storage-angular';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { UserService } from './providers/user.service';

describe('AppComponent', () => {
  let menuSpy, routerSpy, userDataSpy, swUpdateSpy, app, fixture;

  beforeEach(async () => {
    menuSpy = jasmine.createSpyObj('MenuController', ['toggle', 'enable']);
    routerSpy = jasmine.createSpyObj('Router', ['navigateByUrl']);
    userDataSpy = jasmine.createSpyObj('UserData', ['isLoggedIn', 'logout']);
    swUpdateSpy = jasmine.createSpyObj('SwUpdate', [
      'available',
      'activateUpdate',
    ]);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
      providers: [
        provideIonicAngular(),
        provideRouter(routes),
        provideHttpClientTesting(),
        importProvidersFrom(IonicStorageModule.forRoot()),
        { provide: MenuController, useValue: menuSpy },
        // { provide: Router, useValue: routerSpy },
        { provide: UserService, useValue: userDataSpy },
        { provide: SwUpdate, useValue: swUpdateSpy },
        // { provide: Platform, useValue: platformSpy }
      ],
    }).compileComponents();
  });
  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    app = fixture.debugElement.componentInstance;
    app.storage.create();
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });
});
