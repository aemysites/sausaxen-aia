/* global WebImporter */
export default function parse(element, { document }) {
  // Header row: exactly matches example
  const headerRow = ['Columns (columns3)'];
  const cells = [headerRow];

  // Collect all visual columns (footer sections)
  function getFooterRows(el) {
    const rows = [];
    el.querySelectorAll('.container.responsivegrid').forEach(container => {
      const grid = container.querySelector('.aem-Grid');
      if (grid) {
        const cols = Array.from(grid.querySelectorAll(':scope > .footerComponent'));
        if (cols.length) rows.push(cols);
      }
    });
    return rows;
  }

  // For each row, process columns, ensuring all content is represented
  const footerRows = getFooterRows(element);
  for (const row of footerRows) {
    const colCells = row.map(col => {
      // Use the entire visible content block for each column, preserving semantics
      const body = col.querySelector('.accordion-body');
      if (body) {
        // Gather all visible children: <ul>, <p>, <a>, etc.
        const pieces = [];
        Array.from(body.children).forEach(node => {
          // Only include visible and meaningful elements
          if (node.nodeType === 1 && node.textContent.trim()) {
            pieces.push(node);
          }
        });
        // If nothing but there is text, include the body itself
        if (pieces.length === 0 && body.textContent.trim()) {
          pieces.push(body);
        }
        // If just one, return that, else return array
        if (pieces.length === 1) return pieces[0];
        if (pieces.length) return pieces;
      }
      // Fallback: use all visible children
      const fallbackKids = Array.from(col.children).filter(n => n.nodeType === 1 && n.textContent.trim());
      if (fallbackKids.length === 1) return fallbackKids[0];
      if (fallbackKids.length) return fallbackKids;
      // Fallback: just the element itself if it has text
      if (col.textContent.trim()) return col;
      return '';
    });
    cells.push(colCells);
  }

  // Logo row (Tata, Air India, Star Alliance)
  const logoRow = [];
  // Tata logo
  const tataLogo = element.querySelector('#tatasection .CustomImage');
  if (tataLogo) logoRow.push(tataLogo);
  // Air India logo (first .CustomImage under #footer_right)
  const aiLogo = element.querySelector('#footer_right .CustomImage');
  if (aiLogo) logoRow.push(aiLogo);
  // Star Alliance logo (last .CustomImage under #footer_right)
  const starAllianceLogo = element.querySelector('#footer_right .CustomImage:last-of-type');
  if (starAllianceLogo) logoRow.push(starAllianceLogo);
  if (logoRow.length) {
    cells.push(logoRow);
  }

  // Copyright row: reference element directly, preserve all formatting
  const copyrightText = element.querySelector('#copyrightTxt');
  if (copyrightText) {
    cells.push([copyrightText]);
  }

  // Create block table and replace original element
  const block = WebImporter.DOMUtils.createTable(cells, document);
  element.replaceWith(block);
}
