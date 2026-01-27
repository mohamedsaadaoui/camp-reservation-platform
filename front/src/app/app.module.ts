import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ChatComponent } from './chat/chat.component';
import { MapComponent } from './map/map.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

// Import nécessaire pour Angular Material animations
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
@NgModule({
  declarations: [
    AppComponent,
    MapComponent,
    ChatComponent,
  ],
  imports: [
    BrowserModule,
    MatCardModule,
    AppRoutingModule,
    HttpClientModule,  // ← IMPORTANT pour les appels HTTP
    FormsModule,
    BrowserModule,
    FormsModule,
    MatCardModule,
        MatDatepickerModule,

    MatFormFieldModule,
   BrowserAnimationsModule, // <-- AJOUTE ICI

    MatInputModule,
    MatButtonModule       // ← IMPORTANT pour les formulaires
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }