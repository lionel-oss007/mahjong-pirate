# Mahjong Pirate - VS Code Configuration Guide

## ✅ Configuration complète installée

### 📦 Fichiers créés :
- `.vscode/settings.json` - Paramètres VS Code
- `.vscode/extensions.json` - Extensions recommandées
- `.prettierrc` - Configuration Prettier
- `.prettierignore` - Fichiers ignorés par Prettier

## 🚀 Prochaines étapes

### 1. **Cloner le projet en local**
```bash
git clone https://github.com/lionel-oss007/mahjong-pirate.git
cd mahjong-pirate
```

### 2. **Ouvrir dans VS Code**
```bash
code .
```

### 3. **Installer les extensions recommandées**
VS Code affichera une notification pour installer les extensions :
- **Prettier** - Formatage automatique
- **Live Server** - Serveur local avec rechargement en direct
- **HTML CSS Support** - Autocomplétion CSS
- **Tailwind CSS IntelliSense** - Support Tailwind
- **ESLint** - Linting JavaScript
- **Web Indent JavaScript** - Indentation avancée

Ou installez-les manuellement via :
```
Ctrl+Shift+X (Windows/Linux) ou Cmd+Shift+X (Mac)
```

### 4. **Utiliser Live Server**
- Clic droit sur `index.html` → **Open with Live Server**
- Ou : `Alt+L Alt+O` (Windows) / `Opt+L Opt+O` (Mac)
- Le navigateur s'ouvrira automatiquement à `http://localhost:5500`

## ⚙️ Fonctionnalités activées

✨ **Formatage automatique au sauvegarde (Ctrl+S)**
- HTML, CSS, JavaScript seront auto-formatés
- Indentation : 2 espaces
- Nouvelle ligne à la fin de chaque fichier
- Suppression des espaces en fin de ligne

📝 **Émmet** (autocomplétion HTML)
- Tapez `!` puis `Tab` pour créer une structure HTML complète
- Tapez `div.container` puis `Tab` pour générer `<div class="container">`

🔍 **Lint & Suggestions**
- ESLint détecte les erreurs JavaScript
- HTML & CSS validés automatiquement

## 💡 Astuces VS Code

| Raccourci | Action |
|-----------|--------|
| `Ctrl+,` | Ouvrir les paramètres |
| `Ctrl+Shift+P` | Palette de commandes |
| `Alt+Shift+F` | Formater le document |
| `Ctrl+S` | Sauvegarder & auto-formatter |
| `Ctrl+/` | Commenter une ligne |
| `F12` ou `Ctrl+Shift+I` | Inspecteur DevTools |

## 📱 Structure du projet

```
mahjong-pirate/
├── index.html          # Point d'entrée
├── styles.css          # Styles principaux
├── tile-art.css        # Styles des tuiles
├── app.js              # Logique principale
├── arsenal.js          # Gestion de l'arsenal
├── home-ui.js          # Interface d'accueil
├── missions.js         # Système de missions
├── progression.js      # Suivi de progression
├── shapes.js           # Formes du jeu
├── mobile.js           # Support mobile
├── manifest.webmanifest # Configuration PWA
└── .vscode/            # Configuration VS Code ✅
```

## 🎮 Commencer le développement

1. **Créer une branche** :
```bash
git checkout -b feature/nouvelle-feature
```

2. **Faire vos modifications** (auto-formatées)

3. **Commit & Push** :
```bash
git add .
git commit -m "Description de vos changements"
git push origin feature/nouvelle-feature
```

4. **Créer une Pull Request** sur GitHub

---

Votre environnement VS Code est prêt ! 🎉
