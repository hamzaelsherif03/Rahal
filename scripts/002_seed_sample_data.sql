-- Adding sample data for testing the enhanced store features

-- Insert sample categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Everyday Elegance', 'everyday-elegance', 'Versatile pieces for daily sophistication', 1),
  ('550e8400-e29b-41d4-a716-446655440002', 'Occasion', 'occasion', 'Special event and formal wear', 2),
  ('550e8400-e29b-41d4-a716-446655440003', 'Weekend', 'weekend', 'Casual and comfortable styles', 3),
  ('550e8400-e29b-41d4-a716-446655440004', 'Resort', 'resort', 'Vacation and summer essentials', 4)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, slug, description, short_description, price, compare_at_price, sku, category_id, featured, tags) VALUES
  ('pleated-midi', 'Pleated Midi Skirt', 'pleated-midi-skirt', 'Floaty pleats with a soft satin sheen. Elastic back waist for comfort; invisible side zip; midi length that moves with you.', 'Elegant pleated midi with satin finish', 79.00, 99.00, 'SKT-PM-001', '550e8400-e29b-41d4-a716-446655440001', true, ARRAY['new', 'bestseller']),
  ('silk-maxi', 'Silk Bias Maxi', 'silk-bias-maxi', '100% silk, cut on the bias for a fluid, flattering drape. Clean waist, hidden zip, ankle‑skimming silhouette.', 'Luxurious silk maxi skirt', 129.00, 159.00, 'SKT-SM-001', '550e8400-e29b-41d4-a716-446655440002', true, ARRAY['limited', 'premium']),
  ('denim-mini', 'Denim A‑Line Mini', 'denim-a-line-mini', 'Organic cotton denim with an A‑line cut. Mid‑rise, front button detail, and big pockets because… obviously.', 'Classic denim mini skirt', 59.00, NULL, 'SKT-DM-001', '550e8400-e29b-41d4-a716-446655440003', false, ARRAY['casual']),
  ('linen-wrap', 'Linen Wrap Skirt', 'linen-wrap-skirt', 'Breathable linen‑blend wrap with tie waist. Swishy, flattering, and heat‑wave approved.', 'Breezy linen wrap skirt', 74.00, NULL, 'SKT-LW-001', '550e8400-e29b-41d4-a716-446655440004', false, ARRAY['summer'])
ON CONFLICT (slug) DO NOTHING;

-- Insert product images
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
  ('pleated-midi', 'https://images.unsplash.com/photo-1603202662858-4812c1b8c4bb?q=80&w=1200&auto=format&fit=crop', 'Pleated Midi Skirt - Front View', 0, true),
  ('pleated-midi', 'https://images.unsplash.com/photo-1544441893-675973e31954?q=80&w=1200&auto=format&fit=crop', 'Pleated Midi Skirt - Side View', 1, false),
  ('silk-maxi', 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop', 'Silk Bias Maxi - Front View', 0, true),
  ('silk-maxi', 'https://images.unsplash.com/photo-1549028030-265f0b28b1a1?q=80&w=1200&auto=format&fit=crop', 'Silk Bias Maxi - Detail View', 1, false),
  ('denim-mini', 'https://images.unsplash.com/photo-1503342217505-b0a15cf70489?q=80&w=1200&auto=format&fit=crop', 'Denim A-Line Mini - Front View', 0, true),
  ('denim-mini', 'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1200&auto=format&fit=crop', 'Denim A-Line Mini - Back View', 1, false),
  ('linen-wrap', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1200&auto=format&fit=crop', 'Linen Wrap Skirt - Front View', 0, true),
  ('linen-wrap', 'https://images.unsplash.com/photo-1520974735194-2bc0a6bda71b?q=80&w=1200&auto=format&fit=crop', 'Linen Wrap Skirt - Styled View', 1, false)
ON CONFLICT DO NOTHING;

-- Insert product variants
INSERT INTO product_variants (product_id, size, color, sku, price, inventory_quantity) VALUES
  -- Pleated Midi variants
  ('pleated-midi', 'XS', 'Blush', 'SKT-PM-001-XS-BL', 79.00, 15),
  ('pleated-midi', 'S', 'Blush', 'SKT-PM-001-S-BL', 79.00, 20),
  ('pleated-midi', 'M', 'Blush', 'SKT-PM-001-M-BL', 79.00, 25),
  ('pleated-midi', 'L', 'Blush', 'SKT-PM-001-L-BL', 79.00, 20),
  ('pleated-midi', 'XL', 'Blush', 'SKT-PM-001-XL-BL', 79.00, 15),
  ('pleated-midi', 'XS', 'Black', 'SKT-PM-001-XS-BK', 79.00, 12),
  ('pleated-midi', 'S', 'Black', 'SKT-PM-001-S-BK', 79.00, 18),
  ('pleated-midi', 'M', 'Black', 'SKT-PM-001-M-BK', 79.00, 22),
  ('pleated-midi', 'L', 'Black', 'SKT-PM-001-L-BK', 79.00, 18),
  ('pleated-midi', 'XL', 'Black', 'SKT-PM-001-XL-BK', 79.00, 12),
  
  -- Silk Maxi variants
  ('silk-maxi', 'XS', 'Ivory', 'SKT-SM-001-XS-IV', 129.00, 8),
  ('silk-maxi', 'S', 'Ivory', 'SKT-SM-001-S-IV', 129.00, 12),
  ('silk-maxi', 'M', 'Ivory', 'SKT-SM-001-M-IV', 129.00, 15),
  ('silk-maxi', 'L', 'Ivory', 'SKT-SM-001-L-IV', 129.00, 12),
  ('silk-maxi', 'XS', 'Emerald', 'SKT-SM-001-XS-EM', 129.00, 6),
  ('silk-maxi', 'S', 'Emerald', 'SKT-SM-001-S-EM', 129.00, 10),
  ('silk-maxi', 'M', 'Emerald', 'SKT-SM-001-M-EM', 129.00, 12),
  ('silk-maxi', 'L', 'Emerald', 'SKT-SM-001-L-EM', 129.00, 10)
ON CONFLICT (sku) DO NOTHING;
