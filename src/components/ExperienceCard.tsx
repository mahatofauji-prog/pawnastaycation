import { Clock, Compass, CheckCircle } from 'lucide-react';
import { Experience, SiteSettings } from '../types';
import { buildWhatsAppUrl } from '../lib/whatsapp';

interface ExperienceCardProps {
  key?: string;
  experience: Experience;
  onEnquireExperience: (expTitle?: string) => void;
  siteSettings: SiteSettings;
}

export function ExperienceCard({ experience, onEnquireExperience, siteSettings }: ExperienceCardProps) {
  return (
    <div className="bg-[#1A2421] rounded-2xl overflow-hidden border border-white/10 shadow-xl hover:border-[#C5A059]/50 transition-all duration-300 group flex flex-col h-full">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0A0F0E]">
        <img
          src={experience.image}
          alt={experience.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F1715] via-transparent to-black/30" />

        <div className="absolute top-3 left-3 bg-[#0F1715]/90 text-[#C5A059] text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border border-[#C5A059]/30 backdrop-blur-sm">
          {experience.category}
        </div>

        {experience.timing && (
          <div className="absolute bottom-3 left-3 bg-[#0F1715]/80 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm flex items-center gap-1.5 border border-white/10">
            <Clock className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{experience.timing}</span>
          </div>
        )}
      </div>

      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-serif text-xl font-bold text-[#F5F2ED] group-hover:text-[#C5A059] transition-colors mb-2">
            {experience.title}
          </h3>

          <p className="text-xs text-stone-300 leading-relaxed mb-4">
            {experience.shortDescription}
          </p>

          <div className="space-y-1.5 mb-5">
            {experience.highlights.map((h, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-stone-300">
                <CheckCircle className="w-3.5 h-3.5 text-[#C5A059] shrink-0" />
                <span>{h}</span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => onEnquireExperience(experience.title)}
          className="w-full py-2.5 px-4 bg-[#C5A059] hover:brightness-110 text-[#0F1715] font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow flex items-center justify-center gap-2 cursor-pointer mt-auto"
          id={`enquire-exp-${experience.id}`}
        >
          <Compass className="w-4 h-4 text-[#0F1715]" />
          <span>Enquire Experience</span>
        </button>
      </div>
    </div>
  );
}
