# Placa NFC para reseñas de Google

Landing page del producto: una placa resinada con chip NFC que, al acercarle el
celular, abre directo la página de reseñas de Google del negocio.

Sitio estático, sin build. Se despliega tal cual en Vercel.

## Estructura

```
index.html      Página completa
styles.css      Sistema de diseño y estilos
app.js          Reveals, demo del toque y links de contacto
assets/         Fotos optimizadas (WebP + JPG), imagen social y fuentes
fonts.css       Declaraciones @font-face de las fuentes auto-hospedadas
favicon.svg
robots.txt · sitemap.xml
```

## Antes de publicar

Hay tres cosas que dependen de datos reales y quedaron con valores de referencia:

1. **Contacto — hay que tocarlo en DOS lugares.** Los `href` reales viven en
   `index.html` para que los botones funcionen aunque el JS no cargue, y `app.js`
   los reescribe en runtime. Si cambiás uno solo, el otro queda desactualizado.

   En `index.html`, buscá `wa.me` y `mailto:` (sección `#contacto`).

   En `app.js`, arriba de todo:

   ```js
   var CONTACTO = {
     whatsapp: "5491100000000",        // tu número, con código de país, sin + ni espacios
     email: "hola@tunegocio.com.ar",
     mensaje: "¡Hola! Me interesa la placa NFC para reseñas de Google."
   };
   ```

2. **Dominio.** `index.html` (canonical y etiquetas Open Graph), `robots.txt` y
   `sitemap.xml` usan `https://nfc-page.vercel.app`. Si el dominio final es otro,
   reemplazalo en esos tres archivos.

3. **Medida de la placa.** La sección "Tamaño real" dice `≈ 8,5 cm de lado`,
   estimado a partir de las fotos y marcado como aproximado en la propia página.
   Cuando tengas la medida exacta, actualizala en `index.html` (buscá `8,5 cm`).

## Desarrollo local

```bash
npx serve -l 4321 .
```

## Decisiones de diseño

- **Fondo tinta cálida, no negro puro.** La página se mira de noche, desde el
  celular, y la placa blanca resinada tiene que brillar como en una vitrina.
- **Los cuatro colores de Google se reservan al producto.** En la interfaz el
  único acento es el oro de las cinco estrellas. Evita que la página se lea como
  una imitación de Google y mantiene la atención en la placa.
- **Fuentes auto-hospedadas.** Fraunces e Inter viven en `assets/fonts`,
  subseteadas a los caracteres que usa la página. La hoja de estilos de Google
  Fonts bloqueaba el primer render: si ese pedido se demoraba o fallaba, la
  página quedaba en blanco. Medido en local, el primer render pasó de 12,6 s a
  0,19 s. Si algún día agregás texto con caracteres nuevos (otro idioma, símbolos
  raros), hay que regenerar el subset o esos glifos caen a la fuente del sistema.
  El subset `latin` de Google no incluye `≈` (U+2248), por eso la cota de tamaño
  dice "aprox." en texto y no el símbolo.
- **Animación con propósito.** El único movimiento grande es la demo del toque,
  que explica el producto. Corre sólo cuando está en pantalla y la pestaña está
  visible. Todo se anima con `transform` y `opacity`, y `prefers-reduced-motion`
  apaga el movimiento dejando un estado final legible.
