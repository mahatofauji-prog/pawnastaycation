const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// The easiest way is to revert the whole file and redo just the AdminPage prop
// But let's just remove gallery={gallery} where it shouldn't be
// Or maybe it's easier to just strip them all and add it to AdminPage manually.
code = code.replace(/\s*gallery=\{gallery\}/g, '');
code = code.replace(/blogs=\{blogs\}/g, (match, offset, full) => {
  // Check if it's inside <AdminPage
  const context = full.substring(Math.max(0, offset - 100), offset);
  if (context.includes('<AdminPage')) {
    return `blogs={blogs}\n            gallery={gallery}`;
  }
  return match;
});

fs.writeFileSync('src/App.tsx', code);
console.log("Fixed App.tsx");
