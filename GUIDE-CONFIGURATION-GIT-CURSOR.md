# 🔐 Guide : Configuration Git/GitHub pour Cursor

## Méthode 1 : Authentification HTTPS avec Token Personnel (Recommandé)

### Étape 1 : Créer un Personal Access Token sur GitHub

1. Aller sur GitHub.com → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Cliquer sur "Generate new token (classic)"
3. Donner un nom (ex: "Cursor Git Access")
4. Sélectionner les scopes :
   - ✅ `repo` (accès complet aux repositories)
   - ✅ `workflow` (si besoin de GitHub Actions)
5. Générer et **COPIER LE TOKEN** (il ne sera affiché qu'une fois !)

### Étape 2 : Configurer Git avec le token

```bash
# Configurer votre nom et email Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"

# Configurer le credential helper pour stocker le token
git config --global credential.helper osxkeychain  # macOS
# ou
git config --global credential.helper wincred      # Windows
# ou
git config --global credential.helper cache        # Linux
```

### Étape 3 : Utiliser le token lors du push

Quand vous faites `git push`, Git vous demandera :
- **Username** : Votre nom d'utilisateur GitHub
- **Password** : **COLLER LE TOKEN** (pas votre mot de passe GitHub !)

Le credential helper stockera ces infos pour les prochaines fois.

---

## Méthode 2 : Authentification SSH (Plus sécurisé)

### Étape 1 : Générer une clé SSH

```bash
# Générer une nouvelle clé SSH
ssh-keygen -t ed25519 -C "votre.email@example.com"

# Appuyer sur Entrée pour accepter l'emplacement par défaut
# Entrer une passphrase (optionnel mais recommandé)
```

### Étape 2 : Ajouter la clé SSH à GitHub

```bash
# Copier la clé publique
cat ~/.ssh/id_ed25519.pub
# ou sur Windows : type %USERPROFILE%\.ssh\id_ed25519.pub
```

1. Aller sur GitHub.com → Settings → SSH and GPG keys
2. Cliquer sur "New SSH key"
3. Coller la clé publique
4. Sauvegarder

### Étape 3 : Changer l'URL du remote en SSH

```bash
# Voir l'URL actuelle
git remote -v

# Changer HTTPS vers SSH
git remote set-url origin git@github.com:USERNAME/REPO.git

# Tester la connexion
ssh -T git@github.com
```

---

## Méthode 3 : GitHub CLI (gh) - Le plus simple

### Installation

```bash
# macOS
brew install gh

# Windows (via winget)
winget install GitHub.cli

# Linux
sudo apt install gh
```

### Authentification

```bash
# Se connecter à GitHub
gh auth login

# Suivre les instructions :
# 1. Choisir GitHub.com
# 2. HTTPS ou SSH
# 3. Authentifier via navigateur
```

Après ça, Git utilisera automatiquement les credentials de `gh`.

---

## 🔧 Configuration dans Cursor

Cursor utilise Git directement, donc si Git est configuré, Cursor fonctionnera.

### Vérifier la configuration

```bash
# Vérifier la config Git
git config --global --list

# Vérifier les credentials stockés (macOS)
security find-internet-password -s github.com

# Tester un push
git push origin main
```

---

## ❌ Problèmes Courants et Solutions

### Problème 1 : "Permission denied" ou "Authentication failed"

**Solution** :
```bash
# Supprimer les anciens credentials
git credential-osxkeychain erase
host=github.com
protocol=https
# (Appuyer Entrée deux fois)

# Réessayer avec le token
git push
```

### Problème 2 : "remote: Support for password authentication was removed"

**Solution** : GitHub n'accepte plus les mots de passe, il faut utiliser un **Personal Access Token**.

### Problème 3 : Cursor ne détecte pas Git

**Solution** :
1. Vérifier que Git est installé : `git --version`
2. Redémarrer Cursor
3. Vérifier les settings Cursor → Git → Path to Git executable

### Problème 4 : Token expiré

**Solution** :
1. Générer un nouveau token sur GitHub
2. Mettre à jour les credentials :
```bash
git credential-osxkeychain erase
host=github.com
protocol=https
# (Entrée deux fois)
git push  # Entrer nouveau token
```

---

## 🎯 Configuration Recommandée pour Cursor

```bash
# 1. Configurer Git
git config --global user.name "Votre Nom"
git config --global user.email "votre.email@example.com"
git config --global init.defaultBranch main

# 2. Utiliser GitHub CLI (le plus simple)
gh auth login

# 3. Ou configurer credential helper
git config --global credential.helper osxkeychain  # macOS
git config --global credential.helper wincred      # Windows

# 4. Vérifier
git config --global --list
```

---

## 📝 Checklist pour votre ami

- [ ] Git installé (`git --version`)
- [ ] Nom et email configurés (`git config --global user.name/email`)
- [ ] Personal Access Token créé sur GitHub (ou clé SSH)
- [ ] Credential helper configuré
- [ ] Remote URL correcte (`git remote -v`)
- [ ] Permissions sur le repository GitHub
- [ ] Cursor redémarré après configuration

---

## 🔗 Ressources

- [GitHub Personal Access Tokens](https://github.com/settings/tokens)
- [GitHub SSH Keys](https://github.com/settings/keys)
- [GitHub CLI Documentation](https://cli.github.com/manual/)

