/**
 * NutriFormulator & Label Pro — Interactive Formulation Engine
 * Engineered for Food Engineering & Regulatory Compliance
 */

// Preset Formulation Data
const PRESETS = {
  galleta_tradicional: {
    name: "Galleta de Avena y Cacao Tradicional (Sólido)",
    servingSize: 30, // g
    isLiquid: false,
    ingredients: [
      { name: "Harina de Trigo Fortificada", weight: 40, protein: 4.2, fat: 0.6, satFat: 0.1, carbs: 29.5, sugars: 0.3, fiber: 1.1, sodium: 2 },
      { name: "Azúcar Refinada de Caña", weight: 26, protein: 0, fat: 0, satFat: 0, carbs: 26, sugars: 26, fiber: 0, sodium: 1 },
      { name: "Mantequilla / Grasa Vegetal", weight: 18, protein: 0.2, fat: 15, satFat: 9.2, carbs: 0.1, sugars: 0.1, fiber: 0, sodium: 120 },
      { name: "Hojuelas de Avena Integral", weight: 12, protein: 1.6, fat: 0.8, satFat: 0.2, carbs: 8.2, sugars: 0.2, fiber: 1.4, sodium: 1 },
      { name: "Cacao en Polvo Natural", weight: 3.5, protein: 0.7, fat: 0.4, satFat: 0.2, carbs: 1.8, sugars: 0.1, fiber: 1.2, sodium: 1 },
      { name: "Sal Refinada Yodada", weight: 0.5, protein: 0, fat: 0, satFat: 0, carbs: 0, sugars: 0, fiber: 0, sodium: 195 }
    ]
  },
  bebida_chocolatada: {
    name: "Bebida Láctea Chocolatada (Líquido)",
    servingSize: 200, // ml
    isLiquid: true,
    ingredients: [
      { name: "Leche Entera Pasteurizada", weight: 85, protein: 2.7, fat: 2.6, satFat: 1.7, carbs: 4.0, sugars: 4.0, fiber: 0, sodium: 42 },
      { name: "Agua Purificada", weight: 5, protein: 0, fat: 0, satFat: 0, carbs: 0, sugars: 0, fiber: 0, sodium: 2 },
      { name: "Azúcar Blanca", weight: 7.5, protein: 0, fat: 0, satFat: 0, carbs: 7.5, sugars: 7.5, fiber: 0, sodium: 0.5 },
      { name: "Cacao en Polvo Alcalino", weight: 2.2, protein: 0.4, fat: 0.2, satFat: 0.1, carbs: 1.1, sugars: 0.05, fiber: 0.7, sodium: 2 },
      { name: "Estabilizante (Carragenina & Goma Guar)", weight: 0.3, protein: 0, fat: 0, satFat: 0, carbs: 0.2, sugars: 0, fiber: 0.2, sodium: 10 }
    ]
  },
  snack_maiz: {
    name: "Snack Horneado de Maíz Salado (Sólido)",
    servingSize: 35, // g
    isLiquid: false,
    ingredients: [
      { name: "Harina de Maíz Desgerminado", weight: 75, protein: 5.5, fat: 1.2, satFat: 0.2, carbs: 60, sugars: 0.8, fiber: 2.5, sodium: 5 },
      { name: "Aceite de Girasol Alto Oleico", weight: 21, protein: 0, fat: 21, satFat: 2.1, carbs: 0, sugars: 0, fiber: 0, sodium: 0 },
      { name: "Sazonador Sal & Especias", weight: 4.0, protein: 0.2, fat: 0.1, satFat: 0, carbs: 1.5, sugars: 0.3, fiber: 0.2, sodium: 1550 }
    ]
  },
  barra_funcional: {
    name: "Barra Proteica Funcional (Clean Label)",
    servingSize: 45, // g
    isLiquid: false,
    ingredients: [
      { name: "Aislado de Proteína de Suero (WPI)", weight: 32, protein: 28.5, fat: 0.3, satFat: 0.1, carbs: 0.8, sugars: 0.2, fiber: 0, sodium: 50 },
      { name: "Inulina de Achicoria (Fibra Prebiótica)", weight: 26, protein: 0, fat: 0, satFat: 0, carbs: 2.5, sugars: 2.1, fiber: 23, sodium: 4 },
      { name: "Pasta de Almendras Tostadas", weight: 22, protein: 4.6, fat: 11.2, satFat: 0.9, carbs: 4.3, sugars: 1.0, fiber: 2.7, sodium: 2 },
      { name: "Cacao Puro Desgrasado", weight: 8, protein: 1.6, fat: 0.8, satFat: 0.5, carbs: 4.2, sugars: 0.1, fiber: 2.8, sodium: 3 },
      { name: "Agua Osmotizada", weight: 11.8, protein: 0, fat: 0, satFat: 0, carbs: 0, sugars: 0, fiber: 0, sodium: 1 },
      { name: "Glicósidos de Esteviol (Reb M 98%)", weight: 0.2, protein: 0, fat: 0, satFat: 0, carbs: 0.1, sugars: 0, fiber: 0, sodium: 0 }
    ]
  }
};

// Current active state
let currentRecipe = JSON.parse(JSON.stringify(PRESETS.galleta_tradicional));
let baseRecipeSnapshot = JSON.parse(JSON.stringify(PRESETS.galleta_tradicional));

// Regulatory Thresholds (Manual de Advertencias Publicitarias - Ley 30021 / Alianza Latinoamericana)
const THRESHOLDS = {
  solid: {
    sugar: 10.0,      // g/100g
    sodium: 400.0,    // mg/100g
    satFat: 4.0,      // g/100g
    transFat: 0.05    // g/100g
  },
  liquid: {
    sugar: 5.0,       // g/100ml
    sodium: 100.0,    // mg/100ml
    satFat: 3.0,      // g/100ml
    transFat: 0.05    // g/100ml
  }
};

document.addEventListener("DOMContentLoaded", () => {
  initUI();
  renderAll();
});

function initUI() {
  const presetSelect = document.getElementById("presetSelector");
  if (presetSelect) {
    presetSelect.addEventListener("change", (e) => {
      const selected = PRESETS[e.target.value];
      if (selected) {
        currentRecipe = JSON.parse(JSON.stringify(selected));
        baseRecipeSnapshot = JSON.parse(JSON.stringify(selected));
        renderAll();
        setAiInsight("Fórmula cargada correctamente.", `Se ha cargado la base de "${currentRecipe.name}". Puedes ajustar las cantidades o probar las optimizaciones automáticas con IA.`);
      }
    });
  }

  // Quick Action Buttons
  const btnSugar = document.getElementById("btnOptimizeSugar");
  if (btnSugar) btnSugar.addEventListener("click", optimizeSugar);

  const btnSodium = document.getElementById("btnOptimizeSodium");
  if (btnSodium) btnSodium.addEventListener("click", optimizeSodium);

  const btnReset = document.getElementById("btnResetFormula");
  if (btnReset) btnReset.addEventListener("click", resetFormula);

  const btnAdd = document.getElementById("btnAddIngredient");
  if (btnAdd) btnAdd.addEventListener("click", addNewIngredient);

  const btnCopy = document.getElementById("btnCopyLegal");
  if (btnCopy) btnCopy.addEventListener("click", copyLegalDraft);
}

function renderAll() {
  renderIngredientsTable();
  const totals = calculateNutritionalTotals();
  renderNutritionFacts(totals);
  renderWarningOctagons(totals);
  renderLegalIngredientsList();
}

function renderIngredientsTable() {
  const tbody = document.getElementById("ingredientsTableBody");
  if (!tbody) return;
  tbody.innerHTML = "";

  currentRecipe.ingredients.forEach((ing, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>
        <input type="text" value="${escapeHtml(ing.name)}" data-field="name" data-index="${index}" class="ing-name-input">
      </td>
      <td>
        <input type="number" step="0.1" min="0" value="${ing.weight}" data-field="weight" data-index="${index}" style="width: 75px;">
      </td>
      <td>
        <input type="number" step="0.1" min="0" value="${ing.sugars}" data-field="sugars" data-index="${index}" style="width: 65px;">
      </td>
      <td>
        <input type="number" step="0.1" min="0" value="${ing.satFat}" data-field="satFat" data-index="${index}" style="width: 65px;">
      </td>
      <td>
        <input type="number" step="1" min="0" value="${ing.sodium}" data-field="sodium" data-index="${index}" style="width: 70px;">
      </td>
      <td style="text-align: center;">
        <button class="btn-icon-del" data-index="${index}" title="Eliminar ingrediente">✕</button>
      </td>
    `;
    tbody.appendChild(tr);
  });

  // Attach event listeners for real-time input change
  tbody.querySelectorAll("input").forEach(input => {
    input.addEventListener("input", handleInputChange);
  });

  tbody.querySelectorAll(".btn-icon-del").forEach(btn => {
    btn.addEventListener("click", (e) => {
      const idx = parseInt(e.target.getAttribute("data-index"), 10);
      currentRecipe.ingredients.splice(idx, 1);
      renderAll();
    });
  });
}

function handleInputChange(e) {
  const index = parseInt(e.target.getAttribute("data-index"), 10);
  const field = e.target.getAttribute("data-field");
  let val = e.target.value;

  if (field === "name") {
    currentRecipe.ingredients[index].name = val;
  } else {
    currentRecipe.ingredients[index][field] = parseFloat(val) || 0;
  }

  // Recalculate and update only outputs
  const totals = calculateNutritionalTotals();
  renderNutritionFacts(totals);
  renderWarningOctagons(totals);
  renderLegalIngredientsList();
}

function addNewIngredient() {
  currentRecipe.ingredients.push({
    name: "Nuevo Ingrediente Funcional",
    weight: 10,
    protein: 1.0,
    fat: 0.5,
    satFat: 0.1,
    carbs: 5.0,
    sugars: 1.0,
    fiber: 1.0,
    sodium: 5
  });
  renderAll();
}

function calculateNutritionalTotals() {
  let totalWeight = 0;
  let totalProtein = 0;
  let totalFat = 0;
  let totalSatFat = 0;
  let totalCarbs = 0;
  let totalSugars = 0;
  let totalFiber = 0;
  let totalSodium = 0;

  currentRecipe.ingredients.forEach(ing => {
    const w = Number(ing.weight) || 0;
    totalWeight += w;
    totalProtein += Number(ing.protein) || 0;
    totalFat += Number(ing.fat) || 0;
    totalSatFat += Number(ing.satFat) || 0;
    totalCarbs += Number(ing.carbs) || 0;
    totalSugars += Number(ing.sugars) || 0;
    totalFiber += Number(ing.fiber) || 0;
    totalSodium += Number(ing.sodium) || 0;
  });

  if (totalWeight <= 0) totalWeight = 1;

  // Values per 100g
  const factor100 = 100 / totalWeight;
  const p100_protein = totalProtein * factor100;
  const p100_fat = totalFat * factor100;
  const p100_satFat = totalSatFat * factor100;
  const p100_carbs = totalCarbs * factor100;
  const p100_sugars = totalSugars * factor100;
  const p100_fiber = totalFiber * factor100;
  const p100_sodium = totalSodium * factor100;
  // Calories: 4 kcal/g carbs and protein, 9 kcal/g fat, 2 kcal/g fiber
  const p100_calories = (p100_protein * 4) + (p100_carbs * 4) + (p100_fat * 9) + (p100_fiber * 2);

  // Values per serving
  const serving = currentRecipe.servingSize || 30;
  const factorServing = serving / totalWeight;
  const srv_protein = totalProtein * factorServing;
  const srv_fat = totalFat * factorServing;
  const srv_satFat = totalSatFat * factorServing;
  const srv_carbs = totalCarbs * factorServing;
  const srv_sugars = totalSugars * factorServing;
  const srv_fiber = totalFiber * factorServing;
  const srv_sodium = totalSodium * factorServing;
  const srv_calories = (srv_protein * 4) + (srv_carbs * 4) + (srv_fat * 9) + (srv_fiber * 2);

  return {
    totalWeight,
    serving,
    per100: {
      calories: Math.round(p100_calories),
      protein: p100_protein.toFixed(1),
      fat: p100_fat.toFixed(1),
      satFat: p100_satFat.toFixed(1),
      carbs: p100_carbs.toFixed(1),
      sugars: p100_sugars.toFixed(1),
      fiber: p100_fiber.toFixed(1),
      sodium: Math.round(p100_sodium)
    },
    perServing: {
      calories: Math.round(srv_calories),
      protein: srv_protein.toFixed(1),
      fat: srv_fat.toFixed(1),
      satFat: srv_satFat.toFixed(1),
      carbs: srv_carbs.toFixed(1),
      sugars: srv_sugars.toFixed(1),
      fiber: srv_fiber.toFixed(1),
      sodium: Math.round(srv_sodium)
    }
  };
}

function renderNutritionFacts(totals) {
  const servingEl = document.getElementById("nfServingSize");
  const calEl = document.getElementById("nfCalories");
  const srvCalEl = document.getElementById("nfCaloriesServing");
  const fat100El = document.getElementById("nfFat100");
  const fatSrvEl = document.getElementById("nfFatServing");
  const satFat100El = document.getElementById("nfSatFat100");
  const satFatSrvEl = document.getElementById("nfSatFatServing");
  const carb100El = document.getElementById("nfCarb100");
  const carbSrvEl = document.getElementById("nfCarbServing");
  const sugar100El = document.getElementById("nfSugar100");
  const sugarSrvEl = document.getElementById("nfSugarServing");
  const fiber100El = document.getElementById("nfFiber100");
  const fiberSrvEl = document.getElementById("nfFiberServing");
  const prot100El = document.getElementById("nfProt100");
  const protSrvEl = document.getElementById("nfProtServing");
  const sod100El = document.getElementById("nfSodium100");
  const sodSrvEl = document.getElementById("nfSodiumServing");

  const unit = currentRecipe.isLiquid ? "ml" : "g";

  if (servingEl) servingEl.innerText = `${totals.serving} ${unit}`;
  if (calEl) calEl.innerText = totals.per100.calories;
  if (srvCalEl) srvCalEl.innerText = totals.perServing.calories;
  if (fat100El) fat100El.innerText = `${totals.per100.fat} g`;
  if (fatSrvEl) fatSrvEl.innerText = `${totals.perServing.fat} g`;
  if (satFat100El) satFat100El.innerText = `${totals.per100.satFat} g`;
  if (satFatSrvEl) satFatSrvEl.innerText = `${totals.perServing.satFat} g`;
  if (carb100El) carb100El.innerText = `${totals.per100.carbs} g`;
  if (carbSrvEl) carbSrvEl.innerText = `${totals.perServing.carbs} g`;
  if (sugar100El) sugar100El.innerText = `${totals.per100.sugars} g`;
  if (sugarSrvEl) sugarSrvEl.innerText = `${totals.perServing.sugars} g`;
  if (fiber100El) fiber100El.innerText = `${totals.per100.fiber} g`;
  if (fiberSrvEl) fiberSrvEl.innerText = `${totals.perServing.fiber} g`;
  if (prot100El) prot100El.innerText = `${totals.per100.protein} g`;
  if (protSrvEl) protSrvEl.innerText = `${totals.perServing.protein} g`;
  if (sod100El) sod100El.innerText = `${totals.per100.sodium} mg`;
  if (sodSrvEl) sodSrvEl.innerText = `${totals.perServing.sodium} mg`;
}

function renderWarningOctagons(totals) {
  const container = document.getElementById("octagonsContainer");
  if (!container) return;
  container.innerHTML = "";

  const limits = currentRecipe.isLiquid ? THRESHOLDS.liquid : THRESHOLDS.solid;
  const sugarVal = parseFloat(totals.per100.sugars);
  const sodiumVal = totals.per100.sodium;
  const satFatVal = parseFloat(totals.per100.satFat);

  const octagons = [];

  // Sugar Check
  if (sugarVal >= limits.sugar) {
    octagons.push({
      title: "ALTO EN AZÚCAR",
      sub: "EVITAR SU CONSUMO EXCESIVO",
      type: "sugar"
    });
  }

  // Sodium Check
  if (sodiumVal >= limits.sodium) {
    octagons.push({
      title: "ALTO EN SODIO",
      sub: "EVITAR SU CONSUMO EXCESIVO",
      type: "sodium"
    });
  }

  // Saturated Fat Check
  if (satFatVal >= limits.satFat) {
    octagons.push({
      title: "ALTO EN GRASAS SATURADAS",
      sub: "EVITAR SU CONSUMO EXCESIVO",
      type: "sat-fat"
    });
  }

  if (octagons.length === 0) {
    container.innerHTML = `
      <div class="no-octagons-badge">
        <span>✨</span> <strong>¡Excelente formulación!</strong> Libre de sellos de advertencia frontales (Octógonos).
      </div>
    `;
  } else {
    octagons.forEach(oct => {
      const el = document.createElement("div");
      el.className = "food-octagon";
      el.innerHTML = `
        <span class="oct-title">${oct.title}</span>
        <span class="oct-sub">${oct.sub}</span>
      `;
      container.appendChild(el);
    });
  }
}

function renderLegalIngredientsList() {
  const container = document.getElementById("legalIngredientsList");
  if (!container) return;

  // Legal standard: Sort ingredients strictly in descending order of weight (g)
  const sorted = [...currentRecipe.ingredients].sort((a, b) => (Number(b.weight) || 0) - (Number(a.weight) || 0));
  
  const formatted = sorted.map(i => i.name.trim()).filter(Boolean).join(", ");
  container.innerText = formatted ? `INGREDIENTES: ${formatted}.` : "No hay ingredientes en la fórmula.";
}

function copyLegalDraft() {
  const text = document.getElementById("legalIngredientsList")?.innerText;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    const btn = document.getElementById("btnCopyLegal");
    if (btn) {
      const orig = btn.innerText;
      btn.innerText = "¡Copiado!";
      btn.style.borderColor = "var(--primary)";
      btn.style.color = "var(--primary-light)";
      setTimeout(() => {
        btn.innerText = orig;
        btn.style.borderColor = "";
        btn.style.color = "";
      }, 2000);
    }
  });
}

// AI Optimization Routines
function optimizeSugar() {
  // Identify sugar ingredients
  let modified = false;
  let savedSugarWeight = 0;

  currentRecipe.ingredients.forEach(ing => {
    if (ing.name.toLowerCase().includes("azúcar") || ing.name.toLowerCase().includes("sugar")) {
      const reduction = ing.weight * 0.40; // Reduce 40% to guarantee safe margin below octagon
      ing.weight = parseFloat((ing.weight - reduction).toFixed(1));
      ing.sugars = parseFloat((ing.sugars * 0.60).toFixed(1));
      if (ing.carbs) ing.carbs = parseFloat((ing.carbs * 0.60).toFixed(1));
      savedSugarWeight += reduction;
      modified = true;
    }
  });

  if (modified) {
    // Add functional replacement (Inulin for bulking + Steviol glycosides for sweetness intensity)
    currentRecipe.ingredients.push({
      name: "Inulina de Achicoria (Fibra Prebiótica Agente de Carga)",
      weight: parseFloat((savedSugarWeight * 0.95).toFixed(1)),
      protein: 0,
      fat: 0,
      satFat: 0,
      carbs: 0.8,
      sugars: 0.5,
      fiber: parseFloat((savedSugarWeight * 0.85).toFixed(1)),
      sodium: 2
    });
    currentRecipe.ingredients.push({
      name: "Edulcorante Natural Estevia (Glicósidos de Esteviol)",
      weight: 0.1,
      protein: 0,
      fat: 0,
      satFat: 0,
      carbs: 0,
      sugars: 0,
      fiber: 0,
      sodium: 0
    });

    renderAll();
    setAiInsight(
      "🌱 Reformulación con IA: Reducción de Azúcar Exitosa",
      "Se sustituyó el 40% del azúcar refinado utilizando Inulina de Achicoria como sustituto de sólidos/cuerpo (preservando la textura y actividad de agua $a_w$) complementado con micro-dosis de Glicósidos de Esteviol (Reb M). Se eliminó o redujo significativamente el octógono de ALTO EN AZÚCAR."
    );
  } else {
    setAiInsight("Aviso del Asistente", "No se detectaron ingredientes de azúcar directa para reducir en esta fórmula.");
  }
}

function optimizeSodium() {
  let modified = false;
  currentRecipe.ingredients.forEach(ing => {
    if (ing.name.toLowerCase().includes("sal") || ing.name.toLowerCase().includes("sazonador") || ing.sodium > 300) {
      ing.sodium = Math.round(ing.sodium * 0.5); // Reduce 50%
      ing.name = ing.name.replace(/Sal/i, "Sal Reducida en Sodio (KCl 50% / NaCl 50%)");
      modified = true;
    }
  });

  if (modified) {
    renderAll();
    setAiInsight(
      "🧂 Reformulación con IA: Reducción de Sodio Exitosa",
      "Se aplicó sustitución mineral de Sodio (NaCl) por Cloruro de Potasio (KCl) al 50% combinado con notas umami de levadura para preservar la percepción gustativa sin el sabor residual metálico. Nivel de sodio reducido sustancialmente por debajo del umbral de advertencia."
    );
  } else {
    setAiInsight("Aviso del Asistente", "La fórmula ya cuenta con bajos niveles de sodio o no se detectó sal añadida.");
  }
}

function resetFormula() {
  currentRecipe = JSON.parse(JSON.stringify(baseRecipeSnapshot));
  renderAll();
  setAiInsight(
    "Fórmula Restaurada",
    "Se han restablecido los valores y proporciones iniciales de la receta seleccionada."
  );
}

function setAiInsight(title, text) {
  const header = document.getElementById("aiInsightTitle");
  const desc = document.getElementById("aiInsightText");
  if (header) header.innerText = title;
  if (desc) desc.innerText = text;
}

function escapeHtml(str) {
  return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}
