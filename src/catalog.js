function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/đ/gi, 'd')
    .trim()
    .toLocaleLowerCase('vi');
}

export function filterProducts(products, category, query) {
  const normalizedQuery = normalizeText(query);

  return products.filter((product) => {
    const matchesCategory = category === 'all' || product.category === category;
    const matchesQuery = !normalizedQuery
      || normalizeText(product.name).includes(normalizedQuery);

    return matchesCategory && matchesQuery;
  });
}
