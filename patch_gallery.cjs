const fs = require('fs');

const code = fs.readFileSync('server.ts', 'utf8');

const replacement = `  // Dynamic Gallery Aggregator
  function getDynamicGallery() {
    const dynamicMap = new Map();
    
    const addImage = (url, defaultTitle, defaultCategory, sourceType, sourceId) => {
      if (!url || typeof url !== 'string') return;
      if (dynamicMap.has(url)) return;
      dynamicMap.set(url, {
        id: \`dyn-\${Math.random().toString(36).substr(2, 9)}\`,
        title: defaultTitle,
        imageUrl: url,
        category: defaultCategory,
        sourceType,
        sourceId,
        isVisible: true,
        displayOrder: 999
      });
    };

    db.stays.forEach(s => {
      if (s.mainImage) addImage(s.mainImage, \`\${s.name} Main View\`, 'Stays', 'accommodation', s.id);
      s.galleryImages?.forEach((img, i) => addImage(img, \`\${s.name} View \${i + 1}\`, 'Stays', 'accommodation', s.id));
    });

    db.packages.forEach(p => {
      if (p.coverImage) addImage(p.coverImage, \`\${p.name} Cover\`, 'Camping', 'package', p.id);
      p.galleryImages?.forEach((img, i) => addImage(img, \`\${p.name} View \${i + 1}\`, 'Camping', 'package', p.id));
    });

    db.services.forEach(s => {
      if (s.mainImage) addImage(s.mainImage, s.name, 'Activities', 'service', s.id);
      s.galleryImages?.forEach((img, i) => addImage(img, \`\${s.name} \${i + 1}\`, 'Activities', 'service', s.id));
    });

    db.blogs.forEach(b => {
      if (b.featuredImage) addImage(b.featuredImage, b.title, 'Lake', 'blog', b.id);
      b.contentImages?.forEach((img, i) => addImage(img, \`\${b.title} \${i + 1}\`, 'Lake', 'blog', b.id));
    });

    if (db.settings) {
      db.settings.heroImages?.forEach((img, i) => addImage(img, \`Hero Image \${i + 1}\`, 'All', 'homepage', 'hero'));
      if (db.settings.whyChooseUs?.image) addImage(db.settings.whyChooseUs.image, \`Why Choose Us\`, 'All', 'homepage', 'why-choose-us');
    }

    const finalGallery = [];
    
    db.gallery.forEach(manual => {
      if (dynamicMap.has(manual.imageUrl)) {
        const dyn = dynamicMap.get(manual.imageUrl);
        finalGallery.push({ ...dyn, ...manual, id: manual.id }); 
        dynamicMap.delete(manual.imageUrl);
      } else {
        finalGallery.push({ ...manual, sourceType: 'manual' });
      }
    });

    dynamicMap.forEach(dyn => finalGallery.push(dyn));

    return finalGallery.sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
  }

  // Gallery
  app.get(['/api/gallery', '/gallery'], (req, res) => {
    res.json(getDynamicGallery());
  });

  app.post(['/api/gallery', '/gallery'], (req, res) => {
    const item = {
      ...req.body,
      id: req.body.id || \`gal-\${Date.now()}\`,
    };
    db.gallery.unshift(item);
    saveDb();
    res.status(201).json(item);
  });

  app.put(['/api/gallery/:id', '/gallery/:id'], (req, res) => {
    const { id } = req.params;
    let idx = db.gallery.findIndex((g) => g.id === id);
    if (idx === -1) {
      // Might be a dynamic image being updated for the first time
      if (req.body.imageUrl) {
        idx = db.gallery.findIndex((g) => g.imageUrl === req.body.imageUrl);
        if (idx === -1) {
          const newItem = { ...req.body, id: \`gal-\${Date.now()}\` };
          db.gallery.push(newItem);
          saveDb();
          return res.json(newItem);
        }
      } else {
        return res.status(404).json({ error: 'Gallery item not found' });
      }
    }
    
    if (idx !== -1) {
      db.gallery[idx] = { ...db.gallery[idx], ...req.body };
      saveDb();
      return res.json(db.gallery[idx]);
    }
  });

  app.delete(['/api/gallery/:id', '/gallery/:id'], (req, res) => {
    db.gallery = db.gallery.filter((g) => g.id !== req.params.id);
    saveDb();
    res.json({ success: true, id: req.params.id });
  });`;

const regex = /\/\/ Gallery[\s\S]*?\/\/ FAQs/;
const newCode = code.replace(regex, replacement + '\n\n  // FAQs');
fs.writeFileSync('server.ts', newCode);
console.log("Updated server.ts successfully");
