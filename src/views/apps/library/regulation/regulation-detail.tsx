
import { RegulationType } from "@/types/projects";
import { cn } from "@/lib/utils";
import { ExternalLink } from "lucide-react";
import { useState } from "react";
import { RegulationModal } from "./regulation-modal";

const DetailSection = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="py-4 border-b border-slate-200">
    <h3 className="text-sm font-semibold text-slate-500 mb-2">{title}</h3>
    <div className="text-sm text-slate-800 space-y-1">{children}</div>
  </div>
);

const InfoPair = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="grid grid-cols-3 gap-2">
    <span className="font-medium text-slate-600 col-span-1">{label}</span>
    <span className="col-span-2">{value}</span>
  </div>
);

export const RegulationDetailView = ({ regulation }: { regulation: RegulationType }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const statusStyle = {
    Berlaku: "bg-emerald-100 text-emerald-800 border-emerald-200",
    Dicabut: "bg-rose-100 text-rose-800 border-rose-200",
    Draft: "bg-amber-100 text-amber-800 border-amber-200",
  };

  return (
    <div className="bg-white border border-slate-200 rounded-lg p-6 animate-fade-in">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 mb-4">
        <h2 className="text-xl font-bold text-slate-900">{regulation.title}</h2>
        <p className="text-sm text-slate-500 mt-1">{regulation.subtitle}</p>
      </div>

      {/* Main Content */}
      <div className="space-y-4">
        <DetailSection title="Ringkasan">
          <p className="leading-relaxed">{regulation.summary}</p>
        </DetailSection>

        <DetailSection title="Detail Utama">
          <div className="space-y-2">
            <InfoPair label="Nomor Regulasi" value={regulation.number} />
            <InfoPair label="Status" value={
              <span className={cn("px-2 py-0.5 text-xs font-semibold rounded-full border", statusStyle[regulation.status])}>
                {regulation.status}
              </span>
            } />
            <InfoPair label="Jenis" value={regulation.type} />
            <InfoPair label="Sektor" value={regulation.sector} />
          </div>
        </DetailSection>

        <DetailSection title="Informasi Penerbitan">
           <div className="space-y-2">
            <InfoPair label="Penerbit" value={regulation.issuer} />
            <InfoPair label="Yurisdiksi" value={regulation.jurisdiction} />
            <InfoPair label="Tanggal Terbit" value={regulation.publishedAt} />
            <InfoPair label="Tanggal Berlaku" value={regulation.effectiveAt} />
          </div>
        </DetailSection>

        {regulation.attachments && regulation.attachments.length > 0 && (
          <DetailSection title="Lampiran">
            <ul className="list-disc list-inside">
              {regulation.attachments.map((file, index) => (
                <li key={index}>
                  <a href={file.url} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    {file.filename}
                  </a>
                </li>
              ))}
            </ul>
          </DetailSection>
        )}

         {regulation.keywords && regulation.keywords.length > 0 && (
          <DetailSection title="Kata Kunci">
            <div className="flex flex-wrap gap-2">
               {regulation.keywords.map((keyword, index) => (
                <span key={index} className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-700">
                  {keyword}
                </span>
              ))}
            </div>
          </DetailSection>
        )}

        {regulation.sourceUrl && (
          <div className="pt-6 text-center">
            <button
              onClick={openModal}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-800 rounded-md shadow-sm hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors"
            >
              Kunjungi Sumber Resmi
              <ExternalLink className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
      {isModalOpen && <RegulationModal url={regulation.sourceUrl} onClose={closeModal} />}
    </div>
  );
};