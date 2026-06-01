# Diagramme de cas d'utilisation

```mermaid
flowchart LR
  Reader[Lecteur]
  Librarian[Bibliothecaire]
  Admin[Administrateur]

  UC_Login((S'authentifier))
  UC_Search((Consulter le catalogue))
  UC_Reserve((Reserver un exemplaire))
  UC_MyLoans((Suivre ses emprunts))
  UC_Profile((Modifier son profil))
  UC_Notifications((Lire les notifications))

  UC_Loans((Valider et retourner les prets))
  UC_Items((Gerer les exemplaires))
  UC_Works((Gerer les ouvrages))
  UC_Members((Gerer les membres))
  UC_Taxonomy((Gerer auteurs, editeurs, taxonomie))
  UC_Locations((Gerer les emplacements))

  UC_Users((Gerer les comptes et roles))
  UC_Stats((Consulter les statistiques admin))

  Reader --> UC_Login
  Reader --> UC_Search
  Reader --> UC_Reserve
  Reader --> UC_MyLoans
  Reader --> UC_Profile
  Reader --> UC_Notifications

  Librarian --> UC_Login
  Librarian --> UC_Search
  Librarian --> UC_Loans
  Librarian --> UC_Items
  Librarian --> UC_Works
  Librarian --> UC_Members
  Librarian --> UC_Taxonomy
  Librarian --> UC_Locations
  Librarian --> UC_Notifications

  Admin --> UC_Login
  Admin --> UC_Search
  Admin --> UC_Loans
  Admin --> UC_Items
  Admin --> UC_Works
  Admin --> UC_Members
  Admin --> UC_Taxonomy
  Admin --> UC_Locations
  Admin --> UC_Users
  Admin --> UC_Stats
  Admin --> UC_Notifications
```
