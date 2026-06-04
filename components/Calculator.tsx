"use client";
// components/Calculator.tsx

import { useState, useMemo, useTransition } from "react";
import { z } from "zod";
import { ChevronLeft, CheckCircle, Clock } from "lucide-react";
import {
  BASE_SERVICES,
  ADDONS,
  ZONES,
  SENEFFE,
  formatDuration,
  haversineKm,
  zoneIdFromKm,
  type Service,
} from "@/lib/data";
import { createReservation } from "@/app/actions/booking";
import MapZone, { type ClientCoords } from "@/components/MapZone";
import CityAutocomplete from "@/components/CityAutocomplete";
import BookingCalendar from "@/components/BookingCalendar";

const inputClass =
  "w-full bg-white/80 border border-primary/20 rounded-xl px-4 py-3 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-2 focus:ring-primary/40 transition";

const bookingSchema = z.object({
  fullName: z.string().min(3, "Le nom doit comporter au moins 3 caractères"),
  email:    z.string().email("Adresse e-mail invalide"),
  phone:    z.string().regex(/^(\+32|0)[0-9]{8,9}$/, "Numéro de téléphone belge invalide (ex: +32470123456)"),
  address:  z.string().min(5, "Veuillez entrer une adresse complète"),
});

type FieldErrors = Partial<Record<keyof z.infer<typeof bookingSchema>, string>>;

const addonCategories = Array.from(new Set(ADDONS.map((a) => a.category)));

function computeTravel(distanceKm: number, subTotal: number): {
  nominalFee: number; travelFee: number; travelOffered: boolean; zoneLabel: string;
} {
  const d = distanceKm;
  if (d <= 8)  return { nominalFee: 0,   travelFee: 0,   travelOffered: false, zoneLabel: "Zone 1 (0-8 km) — Déplacement offert" };
  if (d <= 15) { const o = subTotal >= 80; return { nominalFee: 5, travelFee: o ? 0 : 5, travelOffered: o, zoneLabel: "Zone 2 (8-15 km) — +5€ (Offerts dès 80€ de prestation)" }; }
  if (d <= 25) return { nominalFee: 12,  travelFee: 12,  travelOffered: false, zoneLabel: "Zone 3 (15-25 km) — +12€" };
  const fee = Math.ceil(d * 2 * 0.5);
  return { nominalFee: fee, travelFee: fee, travelOffered: false, zoneLabel: `Hors Zone standard — Calcul au km (+${fee}€)` };
}

type Step = "cart" | "form" | "success";

export default function Calculator() {
  const [step, setStep]                         = useState<Step>("cart");
  const [selectedBaseId, setSelectedBaseId]     = useState<string | null>(null);
  const [selectedAddonIds, setSelectedAddonIds] = useState<string[]>([]);
  const [distanceKm, setDistanceKm]             = useState<number>(0);
  const [selectedZoneId, setSelectedZoneId]     = useState<string>(ZONES[0].id);
  const [clientCoords, setClientCoords]         = useState<ClientCoords | null>(null);
  const [selectedDateTime, setSelectedDateTime] = useState<{ date: string; time: string } | null>(null);

  // Controlled form fields for live validation
  const [fieldName, setFieldName]     = useState("");
  const [fieldEmail, setFieldEmail]   = useState("");
  const [fieldPhone, setFieldPhone]   = useState("");
  const [fieldStreet, setFieldStreet] = useState("");

  const [serverError, setServerError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [isPending, startTransition]  = useTransition();

  const selectedBase   = BASE_SERVICES.find((b) => b.id === selectedBaseId) ?? null;
  const addonsEnabled  = selectedBase?.category === "Femme";

  const { subTotal, travelFee, travelOffered, nominalFee, total, totalDuration, zoneLabel } =
    useMemo(() => {
      const basePrice     = selectedBase?.price    ?? 0;
      const baseDuration  = selectedBase?.duration ?? 0;
      const addonList     = ADDONS.filter((a) => selectedAddonIds.includes(a.id));
      const addonPrice    = addonList.reduce((s, a) => s + a.price,    0);
      const addonDur      = addonList.reduce((s, a) => s + a.duration, 0);
      const subTotal      = basePrice + addonPrice;
      const totalDuration = baseDuration + addonDur;
      const travel        = computeTravel(distanceKm, subTotal);
      return { subTotal, totalDuration, ...travel, total: subTotal + travel.travelFee };
    }, [selectedBase, selectedAddonIds, distanceKm]);

  // Step 1 "Continuer" guard: need a base service + a city
  const canContinue = selectedBaseId !== null && subTotal > 0 && clientCoords !== null;

  // Step 2 "Confirmer" guard: all fields + date/time
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

  function handleCitySelect(lat: number, lng: number, cityName: string) {
    const km = haversineKm(SENEFFE.lat, SENEFFE.lng, lat, lng);
    setDistanceKm(km);
    setSelectedZoneId(zoneIdFromKm(km));
    setClientCoords({ lat, lng, name: cityName });
  }

  function handleDateTimeSelect(date: string, time: string) {
    setSelectedDateTime({ date, time });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isFormValid || !selectedDateTime) return;
    setServerError(null);
    setFieldErrors({});

    const parsed = bookingSchema.safeParse({
      fullName: fieldName,
      email:    fieldEmail,
      phone:    fieldPhone,
      address:  fieldStreet,
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
    // Inject calendar values (not in DOM inputs)
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
      else setStep("success");
    });
  }

  function resetAll() {
    setStep("cart");
    setSelectedBaseId(null);
    setSelectedAddonIds([]);
    setDistanceKm(0);
    setSelectedZoneId(ZONES[0].id);
    setClientCoords(null);
    setSelectedDateTime(null);
    setFieldName(""); setFieldEmail(""); setFieldPhone(""); setFieldStreet("");
    setFieldErrors({});
  }

  // ── SUCCESS ──────────────────────────────────────────────────────────────
  if (step === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center gap-5">
        <CheckCircle size={52} className="text-primary" aria-hidden="true" />
        <h2 className="font-serif text-2xl md:text-3xl text-text-main font-semibold max-w-md">
          Merci pour votre réservation !
        </h2>
        <p className="text-base text-text-main/70 max-w-sm leading-relaxed">
          Julie vous confirmera le rendez-vous rapidement par e-mail ou téléphone.
        </p>
        <button onClick={resetAll} className="mt-2 text-sm text-primary underline underline-offset-4 hover:text-primary-light transition-colors">
          Faire une nouvelle réservation
        </button>
      </div>
    );
  }

  // ── STEP 2 : BOOKING FORM ────────────────────────────────────────────────
  if (step === "form") {
    return (
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        <div className="w-full lg:flex-1">
          <button
            onClick={() => setStep("cart")}
            className="flex items-center gap-1.5 text-sm text-text-main/60 hover:text-primary mb-7 transition-colors"
            aria-label="Retour au calculateur"
          >
            <ChevronLeft size={16} aria-hidden="true" />
            Modifier les prestations
          </button>

          <form onSubmit={handleSubmit} aria-label="Formulaire de réservation" noValidate>
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
                  value={fieldName} onChange={(e) => { setFieldName(e.target.value); setFieldErrors((p) => ({ ...p, fullName: undefined })); }}
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
                  value={fieldEmail} onChange={(e) => { setFieldEmail(e.target.value); setFieldErrors((p) => ({ ...p, email: undefined })); }}
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
                  value={fieldPhone} onChange={(e) => { setFieldPhone(e.target.value); setFieldErrors((p) => ({ ...p, phone: undefined })); }}
                  className={`${inputClass} ${fieldErrors.phone ? "border-red-400 focus:ring-red-300" : ""}`}
                  aria-describedby={fieldErrors.phone ? "err-phone" : undefined}
                />
                {fieldErrors.phone && <p id="err-phone" className="mt-1 text-xs text-red-500 px-1">{fieldErrors.phone}</p>}
              </div>

              <div>
                <label htmlFor="client_street" className="block text-xs font-medium text-text-main/60 mb-1.5">
                  Rue et numéro <span aria-hidden="true">*</span>
                </label>
                <input
                  id="client_street" name="client_street" type="text" required
                  autoComplete="address-line1" placeholder="Rue de l'Église 12"
                  value={fieldStreet} onChange={(e) => { setFieldStreet(e.target.value); setFieldErrors((p) => ({ ...p, address: undefined })); }}
                  className={`${inputClass} ${fieldErrors.address ? "border-red-400 focus:ring-red-300" : ""}`}
                  aria-describedby={fieldErrors.address ? "err-street" : undefined}
                />
                {fieldErrors.address && <p id="err-street" className="mt-1 text-xs text-red-500 px-1">{fieldErrors.address}</p>}
                <p className="mt-1 text-xs text-text-main/40 px-1">
                  Ville : <span className="text-primary font-medium">{clientCoords?.name ?? "—"}</span>
                </p>
              </div>
            </fieldset>

            {/* Calendar */}
            <fieldset className="mt-8">
              <legend className="font-serif text-primary text-xl font-semibold mb-5 pb-2 border-b border-primary/20 w-full">
                Date & heure souhaitées
              </legend>
              <BookingCalendar
                totalDuration={totalDuration}
                onSelectDateTime={handleDateTimeSelect}
              />
              {selectedDateTime && (
                <p className="mt-3 text-xs text-primary font-medium px-1" aria-live="polite">
                  ✓ Créneau sélectionné : {selectedDateTime.date} à {selectedDateTime.time}
                </p>
              )}
            </fieldset>

            {serverError && (
              <p role="alert" className="mt-5 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-4 py-3">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isPending || !isFormValid}
              className="mt-7 w-full bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3.5 rounded-full transition-colors duration-200"
              aria-busy={isPending}
            >
              {isPending ? "Envoi en cours…" : "Confirmer la réservation"}
            </button>
          </form>
        </div>

        <BookingSummary
          selectedBase={selectedBase}
          selectedAddonIds={selectedAddonIds}
          subTotal={subTotal}
          travelFee={travelFee}
          travelOffered={travelOffered}
          nominalFee={nominalFee}
          total={total}
          totalDuration={totalDuration}
          showCta={false}
        />
      </div>
    );
  }

  // ── STEP 1 : CART ─────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col lg:flex-row gap-8 items-start">
      <div className="w-full lg:flex-1 space-y-10">

        {/* Section 1 : Base service */}
        <section aria-labelledby="base-label">
          <h2 id="base-label" className="font-serif text-primary text-xl font-semibold mb-1 pb-2 border-b border-primary/20">
            1. Choisissez votre prestation de base
          </h2>
          <p className="text-xs text-text-main/50 mb-4">Une seule prestation de base par rendez-vous.</p>

          {(["Femme", "Homme", "Enfant"] as const).map((cat) => (
            <div key={cat} className="mb-5">
              <p className="text-xs font-semibold text-text-main/50 uppercase tracking-wider mb-2">{cat}</p>
              <ul className="space-y-2" role="list">
                {BASE_SERVICES.filter((b) => b.category === cat).map((service) => {
                  const selected = selectedBaseId === service.id;
                  return (
                    <li key={service.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBaseId(selected ? null : service.id);
                          if (!selected && service.category !== "Femme") setSelectedAddonIds([]);
                        }}
                        aria-pressed={selected}
                        className={`w-full flex items-center justify-between gap-4 p-3 rounded-xl border text-left transition-all duration-150 ${
                          selected ? "border-primary bg-primary/8 shadow-sm" : "border-transparent bg-white/60 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <span className={`w-4 h-4 rounded-full border-2 shrink-0 flex items-center justify-center transition-colors ${selected ? "border-primary bg-primary" : "border-text-main/30"}`}>
                            {selected && <span className="w-1.5 h-1.5 rounded-full bg-white block" />}
                          </span>
                          <span className="text-sm text-text-main truncate">{service.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-text-main/40 flex items-center gap-1">
                            <Clock size={11} aria-hidden="true" />
                            {formatDuration(service.duration)}
                          </span>
                          <span className="text-sm font-semibold text-primary">{service.price}€</span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {/* Section 2 : Add-ons */}
        <section aria-labelledby="addon-label">
          <h2 id="addon-label" className={`font-serif text-xl font-semibold mb-1 pb-2 border-b border-primary/20 transition-colors ${addonsEnabled ? "text-primary" : "text-text-main/30"}`}>
            2. Ajoutez vos techniques et soins
            <span className="ml-2 text-sm font-sans font-normal">(Optionnel)</span>
          </h2>
          {!addonsEnabled && (
            <p className="text-xs text-text-main/40 mt-2 mb-4 italic">Disponible uniquement avec une prestation de base Femme.</p>
          )}
          {addonCategories.map((cat) => (
            <div key={cat} className={`mb-5 transition-opacity duration-200 ${addonsEnabled ? "opacity-100" : "opacity-30 pointer-events-none select-none"}`}>
              <p className="text-xs font-semibold text-text-main/50 uppercase tracking-wider mb-2">{cat}</p>
              <ul className="space-y-2" role="list">
                {ADDONS.filter((a) => a.category === cat).map((addon) => {
                  const checked = selectedAddonIds.includes(addon.id);
                  return (
                    <li key={addon.id}>
                      <label
                        htmlFor={addon.id}
                        className={`flex items-center justify-between gap-4 p-3 rounded-xl cursor-pointer border transition-all duration-150 ${
                          checked ? "border-primary bg-primary/8 shadow-sm" : "border-transparent bg-white/60 hover:border-primary/30"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <input
                            type="checkbox" id={addon.id} checked={checked}
                            disabled={!addonsEnabled} onChange={() => toggleAddon(addon.id)}
                            className="w-4 h-4 accent-primary shrink-0"
                          />
                          <span className="text-sm text-text-main truncate">{addon.name}</span>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-text-main/40 flex items-center gap-1">
                            <Clock size={11} aria-hidden="true" />
                            {formatDuration(addon.duration)}
                          </span>
                          <span className="text-sm font-semibold text-primary">+{addon.price}€</span>
                        </div>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        {/* Section 3 : Zone */}
        <section aria-labelledby="zone-label">
          <h2 id="zone-label" className="font-serif text-primary text-xl font-semibold mb-4 pb-2 border-b border-primary/20">
            3. Votre zone de déplacement
          </h2>
          <div className="space-y-3">
            <CityAutocomplete onCitySelect={handleCitySelect} />
            <p className="text-xs px-1" aria-live="polite">
              {clientCoords
                ? <span className="font-medium text-primary">{zoneLabel}</span>
                : <span className="text-text-main/40">Saisissez votre ville pour détecter votre zone automatiquement.</span>
              }
            </p>
          </div>
          <div className="mt-5">
            <MapZone clientCoords={clientCoords} />
          </div>
        </section>
      </div>

      <BookingSummary
        selectedBase={selectedBase}
        selectedAddonIds={selectedAddonIds}
        subTotal={subTotal}
        travelFee={travelFee}
        travelOffered={travelOffered}
        nominalFee={nominalFee}
        total={total}
        totalDuration={totalDuration}
        showCta
        canContinue={canContinue}
        onContinue={() => setStep("form")}
      />
    </div>
  );
}

// ── SHARED SUMMARY SIDEBAR ───────────────────────────────────────────────────

interface SummaryProps {
  selectedBase: Service | null;
  selectedAddonIds: string[];
  subTotal: number;
  travelFee: number;
  travelOffered: boolean;
  nominalFee: number;
  total: number;
  totalDuration: number;
  showCta: boolean;
  canContinue?: boolean;
  onContinue?: () => void;
}

function BookingSummary({
  selectedBase, selectedAddonIds, subTotal, travelFee, travelOffered,
  nominalFee, total, totalDuration, showCta, canContinue, onContinue,
}: SummaryProps) {
  const selectedAddons = ADDONS.filter((a) => selectedAddonIds.includes(a.id));

  return (
    <aside aria-label="Récapitulatif du devis" className="w-full lg:w-80 lg:sticky lg:top-24">
      <div className="bg-white/80 backdrop-blur-sm border border-primary/15 rounded-2xl p-6 shadow-sm">
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
            {travelOffered ? (
              <span className="flex items-center gap-1.5">
                <span className="line-through text-text-main/40">{nominalFee}€</span>
                <span className="text-green-600 font-medium text-xs">Offerts !</span>
              </span>
            ) : (
              <span>{travelFee === 0 ? "Gratuit" : `+${travelFee}€`}</span>
            )}
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

        {showCta && (
          <>
            <button
              onClick={onContinue}
              disabled={!canContinue}
              className="mt-5 w-full bg-primary hover:bg-primary-light disabled:opacity-40 disabled:cursor-not-allowed text-white font-medium text-sm px-6 py-3 rounded-full transition-colors duration-200"
              aria-label="Continuer vers le formulaire de réservation"
            >
              Continuer
            </button>
            {!canContinue && (
              <p className="mt-2 text-xs text-text-main/40 text-center">
                {!selectedBase ? "Choisissez une prestation." : "Entrez votre ville pour continuer."}
              </p>
            )}
          </>
        )}

        <p className="mt-4 text-xs text-text-main/50 text-center leading-relaxed">
          Réduction de 10% sur présentation d&apos;une carte étudiante valide.
        </p>
        <p className="mt-3 text-xs text-text-main/40 leading-relaxed border-t border-primary/10 pt-3">
          *Les frais de déplacement au-delà de 15 km ne sont pas soumis à la gratuité sur volume.
          Au-delà de 25 km, ils sont calculés sur une base stricte de 0,50€/km (aller-retour).*
        </p>
      </div>
    </aside>
  );
}
