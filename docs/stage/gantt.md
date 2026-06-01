# Diagramme de Gantt

Ce planning resume les grandes phases du projet. Il peut etre adapte selon les dates exactes du stage.

```mermaid
gantt
    title Planning previsionnel du projet BiblioGest Cameroun
    dateFormat  YYYY-MM-DD
    axisFormat  %d/%m

    section Cadrage
    Analyse du besoin de la librairie             :done, cadrage1, 2026-02-03, 5d
    Identification des roles et workflows         :done, cadrage2, after cadrage1, 4d
    Cahier des charges fonctionnel                :done, cadrage3, after cadrage2, 4d

    section Conception
    Modelisation UML                              :done, design1, 2026-02-17, 6d
    Architecture Next.js et MongoDB               :done, design2, after design1, 5d
    Design responsive et theme                    :done, design3, after design2, 4d

    section Developpement
    Authentification et RBAC                      :done, dev1, 2026-03-03, 8d
    Gestion catalogue et exemplaires              :done, dev2, after dev1, 10d
    Gestion membres, prets et retours             :done, dev3, after dev2, 10d
    Dashboard par role et command palette         :done, dev4, after dev3, 7d
    Upload Cloudinary                             :done, dev5, after dev4, 4d
    Profil utilisateur en tabs                    :done, dev6, after dev5, 4d

    section Donnees et optimisation
    Seeders metier camerounais                    :done, data1, 2026-04-21, 5d
    Optimisation des requetes et temps de reponse :done, opt1, after data1, 6d
    Harmonisation landing page et suggestions     :done, opt2, after opt1, 6d

    section Validation
    Tests TypeScript et build                     :active, test1, 2026-05-12, 4d
    Recette fonctionnelle par role                :test2, after test1, 5d
    Documentation technique et rapport            :doc1, after test2, 7d
    Preparation de la soutenance                  :doc2, after doc1, 5d
```

## Lecture du planning

- Les phases de cadrage et conception posent le perimetre metier.
- Le developpement est organise par modules fonctionnels.
- La validation verifie les roles, les parcours utilisateur et la stabilite de l'application.
- La documentation sert de base au rapport de stage et a la soutenance.
