// tooltips.js

let tooltipEl = null;

function setupTooltips() {
    tooltipEl = document.createElement('div');
    tooltipEl.id = 'tooltip';
    tooltipEl.className = 'tooltip hidden';
    document.body.appendChild(tooltipEl);

    document.addEventListener('mouseover', (e) => {
        const span = e.target.closest('.word-tooltip');
        if (!span) return hideTooltip();
        const defJson = span.getAttribute('data-definition');
        if (!defJson) return;
        const def = JSON.parse(defJson);
        showTooltip(span, def);
    });

    document.addEventListener('mouseout', (e) => {
        const from = e.target.closest('.word-tooltip');
        const to = e.relatedTarget?.closest('.word-tooltip');
        if (!from || from === to) return;
        hideTooltip();
    });
}

function showTooltip(el, def) {
    tooltipEl.innerHTML = `
    <div class="tooltip-header">
      <strong>${def.baseForm}</strong>
      <span class="pos">${def.partOfSpeech}</span>
    </div>
    <div class="tooltip-defs">${(def.englishDefinitions || []).join(', ')}</div>
    ${
        def.grammarTip
            ? `<div class="tooltip-tip">${def.grammarTip}</div>`
            : ''
    }
  `;
    const rect = el.getBoundingClientRect();
    tooltipEl.style.top = window.scrollY + rect.bottom + 8 + 'px';
    tooltipEl.style.left = window.scrollX + rect.left + 'px';
    tooltipEl.classList.remove('hidden');
}

function hideTooltip() {
    if (!tooltipEl) return;
    tooltipEl.classList.add('hidden');
}