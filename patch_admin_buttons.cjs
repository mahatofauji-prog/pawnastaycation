const fs = require('fs');
let code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

code = code.replace(/<button\n            onClick=\{\(\) => setActiveTab\("gallery"\)\}[\s\S]*?onClick=\{\(\) => setActiveTab\('blogs'\)\}/, `<button
            onClick={() => setActiveTab("gallery")}
            className={\`px-5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer \${
              activeTab === "gallery"
                ? "bg-[#14291D] text-[#FAF8F5] shadow-md border border-[#C5A059]/40"
                : "bg-white text-stone-700 hover:bg-stone-50 border border-stone-200"
            }\`}
          >
            <ImageIcon className="w-4 h-4 text-[#C5A059]" />
            <span>Gallery ({gallery.length})</span>
          </button>
          
          <button
            onClick={() => setActiveTab('blogs')}`);

fs.writeFileSync('src/pages/AdminPage.tsx', code);
console.log("Fixed buttons completely in AdminPage.tsx");
