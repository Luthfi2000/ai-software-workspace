# Express Winston Logger

Modul logging sederhana dan terstruktur menggunakan Winston untuk aplikasi Express.

## Fitur
- Logging HTTP Request secara otomatis (Method, URL, Status Code, Durasi).
- Format log Console berwarna untuk kemudahan debugging lokal (pada environment `development`).
- File logging otomatis (`logs/error.log` & `logs/combined.log`) dengan format JSON terstruktur.
- Log level dinamis sesuai dengan environment (`development` vs `production`).

## Rencana Struktur Repositori