import { Component } from '@angular/core';
import { Produit } from '../model/protuit';

@Component({
  selector: 'app-produits',
  templateUrl: './produits.component.html',
  styleUrls: ['./produits.component.css']
})
export class ProduitsComponent {

produits: Array<Produit> = [
   {id:1,code:'x12',designation:"Panier plastique",prix:20},
    {id:2,code:'y4',designation:"table en bois",prix:100},
     {id:3,code:'y10',designation:"salon en cuir",prix:3000} ];

  // Produit sélectionné pour édition
  produitCourant: Produit = new Produit();

  //  ÉDITER : 
  editerProduit(p: Produit) {
    this.produitCourant = { ...p }; // copie pour éviter la modification directe
  }

  //  VALIDER :
  validerProduit() {

    // Si produit existe → mettre à jour
    let index = this.produits.findIndex(pr => pr.id === this.produitCourant.id);

    if (index !== -1) {
      this.produits[index] = { ...this.produitCourant };
    } else {
      // Sinon → ajout d'un nouveau produit
      this.produits.push({ ...this.produitCourant });
    }

    // Réinitialiser le formulaire
    this.produitCourant = new Produit();
  }

  //  SUPPRIMER :
  supprimerProduit(p: Produit) {
    this.produits = this.produits.filter(prod => prod !== p);
  }

}
