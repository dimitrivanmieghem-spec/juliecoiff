"use client";

import { useState, useMemo, useRef, useTransition, useEffect } from "react";
import { z } from "zod";
import { ChevronLeft, ChevronRight, CheckCircle, Clock, Palette, MapPin } from "lucide-react";
import {
  BASE_SERVICES,
  ADDONS,
  formatDuration,
  getTravelFee,
  type Service,
} from "@/lib/data";
import { createReservation } from "@/app/actions/booking";
import MapZone, { type ClientCoords } from "@/components/MapZone";
import AddressAutocomplete from "@/components/AddressAutocomplete";
import BookingCalendar from "@/components/BookingCalendar";

const COLOR_OPTIONS = [
  { id: "Blond", swatch: "#E8C44A" },
  { id: "Brun",  swatch: "#5C3317" },
  { id: "Roux",  swatch: "#B5471B" },
  { id: "Noir",  swatch: "#1C1917" },
] as const;

const inputClass =
  "w-full bg-white/80 border border-primary/20 rounded-2xl px-4 py-3.5 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

const bookingSchema = z.object({
  fullName: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  email:    z.string().email("Adresse e-mail invalide"),
  phone:    z.string().regex(/^(\+32|0)[0-9]{8,9}$/, "Numéro de téléphone belge invalide (ex: +32470123456)"),
  address:  z.string().min(5, "Veuillez entrer une adresse complète"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

const addonCategories = Array.from(new Set(ADDONS.map((a) => a.category)));

type WizardStep = 1 | 2 | 3 | "success";

export default function Calculator() {
  const [wizardStep, setWizardStep]             = useState<WizardStep>(1);

  useEffect(() => {
    const el = document.getElementById("booking");
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [wizardStep]);
  const [selectedBaseId, setSelectedBaseId]     = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [clientCoords, setClientCoords]         = useState<ClientCoords | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; time: string } | null>(null);

  const [addressConfirmed, setAddressConfirmed] = useState(false);

  const [fieldName, setFieldName]               = useState("");
  const [fieldEmail, setFieldEmail]             = useState("");
  const [fieldPhone, setFieldPhone]             = useState("");
  const [fieldStreet, setFieldStreet]           = useState("");
  const [fieldPostalCode, setFieldPostalCode]   = useState("");
  const [fieldColorBase, setFieldColorBase]     = useState("");
  const [fieldColorNotes, setFieldColorNotes]   = useState("");

  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition]  = useTransition();

  const formRef = useRef<HTMLFormElement>(null);

  const selectedBase   = BASE_SERVICES.find((b) => b.id === selectedBaseId) ?? null;
  const addonsEnabled  = selectedBase?.category === "Femme";
  const needsColorInfo = selectedAddonIds.includes("a2") || selectedAddonIds.includes("a4");

  const postalFee        = fieldPostalCode ? getTravelFee(fieldPostalCode) : null;
  const zoneOutOfCoverage = addressConfirmed && postalFee === null;

  const { subTotal, travelFee, total, totalDuration } =
    useMemo(() => {
      const basePrice    = selectedBase?.price    ?? 0;
      const baseDuration = selectedBase?.duration ?? 0;
      const addonList    = ADDONS.filter((a) => selectedAddonIds.includes(a.id));
      const addonPrice   = addonList.reduce((s, a) => s + a.price,    0);
      const addonDur     = addonList.reduce((s, a) => s + a.duration, 0);
      const sub          = basePrice + addonPrice;
      const dur          = baseDuration + addonDur;
      const fee          = fieldPostalCode ? (getTravelFee(fieldPostalCode) ?? 0) : 0;
      return { subTotal: sub, totalDuration: dur, travelFee: fee, total: sub + fee };
    }, [selectedBase, selectedAddonIds, fieldPostalCode]);

  const canStep1Continue = selectedBaseId !== null && addressConfirmed && !zoneOutOfCoverage;

  const isFormValid =
    fieldName.trim().length > 0 &&
    fieldEmail.trim().length > 0 &&
    fieldPhone.trim().length > 0 &&
    fieldStreet.trim().length > 0 &&
    selectedDateTime !== null;

  function toggleAddon(id: string) {
    setSelectedAddonIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  }

  function handleAddressSelect(lat: number, lng: number, cityName: string, street: string, postalCode: string) {
    setClientCoords({ lat, lng, name: cityName });
    setFieldStreet(street);
    setFieldPostalCode(postalCode);
    setAddressConfirmed(true);
  }

  function handleAddressClear() {
    setClientCoords(null);
    setFieldStreet("");
    setFieldPostalCode("");
    setAddressConfirmed(false);
  }

  function advanceStep() {
    if (wizardStep === 1) setWizardStep(addonsEnabled ? 2 : 3);
    else if (wizardStep === 2) setWizardStep(3);
    else if (wizardStep === 3) formRef.current?.requestSubmit();
  }

  function goBack() {
    if (wizardStep === 2) setWizardStep(1);
    else if (wizardStep === 3) setWizardStep(addonsEnabled ? 2 : 1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid || !selectedDateTime) return;
    setServerError(null);
    setFieldErrors({});

    const parsed = bookingSchema.safeParse({
      fullName: fieldName, email: fieldEmail, phone: fieldPhone, address: fieldStreet,
    });

    if (!parsed.success) {
      const errs: FieldErrors = {};
      for (const issue of parsed.error.issues) {
        const key = issue.path[0] as keyof FieldErrors;
        if (!errs[key]) errs[key] = issue.message;
      }
      setFieldErrors(errs);
      return;
    }

    const formData = new FormData(e.currentTarget);
    formData.set("appointment_date", selectedDateTime.date);
    formData.set("appointment_time", selectedDateTime.time);

    const serviceIds = [selectedBaseId, ...selectedAddonIds].filter(Boolean) as string[];
    startTransition(async () => {
      const result = await createReservation(formData, {
        serviceIds,
        totalPrice: total,
        totalDuration,
        cityName: clientCoords?.name ?? "",
      });
      if ("error" in result) setServerError(result.error);
      else setWizardStep("success");
    });
  }

  function resetAll() {
    setWizardStep(1);
    setSelectedBaseId(null);
    setSelectedAddonIds([]);
    setClientCoords(null);
    setSelectedDateTime(null);
    setAddressConfirmed(false);
    setFieldName(""); setFieldEmail(""); setFieldPhone(""); setFieldStreet(""); setFieldPostalCode("");
    setFieldColorBase(""); setFieldColorNotes("");
    setFieldErrors({});
  }

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (wizardStep === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-5 pb-20 md:pb-0">
        <CheckCircle size={52} className="text-primary" aria-hidden="true" />
        <h2 className="font-serif text-2xl md:text-3xl text-text-main font-semibold max-w-md">
          Merci pour votre réservation !
        </h2>
        <p className="text-base text-text-main/70 max-w-sm leading-relaxed">
          Julie vous confirmera le rendez-vous rapidement par e-mail ou téléphone.
        </p>
        <button
          onClick={resetAll}
          className="mt-2 text-sm text-primary underline underline-offset-4 hover:text-primary-light transition-colors"
        >
          Faire une nouvelle réservation
        </button>
      </div>
    );
  }

  const numericStep   = wizardStep as 1 | 2 | 3;
  const visibleLabels = addonsEnabled ? ["Prestation", "Options", "Rendez-vous"] : ["Prestation", "Rendez-vous"];
  const visibleIndex  = numericStep === 1 ? 0 : numericStep === 2 ? 1 : addonsEnabled ? 2 : 1;
  const canAdvance    = numericStep === 1 ? canStep1Continue : numericStep === 2 ? true : isFormValid;

  return (
    <div className="pb-44 md:pb-0">
      <ProgressBar labels={visibleLabels} currentIndex={visibleIndex} />

      <div className="mt-8 flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:flex-1">

          {numericStep > 1 && (
            <button
              onClick={goBack}
              className="flex items-center gap-1.5 text-sm text-text-main/60 hover:text-primary mb-6 transition-colors"
              aria-label="Retour à l'étape précédente"
            >
              <ChevronLeft size={16} aria-hidden="true" />
              Retour
            </button>
          )}

          {/* ── STEP 1 : Prestation + Ville ──────────────────────────────── */}
          {numericStep === 1 && (
            <div className="space-y-10">
              <section aria-labelledby="base-label">
                <h2 id="base-label" className="font-serif text-primary text-xl font-semibold mb-1 pb-2 border-b border-primary/20">
                  Choisissez votre prestation
                </h2>
                <p className="text-xs text-text-main/50 mb-5">Une seule prestation de base par rendez-vous.</p>

                {(["Femme", "Homme", "Enfant"] as const).map((cat) => (
                  <div key={cat} className="mb-6">
                    <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest mb-3">{cat}</p>
                    <ul className="grid grid-cols-2 gap-3" role="list">
                      {BASE_SERVICES.filter((b) => b.category === cat).map((service) => {
                        const selected = selectedBaseId === service.id;
                        return (
                          <li key={service.id} className="flex">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBaseId(selected ? null : service.id);
                                if (!selected && service.category !== "Femme") setSelectedAddonIds([]);
                              }}
                              aria-pressed={selected}
                              className={`w-full flex flex-col items-center justify-between gap-2 p-4 rounded-3xl border-2 text-center transition-all duration-150 min-h-[96px] ${
                                selected
                                  ? "border-primary bg-primary/8 shadow-md"
                                  : "border-primary/10 bg-white/70 hover:border-primary/25 hover:bg-white hover:shadow-sm"
                              }`}
                            >
                              <span className="text-sm font-semibold text-text-main leading-snug">{service.name}</span>
                              <span className="text-[11px] text-text-main/45 flex items-center gap-1">
                                <Clock size={10} aria-hidden="true" />
                                {formatDuration(service.duration)}
                              </span>
                              <span className={`text-xl font-bold transition-colors ${selected ? "text-primary" : "text-text-main/70"}`}>
                                {service.price}€
                              </span>
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </section>

              <section aria-labelledby="zone-label">
                <h2 id="zone-label" className="font-serif text-primary text-xl font-semibold mb-4 pb-2 border-b border-primary/20">
                  Votre adresse
                </h2>
                <div className="space-y-3">
                  <AddressAutocomplete onAddressSelect={handleAddressSelect} onClear={handleAddressClear} />
                  <p className="text-xs px-1" aria-live="polite">
                    {!clientCoords && (
                      <span className="text-text-main/40">Saisissez votre adresse pour vérifier la zone de déplacement.</span>
                    )}
                    {clientCoords && !zoneOutOfCoverage && (
                      <span className="font-medium text-primary">
                        {postalFee === 0 ? "Zone 1 — Déplacement inclus" : `Zone couverte — +${postalFee}€ de déplacement`}
                      </span>
                    )}
                    {zoneOutOfCoverage && (
                      <span className="text-red-500">
                        Zone non couverte. Veuillez contacter Julie au 0484/66.68.92 pour une demande exceptionnelle.
                      </span>
                    )}
                  </p>
                </div>
                <div className="mt-5">
                  <MapZone clientCoords={clientCoords} />
                </div>
              </section>

              <div className="hidden md:block">
                <button
                  onClick={advanceStep}
                  disabled={!canStep1Continue}
                  className="w-full bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3.5 rounded-full transition-colors duration-200"
                >
                  Continuer
                </button>
                {!canStep1Continue && (
                  <p className="mt-2 text-xs text-text-main/40 text-center">
                    {!selectedBase
                      ? "Choisissez une prestation."
                      : zoneOutOfCoverage
                      ? "Zone non couverte — impossible de continuer."
                      : "Sélectionnez votre adresse dans la liste pour continuer."}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* ── STEP 2 : Techniques & Soins ──────────────────────────────── */}
          {numericStep === 2 && (
            <section aria-labelledby="addon-label">
              <h2 id="addon-label" className="font-serif text-primary text-xl font-semibold mb-1 pb-2 border-b border-primary/20">
                Techniques et soins
                <span className="ml-2 text-sm font-sans font-normal text-text-main/50">(Optionnel)</span>
              </h2>
              <p className="text-xs text-text-main/50 mt-1 mb-6">Ajoutez des options à votre prestation de base.</p>

              {addonCategories.map((cat) => (
                <div key={cat} className="mb-6">
                  <p className="text-xs font-bold text-text-main/40 uppercase tracking-widest mb-3">{cat}</p>
                  <ul className="grid grid-cols-2 gap-3" role="list">
                    {ADDONS.filter((a) => a.category === cat).map((addon) => {
                      const checked = selectedAddonIds.includes(addon.id);
                      return (
                        <li key={addon.id} className="flex">
                          <label
                            htmlFor={`addon-${addon.id}`}
                            className={`w-full flex flex-col items-center justify-between gap-2 p-4 rounded-3xl cursor-pointer border-2 text-center transition-all duration-150 min-h-[96px] ${
                              checked
                                ? "border-primary bg-primary/8 shadow-md"
                                : "border-primary/10 bg-white/70 hover:border-primary/25 hover:bg-white hover:shadow-sm"
                            }`}
                          >
                            <input
                              type="checkbox"
                              id={`addon-${addon.id}`}
                              checked={checked}
                              onChange={() => toggleAddon(addon.id)}
                              className="sr-only"
                            />
                            <span className="text-sm font-semibold text-text-main leading-snug">{addon.name}</span>
                            <span className="text-[11px] text-text-main/45 flex items-center gap-1">
                              <Clock size={10} aria-hidden="true" />
                              {formatDuration(addon.duration)}
                            </span>
                            <span className={`text-xl font-bold transition-colors ${checked ? "text-primary" : "text-text-main/70"}`}>
                              +{addon.price}€
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}

              <div className="hidden md:block mt-4">
                <button
                  onClick={advanceStep}
                  className="w-full bg-primary hover:bg-primary-light text-white font-medium text-sm px-6 py-3.5 rounded-full transition-colors duration-200"
                >
                  Continuer
                </button>
              </div>
            </section>
          )}

          {/* ── STEP 3 : Date/Heure + Coordonnées ────────────────────────── */}
          {numericStep === 3 && (
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              aria-label="Formulaire de réservation"
              noValidate
              className="space-y-8"
            >
              <fieldset>
                <legend className="font-serif text-primary text-xl font-semibold mb-5 pb-2 border-b border-primary/20 w-full">
                  Date &amp; heure souhaitées
                </legend>
                <BookingCalendar
                  totalDuration={totalDuration}
                  onSelectDateTime={(date, time) => setSelectedDateTime({ date, time })}
                />
                {selectedDateTime && (
                  <p className="mt-3 text-xs text-primary font-medium px-1" aria-live="polite">
                    ✓ Créneau sélectionné : {selectedDateTime.date} à {selectedDateTime.time}
                  </p>
                )}
              </fieldset>

              <fieldset className="space-y-4">
                <legend className="font-serif text-primary text-xl font-semibold mb-5 pb-2 border-b border-primary/20 w-full">
                  Vos coordonnées
                </legend>

                <div>
                  <label htmlFor="client_name" className="block text-xs font-medium text-text-main/60 mb-1.5">
                    Nom complet <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="client_name" name="client_name" type="text" required
                    autoComplete="name" placeholder="Marie Dupont"
                    value={fieldName}
                    onChange={(e) => { setFieldName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: undefined })); }}
                    className={`${inputClass} ${fieldErrors.fullName ? "border-red-400 focus:ring-red-300" : ""}`}
                    aria-describedby={fieldErrors.fullName ? "err-name" : undefined}
                  />
                  {fieldErrors.fullName && <p id="err-name" className="mt-1 text-xs text-red-500 px-1">{fieldErrors.fullName}</p>}
                </div>

                <div>
                  <label htmlFor="client_email" className="block text-xs font-medium text-text-main/60 mb-1.5">
                    E-mail <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="client_email" name="client_email" type="email" required
                    autoComplete="email" placeholder="marie@example.com"
                    value={fieldEmail}
                    onChange={(e) => { setFieldEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
                    className={`${inputClass} ${fieldErrors.email ? "border-red-400 focus:ring-red-300" : ""}`}
                    aria-describedby={fieldErrors.email ? "err-email" : undefined}
                  />
                  {fieldErrors.email && <p id="err-email" className="mt-1 text-xs text-red-500 px-1">{fieldErrors.email}</p>}
                </div>

                <div>
                  <label htmlFor="client_phone" className="block text-xs font-medium text-text-main/60 mb-1.5">
                    Téléphone <span aria-hidden="true">*</span>
                  </label>
                  <input
                    id="client_phone" name="client_phone" type="tel" required
                    autoComplete="tel" placeholder="+32470000000"
                    value={fieldPhone}
                    onChange={(e) => { setFieldPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); }}
                    className={`${inputClass} ${fieldErrors.phone ? "border-red-400 focus:ring-red-300" : ""}`}
                    aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                  />
                  {fieldErrors.phone && <p id="err-phone" className="mt-1 text-xs text-red-500 px-1">{fieldErrors.phone}</p>}
                </div>

                <div>
                  <label className="block text-xs font-medium text-text-main/60 mb-1.5">
                    Adresse <span aria-hidden="true">*</span>
                  </label>
                  <div className="flex items-center gap-2.5 bg-primary/5 border border-primary/20 rounded-2xl px-4 py-3.5 text-sm text-text-main">
                    <MapPin size={14} className="text-primary shrink-0" aria-hidden="true" />
                    <span>{fieldStreet}{fieldPostalCode ? `, ${fieldPostalCode}` : ""}{clientCoords?.name ? ` ${clientCoords.name}` : ""}</span>
                  </div>
                  <input type="hidden" name="client_street" value={`${fieldStreet}, ${fieldPostalCode} ${clientCoords?.name ?? ""}`} />
                </div>

                {/* Champs conditionnels : Coloration / Balayage */}
                {needsColorInfo && (
                  <div className="bg-primary/5 border border-primary/15 rounded-3xl p-5 space-y-5">
                    <div className="flex items-center gap-2">
                      <Palette size={15} className="text-primary" aria-hidden="true" />
                      <p className="text-xs font-semibold text-primary uppercase tracking-wide">
                        Informations couleur
                        <span className="ml-1.5 normal-case font-normal text-text-main/40">(optionnel)</span>
                      </p>
                    </div>

                    <div>
                      <p className="block text-xs font-medium text-text-main/60 mb-2.5">Couleur actuelle</p>
                      <div className="grid grid-cols-4 gap-2" role="group" aria-label="Couleur de base">
                        {COLOR_OPTIONS.map((c) => {
                          const active = fieldColorBase === c.id;
                          return (
                            <button
                              key={c.id}
                              type="button"
                              onClick={() => setFieldColorBase(active ? "" : c.id)}
                              aria-pressed={active}
                              className={`flex flex-col items-center gap-2 py-3 px-1 rounded-2xl border-2 transition-all duration-150 ${
                                active
                                  ? "border-primary bg-primary/8 shadow-sm"
                                  : "border-primary/15 bg-white/70 hover:border-primary/30"
                              }`}
                            >
                              <span
                                className="w-8 h-8 rounded-full border border-black/10 shadow-sm"
                                style={{ backgroundColor: c.swatch }}
                                aria-hidden="true"
                              />
                              <span className={`text-xs font-medium ${active ? "text-primary" : "text-text-main/70"}`}>
                                {c.id}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                      <input type="hidden" name="color_base" value={fieldColorBase} />
                    </div>

                    <div>
                      <label htmlFor="color_notes" className="block text-xs font-medium text-text-main/60 mb-1.5">
                        Précisions sur votre nuance
                      </label>
                      <textarea
                        id="color_notes"
                        name="color_notes"
                        rows={3}
                        placeholder="Ex : besoin de couvrir des cheveux blancs, envie d'un balayage naturel, racines à refaire…"
                        value={fieldColorNotes}
                        onChange={(e) => setFieldColorNotes(e.target.value)}
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>
                )}
              </fieldset>

              {serverError && (
                <p role="alert" className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-2xl px-4 py-3">
                  {serverError}
                </p>
              )}

              <button
                type="submit"
                disabled={isPending || !isFormValid}
                className="hidden md:block w-full bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3.5 rounded-full transition-colors duration-200"
                aria-busy={isPending}
              >
                {isPending ? "Envoi en cours…" : "Confirmer la réservation"}
              </button>
            </form>
          )}
        </div>

        {/* Desktop sidebar summary */}
        <BookingSummary
          selectedBase={selectedBase}
          selectedAddonIds={selectedAddonIds}
          subTotal={subTotal}
          travelFee={travelFee}
          total={total}
          totalDuration={totalDuration}
        />
      </div>

      {/* Mobile sticky price footer */}
      <StickyPriceFooter
        total={total}
        totalDuration={totalDuration}
        canAdvance={canAdvance}
        isPending={isPending}
        wizardStep={numericStep}
        onAdvance={advanceStep}
      />
    </div>
  );
}

// ── PROGRESS BAR ─────────────────────────────────────────────────────────────

function ProgressBar({ labels, currentIndex }: { labels: string[]; currentIndex: number }) {
  return (
    <nav aria-label="Étapes de réservation">
      <ol className="flex items-center">
        {labels.map((label, i) => (
          <li key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                i < currentIndex
                  ? "bg-primary text-white"
                  : i === currentIndex
                  ? "bg-primary text-white ring-4 ring-primary/20"
                  : "bg-white/60 text-text-main/30 border border-primary/15"
              }`}>
                {i < currentIndex ? "✓" : i + 1}
              </div>
              <span className={`text-[11px] font-medium whitespace-nowrap ${i === currentIndex ? "text-primary" : "text-text-main/40"}`}>
                {label}
              </span>
            </div>
            {i < labels.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mb-5 rounded-full transition-colors duration-200 ${
                i < currentIndex ? "bg-primary" : "bg-primary/15"
              }`} />
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

// ── MOBILE STICKY PRICE FOOTER ────────────────────────────────────────────────
// z-30, bottom-16 → sits above BottomNav (z-40, h-14=56px, bottom-0)

function StickyPriceFooter({
  total, totalDuration, canAdvance, isPending, wizardStep, onAdvance,
}: {
  total: number;
  totalDuration: number;
  canAdvance: boolean;
  isPending: boolean;
  wizardStep: 1 | 2 | 3;
  onAdvance: () => void;
}) {
  const label = wizardStep === 3 ? (isPending ? "Envoi…" : "Confirmer") : "Continuer";

  return (
    <div className="md:hidden fixed bottom-14 left-0 right-0 z-30 px-4 py-2.5 bg-background-cream/80 backdrop-blur-sm border-t border-primary/10">
      <div className="bg-primary rounded-3xl px-5 py-2.5 flex items-center justify-between gap-4 shadow-xl">
        <div className="min-w-0">
          <p className="text-white font-bold text-xl leading-tight">{total}€</p>
          {totalDuration > 0 && (
            <p className="text-white/60 text-xs flex items-center gap-1 mt-0.5">
              <Clock size={10} aria-hidden="true" />
              {formatDuration(totalDuration)}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onAdvance}
          disabled={!canAdvance || isPending}
          className="bg-white text-primary font-semibold text-sm px-5 py-2.5 rounded-2xl disabled:opacity-40 disabled:cursor-not-allowed transition-opacity flex items-center gap-1.5 shrink-0"
        >
          {label}
          {wizardStep !== 3 && <ChevronRight size={15} aria-hidden="true" />}
        </button>
      </div>
    </div>
  );
}

// ── DESKTOP SUMMARY SIDEBAR ───────────────────────────────────────────────────

interface SummaryProps {
  selectedBase: Service | null;
  selectedAddonIds: string[];
  subTotal: number;
  travelFee: number;
  total: number;
  totalDuration: number;
}

function BookingSummary({
  selectedBase, selectedAddonIds, subTotal, travelFee, total, totalDuration,
}: SummaryProps) {
  const selectedAddons = ADDONS.filter((a) => selectedAddonIds.includes(a.id));

  return (
    <aside aria-label="Récapitulatif du devis" className="hidden lg:block w-80 sticky top-24">
      <div className="bg-white/80 backdrop-blur-sm border border-primary/15 rounded-3xl p-6 shadow-sm">
        <h2 className="font-serif text-primary text-lg font-semibold mb-5">Votre devis</h2>

        {!selectedBase ? (
          <p className="text-sm text-text-main/50 text-center py-4">Sélectionnez une prestation de base.</p>
        ) : (
          <ul className="space-y-2 mb-5 text-sm" aria-label="Prestations sélectionnées">
            <li className="flex justify-between gap-2">
              <span className="text-text-main/80 truncate">{selectedBase.name}</span>
              <span className="shrink-0 font-medium">{selectedBase.price}€</span>
            </li>
            {selectedAddons.map((a) => (
              <li key={a.id} className="flex justify-between gap-2 pl-3 border-l-2 border-primary/20">
                <span className="text-text-main/70 truncate">{a.name}</span>
                <span className="shrink-0 font-medium">+{a.price}€</span>
              </li>
            ))}
          </ul>
        )}

        <div className="border-t border-primary/10 pt-4 space-y-2 text-sm" aria-live="polite" aria-atomic="true">
          <div className="flex justify-between text-text-main/70">
            <span>Sous-total</span>
            <span>{subTotal}€</span>
          </div>
          <div className="flex justify-between text-text-main/70">
            <span>Frais de déplacement</span>
            <span>{travelFee === 0 ? "Inclus (Zone 1)" : `+${travelFee}€`}</span>
          </div>
          <div className="flex justify-between font-semibold text-base text-text-main border-t border-primary/10 pt-3 mt-1">
            <span>Total</span>
            <span className="text-primary">{total}€</span>
          </div>
          {totalDuration > 0 && (
            <div className="flex justify-between text-text-main/60 text-xs pt-1">
              <span className="flex items-center gap-1">
                <Clock size={12} aria-hidden="true" />
                Durée estimée
              </span>
              <span>{formatDuration(totalDuration)}</span>
            </div>
          )}
        </div>

        <p className="mt-4 text-xs text-text-main/50 text-center leading-relaxed">
          Réduction de 10% sur présentation d&apos;une carte étudiante valide.
        </p>
      </div>
    </aside>
  );
}
