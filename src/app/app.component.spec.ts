import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

describe('test app component', () => {
    let fixture: ComponentFixture<AppComponent>;
    let comp: AppComponent;
    let de: DebugElement;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [ RouterTestingModule ],
            declarations: [ AppComponent ]
        });

        fixture = TestBed.createComponent(AppComponent);
        comp = fixture.componentInstance;
        de = fixture.debugElement;
    });

    it('init header is hello', () => {
        expect(de.query(By.css('.header')).nativeElement.innerHTML).toBe('Hello');
    });
});