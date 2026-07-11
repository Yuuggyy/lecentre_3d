-- PARAMÈTRES RESTAURANT Le Centre
CREATE TABLE IF NOT EXISTS public.parametres (
  id             INTEGER PRIMARY KEY DEFAULT 1 CHECK (id = 1),
  nom_restaurant TEXT DEFAULT 'Le Centre',
  logo_url       TEXT,
  adresse        TEXT DEFAULT 'Rond-point Forescom, Immeuble SEDEC, 2ème étage, Gombe, Kinshasa',
  telephone      TEXT DEFAULT '+243 843 000 003',
  whatsapp       TEXT DEFAULT '243843000003',
  horaires       TEXT DEFAULT 'Tous les jours 11h00 - 23h00',
  updated_at     TIMESTAMPTZ DEFAULT NOW()
);
INSERT INTO public.parametres (id, nom_restaurant, adresse, telephone, whatsapp, horaires)
VALUES (1, 'Le Centre', 'Rond-point Forescom, Immeuble SEDEC, 2ème étage, Gombe, Kinshasa', '+243 843 000 003', '243843000003', 'Tous les jours 11h00 - 23h00')
ON CONFLICT (id) DO NOTHING;
CREATE TRIGGER trg_parametres_updated_at BEFORE UPDATE ON public.parametres FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();
ALTER TABLE public.parametres ENABLE ROW LEVEL SECURITY;
CREATE POLICY "param_select" ON public.parametres FOR SELECT USING (true);
CREATE POLICY "param_update" ON public.parametres FOR UPDATE USING (auth.uid() IN (SELECT id FROM public.admin_profiles));
SELECT 'Le Centre — paramètres OK' AS status;
