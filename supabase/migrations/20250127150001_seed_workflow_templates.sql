-- =============================================
-- Migration: Seed workflow templates
-- Date: 27 janvier 2025
-- Description: Catalogue de 15 templates de workflows n8n pour TPE/PME françaises
--              répartis par pack (Start/Pro/Elite)
-- =============================================

-- =============================================
-- PACK START (5 workflows essentiels)
-- =============================================

INSERT INTO public.workflow_templates (
  name,
  description,
  category,
  n8n_template_id,
  pack_level,
  required_credentials,
  configurable_params,
  default_config,
  estimated_cost_per_exec,
  estimated_time_saved_minutes,
  metrics_tracked,
  display_order
) VALUES
(
  'SMS & Email de confirmation',
  'Envoie automatiquement des SMS et emails de confirmation après une réservation ou un achat. Réactive les clients inactifs.',
  'Communication',
  'workflow-sms-email-confirmation', -- À remplacer par l''ID réel n8n
  'start',
  '["twilio", "sendgrid"]'::jsonb,
  '{"phone_number": "Numéro SMS", "sender_email": "Email expéditeur", "company_name": "Nom de l''entreprise", "message_template": "Template du message"}'::jsonb,
  '{"message_template": "Bonjour {{client_name}}, votre rendez-vous chez {{company_name}} est confirmé le {{date}} à {{time}}. À bientôt !"}'::jsonb,
  0.05,
  5,
  '["sms_sent", "emails_sent", "clients_reactivated"]'::jsonb,
  1
),
(
  'Agent de prise de rendez-vous IA',
  'Chatbot IA qui répond aux demandes de rendez-vous sur WhatsApp, site web et Facebook. Prend les RDV automatiquement.',
  'Commercial',
  'workflow-agent-rdv-ia', -- À remplacer par l''ID réel n8n
  'start',
  '["openai", "whatsapp", "calendly"]'::jsonb,
  '{"openai_api_key": "Clé API OpenAI", "whatsapp_number": "Numéro WhatsApp", "calendly_url": "Lien Calendly", "business_hours": "Horaires d''ouverture"}'::jsonb,
  '{"business_hours": "Lundi-Vendredi 9h-18h"}'::jsonb,
  0.15,
  20,
  '["messages_received", "appointments_booked", "response_time_seconds"]'::jsonb,
  2
),
(
  'Relance clients inactifs (30j)',
  'Détecte automatiquement les clients qui n''ont pas acheté depuis 30 jours et leur envoie une offre de réactivation personnalisée.',
  'Marketing',
  'workflow-relance-clients-30j', -- À remplacer par l''ID réel n8n
  'start',
  '["sendgrid", "crm"]'::jsonb,
  '{"sender_email": "Email expéditeur", "offer_text": "Texte de l''offre", "discount_code": "Code promo"}'::jsonb,
  '{"offer_text": "Nous vous avons manqué ! Profitez de -20% avec le code RETOUR20"}'::jsonb,
  0.03,
  10,
  '["emails_sent", "clients_reactivated", "revenue_generated"]'::jsonb,
  3
),
(
  'Collecte d''avis Google automatisée',
  'Envoie automatiquement une demande d''avis Google par SMS après chaque prestation. Augmente votre visibilité locale.',
  'Marketing',
  'workflow-avis-google-auto', -- À remplacer par l''ID réel n8n
  'start',
  '["twilio", "google_my_business"]'::jsonb,
  '{"phone_number": "Numéro SMS", "google_review_link": "Lien avis Google", "delay_hours": "Délai d''envoi (heures)"}'::jsonb,
  '{"delay_hours": "24", "message": "Merci pour votre visite ! Pouvez-vous nous laisser un avis ? {{google_review_link}}"}'::jsonb,
  0.04,
  8,
  '["reviews_requested", "reviews_received", "average_rating"]'::jsonb,
  4
),
(
  'Résumé quotidien d''activité',
  'Reçoit chaque matin un résumé de vos métriques clés : nouveaux leads, CA du jour, RDV planifiés, avis reçus.',
  'Support',
  'workflow-resume-quotidien', -- À remplacer par l''ID réel n8n
  'start',
  '["sendgrid"]'::jsonb,
  '{"recipient_email": "Email destinataire", "send_time": "Heure d''envoi"}'::jsonb,
  '{"send_time": "08:00"}'::jsonb,
  0.01,
  15,
  '["reports_sent"]'::jsonb,
  5
);

-- =============================================
-- PACK PRO (5 workflows avancés)
-- =============================================

INSERT INTO public.workflow_templates (
  name,
  description,
  category,
  n8n_template_id,
  pack_level,
  required_credentials,
  configurable_params,
  default_config,
  estimated_cost_per_exec,
  estimated_time_saved_minutes,
  metrics_tracked,
  display_order
) VALUES
(
  'Agent commercial IA (appels sortants)',
  'IA qui appelle vos prospects par téléphone, qualifie les leads et prend les RDV. Parle français naturellement.',
  'Commercial',
  'workflow-agent-commercial-ia', -- À remplacer par l''ID réel n8n
  'pro',
  '["openai", "vapi", "crm"]'::jsonb,
  '{"vapi_api_key": "Clé API VAPI", "crm_api_key": "Clé API CRM", "call_script": "Script d''appel", "qualification_criteria": "Critères de qualification"}'::jsonb,
  '{"call_script": "Bonjour, je suis l''assistant virtuel de {{company_name}}. J''appelle pour..."}'::jsonb,
  0.50,
  30,
  '["calls_made", "leads_qualified", "appointments_booked", "call_duration_minutes"]'::jsonb,
  6
),
(
  'Facturation & paiement automatique',
  'Génère et envoie automatiquement les factures après chaque prestation. Relance les impayés. Intégration Stripe.',
  'Facturation',
  'workflow-facturation-auto', -- À remplacer par l''ID réel n8n
  'pro',
  '["stripe", "sendgrid"]'::jsonb,
  '{"stripe_api_key": "Clé API Stripe", "company_details": "Informations entreprise", "tax_rate": "Taux TVA", "payment_terms": "Conditions de paiement"}'::jsonb,
  '{"tax_rate": "20", "payment_terms": "30 jours"}'::jsonb,
  0.10,
  25,
  '["invoices_sent", "payments_received", "overdue_reminders", "revenue_collected"]'::jsonb,
  7
),
(
  'Génération de devis IA (PDF)',
  'Génère automatiquement des devis personnalisés en PDF à partir d''une demande client. IA qui calcule les prix.',
  'Facturation',
  'workflow-devis-ia-pdf', -- À remplacer par l''ID réel n8n
  'pro',
  '["openai", "sendgrid"]'::jsonb,
  '{"openai_api_key": "Clé API OpenAI", "company_logo": "URL logo", "pricing_rules": "Règles de tarification", "template_pdf": "Template PDF"}'::jsonb,
  '{"pricing_rules": "Tarif horaire: 80€, Forfait: -15%"}'::jsonb,
  0.20,
  40,
  '["quotes_generated", "quotes_sent", "quotes_accepted", "conversion_rate"]'::jsonb,
  8
),
(
  'CRM intelligent (enrichissement leads)',
  'Enrichit automatiquement vos leads avec données entreprise (SIRET, CA, effectif). Score de qualification IA.',
  'CRM',
  'workflow-crm-enrichissement', -- À remplacer par l''ID réel n8n
  'pro',
  '["openai", "societe_com", "crm"]'::jsonb,
  '{"societe_com_api_key": "Clé API Société.com", "scoring_criteria": "Critères de scoring", "crm_api_key": "Clé API CRM"}'::jsonb,
  '{"scoring_criteria": "CA > 1M€: +50pts, Effectif > 50: +30pts"}'::jsonb,
  0.08,
  15,
  '["leads_enriched", "companies_found", "high_score_leads"]'::jsonb,
  9
),
(
  'Support client IA (tickets)',
  'Chatbot IA qui répond automatiquement aux questions clients. Crée un ticket si besoin d''intervention humaine.',
  'Support',
  'workflow-support-client-ia', -- À remplacer par l''ID réel n8n
  'pro',
  '["openai", "zendesk"]'::jsonb,
  '{"openai_api_key": "Clé API OpenAI", "zendesk_api_key": "Clé API Zendesk", "knowledge_base": "Base de connaissances", "escalation_rules": "Règles d''escalade"}'::jsonb,
  '{"escalation_rules": "Si mot-clé ''urgent'' ou ''bug'' → créer ticket"}'::jsonb,
  0.12,
  20,
  '["messages_handled", "tickets_created", "auto_resolved", "response_time_seconds"]'::jsonb,
  10
);

-- =============================================
-- PACK ELITE (5 workflows premium)
-- =============================================

INSERT INTO public.workflow_templates (
  name,
  description,
  category,
  n8n_template_id,
  pack_level,
  required_credentials,
  configurable_params,
  default_config,
  estimated_cost_per_exec,
  estimated_time_saved_minutes,
  metrics_tracked,
  display_order
) VALUES
(
  'Orchestrateur Master IA',
  'IA centrale qui coordonne tous vos workflows, prend des décisions stratégiques et optimise automatiquement vos campagnes.',
  'IA',
  'workflow-orchestrateur-master', -- À remplacer par l''ID réel n8n
  'elite',
  '["openai", "all_services"]'::jsonb,
  '{"strategy_rules": "Règles stratégiques", "optimization_goals": "Objectifs d''optimisation", "budget_limits": "Limites budgétaires"}'::jsonb,
  '{"optimization_goals": "Maximiser leads qualifiés, Minimiser coûts"}'::jsonb,
  1.00,
  60,
  '["decisions_made", "workflows_triggered", "cost_saved", "revenue_impact"]'::jsonb,
  11
),
(
  'Campagne marketing automatisée (omnicanal)',
  'Lance automatiquement des campagnes marketing sur Email, SMS, Facebook Ads, Google Ads. Optimisation IA du ROI.',
  'Marketing',
  'workflow-campagne-omnicanal', -- À remplacer par l''ID réel n8n
  'elite',
  '["sendgrid", "twilio", "facebook_ads", "google_ads", "openai"]'::jsonb,
  '{"campaign_budget": "Budget campagne", "target_audience": "Audience cible", "optimization_metric": "Métrique à optimiser"}'::jsonb,
  '{"optimization_metric": "ROAS", "campaign_budget": "500"}'::jsonb,
  2.00,
  120,
  '["campaigns_launched", "reach", "conversions", "roas", "cost_per_lead"]'::jsonb,
  12
),
(
  'Analyse prédictive (churn clients)',
  'IA qui prédit quels clients risquent de partir et lance automatiquement des actions de rétention personnalisées.',
  'IA',
  'workflow-analyse-churn', -- À remplacer par l''ID réel n8n
  'elite',
  '["openai", "crm", "sendgrid"]'::jsonb,
  '{"churn_threshold": "Seuil de risque", "retention_actions": "Actions de rétention", "analysis_frequency": "Fréquence d''analyse"}'::jsonb,
  '{"churn_threshold": "0.7", "analysis_frequency": "weekly"}'::jsonb,
  0.50,
  45,
  '["clients_analyzed", "churn_predicted", "retention_campaigns", "clients_saved"]'::jsonb,
  13
),
(
  'Pipeline de vente automatisé (A-Z)',
  'Workflow complet : capture lead → qualification → nurturing → prise RDV → suivi → closing → facturation.',
  'Commercial',
  'workflow-pipeline-complet', -- À remplacer par l''ID réel n8n
  'elite',
  '["openai", "crm", "sendgrid", "twilio", "stripe"]'::jsonb,
  '{"pipeline_stages": "Étapes du pipeline", "nurturing_sequences": "Séquences de nurturing", "closing_rules": "Règles de closing"}'::jsonb,
  '{"pipeline_stages": "Lead → MQL → SQL → Opportunité → Client"}'::jsonb,
  0.80,
  90,
  '["leads_captured", "mqls", "sqls", "opportunities", "deals_closed", "revenue"]'::jsonb,
  14
),
(
  'Tableau de bord BI temps réel',
  'Dashboard BI alimenté en temps réel avec toutes vos métriques business. Alertes automatiques sur KPIs critiques.',
  'Analytics',
  'workflow-dashboard-bi', -- À remplacer par l''ID réel n8n
  'elite',
  '["all_services"]'::jsonb,
  '{"kpis_tracked": "KPIs à suivre", "alert_rules": "Règles d''alertes", "refresh_interval": "Intervalle de rafraîchissement"}'::jsonb,
  '{"refresh_interval": "5min", "alert_rules": "Si CA < objectif -20% → alerte"}'::jsonb,
  0.02,
  30,
  '["kpis_tracked", "alerts_sent", "data_points_processed"]'::jsonb,
  15
);

-- =============================================
-- Indexes pour performance
-- =============================================

CREATE INDEX IF NOT EXISTS idx_workflow_templates_pack ON public.workflow_templates(pack_level);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_category ON public.workflow_templates(category);
CREATE INDEX IF NOT EXISTS idx_workflow_templates_active ON public.workflow_templates(is_active);

-- =============================================
-- Confirmation
-- =============================================

DO $$
DECLARE
  template_count INT;
BEGIN
  SELECT COUNT(*) INTO template_count FROM public.workflow_templates;
  RAISE NOTICE 'Seed completed: % workflow templates inserted', template_count;
END $$;

