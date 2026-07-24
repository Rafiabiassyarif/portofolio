const fs = require('fs');
const path = require('path');

const componentsDir = path.join(__dirname, 'src', 'components');

fs.readdirSync(componentsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    const filePath = path.join(componentsDir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    let modified = false;

    // Check if it has the translation pattern
    if (content.includes('const t = translations[language];')) {
      // Replace imports
      content = content.replace(
        /import\s+{\s*useLanguage\s*}\s+from\s+["']\.\.\/context\/LanguageContext["'];\nimport\s+{\s*translations\s*}\s+from\s+["']\.\.\/utils\/translations["'];/,
        'import { useContent } from "../context/ContentContext";'
      );
      
      // Some files might only import useLanguage or translations separately or in different order,
      // fallback replacements:
      content = content.replace(/import\s+{\s*translations\s*}\s+from\s+["']\.\.\/utils\/translations["'];\n?/, '');
      content = content.replace(/import\s+{\s*useLanguage\s*}\s+from\s+["']\.\.\/context\/LanguageContext["'];\n?/, 'import { useContent } from "../context/ContentContext";\n');

      // Replace hooks
      content = content.replace(
        /const\s+{\s*language\s*}\s*=\s*useLanguage\(\);\n\s*const\s+t\s*=\s*translations\[language\];/,
        'const { content: t } = useContent();'
      );

      // Edge cases where they are separated
      content = content.replace(/const\s+t\s*=\s*translations\[language\];/, 'const { content: t } = useContent();');
      
      // Remove useLanguage() if no longer needed
      if (!content.includes('language ===') && !content.includes('toggleLanguage')) {
         content = content.replace(/const\s+{\s*language\s*}\s*=\s*useLanguage\(\);\n/, '');
      }

      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Refactored ${file}`);
    }
  }
});
