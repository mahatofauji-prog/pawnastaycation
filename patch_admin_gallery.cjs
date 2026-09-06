const fs = require('fs');

const code = fs.readFileSync('src/pages/AdminPage.tsx', 'utf8');

const galleryTabContent = `
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl p-8 shadow-sm border border-stone-200">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h3 className="font-serif text-2xl font-bold text-[#14291D]">Website Gallery CMS</h3>
                <p className="text-stone-500 mt-1">Manage all dynamically aggregated images across the website.</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {gallery.map((img) => (
                <div key={img.id} className="border border-stone-200 rounded-2xl overflow-hidden bg-stone-50 flex flex-col group relative">
                  <div className="relative aspect-video bg-stone-200">
                    <img src={img.imageUrl} alt={img.title} className="w-full h-full object-cover" loading="lazy" />
                    <div className="absolute top-2 right-2 flex gap-2">
                      {img.sourceType && img.sourceType !== 'manual' && (
                        <span className="bg-[#14291D]/80 text-[#FAF8F5] text-[10px] px-2 py-1 rounded-full backdrop-blur-sm uppercase font-bold tracking-wider">
                          {img.sourceType}
                        </span>
                      )}
                      <span className={\`text-[10px] px-2 py-1 rounded-full backdrop-blur-sm uppercase font-bold tracking-wider \${img.isVisible !== false ? 'bg-green-500/80 text-white' : 'bg-red-500/80 text-white'}\`}>
                        {img.isVisible !== false ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4 flex-grow flex flex-col gap-3">
                    <div>
                      <label className="text-xs font-bold text-stone-500 mb-1 block">Title / Caption</label>
                      <input 
                        type="text" 
                        defaultValue={img.title}
                        onBlur={(e) => {
                          if (e.target.value !== img.title) {
                            api.updateGalleryItem(img.id, { ...img, title: e.target.value }).then(onRefreshData);
                          }
                        }}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C5A059] outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-stone-500 mb-1 block">Category</label>
                      <select 
                        defaultValue={img.category}
                        onChange={(e) => {
                          if (e.target.value !== img.category) {
                            api.updateGalleryItem(img.id, { ...img, category: e.target.value as any }).then(onRefreshData);
                          }
                        }}
                        className="w-full bg-white border border-stone-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C5A059] outline-none"
                      >
                        <option value="All">All</option>
                        <option value="Stays">Stays</option>
                        <option value="Camping">Camping</option>
                        <option value="Activities">Activities</option>
                        <option value="Food">Food</option>
                        <option value="Lake">Lake</option>
                        <option value="Bonfire">Bonfire</option>
                        <option value="Sunset">Sunset</option>
                        <option value="Events">Events</option>
                        <option value="Guests">Guests</option>
                      </select>
                    </div>
                    <div className="flex gap-2 mt-auto pt-2 border-t border-stone-200">
                      <button 
                        onClick={() => {
                          api.updateGalleryItem(img.id, { ...img, isVisible: img.isVisible === false ? true : false }).then(onRefreshData);
                        }}
                        className="flex-1 text-xs font-bold py-2 rounded-lg border border-stone-200 hover:bg-stone-100 transition-colors"
                      >
                        {img.isVisible !== false ? 'Hide' : 'Show'}
                      </button>
                      {img.sourceType === 'manual' && (
                        <button 
                          onClick={() => {
                            if (confirm('Delete this manual image?')) {
                              api.deleteGalleryItem(img.id).then(onRefreshData);
                            }
                          }}
                          className="text-xs font-bold py-2 px-3 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {gallery.length === 0 && (
              <div className="text-center py-12 text-stone-500">
                No images found in the system.
              </div>
            )}
          </div>
        )}
`;

const regex = /\{activeTab === 'settings' && \(/;
const newCode = code.replace(regex, galleryTabContent + "\n        {activeTab === 'settings' && (");
fs.writeFileSync('src/pages/AdminPage.tsx', newCode);
console.log("Updated AdminPage.tsx successfully");
