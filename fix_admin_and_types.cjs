const fs = require('fs');

// 1. Fix types.ts
let types = fs.readFileSync('src/types.ts', 'utf8');
types = types.replace(/category: 'Stays' \| 'Lake'.*?;/, `category: 'Stays' | 'Lake' | 'Camping' | 'Food' | 'Bonfire' | 'Activities' | 'Guests' | 'Sunset' | 'Events' | 'All';\n  isVisible?: boolean;\n  sourceType?: 'manual' | 'accommodation' | 'package' | 'service' | 'homepage' | 'blog';\n  sourceId?: string;\n  displayOrder?: number;\n  altText?: string;`);
fs.writeFileSync('src/types.ts', types);

// 2. Fix AdminPage.tsx
let admin = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');
// Fix ImageIcon duplicates
admin = admin.replace(/Image as ImageIcon,\n/g, ''); // strip all
admin = admin.replace(/FileText,/g, 'FileText,\n  Image as ImageIcon,'); // insert once

// Fix GalleryItem import
admin = admin.replace(/WhyChooseUsStoryHighlight, /g, 'WhyChooseUsStoryHighlight, GalleryItem, ');

// Fix activeTab type
admin = admin.replace(/const \[activeTab, setActiveTab\] = useState<\n\s*'enquiries'/g, `const [activeTab, setActiveTab] = useState<\n    'enquiries' | 'gallery'`);

fs.writeFileSync('src/pages/AdminPage.tsx', admin);
console.log("Fixed types.ts and AdminPage.tsx");
