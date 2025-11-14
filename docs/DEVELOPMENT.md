# 🛠️ Guide du Développeur

**Guide complet pour développer sur Client n8n Dashboard**

---

## 🚀 Quick Start

```bash
# 1. Cloner le repo
git clone <repo-url>
cd client-n8n-dash

# 2. Installer les dépendances
npm install

# 3. Configurer les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur de dev
npm run dev
```

---

## 📦 Scripts disponibles

```bash
# Développement
npm run dev              # Lance Vite dev server (port 5173)

# Build
npm run build            # Build de production
npm run preview          # Preview du build local

# Linting
npm run lint             # ESLint
npm run lint:fix         # Fixer automatiquement

# Autres
npm run type-check       # TypeScript check (sans build)
```

---

## 🏗️ Structure du projet

```
client-n8n-dash/
├── src/
│   ├── components/        # Composants React
│   │   ├── ui/           # Shadcn/UI (base)
│   │   ├── admin/        # Composants admin
│   │   ├── dashboard/    # Composants client
│   │   └── ...
│   ├── pages/            # Pages React Router
│   │   ├── Auth.tsx      # Authentification
│   │   ├── Dashboard.tsx # Dashboard client
│   │   ├── AdminApprovals.tsx
│   │   └── ...
│   ├── context/          # Contextes React
│   │   └── AuthContext.tsx
│   ├── hooks/            # Hooks personnalisés
│   ├── integrations/     # Intégrations externes
│   │   └── supabase/     # Client Supabase + types
│   ├── lib/              # Utilitaires
│   └── main.tsx          # Entry point
├── supabase/
│   ├── functions/        # Edge Functions
│   └── migrations/       # Migrations SQL
├── custom-mcp-servers/   # Serveurs MCP
├── public/               # Assets statiques
└── docs/                 # Documentation
```

---

## 🎨 Stack Frontend

### **React 18**

```tsx
// Utiliser les hooks
import { useState, useEffect } from 'react';

// Composants fonctionnels uniquement
const MyComponent = () => {
  return <div>Hello</div>;
};
```

### **TypeScript**

```typescript
// Typer tout !
interface User {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

// Props typées
interface MyComponentProps {
  user: User;
  onUpdate: (user: User) => void;
}
```

### **Tailwind CSS**

```tsx
// Classes utilitaires
<div className="flex items-center gap-4 p-6 bg-slate-900 rounded-lg">
  <Button className="bg-blue-600 hover:bg-blue-700">
    Click me
  </Button>
</div>
```

### **Shadcn/UI**

```bash
# Ajouter un composant
npx shadcn@latest add button
npx shadcn@latest add card
```

---

## 🗄️ Supabase

### **Client Supabase**

```typescript
// src/integrations/supabase/client.ts
import { createClient } from '@supabase/supabase-js';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

### **Requêtes**

```typescript
// SELECT
const { data, error } = await supabase
  .from('organizations')
  .select('*')
  .eq('id', orgId);

// INSERT
const { data, error } = await supabase
  .from('workflows')
  .insert({ name: 'Mon workflow', org_id: orgId });

// UPDATE
const { data, error } = await supabase
  .from('organizations')
  .update({ approved: true })
  .eq('id', orgId);

// DELETE
const { data, error } = await supabase
  .from('workflows')
  .delete()
  .eq('id', workflowId);
```

### **RPC Functions**

```typescript
const { data, error } = await supabase.rpc('approve_organization', {
  org_id_param: orgId
});
```

### **Auth**

```typescript
// Signup
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'password'
});

// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: 'user@example.com',
  password: 'password'
});

// Logout
await supabase.auth.signOut();

// Get session
const { data: { session } } = await supabase.auth.getSession();
```

---

## 🔄 Créer une nouvelle page

### **1. Créer le composant**

```tsx
// src/pages/MyNewPage.tsx
import { useAuth } from "@/context/AuthContext";

const MyNewPage = () => {
  const { user } = useAuth();
  
  return (
    <div className="min-h-screen p-8">
      <h1 className="text-3xl font-bold">Ma nouvelle page</h1>
      <p>Utilisateur : {user?.email}</p>
    </div>
  );
};

export default MyNewPage;
```

### **2. Ajouter la route**

```tsx
// src/App.tsx
import MyNewPage from "./pages/MyNewPage";

<Route 
  path="/my-new-page" 
  element={
    <ProtectedRoute>
      <MyNewPage />
    </ProtectedRoute>
  } 
/>
```

---

## 🎯 Créer un nouveau composant UI

```tsx
// src/components/MyComponent.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onAction: () => void;
}

export const MyComponent = ({ title, onAction }: MyComponentProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Button onClick={onAction}>Action</Button>
      </CardContent>
    </Card>
  );
};
```

---

## 🗃️ Créer une migration SQL

### **1. Créer le fichier**

```bash
# Nom du fichier : supabase/migrations/YYYYMMDDHHMMSS_description.sql
supabase/migrations/20250127143000_add_new_table.sql
```

### **2. Écrire le SQL**

```sql
-- Description de la migration
-- Créer une nouvelle table

CREATE TABLE public.my_new_table (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  org_id UUID NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activer RLS
ALTER TABLE public.my_new_table ENABLE ROW LEVEL SECURITY;

-- Policy : Lecture
CREATE POLICY "my_new_table_select"
ON public.my_new_table FOR SELECT
USING (
  public.user_is_org_member(auth.uid(), org_id)
  OR public.has_role(auth.uid(), 'admin')
);

-- Policy : Insertion
CREATE POLICY "my_new_table_insert"
ON public.my_new_table FOR INSERT
WITH CHECK (
  public.user_is_org_member(auth.uid(), org_id)
);
```

### **3. Appliquer la migration**

Via Supabase Dashboard > SQL Editor > Copier/coller le SQL

---

## 🧪 Tests (à implémenter)

### **Structure recommandée**

```
src/
├── __tests__/
│   ├── components/
│   │   └── MyComponent.test.tsx
│   ├── hooks/
│   │   └── useMyHook.test.ts
│   └── utils/
│       └── myUtil.test.ts
```

### **Exemple de test**

```tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';

describe('MyComponent', () => {
  it('renders the title', () => {
    render(<MyComponent title="Test" onAction={() => {}} />);
    expect(screen.getByText('Test')).toBeInTheDocument();
  });
});
```

---

## 🐛 Debugging

### **Console logs**

```typescript
console.log('Debug:', data);
console.error('Error:', error);
console.warn('Warning:', warning);
```

### **React DevTools**

- Installer l'extension Chrome/Firefox
- Inspecter les composants et props

### **Supabase Logs**

- Dashboard Supabase > Logs
- Filtrer par table/fonction

---

## 🔧 Configurations

### **Tailwind Config**

```typescript
// tailwind.config.ts
export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Ajouter des couleurs custom
      }
    }
  }
};
```

### **Vite Config**

```typescript
// vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
```

### **ESLint**

```javascript
// eslint.config.js
export default tseslint.config({
  extends: [js.configs.recommended, ...tseslint.configs.recommended],
  // ...
});
```

---

## 📝 Conventions de code

### **Nommage**

- **Composants** : PascalCase (`MyComponent.tsx`)
- **Fonctions** : camelCase (`myFunction()`)
- **Constantes** : UPPER_SNAKE_CASE (`MY_CONSTANT`)
- **Types/Interfaces** : PascalCase (`MyInterface`)

### **Imports**

```typescript
// 1. External libraries
import React from 'react';
import { motion } from 'motion/react';

// 2. Internal imports
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';

// 3. Types
import type { User } from '@/integrations/supabase/types';
```

### **Comments**

```typescript
// ✅ Bon
// Calculer le total avec la TVA
const totalWithTax = price * 1.2;

// ❌ Mauvais
// Calcul
const totalWithTax = price * 1.2;
```

---

## 🚨 Problèmes courants

### **Build échoue**

```bash
rm -rf node_modules dist .vite
npm install
npm run build
```

### **Types Supabase obsolètes**

```bash
# Régénérer les types (à implémenter)
npm run generate:types
```

### **ESLint erreurs**

```bash
npm run lint:fix
```

---

## 📚 Ressources

- [React Docs](https://react.dev)
- [TypeScript Docs](https://www.typescriptlang.org/docs/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)
- [Supabase Docs](https://supabase.com/docs)
- [Shadcn/UI Docs](https://ui.shadcn.com)

---

**📅 Dernière mise à jour** : 27 janvier 2025










