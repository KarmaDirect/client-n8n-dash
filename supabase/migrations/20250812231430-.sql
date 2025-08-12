INSERT INTO workflows (
  name, 
  description, 
  org_id, 
  webhook_id, 
  is_active, 
  usage_limit_per_hour, 
  usage_limit_per_day
) VALUES (
  'Agent SMS & Email Confirmation', 
  'Automatisation qui envoie des SMS et emails de confirmation pour réactiver les clients.', 
  'c01db015-7268-40f7-93c5-9965bf2a6c10', 
  '59b7dae6-e5f0-4e23-82b9-f946b005434b', 
  true, 
  10, 
  50
);