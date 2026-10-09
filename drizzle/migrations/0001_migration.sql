CREATE VIEW public.listings WITH (security_invoker = true) AS SELECT * FROM public.ads;
GRANT SELECT, INSERT ON public.listings TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.listings TO authenticated;
GRANT ALL ON public.listings TO service_role;