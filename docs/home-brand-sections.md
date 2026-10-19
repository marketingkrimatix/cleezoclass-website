# Homepage brand sections

Reference: https://www.eskooly.com/ (composition reference only).

StudentSpotlight appears after ConnectionMap. SchoolVoices is placed before the homepage FAQs and renders only when content/school-testimonials.json contains approved quotes. The three approved association endorsements and supplied portraits are now populated. Each entry stores the exact quote, name, role/association title and local portrait URL.

Asset: public/cleezo-student-cutout.png
Generation mode: built-in imagegen, transparent background.

Final generation prompt:
Create a premium photographic cutout asset for Cleezo Class Indian K-12 school management website. One cheerful Indian teenage schoolgirl aged 15-17, dark braided hair, crisp white short sleeve school shirt with navy blue sleeveless school vest and navy trousers, backpack over both shoulders, holding two textbooks in left arm, right arm joyfully raised outward in confident celebratory gesture. Full body including shoes fully within frame with generous transparent margin. Natural authentic Indian facial features, warm confident smile, dynamic but believable standing stepping pose. High-end editorial studio photography, crisp clean silhouette, soft natural lighting, no text, no logos, no badges, no scenery, no floor or background, genuine transparent alpha. Subject only, no decorative shapes; gradient ring will be composed in CSS. Portrait 3:4 composition.

Validation: production build and targeted ESLint passed. Student section visually inspected at desktop and 375px; no section horizontal overflow; image loaded; Pause Motion state verified. Reduced motion has a CSS animation override. Approved testimonials added on 17 October 2026; see current verification results. Existing check-homepage-html.mjs fails at line 25 because its expected ERP sentence differs from the pre-existing homepage copy; existing copy was not altered.
