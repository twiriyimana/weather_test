INSERT INTO provinces (name) VALUES
  ('Kigali City'),
  ('Northern Province'),
  ('Southern Province'),
  ('Eastern Province'),
  ('Western Province');

INSERT INTO districts (province_id, name) VALUES
  (1, 'Nyarugenge'),
  (1, 'Gasabo'),
  (1, 'Kicukiro'),
  (2, 'Musanze'),
  (2, 'Gicumbi'),
  (2, 'Rulindo'),
  (2, 'Burera'),
  (3, 'Huye'),
  (3, 'Nyaruguru'),
  (3, 'Nyamagabe'),
  (3, 'Kamonyi'),
  (4, 'Rwamagana'),
  (4, 'Nyagatare'),
  (4, 'Bugesera'),
  (4, 'Kayonza'),
  (5, 'Rubavu'),
  (5, 'Karongi'),
  (5, 'Rusizi'),
  (5, 'Nyamasheke');

INSERT INTO locations (name, country, country_code, province, district, sector, cell, latitude, longitude) VALUES
  ('Kigali', 'Rwanda', 'RW', 'Kigali City', 'Gasabo', 'Remera', 'Kabeza', -1.9441, 30.0619),
  ('Gasabo', 'Rwanda', 'RW', 'Kigali City', 'Gasabo', 'Kimironko', 'Kinyinya', -1.9186, 30.0815),
  ('Nyarugenge', 'Rwanda', 'RW', 'Kigali City', 'Nyarugenge', 'Nyarugenge', 'Muyira', -1.9384, 30.0581),
  ('Kicukiro', 'Rwanda', 'RW', 'Kigali City', 'Kicukiro', 'Kicukiro', 'Kagarama', -1.9419, 30.0856),
  ('Musanze', 'Rwanda', 'RW', 'Northern Province', 'Musanze', 'Musanze', 'Ruhengeri', -1.4983, 29.6345),
  ('Huye', 'Rwanda', 'RW', 'Southern Province', 'Huye', 'Huye', 'Butare', -2.5908, 29.7394),
  ('Rubavu', 'Rwanda', 'RW', 'Western Province', 'Rubavu', 'Gisenyi', 'Rubavu', -1.7057, 29.2563),
  ('Bugesera', 'Rwanda', 'RW', 'Eastern Province', 'Bugesera', 'Nyamata', 'Mareba','Shyara','Ruhuha', -2.1549, 30.0612),
  ('Rwamagana', 'Rwanda', 'RW', 'Eastern Province', 'Rwamagana', 'Rwamagana', 'Muhazi', -1.9477, 30.4347),
  ('Gicumbi', 'Rwanda', 'RW', 'Northern Province', 'Gicumbi', 'Byumba', 'Nyamiyaga', -1.5746, 30.0739);
