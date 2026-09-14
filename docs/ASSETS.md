# Assets and provenance

All imagery portrays one invented cat, Miso. Eleven original images were generated with the built-in image_gen tool for this project; no real pet-account photos, stock endorsements, or purchased assets were used. Generated fictional imagery is the usage basis; it does not imply a claim of exclusive copyright.

The complete exact prompt set, original tool-output paths, explicit input-reference paths, dimensions, hashes and generator assessment are recorded in [image-generation.json](image-generation.json). Every scene reused the inspected hero identity reference; lifestyle scenes also reused the laptop studio reference. The awake image is an explicit edit of the inspected sleepy image. Production assets are local optimized WebP files in `public/images/`. The original approved identity reference is also copied into this repository at `docs/reference/miso-approved-reference.png` for portable continuation.

| Final asset | Original filename | Use / alt text |
| --- | --- | --- |
| hero.webp | 01-hero-reference.png | Full amber-eyed ginger tabby, cream muzzle, white toes, striped tail; hero, social cover and hire card |
| laptop-scene.webp | 02-laptop-scene.png | Miso across a silver laptop on the sunny oak desk; work cover and keyboard service |
| sleepy.webp | 03-sleepy-portrait.png | Miso with eyes closed, chin on folded paws on the desk; nap state and box story detail |
| awake.webp | 04-awake-portrait.png | Same pose and desk with amber eyes open; awake state |
| resume-portrait.webp | 05-resume-portrait.png | Head/chest portrait with amber eyes and cream muzzle; résumé and interview |
| box-inspection.webp | 06-box-inspection.png | Miso in an open cardboard box; box service and work cover |
| sofa-scene.webp | 07-sofa-scene.png | Miso on the center of a beige linen sofa; supervision and sofa story |
| meeting-cameo.webp | 08-meeting-cameo.png | Miso beside the laptop in the same studio; meeting service and about page |
| window-portrait.webp | 09-window-portrait.png | Miso at the sunny studio window; about, strengths and work detail |
| box-detail.webp | 10-box-detail.png | Miso's face and white toes at the box rim; about and box story detail |
| laptop-detail.webp | 11-laptop-detail.png | Miso resting near the laptop keyboard; laptop story detail |

Display alt text is maintained centrally in `lib/content.ts`. Original output was 25 MB; production WebP files are resized to at most 1440px wide (hero 900px) at quality 84. Alpha is retained on the hero. Assets are never fetched from random image services.

`hero-mobile.webp` is a 480 × 720, quality-80 resize of the approved hero, approximately 62KB. This is a responsive derivative of the same image, not a twelfth generated photograph. `npm run assets` regenerates it with the social covers.

## Consistency assessment
The set preserves the principal identity: adult ginger tabby, amber eyes, cream muzzle and chest, pink nose, white toe caps, ginger legs and orange striped tail. Room palette, oak desk, laptop, beige sofa and sunny window remain coherent. Ordinary cat anatomy, no costume or human hands.

Small generated details are imperfect: the awake scene is compositionally matched but has slight residual pixel differences beyond the eyes; a blurred extra foreground plant appears in the sofa photo; small laptop key legends are generated details. No fake UI screenshot, brand endorsement or watermark is presented. These limitations are recorded rather than represented as pixel-perfect continuity.

## Fonts and graphic identity
Bricolage Grotesque Variable and Hanken Grotesk Variable are self-hosted Latin WOFF2 files from Fontsource 5.3.0 packages. Their SIL Open Font License files are committed at `public/fonts/OFL-bricolage.txt` and `public/fonts/OFL-hanken.txt`. Sources: [Bricolage Grotesque](https://github.com/ateliertriay/bricolage) and [Hanken Grotesk](https://github.com/HankenDesignCo/Hanken-Grotesk), distributed via [Fontsource](https://fontsource.org/).

The typographic `miso.` wordmark and small M/paw-inspired SVG favicon are original project graphics. Interface icons are simple authored SVG linework. Covers and personal cards use deterministic lettering from actual fonts; they are not generated screenshots or fabricated exports.
