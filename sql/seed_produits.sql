-- ── SEED PRODUITS : Le Centre ──────────────────────────────
INSERT INTO public.restaurants (nom, slug)
VALUES ('Le Centre', 'lecentre')
ON CONFLICT (slug) DO NOTHING;

DO $$
DECLARE rid UUID;
BEGIN
  SELECT id INTO rid FROM public.restaurants WHERE slug = 'lecentre';
  INSERT INTO public.produits (restaurant_id, nom, description, prix, categorie, disponible) VALUES
    (rid, 'Pizza Margherita', 'Tomate, mozzarella, basilic frais', 18.00, 'Pizzas', true),
    (rid, 'Pizza 4 Fromages', 'Mozzarella, gorgonzola, chevre, parmesan', 22.00, 'Pizzas', true),
    (rid, 'Pizza Fruits de Mer', 'Crevettes, calamars, moules, sauce tomate', 25.00, 'Pizzas', true),
    (rid, 'Pizza Vegetarienne', 'Legumes grilles, mozzarella, roquette', 20.00, 'Pizzas', true),
    (rid, 'Pizza Jambon-Champignons', NULL, 20.00, 'Pizzas', true),
    (rid, 'Plateau Fruits de Mer', 'Crevettes + homard + calamars pour 2', 45.00, 'Fruits de Mer', true),
    (rid, 'Crevettes Sautees a l ail', 'Crevettes geantes, ail, beurre, citron', 25.00, 'Fruits de Mer', true),
    (rid, 'Homard Grille', 'Sauce bearnaise ou beurre blanc', 40.00, 'Fruits de Mer', true),
    (rid, 'Calamars Frits', 'Panes dores, sauce tartare maison', 18.00, 'Fruits de Mer', true),
    (rid, 'Brochette de Crevettes', 'Marinees, grillees, legumes', 22.00, 'Fruits de Mer', true),
    (rid, 'Entrecote Grillee', '300g, frites maison ou legumes', 28.00, 'Grillades', true),
    (rid, 'Poulet Roti au Four', 'Demi-poulet, herbes fraiches, legumes rotis', 18.00, 'Grillades', true),
    (rid, 'Cotes d agneau', 'Grillees, sauce menthe', 32.00, 'Grillades', true),
    (rid, 'Spaghetti Bolognaise', 'Viande hachee, sauce tomate fraiche', 18.00, 'Pates', true),
    (rid, 'Tagliatelles Fruits de Mer', 'Crevettes, calamars, creme', 24.00, 'Pates', true),
    (rid, 'Risotto Champignons', 'Champignons sauvages, parmesan, beurre', 22.00, 'Pates', true),
    (rid, 'Salade Cesar', 'Poulet grille, parmesan, croutons', 12.00, 'Salades', true),
    (rid, 'Salade Nicoise', 'Thon, oeufs, olives, anchois, tomates', 12.00, 'Salades', true),
    (rid, 'Salade Chevre Chaud', 'Fromage de chevre, noix, miel, roquette', 14.00, 'Salades', true),
    (rid, 'Tiramisu Maison', NULL, 10.00, 'Desserts', true),
    (rid, 'Fondant Chocolat', 'Coulant, glace vanille', 10.00, 'Desserts', true),
    (rid, 'Panna Cotta', 'Coulis de fruits rouges', 9.00, 'Desserts', true),
    (rid, 'Vin Rouge (verre)', NULL, 8.00, 'Boissons', true),
    (rid, 'Vin Blanc (verre)', NULL, 8.00, 'Boissons', true),
    (rid, 'Cocktail Maison', NULL, 9.00, 'Boissons', true),
    (rid, 'Biere Importee 33cl', NULL, 5.00, 'Boissons', true),
    (rid, 'Jus de Fruit Frais', NULL, 5.00, 'Boissons', true),
    (rid, 'Eau Minerale 75cl', NULL, 3.00, 'Boissons', true)
  ON CONFLICT DO NOTHING;
END $$;
