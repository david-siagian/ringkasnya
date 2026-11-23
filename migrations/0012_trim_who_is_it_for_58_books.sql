-- Migrasi 0012: Ringkas who_is_it_for_json menjadi tepat 4 poin per buku
-- untuk 58 buku awal yang sebelumnya memiliki 5-6 poin, agar konsisten dengan 20 buku Batch 1-2.

UPDATE books
SET who_is_it_for_json = json_array(
      json_extract(who_is_it_for_json, '$[0]'),
      json_extract(who_is_it_for_json, '$[1]'),
      json_extract(who_is_it_for_json, '$[2]'),
      json_extract(who_is_it_for_json, '$[3]')
    ),
    updated_at = datetime('now')
WHERE json_array_length(who_is_it_for_json) > 4;
