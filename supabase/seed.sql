-- Optional: run after schema.sql to pre-populate the products table with the
-- placeholder catalog the app previously shipped with mock data.

insert into public.products (slug, name, price, description, sold_out) values
  ('damascus-bollock-dagger', 'Damascus Bollock Dagger', 340, 'Hand-forged from folded Damascus steel with a hand-carved hardwood handle and leather sheath. One-of-a-kind pattern, no two pieces alike.', true),
  ('titanium-steel-damascus-axe', 'Titanium and Steel Damascus Axe', 620, 'A diffusion-bonded titanium and carbon steel damascus axe head, hafted on a hand-shaped hickory handle. Forged, ground, and etched entirely by hand.', true),
  ('dune-inspired-dagger', 'Dune Inspired Dagger', 280, 'A crysknife-inspired dagger forged from mosaic damascus, finished with a bone-effect handle and custom leather sheath.', true),
  ('my-first-titanium-damascus-ring', 'Titanium Damascus Ring — Size 9', 95, 'A titanium damascus ring, forge-welded and forged down to size, then etched to reveal the pattern. Comfort-fit interior.', true),
  ('molybdenum-titanium-nickel-copper-ring', 'Molybdenum-Titanium-Nickel-Copper Diffusion Bonded Ring', 145, 'An experimental multi-metal diffusion-bonded ring combining four different metals into a single striking pattern.', true),
  ('steele-coin', 'Forge Coin', 60, 'A hand-struck coin milled and stamped from solid bar stock, finished with a hand-cut touchmark.', true),
  ('bad-stamp-coins', 'Misprint Coins (Set of 3)', 45, 'A set of three hand-struck coins with off-center or double stamps — the imperfect ones we could not bring ourselves to melt down.', true),
  ('jar-of-arrowheads', 'A Jar of 9 Arrowheads', 75, 'Nine hand-forged arrowheads, each one hammered out individually, packed together in a glass jar.', true),
  ('bottle-opener', 'Bottle Opener (Until You Stop Buying Them)', 35, 'A simple, sturdy hand-forged bottle opener made from an offcut of leaf-spring steel. We keep making these between bigger projects.', true),
  ('pure-chromium-ball', 'Pure Chromium Ball with Touchmark', 20, 'Approx 30mm diameter. A polished sphere of pure chromium, hand-finished and stamped with our touchmark.', true),
  ('forged-en8-bolt', '27mm x 2.5mm Pitch Forged EN8 Bolt', 40, 'A fully hand-forged and hand-threaded bolt, cut from EN8 bar stock — made the hard way just to prove it could be done.', true),
  ('j-hook', 'J-Hook', 25, 'A simple, sturdy hand-forged J-hook. Useful for hanging tools, coats, or anything else around the shop.', true)
on conflict (slug) do nothing;
