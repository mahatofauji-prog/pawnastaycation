import express from 'express';
import path from 'path';
import fs from 'fs';
import {
  INITIAL_SITE_SETTINGS,
  INITIAL_STAYS,
  INITIAL_PACKAGES,
  INITIAL_EXPERIENCES,
  INITIAL_GALLERY,
  INITIAL_FAQS,
  INITIAL_TESTIMONIALS,
  INITIAL_SERVICES,
  INITIAL_BLOGS,
} from './src/data/mockData';
import {
  SiteSettings,
  Stay,
  StayPackage,
  Experience,
  GalleryItem,
  FAQItem,
  ServiceItem,
  BlogPost,
  Enquiry,
} from './src/types';

const app = express();
const PORT = 3000;

// CORS headers for Vercel and cross-origin CMS operations
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// Serverless-safe body parser middleware (single next call guarantee)
app.use((req, res, next) => {
  if (req.body !== undefined && req.body !== null) {
    if (typeof req.body === 'string' && req.body.trim().startsWith('{')) {
      try {
        req.body = JSON.parse(req.body);
      } catch (_) {}
    }
    return next();
  }
  return express.json({ limit: '50mb' })(req, res, (err) => {
    if (err) {
      req.body = {};
    }
    next();
  });
});

// Vercel serverless request URL normalizer
app.use((req, res, next) => {
  try {
    const rawUrl = req.url || '';
    let targetPath = '';

    // 1. Check for path parameter passed in vercel.json rewrite
    const matchPath = rawUrl.match(/[?&]path=([^&]+)/);
    if (matchPath && matchPath[1]) {
      const decoded = decodeURIComponent(matchPath[1]);
      targetPath = decoded.startsWith('/') ? decoded : '/api/' + decoded;
    }

    // 2. Check for __route or 0 query parameters
    if (!targetPath) {
      const matchRoute = rawUrl.match(/[?&](?:__route|0)=([^&]+)/);
      if (matchRoute && matchRoute[1]) {
        targetPath = decodeURIComponent(matchRoute[1]);
      }
    }

    // 3. Check Vercel headers (x-forwarded-uri, x-original-url, x-invoke-path)
    if (!targetPath) {
      const forwardedUri = (
        req.headers['x-forwarded-uri'] ||
        req.headers['x-original-url'] ||
        req.headers['x-invoke-path'] ||
        req.headers['x-matched-path']
      ) as string;
      if (forwardedUri && forwardedUri !== '/api/index' && forwardedUri !== '/api' && !forwardedUri.startsWith('/api/index?')) {
        targetPath = forwardedUri;
      }
    }

    if (targetPath) {
      if (!targetPath.startsWith('/')) {
        targetPath = '/' + targetPath;
      }
      req.url = targetPath;
      req.originalUrl = targetPath;
      delete (req as any)._parsedUrl;
    }
  } catch (e) {
    console.warn('[URL Normalizer Warning]:', e);
  }
  next();
});

const isServerless = Boolean(
  process.env.VERCEL ||
  process.env.VERCEL_ENV ||
  process.env.NOW_REGION ||
  process.env.AWS_LAMBDA_FUNCTION_NAME ||
  process.env.LAMBDA_TASK_ROOT
);
const DATA_DIR = isServerless ? '/tmp' : process.cwd();
const DATA_FILE = path.join(DATA_DIR, 'database.json');
const ROOT_DATA_FILE = path.join(process.cwd(), 'database.json');
const UPLOAD_DIR = isServerless ? '/tmp/uploads' : path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(UPLOAD_DIR)) {
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  } catch (e) {
    console.warn('[Storage] Could not create UPLOAD_DIR:', e);
  }
}

// Persistent storage state
let db: any = {
  settings: { ...INITIAL_SITE_SETTINGS },
  stays: [...INITIAL_STAYS],
  packages: [...INITIAL_PACKAGES],
  experiences: [...INITIAL_EXPERIENCES],
  gallery: [...INITIAL_GALLERY],
  faqs: [...INITIAL_FAQS],
  services: [...INITIAL_SERVICES],
  blogs: [...INITIAL_BLOGS],
  images: {} as Record<string, { id: string; filename: string; mimeType: string; data: string; size: number; createdAt: string }>,
  enquiries: [
    {
      id: 'ENQ-8902',
      customerName: 'Vikram Mehta',
      phone: '+91 98200 11223',
      email: 'vikram.m@example.com',
      checkIn: '2026-09-12',
      checkOut: '2026-09-13',
      guests: 2,
      stayTypeOrName: 'Lakeside Premium Dome Glamping',
      message: 'Interested in anniversary romantic setup on the deck.',
      status: 'New',
      createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
      sourcePage: 'Stay Detail Page',
    },
    {
      id: 'ENQ-8899',
      customerName: 'Ananya Roy',
      phone: '+91 97112 33445',
      email: 'ananya.roy@example.com',
      checkIn: '2026-09-19',
      checkOut: '2026-09-20',
      guests: 8,
      stayTypeOrName: 'Weekend Camping & Adventure Package',
      message: 'Group of 8 friends. Do you provide college discount?',
      status: 'Contacted',
      createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
      sourcePage: 'Package Detail Page',
    },
  ] as Enquiry[],
};

// Initial database loading
const fileToRead = fs.existsSync(DATA_FILE) ? DATA_FILE : fs.existsSync(ROOT_DATA_FILE) ? ROOT_DATA_FILE : null;
if (fileToRead) {
  try {
    const raw = fs.readFileSync(fileToRead, 'utf-8');
    const parsed = JSON.parse(raw);
    if (parsed.settings) {
      db.settings = {
        ...db.settings,
        ...parsed.settings,
        whyChooseUs: parsed.settings.whyChooseUs || INITIAL_SITE_SETTINGS.whyChooseUs,
      };
    }
    if (parsed.stays && Array.isArray(parsed.stays)) {
      const initialOrderMap = new Map(INITIAL_STAYS.map((s) => [s.id, s.displayOrder]));
      db.stays = parsed.stays.map((s: any) => ({
        ...s,
        displayOrder: s.displayOrder ?? initialOrderMap.get(s.id) ?? 999,
      }));
    } else {
      db.stays = [...INITIAL_STAYS];
    }
    if (parsed.packages && Array.isArray(parsed.packages)) db.packages = parsed.packages;
    if (parsed.experiences && Array.isArray(parsed.experiences)) db.experiences = parsed.experiences;
    if (parsed.gallery && Array.isArray(parsed.gallery)) db.gallery = parsed.gallery;
    if (parsed.faqs && Array.isArray(parsed.faqs)) db.faqs = parsed.faqs;
    if (parsed.services && Array.isArray(parsed.services)) {
      db.services = parsed.services.map((s: any, idx: number) => ({
        id: s.id || `srv-${Date.now()}-${idx}`,
        name: s.name || '',
        slug: s.slug || (s.name ? s.name.toLowerCase().replace(/\s+/g, '-') : `service-${idx}`),
        pricingType: s.pricingType || (s.price ? 'Paid' : 'Included'),
        price: s.price !== undefined ? s.price : null,
        priceUnit: s.priceUnit || 'Per Person',
        shortDescription: s.shortDescription || s.description || '',
        fullDescription: s.fullDescription || s.shortDescription || s.description || '',
        mainImage: s.mainImage || s.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
        galleryImages: s.galleryImages || (s.mainImage || s.image ? [s.mainImage || s.image] : []),
        icon: s.icon || '✨',
        featured: s.featured ?? (idx < 4),
        status: s.status || 'Active',
        displayOrder: s.displayOrder ?? (idx + 1),
        createdAt: s.createdAt,
        updatedAt: s.updatedAt,
      }));
    } else {
      db.services = [...INITIAL_SERVICES];
    }
    if (parsed.blogs && Array.isArray(parsed.blogs)) {
      db.blogs = parsed.blogs;
    } else {
      db.blogs = [...INITIAL_BLOGS];
    }
    if (parsed.images && typeof parsed.images === 'object') {
      db.images = parsed.images;
    }
    if (parsed.enquiries && Array.isArray(parsed.enquiries)) db.enquiries = parsed.enquiries;
    console.log('[CMS] Database successfully loaded from', fileToRead);
  } catch (e) {
    console.error('[CMS] Error parsing database JSON, using defaults:', e);
  }
}

function saveDb() {
  try {
    const dbCopy = { ...db };
    // Keep image payloads lightweight in database.json to survive serverless cold starts without RAM spikes
    if (dbCopy.images && typeof dbCopy.images === 'object') {
      const keys = Object.keys(dbCopy.images);
      const sortedKeys = keys.sort((a, b) => {
        const tA = new Date(dbCopy.images[a]?.createdAt || 0).getTime();
        const tB = new Date(dbCopy.images[b]?.createdAt || 0).getTime();
        return tB - tA;
      });
      const prunedImages: Record<string, any> = {};
      const maxToKeep = Math.min(10, sortedKeys.length);
      for (let i = 0; i < maxToKeep; i++) {
        const key = sortedKeys[i];
        const img = dbCopy.images[key];
        if (img) {
          prunedImages[key] = {
            id: img.id,
            filename: img.filename,
            mimeType: img.mimeType,
            size: img.size,
            createdAt: img.createdAt,
            // Only keep base64 data if under 600KB to ensure fast JSON serialization
            data: img.data && img.data.length < 600000 ? img.data : undefined,
          };
        }
      }
      dbCopy.images = prunedImages;
    }
    const dataStr = JSON.stringify(dbCopy);
    try {
      fs.writeFileSync(DATA_FILE, dataStr, 'utf-8');
    } catch (tmpErr) {
      console.warn('[CMS] Warning writing DATA_FILE:', tmpErr);
    }
    if (!isServerless && ROOT_DATA_FILE !== DATA_FILE) {
      try {
        fs.writeFileSync(ROOT_DATA_FILE, dataStr, 'utf-8');
      } catch (_) {}
    }
  } catch (e) {
    console.error('[CMS] Error saving database.json:', e);
  }
}

// 1. Static uploads directory middleware
app.use('/uploads', express.static(UPLOAD_DIR));

// 2. Uploaded image delivery handler with fallback to persistent database image store
app.get('/uploads/:filename(*)', (req, res) => {
  const requestedFile = path.basename(req.params.filename);
  const localFilePath = path.join(UPLOAD_DIR, requestedFile);

  if (fs.existsSync(localFilePath)) {
    return res.sendFile(localFilePath);
  }

  // Fallback to internal persistent image store
  const storedImg = db.images && db.images[requestedFile];
  if (storedImg && storedImg.data) {
    try {
      const buffer = Buffer.from(storedImg.data, 'base64');
      // Cache write to disk for subsequent requests
      try {
        if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        fs.writeFileSync(localFilePath, buffer);
      } catch (_) {}

      res.setHeader('Content-Type', storedImg.mimeType || 'image/jpeg');
      res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
      res.setHeader('Content-Length', buffer.length);
      return res.end(buffer);
    } catch (serveErr) {
      console.error('[Uploads fallback error]:', serveErr);
    }
  }

  return res.status(404).send('Image not found');
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Native Image Upload endpoint (NO third-party keys required)
app.post(['/api/upload', '/upload'], (req, res) => {
  try {
    const { imageBase64, filename, mimeType } = req.body || {};
    if (!imageBase64) {
      return res.status(400).json({ success: false, error: 'Upload failed: No image data received.' });
    }

    let detectedMime = mimeType || 'image/jpeg';
    let base64Payload = imageBase64;

    const matches = imageBase64.match(/^data:image\/([A-Za-z-+\/]+);base64,(.+)$/);
    if (matches && matches.length === 3) {
      detectedMime = `image/${matches[1].toLowerCase()}`;
      base64Payload = matches[2];
    }

    const supportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/jpg'];
    if (!supportedTypes.some((t) => detectedMime.includes(t.replace('image/', '')))) {
      return res.status(400).json({
        success: false,
        error: 'Unsupported file type. Please select JPG, JPEG, PNG, or WEBP.',
      });
    }

    const buffer = Buffer.from(base64Payload, 'base64');
    const maxBytes = 15 * 1024 * 1024;
    if (buffer.length > maxBytes) {
      const sizeMb = (buffer.length / (1024 * 1024)).toFixed(1);
      return res.status(400).json({
        success: false,
        error: `Image is too large (${sizeMb} MB). Maximum allowed size is 15 MB.`,
      });
    }

    let ext = 'webp';
    if (detectedMime.includes('png')) ext = 'png';
    else if (detectedMime.includes('jpeg') || detectedMime.includes('jpg')) ext = 'jpg';
    else if (detectedMime.includes('webp')) ext = 'webp';

    const timestamp = Date.now();
    const uniqueId = Math.random().toString(36).substring(2, 8);
    const safeFilename = `img_${timestamp}_${uniqueId}.${ext}`;

    if (!fs.existsSync(UPLOAD_DIR)) {
      try {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
      } catch (_) {}
    }

    const filePath = path.join(UPLOAD_DIR, safeFilename);
    try {
      fs.writeFileSync(filePath, buffer);
    } catch (writeErr) {
      console.warn('[Storage] Temporary file write skipped/failed:', writeErr);
    }

    // Save to persistent db images dictionary
    if (!db.images) {
      db.images = {};
    }
    db.images[safeFilename] = {
      id: safeFilename,
      filename: safeFilename,
      mimeType: detectedMime,
      data: base64Payload,
      size: buffer.length,
      createdAt: new Date().toISOString(),
    };
    saveDb();

    const publicUrl = `/uploads/${safeFilename}`;
    return res.status(200).json({
      success: true,
      url: publicUrl,
      filename: safeFilename,
      size: buffer.length,
    });
  } catch (err) {
    console.error('[CMS Upload] Error:', err);
    return res.status(500).json({
      success: false,
      error: (err as Error).message || 'Image upload failed. Please try again.',
    });
  }
});

  // Settings
  app.get(['/api/settings', '/settings'], (req, res) => {
    res.json(db.settings);
  });

  app.put(['/api/settings', '/settings'], (req, res) => {
    db.settings = { ...db.settings, ...req.body };
    saveDb();
    res.json(db.settings);
  });

  // Stays
  app.get(['/api/stays', '/stays'], (req, res) => {
    try {
      const sorted = [...db.stays].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      return res.json(sorted);
    } catch (err) {
      console.error('[API GET /api/stays Error]:', err);
      return res.status(500).json({ success: false, error: 'Server error retrieving stays list' });
    }
  });

  app.get(['/api/stays/:id', '/stays/:id'], (req, res) => {
    try {
      const rawId = req.params.id || '';
      let stayId = decodeURIComponent(rawId).trim();
      stayId = stayId.replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();

      const item = db.stays.find(
        (s: any) =>
          s.id === stayId ||
          s.slug === stayId ||
          s.id === rawId ||
          s.slug === rawId
      );

      if (!item) {
        return res.status(404).json({ success: false, error: `Stay "${stayId}" not found` });
      }
      return res.json(item);
    } catch (err) {
      console.error('[API GET /api/stays/:id Error]:', err);
      return res.status(500).json({ success: false, error: 'Server error retrieving stay record' });
    }
  });

  app.post(['/api/stays', '/stays'], (req, res) => {
    try {
      const newStay: Stay = {
        ...req.body,
        id: req.body?.id || `stay-${Date.now()}`,
        slug: req.body?.slug || (req.body?.name ? req.body.name.toLowerCase().replace(/\s+/g, '-') : `stay-${Date.now()}`),
      };
      db.stays.unshift(newStay);
      saveDb();
      return res.status(201).json(newStay);
    } catch (err) {
      console.error('[API POST /api/stays Error]:', err);
      return res.status(500).json({ success: false, error: 'Server error creating accommodation' });
    }
  });

  const handleUpdateStay = (req: express.Request, res: express.Response) => {
    try {
      const rawId = req.params.id || '';
      let stayId = decodeURIComponent(rawId).trim();
      stayId = stayId.replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();

      if (!stayId) {
        return res.status(400).json({ success: false, error: 'Stay ID parameter is required' });
      }

      const index = db.stays.findIndex(
        (s: any) =>
          s.id === stayId ||
          s.slug === stayId ||
          s.id === rawId ||
          s.slug === rawId ||
          `[${s.id}]` === rawId
      );

      if (index === -1) {
        console.warn(`[CMS API] Accommodation not found for update: "${stayId}" (raw parameter: "${rawId}")`);
        return res.status(404).json({
          success: false,
          error: `Accommodation with ID or slug "${stayId}" not found.`,
        });
      }

      const existing = db.stays[index];
      const updatedStay = {
        ...existing,
        ...(req.body || {}),
        id: existing.id, // Preserve immutable ID
        slug: existing.slug || existing.id,
      };

      db.stays[index] = updatedStay;
      saveDb();

      return res.status(200).json(updatedStay);
    } catch (err) {
      console.error('[API PUT/PATCH /api/stays/:id Error]:', err);
      return res.status(500).json({
        success: false,
        error: (err as Error).message || 'Server error updating accommodation record',
      });
    }
  };

  app.put(['/api/stays/:id', '/stays/:id'], handleUpdateStay);
  app.patch(['/api/stays/:id', '/stays/:id'], handleUpdateStay);

  app.delete(['/api/stays/:id', '/stays/:id'], (req, res) => {
    try {
      const rawId = req.params.id || '';
      let stayId = decodeURIComponent(rawId).trim();
      stayId = stayId.replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();

      db.stays = db.stays.filter((s: any) => s.id !== stayId && s.slug !== stayId && s.id !== rawId);
      saveDb();
      return res.json({ success: true, id: stayId });
    } catch (err) {
      console.error('[API DELETE /api/stays/:id Error]:', err);
      return res.status(500).json({ success: false, error: 'Server error deleting accommodation' });
    }
  });

  app.put('/api/stays-order', (req, res) => {
    try {
      const { ids } = req.body || {};
      if (ids && Array.isArray(ids)) {
        db.stays.forEach((s) => {
          const idx = ids.indexOf(s.id);
          if (idx !== -1) {
            s.displayOrder = idx + 1;
          }
        });
        saveDb();
      }
      const sorted = [...db.stays].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      res.json(sorted);
    } catch (err) {
      res.status(500).json({ success: false, error: 'Failed to update stays order' });
    }
  });

  // Packages
  app.get(['/api/packages', '/packages'], (req, res) => {
    try {
      const sorted = [...db.packages].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      return res.json(sorted);
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to fetch packages' });
    }
  });

  app.put(['/api/packages-order', '/packages-order'], (req, res) => {
    try {
      const { ids } = req.body || {};
      if (ids && Array.isArray(ids)) {
        db.packages.forEach((p: any) => {
          const idx = ids.indexOf(p.id);
          if (idx !== -1) {
            p.displayOrder = idx + 1;
          }
        });
        saveDb();
      }
      const sorted = [...db.packages].sort((a, b) => (a.displayOrder || 999) - (b.displayOrder || 999));
      return res.json(sorted);
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to reorder packages' });
    }
  });

  app.get(['/api/packages/:id', '/packages/:id'], (req, res) => {
    try {
      const rawId = req.params.id || '';
      let pkgId = decodeURIComponent(rawId).trim().replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();

      const pkg = db.packages.find((p: any) => p.id === pkgId || p.slug === pkgId || p.id === rawId || p.slug === rawId);
      if (!pkg) {
        return res.status(404).json({ success: false, error: 'Package not found' });
      }
      return res.json(pkg);
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to fetch package' });
    }
  });

  app.post(['/api/packages', '/packages'], (req, res) => {
    try {
      const newPkg: StayPackage = {
        ...req.body,
        id: req.body?.id || `pkg-${Date.now()}`,
        slug: req.body?.slug || req.body?.name?.toLowerCase().replace(/\s+/g, '-'),
      };
      db.packages.unshift(newPkg);
      saveDb();
      return res.status(201).json(newPkg);
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to create package' });
    }
  });

  const handleUpdatePackage = (req: express.Request, res: express.Response) => {
    try {
      const rawId = req.params.id || '';
      let pkgId = decodeURIComponent(rawId).trim().replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();

      const idx = db.packages.findIndex((p: any) => p.id === pkgId || p.slug === pkgId || p.id === rawId || p.slug === rawId);
      if (idx === -1) {
        return res.status(404).json({ success: false, error: `Package "${pkgId}" not found` });
      }
      const existing = db.packages[idx];
      db.packages[idx] = { ...existing, ...(req.body || {}), id: existing.id, slug: existing.slug || existing.id };
      saveDb();
      return res.json(db.packages[idx]);
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to update package' });
    }
  };

  app.put(['/api/packages/:id', '/packages/:id'], handleUpdatePackage);
  app.patch(['/api/packages/:id', '/packages/:id'], handleUpdatePackage);

  app.delete(['/api/packages/:id', '/packages/:id'], (req, res) => {
    try {
      const rawId = req.params.id || '';
      let pkgId = decodeURIComponent(rawId).trim().replace(/^\[+|\]+$/g, '').replace(/^"+|"+$/g, '').trim();

      db.packages = db.packages.filter((p: any) => p.id !== pkgId && p.slug !== pkgId && p.id !== rawId);
      saveDb();
      return res.json({ success: true, id: pkgId });
    } catch (err) {
      return res.status(500).json({ success: false, error: 'Failed to delete package' });
    }
  });

  // Experiences
  app.get(['/api/experiences', '/experiences'], (req, res) => {
    res.json(db.experiences);
  });

  app.post(['/api/experiences', '/experiences'], (req, res) => {
    const exp: Experience = {
      ...req.body,
      id: req.body.id || `exp-${Date.now()}`,
      slug: req.body.slug || req.body.title?.toLowerCase().replace(/\s+/g, '-'),
    };
    db.experiences.unshift(exp);
    saveDb();
    res.status(201).json(exp);
  });

  app.put(['/api/experiences/:id', '/experiences/:id'], (req, res) => {
    const idx = db.experiences.findIndex((e) => e.id === req.params.id || e.slug === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db.experiences[idx] = { ...db.experiences[idx], ...req.body };
    saveDb();
    res.json(db.experiences[idx]);
  });

  app.delete(['/api/experiences/:id', '/experiences/:id'], (req, res) => {
    db.experiences = db.experiences.filter((e) => e.id !== req.params.id);
    saveDb();
    res.json({ success: true, id: req.params.id });
  });

    // Dynamic Gallery Aggregator
  function getDynamicGallery() {
    const dynamicMap = new Map();
    
    const addImage = (url, defaultTitle, defaultCategory, sourceType, sourceId) => {
      if (!url || typeof url !== 'string') return;
      if (dynamicMap.has(url)) return;
      dynamicMap.set(url, {
        id: `dyn-${Math.random().toString(36).substr(2, 9)}`,
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
      if (s.mainImage) addImage(s.mainImage, `${s.name} Main View`, 'Stays', 'accommodation', s.id);
      s.galleryImages?.forEach((img, i) => addImage(img, `${s.name} View ${i + 1}`, 'Stays', 'accommodation', s.id));
    });

    db.packages.forEach(p => {
      if (p.coverImage) addImage(p.coverImage, `${p.name} Cover`, 'Camping', 'package', p.id);
      p.galleryImages?.forEach((img, i) => addImage(img, `${p.name} View ${i + 1}`, 'Camping', 'package', p.id));
    });

    db.services.forEach(s => {
      if (s.mainImage) addImage(s.mainImage, s.name, 'Activities', 'service', s.id);
      s.galleryImages?.forEach((img, i) => addImage(img, `${s.name} ${i + 1}`, 'Activities', 'service', s.id));
    });

    db.blogs.forEach(b => {
      if (b.featuredImage) addImage(b.featuredImage, b.title, 'Lake', 'blog', b.id);
      b.contentImages?.forEach((img, i) => addImage(img, `${b.title} ${i + 1}`, 'Lake', 'blog', b.id));
    });

    if (db.settings) {
      db.settings.heroImages?.forEach((img, i) => addImage(img, `Hero Image ${i + 1}`, 'All', 'homepage', 'hero'));
      if (db.settings.whyChooseUs?.image) addImage(db.settings.whyChooseUs.image, `Why Choose Us`, 'All', 'homepage', 'why-choose-us');
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
      id: req.body.id || `gal-${Date.now()}`,
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
          const newItem = { ...req.body, id: `gal-${Date.now()}` };
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
  });

  // FAQs
  app.get(['/api/faqs', '/faqs'], (req, res) => {
    res.json(db.faqs);
  });

  app.post(['/api/faqs', '/faqs'], (req, res) => {
    const faq: FAQItem = {
      ...req.body,
      id: req.body.id || `faq-${Date.now()}`,
    };
    db.faqs.unshift(faq);
    saveDb();
    res.status(201).json(faq);
  });

  app.put(['/api/faqs/:id', '/faqs/:id'], (req, res) => {
    const idx = db.faqs.findIndex((f) => f.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Not found' });
    db.faqs[idx] = { ...db.faqs[idx], ...req.body };
    saveDb();
    res.json(db.faqs[idx]);
  });

  app.delete(['/api/faqs/:id', '/faqs/:id'], (req, res) => {
    db.faqs = db.faqs.filter((f) => f.id !== req.params.id);
    saveDb();
    res.json({ success: true, id: req.params.id });
  });

  // Services
  app.get(['/api/services', '/services'], (req, res) => {
    const sorted = [...db.services].sort((a, b) => (a.displayOrder ?? 999) - (b.displayOrder ?? 999));
    res.json(sorted);
  });

  app.get(['/api/services/:id', '/services/:id'], (req, res) => {
    const item = db.services.find((s) => s.id === req.params.id || s.slug === req.params.id);
    if (!item) return res.status(404).json({ error: 'Service not found' });
    res.json(item);
  });

  app.post(['/api/services', '/services'], (req, res) => {
    const service: ServiceItem = {
      ...req.body,
      id: req.body.id || `srv-${Date.now()}`,
      slug: req.body.slug || (req.body.name ? req.body.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') : `srv-${Date.now()}`),
      pricingType: req.body.pricingType || (req.body.price ? 'Paid' : 'Included'),
      price: req.body.price !== undefined ? req.body.price : null,
      priceUnit: req.body.priceUnit || 'Per Person',
      shortDescription: req.body.shortDescription || req.body.description || '',
      fullDescription: req.body.fullDescription || req.body.shortDescription || req.body.description || '',
      mainImage: req.body.mainImage || req.body.image || 'https://images.unsplash.com/photo-1510312305653-8ed496efae75?auto=format&fit=crop&w=800&q=80',
      galleryImages: req.body.galleryImages || (req.body.mainImage || req.body.image ? [req.body.mainImage || req.body.image] : []),
      icon: req.body.icon || '✨',
      featured: req.body.featured ?? false,
      displayOrder: req.body.displayOrder || db.services.length + 1,
      status: req.body.status || 'Active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.services.push(service);
    saveDb();
    res.status(201).json(service);
  });

  app.put(['/api/services/:id', '/services/:id'], (req, res) => {
    const idx = db.services.findIndex((s) => s.id === req.params.id || s.slug === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Service not found' });
    db.services[idx] = {
      ...db.services[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDb();
    res.json(db.services[idx]);
  });

  app.delete(['/api/services/:id', '/services/:id'], (req, res) => {
    db.services = db.services.filter((s) => s.id !== req.params.id);
    saveDb();
    res.json({ success: true, id: req.params.id });
  });

  // Enquiries
  app.get(['/api/enquiries', '/enquiries'], (req, res) => {
    res.json(db.enquiries);
  });

  app.post(['/api/enquiries', '/enquiries'], (req, res) => {
    const newEnquiry: Enquiry = {
      id: `ENQ-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: req.body.customerName || req.body.name,
      phone: req.body.phone,
      email: req.body.email || '',
      checkIn: req.body.checkIn || '',
      checkOut: req.body.checkOut || '',
      guests: Number(req.body.guests) || 2,
      stayTypeOrName: req.body.stayTypeOrName || req.body.preferredStay || 'General Enquiry',
      message: req.body.message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
      sourcePage: req.body.sourcePage || 'Website Form',
    };
    db.enquiries.unshift(newEnquiry);
    saveDb();
    res.status(201).json(newEnquiry);
  });

  app.patch(['/api/enquiries/:id', '/enquiries/:id'], (req, res) => {
    const idx = db.enquiries.findIndex((e) => e.id === req.params.id);
    if (idx === -1) return res.status(404).json({ error: 'Enquiry not found' });
    db.enquiries[idx] = { ...db.enquiries[idx], ...req.body };
    saveDb();
    res.json(db.enquiries[idx]);
  });

  // Blogs
  app.get(['/api/blogs', '/blogs'], (req, res) => {
    res.json(db.blogs);
  });

  app.get(['/api/blogs/:id', '/blogs/:id'], (req, res) => {
    const blog = db.blogs.find((b) => b.id === req.params.id || b.slug === req.params.id);
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    res.json(blog);
  });

  app.post(['/api/blogs', '/blogs'], (req, res) => {
    const newBlog: BlogPost = {
      ...req.body,
      id: req.body.id || `blog-${Date.now()}`,
      slug: req.body.slug || req.body.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
      category: req.body.category || 'PAWNA LAKE GUIDE',
      status: req.body.status || 'Published',
      featured: req.body.featured !== undefined ? req.body.featured : true,
      displayOrder: req.body.displayOrder || db.blogs.length + 1,
      publishedDate: req.body.publishedDate || new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      readingTime: req.body.readingTime || '5 min read',
      author: req.body.author || 'Pawnastaycation Editorial Team',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    db.blogs.unshift(newBlog);
    saveDb();
    res.status(201).json(newBlog);
  });

  app.put(['/api/blogs/:id', '/blogs/:id'], (req, res) => {
    const idx = db.blogs.findIndex((b) => b.id === req.params.id);
    if (idx === -1) {
      return res.status(404).json({ error: 'Blog not found' });
    }
    db.blogs[idx] = {
      ...db.blogs[idx],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };
    saveDb();
    res.json(db.blogs[idx]);
  });

  app.delete(['/api/blogs/:id', '/blogs/:id'], (req, res) => {
    db.blogs = db.blogs.filter((b) => b.id !== req.params.id);
    saveDb();
    res.json({ success: true, id: req.params.id });
  });

  // Testimonials
  app.get(['/api/testimonials', '/testimonials'], (req, res) => {
    res.json(INITIAL_TESTIMONIALS);
  });

  // Fallback API 404 handler so no API request hangs
  app.use(['/api/*', '/api'], (req, res) => {
    return res.status(404).json({ success: false, error: `API endpoint ${req.method} ${req.originalUrl} not found` });
  });

  async function startServer() {
    if (process.env.NODE_ENV !== 'production') {
      try {
        const { createServer: createViteServer } = await import('vite');
        const vite = await createViteServer({
          server: { middlewareMode: true },
          appType: 'spa',
        });
        app.use(vite.middlewares);
      } catch (e) {
        console.warn('[Vite Dev Server Warning]:', e);
      }
    } else {
      const distPath = path.join(process.cwd(), 'dist');
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`[Pawnastaycation CMS Server] running on http://0.0.0.0:${PORT}`);
    });
  }

  if (!isServerless && !process.env.VERCEL) {
    startServer().catch((err) => {
      console.error('[Pawnastaycation Server Error]', err);
    });
  }

  export default app;
