# athletes-db.json

Este archivo actua como base de datos simple para mostrar atletas en el ranking.

Ruta usada por la web:
- `data/athletes-db.json`

Formato:

```json
{
  "rows": [
    {
      "id": "athlete-001",
      "email": "athlete@email.com",
      "name": "Athlete Name",
      "photo": "https://... o photos/local.jpg",
      "profileLink": "https://instagram.com/... o web",
      "videoUrl": "https://...",
      "videoDuration": "0:45",
      "score": 1
    }
  ]
}
```

Reglas:
- `name` es obligatorio para que aparezca.
- `score` es obligatorio para que aparezca.
- Si `score` esta vacio, no aparece en la web.
- `profileLink`, `videoUrl`, `photo` y `videoDuration` son opcionales.

Flujo recomendado:
1. El atleta completa su perfil en la web (queda en estado pendiente local).
2. Copias sus datos a `rows` en este archivo.
3. Cuando quieras publicarlo, pones `score`.
4. Al recargar la web, el atleta aparece en el ranking con esa puntuacion.
