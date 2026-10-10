ALTER TABLE public.ads ADD COLUMN ai_decision text, ADD COLUMN ai_reason text;
CREATE OR REPLACE VIEW public.listings WITH (security_invoker = true) AS SELECT * FROM public.ads;
COMMENT ON TABLE public.ads IS 'Accessed by the app through the listings view (ad blockers block /ads URLs).';