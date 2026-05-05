// Derived row helpers — compute once per row at the facet/sort layer so
// individual facet getters stay one-liners and don't re-do the same date
// math or string parsing on every render.

// Map a raw plan string ("Bi-Monthly Large SUV + Bi-Monthly Sedan") into the
// canonical product set (["Large SUV Bi-monthly", "Sedan Bi-monthly"]). The
// raw strings are inconsistent in word order ("Bi-Monthly Large SUV" vs
// "Sedan/SUV Quarterly"), so we tokenize and recombine into a single shape:
// "<Vehicle class> <Cadence>".
function planTypesOf(plan){
  if (!plan || plan === "No Plan") return [];
  return plan.split(/\s*\+\s*/).map(part => {
    const lower = part.toLowerCase();
    const cadence = lower.includes("bi-monthly") ? "Bi-monthly"
                  : lower.includes("monthly") ? "Monthly"
                  : lower.includes("quarterly") ? "Quarterly"
                  : "Other";
    // "Sedan/SUV" is the small/medium pricing tier (sedans + small SUVs).
    // Treat it as Sedan; "Large SUV" is its own tier.
    const vehicle = lower.includes("large suv") ? "Large SUV"
                  : lower.includes("sedan") ? "Sedan"
                  : "Other";
    return `${vehicle} ${cadence}`;
  });
}

// Distinct vehicle classes a customer subscribes to ("Sedan", "Large SUV",
// "Both", or "None"). Convenience for a coarser facet than Plan type.
function vehicleClassOf(plan){
  const types = planTypesOf(plan);
  const hasSedan = types.some(t => t.startsWith("Sedan"));
  const hasLarge = types.some(t => t.startsWith("Large SUV"));
  if (hasSedan && hasLarge) return "Both";
  if (hasSedan) return "Sedan";
  if (hasLarge) return "Large SUV";
  return "None";
}

function daysSince(dateLike){
  if (!dateLike || dateLike === "—") return null;
  return Math.floor((Date.now() - new Date(dateLike).getTime()) / 86400000);
}

// Days from today until the customer's next renewal. Negative means the
// renewal is in the past (overdue). Null when the customer has no renewal.
function daysToRenewal(c){
  if (!c.nextRenewal || c.nextRenewal === "—") return null;
  return Math.floor((new Date(c.nextRenewal).getTime() - Date.now()) / 86400000);
}

// Approximation of "days since last booking" using the most recent past
// booking date, falling back to customerSince when there's no booking
// history. Real production would use a server-computed lastBookingAt.
function daysSinceLastBooking(c){
  const pasts = c.pastBookings || [];
  if (pasts.length){
    // Booking `when` strings like "Apr 14" or "Mar 29" — anchor to the
    // current year for the prototype's relative math.
    const yr = new Date().getFullYear();
    const parsed = pasts.map(b => {
      const d = new Date(`${b.when} ${yr}`);
      return isNaN(d) ? null : d.getTime();
    }).filter(Boolean);
    if (parsed.length){
      return Math.floor((Date.now() - Math.max(...parsed)) / 86400000);
    }
  }
  return daysSince(c.customerSince);
}

window.planTypesOf = planTypesOf;
window.vehicleClassOf = vehicleClassOf;
window.daysSince = daysSince;
window.daysToRenewal = daysToRenewal;
window.daysSinceLastBooking = daysSinceLastBooking;
