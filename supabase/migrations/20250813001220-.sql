-- Ajouter des colonnes pour supporter différents types de webhooks
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS webhook_type TEXT DEFAULT 'button';
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS execution_method TEXT DEFAULT 'GET';
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS form_fields JSONB;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS schedule_config JSONB;
ALTER TABLE webhooks ADD COLUMN IF NOT EXISTS response_format TEXT DEFAULT 'json';

-- Ajouter des commentaires pour la documentation
COMMENT ON COLUMN webhooks.webhook_type IS 'Type de webhook: button, form, schedule, manual';
COMMENT ON COLUMN webhooks.execution_method IS 'Méthode HTTP: GET, POST, PUT';
COMMENT ON COLUMN webhooks.form_fields IS 'Configuration des champs pour le type form';
COMMENT ON COLUMN webhooks.schedule_config IS 'Configuration pour les tâches programmées';
COMMENT ON COLUMN webhooks.response_format IS 'Format de réponse: json, text, html';