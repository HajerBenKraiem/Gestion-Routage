import { Component, OnInit } from '@angular/core';
import { Produit } from '../model/protuit';
import { NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent implements OnInit {
  produits: Produit[] = [];
  produitCourant = new Produit();
  private apiUrl = "http://localhost:9999/produits";

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    console.log("Initialisation du composant: Récupérer la liste des produits");
    this.consulterProduits();
  }

  // -------------------------
  //  VALIDATION FORMULAIRE
  // -------------------------
  validerFormulaire(form: NgForm) {
    console.log(form.value);

    if (form.value.id != undefined) {
      let index = this.produits.findIndex(p => p.id == form.value.id);

      if (index !== -1) {
        // produit existant → mise à jour
        const ancien = this.produits[index];
        let reponse = confirm(`Produit existant. Confirmez vous la mise à jour de : ${ancien.designation} ?`);
        if (reponse) {
          this.mettreAJourProduit(form.value, ancien);
        }
      } else {
        // nouveau produit
        this.ajouterProduit(form.value);
      }
    } else {
      console.log("id vide...");
    }

    // reset formulaire
    this.produitCourant = new Produit();
    form.resetForm();
  }

  // -------------------------
  //  MÉTHODES HTTP ENCAPSULÉES
  // -------------------------

  // Récupérer la liste des produits
  consulterProduits() {
    this.http.get<Produit[]>(this.apiUrl).subscribe({
      next: data => {
        console.log("Succès GET", data);
        this.produits = data;
      },
      error: err => console.log("Erreur GET", err)
    });
  }

  // Ajouter un produit
  ajouterProduit(nouveau: Produit) {
    this.http.post<Produit>(this.apiUrl, nouveau).subscribe({
      next: p => {
        this.produits.push(p);
        console.log("Ajout d'un nouveau produit: " + p.designation);
      },
      error: err => console.log("Erreur POST", err)
    });
  }

  // Mettre à jour un produit
  mettreAJourProduit(nouveau: Produit, ancien: Produit) {
    this.http.put<Produit>(`${this.apiUrl}/${nouveau.id}`, nouveau).subscribe({
      next: updated => {
        ancien.code = nouveau.code;
        ancien.designation = nouveau.designation;
        ancien.prix = nouveau.prix;
        console.log("Produit mis à jour: " + ancien.designation);
      },
      error: err => console.log("Erreur PUT", err)
    });
  }

  // Supprimer un produit
  supprimerProduit(p: Produit) {
    let reponse = confirm(`Voulez vous supprimer le produit : ${p.designation} ?`);
    if (reponse) {
      this.http.delete(`${this.apiUrl}/${p.id}`).subscribe({
        next: () => {
          const index = this.produits.indexOf(p);
          if (index !== -1) this.produits.splice(index, 1);
          console.log("Produit supprimé: " + p.designation);
        },
        error: err => console.log("Erreur DELETE", err)
      });
    } else {
      console.log("Suppression annulée...");
    }
  }

  // -------------------------
  //  EDITION
  // -------------------------
  editerProduit(p: Produit) {
    console.log("✏️ Edition du produit id=" + p.id);
    this.produitCourant = { ...p };
  }

  // -------------------------
  //  EFFACER FORMULAIRE
  // -------------------------
  effacer(form: NgForm) {
    console.log("🧹 Formulaire effacé");
    form.resetForm();
    this.produitCourant = new Produit();
  }
}
